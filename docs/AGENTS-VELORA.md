# AGENTS.md — Velora

## Mission

This repository is the source of truth for Velora CSS.

Primary objective:

> Make `veloracss.io` the canonical, technically defensible reference implementation of Velora CSS.

Product positioning:

**Velora CSS — Declarative motion for modern HTML and CSS.**

Technical definition:

> A small attribute grammar that maps motion intent to browser-native CSS primitives.

Primary mental model:

```html
<article vl-enter="fade-up">
```

```text
HTML declares intent
        ↓
Velora attribute grammar
        ↓
Modern CSS primitives
        ↓
Browser executes motion
```

Velora is not primarily:

- a Tailwind replacement;
- a Bootstrap-style UI framework;
- a GSAP replacement;
- a JavaScript ban;
- a universal animation engine;
- an application-state framework.

Treat Velora as a declarative motion layer.

---

## Repository Role

This repository owns:

```text
packages/css          framework / motion engine
docs                  specifications and contracts
examples              portable examples
apps/docs             public documentation
apps/showcase         veloracss.io
apps/docs             docs.veloracss.io
experiments           experimental primitives
tests                 compatibility and regression coverage
```

`apps/showcase` is the canonical reference implementation.

The public site must prove what Velora can actually do.

---

## Core Rule: No Showcase Fakery

Every showcased Velora effect must:

1. use the public Velora API;
2. be reproducible outside the showcase;
3. preserve usable content when unsupported;
4. respect `prefers-reduced-motion`;
5. declare browser or feature requirements;
6. avoid animation-specific JavaScript unless explicitly documented as an exception.

If the showcase needs to fake a capability, that capability is not a public Velora feature yet.

Marketing claims must be derived from:

- source data;
- tests;
- generated catalog data;
- reproducible measurements.

Do not hardcode unsupported marketing claims such as:

```text
123 presets
120fps
works everywhere
zero JavaScript
production ready
```

---

## Public Messaging

Prefer:

```text
Zero animation runtime JavaScript
```

instead of:

```text
Zero JavaScript
```

Velora may coexist with JavaScript applications.

JavaScript remains valid for:

- business logic;
- data fetching;
- state management;
- API calls;
- application interaction;
- complex programmatic timelines;
- framework runtime;
- playground UI.

The Velora claim is narrower:

> Motion behavior can often be executed by CSS/browser primitives without an animation-specific JavaScript runtime.

---

## Public Attribute Grammar

Public `vl-*` attributes must have explicit contracts.

Current or candidate channels include:

```text
vl-enter
vl-scroll
vl-hover
vl-loop
vl-state
vl-exit
vl-children
vl-page-transition
vl-motion
```

Do not treat an attribute as stable until its behavior is documented.

Create or maintain:

```text
docs/spec/attribute-grammar.md
```

Each attribute contract must define:

```text
name
type
valid values
composition rules
unsupported combinations
fallback
reduced-motion behavior
browser requirements
status
```

Status must be one of:

```text
stable
progressive enhancement
experimental
```

---

## `vl-state`

Do not imply that Velora owns application state.

Velora may animate transitions triggered by:

```css
:hover
:focus-visible
:checked
:target
:open
:popover-open
:has()
```

or external application state such as:

```html
data-state="open"
```

Principle:

> Velora may animate state transitions without owning application state.

---

## `vl-exit`

Define precisely what "exit" means before exposing it as stable.

Potential interpretations include:

- leaving the viewport;
- removal from DOM;
- page navigation;
- closing a modal;
- closing a popover;
- state change;
- transition to `display:none`.

Document supported scenarios and limitations.

---

## Canonical Preset Registry

Avoid duplicate preset metadata across:

- CSS;
- docs;
- showcase;
- README;
- tests;
- presentation consumers.

Create or maintain a canonical registry such as:

```text
packages/css/catalog/
```

or:

```text
packages/catalog/
```

Suggested metadata:

```json
{
  "name": "fade-up",
  "channel": "enter",
  "status": "stable",
  "attribute": "vl-enter",
  "value": "fade-up",
  "requires": ["animation"],
  "enhancements": ["animation-timeline:view()"],
  "reducedMotion": "static",
  "description": "Fade and translate into view."
}
```

Consumers should derive from this source:

```text
showcase
docs
README
tests
marketing counts
presentation data where practical
```

Never maintain preset counts manually.

---

## Showcase Requirements

`apps/showcase` should evolve into the canonical product explorer for `veloracss.io`.

It should answer:

1. What is Velora?
2. What problem does it solve?
3. How do I use it?
4. Which effects actually exist?
5. Which browser primitives are used?
6. What happens when support is missing?
7. What happens with reduced motion?
8. How much animation-specific JS is required?
9. Can the example be copied outside the showcase?
10. Which integrations are actually tested?
11. Is a capability stable, enhancement, or experimental?

