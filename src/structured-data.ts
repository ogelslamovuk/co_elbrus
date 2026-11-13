import { contacts, faq, hero, siteUrl } from "./data/content";

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${siteUrl}#service`,
      "name": hero.title,
      "description": "Поездки по Северной Осетии с местным водителем: Фиагдон, Даргавс, Кармадон, горы, трансферы и индивидуальные маршруты до 4 человек.",
      "areaServed": [
        "Республика Северная Осетия — Алания",
        "Владикавказ",
        "Верхний Фиагдон",
        "Даргавс",
        "Кармадон",
        "Мамисон",
        "Минеральные Воды"
      ],
      "serviceType": [
        "Индивидуальные экскурсии",
        "Поездки в горы",
        "Трансферы",
        "Маршруты по Северной Осетии"
      ],
      "provider": {
        "@type": "Person",
        "name": "Эльбрус",
        "telephone": contacts.phoneHref.slice(4)
      },
      "url": siteUrl
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}#faq`,
      mainEntity: faq.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}#breadcrumbs`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "alania.fun — поездки по Северной Осетии",
          "item": siteUrl
        }
      ]
    },
  ],
};
