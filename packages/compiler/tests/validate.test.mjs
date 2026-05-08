import assert from "node:assert/strict";
import test from "node:test";
import { extractVlAttributes } from "../src/extract.mjs";
import { detectChannelConflicts } from "../src/validate.mjs";

test("does not report channel conflicts across neighboring elements", () => {
  const html = `
    <section vl-effect="fade-up">
      <h2 vl-enter="clip-rise">Title</h2>
      <p vl-scroll="parallax">Body</p>
    </section>
  `;

  assert.deepEqual(detectChannelConflicts(extractVlAttributes(html)), []);
});

test("reports channel conflicts on the same element", () => {
  const html = `<section vl-effect="fade-up" vl-enter="clip-rise"></section>`;

  assert.equal(detectChannelConflicts(extractVlAttributes(html)).length, 1);
});
