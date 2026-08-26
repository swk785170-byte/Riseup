import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-less Supabase client for PUBLIC reads (projects, posts, testimonials,
 * client logos, site settings).
 *
 * Why this exists: the cookie-bound server client calls `cookies()`, which is a
 * dynamic API. Using it anywhere in the root layout opts the ENTIRE app out of
 * static rendering — every page then gets server-rendered on every request.
 * None of this data is per-user, so it needs no session at all.
 *
 * Anon key + RLS, exactly like the browser client: this reads only what the
 * public read policies already expose.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example).",
    );
  }
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
