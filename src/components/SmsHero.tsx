"use client";

import { motion } from "framer-motion";
import SmsLogo from "./SmsLogo";
import { EASE_PREMIUM } from "@/lib/motion";

/**
 * Logo-only hero — no headline, no supporting copy. Used on the *static* path
 * only (below `lg`, or when the visitor asks for reduced motion), where there
 * is no scroll-scrubbed handoff. On the animated desktop path this hero state
 * is the diagram stage at scroll progress 0, so the logo is a single element
 * rather than a hero copy plus a hub copy.
 */
export default function SmsHero() {
  return (
    <section
      id="top"
      className="flex min-h-screen items-center justify-center px-5 md:px-10"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: EASE_PREMIUM }}
      >
        {/* ~36vw on desktop, floored so it stays substantial on phones. */}
        <SmsLogo priority className="h-[clamp(52px,12vw,168px)] w-auto" />
      </motion.div>
    </section>
  );
}
