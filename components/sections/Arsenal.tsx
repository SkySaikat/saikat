"use client";

import { useState } from "react";
import { motion } from "motion/react";
import SectionHeading, { Serif } from "@/components/ui/SectionHeading";
import { ARSENAL } from "@/lib/content";

const HUES = ["var(--a2-rgb)", "var(--a1-rgb)", "var(--a3-rgb)", "16 185 129", "244 114 182", "250 204 21"];

export default function Arsenal() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const focus = hovered ?? selected;
  const total = ARSENAL.reduce((n, c) => n + c.items.length, 0);

  return (
    <section id="arsenal" className="relative z-[4] mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-36">
      <SectionHeading
        index="02"
        kicker="Technical Arsenal"
        title={
          <>
            {total} tools. <Serif>One</Serif> coherent stack.
          </>
        }
        intro="From GCP cost controls to relay boards. Pick a discipline to light up its tools."
      />

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div data-reveal className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" role="tablist" aria-label="Skill categories">
          <button
            role="tab"
            aria-selected={selected === null}
            onClick={() => setSelected(null)}
            className={`shrink-0 rounded-2xl px-5 py-4 text-left transition ${
              selected === null ? "bg-white/[0.07] ring-1 ring-white/15" : "hover:bg-white/[0.03]"
            }`}
          >
            <span className="flex items-center justify-between gap-6">
              <span className="text-[15px] font-medium">Everything</span>
              <span className="font-mono text-[11px] text-dim">{total}</span>
            </span>
          </button>
          {ARSENAL.map((c, i) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={selected === c.id}
              onClick={() => setSelected((s) => (s === c.id ? null : c.id))}
              onPointerEnter={() => setHovered(c.id)}
              onPointerLeave={() => setHovered(null)}
              className={`group shrink-0 rounded-2xl px-5 py-4 text-left transition ${
                selected === c.id ? "bg-white/[0.07] ring-1 ring-white/15" : "hover:bg-white/[0.03]"
              }`}
            >
              <span className="flex items-center justify-between gap-6">
                <span className="flex items-center gap-3 text-[15px] font-medium">
                  <span className="size-2 rounded-full" style={{ background: `rgb(${HUES[i]})`, boxShadow: `0 0 12px rgb(${HUES[i]})` }} />
                  {c.label}
                </span>
                <span className="font-mono text-[11px] text-dim">{String(c.items.length).padStart(2, "0")}</span>
              </span>
            </button>
          ))}
        </div>

        <div data-reveal data-glow className="glass p-6 md:p-10">
          <div className="flex flex-wrap gap-2.5">
            {ARSENAL.flatMap((c, ci) =>
              c.items.map((item) => {
                const on = !focus || focus === c.id;
                return (
                  <motion.span
                    key={`${c.id}-${item}`}
                    animate={{ opacity: on ? 1 : 0.18, scale: on ? 1 : 0.96 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-full px-4 py-2 text-[13px] text-ink/90"
                    style={{
                      background: `rgb(${HUES[ci]} / ${focus === c.id ? 0.16 : 0.06})`,
                      boxShadow: `inset 0 0 0 1px rgb(${HUES[ci]} / ${focus === c.id ? 0.55 : 0.18})${
                        focus === c.id ? `, 0 0 24px -6px rgb(${HUES[ci]} / 0.7)` : ""
                      }`,
                    }}
                  >
                    {item}
                  </motion.span>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
