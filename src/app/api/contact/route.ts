import { NextResponse } from "next/server";
import { CONTACTS } from "@/lib/contacts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  contact?: string;
  message?: string;
  company?: string; // honeypot — должно быть пустым
};

function isValidContact(value: string) {
  const v = value.trim();
  if (v.startsWith("@") && v.length > 2) return true;
  if (/^https?:\/\/(t\.me|telegram\.me)\//i.test(v)) return true;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return true;
  if (/^\+?\d[\d\s\-()]{6,}$/.test(v)) return true;
  return false;
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    console.error("Telegram send failed:", res.status, await res.text());
    return false;
  }
  return true;
}

async function sendEmail(name: string, contact: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const to = process.env.CONTACT_EMAIL_TO || CONTACTS.email;
  const from = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${CONTACTS.brand} <${from}>`,
      to: [to],
      reply_to: contact.includes("@") && !contact.startsWith("@") ? contact : undefined,
      subject: `Нова заявка з сайту — ${name}`,
      text: `Имя: ${name}\nКонтакт: ${contact}\n\nСообщение:\n${message}`,
    }),
  });
  if (!res.ok) {
    console.error("Resend send failed:", res.status, await res.text());
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: боты заполняют скрытое поле — тихо «принимаем», но никуда не шлём.
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const contact = String(body.contact || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !contact || message.length < 10 || !isValidContact(contact)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const tgText =
    `🆕 <b>Нова заявка з Sitemaker.UA</b>\n\n` +
    `👤 <b>Ім'я:</b> ${escapeHtml(name)}\n` +
    `📩 <b>Контакт:</b> ${escapeHtml(contact)}\n\n` +
    `💬 ${escapeHtml(message)}`;

  const [tgOk, mailOk] = await Promise.all([
    sendTelegram(tgText).catch(() => false),
    sendEmail(name, contact, message).catch(() => false),
  ]);

  if (!tgOk && !mailOk) {
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
