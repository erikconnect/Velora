# Showcase Readiness Audit — 2026

**Date:** 2026-08-30 (refreshed 2026-08-31)  
**Scope:** P0.1 current-state audit per `docs/AGENTS-VELORA.md`  
**Verdict:** Motion engine, contract chain, and lean showcase are **public-readiness strong**. Showcase copy now follows **show-don't-tell** across all 12 live pages (see [SHOWCASE_COPY_GUIDE.md](../project/SHOWCASE_COPY_GUIDE.md)). Remaining launch gaps: **npm publish**, **docs deploy CI**, and **full docs parity** on narrative pages (effects/compatibility already consume generated catalog).

---

## 1. Current Architecture

### Monorepo layout

| Area | Path | Role |
|------|------|------|
| Framework / motion engine | `packages/css/src/` | Canonical CSS source |
| Compiler / grammar | `packages/compiler/` | Allowlist, preset validation, migration |
| Public docs (Astro) | `apps/docs/` | Guides at `docs.veloracss.io` |
| Reference UI | `apps/showcase/` | `veloracss.io` canonical implementation |
| Specs & contracts | `docs/project/` | Operational truth (`CONTRACT.md`, scene/timeline docs) |
| Examples | `examples/`, `starters/html-css-minimal/` | Host-agnostic proof |
| Experiments | `experiments/` | Manual sandboxes |
| Tests | `tests/e2e/` | Playwright smoke, reduced-motion, catalog JSON |
| Archive | `archive/showcase-2026-08/` | ~60 retired showcase pages |

### CSS layer stack

```
velora.reset → velora.tokens → velora.layout → velora.motion →
velora.components → velora.transitions → velora.utilities → velora.overrides
```

### Package entrypoints (`@velora/css`)

| Export | Content |
|--------|---------|
| `@velora/css` / `/full` | Theme + components + motion + transitions |
| `@velora/css/motion-core` | Host-agnostic engine (tokens, motion, scene, state) |
| `@velora/css/motion-extended` | Extended presets |
| `@velora/css/theme` | Visual tokens + editorial skins + scene recipes |
| `@velora/css/base` | Reset + tokens + layout + utilities |
| `@velora/css/transitions` | MPA View Transitions |
| `@velora/css/components-core`, `/premium`, `/overrides` | DS / premium / overrides |

**Build model:** `pnpm build` in `@velora/css` produces minified bundles + `manifest.json` in `packages/css/dist/` (`publishStatus: ready-not-published`). Source CSS remains canonical in `src/`.

### Showcase (live registry)

12 HTML pages (6 primary + 6 secondary) + home:

**Primary:** `index.html`, `core.html`, `elements.html`, `scene-timeline.html`, `skins.html`, `api-motion-catalog.html`

**Secondary:** `compatibility.html`, `benchmarks.html`, `hosts.html`, `archive.html`, `motion-lab.html` (noindex), `playground.html`

Derived CSS in `apps/showcase/public/css/` syncs from `packages/css/src/` via `pnpm sync:showcase-css`. Showcase-only CSS/JS lives alongside and must not redefine framework behavior.

### Tooling chain

```
pnpm verify:contract
  → sync:showcase-css
  → check:showcase-css (drift)
  → showcase report:vl-contract
  → showcase verify:contract (vite build)
  → check:motion (compiler validate)
```

Compiler report (2026-08-31): **12 files, 1021 attributes, 0 issues** (`pnpm verify:contract`).

### Showcase copy & teaching layer (2026-08-31)

Operational guide: [SHOWCASE_COPY_GUIDE.md](../project/SHOWCASE_COPY_GUIDE.md) (linked from [SHOWCASE_PAGE_PLAYBOOK.md](../project/SHOWCASE_PAGE_PLAYBOOK.md)).

| Pattern | Purpose |
|---------|---------|
| `showcase-practical-hint` | Imperative cues: scroll, hover, tab, copy snippet |
| `scene-tl-code` / host panel `<pre>` | Copyable markup beside live demos |
| Frame · Cue · Cut | Home reel; per-page job matrix in copy guide |
| Generated metrics only | Home/catalog/benchmarks cite `catalog-summary.json` / `benchmarks.json` |

**Primary (6 + home):** hero + metrics attribute micro-copy; pin+scrub teaching clock (no Release 07 outside Skins); grammar grid interact-first; scene cards name real attrs; Catalog intent map + live targets.

