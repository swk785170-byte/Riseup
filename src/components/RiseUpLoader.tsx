/**
 * The "riseup" wordmark with an animated figure-mark "i": the chevrons that
 * form the stem treadmill upward on a seamless loop (like an escalator step),
 * while the head dot and the rest of the wordmark stay perfectly static.
 *
 * The loop is seamless because the chevrons are evenly spaced by 22 units and
 * the group translates up by exactly 22 (one spacing) before repeating — the
 * head circle (drawn last, on top) hides them as they rise into it, and the
 * SVG bounds clip them at the bottom. Pure CSS, crisp at any size.
 */
export default function RiseUpLoader({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-flex items-baseline leading-none font-black lowercase tracking-[-0.045em] text-foreground select-none ${className}`}
    >
      <span aria-hidden>r</span>
      <svg
        aria-hidden
        viewBox="0 0 40 120"
        fill="currentColor"
        className="inline-block overflow-hidden"
        style={{ height: "0.92em", width: "0.32em", margin: "0 0.02em" }}
      >
        {/* Rising chevrons (the stem) */}
        <g className="ru-rise">
          {[8, 30, 52, 74, 96, 118, 140].map((y) => (
            <path
              key={y}
              transform={`translate(0 ${y})`}
              d="M4 12 L20 0 L36 12 L36 20 L20 8 L4 20 Z"
            />
          ))}
        </g>
        {/* Head dot — drawn last so rising chevrons vanish into it */}
        <circle cx="20" cy="15" r="13" />
      </svg>
      <span aria-hidden>seup</span>
    </span>
  );
}
