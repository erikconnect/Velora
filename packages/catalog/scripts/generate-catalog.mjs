#!/usr/bin/env node
/**
 * Generates packages/catalog/presets.json from CSS channel maps + grammar allowlist.
 * Run: pnpm generate:catalog
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { KNOWN_PRESETS } from "../../compiler/src/grammar.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPO_ROOT = join(ROOT, "../..");
const CSS_DIR = join(ROOT, "../css/src");
const SHOWCASE_DATA_DIR = join(REPO_ROOT, "apps/showcase/public/data");

const CSS_FILES = [
  "03-motion.css",
  "03b-motion-extended.css",
  "03d-state-transitions.css",
  "scene-recipes.css",
  "05-transitions.css",
];

const CHANNEL_ATTRS = {
  enter: "vl-enter",
  exit: "vl-exit",
  scroll: "vl-scroll",
  hover: "vl-hover",
  loop: "vl-loop-effect",
  state: "vl-state",
  pageTransition: "vl-page-transition",
  scene: "vl-scene",
  base: "vl-base",
};

/** Presets with known progressive / experimental requirements */
const ENHANCEMENTS = {
  parallax: ["animation-timeline:view()"],
  "cinema-zoom": ["animation-timeline:view()"],
  "depth-drift": ["animation-timeline:view()"],
  "scroll-marquee": ["scroll-timeline"],
  "scroll-horizontal": ["scroll-timeline"],
  "rotate-scroll": ["scroll-timeline"],
  "circle-text-scroll": ["scroll-timeline"],
  path: ["offset-path", "animation-timeline:scroll()"],
  expand: ["calc-size()", "@starting-style"],
  "scroll-markers": ["::scroll-marker"],
};

const STATUS_OVERRIDES = {
  "scroll-markers": "experimental",
  "cube-triad-stage": "experimental",
};

const DESCRIPTIONS = {
  "fade-up": "Fade and translate upward into view.",
  "fade-in": "Fade into view.",
  "parallax": "Scroll-linked vertical parallax drift.",
  "media-zoom": "Scroll-linked media scale reveal.",
  path: "Scroll-linked motion along a host-defined path.",
};

function isValidPresetName(name) {
  if (!name || name.includes("<") || name.includes(">")) return false;
  return /^[a-z0-9@][a-z0-9@._-]*$/i.test(name);
}

function readCssFiles() {
  return CSS_FILES.map((file) => ({
    file,
    content: readFileSync(join(CSS_DIR, file), "utf8"),
  }));
}

function extractChannelMaps(cssContent) {
  const maps = new Map();

  const patterns = [
    /\[vl-(enter|exit|scroll|hover|loop-effect|state|page-transition|scene|base)~="([^"]+)"\]/g,
    /\[vl-(enter|exit|scroll|hover|loop-effect|state|page-transition|scene|base)="([^"]+)"\]/g,
  ];

  for (const re of patterns) {
    let match;
    while ((match = re.exec(cssContent)) !== null) {
      const rawChannel = match[1];
      const preset = match[2];
      if (!isValidPresetName(preset)) continue;
      const channel =
        rawChannel === "loop-effect"
          ? "loop"
          : rawChannel === "page-transition"
            ? "pageTransition"
            : rawChannel;
      if (!maps.has(preset)) {
        maps.set(preset, new Set());
      }
      maps.get(preset).add(channel);
    }
  }

  return maps;
}

function inferSourceFile(cssFiles, preset) {
  for (const { file, content } of cssFiles) {
    if (
      content.includes(`~="${preset}"`) ||
      content.includes(`="${preset}"`)
    ) {
      return `packages/css/src/${file}`;
    }
  }
  return null;
}

function buildPresetEntry(name, channels, cssFiles) {
  const channelList = [...channels];
  const primaryChannel =
    channelList.find((c) => c !== "effect" && CHANNEL_ATTRS[c]) ??
    (channelList[0] === "effect" ? "effect" : channelList[0]) ??
    "effect";

  const attribute =
    primaryChannel === "effect"
      ? "vl-effect"
      : (CHANNEL_ATTRS[primaryChannel] ?? "vl-effect");

  const requires = ["animation"];
  const enhancements = ENHANCEMENTS[name] ?? [];

  if (primaryChannel === "scroll" || enhancements.length > 0) {
    if (!enhancements.some((e) => e.includes("animation-timeline"))) {
      enhancements.push("animation-timeline:view()");
    }
  }
  if (primaryChannel === "hover") {
    requires.push("transition");
  }
  if (primaryChannel === "state") {
    requires.push("@starting-style");
  }
  if (primaryChannel === "pageTransition") {
    requires.push("view-transition");
  }

  return {
    name,
    channel: primaryChannel,
    channels: channelList.sort(),
    status: STATUS_OVERRIDES[name] ?? "stable",
    attribute,
    value: name,
    requires: [...new Set(requires)],
    enhancements: [...new Set(enhancements)],
    reducedMotion: "static",
    description: DESCRIPTIONS[name] ?? null,
    source: inferSourceFile(cssFiles, name),
  };
}

