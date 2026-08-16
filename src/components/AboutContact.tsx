"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { useSiteSettings } from "./SettingsProvider";
import { EASE_PREMIUM } from "@/lib/motion";

export default function AboutContact() {
  const { email, whatsappNumber } = useSiteSettings();
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi Riseup Solutions, I'd like to talk about a project.",
  )}`;

  return (
    <section
      id="about-contact"
      className="relative overflow-hidden border-t border-border"
    >
      {/* Soft taupe glow, consistent with the homepage contact section */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-float-a absolute top-1/4 -left-20 h-80 w-80 rounded-full bg-taupe/40 blur-3xl" />
        <div className="animate-float-b absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-taupe/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-28 text-center md:px-10 md:py-40">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM }}
          className="mb-6 text-[11px] font-bold tracking-[0.3em] text-muted uppercase"
        >
          Prefer to reach out directly?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, delay: 0.08, ease: EASE_PREMIUM }}
          className="text-[clamp(2.2rem,5.5vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.02em] text-balance"
        >
          Let&rsquo;s start a conversation.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.18, ease: EASE_PREMIUM }}
          className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          {/* Email — primary filled pill */}
          <MagneticButton
            href={`mailto:${email}`}
            strength={0.2}
            ariaLabel={`Email ${email}`}
            className="w-full rounded-full bg-foreground px-8 py-4 text-sm font-semibold tracking-tight text-background transition-colors duration-300 hover:bg-charcoal sm:w-auto"
          >
            <Mail size={17} strokeWidth={2} />
            hello@riseupmedia.com
          </MagneticButton>

          {/* WhatsApp — secondary outline pill, opens in a new tab */}
          <MagneticButton
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            strength={0.2}
            ariaLabel="Message Riseup Solutions on WhatsApp"
            className="group w-full rounded-full border border-foreground/25 px-8 py-4 text-sm font-semibold tracking-tight text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background sm:w-auto"
          >
            <MessageCircle size={17} strokeWidth={2} />
            Chat on WhatsApp
            <ArrowUpRight
              size={14}
              strokeWidth={2.5}
              className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </MagneticButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE_PREMIUM }}
          className="mt-8 text-sm text-muted"
        >
          Based worldwide, working remotely — we reply within 24 hours.
        </motion.p>
      </div>
    </section>
  );
}
