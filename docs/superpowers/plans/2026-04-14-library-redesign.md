# Library Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `apps/showcase/pages/library` into a hybrid editorial-technical documentation surface with reusable template families, stronger motion, and a curated Library index, all generated from `packages/pages` while staying inside the existing Velora design system.

**Architecture:** Move the current port script from a flat “drop sanitized HTML into an article shell” approach to a typed page-generation pipeline driven by page metadata. Keep the global shell from `apps/showcase/index.html`, generate richer page scaffolds in `scripts/port-packages-pages.mjs`, and centralize layout styling in `public/css/library-doc-content.css`. Treat the interactive `gallery.html` as a first-class Library entry that visually aligns with the new family but keeps its custom body.

**Tech Stack:** Node.js ESM scripts, built-in `node:test`, static HTML, Velora CSS tokens, `showcase.css`, `library-doc-content.css`, Vite build verification

---

## File Map

### Create
- `apps/showcase/scripts/lib/library-page-metadata.mjs` — metadata map for each Library page: template family, eyebrow, lead, feature bullets, related links, and index grouping.
- `apps/showcase/scripts/lib/port-library-pages.test.mjs` — unit tests for page classification, title normalization, and generated Library page/index markup.

### Modify
- `apps/showcase/scripts/port-packages-pages.mjs` — refactor generator to consume metadata, emit template-specific page structure, normalize titles, and generate a curated index.
- `apps/showcase/public/css/library-doc-content.css` — shared Library layout, hero, orientation rail, sticky TOC, template variants, related-reading, and index styling.
- `apps/showcase/pages/library/gallery.html` — align intro, navigation cues, and related-reading with the new Library family while preserving custom interactive content.
- `apps/showcase/package.json` — add a test script for Library generation helpers.

### Verify
- `apps/showcase/pages/library/index.html`
- `apps/showcase/pages/library/architectural-blueprint.html`
- `apps/showcase/pages/library/tokens-foundation-refined.html`
- `apps/showcase/pages/library/motion-principles-overview.html`
- `apps/showcase/pages/library/contrast-accessibility-tool.html`
- `apps/showcase/pages/library/velora-landing-page-refined.html`
- `apps/showcase/pages/library/gallery.html`

---

### Task 1: Extract Metadata And Testable Generator Helpers

**Files:**
- Create: `apps/showcase/scripts/lib/library-page-metadata.mjs`
- Create: `apps/showcase/scripts/lib/port-library-pages.test.mjs`
- Modify: `apps/showcase/scripts/port-packages-pages.mjs`
- Modify: `apps/showcase/package.json`

- [ ] **Step 1: Add a failing unit test for page metadata, title normalization, and template resolution**

```js
// apps/showcase/scripts/lib/port-library-pages.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {
  getLibraryPageMeta,
  normalizeLibraryTitle,
  normalizeCatalogEntry,
} from "../port-packages-pages.mjs";

test("normalizeLibraryTitle converts underscored filenames into readable titles", () => {
  assert.equal(
    normalizeLibraryTitle("tokens_foundation_refined.html", "tokens_foundation_refined.html"),
    "Tokens Foundation Refined"
  );
});

test("metadata resolves template families for curated pages", () => {
  const architecture = getLibraryPageMeta("architectural_blueprint.html");
  const motion = getLibraryPageMeta("zero_js_motion_examples.html");

  assert.equal(architecture.template, "spec");
  assert.equal(motion.template, "showcase");
});

test("catalog entries prefer curated titles over raw filenames", () => {
  const entry = normalizeCatalogEntry({
    file: "system_modules_overview.html",
    title: "system_modules_overview.html",
  });

  assert.equal(entry.title, "System Modules Overview");
  assert.equal(entry.slug, "system-modules-overview");
});
```

- [ ] **Step 2: Run the test to verify it fails before the refactor**

Run: `node --test apps/showcase/scripts/lib/port-library-pages.test.mjs`

