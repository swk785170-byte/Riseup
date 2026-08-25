"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { EASE_PREMIUM } from "@/lib/motion";

export default function GetQuoteCTA() {
  return (
    <section id="get-quote" className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="mb-6 text-[11px] font-bold tracking-[0.3em] text-muted uppercase"
        >
          Need something bespoke?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE_PREMIUM }}
          className="text-[clamp(2rem,5vw,3.6rem)] leading-[1.03] font-medium tracking-[-0.02em] text-balance"
        >
          Need something that doesn&rsquo;t fit a package? Let&rsquo;s talk.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.18, ease: EASE_PREMIUM }}
          className="mt-11 flex justify-center"
        >
          <MagneticButton
            // The contact form now lives further down this same page.
            href="#contact"
            strength={0.4}
            className="rounded-full bg-foreground px-10 py-4.5 text-[13px] font-bold tracking-[0.18em] text-background uppercase transition-colors duration-300 hover:bg-charcoal"
          >
            Get a Quote
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
