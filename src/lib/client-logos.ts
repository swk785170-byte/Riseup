/**
 * Client logo types + the SEED_CLIENT_LOGOS fallback used when Supabase isn't
 * configured (and as the seed in 0003_client_logos.sql), mirroring the projects
 * and posts data model.
 */

export type ClientLogo = {
  id: string;
  name: string;
  /** Null while a real logo image is still being collected. */
  logoUrl: string | null;
  sortOrder: number;
};

/** A row from the Supabase `client_logos` table. */
export type DbClientLogo = {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
  created_at: string;
};

export function mapRowToClientLogo(row: DbClientLogo): ClientLogo {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    sortOrder: row.sort_order,
  };
}

export const SEED_CLIENT_LOGOS: ClientLogo[] = [
  { id: "ar", name: "AR", logoUrl: "/clients/ar.svg", sortOrder: 0 },
  {
    id: "sispira",
    name: "Sispira",
    logoUrl: "/clients/sispira.svg",
    sortOrder: 1,
  },
  {
    id: "mathdoc",
    name: "Mathdoc",
    logoUrl: "/clients/mathdoc.svg",
    sortOrder: 2,
  },
  {
    id: "wasula",
    name: "Wasula Sir",
    logoUrl: "/clients/wasula.svg",
    sortOrder: 3,
  },
  {
    id: "sagara",
    name: "Sagara Sir",
    logoUrl: "/clients/sagara.svg",
    sortOrder: 4,
  },
  {
    id: "biozone",
    name: "Biozone",
    logoUrl: "/clients/biozone.svg",
    sortOrder: 5,
  },
];
