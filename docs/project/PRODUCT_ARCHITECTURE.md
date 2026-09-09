# Velora Product Architecture

**Status:** Architecture proposal derived from `PRODUCT_FOUNDATION.md`  
**Date:** 2026-09-09

Velora architecture exists to protect the product promise. It should make the declarative authoring experience simpler, keep browser execution native, and prevent showcase, tooling, or future product surfaces from becoming competing sources of truth.

## 1. Architecture rule

> **Product foundation → authoring contract → engine → tooling → product surfaces → examples.**

Dependencies should flow in that direction. A lower layer must not redefine a higher layer.

```text
PRODUCT FOUNDATION
       ↓
AUTHORING CONTRACT
       ↓
CANONICAL ENGINE
       ↓
BUILD-TIME TOOLING
       ↓
DOCS / STARTERS / SHOWCASE
       ↓
REAL PROJECTS + CASE STUDIES
```

## 2. Layer 0 — Product foundation

**Owner:** `docs/project/PRODUCT_FOUNDATION.md`

Defines:

- the problem;
- primary users;
- product promise;
- product principles;
- JavaScript policy;
- non-goals;
- success criteria.

This layer changes rarely. Technical implementation must not silently change product meaning.

## 3. Layer 1 — Authoring contract

**Owners:**

- `docs/project/CONTRACT.md`
- `docs/project/MOTION_LANGUAGE.md` (motion grammar/reference)
- `docs/project/SCENE_SYSTEM.md`
- framework implementation in `packages/css/src/**`

This layer answers:

> "How does a human express intent with Velora?"

It includes:

- stable `vl-*` attributes;
- allowed values;
- motion channels;
- scene timing and choreography;
- tokens and custom properties;
- semantics for transitions and state;
- deprecation rules.

The contract must remain declarative and inspectable. New behavior enters Velora only after its authoring model is defined.

### Contract invariant

A `vl-*` feature is not official until:

1. its purpose is clear;
2. its authoring syntax is documented;
3. the canonical engine implements it;
4. contract validation knows it;
5. docs explain it;
6. showcase demonstrates it.

## 4. Layer 2 — Canonical browser engine

**Primary owner:** `packages/css/src/**`

This is the production engine that turns the authoring contract into browser behavior.

Responsibilities:

- reset and platform defaults;
- tokens;
- layout primitives required by the engine;
- motion channels;
- scene timing/choreography;
- native state transitions;
- View Transitions;
- accessibility and reduced-motion behavior;
- optional visual/theme layers where explicitly separated from host-agnostic motion.

### Engine constraints

- Prefer modern HTML/CSS/browser primitives.
- Core motion must not depend on a JavaScript animation runtime.
- Keep behavior host-agnostic where practical.
- Keep CSS inside the canonical `@layer velora.*` contract.
- Keep API behavior out of showcase-only CSS.
- Avoid a second implementation of the same semantic behavior.

## 5. Layer 3 — Build-time tooling

**Current candidate:** `packages/compiler/`

Build-time tooling exists to make the contract easier and safer to author, not to become a browser runtime.

Possible responsibilities:

- scan HTML-like files;
- extract `vl-*` usage;
- validate contract compliance;
- detect deprecated or unknown values;
- validate anchors and scene structure where appropriate;
- parse compact syntax;
- generate static CSS when generation provides clear value;
- produce reports for humans and CI.

### Compiler boundary

The compiler may understand the contract, but it does not own the contract.

The compiler must not introduce a `vl-*` behavior that is absent from the canonical contract and engine.

Generated output must be traceable to source markup and should remain ordinary CSS.

## 6. Layer 4 — Product surfaces

### 6.1 Framework package

**Path:** `packages/css/`

Purpose:

- distributable Velora engine;
- stable modular imports;
- canonical production behavior.

This is the primary technical product surface.

### 6.2 Starter

**Path:** `starters/`

Purpose:

- shortest path from zero to a working Velora page;
- canonical minimal integration;
- proof that the contract works without showcase-specific infrastructure.

### 6.3 Documentation

**Paths:**

- `docs/project/` — versioned product, contract, and governance source;
- `apps/docs/` — navigable public documentation.