**Secondary (6):** Hosts pin opera + host snippets; Playground composer hints; Compatibility matrix + `vl-motion="still"` snippet; Benchmarks JSON-backed claims + motion-core import; Archive restore recipe + live-registry pointer.

**Footers:** all 12 pages link `https://docs.veloracss.io`.

---

## 2. Existing Public Attributes

### Implemented in CSS (31 attributes with selectors)

**Channels:** `vl-enter`, `vl-exit`, `vl-scroll`, `vl-hover`, `vl-loop`, `vl-loop-effect`, `vl-state`, `vl-effect`  
**Timing / control:** `vl-timeline`, `vl-range`, `vl-duration`, `vl-delay`, `vl-speed`, `vl-direction`, `vl-base`, `vl-motion`, `vl-once`  
**Children / stagger:** `vl-children`, `vl-stagger`  
**Scene engine:** `vl-scene`, `vl-stage`, `vl-act`, `vl-span`, `vl-pin`, `vl-scrub`, `vl-in-view`  
**Scroll control:** `vl-scene-trigger`, `vl-scene-trigger-zone`, `vl-scroll-markers` (experimental)  
**Transitions:** `vl-page-transition`

### In contract but not as `[vl-*]` selectors

| Name | Reality |
|------|---------|
| `vl-vt-shared-nav`, `vl-vt-shared-brand` | Classes in `05-transitions.css` |
| `vl-logo-lockup` | Showcase shell class |
| `vl-card` | DS component, not motion attr |
| `vl-actuator`, `vl-scale-shift`, `vl-counter-fwd` | Allowlisted; no core CSS |
| `vl-targets` | Documented in header; **no CSS rules** |

### Deprecated (forbidden in pages)

`vl-type` → `vl-timeline`; `vl-easing` → tokens; `vl-transition` → `vl-page-transition`

### Gap vs `AGENTS-VELORA.md`

Formal per-attribute contracts live in `docs/spec/attribute-grammar.md`. Operational contract: `docs/project/CONTRACT.md`. Remaining grammar gap: `grammarKnownCount` (123) vs `presetCount` (134) — document or close.

---

## 3. Existing Presets

### Distribution

Preset metadata is **generated** in `packages/catalog/` (`presets.json`, `catalog-summary.json`, `attributes.json`, `compatibility-matrix.json`) via `pnpm generate:catalog`, mirrored to `apps/showcase/public/data/`.

**134 public presets** (133 stable, 1 experimental) as of 2026-08-31. Marketing counts must come from `catalog-summary.json`, not hardcoded copy.

### Channel tokens (reusable via `~=`)

| Channel | Count (approx.) | Examples |
|---------|-----------------|----------|
| Enter | 22 | `fade-up`, `clip-rise`, `reveal-cinematic`, `mask-sweep` |
| Exit | 4 | `fade-out`, `fade-out-up`, `shrink-out` |
| Scroll | 13 | `parallax`, `media-zoom`, `path`, `scroll-marquee` |
| Hover | 6 | `hover-lift`, `gradient-sweep`, `border-trace` |
| Loop | 10 | `float`, `orbit`, `aurora-drift`, `shimmer` |
| State | 4 modes | `smooth`, `enter-exit`, `expand`, `top-layer` |
| Children | 12 modes | `stagger`, `cascade`, `orchestrate`, `grid-wave` |
| Page transition | 6 | `wipe`, `glide`, `iris`, `cinema`, `snap` + default |

### `vl-effect` composite presets

~108 named presets across core + extended (e.g. `scene-hero-reveal`, `border-beam`, `circle-text-scroll`, `text-ring-orbit`).

### Risk

Preset counts are **defensible when generated**. Run `pnpm generate:catalog` after CSS/grammar changes; `pnpm check:catalog` gates CI.

---

## 4. Existing CSS Primitives

| Primitive | Usage | Support tier |
|-----------|-------|--------------|
| `@layer velora.*` | All bundles | Stable |
| `animation-timeline: view()` / `scroll()` | Motion + scene engine | Stable (with fallback) |
| `view-timeline-name`, `timeline-scope` | Scene clock `--vl-scene` | Stable |
| `animation-range` | Acts, scroll, `vl-in-view`, `vl-range` | Stable |
| `@starting-style`, `allow-discrete` | `vl-state` transitions | Stable |
| `@property --vl-in-view-state` + `@container style()` | `vl-in-view` gate | Stable |
| `position: sticky` | `[vl-stage]`, legacy pin | Stable |
| `:has()` | Hover demos, scene trigger zone | Progressive |
| `sibling-index()` / `sibling-count()` | Acts, unlimited stagger | Progressive |
| Typed `attr(vl-* type(...))` | duration, delay, pin, act | Progressive |
| `if()` + `media()` / `style()` / `supports()` | Motion conditions, clock switch | Experimental |
| `calc-size()` | `vl-state="expand"` | Progressive |
| `offset-path` / `--vl-path` | `vl-scroll="path"` | Progressive |
| `::scroll-marker` | `vl-scroll-markers` | Experimental |
| `@view-transition { navigation: auto }` | MPA transitions | Stable (browser-dependent) |

