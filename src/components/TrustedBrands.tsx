"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import {
  Anchor,
  Compass,
  Hexagon,
  Layers,
  Mountain,
  Orbit,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { EASE_PREMIUM } from "@/lib/motion";
import { SITE_STATS, type Stat } from "@/lib/stats";

type Brand = { name: string; icon: LucideIcon };

const BRANDS: Brand[] = [
  { name: "ORBITAL", icon: Orbit },
  { name: "NORTHPEAK", icon: Mountain },
  { name: "STRATA", icon: Layers },
  { name: "HARBOR & CO", icon: Anchor },
  { name: "VOLTIC", icon: Zap },
  { name: "TIDEWATER", icon: Waves },
  { name: "TRUENORTH", icon: Compass },
  { name: "HEXWARE", icon: Hexagon },
];

function MarqueeRow() {
  return (
    <div className="flex items-center gap-16 pr-16 md:gap-24 md:pr-24">
      {BRANDS.map((brand) => (
        <div
          key={brand.name}
          className="flex items-center gap-3 opacity-40 grayscale transition-all duration-500 ease-premium hover:opacity-100 hover:grayscale-0"
        >
          <brand.icon size={20} strokeWidth={1.75} className="text-accent" />
          <span className="text-sm font-bold tracking-[0.22em] whitespace-nowrap">
            {brand.name}
          </span>
        </div>
      ))}
    </div>
  );
}

function Counter({ stat, withDivider }: { stat: Stat; withDivider: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, stat.value, {
      duration: 2.2,
      ease: EASE_PREMIUM,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, stat.value]);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center gap-2 px-4 text-center md:px-12 ${
        withDivider ? "md:border-l md:border-border" : ""
      }`}
    >
      <span className="text-4xl font-medium tracking-tight tabular-nums md:text-5xl">
        {display}
        <span className="text-accent">{stat.suffix}</span>
      </span>
      <span className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
        {stat.label}
      </span>
    </div>
  );
}

export default function TrustedBrands({
  variant = "marquee",
}: {
  variant?: "marquee" | "stats";
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: EASE_PREMIUM }}
      className="relative border-t border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-14">
        <p className="mb-8 text-center text-[11px] font-bold tracking-[0.3em] text-muted uppercase">
          Trusted by forward-thinking brands
        </p>

        {variant === "marquee" ? (
          <div className="group relative overflow-hidden">
            <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
              <MarqueeRow />
              <MarqueeRow />
            </div>
            {/* Edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {SITE_STATS.map((stat, i) => (
              <Counter key={stat.label} stat={stat} withDivider={i > 0} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
