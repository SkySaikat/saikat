import type { ReactNode } from "react";

export default function Heading({ index, label, title, intro, id }: { index: string; label: string; title: ReactNode; intro?: ReactNode; id?: string }) {
  return (
    <header className="mb-14 md:mb-20">
      <p className="label reveal flex items-center gap-3">
        <span className="text-accent">{index}</span>
        <span className="h-px w-10 bg-line" />
        {label}
      </p>
      <h2 id={id} className="display reveal mt-6 max-w-[1000px] text-[clamp(40px,6vw,92px)]">
        {title}
      </h2>
      {intro && <p className="reveal mt-6 max-w-[620px] text-[17px] leading-relaxed text-muted">{intro}</p>}
    </header>
  );
}