---

## 5. Existing Experimental Features

| Feature | Location | Labeling |
|---------|----------|----------|
| `if()` motion conditions | `03a-motion-conditions.css` | Used; not always labeled "experimental" on showcase |
| Scroll markers | `03b-motion-extended.css` | In allowlist; limited docs |
| Scene recipes (`vl-scene="cinematic-hero"`, etc.) | `scene-recipes.css` | Theme layer, not core |
| Cube-triad demo | `scene-recipes.css` | Recipe, not reusable stage contract |
| Element-scoped VT | docs only | Not core zero-runtime |

**Principle check:** Baseline remains usable — progressive enhancement via `@supports` is systematic. No hidden `opacity: 0` without restore path observed in core motion files.

---

## 6. Existing Fallbacks

### `@supports` fallbacks

- `animation-timeline: view()` → `auto` + static visibility
- `sibling-index()` → fixed `nth-child` lists (up to 12 children)
- Typed `attr()` → enum fallbacks for duration/delay/pin/act
- `:has()` scene trigger → `:hover` / `:focus-within` baseline
- `if()` → bypassed when unsupported

### `prefers-reduced-motion: reduce`

Honored in: `00-reset.css`, `03-motion.css`, `03a`, `03b`, `03c-scene-engine.css`, `03d-state-transitions.css`, `05-transitions.css`, `scene-recipes.css`.

`vl-motion="still"` forces rest regardless of OS preference.

### Validation

Fallback behavior is **documented in CSS**, exercised in showcase, and covered by **Playwright E2E** (reduced-motion spec + smoke).

---

## 7. Existing Tests

| Layer | Coverage |
|-------|----------|
| `packages/compiler/tests/` (4 files) | Attr extraction, channel conflicts, value parsing, CSS generation |
| `apps/showcase/scripts/lib/port-library-pages.test.mjs` | Library page port |
| `pnpm verify:contract` | Allowlist + vite build + compiler validate |
| `tests/e2e/` (3 specs) | Playwright: page smoke, reduced motion, catalog JSON |
| CI (`.github/workflows/ci.yml`) | `pnpm test`, `verify:contract`, `build`, job `e2e` (Chromium/Firefox/WebKit) |
| Visual regression | **None** |

---

## 8. Existing Showcase-Only Behavior

| Item | Portability |
|------|-------------|
| `showcase-state.js`, `showcase-ui.js` | Theme/VT persistence — UI only |
| `showcase-api-motion-catalog.js` | DX controls (pause, duration vars) — motion works without it |
| Showcase-only CSS (bussola, home scenes, hub) | Visual chrome — not motion contract |
| Vite alias `@velora/css` → local source | Dev convenience; external projects need real install path |
| Motion Lab inline transition replay script | Demo replay only |
| Scene Creator + GSAP pages (archive) | Not public API |
| Google fonts, cinema assets | Media dependencies |

**No showcase-only JS fakes core motion capabilities** on live pages. JS is confined to shell UI and catalog DX — aligned with AGENTS-VELORA "zero animation runtime" framing.

---

## 9. Documentation Inconsistencies

