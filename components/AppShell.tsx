"use client";

import { usePathname } from "next/navigation";

import { ROUTES } from "@/lib/auth-constants";

const PUBLIC_ONLY = new Set<string>([
  ROUTES.home,
  ROUTES.signIn,
  ROUTES.signUp,
]);

/** Passthrough shell — authenticated chrome lives in `app/(app)/layout`. */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Keep a hook so this stays a client boundary for future public chrome.
  void pathname;
  void PUBLIC_ONLY;
  return <>{children}</>;
}
