import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client - Singleton
 *
 * Uses VITE_ env vars (exposed to the browser by Vite).
 * Set these in Vercel → Project Settings → Environment Variables:
 *   VITE_SUPABASE_URL       = https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY  = your-anon-public-key
 */
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
