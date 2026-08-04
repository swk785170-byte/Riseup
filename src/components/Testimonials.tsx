"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";

type Testimonial = {
  name: string;
  role: string;
  rating: number;
  quote: string;
  /** Monochrome initials-avatar gradient. */
  gradient: [string, string];
  /** Real client photo — falls back to initials until one is supplied. */
  avatarUrl?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Asela Ranasingha",
    role: "Founder, AR",
    rating: 5,
    quote:
      "Rise Up Media rebuilt our site from the ground up and it finally looks like the business we actually are. Inquiries picked up within the first month and it hasn't slowed down since.",
    gradient: ["#0B0B0B", "#3A3A3A"],
  },
  {
    name: "Rajika Wimalarathne",
    role: "Director, Biozone",
    rating: 5,
    quote:
      "What stood out was how little hand-holding it took — they understood what we needed almost immediately and delivered a site that's fast, clean, and easy for our own team to update.",
    gradient: ["#3A3A3A", "#8E8E8E"],
  },
  {
    name: "Wasula Kumarasiri",
    role: "Principal, Wasula Institute",
    rating: 5,
    quote:
      "Moving our classes onto their LMS cut our admin workload dramatically. Attendance, notices, and payments used to eat up hours every week — now it's mostly automatic.",
    gradient: ["#3A3A3A", "#C9C4B8"],
  },
  {
    name: "Sagara Balasooriya",
    role: "Founder, Sagara Academy",
    rating: 5,
    quote:
      "The Smart Card system alone was worth it — attendance that used to take fifteen minutes at the start of every class now takes seconds, and parents get notified instantly.",
    gradient: ["#0B0B0B", "#8E8E8E"],
  },
];

function Avatar({ t }: { t: Testimonial }) {
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
        onError={() => setFailed(true)}
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
    );
  }

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

/** Width-agnostic card — works in the grid and in the marquee alike. */
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-background p-8">
      <div
        className="flex items-center gap-1"
        role="img"
        aria-label={`Rated ${t.rating} out of 5`}
      >
        {[0, 1, 2, 3, 4].map((s) => (
          <Star
            key={s}
            size={14}
            aria-hidden
            className={
              s < t.rating ? "fill-accent text-accent" : "text-taupe"
            }
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
    </figure>
  );
}

function MarqueeRow({ items }: { items: Testimonial[] }) {
  return (
    <div className="flex">
      {items.map((t) => (
        <div
          key={t.name}
          className="mr-6 w-[80vw] shrink-0 sm:w-[360px] lg:w-[400px]"
        >
          <TestimonialCard t={t} />
        </div>
      ))}
    </div>
  );
}

/**
 * Auto-scrolling marquee, kept available for when the testimonial list grows
 * again — a four-item set reads better as the static grid below, so this is
 * not rendered by default.
 */
export function TestimonialsMarquee({
  items = TESTIMONIALS,
}: {
  items?: Testimonial[];
}) {
  return (
    <div className="group relative overflow-hidden">
      <div className="flex w-max animate-marquee [animation-duration:70s] group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]">
        <MarqueeRow items={items} />
        <MarqueeRow items={items} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface to-transparent md:w-24" />
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="about"
      className="overflow-hidden border-t border-border bg-surface/50"
    >
      <div className="mx-auto max-w-7xl px-5 pt-24 pb-24 md:px-10 md:pt-32 md:pb-32">
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

        {/* Four testimonials read better as a static grid than an endless loop */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 xl:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
