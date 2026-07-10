import { test, expect } from "@playwright/test";

test.describe("Tools hub", () => {
  test("loads with a card for each tool", async ({ page }) => {
    await page.goto("/tools");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Pick your tool");
    await expect(page.getByRole("link", { name: /API Tester/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Webhook Debugger/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /JWT Decoder/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Timestamp Converter/ })).toBeVisible();
  });

  test("clicking the JWT Decoder card navigates to /jwt", async ({ page }) => {
    await page.goto("/tools");
    await page.getByRole("link", { name: /JWT Decoder/ }).click();
    await expect(page).toHaveURL(/\/jwt$/);
  });

  test("clicking the Timestamp Converter card navigates to /timestamp", async ({ page }) => {
    await page.goto("/tools");
    await page.getByRole("link", { name: /Timestamp Converter/ }).click();
    await expect(page).toHaveURL(/\/timestamp$/);
  });

  test("clicking the API Tester card navigates to /tester", async ({ page }) => {
    await page.goto("/tools");
    await page.getByRole("link", { name: /API Tester/ }).click();
    await expect(page).toHaveURL(/\/tester$/);
  });

  test("clicking the Webhook Debugger card navigates to /webhooks", async ({ page }) => {
    await page.goto("/tools");
    await page.getByRole("link", { name: /Webhook Debugger/ }).click();
    await expect(page).toHaveURL(/\/webhooks$/);
  });

  test("nav Tools link stays marked current while inside either tool", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/tester");
    const toolsLink = page.locator("header nav").getByRole("link", { name: "Tools" });
    await expect(toolsLink).toHaveAttribute("aria-current", "page");

    await page.goto("/webhooks");
    await expect(toolsLink).toHaveAttribute("aria-current", "page");

    await page.goto("/jwt");
    await expect(toolsLink).toHaveAttribute("aria-current", "page");

    await page.goto("/timestamp");
    await expect(toolsLink).toHaveAttribute("aria-current", "page");

    await page.goto("/about");
    await expect(page.locator("header nav").getByRole("link", { name: "Tools" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
