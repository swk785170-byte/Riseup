"use client";

import { motion } from "framer-motion";
import SmsLogo from "./SmsLogo";
import { EASE_PREMIUM } from "@/lib/motion";

export default function SmartSystemsHero() {
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
          className="mb-8 flex items-center gap-3 text-[12px] font-bold tracking-[0.32em] text-muted uppercase"
        >
          <span className="inline-block h-px w-8 bg-foreground" />
          Industries / Smart Systems
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.06, ease: EASE_PREMIUM }}
          className="mb-10"
        >
          <SmsLogo className="text-[44px] md:text-[64px]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: EASE_PREMIUM }}
          className="text-[clamp(2.2rem,5.5vw,4.25rem)] leading-[1.03] font-medium tracking-[-0.03em] text-balance"
        >
          One ecosystem for everything you run.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE_PREMIUM }}
          className="mt-7 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        >
          The Smart Management System is our umbrella platform — a set of
          specialised systems that share one core, so learning, attendance,
          records and income all speak the same language.
        </motion.p>
      </div>
    </section>
  );
}
