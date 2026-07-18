"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { EASE_PREMIUM } from "@/lib/motion";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  gradient: [string, string];
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dinuka Perera",
    role: "Founder, Alpine Ridge Outfitters",
    quote:
      "Rise Up rebuilt our store and revenue is up 212% in six months. Pages load instantly — customers notice, and so does Google.",
    gradient: ["#3e4a3d", "#c6bba4"],
  },
  {
    name: "Sarah Lindqvist",
    role: "CMO, Vantage Analytics",
    quote:
      "Six weeks from kickoff to launch, and demo bookings jumped 64%. The most decisive, detail-obsessed agency team we’ve worked with.",
    gradient: ["#1f2a44", "#b7c3d4"],
  },
  {
    name: "Amara Osei",
    role: "Managing Partner, Meridian Legal",
    quote:
      "They understood exactly how high-value clients evaluate a firm. Qualified enquiries more than doubled — the site pays for itself every month.",
    gradient: ["#4a3a33", "#cdbfb3"],
  },
  {
    name: "Elena Rossi",
    role: "Founder, Bloom & Root",
    quote:
      "Signup went from five steps to ninety seconds. Subscriptions are up 87% and churn is the lowest it has ever been.",
    gradient: ["#39503c", "#d9c3b4"],
  },
  {
    name: "Marcus Chen",
    role: "Owner, Harbor Kitchen",
    quote:
      "Bookings doubled the month we launched. One team handled everything — design, build, SEO — and still delivered a week early.",
    gradient: ["#8a4b2f", "#e0c9a6"],
  },
];

const GAP = 24;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

function Avatar({ t }: { t: Testimonial }) {
  const initials = t.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <span
      aria-hidden
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-background"
      style={{
        background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})`,
      }}
    >
      {initials}
    </span>
  );
}

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const [bound, setBound] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      const t = trackRef.current;
      if (!c || !t) return;
      const next = Math.max(0, t.scrollWidth - c.clientWidth);
      setBound(next);
      // Keep position valid after resize
      if (x.get() < -next) x.set(-next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [x]);

  useMotionValueEvent(x, "change", (v) => {
    setEdges({ start: v > -8, end: v < -(bound - 8) });
  });

  const page = (dir: 1 | -1) => {
    const card =
      trackRef.current?.querySelector<HTMLElement>("[data-testimonial]");
    const step = card ? card.offsetWidth + GAP : 400;
    const target = clamp(x.get() - dir * step, -bound, 0);
    animate(x, target, { duration: 0.85, ease: EASE_PREMIUM });
  };

  return (
    <section id="about" className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-5 pt-24 md:px-10 md:pt-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Client Stories"
            title={
              <>
                Don&rsquo;t take our word{" "}
                <span className="accent-underline">for it</span>
              </>
            }
            sub="Founders and marketing leads on what changed after launch — traffic, conversions and turnaround, in their own words."
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={edges.start}
              aria-label="Previous testimonials"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={edges.end}
              aria-label="Next testimonials"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Draggable carousel */}
      <div ref={containerRef} className="overflow-hidden pt-14 pb-24 md:pb-32">
        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x }}
          dragConstraints={{ left: -bound, right: 0 }}
          dragElastic={0.07}
          dragTransition={{ power: 0.3, timeConstant: 220 }}
          className="flex w-max cursor-grab gap-6 px-5 select-none active:cursor-grabbing md:px-10"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              data-testimonial
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px -8% 0px 0px" }}
              transition={{
                duration: 0.85,
                delay: (i % 3) * 0.08,
                ease: EASE_PREMIUM,
              }}
              className="flex w-[80vw] shrink-0 flex-col rounded-2xl border border-border bg-background p-8 sm:w-[380px] lg:w-[400px]"
            >
              <div
                className="flex items-center gap-1"
                role="img"
                aria-label="Rated 5 out of 5"
              >
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    aria-hidden
                    className="fill-accent text-accent"
                  />
                ))}
              </div>

              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed font-medium text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-4 border-t border-border pt-6">
                <Avatar t={t} />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
