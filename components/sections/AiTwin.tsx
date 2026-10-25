"use client";

import { useState } from "react";
import { Loader2, Palette, Sparkles, Wand2 } from "lucide-react";
import SectionHeading, { Serif } from "@/components/ui/SectionHeading";
import { openPalette } from "@/components/ai/palette-bus";
import { generateTheme, SUGGESTIONS } from "@/components/ai/CommandPalette";
import { DEFAULT_PALETTE, setPalette } from "@/lib/theme";

const MOODS = ["Northern lights over Svalbard", "Chattogram sunset on the Karnaphuli", "Synthwave arcade", "Deep ocean bioluminescence"];

export default function AiTwin() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<{ busy: boolean; msg: string }>({ busy: false, msg: "" });

  const theme = async (p: string) => {
    if (!p.trim() || status.busy) return;
    setStatus({ busy: true, msg: "Mixing colours with Gemini..." });
    try {
      const res = await generateTheme(p.trim());
      setStatus({ busy: false, msg: `Applied "${res.name}". The lances, cursor glow and borders all follow it.` });
    } catch (e) {
      const code = (e as Error).message;
      setStatus({
        busy: false,
        msg:
          code === "not_configured"
            ? "Theme generation is offline until a Gemini key is configured."
            : code === "rate_limited"
              ? "Too many themes in a row. Try again in a few minutes."
              : "Gemini could not mix that one. Try another mood.",
      });
    }
  };

  return (
    <section id="ai" className="relative z-[4] mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-36">
      <SectionHeading
        index="04"
        kicker="Gemini-Powered"
        title={
          <>
            Talk to my <Serif>AI twin.</Serif>
          </>
        }
        intro="A Gemini model grounded in this portfolio answers questions about my skills, availability and architecture decisions. It runs on a server route with rate limits and token caps, the same cost discipline I bring to client AI work."
      />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div data-reveal data-glow className="glass p-6 md:p-10">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-a1 to-a2 font-mono text-[11px] font-semibold">SC</span>
            <div>
              <p className="text-[15px] font-medium">Saikat&apos;s AI twin</p>
              <p className="flex items-center gap-1.5 font-mono text-[11px] text-emerald">
                <span className="size-1.5 rounded-full bg-emerald" /> online · grounded on portfolio data
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => openPalette(s, true)}
                className="rounded-2xl bg-white/[0.03] p-4 text-left text-[14px] leading-snug text-ink/85 ring-1 ring-white/[0.08] transition hover:bg-white/[0.06] hover:ring-white/20"
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={() => openPalette()}
            className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-black/30 px-5 py-4 text-left text-[14px] text-dim ring-1 ring-white/10 transition hover:ring-a2/50"
          >
            <Sparkles className="size-4 text-a2" />
            Ask anything...
            <kbd className="ml-auto rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted">⌘ K</kbd>
          </button>
        </div>

        <div data-reveal data-glow className="glass flex flex-col p-6 md:p-10">
          <div className="flex items-center justify-between">
            <p className="kicker">Dynamic visual prompting</p>
            <Palette className="size-4 text-a3" />
          </div>
          <h3 className="mt-5 text-[26px] font-semibold leading-tight tracking-[-0.03em]">Re-theme this site with a sentence.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Describe a mood. Gemini returns a palette as structured JSON and every accent on the page follows it, including the 3D lances.
          </p>
          <form
            className="mt-6 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              theme(prompt);
            }}
          >
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. neon rain in Tokyo"
              maxLength={160}
              aria-label="Theme mood"
              className="min-w-0 flex-1 rounded-full bg-black/30 px-5 py-3 text-[14px] outline-none ring-1 ring-white/10 placeholder:text-dim focus:ring-a2/60"
            />
            <button disabled={status.busy} className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-obsidian transition hover:bg-white disabled:opacity-60" aria-label="Generate theme">
              {status.busy ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setPrompt(m);
                  theme(m);
                }}
                className="rounded-full bg-white/[0.03] px-3 py-1.5 text-[12px] text-muted ring-1 ring-white/10 hover:text-ink"
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between gap-4 pt-8">
            <p className="min-h-[20px] font-mono text-[11px] text-a2" aria-live="polite">
              {status.msg}
            </p>
            <button onClick={() => setPalette(DEFAULT_PALETTE)} className="shrink-0 font-mono text-[11px] text-dim underline-offset-4 hover:text-ink hover:underline">
              reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
