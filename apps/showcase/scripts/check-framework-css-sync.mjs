import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(showcaseRoot, "../..");
const sourceDir = path.join(repoRoot, "packages", "css", "src");
const targetDir = path.join(showcaseRoot, "public", "css");

/** Showcase-owned CSS — not checked against packages/css/src. */
const SHOWCASE_ONLY = new Set([
  "04e-showcase-elevation-patterns.css",
  "08-showcase-home.css",
  "showcase.css",
  "showcase-home.css",
  "showcase-hub.css",
  "showcase-reference-pages.css",
  "showcase-api-motion-catalog.css",
  "showcase-design-playground.css",
  "showcase-motion-playground.css",
  "showcase-tw-demos.css",
  "landing.css",
  "impossible-demo.css",
  "library-doc-content.css",
  "library-ds-themes.css",
  "velora.generated.css",
]);

function getCssFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".css"))
    .map((entry) => entry.name)
    .sort();
}

function main() {
  if (!fs.existsSync(sourceDir) || !fs.existsSync(targetDir)) {
    throw new Error("Missing source or target CSS directory.");
  }

  const files = getCssFiles(sourceDir);
  const issues = [];

  for (const fileName of files) {
    if (SHOWCASE_ONLY.has(fileName)) continue;

    const sourcePath = path.join(sourceDir, fileName);
    const targetPath = path.join(targetDir, fileName);

    if (!fs.existsSync(targetPath)) {
      issues.push(`Missing file in showcase: ${fileName}`);
      continue;
    }

    const sourceContent = fs.readFileSync(sourcePath, "utf8");
    const targetContent = fs.readFileSync(targetPath, "utf8");

    if (sourceContent !== targetContent) {
      issues.push(`Drift detected: ${fileName}`);
    }
  }

  if (issues.length > 0) {
    console.error("Framework CSS is out of sync with showcase:");
    for (const issue of issues) console.error(`- ${issue}`);
    console.error("Run: pnpm --filter showcase sync:framework-css");
    process.exit(1);
  }

  console.log("Framework CSS is in sync with showcase.");
}

main();
