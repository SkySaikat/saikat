import { buildSystemPrompt } from "@/lib/ai-context";
import { clientIp, gemini, MODEL, rateLimit } from "@/lib/gemini";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM = buildSystemPrompt();
const MAX_CHARS = 600;
const MAX_TURNS = 8;

export async function POST(req: Request) {
  const ai = gemini();
  if (!ai) return Response.json({ error: "not_configured" }, { status: 503 });

  if (!rateLimit(clientIp(req), 20, 10 * 60 * 1000)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let messages: Msg[];
  try {
    const body = await req.json();
    messages = (Array.isArray(body?.messages) ? body.messages : [])
      .filter((m: Msg) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_TURNS)
      .map((m: Msg) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      config: {
        systemInstruction: SYSTEM,
        temperature: 0.5,
        maxOutputTokens: 1024,
      },
    });

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            // House style: no em dashes, even if the model slips one in.
            const text = chunk.text?.replace(/\s*—\s*/g, ", ");
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          console.error("[ask] stream error", err);
          controller.enqueue(encoder.encode("\n\n(The connection dropped. Please try again.)"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[ask] request failed", err);
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
