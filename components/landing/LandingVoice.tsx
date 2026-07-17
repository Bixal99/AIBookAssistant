"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LandingVoice = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(".voice-content", { opacity: 1, y: 0 });
        return;
      }

      gsap.from(".voice-content", {
        opacity: 0,
        y: 36,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <>
      <div className="landing-divider" aria-hidden />
      <section
        id="voice"
        ref={sectionRef}
        className="landing-section-maroon-soft scroll-mt-28"
      >
        <div className="wrapper">
          <div className="voice-content mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--landing-maroon)]">
              Voice-first reading
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.02em] text-[var(--landing-ink)] sm:text-4xl md:text-5xl">
              Put the book on the line and ask what you need
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              BookBy pairs your uploaded PDF with a live Vapi voice session so
              you can clarify passages, chase ideas, and learn at conversation
              speed.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/books/new" className="btn-landing">
                Start with a book
              </Link>
              <Link
                href="/library"
                className="inline-flex items-center justify-center rounded-[10px] border border-[color-mix(in_srgb,var(--landing-maroon)_35%,transparent)] bg-white/80 px-6 py-3 font-medium text-[var(--landing-ink)] transition-colors hover:bg-white"
              >
                Open your library
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="landing-divider" aria-hidden />
    </>
  );
};

export default LandingVoice;
