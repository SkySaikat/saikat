// Accent palette shared by CSS (custom properties) and the WebGL scenes.
// The AI theme command swaps it at runtime.

export type Palette = { name: string; a1: string; a2: string; a3: string };

export const DEFAULT_PALETTE: Palette = {
  name: "Cybernetic Glow",
  a1: "#6366f1",
  a2: "#06b6d4",
  a3: "#8b5cf6",
};

let current: Palette = DEFAULT_PALETTE;
const listeners = new Set<() => void>();

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function getPalette() {
  return current;
}

export function subscribePalette(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setPalette(p: Palette) {
  current = p;
  const root = document.documentElement;
  (["a1", "a2", "a3"] as const).forEach((k) => {
    root.style.setProperty(`--${k}-rgb`, hexToRgb(p[k]).join(" "));
  });
  listeners.forEach((fn) => fn());
}
