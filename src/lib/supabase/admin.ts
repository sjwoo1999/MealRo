import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getAdminSupabaseUrl(preferPrimary: boolean) {
    if (preferPrimary && process.env.SUPABASE_PRIMARY_URL) {
        return process.env.SUPABASE_PRIMARY_URL;
    }

    return process.env.NEXT_PUBLIC_SUPABASE_URL!;
}

export function createAdminSupabaseClient(options?: { preferPrimary?: boolean }): SupabaseClient | null {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return null;
    }

    return createClient(
        getAdminSupabaseUrl(Boolean(options?.preferPrimary)),
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
}

