import type { Metadata } from "next";

import AuthShell from "@/components/auth/AuthShell";
import SignUpForm from "@/components/auth/SignUpForm";
import { AUTH_COPY, ROUTES } from "@/lib/auth-constants";

export const metadata: Metadata = {
  title: `${AUTH_COPY.signUp.headline} · ${AUTH_COPY.brand}`,
  description: AUTH_COPY.signUp.support,
};

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignUpPage({ searchParams }: PageProps) {
  const { callbackUrl } = await searchParams;
  const safeCallback =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : ROUTES.dashboard;

  return (
    <AuthShell
      headline={AUTH_COPY.signUp.headline}
      support={AUTH_COPY.signUp.support}
    >
      <SignUpForm callbackUrl={safeCallback} />
    </AuthShell>
  );
}
