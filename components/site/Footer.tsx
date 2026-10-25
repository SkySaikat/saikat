import Link from "next/link";
import { NAV, PROJECTS, SERVICES, SITE } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Name, address and email kept consistent with the structured data, for local search. */}
          <address className="not-italic md:col-span-4">
            <p className="font-display text-[22px] font-semibold tracking-tight">{SITE.name}</p>
            <p className="mt-2 text-[15px] text-muted">{SITE.role}</p>
            <p className="mt-6 text-[15px] text-muted">
              {SITE.city} (Chittagong), {SITE.country}
              <br />
              <a href={`mailto:${SITE.email}`} className="link text-ink">
                {SITE.email}
              </a>
            </p>
          </address>
          <nav aria-label="Services" className="md:col-span-3">
            <p className="label">Services</p>
            <ul className="mt-4 space-y-2 text-[15px] text-muted">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href="/#services" className="link hover:text-ink">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Case studies" className="md:col-span-3">
            <p className="label">Case studies</p>
            <ul className="mt-4 space-y-2 text-[15px] text-muted">
              {PROJECTS.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="link hover:text-ink">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Site" className="md:col-span-2">
            <p className="label">Site</p>
            <ul className="mt-4 space-y-2 text-[15px] text-muted">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link hover:text-ink">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={SITE.cv} download className="link hover:text-ink">
                  Download CV
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p aria-hidden className="display mt-24 select-none whitespace-nowrap text-[min(10.4vw,150px)] leading-[0.8] text-surface-2">
          Saikat Chowdhury<span className="text-accent">.</span>
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-[13px] text-dim">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Web developer in {SITE.city}, {SITE.country}.
          </p>
          <a href="#" className="link hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
