"use client";

import { motion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

export default function AboutHero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-7xl px-5 pt-36 pb-20 md:px-10 md:pt-52 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="mb-7 flex items-center gap-4 text-[13px] font-bold tracking-[0.4em] text-muted uppercase"
        >
          <span className="inline-block h-px w-12 bg-foreground" />
          About
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.08, ease: EASE_PREMIUM }}
          className="max-w-4xl text-[clamp(2.6rem,7vw,6rem)] leading-[0.98] font-medium tracking-[-0.03em] text-balance"
        >
          Every Ship Needs A Crew
        </motion.h1>

        {/* <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18, ease: EASE_PREMIUM }}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        >
          A small, senior studio of designers and engineers who sweat the
          details most agencies skip. We take on a handful of clients at a time
          — and treat every build like it carries our name.
        </motion.p> */} 
      </div>
    </section>
  );
}
