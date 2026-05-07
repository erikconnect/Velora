---
applyTo: "packages/css/src/**/*.css"
description: "Velora CSS authoring rules — layers, tokens, motion guards. Apply to all files in packages/css/src/."
---

# Velora CSS Authoring Rules

## Layer Placement

Every declaration MUST be inside the correct `@layer velora.*`:

| File | Layer |
|------|-------|
| `00-reset.css` | `velora.reset` |
| `01-tokens.css`, `01b-editorial-themes.css` | `velora.tokens` |
| `02-layout.css` | `velora.layout` |
| `03-motion.css`, `03b-motion-extended.css` | `velora.motion` |
| `04-components.css` … `04e-*.css` | `velora.components` |
| `05-transitions.css` | `velora.transitions` |
| `06-utilities.css` | `velora.utilities` |
| `07-overrides.css` | `velora.overrides` |

Never write rules outside a layer block. Never use `!important`.

## Token Usage

- Colors → `--vl-color-*`, `--vl-bg-*`, `--vl-text-*`, `--vl-border-*`
- Spacing → `--vl-space-2xs` … `--vl-space-3xl`
- Typography → `--vl-font-family`, `--vl-font-size-*`, `--vl-font-weight-*`
- Motion → `--vl-duration-*`, `--vl-ease-*`

**Never** hard-code hex values, px sizes, or ms durations. Always reference a token.

## Motion Guards (Mandatory)

Every animation or transition block must have a reduced-motion variant:

```css
@layer velora.motion {
  [vl-effect="fade-up"] {
    animation: vl-fade-up var(--vl-motion-duration) var(--vl-motion-ease) both;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
}
```

Missing `prefers-reduced-motion` guards = WCAG violation. Block the change.

## Naming

- Custom properties: `--vl-*`
- Classes: `.vl-*`
- Keyframe names: `vl-*` (e.g., `@keyframes vl-fade-up`)
- No BEM; use flat class names with modifier suffixes (`--ghost`, `--narrow`)

## View Transitions

`@view-transition { navigation: auto; }` is declared at the **root level** (not inside a layer) in `05-transitions.css`. Shared element classes use `.vl-vt-shared-*`.

## After Editing

Run `pnpm sync:showcase-css` to mirror changes to `apps/showcase/public/css/`, then `pnpm verify:contract` to validate compliance.
