"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CreditCard,
  FileText,
  GraduationCap,
  RotateCcw,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import SmsLogoHub from "./SmsLogoHub";

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
  /** Offset in px from the hub at the cluster centre — desktop only. */
  dx: number;
  dy: number;
};

/* Card footprint is unchanged from the previous build; only the distance
   between cards tightens. The cluster is a fixed size so it stays a compact
   group instead of stretching to fill the full-bleed section. */
const CLUSTER_W = 960;
const CLUSTER_H = 620;

/*
 * The hub is the bare logo — no outline, no fill, no flip. Only its id and
 * footprint matter now, and the footprint is what the connectors anchor to.
 * It keeps the old card's 280px width so the horizontal spacing is unchanged;
 * it is much shorter, which is why the vertical offsets below tighten to keep
 * the same visible gap.
 */
const HUB_ID = "sms";

const NODES: SystemNode[] = [
  {
    id: "smart-card",
    label: "Smart Card",
    icon: CreditCard,
    body: "One card runs the whole campus — attendance, secure access and cashless payments in a single tap. Every tap writes straight back to the LMS.",
    dx: 0,
    dy: -200,
  },
  {
    id: "parent-sms",
    label: "Parent SMS",
    icon: Users,
    body: "A dedicated channel keeping parents informed. Notices, attendance and updates go straight to them, so families stay in the loop.",
    inDevelopment: true,
    dx: 336,
    dy: -178,
  },
  {
    id: "income",
    label: "Income Management",
    icon: Wallet,
    body: "Centralised tracking of fees, payments and revenue across the institution. One ledger for every module, so the numbers reconcile themselves.",
    inDevelopment: true,
    dx: 352,
    dy: 150,
  },
  {
    id: "lms",
    label: "LMS",
    icon: GraduationCap,
    body: "The core learning platform — courses, grading, attendance and clear dashboards. It is live today and running in institutions across the island.",
    href: "/services/lms",
    hrefLabel: "Visit LMS",
    dx: 0,
    dy: 200,
  },
  {
    id: "paper-class",
    label: "Paper Class",
    icon: FileText,
    body: "Digitises traditional paper-based classroom records and workflows into structured, trackable data — without changing how teachers already work.",
    dx: -352,
    dy: -14,
  },
];

