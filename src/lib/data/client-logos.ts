import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  SEED_CLIENT_LOGOS,
  mapRowToClientLogo,
  type ClientLogo,
  type DbClientLogo,
} from "@/lib/client-logos";

async function fetchRows(): Promise<DbClientLogo[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("client_logos")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<DbClientLogo[]>();
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error(
      "[client-logos] Supabase fetch failed — using seed data:",
      err,
    );
    return null;
  }
}

/** Client logos for the homepage marquee, sorted by `sort_order`. */
export async function getClientLogos(): Promise<ClientLogo[]> {
  const rows = await fetchRows();
  if (!rows) return SEED_CLIENT_LOGOS;
  // An empty table would blank the marquee — keep the seed set until the
  // admin adds the first logo.
  if (rows.length === 0) return SEED_CLIENT_LOGOS;
  return rows.map(mapRowToClientLogo);
}

/* ------------------------------------------------------------------ */
/*  Admin reads — raw rows.                                            */
/* ------------------------------------------------------------------ */

export async function getAdminClientLogos(): Promise<DbClientLogo[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("client_logos")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<DbClientLogo[]>();
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[admin] failed to load client logos:", err);
    return [];
  }
}

export async function getAdminClientLogoById(
  id: string,
): Promise<DbClientLogo | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("client_logos")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as DbClientLogo | null) ?? null;
  } catch (err) {
    console.error("[admin] failed to load client logo:", err);
    return null;
  }
}
