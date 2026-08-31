# Reduced Motion Validation Checklist

**Status:** P0.7 manual validation protocol  
**Spec:** [`docs/spec/attribute-grammar.md`](../spec/attribute-grammar.md)

Use this checklist when adding or changing public motion presets. Automated browser tests (P0.8) should mirror these cases.

---

## Global expectations

With `prefers-reduced-motion: reduce` enabled (OS or DevTools emulation):

- [ ] Content remains visible — no essential information hidden at rest
- [ ] No infinite loops or ambient motion required for understanding
- [ ] Interaction works without animation (buttons, links, forms, overlays)
- [ ] `vl-motion="still"` forces rest regardless of OS preference

---

## Per preset (Motion Lab inspector)

For each preset in `packages/catalog/`:

- [ ] Final composed state is readable (opacity, transform, clip-path reset)
- [ ] Scroll-linked presets degrade to static layout or time-based motion
- [ ] Hover presets remain usable via focus/hover without travel dependency
- [ ] State presets (`vl-state`) open/close without motion-only cues
- [ ] Exit presets do not remove content required for navigation

Record failures in Motion Lab or open an issue — do not ship stable status without validation or documented limitation.

---

## Scene engine

- [ ] Pin+scrub scenes: stage content readable when scroll-driven animation disabled
- [ ] Acts/spans: all beats visible without scrub progression
- [ ] No nested `vl-in-view` inside view-clock `[vl-stage]`

---

## Page transitions

- [ ] MPA navigation completes when View Transitions API unavailable
- [ ] Reduced motion: instant or minimal transition, content accessible immediately

---

## Showcase smoke paths

Manual pass on live pages:

1. [`core.html`](../../apps/showcase/pages/core/core.html) — policy + channels
2. [`api-motion-catalog.html`](../../apps/showcase/pages/motion/api-motion-catalog.html) — public recipes
3. [`compatibility.html`](../../apps/showcase/pages/core/compatibility.html) — matrix + reduce section
4. [`motion-lab.html`](../../apps/showcase/pages/motion/motion-lab.html) — inspector + demos

---

## Tooling

```bash
pnpm generate:catalog    # refresh registry metadata
pnpm verify:contract     # contract + build
```

Future: Playwright projects with `reducedMotion: reduce` (P0.8).
