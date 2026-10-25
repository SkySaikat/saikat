"use client";

import { useEffect, useRef } from "react";
import { pointer } from "@/lib/pointer";

/*
  rAF-interpolated cursor: a precise dot, a lagging ring that grows over
  interactive elements (and shows a label from data-cursor), the ambient
  spotlight position (--cx / --cy on :root), and per-card --mx / --my for the
  lit glass borders.
*/
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const root = document.documentElement;
    if (fine) root.classList.add("has-cursor");

    const s = { dx: pointer.x, dy: pointer.y, rx: pointer.x, ry: pointer.y, sx: pointer.x, sy: pointer.y, scale: 1, hover: 0, field: false };
    let target: HTMLElement | null = null;
    let raf = 0;
    let glowEls: HTMLElement[] = [];
    const collect = () => {
      glowEls = Array.from(document.querySelectorAll<HTMLElement>("[data-glow]"));
    };
    collect();
    const mo = new MutationObserver(() => collect());
    mo.observe(document.body, { childList: true, subtree: true });

    const onOver = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor], input, textarea, select");
      target = el;
      const text = el?.dataset.cursor ?? "";
      if (label.current) label.current.textContent = text;
      ring.current?.classList.toggle("has-label", !!text);
      s.field = !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
    };
    document.addEventListener("pointerover", onOver);
    const onDown = () => (s.scale = 0.8);
    const onUp = () => (s.scale = 1);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    let lastX = -1;
    let lastY = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      s.dx += (pointer.x - s.dx) * 0.45;
      s.dy += (pointer.y - s.dy) * 0.45;
      s.rx += (pointer.x - s.rx) * 0.16;
      s.ry += (pointer.y - s.ry) * 0.16;
      s.sx += (pointer.x - s.sx) * 0.08;
      s.sy += (pointer.y - s.sy) * 0.08;
      s.hover += ((target ? 1 : 0) - s.hover) * 0.15;

      if (fine) {
        const visible = pointer.active && !s.field ? "1" : "0";
        if (dot.current) {
          dot.current.style.transform = `translate3d(${s.dx}px, ${s.dy}px, 0) translate(-50%, -50%)`;
          dot.current.style.opacity = visible;
        }
        if (ring.current) {
          const hasLabel = ring.current.classList.contains("has-label");
          const size = 1 + s.hover * (hasLabel ? 1.6 : 0.6);
          ring.current.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) translate(-50%, -50%) scale(${size * s.scale})`;
          ring.current.style.opacity = visible;
        }
      }

      root.style.setProperty("--cx", `${s.sx.toFixed(1)}px`);
      root.style.setProperty("--cy", `${s.sy.toFixed(1)}px`);

      // Only touch card variables when the pointer actually moved.
      if (Math.abs(pointer.x - lastX) + Math.abs(pointer.y - lastY) > 0.5) {
        lastX = pointer.x;
        lastY = pointer.y;
        const vh = window.innerHeight;
        for (const el of glowEls) {
          const r = el.getBoundingClientRect();
          if (r.bottom < -300 || r.top > vh + 300) continue;
          el.style.setProperty("--mx", `${(pointer.x - r.left).toFixed(0)}px`);
          el.style.setProperty("--my", `${(pointer.y - r.top).toFixed(0)}px`);
        }
      }
    };
    loop();

    // Keep card variables honest while scrolling with a still pointer.
    const onScroll = () => {
      lastX = -1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      root.classList.remove("has-cursor");
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden [@media(pointer:fine)]:block">
      <div ref={dot} className="absolute left-0 top-0 size-1.5 rounded-full bg-white mix-blend-difference transition-opacity" />
      <div
        ref={ring}
        className="group absolute left-0 top-0 flex size-9 items-center justify-center rounded-full border border-white/40 opacity-0 backdrop-blur-[2px] transition-[opacity,background-color,border-color] duration-300 [&.has-label]:border-transparent [&.has-label]:bg-white"
      >
        <span ref={label} className="font-mono text-[6px] font-medium uppercase tracking-[0.12em] text-obsidian" />
      </div>
    </div>
  );
}
