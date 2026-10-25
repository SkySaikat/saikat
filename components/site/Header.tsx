"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import AccentPicker from "./AccentPicker";
import { openPalette } from "@/components/ai/palette-bus";
import { NAV, SITE } from "@/lib/content";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-bg/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${SITE.name}, home`}>
          <span className="grid size-9 place-items-center rounded-full bg-accent font-display text-[15px] font-bold text-accent-ink transition-transform duration-500 group-hover:rotate-[-12deg]">
            S
          </span>
          <span className="hidden font-display text-[17px] font-semibold tracking-tight sm:block">{SITE.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[14px] text-muted">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <AccentPicker />
          <button
            onClick={() => openPalette()}
            className="hidden h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-muted transition hover:border-white/25 hover:text-ink md:flex"
          >
            <Sparkles className="size-4 text-accent" />
            Ask AI
            <kbd className="font-mono text-[10px] text-dim">⌘K</kbd>
          </button>
          <Link
            href="/#contact"
            className="hidden h-10 items-center rounded-full bg-accent px-5 text-[14px] font-medium text-accent-ink transition hover:brightness-110 sm:flex"
          >
            Hire me
          </Link>
          <button
            className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-line px-5 pb-6 pt-2 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="display block py-3 text-[34px]">
              {n.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              openPalette();
            }}
            className="mt-3 flex items-center gap-2 text-[15px] text-accent"
          >
            <Sparkles className="size-4" /> Ask my AI twin
          </button>
        </nav>
      )}
    </header>
  );
}
