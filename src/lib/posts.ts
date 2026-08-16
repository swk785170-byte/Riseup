/**
 * Blog post types, the SEED_POSTS fallback, and DB row mapping — mirrors the
 * projects data model. SEED_POSTS renders when Supabase isn't configured; once
 * it is, `lib/data/posts.ts` fetches rows and maps them through `mapRowToPost`
 * into this same `Post` shape so the public blog is unchanged.
 */

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string | null;
  body: string;
  author: string;
  published: boolean;
  publishedAt: string | null; // ISO date/time string
};

/** A row from the Supabase `posts` table. */
export type DbPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  body: string | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export function mapRowToPost(row: DbPost): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    coverUrl: row.cover_url,
    body: row.body ?? "",
    author: row.author && row.author.trim() ? row.author : "Riseup Solutions",
    published: row.published,
    publishedAt: row.published_at,
  };
}

export const SEED_POSTS: Post[] = [
  {
    id: "website-speed-costs-customers",
    title: "Why your website speed is quietly costing you customers",
    slug: "website-speed-costs-customers",
    excerpt:
      "A one-second delay can cut conversions by double digits. Here's what actually moves the needle — and what's just theatre.",
    coverUrl: null,
    author: "Nejan S.",
    published: true,
    publishedAt: "2026-06-15",
    body: "Most teams treat performance as a finishing touch — something to sprinkle on right before launch. By then it's usually too late, because the slowest parts of a site are baked into decisions made months earlier.\n\nThe biggest wins are rarely glamorous: shipping less JavaScript, serving images at the size they're actually displayed, and caching aggressively at the edge. None of it shows up in a mockup, but all of it shows up in your conversion rate.\n\nWe treat Core Web Vitals as a budget, not a report card. Every feature has to earn its weight — if a carousel costs 200ms of interactivity, it needs to pay that back in engagement, or it doesn't ship.",
  },
  {
    id: "choosing-an-lms-checklist",
    title: "Choosing an LMS for your school: a practical checklist",
    slug: "choosing-an-lms-checklist",
    excerpt:
      "Attendance, grading, parent comms, smart cards — the features that matter, and the questions to ask before you commit.",
    coverUrl: null,
    author: "Bathila",
    published: true,
    publishedAt: "2026-05-28",
    body: "The best learning-management system is the one your teachers will actually use on a Monday morning. That sounds obvious, but most procurement checklists optimise for feature count instead of daily friction.\n\nStart with the workflows that happen every day: taking attendance, entering marks, sending a note home. If those take more taps than the paper process they replace, adoption dies quietly.\n\nThen look at the seams — how does the LMS talk to your smart-card readers, your SMS gateway, your finance system? Integrations are where school platforms live or die, and they're the hardest thing to bolt on later.",
  },
  {
    id: "design-systems-for-small-teams",
    title: "Design systems aren't just for big teams",
    slug: "design-systems-for-small-teams",
    excerpt:
      "You don't need fifty components and a dedicated team. A handful of tokens and rules will save a two-person shop just as much time.",
    coverUrl: null,
    author: "Sudam",
    published: true,
    publishedAt: "2026-04-10",
    body: "There's a myth that design systems are enterprise overhead — a luxury for teams with the headcount to maintain them. In practice, small teams benefit the most, because a system is really just a way of not re-deciding the same things over and over.\n\nStart tiny: a colour palette, a type scale, spacing, and a couple of button styles. Write them down as tokens. That alone eliminates the thousand micro-decisions that slow every new page to a crawl.\n\nThe goal isn't a component library for its own sake — it's consistency you get for free. When the rules live in one place, a new page looks like it belongs without anyone having to think about it.",
  },
];
