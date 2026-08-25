# Showcase archive — 2026-08

Frozen snapshot of the pre-lean Showcase (~50 HTML pages plus showcase-only CSS).

**Why:** Public Showcase restarted as six didactic routes (Home, Timeline, Skins, Catalog, Hosts, Archive). This folder keeps Skins/DS/component work recoverable.

**Not CI:** Archived HTML is a library. `pnpm verify:contract` and Vite only scan `apps/showcase/`.

## Restore a page into live

1. Copy the HTML into `apps/showcase/pages/` (same relative path).
2. Add the path to `apps/showcase/config/template-registry.mjs`.
3. Point nav/footer if needed.
4. Run `pnpm verify:contract`.

## Contents

- `index.html` — home snapshot
- `pages/` — all HTML as of this archive
- `css/` — showcase-owned CSS copied at snapshot time
- `config/template-registry.mjs.bak` — registry before the lean set
- `MANIFEST.md` — path + one-line purpose
