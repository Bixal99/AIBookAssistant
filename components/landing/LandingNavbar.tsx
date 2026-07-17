"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const centerLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Library", href: "/library" },
];

const LandingNavbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color-mix(in_srgb,var(--landing-maroon)_22%,transparent)] bg-[var(--landing-parchment)]">
      <div className="wrapper navbar-height grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4">
        <Link href="/" className="flex items-center gap-2 justify-self-start">
          <Image
            src="/assets/logo-mark.png"
            alt="BookBy"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
          <span className="logo-text">BookBy</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {centerLinks.map(({ label, href }) => (
            <motion.div key={label} className="relative" whileHover="hover">
              <Link
                href={href}
                className="nav-link-base text-[var(--landing-ink)] hover:text-[var(--landing-maroon)]"
              >
                {label}
              </Link>
              <motion.span
                className="absolute -bottom-0.5 left-0 h-0.5 bg-[var(--landing-maroon)]"
                variants={{ hover: { width: "100%" } }}
                initial={{ width: 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          ))}
        </nav>

        <motion.div
          className="justify-self-end"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/books/new"
            className="inline-flex items-center justify-center rounded-[10px] bg-[var(--landing-maroon)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--landing-maroon-hover)] sm:px-5"
            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
          >
            Start with a book
          </Link>
        </motion.div>
      </div>

      <nav
        className="flex items-center justify-center gap-5 border-t border-[color-mix(in_srgb,var(--landing-maroon)_15%,transparent)] px-5 py-2 md:hidden"
        aria-label="Mobile"
      >
        {centerLinks.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--landing-maroon)]"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default LandingNavbar;
