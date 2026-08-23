"use client";

import { forwardRef } from "react";
import SmsLogo from "./SmsLogo";

/**
 * The single persistent SMS logo element.
 *
 * On desktop this is the *same* DOM node that starts as the full-screen hero
 * lockup and is scrubbed down into the diagram's hub card — there is no second
 * copy to jump-cut between. It renders at its settled hub size; the hero state
 * is that size scaled up by the ScrollTrigger in `SmartSystemsDiagram`.
 */
const SmsLogoHub = forwardRef<HTMLSpanElement, { className?: string }>(
  function SmsLogoHub({ className = "" }, ref) {
    return (
      <span
        ref={ref}
        // `origin-center` so the scrub scales about the lockup's middle, which
        // is what keeps it visually centred throughout the travel.
        className={`block w-full origin-center will-change-transform ${className}`}
      >
        {/* Sized by its container (the 280px hub box) so it stays proportional
            on narrow screens rather than overflowing at a fixed height. */}
        <SmsLogo className="h-auto w-full" />
      </span>
    );
  },
);

export default SmsLogoHub;
