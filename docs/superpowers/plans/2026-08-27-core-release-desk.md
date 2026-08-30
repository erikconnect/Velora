# Core Release Desk Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Reform `core.html` into an interactive Release desk around one “Release brief / 07” artifact.

**Architecture:** Showcase-only HTML + `showcase-reference-pages.css`. Real `vl-*` attrs; native `details` / radios / popover; `:has()` for policy panels. No engine API changes.

**Tech Stack:** HTML, Velora motion attrs, Showcase CSS

## Global Constraints

- Zero-JS motion; no new `vl-*`
- Playbook §4 authorship (gate vs scrub)
- Visual sibling to Skins brief; cinematic, not dashboard
- Do not edit `packages/css` / derived `03-*.css` for this pass

---

### Task 1: Brief CSS + Hero/Architecture markup

**Files:** `showcase-reference-pages.css`, `core.html`

- [x] Add `.showcase-core-brief*` desk styles
- [x] Replace hero aside + architecture with brief + ownership details

### Task 2: Drivers + Channels

- [x] Scrub brief on drivers stage; gated clock list
- [x] Single composed channels brief (hover/state/scroll/popover)

### Task 3: Policy + verify

- [x] Radio + `:has()` `vl-motion` panels
- [x] Playbook pointer; `pnpm --filter showcase check:vl-contract` passed
