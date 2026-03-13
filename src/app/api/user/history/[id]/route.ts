import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

const supabaseAdmin = createAdminSupabaseClient({ preferPrimary: true });

export const dynamic = 'force-dynamic';

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!supabaseAdmin) {
        return NextResponse.json(
            { success: false, error: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const { data: meal, error } = await supabaseAdmin
            .from('user_meal_logs')
            .select(`
                *,
                image_analysis_logs (
                    image_path
                )
            `)
            .eq('id', params.id)
            .single();

        if (error || !meal) {
            return NextResponse.json(
                { success: false, error: 'Record not found' },
                { status: 404 }
            );
        }

        let image_url = null;
        const imagePath = meal.image_analysis_logs?.image_path;
        if (imagePath) {
            const { data } = await supabaseAdmin.storage
                .from('food-images')
                .createSignedUrl(imagePath, 3600);
            image_url = data?.signedUrl || null;
        }

        return NextResponse.json({
            success: true,
            data: {
                meal: {
                    ...meal,
                    beta_name: `테스터 ${String(meal.anonymous_user_id || '').slice(-4) || '0000'}`,
                    image_url,
                },
            },
        });
    } catch (error) {
        console.error('Meal detail API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
