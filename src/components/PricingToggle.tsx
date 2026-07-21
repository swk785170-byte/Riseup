"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { useLenis } from "./SmoothScroll";
import { PRICING_CATEGORIES, type PricingCategory } from "@/lib/pricing";
import { EASE_PREMIUM } from "@/lib/motion";

/**
 * Reusable segmented control (Web / LMS). Presentational + controlled — the
 * top section uses it as a scroll shortcut, the comparison table uses it to
 * switch which table is shown.
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
  const uid = useId();
  return (
    <div
      role="tablist"
      aria-label="Pricing category"
      className={`inline-flex rounded-full border border-taupe bg-surface p-1 ${className}`}
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
            className={`relative rounded-full px-5 py-2.5 text-[12px] font-bold tracking-[0.1em] uppercase transition-colors duration-300 ${
              active ? "text-background" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`${uid}-pill`}
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ duration: 0.4, ease: EASE_PREMIUM }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Section 2 — scroll shortcut to the two pricing groups, with scroll-spy. */
export default function PricingToggle() {
  const [active, setActive] = useState<PricingCategory>("web");
  const lenis = useLenis();

  // Keep the toggle in sync with whichever group is centered in the viewport.
  useEffect(() => {
    const sections = ["web-packages", "lms-packages"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id === "lms-packages" ? "lms" : "web");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleSelect = (value: PricingCategory) => {
    setActive(value);
    const el = document.getElementById(
      value === "web" ? "web-packages" : "lms-packages",
    );
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, {
        offset: -80,
        duration: 1.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="border-t border-border bg-surface/40">
      <div className="mx-auto flex max-w-7xl justify-center px-5 py-8 md:px-10">
        <SegmentedToggle value={active} onChange={handleSelect} />
      </div>
    </section>
  );
}
