import { test, expect } from "@playwright/test";

test.describe("Webhook Debugger landing", () => {
  test("loads with heading and create action", async ({ page }) => {
    await page.goto("/webhooks");
    await expect(page.getByRole("heading", { name: "Webhook Debugger" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create a new inbox" })).toBeVisible();
  });

  test("visiting an unknown inbox id shows a not-found state, not a crash", async ({ page }) => {
    await page.goto("/webhooks/00000000-0000-0000-0000-000000000000");
    await expect(page.getByText(/doesn.t exist or was deleted/i)).toBeVisible({ timeout: 10000 });
    await page.getByRole("link", { name: /Back to Webhook Debugger/i }).click();
    await expect(page).toHaveURL(/\/webhooks$/);
  });

  test("has no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/webhooks", { waitUntil: "networkidle" });
    expect(errors, `Console errors: ${errors.join("\n")}`).toEqual([]);
  });
});
