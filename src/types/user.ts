// 성별 타입
export type Gender = 'male' | 'female';

// 활동량 타입
export type ActivityLevel =
    | 'sedentary'     // 비활동적 (사무직, 운동 안함)
    | 'light'         // 가벼운 활동 (주 1-2회 운동)
    | 'moderate'      // 보통 활동 (주 3-5회 운동)
    | 'active'        // 활발한 활동 (주 6-7회 운동)
    | 'very_active';  // 매우 활발 (하루 2회 운동)

// 목표 타입
export type Goal =
    | 'lose'      // 체중 감량
    | 'maintain'  // 체중 유지
    | 'gain';     // 근육 증가

// 활동량 계수 매핑
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
};

// 목표별 칼로리 조정
export const GOAL_CALORIE_ADJUSTMENTS: Record<Goal, number> = {
    lose: -500,
    maintain: 0,
    gain: 300,
};

// 활동량 옵션 (UI용)
export const ACTIVITY_LEVEL_OPTIONS: Array<{
    value: ActivityLevel;
    label: string;
    description: string;
    emoji: string;
}> = [
        {
            value: 'sedentary',
            label: '비활동적',
            description: '사무직, 운동 거의 안함',
            emoji: '🪑',
        },
        {
            value: 'light',
            label: '가벼운 활동',
            description: '주 1-2회 가벼운 운동',
            emoji: '🚶',
        },
        {
            value: 'moderate',
            label: '보통 활동',
            description: '주 3-5회 중간 강도 운동',
            emoji: '🏃',
        },
        {
            value: 'active',
            label: '활발한 활동',
            description: '주 6-7회 운동 또는 육체 노동',
            emoji: '💪',
        },
        {
            value: 'very_active',
            label: '매우 활발',
            description: '하루 2회 운동 또는 강도 높은 노동',
            emoji: '🏋️',
        },
    ];

// 목표 옵션 (UI용)
export const GOAL_OPTIONS: Array<{
    value: Goal;
    label: string;
    description: string;
    emoji: string;
    calorieAdjustment: string;
}> = [
        {
            value: 'lose',
            label: '체중 감량',
            description: '건강하게 체중 줄이기',
            emoji: '📉',
            calorieAdjustment: '-500kcal/일',
        },
        {
            value: 'maintain',
            label: '체중 유지',
            description: '현재 체중 유지하기',
            emoji: '⚖️',
            calorieAdjustment: '±0kcal/일',
        },
        {
            value: 'gain',
            label: '근육 증가',
            description: '근육량 늘리기',
            emoji: '📈',
            calorieAdjustment: '+300kcal/일',
        },
    ];

// 사용자 프로필 타입
export interface UserProfile {
    id: string;
    anonymous_user_id: string;
    gender: Gender | null;
    age: number | null;
    height: number | null;  // cm
    weight: number | null;  // kg
    activity_level: ActivityLevel | null;
    goal: Goal | null;
    bmr: number | null;
    tdee: number | null;
    target_calories: number | null;
    target_protein: number | null;
    target_carbs: number | null;
    target_fat: number | null;
    onboarding_completed: boolean;
    created_at: string;
    updated_at: string;
}

// 온보딩 폼 데이터 타입
export interface OnboardingFormData {
    gender: Gender;
    age: number;
    height: number;
    weight: number;
    activity_level: ActivityLevel;
    goal: Goal;
}

// TDEE 계산 결과 타입
export interface TdeeCalculationResult {
    bmr: number;
    tdee: number;
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
}

// 온보딩 단계 타입
export type OnboardingStep = 1 | 2 | 3 | 4 | 'complete';
