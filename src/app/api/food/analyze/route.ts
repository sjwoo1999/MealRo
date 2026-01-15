import { NextRequest, NextResponse } from 'next/server';
import { analyzeFoodImage } from '@/lib/food-analyzer';
import { FoodAnalysisErrorCode } from '@/types/food';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for logging
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File | null;
        const anonymousUserId = formData.get('user_id') as string | null;
        const mealType = formData.get('meal_type') as string | null;

        // Validate image presence
        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: FoodAnalysisErrorCode.INVALID_FILE_TYPE,
                        message: '이미지 파일이 필요합니다',
                    }
                },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: FoodAnalysisErrorCode.INVALID_FILE_TYPE,
                        message: '지원하지 않는 파일 형식입니다. JPEG, PNG, WebP, HEIC만 가능합니다.',
                    }
                },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: FoodAnalysisErrorCode.FILE_TOO_LARGE,
                        message: '파일 크기가 너무 큽니다. 최대 10MB까지 가능합니다.',
                    }
                },
                { status: 400 }
            );
        }

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');

        // Analyze image with Gemini
        const result = await analyzeFoodImage(base64, file.type);

        // Log to database if successful
        if (result.success && anonymousUserId) {
            try {
                const foodData = 'foods' in result.data ? result.data : { foods: [result.data] };
                const foods = 'foods' in foodData ? foodData.foods : [foodData];

                await supabase.from('image_analysis_logs').insert({
                    anonymous_user_id: anonymousUserId,
                    image_hash: base64.substring(0, 64),
                    recognized_foods: foods,
                    confidence_scores: Object.fromEntries(
                        foods.map(f => [f.food_name, f.confidence])
                    ),
                    estimated_nutrition: foods.reduce((acc, f) => ({
                        calories: acc.calories + f.nutrition.calories,
                        protein: acc.protein + f.nutrition.protein,
                        carbs: acc.carbs + f.nutrition.carbohydrates,
                        fat: acc.fat + f.nutrition.fat,
                    }), { calories: 0, protein: 0, carbs: 0, fat: 0 }),
                    processing_time_ms: result.processing_time_ms,
                });
            } catch (logError) {
                console.error('Failed to log food analysis:', logError);
            }
        }

        // Return response
        if (result.success) {
            return NextResponse.json({
                ...result,
                meal_type: mealType,
            });
        } else {
            const statusCode =
                result.error.code === FoodAnalysisErrorCode.UNRECOGNIZED_FOOD ? 400 :
                    result.error.code === FoodAnalysisErrorCode.BLURRY_IMAGE ? 400 : 500;

            return NextResponse.json(result, { status: statusCode });
        }

    } catch (error) {
        console.error('Food analysis API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: FoodAnalysisErrorCode.API_ERROR,
                    message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                }
            },
            { status: 500 }
        );
    }
}
