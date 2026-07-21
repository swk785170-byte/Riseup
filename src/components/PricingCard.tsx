"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { PricingTier } from "@/lib/pricing";

export default function PricingCard({
  tier,
  inheritsFrom,
  bullets,
  ctaHref,
}: {
  tier: PricingTier;
  inheritsFrom: string | null;
  bullets: string[];
  ctaHref: string;
}) {
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

      <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
      <p className="mt-2 min-h-[2.75rem] text-sm text-muted">{tier.tagline}</p>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-medium tracking-tight md:text-4xl">
          {tier.price}
        </span>
        {tier.priceNote && (
          <span className="text-xs text-muted">{tier.priceNote}</span>
        )}
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

      <Link
        href={ctaHref}
        className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[12px] font-bold tracking-[0.16em] uppercase transition-colors duration-300 ${
          tier.popular
            ? "bg-foreground text-background hover:bg-charcoal"
            : "border border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground hover:text-background"
        }`}
      >
        {tier.cta}
      </Link>
    </article>
  );
}
