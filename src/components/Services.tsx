"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code2,
  Gauge,
  LifeBuoy,
  Palette,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
};

const SERVICES: Service[] = [
  {
    title: "Web Design & UI/UX",
    description:
      "Interfaces that feel inevitable. Research-backed UX, editorial art direction and design systems your team can actually use.",
    icon: Palette,
    tags: ["UX Research", "Design Systems", "Prototyping"],
  },
  {
    title: "Web Development",
    description:
      "Custom builds on Next.js and modern tooling — fast, accessible and maintainable. No page builders, no bloat.",
    icon: Code2,
    tags: ["Next.js & React", "Headless CMS", "API Integrations"],
  },
  {
    title: "E-Commerce Solutions",
    description:
      "Storefronts engineered to sell: frictionless checkout, sub-second loads and merchandising that moves product.",
    icon: ShoppingBag,
    tags: ["Headless Shopify", "Custom Carts", "CRO"],
  },
  {
    title: "SEO & Performance Optimization",
    description:
      "Core Web Vitals in the green and rankings that climb — technical SEO and speed baked into every build, not bolted on.",
    icon: Gauge,
    tags: ["Technical SEO", "Core Web Vitals", "Analytics"],
  },
  {
    title: "Ongoing Support & Maintenance",
    description:
      "A partner after launch: monitoring, iteration and a conversion roadmap that compounds results quarter over quarter.",
    icon: LifeBuoy,
    tags: ["Monitoring", "A/B Testing", "Retainers"],
  },
];

export default function Services() {
  const scope = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-service-card]",
        { autoAlpha: 0, y: 52 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.15,
          stagger: 0.09,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-service-grid]",
            start: "top 80%",
          },
        },
      );
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scope}
      id="services"
      className="border-t border-border bg-surface/50"
    >
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <SectionHeading
          center
          eyebrow="What We Do"
          title={
            <>
              Everything your website needs{" "}
              <span className="accent-underline">to win</span>
            </>
          }
          sub="Five disciplines, one team. We take sites from first sketch to compounding growth — and stay accountable for the results."
        />

        <div
          data-service-grid
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 md:mt-20"
        >
          {SERVICES.map((service, i) => (
            <article
              key={service.title}
              data-service-card
              className={`group relative flex flex-col rounded-2xl border border-border bg-background p-7 opacity-0 transition-all duration-500 ease-premium hover:-translate-y-2 hover:shadow-[0_28px_56px_-28px_rgba(10,10,10,0.28)] md:p-9 ${
                i < 3 ? "lg:col-span-2" : "lg:col-span-3"
              } ${i === 4 ? "sm:col-span-2 lg:col-span-3" : ""}`}
            >
              <div className="mb-8 flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-foreground transition-all duration-500 ease-premium group-hover:border-accent group-hover:bg-accent group-hover:text-background">
                  <service.icon size={21} strokeWidth={1.75} />
                </span>
                <span className="text-[11px] font-bold tracking-[0.2em] text-muted">
                  0{i + 1}
                </span>
              </div>

              <h3 className="text-xl font-semibold tracking-tight md:text-[22px]">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {service.description}
              </p>

              {/* Revealed on hover (always visible on touch layouts) */}
              <div className="mt-7 flex flex-wrap gap-2 transition-all duration-500 ease-premium lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold tracking-wider text-foreground/70 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
