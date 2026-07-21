"use client";

import { motion } from "framer-motion";
import { Database, MessageSquare, Server, type LucideIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { EASE_PREMIUM } from "@/lib/motion";

type Tech = { name: string; sub: string; icon: LucideIcon };

const TECH: Tech[] = [
  { name: "Notify SMS", sub: "SMS & alerts", icon: MessageSquare },
  { name: "PostgreSQL", sub: "Database", icon: Database },
  { name: "Next.js", sub: "Web platform", icon: Server },
];

export default function LMSTechStack() {
  return (
    <section className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-28">
        <SectionHeading
          center
          eyebrow="What We Use"
          title={<>The tech behind the platform</>}
          sub="Reliable, boring-in-the-best-way infrastructure — the integrations that keep the LMS fast, connected and always on."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="mt-14 flex flex-wrap justify-center gap-5 md:mt-16"
        >
          {TECH.map((tech) => (
            <div
              key={tech.name}
              className="flex h-28 min-w-[220px] flex-1 items-center justify-center gap-4 rounded-2xl border border-taupe bg-surface grayscale transition-all duration-500 ease-premium hover:grayscale-0 sm:max-w-xs"
            >
              <tech.icon size={24} strokeWidth={1.5} className="text-charcoal" />
              <div className="text-left">
                <p className="text-base font-bold tracking-tight">{tech.name}</p>
                <p className="text-[11px] font-semibold tracking-[0.15em] text-muted uppercase">
                  {tech.sub}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-xs text-muted">
          Partner &amp; technology logos are placeholders — swap in the real
          marks once supplied.
        </p>
      </div>
    </section>
  );
}
