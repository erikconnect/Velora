import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");

export const DEFAULT_TEMPLATE_NAME = "default";

export const TEMPLATE_REGISTRY = {
  [DEFAULT_TEMPLATE_NAME]: {
    name: "Velora Default Template",
    description: "Lean public Showcase: Home, Core, Elements, Scenes, Skins, Catalog; Hosts and Archive are secondary references.",
    rootFile: "index.html",
    sections: {
      live: [
        "index.html",
        "pages/core/core.html",
        "pages/core/elements.html",
        "pages/scenes/scene-timeline.html",
        "pages/core/skins.html",
        "pages/motion/api-motion-catalog.html",
      ],
      secondary: [
        "pages/core/hosts.html",
        "pages/core/archive.html",
        "pages/motion/motion-lab.html",
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

  return inputs;
}

export function listTemplatePages(templateName = DEFAULT_TEMPLATE_NAME) {
  const template = TEMPLATE_REGISTRY[templateName];
  if (!template) throw new Error(`Unknown template: ${templateName}`);
  return Object.values(template.sections).flat();
}
