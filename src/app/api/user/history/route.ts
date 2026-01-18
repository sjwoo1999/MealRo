import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service Role Client (for secure DB access & Signed URL generation)
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    : null;

export async function GET(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json(
            { success: false, error: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');
        const date = searchParams.get('start_date'); // Assuming single day or range logic

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Missing user_id' },
                { status: 400 }
            );
        }

        // Fetch logs for the day (user_meal_logs joined with image_analysis_logs)
        // Note: For MVP we might just query user_meal_logs directly if it has what we need.
        // But the prompt says "SELECT recent logs... generate signed URL".
        // Let's query user_meal_logs and join/fetch image path.
        // Wait, user_meal_logs has `image_analysis_id`. We need to join.

        // Simple query for now: Get user_meal_logs, then fetch image paths.
        // Or use a join if relations are set up. Migration 001 established FK.
        // Let's retry a simple approach: fetch meal logs, then manually fetch images if needed or use .select(..., image_analysis_logs(image_path))

        let query = supabaseAdmin
            .from('user_meal_logs')
            .select(`
                *,
                image_analysis_logs (
                    image_path
                )
            `)
            .eq('anonymous_user_id', userId)
            .order('created_at', { ascending: false });

        if (date) {
            query = query.eq('meal_date', date);
        } else {
            // Default to recent? Or all? Let's limit to 50 for safety if no date
            query = query.limit(50);
        }

        const { data: meals, error } = await query;

        if (error) {
            console.error('History fetch error:', error);
            throw error;
        }

        // Process Signed URLs
        const mealsWithSignedUrls = await Promise.all(meals.map(async (meal) => {
            const imagePath = meal.image_analysis_logs?.image_path;

            let signedUrl = null;
            if (imagePath) {
                const { data, error: signError } = await supabaseAdmin
                    .storage
                    .from('food-images')
                    .createSignedUrl(imagePath, 3600); // 1 hour TTL

                if (!signError && data) {
                    signedUrl = data.signedUrl;
                }
            }

            return {
                ...meal,
                image_url: signedUrl // Attach signed URL to the response object (not DB)
            };
        }));

        return NextResponse.json({
            success: true,
            data: { meals: mealsWithSignedUrls }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
