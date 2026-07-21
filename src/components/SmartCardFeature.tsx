"use client";

import { motion } from "framer-motion";
import { DoorOpen, ScanLine, Wallet } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/motion";

const CAPABILITIES = [
  {
    icon: ScanLine,
    title: "Attendance tracking",
    body: "One tap logs presence straight to the student record — no registers, no manual entry.",
  },
  {
    icon: DoorOpen,
    title: "Secure campus access",
    body: "Role-based entry to buildings, labs and exam halls, revocable in a click.",
  },
  {
    icon: Wallet,
    title: "Cashless payments",
    body: "Canteen, library fines and fees, all settled from one topped-up card.",
  },
];

/** Static ID/smart-card mockup — pure CSS, no parallax or cursor effects. */
function SmartCardMock() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-charcoal to-foreground p-6 text-background shadow-[0_30px_60px_-30px_rgba(11,11,11,0.55)]">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-bold tracking-[0.3em] text-background/70 uppercase">
            Student ID
          </span>
          <span aria-hidden className="flex gap-1">
            <span className="block h-3.5 w-0.5 rounded-full bg-background/30" />
            <span className="block h-3.5 w-0.5 rounded-full bg-background/50" />
            <span className="block h-3.5 w-0.5 rounded-full bg-background/70" />
          </span>
        </div>

        {/* Chip */}
        <div className="mt-6 h-9 w-12 rounded-md bg-taupe/80">
          <div className="grid h-full grid-cols-2 gap-px p-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="rounded-[1px] bg-foreground/20" />
            ))}
          </div>
        </div>

        {/* Name block */}
        <div className="mt-8 space-y-2">
          <div className="h-2.5 w-2/5 rounded-full bg-background/80" />
          <div className="h-2 w-1/4 rounded-full bg-background/40" />
        </div>

        {/* Footer */}
        <div className="absolute inset-x-6 bottom-5 flex items-end justify-between">
          <span className="font-black lowercase tracking-[-0.04em] text-background/90">
            riseup
          </span>
          <span className="text-[9px] font-bold tracking-[0.25em] text-background/50 uppercase">
            Smart Campus
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SmartCardFeature() {
  return (
    <section className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          >
            <p className="mb-5 flex items-center gap-2.5 text-[11px] font-bold tracking-[0.3em] text-muted uppercase">
              <span className="inline-block h-px w-8 bg-accent" />
              Standout Feature
            </p>
            <h2 className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-medium tracking-[-0.02em]">
              Smart Card System
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              One card runs the whole campus. Every student and staff member
              carries a single smart card that tracks attendance, unlocks secure
              spaces and handles cashless payments — and every tap writes
              straight back to the LMS.
            </p>

            <ul className="mt-8 flex flex-col gap-5">
              {CAPABILITIES.map((cap) => (
                <li key={cap.title} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground">
                    <cap.icon size={17} strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold tracking-tight">
                      {cap.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{cap.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — static mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_PREMIUM }}
          >
            <SmartCardMock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
