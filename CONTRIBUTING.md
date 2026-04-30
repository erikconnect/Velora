# Contributing to Velora

Thanks for your interest in contributing.

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 10 (`npm install -g pnpm`)

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

If pnpm warns about **ignored build scripts** (for example `esbuild` / `sharp`), run `pnpm approve-builds` once on your machine and allow the tools your stack needs, so local builds match CI.

2. Build all packages/apps:

```bash
pnpm build
```

3. Run the local playground:

```bash
pnpm dev
```

4. Run docs locally (optional):

```bash
pnpm dev:docs
```

5. Run both playground and docs simultaneously:

```bash
pnpm dev:all
```

## Monorepo Structure

This is a **pnpm workspace** managed with **Turborepo**.

| Workspace | Path | Purpose |
|-----------|------|---------|
| `@velora/css` | `packages/css/` | Core CSS framework |
| `showcase` | `apps/showcase/` | Vite dev playground (30+ demo pages) |
| `docs` | `apps/docs/` | Astro documentation site |

`turbo.json` defines the build pipeline: `packages/css` must build before `apps/*`.

## CI/CD Pipeline

Velora uses **GitHub Actions** (`.github/workflows/ci.yml`).

### What it does

| Trigger | Action |
|---------|--------|
| Push to `main` | Full install + build |
| Pull request (any branch) | Full install + build |

### Steps

1. **Checkout** — clone the repository
2. **Setup pnpm v10** — via `pnpm/action-setup`
3. **Setup Node.js 20** — with pnpm cache enabled
4. **Install** — `pnpm install --frozen-lockfile` (fails if `pnpm-lock.yaml` is out of sync)
5. **Build** — `pnpm build` (runs Turborepo pipeline; builds `@velora/css` then all apps)

### Passing CI

Before opening a PR, ensure:

```bash
pnpm install --frozen-lockfile   # lock file must be committed and up to date
pnpm build                       # full build must succeed
```

If `pnpm install --frozen-lockfile` fails locally, run `pnpm install` (without the flag) to update your lock file, commit `pnpm-lock.yaml`, then try again.

## Pull Request Guidelines

- Keep changes focused and minimal.
- Update docs when behavior or APIs change.
- Ensure `pnpm build` passes before opening a PR.
- Include screenshots or short clips for visual/UI changes.

## Commit Style

Use clear commit messages with an imperative verb, for example:
- `feat: add cinematic card variants`
- `fix: correct layer order in velora.css`
- `docs: document transition utilities`

