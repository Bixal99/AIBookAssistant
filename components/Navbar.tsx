"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { AUTH_COPY, ROUTES } from "@/lib/auth-constants";
import { toast } from "sonner";

const navItems = [
  { label: "Library", href: ROUTES.library },
  { label: "Add New", href: ROUTES.booksNew },
];

const Navbar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

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
    <header className="w-full fixed z-50 bg-(--bg-primary)">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        <Link href={ROUTES.home} className="flex gap-2 items-center">
          <Image
            src="/assets/logo-mark.png"
            alt={AUTH_COPY.brand}
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <span className="logo-text">{AUTH_COPY.brand}</span>
        </Link>

        <nav className="w-fit flex gap-7.5 items-center">
          {navItems.map(({ label, href }) => {
            const isActive =
              pathName === href || pathName.startsWith(`${href}/`);

            return (
              <Link
                href={href}
                key={label}
                className={cn(
                  "nav-link-base",
                  isActive ? "nav-link-active" : "text-black hover:opacity-70",
                )}
              >
                {label}
              </Link>
            );
          })}

          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-[var(--text-secondary)]">
                {session.user.name}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="cursor-pointer text-sm font-medium text-[var(--landing-maroon)] hover:opacity-80"
              >
                {AUTH_COPY.signOut}
              </button>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
