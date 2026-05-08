import {
  ALLOWED_VL_ATTRS,
  CHANNEL_ATTRS,
  DEPRECATED_VL_ATTRS,
  KNOWN_PRESETS,
  VALUE_RULES,
} from "./grammar.mjs";
import { parseMotionValue } from "./parse.mjs";

export function validateAttribute(attr) {
  const issues = [];
  const { name, value } = attr;

  if (DEPRECATED_VL_ATTRS.has(name)) {
    issues.push({
      type: "deprecated-attribute",
      attr: name,
      message: DEPRECATED_VL_ATTRS.get(name),
    });
    return issues;
  }

  if (!ALLOWED_VL_ATTRS.has(name)) {
    issues.push({
      type: "unknown-attribute",
      attr: name,
      message: `Unknown Velora attribute: ${name}`,
    });
    return issues;
  }

  if (!value) return issues;

  const exactRule = VALUE_RULES[name];
  if (exactRule && !exactRule.test(value.trim())) {
    issues.push({
      type: "invalid-value",
      attr: name,
      value,
      message: `Invalid value for ${name}: ${value}`,
    });
  }

  if (CHANNEL_ATTRS.has(name) || name === "vl-effect" || name === "vl-loop-effect") {
    // Skip preset check for attributes that have their own VALUE_RULES (e.g. vl-loop)
    if (VALUE_RULES[name]) return issues;

    const parsed = parseMotionValue(value);
    const preset = parsed.preset;

    if (preset && !KNOWN_PRESETS.has(preset) && !parsed.functions.some((fn) => fn.name === preset)) {
      issues.push({
        type: "unknown-preset",
        attr: name,
        value,
        message: `Unknown motion preset in ${name}: ${preset}`,
      });
    }
  }

  return issues;
}

export function validateAttributes(attrs) {
  return attrs.flatMap((attr) => validateAttribute(attr));
}

export function detectChannelConflicts(attrs) {
  const issues = [];

  // Group attrs by their approximate tag position (within 2000 chars of each other)
  // to avoid false positives on pages that legitimately use both vl-effect and
  // channel attrs on different elements.
  const sorted = [...attrs].sort((a, b) => a.index - b.index);
  const TAG_WINDOW = 2000; // max distance between attrs on the same element
  let windowStart = 0;

  for (let i = 0; i < sorted.length; i++) {
    // Advance window start so attrs are within TAG_WINDOW chars
    while (sorted[i].index - sorted[windowStart].index > TAG_WINDOW) windowStart++;

    const window = sorted.slice(windowStart, i + 1);
    const names = new Set(window.map((a) => a.name));

    if (names.has("vl-effect") && [...CHANNEL_ATTRS].some((ch) => names.has(ch))) {
      const effectAttr = window.find((a) => a.name === "vl-effect");
      // Only report once per vl-effect occurrence
      if (effectAttr && effectAttr.index === sorted[i].index) {
        issues.push({
          type: "legacy-channel-conflict",
          attr: "vl-effect",
          message: "Avoid mixing legacy vl-effect with channel attributes. Prefer vl-enter, vl-scroll, vl-loop, vl-hover, vl-state, and vl-exit.",
        });
      }
    }
  }

  return issues;
}
