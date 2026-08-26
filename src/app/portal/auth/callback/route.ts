import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Magic-link landing point: exchanges the one-time code for a session cookie.
 *
 * The destination is hard-coded. A `next`/`redirect` parameter here would be a
 * textbook open redirect, and a particularly bad one — this URL arrives by
 * email carrying a live sign-in code, so an attacker-controlled destination
 * could capture it.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const origin = request.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(new URL("/portal/login?error=1", origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // Expired or already-used link. Stay vague — the reason is not the
    // visitor's business and could help an attacker probe link lifetimes.
    console.warn("[portal] code exchange failed:", error.message);
    return NextResponse.redirect(new URL("/portal/login?error=1", origin));
  }

  // The middleware re-checks that this account actually has a `clients` row,
  // so a valid session alone does not grant portal access.
  return NextResponse.redirect(new URL("/portal/dashboard", origin));
}
