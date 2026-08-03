"use client";

import styles from "./LoadingScreen.module.css";

/**
 * The "riseup" loading mark: a static wordmark with the two figure arrows
 * continuously travelling upward on a seamless loop (treadmill/escalator).
 *
 * Geometry is fixed to the source artwork:
 *   arrow path   M74.5 0 L87.5 16 L87.5 31.5 L74.5 16 L61.5 31.5 L61.5 16 Z
 *   clip window  x=55 y=48 w=40 h=64.5   (shows ~2 arrows at a time)
 *   copies at    y = 15, 48, 81, 114     (33 apart → keyframe travels -33)
 *
 * Note: the static wordmark is drawn inline rather than via `<image href=…>`.
 * An externally referenced SVG cannot use the page's webfont, so an <image>
 * layer would render the wordmark in a fallback face; inlining keeps it in
 * Satoshi and keeps the arrow slot pixel-accurate to the geometry above.
 */
export default function LoadingScreen({
  className = "",
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 300 150"
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

      {/* Static wordmark: "r" + head dot + "seup" (the stem is the arrows) */}
      <g fill="currentColor" className="text-foreground">
        <text
          x="10"
          y="112"
          fontSize="90"
          fontWeight="900"
          letterSpacing="-3"
          className="font-sans lowercase"
        >
          r
        </text>
        <circle cx="74.5" cy="30" r="13" />
        <text
          x="93"
          y="112"
          fontSize="90"
          fontWeight="900"
          letterSpacing="-3"
          className="font-sans lowercase"
        >
          seup
        </text>
      </g>

      {/* Travelling arrows, clipped to the stem window */}
      <g clipPath="url(#riseup-arrow-window)">
        <g className={styles.arrows} fill="currentColor">
          <use href="#riseup-arrow" y="15" />
          <use href="#riseup-arrow" y="48" />
          <use href="#riseup-arrow" y="81" />
          <use href="#riseup-arrow" y="114" />
        </g>
      </g>
    </svg>
  );
}
