import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PostForm from "@/components/admin/PostForm";
import type { PostFormValues } from "@/lib/schemas/post";

const emptyPost: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  cover_url: "",
  body: "",
  author: "",
  published: false,
  published_at: "",
};

export default function NewPostPage() {
  return (
    <div>
      <Link
        href="/admin/posts"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to posts
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New post</h1>
      <p className="mt-1 mb-8 text-sm text-muted">
        Write and publish a blog post.
      </p>
      <PostForm mode="create" defaultValues={emptyPost} />
    </div>
  );
}
