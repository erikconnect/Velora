#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractIds, extractInPageAnchors, extractVlAttributes } from "./extract.mjs";
import { generateCssFromAttributes } from "./generate-css.mjs";
import { createMarkdownReport } from "./report.mjs";
import { scanFiles } from "./scan-files.mjs";
import { detectChannelConflicts, validateAttributes } from "./validate.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIR = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_ROOT = path.resolve(PACKAGE_DIR, "..", "..");
const DEFAULT_REPORT_PATH = path.join(PACKAGE_DIR, "output", "motion-compiler-report.md");
const DEFAULT_CSS_PATH = path.join(PACKAGE_DIR, "output", "velora.generated.css");
const NON_BLOCKING_ISSUES_IN_STRICT = new Set([
  "legacy-channel-conflict",
]);

function getArgValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function rel(root, filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

async function main() {
  const root = path.resolve(getArgValue("--root", DEFAULT_ROOT));
  const reportPath = path.resolve(getArgValue("--out", DEFAULT_REPORT_PATH));
  const cssPath = path.resolve(getArgValue("--css-out", DEFAULT_CSS_PATH));
  const shouldWriteReport = process.argv.includes("--report") || process.argv.includes("--strict");
  const shouldGenerateCss = process.argv.includes("--generate-css");
  const strict = process.argv.includes("--strict");

  const files = await scanFiles(root);
  const results = [];
  const allAttrs = [];
  const totals = {
    files: files.length,
    attrs: 0,
    issues: 0,
  };
  let blockingIssues = 0;

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const attrs = extractVlAttributes(content);
    const ids = new Set(extractIds(content));
    const brokenAnchors = extractInPageAnchors(content)
      .filter((anchor) => !ids.has(anchor))
      .map((anchor) => ({
        type: "broken-anchor",
        attr: "href",
        message: `Broken in-page anchor: #${anchor}`,
      }));

    const issues = [
      ...validateAttributes(attrs),
      ...detectChannelConflicts(attrs),
      ...brokenAnchors,
    ];
    const fileBlockingIssues = issues.filter((issue) => !NON_BLOCKING_ISSUES_IN_STRICT.has(issue.type));

    totals.attrs += attrs.length;
    totals.issues += issues.length;
    blockingIssues += fileBlockingIssues.length;
    allAttrs.push(...attrs);

    if (attrs.length || issues.length) {
      results.push({
        file: rel(root, file),
        attrs,
        issues,
      });
    }
  }

  if (shouldWriteReport) {
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, createMarkdownReport(results, totals), "utf8");
    console.log(`Velora Motion Compiler report written to ${rel(root, reportPath)}`);
  }

  if (shouldGenerateCss) {
    const css = generateCssFromAttributes(allAttrs);
    await fs.mkdir(path.dirname(cssPath), { recursive: true });
    await fs.writeFile(cssPath, css, "utf8");
    console.log(`Velora generated CSS written to ${rel(root, cssPath)}`);
  }

  const summary = `Velora Motion Compiler scanned ${totals.files} file(s), found ${totals.attrs} vl-* attribute(s), and reported ${totals.issues} issue(s).`;

  if (strict && blockingIssues) {
    console.error(`${summary} Blocking issue(s): ${blockingIssues}.`);
    process.exitCode = 1;
    return;
  }

  console.log(summary);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
