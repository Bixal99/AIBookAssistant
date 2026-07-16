"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AUTH_COPY, ROUTES } from "@/lib/auth-constants";

const productLinks = [
  { label: AUTH_COPY.getStarted, href: ROUTES.signUp },
  { label: AUTH_COPY.signInCta, href: ROUTES.signIn },
];

const exploreLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Voice", href: "#voice" },
];

const stackLinks = [
  { label: "Next.js", href: "https://nextjs.org" },
  { label: "Vapi", href: "https://vapi.ai" },
  { label: "Prisma", href: "https://www.prisma.io" },
  { label: "PostgreSQL", href: "https://www.postgresql.org" },
];

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const LandingFooter = () => {
  return (
    <footer className="bg-[var(--landing-parchment-deep)]">
      <div className="h-1 w-full bg-[var(--landing-maroon)]" aria-hidden />

      <div className="wrapper py-14 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            custom={0}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <Link href="/" className="inline-flex cursor-pointer items-center gap-2">
              <Image
                src="/assets/logo-mark.png"
                alt="BookBy"
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
              <span className="logo-text !block">BookBy</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              Turn PDFs into interactive voice conversations — listen, ask, and
              learn from your own library.
            </p>
          </motion.div>

          <motion.nav
            aria-label="Product"
            custom={1}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--landing-maroon)]">
              Product
            </p>
            <ul className="flex flex-col gap-2">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="cursor-pointer text-sm font-medium text-[var(--landing-ink)] transition-all hover:text-[var(--landing-maroon)] hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.nav
            aria-label="Explore"
            custom={2}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--landing-maroon)]">
              Explore
            </p>
            <ul className="flex flex-col gap-2">
              {exploreLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="cursor-pointer text-sm font-medium text-[var(--landing-ink)] transition-all hover:text-[var(--landing-maroon)] hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.nav
            aria-label="Stack"
            custom={3}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--landing-maroon)]">
              Stack
            </p>
            <ul className="flex flex-col gap-2">
              {stackLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-sm font-medium text-[var(--landing-ink)] transition-all hover:text-[var(--landing-maroon)] hover:underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>
      </div>

      <div className="border-t border-[color-mix(in_srgb,var(--landing-maroon)_18%,transparent)] bg-[var(--landing-parchment)]">
        <div className="wrapper flex flex-col gap-2 py-5 text-sm text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BookBy. All rights reserved.</p>
          <p className="text-[var(--text-muted)]">
            Talk with your books. · Built with Next.js · Vapi · Prisma
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
