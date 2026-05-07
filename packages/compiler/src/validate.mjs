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
  const names = new Set(attrs.map((attr) => attr.name));

  if (names.has("vl-effect") && [...CHANNEL_ATTRS].some((channel) => names.has(channel))) {
    issues.push({
      type: "legacy-channel-conflict",
      attr: "vl-effect",
      message: "Avoid mixing legacy vl-effect with channel attributes. Prefer vl-enter, vl-scroll, vl-loop, vl-hover, vl-state, and vl-exit.",
    });
  }

  return issues;
}
