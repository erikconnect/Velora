# Contributing to Velora

Thanks for your interest in contributing.

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

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
