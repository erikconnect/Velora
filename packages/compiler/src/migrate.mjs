#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanFiles } from "./scan-files.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIR = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_ROOT = path.resolve(PACKAGE_DIR, "..", "..", "apps", "showcase", "pages");

const MOTION_ATTR_PRIORITY = [
  "vl-enter",
  "vl-exit",
  "vl-scroll",
  "vl-loop-effect",
  "vl-hover",
  "vl-state",
  "vl-effect",
];

function getArgValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function rel(root, filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function normalizeTimeValue(raw = "") {
  const value = raw.trim();
  if (/^\d*\.?\d+$/.test(value)) {
    return `${Math.round(Number.parseFloat(value) * 1000)}ms`;
  }
  return value;
}

function parseTagAttributes(tag) {
  const attrs = [];
  let i = 0;

  while (i < tag.length && tag[i] !== "<") i++;
  if (i < tag.length && tag[i] === "<") i++;
  while (i < tag.length && /[a-zA-Z0-9:-]/.test(tag[i])) i++;

  while (i < tag.length) {
    const tokenStart = i;
    while (i < tag.length && /\s/.test(tag[i])) i++;

    if (i >= tag.length || tag[i] === ">") break;
    if (tag[i] === "/" && tag[i + 1] === ">") break;

    const nameStart = i;
    while (i < tag.length && !/[\s=>/]/.test(tag[i])) i++;
    const name = tag.slice(nameStart, i);

    while (i < tag.length && /\s/.test(tag[i])) i++;

    let value = "";
    let hasValue = false;

    if (tag[i] === "=") {
      hasValue = true;
      i++;
      while (i < tag.length && /\s/.test(tag[i])) i++;

      if (tag[i] === '"' || tag[i] === "'") {
        const quote = tag[i++];
        const valueStart = i;
        while (i < tag.length && tag[i] !== quote) i++;
        value = tag.slice(valueStart, i);
        if (i < tag.length) i++;
      } else {
        const valueStart = i;
        while (i < tag.length && !/[\s>]/.test(tag[i])) i++;
        value = tag.slice(valueStart, i);
      }
    }

    const tokenEnd = i;
    attrs.push({
      name,
      value,
      hasValue,
      tokenStart,
      tokenEnd,
    });
  }

  return attrs;
}

function applyOps(tag, ops) {
  if (!ops.length) return tag;

  const sorted = [...ops].sort((a, b) => b.start - a.start);
  let next = tag;

  for (const op of sorted) {
    next = `${next.slice(0, op.start)}${op.replacement}${next.slice(op.end)}`;
  }

  return next;
}

function migrateTag(tag, counters) {
  const attrs = parseTagAttributes(tag);
  if (!attrs.length) return tag;

  const byName = new Map();
  for (const attr of attrs) {
    byName.set(attr.name, attr);
  }

  const ops = [];

  const staggerAttr = byName.get("vl-stagger");
  if (staggerAttr?.hasValue) {
    const nextStagger = normalizeTimeValue(staggerAttr.value);
    if (nextStagger !== staggerAttr.value) {
      ops.push({
        start: staggerAttr.tokenStart,
        end: staggerAttr.tokenEnd,
        replacement: ` vl-stagger="${nextStagger}"`,
      });
      counters.staggerNormalized += 1;
    }
  }

  const delayAttr = byName.get("vl-delay");
  if (delayAttr) {
    const delayValue = normalizeTimeValue(delayAttr.value || "");
    if (!staggerAttr && delayValue) {
      const insertPos = tag.endsWith("/>") ? tag.length - 2 : tag.length - 1;
      ops.push({
        start: insertPos,
        end: insertPos,
        replacement: ` vl-stagger="${delayValue}"`,
      });
      counters.delayToStagger += 1;
    }

    ops.push({
      start: delayAttr.tokenStart,
      end: delayAttr.tokenEnd,
      replacement: "",
    });
  }

  const easingAttr = byName.get("vl-easing");
  const durationAttr = byName.get("vl-duration");

  const motionAttr = MOTION_ATTR_PRIORITY
    .map((name) => byName.get(name))
    .find((attr) => attr?.hasValue && attr.value.trim());

  if (motionAttr) {
    let motionValue = motionAttr.value.trim();
    let changed = false;

    if (durationAttr?.hasValue && !motionValue.includes("@") && !motionValue.includes(":") && !motionValue.includes(" ")) {
      motionValue = `${motionValue}@${durationAttr.value.trim()}`;
      changed = true;
      counters.durationInlined += 1;
    }

    if (easingAttr?.hasValue && !motionValue.includes("/") && !motionValue.includes(":") && !motionValue.includes(" ")) {
      motionValue = `${motionValue}/${easingAttr.value.trim()}`;
      changed = true;
      counters.easingInlined += 1;
    }

    if (changed) {
      ops.push({
        start: motionAttr.tokenStart,
        end: motionAttr.tokenEnd,
        replacement: ` ${motionAttr.name}="${motionValue}"`,
      });

      if (easingAttr) {
        ops.push({
          start: easingAttr.tokenStart,
          end: easingAttr.tokenEnd,
          replacement: "",
        });
      }
    }
  }

  return applyOps(tag, ops);
}

function migrateContent(content, counters) {
  const TAG_RE = /<([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?\/?>/gs;
  const tagRe = new RegExp(TAG_RE.source, TAG_RE.flags);

  let output = "";
  let cursor = 0;
  let match;

  while ((match = tagRe.exec(content))) {
    const originalTag = match[0];
    const migratedTag = migrateTag(originalTag, counters);

    output += content.slice(cursor, match.index);
    output += migratedTag;
    cursor = match.index + originalTag.length;
  }

  output += content.slice(cursor);
  return output;
}

async function main() {
  const root = path.resolve(getArgValue("--root", DEFAULT_ROOT));
  const write = process.argv.includes("--write");

  const allFiles = await scanFiles(root);
  const files = allFiles.filter((file) => file.endsWith(".html") || file.endsWith(".astro"));

  const counters = {
    filesChanged: 0,
    staggerNormalized: 0,
    delayToStagger: 0,
    durationInlined: 0,
    easingInlined: 0,
  };

  const changedFiles = [];

  for (const file of files) {
    const before = await fs.readFile(file, "utf8");
    const after = migrateContent(before, counters);

    if (after === before) continue;

    counters.filesChanged += 1;
    changedFiles.push(file);

    if (write) {
      await fs.writeFile(file, after, "utf8");
    }
  }

  const mode = write ? "write" : "dry-run";
  console.log(`Velora Motion Migrator (${mode}) scanned ${files.length} file(s).`);
  console.log(`- Changed files: ${counters.filesChanged}`);
  console.log(`- vl-stagger normalized: ${counters.staggerNormalized}`);
  console.log(`- vl-delay -> vl-stagger: ${counters.delayToStagger}`);
  console.log(`- inline @duration: ${counters.durationInlined}`);
  console.log(`- inline /easing: ${counters.easingInlined}`);

  if (changedFiles.length) {
    console.log("\nChanged files:");
    for (const file of changedFiles) {
      console.log(`- ${rel(root, file)}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
