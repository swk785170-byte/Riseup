import Logo from "@/components/Logo";
import MagicLinkForm from "@/components/portal/MagicLinkForm";

export default async function PortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; denied?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="h-8 w-auto" />
        </div>

        <h1 className="text-center text-2xl font-medium tracking-tight">
          Client Portal
        </h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-muted">
          Enter your email and we&rsquo;ll send you a secure login link. No
          password needed.
        </p>

        {params.error && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            That link has expired or has already been used. Request a new one
            below.
          </p>
        )}
        {params.denied && (
          <p className="mt-6 rounded-lg border border-border bg-surface px-4 py-3 text-center text-sm text-muted">
            That account doesn&rsquo;t have portal access. Contact your project
            lead if you think this is a mistake.
          </p>
        )}

        <div className="mt-8">
          <MagicLinkForm />
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted">
          Portal accounts are created by the Riseup Solutions team. There is no
          public sign-up.
        </p>
      </div>
    </div>
  );
}
