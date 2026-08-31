# Velora Contract Matrix

This is the operational contract for Motion API, Design API, and showcase page structure.

**Formal attribute spec:** [`docs/spec/attribute-grammar.md`](../spec/attribute-grammar.md)

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
- `vl-delay`
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
- `vl-in-view`
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
- `vl-easing` -> replace with canonical easing tokens / effect contracts
- `vl-transition` -> replace with `vl-page-transition` + shared VT classes

### 2.3 Stable value extensions (current)

- `vl-enter`: `reveal-cinematic`, `depth-enter`, `mask-sweep`
- `vl-delay`: element-level entry/exit delay, e.g. `vl-delay="120ms"`; use `vl-stagger` for child collection choreography
- `vl-in-view`: viewport gate for **temporal** descendant motion (`vl-enter` / `vl-exit` / `vl-loop` / `vl-hover` / `vl-state` / time-based `vl-effect`); leaving the gate clears and **replays** on re-entry (stagger/delay preserved); does **not** pause `vl-scroll`; do **not** nest inside `[vl-scene][vl-timeline="view"] [vl-stage]` (the scene clock replaces the gate)
- `vl-scroll`: `reveal`, `media-zoom`, `crossfade`, `text-highlight`
- `vl-scroll`: `path` (requires a tokenized `--vl-path`; scroll-linked `offset-distance`)
- `vl-loop` / `vl-loop-effect`: `aurora-drift`
- `vl-hover`: `gradient-sweep`, `border-trace`
- `vl-scene`: `cinematic-hero`, `sticky-story`, `glass-bento`, `product-reveal`, `editorial-cinema` (**Velora-look recipes** in `scene-recipes.css` / theme — not required for host-agnostic scenes)
- `vl-motion`: `standard`, `subtle`, `cinematic`, `still`
- `vl-state`: `smooth`, `enter-exit`, `expand`, `top-layer`
- `vl-pin`: on `[vl-scene][vl-timeline="view"]` — numeric track height (`1`–`6`, or typed `attr`); elsewhere — legacy sticky positioning. Pin height is a no-op on `vl-timeline="auto"`.
- `vl-act` / `vl-span`: beat index and span on **direct** `[vl-stage]` children (scene engine)

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

- **Scene clock:** `vl-scene` + `vl-timeline="view"|auto"` + optional `vl-pin` + `vl-scrub` (pin/scrub apply on view-clock tracks only)
- **Stage:** `vl-stage` (sticky child of the track)
- **Acts:** `vl-act` + optional `vl-span` on **direct** stage children (same act = overlap; omit act → DOM order / `sibling-index()`). Nested wrappers between stage and channels do not receive act/clock binding.
- **Channels:** `vl-enter`, `vl-scroll`, `vl-exit`, … on those direct stage children
- **Viewport gate:** `vl-in-view` wraps temporal channel motion when viewport entry is the trigger; use `vl-timeline="view"` (element) or a scene view-clock when the effect should scrub with progress. Do not nest `vl-in-view` inside a pin+scrub stage.
- **Bussola + scene clock:** page `#id { view-timeline-name: --tl-N }` for compass must not erase the scene engine name. Pin+scrub tracks need `view-timeline-name: --vl-scene, --tl-N` (see Showcase Page Playbook).
- **Stage sticky:** Showcase layout classes must not override `[vl-stage]` sticky with `position: relative` (unlayered CSS wins over `@layer velora.motion`).
- **Escape hatch:** `vl-range` overrides act-derived **ranges** only — the named `--vl-scene` timeline stays bound on view-clock stage children
- **Look:** host classes (Tailwind, etc.) or optional `@velora/css/theme` / named scene recipes

Authoring rule for new demos/pages:

1. Start with `vl-scene` + `vl-stage` (pin/scrub when scroll-story).
2. Place channel attrs + `vl-act` on **direct** stage children (host styles on the same nodes).
3. Style with host UI — do not require `.vl-*` component classes for motion to work.
4. Named `vl-scene="cinematic-hero"` etc. remain as **Velora skin recipes** (compat).
5. Use `vl-in-view` for temporal reveals outside pin+scrub scenes; use scene acts for scrubbed choreography.

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

### 2.7 Motion taxonomy

Velora keeps five behaviors separate so “transition” never becomes an ambiguous API:

1. **Page transitions** — `vl-page-transition` in `@velora/css/transitions`.
2. **Element entry/exit** — `vl-enter`, `vl-exit`, `vl-state="enter-exit"`, gated by `vl-in-view` when viewport entry is the trigger.
3. **Native state transitions** — `vl-state="smooth|expand|top-layer"`.
4. **Scroll motion** — progress-linked `vl-scroll` or `vl-timeline="view"`; use `vl-in-view` for a temporal reveal triggered by entry.
5. **Scene orchestration** — `vl-scene` + `vl-stage` + acts/channels.

Element-scoped View Transitions require `Element.startViewTransition()` and are not part of
the zero-runtime Core contract.

### 2.8 Support levels

| Level | Contract |
| --- | --- |
| Stable | Required for the declared behavior; covered by contract and cross-browser checks. |
| Progressive enhancement | Guarded by feature detection; the semantic content and baseline interaction remain usable. |
| Experimental | Catalog/lab only; never required by a stable recipe. |

- **Stable:** `@starting-style`, discrete transitions, intrinsic-size interpolation, scroll-driven animations, popover/dialog state.
- **Progressive enhancement:** `calc-size()`, customizable select, anchor positioning, `sibling-index()`, scroll markers, `offset-path` refinements.
- **Experimental:** CSS `@function`, scroll-triggered animations, element-scoped View Transitions, emerging shape/border syntax.

## 3) Design Catalog Matrix (scope)

The live Showcase coverage is declared in `apps/showcase/config/showcase-coverage.mjs`.
`Elements` is the canonical component and native-UI proof; `Catalog` is the exhaustive
motion reference organized by interface intent. Run `pnpm --filter showcase audit:coverage`
to detect missing component groups, intent routes, or motion presets.

- **Core:** `#color-tokens`, `#typography`, `#spacing`, `#primitives`
- **Extended:** `#forms`, `#components`, `#pages`
- **Reference:** `#motion-ref`

The visual layer follows `docs/project/SKIN_CONTRACT.md`. A Skin may retoken appearance
and motion voice, but it must not redefine Core behavior.

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
- The navigation carries `data-velora-signature="bussola"` and the visible cap `✦ velora`; this is a distinctive Showcase signature rather than generic page chrome.
- Every registered page uses the same Bussola structure and exposes between one and six page-specific stops.
- Every `vl-bussola__stop[href="#..."]` must map to an existing `id`.
- Avoid generic anchors like `#content` when a specific scene/section exists.

## 5.1) Canonical Showcase shell

- `apps/showcase/index.html` is the source of truth for the exact Header and Footer markup.
- All live and secondary registered pages must use byte-identical Header and Footer blocks.
- Run `pnpm --filter showcase sync:shell` after changing the canonical shell.
- The page audit fails on Header, Footer or Bussola signature drift.

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
2. [`docs/spec/attribute-grammar.md`](../spec/attribute-grammar.md)
3. this file (`CONTRACT.md`)
4. the relevant catalog section
5. contract validator allowlist/deprecation map
6. run `pnpm generate:catalog`
