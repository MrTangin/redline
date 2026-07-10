import { test, expect } from "@playwright/test";

test.describe("Behind the Scenes", () => {
  test("loads with heading and a working table of contents", async ({ page }) => {
    await page.goto("/behind-the-scenes");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "How Redline is actually built",
    );

    const toc = page.getByRole("navigation", { name: "On this page" });
    await expect(toc).toBeVisible();
    await expect(toc.getByRole("link", { name: "Security model" })).toHaveAttribute(
      "href",
      "#security",
    );
  });

  test("clicking a TOC item scrolls its section into view", async ({ page }) => {
    await page.goto("/behind-the-scenes");
    const toc = page.getByRole("navigation", { name: "On this page" });
    await toc.getByRole("link", { name: "Testing" }).click();
    await expect(page).toHaveURL(/#testing$/);
    await expect(page.locator("#testing")).toBeInViewport();
  });

  test("footer links to the page", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator("footer").getByRole("link", { name: "Behind the Scenes" }),
    ).toHaveAttribute("href", "/behind-the-scenes");
  });

  test("never mentions the template this app started from, or internal ops details", async ({
    page,
  }) => {
    await page.goto("/behind-the-scenes");
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    for (const banned of ["nextpearljs", "starter template", "leftover", "test bin"]) {
      expect(bodyText, `page should not mention "${banned}"`).not.toContain(banned);
    }
  });
});
