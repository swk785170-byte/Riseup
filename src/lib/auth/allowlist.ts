/**
 * Admin identity allowlist.
 *
 * WHY THIS EXISTS: every admin mutation runs through the Supabase *service
 * role* client, which bypasses Row Level Security by design. Checking only
 * "is someone signed in" would therefore grant full write access to the entire
 * CMS to *any* Supabase account — and Supabase email sign-ups are enabled by
 * default, with the anon key publicly readable in the browser bundle. So an
 * authenticated session is NOT sufficient authorisation; the account must also
 * be on this allowlist.
 *
 * Fails closed: an empty/unset ADMIN_EMAILS denies everyone rather than
 * silently falling back to "any authenticated user".
 *
 * No "server-only" here so the Edge middleware can import it too; it reads a
 * non-public env var and is never bundled into client components.
 */

function allowedEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/** True only for a non-empty allowlist containing this exact address. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = allowedEmails();
  if (allowed.length === 0) return false; // fail closed
  return allowed.includes(email.trim().toLowerCase());
}

/** Whether an allowlist has been configured at all (for setup warnings). */
export function isAdminAllowlistConfigured(): boolean {
  return allowedEmails().length > 0;
}
