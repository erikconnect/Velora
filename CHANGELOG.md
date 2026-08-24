# Changelog

All notable changes to Velora will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed
- Public Showcase reduced to six routes (Home, Timeline, Skins, Catalog, Hosts, Archive). Pre-lean pages snapshotted in `archive/showcase-2026-08/` (not Vite/CI).
- **Skins** is the product name for named editorial models (`data-editorial-theme`). Home is didactic: engine vs Skins.
- Motion Catalog: `#pin` teaching replaced by `#scene-engine` (numeric pin + stage/acts live demo); Engine vs Skins lanes; DX toolbar framed as optional CSS-only helper.
- Catalog Phase C (P1): channel-first cards for CONTRACT `vl-enter` / `vl-scroll` / `vl-hover` extensions; scene-engine overlap + auto-clock demos.
- Catalog DX runtime: toolbar covers full CONTRACT attr set, scene-engine targets, CSS var duration/speed, stagger-aware replay.

---

## [1.0.0] — 2025-01-01

### Added

#### Core Framework (`@velora/css`)
- 8-layer CSS cascade: `reset → tokens → layout → motion → components → transitions → utilities → overrides`
- 200+ design tokens (colors, typography, spacing, motion, shadows, z-index, radius) via `01-tokens.css`
- `oklch()`-based color system with earthy brand palette (stone, olive, moss, deep)
- Automatic dark/light theming via `@media (prefers-color-scheme)` with explicit `html[data-theme]` override
- Layout density modes: `html[data-layout="compact"]` and `html[data-layout="presentation"]`

#### Motion System
- 20+ entrance and ambient effects in `03-motion.css`: `vl-fade-up`, `vl-scale-in`, `vl-blur-in`, `vl-3d-entry`, `vl-clip-rise`, `vl-float`, `vl-parallax-shift`, and more
- 30+ extended effects in `03b-motion-extended.css`: `vl-spring-up`, `vl-zoom-blur`, `vl-flip-in`, `vl-aurora`, `vl-border-beam`, `vl-shimmer-text`, and more
- Premium effects in `04d-premium.css`: text clip reveal, skeleton shimmer, counter-up, mesh drift, text mask pan
- Scroll-driven animations via native CSS scroll timelines
- Zero JavaScript for all animation logic — pure CSS throughout

#### Declarative Attribute API
- `vl-effect` — motion preset declaration
- `vl-timeline` — progress model (view, scroll, auto, state, hover)
- `vl-children` — child choreography (stagger, cascade, sequence, wave, blur-cascade, zoom-stagger)
- `vl-scene` — scene container marker
- `vl-stagger`, `vl-speed`, `vl-depth`, `vl-range`, `vl-scrub`, `vl-once`, `vl-pin`, `vl-targets`, `vl-page-transition`

#### View Transition Presets
- 6 named page transition presets via `05-transitions.css`: `velora`, `wipe`, `glide`, `iris`, `cinema`, `snap`
- Shared element morphing support
- Cross-document View Transitions API integration (`@view-transition { navigation: auto; }`)

#### Layout Primitives (`02-layout.css`)
- `.vl-container` (with `--narrow`, `--wide`, `--flush`, `--nest` variants)
- `.vl-stack`, `.vl-grid`, `.vl-grid--auto`, `.vl-grid--3`
- `.vl-split`, `.vl-cluster`, `.vl-flex`
- `.vl-section`, `.vl-measure`, `.vl-scroll-x`, `.vl-scroll-snap-y`
- Container query breakpoints (sm/md/lg/xl) for component-level responsiveness

#### Component Library
- Form controls: `vl-input`, `vl-textarea`, `vl-select`, `vl-checkbox`, `vl-radio`, `vl-label` (`04a-forms.css`)
- Dialog and overlay with `@starting-style` and `::backdrop` animations (`04b-dialogs.css`)
- Page structures: `vl-page`, `vl-header`, `vl-nav`, `vl-logo`, `vl-sidebar`, `vl-footer`, `vl-breadcrumb` (`04c-structures.css`)
- UI primitives: `vl-kicker`, `vl-cta`, `vl-marquee`, `vl-banner`, `vl-card`, `vl-badge`, `vl-tab`, `vl-accordion` (`04-components.css`)

#### Typography
- Font system: Manrope (UI), Space Grotesk (display), JetBrains Mono (code), Cormorant Garamond (editorial)
- 8-step size scale (xs–4xl) with fluid clamp for 4xl
- Typographic utilities: `.vl-text-gradient`, letter-spacing helpers, line-height utilities

#### Accessibility
- `prefers-reduced-motion: reduce` support across all motion patterns — all animation disabled gracefully
- Visible focus rings with configurable token-driven styling
- Semantic HTML-first component patterns

#### Apps & documentation
- Vite MPA showcase (`apps/showcase`) with 30+ demo pages covering framework features and live API catalogs (`api-motion-catalog`, `api-design-catalog`)
- Astro documentation site (`apps/docs`) for published guides
- Versioned Markdown under repository `docs/` (workspace guide, contract matrix, playbooks, agent handbook and skill sets — see [docs/README.md](docs/README.md))
- Component library with copy-paste HTML (`packages/velora-components/`)

#### Toolchain
- pnpm workspace monorepo
- Turborepo build orchestration
- GitHub Actions CI (build on push/PR to main)

---

[Unreleased]: https://github.com/velora-css/velora/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/velora-css/velora/releases/tag/v1.0.0
