import assert from "node:assert/strict";

const canonical = "https://alania.fun/";
const base = new URL(process.argv[2] ?? canonical);

async function get(path, expectedType) {
  const url = new URL(path, base);
  const response = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(12_000),
  });
  assert.equal(response.status, 200, url.href);
  assert.ok(response.headers.get("content-type")?.includes(expectedType), url.href);
  console.log("200", url.href);
  return response;
}

const html = await (await get(".", "text/html")).text();
assert.ok(html.includes(`rel="canonical" href="${canonical}"`), "Missing canonical");
assert.match(html, /<html lang="ru">/);
assert.match(html, /<h1>/);
assert.match(html, /href="tel:\+\d+"/);
assert.match(html, /href="https:\/\/wa\.me\/\d+/);

const entry = html.match(/<script type="module"[^>]*src="([^"]+)"/)?.[1];
const stylesheet = html.match(/<link rel="stylesheet"[^>]*href="([^"]+)"/)?.[1];
const heroImages = [...html.matchAll(/<link\s+rel="preload"\s+as="image"\s+href="([^"]+)"/g)];
assert.ok(entry && stylesheet && heroImages.length > 0, "Missing entry assets");
const urls = [
  [entry, "javascript"],
  [stylesheet, "text/css"],
  ...heroImages.map(([, path]) => [path, "image/avif"]),
  ["favicon.svg", "image/svg+xml"],
  ["robots.txt", "text/plain"],
  ["sitemap.xml", "xml"],
];
await Promise.all(urls.map(async ([path, type]) => {
  const asset = await get(path, type);
  await asset.body?.cancel();
}));

if (base.href === canonical) {
  for (const source of ["http://alania.fun/", "https://www.alania.fun/"]) {
    const response = await fetch(source, { signal: AbortSignal.timeout(12_000) });
    assert.equal(response.status, 200, source);
    assert.ok(response.redirected, source);
    assert.equal(response.url, canonical, source);
    await response.body?.cancel();
    console.log(source, "->", response.url);
  }
}
