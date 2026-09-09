# Philosophy

Every decision in Velora traces back to a small set of product principles. These are constraints, not slogans. When a feature request, experiment, or implementation conflicts with them, the principles win.

## Browser-first

The browser is the primary presentation runtime.

Velora builds on what the platform already provides: semantic HTML, the cascade, CSS animations, scroll and view timelines, View Transitions, container queries, `:has()`, native top-layer elements, intrinsic-size interpolation, and progressive enhancement.

If the browser already exposes the primitive, Velora should use it directly before adding a custom runtime abstraction.

**In practice:** scroll-linked motion uses CSS timelines, page continuity uses native View Transitions where available, state uses semantic HTML and CSS selectors, and motion remains inspectable in DevTools.

## Declarative before imperative

HTML should describe what should happen. CSS should determine how presentation happens.

```html
<article vl-enter="fade-up" vl-scroll="parallax" vl-hover="hover-lift">
```

This markup communicates intent without requiring the reader to reverse-engineer a callback, timeline object, or event handler.

Declarative systems are easier for developers to read, for designers to discuss, and for AI tooling to validate because intent is explicit.

**In practice:** canonical motion behavior is expressed through `vl-*` attributes, CSS custom properties, and native CSS state.

## Minimum necessary JavaScript

Velora does not treat JavaScript as forbidden. It treats unnecessary presentation JavaScript as a design smell.

The core question is:

> Can HTML, CSS, and the browser already solve this robustly?

If yes, use the platform. If no, and the feature genuinely requires application logic, data, state coordination, or behavior beyond current browser primitives, JavaScript is appropriate.

The canonical Velora motion engine does not depend on a JavaScript animation runtime.

**In practice:** no GSAP, Framer Motion, Anime.js, Locomotive Scroll, or equivalent animation scheduler in core. Build-time tooling may use JavaScript. Application code may use JavaScript. Optional enhancements may use JavaScript when clearly justified.

## Progressive enhancement

A Velora-powered interface must preserve content and essential interaction even when advanced motion is unavailable.

This includes:

1. **Baseline functionality.** Unsupported motion features must not make content inaccessible or navigation unusable.
2. **Reduced motion.** `prefers-reduced-motion` is part of the contract, not an afterthought.
3. **Native-first state.** Prefer semantic elements such as `details`, `dialog`, `popover`, links, and form controls when they already model the interaction.

Motion enhances understanding and continuity. It must not gate access to the interface.

## Composition over configuration

Velora's motion model is built from small, independent channels that compose predictably:

```text
base → enter → scroll → loop → hover → state → exit
```

```html
<section
  vl-enter="flow-in"
  vl-scroll="depth-drift"
  vl-loop="glow-breathe"
  vl-hover="hover-lift"
  vl-exit="fade-out">
```

Each declaration communicates one dimension of behavior. Add, remove, or change one without rewriting the entire choreography.

This is preferable to a monolithic configuration object or a custom script that mixes trigger, timing, state, and visual effect in one place.

## Motion is structural

Motion is part of interface architecture, not decoration added after layout.

It communicates:

- hierarchy;
- sequence;
- causality;
- continuity;
- focus;
- state change;
- spatial relationships.

Velora should therefore design scenes and transitions together with layout and content structure.

## Human-readable and machine-readable

Velora sits between design intent and browser execution.

The same contract should be understandable by:

- a designer describing the desired feeling and progression;
- a developer implementing the scene;
- an AI agent generating, reviewing, or validating markup;
- tooling enforcing the contract.

This does not mean making the API verbose. It means making semantics explicit, finite, and stable.

## Production code remains understandable

Velora must not hide essential behavior behind opaque abstractions.

If tooling generates CSS, the generated output must have a traceable relationship to the markup. If a future authoring tool produces Velora code, that code must remain editable by a developer without the tool.

A system that is easy to generate but impossible to maintain manually has failed the product promise.

## The sum

These principles reinforce one another:

- browser-first encourages declarative authoring;
- declarative authoring makes the contract easier to share between design, development, and AI;
- minimum necessary JavaScript keeps presentation close to the platform;
- progressive enhancement protects accessibility and compatibility;
- composition keeps the API scalable;
- understandable output keeps Velora suitable for real production work.

Velora is not about proving CSS can do everything.

Velora is about using HTML and CSS to their actual modern limits, then adding JavaScript only where it contributes real application capability.
