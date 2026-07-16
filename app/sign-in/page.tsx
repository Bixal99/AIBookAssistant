import type { Metadata } from "next";

import AuthShell from "@/components/auth/AuthShell";
import SignInForm from "@/components/auth/SignInForm";
import { AUTH_COPY, ROUTES } from "@/lib/auth-constants";

export const metadata: Metadata = {
  title: `${AUTH_COPY.signIn.headline} · ${AUTH_COPY.brand}`,
  description: AUTH_COPY.signIn.support,
};

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: PageProps) {
  const { callbackUrl } = await searchParams;
  const safeCallback =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : ROUTES.dashboard;

  return (
    <AuthShell
      headline={AUTH_COPY.signIn.headline}
      support={AUTH_COPY.signIn.support}
    >
      <SignInForm callbackUrl={safeCallback} />
    </AuthShell>
  );
}
