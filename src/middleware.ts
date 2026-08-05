import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminEmail } from "@/lib/auth/allowlist";

/**
 * Gate for every /admin/* route (except the login page).
 *
 * Being signed in is NOT sufficient: the account must also be on the
 * ADMIN_EMAILS allowlist, because admin mutations run with the Supabase
 * service role and bypass RLS. This mirrors the same check enforced inside
 * every server action, so neither layer is the single point of failure.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page is always reachable.
  if (pathname === "/admin/login") return NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Not configured yet → no one can authenticate; fail closed.
  if (!url || !key) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let response = NextResponse.next({ request });
  const secureCookies = process.env.NODE_ENV === "production";

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, {
            ...options,
            // Session cookies must never travel over plain HTTP in production,
            // and should not be attached to cross-site requests.
            sameSite: options?.sameSite ?? "lax",
            secure: options?.secure ?? secureCookies,
          }),
        );
      },
    },
  });

  // getUser() validates the JWT with the Auth server; getSession() would only
  // trust the cookie the client sent.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
