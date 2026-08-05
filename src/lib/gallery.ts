/** About-page gallery image types. */

export type GalleryImage = {
  id: string;
  imageUrl: string;
  alt: string;
  sortOrder: number;
};

export type DbGalleryImage = {
  id: string;
  image_url: string;
  alt: string | null;
  sort_order: number;
  created_at: string;
};

export function mapRowToGalleryImage(row: DbGalleryImage): GalleryImage {
  return {
    id: row.id,
    imageUrl: row.image_url,
    alt: row.alt ?? "",
    sortOrder: row.sort_order,
  };
}

/**
 * Empty by design — the gallery section hides itself until real photos are
 * uploaded, rather than showing a grid of empty placeholder tiles on a live
 * site.
 */
export const SEED_GALLERY: GalleryImage[] = [];
