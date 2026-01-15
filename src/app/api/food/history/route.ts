import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');
        const startDate = searchParams.get('start_date'); // YYYY-MM-DD
        const endDate = searchParams.get('end_date');     // YYYY-MM-DD
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'user_id is required' },
                { status: 400 }
            );
        }

        let query = supabase
            .from('user_meal_logs')
            .select('*')
            .eq('anonymous_user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (startDate) {
            query = query.gte('meal_date', startDate);
        }
        if (endDate) {
            query = query.lte('meal_date', endDate);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Failed to fetch history:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch history' },
                { status: 500 }
            );
        }

        // Group by date
        const groupedByDate = (data || []).reduce((acc, meal) => {
            const date = meal.meal_date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(meal);
            return acc;
        }, {} as Record<string, typeof data>);

        return NextResponse.json({
            success: true,
            data: {
                meals: data || [],
                grouped: groupedByDate,
                count: data?.length || 0,
            },
        });

    } catch (error) {
        console.error('History API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
