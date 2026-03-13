import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildRestaurantDetail, getFallbackRestaurantById, normalizeRestaurant } from '@/lib/restaurants';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const fallback = getFallbackRestaurantById(params.id);
        const looksLikeUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            params.id
        );

        if (!looksLikeUuid && fallback) {
            return NextResponse.json({
                success: true,
                data: buildRestaurantDetail(fallback, 'fallback'),
            });
        }

        const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', params.id)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (data) {
            return NextResponse.json({
                success: true,
                data: buildRestaurantDetail(normalizeRestaurant(data), 'live'),
            });
        }

        if (!fallback) {
            return NextResponse.json(
                { success: false, error: '식당을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: buildRestaurantDetail(fallback, 'fallback'),
        });
    } catch (error: any) {
        console.error('Restaurant detail API error', error);
        return NextResponse.json(
            { success: false, error: error.message || '식당 정보를 불러오지 못했습니다.' },
            { status: 500 }
        );
    }
}
