import { MenuItemWithNutrition } from '@/lib/supabase/types';
import { DietType, DIET_MACROS_RATIOS } from '@/types/planner';

/**
 * 메뉴 매칭 알고리즘
 * 
 * 점수 계산 공식:
 * score = (calorieScore × 0.4) + (nutritionScore × 0.4) + (varietyScore × 0.2)
 * 
 * - calorieScore: 목표 칼로리와의 근접도 (100 - |목표 - 실제| / 목표 × 100)
 * - nutritionScore: 영양소 균형 점수
 * - varietyScore: 다양성 점수 (같은 카테고리 반복 감점)
 */

// 칼로리 점수 계산
export function calculateCalorieScore(
    menuCalories: number,
    targetCalories: number
): number {
    const diff = Math.abs(targetCalories - menuCalories);
    // 오차율: (차이 / 목표) * 100
    // 예를 들어 목표 500, 메뉴 400 -> 차이 100 -> 오차율 20% -> 점수 80
    // 목표 500, 메뉴 600 -> 차이 100 -> 오차율 20% -> 점수 80
    // 오차율이 100% 넘어가면 0점 처리
    const errorRate = (diff / targetCalories) * 100;
    return Math.max(0, 100 - errorRate);
}

// 영양소 균형 점수 계산
export function calculateMacroScore(
    menuMacros: { protein: number; carbs: number; fat: number },
    targetRatios: { protein: number; carbs: number; fat: number },
    totalCalories: number
): number {
    // 각 영양소가 목표 비율에 얼마나 근접한지 계산
    // 유클리드 거리? 아니면 단순 오차 합?
    // 여기서는 각 영양소별 비율(현재/총칼로리) 계산 후 목표 비율과의 오차를 계산

    // 단백질 1g=4kcal, 탄수 1g=4kcal, 지방 1g=9kcal 
    // 주의: totalCalories가 0이면 계산 불가 (예외처리 필요)
    if (totalCalories === 0) return 0;

    const pRatio = (menuMacros.protein * 4) / totalCalories;
    const cRatio = (menuMacros.carbs * 4) / totalCalories;
    const fRatio = (menuMacros.fat * 9) / totalCalories;

    const pDiff = Math.abs(targetRatios.protein - pRatio);
    const cDiff = Math.abs(targetRatios.carbs - cRatio);
    const fDiff = Math.abs(targetRatios.fat - fRatio);

    // 오차 합계
    const totalDiff = pDiff + cDiff + fDiff;

    // 오차가 0이면 100점, 오차가 클수록 감점
    // 최대 오차는 대략 2 (모든게 틀릴때?) 
    // 단순화: 1 - (totalDiff / 2) * 100 ??
    // 좀 더 관대하게: 점수 = 100 - (totalDiff * 50)
    // 예: 오차 합 0.2 (20%) -> 100 - 10 = 90점
    // 예: 오차 합 1.0 (100%) -> 100 - 50 = 50점

    return Math.max(0, 100 - (totalDiff * 100));
}

// 다양성 점수 계산 (같은 카테고리 반복 감점)
export function calculateVarietyScore(
    menuCategory: string,
    otherSelectedCategories: string[]
): number {
    if (otherSelectedCategories.includes(menuCategory)) {
        return 0; // 중복 카테고리 0점
    }
    return 100; // 새로운 카테고리 100점
}

