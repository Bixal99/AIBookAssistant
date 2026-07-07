"use client";
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
  return (
    <header className="w-full fixed z-50 bg-('--bg-primary') ">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
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
      </div>
    </header>
  );
};

export default Navbar;
