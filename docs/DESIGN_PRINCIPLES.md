# Design Principles

Ten principles guide every decision in Velora — from keyframe authoring to API surface design to scene choreography. They are ordered by priority. When two principles conflict, the one listed first wins.

## 1. Cinematic over decorative

Motion in Velora serves narrative purpose. Every animation should feel like it belongs in a film edit, not a theme park. A fade-up carries the eye to content. A parallax shift creates spatial depth. A view transition is a scene cut.

Decorative motion — spinning logos, bouncing badges, gratuitous particle effects — has no place in Velora's vocabulary. If an animation does not clarify hierarchy, reveal content, or create meaningful spatial relationships, it does not ship.

The test: mute the animation. If the interface loses clarity, the motion was doing real work. If nothing changes, it was decoration.

## 2. Declarative over imperative

Developers describe intent. The browser executes it.

```html
<article vl-enter="flow-in" vl-scroll="depth-drift">
```

This markup says *what should happen*: enter with flow, drift with scroll. It does not say *how*: no `requestAnimationFrame`, no tween objects, no callback chains, no easing function imports.

Declarative systems are auditable. A designer can read the HTML and know the motion profile. A code reviewer can scan attributes and understand choreography. A CI pipeline can validate that only approved effects are used.

Imperative animation code is opaque by comparison. Intent is buried in function calls, configuration objects, and closure chains that only the original author can parse.

Velora chooses legibility.

## 3. Composition over configuration

Velora does not have a configuration API. There is no `velora.config.js`. There are no theme objects with nested motion properties.

Instead, motion is composed from independent, combinable attributes:

```html
<div
  vl-base="balanced"
  vl-enter="clip-rise"
  vl-scroll="parallax"
  vl-hover="hover-lift">
```

Each attribute is a self-contained behavior. Add one, remove one, swap one — the others remain stable. There are no hidden dependencies between channels. There are no global settings that silently change local behavior.

This model scales to teams. Ten developers can compose motion on ten different sections without coordination beyond knowing the attribute vocabulary. The grammar is the API. The documentation is the training.

## 4. Native over abstracted

Every Velora feature maps to a shipping browser capability. `vl-timeline="view"` sets `animation-timeline: view()`. `vl-pin` sets `position: sticky`. `vl-page-transition="cinema"` styles `::view-transition-old(root)` and `::view-transition-new(root)`.

There is no Velora-specific runtime. No virtual scroll observer. No custom intersection detection. No animation scheduler. The browser already has all of these — and they run on the compositor thread where JavaScript cannot reach.

When the platform introduces a new capability, Velora exposes it through the attribute grammar. When the platform deprecates a pattern, Velora removes it. The system stays thin — a translation layer between human intent and browser primitives.

## 5. Performance by default

Velora does not offer a "performance mode." Performance is the only mode.

Every keyframe in Velora is authored around compositor-friendly properties: `transform`, `opacity`, `filter`, `clip-path`. The browser promotes these to GPU-composited layers automatically. No `will-change` hints are needed for the common case (though Velora applies them selectively for expensive operations like scroll-driven animations and continuous loops).

The cost model is explicit:
- Zero JavaScript bundle cost for motion.
- Zero main thread cost for animation execution.
- Zero garbage collection pressure from animation logic.
- Automatic compositor promotion for transform and opacity changes.

A developer using Velora's default effects cannot accidentally create a janky animation. The system makes the performant path the only path.

## 6. Progressive disclosure

Velora's API surface has three tiers of complexity:

**Basic.** A single attribute produces a complete, production-ready effect.

```html
<div vl-enter="fade-up">
```

**Intermediate.** Multiple attributes compose richer behavior.

```html
<div vl-enter="fade-up" vl-timeline="view" vl-range="entry-long">
```

**Advanced.** Custom properties, scene composition, and range tuning provide full control.

```html
<section vl-scene>
  <div vl-enter="reveal-cinematic" vl-timeline="view"
       style="--vl-range: entry 8% cover 60%;">
```

