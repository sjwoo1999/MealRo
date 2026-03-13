import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ReversePlanResult, SelectedMenu } from '@/types/planner';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    : null;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            anonymous_user_id,
            selected_menu,
            selected_plan,
        } = body as {
            anonymous_user_id: string;
            selected_menu: SelectedMenu;
            selected_plan: ReversePlanResult;
        };

        const dbClient = supabaseAdmin ?? supabase;

        if (!anonymous_user_id || !selected_menu || !selected_plan) {
            return NextResponse.json(
                { success: false, error: 'anonymous_user_id, selected_menu, selected_plan are required' },
                { status: 400 }
            );
        }

        const foods = [
            {
                food_name: selected_menu.name,
                source: 'selected_menu',
                meal_slot: selected_menu.mealSlot,
                confidence: 1,
                nutrition: {
                    calories: selected_menu.calories,
                    protein: selected_menu.protein,
                    carbohydrates: selected_menu.carbs,
                    fat: selected_menu.fat,
                },
            },
            ...selected_plan.recommendations.map((recommendation) => ({
                food_name: recommendation.menu.name,
                source: 'recommended_menu',
                meal_slot: recommendation.mealSlot,
                confidence: 1,
                nutrition: {
                    calories: recommendation.menu.calories,
                    protein: recommendation.menu.protein,
                    carbohydrates: recommendation.menu.carbs,
                    fat: recommendation.menu.fat,
                },
            })),
        ];

        console.log('[planner/save] insert start', {
            anonymous_user_id,
            meal_type: selected_menu.mealSlot,
            diet_type: selected_plan.dietType,
            recommendation_count: selected_plan.recommendations.length,
            usingServiceRole: Boolean(supabaseAdmin),
        });

        const { data, error } = await dbClient
            .from('user_meal_logs')
            .insert({
                anonymous_user_id,
                meal_type: selected_menu.mealSlot,
                foods,
                image_analysis_id: null,
                total_calories: selected_plan.dailyTotal.calories,
                total_protein: selected_plan.dailyTotal.protein,
                total_carbs: selected_plan.dailyTotal.carbs,
                total_fat: selected_plan.dailyTotal.fat,
                notes: `planner:${selected_plan.dietType}:${selected_plan.dietLabel}`,
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to save planner result:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to save planner result',
                    detail: error.message,
                    code: error.code || 'PLANNER_SAVE_FAILED',
                },
                { status: 500 }
            );
        }

        console.log('[planner/save] insert success', {
            meal_log_id: data.id,
            meal_log_created_at: data.created_at,
        });

        return NextResponse.json({
            success: true,
            data: {
                id: data.id,
                meal_type: data.meal_type,
                total_calories: data.total_calories,
            },
        });
    } catch (error) {
        console.error('Planner save API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
