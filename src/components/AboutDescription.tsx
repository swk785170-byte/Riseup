"use client";

import { motion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

export default function AboutDescription() {
  return (
    <section className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-4xl px-5 py-28 md:px-10 md:py-40">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="mb-12 text-center text-[11px] font-bold tracking-[0.35em] text-muted uppercase"
        >
          A bit about Rise Up Media
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 1, delay: 0.08, ease: EASE_PREMIUM }}
          className="relative mx-auto max-w-3xl px-8 py-12 text-center md:px-16"
        >
          {/* Corner brackets — a CSS nod to the wireframe's [ … ] framing */}
          <span
            aria-hidden
            className="absolute top-0 left-0 h-9 w-9 border-t-2 border-l-2 border-taupe"
          />
          <span
            aria-hidden
            className="absolute top-0 right-0 h-9 w-9 border-t-2 border-r-2 border-taupe"
          />
          <span
            aria-hidden
            className="absolute bottom-0 left-0 h-9 w-9 border-b-2 border-l-2 border-taupe"
          />
          <span
            aria-hidden
            className="absolute right-0 bottom-0 h-9 w-9 border-r-2 border-b-2 border-taupe"
          />

          <p className="text-[clamp(1.4rem,3vw,2.15rem)] leading-[1.35] font-medium tracking-[-0.01em] text-balance">
            We started Rise Up Media because most websites are built to look
            busy, not to grow a business. So we work differently — strategy
            first, obsessive craft second, and measurable results as the only
            scoreboard. Small team, senior hands, no filler: just websites that
            earn their keep.
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
