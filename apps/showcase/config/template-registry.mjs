import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");

export const DEFAULT_TEMPLATE_NAME = "default";

export const TEMPLATE_REGISTRY = {
  [DEFAULT_TEMPLATE_NAME]: {
    name: "Velora Default Template",
    description: "Baseline multi-page template for Velora showcase surfaces.",
    rootFile: "index.html",
    sections: {
      core: [
        "index.html",
        "pages/core/about.html",
        "pages/core/landing.html",
        "pages/core/page-template.html",
      ],
      scenes: [
        "pages/scenes/scene-hero.html",
        "pages/scenes/scene-features.html",
        "pages/scenes/scene-story.html",
        "pages/scenes/scene-creator.html",
        "pages/scenes/scroll-reveal.html",
      ],
      components: [
        "pages/components/buttons.html",
        "pages/components/forms.html",
        "pages/components/testing.html",
        "pages/components/component-lab.html",
        "pages/components/component-wizard.html",
        "pages/components/icons.html",
      ],
      motion: [
        "pages/motion/zero-js-motion.html",
        "pages/motion/motion-extended.html",
        "pages/motion/motion-compiler-demo.html",
        "pages/motion/motion-principles.html",
        "pages/motion/kinetic-motion.html",
        "pages/motion/kinetic-cards.html",
        "pages/motion/scale-shift.html",
        "pages/motion/interactions.html",
        "pages/motion/api-motion-catalog.html",
        "pages/motion/3d-explorer.html",
        "pages/motion/3d-rotation.html",
      ],
      color: [
        "pages/color/design-tokens.html",
        "pages/color/color-system.html",
        "pages/color/color-palette.html",
        "pages/color/tonal-stacking.html",
        "pages/color/tonal-tiers.html",
        "pages/color/token-spotlight.html",
        "pages/color/ambient-shadows.html",
      ],
      typography: [
        "pages/typography/typography.html",
        "pages/typography/typography-composition.html",
        "pages/typography/typography-spec.html",
      ],
      tools: [
        "pages/tools/system-modules.html",
        "pages/tools/architecture.html",
        "pages/tools/brand-voice.html",
        "pages/tools/accessibility.html",
        "pages/tools/contrast-tool.html",
        "pages/tools/converter.html",
      ],
      integrations: [
        "pages/integrations/gsap-anime.html",
      ],
    },
  },
};

export function toRollupKey(filePath) {
  if (filePath === "index.html") return "main";
  const base = filePath.split("/").at(-1) ?? filePath;
  return base.replace(/\.html$/i, "");
}

export function resolveTemplateInputs(templateName = DEFAULT_TEMPLATE_NAME) {
  const template = TEMPLATE_REGISTRY[templateName];
  if (!template) throw new Error(`Unknown template: ${templateName}`);

  const files = Object.values(template.sections).flat();
  const inputs = {};

  for (const relPath of files) {
    inputs[toRollupKey(relPath)] = path.resolve(APP_ROOT, relPath);
  }

  const libraryDir = path.join(APP_ROOT, "pages", "library");
  if (fs.existsSync(libraryDir)) {
    for (const fileName of fs.readdirSync(libraryDir)) {
      if (!fileName.endsWith(".html")) continue;
      const key = `lib-${fileName.replace(/\.html$/i, "").replace(/[^a-z0-9]+/gi, "-")}`;
      inputs[key] = path.resolve(libraryDir, fileName);
    }
  }

  return inputs;
}

export function listTemplatePages(templateName = DEFAULT_TEMPLATE_NAME) {
  const template = TEMPLATE_REGISTRY[templateName];
  if (!template) throw new Error(`Unknown template: ${templateName}`);
  return Object.values(template.sections).flat();
}
