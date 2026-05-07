# Velora Contract Matrix

This is the operational contract for Motion API, Design API, and showcase page structure.

## 1) Source Of Truth

- **Framework contract (canonical):** `packages/css/src/**`
- **Reference catalogs (live contract):**
  - `apps/showcase/pages/motion/api-motion-catalog.html`
  - `apps/showcase/pages/components/api-design-catalog.html`
- **Narrative pages (consumers):** `apps/showcase/pages/**` (excluding catalog pages)
- **Local page CSS:** visual/editorial only; must not redefine framework API behavior.

## 2) Motion API Matrix

### 2.1 Stable attributes (allowed)

- `vl-effect`
- `vl-enter`
- `vl-exit`
- `vl-scroll`
- `vl-timeline`
- `vl-range`
- `vl-duration`
- `vl-speed`
- `vl-direction`
- `vl-loop`
- `vl-loop-effect`
- `vl-children`
- `vl-stagger`
- `vl-scene`
- `vl-pin`
- `vl-scrub`
- `vl-once`
- `vl-state`
- `vl-page-transition`
- `vl-vt-shared-nav`
- `vl-vt-shared-brand`
- `vl-logo-lockup`
- `vl-hover`
- `vl-base`
- `vl-card`
- `vl-actuator`
- `vl-scene-trigger`
- `vl-scene-trigger-zone`
- `vl-scale-shift`
- `vl-counter-fwd`
- `vl-scroll-markers`

### 2.2 Deprecated attributes (forbidden in examples/pages)

- `vl-type` -> replace with `vl-timeline` + channel attributes
- `vl-delay` -> replace with `vl-stagger` + `vl-children`
- `vl-easing` -> replace with canonical easing tokens / effect contracts
- `vl-transition` -> replace with `vl-page-transition` + shared VT classes

### 2.3 Stable value extensions (current)

- `vl-enter`: `reveal-cinematic`, `depth-enter`, `mask-sweep`
- `vl-scroll`: `reveal`, `media-zoom`, `crossfade`, `text-highlight`
- `vl-loop` / `vl-loop-effect`: `aurora-drift`
- `vl-hover`: `gradient-sweep`, `border-trace`
- `vl-scene`: `cinematic-hero`, `sticky-story`, `glass-bento`, `product-reveal`, `editorial-cinema`

### 2.4 Authoring profile (v2 target: practical and flexible)

This profile defines the preferred authoring model for new scenes. Goal: build fast with predictable defaults using native HTML/CSS first.

- **Entry/Exit:** `vl-enter`, `vl-exit`
- **Timing:** `vl-duration`, `vl-speed`
- **Range/Direction:** `vl-range`, `vl-direction`
- **Scroll/Timeline:** `vl-scroll`, `vl-timeline`, `vl-scrub`, `vl-once`
- **Scene composition:** `vl-scene`, `vl-children`, `vl-stagger`
- **Easing:** use canonical easing tokens via effect contracts (do not introduce ad-hoc easing values in pages)

Authoring rule for new demos/pages:

1. Start with a `vl-scene` preset.
2. Add one entry behavior (`vl-enter`) and one progression behavior (`vl-scroll` or `vl-timeline`).
3. Tune timing with `vl-duration` + `vl-speed` only when needed.
4. Tune choreography with `vl-stagger` only on grouped children.

### 2.5 Baseline scene recipe (recommended)

Use this minimum recipe as default for new section-level scenes:

- section: `vl-scene` + (`vl-enter` or `vl-scroll`)
- media block: optional `vl-range` + `vl-direction`
- child cluster: optional `vl-children` + `vl-stagger`

This keeps the API compact while preserving flexibility for advanced timelines.

## 3) Design Catalog Matrix (scope)

- **Core:** `#color-tokens`, `#typography`, `#spacing`, `#primitives`
- **Extended:** `#forms`, `#components`, `#pages`
- **Reference:** `#motion-ref`

## 4) Structural Naming Contract

### 4.1 Section IDs

- Pattern: `domain-section` (lowercase kebab-case)
- Must be explicit on section roots referenced by in-page navigation.

### 4.2 Scene class naming

- Pattern: `showcase-cinema-scene--<page>-<act>`

### 4.3 Behavior vs appearance

- `vl-*` attributes define behavior.
- classes define layout/style.
- Never encode motion API semantics only in classes.

## 5) Bussola Contract

- `nav.showcase-cinema-rail.vl-bussola` is canonical.
- Every `vl-bussola__stop[href="#..."]` must map to an existing `id`.
- Avoid generic anchors like `#content` when a specific scene/section exists.

## 6) Validation Gates

Validation is mandatory in `verify:contract`:

1. CSS sync check (`packages/css/src` -> `apps/showcase/public/css`)
2. `vl-*` attribute validation against stable/deprecated matrix
3. In-page anchor validation (`href="#id"` target must exist)
4. Contract checklist report generation per page

## 7) Authoring Rules (Framework-first)

### 7.1 Inline CSS policy

- `style="..."` and page-local inline CSS are **last resort only**.
- Prefer framework primitives and declarative attributes in HTML.
- If inline CSS is temporarily required, it must be justified and scheduled for removal.

### 7.2 Declarative layout policy

- Use `data-layout` on structural wrappers instead of inline width overrides.
- Allowed values:
  - `data-layout="boxed"`
  - `data-layout="full-width"`
- Header, sections, and footer must follow the same contract.

### 7.3 HTML layer ergonomics

- Cards, sections, and structural containers should be configurable through attributes/classes that are easy to apply in markup.
- Behavioral semantics stay in `vl-*` attributes.
- Visual/layout semantics stay in structural classes and declarative `data-*` attributes.

---

If a new motion attribute/value is introduced, update:

1. `packages/css/src` implementation
2. this file (`CONTRACT.md`)
3. the relevant catalog section
4. contract validator allowlist/deprecation map
