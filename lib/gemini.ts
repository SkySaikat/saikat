import "server-only";
import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

export function gemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

export const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

// Small in-memory sliding window per IP. Good enough for a portfolio on one
// instance; swap for a KV-backed limiter if traffic ever warrants it.
const hits = new Map<string, number[]>();

export function rateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= limit) {
    hits.set(ip, list);
    return false;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return true;
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}
