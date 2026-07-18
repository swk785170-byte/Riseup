"use client";

import { useCallback, useRef } from "react";
import gsap from "gsap";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** How strongly the button is pulled toward the cursor (0–1). */
  strength?: number;
  ariaLabel?: string;
  /** Anchor-only: forwarded to the underlying <a> when `href` is set. */
  target?: string;
  rel?: string;
};

/**
 * Pulls the element toward the cursor while hovered and snaps it back
 * with an elastic ease on leave. The inner span moves at a reduced
 * ratio for a subtle parallax feel.
 */
export default function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  strength = 0.35,
  ariaLabel,
  target,
  rel,
}: MagneticButtonProps) {
  const outerRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * strength;
      const y = (event.clientY - rect.top - rect.height / 2) * strength;
      gsap.to(el, { x, y, duration: 0.5, ease: "power4.out" });
      if (innerRef.current) {
        gsap.to(innerRef.current, {
          x: x * 0.45,
          y: y * 0.45,
          duration: 0.5,
          ease: "power4.out",
        });
      }
    },
    [strength],
  );

  const handleLeave = useCallback(() => {
    const targets = [outerRef.current, innerRef.current].filter(
      (el): el is HTMLElement => el !== null,
    );
    gsap.to(targets, {
      x: 0,
      y: 0,
      duration: 1.1,
      ease: "elastic.out(1, 0.3)",
    });
  }, []);

  const content = (
    <span
      ref={innerRef}
      className="relative z-10 inline-flex items-center gap-2.5"
    >
      {children}
    </span>
  );

  const sharedProps = {
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick,
    className: `inline-flex items-center justify-center will-change-transform ${className}`,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <a
        ref={(node) => {
          outerRef.current = node;
        }}
        href={href}
        target={target}
        rel={rel}
        {...sharedProps}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={(node) => {
        outerRef.current = node;
      }}
      type="button"
      {...sharedProps}
    >
      {content}
    </button>
  );
}
