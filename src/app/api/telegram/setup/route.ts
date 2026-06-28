import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const SITE_URL = "https://sitemaker-ua.vercel.app";

// Регистрация/проверка webhook. Защищено секретом: /api/telegram/setup?key=<SECRET>
export async function GET(request: Request) {
  if (!TOKEN || !SECRET) return NextResponse.json({ error: "missing env" }, { status: 500 });
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const action = url.searchParams.get("action") || "set";

  if (action === "info") {
    const info = await fetch(`https://api.telegram.org/bot${TOKEN}/getWebhookInfo`).then((r) => r.json());
    return NextResponse.json(info);
  }

  if (action === "delete") {
    const del = await fetch(`https://api.telegram.org/bot${TOKEN}/deleteWebhook`).then((r) => r.json());
    return NextResponse.json(del);
  }

  // set webhook
  const setRes = await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: `${SITE_URL}/api/telegram/webhook`,
      secret_token: SECRET,
      allowed_updates: ["message", "callback_query"],
      drop_pending_updates: true,
    }),
  }).then((r) => r.json());

  // также выставим команды бота для удобства
  await fetch(`https://api.telegram.org/bot${TOKEN}/setMyCommands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      commands: [
        { command: "start", description: "Почати / показати меню" },
        { command: "menu", description: "Показати меню" },
      ],
    }),
  });

  return NextResponse.json(setRes);
}
