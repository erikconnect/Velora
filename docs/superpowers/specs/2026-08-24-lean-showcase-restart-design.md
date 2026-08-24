# Lean Showcase Restart — Design Spec

**Date:** 2026-08-24  
**Status:** Draft for review  
**Depends on:** `2026-08-24-host-agnostic-scene-engine-design.md` (shipped)

---

## 1. Problem

The Showcase grew to ~50 HTML pages (scenes, motion demos, color, type, tools, library). That volume hides two products that must stay distinct:

1. **Motion engine** — host-agnostic `vl-*` (easy to author).
2. **Skins** — the Velora design system: named, replicable visual models (`data-editorial-theme`) that retoken the whole UI.

The current home already shows many capabilities; it is not didactic enough (visitor cannot tell *what* they are seeing or *how* to copy it). Restarting the public site must not delete existing DS work (themes, components, catalogs, elevation).

## 2. Goals

1. **Public Showcase is as small as possible** while still proving “wow + easy.”
2. **Home is didactic:** keep a dense demo of what Velora can do, but every beat has a label, a one-line “what this is”, and a pointer (markup or next page). Spectacle without a lesson is a fail.
3. **Skins is the name of the DS surface:** named models (Noir, Earth, Aethel, Meridian today) that authors can replicate; switching a skin restyles the project via tokens (`html[data-editorial-theme]`), not per-page restyling.
4. **No loss of important files:** current Showcase pages remain in a dated archive.
5. **Contract and CI only apply to the live surface**, not the frozen archive.

## 3. Non-goals

- Rewriting all archived pages to track/stage in this cycle.
- Publishing npm / version bump.
- Compiler sugar (`vl-at="<0.15"`, `@function --vl-act-range`).
- Deleting `packages/velora-components` or `packages/pages`.
- Turning Docs Astro into the Showcase (Docs stays teaching; Showcase stays cinematic reference UI).

## 4. Approach (locked)

**Archive in-repo + tiny live app** (not “hide 50 pages in nav”, not git-only recovery).

| Layer | Location | Role |
| --- | --- | --- |
| Live Showcase | `apps/showcase/` | Public product demo (~6 routes) |
| Frozen snapshot | `archive/showcase-2026-08/` | Full copy of current pages + README map |
| Git | annotated tag `archive/showcase-pre-lean-2026-08` | Second recovery path |
| Host proof | `examples/tailwind-host/` | Unchanged; linked from live Hosts page |

`archive/` is **not** a Vite input, **not** scanned by `validate-showcase-contract.mjs` or `check:motion` against the live root.

## 5. Live surface (exactly 6 public HTML routes)

| Route | Job |
| --- | --- |
| Route | Job |
| --- | --- |
| `index.html` | Didactic gallery of capabilities (keep wow density) + clear engine vs Skins split + links |
| `pages/scenes/scene-timeline.html` | Canonical track / stage / acts authorship |
| `pages/core/skins.html` (new) | **Skins** product page: named models, live switcher, “change one attribute → whole project” |
| `pages/motion/api-motion-catalog.html` | Living motion API (how to use `vl-*`) |
| `pages/core/hosts.html` (new) | Engine without Skins; points at `examples/tailwind-host/` |
| `pages/core/archive.html` (new) | Index of `archive/showcase-2026-08/` (paths + one-line purpose). Does **not** re-serve the 50 pages in Vite |

Nav labels: Home · Timeline · **Skins** · Catalog · Hosts · Archive.

### 5.1 Skins page (design system)

**Skins** is the product name for the Velora visual system (`@velora/css/theme` + components). It is **not** the motion grammar.

- **Named models:** each skin is a replicable preset (today: Noir, Earth, Aethel, Meridian via `data-editorial-theme`). Same HTML/components; tokens (color, type, radius, elevation) swap globally.
- **Live proof:** a control on the page (existing editorial select pattern) changes `html[data-editorial-theme]`. Header, cards, type, buttons all update — that is the “alterar o projeto todo” demo.
- **How to reuse:** show the two levers: `data-editorial-theme="…"` and `data-theme="dark|light"`. Point to `@velora/css/theme` import. Do not imply Skins are required for motion.
- **Components:** one composed strip (button, card, nav, field) as the replicable kit — not 15 tool pages. Contrast/converter/brand-voice stay in the archive.
- Cap: switcher + 4 named-skin cards + one component row + copy on replication. Archive holds the rest.

### 5.2 Home rules (didactic, not a dump)

Keep a **lot of legal demos** (home already does this). Change the *framing*:

