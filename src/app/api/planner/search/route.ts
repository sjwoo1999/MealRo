import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Using Anon key for read-only search
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ success: true, data: [] });
    }

    try {
        // Search by name
        const { data, error } = await supabase
            .from('menu_items')
            .select(`
                id, name, category, meal_type,
                nutrition:nutrition_group_avg(*)
            `)
            .ilike('name', `%${query}%`)
            .limit(20);

        if (error) {
            throw error;
        }

        // Format for Client
        // Note: We need to calculate calories if not present in menu_items
        // Assuming 3.5 multiplier logic consistency
        const servingMultiplier = 3.5;

        const results = (data || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            mealType: item.meal_type, // Assuming column name match
            calories: item.nutrition ? Math.round(item.nutrition.kcal_per_100g * servingMultiplier) : 0,
            protein: item.nutrition ? Math.round(item.nutrition.protein_per_100g * servingMultiplier) : 0,
            carbs: item.nutrition ? Math.round(item.nutrition.carbs_per_100g * servingMultiplier) : 0,
            fat: item.nutrition ? Math.round(item.nutrition.fat_per_100g * servingMultiplier) : 0,
        }));

        return NextResponse.json({
            success: true,
            data: results
        });

    } catch (e: any) {
        console.error("Search API Error", e);
        return NextResponse.json(
            { success: false, error: { code: 'DB_ERROR', message: e.message } },
            { status: 500 }
        );
    }
}
