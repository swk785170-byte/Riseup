import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { SEED_POSTS, mapRowToPost, type DbPost, type Post } from "@/lib/posts";

async function fetchRows(): Promise<DbPost[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .returns<DbPost[]>();
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[posts] Supabase fetch failed — using seed data:", err);
    return null;
  }
}

/** All posts (any status) — mapped. */
export async function getAllPosts(): Promise<Post[]> {
  const rows = await fetchRows();
  return rows ? rows.map(mapRowToPost) : SEED_POSTS;
}

/** Published posts for the public /blog list. */
export async function getPublishedPosts(): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.published);
}

/** A single published post by slug for /blog/[slug]. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug && p.published) ?? null;
}

/* ------------------------------------------------------------------ */
/*  Admin reads — raw rows (all statuses).                             */
/* ------------------------------------------------------------------ */

export async function getAdminPosts(): Promise<DbPost[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false })
      .returns<DbPost[]>();
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[admin] failed to load posts:", err);
    return [];
  }
}

export async function getAdminPostById(id: string): Promise<DbPost | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as DbPost | null) ?? null;
  } catch (err) {
    console.error("[admin] failed to load post:", err);
    return null;
  }
}
