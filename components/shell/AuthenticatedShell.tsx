"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import AppSidebar from "@/components/shell/AppSidebar";
import AppTopbar from "@/components/shell/AppTopbar";
import AppBreadcrumbs from "@/components/shell/AppBreadcrumbs";

type AuthenticatedShellProps = {
  children: React.ReactNode;
  isAdmin?: boolean;
};

export default function AuthenticatedShell({
  children,
  isAdmin = false,
}: AuthenticatedShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  return (
    <div className="flex min-h-dvh bg-[var(--landing-parchment)] text-[var(--landing-ink)]">
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isAdmin={isAdmin}
      />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <AppTopbar
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <AppBreadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
