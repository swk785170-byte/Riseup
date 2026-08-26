import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getPublishedPosts } from "@/lib/data/posts";

/** Refreshed hourly so new blog posts appear without a redeploy. */
export const revalidate = 3600;

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

/* Only indexable, public pages. /admin and /register are noindex and
   disallowed in robots.ts, so they are deliberately absent. */
const STATIC_PAGES: Entry[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/services/lms", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/smart-systems", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const pages: MetadataRoute.Sitemap = STATIC_PAGES.map((entry) => ({
    url: `${base}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  // Blog posts are the site's only per-item routes.
  try {
    const posts = await getPublishedPosts();
    for (const post of posts) {
      pages.push({
        url: `${base}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch (err) {
    // A database hiccup must not produce an empty sitemap for the whole site.
    console.error("[sitemap] could not load posts", err);
  }

  return pages;
}
