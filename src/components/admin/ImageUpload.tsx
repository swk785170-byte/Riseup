"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { IMAGE_MAX_BYTES, IMAGE_MIME_TYPES } from "@/lib/schemas/project";

type Props = {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  /** Supabase Storage bucket to upload into. */
  bucket?: string;
};

export default function ImageUpload({
  label,
  value,
  onChange,
  multiple = false,
  bucket = "project-images",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase isn't configured — image upload is unavailable.");
      return;
    }

    const list = Array.from(files);
    for (const file of list) {
      const type = file.type as (typeof IMAGE_MIME_TYPES)[number];
      if (!IMAGE_MIME_TYPES.includes(type)) {
        setError("Only JPG, PNG, WEBP or AVIF images are allowed.");
        return;
      }
      if (file.size > IMAGE_MAX_BYTES) {
        setError("Images must be 5 MB or smaller.");
        return;
      }
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const uploaded: string[] = [];
      for (const file of list) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(bucket)
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (upErr) {
          setError(upErr.message);
          break;
        }
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        uploaded.push(data.publicUrl);
        if (!multiple) break;
      }
      if (uploaded.length > 0) {
        onChange(multiple ? [...value, ...uploaded] : uploaded);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="admin-label">{label}</span>
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div
            key={url}
            className="relative h-20 w-28 overflow-hidden rounded-lg border border-border bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute top-1 right-1 rounded-full bg-foreground/80 p-1 text-background hover:bg-foreground"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {(multiple || value.length === 0) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-taupe text-muted transition-colors hover:border-foreground hover:text-foreground disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ImagePlus size={18} />
            )}
            <span className="text-[10px] font-semibold tracking-wider uppercase">
              {uploading ? "Uploading" : "Upload"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_MIME_TYPES.join(",")}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
