"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/motion";

export default function LMSHero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center px-5 pt-36 pb-20 text-center md:px-10 md:pt-44">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="mb-7 flex items-center gap-3 text-[12px] font-bold tracking-[0.32em] text-muted uppercase"
        >
          <span className="inline-block h-px w-8 bg-foreground" />
          Our Services / LMS
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE_PREMIUM }}
          className="text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.03em] text-balance"
        >
          A Learning Management System built for modern institutions.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.16, ease: EASE_PREMIUM }}
          className="mt-7 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        >
          Everything a school or institution needs to manage learning, records
          and admin — in one calm, connected place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.24, ease: EASE_PREMIUM }}
          className="mt-10"
        >
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2.5 rounded-full bg-foreground px-9 py-4 text-[13px] font-bold tracking-[0.18em] text-background uppercase transition-colors duration-300 hover:bg-charcoal"
          >
            Request a Demo
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
