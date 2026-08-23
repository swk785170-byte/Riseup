"use client";

import { motion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

export default function FutureSystemsTeaser() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center md:px-10 md:py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-medium tracking-[-0.02em]"
        >
          More Systems, Coming Soon
        </motion.h2>
      </div>
    </section>
  );
}
