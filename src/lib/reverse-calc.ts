import {
    DietType,
    MealSlot,
    MEAL_CALORIE_RATIOS,
    ReversePlanInput,
    ReversePlanResult,
    RecommendedMeal,
    DIET_MACROS_RATIOS,
    SelectedMenu
} from '@/types/planner';
import { createClient } from '@/lib/supabase/client'; // Note: Client usage in server context needs care, but this is a lib util.
import { MenuItemWithNutrition } from '@/lib/supabase/types';
import { calculateTotalScore } from './menu-matcher';

// Server-side safe client creation often preferred if this runs in API route
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// 1. 남은 칼로리 계산
export function calculateRemainingCalories(
    targetCalories: number,
    selectedMenuCalories: number
): number {
    return Math.max(0, targetCalories - selectedMenuCalories);
}

// 2. 끼니별 칼로리 배분
export function distributeCalories(
    remainingCalories: number,
    selectedMealSlot: MealSlot
): Record<MealSlot, number> {
    // 선택된 끼니를 제외한 나머지 끼니들의 비율 합을 구함
    const otherSlots = (Object.keys(MEAL_CALORIE_RATIOS) as MealSlot[])
        .filter(slot => slot !== selectedMealSlot);

    const otherSlotsRatioSum = otherSlots.reduce((sum, slot) => sum + MEAL_CALORIE_RATIOS[slot], 0);

    const result = { ...MEAL_CALORIE_RATIOS }; // Init

    // 선택된 슬롯은 0 (이미 먹음/선택함)
    result[selectedMealSlot] = 0;

    // 나머지 슬롯에 비례 배분
    otherSlots.forEach(slot => {
        // 원래비율 / 나머지합 * 남은칼로리
        result[slot] = (MEAL_CALORIE_RATIOS[slot] / otherSlotsRatioSum) * remainingCalories;
    });

    return result;
}

// 3. 특정 칼로리 범위에 맞는 메뉴 검색
export async function findMenusByCalorieRange(
    targetCalories: number,
    mealType: MealSlot, // 아침/점심/저녁에 따라 메뉴 필터링 가능 (예: 아침엔 가벼운거)
    tolerance: number = 150,  // ±150kcal (좀 더 넓게 잡음)
    excludeIds: string[] = [],
    categories: string[] = []
): Promise<MenuItemWithNutrition[]> {
    const minCal = Math.max(0, targetCalories - tolerance);
    const maxCal = targetCalories + tolerance;

    // Supabase Client (Using env vars for lib usage)
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // App-side join: FK가 DB에 없으므로 search route와 동일한 패턴 사용
    // 1. menu_items 조회
    const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .limit(100);

    if (menuError || !menuData) {
        console.error("Error fetching menus", menuError);
        return [];
    }

    // 2. food_group 목록 추출 → nutrition_group_avg 조회
    const foodGroups = Array.from(new Set(menuData.map((item: any) => item.food_group)));

    const { data: nutritionData, error: nutritionError } = await supabase
        .from('nutrition_group_avg')
        .select('*')
        .in('food_group', foodGroups);

    if (nutritionError) {
        console.error("Error fetching nutrition", nutritionError);
        return [];
    }

    // 3. Map으로 merge
    const nutritionMap = new Map();
    (nutritionData || []).forEach((n: any) => nutritionMap.set(n.food_group, n));

    const mergedData = menuData.map((item: any) => ({
        ...item,
        nutrition: nutritionMap.get(item.food_group) || null,
    }));

    let candidates = (mergedData as unknown as MenuItemWithNutrition[]).filter(item => item.nutrition);

    // Filter by Calorie Range (Assuming 1 serving = 3.5 * 100g unit as per matcher logic)
    // This heuristics consistency is critical.
    const servingMultiplier = 3.5;

    candidates = candidates.filter(item => {
        if (!item.nutrition) return false;
        if (excludeIds.includes(item.id)) return false;

        const cal = item.nutrition.kcal_per_100g * servingMultiplier;
        return cal >= minCal && cal <= maxCal;
    });

    return candidates;
}

