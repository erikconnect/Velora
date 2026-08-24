# Catalog Audit Findings

**Date:** 2026-08-24  
**Status:** Complete (Phase A) — P0/P1 Catalog fixes applied 2026-08-24  
**Sources:** `apps/showcase/pages/motion/api-motion-catalog.html`, `packages/css/src/**`, `docs/project/CONTRACT.md`  
**Spec:** `2026-08-24-catalog-core-hardening-design.md`

## Summary

The Catalog remains a strong **preset surface**, but it **mis-teaches the scene engine** and under-labels Engine vs Skins. P0 is pin/story authorship and a missing live track/stage/acts demo.

| Priority | Count | Theme |
| --- | ---: | --- |
| P0 | 2 | Broken / missing scene-engine teaching |
| P1 | 5 | UX / labeling / DX framing |
| P2 | 4 | Channel-first polish / experimental segregation |

---

## Findings table

| Section | Markup | CSS support | Verdict | Fix |
| --- | --- | --- | --- | --- |
| `#pin` recipe + demos | `vl-pin="top"`, `vl-pin="center"` on aside/targets | Boolean `[vl-pin]` sticky only (`03-motion.css`). Numeric pin is `[vl-scene][vl-pin="1"…"6"]` in `03c-scene-engine.css`. **No** `top`/`center` selectors. | **obsolete / misleading** | P0 — rewrite as scene engine; teach numeric pin on track |
| `#pin` large story | Sticky aside + scroll steps via `vl-effect` / sticky CSS | Sticky works as generic sticky, **not** scene clock / acts | **obsolete pattern** | P0 — replace with `vl-scene` + `vl-stage` + `vl-act` mini demo |
| `#params` “scene engine” chips | Chip-only: `vl-stage` / `vl-act` / `vl-span` / `vl-pin=N` | CSS exists in `03c-scene-engine.css` | **missing-demo** | P0 — primary live demo in dedicated section |
| `#params` named `vl-scene` values | Chips + short Skin note + Timeline link | Recipes in `scene-recipes.css` / theme | **ok (labeled)** | P1 — move emphasis earlier (intro lane) |
| `#channels` | Channel-first sample + composition order | Matches CONTRACT authorship model | **ok** | P2 — keep as north star |
| `#entrances` + many cards | Heavy `vl-effect="…"`; some `vl-enter` | Both supported; `vl-effect` is escape hatch / legacy surface | **ok / drift** | P2 — prefer `vl-enter` / `vl-scroll` / `vl-hover` in titles where equivalent |
| `#scroll` | Mostly `vl-effect` + `vl-timeline` | Presets exist under effect + scroll channels | **ok / drift** | P2 — show `vl-scroll` where mapped |
| `#stage-3d` | Stage contract demos + `cube-triad-stage` card | Stage-3d contract separate; cube triad in extended | **mixed** | P1 — keep cube under `#cube-triad` only; stage-3d = reusable stage |
| `#cube-triad` | `vl-effect="cube-triad-stage"` | Extended / experimental | **ok experimental** | P1 — label “not the stage-3d contract” |
| Runtime toolbar | Play / pause / delay / duration / speed JS | DX-only; motion ships CSS-only | **ok / unlabeled** | P1 — disclaimer: optional DX, not motion runtime |
| Hero / bussola | Links include `#pin`, omit scene engine | — | **stale TOC** | P1 — `#scene-engine` in bussola + chips |
| Engine vs Skins | No intro lanes | `motion-core` vs `theme` in CONTRACT §2.6 | **missing UX** | P1 — intro block |
| Boolean sticky pin | `[vl-pin]` without values | Still valid sticky helper | **legacy helper** | P2 — footnote only; not primary pin API |
| Overlap scroll demo in `#pin` | Showcase sticky CSS + effects | Not scene-engine acts overlap | **showcase pattern** | P2 — move/relabel or drop after scene-engine lands |

---

## P0 detail

### 1. `vl-pin="top"|"center"` teaching

CONTRACT §2.3 / §2.5: pin is **numeric viewport heights on the track** (`vl-scene`).

Catalog still shows:

```html
<aside vl-pin="top">…</aside>
<div … vl-pin="center" …>
```

Presence of `vl-pin` triggers sticky `top: 0` only. Value `"center"` does nothing special. Authors who copy Catalog get the wrong mental model for pin+scrub stories.

### 2. No primary scene-engine demo

Chips in `#params` name `vl-stage` / `vl-act` / `vl-span`, but Catalog has **no** Catalog-sized live track matching Timeline / CONTRACT baseline:

```html
<section vl-scene vl-timeline="view" vl-pin="3" vl-scrub>
  <div vl-stage>… vl-act / vl-span …</div>
</section>
```

---

## Phase B checklist (from this audit)

1. Replace `#pin` → `#scene-engine` (update TOC / bussola / kind map).
2. Intro: Engine (`@velora/css/motion-core`) vs Skins (`theme` + recipes).
3. Runtime toolbar disclaimer.
4. Cube triad / experimental segregation notes.
5. Keep Skin recipe chip note; reinforce in intro.

## Phase C gate

Do **not** add bulk presets until this file exists (satisfied) and P0 teaching fixes land. Gap inventory is next deliverable after UX pass.
