# Showcase Home — Catalog-mirrored acts

**Date:** 2026-08-24  
**Status:** Deferred — Catalog/core hardening first (see `2026-08-24-catalog-core-hardening-design.md`)  
**Depends on:** `2026-08-24-lean-showcase-restart-design.md` (six live routes)  
**Scope of this cycle:** `apps/showcase/index.html` (+ home CSS only if needed for lesson chrome)

---

## 1. Problem

The lean Home already has cinematic density and a first didactic pass (engine vs Skins). It still reads as a playground trailer more than a **guided tour of Catalog channels**. Visitors cannot reliably map a section to a `vl-*` channel or jump to the matching Catalog anchor.

## 2. Goals

1. Reorganize Home **by Catalog channels** without a full visual redesign.
2. Keep cinema / existing home CSS (`08-showcase-home`, elevation patterns as needed).
3. Every act teaches one channel (or one clear composition) with: kicker, one lesson sentence, live demo, Catalog (or Timeline/Skins) bridge.
4. Call out **Skin look** (`.vl-card`, elevation) vs **engine** (`vl-*`) wherever chrome appears.
5. Fix dead links to the six live routes only.

## 3. Non-goals

- New motion presets / new CSS keyframes in `packages/css`.
- Rewriting Skins, Timeline, Catalog, Hosts, or Archive in this cycle (listed as follow-ups only).
- Expanding the live route count beyond six.
- JS animation runtimes.

## 4. Approach (locked)

**Mirror Catalog channels** onto existing Home sections. Prefer remapping copy + anchors + small markup cleanups over rebuilding layouts.

### 4.1 Act map

| Home section | Catalog / product bridge | Channel focus |
| --- | --- | --- |
| `#idx-hero` | Timeline + Skins CTAs | Thesis: engine attributes vs Skins models |
| `#idx-clock` | `/pages/scenes/scene-timeline.html` | `vl-scene` + `vl-stage` + `vl-act` (+ pin/scrub) |
| `#idx-display` | Catalog `#entrances` | `vl-enter` / type reveal (`clip-rise`, etc.) |
| `#idx-horiz` | Catalog `#scroll` + `#timeline-modes` | Scroll scrub / horizontal pin as scroll-driven clock |
| `#idx-scenes` | Skins + Archive | Recipes/cards = Skin look; authorship = track/stage |
| `#idx-spatial` | Catalog `#stage-3d` | Depth, pin, 3D stage cues |
| `#idx-map` | Six live routes only | Index — no archived destinations as primary links |

Bussola labels should match these lessons (short channel names), not generic “Act II”.

### 4.2 Per-act contract (required)

Each act must include:

1. **Kicker** — channel or preset id (e.g. `vl-enter · clip-rise`).
2. **One lesson sentence** — what the browser is doing.
3. **Demo** — keep existing cinematic blocks where possible.
4. **Bridge** — link to Catalog hash and/or Timeline / Skins.
5. **Skin callout** when `.vl-card` / elevation is present: “look of a Skin, not a motion requirement”.

Optional: a one-line mini markup sample (prefer `<pre>` or short code in lead), not a second full demo.

### 4.3 Catalog anchors (stable targets)

Home bridges must use existing Catalog ids:

- `#channels`
- `#timeline-modes`
- `#entrances`
- `#stage-3d`
- `#hover` (if a hover beat is emphasized in hero stage)
- `#scroll`
- `#transitions` (optional; page transitions remain header chrome)

If a needed id is missing or unstable, fix Catalog anchors in a **tiny** follow-up patch in the same PR only when required for Home links — do not redesign Catalog.

### 4.4 Constraints

- Zero JS for motion.
- Attribute grammar stays contract-valid (`pnpm verify:contract`).
- Do not invent presets; pick from Catalog demos already shipping.
- Nav/footer remain the six lean links.
- Prefer editing `index.html`; touch `apps/showcase/public/css/08-showcase-home.css` (or showcase-only lesson chip styles) only if lesson chrome needs it. Framework CSS stays in `packages/css/src`.

## 5. Follow-up program (not this cycle)

Ordered after Home ships:

1. **Skins** — named models, live switcher proof, replicable kit, retoken story.
2. **Timeline** — canonical pin/scrub aligned with `#idx-clock`.
3. **Catalog** — messaging “engine vs Skin recipe”; ensure anchors Home uses stay stable.
4. **Hosts** / **Archive** — polish and consistency with Home bridges.

## 6. Success criteria

- A visitor can name the Catalog channel for each Home section without DevTools.
- Every Home `/pages/` link targets one of the six live routes (or a Catalog hash on the live Catalog page).
- At least one teaching block remains `vl-scene` + `vl-stage` + `vl-act`.
- `pnpm verify:contract` green; Showcase build still emits six HTML documents.
- No new motion presets in `packages/css`.

## 7. Risks

| Risk | Mitigation |
| --- | --- |
| Over-labeling kills cinema | Kickers small; keep existing visual stages |
| Catalog hash drift | Use listed ids; patch Catalog only if link broken |
| Scope creep into Skins rewrite | Hard non-goal; Skin callouts on Home only |

---

## Open decisions (resolved)

| Question | Decision |
| --- | --- |
| Start page | Home first |
| Depth | Reformulate by acts, keep cinema CSS |
| Mapping logic | Mirror Catalog channels |