const COMPATIBILITY_MATRIX = {
  generatedAt: null,
  spec: "docs/spec/attribute-grammar.md",
  baseline: {
    chrome: "124+",
    safari: "18+",
    firefox: "128+",
    note: "Documented targets; verified by Playwright E2E (Chromium, Firefox, WebKit) in CI.",
  },
  levels: {
    stable: "Required behavior with fallback where noted",
    progressive: "Feature-detected enhancement",
    experimental: "Catalog/lab only",
  },
  primitives: [
    {
      name: "CSS Animations / Transitions",
      status: "stable",
      chrome: "stable",
      safari: "stable",
      firefox: "stable",
      fallback: "—",
    },
    {
      name: "@layer",
      status: "stable",
      chrome: "stable",
      safari: "stable",
      firefox: "stable",
      fallback: "—",
    },
    {
      name: "Scroll-driven animations",
      status: "stable",
      chrome: "stable",
      safari: "stable",
      firefox: "progressive",
      fallback: "Time-based animation; content visible",
    },
    {
      name: "view-timeline-name / timeline-scope",
      status: "stable",
      chrome: "stable",
      safari: "stable",
      firefox: "progressive",
      fallback: "Time-based scene clock",
    },
    {
      name: "@starting-style + allow-discrete",
      status: "stable",
      chrome: "stable",
      safari: "stable",
      firefox: "stable",
      fallback: "Instant state change",
    },
    {
      name: "position: sticky ([vl-stage])",
      status: "stable",
      chrome: "stable",
      safari: "stable",
      firefox: "stable",
      fallback: "Block flow",
    },
    {
      name: ":has()",
      status: "progressive",
      chrome: "stable",
      safari: "stable",
      firefox: "stable",
      fallback: ":hover / :focus-within",
    },
    {
      name: "sibling-index() / sibling-count()",
      status: "progressive",
      chrome: "stable",
      safari: "stable",
      firefox: "progressive",
      fallback: "nth-child lists (≤12 children)",
    },
    {
      name: "Typed attr()",
      status: "progressive",
      chrome: "progressive",
      safari: "progressive",
      firefox: "progressive",
      fallback: "Enum value fallbacks",
    },
    {
      name: "if()",
      status: "experimental",
      chrome: "experimental",
      safari: "experimental",
      firefox: "unsupported",
      fallback: "Baseline attribute selectors",
    },
    {
      name: "calc-size()",
      status: "progressive",
      chrome: "progressive",
      safari: "progressive",
      firefox: "unsupported",
      fallback: "Fixed size expand",
    },
    {
      name: "offset-path",
      status: "progressive",
      chrome: "stable",
      safari: "stable",
      firefox: "progressive",
      fallback: "Static layout",
    },
    {
      name: "::scroll-marker",
      status: "experimental",
      chrome: "experimental",
      safari: "unsupported",
      firefox: "unsupported",
      fallback: "None",
    },
    {
      name: "View Transitions API (MPA)",
      status: "stable",
      chrome: "stable",
      safari: "stable",
      firefox: "unsupported",
      fallback: "Instant navigation",
    },
  ],
};

function buildCompatMatrix(summary) {
  return {
    ...COMPATIBILITY_MATRIX,
    generatedAt: summary.generatedAt,
    presetCount: summary.presetCount,
  };
}