Expected: FAIL with errors such as `getLibraryPageMeta is not exported` or `normalizeLibraryTitle is not a function`

- [ ] **Step 3: Add the metadata map and expose small pure helper functions from the port script**

```js
// apps/showcase/scripts/lib/library-page-metadata.mjs
export const LIBRARY_PAGE_METADATA = {
  "architectural_blueprint.html": {
    template: "spec",
    category: "Foundation",
    eyebrow: "System Architecture",
    lead: "How Velora layers tokens, surfaces, motion, and static delivery into one browser-first framework.",
    features: ["Blueprint", "Spec", "Core"],
    related: [
      "/pages/library/system-modules-overview.html",
      "/pages/library/tokens-foundation-refined.html",
    ],
  },
  "tokens_foundation_refined.html": {
    template: "spec",
    category: "Tokens",
    eyebrow: "Design Tokens",
    lead: "The semantic token base for color, spacing, radius, and surfaces used across the showcase.",
    features: ["Spec", "Tokens", "Foundation"],
    related: [
      "/pages/library/color-system-specification.html",
      "/pages/library/tonal-tiers-elevation-documentation.html",
    ],
  },
  "motion_principles_overview.html": {
    template: "spec",
    category: "Motion",
    eyebrow: "Motion Principles",
    lead: "The timing, reveal, and orchestration rules that make Velora motion feel precise instead of decorative.",
    features: ["Motion", "Reference", "Sequencing"],
    related: [
      "/pages/library/zero-js-motion-examples.html",
      "/pages/library/kinetic-motion-principles.html",
    ],
  },
  "zero_js_motion_examples.html": {
    template: "showcase",
    category: "Motion",
    eyebrow: "Zero-JS Motion",
    lead: "Practical motion examples that rely on CSS, HTML attributes, and the browser runtime rather than custom logic.",
    features: ["Showcase", "Examples", "Motion"],
    related: [
      "/pages/library/motion-principles-overview.html",
      "/pages/library/scroll-driven-reveal-showcase.html",
    ],
  },
  "contrast_accessibility_tool.html": {
    template: "tool",
    category: "Accessibility",
    eyebrow: "Contrast Tool",
    lead: "A reference page for evaluating token pairings, contrast safety, and accessibility alignment.",
    features: ["Tool", "Accessibility", "Color"],
    related: [
      "/pages/library/accessibility-wcag-guidelines.html",
      "/pages/library/color-system-specification.html",
    ],
  },
  "velora_landing_page_refined.html": {
    template: "editorial",
    category: "Editorial",
    eyebrow: "Landing Reference",
    lead: "A high-polish editorial reference for how Velora communicates atmosphere, hierarchy, and product framing.",
    features: ["Editorial", "Landing", "Reference"],
    related: [
      "/pages/library/typography-composition-patterns.html",
      "/pages/library/brand-voice-editorial-strategy.html",
    ],
  },
};
```

```js
// apps/showcase/scripts/port-packages-pages.mjs
import { LIBRARY_PAGE_METADATA } from "./lib/library-page-metadata.mjs";

export function normalizeLibraryTitle(file, rawTitle) {
  if (rawTitle && rawTitle !== file) return rawTitle.trim();
  return file
    .replace(/\.html$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
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
    slug: file.replace(/\.html$/i, "").replace(/_/g, "-"),
  };
}
```

- [ ] **Step 4: Add a package script for the generator tests**

```json
{
  "scripts": {
    "test:library": "node --test apps/showcase/scripts/lib/port-library-pages.test.mjs"
  }
}
```

- [ ] **Step 5: Run the test again to verify the helper layer passes**

Run: `npm run test:library`

Expected:

```text
> showcase@1.0.0 test:library
> node --test apps/showcase/scripts/lib/port-library-pages.test.mjs

ok 1 - normalizeLibraryTitle converts underscored filenames into readable titles
ok 2 - metadata resolves template families for curated pages
ok 3 - catalog entries prefer curated titles over raw filenames
```

