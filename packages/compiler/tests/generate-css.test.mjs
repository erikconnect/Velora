import assert from "node:assert/strict";
import test from "node:test";
import { generateCssFromAttributes } from "../src/generate-css.mjs";

test("generates CSS for compact enter effect syntax", () => {
  const css = generateCssFromAttributes([
    { name: "vl-enter", value: "fade-up@800ms/ease-out delay:120ms" },
  ]);

  assert.match(css, /@layer velora\.motion/);
  assert.match(css, /\[vl-enter=\"fade-up@800ms\/ease-out delay:120ms\"\]/);
  assert.match(css, /animation-name: vl-fade-up;/);
  assert.match(css, /--vl-motion-duration: 800ms;/);
  assert.match(css, /--vl-motion-ease: ease-out;/);
  assert.match(css, /animation-delay: 120ms;/);
});

test("generates CSS vars for parallax function-scoped syntax", () => {
  const css = generateCssFromAttributes([
    { name: "vl-scroll", value: "parallax:y(-12%,18%) range:entry" },
  ]);

  assert.match(css, /animation-name: vl-parallax-shift;/);
  assert.match(css, /animation-timeline: view\(\);/);
  assert.match(css, /animation-range: entry;/);
  assert.match(css, /--vl-parallax-from: -12%;/);
  assert.match(css, /--vl-parallax-to: 18%;/);
});
