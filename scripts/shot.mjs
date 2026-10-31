import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.SHOT_BASE || "http://localhost:3000";
const route = process.argv[2] || "/";
const selector = process.argv[3] || "body";
const points = [0, 0.2, 0.4, 0.6, 0.8, 1];
const viewports = [
  { width: 1440, height: 900, name: "1440" },
  { width: 390, height: 844, name: "390" },
];

const slug = (route === "/" ? "home" : route.replace(/^\//, "").replace(/[^\w]+/g, "-")) || "page";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on("console", (msg) => {
  const type = msg.type();
  if (type === "error" || type === "warning") {
    console.log(`[console.${type}] ${msg.text()}`);
  }
});
page.on("pageerror", (error) => {
  console.log(`[pageerror] ${error.message}`);
});

await mkdir("/tmp/shots", { recursive: true });

for (const viewport of viewports) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  console.log(`[nav] ${viewport.name} ${route} status=${response?.status() ?? "none"}`);
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await Promise.all(
      [...document.images].map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              })
      )
    );
  });

  for (const progress of points) {
    await page.evaluate(
      ({ selector: target, progress: amount }) => {
        const el = document.querySelector(target) || document.scrollingElement;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const span = Math.max(el.scrollHeight - window.innerHeight, 0);
        window.scrollTo(0, top + span * amount);
      },
      { selector, progress }
    );
    await page.waitForTimeout(250);
    const file = `/tmp/shots/${slug}-${viewport.name}-p${Math.round(progress * 100)}.png`;
    await page.screenshot({ path: file });
    console.log(`[shot] ${file}`);
  }
}

await browser.close();
