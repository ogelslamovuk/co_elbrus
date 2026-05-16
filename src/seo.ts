import { faq } from "./data/content";

const siteUrl = "https://alania.fun/";
const serviceName = "Индивидуальные экскурсии по Северной Осетии из Владикавказа";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: serviceName,
  description:
    "Поездки по Северной Осетии с местным водителем: Фиагдон, Даргавс, Кармадон, горы, трансферы и индивидуальные маршруты до 4 человек.",
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
    "Индивидуальные экскурсии",
    "Поездки в горы",
    "Трансферы",
    "Маршруты по Северной Осетии",
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
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: serviceName,
      item: siteUrl,
    },
  ],
};

export const jsonLdSchemas = [serviceSchema, faqSchema, breadcrumbSchema];
