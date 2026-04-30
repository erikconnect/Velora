/**
 * Remove Tailwind CDN + inline config, liga CSS compilado localmente,
 * substitui footer “custom” pelo vl-footer canónico onde aplicável.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const footerPath = path.join(root, "partials", "vl-footer.html");
const vlFooter = fs.readFileSync(footerPath, "utf8");

const targets = [
  "pages/motion/zero-js-motion.html",
  "pages/motion/motion-extended.html",
  "pages/motion/kinetic-cards.html",
  "pages/motion/3d-rotation.html",
  "pages/motion/3d-explorer.html",
  "pages/library/gallery.html",
  "pages/scenes/scroll-reveal.html",
];

const LINK_BLOCK = `
    <link rel="stylesheet" href="/css/showcase-tw-demos.css" />
    <link rel="stylesheet" href="/css/showcase-demo-extras.css" />
`;

function stripTailwindCdn(html) {
  let out = html.replace(
    /<script src="https:\/\/cdn\.tailwindcss\.com[^"]*"><\/script>\s*/g,
    ""
  );
  out = out.replace(/<script id="tailwind-config">[\s\S]*?<\/script>\s*/g, "");
  return out;
}

function ensureDemoCssLinks(html) {
  if (html.includes("showcase-tw-demos.css")) return html;
  const needles = [
    '<link href="/css/showcase.css" rel="stylesheet"/>',
    '<link rel="stylesheet" href="/css/showcase.css" />',
  ];
  for (const needle of needles) {
    if (html.includes(needle)) {
      return html.replace(needle, needle + LINK_BLOCK);
    }
  }
  throw new Error("showcase.css link not found");
}

function replaceBadSiteFooter(html) {
  const re =
    /<footer class="w-full border-t border-white\/5 tonal-transition bg-\[#090b08\][^]*?<\/footer>/g;
  return html.replace(re, vlFooter);
}

function ensureHtmlShell(html) {
  let out = html;
  if (out.includes('data-editorial-theme="noir"')) return out;
  out = out.replace(
    /<html class="dark" lang="en">/,
    '<html class="dark" lang="en" data-editorial-theme="noir" data-theme="dark" vl-page-transition="cinema">'
  );
  return out;
}

function injectFooterIfMissing(html) {
  if (html.includes('footer class="vl-footer"')) return html;
  const before = '<script src="/js/showcase-controls.js"></script>';
  if (!html.includes(before)) return html;
  return html.replace(before, vlFooter + "\n" + before);
}

for (const rel of targets) {
  const file = path.join(root, rel);
  let html = fs.readFileSync(file, "utf8");
  html = stripTailwindCdn(html);
  html = ensureDemoCssLinks(html);
  html = ensureHtmlShell(html);
  html = replaceBadSiteFooter(html);
  html = injectFooterIfMissing(html);
  fs.writeFileSync(file, html, "utf8");
  console.log("OK", rel);
}

console.log("Done.");
