# Velora Product Foundation

**Status:** Product foundation decision  
**Date:** 2026-09-09  
**Purpose:** Define what Velora is before architecture and implementation decisions are made.

This document is the first decision layer for the project. Architecture should implement this foundation. Code should implement the architecture. When a lower layer conflicts with a higher layer, the higher layer wins.

## 1. Core promise

> **Cinematic motion with declarative control, powered by HTML, CSS, and the browser.**

Velora helps developers and designers create expressive, high-quality interface motion by describing intent in HTML and letting modern CSS and browser-native primitives do as much of the execution as possible.

The goal is not to remove JavaScript from the web. The goal is to avoid using JavaScript for work that HTML, CSS, and the browser can already perform well.

## 2. The problem Velora solves

Rich interface motion is often implemented as imperative JavaScript that is:

- expensive to write and maintain;
- difficult for designers to inspect or discuss directly;
- coupled to a specific framework or animation runtime;
- harder for AI tools to reason about because intent is hidden inside implementation code;
- frequently heavier than the interaction actually requires.

At the same time, modern CSS and native browser APIs can now express a large class of transitions, scroll-linked motion, state changes, top-layer UI, responsive behavior, and page continuity without an animation runtime.

Velora turns those capabilities into a coherent authoring model.

## 3. Who Velora is for

### Primary users

- Frontend developers and design engineers who want expressive motion without starting from imperative animation code.
- Designers who collaborate closely with developers and need a readable vocabulary for motion, hierarchy, rhythm, and scene behavior.

### Secondary users

- Agencies and product teams that need motion patterns to remain portable across stacks.
- AI coding/design agents that benefit from explicit, machine-readable interface intent.

AI is an important consumer of the Velora contract, but the contract must remain understandable to humans first.

## 4. Jobs to be done

Velora should let a user:

1. **Describe motion intent clearly in markup.**
   The HTML should communicate what a scene or element is expected to do without requiring the reader to reverse-engineer a script.

2. **Compose cinematic behavior from predictable primitives.**
   Entrance, scroll, hover, state, loop, exit, scene progression, and page continuity should compose without hidden side effects.

3. **Use the browser as the primary presentation engine.**
   Native HTML and CSS capabilities should be preferred before introducing runtime code.

4. **Keep the result inspectable and portable.**
   Velora output should remain normal HTML and CSS that can be understood, debugged, versioned, and used with different backend or frontend stacks.

5. **Create a shared conversation between design and development.**
   A designer should be able to describe the intended feeling and progression of a scene; a developer should be able to map that intent to a small, stable Velora contract.

## 5. Product principles

### 5.1 Browser-native first

Use platform primitives directly whenever they can satisfy the requirement with acceptable accessibility, compatibility, and maintainability.

### 5.2 Declarative before imperative

Prefer describing state and motion intent in HTML/CSS over procedural animation code.

### 5.3 Minimum necessary JavaScript

JavaScript is an escalation path, not the default motion engine.

Use JavaScript when it is genuinely required for application logic, data, complex state coordination, or an interaction that cannot be expressed robustly with current browser primitives. Keep such code optional, isolated, and outside the canonical CSS motion engine whenever possible.

Velora must not depend on a JavaScript animation framework in its core.

### 5.4 Motion is part of interface architecture

Motion is not decoration added after layout. It expresses hierarchy, continuity, causality, focus, and state change.

### 5.5 Human-readable and machine-readable

The contract must be concise enough for a developer to understand at a glance and explicit enough for tooling and AI to validate or generate safely.

### 5.6 Progressive enhancement

Content and essential interaction must remain usable when an advanced motion primitive is unavailable or when the user requests reduced motion.

### 5.7 Production code must remain understandable

Velora must not hide essential behavior behind opaque runtime abstractions. Generated or compiled output must have a traceable relationship to the source contract.

## 6. What Velora is

Velora is a **browser-first frontend motion platform** composed of:

- a declarative HTML attribute contract;
- a CSS-native motion and scene engine;
- design and motion tokens;
- browser-native transition and interaction primitives;
- optional build-time validation and compilation tooling;
- documentation, starters, and a showcase that prove the contract in real interfaces.

The word **grammar** may be used for the structured `vl-*` contract, but Velora is **not a programming language**.

## 7. What Velora is not

Velora is not:

- a programming language;
- a page builder;
- a JavaScript replacement;
- a React/Vue-specific component system;
- a wrapper around GSAP, Framer Motion, or another animation runtime;
- a generic utility framework whose value is primarily class generation;
- a showcase that invents behavior outside the framework contract.

A visual builder may be explored in the future as a product surface that **authors the Velora contract**. It must not become the definition of Velora itself.

## 8. The authoring promise

The ideal Velora workflow is:

```text
Design intent
    ↓
Scene and interaction description
    ↓
Readable vl-* attributes + semantic HTML
    ↓
Canonical Velora CSS contract
    ↓
Browser-native execution
```

A designer should be able to say:

> "This hero should feel dramatic, reveal the headline first, let the media gain depth through scroll, and keep the CTA calm and readable."

A developer should be able to translate that into a small set of declarative Velora primitives rather than an animation script.

The browser then executes the presentation using CSS-native capabilities wherever possible.

## 9. Product scope now

The current product should focus on proving one coherent path extremely well:

- `@velora/css` as the canonical engine;
- the stable `vl-*` contract;
- scenes and motion channels;
- native scroll-driven motion and View Transitions;
- an optional build-time compiler/validator where it reduces authoring cost without adding browser runtime;
- an official starter;
- documentation that teaches the contract;
- a curated showcase that proves real production use.

Do **not** expand into a visual builder or broad AI product until the core authoring contract is stable and demonstrably useful.

## 10. Success criteria

Velora is meaningfully "standing on its feet" when all of the following are true:

1. **A real production project uses Velora.**
2. **A flagship demo communicates the value immediately.**
3. **A frontend developer can understand the core model quickly and create useful motion without first writing an animation script.**
4. **A designer and developer can discuss a scene using the same intent vocabulary.**
5. **The canonical examples are simpler to reason about than equivalent imperative animation code.**
6. **The contract is validated automatically and does not drift between core, docs, and showcase.**

Proposed operational measurements:

- first useful motion within 5 minutes of the starter;
- one complete cinematic scene within 15 minutes for a developer familiar with HTML/CSS;
- `pnpm verify:contract` green in CI;
- zero undocumented stable `vl-*` attributes;
- at least one documented real-world case study before calling the public product mature.

## 11. Decision order

For every significant feature, use this order:

1. **Product:** What user problem does this solve, and does it strengthen the core promise?
2. **Authoring contract:** How should a human describe the intent?
3. **Architecture:** Which Velora layer owns the behavior?
4. **Platform capability:** Can HTML/CSS/browser-native APIs execute it robustly?
5. **Implementation:** What is the smallest clean implementation?
6. **Validation:** How do we prove the contract, accessibility, fallback, and output?
7. **Showcase:** How do we demonstrate it without inventing a parallel API?

Code is intentionally late in this sequence.

## 12. Product filter for new ideas

Before accepting a new feature, answer **yes** to the relevant questions:

- Does it help express or execute interface intent more clearly?
- Is it broadly reusable rather than a one-page effect?
- Can it fit the existing contract without creating a competing abstraction?
- Is native HTML/CSS the best first implementation path?
- If JavaScript is required, is it truly necessary and isolated?
- Can the behavior degrade accessibly?
- Can a designer, developer, and AI agent all understand the resulting contract?
- Can it be demonstrated in a real interface rather than only as a technical trick?

If the answers are weak, the feature should remain an experiment rather than enter the core.
