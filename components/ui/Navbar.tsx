"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
];

const Navbar = () => {
  const pathName = usePathname();
  const { user } = useUser();
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#faf4e8]/95 backdrop-blur-sm">
      <div className="wrapper flex h-[74px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-[#1f2433]">
          <Image
            src="/assets/logo.png"
            alt="BookBy"
            width={26}
            height={26}
            className="h-[18px] w-auto"
          />
          <span className="text-[18px] font-semibold tracking-[-0.03em]">
            BookBy
          </span>
        </Link>

        <nav className="flex items-center gap-7 text-[15px] font-medium text-[#1f2433]">
          {navItems.map(({ label, href }) => {
            const isActive =
              pathName === href || (href !== "/" && pathName.startsWith(href));

            return (
              <Link
                href={href}
                key={href}
                className={
                  isActive
                    ? "border-b border-[#1f2433] pb-1 text-[#1f2433]"
                    : "text-[#1f2433] opacity-90 transition-opacity hover:opacity-60"
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-[#1f2433]">
          {!user ? (
            <span className="text-sm font-medium opacity-70">Guest</span>
          ) : (
            <div className="flex items-center gap-2.5">
              <UserButton />
              <Link href="/subscriptions" className="text-[15px] font-medium">
                {user?.firstName ?? "Account"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
