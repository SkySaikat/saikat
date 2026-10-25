"use client";

import { useEffect, useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { NAV, SITE } from "@/lib/content";
import { openPalette } from "@/components/ai/palette-bus";

export default function Nav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mac, setMac] = useState(true);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const ids = NAV.map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] px-4 pt-4 md:px-8">
      <nav
        className={`mx-auto flex max-w-[1400px] items-center justify-between rounded-full py-2 pl-5 pr-2 transition-all duration-500 ${
          scrolled ? "glass" : "bg-transparent"
        }`}
        style={{ ["--radius" as string]: "999px" }}
        data-glow
        aria-label="Primary"
      >
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Back to top">
          <span className="relative grid size-8 place-items-center overflow-hidden rounded-lg bg-white/5 font-mono text-[12px] font-semibold ring-1 ring-white/10">
            SC
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </span>
          <span className="hidden text-sm font-medium tracking-tight sm:inline">{SITE.name}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const on = active === n.href.slice(1);
            return (
              <li key={n.href}>
                <a
                  href={n.href}
                  className={`relative rounded-full px-4 py-2 text-[13px] transition-colors ${on ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  {on && <span className="absolute inset-0 rounded-full bg-white/[0.06] ring-1 ring-white/10" />}
                  <span className="relative">{n.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openPalette()}
            className="hidden items-center gap-2 rounded-full bg-white/[0.04] px-3.5 py-2 text-[13px] text-muted ring-1 ring-white/10 transition hover:text-ink hover:ring-white/25 sm:flex"
          >
            <Sparkles className="size-3.5 text-a2" />
            Ask AI
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-ink/80">{mac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <a
            href="#contact"
            className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-obsidian transition hover:bg-white"
          >
            Hire me
          </a>
          <button
            className="grid size-9 place-items-center rounded-full ring-1 ring-white/10 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-[1400px] p-3 md:hidden" style={{ ["--radius" as string]: "24px" }}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-lg">
              {n.label}
            </a>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              openPalette();
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-lg text-a2"
          >
            <Sparkles className="size-4" /> Ask my AI twin
          </button>
        </div>
      )}
    </header>
  );
}
