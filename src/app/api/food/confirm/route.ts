import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { FoodData, hasMultipleFoods } from '@/types/food';

// Standard client for private logging (can be anon key)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Service role client for PUBLIC FEED inserts (bypass RLS)
// Only initialized if key exists (server-side only)
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    : null;

// Simple in-memory rate limiter for demo purpose
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip) || 0;

    // Simple window reset
    if (now - lastRequest > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, now);
        return true;
    }

    // Ideally we'd count requests, but for simple demo, just updating timestamp 
    // effectively throttles if requests are too fast? No, we need a counter.
    // Let's implement a proper simple counter.
    const requestLog = (global as any).requestLog || {};
    (global as any).requestLog = requestLog;

    const count = requestLog[ip] || 0;

    // Reset every minute roughly (not precise)
    if (!requestLog.timestamp || now - requestLog.timestamp > RATE_LIMIT_WINDOW) {
        requestLog.timestamp = now;
        requestLog[ip] = 1;
        return true;
    }

    if (count >= MAX_REQUESTS) return false;
    requestLog[ip] = count + 1;
    return true;
}

// Validation Helpers
function isValidFoodName(name: string): boolean {
    if (!name || name.length < 1 || name.length > 60) return false;
    // Allow Korean, English, numbers, space, basic punctuation
    // Reject URL-like patterns (http, www) or email-like (@) or angle brackets (<, >)
    if (/[<>]|http:\/\/|https:\/\/|www\.|@/.test(name)) return false;
    return true;
}

function isValidCategory(cat: string): boolean {
    if (!cat) return true; // nullable
    if (cat.length > 40) return false;
    if (/[<>]|http:\/\/|https:\/\/|www\.|@/.test(cat)) return false;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        // Rate Limiting
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { success: false, error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const {
            anonymous_user_id,
            image_hash,
            food_data,
            include_in_public_feed = false, // Client opt-in
            processing_time_ms
        } = body as {
            anonymous_user_id: string;
            image_hash: string;
            food_data: FoodData | { foods: FoodData[] };
            include_in_public_feed?: boolean;
            processing_time_ms?: number;
        };

        if (!anonymous_user_id || !image_hash || !food_data) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Normalize to array
        const foods = hasMultipleFoods(food_data) ? food_data.foods : [food_data];

        // 1. Log to Private User History (Always)
        const totals = foods.reduce(
            (acc, food) => ({
                calories: acc.calories + (food.nutrition.calories || 0),
                protein: acc.protein + (food.nutrition.protein || 0),
                carbs: acc.carbs + (food.nutrition.carbohydrates || 0),
                fat: acc.fat + (food.nutrition.fat || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        const { data, error } = await supabase
            .from('image_analysis_logs')
            .insert({
                anonymous_user_id,
                image_hash,
                recognized_foods: foods,
                confidence_scores: Object.fromEntries(
                    foods.map((f: FoodData) => [f.food_name, f.confidence])
                ),
                estimated_nutrition: totals,
                gemini_response_raw: null,
                processing_time_ms: processing_time_ms || 0,
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to confirm food:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to save log' },
                { status: 500 }
            );
        }

        // 2. Insert into Public Feed (Optional & Sanitized)
        if (include_in_public_feed && supabaseAdmin) {
            const kstDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
            const dayKey = new Date(kstDate).toISOString().split('T')[0]; // YYYY-MM-DD

            // Filter & Sanitize
            const validPublicEvents = foods
                .filter(food => isValidFoodName(food.food_name) && isValidCategory(food.tags?.[0] || ''))
                .map(food => ({
                    day_key: dayKey,
                    // Determine meal type based on hour (simple heuristic for demo)
                    meal_type: getMealType(new Date(kstDate).getHours()),
                    food_name: food.food_name.trim().substring(0, 60),
                    food_category: (food.tags?.[0] || '').trim().substring(0, 40) || null,
                    confidence: Math.min(Math.max(food.confidence, 0), 1), // Clamp 0-1
                    source: 'user_confirmed'
                }));

            if (validPublicEvents.length > 0) {
                const { error: publicError } = await supabaseAdmin
                    .from('public_food_events')
                    .insert(validPublicEvents);

                if (publicError) {
                    console.error('Failed to insert public feed:', publicError);
                    // Do not fail the main request, just log error
                }
            }
        }

        return NextResponse.json({ success: true, id: data.id });

    } catch (error) {
        console.error('Confirm API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function getMealType(hour: number): 'breakfast' | 'lunch' | 'dinner' {
    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 17) return 'lunch';
    return 'dinner';
}
