# Host-Agnostic Scene Engine — Design Spec

**Date:** 2026-08-24  
**Status:** Draft for review  
**Scope:** Product boundary + declarative scene timeline (GSAP-like, zero JS) + host UI interoperability (Tailwind and others)

---

## 1. Problem

Velora aims to let authors write cinematic scenes like GSAP timelines (enter/scroll overlap, pin, scrub) using only HTML + CSS. Today the system is strong at **presets and per-element channels**, but weak at **shared scene clocks and relative choreography**. At the same time, the published CSS mixes **motion grammar** with **Velora UI look** (cards, elevation demos, showcase-home patterns), which blocks using Velora on arbitrary UIs (Tailwind, Relume, shadcn, custom DS).

## 2. Goals

1. **Scene authorship model C:** one scene, one clock; relative acts among children; pin + scrub; same markup for time-based (`auto`) and scroll-based (`view`) clocks.
2. **Host-agnostic core:** `vl-*` attributes drive motion only. Host owns layout and visual styling via classes (Tailwind utilities, BEM, etc.).
3. **Showcase as reference UI:** the cinematic design system lives in Showcase / optional theme — not as a requirement to “turn Velora on.”
4. **Progressive enhancement:** baseline selectors work without bleeding-edge CSS; enhance with `attr()` typed, `sibling-index()`, `if()`, named `view-timeline` + `timeline-scope`.
5. **Zero JS for motion:** no animation runtime. Optional `@velora/compiler` remains CI/DX sugar, not the runtime.

## 3. Non-goals

- Replacing GSAP features that require JS (SplitText, MorphSVG, FLIP arbitrary, imperative callbacks).
- Shipping `vl-at="<0.15"` as a native CSS-only feature in v1 (sibling-relative position params need a compiler; deferred).
- Making `@function` a hard dependency (still experimental; may land later as internal sugar).
- Forcing consumers to import Velora component/visual tokens.

## 4. Product surfaces

| Surface | Role | Ships |
| --- | --- | --- |
| `@velora/css` **motion core** | Grammar, keyframes, timelines, pin/stage/acts | Default product |
| `@velora/css` **theme** (optional export) | Velora visual tokens / light-dark / editorial skins | Opt-in |
| `@velora/css` **components** (optional) | `.vl-card`, forms, structures | Opt-in, not required for scenes |
| `apps/showcase` | Reference UI + living catalogs + recipes with layout | Demo only |
| `packages/velora-components` | HTML recipes for the Velora look | Material for showcase / copy-paste |
| `starters/` + `examples/` | Host proofs (HTML-only, Tailwind) | Docs of interoperability |

### Decision rule (unchanged, sharpened)

1. Motion API truth: `packages/css/src` motion layers + `docs/project/CONTRACT.md`
2. Visual truth for Velora brand: Showcase / theme export
3. Host truth for appearance: consumer’s CSS (Tailwind, etc.)

### Leakage to remove from published full/motion paths

- `04e-showcase-elevation-patterns.css` must **not** ship in the default consumer bundle.
- `08-showcase-home.css` must live only under showcase (or a showcase-only path), not as framework source-of-truth for consumers.

## 5. Scene engine — authorship model

### 5.1 Mental model (GSAP → Velora)

| GSAP | Velora |
| --- | --- |
| `timeline` | `[vl-scene]` + shared clock (`--vl-scene` view-timeline or `auto`) |
| ScrollTrigger pin | `vl-pin` + track height + `[vl-stage]` sticky |
| scrub | `vl-scrub` → linear + fill both |
| `.from()` / channel | `vl-enter` / `vl-scroll` / existing channels |
| Overlap `"<"` | Same `vl-act` |
| Sequence | Different `vl-act` or omit `vl-act` → `sibling-index()` |
| Duration on timeline | `vl-span` (acts) or `vl-range` escape hatch |

### 5.2 Canonical markup

