import { getSiteSettings } from "@/lib/data/site";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import type { SiteSettingsFormValues } from "@/lib/schemas/site";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  const configured = isSupabaseConfigured();

  const values: SiteSettingsFormValues = {
    email: settings.email,
    whatsapp_number: settings.whatsappNumber,
    instagram_url: settings.instagramUrl,
    facebook_url: settings.facebookUrl,
    linkedin_url: settings.linkedinUrl,
    youtube_url: settings.youtubeUrl,
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Site settings</h1>
      <p className="mt-1 text-sm text-muted">
        Contact email, WhatsApp number and company social links used across the
        whole site.
      </p>

      {!configured && (
        <p className="mt-6 rounded-xl border border-taupe bg-surface px-4 py-3 text-sm text-charcoal">
          Supabase isn&rsquo;t configured yet — add your keys and run{" "}
          <code className="font-mono text-[13px]">
            supabase/migrations/0005_team_gallery_settings.sql
          </code>
          .
        </p>
      )}

      <div className="mt-8">
        <SiteSettingsForm defaultValues={values} />
      </div>
    </div>
  );
}
