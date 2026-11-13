import { renderToString } from "react-dom/server";
import App from "./App";
import { hero } from "./data/content";
import { structuredData } from "./structured-data";

export function prerender(template: string) {
  const schema = JSON.stringify(structuredData).replaceAll("<", "\\u003c");

  return template
    .replace("<!-- hero-preload -->", () =>
      `<link rel="preload" as="image" href="${hero.mobileAvif}" type="image/avif" media="(max-width: 860px)" fetchpriority="high">
    <link rel="preload" as="image" href="${hero.avif}" type="image/avif" media="(width > 860px)" fetchpriority="high">`)
    .replace("<!-- structured-data -->", () => `<script type="application/ld+json">${schema}</script>`)
    .replace("<!-- landing -->", () => renderToString(<App />));
}
