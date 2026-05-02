import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_TEMPLATE_NAME,
  TEMPLATE_REGISTRY,
  listTemplatePages,
} from "../config/template-registry.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPORT_PATH = path.join(ROOT, "output", "template-page-audit.md");

function rel(absPath) {
  return path.relative(ROOT, absPath).replaceAll(path.sep, "/");
}

function pick(content, pattern) {
  const m = content.match(pattern);
  return m?.[1]?.trim() ?? "";
}

function hasShell(content) {
  return (
    content.includes("<a class=\"vl-sr-only\"") &&
    content.includes("<header class=\"vl-header") &&
    content.includes("<main id=\"content\"") &&
    content.includes("<footer class=\"vl-footer\"")
  );
}

async function auditPage(pagePath) {
  const abs = path.join(ROOT, pagePath);
  try {
    const content = await fs.readFile(abs, "utf8");
    const title = pick(content, /<title>([^<]+)<\/title>/i);
    const description = pick(content, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    const h1 = pick(content, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const shell = hasShell(content);

    return {
      pagePath,
      exists: true,
      shell,
      title,
      description,
      h1,
      issues: [
        ...(shell ? [] : ["missing-standard-shell"]),
        ...(title ? [] : ["missing-title"]),
        ...(description ? [] : ["missing-meta-description"]),
        ...(h1 ? [] : ["missing-h1"]),
      ],
    };
  } catch {
    return {
      pagePath,
      exists: false,
      shell: false,
      title: "",
      description: "",
      h1: "",
      issues: ["missing-file"],
    };
  }
}

function summarize(results) {
  return {
    pages: results.length,
    missingFiles: results.filter((r) => r.issues.includes("missing-file")).length,
    missingShell: results.filter((r) => r.issues.includes("missing-standard-shell")).length,
    missingTitle: results.filter((r) => r.issues.includes("missing-title")).length,
    missingDescription: results.filter((r) => r.issues.includes("missing-meta-description")).length,
    missingH1: results.filter((r) => r.issues.includes("missing-h1")).length,
    pagesWithIssues: results.filter((r) => r.issues.length > 0).length,
  };
}

async function writeReport(templateName, results, totals) {
  const lines = [];
  lines.push("# Velora Template Page Audit");
  lines.push("");
  lines.push(`- Template: **${templateName}**`);
  lines.push(`- Pages audited: **${totals.pages}**`);
  lines.push(`- Pages with issues: **${totals.pagesWithIssues}**`);
  lines.push(`- Missing files: **${totals.missingFiles}**`);
  lines.push(`- Missing shell: **${totals.missingShell}**`);
  lines.push(`- Missing title: **${totals.missingTitle}**`);
  lines.push(`- Missing description: **${totals.missingDescription}**`);
  lines.push(`- Missing h1: **${totals.missingH1}**`);
  lines.push("");

  lines.push("## Per-page checklist");
  lines.push("");

  for (const result of results) {
    const status = result.issues.length ? "WARN" : "OK";
    lines.push(`### ${status} - \`${result.pagePath}\``);
    lines.push(`- Exists: ${result.exists ? "yes" : "no"}`);
    lines.push(`- Shell: ${result.shell ? "yes" : "no"}`);
    lines.push(`- Title: ${result.title || "(empty)"}`);
    lines.push(`- Description: ${result.description || "(empty)"}`);
    lines.push(`- H1: ${result.h1 || "(empty)"}`);
    lines.push(`- Issues: ${result.issues.length ? result.issues.map((i) => `\`${i}\``).join(", ") : "none"}`);
    lines.push("");
  }

  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  const templateName = process.argv[2] ?? DEFAULT_TEMPLATE_NAME;
  const strict = process.argv.includes("--strict");
  if (!TEMPLATE_REGISTRY[templateName]) {
    console.error(`Unknown template '${templateName}'. Available: ${Object.keys(TEMPLATE_REGISTRY).join(", ")}`);
    process.exitCode = 1;
    return;
  }

  const pages = listTemplatePages(templateName);
  const results = [];

  for (const page of pages) {
    results.push(await auditPage(page));
  }

  const totals = summarize(results);
  await writeReport(templateName, results, totals);

  console.log(`Audit report generated at ${rel(REPORT_PATH)}`);
  console.log(`Pages audited: ${totals.pages}; pages with issues: ${totals.pagesWithIssues}`);

  if (strict && totals.pagesWithIssues > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
