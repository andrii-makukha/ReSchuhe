import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the technical foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("ReSchuhe");
  await expect(page.getByRole("heading", { level: 1, name: "ReSchuhe" })).toBeVisible();
  await expect(page.getByText("Technical shell only")).toBeVisible();
});

test("returns the baseline security headers", async ({ page }) => {
  const response = await page.goto("/");

  expect(response).not.toBeNull();
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  expect(response?.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(response?.headers()["permissions-policy"]).toBe(
    "camera=(), microphone=(), geolocation=()",
  );
  expect(response?.headers()["x-powered-by"]).toBeUndefined();
});

test("has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("/");

  const accessibilityScan = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScan.violations).toEqual([]);
});
