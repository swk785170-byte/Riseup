import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PostForm from "@/components/admin/PostForm";
import { getAdminPostById } from "@/lib/data/posts";
import type { PostFormValues } from "@/lib/schemas/post";

export const dynamic = "force-dynamic";

function toDateInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminPostById(id);
  if (!row) notFound();

  const values: PostFormValues = {
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    cover_url: row.cover_url ?? "",
    body: row.body ?? "",
    author: row.author ?? "",
    published: row.published,
    published_at: toDateInput(row.published_at),
  };

  return (
    <div>
      <Link
        href="/admin/posts"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to posts
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Edit post</h1>
      <p className="mt-1 mb-8 text-sm text-muted">{row.title}</p>
      <PostForm mode="edit" postId={id} defaultValues={values} />
    </div>
  );
}
