# Velora Component Catalog

Single source of truth for all components in `packages/velora-components/`.

**Status legend:**
- ✅ **Stable** — Production-ready, tested, no known issues
- 🔄 **In Progress** — Being actively built or converted
- 📋 **Planned** — In `relume-import-queue.json`, not yet built
- 🗄️ **Legacy** — Kept for reference; may not reflect latest tokens

---

## Accordion

| File | Variant | Status | Description |
|------|---------|--------|-------------|
| `accordion/faq.html` | FAQ | ✅ Stable | Expandable FAQ section with smooth open/close transitions using native `<details>`/`<summary>` |

---

## Application Shell

Full-page layout scaffolds for dashboard and app interfaces.

| File | Variant | Status | Description |
|------|---------|--------|-------------|
| `application-shell/application-shell1.html` | Shell 1 | ✅ Stable | Sidebar + main content layout |
| `application-shell/application-shell2.html` | Shell 2 | ✅ Stable | Top nav + full-width content |
| `application-shell/application-shell3.html` | Shell 3 | ✅ Stable | Sidebar + header + content |
| `application-shell/application-shell4.html` | Shell 4 | ✅ Stable | Collapsible sidebar variant |
| `application-shell/application-shell5.html` | Shell 5 | ✅ Stable | Dark sidebar + light content |
| `application-shell/application-shell6.html` | Shell 6 | ✅ Stable | Icon-only sidebar variant |
| `application-shell/application-shell7.html` | Shell 7 | ✅ Stable | Multi-panel layout |
| `application-shell/application-shell8.html` | Shell 8 | ✅ Stable | Split-pane editor layout |

---

## Banner

Notification banners and announcement bars.

| File | Variant | Status | Description |
|------|---------|--------|-------------|
| `banner/banner11.html` | Banner 11 | ✅ Stable | Simple text announcement bar |
| `banner/banner12.html` | Banner 12 | ✅ Stable | Dismissible banner with close button |
| `banner/banner13.html` | Banner 13 | ✅ Stable | Banner with CTA link |
| `banner/banner14.html` | Banner 14 | ✅ Stable | Banner with icon and rich content |
| `banner/banner15.html` | Banner 15 | ✅ Stable | Full-width gradient banner |
| `banner/banner16.html` | Banner 16 | ✅ Stable | Aurora shimmer banner |

---

## Blog

Blog listing and article page layouts.

| File | Variant | Status | Description |
|------|---------|--------|-------------|
| `blog/blog1.html` | Blog 1 | ✅ Stable | Card grid layout |
| `blog/blog2.html` | Blog 2 | ✅ Stable | Featured post + sidebar list |
| `blog/blog3.html` | Blog 3 | ✅ Stable | Magazine-style layout |
| `blog/blog4.html` | Blog 4 | ✅ Stable | Minimal list layout |

---

## Features

Feature section patterns for marketing and landing pages.

| File | Variant | Status | Description |
|------|---------|--------|-------------|
| `features/layout-bordered.html` | Bordered | ✅ Stable | Features grid with bordered card style |
| `features/layout-grid.html` | Grid | ✅ Stable | Features grid with icon + text pattern |

---

## Footer

| File | Variant | Status | Description |
|------|---------|--------|-------------|
| `footer/footer5.html` | Footer 5 | ✅ Stable | Multi-column footer with logo, nav links, legal |

---

## Hero

Page hero / header sections.

| File | Variant | Status | Description |
|------|---------|--------|-------------|
| `hero/header1.html` | Header 1 | ✅ Stable | Full-screen hero with headline, subtext, CTA |

---

## Navbar

| File | Variant | Status | Description |
|------|---------|--------|-------------|
| `navbar/navbar16.html` | Navbar 16 | ✅ Stable | Top navigation with logo, links, CTA button |

---

## Pending Import Queue

The following components are queued for conversion from Relume. See `relume-import-queue.json`.

| Name | Category | Status |
|------|----------|--------|
| Banner 11–16 (extended variants) | Banner | 📋 Planned |

---

## Adding a Component

1. Copy `_shell.html` as your starting template
2. Build in the appropriate category folder (e.g. `hero/hero2.html`)
3. Use only `vl-*` CSS classes and `--vl-*` custom properties
4. Add `vl-effect="..."` attributes for entrance animations (never inline animation CSS)
5. Add a row to this file with status ✅ when ready
6. Add it to `index.html` for browsing

## CSS Layer

All component styles should be declared in `@layer velora.components` or rely on existing framework classes. No custom layers, no inline styles.
