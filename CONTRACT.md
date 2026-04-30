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

---

If a new motion attribute/value is introduced, update:

1. `packages/css/src` implementation
2. this file (`CONTRACT.md`)
3. the relevant catalog section
4. contract validator allowlist/deprecation map
