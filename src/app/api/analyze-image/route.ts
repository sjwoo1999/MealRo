import { NextRequest, NextResponse } from 'next/server';
import { analyzeFoodImageWithOpenAI } from '@/lib/openai-analyzer';
import { FoodData } from '@/types/food';
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
        const anonymousUserId = formData.get('anonymousUserId') as string | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Supported: JPEG, PNG, WebP, HEIC' },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size: 10MB' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');

        // Create simple hash for caching (first 64 chars of base64)
        const imageHash = base64.substring(0, 64);

        // Analyze image with OpenAI (GPT-4o)
        const result = await analyzeFoodImageWithOpenAI(base64, file.type);

        // Log to database if successful
        if (result.success && result.data && anonymousUserId) {
            try {
                // Normalize to array for logging
                const foods: FoodData[] = 'foods' in result.data ? (result.data as { foods: FoodData[] }).foods : [result.data as FoodData];

                // Calculate totals for logging
                const totals = foods.reduce((acc, food) => ({
                    calories: acc.calories + (food.nutrition.calories || 0),
                    protein: acc.protein + (food.nutrition.protein || 0),
                    carbs: acc.carbs + (food.nutrition.carbohydrates || 0),
                    fat: acc.fat + (food.nutrition.fat || 0),
                }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

                await supabase.from('image_analysis_logs').insert({
                    anonymous_user_id: anonymousUserId,
                    image_hash: imageHash,
                    recognized_foods: foods,
                    confidence_scores: Object.fromEntries(
                        foods.map((f: FoodData) => [f.food_name, f.confidence])
                    ),
                    estimated_nutrition: totals,
                    gemini_response_raw: null, // No longer using Gemini raw text
                    processing_time_ms: result.processing_time_ms,
                });
            } catch (logError) {
                console.error('Failed to log image analysis:', logError);
                // Don't fail the request if logging fails
            }
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Image analysis API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
