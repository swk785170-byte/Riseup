/**
 * Rise Up Media wordmark. Renders "riseup" in the site's Satoshi black with the
 * signature figure-mark (rising person: round head + two upward chevrons) in
 * place of the dotted "i". Everything is em-based, so a single font-size (via
 * `size` or a `text-[..]` class) scales the whole mark. Monochrome — inherits
 * `currentColor` (defaults to the foreground token).
 */
export default function Logo({
  className = "",
  size,
  title = "Rise Up Media",
}: {
  className?: string;
  /** Font size in px; overrides any size set via className. */
  size?: number;
  title?: string;
}) {
  return (
    <span
      role="img"
      aria-label={title}
      style={size ? { fontSize: size } : undefined}
      className={`inline-flex select-none items-baseline font-black lowercase leading-none tracking-[-0.045em] text-foreground ${className}`}
    >
      <span aria-hidden>r</span>
      {/* figure-mark "i" */}
      <svg
        aria-hidden
        viewBox="0 0 30 80"
        fill="currentColor"
        className="inline-block"
        style={{ height: "0.82em", width: "0.3em", margin: "0 0.015em" }}
      >
        <circle cx="15" cy="14" r="11" />
        <path d="M15 32 L26 43 L26 52 L15 41 L4 52 L4 43 Z" />
        <path d="M15 58 L26 69 L26 78 L15 67 L4 78 L4 69 Z" />
      </svg>
      <span aria-hidden>seup</span>
    </span>
  );
}
