"use client";

import { motion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  center?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col ${center ? "items-center text-center" : "items-start"}`}
    >
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.8, ease: EASE_PREMIUM }}
        className="mb-5 flex items-center gap-2.5 text-[11px] font-bold tracking-[0.3em] text-muted uppercase"
      >
        <span className="inline-block h-px w-8 bg-accent" />
        {eyebrow}
        {center && <span className="inline-block h-px w-8 bg-accent" />}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.9, delay: 0.08, ease: EASE_PREMIUM }}
        className="text-[clamp(2.2rem,5vw,3.9rem)] leading-[1.02] font-medium tracking-[-0.02em] text-balance"
      >
        {title}
      </motion.h2>

      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9, delay: 0.16, ease: EASE_PREMIUM }}
          className={`mt-5 max-w-xl text-base leading-relaxed text-muted ${
            center ? "mx-auto" : ""
          }`}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
