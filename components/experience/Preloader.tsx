"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { isReady, markReady, INTRO_EVENT, type ReadyKey } from "@/lib/ready";

const LOG = [
  { at: 0, text: "boot sequence initiated" },
  { at: 12, text: "Initializing WebGL shaders..." },
  { at: 30, text: "Forging crystalline lances..." },
  { at: 48, text: "Connecting MCP nodes: google-ads, callrail, ga4, gsc" },
  { at: 66, text: "Compiling portfolio assets..." },
  { at: 84, text: "Calibrating cursor fluid..." },
  { at: 99, text: "ready. welcome." },
];

// Weight of each real task in the progress bar. The rest is a minimum runtime
// so the sequence never flashes by.
const WEIGHTS: Record<ReadyKey, number> = { fonts: 0.2, images: 0.25, scene: 0.35 };

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let quick = false;
    try {
      quick = sessionStorage.getItem("sc-intro") === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minDuration = reduced ? 300 : quick ? 900 : 2200;
    const maxWait = 6000;
    const t0 = performance.now();

    document.fonts?.ready.then(() => markReady("fonts"));
    // Hero imagery used above the fold.
    const imgs = ["/img/saikat.png"];
    let loaded = 0;
    imgs.forEach((src) => {
      const im = new Image();
      im.onload = im.onerror = () => {
        loaded++;
        if (loaded === imgs.length) markReady("images");
      };
      im.src = src;
    });

    let shown = 0;
    let finished = false;
    const state = { p: 0 };
    let raf = 0;

    const tick = () => {
      const now = performance.now();
      const elapsed = now - t0;
      const timeShare = Math.min(elapsed / minDuration, 1) * 0.2;
      let real = 0;
      (Object.keys(WEIGHTS) as ReadyKey[]).forEach((k) => {
        if (isReady(k)) real += WEIGHTS[k];
      });
      const forced = elapsed > maxWait;
      let target = forced ? 1 : Math.min(timeShare + real, 1);
      if (target > 0.995) target = 1; // float sums of the weights land on 0.9999...
      // Hold at 99 until the minimum time has passed.
      if (elapsed < minDuration) target = Math.min(target, (elapsed / minDuration) * 0.99);
      state.p += (target - state.p) * 0.12;
      if (target === 1 && 1 - state.p < 0.004) state.p = 1;

      const pct = Math.round(state.p * 100);
      if (counter.current) counter.current.textContent = String(pct).padStart(2, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${state.p})`;
      const next = LOG.filter((l) => l.at <= pct).length;
      if (next !== shown) {
        shown = next;
        setLines(next);
      }
      if (state.p >= 1 && !finished) {
        finished = true;
        reveal(reduced);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const reveal = (reduced: boolean) => {
      try {
        sessionStorage.setItem("sc-intro", "1");
      } catch {}
      const el = root.current;
      const announce = () => {
        (window as unknown as { __introDone?: boolean }).__introDone = true;
        window.dispatchEvent(new Event(INTRO_EVENT));
      };
      if (!el || reduced) {
        announce();
        setGone(true);
        return;
      }
      const tl = gsap.timeline({ onComplete: () => setGone(true) });
      tl.to(el.querySelectorAll("[data-pre-fade]"), { opacity: 0, y: -16, duration: 0.45, ease: "power2.in", stagger: 0.04 })
        .to(el.querySelector("[data-pre-count]"), { yPercent: -110, duration: 0.6, ease: "power3.in" }, 0)
        .fromTo(
          el,
          { "--r": "0vmax" },
          { "--r": "150vmax", duration: 1.25, ease: "expo.inOut", onStart: announce },
          0.35,
        )
        .fromTo(
          el.querySelector("[data-pre-ring]"),
          { scale: 0, opacity: 1 },
          { scale: 5, opacity: 0.2, duration: 1.25, ease: "expo.inOut" },
          0.35,
        );
    };

    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[10000] flex flex-col justify-between bg-obsidian p-6 md:p-10"
      style={{
        // Iris opening: the hole radius grows from the centre.
        ["--r" as string]: "0vmax",
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent var(--r), #000 calc(var(--r) + 1px))",
        maskImage: "radial-gradient(circle at 50% 50%, transparent var(--r), #000 calc(var(--r) + 1px))",
      }}
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div data-pre-fade className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <span>Saikat Chowdhury</span>
        <span className="hidden sm:inline">Portfolio / v2026</span>
        <span>Chattogram, BD</span>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div data-pre-fade className="min-h-[180px] font-mono text-[12px] leading-7 text-muted">
          {LOG.slice(0, lines).map((l, i) => (
            <div key={l.text} className="flex gap-3">
              <span className="text-dim">{String(i).padStart(2, "0")}</span>
              <span className={i === lines - 1 ? "text-ink" : ""}>&gt; {l.text}</span>
              {i < lines - 1 && <span className="text-emerald">[ok]</span>}
            </div>
          ))}
        </div>
        <div className="overflow-hidden">
          <div data-pre-count className="font-sans text-[22vw] leading-[0.8] font-semibold tracking-[-0.06em] tabular-nums md:text-[13vw]">
            <span ref={counter}>00</span>
            <span className="text-a2">%</span>
          </div>
        </div>
      </div>

      <div data-pre-fade className="h-px w-full overflow-hidden bg-white/10">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-a1 via-a2 to-a3" />
      </div>

      <div
        data-pre-ring
        className="pointer-events-none absolute left-1/2 top-1/2 size-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-a2/70 opacity-0"
        style={{ boxShadow: "0 0 60px rgb(var(--a2-rgb) / 0.5), inset 0 0 60px rgb(var(--a2-rgb) / 0.3)" }}
      />
    </div>
  );
}
