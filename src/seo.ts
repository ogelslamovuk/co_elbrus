import { faq } from "./data/content";

const siteUrl = "https://alania.fun/";
const serviceName = "Индивидуальная поездка по горной Осетии";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${siteUrl}#service`,
  name: serviceName,
  description:
    "Индивидуальная поездка по Северной Осетии с местным водителем: горы, ущелья, древние селения, видовые остановки и спокойный маршрут без автобуса и туристической гонки.",
  areaServed: [
    "Республика Северная Осетия — Алания",
    "Владикавказ",
    "Верхний Фиагдон",
    "Даргавс",
    "Кармадон",
    "Мамисон",
    "Минеральные Воды",
  ],
  serviceType: [
    "Индивидуальные поездки",
    "Экскурсии по Северной Осетии",
    "Поездки в горы",
    "Трансферы",
  ],
  provider: {
    "@type": "Person",
    name: "Эльбрус",
    telephone: "+79194237517",
  },
  url: siteUrl,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${siteUrl}#faq`,
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${siteUrl}#breadcrumb`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "alania.fun — поездки по горной Осетии",
      item: siteUrl,
    },
  ],
};

export const jsonLdSchemas = [serviceSchema, faqSchema, breadcrumbSchema];
