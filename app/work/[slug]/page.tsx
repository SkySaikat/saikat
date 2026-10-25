import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import ProjectVisual from "@/components/work/ProjectVisual";
import { PROJECTS, SITE } from "@/lib/content";
import { JsonLdString, projectGraph } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.title} Case Study`;
  return {
    title,
    description: p.summary,
    keywords: [...p.tech, p.category, "case study", "web developer"],
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE.url}/work/${p.slug}`,
      title: `${title} | ${SITE.name}`,
      description: p.summary,
      ...(p.shots[0] ? { images: [{ url: p.shots[0].src, alt: p.shots[0].alt }] } : {}),
    },
  };
}

const DEV = process.env.NODE_ENV === "development";

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const i = PROJECTS.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = PROJECTS[i];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JsonLdString(projectGraph(p)) }} />
      <main className="pt-32 md:pt-40">
        <article>
          <header className="mx-auto max-w-[1440px] px-5 md:px-10">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-[12px] text-dim">
                <li>
                  <Link href="/" className="link hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/#work" className="link hover:text-ink">
                    Work
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-muted">
                  {p.title}
                </li>
              </ol>
            </nav>
            <p className="label mt-12">
              <span className="text-accent">{p.index}</span> / {p.category}
            </p>
            <h1 className="display mt-6 max-w-[1200px] text-[clamp(44px,7vw,112px)]">{p.title}</h1>
            <div className="mt-10 grid gap-10 lg:grid-cols-12">
              <p className="text-[19px] leading-[1.65] text-muted lg:col-span-7 md:text-[21px]">{p.summary}</p>
              <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
                {p.links.length > 0 && (
                  <div>
                    <p className="label">Links</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {p.links.map((l) => (
                        <li key={l.href}>
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[14px] font-medium text-accent-ink hover:brightness-110"
                          >
                            {l.label} <ArrowUpRight className="size-3.5" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="label">Built with</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[12px] text-ink/85">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {DEV && p.needsAssets && (
              <p className="mt-8 inline-block rounded-full border border-dashed border-amber-300/60 px-4 py-1.5 font-mono text-[11px] text-amber-200">
                dev only: add screenshots / links for this project in lib/content.ts
              </p>
            )}
          </header>

          <section aria-label="Project visuals" className="mx-auto mt-16 max-w-[1440px] px-5 md:px-10">
            {p.shots.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {p.shots.map((s, k) => (
                  <figure key={s.src} className={`reveal ${k === 0 ? "md:col-span-2" : ""}`}>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-surface">
                      <Image
                        src={s.src}
                        alt={s.alt}
                        fill
                        priority={k === 0}
                        sizes={k === 0 ? "(max-width: 1440px) 100vw, 1360px" : "(max-width: 768px) 100vw, 680px"}
                        className="object-cover object-top"
                      />
                    </div>
                    <figcaption className="mt-3 font-mono text-[12px] text-dim">{s.alt}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="aspect-[16/11] md:aspect-[16/8]">
                <ProjectVisual visual={p.visual} />
              </div>
            )}
          </section>

          <section aria-label="Architecture" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
            {p.architecture.map((block) => (
              <div key={block.heading} className="grid gap-8 border-t border-line py-12 lg:grid-cols-12">
                <h2 className="display reveal text-[32px] md:text-[44px] lg:col-span-4">{block.heading}</h2>
                <ol className="space-y-6 lg:col-span-7 lg:col-start-6">
                  {block.points.map((pt, k) => (
                    <li key={k} className="reveal grid grid-cols-[40px_1fr] gap-2 text-[17px] leading-relaxed text-ink/85" style={{ ["--d" as string]: `${k * 50}ms` }}>
                      <span className="font-mono text-[13px] leading-[1.9] text-accent">{String(k + 1).padStart(2, "0")}</span>
                      {pt}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </section>
        </article>

        <nav aria-label="More case studies" className="border-t border-line">
          <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
            <Link href={`/work/${prev.slug}`} className="group border-b border-line px-5 py-12 md:border-b-0 md:border-r md:px-10">
              <span className="label flex items-center gap-2">
                <ArrowLeft className="size-3.5" /> Previous
              </span>
              <span className="display mt-4 block text-[28px] transition-colors group-hover:text-accent md:text-[36px]">{prev.title}</span>
            </Link>
            <Link href={`/work/${next.slug}`} className="group px-5 py-12 text-right md:px-10">
              <span className="label flex items-center justify-end gap-2">
                Next <ArrowRight className="size-3.5" />
              </span>
              <span className="display mt-4 block text-[28px] transition-colors group-hover:text-accent md:text-[36px]">{next.title}</span>
            </Link>
          </div>
        </nav>

        <section className="bg-accent text-accent-ink">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-8 px-5 py-20 md:px-10 md:py-28">
            <h2 className="display max-w-[900px] text-[clamp(40px,6vw,88px)]">Need something like this?</h2>
            <Link
              href="/#contact"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-accent-ink pl-7 pr-2 text-[15px] font-medium text-accent"
            >
              Start a project
              <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-ink">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
