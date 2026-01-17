import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Using Anon key - relies on RLS "USING (true)" policy created in migration
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            anonymous_user_id,
            selected_menu_id,
            selected_menu_name,
            selected_meal_slot,
            recommendations,
            user_target_calories
        } = body;

        if (!anonymous_user_id || !selected_menu_id) {
            return NextResponse.json(
                { success: false, error: { code: 'INVALID_INPUT', message: 'Missing required fields' } },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('meal_plans')
            .insert({
                anonymous_user_id,
                selected_menu_id,
                selected_menu_name,
                selected_meal_slot,
                recommendations,
                user_target_calories
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (e: any) {
        console.error("Save API Error", e);
        return NextResponse.json(
            { success: false, error: { code: 'DB_ERROR', message: e.message } },
            { status: 500 }
        );
    }
}
