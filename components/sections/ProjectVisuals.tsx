"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";

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

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

function Terminal() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setCount((c) => (c >= SESSION.length + 4 ? 0 : c + 1)), 900);
    return () => clearInterval(id);
  }, [inView]);
  const shown = SESSION.slice(0, Math.min(count, SESSION.length));
  return (
    <div ref={ref} className="flex h-full flex-col overflow-hidden rounded-xl bg-[#07080d]/90 ring-1 ring-white/10">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-dim">claude · mcp: google-ads, callrail</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-emerald">
          <span className="size-1.5 rounded-full bg-emerald" /> connected
        </span>
      </div>
      <div className="flex-1 space-y-2.5 p-4 font-mono text-[12px] leading-relaxed md:p-5 md:text-[12.5px]">
        {shown.map((l, i) => (
          <div key={i} className="animate-[fadeUp_.4s_ease-out]">
            {l.kind === "user" && (
              <p>
                <span className="text-a2">you ›</span> <span className="text-ink">{l.text}</span>
              </p>
            )}
            {l.kind === "tool" && (
              <p className="pl-4 text-muted">
                <span className="text-a3">⟶</span> {l.text}
              </p>
            )}
            {l.kind === "ok" && (
              <p className="pl-4 text-emerald">
                ✓ <span className="text-emerald/90">{l.text}</span>
              </p>
            )}
            {l.kind === "ai" && (
              <p className="text-ink/80">
                <span className="text-a1">claude ›</span> {l.text}
              </p>
            )}
          </div>
        ))}
        <span className="inline-block h-4 w-2 animate-pulse bg-a2/80 align-middle" />
      </div>
    </div>
  );
}

/* ---------- Stacked screenshots ---------- */

