"use client";

import { motion } from "framer-motion";
import SmsLogo from "./SmsLogo";
import { EASE_PREMIUM } from "@/lib/motion";

/**
 * Text-first header for /services/smart-systems — no canvas or shader
 * background, matching the LMS page's calm register. The mark is rendered by
 * `SmsLogo` (the component form of public/logo/sms-logo.svg) so it inherits the
 * page's type and `currentColor` instead of loading a second copy as an image.
 */
export default function SmsHero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center px-5 pt-36 pb-20 text-center md:px-10 md:pt-48 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
        >
          <SmsLogo className="text-[38px] md:text-[52px]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: EASE_PREMIUM }}
          className="mt-12 text-[clamp(2.4rem,6.5vw,5rem)] leading-[1.0] font-medium tracking-[-0.03em] text-balance"
        >
          One Ecosystem.
          <br />
          Every System Connected.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE_PREMIUM }}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        >
          SMS is the Riseup Solutions umbrella platform — the layer that ties
          every system below into one connected whole, so your institution runs
          on shared data instead of separate tools.
        </motion.p>
      </div>
    </section>
  );
}
