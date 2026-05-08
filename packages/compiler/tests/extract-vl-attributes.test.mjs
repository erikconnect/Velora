import assert from "node:assert/strict";
import test from "node:test";
import { extractVlAttributes, extractIds, extractInPageAnchors } from "../src/extract.mjs";

test("extracts quoted, single-quoted, unquoted, and boolean vl-* attributes", () => {
  const html = `
    <section vl-enter="fade-up@800ms/ease-out" vl-scroll='parallax:y(-12%,18%)' vl-pin>
      <div vl-stagger=80ms></div>
    </section>
  `;

  assert.deepEqual(extractVlAttributes(html).map(({ name, value }) => [name, value]), [
    ["vl-enter", "fade-up@800ms/ease-out"],
    ["vl-scroll", "parallax:y(-12%,18%)"],
    ["vl-pin", ""],
    ["vl-stagger", "80ms"],
  ]);
});

test("extracts ids and in-page anchors", () => {
  const html = `<a href="#intro">Intro</a><section id="intro"></section>`;

  assert.deepEqual(extractIds(html), ["intro"]);
  assert.deepEqual(extractInPageAnchors(html), ["intro"]);
});