| Topic | Aspirational (`AGENTS-VELORA.md`) | Current state |
|-------|-----------------------------------|---------------|
| Attribute grammar doc | `docs/spec/attribute-grammar.md` | ✅ Exists |
| Preset registry | `packages/catalog/` | ✅ Generated (134 presets) |
| README messaging | — | ✅ "Zero animation runtime JavaScript" aligned |
| `apps/docs/effects.astro` | — | ✅ Consumes `@velora/catalog` (enter/hover/scroll/loop tables) |
| `apps/docs/compatibility.astro` | — | ✅ Consumes `compatibility-matrix.json` |
| Other docs pages | Full parity | ⚠️ Narrative pages still manual; showcase is interactive reference with copy guide |
| Showcase copy / teaching | Show-don't-tell on live pages | ✅ All 12 pages: hints + snippets; `SHOWCASE_COPY_GUIDE.md` |
| Deploy topology | — | ✅ Documented in `docs/project/DEPLOY.md` (`veloracss.io`, `docs.veloracss.io`, `examples.veloracss.io`) |
| Design catalog live | Referenced in CONTRACT | `api-design-catalog.html` only in archive |
| Browser tests | P0.8 | ✅ Playwright E2E in CI |
| npm / CDN | "Installation must work" | Dist ready; **not published** to npm registry |
| Docs deploy CI | — | ⚠️ Vercel project (`apps/docs/vercel.json`); no GitHub Pages workflow |
| Motion Lab public spec | Machine-generated metadata | ✅ Registry-driven catalog + inspector |

---

## 10. Package / Distribution Inconsistencies

| Claim | Reality |
|-------|---------|
| `pnpm add @velora/css` | Works in monorepo; dist + prepack ready; **awaiting npm publish** |
| CDN / unpkg / jsDelivr | URLs in `manifest.json`; valid post-publish |
| `homepage: https://www.veloracss.io` | Set in package.json — canonical URLs use `veloracss.io` (see `apps/docs/src/lib/site.ts`) |
| `repository` | `https://github.com/erikconnect/Velora` |
| Build output | Minified bundles in `packages/css/dist/` |

---

## 11. Browser Compatibility Risks

Documented baseline (README): Chrome 124+, Safari 18+, Firefox 128+ — **smoke-tested in CI** via Playwright; primitive matrix on showcase + docs.

| Risk | Severity | Mitigation needed |
|------|----------|-------------------|
| Scroll-driven animations in Firefox | Medium | Progressive enhancement documented; live compat page + generated matrix |
| `sibling-index()` partial support | Medium | nth-child fallback exists; document limit (12 children) |
| `if()` experimental | Low | Baseline does not depend on it |
| View Transitions cross-document | Medium | Browser + navigation mode dependent; scope claims carefully |
| Scroll markers | High (experimental) | Label explicitly; do not market as stable |

---

## 12. Accessibility Risks

| Area | Status |
|------|--------|
| Reduced motion in CSS | Implemented |
| Reduced motion tested | ✅ Playwright `showcase.reduced-motion.spec.mjs` |
| Keyboard / focus on showcase | Present in shell; not systematically audited |
| Content visible without animation | Core design respects this |
| Motion Lab controls | Need accessible labels audit |
| Essential info via motion only | No known blockers on live pages |

---

## 13. Marketing Claim Risks

| Claim (current) | Defensible? | Action |
|-----------------|-------------|--------|
| "Zero JavaScript" (README) | **No** (showcase UI uses JS) | Change to "Zero animation runtime JavaScript" |
| "123 presets" / fixed counts | **Yes** (from `catalog-summary.json`) | Use generated count (134) |
| "120fps" / performance | **No** | Benchmarks page states reproducible evidence only; no FPS marketing |
| "Works everywhere" | **No** | Per-primitive compat matrix |
| "Production ready" | **Partial** | Engine yes; distribution/tests no |
| "0 KB animation runtime JS" | **Yes** (verified for motion core) | Keep with narrow scope |
| Motion Channels v2 | **Yes** | Already in CSS + showcase |
| Scene engine pin+scrub | **Yes** | Proven in `scene-timeline.html`, `core.html` |

---

## 14. Recommended P0 Changes

### Immediate (before large feature work)

1. **Accept this audit** as baseline; link from `docs/AGENTS-VELORA.md`.
2. **Fix README messaging** — "Zero animation runtime JavaScript"; align Quick Start with channels v2.
3. **Create `docs/spec/attribute-grammar.md`** — extract from CONTRACT + CSS; one section per attribute with status/fallback/reduced-motion/browser reqs (P0.2).
4. **Create canonical preset registry** — JSON in `packages/catalog/` generated from `grammar.mjs` + CSS scan (P0.3).
5. **Sync `apps/docs`** — update `attributes.astro` to channels v2 + scene engine; deprecate `vl-effect`-first narrative.
6. **Mark npm/CDN as unpublished** in docs until P1.4 ships.

### Showcase architecture (P0.4)

Lean **12-page** showcase (6 primary + 6 secondary + home) is the public reference. Sections below were gaps in the original audit — now addressed on live pages:

