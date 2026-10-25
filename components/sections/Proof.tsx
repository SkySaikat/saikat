import Image from "next/image";
import { CLIENT_LOGOS, STATS } from "@/lib/content";

// Client logos and headline numbers, directly under the hero.
export default function Proof() {
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];
  return (
    <section aria-label="Clients and highlights" className="relative z-[4] mx-auto max-w-[1400px] px-5 py-16 md:px-10">
      <div className="hairline mb-12" />
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} data-reveal>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-[44px] font-semibold leading-none tracking-[-0.05em] md:text-[52px]">
                {s.value}
                <span className="text-a2">.</span>
              </dd>
              <p className="mt-2 max-w-[160px] text-[13px] leading-snug text-muted">{s.label}</p>
            </div>
          ))}
        </dl>
        <div data-reveal>
          <p className="kicker mb-6">Trusted by teams and brands</p>
          <div className="marquee overflow-hidden">
            <div className="marquee-track flex w-max items-center gap-14">
              {logos.map((src, i) => (
                <div key={i} className="relative h-16 w-24 shrink-0 opacity-50 transition-opacity duration-300 hover:opacity-100">
                  <Image src={src} alt="" fill sizes="96px" className="object-contain [filter:brightness(0)_invert(1)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
