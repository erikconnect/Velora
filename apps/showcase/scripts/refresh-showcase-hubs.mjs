import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { REPLACEMENTS } from "./fill-stub-hub-pages.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, "..");
const pagesRoot = path.join(showcaseRoot, "pages");

const MAIN_BLOCK_RE = /<div class="page-wrap(?: hub-page)?">[\s\S]*?<\/div>\s*<\/main>/;
const STYLESHEET_LINE = '    <link rel="stylesheet" href="/css/showcase-hub-pages.css" />\n';
const STYLESHEET_RE = /<link rel="stylesheet" href="\/css\/showcase-hub-pages\.css" \/>/;
const SHOWCASE_STYLESHEET_RE = /(\s*<link rel="stylesheet" href="\/css\/showcase\.css" \/>\r?\n)/;

function walkHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "library") {
        return [];
      }
      return walkHtmlFiles(fullPath);
    }
    return entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

function extractFirst(html, regex, label, file) {
  const match = html.match(regex);
  if (!match) {
    throw new Error(`Could not parse ${label} in ${path.relative(showcaseRoot, file)}`);
  }
  return match[1].trim();
}

function extractSteps(html, file) {
  const listHtml = extractFirst(
    html,
    /<ul class="vl-body" style="margin:0;padding-left:1\.25rem;max-width:48rem;">([\s\S]*?)<\/ul>/,
    "steps list",
    file
  );

  const items = [...listHtml.matchAll(/<li class="vl-body">([\s\S]*?)<\/li>/g)].map((match) => {
    const rich = match[1].trim();
    const headingMatch = rich.match(/<strong>(.*?)<\/strong>\s*[—-]\s*([\s\S]*)/);
    if (!headingMatch) {
      return { title: rich.replace(/<[^>]+>/g, ""), body: rich };
    }
    return {
      title: headingMatch[1].trim(),
      body: headingMatch[2].trim(),
    };
  });

  if (items.length === 0) {
    throw new Error(`Could not parse step items in ${path.relative(showcaseRoot, file)}`);
  }

  return items;
}

