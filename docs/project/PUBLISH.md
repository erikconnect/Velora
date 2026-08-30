# Publishing @velora/css

The package is **publish-ready in-repo** (`prepack` builds `dist/`). It is **not yet on the public npm registry** until an maintainer runs `npm publish` with credentials for the `@velora` scope.

## Pre-publish checklist

1. Run the full gate: `pnpm verify:contract && pnpm test:e2e`
2. Bump version in `packages/css/package.json` (semver).
3. Build dist: `pnpm --filter @velora/css build`
4. Dry-run tarball: `pnpm pack:css` (from repo root) — inspect `velora-css-*.tgz`
5. Confirm `dist/manifest.json` bundle sizes and `publishStatus`
6. Publish: `pnpm --filter @velora/css publish --access public` (requires npm login)

## Local install without npm

```bash
pnpm --filter @velora/css pack
pnpm add ./velora-css-1.0.0.tgz
```

Or depend on the monorepo workspace: `"@velora/css": "workspace:*"`.

## CDN (after publish)

Default CDN entry: **motion-core** (host-agnostic). Replace `{version}` with the published semver.

### unpkg

```html
<link rel="stylesheet" href="https://unpkg.com/@velora/css@1.0.0/dist/motion-core.css" />
```

### jsDelivr

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@velora/css@1.0.0/dist/motion-core.css" />
```

Full bundle (Skins + components + motion):

```html
<link rel="stylesheet" href="https://unpkg.com/@velora/css@1.0.0/dist/velora.css" />
```

Generated URLs are also in `packages/css/dist/manifest.json` after each build.

## Honest messaging

- **Zero animation runtime JavaScript** — motion is CSS-only; Showcase tooling JS does not ship in `@velora/css`.
- Dist copies are **not minified** by default; minify at the host boundary if needed.
- Do not claim npm/CDN availability until the registry listing exists.

## Related

- [packages/css/README.md](../../packages/css/README.md)
- [CONTRACT.md](./CONTRACT.md)
- [Benchmarks page](../../apps/showcase/pages/core/benchmarks.html) — `/data/benchmarks.json`
