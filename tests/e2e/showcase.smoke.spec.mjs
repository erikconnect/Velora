import { test, expect } from "@playwright/test";

const LIVE_PAGES = [
  "/index.html",
  "/pages/core/core.html",
  "/pages/core/elements.html",
  "/pages/scenes/scene-timeline.html",
  "/pages/core/skins.html",
  "/pages/motion/api-motion-catalog.html",
];

const SECONDARY_PAGES = [
  "/pages/core/compatibility.html",
  "/pages/core/benchmarks.html",
  "/pages/core/hosts.html",
  "/pages/motion/motion-lab.html",
  "/pages/motion/playground.html",
];

for (const path of [...LIVE_PAGES, ...SECONDARY_PAGES]) {
  test(`loads ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#content")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });
}

test("catalog registry section renders stats", async ({ page }) => {
  await page.goto("/pages/motion/api-motion-catalog.html#preset-registry");
  await expect(page.locator("#catalog-registry-stats")).toBeVisible();
  await expect(page.locator("#catalog-registry-table tbody tr")).not.toHaveCount(0, {
    timeout: 15_000,
  });
});

test("compatibility matrix table populates", async ({ page }) => {
  await page.goto("/pages/core/compatibility.html#compat-matrix");
  await expect(page.locator("#compat-matrix-table tbody tr")).not.toHaveCount(0, {
    timeout: 15_000,
  });
});

test("motion lab inspector loads", async ({ page }) => {
  await page.goto("/pages/motion/motion-lab.html#preset-inspector");
  const items = page.locator("#lab-preset-list li");
  await expect(items).not.toHaveCount(0, { timeout: 15_000 });
  await items.first().click();
  await expect(page.locator("#lab-preset-detail")).toContainText(/Channel|preset/i);
});

test("playground composes markup from registry", async ({ page }) => {
  await page.goto("/pages/motion/playground.html#play-compose");
  await expect(page.locator("#playground-markup")).not.toHaveText("<!-- Select a preset -->", {
    timeout: 15_000,
  });
  await expect(page.locator("#playground-preview-target")).toBeVisible();
  await expect(page.locator("#playground-markup")).toContainText(/vl-[a-z-]+="/);
});

test("benchmarks page loads generated metrics", async ({ page }) => {
  await page.goto("/pages/core/benchmarks.html#bench-metrics");
  await expect(page.locator("#bench-metrics-body tr")).not.toHaveCount(0, {
    timeout: 15_000,
  });
  await expect(page.locator("#bench-metrics-body")).toContainText(/Animation runtime JavaScript/);
  await expect(page.locator("#bench-cdn-snippet")).toContainText("unpkg.com");
});
