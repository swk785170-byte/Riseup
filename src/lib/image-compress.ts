/**
 * Client-side image downscaling, run before a file is attached to the form.
 *
 * WHY THIS IS NOT OPTIONAL: the uploads travel inside a Server Action POST.
 * Next.js caps that body at 1MB by default, and Vercel caps any serverless
 * request body at 4.5MB — a ceiling no config can raise. A phone photo of an
 * ID card is routinely 2-5MB, so sending the original fails before the action
 * runs, surfacing as an opaque "server-side exception".
 *
 * An ID card or logo needs nowhere near that resolution. Resizing the long
 * edge to 1600px at JPEG q0.82 typically lands at 150-400KB, which keeps all
 * three files well inside every limit and uploads far faster on mobile data.
 */

/** Long-edge cap. Comfortably legible for an ID card or a logo. */
const MAX_EDGE = 1600;
const QUALITY = 0.82;

/**
 * Files at or below this are passed through untouched, preserving the original
 * format — which matters for a logo that relies on PNG transparency.
 */
const PASSTHROUGH_BYTES = 600 * 1024;

export type CompressResult =
  | { ok: true; file: File }
  | { ok: false; error: string };

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function compressImage(file: File): Promise<CompressResult> {
  // Already small enough — keep the original bytes and format.
  if (file.size <= PASSTHROUGH_BYTES) return { ok: true, file };

  try {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return { ok: false, error: "Could not process that image." };
    }

    // JPEG has no alpha, so flatten onto white rather than letting
    // transparency render as black.
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await canvasToBlob(canvas, "image/jpeg", QUALITY);
    if (!blob) return { ok: false, error: "Could not process that image." };

    // Never hand back something larger than we were given.
    if (blob.size >= file.size) return { ok: true, file };

    const name = file.name.replace(/\.[^.]+$/, "") || "upload";
    return {
      ok: true,
      file: new File([blob], `${name}.jpg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      }),
    };
  } catch {
    /*
     * createImageBitmap throws on a format the browser cannot decode — HEIC
     * from an iPhone being the common one. Say so plainly instead of letting
     * the original sail through and fail server-side.
     */
    return {
      ok: false,
      error: "That image format isn't supported. Try a JPG or PNG.",
    };
  }
}
