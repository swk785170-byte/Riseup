"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CornerRightDown, User } from "lucide-react";
import SectionHeading from "./SectionHeading";

type Member = {
  name: string;
  role: string;
  photo: string;
};

const TEAM: Member[] = [
  { name: "Nejm S.", role: "Co-Founder, Developer", photo: "/team/nejm.jpg" },
  {
    name: "Bakhta",
    role: "Backend Developer, Tech Lead",
    photo: "/team/bakhta.jpg",
  },
  { name: "Sida", role: "UI Designer, Co-Founder", photo: "/team/sida.jpg" },
];

/**
 * Photo frame that shows an elegant placeholder until a real image exists at
 * `member.photo`. Drop a JPG at that path (e.g. /public/team/nejm.jpg) and it
 * takes over automatically — no code changes required.
 */
function TeamCard({ member }: { member: Member }) {
  const [failed, setFailed] = useState(false);

  return (
    <article
      data-team-card
      className="group flex flex-col opacity-0"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Placeholder underneath the photo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-charcoal to-foreground">
          <User size={52} strokeWidth={1.25} className="text-taupe/70" />
          <span className="px-6 text-center text-[11px] font-bold tracking-[0.3em] text-taupe/70 uppercase">
            {member.name}
          </span>
        </div>

        {!failed && (
          <Image
            src={member.photo}
            alt={`${member.name} — ${member.role}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setFailed(true)}
            className="relative object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.05]"
          />
        )}

        {/* Subtle darken on hover for depth */}
        <div className="pointer-events-none absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/10" />
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            {member.name}
          </h3>
          <p className="mt-1 text-sm text-muted">{member.role}</p>
        </div>
        <span className="mt-2 h-px w-8 shrink-0 origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-premium group-hover:scale-x-100" />
      </div>
    </article>
  );
}

export default function Team() {
  const scope = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-team-card]",
        { autoAlpha: 0, y: 48 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.15,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-team-grid]",
            start: "top 80%",
          },
        },
      );
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={scope} className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Meet Our Team"
            title={
              <>
                The crew behind{" "}
                <span className="accent-underline">the work</span>
              </>
            }
            sub="Three people, one standard. You'll talk to the people actually designing and building your site — no account managers, no handoffs."
          />

          {/* Decorative annotation pointing at the photo grid (per wireframe) */}
          <div
            aria-hidden
            className="hidden items-center gap-2 pb-3 text-muted md:flex"
          >
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase">
              Photos
            </span>
            <CornerRightDown size={18} strokeWidth={1.75} />
          </div>
        </div>

        <div
          data-team-grid
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-20"
        >
          {TEAM.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
