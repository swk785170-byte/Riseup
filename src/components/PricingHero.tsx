"use client";

import { motion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

export default function PricingHero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-5 pt-36 pb-14 text-center md:px-10 md:pt-52 md:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="mb-7 flex items-center justify-center gap-3 text-[13px] font-bold tracking-[0.4em] text-muted uppercase"
        >
          <span className="inline-block h-px w-8 bg-foreground" />
          Pricing
          <span className="inline-block h-px w-8 bg-foreground" />
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE_PREMIUM }}
          className="text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.03em] text-balance"
        >
         
        </motion.h1>
      </div>
    </section>
  );
}
