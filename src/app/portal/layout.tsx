import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal — Riseup Solutions",
  // Per-client data: never index, never follow.
  robots: { index: false, follow: false },
};

export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
