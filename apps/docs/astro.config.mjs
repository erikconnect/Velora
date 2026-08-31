import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: "https://docs.veloracss.io",
  vite: {
    resolve: {
      alias: {
        "@velora/css": path.resolve(root, "../../packages/css/src/velora.css"),
      },
    },
  },
});
