"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { ROUTES } from "@/lib/auth-constants";

export default function BookSessionNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <Link
        href={ROUTES.library}
        className="back-btn-floating"
        aria-label="Back to library"
      >
        <ArrowLeft className="size-5 sm:size-6" />
      </Link>

      <button
        type="button"
        aria-label="Toggle theme"
        onClick={toggleTheme}
        disabled={!mounted}
        className="theme-btn-floating"
      >
        {mounted && resolvedTheme === "dark" ? (
          <Sun className="size-5" />
        ) : (
          <Moon className="size-5" />
        )}
      </button>
    </>
  );
}
