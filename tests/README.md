# Velora tests

## Unit / contract (fast)

```bash
pnpm test                 # compiler + showcase library + audits
pnpm verify:contract      # CSS sync + catalog + showcase build + motion validate
```

## E2E — Playwright (P0.8)

Smoke coverage across Chromium, Firefox and WebKit:

- Showcase live + secondary pages load
- Registry-driven catalog + compatibility matrix populate
- Motion Lab inspector
- `prefers-reduced-motion: reduce` content visibility
- Generated `/data/*.json` integrity

### Setup (first time)

```bash
pnpm install
pnpm exec playwright install chromium firefox webkit
```

### Run

```bash
pnpm test:e2e
```

Against an existing preview server:

```bash
pnpm --filter showcase build
pnpm --filter showcase exec vite preview --host 127.0.0.1 --port 4187
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4187 pnpm test:e2e
```

Manual reduced-motion checklist: [`docs/validation/reduced-motion-checklist.md`](../docs/validation/reduced-motion-checklist.md)
