"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { EASE_PREMIUM } from "@/lib/motion";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do you offer payment plans?",
    a: "Yes — most projects are split into a deposit and one or two milestone payments. LMS plans are billed annually, and we can arrange quarterly billing for institutions.",
  },
  {
    q: "What's included in a custom quote?",
    a: "A fixed scope, timeline and price after a short discovery call. You'll see exactly what's built, what it costs and when it ships — no hourly surprises.",
  },
  {
    q: "Can I upgrade my package later?",
    a: "Always. Packages are nested, so moving from Starter to Growth (or Essentials to Professional) only charges the difference plus the new work — nothing is rebuilt.",
  },
  {
    q: "Is hosting included?",
    a: "We set up fast, secure hosting for you and can manage it on a small monthly retainer, or hand over the keys if you'd rather run it yourself.",
  },
  {
    q: "How long does a project take?",
    a: "A Starter site is usually 1–2 weeks; Growth builds run 3–5 weeks; LMS rollouts depend on scale, but most go live within a month.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Yes. Every package includes a warranty window, and Growth / Professional and up include priority or dedicated support.",
  },
];

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-24">
        <SectionHeading center eyebrow="FAQ" title={<>Pricing questions</>} />

        <div className="mt-12">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q} className="border-b border-taupe">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-base font-medium tracking-tight md:text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-muted transition-transform duration-300 ease-premium ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-5 text-sm leading-relaxed text-muted md:text-base">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
