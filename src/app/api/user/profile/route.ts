import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateAll } from '@/lib/tdee-calculator';
import { validateOnboardingForm } from '@/lib/validators/onboarding';
import { OnboardingFormData, UserProfile } from '@/types/user';

// NOTE: Since I don't have access to the server-side cookie client setup from the prompt context, 
// I will use a standard pattern. If there's a specific '@/lib/supabase/server' utility, I would use that.
// For now, I'll rely on the client or environment variables. 
// Assuming standard Next.js + Supabase pattern.

// However, user_profiles has RLS that allows anonymous users to insert/update their own profile.
// The critical part is identification. The client sends `anonymous_user_id`.
// We should check if the client provides it in the header or body.

// Let's assume we receive `anonymousUserId` in headers or query for GET, and body for POST/PATCH.

// Re-creating Supabase Client for API Route (Server-Side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must be set to allow RLS bypass if needed, OR we rely on RLS with anon key if we can mock auth.
// But since we are using 'anonymous_user_id' text field and custom RLS "USING (true)", we can use the Anon key if RLS allows public access (which the migration script implied by "USING (true)").
// However, using Service Role is safer for backend operations if we want strict control, but "USING (true)" means anyone can edit anything if they know the ID?
// Ah, the migration said: `CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (true);`
// This effectively disables RLS for everyone. It relies on the client filtering by ID. Ideally we'd validte ID ownership but for MVP/Anon usage, this is "Client-Side Trust".

const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { success: false, error: { code: 'MISSING_USER_ID', message: 'User ID is required' } },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('anonymous_user_id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // Not found
            return NextResponse.json(
                { success: false, error: { code: 'NOT_FOUND', message: 'Profile not found' } },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, error: { code: 'DB_ERROR', message: error.message } },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { anonymous_user_id, ...formData } = body;

        if (!anonymous_user_id) {
            return NextResponse.json(
                { success: false, error: { code: 'MISSING_USER_ID', message: 'User ID is required' } },
                { status: 400 }
            );
        }

        const validation = validateOnboardingForm(formData);
        if (!validation.isValid) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid form data', details: validation.errors } },
                { status: 400 }
            );
        }

        // Calculate Stats
        const calcResult = calculateAll(formData as OnboardingFormData);

        // Prepare DB Payload
        const profileData = {
            anonymous_user_id,
            gender: formData.gender,
            age: formData.age,
            height: formData.height,
            weight: formData.weight,
            activity_level: formData.activity_level,
            goal: formData.goal,
            bmr: calcResult.bmr,
            tdee: calcResult.tdee,
            target_calories: calcResult.targetCalories,
            target_protein: calcResult.targetProtein,
            target_carbs: calcResult.targetCarbs,
            target_fat: calcResult.targetFat,
            onboarding_completed: true,
        };

        // Insert or Update (Upsert)
        const { data, error } = await supabase
            .from('user_profiles')
            .upsert(profileData, { onConflict: 'anonymous_user_id' })
            .select()
            .single();

        if (error) {
            console.error(error);
            return NextResponse.json(
                { success: false, error: { code: 'DB_ERROR', message: error.message } },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
            calculation: calcResult
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { success: false, error: { code: 'SERVER_ERROR', message: 'Internal Server Error' } },
            { status: 500 }
        );
    }
}
