"use client";

import { Check } from "lucide-react";
import { displayOriginalPrice, type PricingTier } from "@/lib/pricing";

export default function PricingCard({
  tier,
  inheritsFrom,
  bullets,
}: {
  tier: PricingTier;
  inheritsFrom: string | null;
  bullets: string[];
}) {
  // Presentational only — the real, quoted price stays `tier.price`.
  const original = displayOriginalPrice(tier);

  return (
    <article
      className={`group relative flex h-full flex-col rounded-2xl bg-background p-7 transition-all duration-500 ease-premium hover:-translate-y-1.5 md:p-8 ${
        tier.popular
          ? "border-2 border-foreground/25 shadow-[0_28px_56px_-28px_rgba(11,11,11,0.3)]"
          : "border border-border hover:shadow-[0_24px_48px_-28px_rgba(11,11,11,0.22)]"
      }`}
    >
      {tier.popular && (
        <span className="absolute -top-3 left-7 rounded-full bg-foreground px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-background uppercase">
          Most Popular
        </span>
      )}

      {tier.discountPercent && original && (
        <span className="absolute top-6 right-6 rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-charcoal uppercase md:top-7 md:right-7">
          {tier.discountPercent}% Off
        </span>
      )}

      {/* pr-20 keeps a long tier name clear of the badge above it. */}
      <h3 className="pr-20 text-lg font-semibold tracking-tight">{tier.name}</h3>
      <p className="mt-2 min-h-[2.75rem] text-sm text-muted">{tier.tagline}</p>

      <div className="mt-5">
        {original && (
          <span className="block text-sm leading-none text-muted line-through">
            {original}
          </span>
        )}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-3xl font-medium tracking-tight md:text-4xl">
            {tier.price}
          </span>
        </div>
      </div>

      <div className="my-6 h-px w-full bg-border" />

      {inheritsFrom && (
        <p className="mb-3 text-[12px] font-semibold tracking-tight text-foreground/70">
          Everything in {inheritsFrom}, plus:
        </p>
      )}
      <ul className="flex flex-1 flex-col gap-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-sm">
            <Check
              size={16}
              strokeWidth={2.5}
              className="mt-0.5 shrink-0 text-foreground"
            />
            <span className="text-foreground/80">{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
