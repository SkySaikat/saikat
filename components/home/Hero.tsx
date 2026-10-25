import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { AccentSwatches } from "@/components/site/AccentPicker";
import { CLIENT_LOGOS, SITE, STATS } from "@/lib/content";

function Badge() {
  const text = "AVAILABLE FOR WORK · CHATTOGRAM · ";
  return (
    <div className="absolute -bottom-10 -left-10 z-10 grid size-[124px] place-items-center rounded-full bg-bg md:-left-12 md:size-[140px]" aria-hidden>
      <svg viewBox="0 0 100 100" className="absolute inset-2 animate-[spin_22s_linear_infinite] motion-reduce:animate-none">
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="8" fill="var(--color-ink)" fontFamily="var(--font-jetbrains)">
          {/* textLength = circumference, so the phrase closes the loop exactly. */}
          <textPath href="#badge-circle" textLength="238" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="size-3 rounded-full bg-accent" />
    </div>
  );
}

export default function Hero() {
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-32 md:pt-40">
      {/* A single soft glow in the accent colour. */}
      <div aria-hidden className="pointer-events-none absolute -right-[20vw] -top-[30vh] size-[70vw] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.14),transparent)]" />

      <div className="relative mx-auto grid max-w-[1440px] gap-x-10 gap-y-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-muted">
            <span className="flex items-center gap-2 text-ink">
              <span className="pulse" /> {SITE.status}
            </span>
            <span className="hidden text-dim sm:inline">/</span>
            <span>
              {SITE.city} (Chittagong), {SITE.country}
            </span>
          </p>

          <h1 id="hero-title" className="mt-8">
            <span className="block font-mono text-[13px] uppercase tracking-[0.16em] text-muted">
              {SITE.name}, Full-Stack Web Developer
            </span>
            <span className="display mt-5 block text-[clamp(48px,7.6vw,128px)]">
              Fast websites, custom plugins &amp; <span className="mark">AI systems</span> that grow your business.
            </span>
          </h1>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] lg:col-span-4 lg:mx-0 lg:ml-auto lg:mt-10">
          <figure className="group relative">
            <div className="duotone relative aspect-[4/5] overflow-hidden rounded-[28px]">
              <Image
                src={SITE.portrait}
                alt={`${SITE.name}, full-stack web developer based in ${SITE.location}`}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover object-top"
              />
              {/* Natural photo on hover */}
              <Image
                src={SITE.portrait}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover object-top opacity-0 grayscale transition-opacity duration-700 group-hover:opacity-100"
                style={{ mixBlendMode: "normal" }}
              />
            </div>
            <Badge />
            <figcaption className="mt-4 flex justify-between pl-24 font-mono text-[11px] uppercase tracking-[0.14em] text-dim md:pl-28">
              <span>Founder, {SITE.studio.name}</span>
              <span>GMT+6</span>
            </figcaption>
          </figure>
        </div>

        <div className="lg:col-span-6">
          <p className="max-w-[600px] text-[18px] leading-[1.65] text-muted md:text-[19px]">{SITE.intro}</p>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-6 lg:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/#work"
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-accent pl-7 pr-2 text-[15px] font-medium text-accent-ink transition hover:brightness-110"
            >
              See my work
              <span className="grid size-10 place-items-center rounded-full bg-accent-ink text-accent transition-transform duration-500 group-hover:rotate-[-45deg]">
                <ArrowDown className="size-4 -rotate-90" />
              </span>
            </Link>
            <Link href="/#contact" className="inline-flex h-14 items-center gap-2 rounded-full border border-line px-7 text-[15px] transition hover:border-ink">
              Start a project <ArrowUpRight className="size-4" />
            </Link>
            <a href={SITE.cv} download className="link inline-flex h-14 items-center gap-2 px-3 text-[15px] text-muted hover:text-ink">
              <Download className="size-4" /> CV
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="label">Pick your colour</span>
            <AccentSwatches />
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-20 max-w-[1440px] px-5 md:px-10">
        <dl className="grid grid-cols-2 border-t border-line md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`py-8 ${i % 2 ? "pl-6" : ""} md:pl-0 ${i > 0 ? "md:border-l md:border-line md:pl-8" : ""}`}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="display text-[56px] md:text-[72px]">
                {s.value}
                <span className="text-accent">.</span>
              </dd>
              <p className="mt-2 max-w-[200px] text-[14px] leading-snug text-muted">{s.label}</p>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-6 border-t border-line py-10 md:flex-row md:items-center md:gap-12">
          <p className="label shrink-0">Trusted by teams at</p>
          <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <div className="marquee-track flex w-max items-center gap-16">
              {logos.map((src, i) => (
                <div key={i} className="relative h-14 w-24 shrink-0 opacity-60 transition-opacity hover:opacity-100">
                  <Image src={src} alt={i < CLIENT_LOGOS.length ? "Client logo" : ""} fill sizes="96px" className="object-contain [filter:brightness(0)_invert(1)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