- Opening: two sentences — **engine** = attributes; **Skins** = named DS models. CTA to Timeline vs Skins.
- Each demo block has: **kicker** (channel or pattern name), **one sentence**, optional **mini markup** or “See catalog / Skins”.
- Group by lesson, not by random chrome: e.g. enter, scroll/pin, hover, 3D/stage, then “this look is a Skin”.
- Prefer `vl-scene` + `vl-stage` + `vl-act` on at least one teaching scene.
- `.vl-card` / elevation = Skins look, called out as such — not a motion requirement.
- Existing home CSS (08/04e) may stay if it serves this page; do not rebuild a second DS.

## 6. Archive contents

Copy **before** deleting live pages:

- `apps/showcase/pages/**` as of the snapshot (all current HTML)
- Current `apps/showcase/index.html`
- Showcase-owned CSS still needed historically: already in `apps/showcase/public/css/` (`04e`, `08`, `showcase*.css`). Those files **stay** in live `public/css` if the new home/skin still import them; also copy a `css/` subset into the archive if any archived HTML is meant to be opened statically later.
- `apps/showcase/config/template-registry.mjs` snapshot (or a `MANIFEST.md` listing every archived path)

Archive `README.md` must state:

- Date and reason
- How to restore a page into live (copy file, add to registry, run contract)
- That archived HTML may drift from the live engine; it is a library, not CI truth

Do **not** duplicate `node_modules`, `dist`, or generated `velora.generated.css` as source of truth.

## 7. Tooling and contract

### 7.1 Template registry

`TEMPLATE_REGISTRY.default.sections` lists only the six live files (+ `index.html` already counted). Vite build inputs come only from this registry.

### 7.2 Validators

- `validate-showcase-contract.mjs` walks `index.html` + `pages/` of **live** showcase only. After the move, that tree is the six routes (plus any remaining shared partials — none expected).
- `pnpm check:motion` `--root` stays `apps/showcase` live tree.
- Archived HTML is excluded by path (outside `apps/showcase/pages`).

### 7.3 Sync CSS

Unchanged: edit `packages/css/src`, `pnpm sync:showcase-css`; never overwrite showcase-only files.

## 8. Other surfaces

- **Docs Astro:** keep Hosts / Scenes / Timelines; add one sentence that the public Showcase is the lean set and the old demos live in `archive/`.
- **Root README:** Showcase = small reference UI; archive path documented.
- **`packages/velora-components` / `packages/pages`:** untouched libraries.
- **Starter + Tailwind example:** stay the “easy” proofs; Hosts page links them.

## 9. Success criteria

- Live Vite build emits **exactly 6 HTML documents:** `index.html`, `pages/scenes/scene-timeline.html`, `pages/core/skins.html`, `pages/motion/api-motion-catalog.html`, `pages/core/hosts.html`, `pages/core/archive.html`.
- `pnpm verify:contract` green on the live tree.
- Home: visitor can name what each demo teaches without opening DevTools.
- Skins: switching `data-editorial-theme` visibly restyles the page kit; copy explains replication.
- Hosts: engine without importing Skins.
- Archive + manifest as before.

## 10. Risks

| Risk | Mitigation |
| --- | --- |
| Broken internal links from leftover hub copy | Grep live HTML for `/pages/` paths not in the six; fix or point to archive index |
| Archive HTML needs CSS that we later delete from live public | Copy required showcase CSS into `archive/showcase-2026-08/css/` at snapshot time |
| Contract still finding deleted pages | Registry + filesystem must match; no stubs left in `pages/` |
| Skins page becomes another 2000-line kitchen sink | Cap: switcher + named models + one component row |
| Home stays spectacular but opaque | Every block needs kicker + one-line lesson |

## 11. Implementation sequence (high level)

1. Snapshot pages + manifest + git tag (no live deletions yet).
2. Add live `skins.html`, `hosts.html`, `archive.html`; rewrite `index.html` as a didactic capability gallery (engine vs Skins).
3. Shrink registry; move remaining `pages/**` into archive; delete from live tree.
4. Fix nav/footer/links; `verify:contract` + `pnpm build`.
5. Touch README / docs one-liners.

---

## Open questions (resolved)

| Question | Decision |
| --- | --- |
| Backup vs hide-in-nav | In-repo archive + tag |
| Keep DS/components | Yes: live **Skins** page + full archive |
| DS product name | **Skins** (named replicable models; global token swap) |
| Home | Dense demos, didactic framing |
| Public size | Six routes |
