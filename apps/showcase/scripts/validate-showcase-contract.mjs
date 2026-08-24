import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  extractIds,
  extractInPageAnchors,
  extractVlAttributes,
} from "../../../packages/compiler/src/extract.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const INDEX_PATH = path.join(ROOT, "index.html");
const PAGES_DIR = path.join(ROOT, "pages");
const REPORT_PATH = path.join(ROOT, "output", "contract-checklist.md");

const HOME_ANCHOR_MOTION_ATTRS = new Set([
  "vl-effect",
  "vl-enter",
  "vl-exit",
  "vl-scroll",
  "vl-hover",
  "vl-loop",
  "vl-loop-effect",
  "vl-timeline",
  "vl-range",
  "vl-duration",
  "vl-speed",
  "vl-motion",
  "vl-direction",
  "vl-children",
  "vl-stagger",
  "vl-pin",
  "vl-scrub",
  "vl-once",
  "vl-state",
]);

const HOME_SCENE_FRAME_CLASSES = new Set([
  "showcase-home-hero-root",
  "showcase-home-display-grid",
  "showcase-home-scenes-shell",
]);

const ALLOWED_VL_ATTRS = new Set([
  "vl-effect",
  "vl-enter",
  "vl-exit",
  "vl-scroll",
  "vl-timeline",
  "vl-range",
  "vl-duration",
  "vl-speed",
  "vl-motion",
  "vl-direction",
  "vl-loop",
  "vl-loop-effect",
  "vl-children",
  "vl-stagger",
  "vl-scene",
  "vl-stage",
  "vl-act",
  "vl-span",
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

async function collectHtmlFiles() {
  const files = [];

  try {
    await fs.access(INDEX_PATH);
    files.push(INDEX_PATH);
  } catch {
    // Optional for template-only runs.
  }

  files.push(...(await listHtmlFiles(PAGES_DIR)));
  return files;
}

function formatList(values) {
  return values.length ? values.map((v) => `\`${v}\``).join(", ") : "none";
}

function lineNumberForIndex(content, index) {
  return content.slice(0, index).split("\n").length;
}

function readAttrValue(tag, attrName) {
  const escaped = attrName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const attrRe = new RegExp(`\\b${escaped}\\s*=\\s*(?:"([^"]+)"|'([^']+)'|([^\\s"'=<>` + "`" + `]+))`, "i");
  const match = attrRe.exec(tag);
  return match ? (match[1] ?? match[2] ?? match[3]) : "";
}

function hasAnyClass(className, classSet) {
  return className.split(/\s+/).some((token) => classSet.has(token));
}

function findHomeAnchorMotionAttrs(content) {
  const violations = [];
  const sectionRe = /<section\b[^>]*\bid\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'=<>`]+))[^>]*>/gi;
  let sectionMatch;

  while ((sectionMatch = sectionRe.exec(content))) {
    const tag = sectionMatch[0];
    const id = sectionMatch[1] ?? sectionMatch[2] ?? sectionMatch[3];
    const attrs = extractVlAttributes(tag)
      .filter((attr) => HOME_ANCHOR_MOTION_ATTRS.has(attr.name))
      .map((attr) => attr.name);

    if (!attrs.length) continue;

    violations.push({
      id,
      line: lineNumberForIndex(content, sectionMatch.index),
      attrs: [...new Set(attrs)],
      className: readAttrValue(tag, "class"),
    });
  }

  return violations;
}

function findHomeSceneFrameMotionAttrs(content) {
  const violations = [];
  const tagRe = /<([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?\/?>/gs;
  let tagMatch;

  while ((tagMatch = tagRe.exec(content))) {
    const tag = tagMatch[0];
    const className = readAttrValue(tag, "class");

    if (!className || !hasAnyClass(className, HOME_SCENE_FRAME_CLASSES)) continue;

    const attrs = extractVlAttributes(tag)
      .filter((attr) => HOME_ANCHOR_MOTION_ATTRS.has(attr.name))
      .map((attr) => attr.name);

    if (!attrs.length) continue;

    violations.push({
      tag: tagMatch[1],
      className,
      line: lineNumberForIndex(content, tagMatch.index),
      attrs: [...new Set(attrs)],
    });
  }

  return violations;
}

async function writeReport(results, totals) {
  const lines = [];
  lines.push("# Showcase Contract Checklist");
  lines.push("");
  lines.push(`- Pages scanned: **${totals.pages}**`);
  lines.push(`- Unknown vl-* attrs: **${totals.unknownCount}**`);
  lines.push(`- Deprecated vl-* attrs: **${totals.deprecatedCount}**`);
  lines.push(`- Broken #anchors: **${totals.anchorCount}**`);
  lines.push(`- Home anchor motion violations: **${totals.homeAnchorMotionCount}**`);
  lines.push(`- Home scene frame motion violations: **${totals.homeSceneFrameMotionCount}**`);
  lines.push("");
  lines.push("## Per-page status");
  lines.push("");

  for (const page of results) {
    const status =
      page.unknown.length || page.deprecated.length || page.brokenAnchors.length || page.homeAnchorMotion.length
      || page.homeSceneFrameMotion.length
        ? "FAIL"
        : "OK";
    lines.push(`### ${status} - \`${page.file}\``);
    lines.push(`- Unknown vl-* attrs: ${formatList(page.unknown)}`);
    lines.push(`- Deprecated vl-* attrs: ${formatList(page.deprecated.map((d) => `${d.attr} (${d.reason})`))}`);
    lines.push(`- Broken #anchors: ${formatList(page.brokenAnchors.map((a) => `#${a}`))}`);
    lines.push(`- Home anchor motion: ${formatList(page.homeAnchorMotion.map((v) => `#${v.id} line ${v.line}: ${v.attrs.join(", ")}`))}`);
    lines.push(`- Home scene frame motion: ${formatList(page.homeSceneFrameMotion.map((v) => `${v.className} line ${v.line}: ${v.attrs.join(", ")}`))}`);
    lines.push("");
  }

  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  const shouldWriteReport = process.argv.includes("--write-report");
  const htmlFiles = await collectHtmlFiles();

  const results = [];
  const totals = {
    pages: htmlFiles.length,
    unknownCount: 0,
    deprecatedCount: 0,
    anchorCount: 0,
    homeAnchorMotionCount: 0,
    homeSceneFrameMotionCount: 0,
  };

  for (const filePath of htmlFiles) {
    const content = await fs.readFile(filePath, "utf8");
    const attrs = [...new Set(extractVlAttributes(content).map((attr) => attr.name))];
    const ids = new Set(extractIds(content));
    const anchors = extractInPageAnchors(content);

    const unknown = attrs.filter((a) => !ALLOWED_VL_ATTRS.has(a) && !DEPRECATED_VL_ATTRS.has(a));
    const deprecated = attrs
      .filter((a) => DEPRECATED_VL_ATTRS.has(a))
      .map((attr) => ({ attr, reason: DEPRECATED_VL_ATTRS.get(attr) }));
    const brokenAnchors = [...new Set(anchors.filter((a) => !ids.has(a)))];
    const homeAnchorMotion = path.resolve(filePath) === INDEX_PATH ? findHomeAnchorMotionAttrs(content) : [];
    const homeSceneFrameMotion = path.resolve(filePath) === INDEX_PATH ? findHomeSceneFrameMotionAttrs(content) : [];

    totals.unknownCount += unknown.length;
    totals.deprecatedCount += deprecated.length;
    totals.anchorCount += brokenAnchors.length;
    totals.homeAnchorMotionCount += homeAnchorMotion.length;
    totals.homeSceneFrameMotionCount += homeSceneFrameMotion.length;

    results.push({
      file: rel(filePath),
      unknown,
      deprecated,
      brokenAnchors,
      homeAnchorMotion,
      homeSceneFrameMotion,
    });
  }

  if (shouldWriteReport) {
    await writeReport(results, totals);
  }

  if (
    totals.unknownCount
    || totals.deprecatedCount
    || totals.anchorCount
    || totals.homeAnchorMotionCount
    || totals.homeSceneFrameMotionCount
  ) {
    console.error(
      `Contract check failed: unknown=${totals.unknownCount}, deprecated=${totals.deprecatedCount}, brokenAnchors=${totals.anchorCount}, homeAnchorMotion=${totals.homeAnchorMotionCount}, homeSceneFrameMotion=${totals.homeSceneFrameMotionCount}`,
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