// 5. 최적 메뉴 선택 (점수 기반)
export function selectBestMenu(
    candidates: MenuItemWithNutrition[],
    targetCalories: number,
    targetMacros: { protein: number; carbs: number; fat: number },
    dietType: DietType
): MenuItemWithNutrition | null {
    if (candidates.length === 0) return null;

    let bestMenu: MenuItemWithNutrition | null = null;
    let maxScore = -1;

    candidates.forEach(menu => {
        const scoreResult = calculateTotalScore(
            menu,
            targetCalories,
            targetMacros, // Ratios
            [], // other categories (not used in simplistic selection logic here, needs context)
            dietType
        );

        if (scoreResult.total > maxScore) {
            maxScore = scoreResult.total;
            bestMenu = menu;
        }
    });

    return bestMenu;
}

// 6. 전체 역추산 실행
export async function generateReversePlan(
    input: ReversePlanInput
): Promise<ReversePlanResult[]> {
    const { selectedMenu, userTargetCalories } = input;

    const remainingCal = calculateRemainingCalories(userTargetCalories, selectedMenu.calories);
    const distribution = distributeCalories(remainingCal, selectedMenu.mealSlot);

    const dietTypes: DietType[] = ['balanced', 'lowCarb', 'highProtein'];
    const results: ReversePlanResult[] = [];

    const servingMultiplier = 3.5; // Consistency

    for (const diet of dietTypes) {
        const targetRatios = DIET_MACROS_RATIOS[diet];
        const recommendations: RecommendedMeal[] = [];

        // Process other slots
        const slotsToFill = (Object.keys(distribution) as MealSlot[]).filter(s => s !== selectedMenu.mealSlot);

        for (const slot of slotsToFill) {
            const targetCal = distribution[slot];
            if (targetCal <= 0) continue;

            // Find candidates
            const candidates = await findMenusByCalorieRange(targetCal, slot);

            // Select best
            const best = selectBestMenu(candidates, targetCal, targetRatios, diet);

            if (best && best.nutrition) {
                const cal = best.nutrition.kcal_per_100g * servingMultiplier;
                const prot = best.nutrition.protein_per_100g * servingMultiplier;
                const carbs = best.nutrition.carbs_per_100g * servingMultiplier;
                const fat = best.nutrition.fat_per_100g * servingMultiplier;

                recommendations.push({
                    mealSlot: slot,
                    menu: {
                        id: best.id,
                        name: best.name,
                        category: best.category,
                        calories: Math.round(cal),
                        protein: Math.round(prot),
                        carbs: Math.round(carbs),
                        fat: Math.round(fat)
                    },
                    targetCalories: Math.round(targetCal),
                    caloriesDiff: Math.round(cal - targetCal)
                });
            }
        }

        // Aggregate Totals
        let totalCal = selectedMenu.calories;
        let totalProt = selectedMenu.protein;
        let totalCarbs = selectedMenu.carbs;
        let totalFat = selectedMenu.fat;

        recommendations.forEach(r => {
            totalCal += r.menu.calories;
            totalProt += r.menu.protein;
            totalCarbs += r.menu.carbs;
            totalFat += r.menu.fat;
        });

        // Calculate Accuracy
        const accuracy = Math.max(0, 100 - (Math.abs(totalCal - userTargetCalories) / userTargetCalories * 100));

        results.push({
            dietType: diet,
            dietLabel: diet === 'balanced' ? '균형 식단' : diet === 'lowCarb' ? '저탄수화물' : '고단백',
            selectedMenu: selectedMenu,
            recommendations: recommendations.sort((a, b) => {
                const order = { breakfast: 1, lunch: 2, dinner: 3 };
                return order[a.mealSlot] - order[b.mealSlot];
            }),
            dailyTotal: {
                calories: Math.round(totalCal),
                protein: Math.round(totalProt),
                carbs: Math.round(totalCarbs),
                fat: Math.round(totalFat)
            },
            targetTotal: {
                calories: userTargetCalories,
                protein: input.userTargetProtein,
                carbs: input.userTargetCarbs,
                fat: input.userTargetFat
            },
            accuracy: Math.round(accuracy)
        });
    }

    return results;
}
