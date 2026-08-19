"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Palette default when a project has no `accent_bg` set. */
export const DEFAULT_ACCENT_BG = "#F1EEE6";

/**
 * Rough perceived luminance (0–1) so the window chrome can flip to a dark bar
 * on a dark backdrop instead of glowing against it.
 */
function isDark(hex: string): boolean {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return false;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.5;
}

const MAX_TILT_DEG = 5;

/**
 * A project preview presented inside a minimal browser window: thin chrome bar
 * with three dots, rounded frame, and a soft shadow.
 *
 * `bare` drops the surrounding backdrop and padding so the frame *is* the card,
 * sitting directly on the section background with no outline or card fill.
 *
 * Performance: the hover tilt writes `transform` straight to the DOM inside a
 * single rAF, so pointer movement never triggers a React render. Listeners are
 * attached only on fine-pointer (desktop) devices, so a scrolling grid of cards
 * on touch carries no 3D work at all.
 */
export default function BrowserMockup({
  src,
  alt,
  accentBg = DEFAULT_ACCENT_BG,
  onImageError,
  children,
  overlay,
  tilt = true,
  bare = false,
}: {
  /** Preview image. Omit and pass `children` to render custom artwork. */
  src?: string | null;
  alt: string;
  accentBg?: string | null;
  onImageError?: () => void;
  children?: React.ReactNode;
  /** Rendered inside the frame, so it tilts and clips with it. */
  overlay?: React.ReactNode;
  tilt?: boolean;
  /** No backdrop/padding — the frame itself is the card. */
  bare?: boolean;
}) {
  const bg = accentBg?.trim() || DEFAULT_ACCENT_BG;
  // With no backdrop the frame sits on the light page surface, so keep the
  // chrome light regardless of the project's stored accent.
  const darkChrome = bare ? false : isDark(bg);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const [canTilt, setCanTilt] = useState(false);

  // Desktop-only: a coarse pointer has no meaningful position to track.
  useEffect(() => {
    if (!tilt) return;
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const apply = () => setCanTilt(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [tilt]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canTilt) return;
      const el = frameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        el.style.transition = "none";
        el.style.transform = `perspective(1000px) rotateX(${(-py * MAX_TILT_DEG).toFixed(2)}deg) rotateY(${(px * MAX_TILT_DEG).toFixed(2)}deg) scale(1.02)`;
      });
    },
    [canTilt],
  );

  const onLeave = useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    // power4.out — matches the site's easing token.
    el.style.transition = "transform 600ms cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, []);

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={bare ? undefined : { backgroundColor: bg }}
      className={
        bare
          ? "h-full w-full"
          : "flex h-full w-full items-center justify-center p-5 md:p-7"
      }
    >
      <div
        ref={frameRef}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_18px_44px_-12px_rgba(11,11,11,0.35)] will-change-transform"
      >
        {/* Window chrome */}
        <div
          className={`flex h-6 items-center gap-1.5 px-3 ${
            darkChrome ? "bg-[#3A3A3A]" : "bg-[#F1EEE6]"
          }`}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-[6px] w-[6px] rounded-full ${
                darkChrome ? "bg-white/30" : "bg-[#C9C4B8]"
              }`}
            />
          ))}
          <span
            className={`ml-2 h-[6px] flex-1 rounded-full ${
              darkChrome ? "bg-white/10" : "bg-black/[0.05]"
            }`}
          />
        </div>

        {/* Preview — object-top keeps the hero in frame when the source is a
            full-page screenshot rather than a curated crop. */}
        <div className="aspect-[16/10] w-full overflow-hidden bg-white">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt}
              loading="lazy"
              onError={onImageError}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            children
          )}
        </div>

        {overlay}
      </div>
    </div>
  );
}