- [ ] **Step 6: Commit**

```bash
git add apps/showcase/scripts/lib/library-page-metadata.mjs apps/showcase/scripts/lib/port-library-pages.test.mjs apps/showcase/scripts/port-packages-pages.mjs apps/showcase/package.json
git commit -m "refactor: add metadata-driven library page model"
```

---

### Task 2: Rebuild The Generated Library Page Skeleton

**Files:**
- Modify: `apps/showcase/scripts/port-packages-pages.mjs`
- Test: `apps/showcase/scripts/lib/port-library-pages.test.mjs`

- [ ] **Step 1: Add a failing markup test for the new Library page shell**

```js
test("buildLibraryPage emits hero, orientation rail, and related reading blocks", () => {
  const html = buildLibraryPage({
    title: "Architectural Blueprint",
    metaDesc: "Architecture spec",
    inner: "<section><h2>Core</h2><p>Body</p></section>",
    header: "<header class=\"vl-header\"></header>",
    footer: "<footer class=\"vl-footer\"></footer>",
    pageMeta: getLibraryPageMeta("architectural_blueprint.html"),
    outName: "architectural-blueprint.html",
  });

  assert.match(html, /lib-page-hero/);
  assert.match(html, /lib-page-rail/);
  assert.match(html, /lib-page-related/);
  assert.match(html, /lib-page--spec/);
});
```

- [ ] **Step 2: Run the test to verify the shell is not present yet**

Run: `npm run test:library`

Expected: FAIL because `buildLibraryPage()` does not yet render `lib-page-hero`, `lib-page-rail`, or `lib-page-related`

- [ ] **Step 3: Refactor the generator to emit a typed page layout**

```js
function buildFeatureChips(features = []) {
  return features
    .map((item) => `<li class="lib-page-chip">${escapeHtml(item)}</li>`)
    .join("");
}

function buildRelatedLinks(links = []) {
  return links
    .map((href) => `<a class="lib-page-related__link vl-card" href="${href}">${escapeHtml(href.split("/").pop().replace(/-/g, " ").replace(".html", ""))}</a>`)
    .join("");
}

function buildLibraryPage({ title, metaDesc, inner, header, footer, pageMeta, outName }) {
  return `<!DOCTYPE html>
<html lang="en" data-editorial-theme="noir" data-theme="dark" vl-page-transition="cinema">
  <head>...</head>
  <body>
    <a class="vl-sr-only" href="#content">Skip to content</a>
    <div class="vl-scroll-progress vl-scroll-progress--glow"></div>
    ${header}
    <main id="content" class="vl-main lib-packages-main lib-page lib-page--${pageMeta.template}">
      <section class="vl-container lib-page-hero" aria-label="Page introduction">
        <p class="vl-kicker lib-page-hero__eyebrow" vl-effect="fade-in" vl-timeline="view">${escapeHtml(pageMeta.eyebrow)}</p>
        <h1 class="lib-page-hero__title" vl-effect="clip-rise" vl-timeline="view">${escapeHtml(title)}</h1>
        <p class="lib-page-hero__lead" vl-effect="fade-up" vl-timeline="view">${escapeHtml(pageMeta.lead)}</p>
        <ul class="lib-page-hero__chips" aria-label="Page highlights">${buildFeatureChips(pageMeta.features)}</ul>
      </section>
      <section class="vl-container lib-page-rail" aria-label="Page orientation">
        <a class="lib-page-rail__back" href="/pages/library/index.html">Back to Library</a>
        <p class="lib-page-rail__type">${escapeHtml(pageMeta.template)}</p>
        <p class="lib-page-rail__source"><code>packages/pages/${escapeHtml(outName.replace(/-/g, "_"))}</code></p>
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
</html>`;
}
```

- [ ] **Step 4: Use the metadata layer inside the file loop**

