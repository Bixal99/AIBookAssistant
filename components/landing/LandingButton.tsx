"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LandingButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const LandingButton = ({
  href,
  children,
  variant = "primary",
  className,
}: LandingButtonProps) => {
  return (
    <motion.div
      className="inline-flex"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
    >
      <Link
        href={href}
        className={cn(
          "cursor-pointer inline-flex items-center justify-center rounded-[10px] px-6 py-3 font-bold transition-colors duration-200",
          variant === "primary" &&
            "bg-[var(--landing-maroon)] text-white hover:bg-[var(--landing-maroon-hover)] shadow-[var(--shadow-soft-sm)] hover:shadow-[var(--shadow-soft-md)]",
          variant === "secondary" &&
            "border border-[var(--border-medium)] bg-white/80 font-medium text-[var(--landing-ink)] hover:border-[var(--landing-maroon)] hover:bg-white hover:text-[var(--landing-maroon)]",
          className,
        )}
        style={
          variant === "primary"
            ? { fontFamily: "var(--font-ibm-plex-serif), serif" }
            : undefined
        }
      >
        {children}
      </Link>
    </motion.div>
  );
};

export default LandingButton;
