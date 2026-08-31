# Core Release Desk — Design

**Date:** 2026-08-27  
**Page:** `apps/showcase/pages/core/core.html`  
**Status:** Superseded by `2026-08-27-core-opera-scenes-design.md` (desk pass rejected as too sparse)

## 1) Problem

Core teaches the public grammar well but reads as a mural of explanatory cards. Users do not *direct* anything. Elements already proves interactive native UI; Skins already owns the “Release brief / 07” product artifact. Core should be the desk where that brief is directed.

## 2) Goal

Reform Core into a **Release desk**: one semantic artifact (Release brief / 07) travels through five acts. Each act exposes one Core lever on that artifact—architecture ownership, timeline drivers, channel composition, motion policy—using real Velora attributes and native HTML controls. Zero JS motion runtime.

## 3) Non-goals

- Reforming Elements, Skins, Home, or Catalog in this pass
- New `vl-*` attributes or engine presets
- JS to toggle `vl-motion` / clocks (shell scripts stay as-is)
- Turning Core into a dashboard or control panel chrome

## 4) Narrative spine

| Act | ID | Teaching beat | Brief role |
|---|---|---|---|
| 01 Hero | `#core-intro` | Intent: HTML states, CSS directs | Brief arrives (load); code sample demoted to `<details>` |
| 02 Architecture | `#core-architecture` | Three owners | Brief + three `details` (`vl-state="expand"`) for Core / Skin / Showcase |
| 03 Drivers | `#core-drivers` | Effect = what, timeline = when | Brief on scrub stage (`vl-timeline="view"` + range); clock list gated |
| 04 Channels | `#core-channels` | One card, five jobs | **Single** composed brief: enter + hover + state + scroll (+ optional popover); channel order legend |
| 05 Policy | `#core-policy` | Motion is a policy | Radios + `:has()` swap panels, each with real `vl-motion` on the brief; support matrix kept |

Bussola stops stay aligned to these five IDs.

## 5) Artifact contract (Release brief)

Reuse the Skins brief semantics (not a one-off invent):

- Name line: `Release brief / 07`
- Live status chip
- Headline + short support
- Metric (`72%` / team alignment)
- Meta chips (Editorial / Live / Accessible)
- Primary action (context-specific label per act)

Visual language must stay consistent with Showcase product pages (noir Skin, no exaggerated glow). Prefer extending `showcase-reference-pages.css` / small Core-specific blocks over parallel skin CSS.

Class naming: `showcase-core-brief` (and modifiers), distinct from `showcase-skin-preview` but visually sibling.

## 6) Motion authorship (Playbook §4)

- **Hero:** load / stagger (no gate required)
- **Architecture, Drivers list, Policy chrome:** `vl-in-view` + `vl-children` + tokenized `vl-stagger`
- **Drivers stage brief:** scrub (`vl-timeline="view"` + named/`custom` range)—teaches progress
- **Channels scroll region:** `vl-scroll` + `vl-range` preset
- **Do not** nest `vl-in-view` under pin+scrub scene stages
- Prefer channel attrs (`vl-enter`, …) over legacy `vl-effect`

## 7) Interaction model (zero-JS)

| Control | Native primitive | Velora hook |
|---|---|---|
| Ownership inspect | `details` / `summary` | `vl-state="expand"` |
| Hover response | pointer on brief | `vl-hover="hover-lift"` (or existing lift/depth preset) |
| Smooth state | checkbox/switch or status affordance | `vl-state="smooth"` on the brief or child |
| Scroll channel | metric/media strip inside brief | `vl-scroll="depth-drift"` + `vl-range="cover"` |
| Optional inspect | `button` + `popover` | `vl-state="top-layer enter-exit"` (mirror Elements) |
| Motion voice | radio group `name="core-voice"` | four brief panels; `:has(#id:checked)` shows one; each panel has `vl-motion="…"` |

Inactive policy panels: `hidden` or `inert` so only one brief is in the a11y tree.

## 8) Section-level layout notes

### Hero
- Keep title/lead hierarchy (brand-first, one composition).
- Replace primary aside code wall with the brief; keep import snippet inside `<details>`.

### Architecture
- Remove three static stack cards as the sole UI.
- Brief + accordion column (or stacked details under brief).
- Each `details` body states ownership + package path (`@velora/css/motion-core`, theme, `apps/showcase`).

### Drivers
- Keep “one effect / four clocks” teaching.
- Stage = scrubbing brief; list = Auto / View / Scroll / State explanations (gated stagger).
- Language strip retained.

### Channels
- Delete five separate sample cards.
- One composed brief; short captions or labels mapping channels without duplicating full cards.
- Keep composition order strip (`base → … → exit`).

### Policy
- Replace abstract bar visuals as primary proof.
- Radio voice switcher + brief panel(s).
- Keep fallback proof + support matrix + next CTA to Elements.

## 9) Files to touch

- `apps/showcase/pages/core/core.html` — structure/content
- `apps/showcase/public/css/showcase-reference-pages.css` (or adjacent Showcase CSS owned by the app) — brief desk layout only; **no** framework API redefinition
- Do **not** edit `apps/showcase/public/css/03-*.css` as source; engine changes out of scope
- Optional: one-line pointer in `SHOWCASE_PAGE_PLAYBOOK.md` that Core is the release-desk reference

## 10) Acceptance criteria

1. User can open ownership `details` and understand Core vs Skin vs Showcase on the same brief story.
2. User sees scrub on the drivers brief while scrolling that section.
3. User can hover / toggle state on the channels brief; scroll sub-region moves with view progress.
4. User can switch motion voice via radios and perceive standard / subtle / cinematic / still on a real `vl-motion` attribute (not fake CSS only).
5. `pnpm verify:contract` passes; reduced-motion still leaves content readable.
6. Page still feels cinematic (one composition per first viewport; no dashboard chrome).

## 11) Risks / mitigations

| Risk | Mitigation |
|---|---|
| Four policy briefs duplicate content | Keep copy identical; only `vl-motion` + visible panel change; inert/hidden inactive |
| `:has()` support gaps | Baseline: first panel visible without `:has`; enhancement hides siblings when supported |
| Brief drift from Skins | Shared field list + visual sibling rules in §5 |
| Scope creep into Elements | Popover optional; deep native workflows stay on Elements |

## 12) Implementation order

1. Introduce `showcase-core-brief` markup + CSS sibling to product page styles  
2. Hero + Architecture  
3. Drivers (scrub stage)  
4. Channels (composed brief)  
5. Policy (`:has` + `vl-motion` panels)  
6. Contract verify + visual pass (gate replay, scrub, radios, reduced motion)