```js
const pageMeta = getLibraryPageMeta(file);
const normalized = normalizeCatalogEntry({ file, title });
const outName = `${normalized.slug}.html`;

const page = buildLibraryPage({
  title: normalized.title,
  metaDesc,
  inner,
  header,
  footer,
  pageMeta,
  outName,
});

catalog.push({
  href: `/pages/library/${outName}`,
  title: normalized.title,
  file,
  template: pageMeta.template,
  category: pageMeta.category,
});
```

- [ ] **Step 5: Run the tests again to verify the new shell markers exist**

Run: `npm run test:library`

Expected: PASS for the shell-generation assertions and previously added helper tests

- [ ] **Step 6: Commit**

```bash
git add apps/showcase/scripts/port-packages-pages.mjs apps/showcase/scripts/lib/port-library-pages.test.mjs
git commit -m "feat: generate typed library page shells"
```

---

### Task 3: Build The Shared CSS For Template Families And Motion

**Files:**
- Modify: `apps/showcase/public/css/library-doc-content.css`

- [ ] **Step 1: Replace the flat article-only treatment with a page-level Library layout**

```css
.lib-page {
  position: relative;
  padding-bottom: clamp(4rem, 8vw, 6rem);
}

.lib-page-hero {
  display: grid;
  gap: 1rem;
  padding-top: clamp(4.5rem, 9vw, 7rem);
  padding-bottom: clamp(1.5rem, 4vw, 2.5rem);
}

.lib-page-hero__title {
  max-width: 12ch;
  font-family: var(--vl-font-family-display);
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  line-height: 0.96;
  letter-spacing: -0.045em;
}

.lib-page-hero__lead {
  max-width: 44rem;
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  color: var(--vl-text-secondary);
}
```

- [ ] **Step 2: Add the orientation rail, chips, and related-reading system**

```css
.lib-page-rail {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem 1rem;
  align-items: center;
  padding-block: 1rem 1.5rem;
  border-top: 1px solid color-mix(in oklch, var(--vl-border-subtle) 75%, transparent);
  border-bottom: 1px solid color-mix(in oklch, var(--vl-border-subtle) 75%, transparent);
}

.lib-page-hero__chips,
.lib-page-related__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.lib-page-chip {
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  border: 1px solid color-mix(in oklch, var(--vl-border-subtle) 75%, transparent);
  background: color-mix(in oklch, var(--vl-bg-surface-elevated) 68%, transparent);
  color: var(--vl-text-secondary);
  font-size: 0.82rem;
}

.lib-page-related {
  padding-top: clamp(2rem, 6vw, 3.5rem);
}

.lib-page-related__link {
  min-width: min(100%, 16rem);
  padding: 1rem 1.1rem;
  text-decoration: none;
  transition: transform var(--vl-transition-fast, 0.18s ease),
              border-color var(--vl-transition-fast, 0.18s ease),
              background var(--vl-transition-fast, 0.18s ease);
}

.lib-page-related__link:hover {
  transform: translateY(-2px);
}
```

- [ ] **Step 3: Add template-specific variants instead of one undifferentiated article style**

```css
.lib-page--spec .lib-page-hero {
  max-width: 58rem;
}

.lib-page--showcase .lib-page-hero {
  padding-bottom: clamp(2rem, 5vw, 3.25rem);
}

.lib-page--showcase .lib-doc-article {
  max-width: 58rem;
}

.lib-page--tool .lib-page-rail {
  position: sticky;
  top: calc(var(--vl-space-6, 1.5rem) + 4rem);
  z-index: 2;
  background: color-mix(in oklch, var(--vl-bg-main) 80%, transparent);
  backdrop-filter: blur(10px);
}

.lib-page--editorial .lib-page-hero__title {
  max-width: 10ch;
}

.lib-page--editorial .lib-doc-article > section {
  margin-bottom: clamp(3rem, 7vw, 5rem);
}
```

