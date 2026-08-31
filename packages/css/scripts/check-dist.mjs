import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const distDir = join(dir, "..", "dist");
const manifestPath = join(distDir, "manifest.json");

if (!existsSync(manifestPath)) {
  console.error("@velora/css check-dist: missing dist/manifest.json — run pnpm build");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (!Array.isArray(manifest.bundles) || manifest.bundles.length === 0) {
  console.error("@velora/css check-dist: manifest has no bundles");
  process.exit(1);
}

const motionCore = manifest.bundles.find((b) => b.entry === "motion-core");
if (!motionCore?.gzipBytes) {
  console.error("@velora/css check-dist: motion-core bundle missing");
  process.exit(1);
}

console.log(`@velora/css dist OK (${manifest.bundles.length} bundles, motion-core gzip ${motionCore.gzipBytes} B)`);
