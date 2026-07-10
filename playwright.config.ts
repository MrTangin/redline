import { defineConfig, devices } from "@playwright/test";

const PORT = 3020;
const baseURL = `http://localhost:${PORT}`;

/**
 * Runs the full suite against a production build (`next build && next
 * start`), not `next dev` — Turbopack's on-demand dev compilation makes
 * first-hit timings meaningless, and this is the build that actually ships.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm run build && pnpm exec next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
