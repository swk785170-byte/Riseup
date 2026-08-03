"use client";

import { motion, type Variants } from "framer-motion";
import SectionHeading from "./SectionHeading";
import PricingCard from "./PricingCard";
import { WEB_GROUP, getTierBullets } from "@/lib/pricing";
import { EASE_PREMIUM } from "@/lib/motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_PREMIUM } },
};

export default function WebPricing() {
  return (
    // First section on /pricing — top padding clears the fixed navbar.
    <section id="web-packages" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 pt-36 pb-20 md:px-10 md:pt-52 md:pb-24">
        <SectionHeading
          center
          eyebrow="Web Packages"
          title={WEB_GROUP.heading}
          sub={WEB_GROUP.sub}
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-14 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3"
        >
          {WEB_GROUP.tiers.map((tier, i) => {
            const { inheritsFrom, bullets } = getTierBullets(WEB_GROUP, i);
            return (
              <motion.div key={tier.id} variants={item} className="h-full">
                <PricingCard
                  tier={tier}
                  inheritsFrom={inheritsFrom}
                  bullets={bullets}
                  ctaHref="/#contact"
                />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted"
        >
          {WEB_GROUP.addOnNote}
        </motion.p>
      </div>
    </section>
  );
}
