// Tiny event bus between the preloader and the things it waits for.

export type ReadyKey = "fonts" | "scene" | "images";

const done = new Set<ReadyKey>();

export function markReady(key: ReadyKey) {
  if (done.has(key)) return;
  done.add(key);
  window.dispatchEvent(new CustomEvent("app:ready-part", { detail: key }));
}

export function isReady(key: ReadyKey) {
  return done.has(key);
}

// Fired once when the preloader finishes and the page is revealed.
export const INTRO_EVENT = "app:intro";

export function introDone() {
  return typeof window !== "undefined" && (window as unknown as { __introDone?: boolean }).__introDone === true;
}
