import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  SEED_PROJECTS,
  mapRowToProject,
  type DbProject,
  type Project,
} from "@/lib/projects";

/**
 * Fetch rows from Supabase, or `null` to signal "not configured / failed" so
 * callers fall back to SEED_PROJECTS — the public site never breaks.
 */
async function fetchRows(): Promise<DbProject[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("year", { ascending: false })
      .returns<DbProject[]>();
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[projects] Supabase fetch failed — using seed data:", err);
    return null;
  }
}

/** All projects, sorted — used by /projects. */
export async function getAllProjects(): Promise<Project[]> {
  const rows = await fetchRows();
  return rows ? rows.map(mapRowToProject) : SEED_PROJECTS;
}

/** Featured projects for the homepage FeaturedWork row. */
export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.featured).slice(0, limit);
}

/** LMS case studies for the LMS page Customers section. */
export async function getLMSProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.filters.includes("lms"));
}

/** Single project (by id/slug) for the case-study modal detail content. */
export async function getProjectById(id: string): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === id) ?? null;
}

/* ------------------------------------------------------------------ */
/*  Admin reads — raw DB rows (all columns), for the admin panel.       */
/* ------------------------------------------------------------------ */

/** All raw rows for the admin dashboard table. */
export async function getAdminProjects(): Promise<DbProject[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false })
      .returns<DbProject[]>();
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[admin] failed to load projects:", err);
    return [];
  }
}

/** A single raw row for the edit form. */
export async function getAdminProjectById(
  id: string,
): Promise<DbProject | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as DbProject | null) ?? null;
  } catch (err) {
    console.error("[admin] failed to load project:", err);
    return null;
  }
}

/**
 * Newest `updated_at` across all projects, for sitemap freshness.
 *
 * Returns null when there are no projects or the query fails — the caller then
 * omits `lastModified` rather than substituting "now", which would be a false
 * freshness signal.
 */
export async function getLatestProjectUpdate(): Promise<Date | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as { updated_at: string | null };
    if (!row.updated_at) return null;
    const date = new Date(row.updated_at);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}
