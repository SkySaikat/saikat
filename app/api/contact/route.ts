import { CONTACT_TOPICS } from "@/lib/content";
import { mailer, recipients } from "@/lib/mailer";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

// One line, no control characters: keeps header fields (subject, names) clean.
const oneLine = (s: string, max: number) => s.replace(/[\r\n\t\u0000-\u001f]+/g, " ").trim().slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: Request) {
  const transport = mailer();
  const to = recipients();
  if (!transport || !to.length) return Response.json({ error: "not_configured" }, { status: 503 });

  if (!rateLimit(`contact:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.company === "string" && body.company.trim()) return Response.json({ ok: true });
  // Bots tend to submit instantly; people take a few seconds.
  if (typeof body.startedAt === "number" && Date.now() - body.startedAt < 2500) return Response.json({ ok: true });

  const name = oneLine(String(body.name ?? ""), 100);
  const email = oneLine(String(body.email ?? ""), 200);
  const topic = CONTACT_TOPICS.includes(String(body.topic)) ? String(body.topic) : "Other";
  const message = String(body.message ?? "").trim().slice(0, 5000);

  const fields: Record<string, string> = {};
  if (!name) fields.name = "Please add your name.";
  if (!EMAIL.test(email)) fields.email = "Please use a valid email address.";
  if (message.length < 10) fields.message = "Tell me a little more about the project.";
  if (Object.keys(fields).length) return Response.json({ error: "invalid", fields }, { status: 400 });

  const text = `New enquiry from saikatchowdhury.com

Name: ${name}
Email: ${email}
Topic: ${topic}

${message}
`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <p style="margin:0 0 16px;color:#666">New enquiry from saikatchowdhury.com</p>
  <table style="border-collapse:collapse;margin-bottom:16px">
    <tr><td style="padding:2px 16px 2px 0;color:#666">Name</td><td>${escapeHtml(name)}</td></tr>
    <tr><td style="padding:2px 16px 2px 0;color:#666">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
    <tr><td style="padding:2px 16px 2px 0;color:#666">Topic</td><td>${escapeHtml(topic)}</td></tr>
  </table>
  <div style="white-space:pre-wrap;border-left:3px solid #ff5a1f;padding-left:12px">${escapeHtml(message)}</div>
</div>`;

  try {
    await transport.sendMail({
      // Hostinger only relays mail sent as the authenticated mailbox.
      from: { name: "saikatchowdhury.com", address: process.env.SMTP_USER! },
      to,
      replyTo: { name, address: email },
      subject: `[${topic}] New enquiry from ${name}`,
      text,
      html,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed", err);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
}
