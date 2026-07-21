"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { EASE_PREMIUM } from "@/lib/motion";

export default function ProjectsCTA() {
  return (
    <section className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-4xl px-5 py-24 text-center md:px-10 md:py-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="mb-6 text-[11px] font-bold tracking-[0.3em] text-muted uppercase"
        >
          Have a project in mind?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE_PREMIUM }}
          className="text-[clamp(2rem,5vw,3.6rem)] leading-[1.03] font-medium tracking-[-0.02em] text-balance"
        >
          Let&rsquo;s build the next one.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.18, ease: EASE_PREMIUM }}
          className="mt-11 flex justify-center"
        >
          <MagneticButton
            href="/#contact"
            strength={0.3}
            className="rounded-full bg-foreground px-10 py-4.5 text-[13px] font-bold tracking-[0.18em] text-background uppercase transition-colors duration-300 hover:bg-charcoal"
          >
            Start a Project
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
