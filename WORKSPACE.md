# Velora Workspace Guide

This file is the practical map of the current project structure and what is considered source-of-truth.

## 1) Primary product surfaces

- `packages/css/`: canonical source for Velora framework CSS (`@velora/css`).
- `apps/showcase/`: living showcase app (Vite) with demos, tools, scenes, and motion pages.
- `apps/docs/`: Astro docs site for framework guidance and concepts.

### Surface intent (product boundary)

- `packages/css` = framework product (kit CSS oficial).
- `apps/showcase` = site de demonstração e storytelling técnico.
- `apps/docs` = documentação oficial do framework.

See also: `PRODUCT_SURFACES_PLAN.md` and `SHOWCASE_PAGE_PLAYBOOK.md`.

## 2) Supporting content

- `packages/pages/`: imported/reference page library and assets used by showcase porting scripts.
- `packages/velora-components/`: component catalog and HTML snippets used as input material.
- `starters/`: official framework starter templates (HTML/CSS minimal baseline).

## 3) Build and runtime flow

Root scripts:

- `pnpm dev`: runs showcase via Turborepo filter.
- `pnpm dev:docs`: runs docs only.
- `pnpm dev:all`: runs all workspace dev tasks.
- `pnpm build`: builds all packages/apps in pipeline order.

Per workspace:

- `packages/css`: builds CSS package artifacts.
- `apps/showcase`: runs Tailwind prebuild, then Vite build.
- `apps/docs`: builds static Astro output.

## 4) Current status (validated)

- `pnpm install --frozen-lockfile`: works.
- `pnpm build`: works across `@velora/css`, `showcase`, and `docs`.

## 5) Organization rules for next iterations

- Keep framework logic in `packages/css/src` as single source of truth.
- Keep `apps/showcase/public/css` aligned with framework exports and showcase-only extras.
- Treat `packages/pages` and `packages/velora-components` as source libraries, not runtime apps.
- Prefer scripted sync/port steps in `apps/showcase/scripts` over manual copy-paste.
- Update `README.md` + this file whenever folder ownership changes.

## 6) Folder ownership matrix

- `packages/css/src`
  - **Owner:** framework core
  - **Truth level:** canonical
  - **Rule:** API/export and layer changes start here first.
- `apps/showcase/public/css`
  - **Owner:** showcase surface
  - **Truth level:** derived + showcase-specific
  - **Rule:** sync from framework sources; keep only showcase extras local.
- `apps/showcase/pages/`**
  - **Owner:** showcase content
  - **Truth level:** product
  - **Rule:** shared shell is propagated by script, not hand-copied.
- `packages/pages`
  - **Owner:** content library input
  - **Truth level:** reference input
  - **Rule:** consumed through `port-packages-pages.mjs`.
- `packages/velora-components`
  - **Owner:** component source library
  - **Truth level:** reference input
  - **Rule:** use as source material for showcase/docs, not as runtime app.

## 7) Operational scripts (showcase)

- `pnpm --filter showcase port:library`
  - Imports/normalizes pages from `packages/pages` into `apps/showcase/pages/library`.
- `pnpm --filter showcase sync:shell`
  - Synchronizes header/footer shell from `apps/showcase/index.html` to other pages.
- `pnpm --filter showcase fill:hubs`
  - Refreshes hub pages with canonical structured sections.

Recommended update sequence when touching library content:

1. Update source material (`packages/pages` and/or `packages/velora-components`).
2. Run `port:library`.
3. Run `sync:shell`.
4. Run `fill:hubs`.
5. Run `pnpm build` and review output.

Framework CSS anti-drift flow:

1. Update CSS source files in `packages/css/src`.
2. Run `pnpm sync:showcase-css` to mirror canonical CSS into showcase.
3. Run `pnpm check:showcase-css` to verify no drift remains.
4. Build with `pnpm build` (showcase prebuild now enforces CSS sync check).

## 8) Repository hygiene policy

- Generated artifacts (`dist`, `.playwright-cli`, `output/playwright`) must remain untracked.
- Temporary backups (`packages/pages/backup/*.zip`) must remain untracked.
- If a script-generated file is committed intentionally, mention generator script in PR description.
- Keep commits split by concern:
  - framework (`packages/css`)
  - showcase app (`apps/showcase`)
  - docs (`apps/docs`)
  - infrastructure/docs (`README`, `WORKSPACE`, CI)

## 9) Motion API contract (CSS-only)

Canonical source:

- `packages/css/src/03-motion.css` (motion grammar)
- `packages/css/src/05-transitions.css` (page transitions + shared elements)

### Core attributes (stable)

- `vl-effect`, `vl-enter`, `vl-exit`
- `vl-scroll`, `vl-timeline`, `vl-range`
- `vl-duration`, `vl-speed`, `vl-direction`
- `vl-loop`, `vl-loop-effect`
- `vl-children`, `vl-stagger`
- `vl-scene`, `vl-pin`, `vl-scrub`, `vl-once`, `vl-state`

### Deprecated aliases (do not use in showcase/docs examples)

- `vl-type` -> use `vl-timeline` and channel attributes directly
  - `single|reveal` -> `vl-enter` + `vl-timeline="view"` (or effect default)
  - `timeline` -> `vl-timeline="view"` or `vl-timeline="scroll"`
  - `hover` -> `vl-timeline="hover"`
- `vl-delay` -> use `vl-stagger` with `vl-children` choreography, or explicit timing tokens/classes
- `vl-easing` -> use canonical easing tokens through existing effect/channel contracts (`--vl-ease-*`)
- `vl-transition` -> use `vl-page-transition` plus `.vl-vt-shared-*`

### Scene trigger policy (CSS-only, no JS)

- Separate concerns:
  - progression: `vl-scroll` / `vl-timeline` / `vl-range`
  - trigger gate: scene host selectors and CSS states
- Compatibility baseline:
  - `:hover` / `:focus-within` gating on `[vl-scene]`
- Advanced optional mode:
  - `@supports selector(:has(*))` + trigger-zone pattern
  - must always keep baseline fallback active

### Reduced-motion requirement

- Any new scene trigger/gate pattern must preserve existing `prefers-reduced-motion` behavior from motion core.
- No JS fallback should be required for accessibility.