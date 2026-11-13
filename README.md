# Эльбрус — водитель и проводник по Северной Осетии

Одностраничный сайт Эльбруса, местного водителя и проводника по Северной Осетии-Алании. Визуальная концепция — Mountain Road Trip Notebook.

Адрес сайта — [alania.fun](https://alania.fun/).

## Локальный запуск и сборка

Используй Node.js 24, как в GitHub Actions.

```bash
npm ci
npm run dev
npm run build
npm run preview
npm run smoke -- http://localhost:4173/
```

Сборка генерирует HTML и JSON-LD из компонентов и данных React. В браузере React подключает интерактивность к готовой странице. При отключённом JavaScript доступны контент, телефон и WhatsApp. Vite использует `base: "./"`. GitHub Pages публикует `dist` в корне `alania.fun`.

## Деплой и откат

GitHub Pages публикует сайт через `.github/workflows/pages.yml` после изменений в `master`. Pull request в `master` проверяет сборку. Для повторной публикации запусти **Deploy GitHub Pages** из ветки `master`. Сверь SHA в Actions и запусти `npm run smoke` для проверки публичного адреса.

Для отката создай PR с отменой проблемного коммита в `master`, дождись деплоя и снова запусти smoke. При полном откате восстановления сохрани триггер workflow на `master`, чтобы отмена опубликовалась. Предыдущий артефакт был собран из `5db270f063480d364776c695f8a0eb52079a0374` в [Actions run 26033342652](https://github.com/ogelslamovuk/co_elbrus/actions/runs/26033342652).

## DNS и HTTPS

Если RDAP показывает `*.verification-hold.suspended-domain.com`, подтверди зарегистрированный контактный email у провайдера домена. После возврата исходных NS сверь A/AAAA для корня и CNAME для `www` с инструкцией GitHub. Сохрани почтовые записи и записи верификации. Оставь **Enforce HTTPS** включённым в Pages. При корректном DNS GitHub Pages выпускает и автоматически продлевает бесплатный сертификат Let's Encrypt. Команда `npm run smoke` проверяет доверенный HTTPS и редиректы с HTTP и `www` на канонический адрес. [Настройка домена в GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Форма заявки

GitHub Actions передаёт в сборку публичную переменную репозитория `VITE_LEAD_ENDPOINT`. Для разработки скопируй `.env.example` в `.env.local` и используй тестовый или перехваченный endpoint. Форма подтверждает отправку после ответа HTTP 2xx с JSON `{"ok":true}`. Без endpoint форма открывает черновик в WhatsApp, который отправляет сам посетитель.

Код действующего Cloudflare Worker находится в `scripts/cloudflare-telegram-worker.js`. Worker публикуется отдельно от GitHub Pages через существующий аккаунт Cloudflare. Храни `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в секретах Worker. Для `ALLOWED_ORIGIN` используй `https://alania.fun`. Проверяй CORS запросом OPTIONS, а контракт доставки тестируй с имитацией ответа Telegram.

## Где редактировать контент

В `src/data/content.ts` меняются:

- телефон и WhatsApp — `phoneNumber`, `contacts.phoneLabel`;
- первый экран, информация об Эльбрусе и поездке — `hero`, `about`, `unscripted`, `comfort`;
- услуги, маршруты и цены — `services`, `trips`, `prices`;
- отзывы, шаги бронирования и ответы на вопросы — `reviews`, `bookingSteps`, `faq`.

В `trips[].price` и `prices.items` указывай согласованную с Эльбрусом стоимость. Старые рыночные оценки хранятся в `pricing-notes.md`.

## Изображения

Файлы для сайта лежат в `public/images`. При замене снимка обнови в `src/data/content.ts` его пути, фактические размеры JPEG и альтернативный текст. Для первого экрана используются AVIF для мобильного и широкого экрана, WebP и JPEG. Источники и лицензии указаны в `image-credits.md`.
