# Core Continuous Opera Track — Design

**Date:** 2026-08-27  
**Page:** `apps/showcase/pages/core/core.html`  
**Extends:** `2026-08-27-core-opera-scenes-design.md`  
**Approved:** continuous track (option 2)

## Goal

One pin+scrub track from hero through channels so Core reads as a single directed film. Policy stays outside the pin.

## Structure

```html
<section id="core-opera" vl-scene vl-timeline="view" vl-pin="10" vl-scrub style="--vl-beats: 12">
  <!-- absolute scroll marks for bussola (not on stage) -->
  <div id="core-intro" class="core-opera-mark"></div>
  <div id="core-architecture" class="core-opera-mark"></div>
  …
  <div vl-stage class="core-opera-track">…acts…</div>
</section>
<section id="core-policy">…</section>
```

- Motion channels are **direct children** of `[vl-stage]` (scene engine contract).
- No `vl-in-view` inside the stage.
- Bussola IDs live on `.core-opera-mark` siblings of the stage, placed at scroll fractions along the track (`inset-block-start: 0% / 20% / …`).
- Track declares `view-timeline-name: --vl-scene, --tl-1` (bussola + scene clock). Policy keeps `--tl-5` (or renumber to `--tl-2`).

## Beat map (`--vl-beats: 12`, `vl-pin="10"`)

| Acts | Chapter | Notes |
|------|---------|--------|
| 1–2 | Hero | kicker/title → lead/CTAs/signal; exit before arch |
| 3–5 | Architecture | three layer cards, staggered; titles span |
| 6–8 | Drivers | clock copy + signal scrub + CTA |
| 9–11 | Channels | compose card + evidence + handoff |
| 12 | Hold / breath | optional score or empty beat |

Earlier chapter pieces use `vl-exit` so the stage does not stack forever.

## Engine gaps to close

- Expose `vl-pin` 7–10 (or rely on typed `attr()` + document fallbacks).
- Expose `vl-act` 9–12 attribute maps for browsers without typed `attr()`.

## Constraints

Zero-JS; Showcase CSS only for layout/marks; edit CSS in `packages/css/src/` then `pnpm sync:showcase-css`.
