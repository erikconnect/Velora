# @velora/catalog

Canonical motion preset registry for Velora.

## Files

| File | Role |
|------|------|
| `presets.json` | Generated preset metadata (channel, status, requires, source) |
| `catalog-summary.json` | Counts by channel and status — use for marketing, docs, showcase |
| `attributes.json` | Public attribute index |

## Commands

```bash
pnpm generate:catalog   # regenerate from CSS + grammar
pnpm check:catalog      # fail if presets.json is stale
```

## Consumers

- Showcase Motion Lab / catalog pages
- `apps/docs` preset counts
- README marketing (never hardcode counts — derive from `catalog-summary.json`)
- Tests (future)

**Spec:** [`docs/spec/attribute-grammar.md`](../../docs/spec/attribute-grammar.md)
