"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronDown } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { useScrollTo } from "./SmoothScroll";

const PHRASES = [
  "Websites That Convert.",
  "Brands That Stand Out.",
  "Growth That Compounds.",
] as const;

/** Types, holds, deletes and cycles through the given phrases. */
function useTypewriter(
  phrases: readonly string[],
  typeMs = 68,
  deleteMs = 34,
  holdMs = 2100,
): string {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState({ index: 0, deleting: false });

  useEffect(() => {
    const current = phrases[phase.index];
    const done = text === current;
    const delay = phase.deleting ? deleteMs : done ? holdMs : typeMs;

    const id = window.setTimeout(() => {
      if (!phase.deleting) {
        if (!done) setText(current.slice(0, text.length + 1));
        else setPhase((p) => ({ ...p, deleting: true }));
      } else if (text.length > 0) {
        setText(current.slice(0, text.length - 1));
      } else {
        setPhase((p) => ({
          index: (p.index + 1) % phrases.length,
          deleting: false,
        }));
      }
    }, delay);

    return () => window.clearTimeout(id);
  }, [text, phase, phrases, typeMs, deleteMs, holdMs]);

  return text;
}

export default function Hero() {
  const scope = useRef<HTMLElement | null>(null);
  const scrollTo = useScrollTo();
  const typed = useTypewriter(PHRASES);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-reveal]",
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.3,
          stagger: 0.11,
          delay: 0.2,
          ease: "power4.out",
        },
      );
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scope}
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* --- Background: washed-out video under a halftone ink screen --- */}
      <div aria-hidden className="absolute inset-0">
        {/* Depth fallback if the video hasn't loaded yet */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,var(--surface)_0%,var(--background)_55%,var(--taupe)_100%)]" />
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-[0.85] mix-blend-luminosity"
          src="/hero_bg_web_dev.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        {/* Printed-ink halftone dot screen */}
        <div className="halftone absolute inset-0" />
        {/* Wash so type stays legible and the section melts into the next */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/20 to-background" />
      </div>

      {/* --- Copy --- */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pt-24 pb-28 text-center md:px-10">
        <p
          data-hero-reveal
          className="mb-7 flex items-center gap-2.5 text-[11px] font-bold tracking-[0.3em] text-foreground/70 uppercase opacity-0"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          Web Development Agency
        </p>

        <h1
          data-hero-reveal
          className="text-[clamp(2.75rem,8.5vw,7.25rem)] leading-[0.98] font-medium tracking-[-0.03em] text-balance opacity-0"
        >
          <span className="block">We Build</span>
          <span className="block min-h-[2.1em] md:min-h-[1.1em]">
            {typed}
            <span aria-hidden className="caret animate-blink" />
          </span>
        </h1>

        <p
          data-hero-reveal
          className="mt-8 max-w-xl text-base leading-relaxed text-muted opacity-0 md:text-lg"
        >
          Rise Up Media is a web development studio for ambitious businesses —
          strategy, design and engineering that turn visitors into customers.
        </p>

        <div
          data-hero-reveal
          className="mt-11 flex flex-col items-center gap-6 opacity-0 sm:flex-row"
        >
          <MagneticButton
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#contact");
            }}
            className="rounded-full bg-accent px-9 py-4 text-[13px] font-bold tracking-[0.18em] text-background uppercase transition-colors duration-300 hover:bg-charcoal"
          >
            Start Your Project
            <ArrowRight size={16} strokeWidth={2.5} />
          </MagneticButton>

          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#work");
            }}
            className="group text-[12px] font-semibold tracking-[0.18em] text-foreground/70 uppercase transition-colors duration-300 hover:text-foreground"
          >
            See Our Work
            <span className="mt-1 block h-px w-full origin-left scale-x-100 bg-accent transition-transform duration-500 ease-premium group-hover:scale-x-50" />
          </a>
        </div>
      </div>

      {/* --- Scroll cue --- */}
      <button
        type="button"
        onClick={() => scrollTo("#services")}
        aria-label="Scroll down"
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-foreground/50 transition-colors duration-300 hover:text-foreground"
      >
        <ChevronDown className="animate-bounce" size={26} strokeWidth={1.75} />
      </button>
    </section>
  );
}
