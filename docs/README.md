# Velora documentation (source of truth)

This folder (`docs/` at the **repository root**) is the **canonical Markdown layer** for governance, the written contract, and agent instructions. Do not confuse it with the **`apps/docs`** Astro package (published guides) — both should describe the same APIs; the contract file in [project/CONTRACT.md](project/CONTRACT.md) and the showcase catalogs are the cross-check. Executable CSS truth remains in `packages/css/src/`.

## How to read this tree

| Section | Purpose |
| --- | --- |
| [project/](project/) | Monorepo map, contract matrix, product boundaries, showcase authoring |
| [agents/](agents/) | Instructions for AI-assisted work (handbook, skill sets) |
| [design/](design/) | Design narrative, PDF exports, links to repo `design-system/` |
| [reference/](reference/) | Small snippets and token snapshots (not the CSS source of truth) |
| [velora-design-system/](velora-design-system/) | HTML + image snapshot used for design reviews |
| [superpowers/](superpowers/) | Local copies of generic agent prompts (see folder README) |

`docs/internal/` is gitignored — scratch reports and machine-local notes only.

## Quick links

- [Workspace guide](project/WORKSPACE.md) — folder ownership, scripts, sync flow
- [Contract matrix](project/CONTRACT.md) — Motion/Design API and catalog paths
- [Showcase page playbook](project/SHOWCASE_PAGE_PLAYBOOK.md)
- [Product surfaces plan](project/PRODUCT_SURFACES_PLAN.md)
- [Agent instructions](agents/AGENTS.md)
- [Agent handbook](agents/handbook.md)
- [Agent skill sets](agents/skill-sets.md)
- [Changelog](../CHANGELOG.md) (repository root, Keep a Changelog)

## Relationship to code

```text
packages/css/src/     → canonical CSS implementation
apps/showcase/pages/  → demos + live catalogs (api-*-catalog.html)
docs/project/         → written contract + workspace map (must stay aligned)
```

After CSS or contract changes, run `pnpm verify:contract` before merging.
