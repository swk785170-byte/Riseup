"use client";

import { useEffect, useMemo, useRef } from "react";

export type WaveKey = "top" | "middle" | "bottom";

/**
 * Lightweight monochrome flowing-lines background — an SVG/CSS stand-in for the
 * React Bits `FloatingLines` (Three.js) component, matching its prop API so a
 * real WebGL version can be dropped in later. No dependencies, no WebGL, crisp
 * at any size, and the CSS flow loop has no seam. Parallax mutates the DOM
 * directly (never re-renders), and all props are treated as stable references
 * by the caller (see Hero.tsx), so the canvas never re-initialises.
 */
export type FloatingLinesProps = {
  enabledWaves?: WaveKey[];
  lineCount?: [number, number, number];
  lineDistance?: [number, number, number];
  linesGradient?: [string, string, string];
  bendRadius?: number;
  bendStrength?: number;
  interactive?: boolean;
  parallax?: boolean;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
  className?: string;
};

const VIEW_W = 1440;
const VIEW_H = 900;
const PATH_W = VIEW_W * 2; // 2× wide so a -1440 translate loops seamlessly

const WAVE_META: Record<
  WaveKey,
  {
    index: number;
    centerY: number;
    wavelength: number;
    duration: number;
    dir: "l" | "r";
    depth: number;
  }
> = {
  top: { index: 0, centerY: VIEW_H * 0.3, wavelength: 480, duration: 26, dir: "l", depth: 6 },
  middle: { index: 1, centerY: VIEW_H * 0.52, wavelength: 360, duration: 34, dir: "r", depth: 11 },
  bottom: { index: 2, centerY: VIEW_H * 0.74, wavelength: 288, duration: 22, dir: "l", depth: 17 },
};

function sinePath(amplitude: number, wavelength: number, y: number): string {
  const step = wavelength / 12;
  let d = `M 0 ${y.toFixed(1)}`;
  for (let x = step; x <= PATH_W; x += step) {
    const yy = y + amplitude * Math.sin((x / wavelength) * Math.PI * 2);
    d += ` L ${x.toFixed(1)} ${yy.toFixed(1)}`;
  }
  return d;
}

export default function FloatingLines({
  enabledWaves = ["top", "middle", "bottom"],
  lineCount = [6, 9, 12],
  lineDistance = [8, 6, 4],
  linesGradient = ["#0B0B0B", "#3A3A3A", "#C9C4B8"],
  bendRadius = 5,
  bendStrength = -0.5,
  interactive = true,
  parallax = true,
  mixBlendMode = "multiply",
  className = "",
}: FloatingLinesProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const waves = useMemo(() => {
    const amplitudeBase = 18 * (1 + Math.abs(bendStrength)) * (bendRadius / 5);
    return enabledWaves.map((key) => {
      const meta = WAVE_META[key];
      const count = lineCount[meta.index];
      const distance = lineDistance[meta.index];
      const amplitude = amplitudeBase * (1 - meta.index * 0.15);
      const startY = meta.centerY - ((count - 1) * distance) / 2;
      const lines = Array.from({ length: count }, (_, i) =>
        sinePath(amplitude, meta.wavelength, startY + i * distance),
      );
      return { key, meta, lines, color: linesGradient[meta.index] };
    });
  }, [enabledWaves, lineCount, lineDistance, linesGradient, bendRadius, bendStrength]);

  // Subtle per-layer mouse parallax — direct DOM writes, no React re-render.
  useEffect(() => {
    if (!interactive && !parallax) return;
    const root = rootRef.current;
    if (!root) return;
    const groups = Array.from(
      root.querySelectorAll<SVGGElement>("[data-depth]"),
    );
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      raf = 0;
      for (const group of groups) {
        const depth = Number(group.dataset.depth ?? 0);
        group.style.transform = `translate(${(-nx * depth).toFixed(2)}px, ${(-ny * depth).toFixed(2)}px)`;
      }
    };
    const onMove = (e: MouseEvent) => {
      nx = e.clientX / window.innerWidth - 0.5;
      ny = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [interactive, parallax]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ mixBlendMode }}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {waves.map((wave) => (
          <g key={wave.key} data-depth={wave.meta.depth}>
            <g
              className={
                wave.meta.dir === "r" ? "fl-wave fl-wave-r" : "fl-wave"
              }
              style={
                {
                  color: wave.color,
                  "--fl-dur": `${wave.meta.duration}s`,
                } as React.CSSProperties
              }
            >
              {wave.lines.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
