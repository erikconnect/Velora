import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { resolveTemplateInputs } from "./config/template-registry.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  /* MPA: sem fallback para SPA; navegações são documentos completos (View Transitions entre páginas). */
  appType: "mpa",
  resolve: {
    alias: {
      "@velora/css": path.resolve(__dirname, "../../packages/css/src/velora.css"),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  build: {
    rollupOptions: {
      input: resolveTemplateInputs(),
    },
  },
});
