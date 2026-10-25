import { Plus } from "lucide-react";
import AskAiButton from "@/components/ai/AskAiButton";
import { FAQ } from "@/lib/content";

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label reveal">
            <span className="text-accent">06</span> / FAQ
          </p>
          <h2 id="faq-title" className="display reveal mt-6 text-[44px] md:text-[60px]">
            Questions clients ask first.
          </h2>
          <div className="reveal mt-10 rounded-3xl border border-line bg-surface p-7">
            <p className="font-display text-[22px] font-semibold tracking-tight">Still curious?</p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Ask my AI twin. It runs on Google Gemini and answers from the work on this site.
            </p>
            <AskAiButton className="mt-6" />
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {FAQ.map((f, i) => (
            <details key={f.q} className="reveal group border-b border-line [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-7">
                <h3 className="font-display text-[22px] font-semibold leading-snug tracking-[-0.02em] md:text-[26px]">{f.q}</h3>
                <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-line transition duration-300 group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-accent-ink">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="max-w-[640px] pb-8 text-[16px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
