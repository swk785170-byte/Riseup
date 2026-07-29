"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { postFormSchema, type PostFormValues } from "@/lib/schemas/post";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

async function requireUser(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");
}

/** Revalidate the blog list, every post page, and the admin list. */
function revalidatePublic(): void {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/admin/posts");
}

function toRow(values: PostFormValues) {
  const publishedAt = values.published_at
    ? new Date(values.published_at).toISOString()
    : values.published
      ? new Date().toISOString()
      : null;
  return {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt ? values.excerpt : null,
    cover_url: values.cover_url ? values.cover_url : null,
    body: values.body ? values.body : null,
    author: values.author ? values.author : null,
    published: values.published,
    published_at: publishedAt,
  };
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export async function createPost(
  input: PostFormValues,
): Promise<ActionResult> {
  try {
    await requireUser();
    const values = postFormSchema.parse(input);
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("posts")
      .insert(toRow(values))
      .select("id")
      .single();
    if (error) throw error;
    revalidatePublic();
    const row = data as { id: string } | null;
    return { ok: true, id: row?.id };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to create post.") };
  }
}

export async function updatePost(
  id: string,
  input: PostFormValues,
): Promise<ActionResult> {
  try {
    await requireUser();
    const values = postFormSchema.parse(input);
    const admin = createAdminClient();
    const { error } = await admin
      .from("posts")
      .update(toRow(values))
      .eq("id", id);
    if (error) throw error;
    revalidatePublic();
    return { ok: true, id };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to update post.") };
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    await requireUser();
    const admin = createAdminClient();
    const { error } = await admin.from("posts").delete().eq("id", id);
    if (error) throw error;
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to delete post.") };
  }
}
