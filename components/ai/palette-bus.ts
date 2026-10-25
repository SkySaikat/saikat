// Lets any button open the AI command palette, optionally with a question.

export const PALETTE_EVENT = "palette:open";

export function openPalette(query?: string, autoSend = false) {
  window.dispatchEvent(new CustomEvent(PALETTE_EVENT, { detail: { query, autoSend } }));
}
