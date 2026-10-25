"use client";

import { Sparkles } from "lucide-react";
import { openPalette } from "./palette-bus";

export default function AskAiButton({ className = "", label = "Ask my AI twin" }: { className?: string; label?: string }) {
  return (
    <button
      onClick={() => openPalette()}
      className={`inline-flex h-12 items-center gap-2.5 rounded-full border border-line px-5 text-[14px] transition hover:border-accent hover:text-accent ${className}`}
    >
      <Sparkles className="size-4 text-accent" />
      {label}
      <kbd className="ml-1 font-mono text-[10px] text-dim">⌘K</kbd>
    </button>
  );
}
