"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { bindPointer, pointer } from "@/lib/pointer";
import { INTRO_EVENT, introDone } from "@/lib/ready";
import Cursor from "./Cursor";
import Preloader from "./Preloader";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
    __introDone?: boolean;
  }
}

export default function Experience() {
  const blobs = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bindPointer();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!location.hash) window.scrollTo(0, 0);

    /* Smooth scroll */
    let lenis: Lenis | undefined;
    const raf = (t: number) => lenis?.raf(t * 1000);
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      if (!introDone()) lenis.stop();
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href")!;
      const el = hash === "#" ? document.body : document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -16, duration: 1.4 });
      else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    /* Scroll reveals and foreground parallax, armed once the intro finishes */
    let ctx: gsap.Context | undefined;
    const arm = () => {
      lenis?.start();
      ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        if (reduced) {
          gsap.set(items, { opacity: 1 });
          return;
        }
        // Hero items play straight away; everything else waits for its scroll position.
        const hero = items.filter((el) => el.closest("#top"));
        const rest = items.filter((el) => !el.closest("#top"));
        gsap.fromTo(hero, { y: 36 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.07, delay: 0.35 });
        gsap.set(rest, { y: 36 });
        ScrollTrigger.batch(rest, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
        });
        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
          const speed = parseFloat(el.dataset.speed || "0");
          // yPercent so it composes with the reveal tween, which owns y.
          gsap.fromTo(
            el,
            { yPercent: speed * 100 },
            {
              yPercent: -speed * 100,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      ScrollTrigger.refresh();
    };
    if (introDone()) arm();
    else window.addEventListener(INTRO_EVENT, arm, { once: true });

    /* Mid-ground glow parallax: moves slower than the cursor, faster than the spears */
    let blobRaf = 0;
    const b = { x: 0, y: 0 };
    const loopBlobs = () => {
      blobRaf = requestAnimationFrame(loopBlobs);
      b.x += (pointer.nx * 40 - b.x) * 0.03;
      b.y += (-pointer.ny * 30 - b.y) * 0.03;
      const sy = Math.sin(window.scrollY / 1400) * 140;
      if (blobs.current) blobs.current.style.transform = `translate3d(${b.x}px, ${b.y + sy}px, 0)`;
    };
    if (!reduced) loopBlobs();

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener(INTRO_EVENT, arm);
      cancelAnimationFrame(blobRaf);
      ctx?.revert();
      gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);

  return (
    <>
      <Preloader />
      {/* Ambient layers sit above the hero cover so they read continuously down the page. */}
      <div aria-hidden className="layer-fixed z-[3]">
        <div ref={blobs} className="absolute inset-0 will-change-transform">
          <div className="absolute -left-[10vw] -top-[20vh] size-[60vw] rounded-full bg-a1/[0.07] blur-[120px]" />
          <div className="absolute -right-[15vw] top-[30vh] size-[50vw] rounded-full bg-a3/[0.06] blur-[120px]" />
          <div className="absolute bottom-[-30vh] left-[25vw] size-[45vw] rounded-full bg-a2/[0.05] blur-[120px]" />
        </div>
        <div className="bg-grid absolute inset-0" />
        <div className="bg-grid-lit absolute inset-0" />
        <div className="spotlight absolute inset-0" />
      </div>
      <Scene />
      <div aria-hidden className="layer-fixed grain z-[5]" />
      <Cursor />
    </>
  );
}
