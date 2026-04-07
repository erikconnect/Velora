# Velora

Velora is a motion-native frontend platform focused on premium, cinematic interfaces using modern HTML and CSS.

This repository is a PNPM + Turborepo monorepo with:
- `packages/css`: the core `@velora/css` design system
- `apps/docs`: Astro documentation site
- `apps/playground`: Vite playground for fast local experimentation

## Tech Stack

- PNPM workspaces
- Turborepo
- Astro
- Vite
- Modern CSS (layers, tokens, motion primitives)

## Getting Started

### Prerequisites

- Node.js 20+
- PNPM 10+

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Runs the playground app.

To run docs:

```bash
pnpm dev:docs
```

To run both in parallel:

```bash
pnpm dev:all
```

### Build

```bash
pnpm build
```

## Workspace Layout

```text
velora/
  apps/
    docs/
    playground/
  packages/
    css/
```

## Contributing

Please read `CONTRIBUTING.md` before opening a pull request.

## License

ISC. See `LICENSE`.
