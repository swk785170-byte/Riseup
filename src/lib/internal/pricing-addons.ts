import "server-only";

/**
 * INTERNAL ADD-ON PRICING — never render this on the public site.
 *
 * The public Pricing page shows the six package prices only; add-ons are
 * referenced there through one generic note per group, with no figures. This
 * module exists so the internal sheet's add-on costs can be wired into an
 * admin-only view later.
 *
 * `import "server-only"` makes the build fail if a Client Component ever
 * imports this file, so the figures cannot be bundled to the browser.
 */

export type AddOn = {
  id: string;
  /** Which pricing group the add-on belongs to. */
  group: "web" | "lms";
  label: string;
  /** Internal cost, e.g. "5,000/=" or "Depends". Admin-only. */
  cost: string;
  note?: string;
};

/**
 * Intentionally empty. Populate from the internal pricing sheet when the
 * admin-only quoting view is built — and keep it out of every public
 * component.
 */
export const INTERNAL_ADD_ONS: AddOn[] = [];
