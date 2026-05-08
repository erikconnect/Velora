# Vision

Velora is a declarative motion runtime for the browser, built entirely in CSS.

It is not a utility framework. It is not a component library. It is a motion language — a structured grammar that lets HTML describe intent and CSS execute it. No JavaScript animation libraries. No runtime overhead. No framework bindings. Just the platform.

## The thesis

Motion on the web has been outsourced to JavaScript for over a decade. GSAP, Framer Motion, Anime.js, Lottie — each added a layer of abstraction between the developer and the browser's own compositing pipeline. In 2020, this was a reasonable trade-off. The CSS specification lacked the primitives to express scroll-linked choreography, view-aware entrances, and page-level transitions.

That era is over.

Modern browsers ship with scroll-driven animations, view timelines, the View Transitions API, `@starting-style`, `interpolate-size`, container queries, CSS nesting, and a cascade model sophisticated enough to orchestrate cinematic motion without a single line of JavaScript. The rendering engine already runs animations on the compositor thread. The GPU already composites transforms and opacity at 60fps. The main thread never needs to be involved.

Velora exists because the specification caught up — and nobody built the bridge.

## What Velora is

Velora is a CSS-first design system that provides:

- A **declarative attribute grammar** (`vl-effect`, `vl-enter`, `vl-scroll`, `vl-timeline`, `vl-scene`, and others) that maps motion intent to native CSS animation primitives.
- An **8-layer cascade architecture** (`@layer velora.reset` through `velora.overrides`) that eliminates specificity conflicts across tokens, layout, motion, components, and transitions.
- A **motion channel system** (base, enter, scroll, loop, hover, state, exit) that composes animation behaviors in a deterministic, non-conflicting order.
- **Scene presets** (cinematic-hero, sticky-story, glass-bento, product-reveal, editorial-cinema) that provide production-ready layout and choreography for common interface surfaces.
- **View transition presets** for multi-page applications, powered by the View Transitions API with zero JavaScript.
- A **token system** built on `oklch()` color space with automatic light/dark theming.

Zero JavaScript. Zero runtime. Zero bundle cost for motion.

## Who it is for

Velora is built for developers, design engineers, and agencies who:

- Ship production interfaces where performance is non-negotiable.
- Refuse to add 40KB+ of JavaScript to make a card fade in.
- Want motion that is native to the browser, not bolted on after the fact.
- Build multi-page applications and need transitions between pages, not just within them.
- Need a system that works with any stack — static HTML, Astro, Hugo, Rails, Django, or anything that outputs HTML and CSS.

Velora does not require a build step. It does not require a framework. It does not require Node.js. It ships as a CSS package that you import and use.

## Why now

Three platform-level shifts converged to make Velora possible:

1. **Scroll-driven animations** landed in Chrome 115+ and Safari 18+. Elements can now animate in response to scroll position using `animation-timeline: view()` and `animation-timeline: scroll()` — entirely in CSS.

2. **The View Transitions API** shipped with same-document support in Chrome 111 and cross-document (MPA) support in Chrome 126. Page-level transitions no longer require client-side routing or framework middleware.

3. **The modern cascade** — `@layer`, CSS nesting, `:has()`, container queries, `@starting-style` — gives CSS the organizational power that previously required preprocessors, utility frameworks, or JavaScript state management.

These are not experimental features. They are stable, shipping, and increasingly baseline across Chrome 124+, Safari 18+, and Firefox 128+.

Velora is the system that turns these raw platform capabilities into a coherent, declarative motion language.

## What Velora is not

- **Not a utility framework.** Velora does not generate classes from a config file. It provides a semantic attribute grammar where HTML describes motion intent.
- **Not a JavaScript library.** There is no runtime. There is no `import { animate } from 'velora'`. The entire motion system is resolved by the browser's CSS engine.
- **Not a replacement for design systems.** Velora is a motion and presentation layer. It composes with your design tokens, your component library, your layout system.
- **Not a tutorial project.** Velora is production infrastructure. The API surface is deliberate. The cascade architecture is engineered. The defaults are opinionated.

## The long view

The web platform is moving toward a model where the browser handles presentation — layout, animation, transitions, responsive behavior — and application code handles logic. This is the correct separation of concerns.

Velora accelerates this shift. Every animation it provides runs on the compositor thread. Every transition it orchestrates is GPU-composited by default. Every effect it offers has zero main-thread cost.

The question is not whether CSS will replace JavaScript animation libraries. The question is when.

Velora is the bridge.
