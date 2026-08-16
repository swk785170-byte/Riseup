import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import { getPublishedPosts } from "@/lib/data/posts";
import type { Post } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — RISEUP SOLUTIONS",
  description:
    "Practical writing on web, systems and the craft of building things that last — from the Riseup Solutions team.",
  openGraph: {
    title: "Blog — RISEUP SOLUTIONS",
    description: "Ideas, notes and field reports from the Riseup Solutions team.",
    type: "website",
  },
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-28px_rgba(11,11,11,0.22)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <SafeImage
          src={post.coverUrl}
          alt={post.title}
          placeholderLabel="riseup"
          className="transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
          {formatDate(post.publishedAt)}
        </p>
        <h3 className="mt-3 text-lg font-semibold tracking-tight">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.14em] uppercase">
          Read
          <ArrowUpRight
            size={14}
            strokeWidth={2.5}
            className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="mx-auto max-w-7xl px-5 pt-36 pb-16 text-center md:px-10 md:pt-52 md:pb-20">
            <p className="mb-7 flex items-center justify-center gap-3 text-[13px] font-bold tracking-[0.4em] text-muted uppercase">
              <span className="inline-block h-px w-8 bg-foreground" />
              Blog
              <span className="inline-block h-px w-8 bg-foreground" />
            </p>
            <h1 className="text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.03em] text-balance">
              Ideas, notes &amp; field reports.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Practical writing on web, systems and the craft of building things
              that last.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
            {posts.length === 0 ? (
              <p className="py-16 text-center text-muted">
                No posts yet — check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
