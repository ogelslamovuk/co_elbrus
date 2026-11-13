import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const { values } = parseArgs({ options: { outDir: { type: "string", default: "dist" } } });
const outDir = resolve(values.outDir);
const tempDir = resolve("node_modules/.tmp");

await build({ build: { outDir } });
await mkdir(tempDir, { recursive: true });
const serverDir = await mkdtemp(resolve(tempDir, "prerender-"));
try {
  await build({
    build: {
      ssr: "src/prerender.tsx",
      outDir: serverDir,
      copyPublicDir: false,
    },
  });

  const { prerender } = await import(pathToFileURL(resolve(serverDir, "prerender.js")));
  const index = resolve(outDir, "index.html");
  const template = await readFile(index, "utf8");
  await writeFile(index, prerender(template), "utf8");
} finally {
  await rm(serverDir, { recursive: true, force: true });
}
