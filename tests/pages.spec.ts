import { test, expect } from "@playwright/test";

const STATIC_PAGES: { path: string; heading: string | RegExp }[] = [
  { path: "/about", heading: /Built for the moment/i },
  { path: "/contact", heading: "Get in touch" },
  { path: "/privacy", heading: "Privacy Policy" },
  { path: "/terms", heading: "Terms of Service" },
  { path: "/disclaimer", heading: "Disclaimer" },
  { path: "/cookies", heading: "Cookie Policy" },
  { path: "/security", heading: "Security Policy" },
];

test.describe("Static pages", () => {
  for (const { path, heading } of STATIC_PAGES) {
    test(`${path} loads with a 200 and the right heading`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    });
  }

  test("legal pages cross-link to /contact", async ({ page }) => {
    for (const path of ["/privacy", "/terms", "/disclaimer", "/cookies", "/security"]) {
      await page.goto(path);
      await expect(page.getByRole("link", { name: "Contact" }).first()).toHaveAttribute(
        "href",
        "/contact",
      );
    }
  });

  test("contact page mailto links point to the right address", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("link", { name: "hello@redline.dev" })).toHaveAttribute(
      "href",
      "mailto:hello@redline.dev",
    );
    await expect(page.getByRole("link", { name: /Bug report/i })).toHaveAttribute(
      "href",
      /^mailto:hello@redline\.dev\?subject=/,
    );
  });

  test("footer links to Product, Company, and Legal pages", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
    await expect(footer.getByRole("link", { name: "Security Policy" })).toHaveAttribute(
      "href",
      "/security",
    );
    await expect(footer.getByRole("link", { name: "About", exact: true })).toHaveAttribute(
      "href",
      "/about",
    );
  });
});
