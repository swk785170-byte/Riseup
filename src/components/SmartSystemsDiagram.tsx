"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { EASE_PREMIUM } from "@/lib/motion";

type Node = {
  label: string;
  /** Position as a percentage of the diagram box (desktop only). */
  x: number;
  y: number;
  href?: string;
};

const HUB = { x: 50, y: 50 };

const NODES: Node[] = [
  { label: "Smart Card", x: 50, y: 9 },
  { label: "Parent SMS", x: 85, y: 26 },
  { label: "Income Management", x: 85, y: 68 },
  { label: "LMS", x: 50, y: 91, href: "/services/lms" },
  { label: "Paper Class", x: 14, y: 46 },
];

function NodeCard({ label, href }: { label: string; href?: string }) {
  const className =
    "block rounded-full border border-taupe bg-surface px-5 py-2.5 text-center text-[12px] font-bold tracking-[0.12em] text-foreground uppercase whitespace-nowrap transition-colors duration-300";

  if (href) {
    return (
      <Link
        href={href}
        className={`${className} hover:border-foreground hover:bg-foreground hover:text-background`}
      >
        {label}
      </Link>
    );
  }
  return <span className={className}>{label}</span>;
}

function Hub() {
  return (
    <span className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-foreground text-background md:h-28 md:w-28">
      <span className="text-xl font-black tracking-tight md:text-2xl">SMS</span>
      <span className="mt-0.5 text-[8px] font-bold tracking-[0.16em] text-background/70 uppercase">
        Hub
      </span>
    </span>
  );
}

export default function SmartSystemsDiagram() {
  return (
    <section className="border-t border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <SectionHeading
          center
          eyebrow="The Ecosystem"
          title="How the systems connect"
          sub="SMS sits at the centre. Each module plugs into the same core, so data moves between them without a single spreadsheet in sight."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: EASE_PREMIUM }}
          className="mt-14 md:mt-16"
        >
          {/* Desktop — radial diagram */}
          <div className="relative mx-auto hidden h-[560px] max-w-3xl md:block">
            {/* Connector lines. preserveAspectRatio="none" keeps the line ends
                locked to the same percentage coordinates as the nodes; straight
                lines stay straight, and the stroke width is unscaled. */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              {NODES.map((node) => (
                <line
                  key={node.label}
                  x1={HUB.x}
                  y1={HUB.y}
                  x2={node.x}
                  y2={node.y}
                  stroke="#C9C4B8"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {/* Hub */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
            >
              <Hub />
            </div>

            {/* Surrounding nodes */}
            {NODES.map((node) => (
              <div
                key={node.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <NodeCard label={node.label} href={node.href} />
              </div>
            ))}
          </div>

          {/* Mobile — single column, hub at the top */}
          <div className="flex flex-col items-center md:hidden">
            <Hub />
            {NODES.map((node) => (
              <div key={node.label} className="flex flex-col items-center">
                <span aria-hidden className="h-8 w-px bg-taupe" />
                <NodeCard label={node.label} href={node.href} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
