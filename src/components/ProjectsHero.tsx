"use client";

import { motion } from "framer-motion";
import { SITE_STATS } from "@/lib/stats";
import { EASE_PREMIUM } from "@/lib/motion";

const HEADLINE_STATS = SITE_STATS.slice(0, 3);

export default function ProjectsHero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-7xl px-5 pt-36 pb-16 md:px-10 md:pt-52 md:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="mb-7 flex items-center gap-4 text-[13px] font-bold tracking-[0.4em] text-muted uppercase"
        >
          <span className="inline-block h-px w-12 bg-foreground" />
          Projects
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.08, ease: EASE_PREMIUM }}
          className="max-w-4xl text-[clamp(2.6rem,7vw,6rem)] leading-[0.98] font-medium tracking-[-0.03em] text-balance"
        >
          Work we&rsquo;re proud to have built.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18, ease: EASE_PREMIUM }}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        >
          The full archive — storefronts, web apps, brand sites and search
          engines rebuilt. Every one shipped with numbers attached. Filter by
          discipline, or open any project for the full case study.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28, ease: EASE_PREMIUM }}
          className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm"
        >
          {HEADLINE_STATS.map((stat, i) => (
            <span key={stat.label} className="flex items-center gap-3">
              {i > 0 && <span className="text-taupe">·</span>}
              <span>
                <span className="font-bold tabular-nums">
                  {stat.value}
                  {stat.suffix}
                </span>{" "}
                <span className="text-muted">{stat.label}</span>
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
