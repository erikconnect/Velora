# WordPress + Velora

Host-agnostic examples for enqueueing `@velora/css/motion-core` in WordPress without an animation JavaScript runtime.

| Path | Integration |
| --- | --- |
| [`php-template/`](./php-template/) | Classic theme — `functions.php` + template markup |
| [`gutenberg/`](./gutenberg/) | Block theme — `theme.json` + block pattern |
| [`elementor/`](./elementor/) | Elementor — custom CSS + HTML widget notes |

## Principles

1. Enqueue **motion-core** (or motion-extended) — skip Velora Skins unless you want editorial tokens.
2. Markup uses public `vl-*` attributes; motion stays in CSS.
3. Do not load GSAP/ScrollTrigger for Velora scenes — native scroll/view timelines drive scrub.
4. Respect `prefers-reduced-motion`; Velora collapses travel automatically.

## Package source

From the monorepo after `pnpm --filter @velora/css build`:

```text
packages/css/dist/motion-core.css
```

Copy to your theme `assets/css/velora-motion-core.css` or symlink during development.

See also: [`examples/tailwind-host/`](../tailwind-host/) for a non-WordPress host.

**Live demo (planned):** `https://examples.veloracss.io` on Hostinger VPS — [DEPLOY.md](../../docs/project/DEPLOY.md).
