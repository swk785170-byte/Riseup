import type { Metadata } from "next";
import Logo from "@/components/Logo";
import LoginForm from "@/components/admin/LoginForm";
import AdminSetupWarning from "@/components/admin/AdminSetupWarning";

export const metadata: Metadata = {
  title: "Admin — Rise Up Media",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="text-[28px]" />
        </div>

        {/* Server-rendered: warns when the allowlist is unset (fail closed). */}
        <AdminSetupWarning />

        <LoginForm />

        <p className="mt-4 text-center text-xs text-muted">
          Accounts are provisioned by an administrator.
        </p>
      </div>
    </div>
  );
}
