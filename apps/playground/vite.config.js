import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  /* MPA: sem fallback para SPA; navegações são documentos completos (View Transitions entre páginas). */
  appType: "mpa",
  resolve: {
    alias: {
      "@velora/css": resolve(__dirname, "../../packages/css/src/velora.css"),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
      },
    },
  },
});
