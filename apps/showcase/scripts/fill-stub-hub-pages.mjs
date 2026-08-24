/**
 * Hub stub filler for archived Showcase pages.
 * Live public registry is the six-page lean set in config/template-registry.mjs.
 * Do not regenerate the ~50-page hub map against the live tree.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, "..");

/** Placeholder card in hub pages (line endings may be CRLF on Windows). */
const OLD_BLOCK_RE =
  /<div class="page-card">\s*<p class="vl-body-lg">This page is running in static mode \(HTML \+ CSS only\)\.<\/p>\s*<p class="page-meta">No JavaScript is required for this page on VPS deployment\.<\/p>\s*<\/div>/;

/** @type {Record<string, string>} */
export const REPLACEMENTS = {
  "pages/core/landing.html": hubHtml({
    lead:
      "Velora is a motion-native CSS framework: load <code>velora.css</code>, compose with <code>vl-*</code> primitives, add motion via HTML attributes, and ship static HTML with no build-time JavaScript requirement.",
    steps: [
      "<strong>Foundation</strong> — define color, type, and space with <code>var(--vl-*)</code> tokens (<code>packages/css</code>).",
      "<strong>Surfaces & structure</strong> — use semantic surface classes and layout patterns from the CSS package.",
      "<strong>Motion</strong> — opt into scroll/view timelines with <code>vl-effect</code>, <code>vl-timeline</code>, and related attributes.",
      "<strong>Ship</strong> — deploy as static files; optional JS only enhances controls (theme, view transitions).",
    ],
    primary: { href: "/pages/library/tokens-foundation-refined.html", label: "Open token foundation spec" },
    secondary: [
      { href: "/pages/color/design-tokens.html", label: "Design tokens hub" },
      { href: "/pages/library/index.html", label: "Full library index" },
      { href: "/pages/library/gallery.html", label: "Component gallery" },
    ],
  }),

  "pages/core/about.html": hubHtml({
    lead:
      "Velora treats the browser as the runtime: design tokens, editorial themes (Noir / Earth tech), and motion are expressed in CSS so pages stay fast, accessible, and easy to host anywhere.",
    steps: [
      "<strong>Design system in CSS</strong> — single source of truth in <code>packages/css</code>, consumed by static pages.",
      "<strong>Showcase</strong> — this site demonstrates patterns without a SPA; view transitions are progressive enhancement.",
      "<strong>Documentation</strong> — long-form specs live under Library, migrated from <code>packages/pages</code>.",
    ],
    primary: { href: "/pages/library/velora-landing-page-refined.html", label: "Editorial landing reference" },
    secondary: [
      { href: "/pages/library/architectural-blueprint.html", label: "Architectural blueprint" },
      { href: "/pages/core/landing.html", label: "Framework workflow" },
    ],
  }),

  "pages/typography/typography.html": hubHtml({
    lead:
      "Typography in Velora uses token-driven scales and font stacks wired in CSS. Start from specimens, then lock metrics in your theme.",
    steps: [
      "<strong>Scale</strong> — map display, title, and body roles to tokens.",
      "<strong>Pairing</strong> — Space Grotesk / Manrope / JetBrains Mono as loaded in showcase pages.",
      "<strong>Motion</strong> — type can participate in <code>vl-effect</code> reveals without extra JS.",
    ],
    primary: { href: "/pages/library/typography-samples.html", label: "Typography samples (Library)" },
    secondary: [
      { href: "/pages/typography/typography-spec.html", label: "Type spec" },
      { href: "/pages/typography/typography-composition.html", label: "Composition patterns" },
    ],
  }),

  "pages/typography/typography-spec.html": hubHtml({
    lead:
      "The technical specification defines measurements, weights, and hierarchy so product and engineering share one typographic contract.",
    steps: [
      "<strong>Metrics</strong> — line height, tracking, and optical size tied to tokens.",
      "<strong>Accessibility</strong> — minimum sizes and contrast pairs with the color system.",
      "<strong>Implementation</strong> — apply via utility classes and CSS variables, not ad-hoc pixels.",
    ],
    primary: { href: "/pages/library/typography-specification.html", label: "Full typography specification" },
    secondary: [{ href: "/pages/library/typography-samples.html", label: "Samples" }],
  }),

  "pages/typography/typography-composition.html": hubHtml({
    lead:
      "Editorial composition covers how type blocks combine with rhythm, kickers, and section leads for marketing and docs.",
    steps: [
      "<strong>Rhythm</strong> — vertical spacing from tokenized gaps.",
      "<strong>Hierarchy</strong> — kicker → title → lead → body patterns.",
      "<strong>Scenes</strong> — reuse composition rules in hero and story sections.",
    ],
    primary: { href: "/pages/library/typography-composition-patterns.html", label: "Composition patterns (Library)" },
    secondary: [{ href: "/pages/scenes/scene-story.html", label: "Story scene" }],
  }),

  "pages/color/design-tokens.html": hubHtml({
    lead:
      "Design tokens are the first layer: name semantic roles, expose them as <code>var(--vl-*)</code>, and reference them everywhere else.",
    steps: [
      "<strong>Semantic naming</strong> — background, surface, border, text roles.",
      "<strong>Theming</strong> — light/dark and editorial themes swap token values.",
      "<strong>Consistency</strong> — motion and components inherit the same palette.",
    ],
    primary: { href: "/pages/library/tokens-foundation-refined.html", label: "Token foundation (refined)" },
    secondary: [
      { href: "/pages/color/color-system.html", label: "Color system" },
      { href: "/pages/tools/converter.html", label: "Token migration notes" },
    ],
  }),

  "pages/color/color-system.html": hubHtml({
    lead:
      "The color system uses oklch-based ramps for perceptual uniformity and accessible contrast when combined with typography tokens.",
    steps: [
      "<strong>Ramps</strong> — primary, neutral, and semantic (error, success) scales.",
      "<strong>Surfaces</strong> — elevation expressed as tonal shifts, not arbitrary hex.",
      "<strong>Verification</strong> — pair with the contrast tool before release.",
    ],
    primary: { href: "/pages/library/color-system-specification.html", label: "Color system specification" },
    secondary: [{ href: "/pages/tools/contrast-tool.html", label: "Contrast tool" }],
  }),

  "pages/color/color-palette.html": hubHtml({
    lead:
      "Palette perception explores how hues behave across light and dark surfaces so brand colors stay legible on real UI.",
    steps: [
      "<strong>Perception</strong> — test colors on true surfaces, not isolated swatches.",
      "<strong>Harmony</strong> — relate accent colors to neutrals via shared chroma logic.",
      "<strong>Documentation</strong> — capture decisions in Library for handoff.",
    ],
    primary: { href: "/pages/library/color-palette-perception.html", label: "Palette perception doc" },
    secondary: [{ href: "/pages/color/tonal-tiers.html", label: "Tonal tiers" }],
  }),

  "pages/color/tonal-tiers.html": hubHtml({
    lead:
      "Tonal tiers document discrete elevation steps: each tier maps to tokens for background, border, and shadow.",
    steps: [
      "<strong>Tier ladder</strong> — from base canvas to highest floating surface.",
      "<strong>Shadows</strong> — tie ambient shadow recipes to tier jumps.",
      "<strong>Motion</strong> — elevation changes can animate with kinetic presets.",
    ],
    primary: { href: "/pages/library/tonal-tiers-elevation-documentation.html", label: "Tonal tiers documentation" },
    secondary: [{ href: "/pages/color/ambient-shadows.html", label: "Ambient shadows" }],
  }),

  "pages/color/tonal-stacking.html": hubHtml({
    lead:
      "Tonal stacking explains how layered surfaces read as depth without breaking contrast or cluttering the UI.",
    steps: [
      "<strong>Theory</strong> — stacking rules for nested cards and modals.",
      "<strong>Tokens</strong> — which surface token to use at each nest level.",
      "<strong>Accessibility</strong> — focus rings and borders remain visible on every stack.",
    ],
    primary: { href: "/pages/library/tonal-stacking-elevation-theory.html", label: "Stacking & elevation theory" },
    secondary: [{ href: "/pages/color/token-spotlight.html", label: "Token spotlight" }],
  }),

  "pages/color/ambient-shadows.html": hubHtml({
    lead:
      "Ambient shadows separate elevation from arbitrary box-shadow: recipes align with tonal tiers and theme.",
    steps: [
      "<strong>Recipes</strong> — diffuse vs. key light metaphors for product UIs.",
      "<strong>Performance</strong> — prefer CSS variables and will-change sparingly.",
      "<strong>Consistency</strong> — same shadow language across scenes and components.",
    ],
    primary: { href: "/pages/library/ambient-shadows-theory.html", label: "Ambient shadows theory" },
    secondary: [{ href: "/pages/library/tonal-tiers-elevation-documentation.html", label: "Tonal tiers" }],
  }),

  "pages/color/token-spotlight.html": hubHtml({
    lead:
      "Token spotlight surfaces (e.g. Surface Noir) show how a single semantic token propagates through real layouts.",
    steps: [
      "<strong>Spotlight method</strong> — isolate one token and stress-test it on hero, card, and footer.",
      "<strong>Themes</strong> — compare Noir vs. Earth tech interpretations.",
      "<strong>Handoff</strong> — export naming for design tools and code.",
    ],
    primary: { href: "/pages/library/token-spotlight-surface-noir.html", label: "Surface Noir spotlight" },
    secondary: [{ href: "/pages/color/design-tokens.html", label: "Design tokens" }],
  }),

  "pages/tools/architecture.html": hubHtml({
    lead:
      "Architecture describes how CSS layers, motion, and optional JS fit together in a Velora-powered product.",
    steps: [
      "<strong>Layers</strong> — tokens → structures → motion → transitions.",
      "<strong>Boundaries</strong> — what ships without JS vs. what uses <code>showcase-controls.js</code>.",
      "<strong>Scaling</strong> — teams extend via tokens and components, not forks of the core sheet.",
    ],
    primary: { href: "/pages/library/architectural-blueprint.html", label: "Architectural blueprint" },
    secondary: [{ href: "/pages/tools/system-modules.html", label: "System modules" }],
  }),

  "pages/tools/accessibility.html": hubHtml({
    lead:
      "Accessibility is built in: semantic HTML, focusable controls, color tokens that meet contrast when used as documented.",
    steps: [
      "<strong>WCAG alignment</strong> — reference criteria for text and non-text contrast.",
      "<strong>Motion</strong> — respect reduced-motion preferences via CSS.",
      "<strong>Testing</strong> — combine automated checks with keyboard traversal.",
    ],
    primary: { href: "/pages/library/accessibility-wcag-guidelines.html", label: "WCAG guidelines (Library)" },
    secondary: [{ href: "/pages/tools/contrast-tool.html", label: "Contrast tool" }],
  }),

  "pages/tools/contrast-tool.html": hubHtml({
    lead:
      "The contrast workflow pairs foreground/background tokens and verifies WCAG levels before tokens are frozen.",
    steps: [
      "<strong>Pairing</strong> — test body, headline, and control text against surfaces.",
      "<strong>Documentation</strong> — record passing pairs in the color spec.",
      "<strong>Regression</strong> — re-check when themes or editorial modes change.",
    ],
    primary: { href: "/pages/library/contrast-accessibility-tool.html", label: "Contrast tool documentation" },
    secondary: [{ href: "/pages/color/color-system.html", label: "Color system" }],
  }),

  "pages/tools/brand-voice.html": hubHtml({
    lead:
      "Brand voice defines tone for UI copy and marketing; Velora’s editorial themes (Noir / Earth tech) align visuals with that voice.",
    steps: [
      "<strong>Strategy</strong> — voice pillars and vocabulary.",
      "<strong>UI application</strong> — buttons, empty states, and kickers.",
      "<strong>Cohesion</strong> — motion intensity matches brand energy.",
    ],
    primary: { href: "/pages/library/brand-voice-editorial-strategy.html", label: "Brand voice strategy" },
    secondary: [{ href: "/pages/core/about.html", label: "About" }],
  }),

  "pages/tools/system-modules.html": hubHtml({
    lead:
      "System modules are the functional slices of the framework: forms, dialogs, structures, and premium patterns in CSS.",
    steps: [
      "<strong>Module map</strong> — which file in <code>packages/css</code> covers which concern.",
      "<strong>Composition</strong> — modules stack without conflicting specificity.",
      "<strong>Extensibility</strong> — add project tokens without editing vendor layers.",
    ],
    primary: { href: "/pages/library/system-modules-overview.html", label: "System modules overview" },
    secondary: [{ href: "/pages/library/architectural-blueprint.html", label: "Architecture" }],
  }),

  "pages/tools/converter.html": hubHtml({
    lead:
      "When migrating from another system, map legacy variables to <code>var(--vl-*)</code> and validate with the token foundation doc. There is no separate binary “converter” — migration is a naming and verification process.",
    steps: [
      "<strong>Inventory</strong> — list legacy colors, type sizes, and radii.",
      "<strong>Map</strong> — one-to-one or many-to-one mapping to Velora tokens.",
      "<strong>Verify</strong> — run contrast checks and visual QA on real components.",
    ],
    primary: { href: "/pages/library/tokens-foundation-refined.html", label: "Token foundation" },
    secondary: [
      { href: "/pages/color/design-tokens.html", label: "Design tokens hub" },
      { href: "/pages/library/gallery.html", label: "Component gallery" },
    ],
  }),

  "pages/components/buttons.html": hubHtml({
    lead:
      "Buttons combine structure, state layers, and micro-feedback. Velora encodes hover/active/focus in CSS with tokens for border and glow.",
    steps: [
      "<strong>States</strong> — default, hover, active, disabled, focus-visible.",
      "<strong>Motion</strong> — subtle scale or shadow via motion attributes where appropriate.",
      "<strong>Accessibility</strong> — minimum target size and visible focus.",
    ],
    primary: { href: "/pages/library/interaction-feedback-micro-interactions.html", label: "Interaction & micro-interactions" },
    secondary: [
      { href: "/pages/components/forms.html", label: "Forms" },
      { href: "/pages/library/form-components-library.html", label: "Form components library" },
    ],
  }),

  "pages/components/forms.html": hubHtml({
    lead:
      "Forms use the forms layer in Velora CSS: inputs, labels, validation states, and spacing tokens for comfortable density.",
    steps: [
      "<strong>Primitives</strong> — text fields, selects, checkboxes, radios.",
      "<strong>Validation</strong> — error surfaces and text colors from semantic tokens.",
      "<strong>Motion</strong> — optional reveal for inline errors.",
    ],
    primary: { href: "/pages/library/form-components-library.html", label: "Form components library" },
    secondary: [{ href: "/pages/tools/accessibility.html", label: "Accessibility" }],
  }),

  "pages/components/component-lab.html": hubHtml({
    lead:
      "The component lab is where primitives are stress-tested: combine tokens, motion, and content in isolated examples before production.",
    steps: [
      "<strong>Matrix</strong> — states × themes × breakpoints.",
      "<strong>Documentation</strong> — capture measurements for design tools.",
      "<strong>Regression</strong> — snapshot key combinations when upgrading CSS.",
    ],
    primary: { href: "/pages/library/component-lab-technical-library.html", label: "Component lab (technical)" },
    secondary: [{ href: "/pages/library/gallery.html", label: "Gallery" }],
  }),

  "pages/components/component-wizard.html": hubHtml({
    lead:
      "The component wizard pattern documents metadata and variants so generated UI stays consistent with the design system.",
    steps: [
      "<strong>Metadata</strong> — name, tier, dependencies, theme requirements.",
      "<strong>Variants</strong> — size, emphasis, and layout switches.",
      "<strong>Output</strong> — HTML snippets that match Library examples.",
    ],
    primary: { href: "/pages/library/component-wizard-metadata.html", label: "Component wizard metadata" },
    secondary: [{ href: "/pages/components/component-lab.html", label: "Component lab" }],
  }),

  "pages/components/icons.html": hubHtml({
    lead:
      "Icons inherit color from current text, align to the type rhythm, and use inline SVG or icon fonts per project policy.",
    steps: [
      "<strong>Sizing</strong> — snap to the type scale and touch targets.",
      "<strong>Accessibility</strong> — <code>aria-hidden</code> on decorative icons; labels on actionable ones.",
      "<strong>Discovery</strong> — browse the interactive gallery for paired components.",
    ],
    primary: { href: "/pages/library/gallery.html", label: "Component gallery" },
    secondary: [{ href: "/pages/library/component-lab-technical-library.html", label: "Component lab" }],
  }),

  "pages/motion/motion-principles.html": hubHtml({
    lead:
      "Motion principles cover timing, easing, staggering, and when *not* to animate — so interfaces feel intentional at 120fps-capable browsers.",
    steps: [
      "<strong>Hierarchy</strong> — motion reinforces reading order, not decoration.",
      "<strong>Physics</strong> — choose easings that match mass and distance.",
      "<strong>Progressive enhancement</strong> — core content works without motion.",
    ],
    primary: { href: "/pages/library/motion-principles-overview.html", label: "Motion principles overview" },
    secondary: [
      { href: "/pages/motion/zero-js-motion.html", label: "Zero-JS motion demos" },
      { href: "/pages/motion/interactions.html", label: "Interactions" },
    ],
  }),

  "pages/motion/kinetic-motion.html": hubHtml({
    lead:
      "Kinetic motion layers advanced transforms and actuators on top of the base motion system for high-impact but controlled effects.",
    steps: [
      "<strong>Actuators</strong> — parameters exposed as data attributes or classes.",
      "<strong>Safety</strong> — clamp motion for reduced-motion users.",
      "<strong>Composition</strong> — combine with scroll-driven timelines.",
    ],
    primary: { href: "/pages/library/kinetic-motion-principles.html", label: "Kinetic motion principles" },
    secondary: [
      { href: "/pages/motion/kinetic-cards.html", label: "Kinetic cards" },
      { href: "/pages/library/kinetic-actuators-playground.html", label: "Actuators playground" },
    ],
  }),

  "pages/motion/scale-shift.html": hubHtml({
    lead:
      "Scale shift actuators change scale and position in sync — useful for cards, galleries, and emphasis without custom keyframe files per page.",
    steps: [
      "<strong>Ranges</strong> — map scroll or view timelines to transform intensity.",
      "<strong>Performance</strong> — prefer transform and opacity.",
      "<strong>Pairing</strong> — combine with tonal elevation for depth.",
    ],
    primary: { href: "/pages/library/scale-shift-actuator-showcase.html", label: "Scale-shift actuator showcase" },
    secondary: [{ href: "/pages/motion/motion-principles.html", label: "Motion principles" }],
  }),

  "pages/motion/interactions.html": hubHtml({
    lead:
      "Micro-interactions cover pointer, focus, and press feedback — the layer that makes static CSS feel responsive.",
    steps: [
      "<strong>Feedback</strong> — immediate visual response under 100ms perceived.",
      "<strong>Consistency</strong> — same interaction language for buttons, links, and cards.",
      "<strong>Specs</strong> — document curves and shadows alongside components.",
    ],
    primary: { href: "/pages/library/interaction-feedback-micro-interactions.html", label: "Micro-interactions spec" },
    secondary: [{ href: "/pages/components/buttons.html", label: "Buttons" }],
  }),

  "pages/scenes/scene-hero.html": hubHtml({
    lead:
      "Hero scenes establish brand and value proposition: large type, media, and entry motion within the first viewport.",
    steps: [
      "<strong>Structure</strong> — kicker, headline, lead, primary CTA row.",
      "<strong>Motion</strong> — entry reveals with <code>vl-effect</code> and view timelines.",
      "<strong>Reference</strong> — match spacing and token use to the editorial landing spec.",
    ],
    primary: { href: "/pages/library/velora-landing-page-refined.html", label: "Refined landing reference" },
    secondary: [
      { href: "/pages/scenes/scene-creator.html", label: "Scene creator" },
      { href: "/pages/motion/zero-js-motion.html", label: "Zero-JS motion" },
    ],
  }),

  "pages/scenes/scene-features.html": hubHtml({
    lead:
      "Feature scenes communicate capabilities: grids of cards, staggered reveals, and consistent iconography tied to tokens.",
    steps: [
      "<strong>Grid</strong> — responsive columns with shared gap tokens.",
      "<strong>Stagger</strong> — <code>vl-children</code> patterns for orchestrated entry.",
      "<strong>Content</strong> — each tile links to deeper Library docs.",
    ],
    primary: { href: "/pages/library/zero-js-motion-examples.html", label: "Zero-JS motion examples" },
    secondary: [
      { href: "/pages/library/motion-principles-overview.html", label: "Motion principles" },
      { href: "/pages/scenes/scene-hero.html", label: "Hero scene" },
    ],
  }),

  "pages/scenes/scene-story.html": hubHtml({
    lead:
      "Story scenes use scroll-driven narrative: pinning sections, progressive disclosure, and typography rhythm for long reads.",
    steps: [
      "<strong>Scroll</strong> — tie reveals to scroll ranges, not timeouts.",
      "<strong>Persistence</strong> — keep nav and progress visible where appropriate.",
      "<strong>Reference</strong> — align with scroll-driven reveal documentation.",
    ],
    primary: { href: "/pages/library/scroll-driven-reveal-showcase.html", label: "Scroll-driven reveal showcase" },
    secondary: [{ href: "/pages/scenes/scroll-reveal.html", label: "Scroll reveal demo" }],
  }),
};

