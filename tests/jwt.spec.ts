import { test, expect } from "@playwright/test";

// Fixed HS256 fixtures signed with SECRET (generated once via Node's crypto,
// not regenerated per run) so signature verification has something real to
// check against.
const SECRET = "test-secret";
const VALID_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJuYW1lIjoiQWRhIExvdmVsYWNlIiwiZXhwIjo0MTAyNDQ0ODAwfQ.jRrCXjCycUNerK6SoZKkWPZpKPGxehljtc_6OAt9mB4";
const EXPIRED_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTIiLCJuYW1lIjoiQWxhbiBUdXJpbmciLCJleHAiOjEwMDAwMDAwMDB9.NflRFOP4uLadgdAb2iMucj0dmCbmm5bRVoqDEkfpyHA";

test.describe("JWT Decoder", () => {
  test("loads and decodes a valid token", async ({ page }) => {
    await page.goto("/jwt");
    await expect(page.getByRole("heading", { name: "JWT Decoder" })).toBeVisible();

    await page.getByLabel("JWT").fill(VALID_TOKEN);
    await expect(page.getByText("alg: HS256")).toBeVisible();
    await expect(page.getByText(/Valid — expires/)).toBeVisible();
    await expect(page.getByText(/"Ada Lovelace"/)).toBeVisible();
  });

  test("shows an expired badge for a past exp claim", async ({ page }) => {
    await page.goto("/jwt");
    await page.getByLabel("JWT").fill(EXPIRED_TOKEN);
    await expect(page.getByText(/^Expired/)).toBeVisible();
  });

  test("shows a clear error for malformed input", async ({ page }) => {
    await page.goto("/jwt");
    await page.getByLabel("JWT").fill("not.a.jwt.at.all.definitely.not");
    await expect(page.getByText(/three dot-separated parts/)).toBeVisible();
  });

  test("verifies a correct HMAC secret and rejects a wrong one", async ({ page }) => {
    await page.goto("/jwt");
    await page.getByLabel("JWT").fill(VALID_TOKEN);

    const secretInput = page.getByPlaceholder("Signing secret");
    await secretInput.fill(SECRET);
    await page.getByRole("button", { name: "Verify" }).click();
    await expect(page.getByText(/Signature is valid/)).toBeVisible();

    await secretInput.fill("wrong-secret");
    await page.getByRole("button", { name: "Verify" }).click();
    await expect(page.getByText(/does not match/)).toBeVisible();
  });

  test("never sends the token over the network", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (req) => requests.push(req.url()));

    await page.goto("/jwt");
    await page.getByLabel("JWT").fill(VALID_TOKEN);
    await expect(page.getByText("alg: HS256")).toBeVisible();

    const leaked = requests.some((url) => url.includes(VALID_TOKEN.split(".")[1]));
    expect(leaked).toBe(false);
  });
});
