"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";

// Illustrations for case studies that are code, infrastructure or still waiting
// on screenshots. Screenshot-based projects render a gallery instead.

const panel = "h-full w-full overflow-hidden rounded-2xl border border-line bg-[#0e0e10]";

/* ---------- MCP terminal ---------- */

type Line = { kind: "user" | "tool" | "ok" | "ai"; text: string };

const SESSION: Line[] = [
  { kind: "user", text: "Which accounts ran over their target budget last week?" },
  { kind: "tool", text: "worksheet_accounts()" },
  { kind: "tool", text: "worksheet_account_report(2026-10-12 → 2026-10-18)" },
  { kind: "ai", text: "Two accounts ran above target. The biggest gap is on Search: Emergency Repairs." },
  { kind: "user", text: "Cap that campaign at $120 a day." },
  { kind: "tool", text: "google_ads_set_campaign_budget  validateOnly" },
  { kind: "ok", text: "preview ready · confirm_token signed · expires in 10:00" },
  { kind: "user", text: "Confirm." },
  { kind: "ok", text: "applied · logged to audit tab" },
];

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(SESSION.length);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Server render shows the whole session; animate it once it is on screen.
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!live) return;
    setCount(0);
    const id = setInterval(() => setCount((c) => (c >= SESSION.length + 4 ? 0 : c + 1)), 900);
    return () => clearInterval(id);
  }, [live]);
  return (
    <div ref={ref} className={`${panel} flex flex-col`}>
      <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="ml-3 font-mono text-[11px] text-dim">claude · mcp: google-ads, callrail</span>
      </div>
      <div className="flex-1 space-y-3 p-5 font-mono text-[12.5px] leading-relaxed md:p-7 md:text-[13.5px]">
        {SESSION.slice(0, Math.min(count, SESSION.length)).map((l, i) => (
          <p key={i} className={l.kind === "tool" ? "pl-5 text-dim" : l.kind === "ok" ? "pl-5 text-[#4ade80]" : l.kind === "ai" ? "text-muted" : "text-ink"}>
            {l.kind === "user" && <span className="text-accent">you › </span>}
            {l.kind === "ai" && <span className="text-accent">claude › </span>}
            {l.kind === "tool" && "→ "}
            {l.kind === "ok" && "✓ "}
            {l.text}
          </p>
        ))}
        <span className="inline-block h-4 w-2 animate-pulse bg-accent align-middle" />
      </div>
    </div>
  );
}

/* ---------- n8n → Gemini → WordPress ---------- */

function Pipeline() {
  const steps = [
    { label: "n8n", sub: "schedules the run" },
    { label: "Gemini", sub: "generates content" },
    { label: "WP plugin", sub: "REST API publish" },
  ];
  return (
    <div className={`${panel} flex items-center p-6 md:p-10`}>
      <ol className="flex w-full flex-col items-stretch gap-3 md:flex-row md:items-center">
        {steps.map((s, i) => (
          <li key={s.label} className="flex flex-1 items-center gap-3 md:flex-col md:items-stretch">
            <div className={`flex-1 rounded-2xl border p-5 ${i === 1 ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface"}`}>
              <p className="font-display text-[22px] font-semibold">{s.label}</p>
              <p className={`mt-1 font-mono text-[11px] ${i === 1 ? "opacity-70" : "text-dim"}`}>{s.sub}</p>
            </div>
            {i < steps.length - 1 && <span className="font-mono text-accent md:self-center">→</span>}
          </li>
        ))}
        <li className="flex flex-col gap-2">
          {["site A", "site B", "site C"].map((x) => (
            <span key={x} className="rounded-xl border border-line px-4 py-2 font-mono text-[12px] text-muted">
              {x}
            </span>
          ))}
        </li>
      </ol>
    </div>
  );
}

/* ---------- Weighted review rubric ---------- */

