import Image from "next/image";

/**
 * Intrinsic size of the SMS mark (public/logo/sms-logo.png) — the supplied
 * artwork, cropped to its ink bounds so the lockup sizes predictably instead
 * of floating inside a mostly-empty square canvas. Transparent PNG, so it sits
 * on the warm #FFFDF8 / #F1EEE6 surfaces with no white box. next/image
 * re-encodes it to WebP/AVIF on delivery.
 */
const LOGO_WIDTH = 1374;
const LOGO_HEIGHT = 472;

/**
 * The SMS (Smart Management System) lockup. Like `Logo.tsx`, height is set by
 * the caller via `className` (e.g. "h-16 w-auto") and the width follows the
 * asset's aspect ratio, so it never distorts. Because next/image emits the
 * intrinsic width/height, the box is reserved before the file loads — which is
 * what lets the diagram measure the hub logo without waiting on the download.
 */
export default function SmsLogo({
  className = "h-16 w-auto",
  title = "SMS — Smart Management System",
  priority = false,
}: {
  className?: string;
  title?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo/sms-logo.png"
      alt={title}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={className}
    />
  );
}
