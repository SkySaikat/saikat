import { NAV, SITE } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative z-[4] mx-auto max-w-[1400px] overflow-hidden px-5 pb-10 pt-20 md:px-10">
      <div className="hairline mb-14" />
      <div className="flex flex-wrap items-start justify-between gap-10">
        <div className="max-w-[360px]">
          <p className="text-[15px] font-medium">{SITE.name}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">{SITE.role}. Founder of {SITE.studio.name}.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-[14px] text-muted">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-ink">
              {n.label}
            </a>
          ))}
          <a href={SITE.cv} download className="hover:text-ink">
            CV
          </a>
        </nav>
      </div>
      <p
        aria-hidden
        className="mt-20 select-none whitespace-nowrap text-center text-[15.5vw] font-semibold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.12)] xl:text-[218px]"
      >
        Saikat Chowdhury
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-dim">
        <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
        <span>Built with Next.js, Three.js, GSAP & Gemini</span>
        <a href="#top" className="hover:text-ink">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
