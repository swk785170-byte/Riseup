"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CornerRightDown, Globe, User } from "lucide-react";
import SectionHeading from "./SectionHeading";

type Member = {
  name: string;
  role: string;
  photo: string;
  socials: { instagram: string; linkedin: string; website: string };
};

// TODO: replace the placeholder profile URLs with each member's real accounts.
const TEAM: Member[] = [
  {
    name: "Nejan",
    role: "Co-Founder, Developer",
    photo: "/team/nejm.jpg",
    socials: {
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/in/",
      website: "https://riseupmedia.com",
    },
  },
  {
    name: "Bathila",
    role: "Backend Developer, Tech Lead",
    photo: "/team/bakhta.jpg",
    socials: {
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/in/",
      website: "https://riseupmedia.com",
    },
  },
  {
    name: "Sudam",
    role: "UI Designer, Co-Founder",
    photo: "/team/sida.jpg",
    socials: {
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/in/",
      website: "https://riseupmedia.com",
    },
  },
];

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 scale-90 items-center justify-center rounded-full bg-background/95 text-foreground shadow-md transition-all duration-500 ease-premium hover:bg-foreground hover:text-background group-hover:scale-100"
    >
      {children}
    </a>
  );
}

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

        {/* Hover: social links overlaid on the photo */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-500 ease-premium group-hover:pointer-events-auto group-hover:opacity-100">
          <SocialButton
            href={member.socials.instagram}
            label={`${member.name} on Instagram`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[18px] w-[18px]"
              aria-hidden
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" />
            </svg>
          </SocialButton>
          <SocialButton
            href={member.socials.linkedin}
            label={`${member.name} on LinkedIn`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[18px] w-[18px]"
              aria-hidden
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </SocialButton>
          <SocialButton
            href={member.socials.website}
            label={`${member.name}'s website`}
          >
            <Globe size={18} strokeWidth={1.75} />
          </SocialButton>
        </div>
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
    <section ref={scope}>
      <div className="mx-auto max-w-7xl px-5 pt-36 pb-24 md:px-10 md:pt-52 md:pb-28">
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
