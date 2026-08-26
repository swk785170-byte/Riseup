import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminEmail } from "@/lib/auth/allowlist";

/** Routes that must stay reachable without a session. */
const PUBLIC_PATHS = new Set([
  "/admin/login",
  "/portal/login",
  "/portal/auth/callback",
]);

/**
 * Gate for /admin/* and /portal/* .
 *
 * Two disjoint audiences share one Supabase Auth project, so "signed in" is
 * never sufficient on its own:
 *
 *  - /admin  requires the account to be on the ADMIN_EMAILS allowlist, because
 *            admin mutations run with the service role and bypass RLS.
 *  - /portal requires the account to have a row in `clients`, AND to not be an
 *            admin address. Without the second half, a staff session would
 *            silently satisfy both roles.
 *
 * The same checks are repeated in every server action, so neither layer is a
 * single point of failure.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  const isPortal = pathname.startsWith("/portal");
  const loginUrl = isPortal ? "/portal/login" : "/admin/login";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Not configured yet → no one can authenticate; fail closed.
  if (!url || !key) {
    return NextResponse.redirect(new URL(loginUrl, request.url));
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

  if (!user) return NextResponse.redirect(new URL(loginUrl, request.url));

  const isAdmin = isAdminEmail(user.email);

  if (!isPortal) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  // Portal: staff accounts are not clients, and never get a portal session.
  if (isAdmin) {
    return NextResponse.redirect(new URL("/admin/projects", request.url));
  }

  // Must be a provisioned client. Read through the user's own session so RLS
  // decides — a signed-in account with no `clients` row sees nothing and is
  // bounced, which is what keeps a stray Supabase sign-up out of the portal.
  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!client) {
    return NextResponse.redirect(new URL("/portal/login?denied=1", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
