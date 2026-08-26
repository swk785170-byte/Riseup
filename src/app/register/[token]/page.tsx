import type { Metadata } from "next";
import Logo from "@/components/Logo";
import DomainRegistrationForm from "@/components/register/DomainRegistrationForm";
import StatusBadge from "@/components/register/StatusBadge";
import { resolveLink, touchLinkOpened } from "@/lib/registration-access";
import { getRegistrationForLink } from "@/lib/data/registrations";

// Never cached: the page is keyed on a secret and shows one client's data.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Domain Registration — Riseup Solutions",
  robots: { index: false, follow: false },
};

/**
 * Public, link-gated domain registration form.
 *
 * Every invalid case — unknown token, malformed token, expired, revoked —
 * renders the identical notice below. Distinguishing them would tell someone
 * probing tokens which ones are real.
 */
function InvalidLink() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Logo className="h-8 w-auto" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight">
          This link isn&rsquo;t valid
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          It may have expired, or been replaced with a newer one. Please contact
          your project lead at Riseup Solutions for a fresh link.
        </p>
      </div>
    </div>
  );
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const link = await resolveLink(token);
  if (!link) return <InvalidLink />;

  const [registration] = await Promise.all([
    getRegistrationForLink(link.id),
    touchLinkOpened(link.id),
  ]);

  const expires = new Date(link.expires_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 md:py-20">
      <header className="flex flex-col gap-8">
        {/* `self-start`: a flex column stretches its children across the cross
            axis by default, which overrides `w-auto` and smears the wordmark
            to the full container width. */}
        <Logo className="h-7 w-auto self-start" />

        <div>
          <p className="text-[11px] font-bold tracking-[0.3em] text-muted uppercase">
            Domain Registration
          </p>
          <h1 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.08] font-medium tracking-[-0.02em]">
            Hello {link.client_name}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Tell us the domain you&rsquo;d like registered and who owns it. You
            can come back to this link and change your answers until{" "}
            {expires}.
          </p>
        </div>

        {registration && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3">
            <span className="text-sm text-muted">
              You submitted <strong className="font-medium text-foreground">{registration.domain_name}</strong>
            </span>
            <StatusBadge status={registration.status} />
          </div>
        )}

        {registration?.status === "needs_info" && (
          <p className="rounded-lg border border-foreground/30 bg-surface px-4 py-3 text-sm">
            We need a little more information before we can proceed — please
            check the details below and update them.
          </p>
        )}
      </header>

      <div className="mt-10">
        <DomainRegistrationForm token={token} existing={registration} />
      </div>

      <p className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted">
        This link is personal to you — please don&rsquo;t forward it. Anyone who
        has it can see and change these details.
      </p>
    </div>
  );
}
