import { test, expect } from "@playwright/test";

const PAGES = ["/", "/tester", "/webhooks"];

for (const path of PAGES) {
  test(`performance: ${path || "/"} loads within budget`, async ({ page }) => {
    const start = Date.now();
    await page.goto(path, { waitUntil: "load" });
    const wallClockMs = Date.now() - start;

    const timing = await page.evaluate(() => {
      const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      return {
        ttfb: nav.responseStart - nav.requestStart,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        load: nav.loadEventEnd - nav.startTime,
        transferSize: nav.transferSize,
      };
    });

    console.log(
      `[perf] ${path} wallClock=${wallClockMs}ms ttfb=${timing.ttfb.toFixed(0)}ms ` +
        `dcl=${timing.domContentLoaded.toFixed(0)}ms load=${timing.load.toFixed(0)}ms ` +
        `transfer=${(timing.transferSize / 1024).toFixed(1)}kB`,
    );

    // Generous budgets against a local production build — this is a
    // regression smoke check, not a strict performance gate.
    expect(timing.load, `${path} load event`).toBeLessThan(6000);
    expect(timing.ttfb, `${path} time to first byte`).toBeLessThan(2000);
  });
}