function Shots({ shots }: { shots: Project["shots"] }) {
  const list = shots.slice(0, 3);
  return (
    <div className="group/shots relative h-full w-full">
      {list.map((s, i) => {
        const spread = i - (list.length - 1) / 2;
        return (
          <div
            key={s.src}
            className="absolute w-[72%] overflow-hidden rounded-lg bg-void shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-transform duration-700 ease-out-expo group-hover/shots:[transform:var(--fan)]"
            style={{
              left: `${6 + i * 10}%`,
              top: `${list.length === 1 ? 12 : 6 + i * 11}%`,
              aspectRatio: "16 / 10",
              zIndex: i,
              ["--fan" as string]: `translate(${spread * 18}px, ${-Math.abs(spread) * 6}px) rotate(${spread * 1.5}deg)`,
            }}
          >
            <div className="flex h-5 items-center gap-1 border-b border-white/[0.06] bg-[#0b0c12] px-2">
              <span className="size-1.5 rounded-full bg-white/20" />
              <span className="size-1.5 rounded-full bg-white/20" />
              <span className="size-1.5 rounded-full bg-white/20" />
            </div>
            <div className="relative h-[calc(100%-20px)] w-full">
              <Image src={s.src} alt={s.alt} fill sizes="(max-width: 768px) 90vw, 600px" className="object-cover object-top transition-transform duration-[1.6s] ease-out-expo group-hover/shots:scale-[1.04]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- n8n → Gemini → WordPress pipeline ---------- */

function Pipeline() {
  const nodes = [
    { x: 12, y: 50, label: "n8n", sub: "schedule" },
    { x: 37, y: 50, label: "Gemini", sub: "AI Studio" },
    { x: 62, y: 50, label: "WP plugin", sub: "REST API" },
  ];
  const sites = [22, 50, 78];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="pipe" x1="0" x2="1">
          <stop offset="0" stopColor="rgb(var(--a1-rgb))" />
          <stop offset="1" stopColor="rgb(var(--a2-rgb))" />
        </linearGradient>
      </defs>
      {nodes.slice(0, -1).map((n, i) => (
        <line key={i} x1={n.x + 8} y1={50} x2={nodes[i + 1].x - 8} y2={50} stroke="url(#pipe)" strokeWidth="0.5" strokeDasharray="1.5 1.5" className="animate-[dash_1.2s_linear_infinite]" />
      ))}
      {sites.map((y) => (
        <path key={y} d={`M70 50 C 78 50, 78 ${y}, 84 ${y}`} fill="none" stroke="url(#pipe)" strokeWidth="0.5" strokeDasharray="1.5 1.5" className="animate-[dash_1.2s_linear_infinite]" />
      ))}
      {nodes.map((n) => (
        <g key={n.label}>
          <rect x={n.x - 8} y={41} width={16} height={18} rx={2.5} fill="rgba(18,20,32,0.9)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
          <text x={n.x} y={49.5} textAnchor="middle" fontSize="3.4" fill="#f8fafc" fontFamily="var(--font-geist)">
            {n.label}
          </text>
          <text x={n.x} y={54.5} textAnchor="middle" fontSize="2.4" fill="#94a3b8" fontFamily="var(--font-jetbrains)">
            {n.sub}
          </text>
        </g>
      ))}
      {sites.map((y, i) => (
        <g key={y}>
          <rect x={84} y={y - 5} width={12} height={10} rx={2} fill="rgba(18,20,32,0.9)" stroke="rgb(var(--a2-rgb) / 0.5)" strokeWidth="0.3" />
          <text x={90} y={y + 1} textAnchor="middle" fontSize="2.6" fill="#f8fafc" fontFamily="var(--font-jetbrains)">
            site {String.fromCharCode(65 + i)}
          </text>
        </g>
      ))}
    </svg>
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
    <div className="flex h-full flex-col justify-center rounded-xl bg-[#07080d]/90 p-5 ring-1 ring-white/10 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Reviewer scorecard · stage 2</p>
        <span className="rounded-full bg-a2/15 px-2.5 py-1 font-mono text-[10px] text-a2 ring-1 ring-a2/40">blind</span>
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.c} className="grid grid-cols-[1fr_40px_36px] items-center gap-3 text-[12px]">
            <div>
              <div className="mb-1.5 flex justify-between text-ink/85">
                <span>{r.c}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full bg-gradient-to-r from-a1 to-a2" style={{ width: `${(r.s / 5) * 100}%` }} />
              </div>
            </div>
            <span className="text-right font-mono text-dim">{r.w}%</span>
            <span className="text-right font-mono text-ink">{r.s.toFixed(1)}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <span className="font-mono text-[11px] text-muted">weighted score</span>
        <span className="text-[22px] font-semibold tracking-tight">
          {total.toFixed(2)}
          <span className="text-[13px] text-dim"> / 5</span>
        </span>
      </div>
    </div>
  );
}

/* ---------- Plugin code ---------- */

const PHP = [
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
  ["c", "// keep the first <meta name=\"description\">"],
  ["k", "ob_start( array( $this, 'filter_html' ) );"],
];

function Code() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[#07080d]/90 ring-1 ring-white/10">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3 font-mono text-[11px] text-dim">
        <span className="rounded bg-white/[0.06] px-2 py-0.5 text-ink/80">seo-duplicate-fixer.php</span>
        <span className="ml-auto">PHP 7.2+</span>
      </div>
      <pre className="flex-1 overflow-hidden p-4 font-mono text-[11.5px] leading-[1.8] md:p-5 md:text-[12px]">
        {PHP.map(([k, t], i) => (
          <div key={i} className="flex gap-4">
            <span className="w-5 shrink-0 select-none text-right text-white/20">{i + 1}</span>
            <span className={k === "c" ? "text-white/35" : k === "k" ? "text-a2" : "text-ink/80"}>{t}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ---------- Phone + IoT ---------- */

function Device() {
  return (
    <div className="flex h-full items-center justify-center gap-5">
      <div className="relative h-[92%] max-h-[300px] w-auto overflow-hidden rounded-[26px] bg-[#0b0c12] p-2 ring-1 ring-white/15" style={{ aspectRatio: "9 / 18.5" }}>
        <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-[#0f1220]">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(115deg, transparent 46%, rgba(255,255,255,0.12) 47%, rgba(255,255,255,0.12) 49%, transparent 50%), linear-gradient(25deg, transparent 60%, rgba(255,255,255,0.08) 61%, rgba(255,255,255,0.08) 63%, transparent 64%), radial-gradient(circle at 30% 70%, rgba(16,185,129,0.25), transparent 40%)",
            }}
          />
          {[
            [30, 35],
            [62, 52],
            [44, 70],
          ].map(([x, y], i) => (
            <span key={i} className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-a2 ring-4 ring-a2/25" style={{ left: `${x}%`, top: `${y}%` }} />
          ))}
          <div className="absolute inset-x-2 bottom-2 rounded-xl bg-black/60 p-2.5 backdrop-blur">
            <p className="text-[9px] font-medium text-ink">Waterlogging alert</p>
            <p className="text-[8px] text-muted">Agrabad · 1.2 km away</p>
          </div>
        </div>
      </div>
      <div className="hidden w-[42%] rounded-xl bg-[#07080d]/90 p-4 ring-1 ring-white/10 sm:block">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">esp8266 · telemetry</p>
        <svg viewBox="0 0 100 40" className="mt-3 h-16 w-full" aria-hidden>
          <polyline
            fill="none"
            stroke="rgb(var(--a2-rgb))"
            strokeWidth="1.2"
            points="0,30 10,28 20,31 30,22 40,24 50,15 60,18 70,12 80,16 90,9 100,11"
          />
        </svg>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
          <span className="text-muted">relay</span>
          <span className="text-emerald">auto</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectVisual({ project }: { project: Project }) {
  switch (project.visual) {
    case "terminal":
      return <Terminal />;
    case "shots":
      return <Shots shots={project.shots} />;
    case "pipeline":
      return <Pipeline />;
    case "rubric":
      return <Rubric />;
    case "code":
      return <Code />;
    case "device":
      return <Device />;
  }
}
