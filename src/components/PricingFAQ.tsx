"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { FAQS } from "@/lib/faqs";
import { EASE_PREMIUM } from "@/lib/motion";


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
