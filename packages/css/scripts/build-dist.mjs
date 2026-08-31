import {
  cpSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { gzipSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const pkgDir = join(dir, "..");
const srcDir = join(pkgDir, "src");
const distDir = join(pkgDir, "dist");
const repoRoot = join(pkgDir, "../..");
const showcaseDataDir = join(repoRoot, "apps/showcase/public/data");
const catalogSummaryPath = join(repoRoot, "packages/catalog/catalog-summary.json");

const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
const version = pkg.version ?? "0.0.0";

mkdirSync(distDir, { recursive: true });
mkdirSync(showcaseDataDir, { recursive: true });

/** @type {{ entry: string, file: string, bytes: number, gzipBytes: number }[]} */
const bundles = [];

for (const name of readdirSync(srcDir)) {
  if (!name.endsWith(".css")) continue;
  const srcPath = join(srcDir, name);
  const destPath = join(distDir, name);
  const content = readFileSync(srcPath);
  cpSync(srcPath, destPath);
  const entry = name.replace(/\.css$/i, "");
  bundles.push({
    entry,
    file: `dist/${name}`,
    bytes: content.length,
    gzipBytes: gzipSync(content).length,
  });
}

bundles.sort((a, b) => a.entry.localeCompare(b.entry));

const motionCore = bundles.find((b) => b.entry === "motion-core");
const fullBundle = bundles.find((b) => b.entry === "velora");

/** @type {{ presetCount?: number }} */
let catalogSummary = {};
try {
  catalogSummary = JSON.parse(readFileSync(catalogSummaryPath, "utf8"));
} catch {
  /* catalog may not be generated yet */
}

const cdnBase = `@velora/css@${version}`;
const cdn = {
  unpkg: {
    motionCore: `https://unpkg.com/${cdnBase}/dist/motion-core.css`,
    full: `https://unpkg.com/${cdnBase}/dist/velora.css`,
  },
  jsdelivr: {
    motionCore: `https://cdn.jsdelivr.net/npm/${cdnBase}/dist/motion-core.css`,
    full: `https://cdn.jsdelivr.net/npm/${cdnBase}/dist/velora.css`,
  },
};

const manifest = {
  generatedAt: new Date().toISOString(),
  package: pkg.name,
  version,
  publishStatus: "ready-not-published",
  bundles,
  cdn,
  defaultCdnEntry: "motion-core",
};

writeFileSync(join(distDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const benchmarks = {
  generatedAt: manifest.generatedAt,
  package: pkg.name,
  version,
  publishStatus: manifest.publishStatus,
  catalog: {
    presetCount: catalogSummary.presetCount ?? null,
  },
  claims: [
    {
      id: "animation-runtime-js",
      metric: "Animation runtime JavaScript",
      velora: "0 KB",
      baseline: "Varies (often 40–120+ KB gzipped)",
      evidence: "CSS-only attributes; no scroll/RAF driver on product pages",
      verifiedBy: ["contract", "e2e"],
    },
    {
      id: "motion-core-transfer",
      metric: "motion-core.css transfer (raw / gzip)",
      velora: motionCore
        ? `${formatKb(motionCore.bytes)} / ${formatKb(motionCore.gzipBytes)} gzip`
        : "—",
      baseline: "N/A (CSS bundle, not JS runtime)",
      evidence: "packages/css/dist/manifest.json",
      verifiedBy: ["build-dist"],
    },
    {
      id: "full-bundle-transfer",
      metric: "velora.css full bundle (raw / gzip)",
      velora: fullBundle
        ? `${formatKb(fullBundle.bytes)} / ${formatKb(fullBundle.gzipBytes)} gzip`
        : "—",
      baseline: "Theme + components optional",
      evidence: "packages/css/dist/manifest.json",
      verifiedBy: ["build-dist"],
    },
    {
      id: "scroll-driver",
      metric: "Scroll timeline driver",
      velora: "Native scroll-timeline / view-timeline",
      baseline: "JS scroll listeners + interpolation",
      evidence: "Core scene recipes",
      verifiedBy: ["showcase"],
    },
    {
      id: "reduced-motion",
      metric: "Reduced motion",
      velora: '@media (prefers-reduced-motion) + vl-motion="still"',
      baseline: "Often optional plugin",
      evidence: "Policy + E2E",
      verifiedBy: ["e2e"],
    },
    {
      id: "preset-registry",
      metric: "Public preset registry",
      velora:
        catalogSummary.presetCount != null
          ? `${catalogSummary.presetCount} presets`
          : "—",
      baseline: "N/A",
      evidence: "packages/catalog/",
      verifiedBy: ["generate:catalog", "e2e"],
    },
  ],
  methodology: {
    fpsClaims: "not-published",
    harnessVersion: 1,
    note: "Frame-time benchmarks require fixture pages + trace export; not headline FPS.",
  },
  cdn,
};

writeFileSync(
  join(showcaseDataDir, "benchmarks.json"),
  `${JSON.stringify(benchmarks, null, 2)}\n`,
);

writeFileSync(join(distDir, ".buildstamp"), `${manifest.generatedAt}\n`);

console.log(`@velora/css dist: ${bundles.length} bundles → ${distDir}`);
console.log(`@velora/css manifest + benchmarks.json written`);

function formatKb(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
