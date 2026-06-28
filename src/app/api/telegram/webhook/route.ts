import { NextResponse } from "next/server";
import { CONTACTS } from "@/lib/contacts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER = process.env.TELEGRAM_CHAT_ID;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const SITE_URL = "https://sitemaker-ua.vercel.app";

const API = `https://api.telegram.org/bot${TOKEN}`;

async function tg(method: string, payload: Record<string, unknown>) {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) console.error(`tg ${method} failed:`, res.status, await res.text());
  return res.ok;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const WELCOME =
  "Вітаю! Я бот <b>Sitemaker.UA</b> 🚀\n\n" +
  "Допоможу дізнатися про послуги або залишити заявку. Оберіть, що цікавить, або просто напишіть своє питання повідомленням 👇";

const SERVICES =
  "<b>Послуги та орієнтовні ціни</b>\n\n" +
  "🔹 <b>Сайт-візитка</b> — від 5 000 грн\n" +
  "Лаконічна сторінка про вас, послуги та контакти.\n\n" +
  "🔹 <b>Лендинг</b> — від 8 000 грн\n" +
  "Односторінковий сайт з фокусом на продаж.\n\n" +
  "🔹 <b>Корпоративний сайт</b> — від 15 000 грн\n" +
  "Багатосторінковий сайт компанії: послуги, блог, портфоліо.\n\n" +
  "🔹 <b>Інтернет-магазин</b> — від 25 000 грн\n" +
  "Каталог, кошик, оплата, доставка, адмін-панель.\n\n" +
  "Щоб порахувати точніше — натисніть «Залишити заявку» і опишіть проект.";

const LEAD_PROMPT =
  "Напишіть, будь ласка, <b>одним повідомленням</b>:\n" +
  "• який сайт потрібен\n• орієнтовний бюджет\n• бажані терміни\n\n" +
  "Можете додати свій контакт для звʼязку. Ми відповімо найближчим часом 🙌";

function mainMenu() {
  return {
    inline_keyboard: [
      [{ text: "💼 Послуги та ціни", callback_data: "services" }],
      [{ text: "📝 Залишити заявку", callback_data: "lead" }],
      [
        { text: "💬 Написати людині", url: CONTACTS.telegramUrl },
        { text: "🌐 Наш сайт", url: SITE_URL },
      ],
    ],
  };
}

function backMenu() {
  return { inline_keyboard: [[{ text: "◀️ Меню", callback_data: "menu" }]] };
}

export async function POST(request: Request) {
  // Проверка, что запрос реально от Telegram
  if (SECRET && request.headers.get("x-telegram-bot-api-secret-token") !== SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!TOKEN) return NextResponse.json({ ok: false }, { status: 500 });

  let update: TgUpdate;
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  // Нажатие на inline-кнопку
  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = cq.message?.chat.id;
    await tg("answerCallbackQuery", { callback_query_id: cq.id });
    if (chatId) {
      if (cq.data === "services") await tg("sendMessage", { chat_id: chatId, text: SERVICES, parse_mode: "HTML", reply_markup: backMenu() });
      else if (cq.data === "lead") await tg("sendMessage", { chat_id: chatId, text: LEAD_PROMPT, parse_mode: "HTML", reply_markup: backMenu() });
      else await tg("sendMessage", { chat_id: chatId, text: WELCOME, parse_mode: "HTML", reply_markup: mainMenu() });
    }
    return NextResponse.json({ ok: true });
  }

  const msg = update.message;
  if (!msg?.chat) return NextResponse.json({ ok: true });
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  // Команды
  if (text.startsWith("/start") || text === "/menu") {
    await tg("sendMessage", { chat_id: chatId, text: WELCOME, parse_mode: "HTML", reply_markup: mainMenu() });
    return NextResponse.json({ ok: true });
  }

  // Сообщение от самого владельца — не пересылаем (это его notifications-чат)
  if (OWNER && String(chatId) === String(OWNER)) {
    await tg("sendMessage", { chat_id: chatId, text: "Це службовий бот заявок. /menu — показати меню.", reply_markup: mainMenu() });
    return NextResponse.json({ ok: true });
  }

  // Любой текст от клиента → пересылаем владельцу как заявку
  if (text) {
    const from = msg.from;
    const who = from ? `${escapeHtml(from.first_name || "")} ${from.last_name ? escapeHtml(from.last_name) : ""}`.trim() : "Невідомо";
    const uname = from?.username ? `@${from.username}` : "—";
    if (OWNER) {
      await tg("sendMessage", {
        chat_id: OWNER,
        parse_mode: "HTML",
        text:
          `💬 <b>Повідомлення боту</b>\n\n` +
          `👤 ${who}\n📩 ${uname} (id: <code>${from?.id}</code>)\n\n` +
          `${escapeHtml(text)}`,
      });
    }
    await tg("sendMessage", {
      chat_id: chatId,
      parse_mode: "HTML",
      text: "Дякуємо! Ваше повідомлення отримано — ми звʼяжемося з вами найближчим часом 🙌",
      reply_markup: mainMenu(),
    });
  }

  return NextResponse.json({ ok: true });
}

// --- Типы Telegram (минимальные) ---
type TgUser = { id: number; first_name?: string; last_name?: string; username?: string };
type TgChat = { id: number; type: string };
type TgMessage = { chat: TgChat; from?: TgUser; text?: string };
type TgCallback = { id: string; data?: string; message?: TgMessage };
type TgUpdate = { message?: TgMessage; callback_query?: TgCallback };
