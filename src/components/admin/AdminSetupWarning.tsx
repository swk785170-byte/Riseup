import { isAdminAllowlistConfigured } from "@/lib/auth/allowlist";

/**
 * Server Component — reads the server-only ADMIN_EMAILS var. Surfaces the
 * fail-closed state so an operator isn't left guessing why a correct password
 * still won't let them in.
 */
export default function AdminSetupWarning() {
  if (isAdminAllowlistConfigured()) return null;

  return (
    <div className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
      <p className="font-semibold">Admin access is disabled</p>
      <p className="mt-1">
        No <code className="font-mono">ADMIN_EMAILS</code> allowlist is
        configured, so sign-in is blocked for everyone. Add{" "}
        <code className="font-mono">ADMIN_EMAILS=you@example.com</code> to{" "}
        <code className="font-mono">.env.local</code> and restart the server.
      </p>
    </div>
  );
}