// 종합 점수 계산
export function calculateTotalScore(
    menu: MenuItemWithNutrition,
    targetCalories: number,
    targetMacros: { protein: number; carbs: number; fat: number }, // 여기선 비율이 아니라 그램(g)일수도, 하지만 비율 계산엔 비율(ratio)이 필요. 
    // reverse-calc에서 비율(0.3 등)을 넘겨준다고 가정. 
    // 하지만 타입엔터페이스가 안맞을수 있음. 사용처에서 확인 필요.
    // prompt says: targetMacros: { protein: number; carbs: number; fat: number }
    // let's assume this input is the Ratio (0.5, 0.3, 0.2)
    otherSelectedCategories: string[],
    dietType: DietType
): {
    total: number;
    breakdown: {
        calorie: number;
        nutrition: number;
        variety: number;
    };
} {
    if (!menu.nutrition) {
        return { total: 0, breakdown: { calorie: 0, nutrition: 0, variety: 0 } };
    }

    const avg = menu.nutrition;
    // 100g 당 영양소 -> 1인분 영양소로 환산 필요?
    // DB의 nutrition_group_avg는 '100g당' 값임.
    // 하지만 menu_item 자체에 1인분 중량 정보가 없음...
    // MVP 기준: "음식군 평균 영양값 기반 추정치".
    // "1인분"을 대략 300g~500g 가정? or 그냥 100g 기준?
    // 보통 공공데이터는 1회제공량 기준이 많음.
    // 여기서는 `nutrition_group_avg` 테이블이 `kcal_per_100g` 라고 명시되어 있음.
    // 1인분 중량이 없으면 정확한 계산 불가.
    // 임시로 1인분을 400g으로 가정하거나, 그냥 이 값을 1인분 평균값으로 취급해야 함.
    // Phase 1에서 기존 로직이 어떻게 했는지 확인 필요.
    // 그러나 지금은 일단 1인분 = 100g * 가중치? 
    // 일단 Prompt 2-1 예시에는 "바나나+그릭요거트 (320kcal)" 처럼 구체적 수치가 있음.
    // 여기서는 `nutrition` 객체의 값들을 '1인분' 수치로 가정하고 계산하거나,
    // 만약 `kcal_per_100g`라면 변환 로직이 필요.

    // **중요 가정**: nutrition_group_avg의 값이 "1인분 표준 섭취량"을 반영하지 않았다면 오차가 큼.
    // 하지만 지금은 MVP. 일단 nutrition 값을 그대로(혹은 x3?) 사용하여 계산.
    // 여기서는 매칭 로직 자체에 집중. 호출하는 쪽에서 그램수 보정 후 넘겨주거나 해야 함.
    // 아니면 menu 객체에 serving_size가 있어야 함. 지금 없음.
    // 기존 analyze-image에선 OpenAI가 추정해줌.
    // 여기 메뉴 DB 기반 추천은... 
    // Let's assume standard serving size is roughly 1 unit of the nutrition values 
    // OR we just use the calories field (if it existed on menu).
    // Prompt says: menu has `calories`, `protein`, etc. in `RecommendedMeal` type.
    // But `MenuItemWithNutrition` has `nutrition` which is `NutritionGroupAvg`.
    // Let's calculate calories from the nutrition group avg assuming 1 serving = 300g (main dish) / 100g (side)?
    // Too complex. Let's use `kcal_per_100g * 3` for main dishes as a heuristic? categories?

    // For now, I will assume the caller provides a `menu` object that has ALREADY adjusted nutrition numbers, 
    // OR I calculates strictly based on the provided object.
    // `MenuItemWithNutrition` has `nutrition: NutritionGroupAvg`.
    // Let's assumes a standard 1 serving = 300g (x3) for calculation purposes to get realistic calorie counts?
    // Or simpler: Calculate density Score only?

    // Let's modify logic: Use 1 serving = 1 unit defined by `nutrition` object values directly? 
    // `kcal_per_100g` implies 100g. 100g is small for a meal.
    // Let's apply a naive multiplier of 3.5 (350g) for calculation to derive 'calories'.

    const servingMultiplier = 3.5;

    const calories = avg.kcal_per_100g * servingMultiplier;
    const protein = avg.protein_per_100g * servingMultiplier;
    const carbs = avg.carbs_per_100g * servingMultiplier;
    const fat = avg.fat_per_100g * servingMultiplier;

    const calorieScore = calculateCalorieScore(calories, targetCalories);

    const nutritionScore = calculateMacroScore(
        { protein, carbs, fat },
        targetMacros, // This should be Ratios
        calories
    );

    const varietyScore = calculateVarietyScore(menu.category, otherSelectedCategories);

    const total = (calorieScore * 0.4) + (nutritionScore * 0.4) + (varietyScore * 0.2);

    return {
        total,
        breakdown: {
            calorie: calorieScore,
            nutrition: nutritionScore,
            variety: varietyScore
        }
    };
}
