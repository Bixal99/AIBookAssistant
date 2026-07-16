"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { AUTH_COPY, ROUTES } from "@/lib/auth-constants";

gsap.registerPlugin(useGSAP);

type AuthShellProps = {
  headline: string;
  support: string;
  children: ReactNode;
};

const AuthShell = ({ headline, support, children }: AuthShellProps) => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const targets = [".auth-brand", ".auth-headline", ".auth-support", ".auth-form"];
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 24 });
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".auth-brand", { opacity: 1, y: 0, duration: 0.55 })
        .to(".auth-headline", { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .to(".auth-support", { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
        .to(".auth-form", { opacity: 1, y: 0, duration: 0.55 }, "-=0.3");
    },
    { scope: containerRef },
  );

  return (
    <main
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden bg-[var(--landing-parchment)]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 40%, #f3e4c7 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 15% 80%, #fff6e5 0%, transparent 50%), linear-gradient(165deg, #f8f4e9 0%, #f3e4c7 48%, #efe0c0 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] lg:block">
        <div className="relative h-full w-full">
          <Image
            src="/assets/hero-illustration.png"
            alt=""
            fill
            priority
            sizes="48vw"
            className="object-contain object-right drop-shadow-[var(--shadow-soft-lg)]"
          />
        </div>
      </div>

      <div className="relative wrapper flex min-h-[100svh] flex-col justify-center py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="max-w-md">
            <Link
              href={ROUTES.home}
              className="auth-brand inline-flex items-center gap-2"
            >
              <Image
                src="/assets/logo-mark.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                priority
              />
              <span className="font-serif text-4xl font-bold tracking-[-0.03em] text-[var(--landing-ink)] sm:text-5xl">
                {AUTH_COPY.brand}
              </span>
            </Link>

            <h1 className="auth-headline mt-8 font-serif text-3xl font-semibold tracking-[-0.02em] text-[var(--landing-ink)] sm:text-4xl">
              {headline}
            </h1>
            <p className="auth-support mt-3 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              {support}
            </p>

            <div className="auth-form mt-8">{children}</div>
          </div>

          <div className="relative mx-auto w-full max-w-xs lg:invisible lg:h-0 lg:max-w-none">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books and a globe"
              width={400}
              height={400}
              priority
              className="h-auto w-full object-contain drop-shadow-[var(--shadow-soft-lg)]"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthShell;
