/**
 * Single source of truth for public pricing — the tier cards and the comparison
 * table both read from here, so a feature can never appear in one and not the
 * other.
 *
 * Each feature resolves to one of three cell states per tier:
 *   included → a Check in the table; the feature label as a card bullet
 *   value    → a plain label in the table ("Basic" / "Advance" / "3" / "7 days")
 *   none     → a muted dash in the table; omitted from card bullets
 *
 * Card bullets are derived: the first tier lists everything it has; later tiers
 * list only what is new or upgraded versus the tier below ("Everything in X,
 * plus…"), plus any `pinned` feature (support level) restated on every tier.
 *
 * PUBLIC DATA ONLY. Only the six package prices belong in this file — internal
 * add-on line items and their costs must never be bundled to the browser. See
 * `src/lib/internal/pricing-addons.ts` for where that data goes instead.
 */

export type PricingCategory = "web" | "lms";

/** How one feature renders for one tier. */
export type FeatureCell =
  | { kind: "included"; bullet?: string }
  | { kind: "value"; value: string; bullet: string }
  | { kind: "none" };

export type PricingFeature = {
  id: string;
  label: string;
  /** Restate on every tier's card bullets even when unchanged (e.g. support). */
  pinned?: boolean;
};

export type PricingTier = {
  id: string;
  name: string;
  /** The package price — the only figure shown publicly. */
  price: string;
  tagline: string;
  cta: string;
  popular?: boolean;
  /** Omitted features are treated as `none`. */
  features: Partial<Record<string, FeatureCell>>;
};

export type PricingGroup = {
  id: PricingCategory;
  label: string; // toggle / short label
  heading: string; // section heading
  sub: string;
  /** Generic add-on note shown under the grid — never contains figures. */
  addOnNote: string;
  features: PricingFeature[]; // comparison-table rows, in display order
  tiers: PricingTier[];
};

const INCLUDED: FeatureCell = { kind: "included" };
const NONE: FeatureCell = { kind: "none" };

/* ------------------------------------------------------------------ */
/*  Web packages                                                       */
/* ------------------------------------------------------------------ */

