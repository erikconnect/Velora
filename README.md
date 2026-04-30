# Velora

**Motion-native CSS. Zero JavaScript. Cinematic interfaces.**

![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)

Velora is a CSS-first design system for building premium, cinematic web interfaces using nothing but modern browser APIs. No JavaScript frameworks. No runtime animation libraries. Just HTML and CSS that move.

Built for developers and agencies who want production-ready motion without the weight.

## Features

🎬 **Cinematic View Transitions** — Six built-in presets (velora, wipe, glide, iris, cinema, snap) powered by the View Transitions API

🎨 **Modern Color System** — `oklch()` colors with automatic dark/light theming and system preference detection

📐 **8-Layer Cascade Architecture** — Structured specificity via CSS `@layer` (reset → tokens → layout → motion → components → transitions → utilities → overrides)

🔄 **Scroll-Driven Animations** — Parallax reveals and scroll-triggered motion using native CSS scroll timelines

📦 **Declarative Attribute Grammar** — Motion via HTML attributes (`vl-effect`, `vl-timeline`, `vl-children`, `vl-scene`) instead of CSS classes

⚡ **Container Queries & Density Modes** — Responsive components with default, compact, and presentation layout modes

## Quick Start

**1. Install**

```bash
pnpm add @velora/css
```

**2. Import**

```css
@import "@velora/css";
```

**3. Use**

```html
<div vl-effect="fade-up" vl-timeline="view">
  <h2>Zero-JS motion</h2>
  <p>Pure CSS. Pure performance.</p>
</div>
```

That's it. No build config. No framework bindings. Works with any stack.

## What's Included

Velora organizes styles through a **named `@layer` stack** (see `packages/css/src/velora.css` for the canonical order):

| Layer | Purpose |
|-------|---------|
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
├── packages/
│   └── css/            # @velora/css — the core design system
├── apps/
│   ├── playground/     # Vite dev playground
│   └── docs/           # Astro documentation site
├── turbo.json
└── pnpm-workspace.yaml
```

```bash
pnpm install     # install all dependencies
pnpm dev         # run the playground
pnpm dev:docs    # run the docs site
pnpm build       # build all packages
```

## Browser Support

Velora targets modern browsers with native support for CSS layers, container queries, view transitions, and scroll-driven animations:

- Chrome 124+
- Safari 18+
- Firefox 128+

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

AI agents (GitHub Copilot, Cursor, and similar tools) should read the [Agent Handbook](docs/velora_agent_handbook.md) before making changes. It defines the product thesis, non-negotiable rules, attribute system contract, and safe prompting patterns. For task assignment, refer to the [Agent Skill Sets](docs/velora_agent_skill_sets.md) which defines 14 project-specific operating profiles.

## License

[ISC](LICENSE)