function hubHtml({ lead, steps, primary, secondary }) {
  const li = steps.map((s) => `            <li class="vl-body">${s}</li>`).join("\n");
  const sec = secondary
    .map(
      (l) =>
        `          <a class="vl-nav__link" href="${l.href}" style="padding:.35rem .75rem;border:1px solid var(--vl-border-subtle);border-radius:var(--vl-radius-md);text-decoration:none;">${l.label}</a>`
    )
    .join("\n");
  return `        <p class="vl-body-lg" style="max-width:48rem;">${lead}</p>
        <p class="page-meta" style="margin-bottom:1.25rem;">This hub page is static HTML + CSS; optional JavaScript only powers global controls (theme, transitions).</p>
        <div class="page-card">
          <h2 style="margin-top:0;font-size:1.125rem;font-weight:600;">In the Velora workflow</h2>
          <ul class="vl-body" style="margin:0;padding-left:1.25rem;max-width:48rem;">
${li}
          </ul>
        </div>
        <div class="page-card" style="margin-top:1rem;">
          <h2 style="margin-top:0;font-size:1.125rem;font-weight:600;">Deep documentation</h2>
          <p class="vl-body" style="max-width:48rem;">The canonical long-form write-up migrated from <code>packages/pages</code> lives in the Library. Start with the primary link, then follow related hubs.</p>
          <div class="page-links" style="margin-top:1rem;align-items:center;">
            <a class="vl-header-get-started" href="${primary.href}" style="display:inline-flex;">${primary.label}</a>
          </div>
          <div class="page-links" style="margin-top:0.75rem;">
${sec}
          </div>
        </div>`;
}

function main() {
  let n = 0;
  for (const [rel, block] of Object.entries(REPLACEMENTS)) {
    const file = path.join(showcaseRoot, rel);
    if (!fs.existsSync(file)) {
      console.warn("Missing file:", rel);
      continue;
    }
    let html = fs.readFileSync(file, "utf8");
    if (!OLD_BLOCK_RE.test(html)) {
      console.warn("Skip (placeholder not found):", rel);
      continue;
    }
    html = html.replace(OLD_BLOCK_RE, block);
    fs.writeFileSync(file, html, "utf8");
    n++;
    console.log("Updated", rel);
  }
  console.log("Done. Updated:", n, "files");
}

const isMainModule =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main();
}
