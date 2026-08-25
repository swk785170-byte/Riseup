/**
 * Legal identity used by /privacy and /terms.
 *
 * Everything a lawyer or the business owner is likely to want to change lives
 * here, so the documents themselves stay prose. Optional fields render only
 * when filled in — an empty string is omitted from the page rather than
 * printed as a placeholder, so nothing incomplete can reach visitors.
 *
 * NOTE: these documents are a starting draft written to describe what this
 * site actually does. They are not legal advice and should be reviewed by a
 * qualified lawyer in the operating jurisdiction before launch.
 */
export const LEGAL = {
  /** Trading name shown throughout both documents. */
  entity: "Riseup Solutions",

  /**
   * Registered company name and number, if the business is incorporated.
   * Leave empty to omit the "registered details" line entirely.
   */
  registeredName: "",
  registrationNumber: "",

  /** Postal address. Leave empty to omit. */
  registeredAddress: "",

  /**
   * The law that governs these documents and the courts that hear disputes.
   * Assumed from the business operating in Sri Lanka — change if incorporated
   * or primarily operating elsewhere.
   */
  jurisdiction: "Sri Lanka",
  courts: "the courts of Sri Lanka",

  /** Shown as "Last updated" on both documents. Update when you edit them. */
  lastUpdated: "24 August 2026",
} as const;

/** Human-readable registered details line, or null when nothing is set. */
export function registeredDetails(): string | null {
  const parts: string[] = [];
  if (LEGAL.registeredName) parts.push(LEGAL.registeredName);
  if (LEGAL.registrationNumber) {
    parts.push(`(Reg. No. ${LEGAL.registrationNumber})`);
  }
  if (LEGAL.registeredAddress) parts.push(LEGAL.registeredAddress);
  return parts.length > 0 ? parts.join(", ") : null;
}
