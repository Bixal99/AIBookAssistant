"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FEATURES = [
  {
    title: "Upload PDFs",
    detail: "Ingest long-form reading and split it into searchable segments.",
  },
  {
    title: "Voice conversations",
    detail: "Ask questions through Vapi and talk with your book in real time.",
  },
  {
    title: "Your library",
    detail: "Keep covers, titles, and recent uploads in one warm reading space.",
  },
  {
    title: "Transcripts",
    detail: "Revisit past sessions so insights from a conversation are not lost.",
  },
  {
    title: "Search",
    detail: "Find books by title or author and jump back into what matters.",
  },
  {
    title: "Summaries",
    detail: "Get oriented quickly with AI-assisted follow-ups and summaries.",
  },
];

const LandingFeatures = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set([".features-heading", ".feature-card"], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.from(".features-heading", {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".feature-card", {
        opacity: 0,
        y: 32,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
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
        id="features"
        ref={sectionRef}
        className="landing-section scroll-mt-28 bg-[var(--landing-parchment)]"
      >
        <div className="wrapper">
          <div className="features-heading max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--landing-maroon)]">
              Features
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.02em] text-[var(--landing-ink)] sm:text-4xl">
              Everything you need to learn from a book out loud
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              From upload to voice session, BookBy keeps the reading experience
              simple, searchable, and conversation-ready.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, detail }) => (
              <li
                key={title}
                className="feature-card rounded-2xl border border-[var(--border-subtle)] bg-[var(--landing-parchment-deep)]/60 p-6 shadow-[var(--shadow-soft-sm)]"
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-[var(--landing-maroon)]" />
                <h3 className="font-serif text-xl font-semibold text-[var(--landing-ink)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default LandingFeatures;
