# Velora

**Motion-native CSS. Zero JavaScript. Cinematic interfaces.**

![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)

Velora is a **declarative CSS motion engine**. HTML attributes describe intent; the browser executes it. No JavaScript animation runtime. Works with Tailwind, Relume, or any UI.

The cinematic **Showcase** is the optional Velora design-system skin — not a requirement to turn motion on.

## Features

🎬 **Cinematic View Transitions** — Six built-in presets (velora, wipe, glide, iris, cinema, snap) powered by the View Transitions API

🎨 **Modern Color System** — `oklch()` colors with automatic dark/light theming and system preference detection

📐 **8-Layer Cascade Architecture** — Structured specificity via CSS `@layer` (reset → tokens → layout → motion → components → transitions → utilities → overrides)

🔄 **Scroll-Driven Animations** — Parallax reveals and scroll-triggered motion using native CSS scroll timelines

📦 **Declarative Attribute Grammar** — Motion via HTML attributes (`vl-effect`, `vl-timeline`, `vl-children`, `vl-scene`) instead of CSS classes

⚡ **Container Queries & Density Modes** — Responsive components with default, compact, and presentation layout modes

## Quick Start

### 1. Install

```bash
pnpm add @velora/css
```

### 2. Import

Host-agnostic (any UI — Tailwind, etc.):

```css
@import "@velora/css/motion-core";
@import "@velora/css/transitions"; /* optional */
```

Full Velora look (theme + components + motion):

```css
@import "@velora/css";
```

### 3. Use

```html
<section vl-scene vl-timeline="view" vl-pin="3" vl-scrub>
  <div vl-stage>
    <h1 vl-enter="clip-rise" vl-act="1">Zero-JS motion</h1>
    <p vl-enter="fade-up" vl-act="1">Same attributes on Tailwind or Velora UI.</p>
  </div>
</section>
```

That's it. No build config. No framework bindings. Works with any stack.

### Official Starter (HTML + CSS)

For a minimal project scaffold, use the official starter in:

- `starters/html-css-minimal/`

It includes:

- base HTML shell
- `@import "@velora/css";`
- canonical `vl-*` usage examples
- zero JavaScript animation runtime

## Modular Entry Points

- `@velora/css` or `@velora/css/full` — convenience bundle (theme + components + motion)
- `@velora/css/motion-core` — host-agnostic motion grammar + scene engine
- `@velora/css/motion-extended` — extra effect presets
- `@velora/css/theme` — visual tokens + editorial + scene look recipes
- `@velora/css/base` — reset, motion tokens, structural layout, utilities
- `@velora/css/components-core` — optional UI primitives
- `@velora/css/transitions` — view transition presets
- `@velora/css/premium` — premium components
- `@velora/css/overrides` — last-mile override layer

Proofs: `examples/tailwind-host/` (motion-core + Tailwind) · `apps/showcase` (six-page reference UI: Home, Timeline, Skins, Catalog, Hosts, Archive). Older Showcase pages: `archive/showcase-2026-08/`.

**Skins** are named design-system models (`html[data-editorial-theme]`). They are optional; motion works without them.

## Motion Channels (v2)

Velora supports channel-based motion composition with a deterministic order:

1. `base`
2. `enter`
3. `scroll`
4. `loop`
5. `hover`
6. `state`
7. `exit`

Use dedicated attributes per channel:

```html
<article
  vl-enter="fade-up"
  vl-scroll="parallax"
  vl-loop="glow-breathe"
  vl-hover="underline-expand"
  vl-state="smooth"
  vl-exit="fade-out">
  ...
</article>
```

Backward compatibility is preserved: legacy `vl-effect="..."` remains valid.

## What's Included

Velora organizes styles through a **named `@layer` stack** (see `packages/css/src/velora.css` for the canonical order):

| Layer | Purpose |
| ----- | ------- |
| **Reset** | Normalize browser defaults |
| **Tokens** | Design tokens — colors, spacing, typography, motion curves |
| **Layout** | Grid systems, containers, density modes |
| **Motion** | Keyframes, scroll-driven animations, attribute-driven effects |
| **Components** | Cards, badges, forms, dialogs, structures, premium patterns |
| **Transitions** | View Transition API presets and page-level transitions |
| **Utilities** | Single-purpose helper classes |
| **Overrides** | Last-resort specificity hooks |

## View Transitions

Velora ships six cinematic view transition presets, ready to drop into any page:

- **velora** — signature crossfade with subtle scale
- **wipe** — directional reveal
- **glide** — smooth slide with fade
- **iris** — circular aperture open/close
- **cinema** — dramatic letterbox transition
- **snap** — instant cut with micro-motion

Apply a preset with a single attribute:

```html
<html vl-page-transition="cinema">
```

No JavaScript required.

## Workspace Layout

This is a pnpm + Turborepo monorepo:

```text
velora/
├── docs/                   # Markdown source of truth (contract, workspace, agents)
├── packages/
│   ├── css/                # @velora/css — canonical framework source
│   ├── pages/              # legacy/reference HTML pages used by showcase tooling
│   └── velora-components/  # component HTML catalog and source material
├── apps/
│   ├── showcase/           # Vite showcase (primary interactive app + API catalogs)
│   └── docs/               # Astro documentation site (published guides)
├── turbo.json
└── pnpm-workspace.yaml
```

```bash
pnpm install     # install all dependencies
pnpm dev         # run showcase locally
pnpm dev:docs    # run Astro docs (port 4321)
pnpm dev:all     # all dev tasks (showcase + docs + any other apps)
pnpm build       # build css, showcase, and docs
```

If `pnpm` is unavailable on your machine, activate the pinned version with Corepack:

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
```

## Browser Support

Velora targets modern browsers with native support for CSS layers, container queries, view transitions, and scroll-driven animations:

- Chrome 124+
- Safari 18+
- Firefox 128+

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

AI agents (GitHub Copilot, Cursor, and similar tools) should read the [Agent Handbook](docs/agents/handbook.md) before making changes. It defines the product thesis, non-negotiable rules, attribute system contract, and safe prompting patterns. For task assignment, refer to the [Agent Skill Sets](docs/agents/skill-sets.md) which defines 14 project-specific operating profiles. The documentation index is [docs/README.md](docs/README.md).

## License

[ISC](LICENSE)