- [ ] **Step 4: Improve article internals for banded reading instead of a single flat column**

```css
.lib-doc {
  padding-top: clamp(2rem, 4vw, 3rem);
}

.lib-doc-article {
  max-width: 52rem;
  margin-inline: auto;
}

.lib-doc-article > section {
  position: relative;
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
  padding-bottom: clamp(1.5rem, 4vw, 2rem);
  border-bottom: 1px solid color-mix(in oklch, var(--vl-border-subtle) 65%, transparent);
}

.lib-doc-article > section:last-child {
  border-bottom: 0;
}

.lib-doc-article blockquote,
.lib-doc-article [role="note"] {
  padding: 1rem 1.2rem;
  border-radius: var(--vl-radius-md, 0.5rem);
  background: color-mix(in oklch, var(--vl-bg-surface-elevated) 60%, transparent);
  border: 1px solid color-mix(in oklch, var(--vl-border-subtle) 70%, transparent);
}
```

- [ ] **Step 5: Regenerate the Library and visually verify the CSS layer**

Run: `npm run port:library`

Expected:

```text
Wrote pages\library\architectural-blueprint.html
Wrote pages\library\tokens-foundation-refined.html
...
Wrote library index with 33 pages
```

Manual verification:
- open `apps/showcase/pages/library/architectural-blueprint.html`
- confirm hero, rail, body bands, and related-reading are visible
- confirm no raw “intro note only” layout remains

- [ ] **Step 6: Commit**

```bash
git add apps/showcase/public/css/library-doc-content.css apps/showcase/scripts/port-packages-pages.mjs
git commit -m "feat: add library template layout system"
```

---

### Task 4: Rebuild The Library Index As A Curated Front Door

**Files:**
- Modify: `apps/showcase/scripts/port-packages-pages.mjs`
- Modify: `apps/showcase/public/css/library-doc-content.css`
- Test: `apps/showcase/scripts/lib/port-library-pages.test.mjs`

- [ ] **Step 1: Add a failing test for grouped and featured index output**

```js
test("buildLibraryIndex groups entries by template and renders featured content", () => {
  const html = buildLibraryIndex(
    [
      { href: "/pages/library/architectural-blueprint.html", title: "Architectural Blueprint", file: "architectural_blueprint.html", template: "spec", category: "Foundation" },
      { href: "/pages/library/zero-js-motion-examples.html", title: "Zero JS Motion Examples", file: "zero_js_motion_examples.html", template: "showcase", category: "Motion" },
    ],
    "<header class=\"vl-header\"></header>",
    "<footer class=\"vl-footer\"></footer>"
  );

  assert.match(html, /lib-index-featured/);
  assert.match(html, /Specs & Foundations/);
  assert.match(html, /Showcases & Motion/);
});
```

- [ ] **Step 2: Run the tests to verify the index is still the old flat grid**

Run: `npm run test:library`

Expected: FAIL because the current index does not render `lib-index-featured` or grouped sections

- [ ] **Step 3: Update index generation to support featured entries and grouped sections**

