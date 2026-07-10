import { test, expect } from "@playwright/test";

test.describe("Timestamp Converter", () => {
  test("loads with a live clock and a default breakdown", async ({ page }) => {
    await page.goto("/timestamp");
    await expect(page.getByRole("heading", { name: "Timestamp Converter" })).toBeVisible();
    await expect(page.getByText("Right now (Unix seconds)")).toBeVisible();
    await expect(page.getByText("Unix seconds", { exact: true })).toBeVisible();
    await expect(page.getByText("ISO 8601 (UTC)")).toBeVisible();
  });

  test("converts a known Unix timestamp to the right ISO date", async ({ page }) => {
    await page.goto("/timestamp");
    await page.getByLabel(/Seconds or milliseconds/).fill("0");
    await expect(page.getByText("1970-01-01T00:00:00.000Z")).toBeVisible();
  });

  test("auto-detects milliseconds vs seconds by magnitude", async ({ page }) => {
    await page.goto("/timestamp");
    // 1700000000000 (13 digits) is milliseconds -> 2023-11-14T22:13:20.000Z
    await page.getByLabel(/Seconds or milliseconds/).fill("1700000000000");
    await expect(page.getByText("2023-11-14T22:13:20.000Z")).toBeVisible();
  });

  test("converting from the Date & time tab updates the Unix value", async ({ page }) => {
    await page.goto("/timestamp");
    await page.getByRole("tab", { name: "Date & time" }).click();
    await page.locator("#date-input").fill("1970-01-01T00:00");

    // datetime-local has no timezone concept — it's always the browser's
    // local time — so compute the expected epoch the same way the browser
    // does, rather than assuming UTC (which would break outside UTC CI/dev
    // machines).
    const expectedSeconds = await page.evaluate(() =>
      Math.floor(new Date("1970-01-01T00:00").getTime() / 1000),
    );

    await page.getByRole("tab", { name: "Unix timestamp" }).click();
    await expect(page.getByLabel(/Seconds or milliseconds/)).toHaveValue(
      String(expectedSeconds),
    );
  });

  test("shows an error for invalid Unix input", async ({ page }) => {
    await page.goto("/timestamp");
    await page.getByLabel(/Seconds or milliseconds/).fill("not-a-number");
    await expect(page.getByText(/Enter a whole number/)).toBeVisible();
  });

  test("copying a row works", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/timestamp");
    await page.getByLabel(/Seconds or milliseconds/).fill("0");

    await page.getByRole("button", { name: "Copy ISO 8601 (UTC)" }).click();
    await expect(page.getByText("Copied", { exact: true })).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe("1970-01-01T00:00:00.000Z");
  });
});
