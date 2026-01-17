import { NextRequest, NextResponse } from 'next/server';
import { analyzeFoodImageWithOpenAI } from '@/lib/openai-analyzer';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client for Storage (Bypass RLS)
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    : null;

// Fallback (might fail if RLS is strict)
const supabaseAnon = createClient(
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

        // Convert file to base64 for AI
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const imageHash = base64.substring(0, 64);

        // Prepare Promise: OpenAI Analysis
        const analysisPromise = analyzeFoodImageWithOpenAI(base64, file.type);

        // Prepare Promise: Supabase Storage Upload
        // Path: today/timestamp_hash.jpg
        const today = new Date().toISOString().split('T')[0];
        const ext = file.name.split('.').pop() || 'jpg';
        const storagePath = `${today}/${Date.now()}_${imageHash.substring(0, 8)}.${ext}`;

        const uploadPromise = (async () => {
            const supabase = supabaseAdmin || supabaseAnon;
            // Use 'food-images' bucket. Ensure it exists!
            const { error } = await supabase.storage
                .from('food-images')
                .upload(storagePath, file, {
                    contentType: file.type,
                    upsert: false
                });

            if (error) {
                console.error('Storage upload failed:', error);
                return null;
            }
            return storagePath;
        })();

        // Execute in Parallel
        const [analysisResult, uploadedPath] = await Promise.all([
            analysisPromise,
            uploadPromise
        ]);

        if (analysisResult.success) {
            return NextResponse.json({
                ...analysisResult,
                image_hash: imageHash,
                storage_path: uploadedPath // Return path to client for confirmation step
            });
        }

        return NextResponse.json(analysisResult);

    } catch (error) {
        console.error('Image analysis API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
