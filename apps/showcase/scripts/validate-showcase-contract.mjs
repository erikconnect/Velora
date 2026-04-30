import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import path from "node:path";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const PAGES_DIR = path.join(ROOT, "pages");
const REPORT_PATH = path.join(ROOT, "output", "contract-checklist.md");

const ALLOWED_VL_ATTRS = new Set([
  "vl-effect",
  "vl-enter",
  "vl-exit",
  "vl-scroll",
  "vl-timeline",
  "vl-range",
  "vl-duration",
  "vl-speed",
  "vl-direction",
  "vl-loop",
  "vl-loop-effect",
  "vl-children",
  "vl-stagger",
  "vl-scene",
  "vl-pin",
  "vl-scrub",
  "vl-once",
  "vl-state",
  "vl-page-transition",
  "vl-vt-shared-nav",
  "vl-vt-shared-brand",
  "vl-logo-lockup",
  "vl-card",
  "vl-actuator",
  "vl-hover",
  "vl-base",
  "vl-scene-trigger",
  "vl-scene-trigger-zone",
  "vl-scale-shift",
  "vl-counter-fwd",
  "vl-scroll-markers",
]);

const DEPRECATED_VL_ATTRS = new Map([
  ["vl-type", "Use vl-timeline + channel attributes"],
  ["vl-delay", "Use vl-stagger + vl-children"],
  ["vl-easing", "Use easing tokens/effect contracts"],
  ["vl-transition", "Use vl-page-transition + shared VT classes"],
]);

function rel(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, "/");
}

async function listHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listHtmlFiles(full)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

function extractVlAttrs(content) {
  const attrs = new Set();
  const regex = /\s(vl-[a-z0-9]+(?:-[a-z0-9]+)*)(?=(\s*=|\s|>))/g;
  let m;
  while ((m = regex.exec(content))) {
    attrs.add(m[1]);
  }
  return [...attrs];
}

function extractIds(content) {
  const ids = new Set();
  const regex = /\bid="([^"]+)"/g;
  let m;
  while ((m = regex.exec(content))) ids.add(m[1]);
  return ids;
}

function extractInPageAnchors(content) {
  const anchors = [];
  const regex = /\bhref="#([^"]+)"/g;
  let m;
  while ((m = regex.exec(content))) anchors.push(m[1]);
  return anchors;
}

function formatList(values) {
  return values.length ? values.map((v) => `\`${v}\``).join(", ") : "none";
}

async function writeReport(results, totals) {
  const lines = [];
  lines.push("# Showcase Contract Checklist");
  lines.push("");
  lines.push(`- Pages scanned: **${totals.pages}**`);
  lines.push(`- Unknown vl-* attrs: **${totals.unknownCount}**`);
  lines.push(`- Deprecated vl-* attrs: **${totals.deprecatedCount}**`);
  lines.push(`- Broken #anchors: **${totals.anchorCount}**`);
  lines.push("");
  lines.push("## Per-page status");
  lines.push("");

  for (const page of results) {
    const status =
      page.unknown.length || page.deprecated.length || page.brokenAnchors.length
        ? "FAIL"
        : "OK";
    lines.push(`### ${status} - \`${page.file}\``);
    lines.push(`- Unknown vl-* attrs: ${formatList(page.unknown)}`);
    lines.push(`- Deprecated vl-* attrs: ${formatList(page.deprecated.map((d) => `${d.attr} (${d.reason})`))}`);
    lines.push(`- Broken #anchors: ${formatList(page.brokenAnchors.map((a) => `#${a}`))}`);
    lines.push("");
  }

  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  const shouldWriteReport = process.argv.includes("--write-report");
  const htmlFiles = await listHtmlFiles(PAGES_DIR);

  const results = [];
  const totals = {
    pages: htmlFiles.length,
    unknownCount: 0,
    deprecatedCount: 0,
    anchorCount: 0,
  };

  for (const filePath of htmlFiles) {
    const content = await fs.readFile(filePath, "utf8");
    const attrs = extractVlAttrs(content);
    const ids = extractIds(content);
    const anchors = extractInPageAnchors(content);

    const unknown = attrs.filter((a) => !ALLOWED_VL_ATTRS.has(a) && !DEPRECATED_VL_ATTRS.has(a));
    const deprecated = attrs
      .filter((a) => DEPRECATED_VL_ATTRS.has(a))
      .map((attr) => ({ attr, reason: DEPRECATED_VL_ATTRS.get(attr) }));
    const brokenAnchors = [...new Set(anchors.filter((a) => !ids.has(a)))];

    totals.unknownCount += unknown.length;
    totals.deprecatedCount += deprecated.length;
    totals.anchorCount += brokenAnchors.length;

    results.push({
      file: rel(filePath),
      unknown,
      deprecated,
      brokenAnchors,
    });
  }

  if (shouldWriteReport) {
    await writeReport(results, totals);
  }

  if (totals.unknownCount || totals.deprecatedCount || totals.anchorCount) {
    console.error(
      `Contract check failed: unknown=${totals.unknownCount}, deprecated=${totals.deprecatedCount}, brokenAnchors=${totals.anchorCount}`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(`Contract check passed for ${totals.pages} page(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
