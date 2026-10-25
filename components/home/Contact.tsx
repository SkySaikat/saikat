"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Loader2 } from "lucide-react";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/icons";
import { CONTACT_TOPICS as TOPICS, SITE } from "@/lib/content";

type Status = { state: "idle" | "sending" | "sent" | "error"; message?: string; fields?: Record<string, string> };

const ERRORS: Record<string, string> = {
  rate_limited: "That is a few messages in a short time. Please email me directly instead.",
  not_configured: "The form is not connected yet. Please email me directly.",
  send_failed: "Your message could not be sent just now. Please try again, or email me directly.",
};

function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  const time = now ? new Intl.DateTimeFormat("en-GB", { timeZone: SITE.timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now) : "--:--";
  const hour = now ? Number(new Intl.DateTimeFormat("en-GB", { timeZone: SITE.timezone, hour: "numeric", hourCycle: "h23" }).format(now)) : 12;
  const [start, end] = SITE.workHours;
  const working = hour >= start && hour < end;
  return (
    <p className="flex items-center gap-2 text-[14px] text-muted">
      <span className={`size-2 rounded-full ${working ? "bg-[#22c55e]" : "bg-dim"}`} />
      {time} in {SITE.city} (GMT+6) · {working ? "working now" : "offline, I reply next morning"}
    </p>
  );
}

export default function Contact() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  // Posts to /api/contact, which emails the enquiry through SMTP.
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.state === "sending") return;
    const form = e.currentTarget;
    const f = new FormData(form);
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          email: f.get("email"),
          message: f.get("message"),
          company: f.get("company"),
          topic,
          startedAt: startedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        setStatus({ state: "sent" });
        return;
      }
      if (data.error === "invalid" && data.fields) {
        setStatus({ state: "error", message: "Please check the highlighted fields.", fields: data.fields });
        return;
      }
      setStatus({ state: "error", message: ERRORS[data.error] ?? ERRORS.send_failed });
    } catch {
      setStatus({ state: "error", message: ERRORS.send_failed });
    }
  };

  const socials = [
    { label: "LinkedIn", href: SITE.socials.linkedin, Icon: LinkedinIcon },
    { label: "GitHub", href: SITE.socials.github, Icon: GithubIcon },
    { label: "Facebook", href: SITE.socials.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: SITE.socials.instagram, Icon: InstagramIcon },
  ];

  const field =
    "mt-2 w-full border-b border-line bg-transparent py-3 text-[17px] outline-none transition placeholder:text-dim focus:border-accent";

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-accent text-accent-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-36">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">07 / Contact</p>
        <h2 id="contact-title" className="display mt-6 max-w-[1100px] text-[clamp(48px,8vw,136px)]">
          Have a project in mind? Let&apos;s talk.
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href={`mailto:${SITE.email}`} className="display text-[clamp(26px,3.6vw,52px)] underline decoration-2 underline-offset-[10px] hover:decoration-4">
            {SITE.email}
          </a>
          <button
            onClick={copy}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-current/25 px-4 text-[13px] transition hover:bg-accent-ink hover:text-accent"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="bg-bg text-ink">
        <div className="mx-auto grid max-w-[1440px] gap-16 px-5 py-24 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="font-display text-[28px] font-semibold tracking-tight">Prefer a form?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Tell me what you are building and what would make it a win. It lands straight in my inbox and I reply by email.
            </p>
            <div className="mt-8">
              <LocalTime />
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener me"
                    className="group flex items-center justify-between rounded-2xl border border-line px-4 py-3.5 text-[14px] transition hover:border-accent"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="size-4 text-muted group-hover:text-accent" /> {label}
                    </span>
                    <ArrowUpRight className="size-4 text-dim transition group-hover:rotate-45 group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={submit} className="relative lg:col-span-7 lg:col-start-6">
            <fieldset>
              <legend className="label">I need help with</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTopic(t)}
                    aria-pressed={topic === t}
                    className={`rounded-full border px-4 py-2 text-[14px] transition ${
                      topic === t ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:text-ink"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            {/* Honeypot for bots: hidden from people and assistive tech. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="label">Name</span>
                <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" aria-invalid={!!status.fields?.name} className={field} />
                {status.fields?.name && <span className="mt-2 block text-[13px] text-accent">{status.fields.name}</span>}
              </label>
              <label className="block">
                <span className="label">Email</span>
                <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@company.com" aria-invalid={!!status.fields?.email} className={field} />
                {status.fields?.email && <span className="mt-2 block text-[13px] text-accent">{status.fields.email}</span>}
              </label>
            </div>
            <label className="mt-8 block">
              <span className="label">Project</span>
              <textarea name="message" required minLength={10} maxLength={5000} rows={4} placeholder="What are you building?" aria-invalid={!!status.fields?.message} className={`${field} resize-none`} />
              {status.fields?.message && <span className="mt-2 block text-[13px] text-accent">{status.fields.message}</span>}
            </label>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
              <p className={`max-w-[420px] text-[14px] ${status.state === "sent" ? "text-ink" : status.state === "error" ? "text-accent" : "text-dim"}`} aria-live="polite">
                {status.state === "sent" && (
                  <span className="inline-flex items-center gap-2">
                    <Check className="size-4 text-[#22c55e]" /> Thanks, your message is in my inbox. I will reply by email.
                  </span>
                )}
                {status.state === "error" && (
                  <>
                    {status.message}{" "}
                    <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">
                      {SITE.email}
                    </a>
                  </>
                )}
                {(status.state === "idle" || status.state === "sending") && "No spam, no newsletters. Just a reply."}
              </p>
              <button
                disabled={status.state === "sending"}
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-accent pl-7 pr-2 text-[15px] font-medium text-accent-ink transition hover:brightness-110 disabled:opacity-70"
              >
                {status.state === "sending" ? "Sending..." : "Send message"}
                <span className="grid size-10 place-items-center rounded-full bg-accent-ink text-accent transition-transform group-hover:rotate-45">
                  {status.state === "sending" ? <Loader2 className="size-4 animate-spin" /> : <ArrowUpRight className="size-4" />}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
