import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Check,
  Clock3,
  Compass,
  MapPin,
  MessageCircle,
  Mountain,
  Navigation,
  Phone,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";
import {
  about,
  bookingSteps,
  comfort,
  contacts,
  faq,
  faqTitle,
  formSuccess,
  hero,
  prices,
  reviews,
  services,
  trips,
  tripsIntro,
  unscripted,
  whatsappLink,
} from "./data/content";
import { trackGoal } from "./analytics";

const serviceIcons = [Navigation, Mountain, Route, CarFront, Compass];
const comfortIcons = [Users, Sparkles, ShieldCheck, CarFront, Clock3, Route, CalendarDays];
const leadEndpoint = import.meta.env.VITE_LEAD_ENDPOINT?.trim();
const leadTimeoutMs = 12_000;

type RequestStatus = "idle" | "sending" | "success" | "error";

const formValue = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

function Photo({ image, alt }: { image: typeof hero.image; alt: string }) {
  return (
    <picture>
      <source srcSet={image.webp} type="image/webp" />
      <img src={image.jpg} width={image.width} height={image.height} alt={alt} loading="lazy" decoding="async" />
    </picture>
  );
}

function App() {
  const [ready, setReady] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [requestMessage, setRequestMessage] = useState("");
  const sending = useRef(false);

  useEffect(() => setReady(true), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formValue(formData, "name"),
      contact: formValue(formData, "contact"),
      date: formValue(formData, "date"),
      guests: formValue(formData, "guests"),
      message: formValue(formData, "message"),
      source: "co_elbrus_landing",
      page: window.location.origin + window.location.pathname,
    };

    if (!payload.name || !payload.contact) {
      setRequestStatus("error");
      setRequestMessage("Укажите имя и контакт для связи.");
      return;
    }

    if (!leadEndpoint) {
      setRequestStatus("idle");
      setRequestMessage("");
      const details = [
        "Эльбрус, здравствуйте! Хочу обсудить поездку по Осетии.",
        `Имя: ${payload.name}`,
        `Контакт: ${payload.contact}`,
        payload.date && `Дата: ${payload.date}`,
        payload.guests && `Гостей: ${payload.guests}`,
        payload.message && `Пожелания: ${payload.message}`,
      ];
      trackGoal("click_whatsapp");
      window.open(whatsappLink(details.filter(Boolean).join("\n")), "_blank", "noopener,noreferrer");
      return;
    }

    sending.current = true;
    setRequestStatus("sending");
    setRequestMessage("");

    try {
      const response = await fetch(leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(leadTimeoutMs),
      });
      if (!response.ok || (await response.json())?.ok !== true) {
        throw new Error("Unconfirmed lead delivery");
      }
      setRequestStatus("success");
      setRequestMessage(formSuccess);
      form.reset();
      trackGoal("submit_form");
    } catch {
      setRequestStatus("error");
      setRequestMessage("Не удалось подтвердить отправку. Напишите Эльбрусу в WhatsApp или позвоните ему.");
    } finally {
      sending.current = false;
    }
  };

  return (
    <main>
      <section className="hero">
        <picture className="hero__photo">
          <source media="(max-width: 860px)" type="image/avif" srcSet={hero.mobileAvif} />
          <source type="image/avif" srcSet={hero.avif} />
          <source media="(max-width: 860px)" type="image/webp" srcSet={hero.mobileWebp} />
          <source type="image/webp" srcSet={hero.image.webp} />
          <img src={hero.image.jpg} width={hero.image.width} height={hero.image.height} alt="" fetchPriority="high" />
        </picture>
        <div className="hero__shade" />
        <nav className="nav" aria-label="Главная навигация">
          <a href="#about" className="nav__brand">
            Эльбрус
          </a>
          <div className="nav__links">
            <a href="#trips">Маршруты</a>
            <a href="#prices">Стоимость</a>
            <a href="#contacts">Контакты</a>
          </div>
        </nav>

        <div className="hero__content">
          <p className="eyebrow">
            <MapPin size={18} />
            Старт из Владикавказа / Северная Осетия
          </p>
          <h1>{hero.title}</h1>
          <p className="hero__subtitle">{hero.subtitle}</p>

          <div className="actions" aria-label="Связаться с Эльбрусом">
            <a
              className="button button--primary"
              href={contacts.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGoal("click_whatsapp")}
            >
              <MessageCircle size={20} />
              Написать в WhatsApp
            </a>
            <a
              className="button button--secondary"
              href={contacts.phoneHref}
              onClick={() => trackGoal("click_phone")}
            >
              <Phone size={20} />
              Позвонить
            </a>
          </div>

          <div className="hero__badges" aria-label="Кратко о поездках">
            {hero.badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>

        <div className="route-map" aria-hidden="true">
          <span className="route-map__label">Владикавказ → горы</span>
          <svg viewBox="0 0 440 220">
            <path
              d="M22 166 C 82 74, 137 195, 202 112 S 310 42, 404 78"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeDasharray="12 12"
              strokeLinecap="round"
            />
            <circle cx="22" cy="166" r="8" />
            <circle cx="202" cy="112" r="8" />
            <circle cx="404" cy="78" r="8" />
          </svg>
          <span className="route-map__note route-map__note--one">тут остановимся</span>
          <span className="route-map__note route-map__note--two">вид ради рассвета</span>
        </div>
      </section>

      <section className="section section--about" id="about">
        <div className="section__grid section__grid--about">
          <div>
            <p className="section-kicker">Кто такой Эльбрус</p>
            <h2>{about.title}</h2>
            {about.paragraphs.map((paragraph) => (
              <p className="lead" key={paragraph}>
                {paragraph}
              </p>
            ))}
            <div className="fact-list">
              {about.facts.map((fact) => (
                <span key={fact}>
                  <Check size={17} />
                  {fact}
                </span>
              ))}
            </div>
          </div>

          <div className="portrait-stack" aria-label="Фотографии Эльбруса">
            <figure className="portrait-card portrait-card--front">
              <Photo image={about.portraits[0]} alt="Эльбрус, местный водитель и проводник по Осетии" />
              <figcaption>местный / Верхний Фиагдон</figcaption>
            </figure>
            <figure className="portrait-card portrait-card--back">
              <Photo image={about.portraits[1]} alt="Эльбрус в поездке по Северной Осетии" />
              <figcaption>свой человек в Осетии</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section section--services">
        <div className="section__header">
          <p className="section-kicker">Форматы</p>
          <h2>Экскурсии, поездки в горы и трансферы из Владикавказа</h2>
        </div>
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = serviceIcons[index];
            return (
              <article className="service-card" key={service.title}>
                <Icon size={26} />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section section--trips" id="trips">
        <div className="section__header section__header--wide">
          <p className="section-kicker">Маршрутный блокнот</p>
          <h2>Популярные маршруты по Северной Осетии</h2>
          <p>{tripsIntro}</p>
        </div>
        <div className="trip-grid">
          {trips.map((trip) => (
            <article className="trip-card" key={trip.title}>
              <Photo image={trip.image} alt={trip.imageAlt} />
              <div className="trip-card__body">
                <span className="note-label">{trip.note}</span>
                <h3>{trip.title}</h3>
                <p>{trip.text}</p>
                <dl>
                  <div>
                    <dt>Формат</dt>
                    <dd>{trip.format}</dd>
                  </div>
                  <div>
                    <dt>Стоимость</dt>
                    <dd>{trip.price}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--notebook">
        <div className="notebook-copy">
          <p className="section-kicker">Не экскурсия по бумажке</p>
          <h2>{unscripted.title}</h2>
          {unscripted.paragraphs.map((paragraph) => (
            <p className="lead" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="notes-cloud" aria-label="Заметки на маршруте">
          {unscripted.notes.map((note, index) => (
            <span key={note} style={{ "--tilt": `${index % 2 === 0 ? -2 : 2}deg` } as React.CSSProperties}>
              {note}
            </span>
          ))}
        </div>
      </section>

      <section className="section section--comfort">
        <div className="comfort-visual" aria-hidden="true">
          <div className="car-sketch">
            <div className="car-sketch__body" />
            <div className="car-sketch__top" />
            <span className="wheel wheel--left" />
            <span className="wheel wheel--right" />
          </div>
          <span className="sticker sticker--seats">4 места</span>
          <span className="sticker sticker--route">Владикавказ → горы</span>
        </div>
        <div>
          <p className="section-kicker">Машина и темп</p>
          <h2>{comfort.title}</h2>
          <p className="lead">{comfort.text}</p>
          <div className="comfort-list">
            {comfort.facts.map((fact, index) => {
              const Icon = comfortIcons[index];
              return (
                <span key={fact}>
                  <Icon size={18} />
                  {fact}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--prices" id="prices">
        <div className="section__header">
          <p className="section-kicker">Без скрытого официоза</p>
          <h2>{prices.title}</h2>
          <p>{prices.text}</p>
        </div>
        <div className="price-grid">
          {prices.items.map(([label, value]) => (
            <article className="price-card" key={label}>
              <WalletCards size={24} />
              <h3>{label}</h3>
              <p>{value}</p>
            </article>
          ))}
        </div>
        <p className="price-note">{prices.note}</p>
      </section>

      <section className="section section--reviews">
        <div className="section__header">
          <p className="section-kicker">После дороги</p>
          <h2>После поездки обычно возвращаются</h2>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.name}>
              <p>{review.text}</p>
              <h3>
                {review.name}, <span>{review.city}</span>
              </h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--steps">
        <div className="section__header">
          <p className="section-kicker">Как поехать</p>
          <h2>Как поехать</h2>
        </div>
        <div className="steps-grid">
          {bookingSteps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <span>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--faq" id="faq">
        <div className="section__header section__header--wide">
          <p className="section-kicker">Вопросы перед поездкой</p>
          <h2>{faqTitle}</h2>
        </div>
        <div className="faq-list">
          {faq.map((item) => (
            <article className="faq-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--contacts" id="contacts">
        <div className="contact-copy">
          <p className="section-kicker">Контакты</p>
          <h2>Напишите Эльбрусу, когда приезжаете во Владикавказ и что хотите увидеть</h2>
          <div className="actions actions--dark">
            <a
              className="button button--primary"
              href={contacts.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGoal("click_whatsapp")}
            >
              <MessageCircle size={20} />
              WhatsApp
            </a>
            <a className="button button--ghost" href={contacts.phoneHref} onClick={() => trackGoal("click_phone")}>
              <Phone size={20} />
              {contacts.phoneLabel}
            </a>
          </div>
          <p className="lead">
            Быстрее всего договориться напрямую: Эльбрус подскажет маршрут, время выезда, остановки и честный ориентир по стоимости.
          </p>
        </div>

        <form className="request-form" method="post" onSubmit={handleSubmit}>
          <label>
            Имя
            <input name="name" type="text" placeholder="Как к вам обращаться" autoComplete="name" maxLength={120} required />
          </label>
          <label>
            Телефон или мессенджер
            <input name="contact" type="text" placeholder="+7 ... / @telegram" maxLength={120} required />
          </label>
          <label>
            Дата поездки
            <input name="date" type="date" />
          </label>
          <label>
            Сколько человек
            <input name="guests" type="number" min="1" max="4" placeholder="2" />
          </label>
          <label className="request-form__wide">
            Что хочется посмотреть
            <textarea name="message" rows={5} maxLength={1500} placeholder="Горы, Фиагдон, Даргавс, рассвет, спокойный день..." />
          </label>
          <button className="button button--primary request-form__wide" type="submit" disabled={!ready || requestStatus === "sending"}>
            <ArrowRight size={20} />
            {requestStatus === "sending" ? "Отправляем..." : leadEndpoint ? "Отправить заявку" : "Открыть WhatsApp"}
          </button>
          <p
            className={`form-success request-form__wide${requestStatus === "error" ? " form-success--error" : ""}`}
            role="status"
          >
            {requestMessage}
          </p>
        </form>
      </section>
    </main>
  );
}

export default App;
