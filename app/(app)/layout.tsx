import { Suspense } from "react";

import AuthenticatedShell from "@/components/shell/AuthenticatedShell";
import { requireSession, isAdmin } from "@/lib/auth-session";
import { ROUTES } from "@/lib/auth-constants";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession(ROUTES.dashboard);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] text-[var(--text-secondary)]">
          Loading…
        </div>
      }
    >
      <AuthenticatedShell isAdmin={isAdmin(session)}>
        {children}
      </AuthenticatedShell>
    </Suspense>
  );
}
