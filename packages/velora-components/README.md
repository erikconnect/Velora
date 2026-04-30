# Velora Components

Pre-built HTML+CSS components built on the Velora design system. Zero JavaScript — pure semantic HTML with Velora CSS classes.

## Usage

Each component is a standalone HTML file. Copy the `<body>` content into your project.

Components require `@velora/css` (or `packages/css/src/velora.css`) loaded in the host page.

## Catalog

| Category | Files |
|---|---|
| **accordion** | `faq.html` |
| **application-shell** | `application-shell1–8.html` |
| **banner** | `banner11–16.html` |
| **blog** | `blog1–4.html` |
| **features** | `layout-bordered.html`, `layout-grid.html` |
| **footer** | `footer5.html` |
| **hero** | `header1.html` |
| **navbar** | `navbar16.html` |

See [CATALOG.md](./CATALOG.md) for the full component inventory with status and descriptions.

Browse all components at `index.html`.

## Creating New Components

Use `_shell.html` as the starting template. It includes the correct:
- Velora fonts (Space Grotesk + Manrope + JetBrains Mono)
- `velora.css` import via relative path
- Theme attribute (`data-theme="dark"` or `light`)
- Base structure for `.vl-*` class naming

## Conventions

- **Naming:** All CSS classes use `.vl-` prefix
- **Colors:** All colors use `oklch()` via CSS custom properties (`--vl-color-*`)
- **Fonts:** `--vl-font-family` (Manrope), `--vl-font-family-display` (Space Grotesk), `--vl-font-family-mono` (JetBrains Mono)
- **Layers:** Components live in `@layer velora.components`
- **Motion:** Add `vl-effect="effect-name"` attribute for entrance animations

## Importing from Relume

See `relume-import-queue.json` for the queue of Relume components to convert. Use `_shell.html` as the conversion template.
