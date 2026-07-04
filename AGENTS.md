# Velora — Agent Instructions

**Velora** is a motion-native, CSS-first design system (pnpm + Turborepo monorepo). There is no backend, database, or runtime server — everything is static CSS/HTML plus build-time Node tooling.

Detailed engineering conventions live in [`docs/agents/AGENTS.md`](docs/agents/AGENTS.md). Setup/build/CI rules live in [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Cursor Cloud specific instructions

- Prereqs are already present in the cloud VM (Node 20+/pnpm 10). Dependencies are installed by the startup update script (`pnpm install --frozen-lockfile`); no version-manager juggling is needed.
- `pnpm install` prints a warning about ignored build scripts (`esbuild`, `sharp`). This is expected and **not** blocking — `pnpm build`, `pnpm dev`, and the Astro docs build all work without running `pnpm approve-builds`.
- Services (all standard commands documented in the root `README.md` / `package.json`):
  - `pnpm dev` → showcase (Vite) on `http://localhost:5173` — the primary interactive playground.
  - `pnpm dev:docs` → docs (Astro) on `http://localhost:4321`.
  - Dev servers bind to localhost only; pass `--host` to expose on the network.
- `pnpm verify:contract` runs the CSS-sync check, the `vl-*` contract validation, **and a full `pnpm build`** — so it is slower than a plain lint check but is the canonical pre-PR gate (mirrors CI in `.github/workflows/ci.yml`).
- Fast checks without a full build: `pnpm --filter @velora/compiler test` and `pnpm --filter showcase test:library` (both use the Node built-in test runner).
- No `.env`, secrets, database, or external services are required to build, run, or test anything in this repo.
