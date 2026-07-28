/**
 * Ongoing performance check.
 *
 * Loads key routes in headless Chromium, records Core Web Vitals style
 * metrics (TTFB, FCP, LCP, CLS, long-task blocking time) plus JS/CSS transfer
 * weight, and fails when a budget is exceeded.
 *
 *   node scripts/perf-audit.mjs                 # audits http://localhost:8080
 *   node scripts/perf-audit.mjs --url=https://… # audits a deployed URL
 *   node scripts/perf-audit.mjs --json          # machine readable output
 */
import { chromium } from "playwright";
import { existsSync, readdirSync } from "node:fs";

/** Use a locally installed Chromium when Playwright's own download is absent. */
function findChromium() {
  if (process.env.PERF_CHROMIUM_PATH) return process.env.PERF_CHROMIUM_PATH;
  for (const root of ["/", "/opt", "/usr/lib"]) {
    let entries = [];
    try {
      entries = readdirSync(root);
    } catch {
      continue;
    }
    for (const dir of entries.filter((d) => d.startsWith("chromium-"))) {
      const bin = `${root === "/" ? "" : root}/${dir}/chrome-linux/chrome`;
      if (existsSync(bin)) return bin;
    }
  }
  for (const bin of ["/usr/bin/chromium", "/usr/bin/google-chrome"]) {
    if (existsSync(bin)) return bin;
  }
  return undefined;
}

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const BASE = (arg("url", process.env.PERF_BASE_URL ?? "http://localhost:8080")).replace(/\/$/, "");
const AS_JSON = args.includes("--json");
const ROUTES = (arg("routes", "/,/services,/industries,/contact,/blog")).split(",");

/** Budgets — tighten these as the site gets faster. */
const BUDGETS = {
  ttfb: 800, // ms
  fcp: 2000, // ms
  lcp: 2800, // ms
  cls: 0.1,
  blockingTime: 400, // ms of long-task time after FCP
  jsBytes: 900_000, // transferred JS per route
  cssBytes: 180_000, // transferred CSS per route
};

async function auditRoute(browser, path) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const bytes = { js: 0, css: 0, img: 0, other: 0 };
  page.on("response", async (res) => {
    try {
      const type = res.request().resourceType();
      const len = Number(res.headers()["content-length"] ?? 0);
      const key = type === "script" ? "js" : type === "stylesheet" ? "css" : type === "image" ? "img" : "other";
      bytes[key] += len;
    } catch {
      /* ignore */
    }
  });

  await page.addInitScript(() => {
    window.__perf = { lcp: 0, cls: 0, blocking: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__perf.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__perf.blocking += Math.max(0, e.duration - 50);
    }).observe({ type: "longtask", buffered: true });
  });

  const url = `${BASE}${path}`;
  await page.goto(url, { waitUntil: "load", timeout: 60_000 });
  await page.waitForTimeout(2500);

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    return {
      ttfb: nav ? Math.round(nav.responseStart) : 0,
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : 0,
      fcp: fcp ? Math.round(fcp.startTime) : 0,
      lcp: Math.round(window.__perf.lcp),
      cls: Number(window.__perf.cls.toFixed(3)),
      blockingTime: Math.round(window.__perf.blocking),
    };
  });

  await context.close();
  return { path, ...metrics, jsBytes: bytes.js, cssBytes: bytes.css, imgBytes: bytes.img };
}

const fmtKb = (n) => `${Math.round(n / 1024)}kb`;

const browser = await chromium.launch({ headless: true, executablePath: findChromium() });
const results = [];
for (const path of ROUTES) results.push(await auditRoute(browser, path));
await browser.close();

const failures = [];
for (const r of results) {
  for (const [key, budget] of Object.entries(BUDGETS)) {
    if (r[key] > budget) failures.push(`${r.path}: ${key} = ${r[key]} (budget ${budget})`);
  }
}

if (AS_JSON) {
  console.log(JSON.stringify({ base: BASE, budgets: BUDGETS, results, failures }, null, 2));
} else {
  console.log(`\nPerformance audit — ${BASE}\n`);
  console.log(
    ["route", "ttfb", "fcp", "lcp", "cls", "blocking", "js", "css"]
      .map((h) => h.padEnd(10))
      .join(""),
  );
  for (const r of results) {
    console.log(
      [
        r.path,
        `${r.ttfb}ms`,
        `${r.fcp}ms`,
        `${r.lcp}ms`,
        `${r.cls}`,
        `${r.blockingTime}ms`,
        fmtKb(r.jsBytes),
        fmtKb(r.cssBytes),
      ]
        .map((c) => String(c).padEnd(10))
        .join(""),
    );
  }
  console.log("");
  if (failures.length) {
    console.log("Budget failures:");
    for (const f of failures) console.log(`  ✗ ${f}`);
  } else {
    console.log("✓ All routes within budget");
  }
}

process.exit(failures.length ? 1 : 0);
