"use client";

import { usePathname } from "next/navigation";
import { whatsappHref } from "@/lib/whatsapp";
import { useSiteSettings } from "./SettingsProvider";

/**
 * Floating WhatsApp contact button, bottom-right on every public page.
 * Renders nothing when no number is set in the admin panel, and stays out of
 * the utilitarian /admin tool.
 */
export default function WhatsAppButton() {
  const { whatsappNumber } = useSiteSettings();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  const href = whatsappHref(
    whatsappNumber,
    "Hi Riseup Solutions, I'd like to talk about a project.",
  );
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      /* Same delayed fade-and-scale entrance as before, in CSS — see
         `wa-pop` in globals.css — so the root layout no longer pulls in
         framer-motion for a single button. */
      className="wa-pop fixed right-5 bottom-5 z-[95] flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-[0_14px_34px_-10px_rgba(11,11,11,0.55)] transition-transform duration-300 ease-premium hover:scale-108 md:right-8 md:bottom-8"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="h-7 w-7"
      >
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
        <path d="M12.04 2A9.96 9.96 0 0 0 2.08 12c0 1.76.46 3.48 1.34 5L2 22l5.13-1.35a9.93 9.93 0 0 0 4.9 1.28h.01A9.96 9.96 0 0 0 22 12 9.96 9.96 0 0 0 12.04 2Zm0 18.15h-.01a8.27 8.27 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.25 8.25 0 1 1 15.3-4.29 8.27 8.27 0 0 1-8.3 8.15Z" />
      </svg>
    </a>
  );
}
