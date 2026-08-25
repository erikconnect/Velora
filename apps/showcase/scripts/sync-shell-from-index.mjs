/**
 * Synchronize the canonical Velora shell across registered Showcase pages.
 * Home owns the exact Header and Footer markup. The Bussola keeps page-specific
 * stops, but always carries the same Velora signature and structural contract.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listTemplatePages } from "../config/template-registry.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SHOWCASE_ROOT = path.resolve(SCRIPT_DIR, "..");
const HOME_FILE = path.join(SHOWCASE_ROOT, "index.html");
const BUSSOLA_OPEN = '<nav class="showcase-cinema-rail vl-bussola" data-velora-signature="bussola" aria-label="Velora page compass">';
const BUSSOLA_CAP = '<span class="vl-bussola__cap" aria-hidden="true">&#x2726;&nbsp;velora</span>';

function extractBlock(html, start, end, fileName) {
  const from = html.indexOf(start);
  const to = html.indexOf(end, from);
  if (from < 0 || to < 0) throw new Error(`${fileName}: missing ${start} / ${end}`);
  return html.slice(from, to + end.length);
}

function replaceBlock(html, start, end, replacement, fileName) {
  const current = extractBlock(html, start, end, fileName);
  return html.replace(current, replacement);
}

function normalizeBussola(html, fileName) {
  const current = extractBlock(html, '<nav class="showcase-cinema-rail', "</nav>", fileName);
  const stops = current.match(/class="vl-bussola__stop"/g)?.length ?? 0;
  if (stops < 1 || stops > 6) {
    throw new Error(`${fileName}: Bussola must expose 1–6 page stops; found ${stops}`);
  }

  let next = current.replace(/<nav class="showcase-cinema-rail[^>]*>/, BUSSOLA_OPEN);
  next = next.replace(/<span class="vl-bussola__cap"[^>]*>[\s\S]*?<\/span>/, BUSSOLA_CAP);
  return html.replace(current, next);
}

const home = fs.readFileSync(HOME_FILE, "utf8");
const canonicalHeader = extractBlock(home, '<header class="vl-header', "</header>", "index.html");
const canonicalFooter = extractBlock(home, '<footer class="vl-footer', "</footer>", "index.html");

let updated = 0;
for (const relativeFile of listTemplatePages()) {
  const absoluteFile = path.join(SHOWCASE_ROOT, relativeFile);
  const html = fs.readFileSync(absoluteFile, "utf8");
  let next = normalizeBussola(html, relativeFile);

  if (relativeFile !== "index.html") {
    next = replaceBlock(next, '<header class="vl-header', "</header>", canonicalHeader, relativeFile);
    next = replaceBlock(next, '<footer class="vl-footer', "</footer>", canonicalFooter, relativeFile);
  }

  if (next !== html) {
    fs.writeFileSync(absoluteFile, next, "utf8");
    updated += 1;
    console.log(`Synchronized ${relativeFile}`);
  }
}

console.log(`Velora shell synchronized. Updated pages: ${updated}`);
