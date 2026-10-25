import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

let transport: Transporter | null = null;

export function mailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT || 465);
  transport ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 is implicit TLS; 587 upgrades with STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transport;
}

export function recipients() {
  return (process.env.CONTACT_TO || process.env.SMTP_USER || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