Recommended sections:

```text
Hero
The model
Live demo
Attribute grammar
Motion Lab
Modern CSS primitives
Compatibility
Progressive enhancement
Interoperability
Benchmarks / evidence
Open source / contribute
```

---

## Motion Lab

Motion Lab is a core deliverable.

Each public preset should expose:

```text
Name
Channel
Status
HTML usage
Underlying CSS primitives
Fallback
Reduced-motion behavior
Browser compatibility
Known limitations
Source location
```

Example structure:

```text
Motion Lab

[ Enter ] [ Scroll ] [ Hover ] [ Loop ] [ State ] [ Exit ]

Preview

Preset
fade-up

HTML
<article vl-enter="fade-up">

Primitive
animation-timeline: view();

Compatibility
Chrome ✓
Safari ✓
Firefox ◐

Reduced motion
safe fallback

Status
Stable
```

The preview must use the real public Velora API.

---

## Compatibility Model

Do not rely only on global browser version claims.

Document support by primitive and feature.

Suggested statuses:

```text
✓ Stable
◐ Progressive enhancement
⚗ Experimental
```

Track relevant primitives such as:

```text
CSS Custom Properties
@layer
:has()
Container Queries
View Transitions
Scroll-driven Animations
sibling-index()
sibling-count()
CSS if()
```

Every enhanced feature must document its fallback.

---

## Experimental CSS

Experimental primitives such as `if()` must be labeled explicitly.

Use language like:

```text
Experimental
Progressive enhancement
Not required by the Velora baseline
```

Principle:

> Velora may experiment with emerging CSS without making the baseline depend on experimental primitives.

---

## Progressive Enhancement

The baseline must remain usable.

Avoid hidden initial states that depend on unsupported animation features.

Bad:

```css
.element {
  opacity: 0;
}
```

when no guaranteed mechanism restores visibility.

Preferred direction:

```css
.element {
  opacity: 1;
}

@supports (animation-timeline: view()) {
  .element {
    /* enhanced behavior */
  }
}
```

Rule:

> The effect may disappear. The interface must not.

---

## Reduced Motion

All public motion features must account for:

```css
@media (prefers-reduced-motion: reduce)
```

Expected behavior:

- content remains visible;
- essential information remains accessible;
- motion collapses or simplifies;
- interaction does not depend on animation.

Reduced motion should be covered by tests or explicit documented validation.

---

## Playground

Build the playground only after the public grammar and catalog are stable enough.

The playground UI may use JavaScript.

If so, distinguish clearly:

```text
Playground UI uses JavaScript.
Preview motion uses Velora/CSS.
```

Do not pretend the entire application is JavaScript-free.

---

## Benchmarks

Create reproducible evidence rather than marketing-only performance claims.

Suggested route:

```text
/benchmarks
```

Possible comparisons:

```text
Velora
Vanilla CSS
IntersectionObserver
GSAP + ScrollTrigger
```

Possible metrics:

```text
Transferred JS
Animation-specific JS
Main-thread scripting
DOM listeners
Integration code size
Reduced-motion handling
Browser support
Memory
Dropped frames
```

Do not claim fixed FPS without:

- methodology;
- hardware;
- browser;
- refresh rate;
- scenario;
- reproducible result.

Prefer objective claims such as:

```text
0 KB animation runtime JavaScript
```

when verified.

---

## GSAP Positioning

Do not frame GSAP as the enemy.

Preferred position:

> Velora exists because the browser can now solve many motion problems declaratively that previously required programmatic tooling.

Use GSAP or equivalent tools when complex programmatic timeline control remains appropriate.

---

## View Transitions

Document the distinction between:

- cross-document / MPA transitions;
- same-document / SPA transitions.

Do not imply all View Transition scenarios are zero-JavaScript.

Attach zero-JS claims only to scenarios that actually work without JavaScript.

---

## Stagger

Investigate and document modern primitives such as:

```css
sibling-index()
sibling-count()
```

where appropriate.

Example direction:

```css
[vl-children="stagger"] > * {
  animation-delay:
    calc(sibling-index() * var(--vl-stagger));
}
```

Document fallbacks where browser support differs.

---

## Interoperability

Only claim integrations that have a tested example.

Target examples:

```text
HTML
WordPress
Gutenberg
Elementor
PHP templates
Tailwind
React
Astro
Vue
Svelte
```

WordPress is high priority.

At minimum, produce tested examples for:

- Gutenberg;
- Elementor custom attributes;
- PHP templates.

The public API should remain the same as plain HTML.

---

## Distribution

Installation commands must be real.

If documentation says:

```bash
pnpm add @velora/css
```

it must work from a clean project.

Otherwise clearly mark the package as unpublished or coming soon.

Also support or evaluate a zero-build distribution:

```html
<link rel="stylesheet" href="./velora.min.css">
```

