# Velora — Agent Instructions

**Velora** is a motion-native CSS design system for premium web interfaces. Zero JavaScript for animations — motion is 100% CSS via attributes and `@layer`.

## Quick Start

```bash
pnpm install          # install all workspace deps
pnpm dev              # showcase dev server (Vite)
pnpm dev:docs         # Astro docs app (apps/docs, port 4321)
pnpm dev:all          # all workspace dev tasks
pnpm build            # full Turborepo build (packages + apps)
pnpm verify:contract  # validate CSS sync + Motion API contract
```

Requires Node.js 22.12 or newer and pnpm 10.

## Workspace Structure


| Path                          | Role                                                  |
| ----------------------------- | ----------------------------------------------------- |
| `packages/css/src/`           | **Canonical source** — all CSS changes start here     |
| `apps/showcase/`              | Vite dev playground (30+ demo pages + API catalogs)   |
| `docs/` (repo root)           | Markdown SOT — contract, workspace, agents (this tree) |
| `apps/docs/`                  | Astro documentation site (published guides)          |
| `packages/pages/`             | Reference input HTML pages (not runtime)              |
| `packages/velora-components/` | Component HTML catalog (reference input, not runtime) |
| `starters/html-css-minimal/`  | Minimal starter template                              |


> `apps/showcase/public/css/` is **derived** from `packages/css/src/`. Always edit the source, then run `pnpm sync:showcase-css`.

## CSS Layer Order

```css
@layer velora.reset, velora.tokens, velora.layout, velora.motion,
       velora.components, velora.transitions, velora.utilities, velora.overrides;
```

Every rule must live inside the correct `@layer velora.*` block. No `!important`. No hard-coded colors, spacing, or timing — use `--vl-*` tokens.

## Core Conventions


| Rule                        | Detail                                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| **Zero-JS motion**          | No GSAP, Framer, Anime.js — CSS-only via `vl-effect`, `vl-timeline`, `vl-scene`              |
| **vl- namespace**           | Classes `.vl-`* · HTML attributes `vl-*` · CSS vars `--vl-*`                                 |
| **Attribute-driven motion** | `vl-effect="fade-up"` `vl-timeline="view"` `vl-range="entry 5% cover 40%"`                   |
| **Reduced-motion guard**    | Every animation MUST have `@media (prefers-reduced-motion: reduce)` — mandatory for WCAG AA  |
| **Token-first**             | All colors/spacing/timing from `--vl-`* tokens in `01-tokens.css`                            |
| **Semantic HTML**           | Use `<section>`, `<article>`, `<button>` — accessibility is non-negotiable                   |
| **Scene density**           | Control spatial rhythm with `data-vl-scene-density="compact|editorial|immersive|full-bleed"` |
| **Dual-theme**              | `html[data-theme="light|dark"]` + `prefers-color-scheme` auto-detection                      |


## Deprecated — Do NOT Use


| Deprecated      | Use Instead                              |
| --------------- | ---------------------------------------- |
| `vl-type`       | `vl-timeline` + channel attrs            |
| `vl-delay`      | `vl-stagger` + `vl-children`             |
| `vl-easing`     | `--vl-ease-`* tokens                     |
| `vl-transition` | `vl-page-transition` + `.vl-vt-shared-*` |


## Component Authoring Pattern

```html
<section class="vl-section">
  <div class="vl-container vl-container--narrow">
    <div vl-children="stagger" vl-stagger="0.12">
      <p class="vl-kicker">Label</p>
      <h1 class="vl-text-gradient">Headline</h1>
      <div class="vl-cluster">
        <a class="vl-cta">Primary</a>
        <a class="vl-cta vl-cta--ghost">Secondary</a>
      </div>
    </div>
  </div>
</section>
```

For scroll-driven animations on individual elements:

```html
<h2 vl-effect="fade-up" vl-timeline="view" vl-range="entry 5% cover 40%">…</h2>
```

## Validation

Run before committing CSS or component changes:

```bash
pnpm check:showcase-css    # verify no CSS drift between packages/css ↔ showcase
pnpm verify:contract       # Motion API contract + vl-* naming compliance
```

Showcase-only validation:

```bash
cd apps/showcase
pnpm audit:pages           # template compliance
pnpm test:library          # component library unit tests
```

## Key Documentation

- [../project/WORKSPACE.md](../project/WORKSPACE.md) — Folder ownership matrix, sync/port workflows, operational scripts
- [../project/CONTRACT.md](../project/CONTRACT.md) — Motion API matrix, stable attributes, deprecated aliases, scene policy
- [../../CONTRIBUTING.md](../../CONTRIBUTING.md) — Setup, build pipeline, CI/CD rules, commit style
- [../project/SHOWCASE_PAGE_PLAYBOOK.md](../project/SHOWCASE_PAGE_PLAYBOOK.md) — Showcase page authoring guidelines
- [../project/velora-master-context.md](../project/velora-master-context.md) — Full framework context
- [../../design-system/velora_earth_tech.md](../../design-system/velora_earth_tech.md) — Themes, elevation patterns
- [../../.github/skills/velora-component/SKILL.md](../../.github/skills/velora-component/SKILL.md) — Component builder skill (invoke for new components)

## Common Pitfalls

- Editing `apps/showcase/public/css/` directly — always edit `packages/css/src/` and sync
- Writing CSS outside `@layer velora.*` — breaks specificity model
- Using hard-coded values (`#fff`, `300ms`) — always use tokens
- Adding animation without `prefers-reduced-motion` guard — accessibility violation
- Using deprecated motion attributes (`vl-type`, `vl-delay`, `vl-easing`)
- Forgetting `pnpm sync:showcase-css` after core CSS changes
