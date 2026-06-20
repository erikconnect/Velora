# Velora — Agent Instructions

Velora is a motion-native, CSS-first design system (pnpm + Turborepo monorepo). There is no backend, database, or external service: everything is static HTML/CSS plus Node-based tooling.

For full developer guidance (workspace map, CSS layer rules, motion API conventions, validation), see `docs/agents/AGENTS.md` and `CONTRIBUTING.md`.

## Cursor Cloud specific instructions

The update script already runs `pnpm install`, so dependencies are present at session start. Node and pnpm meet the repo `engines` (Node ≥20, pnpm ≥10).

Standard commands live in `package.json` / `CONTRIBUTING.md` / `docs/agents/AGENTS.md`. Key ones:

- Showcase dev server (primary app): `pnpm dev` → Vite on `http://localhost:5173/` (MPA; pages under `/pages/...`).
- Docs site (optional): `pnpm dev:docs` → Astro on `http://localhost:4321/`.
- Both at once: `pnpm dev:all`.
- Full build: `pnpm build`. Contract/lint checks: `pnpm verify:contract`.
- Tests: `pnpm --filter @velora/compiler test` and `pnpm --filter showcase test:library`.

Non-obvious caveats:

- `pnpm install` prints a warning about ignored build scripts (`esbuild`, `sharp`). This is benign in this environment — `pnpm build`, `pnpm dev`, `pnpm dev:docs`, and the docs Astro build all succeed without running `pnpm approve-builds`. Do not add `pnpm approve-builds` to the update script (it is interactive and unnecessary here).
- `apps/showcase/public/css/` is derived from `packages/css/src/`. After editing core CSS, run `pnpm sync:showcase-css`; otherwise `pnpm verify:contract` will flag drift.
