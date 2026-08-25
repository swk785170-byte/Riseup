/**
 * Builds a wa.me deep link from the WhatsApp number stored in site settings.
 *
 * Shared so every WhatsApp entry point on the site formats the number and
 * pre-fills the message the same way. Returns null when no number is
 * configured, which lets callers fall back to the contact form instead of
 * rendering a link to `wa.me/` with no recipient.
 */
export function whatsappHref(
  whatsappNumber: string,
  message: string,
): string | null {
  // wa.me wants digits only — no "+", spaces or dashes.
  const digits = whatsappNumber.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
