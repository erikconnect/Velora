import test from "node:test";
import assert from "node:assert/strict";

import {
  buildLibraryPage,
  getLibraryPageMeta,
  normalizeCatalogEntry,
  normalizeLibraryTitle,
  sanitizeMainInner,
} from "../port-packages-pages.mjs";

const CURATED_FILES = [
  "architectural_blueprint.html",
  "tokens_foundation_refined.html",
  "motion_principles_overview.html",
  "zero_js_motion_examples.html",
  "contrast_accessibility_tool.html",
  "velora_landing_page_refined.html",
];

test("normalizeLibraryTitle converts underscored filenames into readable titles", () => {
  assert.equal(
    normalizeLibraryTitle("tokens_foundation_refined.html", "tokens_foundation_refined.html"),
    "Tokens Foundation Refined"
  );
});

test("normalizeLibraryTitle preserves explicit non-filename titles", () => {
  assert.equal(
    normalizeLibraryTitle("tokens_foundation_refined.html", "Tokens Foundation Refined | Velora"),
    "Tokens Foundation Refined | Velora"
  );
});

test("metadata resolves template families for curated pages", () => {
  const architecture = getLibraryPageMeta("architectural_blueprint.html");
  const motion = getLibraryPageMeta("zero_js_motion_examples.html");

  assert.equal(architecture.template, "spec");
  assert.equal(motion.template, "showcase");
});

test("metadata falls back to the default library entry for unknown files", () => {
  const unknown = getLibraryPageMeta("unknown_page.html");

  assert.equal(unknown.template, "spec");
  assert.equal(unknown.category, "Library");
  assert.deepEqual(unknown.related, ["/pages/library/index.html", "/pages/library/gallery.html"]);
});

test("catalog entries prefer curated titles over raw filenames", () => {
  const entry = normalizeCatalogEntry({
    file: "system_modules_overview.html",
    title: "system_modules_overview.html",
  });

  assert.equal(entry.title, "System Modules Overview");
  assert.equal(entry.slug, "system-modules-overview");
});

test("catalog entries preserve explicit titles while normalizing slugs", () => {
  const entry = normalizeCatalogEntry({
    file: "zero_js_motion_examples.html",
    title: "Zero JS Motion Examples | Velora",
  });

  assert.equal(entry.title, "Zero JS Motion Examples | Velora");
  assert.equal(entry.slug, "zero-js-motion-examples");
});

test("curated metadata entries expose the required content fields", () => {
  for (const file of CURATED_FILES) {
    const entry = getLibraryPageMeta(file);

    assert.equal(typeof entry.eyebrow, "string");
    assert.ok(entry.eyebrow.length > 0);
    assert.equal(typeof entry.lead, "string");
    assert.ok(entry.lead.length > 0);
    assert.ok(Array.isArray(entry.features));
    assert.ok(entry.features.length > 0);
    assert.ok(Array.isArray(entry.related));
    assert.ok(entry.related.length > 0);

    for (const href of entry.related) {
      assert.match(href, /^\/pages\/library\/.+\.html$/);
    }
  }
});

test("buildLibraryPage emits hero, orientation rail, and related reading blocks", () => {
  const html = buildLibraryPage({
    title: "Architectural Blueprint",
    metaDesc: "Architecture spec",
    inner: "<section><h2>Core</h2><p>Body</p></section>",
    header: '<header class="vl-header"></header>',
    footer: '<footer class="vl-footer"></footer>',
    pageMeta: getLibraryPageMeta("architectural_blueprint.html"),
    outName: "architectural-blueprint.html",
  });

  assert.match(html, /lib-page-hero/);
  assert.match(html, /lib-page-rail/);
  assert.match(html, /lib-page-related/);
  assert.match(html, /lib-page--spec/);
  assert.match(html, /lib-page-rail__back[^>]*href="\/pages\/library\/index\.html"/);
  assert.match(html, /packages\/pages\/architectural_blueprint\.html/);
  assert.match(html, /lib-page-hero__eyebrow/);
  assert.match(html, /lib-page-hero__lead/);
  assert.match(html, /class="lib-page-chip"/);
  assert.match(html, /lib-page-related__link/);
});

test("sanitizeMainInner strips legacy markup noise and adds default section motion", () => {
  const html = sanitizeMainInner(`
    <section class="legacy" data-role="hero" data-theme='noir' style='padding: 10px'>
      <div class="box">Body</div>
      <script>console.log("remove me")</script>
    </section>
  `);

  assert.doesNotMatch(html, /class=/);
  assert.doesNotMatch(html, /data-role=/);
  assert.doesNotMatch(html, /data-theme=/);
  assert.doesNotMatch(html, /style=/);
  assert.doesNotMatch(html, /<script/);
  assert.match(html, /vl-effect="fade-up"/);
  assert.match(html, /vl-timeline="view"/);
  assert.match(html, /vl-range="entry 5% cover 65%"/);
});

test("sanitizeMainInner preserves existing section motion attributes", () => {
  const html = sanitizeMainInner(`
    <section vl-effect="clip-rise" vl-timeline="view" vl-range="entry 0% cover 50%">
      <p>Body</p>
    </section>
  `);

  assert.match(html, /vl-effect="clip-rise"/);
  assert.equal((html.match(/vl-effect=/g) || []).length, 1);
  assert.equal((html.match(/vl-timeline=/g) || []).length, 1);
  assert.equal((html.match(/vl-range=/g) || []).length, 1);
});
