import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage, ImageAnalysisResult } from '@/lib/gemini-legacy';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for logging
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File | null;
        const anonymousUserId = formData.get('anonymousUserId') as string | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Supported: JPEG, PNG, WebP, HEIC' },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size: 10MB' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');

        // Create simple hash for caching (first 64 chars of base64)
        const imageHash = base64.substring(0, 64);

        // Analyze image with Gemini
        const result: ImageAnalysisResult = await analyzeImage(base64, file.type);

        // Log to database if successful
        if (result.success && anonymousUserId) {
            try {
                await supabase.from('image_analysis_logs').insert({
                    anonymous_user_id: anonymousUserId,
                    image_hash: imageHash,
                    recognized_foods: result.foods,
                    confidence_scores: Object.fromEntries(
                        result.foods.map(f => [f.name, f.confidence])
                    ),
                    estimated_nutrition: {
                        calories: result.totalCalories,
                        protein: result.totalProtein,
                        carbs: result.totalCarbs,
                        fat: result.totalFat,
                    },
                    gemini_response_raw: result.rawResponse ? { text: result.rawResponse } : null,
                    processing_time_ms: result.processingTimeMs,
                });
            } catch (logError) {
                console.error('Failed to log image analysis:', logError);
                // Don't fail the request if logging fails
            }
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Image analysis API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
