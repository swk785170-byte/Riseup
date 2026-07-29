"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { SegmentedToggle } from "./PricingToggle";
import {
  LMS_GROUP,
  WEB_GROUP,
  getCell,
  type FeatureCell,
  type PricingCategory,
  type PricingGroup,
} from "@/lib/pricing";
import { EASE_PREMIUM } from "@/lib/motion";

function Cell({ cell }: { cell: FeatureCell }) {
  if (cell.kind === "included") {
    return (
      <Check
        size={17}
        strokeWidth={2.5}
        className="mx-auto text-foreground"
        aria-label="Included"
      />
    );
  }
  if (cell.kind === "value") {
    return (
      <span className="text-sm font-medium text-foreground">{cell.value}</span>
    );
  }
  return (
    <span className="text-muted" aria-label="Not included">
      —
    </span>
  );
}

function ComparisonTable({ group }: { group: PricingGroup }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-taupe bg-surface md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-taupe">
              <th className="w-2/5 px-6 py-5 text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
                Feature
              </th>
              {group.tiers.map((tier) => (
                <th key={tier.id} className="px-4 py-5 text-center">
                  <span className="block text-sm font-semibold">
                    {tier.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-normal text-muted">
                    {tier.price}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.features.map((feature) => (
              <tr
                key={feature.id}
                className="border-b border-taupe/50 last:border-0"
              >
                <td className="px-6 py-3.5 text-sm text-foreground/80">
                  {feature.label}
                </td>
                {group.tiers.map((tier) => (
                  <td key={tier.id} className="px-4 py-3.5 text-center">
                    <Cell cell={getCell(tier, feature.id)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked per tier */}
      <div className="flex flex-col gap-4 md:hidden">
        {group.tiers.map((tier) => (
          <div
            key={tier.id}
            className="rounded-2xl border border-taupe bg-surface p-5"
          >
            <div className="flex items-baseline justify-between border-b border-taupe/60 pb-3">
              <span className="text-base font-semibold">{tier.name}</span>
              <span className="text-sm text-muted">{tier.price}</span>
            </div>
            <ul className="mt-2">
              {group.features.map((feature) => (
                <li
                  key={feature.id}
                  className="flex items-center justify-between gap-4 border-b border-taupe/40 py-2.5 last:border-0"
                >
                  <span className="text-sm text-foreground/80">
                    {feature.label}
                  </span>
                  <Cell cell={getCell(tier, feature.id)} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export default function PricingComparison() {
  const [category, setCategory] = useState<PricingCategory>("web");
  const group = category === "web" ? WEB_GROUP : LMS_GROUP;

  return (
    <section className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-24">
        <SectionHeading
          center
          eyebrow="Compare"
          title={<>What&rsquo;s included</>}
          sub="Every feature across the tiers, side by side — switch between web and LMS."
        />

        <div className="mt-10 flex justify-center">
          <SegmentedToggle value={category} onChange={setCategory} />
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE_PREMIUM }}
            >
              <ComparisonTable group={group} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
