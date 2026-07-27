/**
 * Automated WCAG AA colour-contrast audit.
 *
 *   bun run scripts/contrast-audit.mjs            # audit the default route set
 *   bun run scripts/contrast-audit.mjs /about-us  # audit specific routes
 *
 * Loads every route against the running dev server, injects axe-core and
 * reports every text/background pairing that falls below AA. Exits 1 when
 * any violation is found so it can be wired into CI.
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:8080";

const DEFAULT_ROUTES = [
  "/",
  "/about-us",
  "/services",
  "/services/vulnerability-assessment-penetration-testing",
  "/industries",
  "/case-studies",
  "/insights",
  "/blog",
  "/compliance-explorer",
  "/security-scorecard",
  "/threat-map",
  "/cyber-news",
  "/careers",
  "/contact",
];

const routes = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_ROUTES;
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 1600 } });

let total = 0;
for (const route of routes) {
  const page = await context.newPage();
  try {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45_000 });
    await page.addScriptTag({ content: axeSource });
    const result = await page.evaluate(async () =>
      // eslint-disable-next-line no-undef
      window.axe.run(document, { runOnly: ["color-contrast", "link-in-text-block"] }),
    );

    const nodes = result.violations.flatMap((v) =>
      v.nodes.map((n) => ({ rule: v.id, target: n.target.join(" "), why: n.failureSummary })),
    );
    total += nodes.length;

    if (nodes.length === 0) {
      console.log(`PASS  ${route}`);
    } else {
      console.log(`FAIL  ${route}  (${nodes.length})`);
      for (const n of nodes) {
        console.log(`   • [${n.rule}] ${n.target}`);
        console.log(`     ${String(n.why).replace(/\n/g, "\n     ")}`);
      }
    }
  } catch (err) {
    total += 1;
    console.log(`ERROR ${route}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(`\n${total === 0 ? "All routes meet WCAG AA contrast." : `${total} contrast issue(s).`}`);
process.exit(total === 0 ? 0 : 1);
