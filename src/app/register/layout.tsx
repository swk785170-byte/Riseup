import type { Metadata } from "next";

export const metadata: Metadata = {
  // Secret-link pages carry one client's data — never index, never follow.
  robots: { index: false, follow: false },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">{children}</div>
  );
}
