"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Heading from "@/components/ui/Heading";
import { ARCHIVE, PROJECTS, SITE } from "@/lib/content";

// A preview card that eases after the pointer while a project row is hovered.
function HoverPreview({ active }: { active: number | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.14;
      p.y += (p.ty - p.y) * 0.14;
      if (ref.current) ref.current.style.transform = `translate3d(${p.x + 28}px, ${p.y - 140}px, 0)`;
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 hidden [@media(hover:hover)_and_(min-width:1024px)]:block">
      <div
        className={`relative h-[240px] w-[360px] overflow-hidden rounded-2xl bg-surface-2 shadow-2xl shadow-black/60 transition-[opacity,transform] duration-500 ease-out-expo ${
          active === null ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {PROJECTS.map((p, i) => (
          <div key={p.slug} className={`absolute inset-0 transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}>
            {p.shots[0] ? (
              <Image src={p.shots[0].src} alt="" fill sizes="360px" className="object-cover object-top" />
            ) : (
              <div className="flex h-full flex-col justify-between bg-accent p-6 text-accent-ink">
                <span className="font-mono text-[12px] uppercase tracking-[0.14em]">{p.category}</span>
                <span className="display text-[30px] leading-[0.95]">{p.title}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Work() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <Heading
        id="work-title"
        index="02"
        label="Selected work"
        title={
          <>
            Case studies, from <span className="text-accent">MCP servers</span> to WordPress plugins.
          </>
        }
        intro="Each project has its own page with the architecture behind it. Hover a row for a preview."
      />

      <ol className="border-t border-line" onPointerLeave={() => setActive(null)}>
        {PROJECTS.map((p, i) => (
          <li key={p.slug} className="reveal border-b border-line" style={{ ["--d" as string]: `${(i % 4) * 40}ms` }}>
            <Link
              href={`/work/${p.slug}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group grid items-baseline gap-3 py-9 md:grid-cols-12 md:gap-8 md:py-11"
            >
              <span className="font-mono text-[13px] text-dim transition-colors group-hover:text-accent md:col-span-1">{p.index}</span>
              <div className="md:col-span-7">
                <h3 className="display text-[30px] transition-colors duration-300 group-hover:text-accent md:text-[44px]">{p.title}</h3>
                <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-muted">{p.summary}</p>
              </div>
              <p className="label md:col-span-3 md:text-right">{p.category}</p>
              <span className="hidden justify-self-end md:col-span-1 md:block">
                <span className="grid size-11 place-items-center rounded-full border border-line transition duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                  <ArrowUpRight className="size-4" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <HoverPreview active={active} />

      <div className="mt-28">
        <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-4">
          <h3 className="display text-[36px] md:text-[52px]">More client websites</h3>
          <p className="label">Design · Development · SEO</p>
        </div>
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {ARCHIVE.map((a, i) => (
            <li key={a.name} className="reveal" style={{ ["--d" as string]: `${(i % 4) * 60}ms` }}>
              <a href={a.href} target="_blank" rel="noopener" className="group block">
                <div className="relative aspect-[10/7] overflow-hidden rounded-2xl bg-surface">
                  <Image
                    src={a.img}
                    alt={`${a.name} website by ${SITE.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[17px] font-medium tracking-tight">{a.name}</p>
                    <p className="mt-1 text-[13px] text-dim">{a.type}</p>
                  </div>
                  <ArrowUpRight className="mt-1 size-4 text-dim transition group-hover:rotate-45 group-hover:text-accent" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
