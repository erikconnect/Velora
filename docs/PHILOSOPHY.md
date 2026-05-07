# Philosophy

Every decision in Velora traces back to a small set of principles. These are not aspirations — they are constraints. When a feature request, a new effect, or a structural change conflicts with these principles, the principles win.

## Browser-first

The browser is the runtime. Not a transpiler. Not a virtual DOM. Not a JavaScript animation scheduler polling `requestAnimationFrame`.

Velora builds on what the browser already does natively: CSS animations, scroll timelines, view transitions, container queries, the cascade. If the browser provides a primitive, Velora uses it directly. If the browser does not provide a primitive, Velora does not polyfill it — it waits, or it finds a CSS-only path.

This is not a philosophical preference. It is a performance decision. The browser's compositor thread handles CSS animations off the main thread. GPU-composited transforms and opacity changes run at the hardware level. No JavaScript scheduler can match this pipeline. None should try.

**In practice:** Velora has zero JavaScript files in its motion system. Scroll-driven animations use `animation-timeline: view()`. Page transitions use `@view-transition { navigation: auto; }`. Hover states use `:hover`. Focus states use `:focus-visible`. The browser is the engine. Velora is the grammar.

## Declarative

HTML describes what should happen. CSS determines how it happens. The developer never writes imperative animation code.

```html
<article vl-enter="fade-up" vl-scroll="parallax" vl-hover="hover-lift">
```

This markup carries full motion intent: the element fades up on entry, shifts with parallax on scroll, and lifts on hover. The developer declared the behavior. The browser executes it. There is no `onScroll` handler. No intersection observer callback. No animation library initialization.

Declarative systems are easier to read, easier to maintain, and easier to reason about. They separate intent from implementation. They compose without side effects. They degrade gracefully — remove the CSS, and the HTML still works.

**In practice:** Every motion behavior in Velora is expressed through HTML attributes (`vl-enter`, `vl-scroll`, `vl-loop`, `vl-hover`, `vl-exit`, `vl-state`, `vl-scene`, `vl-timeline`) and CSS custom properties (`--vl-ease-cinematic`, `--vl-duration-slow`, `--vl-stagger-step`). No event listeners. No callbacks. No JavaScript glue.

## Zero runtime

Velora adds zero bytes of JavaScript to your application's motion layer. This is not a soft goal — it is a hard constraint.

Animation libraries carry weight: initialization code, event listeners, resize observers, scroll handlers, easing functions, timeline schedulers, cleanup logic. That weight lives on the main thread. It competes with your application logic, your data fetching, your rendering pipeline.

Velora moves all of this to the CSS engine. The browser's compositor handles timing. The GPU handles transforms. The cascade handles specificity. The cost of Velora's motion system to your JavaScript budget is zero.

**In practice:** `@velora/css` ships as CSS files. The entire motion grammar — keyframes, attribute selectors, timeline bindings, scene presets, view transitions — resolves at the CSS level. Your bundle analyzer will never show Velora in the JavaScript column.

## Progressive enhancement

A Velora-powered page works without Velora. Content is accessible, readable, and functional without CSS motion. Velora enhances — it does not gate.

This principle has two dimensions:

1. **Baseline functionality.** If a browser does not support scroll-driven animations, the content still renders. Velora includes `@supports` fallbacks that degrade scroll-linked motion to time-based animation. If a browser does not support view transitions, pages still navigate normally.

2. **Reduced motion.** Every animation in Velora respects `prefers-reduced-motion: reduce`. When a user has requested reduced motion, animations resolve instantly, opacity is set to 1, transforms are removed, and filters are cleared. This is not optional — it is built into every layer of the system.

**In practice:** The motion layer (`03-motion.css`) includes a comprehensive `@media (prefers-reduced-motion: reduce)` block that disables all effects, all scene animations, all scroll-driven behaviors, and all view transitions. The transitions layer (`05-transitions.css`) reduces all view transition durations to 120ms with linear timing. The fallback block (`@supports not (animation-timeline: view())`) ensures scroll-driven effects degrade to time-based animation on browsers without full support.

## Composition over configuration

Velora's motion system is not configured — it is composed. Motion channels stack in a deterministic order: base, enter, scroll, loop, hover, state, exit. Each channel is independent. Each is optional. Combining them produces complex behavior from simple, composable parts.

```html
<section
  vl-enter="flow-in"
  vl-scroll="depth-drift"
  vl-loop="glow-breathe"
  vl-hover="hover-lift"
  vl-exit="fade-out">
```

This is not a configuration object with 12 properties. It is five independent declarations that compose into a rich motion profile. Add one, remove one, change one — the others remain stable.

This model scales. A team of ten developers can use the same attribute grammar without coordination beyond knowing the channel names. A designer can read the markup and understand the motion intent without opening a JavaScript file.

**In practice:** The motion channel system uses CSS custom property scoping (`--vl-enter-name`, `--vl-scroll-name`, `--vl-loop-name`, etc.) to isolate each channel's animation properties. Channels do not interfere with each other. The cascade resolves them in layer order. Composition is structural, not accidental.

## The sum

These five principles — browser-first, declarative, zero runtime, progressive enhancement, composition over configuration — are not independent ideas. They reinforce each other.

A browser-first approach leads naturally to declarative markup, because CSS is declarative. Zero runtime is achievable because the browser handles the animation pipeline. Progressive enhancement is straightforward because CSS degrades gracefully by design. Composition works because the cascade provides deterministic resolution.

Velora is what happens when you take the browser seriously as an animation engine and build a grammar around it instead of around JavaScript.
