"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { AUTH_COPY, ROUTES } from "@/lib/auth-constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import NotificationsPopover from "@/components/shell/NotificationsPopover";

type AppTopbarProps = {
  onMenuClick: () => void;
  searchQuery?: string;
};

export default function AppTopbar({
  onMenuClick,
  searchQuery = "",
}: AppTopbarProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = String(form.get("q") || "").trim();
    if (q) {
      router.push(`${ROUTES.library}?query=${encodeURIComponent(q)}`);
    } else {
      router.push(ROUTES.library);
    }
  };

  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(AUTH_COPY.errors.generic);
      return;
    }
    router.push(ROUTES.home);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--landing-parchment)]/95 px-4 backdrop-blur-md sm:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Menu className="size-5" />
      </Button>

      <form onSubmit={onSearch} className="relative max-w-md flex-1" autoComplete="off">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <Input
          name="q"
          defaultValue={searchQuery}
          placeholder="Search books, authors, categories…"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          className="h-10 rounded-xl border-[var(--border-medium)] bg-card pl-9 text-[var(--landing-ink)] placeholder:text-[var(--text-secondary)]/70"
        />
      </form>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          disabled={!mounted}
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        <NotificationsPopover />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full p-1 transition-opacity hover:opacity-90"
              aria-label="Account menu"
            >
              <Avatar className="size-8 border border-[var(--border-subtle)]">
                <AvatarImage src={user?.image || undefined} alt={user?.name} />
                <AvatarFallback className="bg-[var(--landing-maroon-soft)] text-xs text-[var(--landing-maroon)]">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={ROUTES.settings}>
                <User className="size-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.settings}>
                <Settings className="size-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                void handleSignOut();
              }}
              className="text-[var(--landing-maroon)]"
            >
              <LogOut className="size-4" />
              {AUTH_COPY.signOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
