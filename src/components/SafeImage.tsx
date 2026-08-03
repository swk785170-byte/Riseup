"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

/**
 * An admin-uploaded image that degrades gracefully: if the URL is empty or the
 * file fails to load, it renders a muted placeholder instead of a broken-image
 * icon. Usable from Server Components (it is a client leaf).
 */
export default function SafeImage({
  src,
  alt,
  className = "",
  placeholderLabel,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  /** Optional text shown in the placeholder instead of the icon. */
  placeholderLabel?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-surface ${className}`}
      >
        {placeholderLabel ? (
          <span className="px-3 text-center text-[11px] font-bold tracking-[0.2em] text-taupe uppercase">
            {placeholderLabel}
          </span>
        ) : (
          <ImageIcon size={24} strokeWidth={1.25} className="text-taupe" />
        )}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
