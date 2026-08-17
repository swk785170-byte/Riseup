"use client";

import { Montserrat } from "next/font/google";
import styles from "./LoadingScreen.module.css";

/**
 * Scoped to this component only — applied via inline `fontFamily` on the two
 * <text> runs, so it never leaks into the rest of the site (which stays on
 * Satoshi) and can't collide with Tailwind's `font-sans` utility.
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800", "900"],
  display: "swap",
});

/** Black (900) — matches the solid weight of the arrow mark. Swap to "800". */
const WORDMARK_WEIGHT = 900;

/**
 * Horizontal nudge applied to the whole "i" glyph (head dot + travelling
 * arrows) so it still sits between "r" and "seup" now that Montserrat's wider
 * letterforms push them apart. Only the x position moves — the arrow path, the
 * clip window's size and the animation are untouched, and because the clip
 * lives inside this same group its relationship to the arrows is preserved
 * exactly.
 */
const I_GLYPH_NUDGE_X = 12;

/**
 * The "riseup" loading mark: a static wordmark with the two figure arrows
 * continuously travelling upward on a seamless loop (treadmill/escalator).
 *
 * Arrow geometry is fixed to the source artwork and must not change:
 *   arrow path   M74.5 0 L87.5 16 L87.5 31.5 L74.5 16 L61.5 31.5 L61.5 16 Z
 *   clip window  x=55 y=48 w=40 h=64.5   (shows ~2 arrows at a time)
 *   copies at    y = 15, 48, 81, 114     (33 apart → keyframe travels -33)
 *
 * The wordmark is real <text>, not a raster layer, so the typeface is genuinely
 * swappable. `textLength` pins each run's width so the glyphs can never drift
 * into the arrow window whatever the resolved font metrics turn out to be.
 */
export default function LoadingScreen({
  className = "",
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  const textStyle = {
    fontFamily: montserrat.style.fontFamily,
    fontWeight: WORDMARK_WEIGHT,
  } as const;

  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 440 150"
      className={`${styles.wrap} ${className}`}
    >
      <defs>
        <path
          id="riseup-arrow"
          d="M74.5 0 L87.5 16 L87.5 31.5 L74.5 16 L61.5 31.5 L61.5 16 Z"
        />
        <clipPath id="riseup-arrow-window">
          <rect x="55" y="48" width="40" height="64.5" />
        </clipPath>
      </defs>

      {/* Static wordmark: "r" + head dot + "seup" (the stem is the arrows).
          Font size keeps the letters' x-height aligned with the arrow stem
          (y 48 → 112.5); Montserrat's x-height at 126px is ~65, matching the
          64.5-tall clip window. */}
      <g fill="currentColor" className="text-foreground">
        <text
          x="6"
          y="112"
          fontSize="126"
          letterSpacing="-3"
          textLength="58"
          lengthAdjust="spacingAndGlyphs"
          style={textStyle}
          className="lowercase"
        >
          r
        </text>
        <text
          x="104"
          y="112"
          fontSize="126"
          letterSpacing="-3"
          textLength="321"
          lengthAdjust="spacingAndGlyphs"
          style={textStyle}
          className="lowercase"
        >
          seup
        </text>
      </g>

      {/* The "i": static head dot + travelling arrows, moved as one unit. */}
      <g transform={`translate(${I_GLYPH_NUDGE_X}, 0)`}>
        <circle cx="74.5" cy="30" r="14" fill="currentColor" />
        <g clipPath="url(#riseup-arrow-window)">
          <g className={styles.arrows} fill="currentColor">
            <use href="#riseup-arrow" y="15" />
            <use href="#riseup-arrow" y="48" />
            <use href="#riseup-arrow" y="81" />
            <use href="#riseup-arrow" y="114" />
          </g>
        </g>
      </g>
    </svg>
  );
}