function writeShowcaseData(catalog, summary) {
  const presetsIndex = catalog.presets.map((p) => ({
    name: p.name,
    channel: p.channel,
    attribute: p.attribute,
    status: p.status,
    reducedMotion: p.reducedMotion,
  }));

  const compat = buildCompatMatrix(summary);

  mkdirSync(SHOWCASE_DATA_DIR, { recursive: true });
  writeFileSync(
    join(SHOWCASE_DATA_DIR, "catalog-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );
  writeFileSync(
    join(SHOWCASE_DATA_DIR, "presets-index.json"),
    `${JSON.stringify({ generatedAt: summary.generatedAt, presets: presetsIndex }, null, 2)}\n`,
  );
  writeFileSync(
    join(SHOWCASE_DATA_DIR, "compatibility-matrix.json"),
    `${JSON.stringify(compat, null, 2)}\n`,
  );
  writeFileSync(
    join(SHOWCASE_DATA_DIR, "presets-full.json"),
    `${JSON.stringify({ generatedAt: summary.generatedAt, presets: catalog.presets }, null, 2)}\n`,
  );
}

function buildAttributesJson() {
  return {
    generatedAt: new Date().toISOString(),
    spec: "docs/spec/attribute-grammar.md",
    attributes: [
      { name: "vl-enter", channel: "enter", status: "stable" },
      { name: "vl-exit", channel: "exit", status: "stable" },
      { name: "vl-scroll", channel: "scroll", status: "stable" },
      { name: "vl-hover", channel: "hover", status: "stable" },
      { name: "vl-loop", channel: "loop", status: "stable" },
      { name: "vl-loop-effect", channel: "loop", status: "stable" },
      { name: "vl-state", channel: "state", status: "stable" },
      { name: "vl-effect", channel: "effect", status: "stable" },
      { name: "vl-timeline", type: "control", status: "stable" },
      { name: "vl-scene", type: "scene", status: "stable" },
      { name: "vl-stage", type: "scene", status: "stable" },
      { name: "vl-act", type: "scene", status: "stable" },
      { name: "vl-span", type: "scene", status: "stable" },
      { name: "vl-pin", type: "scene", status: "stable" },
      { name: "vl-scrub", type: "scene", status: "stable" },
      { name: "vl-in-view", type: "gate", status: "stable" },
      { name: "vl-page-transition", channel: "pageTransition", status: "stable" },
    ],
  };
}

function generate() {
  const cssFiles = readCssFiles();
  const channelMaps = new Map();

  for (const { content } of cssFiles) {
    const fileMaps = extractChannelMaps(content);
    for (const [preset, channels] of fileMaps) {
      if (!channelMaps.has(preset)) {
        channelMaps.set(preset, new Set());
      }
      for (const ch of channels) {
        channelMaps.get(preset).add(ch);
      }
    }
  }

  // vl-effect-only presets from grammar
  for (const preset of KNOWN_PRESETS) {
    if (!isValidPresetName(preset)) continue;
    if (!channelMaps.has(preset)) {
      channelMaps.set(preset, new Set(["effect"]));
    } else {
      channelMaps.get(preset).add("effect");
    }
  }

  const presets = [...channelMaps.keys()]
    .sort()
    .map((name) => buildPresetEntry(name, channelMaps.get(name), cssFiles));

  const summary = {
    generatedAt: new Date().toISOString(),
    presetCount: presets.length,
    byChannel: presets.reduce((acc, p) => {
      acc[p.channel] = (acc[p.channel] ?? 0) + 1;
      return acc;
    }, {}),
    byStatus: presets.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1;
      return acc;
    }, {}),
    grammarKnownCount: KNOWN_PRESETS.size,
  };

  const catalog = {
    generatedAt: summary.generatedAt,
    version: "1.0.0",
    spec: "docs/spec/attribute-grammar.md",
    presets,
  };

  writeFileSync(join(ROOT, "presets.json"), `${JSON.stringify(catalog, null, 2)}\n`);
  writeFileSync(
    join(ROOT, "catalog-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );
  writeFileSync(
    join(ROOT, "attributes.json"),
    `${JSON.stringify(buildAttributesJson(), null, 2)}\n`,
  );
  writeFileSync(
    join(ROOT, "compatibility-matrix.json"),
    `${JSON.stringify(buildCompatMatrix(summary), null, 2)}\n`,
  );

  writeShowcaseData(catalog, summary);

  return { catalog, summary };
}

function stableStringify(value) {
  return JSON.stringify(value, (_key, v) => {
    if (_key === "generatedAt") return undefined;
    return v;
  });
}

const isCheck = process.argv.includes("--check");

if (isCheck) {
  const existingPath = join(ROOT, "presets.json");
  if (!existsSync(existingPath)) {
    console.error("catalog: presets.json missing — run pnpm generate:catalog");
    process.exit(1);
  }
  const before = stableStringify(JSON.parse(readFileSync(existingPath, "utf8")));
  generate();
  const after = stableStringify(JSON.parse(readFileSync(existingPath, "utf8")));
  if (before !== after) {
    console.error("catalog: presets.json is stale — run pnpm generate:catalog");
    process.exit(1);
  }
  console.log("catalog: presets.json is up to date");
} else {
  const { summary } = generate();
  console.log(
    `catalog: generated ${summary.presetCount} presets (${JSON.stringify(summary.byChannel)})`,
  );
}
