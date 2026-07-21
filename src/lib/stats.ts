/** Headline social-proof numbers, shared by the Trust Bar and Projects header. */
export type Stat = { value: number; suffix: string; label: string };

export const SITE_STATS: Stat[] = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 10, suffix: "+", label: "Brands Grown" },
  { value: 98, suffix: "%", label: "Client Retention" },
  { value: 8, suffix: "+", label: "Years of Craft" },
];
