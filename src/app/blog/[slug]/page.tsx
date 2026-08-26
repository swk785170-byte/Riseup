import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import { getPostBySlug } from "@/lib/data/posts";
import JsonLd, { articleSchema, breadcrumbSchema } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found — RISEUP SOLUTIONS" };
  return {
    title: `${post.title} — RISEUP SOLUTIONS`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {/* BlogPosting markup: gives the post an author, publisher and date that
          search and AI engines can attribute, rather than treating it as
          anonymous page copy. */}
      <JsonLd
        data={articleSchema({
          siteUrl: siteUrl(),
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          publishedAt: post.publishedAt,
          image: post.coverUrl ?? null,
        })}
      />
      <JsonLd
        data={breadcrumbSchema(siteUrl(), [
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <Navbar />
      <main>
        <article className="mx-auto max-w-3xl px-5 pt-36 pb-20 md:px-10 md:pt-44">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.16em] text-muted uppercase transition-colors hover:text-foreground"
          >
            <ArrowLeft size={15} /> All posts
          </Link>

          <p className="mt-8 text-[12px] font-bold tracking-[0.2em] text-muted uppercase">
            {formatDate(post.publishedAt)}
            {post.author ? ` · ${post.author}` : ""}
          </p>

          <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.02em] text-balance">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {post.excerpt}
            </p>
          )}

          {post.coverUrl && (
            <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
              <SafeImage src={post.coverUrl} alt={post.title} />
            </div>
          )}

          <div className="mt-10 flex flex-col gap-6 border-t border-border pt-10">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[17px] leading-relaxed text-foreground/85"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-muted">This post has no content yet.</p>
            )}
          </div>
        </article>

        <section className="border-t border-border bg-surface/40">
          <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-7 py-3.5 text-[12px] font-bold tracking-[0.16em] text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            >
              <ArrowLeft size={15} /> Back to all posts
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