```html
<section vl-scene vl-timeline="view" vl-pin="3" vl-scrub>
  <div vl-stage>
    <p vl-enter="fade-up" vl-act="1">Kicker</p>
    <h1 vl-enter="clip-rise" vl-act="1">Title</h1>
    <img vl-scroll="media-zoom" vl-act="2" vl-span="2" alt="">
    <a vl-enter="fade-up">CTA</a>
  </div>
</section>
```

Host-styled variant (Tailwind) — **same** `vl-*`:

```html
<section vl-scene vl-timeline="view" vl-pin="3" vl-scrub>
  <div vl-stage class="min-h-svh grid place-items-center gap-6 px-6">
    <p class="text-sm uppercase tracking-widest" vl-enter="fade-up" vl-act="1">Kicker</p>
    <h1 class="text-5xl font-semibold" vl-enter="clip-rise" vl-act="1">Title</h1>
    <img class="w-full max-w-3xl rounded-2xl" vl-scroll="media-zoom" vl-act="2" vl-span="2" alt="">
  </div>
</section>
```

### 5.3 Structure: track + stage

- **Track** = `[vl-scene]` (optionally with `vl-pin`): owns `view-timeline-name: --vl-scene`, `timeline-scope`, and scroll height (`min-block-size` from pin multiplier).
- **Stage** = `[vl-stage]`: `position: sticky; inset-block-start: 0; min-block-size: 100svh`. Visual children live here.
- **Why:** a sticky subject freezes its own anonymous `view()` progress. Children must bind to the **named** track timeline, not their personal view timeline while pinned.

### 5.4 Attributes (new / clarified)

| Attribute | Where | Meaning |
| --- | --- | --- |
| `vl-scene` | Track | Scene container; may still accept named *choreography* presets later, but **layout look** presets move to showcase recipes |
| `vl-stage` | Direct stage child | Sticky viewport stage |
| `vl-timeline` | Scene | `view` \| `auto` (and existing values where they still apply). Clock mode for children. |
| `vl-pin` | Scene | Number of viewport heights for track (typed via `attr(vl-pin type(<number>))`); boolean/`present` may map to `1` |
| `vl-scrub` | Scene | Force scrub semantics on scene-driven children |
| `vl-act` | Stage child | Beat index (1-based). Same act = simultaneous start. |
| `vl-span` | Stage child | How many beats the tween spans (default `1`) |
| `vl-range` | Stage child | Escape hatch; overrides act-derived range when set |
| Existing channels | Any | `vl-enter`, `vl-scroll`, `vl-loop`, `vl-hover`, `vl-exit`, `vl-state`, … unchanged |

Default act when `vl-act` omitted: `sibling-index()` (enhancement) or `:nth-child` baseline.

Default beat grid: `--vl-beats: 8` (token; overridable on scene).

### 5.5 Clock mapping

**`vl-timeline="view"` (scroll film):**

- Children: `animation-timeline: --vl-scene`
- `animation-range: start% end%` derived from act/span/beats
- Formula (conceptual):
  - `start = (act - 1) / beats * 100%`
  - `end = (act + span - 1) / beats * 100%`

**`vl-timeline="auto"` (time film):**

- Same markup
- Children use time timeline; act maps to `animation-delay: (act - 1) * --vl-beat`
- Pin/scrub ignored or no-ops

### 5.6 Progressive enhancement layers

Mirror Conditional Motion Engine (`03a-motion-conditions.css`):

1. **Baseline:** `:nth-child` delays / fixed ranges; `[vl-timeline="view"]` selectors; sticky pin without typed `attr`
2. **Enhancement A:** typed `attr(vl-act|vl-span|vl-pin|vl-duration …)` + `calc` for ranges
3. **Enhancement B:** `sibling-index()` / `sibling-count()` for default stagger without act
4. **Enhancement C:** `if(style()/media()/supports())` for single-rule clock switching + reduced-motion knobs
5. **Later:** `@function --vl-act-range(...)` when stable — not required for ship

Always: `prefers-reduced-motion: reduce` collapses motion; content remains readable.

## 6. Package / export shape (target)

Clarify exports so hosts can take motion without UI:

| Export | Intent |
| --- | --- |
| `@velora/css/motion-core` | Channels + conditions + **scene engine** (track/stage/acts) |
| `@velora/css/motion-extended` | Extra effect presets |
| `@velora/css/transitions` | View transition presets |
| `@velora/css/base` | Reset + **motion tokens only** + layout primitives that are structural (container optional) — revisit so visual tokens are not mandatory |
| `@velora/css/theme` | **New** — brand colors, type stacks, elevation |
| `@velora/css/components-core` | Optional UI primitives |
| `@velora/css` / `full` | Theme + components + motion (convenience, not the interoperability proof) |

Interoperability proof: Tailwind page imports **motion-core (+ transitions)** only and styles with utilities.

`@layer velora.*` stays below host utility layers so Tailwind wins on appearance; attributes still drive animation.

## 7. Presets vs recipes

- **Core:** engines and channel presets that are motion-only (`fade-up`, `clip-rise`, `media-zoom`, …).
- **Showcase recipes:** compositions that include layout/look (`cinematic-hero` *as a full page pattern* with grid/glass). Named scene values that currently inject layout should be migrated to showcase HTML recipes or optional theme packages over time — not expanded in core.
- Existing `vl-scene="cinematic-hero"` etc. may remain temporarily for compatibility but are documented as **Velora-look recipes**, not host-agnostic API. New docs push track/stage + acts.

## 8. Contract / validation updates

Update when implementing:

1. `docs/project/CONTRACT.md` — add `vl-stage`, `vl-act`, `vl-span`; clarify `vl-pin` numeric; scene structure rules
2. Compiler `ALLOWED_VL_ATTRS` + grammar
3. Showcase validator allowlist
4. Astro docs: scene timeline chapter + Tailwind host page
5. Agent handbook / skill references — product thesis: motion language, not mandatory design system

## 9. Host interoperability rules

1. No requirement to use `.vl-*` component classes for scenes to work.
2. No requirement to use Velora color/type tokens for scenes to work.
3. Motion tokens (`--vl-duration-*`, `--vl-ease-*`, `--vl-beats`, `--vl-beat`) may ship with motion-core as engine knobs (not brand).
4. Showcase proves the Velora cinematic UI; `examples/` (or starter) proves Tailwind / bare HTML hosts.
5. Do not encode motion semantics only in host classes.

## 10. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Sticky + view-timeline footguns | Document track/stage as required for pin; tests in showcase |
| `if()` / typed `attr` / `sibling-index` gaps (Firefox/Safari lag) | Baseline selectors; `@supports` enhancement blocks |
| Bundle still pulls showcase CSS | Explicit removal from `velora.css` + sync scripts |
| API sprawl (too many attrs) | Keep act/span/stage minimal; no GSAP position-string in core v1 |
| Breaking existing scene presets | Compat shim + migration notes; recipes move gradually |

## 11. Success criteria

- Author can write a pin+scrub multi-act scene in HTML without JS.
- Same scene works with Tailwind classes and with Velora showcase classes.
- Default npm motion path does not include showcase-elevation / showcase-home CSS.
- `pnpm verify:contract` green with new attrs.
- Reduced-motion and no-`if()` browsers still show usable content (degraded motion).

## 12. Implementation sequencing (high level)

1. Spec approval (this doc)
2. Boundary hygiene: extract showcase CSS from consumer bundle
3. Scene engine CSS (track/stage/pin/acts) + CONTRACT + validator
4. Showcase demo page for scene timeline (Velora UI)
5. Tailwind (or bare utility) host example proving agnostic core
6. Docs/handbook thesis update
7. Optional: compiler sugar for `vl-at` position strings (later)

---

## Open questions (resolved in conversation)

| Question | Decision |
| --- | --- |
| A/B/C authorship? | **C** — scroll + relative acts in one markup |
| Pure CSS acts vs GSAP strings? | Acts + range escape; compiler GSAP strings later |
| Showcase role? | Reference UI / DS, not required for framework |
| Tailwind? | First-class host; classes for look, `vl-*` for motion |