Purpose:

- teach how to use Velora correctly;
- explain why the contract works;
- distinguish stable API from experiments.

Docs do not invent behavior.

### 6.4 Showcase

**Path:** `apps/showcase/`

Purpose:

- prove the result visually;
- demonstrate cinematic composition;
- show complete scenes and real interface patterns;
- provide reference catalogs that reflect the contract.

The showcase answers **"what can this become?"**, not **"what is the API?"**.

### 6.5 Experiments

**Paths:** `experiments/` and other explicitly experimental areas.

Purpose:

- test new platform primitives;
- explore syntax;
- compare approaches;
- gather evidence before contract admission.

Experiments are not product promises.

## 7. Layer 5 — Real projects and evidence

Velora needs external proof, not only internal demos.

A real integration should validate:

- authoring speed;
- readability;
- compatibility with a host stack;
- accessibility;
- fallback behavior;
- performance;
- maintainability after initial implementation.

Findings from real projects should influence the product foundation and contract before they influence feature volume.

## 8. Authoring-to-execution flow

The primary execution path should be understandable without knowing repository internals:

```text
Semantic HTML
+ Velora intent attributes
+ host design/layout
        ↓
@velora/css
        ↓
Native CSS primitives
        ↓
Browser layout / style / compositor
```

Optional build-time path:

```text
Semantic HTML + vl-* contract
        ↓
Velora compiler / validator
        ↓
Validation + optional generated CSS
        ↓
@velora/css + generated static CSS
        ↓
Browser
```

Optional JavaScript enhancement path:

```text
Native path reaches a genuine platform limit
        ↓
Small isolated enhancement
        ↓
Application/runtime logic only where necessary
```

JavaScript must not become the hidden default execution path for the motion contract.

## 9. Designer–developer–AI architecture

Velora should expose one shared contract to three consumers:

```text
Designer intent
      ↘
       Velora authoring contract → Browser
      ↗
Developer implementation
      ↑
AI-assisted generation / validation
```

This means the API should optimize for:

- semantic names over implementation leaks;
- predictable composition;
- finite documented values;
- explicit defaults;
- strong validation;
- accessible fallbacks;
- stable examples.

AI should not require a hidden parallel schema if the public contract is already sufficiently structured.

## 10. Feature admission pipeline

A feature moves through these states:

```text
idea
  ↓
product problem
  ↓
experiment
  ↓
authoring proposal
  ↓
architecture decision
  ↓
core implementation
  ↓
contract validation
  ↓
documentation
  ↓
showcase proof
  ↓
stable
```

Do not jump directly from **idea** to **core implementation**.

## 11. JavaScript escalation policy

Before introducing runtime JavaScript, ask in order:

1. Can semantic HTML express the state?
2. Can CSS express the visual/state transition?
3. Can a native element (`details`, `dialog`, `popover`, form controls, links) provide the interaction?
4. Can `:has()`, container queries, scroll/view timelines, View Transitions, `@starting-style`, discrete transitions, or other stable platform primitives solve it?
5. Can progressive enhancement leave a functional baseline without the enhancement?
6. Is JavaScript still necessary for application logic, data, coordination, or accessibility?

If yes to #6, use the smallest isolated enhancement and keep it outside the CSS engine contract unless a separate runtime product is deliberately approved.

## 12. Product boundary for the current phase

### In scope

- stable core motion contract;
- scenes and choreography;
- browser-native transitions;
- CSS-native interaction/state patterns;
- compiler/validator as build-time tooling;
- starter;
- docs;
- curated showcase;
- first real production adoption.

### Not in scope yet

- visual builder;
- proprietary authoring canvas;
- general-purpose application framework;
- runtime animation engine;
- React/Vue-only abstraction layer;
- AI system that invents APIs outside the contract.

## 13. Architecture health checks

The architecture is healthy when:

- one behavior has one canonical owner;
- core and contract agree;
- tooling consumes rather than redefines the contract;
- showcase CSS cannot silently become framework API;
- a starter can use Velora without importing showcase code;
- a real project can adopt `@velora/css` incrementally;
- browser-native execution remains visible in DevTools;
- JavaScript usage is explainable as a necessity rather than habit.
