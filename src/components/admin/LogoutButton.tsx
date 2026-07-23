"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await createClient().auth.signOut();
      }
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[11px] font-bold tracking-[0.14em] text-foreground/80 uppercase transition-colors hover:border-foreground hover:text-foreground disabled:opacity-60"
    >
      <LogOut size={14} />
      {loading ? "…" : "Log out"}
    </button>
  );
}