or a CDN delivery mechanism.

---

## Package Metadata

Audit and keep accurate:

```json
{
  "name": "@velora/css",
  "version": "...",
  "homepage": "...",
  "repository": "..."
}
```

Do not reference inactive organizations, URLs, or package destinations.

When canonical, repository metadata should use:

```text
Description:
Velora CSS — Declarative motion for modern HTML and CSS.

Homepage:
https://veloracss.io
```

---

## Tests

Strengthen automated coverage for:

```text
Chromium
Firefox
WebKit
```

Important scenarios:

```text
static fallback
reduced motion
scroll timelines
view transitions
stagger
attribute composition
invalid combinations
unsupported primitives
content visibility
keyboard/focus integrity
```

Use visual regression where appropriate.

---

## Accessibility

The showcase and examples must demonstrate:

- reduced motion;
- keyboard navigation;
- visible focus;
- semantic HTML;
- content visible without animation;
- non-essential motion;
- accessible controls;
- no essential information conveyed only through motion.

---

## Priority Order

### P0.1 — Current-State Audit

Inspect:

```text
packages/css
apps/showcase
apps/docs
docs
examples
experiments
tests
README.md
package.json
AGENTS.md
```

Create:

```text
docs/audits/showcase-readiness-2026.md
```

Include:

```text
1. Current architecture
2. Existing public attributes
3. Existing presets
4. Existing CSS primitives
5. Existing experimental features
6. Existing fallbacks
7. Existing tests
8. Existing showcase-only behavior
9. Documentation inconsistencies
10. Package/distribution inconsistencies
11. Browser compatibility risks
12. Accessibility risks
13. Marketing claim risks
14. Recommended P0 changes
15. Recommended implementation order
```

Do not begin large feature work before this audit is complete.

### P0.2 — Canonical Attribute Grammar

Define public `vl-*` contracts.

### P0.3 — Canonical Motion Catalog

Create the single source of truth.

### P0.4 — Showcase Architecture

Prepare `apps/showcase` for:

```text
Homepage
Motion Lab
Compatibility
Docs links
Playground
Benchmarks
Integration examples
```

### P0.5 — Motion Lab

Every public preset must be inspectable and reproducible.

### P0.6 — Compatibility

Document stable / enhancement / experimental status per feature.

### P0.7 — Reduced Motion

Validate public effects.

### P0.8 — Browser Tests

Automate Chromium / Firefox / WebKit coverage.

### P1.1 — Playground

Build after grammar and catalog stabilization.

### P1.2 — Benchmarks

Produce reproducible evidence.

### P1.3 — WordPress Integration

Add Gutenberg, Elementor and PHP examples.

### P1.4 — Package / npm / CDN

Make distribution real and reproducible.

### P1.5 — Public Documentation

Synchronize docs with canonical sources.

---

## Definition of Done — Public Feature

A feature is public only when:

- [ ] public API exists;
- [ ] API contract is documented;
- [ ] implementation exists in Velora;
- [ ] showcase uses the same public API;
- [ ] fallback is defined;
- [ ] reduced-motion behavior is defined;
- [ ] browser requirements are documented;
- [ ] test coverage exists or limitation is documented;
- [ ] no showcase-only JavaScript is required to fake it;
- [ ] the example can be copied into an external project;
- [ ] status is defined.

---

## Definition of Done — Marketing Claim

A public claim is allowed only if at least one is true:

- [ ] generated from source data;
- [ ] verified by automated tests;
- [ ] measured by a reproducible benchmark;
- [ ] directly observable in the public showcase;
- [ ] clearly labeled experimental or aspirational.

---

## Agent Working Rules

Before changing code:

1. inspect existing implementation;
2. identify duplication;
3. identify the canonical source;
4. avoid parallel APIs;
5. avoid showcase-only hacks;
6. preserve backward compatibility when reasonable;
7. document breaking changes;
8. prefer progressive enhancement;
9. prefer browser-native primitives;
10. keep the baseline usable.

When discovering a gap:

```text
Do not hide it.
Document it.
Classify it.
Fix it in Velora first.
```

---

## Guiding Principles

### Browser First
Use native browser primitives before recreating them with runtime code.

### Declarative Over Imperative
Describe motion intent instead of scripting timelines when practical.

### Progressive Enhancement
Motion is enhancement. Content and interaction remain functional.

### Host Agnostic
Velora must not require ownership of the UI framework.

### Explicit Escape Hatches
Programmatic problems may remain programmatic.

### Observable Truth
If Velora claims it, the showcase must prove it.

### No Fake Features
If the showcase needs to fake it, it is not a Velora feature yet.

---

## Immediate First Task

Start by auditing the current repository and producing:

```text
docs/audits/showcase-readiness-2026.md
```

Do not begin by editing the Latinoware presentation.

The main product is the source of truth.
