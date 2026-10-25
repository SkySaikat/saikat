import { clientIp, gemini, MODEL, rateLimit } from "@/lib/gemini";

// Turns a visitor's mood prompt into three accent colours for the site.
const HEX = /^#[0-9a-fA-F]{6}$/;

const SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", description: "Two to four word name for the palette" },
    a1: { type: "string", description: "Primary accent, #RRGGBB" },
    a2: { type: "string", description: "Secondary highlight accent, #RRGGBB" },
    a3: { type: "string", description: "Tertiary accent, #RRGGBB" },
  },
  required: ["name", "a1", "a2", "a3"],
};

// Keep accents bright enough to glow on a near-black background.
function lift(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  let [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (lum < 90) {
    const k = 90 / Math.max(lum, 1);
    [r, g, b] = [r, g, b].map((v) => Math.min(255, Math.round(v * k + 20)));
  }
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export async function POST(req: Request) {
  const ai = gemini();
  if (!ai) return Response.json({ error: "not_configured" }, { status: 503 });
  if (!rateLimit(`theme:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let prompt = "";
  try {
    prompt = String((await req.json())?.prompt ?? "").slice(0, 160).trim();
  } catch {}
  if (!prompt) return Response.json({ error: "bad_request" }, { status: 400 });

  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: `Design an accent palette for a dark, near-black (#050508) developer portfolio, inspired by: "${prompt}". Return three vivid, harmonious accent colours that glow on black and keep white text readable.`,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: SCHEMA,
        temperature: 0.9,
        maxOutputTokens: 512,
      },
    });
    const data = JSON.parse(res.text ?? "{}");
    if (![data.a1, data.a2, data.a3].every((c) => typeof c === "string" && HEX.test(c))) {
      return Response.json({ error: "invalid_palette" }, { status: 502 });
    }
    return Response.json({
      name: String(data.name || prompt).replace(/—/g, "-").slice(0, 40),
      a1: lift(data.a1),
      a2: lift(data.a2),
      a3: lift(data.a3),
    });
  } catch (err) {
    console.error("[theme] failed", err);
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