```js
function groupCatalog(catalog) {
  return {
    spec: catalog.filter((entry) => entry.template === "spec"),
    showcase: catalog.filter((entry) => entry.template === "showcase"),
    tool: catalog.filter((entry) => entry.template === "tool"),
    editorial: catalog.filter((entry) => entry.template === "editorial"),
  };
}

function buildCatalogCards(entries, label) {
  return entries
    .map(
      (entry) => `
        <a class="ds-page-card vl-card lib-index-card" href="${entry.href}" vl-effect="fade-up" vl-timeline="view">
          <p class="vl-kicker">${label}</p>
          <div class="vl-card__title">${escapeHtml(entry.title)}</div>
          <p class="vl-card__body">${escapeHtml(entry.category)}</p>
        </a>`
    )
    .join("");
}

function buildLibraryIndex(catalog, header, footer) {
  const grouped = groupCatalog(catalog);
  const featured = catalog.filter((entry) =>
    ["architectural-blueprint.html", "tokens-foundation-refined.html", "motion-principles-overview.html"].includes(entry.href.split("/").pop())
  );

  return `...<section class="vl-container lib-index-featured">${buildCatalogCards(featured, "Featured")}</section>
  <section class="vl-container lib-index-group"><h2>Specs & Foundations</h2>${buildCatalogCards(grouped.spec, "Spec")}</section>
  <section class="vl-container lib-index-group"><h2>Showcases & Motion</h2>${buildCatalogCards(grouped.showcase, "Showcase")}</section>
  <section class="vl-container lib-index-group"><h2>Tools & Utilities</h2>${buildCatalogCards(grouped.tool, "Tool")}</section>
  <section class="vl-container lib-index-group"><h2>Editorial Reads</h2>${buildCatalogCards(grouped.editorial, "Editorial")}</section>...`;
}
```

- [ ] **Step 4: Add CSS for featured and grouped index sections**

```css
.lib-index-featured,
.lib-index-group {
  padding-bottom: clamp(2rem, 5vw, 3.5rem);
}

.lib-index-featured .hp-catalog-rail,
.lib-index-group .hp-catalog-rail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.lib-index-card {
  min-height: 9rem;
}

.lib-index-card:hover {
  transform: translateY(-2px);
}
```

- [ ] **Step 5: Run tests and regenerate the index**

Run:
- `npm run test:library`
- `npm run port:library`

Expected:

```text
ok 1 - ...
ok 2 - ...
ok 3 - ...
ok 4 - buildLibraryIndex groups entries by template and renders featured content
```

Manual verification:
- open `apps/showcase/pages/library/index.html`
- confirm hero, featured entries, grouped sections, and improved hover hierarchy

- [ ] **Step 6: Commit**

```bash
git add apps/showcase/scripts/port-packages-pages.mjs apps/showcase/public/css/library-doc-content.css apps/showcase/scripts/lib/port-library-pages.test.mjs
git commit -m "feat: turn library index into curated front door"
```

---

### Task 5: Align `gallery.html` With The New Library Family

**Files:**
- Modify: `apps/showcase/pages/library/gallery.html`

- [ ] **Step 1: Replace the current intro note with a Library-family hero and orientation rail**

```html
<main id="content" class="vl-main lib-page lib-page--showcase">
  <section class="vl-container lib-page-hero" aria-label="Gallery introduction">
    <p class="vl-kicker lib-page-hero__eyebrow" vl-effect="fade-in" vl-timeline="view">Component Gallery</p>
    <h1 class="lib-page-hero__title" vl-effect="clip-rise" vl-timeline="view">Interactive component discovery for the Velora system.</h1>
    <p class="lib-page-hero__lead" vl-effect="fade-up" vl-timeline="view">
      Browse primitives, patterns, and categories while keeping the Gallery visually aligned with the rest of the Library.
    </p>
    <ul class="lib-page-hero__chips" aria-label="Gallery highlights">
      <li class="lib-page-chip">Interactive</li>
      <li class="lib-page-chip">Search</li>
      <li class="lib-page-chip">Components</li>
    </ul>
  </section>
  <section class="vl-container lib-page-rail" aria-label="Gallery orientation">
    <a class="lib-page-rail__back" href="/pages/library/index.html">Back to Library</a>
    <p class="lib-page-rail__type">showcase</p>
    <p class="lib-page-rail__source"><code>interactive library</code></p>
  </section>
```

- [ ] **Step 2: Add a related-reading footer block at the end of the Gallery**

```html
<section class="vl-container lib-page-related" aria-label="Related reading">
  <h2 class="lib-page-related__title">Continue reading</h2>
  <div class="lib-page-related__grid">
    <a class="lib-page-related__link vl-card" href="/pages/library/index.html">Library index</a>
    <a class="lib-page-related__link vl-card" href="/pages/library/component-lab-technical-library.html">Component lab</a>
    <a class="lib-page-related__link vl-card" href="/pages/library/form-components-library.html">Form components</a>
  </div>
</section>
```

