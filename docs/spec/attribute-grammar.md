# Velora Attribute Grammar

**Status:** Canonical public spec (P0.2)  
**Last updated:** 2026-08-30  
**Implementation:** `packages/css/src/**`  
**Operational matrix:** [`docs/project/CONTRACT.md`](../project/CONTRACT.md)  
**Preset registry:** [`packages/catalog/`](../../packages/catalog/) — run `pnpm generate:catalog`

---

## Mental model

```html
<article vl-enter="fade-up">
```

```text
HTML declares intent
        ↓
Velora attribute grammar (this document)
        ↓
Modern CSS primitives (animation, scroll-driven timelines, view transitions)
        ↓
Browser executes motion — zero animation runtime JavaScript
```

Velora does **not** own application state. It animates transitions triggered by native selectors (`:hover`, `:checked`, `:open`, …) or external state (`data-state="open"`).

---

## Status levels

Every attribute and value carries one of:

| Status | Meaning |
|--------|---------|
| **stable** | Required behavior; covered by contract validation |
| **progressive enhancement** | Feature-detected; baseline content and interaction remain usable |
| **experimental** | Catalog/lab only; never required by a stable recipe |

Support tiers for browser primitives: see [Compatibility primitives](#compatibility-primitives).

---

## Contract template

Each attribute below follows this schema:

- **Type** — attribute presence, enum, token list, or time/number
- **Valid values**
- **Composition** — what it may combine with
- **Unsupported combinations**
- **Fallback** — behavior when primitives are missing
- **Reduced motion** — `prefers-reduced-motion: reduce` behavior
- **Browser requirements**
- **Status**

---

## Motion taxonomy

Velora keeps five behaviors separate:

1. **Page transitions** — `vl-page-transition` (`@velora/css/transitions`)
2. **Element entry/exit** — `vl-enter`, `vl-exit`, gated by `vl-in-view` when viewport entry is the trigger
3. **Native state transitions** — `vl-state`
4. **Scroll motion** — `vl-scroll`, `vl-timeline="view"`, scene pin+scrub
5. **Scene orchestration** — `vl-scene` + `vl-stage` + acts + channels

---

## Channel attributes

Channels declare **what** motion happens. Prefer channels over `vl-effect` for new authoring.

### `vl-enter`

| Field | Value |
|-------|-------|
| **Type** | Token list (`~=`) — one or more preset names |
| **Valid values** | See [Enter presets](#enter-presets). Also any `vl-effect` enter preset via shared token map |
| **Composition** | `vl-timeline`, `vl-duration`, `vl-delay`, `vl-speed`, `vl-range`, `vl-once`, `vl-in-view`, `vl-act`/`vl-span` (on stage children), `vl-children`/`vl-stagger` (on parent) |
| **Unsupported** | Multiple conflicting channel attrs on same element (`vl-enter` + `vl-scroll` as primary intent — use scene acts instead). Do not nest `vl-in-view` inside `[vl-scene][vl-timeline="view"] [vl-stage]` |
| **Fallback** | Without `animation-timeline: view()`: time-based `animation` with `animation-fill-mode: both`; content ends visible |
| **Reduced motion** | Animations disabled; final composed state (opacity 1, no transform) |
| **Browser requirements** | CSS Animations (stable). View-linked range: scroll-driven animations (progressive) |
| **Status** | **stable** |

#### Enter presets

Core (`03-motion.css`): `fade-in`, `fade-up`, `fade-down`, `slide-left`, `slide-right`, `scale-in`, `pop-in`, `blur-in`, `3d-entry`, `reveal-3d`, `flow-in`, `clip-rise`, `text-reveal`, `text-reveal-up`, `text-reveal-down`, `tilt-in`, `reveal-cinematic`, `depth-enter`, `mask-sweep`, `glide-in`, `unfold`, `focus`

Extended (`03b-motion-extended.css`): `spring-up`, `zoom-blur`, `slice-in`, `slide-diagonal`, `flip-in`, `spring-3d`, `rise-3d`, `drop-in`, `skew-slide`, `hinge-down`, …

Full enumerated list: generated in `packages/catalog/` (P0.3).

---

### `vl-exit`

| Field | Value |
|-------|-------|
| **Type** | Token list |
| **Valid values** | `fade-out`, `fade-out-up`, `fade-out-down`, `shrink-out`, `blur-out`, `slide-out-left`, `slide-out-right`, `clip-drop`, … |
| **Composition** | Same timing attrs as `vl-enter`; pairs with `vl-in-view` for viewport-gated exit |
| **Unsupported** | Same as `vl-enter` |
| **Fallback** | Time-based animation; without support, element remains in DOM-visible state |
| **Reduced motion** | Exit motion skipped; no hidden essential content |
| **Browser requirements** | CSS Animations |
| **Status** | **stable** |

---

### `vl-scroll`

| Field | Value |
|-------|-------|
| **Type** | Token list |
| **Valid values** | `parallax`, `cinema-zoom`, `depth-drift`, `scroll-marquee`, `scroll-horizontal`, `scroll-scale`, `rotate-scroll`, `crossfade`, `text-highlight`, `reveal`, `media-zoom`, `depth-push`, `path` |
| **Composition** | `vl-timeline="view"|"scroll"`, `vl-range`, `vl-depth` (1–4), `vl-act`/`vl-span`, `vl-scene`/`vl-stage` |
| **Unsupported** | `vl-in-view` does **not** gate or pause scroll motion |
| **Fallback** | Without scroll-driven animations: static layout or time-based fallback where defined; `path` requires `--vl-path` token |
| **Reduced motion** | Scroll-linked animation disabled; static content |
| **Browser requirements** | Scroll-driven animations (**stable** with fallback). `path`: `offset-path` (**progressive**) |
| **Status** | **stable** (`path`, `scroll-marquee`: **progressive enhancement**) |

`vl-scroll="path"` requires a host-provided `--vl-path` custom property.

---

### `vl-hover`

| Field | Value |
|-------|-------|
| **Type** | Token list |
| **Valid values** | `hover-lift`, `hover-glow`, `underline-expand`, `icon-shift`, `gradient-sweep`, `border-trace`, plus composite presets (`hover-tilt-3d`, `hover-card-stack`, `hover-cross-swap`, `hover-orb-grid`, …) |
| **Composition** | `vl-speed`, `vl-duration`; some presets use `:has()` for sibling choreography |
| **Unsupported** | Cannot rely on hover-only motion for essential information |
| **Fallback** | `:hover` / `:focus-visible` baseline; `:has()`-based presets degrade to simpler hover |
| **Reduced motion** | Hover transitions simplified or instant |
| **Browser requirements** | CSS Transitions/Animations. `:has()` presets: **progressive enhancement** |
| **Status** | **stable** |

---

### `vl-loop` / `vl-loop-effect`

| Field | Value |
|-------|-------|
| **Type** | `vl-loop`: iteration count (`-1`, `infinite`, `0+`). `vl-loop-effect`: token list |
| **Valid values** | Effects: `shimmer`, `float`, `glow-breathe`, `wobble`, `rock`, `morph`, `spin`, `orbit`, `orbit-spin`, `aurora-drift`, `breathe`, `pendulum`, … |
| **Composition** | `vl-speed`, `vl-duration`; gated by `vl-in-view` for ambient loops that should pause off-screen |
| **Unsupported** | Essential UI must not depend on looping motion |
| **Fallback** | Time-based `animation` with iteration count |
| **Reduced motion** | Loops disabled |
| **Browser requirements** | CSS Animations |
| **Status** | **stable** |

---

### `vl-state`

| Field | Value |
|-------|-------|
| **Type** | Enum |
| **Valid values** | `smooth`, `enter-exit`, `expand`, `top-layer` |
| **Composition** | Native triggers: `:checked`, `:open`, `:popover-open`, `[open]`, details/summary, dialog |
| **Unsupported** | Velora does not set application state — host must toggle native or `data-state` |
| **Fallback** | Without `@starting-style`: instant state change; content remains accessible |
| **Reduced motion** | Discrete transitions without motion |
| **Browser requirements** | `@starting-style`, `allow-discrete` (**stable**). `expand`: `calc-size()` (**progressive**) |
| **Status** | **stable** |

Principle: *Velora may animate state transitions without owning application state.*

---

### `vl-effect`

| Field | Value |
|-------|-------|
| **Type** | Token list — named preset (legacy escape hatch + composites) |
| **Valid values** | All presets in `packages/compiler/src/grammar.mjs` → `KNOWN_PRESETS` (~90+ tokens). Includes compositions (`scene-hero-reveal`, `border-beam`, `typewriter`, …) |
| **Composition** | Same as channels; prefer explicit channel attr for new work |
| **Unsupported** | Do not use as primary API on new pages when a channel exists |
| **Fallback** | Per-preset; generally same as equivalent channel |
| **Reduced motion** | Same as channels |
| **Browser requirements** | Varies by preset |
| **Status** | **stable** (authoring: prefer channels) |

---

### `vl-base`

| Field | Value |
|-------|-------|
| **Type** | Enum — intensity preset |
| **Valid values** | `subtle`, `balanced`, `dramatic` |
| **Composition** | Modifies engine knobs on element subtree |
| **Status** | **stable** |

---

## Timing and control attributes

### `vl-timeline`

| Field | Value |
|-------|-------|
| **Type** | Enum |
| **Valid values** | `view`, `scroll`, `auto`, `state`, `hover` |
| **On `[vl-scene]`** | Clock mode for stage children: `view` (shared scroll clock) or `auto` (time film) |
| **On other elements** | Binds element animation to named view/scroll timeline |
| **Composition** | With `vl-scene`: pairs with `vl-pin`, `vl-scrub` on `view` only |
| **Unsupported** | `vl-pin`/`vl-scrub` are no-ops when `vl-timeline="auto"` on scene |
| **Fallback** | `auto` → time-based animations |
| **Reduced motion** | Timelines inactive |
| **Browser requirements** | `view`/`scroll`: scroll-driven animations |
| **Status** | **stable** |

---

### `vl-range`

| Field | Value |
|-------|-------|
| **Type** | Enum |
| **Valid values** | `entry`, `entry-short`, `entry-long`, `cover`, `contain`, `custom`, `scene-soft`, `scene-focus`, `exit`, `exit-short`, `center`, `full`, `entry-micro`, `cinema-wide` |
| **Composition** | Overrides act-derived **ranges** only; `--vl-scene` clock binding preserved on view-clock stages |
| **Fallback** | Default act-derived range |
| **Status** | **stable** |

---

### `vl-duration` / `vl-delay` / `vl-stagger`

| Field | Value |
|-------|-------|
| **Type** | Time (`120ms`, `1.2s`) or `var(--token)` |
| **Composition** | `vl-delay` on element; `vl-stagger` on parent with `vl-children` |
| **Fallback** | Typed `attr()` with enum fallbacks when unsupported |
| **Status** | **stable** (`attr()` typing: **progressive enhancement**) |

---

### `vl-speed`

| Field | Value |
|-------|-------|
| **Type** | Enum |
| **Valid values** | `slow`, `normal`, `fast`, `cinema`, `slower`, `fastest`, `turbo`, `ultra-slow` |
| **Composition** | Maps to duration buckets via motion tokens |
| **Status** | **stable** |

---

### `vl-direction`

| Field | Value |
|-------|-------|
| **Type** | Enum |
| **Valid values** | `normal`, `reverse`, `alternate`, `alternate-reverse` |
| **Status** | **stable** |

---

### `vl-depth`

| Field | Value |
|-------|-------|
| **Type** | Number 1–4 |
| **Composition** | Parallax / scroll presets |
| **Status** | **stable** |

---

### `vl-motion`

| Field | Value |
|-------|-------|
| **Type** | Enum — subtree motion mode |
| **Valid values** | `standard`, `subtle`, `cinematic`, `still` |
| **Composition** | Rescales engine knobs (`--vl-duration-*`, travel, blur) for subtree |
| **Fallback** | Baseline attribute selectors work everywhere; `if()` refinement in `@supports` |
| **Reduced motion** | Global reduce honored; `still` forces rest regardless of OS |
| **Browser requirements** | Baseline: stable. `if()` block: **experimental** |
| **Status** | **stable** (`if()` refinement: **progressive enhancement**) |

---

### `vl-once`

| Field | Value |
|-------|-------|
| **Type** | Boolean presence |
| **Composition** | One-shot reveal animations |
| **Status** | **stable** |

---

### `vl-children`

| Field | Value |
|-------|-------|
| **Type** | Enum — child choreography mode |
| **Valid values** | Core: `stagger`, `cascade`, `sequence`, `orchestrate`. Extended: `wave`, `blur-cascade`, `zoom-stagger`, `cinema-stagger`, `grid-wave`, `spiral-stagger`, `list-enter`, `list-enter-right` |
| **Composition** | Requires child elements; pairs with `vl-stagger`. Applies delays to children without their own channel attr |
| **Fallback** | Fixed `nth-child` lists (up to 12); `sibling-index()` when supported |
| **Reduced motion** | Stagger delays collapsed |
| **Browser requirements** | `sibling-index()`: **progressive enhancement** |
| **Status** | **stable** (extended modes in `motion-extended`) |

---

## Scene engine attributes

Host-agnostic track / stage / acts. Implementation: `03c-scene-engine.css`.

### `vl-scene`

| Field | Value |
|-------|-------|
| **Type** | Optional token — scene track |
| **Valid values** | Presence only, or named recipes: `cinematic-hero`, `sticky-story`, `glass-bento`, `product-reveal`, `editorial-cinema` (theme layer — `scene-recipes.css`) |
| **Composition** | `vl-timeline="view"|"auto"`, `vl-pin`, `vl-scrub` |
| **Fallback** | Without view timelines: block layout; stage children use time-based fallback |
| **Reduced motion** | Scene animations disabled |
| **Browser requirements** | `view-timeline-name`, `timeline-scope`, sticky |
| **Status** | **stable** (named recipes: theme-only, not required for host-agnostic scenes) |

---

### `vl-stage`

| Field | Value |
|-------|-------|
| **Type** | Boolean presence — sticky stage child of `[vl-scene]` |
| **Composition** | Channel attrs + `vl-act`/`vl-span` on **direct children only** |
| **Unsupported** | Nested wrappers between stage and channels lose act/clock binding |
| **Fallback** | Relative block if sticky unsupported (rare) |
| **Status** | **stable** |

---

### `vl-act` / `vl-span`

| Field | Value |
|-------|-------|
| **Type** | Number — beat index (1-based) and span length |
| **Valid values** | `vl-act="1"`…`n`; `vl-span="1"`…`n` (default 1) |
| **Composition** | Direct `[vl-stage]` children only; same act = overlap; omit act → DOM order / `sibling-index()` |
| **Fallback** | DOM order when `sibling-index()` unavailable |
| **Status** | **stable** |

---

### `vl-pin`

| Field | Value |
|-------|-------|
| **Type** | Number 1–10 |
| **On `[vl-scene][vl-timeline="view"]`** | Track height = N × 100svh |
| **Elsewhere** | Legacy sticky positioning |
| **Unsupported** | No-op on `vl-timeline="auto"` |
| **Fallback** | Enum values 1–10; typed `attr()` for arbitrary N |
| **Status** | **stable** |

---

### `vl-scrub`

| Field | Value |
|-------|-------|
| **Type** | Boolean presence |
| **Composition** | View-clock scenes only; linear 1ms + fill both on stage child channels |
| **Unsupported** | Ignored on `vl-timeline="auto"` |
| **Status** | **stable** |

---

### `vl-in-view`

| Field | Value |
|-------|-------|
| **Type** | Boolean presence — temporal viewport gate |
| **Behavior** | Gates descendant temporal motion (`vl-enter`, `vl-exit`, `vl-loop`, `vl-hover`, `vl-state`, time-based `vl-effect`). Clears and **replays** on re-entry. Does **not** pause `vl-scroll` |
| **Unsupported** | **Do not nest** inside `[vl-scene][vl-timeline="view"] [vl-stage]` — use scene acts instead |
| **Fallback** | Without `@property` + container style queries: simplified in-view behavior |
| **Reduced motion** | Gate bypassed; content visible |
| **Browser requirements** | `@property`, `@container style()`, view timelines |
| **Status** | **stable** |

---

### `vl-scene-trigger` / `vl-scene-trigger-zone`

| Field | Value |
|-------|-------|
| **Type** | Enum / zone modifier |
| **Composition** | Pause/resume scroll motion on interaction |
| **Fallback** | `:hover` / `:focus-within` when `:has()` unavailable |
| **Browser requirements** | `:has()` for zone mode: **progressive enhancement** |
| **Status** | **progressive enhancement** |

---

### `vl-scroll-markers`

| Field | Value |
|-------|-------|
| **Type** | Boolean / configuration |
| **Composition** | Scroll marker groups for scroll-driven UI |
| **Browser requirements** | `::scroll-marker`, `scroll-marker-group` |
| **Status** | **experimental** |

---

## Page transitions

### `vl-page-transition`

| Field | Value |
|-------|-------|
| **Type** | Enum on `<html>` |
| **Valid values** | Default (Velora), `wipe`, `glide`, `iris`, `cinema`, `snap` |
| **Composition** | `@view-transition { navigation: auto }`; shared element classes `.vl-vt-shared-nav`, `.vl-vt-shared-brand` |
| **Unsupported** | Cross-document VT requires browser + navigation support; SPA VT requires JS — **not** zero-runtime |
| **Fallback** | Instant navigation |
| **Reduced motion** | Transitions disabled or instant |
| **Browser requirements** | View Transitions API (MPA) |
| **Status** | **stable** (MPA); element-scoped VT: **out of core contract** |

Package: `@velora/css/transitions`

---

## Deprecated attributes

Forbidden in examples and showcase pages:

| Attribute | Replacement |
|-----------|-------------|
| `vl-type` | `vl-timeline` + channel attributes |
| `vl-easing` | Motion tokens / effect contracts (`--vl-motion-ease`) |
| `vl-transition` | `vl-page-transition` + shared VT classes |

---

## Allowlisted — not implemented as `[vl-*]`

| Name | Reality |
|------|---------|
| `vl-vt-shared-nav`, `vl-vt-shared-brand` | CSS **classes** in `05-transitions.css` |
| `vl-logo-lockup` | Showcase shell class |
| `vl-card` | Design-system component |
| `vl-actuator`, `vl-scale-shift`, `vl-counter-fwd` | Reserved; no core CSS |
| `vl-targets` | Documented; **no CSS rules** |

---

## Global composition rules

### Baseline scene recipe

```html
<section vl-scene vl-timeline="view" vl-pin="3" vl-scrub>
  <div vl-stage>
    <h1 vl-enter="fade-up" vl-act="1">Title</h1>
    <p vl-enter="fade-up" vl-act="1">Sub</p>
    <img vl-scroll="media-zoom" vl-act="2" vl-span="2" alt="">
  </div>
</section>
```

### Authoring rules

1. Start with `vl-scene` + `vl-stage` for scroll stories.
2. Place channel attrs + `vl-act` on **direct** stage children.
3. Style with host UI (Tailwind, etc.) — motion does not require Velora component classes.
4. Use `vl-in-view` for temporal reveals **outside** pin+scrub stages.
5. Use scene acts for scrubbed choreography **inside** pin+scrub stages.
6. One primary channel intent per element.
7. `vl-range` overrides ranges only — never unbinds `--vl-scene`.

### Bussola + scene clock

Page section IDs used as view timelines (`--tl-N`) must compose with scene clock:

```css
#section-id {
  view-timeline-name: --vl-scene, --tl-N;
}
```

Unlayered `.scene-tl-stage { position: relative }` breaks sticky on `[vl-stage]`.

---

## Progressive enhancement (global)

Rule: **The effect may disappear. The interface must not.**

- Baseline: content visible (`opacity: 1`, no essential hidden state).
- Enhanced behavior inside `@supports (animation-timeline: view())`, `@supports (sibling-index(): 0)`, etc.
- No `opacity: 0` without a guaranteed restore path.

---

## Reduced motion (global)

All public features honor:

```css
@media (prefers-reduced-motion: reduce) { … }
```

Expected behavior:

- Content remains visible and accessible
- Motion collapses or simplifies
- Interaction does not depend on animation
- `vl-motion="still"` forces rest regardless of OS preference

---

## Compatibility primitives

| Primitive | Status | Fallback |
|-----------|--------|----------|
| CSS Animations / Transitions | stable | — |
| `@layer` | stable | — |
| Scroll-driven animations | stable | time-based `animation` |
| `@starting-style`, discrete transitions | stable | instant state change |
| `view-timeline-name`, `timeline-scope` | stable | time-based |
| `position: sticky` | stable | block flow |
| `:has()` | progressive | simpler selectors |
| `sibling-index()` / `sibling-count()` | progressive | `nth-child` (≤12) |
| Typed `attr()` | progressive | enum fallbacks |
| `if()` | experimental | baseline attribute rules |
| `calc-size()` | progressive | fixed size |
| `offset-path` | progressive | static layout |
| `::scroll-marker` | experimental | none |
| View Transitions API | stable (browser-dependent) | instant navigation |

---

## Package surfaces

| Export | Includes |
|--------|----------|
| `@velora/css/motion-core` | Tokens, channels, scene engine, state, conditions |
| `@velora/css/motion-extended` | Extended presets, extra stagger modes |
| `@velora/css/transitions` | `vl-page-transition` |
| `@velora/css/theme` | Visual tokens + scene recipes |
| `@velora/css` / `full` | Convenience bundle |

---

## Maintenance

When adding or changing an attribute:

1. Implement in `packages/css/src/`
2. Update this file
3. Update `docs/project/CONTRACT.md`
4. Update `packages/compiler/src/grammar.mjs` and showcase validator allowlist
5. Regenerate `packages/catalog/` (P0.3)
6. Update relevant catalog / Motion Lab entry

Validation: `pnpm verify:contract`
