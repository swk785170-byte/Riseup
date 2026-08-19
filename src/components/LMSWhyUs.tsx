"use client";

import { motion, type Variants } from "framer-motion";
import { Headphones, MousePointerClick, ShieldCheck, Signal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { EASE_PREMIUM } from "@/lib/motion";

type Benefit = { title: string; body: string; icon: LucideIcon };

const BENEFITS: Benefit[] = [
  {
    title: "Reliable when it matters",
    body: "Built to stay up through the Monday-morning rush, when every class logs in at once.",
    icon: Signal,
  },
  {
    title: "Support that answers",
    body: "A named team you can actually reach — same-day on standard plans, within hours on Premium.",
    icon: Headphones,
  },
  {
    title: "Simple for non-technical staff",
    body: "Teachers and office staff run it themselves after one short walkthrough. No IT department required.",
    icon: MousePointerClick,
  },
  {
    title: "Your data stays yours",
    body: "Role-based admin access, encrypted storage and regular backups — student records handled properly.",
    icon: ShieldCheck,
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_PREMIUM } },
};

export default function LMSWhyUs() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-28">
        <SectionHeading
          center
          eyebrow="Why Us"
          title="Why institutions choose our LMS"
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4"
        >
          {BENEFITS.map((benefit) => (
            <motion.article
              key={benefit.title}
              variants={item}
              className="flex flex-col rounded-2xl border border-border bg-background p-7"
            >
              <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-border text-foreground">
                <benefit.icon size={19} strokeWidth={1.75} />
              </span>
              <h3 className="text-base font-semibold tracking-tight">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {benefit.body}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
