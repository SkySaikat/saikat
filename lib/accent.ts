// Visitor-selectable primary colour. Everything accented on the site reads
// --accent (fill), --accent-ink (text that sits on the accent) and --accent-rgb.

export type Accent = { id: string; name: string; hex: string; ink: string };

export const ACCENTS: Accent[] = [
  { id: "orange", name: "Orange", hex: "#ff5a1f", ink: "#0b0b0c" },
  { id: "yellow", name: "Yellow", hex: "#ffd60a", ink: "#0b0b0c" },
  { id: "lime", name: "Lime", hex: "#a3f730", ink: "#0b0b0c" },
  { id: "red", name: "Red", hex: "#ff3b30", ink: "#0b0b0c" },
  { id: "pink", name: "Pink", hex: "#ff3d9a", ink: "#0b0b0c" },
  { id: "blue", name: "Blue", hex: "#3d7bff", ink: "#ffffff" },
  { id: "violet", name: "Violet", hex: "#8b5cff", ink: "#ffffff" },
];

export const DEFAULT_ACCENT = ACCENTS[0];
export const ACCENT_KEY = "sc-accent";

function rgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function applyAccent(a: Accent) {
  const s = document.documentElement.style;
  s.setProperty("--accent", a.hex);
  s.setProperty("--accent-ink", a.ink);
  s.setProperty("--accent-rgb", rgb(a.hex));
  document.documentElement.dataset.accent = a.id;
  try {
    localStorage.setItem(ACCENT_KEY, a.id);
  } catch {}
  window.dispatchEvent(new CustomEvent("accent:change", { detail: a.id }));
}

// Inlined in <head> so a returning visitor's colour is set before first paint.
export const ACCENT_BOOT_SCRIPT = `(function(){try{var m=${JSON.stringify(
  Object.fromEntries(ACCENTS.map((a) => [a.id, [a.hex, a.ink, rgb(a.hex)]])),
)};var id=localStorage.getItem("${ACCENT_KEY}");var a=m[id];if(!a)return;var s=document.documentElement.style;s.setProperty("--accent",a[0]);s.setProperty("--accent-ink",a[1]);s.setProperty("--accent-rgb",a[2]);document.documentElement.dataset.accent=id;}catch(e){}})();`;
