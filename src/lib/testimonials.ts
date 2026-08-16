/**
 * Testimonial types + the SEED_TESTIMONIALS fallback used when Supabase isn't
 * configured (and as the seed in 0004_testimonials.sql), mirroring the projects
 * / posts / client-logos data model.
 */

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  /** Real client photo — falls back to initials until one is supplied. */
  avatarUrl: string | null;
  sortOrder: number;
};

/** A row from the Supabase `testimonials` table. */
export type DbTestimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  sort_order: number;
  created_at: string;
};

export function mapRowToTestimonial(row: DbTestimonial): Testimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role ?? "",
    quote: row.quote,
    rating: typeof row.rating === "number" ? row.rating : 5,
    avatarUrl: row.avatar_url,
    sortOrder: row.sort_order,
  };
}

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: "asela",
    name: "Asela Ranasingha",
    role: "Founder, AR",
    rating: 5,
    quote:
      "Riseup Solutions rebuilt our site from the ground up and it finally looks like the business we actually are. Inquiries picked up within the first month and it hasn't slowed down since.",
    avatarUrl: null,
    sortOrder: 0,
  },
  {
    id: "rajika",
    name: "Rajika Wimalarathne",
    role: "Director, Biozone",
    rating: 5,
    quote:
      "What stood out was how little hand-holding it took — they understood what we needed almost immediately and delivered a site that's fast, clean, and easy for our own team to update.",
    avatarUrl: null,
    sortOrder: 1,
  },
  {
    id: "wasula",
    name: "Wasula Kumarasiri",
    role: "Principal, Wasula Institute",
    rating: 5,
    quote:
      "Moving our classes onto their LMS cut our admin workload dramatically. Attendance, notices, and payments used to eat up hours every week — now it's mostly automatic.",
    avatarUrl: null,
    sortOrder: 2,
  },
  {
    id: "sagara",
    name: "Sagara Balasooriya",
    role: "Founder, Sagara Academy",
    rating: 5,
    quote:
      "The Smart Card system alone was worth it — attendance that used to take fifteen minutes at the start of every class now takes seconds, and parents get notified instantly.",
    avatarUrl: null,
    sortOrder: 3,
  },
];
