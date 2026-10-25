"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Send } from "lucide-react";
import SectionHeading, { Serif } from "@/components/ui/SectionHeading";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/icons";
import { SITE } from "@/lib/content";

const TOPICS = ["AI / MCP build", "Next.js platform", "WordPress plugin", "Team leadership", "Something else"];

function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = now
    ? new Intl.DateTimeFormat("en-GB", { timeZone: SITE.timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).format(now)
    : "--:--:--";
  const hour = now ? Number(new Intl.DateTimeFormat("en-GB", { timeZone: SITE.timezone, hour: "numeric", hourCycle: "h23" }).format(now)) : 12;
  const [start, end] = SITE.workHours;
  const working = hour >= start && hour < end;
  return (
    <div className="glass-soft rounded-2xl p-5">
      <p className="kicker">Local time · {SITE.location}</p>
      <p className="mt-3 font-mono text-[34px] tabular-nums tracking-tight">
        {time}
        <span className="ml-2 text-[13px] text-dim">GMT+6</span>
      </p>
      <p className={`mt-2 flex items-center gap-2 text-[13px] ${working ? "text-emerald" : "text-muted"}`}>
        <span className={`size-1.5 rounded-full ${working ? "bg-emerald" : "bg-dim"}`} />
        {working ? "Working hours. Expect a reply today." : "Outside working hours. I reply first thing tomorrow."}
      </p>
    </div>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [sent, setSent] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  // No mail service is wired yet, so the form hands a pre-filled draft to the
  // visitor's own email app. Swap for a /api/contact route (e.g. Resend) later.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "");
    const body = `${String(f.get("message") || "")}\n\n${name}\n${String(f.get("email") || "")}`;
    const subject = `[${topic}] Project enquiry from ${name || "your portfolio"}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const socials = [
    { label: "LinkedIn", href: SITE.socials.linkedin, Icon: LinkedinIcon },
    { label: "GitHub", href: SITE.socials.github, Icon: GithubIcon },
    { label: "Facebook", href: SITE.socials.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: SITE.socials.instagram, Icon: InstagramIcon },
  ];

  return (
    <section id="contact" className="relative z-[4] mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-36">
      <SectionHeading
        index="06"
        kicker="Contact"
        title={
          <>
            Let&apos;s build something <Serif>intelligent.</Serif>
          </>
        }
        intro="Enterprise AI, full-stack architecture, a plugin your team keeps putting off, or a team that needs a lead. Tell me what you are working on."
      />

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col gap-5">
          <div data-reveal data-glow className="glass p-7">
            <p className="kicker">Email</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <a href={`mailto:${SITE.email}`} className="text-[clamp(22px,2.4vw,30px)] font-medium tracking-tight hover:text-a2">
                {SITE.email}
              </a>
              <button onClick={copy} className="flex items-center gap-2 rounded-full bg-white/[0.05] px-3.5 py-2 text-[12px] text-muted ring-1 ring-white/10 hover:text-ink">
                {copied ? <Check className="size-3.5 text-emerald" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div data-reveal>
            <LocalTime />
          </div>
          <div data-reveal className="grid grid-cols-2 gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                data-glow
                className="glass group flex items-center justify-between p-4"
                style={{ ["--radius" as string]: "16px" }}
              >
                <span className="flex items-center gap-3 text-[14px]">
                  <Icon className="size-4 text-muted transition group-hover:text-ink" />
                  {label}
                </span>
                <ArrowUpRight className="size-4 text-dim transition group-hover:rotate-45 group-hover:text-ink" />
              </a>
            ))}
            {SITE.studio.url && (
              <a href={SITE.studio.url} target="_blank" rel="noreferrer" data-glow className="glass col-span-2 flex items-center justify-between p-4" style={{ ["--radius" as string]: "16px" }}>
                <span className="text-[14px]">{SITE.studio.name}</span>
                <ArrowUpRight className="size-4 text-dim" />
              </a>
            )}
          </div>
        </div>

        <form data-reveal data-glow onSubmit={onSubmit} className="glass flex flex-col gap-5 p-7 md:p-10">
          <fieldset>
            <legend className="kicker mb-3">I need help with</legend>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTopic(t)}
                  aria-pressed={topic === t}
                  className={`rounded-full px-4 py-2 text-[13px] ring-1 transition ${
                    topic === t ? "bg-ink text-obsidian ring-ink" : "bg-white/[0.03] text-muted ring-white/10 hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="kicker">Name</span>
              <input name="name" required autoComplete="name" className="mt-2 w-full border-b border-white/15 bg-transparent py-3 text-[16px] outline-none transition placeholder:text-dim focus:border-a2" placeholder="Your name" />
            </label>
            <label className="block">
              <span className="kicker">Email</span>
              <input name="email" type="email" required autoComplete="email" className="mt-2 w-full border-b border-white/15 bg-transparent py-3 text-[16px] outline-none transition placeholder:text-dim focus:border-a2" placeholder="you@company.com" />
            </label>
          </div>
          <label className="block">
            <span className="kicker">Project</span>
            <textarea name="message" required rows={5} className="mt-2 w-full resize-none border-b border-white/15 bg-transparent py-3 text-[16px] outline-none transition placeholder:text-dim focus:border-a2" placeholder="What are you building, and what would make it a win?" />
          </label>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[12px] text-dim" aria-live="polite">
              {sent ? "Your email app should open with the draft ready. Nothing opened? Use the copy button." : "Opens a ready-to-send draft in your email app."}
            </p>
            <button className="group inline-flex items-center gap-3 rounded-full bg-ink py-3.5 pl-6 pr-4 text-[14px] font-medium text-obsidian transition hover:bg-white">
              Send message
              <span className="grid size-7 place-items-center rounded-full bg-obsidian text-ink transition-transform group-hover:-rotate-12">
                <Send className="size-3.5" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
