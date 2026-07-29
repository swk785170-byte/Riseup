"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronDown } from "lucide-react";
import MagneticButton from "./MagneticButton";
import FloatingLines, { type FloatingLinesProps } from "./FloatingLines";
import { useScrollTo } from "./SmoothScroll";

const PHRASES = [
  "Websites That Feel.",
  "Premium Brands",
  "Systems That Scale.",
] as const;

// Stable, module-level config — its reference never changes across renders, so
// the background never tears down / restarts (the "loop restart" root-cause fix).
const HERO_LINES_CONFIG: FloatingLinesProps = {
  enabledWaves: ["top", "middle", "bottom"],
  lineCount: [6, 9, 12],
  lineDistance: [8, 6, 4],
  linesGradient: ["#0B0B0B", "#3A3A3A", "#C9C4B8"],
  bendRadius: 5.0,
  bendStrength: -0.5,
  interactive: true,
  parallax: true,
  mixBlendMode: "multiply",
};

/**
 * Isolated, memoized background leaf. It takes no changing props, so unrelated
 * state elsewhere on the page (the typewriter's ~15fps setState, the Navbar's
 * scroll-blur toggle, the testimonials marquee) can never cascade a re-render
 * into the animated canvas.
 */
const HeroBackground = React.memo(function HeroBackground() {
  return (
    <div aria-hidden className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,var(--surface)_0%,var(--background)_60%,var(--taupe)_100%)]" />
      <FloatingLines {...HERO_LINES_CONFIG} />
      {/* Brightness scrim so the headline keeps clear, comfortable contrast */}
      <div className="absolute inset-0 bg-background/40" />
      {/* Bottom wash to melt the hero into the next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
});

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
      <HeroBackground />

      {/* --- Copy --- */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pt-24 pb-28 text-center md:px-10">
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

        {/* Capped to ~2 lines via max-width so the CTA never shifts vertically */}
        <p
          data-hero-reveal
          className="mt-8 max-w-md text-base leading-relaxed text-muted opacity-0 md:text-lg"
        >
          A digital studio crafting websites, platforms and IT solutions for
          teams that expect them to just work.
        </p>

        <div data-hero-reveal className="mt-11 opacity-0">
          <MagneticButton
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#contact");
            }}
            className="rounded-full bg-accent px-9 py-4 text-[13px] font-bold tracking-[0.18em] text-background uppercase transition-colors duration-300 hover:bg-charcoal"
          >
            Get a Quote
            <ArrowRight size={16} strokeWidth={2.5} />
          </MagneticButton>
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
