import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DailySummaryResponse } from '@/types/food';

// export const dynamic = 'force-dynamic'; // Moved to bottom or just remove duplicate

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Daily recommended values
const DAILY_GOALS = {
    calories: 2000,
    protein: 50,
    carbs: 300,
    fat: 65,
};

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');
        const date = searchParams.get('date'); // YYYY-MM-DD

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'user_id is required' },
                { status: 400 }
            );
        }

        // Default to today if no date provided
        const targetDate = date || new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('user_meal_logs')
            .select('total_calories, total_protein, total_carbs, total_fat')
            .eq('anonymous_user_id', userId)
            .eq('meal_date', targetDate);

        if (error) {
            console.error('Failed to fetch summary:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch summary' },
                { status: 500 }
            );
        }

        // Calculate totals
        const totals = (data || []).reduce(
            (acc, meal) => ({
                calories: acc.calories + (meal.total_calories || 0),
                protein: acc.protein + (meal.total_protein || 0),
                carbs: acc.carbs + (meal.total_carbs || 0),
                fat: acc.fat + (meal.total_fat || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        // Calculate goal achievement (based on calories as primary metric)
        const goalAchievement = Math.min(
            Math.round((totals.calories / DAILY_GOALS.calories) * 100),
            100
        );

        const summary: DailySummaryResponse = {
            date: targetDate,
            total_calories: Math.round(totals.calories),
            total_protein: Math.round(totals.protein),
            total_carbs: Math.round(totals.carbs),
            total_fat: Math.round(totals.fat),
            meal_count: data?.length || 0,
            goal_achievement: goalAchievement,
        };

        return NextResponse.json({
            success: true,
            data: summary,
        });

    } catch (error) {
        console.error('Summary API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
