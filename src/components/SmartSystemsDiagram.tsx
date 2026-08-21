"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CreditCard,
  FileText,
  GraduationCap,
  Network,
  RotateCcw,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

/** Inline styles that carry CSS custom properties, without reaching for `any`. */
type CSSVars = React.CSSProperties & Record<string, string | number>;

type SystemNode = {
  id: string;
  label: string;
  icon: LucideIcon;
  body: string;
  /** Only the LMS node has a live destination page. */
  href?: string;
  hrefLabel?: string;
  inDevelopment?: boolean;
  /** Radial position as a % of the diagram box — desktop only. */
  x: number;
  y: number;
};

const HUB: SystemNode = {
  id: "sms",
  label: "SMS",
  icon: Network,
  body: "The umbrella Smart Management System. Every module below plugs into it, sharing one login and one source of data across your whole institution.",
  x: 50,
  y: 50,
};

const NODES: SystemNode[] = [
  {
    id: "smart-card",
    label: "Smart Card",
    icon: CreditCard,
    // Kept in sync with the Smart Card System section further down the page.
    body: "One card runs the whole campus — attendance, secure access and cashless payments in a single tap. Every tap writes straight back to the LMS.",
    x: 50,
    y: 13,
  },
  {
    id: "parent-sms",
    label: "Parent SMS",
    icon: Users,
    body: "A dedicated channel keeping parents informed. Notices, attendance and updates go straight to them, so families stay in the loop.",
    inDevelopment: true,
    x: 82,
    y: 21,
  },
  {
    id: "income",
    label: "Income Management",
    icon: Wallet,
    body: "Centralised tracking of fees, payments and revenue across the institution. One ledger for every module, so the numbers reconcile themselves.",
    inDevelopment: true,
    x: 84,
    y: 67,
  },
  {
    id: "lms",
    label: "LMS",
    icon: GraduationCap,
    body: "The core learning platform — courses, grading, attendance and clear dashboards. It is live today and running in institutions across the island.",
    href: "/services/lms",
    hrefLabel: "Visit LMS",
    x: 50,
    y: 87,
  },
  {
    id: "paper-class",
    label: "Paper Class",
    icon: FileText,
    // Matches the LMS page's "Paper Class System" service card copy.
    body: "Digitises traditional paper-based classroom records and workflows into structured, trackable data — without changing how teachers already work.",
    x: 15,
    y: 44,
  },
];

type Line = { id: string; x1: number; y1: number; x2: number; y2: number };
type Box = { cx: number; cy: number; hw: number; hh: number };

/**
 * Where a ray leaving a box's centre in direction (dx, dy) crosses its edge,
 * pushed out by `gap`. This is what keeps a connector visually attached to the
 * card rather than vanishing underneath it, at any card size or aspect ratio.
 */
function edgePoint(box: Box, dx: number, dy: number, gap: number) {
  const len = Math.hypot(dx, dy);
  if (len === 0) return { x: box.cx, y: box.cy };
  const ux = dx / len;
  const uy = dy / len;
  const tx = ux === 0 ? Infinity : box.hw / Math.abs(ux);
  const ty = uy === 0 ? Infinity : box.hh / Math.abs(uy);
  const t = Math.min(tx, ty) + gap;
  return { x: box.cx + ux * t, y: box.cy + uy * t };
}

