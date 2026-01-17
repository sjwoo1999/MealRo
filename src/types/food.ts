// Food Analysis Types for MealRo
// Supports single and multiple food detection

// Error codes enum
export enum FoodAnalysisErrorCode {
    UNRECOGNIZED_FOOD = 'UNRECOGNIZED_FOOD',
    BLURRY_IMAGE = 'BLURRY_IMAGE',
    NO_FOOD_DETECTED = 'NO_FOOD_DETECTED',
    INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
    FILE_TOO_LARGE = 'FILE_TOO_LARGE',
    API_ERROR = 'API_ERROR',
}

// Nutrition data structure
export interface NutritionData {
    calories: number;      // kcal
    protein: number;       // g
    carbohydrates: number; // g
    fat: number;           // g
    sodium: number;        // mg
    fiber: number;         // g
}

// Single food item data
export interface FoodData {
    food_name: string;           // 한글 음식명
    food_name_en: string;        // 영문 음식명
    confidence: number;          // 0.0 - 1.0
    reasoning?: string;          // AI reasoning
    serving_size: string;        // "1인분 (300g)"
    nutrition: NutritionData;
    ingredients: string[];       // 주요 재료
    tags: string[];              // 카테고리 태그
    warnings: string[];          // 알레르기 등 주의사항

    // Multi-candidate support
    candidates?: {
        food_name: string;
        reasoning: string;
        nutrition: NutritionData;
    }[];
}

// API Request
export interface FoodAnalysisRequest {
    image: File;
    user_id?: string;
    meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

// API Response - Success (single food)
export interface FoodAnalysisSuccessSingle {
    success: true;
    data: FoodData;
    image_hash?: string;
    storage_path?: string; // Stored image path for dev dataset link
    processing_time_ms: number;
}

// API Response - Success (multiple foods)
export interface FoodAnalysisSuccessMultiple {
    success: true;
    data: {
        foods: FoodData[];
    };
    image_hash?: string;
    storage_path?: string;
    processing_time_ms: number;
}

export type FoodAnalysisSuccess = FoodAnalysisSuccessSingle | FoodAnalysisSuccessMultiple;

// API Response - Error
export interface FoodAnalysisError {
    success: false;
    error: {
        code: FoodAnalysisErrorCode;
        message: string;
    };
}

export type FoodAnalysisResponse = FoodAnalysisSuccess | FoodAnalysisError;

// Helper to check if response has multiple foods
export function hasMultipleFoods(data: FoodData | { foods: FoodData[] }): data is { foods: FoodData[] } {
    return 'foods' in data && Array.isArray(data.foods);
}

// Helper to check if confidence needs verification
export function needsVerification(confidence: number): boolean {
    return confidence < 0.8;
}

// Daily summary response
export interface DailySummaryResponse {
    date: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    meal_count: number;
    goal_achievement: number;  // percentage (0-100)
}

// Meal record for database
export interface MealRecord {
    id: string;
    anonymous_user_id: string;
    food_data: FoodData | { foods: FoodData[] };
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    image_url?: string;
    created_at: string;
}
