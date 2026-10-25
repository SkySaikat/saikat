import Heading from "@/components/ui/Heading";
import { ABOUT, SITE, STACK, TESTIMONIALS } from "@/lib/content";
import Image from "next/image";

export function About() {
  const facts = [
    ["Based in", `${SITE.city} (Chittagong), ${SITE.country}`],
    ["Experience", "6+ years"],
    ["Education", `${SITE.degree}, Premier University`],
    ["Studio", SITE.studio.name],
  ];
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <Heading
        id="about-title"
        index="03"
        label="About"
        title={
          <>
            Engineer by training. <span className="text-accent">Architect</span> by habit.
          </>
        }
      />
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="reveal text-[20px] leading-[1.6] text-ink/90 md:text-[22px]">{SITE.bio}</p>
          <dl className="reveal mt-12 border-t border-line">
            {facts.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-line py-4 text-[15px]">
                <dt className="text-dim">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {ABOUT.map((a, i) => (
            <div key={a.title} className="reveal" style={{ ["--d" as string]: `${i * 60}ms` }}>
              <span className="block h-1 w-10 rounded-full bg-accent" />
              <h3 className="mt-6 font-display text-[24px] font-semibold tracking-[-0.02em]">{a.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stack() {
  return (
    <section aria-labelledby="stack-title" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label reveal">
              <span className="text-accent">04</span> / Stack
            </p>
            <h2 id="stack-title" className="display reveal mt-6 text-[44px] md:text-[60px]">
              Tools I trust in production.
            </h2>
          </div>
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {STACK.map((g, i) => (
              <div key={g.label} className="reveal" style={{ ["--d" as string]: `${(i % 3) * 60}ms` }}>
                <h3 className="label !text-ink">{g.label}</h3>
                <ul className="mt-4 space-y-1.5 text-[15px] text-muted">
                  {g.items.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section aria-labelledby="reviews-title" className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <p className="label reveal">
        <span className="text-accent">05</span> / Client reviews
      </p>
      <h2 id="reviews-title" className="sr-only">
        Client reviews
      </h2>
      <div className="mt-12 grid gap-16 md:grid-cols-2 md:gap-12">
        {TESTIMONIALS.map((t, i) => (
          <figure key={t.name} className="reveal flex flex-col" style={{ ["--d" as string]: `${i * 100}ms` }}>
            <span aria-hidden className="display text-[120px] leading-[0.5] text-accent">
              &ldquo;
            </span>
            <blockquote className="mt-6 font-display text-[clamp(24px,2.4vw,34px)] font-medium leading-[1.3] tracking-[-0.02em]">{t.quote}</blockquote>
            <figcaption className="mt-10 flex items-center gap-4">
              <Image src={t.photo} alt={t.name} width={56} height={56} className="rounded-full grayscale" />
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-[14px] text-dim">{t.title}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
