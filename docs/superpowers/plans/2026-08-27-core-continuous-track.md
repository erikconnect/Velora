# Core Continuous Opera Track Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite Core intro→channels as one pin+scrub opera track with bussola scroll marks and clearer act spacing.

**Architecture:** Single `[vl-scene][vl-timeline="view"][vl-pin][vl-scrub]` with sticky `[vl-stage]`; chapter anchors as absolute marks on the track; policy remains a separate cinema section.

**Tech Stack:** HTML Showcase page, Velora scene engine CSS, Showcase reference CSS.

## Global Constraints

- Zero-JS motion only
- No `vl-in-view` inside `[vl-stage]`
- Stage motion nodes must be direct children of `[vl-stage]`
- Canonical CSS in `packages/css/src/`; sync to showcase
- Keep bussola stop IDs: `#core-intro`, `#core-architecture`, `#core-drivers`, `#core-channels`, `#core-policy`

---

### Task 1: Extend scene engine pin/act maps

**Files:**
- Modify: `packages/css/src/03c-scene-engine.css`
- Sync: `pnpm sync:showcase-css`

- [x] **Step 1:** Add `[vl-pin="7"]`…`[vl-pin="10"]` factor maps
- [x] **Step 2:** Add `[vl-act="9"]`…`[vl-act="12"]` and nth-child 9–12 baselines
- [x] **Step 3:** Sync showcase CSS

### Task 2: Continuous track markup on Core

**Files:**
- Modify: `apps/showcase/pages/core/core.html`

- [x] **Step 1:** Replace separate pin sections with one `#core-opera` track + marks + stage acts
- [x] **Step 2:** Keep `#core-policy` outside the pin
- [x] **Step 3:** Wire bussola hrefs to the same IDs (marks + policy)

### Task 3: Opera track layout CSS

**Files:**
- Modify: `apps/showcase/public/css/showcase-reference-pages.css`

- [x] **Step 1:** Timeline names for `#core-opera` / marks / policy
- [x] **Step 2:** `.core-opera-mark` absolute scroll fractions
- [x] **Step 3:** `.core-opera-track` full-bleed sticky stage layout (absolute chapter layers)

### Task 4: Verify

- [x] **Step 1:** `pnpm --filter showcase check:vl-contract`
- [ ] **Step 2:** Manual: pin from hero, acts spaced, bussola jumps along track
