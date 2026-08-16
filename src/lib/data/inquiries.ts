import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { DbInquiry } from "@/lib/inquiries";

/** Admin-only read. RLS restricts `select` to authenticated sessions. */
export async function getAdminInquiries(): Promise<DbInquiry[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<DbInquiry[]>();
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[admin] failed to load inquiries:", err);
    return [];
  }
}
