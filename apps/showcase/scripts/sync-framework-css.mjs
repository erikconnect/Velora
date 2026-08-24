import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(showcaseRoot, "../..");
const sourceDir = path.join(repoRoot, "packages", "css", "src");
const targetDir = path.join(showcaseRoot, "public", "css");

/** Showcase-owned CSS — never overwritten by framework sync. */
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
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Missing source dir: ${sourceDir}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  const cssFiles = getCssFiles(sourceDir);
  let copied = 0;

  for (const fileName of cssFiles) {
    if (SHOWCASE_ONLY.has(fileName)) {
      console.log(`Skipped showcase-only (not in package sync): ${fileName}`);
      continue;
    }

    const sourcePath = path.join(sourceDir, fileName);
    const targetPath = path.join(targetDir, fileName);
    const sourceContent = fs.readFileSync(sourcePath, "utf8");
    const targetContent = fs.existsSync(targetPath)
      ? fs.readFileSync(targetPath, "utf8")
      : null;

    if (targetContent !== sourceContent) {
      fs.writeFileSync(targetPath, sourceContent, "utf8");
      copied += 1;
      console.log(`Synced ${fileName}`);
    }
  }

  console.log(`Framework CSS sync done. Updated files: ${copied}`);
}

main();
