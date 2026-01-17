import {
    Gender,
    ActivityLevel,
    Goal,
    ACTIVITY_MULTIPLIERS,
    GOAL_CALORIE_ADJUSTMENTS,
    OnboardingFormData,
    TdeeCalculationResult
} from '@/types/user';

/**
 * TDEE (Total Daily Energy Expenditure) 계산기
 * 
 * 사용 공식: Mifflin-St Jeor (가장 정확하다고 알려진 공식)
 * 
 * 남성: BMR = (10 × 체중kg) + (6.25 × 키cm) - (5 × 나이) + 5
 * 여성: BMR = (10 × 체중kg) + (6.25 × 키cm) - (5 × 나이) - 161
 */

// 1. BMR 계산 (기초대사량)
export function calculateBMR(
    gender: Gender,
    weight: number,  // kg
    height: number,  // cm
    age: number
): number {
    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);

    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    return Math.round(bmr);
}

// 2. TDEE 계산 (일일 총 소비 칼로리)
export function calculateTDEE(
    bmr: number,
    activityLevel: ActivityLevel
): number {
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
    return Math.round(bmr * multiplier);
}

// 3. 목표 칼로리 계산
export function calculateTargetCalories(
    tdee: number,
    goal: Goal
): number {
    const adjustment = GOAL_CALORIE_ADJUSTMENTS[goal];
    // 최소 1200kcal 보장 (건강을 위해)
    return Math.max(1200, Math.round(tdee + adjustment));
}

// 4. 권장 영양소 계산
export function calculateMacros(
    targetCalories: number,
    weight: number,
    goal: Goal
): {
    protein: number;  // g
    carbs: number;    // g
    fat: number;      // g
} {
    // 목표에 따른 단백질 섭취량 (g/kg 체중)
    let proteinPerKg = 1.6; // 기본 (유지)

    if (goal === 'gain') {
        proteinPerKg = 2.0; // 증량 시 단백질 더 필요
    } else if (goal === 'lose') {
        proteinPerKg = 2.2; // 감량 시 근손실 방지 위해 더 필요
    }

    const protein = Math.round(weight * proteinPerKg);

    // 지방: 총 칼로리의 25%
    const fatCalories = targetCalories * 0.25;
    const fat = Math.round(fatCalories / 9); // 지방 1g = 9kcal

    // 탄수화물: 나머지 칼로리
    const proteinCalories = protein * 4; // 단백질 1g = 4kcal
    const remainingCalories = targetCalories - proteinCalories - fatCalories;
    const carbs = Math.max(0, Math.round(remainingCalories / 4)); // 탄수화물 1g = 4kcal

    return { protein, carbs, fat };
}

// 5. 전체 계산 통합 함수
export function calculateAll(
    formData: OnboardingFormData
): TdeeCalculationResult {
    const bmr = calculateBMR(
        formData.gender,
        formData.weight,
        formData.height,
        formData.age
    );

    const tdee = calculateTDEE(bmr, formData.activity_level);
    const targetCalories = calculateTargetCalories(tdee, formData.goal);

    const macros = calculateMacros(targetCalories, formData.weight, formData.goal);

    return {
        bmr,
        tdee,
        targetCalories,
        targetProtein: macros.protein,
        targetCarbs: macros.carbs,
        targetFat: macros.fat
    };
}

// 6. 결과 포맷팅 (UI 표시용)
export function formatTdeeResult(result: TdeeCalculationResult): {
    bmrText: string;
    tdeeText: string;
    targetCaloriesText: string;
    macrosText: {
        protein: string;
        carbs: string;
        fat: string;
    };
} {
    return {
        bmrText: `${result.bmr.toLocaleString()} kcal`,
        tdeeText: `${result.tdee.toLocaleString()} kcal`,
        targetCaloriesText: `${result.targetCalories.toLocaleString()} kcal`,
        macrosText: {
            protein: `${result.targetProtein}g`,
            carbs: `${result.targetCarbs}g`,
            fat: `${result.targetFat}g`
        }
    };
}
