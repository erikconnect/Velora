# CSS Layer Architecture — Velora

All Velora CSS is organized inside `@layer velora.*` blocks. Specificity is controlled entirely by layer order, not selector weight.

## Layer Order (lowest → highest specificity)

```css
@layer velora.reset        /* normalize / box-sizing / base resets */
@layer velora.tokens       /* CSS custom properties (--vl-*) */
@layer velora.layout       /* vl-container, vl-scene, grid primitives */
@layer velora.motion       /* @keyframes, vl-effect rules, stagger */
@layer velora.components   /* .vl-* component classes */
@layer velora.transitions  /* view transitions, page-level animations */
@layer velora.utilities    /* single-purpose utility classes */
@layer velora.overrides    /* theme overrides, dark mode, data-* overrides */
```

## Source File Map

| Layer | File |
|-------|------|
| `velora.tokens` | `packages/css/src/00-tokens.css` |
| Motion tokens | `packages/css/src/01a-motion-tokens.css` |
| Editorial themes | `packages/css/src/01b-editorial-themes.css` |
| `velora.layout` | `packages/css/src/02-layout.css` |
| `velora.motion` | `packages/css/src/04-motion.css` |
| `velora.components` | `packages/css/src/05-components.css` |
| `velora.transitions` | `packages/css/src/06-transitions.css` |
| Showcase home | `packages/css/src/08-showcase-home.css` |
| Entry point | `packages/css/src/velora.css` |

## Where to Put New Code

| New code type | Layer | File |
|---------------|-------|------|
| New design token | `velora.tokens` | `00-tokens.css` |
| New motion token | `velora.tokens` | `01a-motion-tokens.css` |
| New keyframe | `velora.motion` | `04-motion.css` |
| New `vl-effect` rule | `velora.motion` | `04-motion.css` |
| New `.vl-*` component | `velora.components` | `05-components.css` |
| New view transition | `velora.transitions` | `06-transitions.css` |
| Theme variant | `velora.overrides` | `01b-editorial-themes.css` |

## Rules

- **Never write CSS outside a `@layer velora.*` block**
- **Never use `!important` except inside `velora.overrides` or reduced-motion guards**
- **Never increase specificity via nesting or ID selectors** — rely on layer order instead
- **Utilities** are single property + value only (e.g. `.vl-u-sr-only`, `.vl-u-visually-hidden`)

## Verification Commands

```bash
# After editing packages/css/src/
pnpm sync:showcase-css    # syncs CSS to showcase app
pnpm check:showcase-css   # validates CSS integrity
pnpm verify:contract      # full contract validation
```
