import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

// Prefer the primary API URL for freshest reads when available.
const supabaseAdmin = createAdminSupabaseClient({ preferPrimary: true });

export const dynamic = 'force-dynamic';

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
        const scope = searchParams.get('scope');

        let query = supabaseAdmin
            .from('user_meal_logs')
            .select('*')
            .order('created_at', { ascending: false });

        if (scope !== 'beta') {
            if (!userId) {
                return NextResponse.json(
                    { success: false, error: 'Missing user_id' },
                    { status: 400 }
                );
            }

            query = query.eq('anonymous_user_id', userId);
        }

        if (date) {
            query = query.eq('meal_date', date);
        } else {
            query = query.limit(50);
        }

        const { data: meals, error } = await query;

        if (error) {
            console.error('History fetch error:', error);
            throw error;
        }

        console.log('[user/history] fetch success', {
            scope: scope || 'user',
            user_id: userId || null,
            count: meals.length,
            latest_created_at: meals[0]?.created_at || null,
            latest_id: meals[0]?.id || null,
            recent_ids: meals.slice(0, 3).map((meal) => meal.id),
            using_primary_url: Boolean(process.env.SUPABASE_PRIMARY_URL),
        });

        const analysisIds = Array.from(
            new Set(
                meals
                    .map((meal) => meal.image_analysis_id)
                    .filter((id): id is string => Boolean(id))
            )
        );

        const imagePathMap = new Map<string, string | null>();

        if (analysisIds.length > 0) {
            const { data: analysisLogs, error: analysisError } = await supabaseAdmin
                .from('image_analysis_logs')
                .select('id, image_path')
                .in('id', analysisIds);

            if (analysisError) {
                console.error('[user/history] image analysis fetch error:', analysisError);
            } else {
                for (const log of analysisLogs) {
                    imagePathMap.set(log.id, log.image_path || null);
                }
            }
        }

        // Process Signed URLs
        const mealsWithSignedUrls = await Promise.all(meals.map(async (meal) => {
            const imagePath = meal.image_analysis_id
                ? imagePathMap.get(meal.image_analysis_id) || null
                : null;

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
                beta_name: `테스터 ${String(meal.anonymous_user_id || '').slice(-4) || '0000'}`,
                image_url: signedUrl // Attach signed URL to the response object (not DB)
            };
        }));

        return NextResponse.json(
            {
                success: true,
                data: { meals: mealsWithSignedUrls }
            },
            {
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                },
            }
        );

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
