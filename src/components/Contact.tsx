"use client";

import { motion } from "framer-motion";
import ContactForm from "./ContactForm";
import { EASE_PREMIUM } from "@/lib/motion";

/**
 * Closing contact section. The form is always visible inline (no "Get a Quote"
 * gate), laid out beside the headline on wide screens and stacked beneath it on
 * narrow ones. The switch happens at `lg` rather than `md` so tablet portrait
 * gets the full width instead of squeezing Name/Email into a half column.
 */
export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border bg-background"
    >
      {/* Animated accent gradients behind the headline */}
      <div aria-hidden className="absolute inset-0">
        <div className="animate-pulse [animation-duration:7s]">
          <div className="animate-float-a absolute top-[12%] -left-24 h-[26rem] w-[26rem] rounded-full bg-taupe/60 blur-3xl md:h-[34rem] md:w-[34rem]" />
        </div>
        <div className="animate-pulse [animation-duration:9s]">
          <div className="animate-float-b absolute -right-28 bottom-[8%] h-[24rem] w-[24rem] rounded-full bg-taupe/50 blur-3xl md:h-[30rem] md:w-[30rem]" />
        </div>
        <div className="animate-float-b absolute top-[55%] left-[38%] h-56 w-56 rounded-full bg-taupe/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 py-28 md:px-10 md:py-36 lg:grid-cols-2 lg:gap-16">
        {/* Left — eyebrow + headline only */}
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: EASE_PREMIUM }}
            className="mb-8 flex items-center justify-center gap-2.5 text-[11px] font-bold tracking-[0.3em] text-accent uppercase lg:justify-start"
          >
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Ready when you are
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, delay: 0.08, ease: EASE_PREMIUM }}
            className="text-[clamp(2.4rem,6vw,5rem)] leading-[0.98] font-medium tracking-[-0.03em] text-balance text-foreground"
          >
            Let&rsquo;s Take
            <br />
            You Online.
          </motion.h2>
        </div>

        {/* Right — the form, always visible */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.16, ease: EASE_PREMIUM }}
          className="w-full"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
