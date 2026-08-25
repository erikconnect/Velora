/**
 * Apply lean Showcase primary nav + footer to live HTML files.
 * Live IA is six routes only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NAV = `        <nav class="vl-header__nav" aria-label="Primary navigation">
          <a class="vl-nav__link" href="/index.html" vl-hover="underline-expand">Home</a>
          <a class="vl-nav__link" href="/pages/scenes/scene-timeline.html" vl-hover="underline-expand">Timeline</a>
          <a class="vl-nav__link" href="/pages/core/skins.html" vl-hover="underline-expand">Skins</a>
          <a class="vl-nav__link" href="/pages/motion/api-motion-catalog.html" vl-hover="underline-expand">Catalog</a>
          <a class="vl-nav__link" href="/pages/core/hosts.html" vl-hover="underline-expand">Hosts</a>
          <a class="vl-nav__link" href="/pages/core/archive.html" vl-hover="underline-expand">Archive</a>
        </nav>`;

const MOBILE = `        <nav class="vl-header__mobile-nav" aria-label="Mobile navigation">
          <a class="vl-header__mobile-link" href="/index.html">Home</a>
          <a class="vl-header__mobile-link" href="/pages/scenes/scene-timeline.html">Timeline</a>
          <a class="vl-header__mobile-link" href="/pages/core/skins.html">Skins</a>
          <a class="vl-header__mobile-link" href="/pages/motion/api-motion-catalog.html">Catalog</a>
          <a class="vl-header__mobile-link" href="/pages/core/hosts.html">Hosts</a>
          <a class="vl-header__mobile-link" href="/pages/core/archive.html">Archive</a>
        </nav>`;

const FOOTER_COLS = `          <div class="vl-footer__col">
            <h3 class="vl-footer__heading">Showcase</h3>
            <ul class="vl-footer__links">
              <li><a class="vl-footer__link" href="/index.html">Home</a></li>
              <li><a class="vl-footer__link" href="/pages/scenes/scene-timeline.html">Timeline</a></li>
              <li><a class="vl-footer__link" href="/pages/core/skins.html">Skins</a></li>
              <li><a class="vl-footer__link" href="/pages/motion/api-motion-catalog.html">Catalog</a></li>
              <li><a class="vl-footer__link" href="/pages/core/hosts.html">Hosts</a></li>
              <li><a class="vl-footer__link" href="/pages/core/archive.html">Archive</a></li>
            </ul>
          </div>`;

const files = [
  "index.html",
  "pages/scenes/scene-timeline.html",
  "pages/motion/api-motion-catalog.html",
  "pages/core/skins.html",
  "pages/core/hosts.html",
  "pages/core/archive.html",
];

function patch(html) {
  let out = html.replace(
    /<nav class="vl-header__nav"[^>]*>[\s\S]*?<\/nav>/,
    NAV,
  );
  out = out.replace(
    /<nav class="vl-header__mobile-nav"[^>]*>[\s\S]*?<\/nav>/,
    MOBILE,
  );
  out = out.replace(
    /href="\/pages\/tools\/architecture\.html"/g,
    'href="/pages/scenes/scene-timeline.html"',
  );
  out = out.replace(
    /<div class="vl-footer__col">\s*<h3 class="vl-footer__heading">Framework<\/h3>[\s\S]*?<h3 class="vl-footer__heading">Tools<\/h3>[\s\S]*?<\/ul>\s*<\/div>/,
    FOOTER_COLS,
  );
  return out;
}

for (const rel of files) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    console.warn("skip missing", rel);
    continue;
  }
  const before = fs.readFileSync(abs, "utf8");
  const after = patch(before);
  if (before === after) {
    console.warn("no nav/footer match:", rel);
  }
  fs.writeFileSync(abs, after);
  console.log("patched", rel);
}
