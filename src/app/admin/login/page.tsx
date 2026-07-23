"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase isn't configured yet. Add your keys to .env.local (see SUPABASE_SETUP.md).",
      );
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.replace("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="text-[28px]" />
        </div>
        <div className="rounded-2xl border border-border bg-surface/40 p-7">
          <h1 className="text-lg font-semibold tracking-tight">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Manage portfolio projects.</p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="admin-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="admin-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-foreground px-6 py-3 text-[12px] font-bold tracking-[0.16em] text-background uppercase transition-colors hover:bg-charcoal disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Accounts are provisioned by an administrator.
        </p>
      </div>
    </div>
  );
}