- ✅ **Compatibility** — primitive matrix (JSON-driven)
- ✅ **Benchmarks / evidence** — `benchmarks.json`, honest methodology
- ✅ **Hosts** — mini-opera + integration paths (`examples/`)
- ✅ **Playground** — registry composer + copy markup
- ✅ **Archive** — frozen snapshot index + restore recipe
- Motion Lab: catalog metadata + inspector (noindex secondary)

### Completed since audit (2026-08 → 2026-08-31)

- Compatibility, Benchmarks, Playground, Hosts mini-opera (secondary showcase)
- Playwright E2E in CI (Chromium/Firefox/WebKit)
- WordPress examples, `@velora/css` dist build, Motion Lab inspector
- Showcase shell polish: editorial theme, scroll progress, honest home metrics (134 presets)
- Narrative de-duplication on Core/Scenes/Elements; Catalog transition demos live
- `apps/docs` consumes `@velora/catalog` on Effects + Compatibility pages
- `compatibility-matrix.json` exported from `packages/catalog/`
- **Showcase copy pass (full):** `SHOWCASE_COPY_GUIDE.md`; `showcase-practical-hint` + inline snippets on all 12 live pages; Home Act 03–04 attribute micro-copy; Elements overlays complete; deploy guide + Vercel configs + canonical URLs

### Still open

- npm registry listing (`pnpm publish` with `@velora` credentials; workflow ready)
- Docs deploy on Vercel (`docs.veloracss.io`) — see `docs/project/DEPLOY.md`; DNS connect manual
- Frame-time benchmark fixtures (FPS claims remain unpublished — by design on Benchmarks page)
- Full docs parity on remaining narrative pages (attributes, scenes, transitions)
- Formal decision on archived design catalog (`api-design-catalog.html`)
- Optional: Motion Lab accessible-labels audit; visual regression suite

---

## 15. Recommended Implementation Order

Aligned with `docs/AGENTS-VELORA.md` priority stack:

| Step | ID | Task | Effort | Depends on |
|------|----|------|--------|------------|
| ✅ | P0.1 | This audit | Done | — |
| ✅ | P0.2 | `docs/spec/attribute-grammar.md` from CONTRACT | Done | P0.1 |
| ✅ | P0.3 | `packages/catalog/` preset registry + generator script | Done | P0.2 |
| ✅ | — | README + messaging alignment | Done | P0.1 |
| 1 | — | `apps/docs` sync to channels v2 | M | P0.2 — **partial** (effects + compatibility use catalog) |
| 2 | P0.4 | Showcase: Compatibility page + registry-driven catalog | L | P0.3 — ✅ |
| 6 | P0.5 | Motion Lab: full preset inspector from registry | L | P0.3 |
| 7 | P0.6 | Compatibility matrix (primitive × browser × status) | M | P0.4 |
| 8 | P0.7 | Reduced motion validation checklist + manual test script | S | P0.5 |
| 9 | P0.8 | Playwright smoke: Chromium/Firefox/WebKit + reduced motion | L | P0.6 |
| 10 | P1.4 | npm publish + CDN stub | M | P0.8 — dist/prepack ready; publish pending |
| ✅ | P1.1 | Playground | Done | P0.3, P0.8 |
| ✅ | P1.2 | Benchmarks | Done | JSON-backed claims; no FPS marketing |
| ✅ | P1.3 | WordPress / Gutenberg / Elementor examples | Done | P1.4 |

**S** = small (hours), **M** = medium (1–2 days), **L** = large (multi-day)

---

## Summary

Velora has a **technically mature CSS-only motion engine** (channels v2, scene engine, progressive enhancement, reduced motion) and a **lean 12-page showcase** with contract validation, generated catalog (134 presets), compatibility matrix, Motion Lab inspector, Playwright E2E in CI, **show-don't-tell copy on every live page**, and honest footer messaging.

**Closed since audit (2026-08):** P0.2–P0.8, P1.1–P1.3, P1.4 CSS dist/publish prep, showcase shell/narrative/copy polish (`SHOWCASE_COPY_GUIDE.md`), docs catalog sync (effects + compatibility), deploy documentation.

**Remaining before public launch:** npm publish (`@velora/css`), Vercel + DNS for showcase/docs, optional full docs parity on all Astro pages, frame-time benchmarks if ever claiming FPS.

**Next action:** Connect two Vercel projects + GoDaddy DNS per [DEPLOY.md](../project/DEPLOY.md); publish `@velora/css` when npm credentials are ready.
