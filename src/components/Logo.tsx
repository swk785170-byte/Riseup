import Image from "next/image";

/**
 * Intrinsic size of the wordmark asset (public/logo/riseup-logo.png).
 * Transparent PNG, so it sits on the warm #FFFDF8 background with no white box.
 * next/image re-encodes it to WebP/AVIF on delivery.
 */
const LOGO_WIDTH = 436;
const LOGO_HEIGHT = 190;

/**
 * The riseup wordmark. Height is controlled by the caller via `className`
 * (e.g. "h-7 md:h-8") and the width follows the asset's aspect ratio, so the
 * lockup never distorts.
 */
export default function Logo({
  className = "h-7 w-auto md:h-8",
  title = "Riseup Solutions",
  priority = false,
}: {
  className?: string;
  title?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo/riseup-logo.png"
      alt={title}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={className}
    />
  );
}
