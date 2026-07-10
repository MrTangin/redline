import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("desktop/laptop widths show the inline nav, not the hamburger", async ({ page }) => {
    // Deliberately above the xl (1280px) breakpoint with margin, so this
    // isn't sitting exactly on the boundary — the hamburger must not show
    // on ordinary laptop-sized windows, only genuinely narrow ones.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.locator("header nav")).toBeVisible();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  });

  test("hamburger appears just below the desktop breakpoint", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto("/");
    await expect(page.locator("header nav")).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  test("mobile hamburger opens a full-screen panel with every link", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.locator("header nav")).toBeHidden();
    const trigger = page.getByRole("button", { name: "Open menu" });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByRole("dialog");
    await expect(panel).toBeVisible();
    for (const label of ["Tools", "About", "Contact"]) {
      await expect(panel.getByRole("link", { name: label })).toBeVisible();
    }
    await expect(panel.getByRole("link", { name: "Start testing" })).toBeVisible();

    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(panel).toBeHidden();
  });

  test("mobile menu link navigates and the panel closes itself", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("Escape key closes the mobile panel", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
