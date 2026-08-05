import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Server Supabase client (anon key + the request's auth cookies). */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example).",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          const secureCookies = process.env.NODE_ENV === "production";
          cookiesToSet.forEach(({ name, value, options }) =>
            // Harden the session cookie: HTTPS-only in production and not sent
            // on cross-site requests (CSRF defence-in-depth alongside Next's
            // built-in Server Action origin checks).
            cookieStore.set(name, value, {
              ...options,
              sameSite: options?.sameSite ?? "lax",
              secure: options?.secure ?? secureCookies,
            }),
          );
        } catch {
          // Called from a Server Component (read-only cookies) — the
          // middleware refreshes the session cookie instead. Safe to ignore.
        }
      },
    },
  });
}
