# Vision

Velora is a browser-first frontend motion platform built around a declarative HTML contract and modern CSS.

It is not a utility framework, not a page builder, and not a programming language. Velora provides a structured grammar that lets HTML describe interface and motion intent while CSS and browser-native capabilities execute as much of that intent as possible.

JavaScript is not the enemy and Velora does not try to remove it from web development. The product principle is narrower and more useful: **do not use JavaScript for presentation work the browser can already perform well with HTML and CSS.** Application logic remains application logic. The canonical Velora motion engine remains CSS-native and does not depend on a JavaScript animation runtime.

## The thesis

For years, rich web motion was commonly delegated to JavaScript because the platform lacked primitives for scroll-linked choreography, view-aware entrances, intrinsic-size transitions, top-layer UI lifecycle, and page continuity.

The platform has changed.

Modern browsers now provide scroll-driven animations, view timelines, the View Transitions API, `@starting-style`, discrete transitions, `interpolate-size`, container queries, relational selectors such as `:has()`, and a cascade model capable of organizing sophisticated motion systems.

Velora exists to turn those raw browser capabilities into an authoring model that developers, designers, and AI tools can all understand.

## Core promise

> **Cinematic motion with declarative control, powered by HTML, CSS, and the browser.**

Velora should make expressive interface motion easier to author, easier to discuss, easier to validate, and easier to maintain than equivalent imperative animation code for the class of interactions the web platform can already express natively.

## What Velora is

Velora is composed of:

- A **declarative attribute grammar** (`vl-enter`, `vl-scroll`, `vl-hover`, `vl-state`, `vl-scene`, `vl-timeline`, and related attributes) that describes motion intent in HTML.
- A **CSS-native motion engine** that maps that intent to browser primitives.
- A **motion channel system** that composes base, enter, scroll, loop, hover, state, and exit behavior predictably.
- A **scene system** for shared clocks, staged choreography, pinning, scrub, and cinematic composition.
- **View transition primitives** for page continuity and shared-element handoff where browser support allows it.
- A **token and layer architecture** that keeps motion, layout, themes, and overrides deterministic.
- Optional **build-time tooling** for validation, reporting, and static generation without adding a browser animation runtime.
- Documentation, starters, and a curated showcase that prove the contract in real interfaces.

## Who it is for

Velora is primarily for:

- frontend developers and design engineers;
- designers who work closely with implementation teams;
- agencies and product teams building premium interfaces;
- AI-assisted development workflows that benefit from explicit, machine-readable intent.

The contract is written for humans first. Its structure should make it naturally useful to machines as well.

## Why the authoring model matters

A designer should be able to communicate a scene in terms of intent:

> “Reveal the headline first, let the image gain depth with scroll, and keep the CTA calm.”

A developer should be able to map that intent to a compact Velora contract rather than building a custom animation script from scratch.

```html
<section vl-scene vl-timeline="view" vl-pin="3" vl-scrub>
  <div vl-stage>
    <h1 vl-enter="clip-rise" vl-act="1">Headline</h1>
    <img vl-scroll="media-zoom" vl-act="2" vl-span="2" alt="">
    <a vl-hover="hover-lift" href="/work">View work</a>
  </div>
</section>
```

The markup expresses the choreography. Velora's CSS maps it to platform capabilities. The browser performs the presentation.

## JavaScript policy

Velora follows a **minimum necessary JavaScript** policy.

### The canonical motion path

- no GSAP, Framer Motion, Anime.js, Locomotive Scroll, or equivalent dependency in core;
- no runtime parser required to interpret `vl-*` motion attributes;
- no JavaScript scheduler for scroll-driven or timeline motion when CSS can provide the behavior;
- no client-side router required solely to obtain page transitions where native View Transitions can provide them.

### JavaScript remains appropriate for

- application logic and data;
- complex state coordination;
- integrations with external systems;
- interactions that current native primitives cannot express robustly;
- accessibility behavior that genuinely requires scripting;
- optional tooling and build-time compilation.

When JavaScript is needed, it should be explicit, isolated, and justified. It must not silently become the default engine for Velora motion.

## Product principles

1. **Browser-native first** — use the platform before adding a runtime abstraction.
2. **Declarative before imperative** — HTML communicates intent; CSS executes presentation.
3. **Minimum necessary JavaScript** — JavaScript is an escalation path, not the default motion layer.
4. **Motion is structural** — motion communicates hierarchy, causality, continuity, and state.
5. **Progressive enhancement** — content and essential interaction remain usable without advanced motion.
6. **Accessibility is part of the contract** — reduced motion, focus, semantics, and fallbacks are non-optional.
7. **Human-readable and machine-readable** — the same contract should work for designers, developers, and AI-assisted tooling.
8. **Production output stays understandable** — no opaque abstraction may hide the relationship between source intent and browser behavior.

## What Velora is not

- **Not a programming language.** The `vl-*` grammar is a declarative interface contract, not a general-purpose language.
- **Not a page builder.** A future visual authoring surface may produce Velora markup, but it does not define the product.
- **Not a JavaScript replacement.** Velora reduces unnecessary presentation JavaScript; it does not remove application logic from the web.
- **Not a JS animation wrapper.** Core value comes from native browser execution.
- **Not a framework-specific component system.** Velora should compose with any stack that outputs HTML and CSS.
- **Not primarily a utility framework.** Its differentiator is declarative motion, scenes, transitions, and browser-native composition.

## The long view

The browser is increasingly capable of owning presentation concerns directly: layout, responsive behavior, animation, state transitions, scroll-linked progression, and page continuity.

Velora's opportunity is not to prove that JavaScript is bad. It is to make the boundary clearer:

> **Use HTML and CSS to their real limits. Use JavaScript where it adds actual application capability.**

If Velora succeeds, a designer can describe motion in an understandable vocabulary, a developer can implement it with a small declarative contract, an AI agent can validate or generate the same contract, and the browser can execute most of the result without an animation runtime.

That is the bridge Velora is building.
