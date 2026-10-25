"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { ACCENTS, DEFAULT_ACCENT, applyAccent, type Accent } from "@/lib/accent";

function useAccent() {
  const [id, setId] = useState(DEFAULT_ACCENT.id);
  useEffect(() => {
    setId(document.documentElement.dataset.accent || DEFAULT_ACCENT.id);
    const on = (e: Event) => setId((e as CustomEvent<string>).detail);
    window.addEventListener("accent:change", on);
    return () => window.removeEventListener("accent:change", on);
  }, []);
  const choose = (a: Accent) => {
    document.documentElement.classList.add("accent-transition");
    applyAccent(a);
    window.setTimeout(() => document.documentElement.classList.remove("accent-transition"), 600);
  };
  return [id, choose] as const;
}

function Swatches({ id, choose, size = "md" }: { id: string; choose: (a: Accent) => void; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "size-6" : "size-8";
  return (
    <div role="radiogroup" aria-label="Accent colour" className="flex flex-wrap items-center gap-2">
      {ACCENTS.map((a) => {
        const on = a.id === id;
        return (
          <button
            key={a.id}
            role="radio"
            aria-checked={on}
            aria-label={a.name}
            title={a.name}
            onClick={() => choose(a)}
            className={`${dim} grid place-items-center rounded-full transition-transform duration-300 hover:scale-110 ${on ? "ring-2 ring-ink ring-offset-2 ring-offset-bg" : ""}`}
            style={{ background: a.hex, color: a.ink }}
          >
            {on && <Check className="size-3.5" strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
}

// Inline row of swatches, used in the hero.
export function AccentSwatches() {
  const [id, choose] = useAccent();
  return <Swatches id={id} choose={choose} />;
}

// Compact trigger + popover, used in the header.
export default function AccentPicker() {
  const [id, choose] = useAccent();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Change accent colour"
        className="flex h-10 items-center gap-2 rounded-full border border-line px-3 text-[13px] text-muted transition hover:border-white/25 hover:text-ink"
      >
        <span className="size-4 rounded-full bg-accent" />
        <Palette className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[248px] rounded-2xl border border-line bg-surface p-4 shadow-2xl shadow-black/60">
          <p className="label mb-3">Pick your colour</p>
          <Swatches id={id} choose={choose} size="sm" />
        </div>
      )}
    </div>
  );
}
