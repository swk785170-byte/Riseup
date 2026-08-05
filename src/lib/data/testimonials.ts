import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  SEED_TESTIMONIALS,
  mapRowToTestimonial,
  type DbTestimonial,
  type Testimonial,
} from "@/lib/testimonials";

async function fetchRows(): Promise<DbTestimonial[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<DbTestimonial[]>();
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error(
      "[testimonials] Supabase fetch failed — using seed data:",
      err,
    );
    return null;
  }
}

/** Testimonials for the homepage marquee, sorted by `sort_order`. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await fetchRows();
  if (!rows) return SEED_TESTIMONIALS;
  // An empty table would blank the section — keep the seed set until the
  // admin adds the first testimonial.
  if (rows.length === 0) return SEED_TESTIMONIALS;
  return rows.map(mapRowToTestimonial);
}

/* ------------------------------------------------------------------ */
/*  Admin reads — raw rows.                                            */
/* ------------------------------------------------------------------ */

export async function getAdminTestimonials(): Promise<DbTestimonial[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<DbTestimonial[]>();
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[admin] failed to load testimonials:", err);
    return [];
  }
}

export async function getAdminTestimonialById(
  id: string,
): Promise<DbTestimonial | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as DbTestimonial | null) ?? null;
  } catch (err) {
    console.error("[admin] failed to load testimonial:", err);
    return null;
  }
}
