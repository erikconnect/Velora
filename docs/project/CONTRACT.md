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
- `vl-motion`
- `vl-direction`
- `vl-loop`
- `vl-loop-effect`
- `vl-children`
- `vl-stagger`
- `vl-scene`
- `vl-stage`
- `vl-act`
- `vl-span`
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
- `vl-scene`: `cinematic-hero`, `sticky-story`, `glass-bento`, `product-reveal`, `editorial-cinema` (**Velora-look recipes** in `scene-recipes.css` / theme — not required for host-agnostic scenes)
- `vl-motion`: `standard`, `subtle`, `cinematic`, `still`
- `vl-pin`: numeric viewport heights (`1`–`6`, or typed `attr` enhancement)
- `vl-act` / `vl-span`: beat index and span on `[vl-stage]` children (scene engine)

### 2.3.1 Conditional Motion Engine — `vl-motion`

`vl-motion` selects a motion *mode* for an element and its subtree. It does not
name a preset; instead it re-scales the central engine knobs (defined in
`01-motion-tokens.css` / aggregated via `01-tokens.css`) that existing presets already consume, so one attribute adapts
timing, travel distance, depth, blur and easing without per-selector overrides.
Implemented in `packages/css/src/03a-motion-conditions.css`.

| Value | Intent | Engine effect |
| ----- | ------ | ------------- |
| `standard` | Default balanced feel | Neutral scale (1×), cinematic easing |
| `subtle` | Quiet, fast, short travel | Faster duration, reduced travel/depth, soft easing |
| `cinematic` | Grand, slow, deep, blurred entrances | Slower duration, larger travel/depth, entrance blur |
| `still` | Author-driven reduced motion | Resting/composed state, no movement (regardless of OS setting) |

Progressive enhancement contract:

- Baseline behavior uses plain `[vl-motion="…"]` attribute selectors and works in
  every browser.
- Advanced conditional refinement uses CSS `if()` with `media()`, `style()` and
  `supports()`, wrapped in `@supports (width: if(...))`. Browsers without `if()`
  ignore that block and keep the baseline values.
- `prefers-reduced-motion: reduce` is always honored (engine knobs collapse here
  and animations are disabled globally in `03-motion.css`).

### 2.4 Authoring profile (v2 target: practical and flexible)

Preferred model for **new** scenes: host-agnostic track / stage / acts (see `03c-scene-engine.css`).

- **Scene clock:** `vl-scene` + `vl-timeline="view"|auto"` + optional `vl-pin` + `vl-scrub`
- **Stage:** `vl-stage` (sticky child of the track)
- **Acts:** `vl-act` + optional `vl-span` on stage children (same act = overlap; omit act → DOM order / `sibling-index()`)
- **Channels:** `vl-enter`, `vl-scroll`, `vl-exit`, …
- **Escape hatch:** `vl-range` overrides act-derived ranges
- **Look:** host classes (Tailwind, etc.) or optional `@velora/css/theme` / named scene recipes

Authoring rule for new demos/pages:

1. Start with `vl-scene` + `vl-stage` (pin/scrub when scroll-story).
2. Place channel attrs + `vl-act` on stage children.
3. Style with host UI — do not require `.vl-*` component classes for motion to work.
4. Named `vl-scene="cinematic-hero"` etc. remain as **Velora skin recipes** (compat).

### 2.5 Baseline scene recipe (recommended)

```html
<section vl-scene vl-timeline="view" vl-pin="3" vl-scrub>
  <div vl-stage>
    <h1 vl-enter="fade-up" vl-act="1">Title</h1>
    <p vl-enter="fade-up" vl-act="1">Sub</p>
    <img vl-scroll="media-zoom" vl-act="2" vl-span="2" alt="">
  </div>
</section>
```

This keeps the API compact while preserving flexibility for advanced timelines.

### 2.6 Package surfaces

| Export | Role |
| --- | --- |
| `@velora/css/motion-core` | Host-agnostic motion + scene engine |
| `@velora/css/theme` | Visual tokens + editorial + scene recipes |
| `@velora/css` / `full` | Convenience: theme + components + motion |
| Showcase-only CSS | `04e-*`, `08-showcase-home` — not in npm consumer path |

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
