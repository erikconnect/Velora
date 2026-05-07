import assert from "node:assert/strict";
import test from "node:test";
import { parseMotionValue } from "../src/parse.mjs";

test("parses compact effect syntax", () => {
  const parsed = parseMotionValue("fade-up@800ms/ease-out delay:120ms");

  assert.equal(parsed.preset, "fade-up");
  assert.equal(parsed.duration, "800ms");
  assert.equal(parsed.ease, "ease-out");
  assert.equal(parsed.declarations.delay, "120ms");
});

test("parses function-like motion syntax", () => {
  const parsed = parseMotionValue("parallax:y(-12%,18%) range:entry");

  assert.equal(parsed.preset, "parallax:y(-12%,18%)");
  assert.deepEqual(parsed.functions, [{ name: "y", args: ["-12%", "18%"] }]);
  assert.equal(parsed.declarations.range, "entry");
});
