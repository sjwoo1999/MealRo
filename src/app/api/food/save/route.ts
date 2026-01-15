import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { FoodData, hasMultipleFoods } from '@/types/food';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AnalyzedData = FoodData | { foods: FoodData[] };

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            user_id,
            food_data,
            meal_type = 'lunch',
            image_analysis_id,
            notes
        } = body as {
            user_id: string;
            food_data: AnalyzedData;
            meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
            image_analysis_id?: string;
            notes?: string;
        };

        if (!user_id || !food_data) {
            return NextResponse.json(
                { success: false, error: 'user_id and food_data are required' },
                { status: 400 }
            );
        }

        // Calculate totals
        const foods = hasMultipleFoods(food_data) ? food_data.foods : [food_data];
        const totals = foods.reduce(
            (acc, food) => ({
                calories: acc.calories + food.nutrition.calories,
                protein: acc.protein + food.nutrition.protein,
                carbs: acc.carbs + food.nutrition.carbohydrates,
                fat: acc.fat + food.nutrition.fat,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        // Insert meal log
        const { data, error } = await supabase
            .from('user_meal_logs')
            .insert({
                anonymous_user_id: user_id,
                meal_type,
                foods: foods,
                image_analysis_id: image_analysis_id || null,
                total_calories: totals.calories,
                total_protein: totals.protein,
                total_carbs: totals.carbs,
                total_fat: totals.fat,
                notes: notes || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to save meal:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to save meal' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: data.id,
                meal_type: data.meal_type,
                meal_date: data.meal_date,
                total_calories: data.total_calories,
            },
        });

    } catch (error) {
        console.error('Save meal API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
