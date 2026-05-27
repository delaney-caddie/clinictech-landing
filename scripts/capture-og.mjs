import { chromium } from "playwright";
import { resolve } from "node:path";

const URL = process.env.OG_URL ?? "http://localhost:3001";
const OUT = resolve(process.cwd(), "app/opengraph-image.png");

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  // give the hero animation a moment
  await page.waitForTimeout(900);
  await page.screenshot({ path: OUT, type: "png", fullPage: false });
  await browser.close();
  console.log(`wrote ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
