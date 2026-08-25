# Motion core gap inventory

**Date:** 2026-08-24  
**Status:** Phase C P1 applied — selective Catalog expansion  
**Gate:** Further preset volume stays gated; Skin recipes last.

## Method

Compare attribute values in `packages/css/src/03*.css` selectors vs live Catalog markup.

## Engine completeness

| Gap | Priority | Status |
| --- | --- | --- |
| Act overlap teaching (same `vl-act`) | P1 | **Done** — `#scene-engine` overlap demo + live demo note |
| `vl-span` emphasis | P1 | **Done** — callout on Engine attrs card |
| `vl-timeline="auto"` + acts | P2 | **Done** — auto clock card in `#scene-engine` |
| Channel-first titles for effect aliases | P2 | **Partial** — lead cards + CONTRACT channel rows; legacy `vl-effect` cards retained |
| Boolean sticky `vl-pin` footnote | P2 | **Done** — baseline recipe note |

## Preset coverage (after P1 expansion)

### vl-enter (CONTRACT stable extensions)

| Preset | Catalog card | Channel |
| --- | --- | --- |
| reveal-cinematic | yes | `vl-enter` |
| depth-enter | yes | `vl-enter` |
| mask-sweep | yes | `vl-enter` |

Remaining CSS-only enters (sample): `fade-down`, `flow-in`, `pop-in`, `reveal-3d`, `text-reveal*`, `tilt-in`, `unfold` — **P2 backlog**.

### vl-scroll (CONTRACT stable extensions)

| Preset | Catalog card | Channel |
| --- | --- | --- |
| reveal | yes | `vl-scroll` |
| media-zoom | yes | `vl-scroll` |
| crossfade | yes | `vl-scroll` |
| text-highlight | yes | `vl-scroll` |

Legacy scroll section still demos `vl-effect` aliases (parallax, cinema-zoom, etc.) — intentional for compat surface.

### vl-hover (CONTRACT stable extensions)

| Preset | Catalog card | Channel |
| --- | --- | --- |
| gradient-sweep | yes | `vl-hover` |
| border-trace | yes | `vl-hover` |
| icon-shift | yes | `vl-hover` |

## Recommended next expansions (ordered)

1. ~~Scene-engine teaching polish~~ — done.
2. ~~Promote channel cards for CONTRACT stable enter/scroll/hover~~ — done.
3. **Next:** Optional P2 channel-first rewrites for high-traffic `vl-effect` entrance cards (fade-up, scale-in, …) — cosmetic only.
4. **Next:** Catalog cards for remaining `vl-enter` CSS presets if Timeline/Home teaching needs them.
5. Skin recipes volume stays optional — no bulk add.

## Files touched (Phase C P1)

- `apps/showcase/pages/motion/api-motion-catalog.html` — channel + scene-engine cards
- `apps/showcase/public/css/showcase-api-motion-catalog.css` — demo layout helpers

No framework CSS changes required (presets already shipped in `packages/css/src/03-motion.css`).
