import { test, expect } from "@playwright/test";

test.describe("prefers-reduced-motion: reduce", () => {
  test.use({
    colorScheme: "dark",
  });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("core page content stays visible", async ({ page }) => {
    await page.goto("/pages/core/core.html");
    const intro = page.locator("#core-intro, [id^='core-']").first();
    await expect(intro).toBeVisible();
    await expect(page.locator("#content")).toBeVisible();
  });

  test("catalog targets remain visible", async ({ page }) => {
    await page.goto("/pages/motion/api-motion-catalog.html#channels");
    const targets = page.locator(".api-target").first();
    await expect(targets).toBeVisible();
    const opacity = await targets.evaluate((el) =>
      Number.parseFloat(getComputedStyle(el).opacity),
    );
    expect(opacity).toBeGreaterThan(0);
  });

  test("compatibility reduce section readable", async ({ page }) => {
    await page.goto("/pages/core/compatibility.html#compat-reduced");
    await expect(page.getByRole("heading", { name: /Readable composed state/i })).toBeVisible();
  });

  test("vl-motion=still card visible on compatibility page", async ({ page }) => {
    await page.goto("/pages/core/compatibility.html#compat-reduced");
    await expect(page.locator('[vl-motion="still"]')).toBeVisible();
  });
});