type Line = { id: string; x1: number; y1: number; x2: number; y2: number };
type Box = { cx: number; cy: number; hw: number; hh: number };
type Mode = "static" | "animated";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/**
 * Where a ray leaving a box's centre in direction (dx, dy) crosses its edge,
 * pushed out by `gap`. This is what keeps a connector attached to the card
 * rather than overlapping into it, at any card size — and it is why the
 * tightened spacing needs no separate change to the connector logic.
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

/** `useLayoutEffect` on the client, `useEffect` on the server — no SSR warning. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function FlipCard({
  node,
  flipped,
  onToggle,
  registerRef,
  hidden,
}: {
  node: SystemNode;
  flipped: boolean;
  onToggle: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
  /** Animated path: satellites start invisible and grow in on scroll. */
  hidden?: boolean;
}) {
  const style: CSSVars = { "--dx": node.dx + "px", "--dy": node.dy + "px" };
  if (hidden) style.opacity = 0;
  const Icon = node.icon;

  return (
    <div
      ref={registerRef}
      style={style}
      className="sms-node flip-card relative z-10 h-[206px] w-full max-w-sm lg:w-[250px] lg:max-w-none"
    >
      {/* One <button> per card, so Enter/Space, focus and the disclosure
          semantics come from the platform rather than hand-rolled key
          handling. Children are spans: a <button> may only contain phrasing
          content. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={flipped}
        className={`flip-card-inner group pointer-events-auto block cursor-pointer rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
          flipped ? "flipped" : ""
        }`}
      >
        {/* Front — icon and label */}
        <span
          aria-hidden={flipped}
          className="flip-card-front flex-col items-center justify-center gap-3.5 rounded-xl border border-taupe bg-surface px-5 text-center transition-colors duration-300 group-hover:border-foreground"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-taupe bg-background text-foreground">
            <Icon size={19} strokeWidth={1.6} />
          </span>
          <span className="text-[12px] font-bold tracking-[0.16em] uppercase">
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

          <span className="text-[12.5px] leading-relaxed text-background/90">
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
  return <span aria-hidden className="my-2 block h-4 w-px bg-taupe lg:hidden" />;
}

export default function SmartSystemsDiagram() {
  const stageRef = useRef<HTMLElement | null>(null);
  const clusterRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const logoRef = useRef<HTMLSpanElement | null>(null);
  const nodeEls = useRef<Map<string, HTMLDivElement>>(new Map());

  /** Cluster fit-scale, so the fixed-size cluster always fits the viewport. */
  const fitRef = useRef(1);
  /** Logo hero-state transform, recomputed on every refresh/resize. */
  const startRef = useRef<{ scale: number; x: number; y: number } | null>(null);

  const [lines, setLines] = useState<Line[]>([]);
  const [mode, setMode] = useState<Mode>("static");

  // Multiple cards may stay flipped at once — opening one never closes another.
  const [flipped, setFlipped] = useState<ReadonlySet<string>>(new Set());
  const [announcement, setAnnouncement] = useState("");

  // The scroll-scrubbed handoff is desktop-only, and never runs for visitors
  // who ask for reduced motion — they get the logo already settled in the hub.
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
    );
    const apply = () => setMode(mq.matches ? "animated" : "static");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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
   * Recomputes the cluster fit-scale, the connector geometry and the logo's
   * hero-state transform. Everything is read from the live DOM, so the tighter
   * spacing and the logo's landing point both stay correct at any viewport.
   */
  const measure = useCallback(() => {
    const cluster = clusterRef.current;
    const hubEl = nodeEls.current.get(HUB_ID);
    if (!cluster || !hubEl) return;

    const desktop = window.matchMedia("(min-width: 64rem)").matches;
    if (!desktop) {
      cluster.style.transform = "";
      fitRef.current = 1;
      setLines([]);
      return;
    }

    // Fit the fixed-size cluster into whatever room the stage actually has.
    const availW = cluster.parentElement
      ? cluster.parentElement.clientWidth - 32
      : CLUSTER_W;
    const availH =
      Math.min(
        stageRef.current?.clientHeight ?? window.innerHeight,
        window.innerHeight,
      ) - 48;
    const fit = Math.max(
      0.62,
      Math.min(1, availW / CLUSTER_W, availH / CLUSTER_H),
    );
    cluster.style.transform = fit === 1 ? "" : `scale(${fit})`;
    fitRef.current = fit;

    // Rects come back post-transform, so divide back out to the cluster's own
    // unscaled coordinate space — which is what the SVG viewBox uses.
    const cRect = cluster.getBoundingClientRect();
    const rel = (el: Element): Box => {
      const r = el.getBoundingClientRect();
      return {
        cx: (r.left - cRect.left) / fit + r.width / (2 * fit),
        cy: (r.top - cRect.top) / fit + r.height / (2 * fit),
        hw: r.width / (2 * fit),
        hh: r.height / (2 * fit),
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
    setLines(next);

    // Logo hero state, measured stage-relative so it is independent of where
    // the page happens to be scrolled when a refresh fires.
    const logo = logoRef.current;
    const stage = stageRef.current;
    if (logo && stage) {
      const prev = logo.style.transform;
      logo.style.transform = "none";
      const lr = logo.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      // Derive the aspect from the measured lockup rather than hard-coding it,
      // so swapping the logo asset can't silently break the height guard.
      const aspect = lr.height > 0 ? lr.width / lr.height : 2.9;
      const heroW = Math.min(
        window.innerWidth * 0.36,
        720,
        (window.innerHeight - 120) * aspect,
      );
      startRef.current = {
        scale: lr.width > 0 ? heroW / lr.width : 1,
        // Divide by `fit`: these are the logo's own local units, which the
        // cluster's scale then multiplies.
        x: (sr.width / 2 - (lr.left + lr.width / 2 - sr.left)) / fit,
        y: (sr.height / 2 - (lr.top + lr.height / 2 - sr.top)) / fit,
      };
      logo.style.transform = prev;
    }
  }, []);

  /** Applies one frame of the hero → hub handoff at scroll progress `p`. */
  const render = useCallback((p: number) => {
    const e = easeInOut(clamp01(p));

    const logo = logoRef.current;
    const start = startRef.current;
    if (logo && start) {
      const scale = start.scale + (1 - start.scale) * e;
      const x = start.x * (1 - e);
      const y = start.y * (1 - e);
      logo.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(4)})`;
    }

    if (svgRef.current) {
      svgRef.current.style.opacity = String(clamp01((p - 0.6) / 0.3));
    }

    // Satellites stagger in so the diagram grows out of the settling logo.
    NODES.forEach((node, i) => {
      const el = nodeEls.current.get(node.id);
      if (!el) return;
      const t = clamp01((p - 0.48 - i * 0.06) / 0.28);
      el.style.opacity = String(t);
      el.style.transform = `translate(-50%, -50%) scale(${(0.86 + 0.14 * t).toFixed(3)})`;
    });

    /*
     * Deliberately no pointer-events gating here. Interactivity must never
     * depend on animation progress: the entrance touches `opacity` and
     * `transform` only, so a card stays hit-testable at any scroll position.
     */
  }, []);

  // Connector geometry — needed on both paths (a desktop visitor with reduced
  // motion still gets the radial layout, just without the scrub).
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(cluster);
    nodeEls.current.forEach((el) => ro.observe(el));
    schedule();
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [measure, mode]);

  // The scroll-scrubbed hero → hub handoff.
  useEffect(() => {
    if (mode !== "animated") return;
    const stage = stageRef.current;
    if (!stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const progress = { p: 0 };

    const tween = gsap.to(progress, {
      p: 1,
      ease: "none",
      onUpdate: () => render(progress.p),
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          render(progress.p);
        },
      },
    });

    measure();
    render(0);
    // Fonts settle after first paint and change the logo's measured width.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 150);

    return () => {
      window.clearTimeout(id);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [mode, measure, render]);

  const animated = mode === "animated";

  const cluster = (
    <div
      ref={clusterRef}
      className="relative mx-auto flex w-full max-w-sm flex-col items-center lg:block lg:h-[620px] lg:w-[960px] lg:max-w-none"
    >
      {/* Connector layer — desktop radial only; the stacked layout uses the
          simple vertical rules between cards instead. Styling (colour, width,
          arrowhead) is unchanged; only its opacity is animated. */}
      <svg
        ref={svgRef}
        aria-hidden
        viewBox={`0 0 ${CLUSTER_W} ${CLUSTER_H}`}
        style={animated ? { opacity: 0 } : undefined}
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
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
      {/* The hub: bare logo, no outline, no fill, not a flip card. Its 280px
          box is the footprint the connectors anchor to (96px tall at the
          logo's 2.911 aspect), which is what the offsets above are tuned
          against. */}
      <div
        ref={registerRef(HUB_ID)}
        style={{ "--dx": "0px", "--dy": "0px" } as CSSVars}
        className="sms-node relative z-10 flex w-full max-w-[280px] items-center justify-center lg:w-[280px]"
      >
        <SmsLogoHub ref={logoRef} />
      </div>

      {/* `display: contents` so each pair still participates directly in the
          mobile flex column and the desktop absolute layer. */}
      {NODES.map((node) => (
        <div key={node.id} className="contents">
          <StackConnector />
          <FlipCard
            node={node}
            hidden={animated}
            flipped={flipped.has(node.id)}
            onToggle={() => toggle(node, flipped.has(node.id))}
            registerRef={registerRef(node.id)}
          />
        </div>
      ))}
    </div>
  );

  const live = (
    <p role="status" aria-live="polite" className="sr-only">
      {announcement}
    </p>
  );

  // Animated path: hero and diagram are two states of one pinned viewport, so
  // the logo can travel between them without a jump-cut.
  if (animated) {
    return (
      <section
        ref={stageRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden border-t border-border bg-surface/30 px-5 md:px-10"
      >
        {cluster}
        {live}
      </section>
    );
  }

  // Static path (below `lg`, or reduced motion): straight into the diagram,
  // already settled with its satellites present — no logo-only hero screen
  // first. `pt-36`/`md:pt-44` clears the fixed navbar, the job the hero used
  // to do while it sat above this section.
  return (
    <>
      <section className="w-full bg-surface/30 pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="mx-auto mb-16 max-w-3xl px-5 md:mb-20 md:px-10">
          <SectionHeading
            center
            eyebrow="The Ecosystem"
            title="Every System, One Platform"
            sub="Tap any card to see what it does. SMS sits at the centre — every module plugs into it, sharing the same students, records and data."
          />
        </div>
        <div className="px-5 md:px-10">{cluster}</div>
        {live}
      </section>
    </>
  );
}
