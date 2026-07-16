"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  Upload,
  Settings,
  Shield,
  LogOut,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { AUTH_COPY, ROUTES } from "@/lib/auth-constants";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Library", href: ROUTES.library, icon: Library },
  { label: "Upload", href: ROUTES.booksNew, icon: Upload },
  { label: "Settings", href: ROUTES.settings, icon: Settings },
] as const;

type AppSidebarProps = {
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
};

function isActivePath(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href === ROUTES.dashboard) return false;
  if (
    href === ROUTES.library &&
    pathname.startsWith("/books/") &&
    !pathname.startsWith("/books/new")
  ) {
    return true;
  }
  if (href === ROUTES.booksNew) {
    return pathname === ROUTES.booksNew || pathname.startsWith("/books/new");
  }
  return pathname.startsWith(`${href}/`);
}

export default function AppSidebar({
  open,
  onClose,
  isAdmin = false,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(AUTH_COPY.errors.generic);
      return;
    }
    router.push(ROUTES.home);
    router.refresh();
  };

  const linkClass = (href: string) => {
    const active = isActivePath(pathname, href);
    return cn(
      "mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium leading-none transition-colors",
      active
        ? "bg-[var(--landing-maroon)] !text-white shadow-sm [&_svg]:!text-white"
        : "text-[var(--landing-ink)]/80 hover:bg-[var(--landing-maroon)]/25 hover:!text-[var(--landing-maroon)] [&_svg]:hover:!text-[var(--landing-maroon)] dark:hover:bg-[var(--landing-maroon)]/35",
    );
  };

  const content = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-4 py-5">
        <Link
          href={ROUTES.dashboard}
          className="flex min-w-0 items-center gap-2.5"
          onClick={onClose}
        >
          <Image
            src="/assets/logo-mark.png"
            alt={AUTH_COPY.brand}
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="truncate font-serif text-lg font-semibold tracking-tight text-[var(--landing-ink)]">
            {AUTH_COPY.brand}
          </span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="size-5" />
        </Button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto py-3">
        <p className="mb-1 px-5 text-[11px] font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
          Menu
        </p>
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={linkClass(href)}
            onClick={onClose}
          >
            <Icon className="size-4 shrink-0 opacity-90" strokeWidth={2} />
            <span className="leading-none">{label}</span>
          </Link>
        ))}

        {isAdmin ? (
          <>
            <p className="mt-4 mb-1 px-5 text-[11px] font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
              Admin
            </p>
            <Link
              href={ROUTES.admin}
              className={linkClass(ROUTES.admin)}
              onClick={onClose}
            >
              <Shield className="size-4 shrink-0 opacity-90" strokeWidth={2} />
              <span className="leading-none">Admin</span>
            </Link>
          </>
        ) : null}
      </nav>

      <div className="shrink-0 border-t border-[var(--border-subtle)] p-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--landing-maroon)] transition-colors hover:bg-[var(--landing-maroon-soft)]"
        >
          <LogOut className="size-4" />
          {AUTH_COPY.signOut}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: sticky full-height rail */}
      <aside className="sticky top-0 z-30 hidden h-dvh w-60 shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--sidebar)] lg:flex">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--landing-ink)]/40"
            aria-label="Close menu overlay"
            onClick={onClose}
          />
          <aside className="relative z-10 flex h-dvh w-72 max-w-[85vw] flex-col bg-[var(--sidebar)] shadow-xl">
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}
