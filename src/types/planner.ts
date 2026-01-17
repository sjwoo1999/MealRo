// 끼니 타입
export type MealSlot = 'breakfast' | 'lunch' | 'dinner';

// 끼니별 칼로리 배분 비율
export const MEAL_CALORIE_RATIOS: Record<MealSlot, number> = {
    breakfast: 0.25,  // 25%
    lunch: 0.40,      // 40%
    dinner: 0.35,     // 35%
};

// 식단 옵션 타입
export type DietType = 'balanced' | 'lowCarb' | 'highProtein';

// 영양소 비율 (탄:단:지)
export const DIET_MACROS_RATIOS: Record<DietType, {
    carbs: number;
    protein: number;
    fat: number;
}> = {
    balanced: { carbs: 0.50, protein: 0.30, fat: 0.20 },
    lowCarb: { carbs: 0.20, protein: 0.40, fat: 0.40 },
    highProtein: { carbs: 0.35, protein: 0.45, fat: 0.20 },
};

// 선택된 메뉴 타입
export interface SelectedMenu {
    id: string;
    name: string;
    mealSlot: MealSlot;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

// 추천 메뉴 타입
export interface RecommendedMeal {
    mealSlot: MealSlot;
    menu: {
        id: string;
        name: string;
        category: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    targetCalories: number;
    caloriesDiff: number;  // 목표 대비 차이
}

// 역추산 결과 타입
export interface ReversePlanResult {
    dietType: DietType;
    dietLabel: string;
    selectedMenu: SelectedMenu;
    recommendations: RecommendedMeal[];
    dailyTotal: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    targetTotal: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    accuracy: number;  // 목표 대비 정확도 (0~100%)
}

// 역추산 입력 타입
export interface ReversePlanInput {
    selectedMenu: SelectedMenu;
    userTargetCalories: number;
    userTargetProtein: number;
    userTargetCarbs: number;
    userTargetFat: number;
    excludeMenuIds?: string[];  // 제외할 메뉴 (이미 먹은 것)
    preferredCategories?: string[];  // 선호 카테고리
}
