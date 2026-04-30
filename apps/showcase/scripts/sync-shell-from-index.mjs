/**
 * Substitui skip-link + scroll progress + header e footer pelo bloco canónico de index.html
 * em todas as páginas HTML do showcase (exceto node_modules / dist).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, "..");
const indexPath = path.join(showcaseRoot, "index.html");

function walkHtmlFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.name === "node_modules" || ent.name === "dist") continue;
    if (ent.isDirectory()) walkHtmlFiles(p, out);
    else if (ent.name.endsWith(".html")) out.push(p);
  }
  return out;
}

function extractShell(indexHtml) {
  const skip = '<a class="vl-sr-only"';
  const i0 = indexHtml.indexOf(skip);
  if (i0 === -1) throw new Error("index.html: missing skip link");
  const i1 = indexHtml.indexOf("</header>", i0);
  if (i1 === -1) throw new Error("index.html: missing </header>");
  const top = indexHtml.slice(i0, i1 + "</header>".length);

  const f0 = indexHtml.indexOf('<footer class="vl-footer"');
  if (f0 === -1) throw new Error("index.html: missing footer");
  const f1 = indexHtml.indexOf("</footer>", f0);
  if (f1 === -1) throw new Error("index.html: missing </footer>");
  const footer = indexHtml.slice(f0, f1 + "</footer>".length);

  return { top, footer };
}

function replaceTop(html, top) {
  const skip = '<a class="vl-sr-only"';
  const i0 = html.indexOf(skip);
  if (i0 === -1) return null;
  const i1 = html.indexOf("</header>", i0);
  if (i1 === -1) return null;
  return html.slice(0, i0) + top + html.slice(i1 + "</header>".length);
}

function replaceFooter(html, footer) {
  const f0 = html.indexOf('<footer class="vl-footer"');
  if (f0 === -1) return null;
  const f1 = html.indexOf("</footer>", f0);
  if (f1 === -1) return null;
  return html.slice(0, f0) + footer + html.slice(f1 + "</footer>".length);
}

function main() {
  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const { top, footer } = extractShell(indexHtml);
  const files = walkHtmlFiles(showcaseRoot).filter((f) => f !== indexPath);

  let n = 0;
  for (const file of files) {
    let html = fs.readFileSync(file, "utf8");
    if (!html.includes('<header class="vl-header')) continue;

    let next = replaceTop(html, top);
    if (next === null) {
      console.warn("Skip top (no vl-sr-only / header):", path.relative(showcaseRoot, file));
      continue;
    }
    next = replaceFooter(next, footer);
    if (next === null) {
      console.warn("Skip footer:", path.relative(showcaseRoot, file));
      continue;
    }
    if (next === html) {
      console.warn("Unchanged:", path.relative(showcaseRoot, file));
      continue;
    }
    fs.writeFileSync(file, next, "utf8");
    n++;
    console.log("Updated", path.relative(showcaseRoot, file));
  }
  console.log("Done. Files updated:", n);
}

main();