export const WEB_GROUP: PricingGroup = {
  id: "web",
  label: "Web Packages",
  heading: "Normal Web Packages",
  sub: "Sites that look sharp and load fast — from a single landing page to a fully custom build.",
  addOnNote:
    "Need something extra? Add-ons like extra pages, custom features, and integrations are available for an additional cost — get in touch for a full quote.",
  features: [
    { id: "pages", label: "Pages count" },
    { id: "domain", label: "Domain (non-premium)" },
    { id: "qr", label: "QR code" },
    { id: "maps", label: "Google Maps location" },
    { id: "responsive", label: "Mobile responsive" },
    { id: "seo", label: "SEO" },
    { id: "contact", label: "Contact form" },
    { id: "socials", label: "Socials (Facebook, TikTok, YouTube)" },
    { id: "ssl", label: "SSL Certificate" },
    { id: "animations", label: "Animations" },
    { id: "scroll", label: "Scroll effects" },
    { id: "google", label: "Google Services" },
    { id: "video", label: "Video integration" },
    { id: "support", label: "Support", pinned: true },
  ],
  tiers: [
    {
      id: "starter",
      name: "Starter",
      price: "15,000/=",
      tagline: "A single-page presence with the essentials done properly.",
      cta: "Choose Starter",
      features: {
        pages: { kind: "value", value: "1", bullet: "1 page" },
        domain: INCLUDED,
        qr: INCLUDED,
        maps: INCLUDED,
        responsive: INCLUDED,
        seo: { kind: "value", value: "Basic", bullet: "Basic SEO" },
        ssl: INCLUDED,
        support: { kind: "value", value: "7 days", bullet: "7-day support" },
      },
    },
    {
      id: "pro",
      name: "Pro",
      price: "25,000/=",
      popular: true,
      tagline:
        "A multi-page site with the integrations and polish most businesses need.",
      cta: "Choose Pro",
      features: {
        pages: { kind: "value", value: "3", bullet: "Up to 3 pages" },
        domain: INCLUDED,
        qr: INCLUDED,
        maps: INCLUDED,
        responsive: INCLUDED,
        seo: { kind: "value", value: "Basic", bullet: "Basic SEO" },
        contact: INCLUDED,
        socials: {
          kind: "included",
          bullet: "Socials integration (Facebook, TikTok, YouTube)",
        },
        ssl: INCLUDED,
        animations: { kind: "value", value: "Basic", bullet: "Basic animations" },
        scroll: {
          kind: "value",
          value: "Smooth",
          bullet: "Smooth scroll effects",
        },
        google: { kind: "included", bullet: "Google Services integration" },
        support: { kind: "value", value: "7 days", bullet: "7-day support" },
      },
    },
    {
      id: "premium",
      name: "Premium",
      price: "50,000/=",
      tagline:
        "The full build — advanced motion, video and search performance.",
      cta: "Choose Premium",
      features: {
        pages: { kind: "value", value: "10", bullet: "Up to 10 pages" },
        domain: INCLUDED,
        qr: INCLUDED,
        maps: INCLUDED,
        responsive: INCLUDED,
        seo: { kind: "value", value: "Advance", bullet: "Advanced SEO" },
        contact: INCLUDED,
        socials: {
          kind: "included",
          bullet: "Socials integration (Facebook, TikTok, YouTube)",
        },
        ssl: INCLUDED,
        animations: {
          kind: "value",
          value: "Advance",
          bullet: "Advanced animations",
        },
        scroll: {
          kind: "value",
          value: "Effects",
          bullet: "Advanced scroll effects",
        },
        google: { kind: "included", bullet: "Google Services integration" },
        video: INCLUDED,
        support: { kind: "value", value: "24 hours", bullet: "24-hour support" },
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  LMS / Student management packages                                  */
/* ------------------------------------------------------------------ */

export const LMS_GROUP: PricingGroup = {
  id: "lms",
  label: "LMS & Student Management",
  heading: "LMS / Student Management",
  sub: "Everything a school or institution needs to run learning and admin — scaled to your size.",
  addOnNote:
    "Need something extra? Add-ons like the Paper Class System, extra admin accounts, and custom integrations are available for an additional cost — get in touch for a full quote.",
  features: [
    { id: "otp", label: "OTP login (one sender ID)" },
    { id: "domain", label: "Domain (non-premium)" },
    { id: "zoom", label: "Automatic Zoom class scheduling" },
    { id: "tute", label: "Tute upload" },
    { id: "adminPanel", label: "Admin panel" },
    { id: "recording", label: "Recording upload" },
    { id: "whatsapp", label: "Direct WhatsApp contact button" },
    { id: "profile", label: "Profile system" },
    { id: "support", label: "Support", pinned: true },
    { id: "lessonPacks", label: "Lesson packs" },
    { id: "sms", label: "SMS alerts / notifications" },
    { id: "notices", label: "Notices and ranks display" },
    { id: "revenue", label: "Revenue calculation" },
    { id: "adminAccounts", label: "Admin accounts" },
    { id: "bulkSms", label: "Bulk SMS" },
    { id: "chat", label: "Realtime chat system" },
    { id: "rating", label: "Rating system" },
    { id: "aiBot", label: "AI chat bot" },
  ],
  tiers: [
    {
      id: "starter",
      name: "Starter",
      price: "90,000/=",
      tagline:
        "Everything to run classes online — scheduling, tutes and recordings.",
      cta: "Choose Starter",
      features: {
        otp: INCLUDED,
        domain: INCLUDED,
        zoom: INCLUDED,
        tute: INCLUDED,
        adminPanel: {
          kind: "value",
          value: "Basic",
          bullet: "Basic admin panel",
        },
        recording: INCLUDED,
        whatsapp: INCLUDED,
        support: { kind: "value", value: "3 days", bullet: "3-day support" },
        adminAccounts: {
          kind: "value",
          value: "1",
          bullet: "1 admin account",
        },
      },
    },
    {
      id: "pro",
      name: "Pro",
      price: "120,000/=",
      popular: true,
      tagline:
        "Adds student profiles, lesson packs and revenue tracking for growing classes.",
      cta: "Choose Pro",
      features: {
        otp: INCLUDED,
        domain: INCLUDED,
        zoom: INCLUDED,
        tute: INCLUDED,
        adminPanel: { kind: "value", value: "Pro", bullet: "Pro admin panel" },
        recording: INCLUDED,
        whatsapp: INCLUDED,
        profile: INCLUDED,
        support: { kind: "value", value: "3 days", bullet: "3-day support" },
        lessonPacks: INCLUDED,
        sms: {
          kind: "value",
          value: "Basic",
          bullet: "Basic SMS alerts / notifications",
        },
        notices: INCLUDED,
        revenue: INCLUDED,
        adminAccounts: {
          kind: "value",
          value: "1",
          bullet: "1 admin account",
        },
      },
    },
    {
      id: "premium",
      name: "Premium",
      price: "150,000/=",
      tagline:
        "The complete platform — chat, bulk SMS, AI support and unlimited admins.",
      cta: "Choose Premium",
      features: {
        otp: INCLUDED,
        domain: INCLUDED,
        zoom: INCLUDED,
        tute: INCLUDED,
        adminPanel: {
          kind: "value",
          value: "Premium",
          bullet: "Premium admin panel",
        },
        recording: INCLUDED,
        whatsapp: INCLUDED,
        profile: INCLUDED,
        support: { kind: "value", value: "24 hours", bullet: "24-hour support" },
        lessonPacks: INCLUDED,
        sms: {
          kind: "value",
          value: "Advance",
          bullet: "Advanced SMS alerts / notifications",
        },
        notices: INCLUDED,
        revenue: INCLUDED,
        adminAccounts: {
          kind: "value",
          value: "Unlimited",
          bullet: "Unlimited admin accounts",
        },
        bulkSms: INCLUDED,
        chat: INCLUDED,
        rating: INCLUDED,
        aiBot: INCLUDED,
      },
    },
  ],
};

export const PRICING_GROUPS: PricingGroup[] = [WEB_GROUP, LMS_GROUP];

export const PRICING_CATEGORIES: { value: PricingCategory; label: string }[] =
  PRICING_GROUPS.map((g) => ({ value: g.id, label: g.label }));

/** A tier's cell for a feature — omitted features resolve to `none`. */
export function getCell(tier: PricingTier, featureId: string): FeatureCell {
  return tier.features[featureId] ?? NONE;
}

/** Two cells are equal when the tier offers exactly the same thing. */
function sameCell(a: FeatureCell, b: FeatureCell): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "value" && b.kind === "value") return a.value === b.value;
  return true;
}

function bulletFor(feature: PricingFeature, cell: FeatureCell): string | null {
  if (cell.kind === "none") return null;
  if (cell.kind === "value") return cell.bullet;
  return cell.bullet ?? feature.label;
}

/**
 * Card bullets for a tier. The first tier lists everything it includes; later
 * tiers list only what is new or upgraded versus the tier below, plus any
 * `pinned` feature. Always derived from the same data the table renders, so the
 * two can never disagree.
 */
export function getTierBullets(
  group: PricingGroup,
  index: number,
): { inheritsFrom: string | null; bullets: string[] } {
  const tier = group.tiers[index];
  const prev = index > 0 ? group.tiers[index - 1] : null;
  const bullets: string[] = [];

  for (const feature of group.features) {
    const cell = getCell(tier, feature.id);
    if (cell.kind === "none") continue;

    if (prev) {
      const prevCell = getCell(prev, feature.id);
      const changed = !sameCell(cell, prevCell);
      if (!changed && !feature.pinned) continue;
    }

    const bullet = bulletFor(feature, cell);
    if (bullet) bullets.push(bullet);
  }

  return { inheritsFrom: prev ? prev.name : null, bullets };
}
