import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

let browserClient: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createClient() {
    if (browserClient) {
        return browserClient;
    }

    browserClient = createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        }
    );

    return browserClient;
}
