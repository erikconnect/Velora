# Showcase Readiness Audit — 2026

**Date:** 2026-08-30  
**Scope:** P0.1 current-state audit per `docs/AGENTS-VELORA.md`  
**Verdict:** Strong motion engine and lean showcase; public product surface is **not yet defensible** without canonical catalog, browser tests, and messaging/distribution alignment.

---

## 1. Current Architecture

### Monorepo layout

| Area | Path | Role |
|------|------|------|
| Framework / motion engine | `packages/css/src/` | Canonical CSS source |
| Compiler / grammar | `packages/compiler/` | Allowlist, preset validation, migration |
| Public docs (Astro) | `apps/docs/` | Partial API reference |
| Reference UI | `apps/showcase/` | `veloracss.io` canonical implementation |
| Specs & contracts | `docs/project/` | Operational truth (`CONTRACT.md`, scene/timeline docs) |
| Examples | `examples/`, `starters/html-css-minimal/` | Host-agnostic proof |
| Experiments | `experiments/` | Manual sandboxes |
| Tests | `tests/` | **Empty — aspirational only** |
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

**Build model:** source CSS served from `src/`; `dist/` holds only a build stamp — no minified bundle or CDN artifact.

### Showcase (live registry)

8 HTML pages + home:

- `index.html` — cinematic journey
- `pages/core/core.html` — public grammar, clocks, channels, fallbacks
- `pages/core/elements.html` — component families
- `pages/scenes/scene-timeline.html` — scene clock (pin+scrub)
- `pages/core/skins.html` — editorial themes
- `pages/motion/api-motion-catalog.html` — public preset reference
- `pages/motion/motion-lab.html` — exhaustive QA (noindex)
- `pages/core/hosts.html`, `archive.html` — secondary

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

Compiler report (2026-08-30): **9 files, 852 attributes, 0 issues**.

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

The aspirational grammar (`vl-enter`, `vl-scroll`, etc.) **is implemented**. The gap is **formal per-attribute contracts** in `docs/spec/attribute-grammar.md` (file does not exist). Operational contract lives in `docs/project/CONTRACT.md`.

---

## 3. Existing Presets

### Distribution

Preset metadata is **embedded in CSS** (`03-motion.css`, `03b-motion-extended.css`, `scene-recipes.css`) and mirrored in `packages/compiler/src/grammar.mjs` (`KNOWN_PRESETS`, ~90+ tokens).

**No canonical registry** at `packages/css/catalog/` or `packages/catalog/` (aspirational in AGENTS-VELORA).

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

Preset counts cannot be quoted in marketing without a generated registry. README and external materials must not hardcode numbers like "123 presets."

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

Fallback behavior is **documented in CSS** and exercised in showcase pages — but **not covered by automated browser tests**.

---

## 7. Existing Tests

| Layer | Coverage |
|-------|----------|
| `packages/compiler/tests/` (4 files) | Attr extraction, channel conflicts, value parsing, CSS generation |
| `apps/showcase/scripts/lib/port-library-pages.test.mjs` | Library page port |
| `pnpm verify:contract` | Allowlist + vite build + compiler validate |
| `tests/` (root) | **Does not exist** |
| Playwright / Puppeteer | **None** |
| Chromium / Firefox / WebKit | **None** |
| Visual regression | **None** |
| Reduced motion automation | **None** |

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
| Attribute grammar doc | `docs/spec/attribute-grammar.md` | Missing; use `docs/project/CONTRACT.md` |
| Preset registry | `packages/catalog/` | Missing |
| README messaging | — | Still says "Zero JavaScript" (absolute) |
| `apps/docs/attributes.astro` | — | Centers deprecated `vl-effect`; omits channels v2, scene attrs |
| Design catalog live | Referenced in CONTRACT | `api-design-catalog.html` only in archive |
| Browser tests | P0.8 | Not started |
| npm / CDN | "Installation must work" | Package local; not published |
| Motion Lab public spec | Each preset: primitives, fallback, compat, status | Partially met in catalog; not machine-generated |

---

## 10. Package / Distribution Inconsistencies

| Claim | Reality |
|-------|---------|
| `pnpm add @velora/css` | Works in monorepo workspace; **not on npm registry** |
| CDN / `velora.min.css` | Not implemented |
| `homepage: https://www.veloracss.io` | Set in package.json |
| `repository: velora-css/velora` | Set; verify org/repo is active before publish |
| Build output | Source CSS only; no minified distributable |

---

## 11. Browser Compatibility Risks

Documented baseline (README): Chrome 124+, Safari 18+, Firefox 128+ — **without automated verification**.

