import "server-only";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  MIME_EXTENSION,
  UPLOAD_MAX_BYTES,
  isUploadMimeType,
  type UploadMimeType,
} from "@/lib/schemas/portal";

/**
 * Server-side upload for the SMS Lenz form.
 *
 * The client filling this form is anonymous — there is no session — so the
 * bucket must never allow public writes. Instead the file is posted to a
 * Server Action, validated here, and written with the service role only after
 * the URL token has been checked. That keeps `sms-lenz-uploads` closed to the
 * outside world while still letting a logged-out client attach a photo.
 */

/** First bytes of each format we accept. */
const MAGIC: Record<UploadMimeType, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) =>
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47 &&
    b[4] === 0x0d &&
    b[5] === 0x0a &&
    b[6] === 0x1a &&
    b[7] === 0x0a,
  // RIFF....WEBP
  "image/webp": (b) =>
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50,
  // ....ftypavif
  "image/avif": (b) =>
    b[4] === 0x66 &&
    b[5] === 0x74 &&
    b[6] === 0x79 &&
    b[7] === 0x70 &&
    b[8] === 0x61 &&
    b[9] === 0x76 &&
    b[10] === 0x69 &&
    b[11] === 0x66,
};

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Validates and stores one image.
 *
 * Returns `{ ok: true, url: "" }` for an absent/empty file, because every
 * field on this form is optional — "nothing attached" is a success, not an
 * error.
 */
export async function uploadSmsLenzImage(
  file: File | null,
  label: string,
): Promise<UploadResult> {
  if (!file || file.size === 0) return { ok: true, url: "" };

  if (file.size > UPLOAD_MAX_BYTES) {
    return { ok: false, error: `${label} must be 5MB or smaller.` };
  }

  // The browser-declared type is a hint, not proof — checked against the
  // file's actual leading bytes below.
  if (!isUploadMimeType(file.type)) {
    return { ok: false, error: `${label} must be a JPG, PNG, WebP or AVIF image.` };
  }
  const mime: UploadMimeType = file.type;

  const buffer = new Uint8Array(await file.arrayBuffer());
  if (buffer.length < 12 || !MAGIC[mime](buffer)) {
    // Content does not match the declared type — a renamed or crafted file.
    return { ok: false, error: `${label} is not a valid image file.` };
  }

  // Random name, extension derived from the verified MIME type. The client's
  // original filename never reaches the storage path, so it cannot be used for
  // traversal or to smuggle a second extension.
  const path = `${randomUUID()}.${MIME_EXTENSION[mime]}`;

  try {
    const admin = createAdminClient();
    const { error } = await admin.storage
      .from("sms-lenz-uploads")
      .upload(path, buffer, { contentType: mime, upsert: false });
    if (error) throw error;

    const { data } = admin.storage.from("sms-lenz-uploads").getPublicUrl(path);
    return { ok: true, url: data.publicUrl };
  } catch (err) {
    console.error("[upload] sms-lenz image failed", err);
    return { ok: false, error: `Could not upload ${label}. Please try again.` };
  }
}
