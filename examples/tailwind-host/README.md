# Tailwind host example

Proof that Velora motion works without the Velora design-system skin.

## Run

Open `index.html` in a modern browser (Chrome 124+ recommended for scroll-driven timelines), or serve the `examples/` folder statically.

```bash
# from repo root
npx --yes serve examples/tailwind-host
```

## Contract

- CSS: `@velora/css/motion-core` (via local import of `packages/css/src/motion-core.css`)
- Look: Tailwind CDN utilities only
- No `.vl-card`, no `@velora/css/theme`
