"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const LandingHero = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const targets = [
        ".landing-brand",
        ".landing-headline",
        ".landing-support",
        ".landing-ctas",
        ".landing-visual",
      ];

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(targets, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(
        [
          ".landing-brand",
          ".landing-headline",
          ".landing-support",
          ".landing-ctas",
        ],
        { opacity: 0, y: 28 },
      );
      gsap.set(".landing-visual", { opacity: 0, y: 36, scale: 0.97 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".landing-brand", { opacity: 1, y: 0, duration: 0.7 })
        .to(".landing-headline", { opacity: 1, y: 0, duration: 0.75 }, "-=0.35")
        .to(".landing-support", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .to(".landing-ctas", { opacity: 1, y: 0, duration: 0.55 }, "-=0.3")
        .to(
          ".landing-visual",
          { opacity: 1, y: 0, scale: 1, duration: 1 },
          "-=0.7",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="landing-hero relative overflow-hidden bg-[var(--landing-parchment)]"
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

      <div className="landing-visual pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] md:block">
        <div className="relative h-full w-full">
          <Image
            src="/assets/hero-illustration.png"
            alt=""
            fill
            priority
            sizes="55vw"
            className="object-contain object-right drop-shadow-[var(--shadow-soft-lg)]"
          />
        </div>
      </div>

      <div className="relative wrapper flex min-h-[100svh] flex-col justify-center pt-[calc(var(--navbar-height)+5.5rem)] pb-20 md:pt-[calc(var(--navbar-height)+4rem)] md:pb-24">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="max-w-xl">
            <p className="landing-brand font-serif text-5xl font-bold tracking-[-0.03em] text-[var(--landing-ink)] sm:text-6xl md:text-7xl">
              BookBy
            </p>
            <h1 className="landing-headline mt-4 font-serif text-3xl font-semibold leading-tight tracking-[-0.02em] text-[var(--landing-ink)] sm:text-4xl md:text-5xl">
              Talk with your books
            </h1>
            <p className="landing-support mt-5 max-w-md text-lg leading-relaxed text-[var(--text-secondary)]">
              Upload a PDF and explore it through voice — summaries, questions,
              and conversation in one place.
            </p>
            <div className="landing-ctas mt-8 flex flex-wrap items-center gap-3">
              <Link href="/books/new" className="btn-landing">
                Start with a book
              </Link>
              <Link
                href="/library"
                className="inline-flex items-center justify-center rounded-[10px] border border-[var(--border-medium)] bg-white/70 px-6 py-3 font-medium text-[var(--text-secondary)] transition-colors hover:bg-white"
              >
                Browse library
              </Link>
            </div>
          </div>

          <div className="landing-visual relative mx-auto w-full max-w-sm md:invisible md:h-0 md:max-w-none">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books and a globe"
              width={480}
              height={480}
              priority
              className="h-auto w-full object-contain drop-shadow-[var(--shadow-soft-lg)]"
            />
          </div>
        </div>
      </div>

      <div className="landing-divider" aria-hidden />
    </section>
  );
};

export default LandingHero;
