# @velora/css

Declarative CSS motion engine (host-agnostic) with optional Velora Skins theme layer.

## Install (local monorepo)

```bash
pnpm add @velora/css
```

The package is **not yet published to npm**. Use the workspace path or `pnpm pack` from this directory after `pnpm build`.

## Entry points

| Import | Purpose |
| --- | --- |
| `@velora/css/motion-core` | Host-agnostic motion engine only |
| `@velora/css/motion-extended` | Extended motion recipes |
| `@velora/css/theme` | Editorial skins + scene recipes |
| `@velora/css` / `full` | Full bundle |

## Usage

```css
@import "@velora/css/motion-core";
```

Host pages use attribute-driven motion (`vl-enter`, `vl-scene`, `vl-timeline`, etc.). See [Attribute Grammar](../../docs/spec/attribute-grammar.md).

## Build

```bash
pnpm --filter @velora/css build
```

Copies canonical CSS from `src/` to `dist/`, writes `dist/manifest.json` (bundle sizes + CDN URLs) and syncs `apps/showcase/public/data/benchmarks.json`.

```bash
pnpm --filter @velora/css build
pnpm --filter @velora/css check:dist
pnpm pack:css   # from repo root — dry-run tarball
```

Publish checklist: [docs/project/PUBLISH.md](../../docs/project/PUBLISH.md).

## CDN (after npm publish)

```html
<link rel="stylesheet" href="https://unpkg.com/@velora/css@1.0.0/dist/motion-core.css" />
```

See `dist/manifest.json` for versioned unpkg/jsDelivr URLs after each build.

## Zero animation runtime JavaScript

Motion is CSS-only. JavaScript in Velora Showcase is UI/tooling (theme toggle, registry inspector) — not an animation driver.
