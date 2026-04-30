/**
 * Gera páginas do showcase a partir de packages/pages/*.html
 * — Sem Tailwind: conteúdo sem classes utilitárias externas; tipografia em library-doc-content.css
 * — Temas editorial Noir / Earth tech (DESIGN.md em velora_noir e velora_earth_tech)
 * — Header/footer iguais à homepage atual (index.html)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { LIBRARY_PAGE_METADATA } from "./lib/library-page-metadata.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(scriptPath);
const showcaseRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(showcaseRoot, "../..");
const sourceDir = path.join(repoRoot, "packages", "pages");
const outDir = path.join(showcaseRoot, "pages", "library");
const indexPath = path.join(showcaseRoot, "index.html");

/** Origem cujo conteúdo editorial vive na galeria interativa em pages/library/gallery.html */
const SKIP_FROM_PORT = new Set(["component_gallery.html"]);

function toKebabBase(filename) {
  return filename.replace(/\.html$/i, "").replace(/_/g, "-");
}

export function normalizeLibraryTitle(file, rawTitle) {
  if (rawTitle && rawTitle !== file) return rawTitle.trim();

  return file
    .replace(/\.html$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getLibraryPageMeta(file) {
  return LIBRARY_PAGE_METADATA[file] ?? {
    template: "spec",
    category: "Library",
    eyebrow: "Library Entry",
    lead: "Generated from packages/pages and styled within the Velora documentation system.",
    features: ["Library"],
    related: ["/pages/library/index.html", "/pages/library/gallery.html"],
  };
}

export function normalizeCatalogEntry({ file, title }) {
  return {
    file,
    title: normalizeLibraryTitle(file, title),
    slug: toKebabBase(file),
  };
}

function extractFromIndex(html) {
  const header = html.match(/<header class="vl-header[\s\S]*?<\/header>/i)?.[0];
  const footer = html.match(/<footer class="vl-footer[\s\S]*?<\/footer>/i)?.[0];
  if (!header || !footer) throw new Error("Could not extract header/footer from index.html");
  return { header, footer };
}

function extractMainInner(html) {
  const m = html.match(/<main[^>]*>([\s\S]*)<\/main>/i);
  if (!m) return null;
  return m[1] || "";
}

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

function stripClasses(html) {
  return html.replace(/\s+class="[^"]*"/g, "").replace(/\s+class='[^']*'/g, "");
}

function stripDataAttrs(html) {
  return html
    .replace(/\s+data-[a-zA-Z0-9_-]+="[^"]*"/g, "")
    .replace(/\s+data-[a-zA-Z0-9_-]+='[^']*'/g, "");
}

function addVeloraSectionMotion(inner) {
  return inner.replace(/<section([^>]*)>/gi, (full, attrs) => {
    if (/vl-effect\s*=/.test(attrs)) return full;
    return `<section vl-effect="fade-up" vl-timeline="view" vl-range="entry 5% cover 65%"${attrs}>`;
  });
}

export function sanitizeMainInner(inner) {
  let html = stripScripts(inner);
  html = stripClasses(html);
  html = stripDataAttrs(html);
  html = html
    .replace(/\s+style="[^"]*"/g, "")
    .replace(/\s+style='[^']*'/g, ""); /* remove estilos inline utilitários legados */
  html = addVeloraSectionMotion(html);
  return html.trim();
}

function buildFeatureChips(features = []) {
  return features.map((item) => `<li class="lib-page-chip">${escapeHtml(item)}</li>`).join("");
}

function relatedLinkLabel(href) {
  const base = href.split("/").pop() || href;
  return base
    .replace(/-/g, " ")
    .replace(/\.html$/i, "")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildRelatedLinks(links = []) {
  return links
    .map(
      (href) =>
        `<a class="lib-page-related__link vl-card" href="${escapeHtml(href)}">${escapeHtml(relatedLinkLabel(href))}</a>`
    )
    .join("");
}

export function buildLibraryPage({ title, metaDesc, inner, header, footer, pageMeta, outName }) {
  const desc =
    metaDesc ||
    "Velora — documentação editorial com design system nativo (sem Tailwind), temas Noir e Earth tech.";

  const displayTitle = pageMeta.displayTitle ?? title;
  const sourceFile = outName.replace(/-/g, "_");
  const pageSlug = outName.replace(/\.html$/i, "");

  return `<!DOCTYPE html>
<html lang="en" data-editorial-theme="noir" data-theme="dark" vl-page-transition="cinema">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${desc.replace(/"/g, "&quot;")}" />
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="icon" type="image/svg+xml" href="/img/favicon.svg" />
    <link rel="stylesheet" href="/css/velora.css" />
    <link rel="stylesheet" href="/css/showcase.css" />
    <link rel="stylesheet" href="/css/library-doc-content.css" />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <style>@view-transition { navigation: auto; }</style>
  </head>
  <body>
    <a class="vl-sr-only" href="#content">Skip to content</a>
    <div class="vl-scroll-progress vl-scroll-progress--glow"></div>

    ${header}

    <main id="content" class="vl-main lib-packages-main lib-page lib-page--${pageMeta.template} lib-page--${pageSlug}">
      <section class="vl-container lib-page-hero" aria-label="Page introduction">
        <p class="vl-kicker lib-page-hero__eyebrow" vl-effect="fade-in" vl-timeline="view">${escapeHtml(pageMeta.eyebrow)}</p>
        <h1 class="lib-page-hero__title" vl-effect="clip-rise" vl-timeline="view">${escapeHtml(displayTitle)}</h1>
        <p class="lib-page-hero__lead" vl-effect="fade-up" vl-timeline="view">${escapeHtml(pageMeta.lead)}</p>
        <ul class="lib-page-hero__chips" aria-label="Page highlights">${buildFeatureChips(pageMeta.features)}</ul>
      </section>
      <section class="vl-container lib-page-rail" aria-label="Page orientation">
        <a class="lib-page-rail__back" href="/pages/library/index.html">Back to Library</a>
        <p class="lib-page-rail__type">${escapeHtml(pageMeta.template)}</p>
        <p class="lib-page-rail__source"><code>packages/pages/${escapeHtml(sourceFile)}</code></p>
      </section>
      <section class="vl-container lib-doc">
        <article class="lib-doc-article">
${inner}
        </article>
      </section>
      <section class="vl-container lib-page-related" aria-label="Related reading">
        <h2 class="lib-page-related__title">Related reading</h2>
        <div class="lib-page-related__grid">${buildRelatedLinks(pageMeta.related)}</div>
      </section>
    </main>

    ${footer}

    <script src="/js/showcase-controls.js"></script>
  </body>
</html>
`;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function buildLibraryIndex(catalog, header, footer) {
  const cards = catalog
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(
      (c) => `
            <a class="ds-page-card vl-card lib-index-card" href="${c.href}" vl-effect="fade-up" vl-timeline="view">
              <p class="vl-kicker">packages/pages</p>
              <div class="vl-card__title">${escapeHtml(c.title)}</div>
              <p class="vl-card__body">${escapeHtml(c.file)}</p>
            </a>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en" data-editorial-theme="noir" data-theme="dark" vl-page-transition="cinema">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Índice das páginas migradas de packages/pages — Velora CSS, temas Noir / Earth tech, sem Tailwind." />
    <title>Biblioteca · packages/pages | Velora</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="icon" type="image/svg+xml" href="/img/favicon.svg" />
    <link rel="stylesheet" href="/css/velora.css" />
    <link rel="stylesheet" href="/css/showcase.css" />
    <link rel="stylesheet" href="/css/library-doc-content.css" />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <style>@view-transition { navigation: auto; }</style>
  </head>
  <body>
    <a class="vl-sr-only" href="#content">Skip to content</a>
    <div class="vl-scroll-progress vl-scroll-progress--glow"></div>
    ${header}
    <main id="content" class="vl-main">
      <section class="lib-index-hero vl-container" aria-label="Introdução">
        <p class="vl-kicker" vl-effect="fade-in" vl-timeline="view">Design library</p>
        <h1 class="hp-section__title" vl-effect="clip-rise" vl-timeline="view">Conteúdo de <code>packages/pages</code></h1>
        <p class="hp-section__lead vl-delay-100" vl-effect="fade-up" vl-timeline="view">
          Páginas geradas sem Tailwind a partir dos HTML em <code>packages/pages</code>: alinham-se ao framework
          Velora (<code>packages/css</code>) com tokens, tipografia e padrões <code>vl-*</code>; temas editoriais
          <strong>Noir</strong> e <strong>Earth tech</strong>. A
          <a href="/pages/library/gallery.html">galeria de componentes</a> mostra primitivos navegáveis com pesquisa.
        </p>
      </section>
      <section class="vl-container lib-index-grid-wrap" aria-label="Lista de páginas" vl-children="stagger" vl-stagger="120ms" vl-speed="slow">
        <div class="hp-catalog-rail">
${cards}
        </div>
      </section>
    </main>
    ${footer}
    <script src="/js/showcase-controls.js"></script>
  </body>
</html>
`;
}

function main() {
  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const { header, footer } = extractFromIndex(indexHtml);

  if (!fs.existsSync(sourceDir)) {
    console.error("Missing:", sourceDir);
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".html"));
  const catalog = [];

  const orphanLegacy = path.join(outDir, "component-gallery.html");
  if (fs.existsSync(orphanLegacy)) {
    fs.unlinkSync(orphanLegacy);
    console.log("Removed legacy", path.relative(showcaseRoot, orphanLegacy));
  }

  for (const file of files) {
    if (SKIP_FROM_PORT.has(file)) {
      console.warn("Skip (gallery lives at pages/library/gallery.html):", file);
      continue;
    }
    const srcPath = path.join(sourceDir, file);
    const raw = fs.readFileSync(srcPath, "utf8");
    const titleMatch = raw.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : file;
    const metaMatch = raw.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
    const metaDesc = metaMatch?.[1];

    const mainInner = extractMainInner(raw);
    if (mainInner === null) {
      console.warn("Skip (no main):", file);
      continue;
    }

    const inner = sanitizeMainInner(mainInner);
    const normalized = normalizeCatalogEntry({ file, title });
    const pageMeta = getLibraryPageMeta(file);
    const outName = `${normalized.slug}.html`;
    const outPath = path.join(outDir, outName);

    const page = buildLibraryPage({
      title: normalized.title,
      metaDesc,
      inner,
      header,
      footer,
      pageMeta,
      outName,
    });

    fs.writeFileSync(outPath, page, "utf8");
    catalog.push({
      href: `/pages/library/${outName}`,
      title: normalized.title,
      file,
      template: pageMeta.template,
      category: pageMeta.category,
    });
    console.log("Wrote", path.relative(showcaseRoot, outPath));
  }

  catalog.push({
    href: "/pages/library/gallery.html",
    title: "Galeria de componentes (interativa)",
    file: "component_gallery.html → pesquisa e categorias",
  });

  const indexPage = buildLibraryIndex(catalog, header, footer);
  fs.writeFileSync(path.join(outDir, "index.html"), indexPage, "utf8");
  console.log("Wrote library index with", catalog.length, "pages");
}

const isMainModule =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(scriptPath);

if (isMainModule) {
  main();
}
