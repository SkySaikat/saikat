import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Heading from "@/components/ui/Heading";
import { MARQUEE, SERVICES } from "@/lib/content";

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="size-[0.6em] shrink-0" fill="currentColor" aria-hidden>
      <path d="M12 0l2.6 8.4L24 12l-9.4 3.6L12 24l-2.6-8.4L0 12l9.4-3.6z" />
    </svg>
  );
}

export function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    // The outer wrapper clips the tilted band so it can bleed past the edges without widening the page.
    <div className="overflow-hidden py-8">
      <div className="-mx-4 -rotate-[1.5deg] overflow-hidden bg-accent py-5 text-accent-ink md:py-7" aria-label="Specialities">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {items.map((m, i) => (
            <span key={i} className="display flex items-center gap-10 text-[36px] uppercase md:text-[56px]" aria-hidden={i >= MARQUEE.length}>
              {m}
              <Star />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <Heading
        id="services-title"
        index="01"
        label="Services"
        title={
          <>
            Web development that ships, <span className="text-accent">ranks</span> and scales.
          </>
        }
        intro="One developer who can take a product from the database schema to launch-day traffic, then keep it fast, findable and maintainable."
      />

      <ol className="border-t border-line">
        {SERVICES.map((s, i) => (
          <li key={s.id} className="reveal group border-b border-line" style={{ ["--d" as string]: `${i * 40}ms` }}>
            <article className="grid gap-5 py-10 transition-colors duration-500 md:grid-cols-12 md:gap-8 md:py-12">
              <span className="font-mono text-[13px] text-accent md:col-span-1 md:pt-3">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display text-[34px] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:col-span-5 md:text-[48px]">
                {s.title}
              </h3>
              <div className="md:col-span-6">
                <p className="max-w-[560px] text-[16px] leading-relaxed text-muted">{s.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${s.title} technologies`}>
                  {s.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink/80">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <div className="reveal mt-12 flex flex-wrap items-center justify-between gap-6">
        <p className="max-w-[520px] text-[16px] text-muted">Not sure which one fits? Describe the problem and I will suggest the simplest thing that works.</p>
        <Link href="/#contact" className="group inline-flex items-center gap-2 text-[16px] font-medium">
          <span className="link">Tell me about your project</span>
          <ArrowUpRight className="size-4 text-accent transition-transform group-hover:rotate-45" />
        </Link>
      </div>
    </section>
  );
}
