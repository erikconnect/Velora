#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractVlAttributes } from "../../../packages/compiler/src/extract.mjs";
import { KNOWN_PRESETS } from "../../../packages/compiler/src/grammar.mjs";
import { SHOWCASE_COVERAGE } from "../config/showcase-coverage.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SHOWCASE_ROOT = path.resolve(SCRIPT_DIR, "..");
const ELEMENTS_FILE = path.join(SHOWCASE_ROOT, "pages/core/elements.html");
const CATALOG_FILE = path.join(SHOWCASE_ROOT, "pages/motion/api-motion-catalog.html");
const MOTION_LAB_FILE = path.join(SHOWCASE_ROOT, "pages/motion/motion-lab.html");
const OUTPUT_FILE = path.join(SHOWCASE_ROOT, "output/showcase-coverage.md");
const MOTION_CHANNELS = new Set([
  "vl-base", "vl-enter", "vl-exit", "vl-scroll", "vl-loop-effect", "vl-hover", "vl-state", "vl-effect",
]);

function extractClasses(content) {
  const classes = new Set();
  for (const match of content.matchAll(/class=["']([^"']*)["']/g)) {
    for (const className of match[1].split(/\s+/)) {
      if (className) classes.add(className);
    }
  }
  return classes;
}

function heading(title) {
  return `\n## ${title}\n`;
}

const elements = await fs.readFile(ELEMENTS_FILE, "utf8");
const catalog = await fs.readFile(CATALOG_FILE, "utf8");
const motionLab = await fs.readFile(MOTION_LAB_FILE, "utf8");
const elementClasses = extractClasses(elements);
const issues = [];
const lines = ["# Showcase Coverage", "", "Generated from the public Showcase contract."];

lines.push(heading("Page roles"));
lines.push("| Page | Role | Signature proof | Motion nodes |", "| --- | --- | --- | ---: |");
for (const [relativeFile, page] of Object.entries(SHOWCASE_COVERAGE.pages)) {
  const content = await fs.readFile(path.join(SHOWCASE_ROOT, relativeFile), "utf8");
  const motionCount = extractVlAttributes(content).filter((attr) => MOTION_CHANNELS.has(attr.name)).length;
  lines.push(`| ${page.name} | ${page.role} | ${page.signature} | ${motionCount} |`);
}

lines.push(heading("Elements component groups"));
lines.push("| Group | Required families | Status |", "| --- | --- | --- |");
for (const [group, classes] of Object.entries(SHOWCASE_COVERAGE.componentGroups)) {
  const missing = classes.filter((className) => !elementClasses.has(className));
  if (missing.length) issues.push(`${group}: missing ${missing.join(", ")}`);
  lines.push(`| ${group} | ${classes.map((name) => `\`${name}\``).join(", ")} | ${missing.length ? `Missing: ${missing.join(", ")}` : "Covered"} |`);
}

lines.push(heading("Catalog intent routes"));
lines.push("| Intent | Required anchors | Status |", "| --- | --- | --- |");
for (const [intent, anchors] of Object.entries(SHOWCASE_COVERAGE.catalogIntents)) {
  const missing = anchors.filter((anchor) => !catalog.includes(`id="${anchor}"`));
  if (missing.length) issues.push(`${intent}: missing #${missing.join(", #")}`);
  lines.push(`| ${intent} | ${anchors.map((anchor) => `[#${anchor}](#${anchor})`).join(", ")} | ${missing.length ? `Missing: ${missing.join(", ")}` : "Covered"} |`);
}

const catalogPresets = new Set(
  extractVlAttributes(`${catalog}\n${motionLab}`)
    .filter((attr) => MOTION_CHANNELS.has(attr.name))
    .flatMap((attr) => (attr.value || "").split(/\s+/))
    .filter((value) => KNOWN_PRESETS.has(value)),
);
const missingPresets = [...KNOWN_PRESETS].filter((preset) => !catalogPresets.has(preset));
lines.push(heading("Motion preset coverage"));
lines.push(`- Known presets: **${KNOWN_PRESETS.size}**`);
lines.push(`- Demonstrated across public Catalog + Motion Lab: **${catalogPresets.size}**`);
lines.push(`- Tracked gaps: **${missingPresets.length}**`);
lines.push(`- Gap list: ${missingPresets.map((preset) => `\`${preset}\``).join(", ")}`);

lines.push(heading("Audit result"));
lines.push(issues.length ? issues.map((issue) => `- ${issue}`).join("\n") : "- Coverage contract passed.");

if (process.argv.includes("--write")) {
  await fs.writeFile(OUTPUT_FILE, `${lines.join("\n")}\n`, "utf8");
  console.log(`Coverage report generated at ${path.relative(SHOWCASE_ROOT, OUTPUT_FILE)}.`);
}

console.log(`Showcase coverage: ${Object.keys(SHOWCASE_COVERAGE.pages).length} pages, ${Object.keys(SHOWCASE_COVERAGE.componentGroups).length} component groups, ${missingPresets.length} tracked preset gaps, ${issues.length} issue(s).`);
if (issues.length) process.exitCode = 1;
