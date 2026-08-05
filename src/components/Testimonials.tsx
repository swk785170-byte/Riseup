"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { SEED_TESTIMONIALS, type Testimonial } from "@/lib/testimonials";

/** Monochrome initials-avatar gradients, cycled by position. */
const AVATAR_GRADIENTS: [string, string][] = [
  ["#0B0B0B", "#3A3A3A"],
  ["#3A3A3A", "#8E8E8E"],
  ["#3A3A3A", "#C9C4B8"],
  ["#0B0B0B", "#8E8E8E"],
];

function Avatar({ t, index }: { t: Testimonial; index: number }) {
  const [failed, setFailed] = useState(false);
  const initials = t.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  if (t.avatarUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={t.avatarUrl}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }

  const [from, to] = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  return (
    <span
      aria-hidden
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-background"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials}
    </span>
  );
}

/** Compact card — tighter padding and type keep the marquee band short. */
function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-background p-6">
      <div
        className="flex items-center gap-1"
        role="img"
        aria-label={`Rated ${t.rating} out of 5`}
      >
        {[0, 1, 2, 3, 4].map((s) => (
          <Star
            key={s}
            size={13}
            aria-hidden
            className={s < t.rating ? "fill-accent text-accent" : "text-taupe"}
          />
        ))}
      </div>

      <blockquote className="mt-4 flex-1 text-sm leading-relaxed font-medium text-foreground/90">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-5">
        <Avatar t={t} index={index} />
        <div>
          <p className="text-sm font-semibold">{t.name}</p>
          <p className="mt-0.5 text-xs text-muted">{t.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

function MarqueeRow({ items }: { items: Testimonial[] }) {
  return (
    <div className="flex items-stretch">
      {items.map((t, i) => (
        <div
          key={t.id}
          className="mr-5 w-[78vw] shrink-0 sm:w-[340px] lg:w-[370px]"
        >
          <TestimonialCard t={t} index={i} />
        </div>
      ))}
    </div>
  );
}

export default function Testimonials({
  testimonials = SEED_TESTIMONIALS,
}: {
  testimonials?: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section
      id="about"
      className="overflow-hidden border-t border-border bg-surface/50"
    >
      <div className="mx-auto max-w-7xl px-5 pt-20 md:px-10 md:pt-24">
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
      <div className="group relative mt-10 overflow-hidden pb-20 md:mt-12 md:pb-24">
        <div className="flex w-max animate-marquee [animation-duration:60s] group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]">
          <MarqueeRow items={testimonials} />
          <MarqueeRow items={testimonials} />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface to-transparent md:w-24" />
      </div>
    </section>
  );
}