A developer can be productive with Velora in five minutes using basic attributes. They can build cinematic interfaces after an hour with the scene system. They never need to learn the third tier unless they want to.

The learning curve is a ramp, not a cliff.

## 7. Rhythm and choreography

Individual animations are not enough. The difference between amateur and professional motion is *timing relationships* — how elements move relative to each other.

Velora provides choreography primitives:
- **Stagger** (`vl-children="stagger"`) — fixed delay between children.
- **Cascade** (`vl-children="cascade"`) — flowing reveal with escalating depth.
- **Sequence** (`vl-children="sequence"`) — each child waits for the previous to finish.
- **Orchestrate** (`vl-children="orchestrate"`) — alternating animation types with staggered timing.

Scene presets encode choreographic patterns: `cinematic-hero` staggers children at 160ms intervals. `glass-bento` tiles reveal with scroll-offset entry ranges. `editorial-cinema` content rises through clip-path masks at a measured pace.

Rhythm is not decorative. It communicates hierarchy. The first element to appear is the most important. The delay between elements encodes grouping. The direction of motion implies spatial relationships.

## 8. Depth and atmosphere

Flat interfaces are forgettable. Velora creates perceived depth through:

- **Perspective transforms** — `reveal-3d`, `tilt-in`, `depth-enter` use `perspective()` and `rotateX()`/`rotateY()` to simulate physical space.
- **Parallax layers** — `vl-scroll="parallax"` with `vl-depth` multipliers creates foreground/background separation driven by scroll.
- **Tonal elevation** — shadow tokens (`--vl-shadow-sm` through `--vl-shadow-dramatic`) and glass backgrounds (`backdrop-filter`) create surface hierarchy.
- **Atmospheric effects** — blur transitions (`blur-in`, `flow-in`), brightness shifts (`cinema-zoom`), and grain textures (`--vl-noise-opacity`) add environmental quality.

Depth is not about 3D gimmicks. It is about creating a spatial hierarchy that guides attention. Important content is closer. Supporting content recedes. Background elements move slower than foreground elements. The interface has a z-axis, even on a flat screen.

## 9. Typography as motion

Text is not static content that motion happens around. Text *is* motion. Headlines rise into frame. Pull quotes wipe across the viewport. Labels reveal character by character.

Velora provides typography-specific motion:
- `clip-rise` — headline reveal through clip-path mask
- `text-reveal` — left-to-right clip-path sweep
- `text-line-reveal` — line-level wipe with horizontal shift
- `text-word-rise` — word-level rise with blur dissolution
- `typewriter` / `typewriter-soft` / `typewriter-loop` — character-by-character reveal

Typography motion is governed by the same easing and duration tokens as all other effects. `--vl-ease-cinematic` curves a headline reveal. `--vl-duration-slower` gives it weight. The system is unified.

When typography moves well, the entire interface feels intentional.

## 10. Restraint as power

The most important motion decision is often the decision to not animate.

Velora's vocabulary is deliberately finite. Not every CSS animation is exposed as a Velora effect. Not every easing curve is offered as a token. Not every timing value is a preset.

This restraint serves three purposes:

1. **Consistency.** A limited vocabulary means interfaces built with Velora share a motion language. Users develop kinesthetic expectations — they know what a Velora entrance feels like, what a Velora scroll effect behaves like.

2. **Quality.** Every effect in Velora has been tuned. The `--vl-ease-cinematic` curve was not selected from a preset list — it was crafted to produce the specific velocity profile that gives Velora its character. Fewer effects, better effects.

3. **Performance.** Every effect Velora offers is guaranteed to be compositor-friendly. By not exposing arbitrary animation properties, the system ensures that the performant path is the only path.

The developer who uses five Velora attributes well will build a more compelling interface than the developer who uses fifty custom animations. Restraint is not a limitation. It is the discipline that separates cinematic motion from noise.
