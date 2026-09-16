import type { Metadata } from "next";
import Logo from "@/components/Logo";
import RegisterNav from "@/components/register/RegisterNav";
import { resolveLink, touchLinkOpened } from "@/lib/registration-access";

// Never cached: keyed on a secret, shows one client's data.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Shell shared by both client forms.
 *
 * The token is resolved once here, so an invalid link shows the same neutral
 * notice whichever form was requested — and neither page renders.
 */
export default async function RegisterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const link = await resolveLink(token);

  if (!link) {
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
            It may have expired, or been replaced with a newer one. Please
            contact your project lead at Riseup Solutions for a fresh link.
          </p>
        </div>
      </div>
    );
  }

  await touchLinkOpened(link.id);

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 md:py-20">
      <header className="flex flex-col gap-8">
        {/* `self-start`: a flex column stretches its children across the cross
            axis by default, which overrides `w-auto` and smears the wordmark. */}
        <Logo className="h-7 w-auto self-start" />
        <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.08] font-medium tracking-[-0.02em]">
          Hello {link.client_name}
        </h1>
        <RegisterNav token={token} />
      </header>

      <div className="mt-10">{children}</div>
    </div>
  );
}
