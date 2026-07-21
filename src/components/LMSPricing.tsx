"use client";

import { motion, type Variants } from "framer-motion";
import SectionHeading from "./SectionHeading";
import PricingCard from "./PricingCard";
import { LMS_GROUP, getTierBullets } from "@/lib/pricing";
import { EASE_PREMIUM } from "@/lib/motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_PREMIUM } },
};

export default function LMSPricing() {
  return (
    <section id="lms-packages" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
        <SectionHeading
          center
          eyebrow="LMS & Student Management"
          title={LMS_GROUP.heading}
          sub={LMS_GROUP.sub}
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-14 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3"
        >
          {LMS_GROUP.tiers.map((tier, i) => {
            const { inheritsFrom, bullets } = getTierBullets(LMS_GROUP, i);
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
      </div>
    </section>
  );
}
