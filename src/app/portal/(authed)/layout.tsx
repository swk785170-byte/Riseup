import { redirect } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import PortalNav from "@/components/portal/PortalNav";
import { getCurrentClient } from "@/lib/auth/client-portal";

/**
 * Authenticated portal shell.
 *
 * The middleware already gates these routes; this re-checks server-side so the
 * pages cannot render for an unprovisioned account even if the matcher were
 * ever misconfigured.
 */
export default async function PortalAuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await getCurrentClient();
  if (!client) redirect("/portal/login");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-5">
          <Link href="/portal/dashboard" aria-label="Portal home" className="shrink-0">
            <Logo className="h-6 w-auto" />
          </Link>
          <PortalNav
            name={client.full_name}
            company={client.company_name}
          />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-10">{children}</main>
    </div>
  );
}
