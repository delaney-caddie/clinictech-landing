import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const MOCKUP_DIR = resolve(process.cwd(), "scripts/mockups");
const OUT_DIR = resolve(process.cwd(), "public/mockups");

// Mia uses the real app screenshot (see public/mockups/mia.png) so we skip her here.
const captures = [
  { html: "sage.html", slug: "sage" },
  { html: "atlas.html", slug: "atlas" },
  { html: "rio.html", slug: "rio" },
  { html: "home.html", slug: "home" },
  { html: "pipeline.html", slug: "pipeline" },
  { html: "patient-stories.html", slug: "patient-stories" },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  for (const { html, slug } of captures) {
    const src = resolve(MOCKUP_DIR, html);
    if (!existsSync(src)) {
      console.warn(`[skip] missing ${src}`);
      continue;
    }
    const url = `file://${src}`;
    const out = resolve(OUT_DIR, `${slug}.png`);
    console.log(`capturing ${html} -> ${out}`);
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    // wait a beat for webfont swap
    await page.waitForTimeout(600);
    await page.screenshot({ path: out, type: "png", fullPage: true });
  }

  await browser.close();
  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
