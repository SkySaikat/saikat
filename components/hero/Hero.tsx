"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDownRight, ArrowRight, Download, MousePointer2, Sparkles } from "lucide-react";
import FluidReveal from "./FluidReveal";
import HeroUnderlay from "./HeroUnderlay";
import Magnetic from "@/components/ui/Magnetic";
import { openPalette } from "@/components/ai/palette-bus";
import { SITE } from "@/lib/content";
import { INTRO_EVENT, introDone } from "@/lib/ready";

function Chars({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex overflow-hidden pb-[0.08em] ${className ?? ""}`} aria-hidden>
      {text.split("").map((c, i) => (
        <span key={i} className="hero-char inline-block will-change-transform">
          {c}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [fluid, setFluid] = useState<boolean | null>(null);
  const [portrait3d, setPortrait3d] = useState(false);
  const [reduced, setReduced] = useState(false);
  const onReady = useCallback((ok: boolean) => setFluid(ok), []);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onPortrait = () => setPortrait3d(true);
    window.addEventListener("portrait:ready", onPortrait);

    // The preloader covers the hero, so the letters can be parked below their
    // line here and slide up once the iris opens.
    const chars = root.current?.querySelectorAll(".hero-char");
    if (chars && !introDone()) gsap.set(chars, { yPercent: 110 });

    const play = () => {
      const el = root.current;
      if (!el) return;
      gsap.to(el.querySelectorAll(".hero-char"), {
        yPercent: 0,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.035,
        delay: 0.15,
      });
    };
    if (introDone()) play();
    else window.addEventListener(INTRO_EVENT, play, { once: true });
    return () => {
      window.removeEventListener("portrait:ready", onPortrait);
      window.removeEventListener(INTRO_EVENT, play);
    };
  }, []);

  return (
    <section ref={root} id="top" className="relative min-h-[100svh] overflow-hidden">
      {/* What the cursor uncovers */}
      <div className={`absolute inset-0 z-[1] transition-opacity duration-700 ${fluid ? "opacity-100" : "opacity-0"}`}>
        <HeroUnderlay />
      </div>
      {/* The ink cover */}
      <div className="absolute inset-0 z-[2]">
        <FluidReveal onReady={onReady} reducedMotion={reduced} />
      </div>

      <div className="relative z-[4] mx-auto grid min-h-[100svh] max-w-[1400px] grid-cols-1 items-center gap-12 px-5 pb-28 pt-32 md:px-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-8">
        <div>
          <div data-reveal className="glass-soft inline-flex max-w-full items-center gap-3 rounded-full px-4 py-2 backdrop-blur-md">
            <span className="pulse-dot shrink-0" />
            <span className="truncate font-mono text-[11px] tracking-wide text-ink/85 sm:text-[12px]">{SITE.status}</span>
          </div>

          <h1 className="mt-8 font-sans text-[clamp(56px,10.5vw,168px)] font-semibold leading-[0.86] tracking-[-0.055em]">
            <span className="sr-only">{SITE.name}</span>
            <Chars text={SITE.firstName} />
            <br />
            {/* One line, not per-letter: background-clip text breaks on transformed children. */}
            <span className="inline-flex overflow-hidden pb-[0.12em]" aria-hidden>
              <span className="hero-char inline-block pr-[0.08em] font-serif font-normal italic tracking-[-0.02em] text-gradient will-change-transform">
                {SITE.lastName}
              </span>
            </span>
          </h1>

          <p data-reveal className="mt-6 max-w-[640px] font-mono text-[13px] uppercase leading-relaxed tracking-[0.14em] text-a2 md:text-[14px]">
            {SITE.role}
          </p>

          <p data-reveal className="mt-6 max-w-[600px] text-[15px] leading-[1.75] text-muted md:text-[16px]">
            {SITE.bio}
          </p>

          <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                data-cursor="Scroll"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink py-3.5 pl-6 pr-4 text-[14px] font-medium text-obsidian"
              >
                <span className="absolute inset-0 -z-0 translate-y-full bg-gradient-to-r from-a1 via-a2 to-a3 transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                <span className="relative transition-colors group-hover:text-white">Explore Featured Work</span>
                <span className="relative grid size-7 place-items-center rounded-full bg-obsidian text-ink transition-transform duration-500 group-hover:rotate-[-45deg]">
                  <ArrowRight className="size-3.5" />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => openPalette()}
                className="glass inline-flex items-center gap-2.5 py-3.5 pl-5 pr-5 text-[14px] text-ink"
                style={{ ["--radius" as string]: "999px" }}
                data-glow
              >
                <Sparkles className="size-4 text-a2" />
                Initialize AI Chat
              </button>
            </Magnetic>
            <Magnetic>
              <a
                href={SITE.cv}
                download
                className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-[14px] text-muted underline-offset-4 transition hover:text-ink hover:underline"
              >
                <Download className="size-4" />
                Download CV
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[400px] lg:mx-0 lg:ml-auto" data-reveal>
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            <span>fig. 01</span>
            <span>Founder, Wonder Web Studio</span>
          </div>
          <div id="hero-portrait-anchor" className="relative aspect-[4/5] w-full" data-cursor="Hi!">
            <Image
              src={SITE.portrait}
              alt={`Portrait of ${SITE.name}`}
              fill
              priority
              sizes="(max-width: 1024px) 80vw, 400px"
              className={`rounded-[20px] object-cover transition-opacity duration-700 ${portrait3d ? "opacity-0" : "opacity-100"}`}
            />
          </div>
          <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            <span>{SITE.location}</span>
            <span>GMT+6</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] mx-auto flex max-w-[1400px] items-end justify-between px-5 pb-8 md:px-10">
        <p data-reveal className="flex items-center gap-2.5 font-mono text-[11px] text-muted">
          <MousePointer2 className="size-3.5 text-a2" />
          <span className="hidden sm:inline">Move your cursor. There is code under the surface.</span>
          <span className="sm:hidden">Drag to look under the surface.</span>
        </p>
        <a href="#work" data-reveal className="pointer-events-auto flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted hover:text-ink">
          Scroll <ArrowDownRight className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
