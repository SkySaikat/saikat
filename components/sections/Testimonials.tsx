import Image from "next/image";
import SectionHeading, { Serif } from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/lib/content";

export default function Testimonials() {
  return (
    <section id="reviews" className="relative z-[4] mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-36">
      <SectionHeading
        index="05"
        kicker="Client Reviews"
        title={
          <>
            What clients <Serif>say.</Serif>
          </>
        }
      />
      <div className="grid gap-5 md:grid-cols-2">
        {TESTIMONIALS.map((t, i) => (
          <figure key={t.name} data-reveal data-glow data-speed={i % 2 ? -0.03 : 0.03} className="glass flex flex-col p-8 md:p-12">
            <span aria-hidden className="font-serif text-[120px] leading-[0.6] text-a2/40">
              &ldquo;
            </span>
            <blockquote className="mt-4 text-[clamp(20px,2vw,26px)] font-medium leading-[1.45] tracking-[-0.015em] text-ink/95">
              {t.quote}
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-4 pt-10">
              <Image src={t.photo} alt={t.name} width={52} height={52} className="rounded-full ring-2 ring-white/10" />
              <div>
                <p className="text-[15px] font-medium">{t.name}</p>
                <p className="font-mono text-[11px] text-muted">{t.title}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
