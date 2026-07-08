"use client";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
];

const Navbar = () => {
  const pathName = usePathname();
  const { user } = useUser();
  return (
    <header className="w-full fixed z-50 bg-[var(--bg-primary)]">
      <div className="wrapper navbar-height py-4 flex justify-between items-center gap-4">
        <Link href="/" className="flex gap-0.5 items-center">
          <Image
            src="/assets/logo.png"
            alt="BookBy"
            width={42}
            height={26}
            style={{ width: "auto", height: "auto" }}
          />
          <span className="logo-text">BookBy</span>
        </Link>

        <nav className="w-fit flex gap-7.5 items-center">
          {navItems.map(({ label, href }) => {
            const isActive =
              pathName === href || (href !== "/" && pathName.startsWith(href));

            return (
              <Link
                href={href}
                key={href}
                className={cn(
                  "nav-link-base",
                  isActive ? "nav-link-active" : "text-black hover:opacity-70",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-7.5 items-center">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button type="button" className="nav-btn">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button type="button" className="btn-primary px-4 py-2 text-sm">
                Sign up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <div className="nav-user-link">
              <UserButton />
              <Link href="/subscriptions" className="nav-user-name">
                {user?.firstName ?? "Account"}
              </Link>
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
