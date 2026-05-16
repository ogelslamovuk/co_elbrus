# Эльбрус — водитель и проводник по Северной Осетии

Одностраничный landing page для Эльбруса: местного водителя и личного проводника по Северной Осетии-Алании. Сайт собран как современный travel landing с визуальной идеей Mountain Road Trip Notebook.

Опубликованный адрес:

https://ogelslamovuk.github.io/co_elbrus/

## Локальный запуск

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Vite настроен с обязательным base path:

```ts
base: "/co_elbrus/"
```

## Deploy

Деплой настроен через GitHub Actions: `.github/workflows/pages.yml`.

После push в `main` workflow собирает `dist` и публикует его в GitHub Pages. Если Pages в настройках репозитория ещё не переключён на GitHub Actions, нужно один раз открыть:

`Settings → Pages → Source → GitHub Actions`

## Заявки из формы в Telegram

Форма на сайте отправляет заявку на endpoint из переменной сборки:

```bash
VITE_LEAD_ENDPOINT
```

Токен Telegram-бота нельзя хранить в frontend или в публичном репозитории. Для отправки заявок добавлен пример Cloudflare Worker:

```text
scripts/cloudflare-telegram-worker.js
```

Worker принимает заявку с сайта и отправляет сообщение в Telegram через Bot API. Креды хранятся только в секретах Cloudflare Worker:

- `TELEGRAM_BOT_TOKEN` — токен бота от BotFather;
- `TELEGRAM_CHAT_ID` — ID чата, куда приходят заявки;
- `ALLOWED_ORIGIN` — домен сайта, например `https://ogelslamovuk.github.io` или будущий домен.

После публикации Worker нужно добавить URL Worker в GitHub Actions variable:

`Settings → Secrets and variables → Actions → Variables → New repository variable`

Имя:

```text
VITE_LEAD_ENDPOINT
```

Значение: URL опубликованного Worker.

После этого нужно запустить деплой заново или сделать push в `main`.

## Где редактировать контент

Основной редактируемый контент лежит в `src/data/content.ts`.

В этом файле меняются:

- телефон, WhatsApp и Telegram: `contacts`;
- hero, тексты и CTA: `hero`, `about`, `unscripted`, `comfort`;
- услуги: `services`;
- маршруты и цены в карточках поездок: `trips`;
- общие ориентиры по стоимости: `prices`;
- отзывы: `reviews`;
- шаги бронирования: `bookingSteps`.

## Изображения

Изображения лежат в `public/images`.

- `elbrus-portrait-1.jpg`, `elbrus-portrait-2.jpg` — локальные фото Эльбруса из проекта;
- остальные изображения — пейзажи Северной Осетии с Wikimedia Commons.

Источники и лицензии указаны в `image-credits.md`.

## Цены

Ориентиры по стоимости редактируются в `src/data/content.ts`.

Логика и источники для стартовых значений указаны в `pricing-notes.md`. Финальные цены должен подтвердить Эльбрус перед активным продвижением сайта.
