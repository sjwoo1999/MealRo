import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { FoodData, hasMultipleFoods } from '@/types/food';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            anonymous_user_id,
            image_hash,
            food_data,
            is_public = false,
            processing_time_ms
        } = body as {
            anonymous_user_id: string;
            image_hash: string;
            food_data: FoodData | { foods: FoodData[] };
            is_public?: boolean;
            processing_time_ms?: number;
        };

        if (!anonymous_user_id || !image_hash || !food_data) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Normalize to array
        const foods = hasMultipleFoods(food_data) ? food_data.foods : [food_data];

        // Calculate totals
        const totals = foods.reduce(
            (acc, food) => ({
                calories: acc.calories + (food.nutrition.calories || 0),
                protein: acc.protein + (food.nutrition.protein || 0),
                carbs: acc.carbs + (food.nutrition.carbohydrates || 0),
                fat: acc.fat + (food.nutrition.fat || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        // Perform the deferred logging
        const { data, error } = await supabase
            .from('image_analysis_logs')
            .insert({
                anonymous_user_id,
                image_hash,
                recognized_foods: foods,
                confidence_scores: Object.fromEntries(
                    foods.map((f: FoodData) => [f.food_name, f.confidence])
                ),
                estimated_nutrition: totals,
                gemini_response_raw: null,
                // We reuse this existing table but add the new flag if possible, 
                // otherwise we assume it's just a log.
                // Note: 'is_public' might not exist in the schema yet, 
                // but we will send it in the metadata or just ignore if table doesn't support.
                // For this demo, we assume the table follows the migration.
                processing_time_ms: processing_time_ms || 0,
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to confirm food:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to save log' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, id: data.id });

    } catch (error) {
        console.error('Confirm API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