| Risk | Severity | Mitigation needed |
|------|----------|-------------------|
| Scroll-driven animations in Firefox | Medium | Progressive enhancement documented; needs live compat page |
| `sibling-index()` partial support | Medium | nth-child fallback exists; document limit (12 children) |
| `if()` experimental | Low | Baseline does not depend on it |
| View Transitions cross-document | Medium | Browser + navigation mode dependent; scope claims carefully |
| Scroll markers | High (experimental) | Label explicitly; do not market as stable |

---

## 12. Accessibility Risks

| Area | Status |
|------|--------|
| Reduced motion in CSS | Implemented |
| Reduced motion tested | **Not automated** |
| Keyboard / focus on showcase | Present in shell; not systematically audited |
| Content visible without animation | Core design respects this |
| Motion Lab controls | Need accessible labels audit |
| Essential info via motion only | No known blockers on live pages |

---

## 13. Marketing Claim Risks

| Claim (current) | Defensible? | Action |
|-----------------|-------------|--------|
| "Zero JavaScript" (README) | **No** (showcase UI uses JS) | Change to "Zero animation runtime JavaScript" |
| "123 presets" / fixed counts | **No** (no registry) | Generate from catalog |
| "120fps" / performance | **No** | Benchmarks page (P1.2) |
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

Current lean 8-page showcase is a good foundation. Missing public sections from AGENTS-VELORA:

- Dedicated **Compatibility** page (primitive matrix)
- **Benchmarks / evidence** (stub acceptable)
- **Integration examples** index (only `examples/tailwind-host/` exists)
- Motion Lab: promote catalog metadata (status, primitives) from registry

### Completed since audit (2026-08-30)

- Compatibility, Benchmarks, Playground (secondary showcase pages)
- Playwright E2E (60+ tests, Chromium/Firefox/WebKit)
- WordPress examples, `@velora/css` dist build, Motion Lab inspector fix
- Public playground at `/pages/motion/playground.html`

### Still open

- npm registry listing (run `pnpm publish` with `@velora` scope credentials)
- Frame-time benchmark fixtures + Playwright trace assertions (FPS claims remain unpublished)

---

## 15. Recommended Implementation Order

Aligned with `docs/AGENTS-VELORA.md` priority stack:

| Step | ID | Task | Effort | Depends on |
|------|----|------|--------|------------|
| ✅ | P0.1 | This audit | Done | — |
| ✅ | P0.2 | `docs/spec/attribute-grammar.md` from CONTRACT | Done | P0.1 |
| ✅ | P0.3 | `packages/catalog/` preset registry + generator script | Done | P0.2 |
| ✅ | — | README + messaging alignment | Done | P0.1 |
| 1 | — | `apps/docs` sync to channels v2 | M | P0.2 |
| 2 | P0.4 | Showcase: Compatibility page + registry-driven catalog | L | P0.3 |
| 6 | P0.5 | Motion Lab: full preset inspector from registry | L | P0.3 |
| 7 | P0.6 | Compatibility matrix (primitive × browser × status) | M | P0.4 |
| 8 | P0.7 | Reduced motion validation checklist + manual test script | S | P0.5 |
| 9 | P0.8 | Playwright smoke: Chromium/Firefox/WebKit + reduced motion | L | P0.6 |
| 10 | P1.4 | npm publish + CDN stub | M | P0.8 — dist/prepack ready; publish pending |
| ✅ | P1.1 | Playground | Done | P0.3, P0.8 |
| ✅ | P1.2 | Benchmarks | Done | stub live |
| ✅ | P1.3 | WordPress / Gutenberg / Elementor examples | Done | P1.4 |

**S** = small (hours), **M** = medium (1–2 days), **L** = large (multi-day)

---

## Summary

Velora has a **technically mature CSS-only motion engine** (channels v2, scene engine, progressive enhancement, reduced motion) and a **lean showcase** with contract validation, generated catalog (134 presets), compatibility matrix, Motion Lab inspector, Playwright E2E (72 tests), and honest footer messaging.

**Closed since audit (2026-08):** P0.2 attribute grammar, P0.3 catalog package, P0.4 compatibility page, P0.5 preset inspector, P0.7 reduced-motion checklist, P0.8 E2E suite, P1.1 playground, P1.2 benchmarks, P1.3 WordPress examples, P1.4 CSS dist/publish prep.

**Remaining before public launch:** npm publish (`@velora/css`), docs site parity on all pages, CI green on E2E job, optional archive of retired showcase pages.

**Next action:** Publish `@velora/css` when npm credentials are ready; keep docs aligned with `docs/spec/attribute-grammar.md`.
