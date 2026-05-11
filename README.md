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

Контакты сейчас заведены как заменяемые значения-заглушки, потому что реальные номер WhatsApp, Telegram и телефон не были переданы в исходной задаче.

## Изображения

Изображения лежат в `public/images`.

- `elbrus-portrait-1.jpg`, `elbrus-portrait-2.jpg` — локальные фото Эльбруса из проекта;
- остальные изображения — пейзажи Северной Осетии с Wikimedia Commons.

Источники и лицензии указаны в `image-credits.md`.

## Цены

Ориентиры по стоимости редактируются в `src/data/content.ts`.

Логика и источники для стартовых значений указаны в `pricing-notes.md`. Финальные цены должен подтвердить Эльбрус перед активным продвижением сайта.
