/**
 * SMS (Smart Management System) mark — the riseup rising-figure alongside the
 * "SMS" wordmark and its expanded name. Em-based like `Logo.tsx`, so a single
 * font-size (via `size` or a `text-[…]` class) scales the whole lockup.
 * Monochrome; inherits `currentColor`.
 */
export default function SmsLogo({
  className = "",
  size,
  title = "SMS — Smart Management System",
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
      className={`inline-flex items-center gap-[0.28em] text-foreground ${className}`}
    >
      {/* Rising-figure mark */}
      <svg
        aria-hidden
        viewBox="0 0 30 80"
        fill="currentColor"
        className="inline-block"
        style={{ height: "1.5em", width: "0.56em" }}
      >
        <circle cx="15" cy="14" r="11" />
        <path d="M15 32 L26 43 L26 52 L15 41 L4 52 L4 43 Z" />
        <path d="M15 58 L26 69 L26 78 L15 67 L4 78 L4 69 Z" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className="font-black tracking-[-0.03em]">SMS</span>
        <span className="mt-[0.22em] text-[0.2em] font-bold tracking-[0.28em] text-charcoal uppercase">
          Smart Management System
        </span>
      </span>
    </span>
  );
}
