"use client";

import { motion, type Variants } from "framer-motion";
import { FileText, GraduationCap, UserPlus, type LucideIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { EASE_PREMIUM } from "@/lib/motion";

type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
};

const SERVICES: Service[] = [
  {
    title: "LMS",
    description:
      "The core platform — courses, grading, attendance and clear analytics dashboards for teachers, students and admins alike.",
    icon: GraduationCap,
    tags: ["Courses", "Grading", "Dashboards"],
  },
  {
    title: "Paper Class System",
    description:
      "Turns traditional paper-based classroom records and workflows into structured, trackable digital data — without changing how teachers already work.",
    icon: FileText,
    tags: ["Digitised Records", "Workflows", "Tracking"],
  },
  {
    title: "Student Registration System",
    description:
      "Streamlined enrolment and student record management, from first application through to admission in a single, guided flow.",
    icon: UserPlus,
    tags: ["Enrolment", "Records", "Onboarding"],
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_PREMIUM },
  },
};

export default function LMSServices() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-28">
        <SectionHeading
          center
          eyebrow="Our Services"
          title={
            <>
              Three systems,{" "}
              <span className="accent-underline">one platform</span>
            </>
          }
          sub="Adopt the whole suite or start with the piece you need most — each part works on its own and slots into the same connected core."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-12% 0px" }}
          className="mt-14 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-3"
        >
          {SERVICES.map((service, i) => (
            <motion.article
              key={service.title}
              variants={card}
              className="group flex flex-col rounded-2xl border border-border bg-background p-7 transition-all duration-500 ease-premium hover:-translate-y-2 hover:shadow-[0_28px_56px_-28px_rgba(10,10,10,0.28)] md:p-9"
            >
              <div className="mb-8 flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-foreground transition-all duration-500 ease-premium group-hover:border-accent group-hover:bg-accent group-hover:text-background">
                  <service.icon size={21} strokeWidth={1.75} />
                </span>
                <span className="text-[11px] font-bold tracking-[0.2em] text-muted">
                  0{i + 1}
                </span>
              </div>

              <h3 className="text-xl font-semibold tracking-tight md:text-[22px]">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {service.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold tracking-wider text-foreground/70 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