function extractSecondaryLinks(html) {
  const sectionMatch = html.match(
    /<div class="page-links" style="margin-top:0\.75rem;">([\s\S]*?)<\/div>/
  );

  if (!sectionMatch) {
    return [];
  }

  return [...sectionMatch[1].matchAll(/<a class="vl-nav__link" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(
    (match) => ({
      href: match[1].trim(),
      label: match[2].trim(),
    })
  );
}

function buildSpotlightCards(steps) {
  return steps
    .map(
      (step, index) => `        <article class="hub-step-card" vl-effect="fade-up" vl-timeline="view" style="--step-index:${index};">
          <p class="hub-step-card__eyebrow">Framework move ${index + 1}</p>
          <h2 class="hub-step-card__title">${step.title}</h2>
          <p class="hub-step-card__body">${step.body}</p>
        </article>`
    )
    .join("\n");
}

function buildSecondaryLinks(links) {
  if (links.length === 0) {
    return "";
  }

  return links
    .map(
      (link) =>
        `          <a class="hub-chip-link" href="${link.href}" vl-effect="fade-up" vl-timeline="view">${link.label}</a>`
    )
    .join("\n");
}

function buildPageWrap(html, sourceBlock, file) {
  const kicker = extractFirst(html, /<p class="vl-kicker(?: [^"]+)?">([\s\S]*?)<\/p>/, "kicker", file);
  const title = extractFirst(
    html,
    /<h1 class="vl-display-xl(?: [^"]+)?">([\s\S]*?)<\/h1>/,
    "title",
    file
  );
  const lead = extractFirst(
    sourceBlock,
    /<p class="vl-body-lg" style="max-width:48rem;">([\s\S]*?)<\/p>/,
    "lead",
    file
  );
  const primaryHref = extractFirst(
    sourceBlock,
    /<div class="page-links" style="margin-top:1rem;align-items:center;">[\s\S]*?<a class="vl-header-get-started" href="([^"]+)"/,
    "primary href",
    file
  );
  const primaryLabel = extractFirst(
    sourceBlock,
    /<div class="page-links" style="margin-top:1rem;align-items:center;">[\s\S]*?<a class="vl-header-get-started" href="[^"]+"[^>]*>([\s\S]*?)<\/a>/,
    "primary label",
    file
  );
  const steps = extractSteps(sourceBlock, file);
  const secondaryLinks = extractSecondaryLinks(sourceBlock);
  const relativePath = path.relative(showcaseRoot, file).replace(/\\/g, "/");
  const areaLabel = relativePath.split("/")[1] ?? "pages";

  return `    <div class="page-wrap hub-page hub-page--${areaLabel}">
      <section class="hub-hero" vl-effect="fade-up" vl-timeline="view">
        <div class="hub-hero__copy">
          <p class="vl-kicker">${kicker}</p>
          <h1 class="vl-display-xl hub-hero__title">${title}</h1>
          <p class="vl-body-lg hub-hero__lead">${lead}</p>
          <div class="hub-hero__actions">
            <a class="vl-header-get-started" href="${primaryHref}">${primaryLabel}</a>
${buildSecondaryLinks(secondaryLinks)}
          </div>
        </div>
        <aside class="hub-hero__meta" vl-effect="fade-left" vl-timeline="view">
          <p class="hub-hero__meta-label">How this area fits the framework</p>
          <ol class="hub-hero__meta-list">
            ${steps.map((step) => `<li><strong>${step.title}</strong> — ${step.body}</li>`).join("\n            ")}
          </ol>
        </aside>
      </section>

      <section class="hub-grid" vl-children="stagger" vl-stagger="0.08">
${buildSpotlightCards(steps)}
      </section>

      <section class="hub-reference-section">
        <div>
          <p class="hub-section__eyebrow">Canonical source</p>
          <h2 class="vl-title-lg" style="margin:0;">Reference the long-form Library page, then return here to explore the applied system.</h2>
        </div>
        <div class="hub-reference-grid">
          <a class="hub-reference-card" href="${primaryHref}" vl-effect="fade-up" vl-timeline="view">
            <p class="hub-step-card__eyebrow">Primary Library reference</p>
            <h3 class="hub-reference-card__title">${primaryLabel}</h3>
            <p class="hub-reference-card__body">This is the canonical documentation migrated from <code>packages/pages</code>. Use it as the source of truth for ${title.toLowerCase()} and return to this hub for related examples inside the showcase.</p>
          </a>
          <div class="hub-note" vl-effect="fade-up" vl-timeline="view">
            <p class="hub-section__eyebrow">Applied system note</p>
            <p>The hub page is not just a directory entry: it demonstrates the framework in the page itself through tokenized surfaces, editorial hierarchy, motion attributes and static-first HTML.</p>
            <p>Area: <code>${areaLabel}</code>. Source page: <code>${relativePath}</code>.</p>
          </div>
        </div>
      </section>
    </div>
    </main>`;
}

function transformFile(file) {
  let html = fs.readFileSync(file, "utf8");
  const relativePath = path.relative(showcaseRoot, file).replace(/\\/g, "/");
  const sourceBlock = REPLACEMENTS[relativePath];

  if (!sourceBlock) {
    return false;
  }

  if (!MAIN_BLOCK_RE.test(html)) {
    throw new Error(`Could not locate main block in ${path.relative(showcaseRoot, file)}`);
  }

  html = html.replace(MAIN_BLOCK_RE, buildPageWrap(html, sourceBlock, file));

  if (!STYLESHEET_RE.test(html)) {
    html = html.replace(SHOWCASE_STYLESHEET_RE, `$1${STYLESHEET_LINE}`);
  }

  fs.writeFileSync(file, html, "utf8");
  return true;
}

function main() {
  const files = walkHtmlFiles(pagesRoot);
  let updated = 0;

  for (const file of files) {
    if (transformFile(file)) {
      updated++;
      console.log("Updated", path.relative(showcaseRoot, file).replace(/\\/g, "/"));
    }
  }

  console.log("Done. Updated:", updated, "hub pages");
}

main();
