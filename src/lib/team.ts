/** Team member types + seed fallback (About page). */

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
  socials: {
    instagram: string;
    linkedin: string;
    website: string;
  };
  sortOrder: number;
};

export type DbTeamMember = {
  id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  sort_order: number;
  created_at: string;
};

export function mapRowToTeamMember(row: DbTeamMember): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role ?? "",
    photoUrl: row.photo_url,
    socials: {
      instagram: row.instagram_url ?? "",
      linkedin: row.linkedin_url ?? "",
      website: row.website_url ?? "",
    },
    sortOrder: row.sort_order,
  };
}

export const SEED_TEAM: TeamMember[] = [
  {
    id: "nejan",
    name: "Nejan",
    role: "Co-Founder, Developer",
    photoUrl: "/team/nejm.jpg",
    socials: { instagram: "", linkedin: "", website: "" },
    sortOrder: 0,
  },
  {
    id: "bathila",
    name: "Bathila",
    role: "Backend Developer, Tech Lead",
    photoUrl: "/team/bakhta.jpg",
    socials: { instagram: "", linkedin: "", website: "" },
    sortOrder: 1,
  },
  {
    id: "sudam",
    name: "Sudam",
    role: "UI Designer, Co-Founder",
    photoUrl: "/team/sida.jpg",
    socials: { instagram: "", linkedin: "", website: "" },
    sortOrder: 2,
  },
];
