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
        // 1. Search Menu Items
        const { data: menuData, error: menuError } = await supabase
            .from('menu_items')
            .select('*')
            .ilike('name', `%${query}%`)
            .limit(20);

        if (menuError) throw menuError;
        if (!menuData || menuData.length === 0) {
            return NextResponse.json({ success: true, data: [] });
        }

        // 2. Fetch Nutrition Info (App-side Join)
        // Since FK is missing in schema, we cannot use join syntax inside select
        const foodGroups = [...new Set(menuData.map((item: any) => item.food_group))];

        const { data: nutritionData, error: nutritionError } = await supabase
            .from('nutrition_group_avg')
            .select('*')
            .in('food_group', foodGroups);

        if (nutritionError) throw nutritionError;

        // 3. Create Map for fast lookup
        const nutritionMap = new Map();
        (nutritionData || []).forEach((n: any) => nutritionMap.set(n.food_group, n));

        // 4. Merge Data
        const servingMultiplier = 3.5;

        const results = menuData.map((item: any) => {
            const nutr = nutritionMap.get(item.food_group);
            return {
                id: item.id,
                name: item.name,
                category: item.category,
                mealType: item.meal_type,
                calories: nutr ? Math.round(nutr.kcal_per_100g * servingMultiplier) : 0,
                protein: nutr ? Math.round(nutr.protein_per_100g * servingMultiplier) : 0,
                carbs: nutr ? Math.round(nutr.carbs_per_100g * servingMultiplier) : 0,
                fat: nutr ? Math.round(nutr.fat_per_100g * servingMultiplier) : 0,
            };
        });

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
