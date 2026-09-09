# No JavaScript Motion Manifesto

Velora's canonical **motion engine ships without a JavaScript animation runtime**.

That statement is intentionally narrower than "Velora never uses JavaScript." JavaScript remains essential for many application concerns. Velora's product position is that animation and presentation should not default to JavaScript when modern HTML, CSS, and browser-native APIs can already express the required behavior robustly.

## The argument

For many years, rich web motion depended on JavaScript because CSS lacked primitives for scroll-linked choreography, page continuity, intrinsic-size transitions, relational state, and sophisticated lifecycle animation.

The web platform has changed substantially. Modern browsers now expose primitives that cover a large part of the motion work that used to require animation libraries.

Velora turns those capabilities into a coherent declarative authoring contract.

## The rule

Before adding JavaScript for motion, ask:

1. Can semantic HTML model the state or interaction?
2. Can CSS transitions or animations express the visual change?
3. Can scroll/view timelines drive progression?
4. Can View Transitions provide page or shared-element continuity?
5. Can `:has()`, native top-layer elements, `@starting-style`, discrete transitions, `interpolate-size`, container queries, or typed attributes solve the problem?
6. Can the experience degrade gracefully if the advanced primitive is unavailable?

Only after those paths are exhausted should runtime JavaScript be considered.

## What stays JavaScript-free in core

The canonical Velora motion engine must not depend on:

- GSAP;
- Framer Motion;
- Anime.js;
- Locomotive Scroll;
- ScrollMagic;
- a custom `requestAnimationFrame` scheduler;
- a runtime parser that interprets `vl-*` animation attributes in the browser;
- client-side routing introduced only to obtain page transitions.

The default motion path is:

```text
HTML intent
  ↓
Velora CSS contract
  ↓
Native browser motion primitives
  ↓
Browser style/layout/compositor pipeline
```

## Platform primitives Velora should exploit

### View Transitions

Cross-document and same-document View Transitions can provide page continuity and shared-element handoffs without requiring a JavaScript animation router for the transition itself.

```css
@view-transition {
  navigation: auto;
}
```

### Scroll-driven animations

`animation-timeline: view()` and `animation-timeline: scroll()` let the browser bind progress directly to visibility or scroll position.

```css
[vl-scroll="parallax"] {
  animation-timeline: view(block);
}
```

### `@starting-style`

Useful for entry transitions where an element receives its first rendered style or moves from a discrete hidden state into visibility.

### Intrinsic-size interpolation

`interpolate-size` and related sizing capabilities reduce the need to measure content height in JavaScript for common expand/collapse motion.

### Native top-layer and semantic elements

`dialog`, popovers, `details`/`summary`, form controls, links, and other native elements often provide state and accessibility semantics that custom JavaScript implementations otherwise have to recreate.

### `@layer`

Velora's named cascade layers keep reset, tokens, layout, motion, components, transitions, utilities, and overrides deterministic.

### Container queries and relational selectors

Container queries and `:has()` allow a large class of responsive and interaction-aware behavior to remain declarative.

## Why this matters

### Less browser runtime code

Avoiding an animation runtime means there is no animation library to initialize, schedule, coordinate, or clean up on the main JavaScript thread.

### Intent stays close to markup

A developer can inspect:

```html
<article vl-enter="fade-up" vl-scroll="parallax" vl-hover="hover-lift">
```

and understand the motion contract without tracing event listeners or timeline construction code.

### Better separation of concerns

Velora's target boundary is:

- HTML: semantics and declared intent;
- CSS/browser: presentation, layout, motion, transitions;
- JavaScript: application logic and behavior that genuinely requires scripting.

This is a product boundary, not an ideological ban.

## Where JavaScript is valid

JavaScript is appropriate for:

- data fetching and mutation;
- business logic;
- complex application state;
- integrations and APIs;
- interaction coordination the platform cannot currently express robustly;
- accessibility behaviors that genuinely require scripting;
- build-time tools, validators, compilers, and development automation.

If Velora later ships optional runtime enhancement modules, they must be clearly separated from the canonical CSS motion engine and must justify why the browser-native path is insufficient.

## Progressive enhancement

Velora motion must never become a prerequisite for understanding or operating the interface.

A page should still:

- render meaningful content without advanced motion support;
- navigate without View Transitions support;
- respect `prefers-reduced-motion`;
- preserve semantic interaction when visual enhancement is unavailable.

## The product position

Velora is not trying to prove that CSS can replace all JavaScript.

It is proving something more practical:

> **A large amount of modern interface motion no longer needs a JavaScript animation runtime.**

Use the browser for what the browser is already good at. Keep JavaScript available for the work that actually belongs to application code.
