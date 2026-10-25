"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Briefcase, CornerDownLeft, Download, HelpCircle, Mail, Sparkles, User } from "lucide-react";
import { PALETTE_EVENT } from "./palette-bus";
import { SITE } from "@/lib/content";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

export const SUGGESTIONS = [
  "What kind of MCP servers have you built?",
  "How do you keep AI API costs under control?",
  "Are you available for a team lead role?",
  "Walk me through your WordPress plugin work.",
];

const ERRORS: Record<string, string> = {
  not_configured: `My AI twin is offline right now (no Gemini key on this server yet). Email me at ${SITE.email} and the real me will answer.`,
  rate_limited: "That is a lot of questions in a short time. Give it a few minutes, or email me directly.",
  default: `Something went wrong on my side. Try again, or reach me at ${SITE.email}.`,
};

function Answer({ text }: { text: string }) {
  return (
    <div className="space-y-2">
      {text.split(/\n+/).map((line, i) =>
        /^\s*[-*•]\s+/.test(line) ? (
          <p key={i} className="flex gap-2">
            <span className="text-accent">·</span>
            <span>{line.replace(/^\s*[-*•]\s+/, "").replace(/\*\*/g, "")}</span>
          </p>
        ) : (
          <p key={i}>{line.replace(/\*\*/g, "")}</p>
        ),
      )}
    </div>
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Msg[]>([]);
  messagesRef.current = messages;

  const close = useCallback(() => {
    setOpen(false);
    abortRef.current?.abort();
  }, []);

  const ask = useCallback(async (q: string) => {
    const question = q.trim();
    if (!question) return;
    setInput("");

    const history: Msg[] = [...messagesRef.current.filter((m) => !m.error), { role: "user", content: question }];
    setMessages([...messagesRef.current, { role: "user", content: question }, { role: "assistant", content: "" }]);
    setBusy(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "default");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: text }]);
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      const code = (e as Error).message;
      setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: ERRORS[code] ?? ERRORS.default, error: true }]);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = (e: Event) => {
      const { query, autoSend } = (e as CustomEvent).detail ?? {};
      setOpen(true);
      if (query && autoSend) setTimeout(() => ask(query), 250);
      else if (query) setInput(query);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, onOpen);
    };
  }, [ask]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const id = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, close]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const go = (hash: string) => {
    close();
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (!el) {
        window.location.href = `/${hash}`;
        return;
      }
      el.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  const actions = [
    { icon: Briefcase, label: "Featured work", run: () => go("#work") },
    { icon: User, label: "About & leadership", run: () => go("#about") },
    { icon: Mail, label: "Contact", run: () => go("#contact") },
    {
      icon: Download,
      label: "Download CV",
      run: () => {
        const a = document.createElement("a");
        a.href = SITE.cv;
        a.download = "";
        a.click();
      },
    },
    { icon: HelpCircle, label: "FAQ", run: () => go("#faq") },
  ];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[9200] flex items-start justify-center px-4 pt-[12vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Ask Saikat's AI twin"
            className="relative flex max-h-[72vh] w-full max-w-[680px] flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl shadow-black/70"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <form
              className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!busy) ask(input);
              }}
            >
              <Sparkles className="size-4 shrink-0 text-accent" />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask my AI twin about skills, projects or availability"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-dim"
                maxLength={600}
                aria-label="Your question"
              />
              <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">esc</kbd>
            </form>

            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {messages.length === 0 ? (
                <div className="p-3">
                  <p className="px-3 pb-2 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">Ask</p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[14px] text-ink/85 hover:bg-white/[0.06]"
                    >
                      {s}
                      <ArrowRight className="size-3.5 text-dim opacity-0 transition group-hover:opacity-100" />
                    </button>
                  ))}
                  <p className="px-3 pb-2 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">Go</p>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {actions.map((a) => (
                      <button key={a.label} onClick={a.run} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] text-muted hover:bg-white/[0.06] hover:text-ink">
                        <a.icon className="size-4" />
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5 p-5">
                  {messages.map((m, i) =>
                    m.role === "user" ? (
                      <div key={i} className="flex justify-end">
                        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-white/[0.07] px-4 py-2.5 text-[14px] text-ink">{m.content}</p>
                      </div>
                    ) : (
                      <div key={i} className="flex gap-3">
                        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent font-display text-[12px] font-bold text-accent-ink">S</span>
                        <div className={`min-w-0 flex-1 text-[14px] leading-relaxed ${m.error ? "text-muted" : "text-ink/85"}`}>
                          {m.content ? <Answer text={m.content} /> : <span className="inline-block h-4 w-2 animate-pulse bg-accent" />}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3 font-mono text-[10px] text-dim">
              <span>Powered by Google Gemini · answers come from my portfolio</span>
              <span className="flex items-center gap-1">
                <CornerDownLeft className="size-3" /> send
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
