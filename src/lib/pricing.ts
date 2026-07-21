/**
 * Single source of truth for pricing — the tier cards and the comparison table
 * both read from here, so a feature can never appear in one and not the other.
 *
 * Each tier's `includes` is a superset of the tier below it; card bullets are
 * derived as the difference from the previous tier ("Everything in X, plus…"),
 * while the comparison table renders the full `includes` matrix.
 *
 * Prices are indicative placeholders — replace with real figures.
 */

export type PricingCategory = "web" | "lms";

export type PricingFeature = { id: string; label: string };

export type PricingTier = {
  id: string;
  name: string;
  price: string;
  priceNote?: string;
  tagline: string;
  cta: string;
  includes: string[];
  popular?: boolean;
};

export type PricingGroup = {
  id: PricingCategory;
  label: string; // toggle / short label
  heading: string; // section heading
  sub: string;
  features: PricingFeature[]; // full comparison-table rows, in display order
  tiers: PricingTier[];
};

export const WEB_GROUP: PricingGroup = {
  id: "web",
  label: "Web Packages",
  heading: "Normal Web Packages",
  sub: "Sites that look sharp and load fast — from a single landing page to a fully custom build.",
  features: [
    { id: "design", label: "Custom-designed pages" },
    { id: "responsive", label: "Fully responsive build" },
    { id: "contact", label: "Contact form & socials" },
    { id: "basicSeo", label: "Basic on-page SEO" },
    { id: "cms", label: "CMS / self-editing" },
    { id: "blog", label: "Blog & insights section" },
    { id: "advancedSeo", label: "Advanced SEO setup" },
    { id: "support", label: "Priority support" },
    { id: "ecommerce", label: "E-commerce & payments" },
    { id: "integrations", label: "Custom integrations" },
    { id: "animation", label: "Advanced animation" },
  ],
  tiers: [
    {
      id: "starter",
      name: "Starter",
      price: "From $1,200",
      priceNote: "one-time",
      tagline: "A clean one-page or small brochure site for new businesses.",
      cta: "Choose Starter",
      includes: ["design", "responsive", "contact", "basicSeo"],
    },
    {
      id: "growth",
      name: "Growth",
      price: "From $3,500",
      priceNote: "one-time",
      popular: true,
      tagline: "A multi-page business site with CMS, SEO and a blog to grow on.",
      cta: "Choose Growth",
      includes: [
        "design",
        "responsive",
        "contact",
        "basicSeo",
        "cms",
        "blog",
        "advancedSeo",
        "support",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      priceNote: "let's scope it",
      tagline: "A fully custom, feature-rich build for larger organisations.",
      cta: "Talk to Us",
      includes: [
        "design",
        "responsive",
        "contact",
        "basicSeo",
        "cms",
        "blog",
        "advancedSeo",
        "support",
        "ecommerce",
        "integrations",
        "animation",
      ],
    },
  ],
};

export const LMS_GROUP: PricingGroup = {
  id: "lms",
  label: "LMS & Student Management",
  heading: "LMS / Student Management",
  sub: "Everything a school or institution needs to run learning and admin — scaled to your size.",
  features: [
    { id: "courses", label: "Courses & content" },
    { id: "grading", label: "Grading & assessments" },
    { id: "dashboards", label: "Student dashboards" },
    { id: "attendance", label: "Attendance tracking" },
    { id: "paperClass", label: "Paper Class System" },
    { id: "registration", label: "Student Registration System" },
    { id: "parentPortal", label: "Parent portal" },
    { id: "smartCard", label: "Smart Card System" },
    { id: "integrations", label: "Custom integrations" },
    { id: "support", label: "Dedicated support" },
  ],
  tiers: [
    {
      id: "essentials",
      name: "Essentials",
      price: "From $1,800",
      priceNote: "per year",
      tagline: "Core LMS: courses, grading and clear student dashboards.",
      cta: "Choose Essentials",
      includes: ["courses", "grading", "dashboards", "attendance"],
    },
    {
      id: "professional",
      name: "Professional",
      price: "From $3,900",
      priceNote: "per year",
      popular: true,
      tagline:
        "Adds the Paper Class and Student Registration systems, plus a parent portal.",
      cta: "Choose Professional",
      includes: [
        "courses",
        "grading",
        "dashboards",
        "attendance",
        "paperClass",
        "registration",
        "parentPortal",
      ],
    },
    {
      id: "institution",
      name: "Institution",
      price: "Custom Quote",
      priceNote: "tailored",
      tagline:
        "The full platform with Smart Cards, custom integrations and dedicated support.",
      cta: "Talk to Us",
      includes: [
        "courses",
        "grading",
        "dashboards",
        "attendance",
        "paperClass",
        "registration",
        "parentPortal",
        "smartCard",
        "integrations",
        "support",
      ],
    },
  ],
};

export const PRICING_GROUPS: PricingGroup[] = [WEB_GROUP, LMS_GROUP];

export const PRICING_CATEGORIES: { value: PricingCategory; label: string }[] =
  PRICING_GROUPS.map((g) => ({ value: g.id, label: g.label }));

/**
 * Card bullets for a tier: for the first tier, all its features; for later
 * tiers, only what's new versus the tier below (paired with an "Everything in
 * {inheritsFrom}, plus" lead line). Always a subset of `includes`, so cards and
 * the comparison table can never disagree.
 */
export function getTierBullets(
  group: PricingGroup,
  index: number,
): { inheritsFrom: string | null; bullets: string[] } {
  const tier = group.tiers[index];
  const labelOf = (id: string) =>
    group.features.find((f) => f.id === id)?.label ?? id;

  if (index === 0) {
    return { inheritsFrom: null, bullets: tier.includes.map(labelOf) };
  }

  const prev = group.tiers[index - 1];
  const newIds = tier.includes.filter((id) => !prev.includes.includes(id));
  return { inheritsFrom: prev.name, bullets: newIds.map(labelOf) };
}
