/**
 * Project types, the CSS-mock / filter derivation, and the SEED_PROJECTS
 * fallback.
 *
 * SEED_PROJECTS is the built-in portfolio used when Supabase isn't configured
 * (and the source for the one-off seed script). When Supabase IS configured,
 * `lib/data/projects.ts` fetches rows and maps them through `mapRowToProject`
 * into this same rich `Project` shape, so every public component is unchanged.
 */

export type MockVariant = "landing" | "dashboard" | "commerce" | "editorial";

export type Tint = { bg: string; deep: string; soft: string };

/** Discipline tags used by the /projects filter bar. */
export type ProjectFilter =
  | "web-design"
  | "web-development"
  | "e-commerce"
  | "seo"
  | "lms";

export type Project = {
  slug: string;
  name: string;
  client: string;
  category: string;
  year: string;
  tint: Tint;
  mock: MockVariant;
  secondaryMock: MockVariant;
  summary: string;
  challenge: string;
  solution: string;
  results: { value: string; label: string }[];
  tags: string[];
  /** Which filter tabs this project appears under. */
  filters: ProjectFilter[];
  /** Curated subset shown on the homepage row. */
  featured?: boolean;
};

export const SEED_PROJECTS: Project[] = [
  {
    slug: "alpine-ridge",
    name: "Alpine Ridge Outfitters",
    client: "Alpine Ridge",
    category: "E-Commerce",
    year: "2025",
    tint: { bg: "#e7e0d2", deep: "#3e4a3d", soft: "#c6bba4" },
    mock: "commerce",
    secondaryMock: "landing",
    filters: ["e-commerce", "web-design", "web-development"],
    featured: true,
    summary: "A headless storefront for a heritage outdoor gear brand.",
    challenge:
      "Alpine Ridge was selling premium gear through a sluggish template store — 6-second loads, a 78% cart abandonment rate and a mobile experience that buried their best products.",
    solution:
      "We rebuilt the store as a headless commerce experience on Next.js: sub-second page loads, an edge-cached catalogue, one-page checkout and merchandising blocks the team edits without a developer.",
    results: [
      { value: "+212%", label: "Online revenue in 6 months" },
      { value: "0.9s", label: "Largest Contentful Paint" },
      { value: "+38%", label: "Average order value" },
    ],
    tags: ["Headless Commerce", "Next.js", "CRO", "Art Direction"],
  },
  {
    slug: "vantage-analytics",
    name: "Vantage Analytics",
    client: "Vantage",
    category: "SaaS",
    year: "2025",
    tint: { bg: "#dde3ea", deep: "#1f2a44", soft: "#b7c3d4" },
    mock: "dashboard",
    secondaryMock: "landing",
    filters: ["web-design", "web-development", "seo"],
    featured: true,
    summary: "A marketing site that finally matched the product's ambition.",
    challenge:
      "A category-leading analytics product was losing demos to competitors with sharper stories. The old site explained features; it never sold outcomes — and bounce rates showed it.",
    solution:
      "We rewrote the narrative around customer outcomes, designed an interactive product tour and shipped a CMS-driven site the marketing team iterates on weekly, with A/B testing wired in from day one.",
    results: [
      { value: "+64%", label: "Demo bookings" },
      { value: "-41%", label: "Bounce rate" },
      { value: "12", label: "Keywords ranked #1" },
    ],
    tags: ["Brand Narrative", "Webflow → Next.js", "A/B Testing", "SEO"],
  },
  {
    slug: "meridian-legal",
    name: "Meridian Legal",
    client: "Meridian",
    category: "Corporate",
    year: "2024",
    tint: { bg: "#e9e2dc", deep: "#4a3a33", soft: "#cdbfb3" },
    mock: "editorial",
    secondaryMock: "landing",
    filters: ["web-design", "seo"],
    featured: true,
    summary: "Quiet authority for a boutique commercial law firm.",
    challenge:
      "Meridian's referrals were strong, but their site read like a directory listing. High-value clients researching the firm found nothing that justified premium fees.",
    solution:
      "An editorial redesign built on typography and case results: practice-area landing pages engineered for search intent, attorney profiles that convert, and a publishing pipeline for insights that compound authority.",
    results: [
      { value: "+148%", label: "Qualified enquiries" },
      { value: "3×", label: "Organic traffic in a year" },
      { value: "100", label: "Lighthouse performance" },
    ],
    tags: ["Editorial Design", "Technical SEO", "CMS", "Accessibility"],
  },
  {
    slug: "bloom-root",
    name: "Bloom & Root",
    client: "Bloom & Root",
    category: "D2C Brand",
    year: "2024",
    tint: { bg: "#e2e8de", deep: "#39503c", soft: "#d9c3b4" },
    mock: "landing",
    secondaryMock: "commerce",
    filters: ["e-commerce", "web-development", "web-design"],
    featured: true,
    summary: "A subscription experience that made plant care feel effortless.",
    challenge:
      "Bloom & Root's plant subscription had loyal customers but a leaky funnel — a five-step signup, no way to pause deliveries and a brand that photographed beautifully yet converted poorly online.",
    solution:
      "We collapsed signup to ninety seconds, built a self-serve subscription portal with pause-and-swap, and rebuilt the brand system around lush photography with performance budgets that kept it fast.",
    results: [
      { value: "+87%", label: "Subscription starts" },
      { value: "52%", label: "Repeat purchase rate" },
      { value: "1.2s", label: "Time to interactive" },
    ],
    tags: ["Subscriptions", "Brand System", "Next.js", "Performance"],
  },
  {
    slug: "northwind-logistics",
    name: "Northwind Logistics",
    client: "Northwind",
    category: "Web App",
    year: "2025",
    tint: { bg: "#dde1e6", deep: "#2c3540", soft: "#b9c1cb" },
    mock: "dashboard",
    secondaryMock: "landing",
    filters: ["web-development", "web-design"],
    summary: "A customer portal that turned support tickets into self-service.",
    challenge:
      "Northwind's clients tracked freight by emailing account managers — hundreds of 'where's my shipment?' tickets a week, and a support team drowning in them.",
    solution:
      "We designed and built a real-time tracking portal on Next.js with role-based dashboards, live status webhooks and a document vault, replacing the inbox with self-service.",
    results: [
      { value: "-72%", label: "Support tickets" },
      { value: "4.9/5", label: "Client satisfaction" },
      { value: "<1.5s", label: "Dashboard load" },
    ],
    tags: ["Web App", "Next.js", "Auth & Roles", "Real-time"],
  },
  {
    slug: "saffron-sage",
    name: "Saffron & Sage",
    client: "Saffron & Sage",
    category: "Restaurant",
    year: "2024",
    tint: { bg: "#e6e4d5", deep: "#464a34", soft: "#cdc9ab" },
    mock: "commerce",
    secondaryMock: "editorial",
    filters: ["web-design", "e-commerce"],
    summary: "A restaurant group's bookings and orders, finally under one roof.",
    challenge:
      "Three locations, three disconnected booking tools and a menu PDF from 2019. Regulars couldn't order online and the kitchen never saw demand coming.",
    solution:
      "One headless site with integrated reservations, online ordering and a menu the managers update in minutes — fast enough to hold up during the Friday rush.",
    results: [
      { value: "3.4×", label: "Online orders" },
      { value: "+56%", label: "Direct reservations" },
      { value: "0.8s", label: "LCP on mobile" },
    ],
    tags: ["E-Commerce", "Reservations", "Headless CMS", "Local SEO"],
  },
  {
    slug: "lumen-studio",
    name: "Lumen Studio",
    client: "Lumen",
    category: "Portfolio",
    year: "2024",
    tint: { bg: "#e9e5df", deep: "#33302b", soft: "#cfc7ba" },
    mock: "editorial",
    secondaryMock: "landing",
    filters: ["web-design", "web-development"],
    summary: "An architecture studio's portfolio that feels like a gallery.",
    challenge:
      "Lumen's award-winning work lived in a clunky template that made stunning buildings look ordinary — and loaded a portfolio of large images at a crawl.",
    solution:
      "A motion-led editorial portfolio with art-directed case studies, buttery image loading and a CMS the studio runs themselves between projects.",
    results: [
      { value: "+130%", label: "Time on site" },
      { value: "+41%", label: "Enquiry rate" },
      { value: "98", label: "Lighthouse performance" },
    ],
    tags: ["Editorial Design", "Motion", "Image Optimization", "CMS"],
  },
  {
    slug: "peak-performance",
    name: "Peak Performance",
    client: "Peak",
    category: "Fitness",
    year: "2025",
    tint: { bg: "#e1e3e2", deep: "#2b302e", soft: "#c3c7c4" },
    mock: "landing",
    secondaryMock: "dashboard",
    filters: ["seo", "web-development"],
    summary: "SEO and speed that took a fitness brand to page one.",
    challenge:
      "A growing gym chain was invisible on search — buried under aggregators for every 'gym near me' query, and paying dearly for ads to compensate.",
    solution:
      "A technical-SEO rebuild: location landing pages engineered for intent, schema, Core Web Vitals in the green, and a content engine targeting the queries that actually convert.",
    results: [
      { value: "+280%", label: "Organic traffic" },
      { value: "#1", label: "for 20+ local terms" },
      { value: "-38%", label: "Cost per lead" },
    ],
    tags: ["Technical SEO", "Local Landing Pages", "Core Web Vitals", "Content"],
  },
  {
    slug: "harbor-co",
    name: "Harbor & Co",
    client: "Harbor & Co",
    category: "Finance",
    year: "2023",
    tint: { bg: "#dde4e2", deep: "#213a37", soft: "#b6c6c2" },
    mock: "editorial",
    secondaryMock: "dashboard",
    filters: ["web-design", "seo", "web-development"],
    summary: "Trust, at first scroll, for a boutique wealth firm.",
    challenge:
      "Harbor & Co advised nine-figure portfolios off a website that looked like a 2012 brochure. Prospective clients quietly bounced before the first call.",
    solution:
      "A restrained, editorial redesign with credibility-first storytelling, a secure client login and SEO foundations that put them in front of high-intent searches.",
    results: [
      { value: "+94%", label: "Consultation requests" },
      { value: "2.6×", label: "Organic visibility" },
      { value: "AAA", label: "Accessibility rating" },
    ],
    tags: ["Editorial Design", "Technical SEO", "Secure Portal", "Accessibility"],
  },
  {
    slug: "northgate-college",
    name: "Northgate College LMS",
    client: "Northgate College",
    category: "Education / LMS",
    year: "2025",
    tint: { bg: "#dde2e8", deep: "#233047", soft: "#b9c2d1" },
    mock: "dashboard",
    secondaryMock: "landing",
    filters: ["lms", "web-development"],
    summary: "One platform for 4,000 students, staff and parents.",
    challenge:
      "Northgate ran attendance on paper, grades in spreadsheets and announcements across three different chat apps. Nothing talked to anything, and report season meant weeks of manual reconciliation.",
    solution:
      "We rolled out the Rise Up LMS across the college — courses, grading and dashboards for teachers, a parent portal, and smart-card attendance that syncs to student records in real time.",
    results: [
      { value: "-90%", label: "Time spent on reports" },
      { value: "4,000+", label: "Active students" },
      { value: "98%", label: "Attendance captured daily" },
    ],
    tags: ["LMS", "Smart Card", "Parent Portal", "Reporting"],
  },
  {
    slug: "riverside-institute",
    name: "Riverside Institute",
    client: "Riverside Institute",
    category: "Education / LMS",
    year: "2024",
    tint: { bg: "#dee5e2", deep: "#22403a", soft: "#b7c8c1" },
    mock: "dashboard",
    secondaryMock: "editorial",
    filters: ["lms", "web-development"],
    summary: "Paper-based classrooms, digitised end to end.",
    challenge:
      "A vocational institute drowning in paper registers and handwritten mark sheets wanted to go digital — without retraining every tutor from scratch.",
    solution:
      "We deployed the LMS with the Paper Class System, mirroring their existing forms as structured digital records, plus an online registration flow that cut enrolment-day queues.",
    results: [
      { value: "3 weeks", label: "From paper to live" },
      { value: "-65%", label: "Admin workload" },
      { value: "+40%", label: "On-time enrolments" },
    ],
    tags: ["LMS", "Paper Class System", "Registration", "Onboarding"],
  },
];

