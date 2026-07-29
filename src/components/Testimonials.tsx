"use client";

import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";

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
      "Six weeks from kickoff to launch, and demo bookings jumped 64%. The most decisive, detail-obsessed team we’ve worked with.",
    gradient: ["#1f2a44", "#b7c3d4"],
  },
  {
    name: "Amara Osei",
    role: "Managing Partner, Meridian Legal",
    quote:
      "They understood exactly how high-value clients evaluate a firm. Qualified enquiries more than doubled — it pays for itself every month.",
    gradient: ["#4a3a33", "#cdbfb3"],
  },
  {
    name: "Rukshan Fernando",
    role: "Director, Northgate College",
    quote:
      "The LMS rollout was flawless. Four thousand students, zero drama — and our teachers actually enjoy using it.",
    gradient: ["#233047", "#b9c2d1"],
  },
  {
    name: "Elena Rossi",
    role: "Founder, Bloom & Root",
    quote:
      "Signup went from five steps to ninety seconds. Subscriptions are up 87% and churn is the lowest it has ever been.",
    gradient: ["#39503c", "#d9c3b4"],
  },
  {
    name: "Priya Nair",
    role: "Founder, Sispira",
    quote:
      "They treated our systems project like their own — delivered on time, documented everything, and still pick up the phone months later.",
    gradient: ["#22403a", "#b7c8c1"],
  },
  {
    name: "Marcus Chen",
    role: "Owner, Harbor Kitchen",
    quote:
      "Bookings doubled the month we launched. One team handled everything — design, build, SEO — and still delivered a week early.",
    gradient: ["#8a4b2f", "#e0c9a6"],
  },
  {
    name: "Tom Weller",
    role: "Operations, Biozone",
    quote:
      "Not just a website — they rebuilt how we run internally. The custom tools they shipped save us a full day every single week.",
    gradient: ["#2b302e", "#c3c7c4"],
  },
];

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

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="mr-6 flex w-[80vw] shrink-0 flex-col rounded-2xl border border-border bg-background p-8 sm:w-[360px] lg:w-[400px]">
      <div
        className="flex items-center gap-1"
        role="img"
        aria-label="Rated 5 out of 5"
      >
        {[0, 1, 2, 3, 4].map((s) => (
          <Star key={s} size={14} aria-hidden className="fill-accent text-accent" />
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
    </figure>
  );
}

function MarqueeRow() {
  return (
    <div className="flex">
      {TESTIMONIALS.map((t) => (
        <TestimonialCard key={t.name} t={t} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="about"
      className="overflow-hidden border-t border-border bg-surface/50"
    >
      <div className="mx-auto max-w-7xl px-5 pt-24 md:px-10 md:pt-32">
        <SectionHeading
          eyebrow="Client Stories"
          title={
            <>
              Don&rsquo;t take our word{" "}
              <span className="accent-underline">for it</span>
            </>
          }
          sub="Founders and leads on what changed after launch — traffic, conversions and turnaround, in their own words."
        />
      </div>

      {/* Auto-scrolling marquee — pauses on hover so a card can be read. */}
      <div className="group relative mt-14 overflow-hidden pb-24 md:pb-32">
        <div className="flex w-max animate-marquee [animation-duration:70s] group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]">
          <MarqueeRow />
          <MarqueeRow />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface to-transparent md:w-24" />
      </div>
    </section>
  );
}
