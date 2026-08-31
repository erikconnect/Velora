import { test, expect } from "@playwright/test";

test("catalog-summary.json is valid", async ({ request }) => {
  const res = await request.get("/data/catalog-summary.json");
  expect(res.ok()).toBeTruthy();
  const data = await res.json();
  expect(data.presetCount).toBeGreaterThan(100);
  expect(data.byChannel.enter).toBeGreaterThan(0);
});

test("presets-full.json matches summary count", async ({ request }) => {
  const [summaryRes, fullRes] = await Promise.all([
    request.get("/data/catalog-summary.json"),
    request.get("/data/presets-full.json"),
  ]);
  const summary = await summaryRes.json();
  const full = await fullRes.json();
  expect(full.presets.length).toBe(summary.presetCount);
});

test("compatibility-matrix.json has primitives", async ({ request }) => {
  const res = await request.get("/data/compatibility-matrix.json");
  const data = await res.json();
  expect(data.primitives.length).toBeGreaterThan(10);
  expect(data.baseline.chrome).toBeTruthy();
});

test("benchmarks.json has generated claims", async ({ request }) => {
  const res = await request.get("/data/benchmarks.json");
  expect(res.ok()).toBeTruthy();
  const data = await res.json();
  expect(data.claims.length).toBeGreaterThan(3);
  expect(data.cdn.unpkg.motionCore).toContain("unpkg.com");
  expect(data.methodology.fpsClaims).toBe("not-published");
});
