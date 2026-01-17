import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { success: false, error: { code: 'MISSING_USER_ID', message: 'User ID is required' } },
            { status: 400 }
        );
    }

    try {
        const { data, error } = await supabase
            .from('meal_plans')
            .select('*')
            .eq('anonymous_user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: { code: 'DB_ERROR', message: e.message } },
            { status: 500 }
        );
    }
}
