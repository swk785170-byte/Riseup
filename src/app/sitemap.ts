import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getPublishedPosts } from "@/lib/data/posts";
import { getLatestProjectUpdate } from "@/lib/data/projects";
import { LEGAL } from "@/lib/legal";

/** Refreshed hourly so new blog posts appear without a redeploy. */
export const revalidate = 3600;

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  /**
   * Real modification date, or null when the site has no honest signal for
   * this page.
   *
   * `lastModified` is deliberately OMITTED rather than defaulted to "now".
   * This file regenerates every hour, so stamping the current time would tell
   * Google that all nine pages changed, every hour, forever — and Google
   * discounts a lastmod it can see is unreliable, which would waste the signal
   * on the pages where it IS accurate (the blog posts).
   */
  lastModified: Date | null;
};

/** A date, or null when it cannot be parsed — never a silent "now". */
function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  /*
   * Content dates, gathered in parallel. Each is independently guarded: a
   * failure degrades that page to "no lastmod" rather than emptying the
   * sitemap for the whole site.
   */
  const [posts, latestProject] = await Promise.all([
    getPublishedPosts().catch((err: unknown) => {
      console.error("[sitemap] could not load posts", err);
      return [];
    }),
    getLatestProjectUpdate(),
  ]);

  const postDates = posts
    .map((post) => parseDate(post.publishedAt))
    .filter((date): date is Date => date !== null);

  const newestPost =
    postDates.length > 0
      ? new Date(Math.max(...postDates.map((d) => d.getTime())))
      : null;

  // The legal pages carry their own review date, which is the real thing to
  // report — it is the same date printed on the page.
  const legalDate = parseDate(LEGAL.lastUpdated);

  /* Only indexable, public pages. /admin and /register are noindex and
     disallowed in robots.ts, so they are deliberately absent. */
  const staticPages: Entry[] = [
    {
      path: "/",
      priority: 1.0,
      changeFrequency: "weekly",
      // The homepage surfaces featured work and the latest writing, so it is
      // as fresh as the newer of the two.
      lastModified: newerOf(latestProject, newestPost),
    },
    {
      path: "/projects",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: latestProject,
    },
    {
      path: "/blog",
      priority: 0.7,
      changeFrequency: "weekly",
      lastModified: newestPost,
    },
    // Marketing pages are edited by redeploy, not by data, so there is no
    // trustworthy date to report for them.
    {
      path: "/services/lms",
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: null,
    },
    {
      path: "/services/smart-systems",
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: null,
    },
    {
      path: "/pricing",
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: null,
    },
    {
      path: "/about",
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: null,
    },
    {
      path: "/privacy",
      priority: 0.2,
      changeFrequency: "yearly",
      lastModified: legalDate,
    },
    {
      path: "/terms",
      priority: 0.2,
      changeFrequency: "yearly",
      lastModified: legalDate,
    },
  ];

  const pages: MetadataRoute.Sitemap = staticPages.map((entry) => ({
    url: `${base}${entry.path}`,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
  }));

  // Blog posts are the site's only per-item routes, and the one place where
  // every entry has a genuine publication date.
  for (const post of posts) {
    const published = parseDate(post.publishedAt);
    pages.push({
      url: `${base}/blog/${post.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
      ...(published ? { lastModified: published } : {}),
    });
  }

  return pages;
}

function newerOf(a: Date | null, b: Date | null): Date | null {
  if (!a) return b;
  if (!b) return a;
  return a.getTime() >= b.getTime() ? a : b;
}
