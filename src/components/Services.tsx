"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code2,
  Gauge,
  GraduationCap,
  Palette,
  Server,
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
    title: "UI/UX Design",
    description:
      "Research-backed interfaces and design systems — from first wireframe to a polished product your team can actually run.",
    icon: Palette,
    tags: ["UX Research", "Design Systems", "Prototyping"],
  },
  {
    title: "Web Development",
    description:
      "Fast, accessible custom builds on modern tooling. No page builders, no bloat — just software that lasts.",
    icon: Code2,
    tags: ["Next.js & React", "Headless CMS", "APIs"],
  },
  {
    title: "LMS & Smart Student Management",
    description:
      "Complete learning-management and school-administration systems: courses, grading, smart-card attendance and parent portals.",
    icon: GraduationCap,
    tags: ["LMS", "Smart Cards", "Admin"],
  },
  {
    title: "SEO & Performance",
    description:
      "Technical SEO and Core Web Vitals in the green — visibility and speed engineered in, not bolted on afterwards.",
    icon: Gauge,
    tags: ["Technical SEO", "Core Web Vitals", "Analytics"],
  },
  {
    title: "IT Solutions & Support",
    description:
      "We're not just a web agency. Custom apps, systems integrations, internal tools and ongoing technical support — whatever your operation needs.",
    icon: Server,
    tags: ["Custom Apps", "Integrations", "Support"],
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
              Everything your business needs{" "}
              <span className="accent-underline">to win</span>
            </>
          }
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
