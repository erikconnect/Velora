# Catalog + Core Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Make the Motion Catalog truthful and usable against the host-agnostic scene engine + Skins split, then expand core only where gaps are proven.

**Architecture:** Catalog remains the live contract UI in `apps/showcase/pages/motion/api-motion-catalog.html`. Framework behavior stays in `packages/css/src` (`03-motion.css`, `03c-scene-engine.css`, `scene-recipes.css`). Audit → UX → Expand; Home content rewrite stays deferred.

**Tech Stack:** HTML + Velora CSS attributes, pnpm/`verify:contract`, Vite Showcase.

**Spec:** `docs/superpowers/specs/2026-08-24-catalog-core-hardening-design.md`

## Global Constraints

- Zero JS for motion runtime (Catalog toolbar JS is DX-only, must be labeled).
- Edit framework CSS only in `packages/css/src`; sync with `pnpm sync:showcase-css`.
- Do not delete `archive/showcase-2026-08/`.
- Lean Showcase: six live routes only.
- No npm publish in this plan.

---

### Task 1: Write audit findings

**Files:**
- Create: `docs/superpowers/specs/2026-08-24-catalog-audit-findings.md`
- Read: `apps/showcase/pages/motion/api-motion-catalog.html`, `packages/css/src/03c-scene-engine.css`, `docs/project/CONTRACT.md`

- [ ] **Step 1: Inventory Catalog sections and attrs**

Run from repo root:

```bash
rg -n 'id="[^"]+"' apps/showcase/pages/motion/api-motion-catalog.html | head -80
rg -o 'vl-[a-z-]+(="[^"]*")?' apps/showcase/pages/motion/api-motion-catalog.html | sort | uniq -c | sort -rn | head -80
```

- [ ] **Step 2: Cross-check P0 mismatches**

Verify in CSS:

- Numeric `[vl-scene][vl-pin="1"…"6"]` in `03c-scene-engine.css`
- Absence of `[vl-pin="top"]` / `"center"` selectors in `packages/css/src`
- Presence of `[vl-stage]`, `[vl-act]`, `[vl-span]` rules
- Named `vl-scene="…"` only in `scene-recipes.css` / theme path

- [ ] **Step 3: Write findings table**

Create the findings doc with columns: Section | Markup | CSS | Verdict (ok / broken / obsolete / missing-demo) | Fix priority (P0/P1/P2).

Known P0 seeds to confirm and record:

1. `#pin` teaches `vl-pin="top"|"center"` — **obsolete** vs numeric scene pin.
2. Scene engine chips without full track/stage/acts demo — **missing-demo**.
3. Recipes / `cube-triad` unlabeled as Skin/experimental — **UX/P1**.

- [ ] **Step 4: Stop and report**

Do not expand presets until Task 1 file exists.

---

### Task 2: Fix P0 Catalog teaching (pin + scene engine demo)

**Files:**
- Modify: `apps/showcase/pages/motion/api-motion-catalog.html`
- Possibly modify: section copy near `#pin` / add `#scene-engine`

- [ ] **Step 1: Replace pin demos**

Change Catalog pin examples from:

```html
<aside vl-pin="top">…</aside>
```

to scene-engine authorship:

```html
<section vl-scene vl-timeline="view" vl-pin="3" vl-scrub>
  <div vl-stage>
    <p vl-enter="fade-up" vl-act="1">Pinned stage</p>
    <p vl-enter="fade-up" vl-act="2">Later act</p>
  </div>
</section>
```

Update prose: pin is numeric viewport heights on the **track** (`vl-scene`), sticky subject is `vl-stage`.

- [ ] **Step 2: Add Scene engine section**

Add `#scene-engine` (or rename `#pin` content) with chips + working mini demo matching Timeline page contract. Link to `/pages/scenes/scene-timeline.html`.

- [ ] **Step 3: Label Skin recipes**

Where `vl-scene="cinematic-hero"` (or sibling named recipes) appear, add note: “Skin recipe — requires theme / full bundle; not required for motion-core.”

- [ ] **Step 4: Verify**

```bash
pnpm --filter showcase check:vl-contract
# or
pnpm verify:contract
```

Expected: contract pass including Catalog.

---

### Task 3: Catalog UX pass

**Files:**
- Modify: `apps/showcase/pages/motion/api-motion-catalog.html`
- Modify: Catalog CSS under `apps/showcase/public/css/` only if needed for lane chips (showcase-only)

- [ ] **Step 1: Intro block**

Above channels: two-lane explanation — **Engine** (`@velora/css/motion-core`) vs **Skins** (`theme` + recipes).

- [ ] **Step 2: Stabilize TOC / bussola**

Ensure hrefs match section ids. Prefer: `#channels`, `#timeline-modes`, `#entrances`, `#scene-engine`, `#scroll`, `#hover`, `#stage-3d`, `#transitions`, `#params`.

- [ ] **Step 3: Frame runtime toolbar**

Next to play/pause/sliders: “Optional DX controls — shipped motion is CSS-only.”

- [ ] **Step 4: Channel-first examples**

For a sample of `vl-effect="fade-up"` cards that already have `vl-enter` equivalents, prefer showing `vl-enter` as primary in the card title; keep `vl-effect` as alias note if still supported.

- [ ] **Step 5: Verify**

```bash
pnpm verify:contract
```

---

### Task 4: Gap inventory (expand backlog)

**Files:**
- Create: `docs/superpowers/specs/2026-08-24-motion-core-gap-inventory.md`

- [ ] **Step 1: Diff Catalog presets vs CSS**

Script or manual list:

- Presets used in Catalog but missing CSS selectors → P0 fix or remove demo
- CSS presets in `03-motion.css` / extended with no Catalog card → candidates
- Engine features (act overlap, span, scrub, `vl-motion` modes) under-documented → candidates

- [ ] **Step 2: Prioritize**

Order: scene-engine completeness → enter/scroll/hover gaps → ambient/experimental last. Skins recipes are optional expansions.

- [ ] **Step 3: Do not implement bulk presets yet**

Stop for review unless a gap is a broken demo (fix in Task 2).

---

### Task 5: Selective core expansion (only approved gaps)

**Files:**
- Modify: `packages/css/src/03-motion.css` and/or `03b-motion-extended.css` / `03c-scene-engine.css` as needed
- Modify: Catalog cards for each addition
- Modify: `docs/project/CONTRACT.md` if adding stable values
- Run: `pnpm sync:showcase-css`

- [ ] **Step 1: Implement one gap at a time**

For each approved gap: CSS → sync → Catalog card → contract check.

- [ ] **Step 2: Full verify**

```bash
pnpm sync:showcase-css
pnpm verify:contract
```

---

### Task 6: Changelog + resume Home

**Files:**
- Modify: `CHANGELOG.md` Unreleased
- Note: Home acts remain deferred until Phase B complete

- [ ] **Step 1: Changelog bullet** for Catalog pin/scene-engine teaching + UX lanes
- [ ] **Step 2: Update Home design status** already deferred; when ready, open Home plan as separate execution

---

## Self-review

- Spec phases A/B/C each have tasks.
- P0 pin mismatch is explicit.
- Expand gated on audit file.
- No placeholders for file paths.


## Execution status

- [x] Task 1 audit findings
- [x] Task 2 P0 pin → scene-engine
- [x] Task 3 Catalog UX lanes/disclaimer/TOC
- [x] Task 4 gap inventory draft
- [x] Task 5 selective core expansion (P1 channel + scene-engine)
- [ ] Task 6 resume Home acts
