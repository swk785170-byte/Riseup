/**
 * Site-wide settings — the contact email, WhatsApp number and company social
 * links shown across the whole site. Stored as a single row (`id = 1`).
 */

export type SiteSettings = {
  email: string;
  /** International format, digits only, no "+". Empty hides the WhatsApp button. */
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
};

export type DbSiteSettings = {
  id: number;
  email: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  updated_at: string;
};

/** Used until the settings row exists — matches the previously hardcoded values. */
export const DEFAULT_SETTINGS: SiteSettings = {
  email: "hello@riseupmedia.com",
  whatsappNumber: "",
  instagramUrl: "https://instagram.com/riseupmedia",
  facebookUrl: "https://facebook.com/riseupmedia",
  linkedinUrl: "https://linkedin.com/company/riseupmedia",
  youtubeUrl: "https://youtube.com/@riseupmedia",
};

export function mapRowToSettings(row: DbSiteSettings): SiteSettings {
  return {
    email: row.email?.trim() || DEFAULT_SETTINGS.email,
    whatsappNumber: (row.whatsapp_number ?? "").replace(/\D/g, ""),
    instagramUrl: row.instagram_url ?? "",
    facebookUrl: row.facebook_url ?? "",
    linkedinUrl: row.linkedin_url ?? "",
    youtubeUrl: row.youtube_url ?? "",
  };
}