function Rubric() {
  const rows = [
    { c: "Scientific merit", w: 35, s: 4.5 },
    { c: "Methodology", w: 25, s: 4.0 },
    { c: "Clinical relevance", w: 25, s: 4.8 },
    { c: "Clarity", w: 15, s: 3.5 },
  ];
  const total = rows.reduce((n, r) => n + (r.w / 100) * r.s, 0);
  return (
    <div className={`${panel} flex flex-col justify-center p-6 md:p-10`}>
      <p className="label">Reviewer scorecard · illustration</p>
      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <div key={r.c} className="grid grid-cols-[1fr_44px_40px] items-center gap-4 text-[14px]">
            <div>
              <p className="mb-2">{r.c}</p>
              <div className="h-2 rounded-full bg-white/[0.07]">
                <div className="h-full rounded-full bg-accent" style={{ width: `${(r.s / 5) * 100}%` }} />
              </div>
            </div>
            <span className="text-right font-mono text-dim">{r.w}%</span>
            <span className="text-right font-mono">{r.s.toFixed(1)}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-baseline justify-between border-t border-line pt-5">
        <span className="font-mono text-[12px] text-muted">weighted score</span>
        <span className="display text-[40px]">
          {total.toFixed(2)}
          <span className="text-[16px] text-dim"> / 5</span>
        </span>
      </div>
    </div>
  );
}

/* ---------- Plugin code ---------- */

const PHP: [string, string][] = [
  ["c", "/* Plugin Name: SEO Duplicate Fixer */"],
  ["", ""],
  ["k", "add_action( 'template_redirect',"],
  ["", "    array( $self, 'frontend_start' ), 0 );"],
  ["k", "add_filter( 'wpseo_title',"],
  ["", "    array( $self, 'filter_title' ), 99 );"],
  ["k", "add_filter( 'wpseo_opengraph_title',"],
  ["", "    array( $self, 'filter_title' ), 99 );"],
  ["k", "add_action( 'wp_ajax_sdf_batch',"],
  ["", "    array( $self, 'ajax_batch' ) );"],
  ["", ""],
  ["c", "// keep only the first <meta name=\"description\">"],
  ["k", "ob_start( array( $this, 'filter_html' ) );"],
];

function Code() {
  return (
    <div className={`${panel} flex flex-col`}>
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5 font-mono text-[11px] text-dim">
        <span className="text-ink/80">seo-duplicate-fixer.php</span>
        <span>PHP 7.2+</span>
      </div>
      <pre className="flex-1 overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.85] md:p-7 md:text-[13.5px]">
        {PHP.map(([k, t], i) => (
          <div key={i} className="flex gap-5">
            <span className="w-5 shrink-0 select-none text-right text-white/20">{i + 1}</span>
            <span className={k === "c" ? "text-dim" : k === "k" ? "text-accent" : "text-ink/80"}>{t}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ---------- Phone + IoT ---------- */

function Device() {
  return (
    <div className={`${panel} flex items-center justify-center gap-6 p-6 md:p-10`}>
      <div className="relative h-[300px] overflow-hidden rounded-[30px] border border-white/15 bg-black p-2" style={{ aspectRatio: "9 / 18.5" }}>
        <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-surface-2">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(115deg, transparent 46%, rgba(255,255,255,0.14) 47%, rgba(255,255,255,0.14) 49%, transparent 50%), linear-gradient(25deg, transparent 60%, rgba(255,255,255,0.09) 61%, rgba(255,255,255,0.09) 63%, transparent 64%)",
            }}
          />
          {[
            [30, 35],
            [62, 52],
            [44, 70],
          ].map(([x, y], i) => (
            <span key={i} className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-4 ring-[rgb(var(--accent-rgb)/0.25)]" style={{ left: `${x}%`, top: `${y}%` }} />
          ))}
          <div className="absolute inset-x-2 bottom-2 rounded-xl bg-black/70 p-2.5">
            <p className="text-[9px] font-medium">Community alert</p>
            <p className="text-[8px] text-muted">Map view · illustration</p>
          </div>
        </div>
      </div>
      <div className="hidden w-[44%] rounded-2xl border border-line bg-surface p-5 sm:block">
        <p className="label">ESP8266 · telemetry</p>
        <svg viewBox="0 0 100 40" className="mt-4 h-20 w-full" aria-hidden>
          <polyline fill="none" stroke="var(--accent)" strokeWidth="1.4" points="0,30 10,28 20,31 30,22 40,24 50,15 60,18 70,12 80,16 90,9 100,11" />
        </svg>
        <div className="mt-3 flex justify-between font-mono text-[11px]">
          <span className="text-muted">relay</span>
          <span className="text-accent">auto</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectVisual({ visual }: { visual: Project["visual"] }) {
  switch (visual) {
    case "terminal":
      return <Terminal />;
    case "pipeline":
      return <Pipeline />;
    case "rubric":
      return <Rubric />;
    case "code":
      return <Code />;
    case "device":
      return <Device />;
    default:
      return null;
  }
}
