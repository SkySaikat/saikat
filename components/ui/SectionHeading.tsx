import type { ReactNode } from "react";

export default function SectionHeading({
  index,
  kicker,
  title,
  intro,
  aside,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  intro?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <div data-reveal className="kicker flex items-center gap-3">
          <span className="text-a2">({index})</span>
          <span className="h-px w-8 bg-white/20" />
          {kicker}
        </div>
        <h2 data-reveal className="mt-5 max-w-[900px] text-[clamp(38px,5.6vw,84px)] font-semibold leading-[0.95] tracking-[-0.045em]">
          {title}
        </h2>
        {intro && (
          <p data-reveal className="mt-6 max-w-[560px] text-[15px] leading-relaxed text-muted md:text-[16px]">
            {intro}
          </p>
        )}
      </div>
      {aside && <div data-reveal>{aside}</div>}
    </div>
  );
}

export function Serif({ children }: { children: ReactNode }) {
  return <span className="font-serif font-normal italic tracking-[-0.02em] text-gradient pr-[0.05em]">{children}</span>;
}