function FlipCard({
  node,
  isHub,
  flipped,
  onToggle,
  registerRef,
}: {
  node: SystemNode;
  isHub?: boolean;
  flipped: boolean;
  onToggle: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
}) {
  const style: CSSVars = { "--x": node.x + "%", "--y": node.y + "%" };
  const Icon = node.icon;

  return (
    <div
      ref={registerRef}
      style={style}
      className={`sms-node flip-card relative z-10 h-[206px] w-full max-w-sm lg:max-w-none ${
        isHub ? "lg:w-[244px] xl:w-[280px]" : "lg:w-[214px] xl:w-[250px]"
      }`}
    >
      {/* One <button> per card, so Enter/Space, focus and the disclosure
          semantics come from the platform rather than hand-rolled key
          handling. Children are spans: a <button> may only contain phrasing
          content. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={flipped}
        className={`flip-card-inner group block cursor-pointer rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
          flipped ? "flipped" : ""
        }`}
      >
        {/* Front — icon and label only */}
        <span
          aria-hidden={flipped}
          className={`flip-card-front flex-col items-center justify-center gap-3.5 rounded-xl bg-surface px-5 text-center transition-colors duration-300 ${
            isHub
              ? "border-2 border-foreground"
              : "border border-taupe group-hover:border-foreground"
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-taupe bg-background text-foreground">
            <Icon size={19} strokeWidth={1.6} />
          </span>
          <span
            className={`font-bold tracking-[0.16em] uppercase ${
              isHub ? "text-[15px]" : "text-[12px]"
            }`}
          >
            {node.label}
          </span>
          <span className="text-[9.5px] font-bold tracking-[0.14em] text-muted uppercase">
            Tap to learn more
          </span>
        </span>

        {/* Back — description on the same footprint */}
        <span
          aria-hidden={!flipped}
          className={`flip-card-back flex-col justify-center gap-2 rounded-xl border border-foreground bg-foreground px-5 py-4 text-background ${
            node.href ? "pb-11" : ""
          }`}
        >
          <span className="flex items-center justify-between gap-3">
            <span className="text-[10.5px] font-bold tracking-[0.16em] text-background/55 uppercase">
              {node.label}
            </span>
            {/* Corner "flip back" affordance — the whole card is the toggle. */}
            <span
              aria-hidden
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-background/25 text-background/55 transition-colors duration-300 group-hover:border-background/60 group-hover:text-background"
            >
              <RotateCcw size={11} strokeWidth={2} />
            </span>
          </span>

          <span className="text-[11.5px] leading-relaxed text-background/90 xl:text-[12.5px]">
            {node.body}
          </span>

          {node.inDevelopment && (
            <span className="text-[9.5px] font-bold tracking-[0.14em] text-background/45 uppercase">
              In development
            </span>
          )}
        </span>
      </button>

      {/* Sibling of the button, not a child — a link nested inside a button is
          invalid and unreachable by keyboard. Fades in once the flip has
          finished, and stays untabbable while the front face is showing. */}
      {node.href && (
        <Link
          href={node.href}
          tabIndex={flipped ? 0 : -1}
          aria-hidden={!flipped}
          className={`absolute bottom-4 left-5 z-20 inline-flex items-center gap-1 text-[10.5px] font-bold tracking-[0.14em] text-background uppercase underline decoration-background/40 underline-offset-4 transition-opacity duration-300 hover:decoration-background ${
            flipped ? "opacity-100 delay-300" : "pointer-events-none opacity-0"
          }`}
        >
          {node.hrefLabel}
          <ArrowUpRight size={12} strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}

/** Straight vertical connector used by the stacked mobile layout. */
function StackConnector() {
  return <span aria-hidden className="my-3 block h-8 w-px bg-taupe lg:hidden" />;
}

export default function SmartSystemsDiagram() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const nodeEls = useRef<Map<string, HTMLDivElement>>(new Map());

  const [lines, setLines] = useState<Line[]>([]);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Multiple cards may stay flipped at once — opening one never closes another.
  const [flipped, setFlipped] = useState<ReadonlySet<string>>(new Set());
  const [announcement, setAnnouncement] = useState("");

  const registerRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) nodeEls.current.set(id, el);
      else nodeEls.current.delete(id);
    },
    [],
  );

  const toggle = useCallback((node: SystemNode, isFlipped: boolean) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (isFlipped) next.delete(node.id);
      else next.add(node.id);
      return next;
    });
    setAnnouncement(
      isFlipped
        ? node.label + " description hidden."
        : node.label + ". " + node.body,
    );
  }, []);

  /**
   * Connectors are measured from the live DOM rather than derived from the
   * percentage coordinates, so they stay anchored to the cards at any viewport
   * width — including when text reflow changes a card's height.
   */
  const measure = useCallback(() => {
    const box = boxRef.current;
    const hubEl = nodeEls.current.get(HUB.id);
    if (!box || !hubEl) return;

    const bRect = box.getBoundingClientRect();
    const rel = (el: Element): Box => {
      const r = el.getBoundingClientRect();
      return {
        cx: r.left - bRect.left + r.width / 2,
        cy: r.top - bRect.top + r.height / 2,
        hw: r.width / 2,
        hh: r.height / 2,
      };
    };

    const hub = rel(hubEl);
    const next: Line[] = [];
    for (const node of NODES) {
      const el = nodeEls.current.get(node.id);
      if (!el) continue;
      const target = rel(el);
      const dx = target.cx - hub.cx;
      const dy = target.cy - hub.cy;
      const from = edgePoint(hub, dx, dy, 8);
      const to = edgePoint(target, -dx, -dy, 12);
      next.push({ id: node.id, x1: from.x, y1: from.y, x2: to.x, y2: to.y });
    }

    setSize({ w: bRect.width, h: bRect.height });
    setLines(next);
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    // Observing every card as well as the box catches font loading and text
    // reflow, not just viewport resizes. The SVG is absolutely positioned, so
    // redrawing it cannot feed back into layout and loop the observer.
    const ro = new ResizeObserver(schedule);
    ro.observe(box);
    nodeEls.current.forEach((el) => ro.observe(el));
    schedule();

    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [measure]);

  return (
    /* Full-bleed: this section is a direct child of an unconstrained <main> and
       applies no max-width of its own, so it already spans the viewport edge to
       edge. Deliberately not `w-screen` plus a negative margin — that overflows
       by the scrollbar width and adds a horizontal scrollbar. */
    <section className="w-full border-t border-border bg-surface/30 py-20 md:py-28">
      <div className="mx-auto mb-16 max-w-3xl px-5 md:mb-20 md:px-10">
        <SectionHeading
          center
          eyebrow="The Ecosystem"
          title="Every System, One Platform"
          sub="Tap any card to see what it does. SMS sits at the centre — every module plugs into it, sharing the same students, records and data."
        />
      </div>

      <div
        ref={boxRef}
        className="relative mx-auto flex w-full max-w-sm flex-col items-center px-5 lg:block lg:h-[860px] lg:max-w-none lg:px-10"
      >
        {/* Connector layer — desktop radial only; the stacked layout uses the
            simple vertical rules between cards instead. */}
        <svg
          aria-hidden
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
          className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
        >
          <defs>
            <marker
              id="sms-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--taupe)" />
            </marker>
          </defs>
          {lines.map((line) => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="var(--taupe)"
              strokeWidth={1.25}
              markerEnd="url(#sms-arrow)"
            />
          ))}
        </svg>

        {/* DOM order is the mobile reading order: hub first, then the five
            satellites. On desktop `.sms-node` lifts each card into position. */}
        <FlipCard
          isHub
          node={HUB}
          flipped={flipped.has(HUB.id)}
          onToggle={() => toggle(HUB, flipped.has(HUB.id))}
          registerRef={registerRef(HUB.id)}
        />

        {/* `display: contents` so each pair still participates directly in the
            mobile flex column and the desktop absolute layer. */}
        {NODES.map((node) => (
          <div key={node.id} className="contents">
            <StackConnector />
            <FlipCard
              node={node}
              flipped={flipped.has(node.id)}
              onToggle={() => toggle(node, flipped.has(node.id))}
              registerRef={registerRef(node.id)}
            />
          </div>
        ))}
      </div>

      {/* The reveal is visual, so mirror it for screen readers. */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}
