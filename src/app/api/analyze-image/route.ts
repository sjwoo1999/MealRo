import { NextRequest, NextResponse } from 'next/server';
import { analyzeFoodImageWithOpenAI } from '@/lib/openai-analyzer';
import { FoodData } from '@/types/food';
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

        // Analyze image with OpenAI (GPT-4o)
        const result = await analyzeFoodImageWithOpenAI(base64, file.type);

        // Return result with image hash (Logging is now deferred to confirmation)
        if (result.success) {
            return NextResponse.json({
                ...result,
                image_hash: imageHash,
            });
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
