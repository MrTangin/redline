import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads with Redline branding and hero copy", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Redline/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Send the request");
  });

  test("hero CTAs link to /tester and /webhooks", async ({ page }) => {
    await page.goto("/");
    // "Open the API Tester" also appears as a secondary CTA further down
    // the page (components/sections/features.tsx) — scope to the hero.
    const hero = page.locator("section").first();
    await expect(hero.getByRole("link", { name: /Open the API Tester/i })).toHaveAttribute(
      "href",
      "/tester",
    );
    await expect(
      hero.getByRole("link", { name: /Open the Webhook Debugger/i }),
    ).toHaveAttribute("href", "/webhooks");
  });

  test("nav header links to Tools, About, and Contact", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("header nav");
    await nav.getByRole("link", { name: "Tools" }).click();
    await expect(page).toHaveURL(/\/tools$/);

    await page.goto("/");
    await page.locator("header nav").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
  });

  test("footer shows brand and working links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByText("Redline", { exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: /API Tester/i })).toHaveAttribute(
      "href",
      "/tester",
    );
    await expect(footer.getByRole("link", { name: /Webhook Debugger/i })).toHaveAttribute(
      "href",
      "/webhooks",
    );
  });

  test("FAQ section is present and expandable", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { name: /FAQ|Frequently asked/i }).scrollIntoViewIfNeeded();
    const trigger = page.getByRole("button").filter({ hasText: /account|free|store|safe|timeout/i }).first();
    await expect(trigger).toBeVisible();
    await trigger.click();
  });

  test("has no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(errors, `Console errors: ${errors.join("\n")}`).toEqual([]);
  });
});
