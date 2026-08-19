"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { LMS_GROUP, getCell, type PricingFeature } from "@/lib/pricing";
import { EASE_PREMIUM } from "@/lib/motion";

/**
 * Which shared pricing features belong to the admin panel rather than the
 * day-to-day teaching experience. Anything not listed falls into the
 * students & teachers column, so a feature added to `lib/pricing.ts` later
 * shows up here automatically instead of being silently dropped.
 */
const ADMIN_FEATURE_IDS = new Set([
  "adminPanel",
  "adminAccounts",
  "revenue",
  "sms",
  "bulkSms",
  "notices",
]);

/**
 * The union of every LMS tier's features — i.e. everything the ecosystem does,
 * with no tier gating (that stays on the Pricing page). Sourced from the same
 * `LMS_GROUP` the pricing table renders, so the two can never describe the
 * product differently.
 */
const included: PricingFeature[] = LMS_GROUP.features.filter((feature) =>
  LMS_GROUP.tiers.some((tier) => getCell(tier, feature.id).kind !== "none"),
);

const teachingFeatures = included.filter((f) => !ADMIN_FEATURE_IDS.has(f.id));
const adminFeatures = included.filter((f) => ADMIN_FEATURE_IDS.has(f.id));

function FeatureList({
  title,
  features,
}: {
  title: string;
  features: PricingFeature[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-taupe bg-surface">
      <h3 className="border-b border-taupe px-6 py-4 text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
        {title}
      </h3>
      <ul>
        {features.map((feature) => (
          <li
            key={feature.id}
            className="flex items-start gap-3 border-b border-taupe/50 px-6 py-3.5 last:border-0"
          >
            <Check
              size={16}
              strokeWidth={2.5}
              aria-hidden
              className="mt-0.5 shrink-0 text-foreground"
            />
            <span className="text-sm text-foreground/85">{feature.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function LMSFeatures() {
  return (
    <section className="border-t border-border bg-surface/30">
      <div className="mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-28">
        <SectionHeading
          center
          eyebrow="What's Included"
          title="Everything in the platform"
          sub="The full feature set across the LMS and its admin panel. Which tier includes what is on the pricing page — this is the whole ecosystem."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="mt-14 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2"
        >
          <FeatureList
            title="For students & teachers"
            features={teachingFeatures}
          />
          <FeatureList title="Admin panel" features={adminFeatures} />
        </motion.div>
      </div>
    </section>
  );
}
