# Publishing @velora/css

The package is **publish-ready in-repo** (`prepack` builds `dist/`). It is **not yet on the public npm registry** until an maintainer runs `npm publish` with credentials for the `@velora` scope.

## Pre-publish checklist

1. Run the full gate: `pnpm verify:contract && pnpm test:e2e`
2. Bump version in `packages/css/package.json` (semver).
3. Build dist: `pnpm --filter @velora/css build`
4. Dry-run tarball: `pnpm pack:css` (from repo root) — inspect `velora-css-*.tgz`
5. Confirm `dist/manifest.json` bundle sizes and `publishStatus`
6. Publish (choose one path below)

### Path A — local CLI (first publish)

Linking GitHub on [npmjs.com](https://www.npmjs.com) does **not** log in this machine. Run once:

```bash
npm login
```

Then from repo root:

```bash
pnpm --filter @velora/css build
pnpm --filter @velora/css publish --access public --provenance
```

Confirm: `npm view @velora/css version`

### Path B — GitHub Trusted Publishing (after first publish)

1. On npm → package **@velora/css** → **Settings** → **Trusted Publisher** → link repo `erikconnect/Velora`, workflow `publish-npm.yml`, environment `npmjs`.
2. Trigger manually: **Actions → Publish @velora/css → Run workflow**, or push a tag:

```bash
git tag css-v1.0.0
git push origin css-v1.0.0
```

Uses OIDC (`id-token: write`) — no `NPM_TOKEN` secret required when trusted publisher is configured.

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
