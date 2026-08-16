import Image from "next/image";

/** Intrinsic size of the cropped wordmark asset (public/logo/riseup-logo.webp). */
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
      src="/logo/riseup-logo.webp"
      alt={title}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={className}
    />
  );
}
