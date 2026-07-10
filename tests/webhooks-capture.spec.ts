import { test, expect } from "@playwright/test";
import { checkDbConfigured, deleteBin } from "./helpers/db";

/**
 * These exercise the real Supabase-backed round trip: create a bin, POST a
 * request at its ingest URL, confirm it's captured and displayed. They
 * self-skip (rather than fail) when SUPABASE_* env vars are placeholders,
 * so the suite stays green for anyone without real credentials configured
 * while still fully verifying the path once they are.
 */
// Serial: later tests in this file depend on state ("binId") created by
// earlier ones, so they can't run in parallel despite the global
// fullyParallel setting.
test.describe.serial("Webhook capture (requires real Supabase credentials)", () => {
  let binId: string | null = null;

  test.beforeAll(async ({ request }) => {
    binId = await checkDbConfigured(request);
  });

  test.afterAll(async ({ request }) => {
    if (binId) await deleteBin(request, binId);
  });

  test("creates an inbox from the UI and shows its ingest URL", async ({ page }) => {
    test.skip(!binId, "Supabase not configured with real credentials");
    await page.goto("/webhooks");
    await page.getByRole("button", { name: "Create a new inbox" }).click();
    await expect(page).toHaveURL(/\/webhooks\/[0-9a-f-]{36}$/i, { timeout: 10000 });
    // The ingest URL is shown twice (the copy block, and again in the
    // empty-state hint) — scope to the first, the dedicated copy block.
    await expect(page.locator("code").first()).toContainText("/api/hook/");
  });

  test("captures a real request and displays its headers/body", async ({ page, request }) => {
    test.skip(!binId, "Supabase not configured with real credentials");

    const res = await request.post(`/api/hook/${binId}?foo=bar`, {
      data: { hello: "world" },
      headers: { "x-test-header": "redline-e2e" },
    });
    expect(res.ok()).toBeTruthy();

    await page.goto(`/webhooks/${binId}`);
    const row = page.getByText("POST").first();
    await expect(row).toBeVisible({ timeout: 10000 });
    await row.click();

    await page.getByRole("tab", { name: "Headers" }).click();
    await expect(page.getByText(/x-test-header/i)).toBeVisible();
    await expect(page.getByText("redline-e2e")).toBeVisible();

    await page.getByRole("tab", { name: "Query" }).click();
    await expect(page.getByText("foo")).toBeVisible();
    await expect(page.getByText("bar")).toBeVisible();

    await page.getByRole("tab", { name: "Body" }).click();
    await expect(page.getByText(/"hello"/)).toBeVisible();
  });

  test("clear all empties the inbox", async ({ page }) => {
    test.skip(!binId, "Supabase not configured with real credentials");
    await page.goto(`/webhooks/${binId}`);
    await page.getByRole("button", { name: "Clear all" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Clear all" }).click();
    await expect(page.getByText(/Waiting for requests/i)).toBeVisible({ timeout: 10000 });
  });

  test("delete inbox redirects back to the webhooks landing page", async ({ page, request }) => {
    const freshId = await checkDbConfigured(request);
    test.skip(!freshId, "Supabase not configured with real credentials");

    await page.goto(`/webhooks/${freshId}`);
    await page.getByRole("button", { name: "Delete inbox" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Delete inbox" }).click();
    await expect(page).toHaveURL(/\/webhooks$/, { timeout: 10000 });

    const check = await request.get(`/api/webhooks/${freshId}`);
    expect(check.status()).toBe(404);
  });
});