export type FilterKey = ProjectFilter | "all";

export const PROJECT_FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web-design", label: "Web Design" },
  { key: "web-development", label: "Web Development" },
  { key: "e-commerce", label: "E-Commerce" },
  { key: "seo", label: "SEO & Growth" },
];

/** Pure client-side filter over an already-fetched list (used by the archive). */
export const filterProjects = (
  projects: Project[],
  key: FilterKey,
): Project[] =>
  key === "all" ? projects : projects.filter((p) => p.filters.includes(key));

/* ------------------------------------------------------------------ */
/*  Supabase row shape + mapping into the rich `Project` used by the UI */
/* ------------------------------------------------------------------ */

/** A row from the Supabase `projects` table. */
export type DbProject = {
  id: string;
  title: string;
  client_name: string;
  category: string;
  tag: string | null;
  year: number;
  description: string | null;
  challenge: string | null;
  solution: string | null;
  results: { value: string; label: string }[];
  tags: string[];
  thumbnail_url: string | null;
  gallery_urls: string[];
  featured: boolean;
  is_lms: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// Discipline <-> filter key.
const CATEGORY_TO_FILTER: Record<string, ProjectFilter> = {
  "Web Design": "web-design",
  "Web Development": "web-development",
  "E-Commerce": "e-commerce",
  "SEO & Growth": "seo",
  LMS: "lms",
};

const FILTER_TO_CATEGORY: Record<ProjectFilter, string> = {
  "web-design": "Web Design",
  "web-development": "Web Development",
  "e-commerce": "E-Commerce",
  seo: "SEO & Growth",
  lms: "LMS",
};

// Discipline -> CSS mock artwork (kept, per the "keep mocks" decision).
const CATEGORY_VISUALS: Record<
  string,
  { tint: Tint; mock: MockVariant; secondaryMock: MockVariant }
> = {
  "Web Design": {
    tint: { bg: "#e9e5df", deep: "#33302b", soft: "#cfc7ba" },
    mock: "landing",
    secondaryMock: "editorial",
  },
  "Web Development": {
    tint: { bg: "#dde1e6", deep: "#2c3540", soft: "#b9c1cb" },
    mock: "dashboard",
    secondaryMock: "landing",
  },
  "E-Commerce": {
    tint: { bg: "#e7e0d2", deep: "#3e4a3d", soft: "#c6bba4" },
    mock: "commerce",
    secondaryMock: "landing",
  },
  "SEO & Growth": {
    tint: { bg: "#e1e3e2", deep: "#2b302e", soft: "#c3c7c4" },
    mock: "editorial",
    secondaryMock: "dashboard",
  },
  LMS: {
    tint: { bg: "#dde2e8", deep: "#233047", soft: "#b9c2d1" },
    mock: "dashboard",
    secondaryMock: "landing",
  },
};

const DEFAULT_VISUALS = CATEGORY_VISUALS["Web Design"];

function deriveFilters(category: string, isLms: boolean): ProjectFilter[] {
  const filters = new Set<ProjectFilter>();
  const mapped = CATEGORY_TO_FILTER[category];
  if (mapped) filters.add(mapped);
  if (isLms) filters.add("lms");
  if (filters.size === 0) filters.add("web-development");
  return Array.from(filters);
}

/** Map a Supabase row into the rich `Project` the public UI renders. */
export function mapRowToProject(row: DbProject): Project {
  const visuals = CATEGORY_VISUALS[row.category] ?? DEFAULT_VISUALS;
  return {
    slug: row.id,
    name: row.title,
    client: row.client_name,
    category: row.tag && row.tag.trim().length > 0 ? row.tag : row.category,
    year: String(row.year),
    tint: visuals.tint,
    mock: visuals.mock,
    secondaryMock: visuals.secondaryMock,
    summary: row.description ?? "",
    challenge: row.challenge ?? "",
    solution: row.solution ?? "",
    results: Array.isArray(row.results) ? row.results : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    filters: deriveFilters(row.category, row.is_lms),
    featured: Boolean(row.featured),
  };
}

/** Inverse used by the one-off seed script to load SEED_PROJECTS into the DB. */
export function seedProjectToRow(
  project: Project,
  index: number,
): Omit<DbProject, "id" | "created_at" | "updated_at"> {
  const primary =
    project.filters.find((f) => f !== "lms") ?? project.filters[0];
  const category = primary ? FILTER_TO_CATEGORY[primary] : "Web Development";
  return {
    title: project.name,
    client_name: project.client,
    category,
    tag: project.category,
    year: Number(project.year),
    description: project.summary,
    challenge: project.challenge,
    solution: project.solution,
    results: project.results,
    tags: project.tags,
    thumbnail_url: null,
    gallery_urls: [],
    featured: Boolean(project.featured),
    is_lms: project.filters.includes("lms"),
    sort_order: index,
  };
}
