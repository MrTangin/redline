import { test, expect } from "@playwright/test";

test.describe("API Tester", () => {
  test("sends a real GET request through the proxy and shows the response", async ({ page }) => {
    await page.goto("/tester");
    await expect(page.getByRole("heading", { name: "API Tester" })).toBeVisible();

    await page.getByPlaceholder(/api\.example\.com/).fill("https://httpbin.org/get");
    await page.getByRole("button", { name: "Send", exact: true }).click();

    await expect(page.getByText(/^200 OK$/)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("JSON", { exact: true })).toBeVisible();
  });

  test("blocks requests to private/internal addresses (SSRF guard)", async ({ page, baseURL }) => {
    await page.goto("/tester");
    await page
      .getByPlaceholder(/api\.example\.com/)
      .fill(`${baseURL}/api/health`.replace("localhost", "127.0.0.1"));
    await page.getByRole("button", { name: "Send", exact: true }).click();

    await expect(page.getByText(/private\/internal IP addresses are not allowed/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("shows a request-failed panel for an invalid URL", async ({ page }) => {
    await page.goto("/tester");
    await page.getByPlaceholder(/api\.example\.com/).fill("not-a-valid-url");
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.getByText("Request failed")).toBeVisible({ timeout: 10000 });
  });

  test("beautifies a JSON body", async ({ page }) => {
    await page.goto("/tester");
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "POST", exact: true }).click();

    await page.getByRole("tab", { name: "Body" }).click();
    const textarea = page.locator("textarea");
    await textarea.fill('{"a":1,"b":2}');
    await page.getByRole("button", { name: "Beautify JSON" }).click();
    await expect(textarea).toHaveValue(/"a":\s*1/);
    await expect(textarea).toHaveValue(/"b":\s*2/);
  });

  test("shows an error toast when beautifying invalid JSON", async ({ page }) => {
    await page.goto("/tester");
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "POST", exact: true }).click();
    await page.getByRole("tab", { name: "Body" }).click();

    await page.locator("textarea").fill("{not valid json");
    await page.getByRole("button", { name: "Beautify JSON" }).click();
    await expect(page.getByText(/isn't valid JSON/i)).toBeVisible();
  });

  test("copies the current request as a cURL command", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/tester");
    await page.getByPlaceholder(/api\.example\.com/).fill("https://httpbin.org/get");
    await page.getByRole("button", { name: /Copy as cURL/i }).click();
    await expect(page.getByText(/Copied as cURL/i)).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain("curl");
    expect(clipboardText).toContain("httpbin.org/get");
  });

  test("persists request history across reloads and reloads it into the builder", async ({
    page,
  }) => {
    await page.goto("/tester");
    await page.getByPlaceholder(/api\.example\.com/).fill("https://httpbin.org/get");
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.getByText(/^200 OK$/)).toBeVisible({ timeout: 15000 });

    await page.reload();
    const historyEntry = page.getByText("httpbin.org/get");
    await expect(historyEntry).toBeVisible();

    await page.getByPlaceholder(/api\.example\.com/).fill("");
    await historyEntry.click();
    await expect(page.getByPlaceholder(/api\.example\.com/)).toHaveValue(
      "https://httpbin.org/get",
    );
  });
});
