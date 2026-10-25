"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, Check, Globe2, GraduationCap, Users } from "lucide-react";
import SectionHeading, { Serif } from "@/components/ui/SectionHeading";
import { BENTO, SITE } from "@/lib/content";

const ZONES = [
  { city: "Chattogram", tz: "Asia/Dhaka", home: true },
  { city: "London", tz: "Europe/London" },
  { city: "New York", tz: "America/New_York" },
];

const [WORK_START, WORK_END] = SITE.workHours;

function hourIn(tz: string, d: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(d);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h + m / 60;
}

function Overlap() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const home = now ? hourIn(SITE.timezone, now) : 12;

  return (
    <div className="mt-8 space-y-3">
      {ZONES.map((z) => {
        const local = now ? hourIn(z.tz, now) : 12;
        // Offset of this zone relative to Chattogram, in hours.
        const offset = ((local - home + 36) % 24) - 12;
        const start = (WORK_START + offset + 24) % 24;
        const label = now
          ? new Intl.DateTimeFormat("en-GB", { timeZone: z.tz, hour: "2-digit", minute: "2-digit" }).format(now)
          : "--:--";
        return (
          <div key={z.city} className="grid grid-cols-[92px_1fr_48px] items-center gap-3 font-mono text-[11px]">
            <span className={z.home ? "text-ink" : "text-muted"}>{z.city}</span>
            <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.06]">
              {/* Chattogram working hours mapped onto this zone's 24h day */}
              {[0, -24].map((shift) => (
                <span
                  key={shift}
                  className={`absolute inset-y-0 rounded-full ${z.home ? "bg-a2" : "bg-a1/70"}`}
                  style={{ left: `${((start + shift) / 24) * 100}%`, width: `${((WORK_END - WORK_START) / 24) * 100}%` }}
                />
              ))}
              <span className="absolute inset-y-[-3px] w-px bg-white" style={{ left: `${(local / 24) * 100}%` }} />
            </div>
            <span className="text-right tabular-nums text-muted">{label}</span>
          </div>
        );
      })}
      <p className="pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
        Bars show my working hours in your time zone. White line is now.
      </p>
    </div>
  );
}

const ICONS = { lead: Users, ai: BrainCircuit, edu: GraduationCap, geo: Globe2 } as const;

function Card({
    item,
    className,
    children,
    speed,
  }: {
    item: (typeof BENTO)[number];
    className?: string;
    children?: React.ReactNode;
    speed?: number;
}) {
    const Icon = ICONS[item.id as keyof typeof ICONS];
    return (
      <article data-glow data-reveal data-speed={speed} className={`glass flex flex-col p-7 md:p-9 ${className ?? ""}`}>
        <div className="flex items-center justify-between">
          <p className="kicker">{item.kicker}</p>
          <span className="grid size-9 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/10">
            <Icon className="size-4 text-a2" />
          </span>
        </div>
        <h3 className="mt-6 text-[24px] font-semibold leading-tight tracking-[-0.03em] md:text-[28px]">{item.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.body}</p>
        {children}
      </article>
    );
  }

export default function About() {
  const [lead, ai, edu, geo] = BENTO;
  return (
    <section id="about" className="relative z-[4] mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-36">
      <SectionHeading
        index="01"
        kicker="About & Leadership"
        title={
          <>
            Engineer by training. <Serif>Architect</Serif> by habit.
          </>
        }
        intro="I lead teams, run the servers, write the plugins and wire the AI. One person who can carry a product from database schema to launch-day traffic."
      />

      <div className="grid gap-5 md:grid-cols-12">
        <Card item={lead} className="md:col-span-7 md:row-span-2" speed={0.04}>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Team leadership & code review", "Staging & production servers", "Incident & server remediation", "End-to-end platform delivery"].map(
              (t) => (
                <li key={t} className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-[14px] ring-1 ring-white/[0.06]">
                  <Check className="size-4 shrink-0 text-emerald" />
                  {t}
                </li>
              ),
            )}
          </ul>
          <div className="mt-auto pt-10">
            <p className="font-serif text-[clamp(28px,3.4vw,44px)] italic leading-tight text-ink/90">
              &ldquo;Fast, cost-optimized products that move the numbers that matter.&rdquo;
            </p>
          </div>
        </Card>

        <Card item={ai} className="md:col-span-5" speed={-0.03}>
          <div className="mt-6 flex flex-wrap gap-2">
            {["MCP servers", "RAG", "Vector DBs", "LLM routing", "GCP", "Cost caps"].map((t) => (
              <span key={t} className="rounded-full bg-a1/10 px-3 py-1 font-mono text-[11px] text-ink/85 ring-1 ring-a1/30">
                {t}
              </span>
            ))}
          </div>
        </Card>

        <Card item={edu} className="md:col-span-5" speed={0.02}>
          <div className="mt-6 flex flex-wrap gap-2">
            {["C", "C++", "Java", "Kotlin", "8086 ASM", "SQL"].map((t) => (
              <span key={t} className="rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-muted ring-1 ring-white/10">
                {t}
              </span>
            ))}
          </div>
        </Card>

        <Card item={geo} className="md:col-span-12" speed={-0.02}>
          <Overlap />
        </Card>
      </div>
    </section>
  );
}
