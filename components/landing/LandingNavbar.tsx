"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AUTH_COPY, ROUTES } from "@/lib/auth-constants";

const centerLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Voice", href: "#voice" },
];

const LandingNavbar = () => {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", closeOnDesktop);
    return () => mq.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color-mix(in_srgb,var(--landing-maroon)_22%,transparent)] bg-[var(--landing-parchment)]/95 backdrop-blur-sm">
      <div className="wrapper flex h-[var(--navbar-height)] items-center justify-between gap-3">
        <Link
          href={ROUTES.home}
          className="flex min-w-0 cursor-pointer items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/assets/logo-mark.png"
            alt={AUTH_COPY.brand}
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
            priority
          />
          <span className="logo-text truncate">{AUTH_COPY.brand}</span>
        </Link>

        <nav
          className="hidden items-center gap-6 lg:flex xl:gap-8"
          aria-label="Primary"
        >
          {centerLinks.map(({ label, href }) => (
            <motion.div
              key={label}
              className="relative cursor-pointer"
              whileHover="hover"
            >
              <Link
                href={href}
                className="nav-link-base cursor-pointer text-[var(--landing-ink)] hover:text-[var(--landing-maroon)]"
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={ROUTES.signIn}
            className="hidden cursor-pointer px-2 py-2 text-sm font-semibold text-[var(--landing-ink)] hover:text-[var(--landing-maroon)] lg:inline-flex"
          >
            {AUTH_COPY.signInCta}
          </Link>
          <motion.div
            className="hidden lg:block"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            <Link
              href={ROUTES.signUp}
              className="inline-flex cursor-pointer items-center justify-center rounded-[10px] bg-[var(--landing-maroon)] px-4 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-soft-sm)] transition-colors hover:bg-[var(--landing-maroon-hover)] hover:shadow-[var(--shadow-soft-md)] sm:px-5"
              style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
            >
              {AUTH_COPY.getStarted}
            </Link>
          </motion.div>

          <Link
            href={ROUTES.signUp}
            className="inline-flex cursor-pointer items-center justify-center rounded-[10px] bg-[var(--landing-maroon)] px-3.5 py-2 text-sm font-bold text-white shadow-[var(--shadow-soft-sm)] transition-colors hover:bg-[var(--landing-maroon-hover)] lg:hidden"
            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
          >
            {AUTH_COPY.getStarted}
          </Link>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--landing-ink)] transition-colors hover:border-[var(--landing-maroon)] hover:text-[var(--landing-maroon)] lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id={menuId}
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[color-mix(in_srgb,var(--landing-maroon)_15%,transparent)] bg-[var(--landing-parchment)] lg:hidden"
          >
            <div className="wrapper flex flex-col gap-1 py-3">
              {centerLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="cursor-pointer rounded-lg px-3 py-3 text-base font-medium text-[var(--landing-ink)] hover:bg-[var(--landing-maroon-soft)] hover:text-[var(--landing-maroon)]"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-2 border-t border-[var(--border-subtle)] pt-3">
                <Link
                  href={ROUTES.signIn}
                  className="block cursor-pointer rounded-lg px-3 py-3 text-center text-base font-semibold text-[var(--landing-ink)] hover:bg-[var(--landing-maroon-soft)]"
                  onClick={() => setOpen(false)}
                >
                  {AUTH_COPY.signInCta}
                </Link>
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default LandingNavbar;
