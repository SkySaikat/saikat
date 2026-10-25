"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, ImagePlus, Plus, X } from "lucide-react";
import SectionHeading, { Serif } from "@/components/ui/SectionHeading";
import ProjectVisual from "./ProjectVisuals";
import { ARCHIVE, PROJECTS, type Project, type Shot } from "@/lib/content";

const DEV = process.env.NODE_ENV === "development";

/* ---------- Tilt ---------- */

function useTilt<T extends HTMLElement>(max = 5) {
  const ref = useRef<T>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1400px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1400px) rotateX(0deg) rotateY(0deg)";
  };
  return { ref, onPointerMove: onMove, onPointerLeave: onLeave };
}

/* ---------- Card ---------- */

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const tilt = useTilt<HTMLDivElement>(project.span === "wide" ? 2.5 : 4);
  const wide = project.span === "wide";
  return (
    <div data-reveal className={wide ? "md:col-span-2" : ""}>
      <div
        ref={tilt.ref}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        className="h-full transition-transform duration-500 ease-out will-change-transform"
      >
        <article
          data-glow
          className={`glass group grid h-full overflow-hidden ${wide ? "lg:grid-cols-[1.25fr_1fr]" : "grid-rows-[auto_1fr]"}`}
        >
          <button
            onClick={onOpen}
            data-cursor="Open"
            aria-label={`Open case study: ${project.title}`}
            className={`relative m-2 overflow-hidden rounded-[18px] bg-[radial-gradient(120%_120%_at_0%_0%,rgb(var(--a1-rgb)/0.18),transparent_55%),radial-gradient(120%_120%_at_100%_100%,rgb(var(--a2-rgb)/0.12),transparent_55%)] ring-1 ring-white/[0.06] ${
              wide ? "aspect-[16/11] lg:aspect-auto lg:min-h-[440px]" : "aspect-[16/11]"
            }`}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="absolute inset-4 md:inset-6">
              <ProjectVisual project={project} />
            </div>
            {DEV && project.needsAssets && (
              <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-dashed border-amber-300/60 bg-black/70 px-3 py-1 font-mono text-[10px] text-amber-200">
                <ImagePlus className="size-3" /> dev: add screenshots / links in lib/content.ts
              </span>
            )}
          </button>

          <div className="flex flex-col p-6 pt-4 md:p-8 md:pt-6 lg:pt-8">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] text-a2">{project.index}</span>
              <span className="kicker truncate !text-[10px]">{project.category}</span>
            </div>
            <h3 className={`mt-4 font-semibold leading-[1.05] tracking-[-0.035em] ${wide ? "text-[30px] md:text-[40px]" : "text-[26px] md:text-[30px]"}`}>
              {project.title}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{project.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {project.tech.slice(0, wide ? 9 : 6).map((t) => (
                <li key={t} className="rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[10.5px] text-ink/75 ring-1 ring-white/[0.08]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
              <button
                onClick={onOpen}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] py-2.5 pl-4 pr-3 text-[13px] ring-1 ring-white/10 transition hover:bg-white hover:text-obsidian"
              >
                Case study <Plus className="size-3.5" />
              </button>
              {project.links.slice(0, 1).map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink">
                  {l.label} <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

/* ---------- Case study drawer + lightbox ---------- */

function Lightbox({ shots, index, onClose, onIndex }: { shots: Shot[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const shot = shots[index];
  return (
    <motion.div
      className="fixed inset-0 z-[9500] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl md:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        key={shot.src}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[16/10] w-full max-w-[1400px] overflow-hidden rounded-xl ring-1 ring-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={shot.src} alt={shot.alt} fill sizes="100vw" className="object-contain object-top bg-void" />
      </motion.div>
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-muted">
        {shot.alt} · {index + 1}/{shots.length}
      </p>
      {shots.length > 1 && (
        <>
          <button
            aria-label="Previous screenshot"
            className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 ring-1 ring-white/15"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index - 1 + shots.length) % shots.length);
            }}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            aria-label="Next screenshot"
            className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 ring-1 ring-white/15"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index + 1) % shots.length);
            }}
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
    </motion.div>
  );
}

function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const [shot, setShot] = useState<number | null>(null);
  useEffect(() => {
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (shot !== null) setShot(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
  }, [onClose, shot]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[9000] bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        data-lenis-prevent
        className="fixed inset-y-0 right-0 z-[9001] w-full max-w-[880px] overflow-y-auto overscroll-contain border-l border-white/10 bg-[#07080d]/95 backdrop-blur-2xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#07080d]/80 px-6 py-4 backdrop-blur-xl md:px-10">
          <span className="font-mono text-[11px] text-a2">
            {project.index} / {String(PROJECTS.length).padStart(2, "0")}
          </span>
          <button onClick={onClose} aria-label="Close case study" className="grid size-10 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 pb-20 pt-10 md:px-10">
          <p className="kicker">{project.category}</p>
          <h3 className="mt-4 text-[clamp(34px,5vw,56px)] font-semibold leading-[1] tracking-[-0.045em]">{project.title}</h3>
          <p className="mt-6 max-w-[680px] text-[17px] leading-relaxed text-muted">{project.summary}</p>

          {project.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-obsidian hover:bg-white"
                >
                  {l.label} <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          )}

          <div className="mt-10 overflow-hidden rounded-2xl ring-1 ring-white/10">
            {project.shots.length > 0 ? (
              <div className="grid gap-2 bg-white/[0.02] p-2 sm:grid-cols-2">
                {project.shots.map((s, i) => (
                  <button
                    key={s.src}
                    onClick={() => setShot(i)}
                    data-cursor="Zoom"
                    className={`group relative aspect-[16/10] overflow-hidden rounded-xl ${i === 0 ? "sm:col-span-2" : ""}`}
                  >
                    <Image src={s.src} alt={s.alt} fill sizes="(max-width: 880px) 100vw, 880px" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="relative aspect-[16/10] bg-[radial-gradient(120%_120%_at_0%_0%,rgb(var(--a1-rgb)/0.18),transparent_55%)] p-6">
                <ProjectVisual project={project} />
              </div>
            )}
          </div>

          <div className="mt-14 space-y-12">
            {project.architecture.map((block) => (
              <section key={block.heading}>
                <h4 className="flex items-center gap-3 text-[20px] font-semibold tracking-tight">
                  <span className="size-1.5 rounded-full bg-a2 shadow-[0_0_12px_rgb(var(--a2-rgb))]" />
                  {block.heading}
                </h4>
                <ol className="mt-5 space-y-3">
                  {block.points.map((p, i) => (
                    <li key={i} className="grid grid-cols-[32px_1fr] gap-2 text-[15px] leading-relaxed text-ink/80">
                      <span className="font-mono text-[11px] leading-[1.9] text-dim">{String(i + 1).padStart(2, "0")}</span>
                      {p}
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          <div className="mt-14">
            <p className="kicker mb-4">Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="rounded-full bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] text-ink/80 ring-1 ring-white/10">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>
      <AnimatePresence>
        {shot !== null && <Lightbox shots={project.shots} index={shot} onIndex={setShot} onClose={() => setShot(null)} />}
      </AnimatePresence>
    </>
  );
}

/* ---------- Section ---------- */

export default function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const close = useCallback(() => setOpen(null), []);
  useEffect(() => setMounted(true), []);

  return (
    <section id="work" className="relative z-[4] mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-36">
      <SectionHeading
        index="03"
        kicker="Featured Work & Case Studies"
        title={
          <>
            Systems that <Serif>ship</Serif>, and keep shipping.
          </>
        }
        intro="MCP servers, custom plugins, programmatic SEO engines and full-stack products. Open any card for the architecture behind it."
        aside={<p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">{PROJECTS.length} case studies</p>}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={() => setOpen(p)} />
        ))}
      </div>

      <div className="mt-32">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h3 data-reveal className="text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.04em]">
            More client websites
          </h3>
          <p data-reveal className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-dim md:block">
            Design · Development · SEO
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ARCHIVE.map((a) => (
            <a
              key={a.name}
              href={a.href}
              target="_blank"
              rel="noreferrer"
              data-reveal
              data-glow
              data-cursor="Visit"
              className="glass group block overflow-hidden p-2"
              style={{ ["--radius" as string]: "20px" }}
            >
              <div className="relative aspect-[10/7] overflow-hidden rounded-[14px] bg-void">
                {a.img ? (
                  <Image src={a.img} alt={`${a.name} website`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(100%_100%_at_0%_0%,rgb(var(--a3-rgb)/0.25),transparent_60%),radial-gradient(100%_100%_at_100%_100%,rgb(var(--a2-rgb)/0.2),transparent_60%)]">
                    <span className="font-serif text-[40px] italic text-ink/90">{a.name}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-3 pb-2 pt-4">
                <div>
                  <p className="text-[16px] font-medium tracking-tight">{a.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-dim">{a.type}</p>
                </div>
                <span className="grid size-9 place-items-center rounded-full bg-white/[0.05] ring-1 ring-white/10 transition duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-obsidian">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Portalled so the drawer escapes this section's stacking context. */}
      {mounted &&
        createPortal(
          <AnimatePresence>{open && <CaseStudy key={open.id} project={open} onClose={close} />}</AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