- [ ] **Step 3: Open the Gallery and verify the new shell does not interfere with the interactive body**

Run: `npm run build`

Expected:

```text
vite v8...
✓ built in ...
```

Manual verification:
- open `apps/showcase/pages/library/gallery.html`
- confirm the search field, category cards, and interactive sections still function visually
- confirm the new hero and footer feel consistent with the rest of the Library

- [ ] **Step 4: Commit**

```bash
git add apps/showcase/pages/library/gallery.html
git commit -m "feat: align gallery with library visual system"
```

---

### Task 6: Full Regeneration And Cross-Template QA

**Files:**
- Verify: `apps/showcase/pages/library/index.html`
- Verify: `apps/showcase/pages/library/architectural-blueprint.html`
- Verify: `apps/showcase/pages/library/tokens-foundation-refined.html`
- Verify: `apps/showcase/pages/library/zero-js-motion-examples.html`
- Verify: `apps/showcase/pages/library/contrast-accessibility-tool.html`
- Verify: `apps/showcase/pages/library/velora-landing-page-refined.html`
- Verify: `apps/showcase/pages/library/gallery.html`

- [ ] **Step 1: Regenerate all Library pages from source**

Run: `npm run port:library`

Expected:

```text
Wrote pages\library\3d-coordinate-explorer.html
Wrote pages\library\architectural-blueprint.html
...
Wrote library index with 33 pages
```

- [ ] **Step 2: Run the Library tests and the production build**

Run:
- `npm run test:library`
- `npm run build`

Expected:

```text
ok 1 - ...
ok 2 - ...
ok 3 - ...
ok 4 - ...
...
✓ built in ...
```

- [ ] **Step 3: Perform visual QA on one page from each template family**

Checklist:
- `index.html` — curation, grouping, hover behavior
- `architectural-blueprint.html` — spec hero, reading rhythm, related-reading
- `zero-js-motion-examples.html` — showcase emphasis and stronger motion moments
- `contrast-accessibility-tool.html` — tool-style orientation and scanability
- `velora-landing-page-refined.html` — editorial spacing and atmosphere
- `gallery.html` — custom interactive body still feels part of the Library

- [ ] **Step 4: Check responsive and reduced-motion behavior**

Manual checks:
- desktop width around 1440px
- tablet width around 768px
- mobile width around 390px
- reduced-motion browser preference enabled

Expected results:
- hero remains readable and not too tall
- rails do not collide with header
- sticky elements do not obscure content
- reduced-motion still leaves hierarchy intact

- [ ] **Step 5: Commit**

```bash
git add apps/showcase/scripts/port-packages-pages.mjs apps/showcase/public/css/library-doc-content.css apps/showcase/pages/library apps/showcase/scripts/lib/port-library-pages.test.mjs apps/showcase/package.json
git commit -m "feat: redesign library templates and curated index"
```

---

## Self-Review

### Spec Coverage
- Hybrid editorial + technical structure: covered by Tasks 2, 3, 4, and 5
- Template family (`spec`, `showcase`, `tool`, `editorial`): covered by Tasks 1, 2, and 3
- Motion and interaction improvements: covered by Tasks 2, 3, 4, and 6
- Global Library index redesign: covered by Task 4
- Full-Library rollout: covered by Task 6

### Placeholder Scan
- No `TODO`, `TBD`, or “implement later” markers remain
- Commands are explicit
- File paths are explicit
- Representative code is included for each code-bearing task

### Type Consistency
- Template families consistently use `spec`, `showcase`, `tool`, and `editorial`
- Metadata API consistently uses `template`, `category`, `eyebrow`, `lead`, `features`, and `related`
- Generated page classes consistently use `lib-page--${template}`
