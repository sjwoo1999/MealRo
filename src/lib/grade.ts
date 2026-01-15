import { NutritionGroupAvg, Grade } from './supabase/types';

/**
 * Grade computation function
 * 
 * Grades are computed based on nutritional balance.
 * This is a deterministic MVP logic (not ML).
 * 
 * Grade Criteria (per 100g):
 * - A: High protein ratio (≥4g protein per 100kcal) AND moderate calories (≤500kcal)
 * - B: Good protein ratio (≥3g protein per 100kcal) AND reasonable calories (≤600kcal)
 * - C: Adequate protein ratio (≥2g protein per 100kcal)
 * - D: Low protein ratio or high calories
 * 
 * TODO(LEGAL_REVIEW): 등급 산정 기준은 영양학적 검토 필요. 현재는 단백질 비율 기반 추측입니다.
 */
export function computeGrade(nutrition: NutritionGroupAvg | null): Grade {
    // If no nutrition data, default to 'C' (neutral)
    if (!nutrition) {
        return 'C';
    }

    const { kcal_per_100g, protein_per_100g } = nutrition;

    // Avoid division by zero
    if (kcal_per_100g <= 0) {
        return 'C';
    }

    // Calculate protein ratio (grams of protein per 100 kcal)
    const proteinRatio = (protein_per_100g / kcal_per_100g) * 100;

    // Grade determination
    if (proteinRatio >= 4 && kcal_per_100g <= 500) {
        return 'A';
    }

    if (proteinRatio >= 3 && kcal_per_100g <= 600) {
        return 'B';
    }

    if (proteinRatio >= 2) {
        return 'C';
    }

    return 'D';
}

/**
 * Get grade metadata for display
 * Dual-coding: letter + icon + color (not color-only)
 */
export function getGradeInfo(grade: Grade): {
    letter: string;
    icon: string;
    label: string;
    description: string;
} {
    const gradeMap: Record<Grade, {
        letter: string;
        icon: string;
        label: string;
        description: string;
    }> = {
        A: {
            letter: 'A',
            icon: '🌟',
            label: '추천',
            description: '높은 단백질 비율, 적정 칼로리',
        },
        B: {
            letter: 'B',
            icon: '👍',
            label: '양호',
            description: '좋은 영양 균형',
        },
        C: {
            letter: 'C',
            icon: '➖',
            label: '보통',
            description: '평균적인 영양 배분',
        },
        D: {
            letter: 'D',
            icon: '⚠️',
            label: '주의',
            description: '낮은 단백질 비율 또는 높은 칼로리',
        },
    };

    return gradeMap[grade];
}
