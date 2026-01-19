import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const rangeKm = parseFloat(searchParams.get('range') || '1'); // Default 1km
    const category = searchParams.get('category'); // Optional

    if (!lat || !lng) {
        return NextResponse.json(
            { success: false, error: { code: 'INVALID_INPUT', message: 'Latitude and Longitude required' } },
            { status: 400 }
        );
    }

    try {
        // PostGIS "ST_DWithin" is efficient but requires PostGIS extension.
        // For MVP with basic lat/lng columns, use a box query approximation or server-side filter.
        // Box approximation: 1 deg lat approx 111km. 1 deg lng varies.
        // Let's use a simpler "RPC" function if we had one, but here we'll select all within a rough box then filter distance in JS (if small dataset) or use simple range query.

        // Let's define a rough box.
        // 1km ~= 0.009 degrees latitude.
        const deltaLat = rangeKm / 111;
        const deltaLng = rangeKm / (111 * Math.cos(lat * Math.PI / 180));

        let query = supabase
            .from('restaurants')
            .select('*')
            .gte('latitude', lat - deltaLat)
            .lte('latitude', lat + deltaLat)
            .gte('longitude', lng - deltaLng)
            .lte('longitude', lng + deltaLng);

        if (category) {
            query = query.eq('category', category); // Exact match for MVP
        }

        const { data, error } = await query;

        if (error) throw error;

        // Should calculate exact distance and strict filtering here if needed.
        // For now, return box results.

        return NextResponse.json({
            success: true,
            data
        });

    } catch (e: any) {
        console.error("Nearby Restaurants API Error", e);
        return NextResponse.json(
            { success: false, error: { code: 'DB_ERROR', message: e.message } },
            { status: 500 }
        );
    }
}
