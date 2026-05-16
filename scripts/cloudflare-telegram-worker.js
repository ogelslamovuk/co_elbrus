export default {
  async fetch(request, env) {
    const corsHeaders = buildCorsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed" }, 405, corsHeaders);
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return jsonResponse({ ok: false, error: "Expected application/json" }, 415, corsHeaders);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: "Invalid JSON" }, 400, corsHeaders);
    }

    const text = buildTelegramText(payload);
    const token = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return jsonResponse({ ok: false, error: "Telegram credentials are not configured" }, 500, corsHeaders);
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      return jsonResponse({ ok: false, error: errorText }, 502, corsHeaders);
    }

    return jsonResponse({ ok: true }, 200, corsHeaders);
  },
};

function buildCorsHeaders(request, env) {
  const origin = request.headers.get("origin") || "";
  const allowedOrigin = env.ALLOWED_ORIGIN || "*";
  const responseOrigin = allowedOrigin === "*" || origin === allowedOrigin ? allowedOrigin === "*" ? "*" : origin : allowedOrigin;

  return {
    "Access-Control-Allow-Origin": responseOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function jsonResponse(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function buildTelegramText(payload) {
  const name = clean(payload.name) || "не указано";
  const contact = clean(payload.contact) || "не указано";
  const date = clean(payload.date) || "не указано";
  const guests = clean(payload.guests) || "не указано";
  const message = clean(payload.message) || "не указано";
  const page = clean(payload.page) || "не указано";

  return [
    "<b>Новая заявка с сайта Эльбруса</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон / мессенджер:</b> ${escapeHtml(contact)}`,
    `<b>Дата поездки:</b> ${escapeHtml(date)}`,
    `<b>Сколько человек:</b> ${escapeHtml(guests)}`,
    `<b>Что хочется посмотреть:</b> ${escapeHtml(message)}`,
    "",
    `<b>Страница:</b> ${escapeHtml(page)}`,
  ].join("\n");
}

function clean(value) {
  return String(value || "").trim().slice(0, 1500);
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
