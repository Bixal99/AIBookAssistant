"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ROUTES } from "@/lib/auth-constants";

const SHELL_WITHOUT_NAV = new Set<string>([
  ROUTES.home,
  ROUTES.signIn,
  ROUTES.signUp,
]);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = SHELL_WITHOUT_NAV.has(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
