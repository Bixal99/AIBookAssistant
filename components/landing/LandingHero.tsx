"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LandingButton from "@/components/landing/LandingButton";
import { AUTH_COPY, ROUTES } from "@/lib/auth-constants";

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

      <div className="landing-visual pointer-events-none absolute inset-y-0 right-0 hidden w-[min(55%,42rem)] lg:block">
        <div className="relative h-full w-full">
          <Image
            src="/assets/hero-illustration.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 0px"
            className="object-contain object-right drop-shadow-[var(--shadow-soft-lg)]"
          />
        </div>
      </div>

      <div className="relative wrapper flex min-h-[100svh] flex-col justify-center pt-[calc(var(--navbar-height)+2rem)] pb-12 sm:pb-16 md:pt-[calc(var(--navbar-height)+3rem)] md:pb-20 max-[640px]:min-h-0 max-[640px]:pt-[calc(var(--navbar-height)+1.5rem)] [@media(max-height:700px)]:min-h-0 [@media(max-height:700px)]:py-16 [@media(max-height:700px)]:pt-[calc(var(--navbar-height)+1.25rem)]">
        <div className="grid min-w-0 items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="min-w-0 max-w-xl">
            <p className="landing-brand font-serif text-[clamp(2.25rem,8vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--landing-ink)]">
              BookBy
            </p>
            <h1 className="landing-headline mt-3 font-serif text-[clamp(1.5rem,5vw,3rem)] font-semibold leading-tight tracking-[-0.02em] text-[var(--landing-ink)] sm:mt-4">
              Talk with your books
            </h1>
            <p className="landing-support mt-4 max-w-md text-base leading-relaxed text-[var(--text-secondary)] sm:mt-5 sm:text-lg">
              Upload a PDF and explore it through voice — summaries, questions,
              and conversation in one place.
            </p>
            <div className="landing-ctas mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <LandingButton
                href={ROUTES.signUp}
                className="w-full justify-center sm:w-auto"
              >
                {AUTH_COPY.getStarted}
              </LandingButton>
              <LandingButton
                href={ROUTES.signIn}
                variant="secondary"
                className="w-full justify-center sm:w-auto"
              >
                {AUTH_COPY.signInCta}
              </LandingButton>
            </div>
          </div>

          <div className="landing-visual relative mx-auto w-full max-w-[min(100%,22rem)] sm:max-w-sm lg:invisible lg:h-0 lg:max-w-none">
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
