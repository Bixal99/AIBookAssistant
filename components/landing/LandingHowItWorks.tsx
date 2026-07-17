"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  {
    num: "01",
    title: "Upload PDF",
    detail: "Add your book file and we extract the text into readable segments.",
  },
  {
    num: "02",
    title: "AI Processing",
    detail: "Content is analyzed, stored, and prepared for search and conversation.",
  },
  {
    num: "03",
    title: "Voice Chat",
    detail: "Ask questions out loud and explore ideas through a live voice session.",
  },
];

const LandingHowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const heading = sectionRef.current?.querySelector(".how-heading");
      const steps = sectionRef.current?.querySelectorAll(".how-step");

      if (!heading || !steps?.length) return;

      if (reduceMotion) {
        gsap.set([heading, steps], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(heading, { opacity: 0, y: 40 });
      gsap.set(steps, { opacity: 0, y: 48 });

      gsap.to(heading, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.to(steps, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="landing-section-maroon scroll-mt-28"
    >
      <div className="wrapper">
        <div className="how-heading max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
            How it works
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Three steps from PDF to conversation
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
            BookBy turns static reading into an interactive voice companion —
            without changing how you already collect books.
          </p>
        </div>

        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map(({ num, title, detail }) => (
            <li
              key={num}
              className="how-step cursor-default rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10"
            >
              <span className="font-serif text-3xl font-bold text-white/40">
                {num}
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default LandingHowItWorks;
