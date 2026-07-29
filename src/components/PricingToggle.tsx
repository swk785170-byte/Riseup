"use client";

import { PRICING_CATEGORIES, type PricingCategory } from "@/lib/pricing";

/**
 * Reusable segmented control (Web / LMS) — two clean standalone pill buttons,
 * no container box. Active is a solid #0B0B0B fill; inactive is a #C9C4B8
 * outline. Used by the pricing comparison table to switch which table is shown.
 */
export function SegmentedToggle({
  value,
  onChange,
  className = "",
}: {
  value: PricingCategory;
  onChange: (value: PricingCategory) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Pricing category"
      className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
    >
      {PRICING_CATEGORIES.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-6 py-2.5 text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-300 ease-premium ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-taupe text-foreground/60 hover:border-foreground hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
