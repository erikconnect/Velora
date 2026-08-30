import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4187";

export default defineConfig({
  testDir: __dirname,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "list",
  timeout: 45_000,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command:
          "pnpm generate:catalog && pnpm --filter @velora/css build && pnpm --filter showcase build && pnpm --filter showcase exec vite preview --host 127.0.0.1 --port 4187",
        url: `${baseURL}/data/catalog-summary.json`,
        cwd: repoRoot,
        reuseExistingServer: false,
        timeout: 180_000,
      },
});
