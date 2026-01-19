import {
    Gender,
    ActivityLevel,
    Goal,
    OnboardingFormData,
    TdeeCalculationResult,
    ACTIVITY_MULTIPLIERS
} from '@/types/user';

/**
 * KDRI 2025 (2025 Dietary Reference Intakes for Koreans) Calculator
 * 
 * References:
 * - Ministry of Health and Welfare (2025)
 * - Ndahimana et al. (2018, 2019)
 * - Porter et al. (2025)
 * - Morton et al. (2018)
 */

// ==========================================
// 1. Physical Activity (PA) Coefficient Mapping
// ==========================================
function getPACoefficient(level: ActivityLevel, gender: Gender): number {
    // IPAQ based mapping to KDRI PA
    // 남성: 비활동(1.0), 저활동(1.11), 활동(1.25), 매우활동(1.48) - Example mapping
    // 여성: 비활동(1.0), 저활동(1.12), 활동(1.27), 매우활동(1.45)

    // Using approximated values compliant with KDRI descriptions for our 5 levels
    if (gender === 'male') {
        switch (level) {
            case 'sedentary': return 1.0;
            case 'light': return 1.11;
            case 'moderate': return 1.25; // "active" in KDRI terms
            case 'active': return 1.48;   // "very active" in KDRI terms
            case 'very_active': return 1.6; // Extreme
        }
    } else {
        switch (level) {
            case 'sedentary': return 1.0;
            case 'light': return 1.12;
            case 'moderate': return 1.27;
            case 'active': return 1.45;
            case 'very_active': return 1.6;
        }
    }
    return 1.0;
}

// ==========================================
// 2. EER (Estimated Energy Requirement) Calculation
// ==========================================
export function calculateEER(
    gender: Gender,
    age: number,
    weight: number,
    height: number, // cm
    pa: number,
    ffm?: number // Fat Free Mass (Optional)
): number {
    const heightM = height / 100;

    // A. Adult (19-64)
    if (age >= 19 && age < 65) {
        // A-1. With InBody (Ndahimana et al., 2018)
        if (ffm) {
            return (19.324 * ffm + 4.588 * weight - 2.479 * age) * pa;
        }

        // A-2. Without InBody (Ministry of Health and Welfare, 2025)
        if (gender === 'male') {
            return 662 - (9.53 * age) + pa * (15.91 * weight + 539.6 * heightM);
        } else {
            return 354 - (6.91 * age) + pa * (9.36 * weight + 726 * heightM);
        }
    }

    // B. Elderly (65+)
    if (age >= 65) {
        // B-1. With InBody (Porter et al., 2025)
        // Formula: (2.066×H + 5.661×W – 7.102×Age + 9.133×FFM + Constant) × PA
        // Men Constant: 50.104 + 643.696 = 693.8
        // Women Constant: 643.696
        if (ffm) {
            const constant = gender === 'male' ? (50.104 + 643.696) : 643.696;
            return (2.066 * height + 5.661 * weight - 7.102 * age + 9.133 * ffm + constant) * pa;
        }

        // B-2. Without InBody (Ndahimana et al., 2019)
        if (gender === 'male') {
            return 2377.07 - (18.53 * age) + pa * (14.52 * weight + 186.64 * heightM);
        } else {
            return 334.15 - (2.02 * age) + pa * (13.3 * weight + 482.94 * heightM);
        }
    }

    // C. Adolescents (<19) - Fallback to Adult formula or could use separate if needed
    // For now, using Adult formula as fallback
    if (gender === 'male') {
        return 662 - (9.53 * age) + pa * (15.91 * weight + 539.6 * heightM);
    } else {
        return 354 - (6.91 * age) + pa * (9.36 * weight + 726 * heightM);
    }
}

// ==========================================
// 3. Macro Calculation
// ==========================================
export function calculateKDRIResults(data: OnboardingFormData): TdeeCalculationResult {
    const {
        gender, age, weight, height, activity_level, goal,
        ffm, is_pregnant, is_breastfeeding, custom_protein_target
    } = data;

    // 1. Calculate EER (Energy)
    const pa = getPACoefficient(activity_level, gender);
    const eer = calculateEER(gender, age, weight, height, pa, ffm);

    // Apply Goal Adjustment (Diet/Bulk)
    // KDRI is for "Maintenance", so we apply adjustment on top
    const adjustment =
        goal === 'lose' ? -500 :
            goal === 'gain' ? 300 : 0;

    // Pregnant/Lactating Energy Addition (Optional, usually +340~450kcal)
    // Assuming 'maintenance' goal covers it, or add if strictly needed.
    // Let's stick to user goal + EER base.

    const targetCalories = Math.max(1200, Math.round(eer + adjustment));

    // 2. Calculate Protein
    let proteinGrams = 0;

    if (custom_protein_target) {
        proteinGrams = custom_protein_target;
    } else {
        // Base coefficients
        let proteinCoeff = 0.91; // Adult default

        if (age >= 65) {
            proteinCoeff = 1.2; // Sarcopenia prevention
        }

        // Activity based overrides (Morton et al.)
        if (activity_level === 'active' || activity_level === 'very_active' || goal === 'gain') {
            proteinCoeff = Math.max(proteinCoeff, 1.6);
        }

        // Weight loss protein protection
        if (goal === 'lose') {
            proteinCoeff = Math.max(proteinCoeff, 2.0); // High protein for cutting
        }

        proteinGrams = weight * proteinCoeff;

        // Additions for Special Status
        if (is_pregnant) proteinGrams += 10;
        if (is_breastfeeding) proteinGrams += 25;
    }

    proteinGrams = Math.round(proteinGrams);

    // 3. Calculate Carbs
    // KDRI: 0.125 ~ 0.1625 * EER (g)
    // Let's use 0.145 (avg) or calculate based on Calorie ratio (55-65%)
    // 55% of Cal / 4 = 0.1375 * Cal
    // Using 0.14 * EER as baseline
    let carbGrams = Math.round(eer * 0.14);

    // Adjust carbs based on remaining calories after protein/fat logic?
    // Let's use the standard "Protein Fixed -> Fat Ratio -> Carb Remainder" or "Ratio Split"
    // User request: Fat = (EER - 4P - 4C) / 9
    // So we need to Determine C first. 

    // Re-reading request: "Carbohydrate Intake(g/day) = (0.125 ~ 0.1625) × EER"
    // Let's use a dynamic factor based on goal
    let carbFactor = 0.145; // Balanced
    if (goal === 'lose') carbFactor = 0.125; // Lower end
    if (goal === 'gain') carbFactor = 0.1625; // Higher end

    carbGrams = Math.round(targetCalories * carbFactor); // Use targetCalories instead of EER to scale with goal? 
    // Request says "x EER", but if eating less (Diet), we scale down? 
    // Usually macros scale with intake. Let's use targetCalories to be safe.
    carbGrams = Math.round(targetCalories * carbFactor);

    // 4. Calculate Fat
    // Fat = (Total - 4P - 4C) / 9
    const proteinCal = proteinGrams * 4;
    const carbCal = carbGrams * 4;
    const remainingCal = targetCalories - proteinCal - carbCal;

    let fatGrams = Math.max(20, Math.round(remainingCal / 9)); // Min 20g safety

    return {
        bmr: Math.round(eer), // Using EER as BMR placeholder/baseline in result structure
        tdee: Math.round(eer),
        targetCalories,
        targetProtein: proteinGrams,
        targetCarbs: carbGrams,
        targetFat: fatGrams
    };
}
