import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  SEED_TEAM,
  mapRowToTeamMember,
  type DbTeamMember,
  type TeamMember,
} from "@/lib/team";
import {
  SEED_GALLERY,
  mapRowToGalleryImage,
  type DbGalleryImage,
  type GalleryImage,
} from "@/lib/gallery";
import {
  DEFAULT_SETTINGS,
  mapRowToSettings,
  type DbSiteSettings,
  type SiteSettings,
} from "@/lib/settings";

/* ------------------------------------------------------------------ */
/*  Team                                                               */
/* ------------------------------------------------------------------ */

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured()) return SEED_TEAM;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<DbTeamMember[]>();
    if (error) throw error;
    if (!data || data.length === 0) return SEED_TEAM;
    return data.map(mapRowToTeamMember);
  } catch (err) {
    console.error("[team] Supabase fetch failed — using seed data:", err);
    return SEED_TEAM;
  }
}

export async function getAdminTeamMembers(): Promise<DbTeamMember[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<DbTeamMember[]>();
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[admin] failed to load team members:", err);
    return [];
  }
}

export async function getAdminTeamMemberById(
  id: string,
): Promise<DbTeamMember | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as DbTeamMember | null) ?? null;
  } catch (err) {
    console.error("[admin] failed to load team member:", err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Gallery                                                            */
/* ------------------------------------------------------------------ */

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) return SEED_GALLERY;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<DbGalleryImage[]>();
    if (error) throw error;
    return (data ?? []).map(mapRowToGalleryImage);
  } catch (err) {
    console.error("[gallery] Supabase fetch failed — using seed data:", err);
    return SEED_GALLERY;
  }
}

export async function getAdminGalleryImages(): Promise<DbGalleryImage[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<DbGalleryImage[]>();
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[admin] failed to load gallery images:", err);
    return [];
  }
}

export async function getAdminGalleryImageById(
  id: string,
): Promise<DbGalleryImage | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as DbGalleryImage | null) ?? null;
  } catch (err) {
    console.error("[admin] failed to load gallery image:", err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Site settings                                                      */
/* ------------------------------------------------------------------ */

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    const row = data as DbSiteSettings | null;
    return row ? mapRowToSettings(row) : DEFAULT_SETTINGS;
  } catch (err) {
    console.error("[settings] Supabase fetch failed — using defaults:", err);
    return DEFAULT_SETTINGS;
  }
}
