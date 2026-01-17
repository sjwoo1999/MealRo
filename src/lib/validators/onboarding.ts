import { ActivityLevel, Gender, Goal, OnboardingFormData } from '@/types/user';

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// Step 1: 기본 정보 검증
export function validateBasicInfo(data: {
    gender?: Gender;
    age?: number;
}): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.gender) {
        errors.gender = '성별을 선택해주세요';
    }

    if (!data.age) {
        errors.age = '나이를 입력해주세요';
    } else if (data.age < 15 || data.age > 100) {
        errors.age = '나이는 15세에서 100세 사이여야 합니다';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Step 2: 신체 정보 검증
export function validateBodyInfo(data: {
    height?: number;
    weight?: number;
}): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.height) {
        errors.height = '키를 입력해주세요';
    } else if (data.height < 100 || data.height > 250) {
        errors.height = '키는 100cm에서 250cm 사이여야 합니다';
    }

    if (!data.weight) {
        errors.weight = '몸무게를 입력해주세요';
    } else if (data.weight < 30 || data.weight > 300) {
        errors.weight = '몸무게는 30kg에서 300kg 사이여야 합니다';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Step 3: 활동량 검증
export function validateActivityLevel(data: {
    activityLevel?: ActivityLevel;
}): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.activityLevel) {
        errors.activityLevel = '평소 활동량을 선택해주세요';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Step 4: 목표 검증
export function validateGoal(data: {
    goal?: Goal;
}): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.goal) {
        errors.goal = '목표를 선택해주세요';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// 전체 폼 검증
export function validateOnboardingForm(
    data: Partial<OnboardingFormData>
): ValidationResult {
    const basic = validateBasicInfo({ gender: data.gender, age: data.age });
    const body = validateBodyInfo({ height: data.height, weight: data.weight });
    const activity = validateActivityLevel({ activityLevel: data.activity_level });
    const goal = validateGoal({ goal: data.goal });

    const errors = {
        ...basic.errors,
        ...body.errors,
        ...activity.errors,
        ...goal.errors
    };

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
