import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Páginas geradas em pages/library (script: scripts/port-packages-pages.mjs) */
function libraryPageInputs() {
  const dir = path.join(__dirname, "pages", "library");
  const inputs = {};
  if (!fs.existsSync(dir)) return inputs;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".html")) continue;
    const key = `lib-${f.replace(/\.html$/i, "").replace(/[^a-z0-9]+/gi, "-")}`;
    inputs[key] = path.resolve(__dirname, "pages/library", f);
  }
  return inputs;
}

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
      input: {
        /* ── Core ─────────────────────────────────────────── */
        main:              path.resolve(__dirname, "index.html"),
        ...libraryPageInputs(),
        about:             path.resolve(__dirname, "pages/core/about.html"),
        converter:         path.resolve(__dirname, "pages/tools/converter.html"),
        landing:           path.resolve(__dirname, "pages/core/landing.html"),
        /* ── Scenes ──────────────────────────────────────── */
        "scene-hero":      path.resolve(__dirname, "pages/scenes/scene-hero.html"),
        "scene-features":  path.resolve(__dirname, "pages/scenes/scene-features.html"),
        "scene-story":     path.resolve(__dirname, "pages/scenes/scene-story.html"),
        "scene-creator":   path.resolve(__dirname, "pages/scenes/scene-creator.html"),
        "scroll-reveal":   path.resolve(__dirname, "pages/scenes/scroll-reveal.html"),
        /* ── Components & UI ─────────────────────────────── */
        buttons:           path.resolve(__dirname, "pages/components/buttons.html"),
        forms:             path.resolve(__dirname, "pages/components/forms.html"),
        testing:           path.resolve(__dirname, "pages/components/testing.html"),
        "component-lab":   path.resolve(__dirname, "pages/components/component-lab.html"),
        "component-wizard":path.resolve(__dirname, "pages/components/component-wizard.html"),
        icons:             path.resolve(__dirname, "pages/components/icons.html"),
        /* ── Motion ──────────────────────────────────────── */
        "zero-js-motion":  path.resolve(__dirname, "pages/motion/zero-js-motion.html"),
        "motion-extended": path.resolve(__dirname, "pages/motion/motion-extended.html"),
        "motion-principles":path.resolve(__dirname, "pages/motion/motion-principles.html"),
        "kinetic-motion":  path.resolve(__dirname, "pages/motion/kinetic-motion.html"),
        "kinetic-cards":   path.resolve(__dirname, "pages/motion/kinetic-cards.html"),
        "scale-shift":     path.resolve(__dirname, "pages/motion/scale-shift.html"),
        interactions:      path.resolve(__dirname, "pages/motion/interactions.html"),
        "api-motion-catalog": path.resolve(__dirname, "pages/motion/api-motion-catalog.html"),
        "3d-explorer":     path.resolve(__dirname, "pages/motion/3d-explorer.html"),
        "3d-rotation":     path.resolve(__dirname, "pages/motion/3d-rotation.html"),
        /* ── Color & Tokens ──────────────────────────────── */
        "design-tokens":   path.resolve(__dirname, "pages/color/design-tokens.html"),
        "color-system":    path.resolve(__dirname, "pages/color/color-system.html"),
        "color-palette":   path.resolve(__dirname, "pages/color/color-palette.html"),
        "tonal-stacking":  path.resolve(__dirname, "pages/color/tonal-stacking.html"),
        "tonal-tiers":     path.resolve(__dirname, "pages/color/tonal-tiers.html"),
        "token-spotlight": path.resolve(__dirname, "pages/color/token-spotlight.html"),
        "ambient-shadows": path.resolve(__dirname, "pages/color/ambient-shadows.html"),
        /* ── Typography ──────────────────────────────────── */
        typography:        path.resolve(__dirname, "pages/typography/typography.html"),
        "typography-composition": path.resolve(__dirname, "pages/typography/typography-composition.html"),
        "typography-spec": path.resolve(__dirname, "pages/typography/typography-spec.html"),
        /* ── Architecture & Tools ────────────────────────── */
        "system-modules":  path.resolve(__dirname, "pages/tools/system-modules.html"),
        architecture:      path.resolve(__dirname, "pages/tools/architecture.html"),
        "brand-voice":     path.resolve(__dirname, "pages/tools/brand-voice.html"),
        accessibility:     path.resolve(__dirname, "pages/tools/accessibility.html"),
        "contrast-tool":   path.resolve(__dirname, "pages/tools/contrast-tool.html"),
      },
    },
  },
});
