"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { EASE_PREMIUM } from "@/lib/motion";

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

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 py-32 text-center md:px-10 md:py-44">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="mb-8 flex items-center gap-2.5 text-[11px] font-bold tracking-[0.3em] text-accent uppercase"
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Ready when you are
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, delay: 0.08, ease: EASE_PREMIUM }}
          className="text-[clamp(2.6rem,7.5vw,6.75rem)] leading-[0.98] font-medium tracking-[-0.03em] text-balance text-foreground"
        >
          Let&rsquo;s Grow Your
          <br />
          Business Online.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.18, ease: EASE_PREMIUM }}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        >
          Tell us where your business needs to go — we&rsquo;ll map the website
          that gets it there. Free 30-minute strategy call, no obligation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.28, ease: EASE_PREMIUM }}
          className="mt-12 flex flex-col items-center gap-7"
        >
          <MagneticButton
            href="mailto:hello@riseupmedia.com?subject=New%20project"
            strength={0.4}
            className="rounded-full bg-accent px-12 py-5 text-[13px] font-bold tracking-[0.2em] text-background uppercase shadow-[0_20px_50px_-20px_rgba(11,11,11,0.45)] transition-colors duration-300 hover:bg-charcoal"
          >
            Start a Project
            <ArrowUpRight size={17} strokeWidth={2.5} />
          </MagneticButton>

          <p className="text-sm text-muted">
            <a
              href="mailto:hello@riseupmedia.com"
              className="font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4 transition-colors duration-300 hover:text-accent"
            >
              hello@riseupmedia.com
            </a>{" "}
            — we reply within 24 hours
          </p>
        </motion.div>
      </div>
    </section>
  );
}
