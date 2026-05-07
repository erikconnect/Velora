# Velora Default Template

This folder defines the default template boundary for the Velora showcase app.

## Goals

- Keep a clear separation between template definition and page implementation.
- Allow additional templates to be introduced without rewriting build wiring.
- Provide a page-by-page audit trail before introducing JS-assisted animations.

## Source of truth

The canonical template registry lives in:

- `apps/showcase/config/template-registry.mjs`

HTML starter for new showcase pages (shell + bussola + blocos Velora):

- `apps/showcase/pages/core/page-template.html`

It defines sections and owned pages for the `default` template.

## Audit flow

Run page-by-page audit:

```bash
pnpm --filter showcase audit:pages
```

This generates:

- `apps/showcase/output/template-page-audit.md`

The report validates presence of shell, title, description, and primary H1 on each template page.
