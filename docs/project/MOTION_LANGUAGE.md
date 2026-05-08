# Motion Language

Velora defines a structured motion grammar — a vocabulary of effects, timings, and composition rules that map declarative HTML attributes to native CSS animation primitives. This document is the reference for that grammar.

## Attribute grammar

The motion system is driven by HTML attributes prefixed with `vl-`. Each attribute targets a specific layer of the motion pipeline:

| Attribute | Purpose | Example values |
|---|---|---|
| `vl-effect` | Named motion preset (legacy, still supported) | `fade-up`, `blur-in`, `parallax` |
| `vl-enter` | Entrance animation | `fade-up`, `flow-in`, `clip-rise`, `reveal-cinematic`, `depth-enter`, `mask-sweep` |
| `vl-scroll` | Scroll-driven animation | `parallax`, `cinema-zoom`, `depth-drift`, `crossfade`, `reveal`, `media-zoom` |
| `vl-loop` | Continuous/ambient animation | `float`, `glow-breathe`, `wobble`, `morph`, `spin`, `orbit`, `aurora-drift` |
| `vl-hover` | Hover interaction | `hover-lift`, `hover-glow`, `underline-expand`, `icon-shift`, `gradient-sweep`, `border-trace` |
| `vl-state` | State transition | `smooth` |
| `vl-exit` | Exit animation | `fade-out`, `fade-out-up`, `fade-out-down`, `shrink-out` |
| `vl-timeline` | Progress model | `view`, `scroll`, `auto`, `state`, `hover` |
| `vl-scene` | Scene container preset | `cinematic-hero`, `sticky-story`, `glass-bento`, `product-reveal`, `editorial-cinema` |
| `vl-children` | Child choreography | `stagger`, `cascade`, `sequence`, `orchestrate` |
| `vl-base` | Base motion intensity | `subtle`, `balanced`, `dramatic` |

Supporting attributes control timing, range, and behavior:

| Attribute | Purpose | Example values |
|---|---|---|
| `vl-duration` | Direct duration override | `500ms`, `1.5s` |
| `vl-speed` | Duration category | `fast`, `normal`, `slow`, `cinema` |
| `vl-stagger` | Stagger interval | `80ms`, `120ms`, `200ms` |
| `vl-range` | Scroll animation range | `entry`, `entry-short`, `entry-long`, `cover`, `contain`, `scene-soft`, `scene-focus` |
| `vl-depth` | Parallax depth multiplier | `1`, `2`, `3`, `4` |
| `vl-direction` | Playback direction | `normal`, `reverse`, `alternate`, `alternate-reverse` |
| `vl-pin` | Sticky scene behavior | Boolean attribute |
| `vl-scrub` | Continuous scroll-linked motion | Boolean attribute |
| `vl-once` | One-shot reveal | Boolean attribute |

## Motion channels

Velora organizes animation into seven ordered channels. Each channel is independent and optional. When multiple channels are present on an element, they compose in this deterministic order:

```
base  ->  enter  ->  scroll  ->  loop  ->  hover  ->  state  ->  exit
```

Each channel has its own attribute and its own set of CSS custom properties. Channels do not interfere with each other.

### base

Sets the foundational motion intensity for the element. Controls default duration, distance, and easing.

```html
<div vl-base="dramatic">
```

- `subtle` — short duration, small distance, soft easing
- `balanced` — medium duration, standard distance, cinematic easing
- `dramatic` — long duration, large distance, spring easing

### enter

Plays once when the element enters. Triggered by page load (default) or viewport entry (when combined with `vl-timeline="view"`).

```html
<h1 vl-enter="clip-rise" vl-timeline="view">
```

**Entrance effects:**

| Name | Description | Keyframe |
|---|---|---|
| `fade-in` | Opacity reveal | `vl-fade-in` |
| `fade-up` | Opacity + upward translation | `vl-fade-up` |
| `fade-down` | Opacity + downward translation | `vl-fade-down` |
| `slide-left` | Opacity + slide from right | `vl-slide-left` |
| `slide-right` | Opacity + slide from left | `vl-slide-right` |
| `scale-in` | Opacity + subtle scale + lift | `vl-scale-in` |
| `pop-in` | Bouncy scale entrance | `vl-pop-in` |
| `blur-in` | Opacity + clip-path + blur dissolve | `vl-blur-in` |
| `reveal-3d` | Perspective rotation entrance | `vl-3d-entry` |
| `flow-in` | Opacity + blur + scale + translation | `vl-flow-in` |
| `clip-rise` | Clip-path rise from bottom | `vl-clip-rise` |
| `tilt-in` | Perspective Y-axis rotation | `vl-tilt-in` |
| `reveal-cinematic` | Deep perspective + blur + brightness | `vl-reveal-cinematic` |
| `depth-enter` | Steep perspective rotation + depth translation | `vl-depth-enter` |
| `mask-sweep` | Clip-path sweep from left | `vl-mask-sweep` |

### scroll

Drives animation progress from scroll position. Automatically binds to `animation-timeline: view(block)` or `scroll(root)`.

```html
<img vl-scroll="parallax" vl-depth="2">
```

**Scroll effects:**

| Name | Description | Timeline |
|---|---|---|
| `parallax` | Vertical parallax shift | `view(block)`, range: cover |
| `cinema-zoom` | Scale + brightness shift on scroll | `view(block)`, range: entry to exit |
| `depth-drift` | Translation + scale + opacity on scroll | `view(block)` |
| `crossfade` | Opacity + subtle scale scrub | `view(block)` |
| `scroll-marquee` | Horizontal translation on page scroll | `scroll(root)` |
| `rotate-scroll` | Continuous rotation on page scroll | `scroll(root)` |
| `text-highlight` | Background sweep on inline scroll | `view(inline)` |
| `reveal` | Fade-up on viewport entry | `view(block)` |
| `media-zoom` | Scale + opacity on viewport entry | `view(block)` |

### loop

Continuous ambient animation that repeats. Duration and iteration count are configurable.

```html
<div vl-loop="float" vl-duration="6s">
```

**Loop effects:**

| Name | Description | Default duration |
|---|---|---|
| `shimmer` | Background position shift | 2.5s |
| `float` | Gentle vertical oscillation | 5.5s |
| `glow-breathe` | Pulsing box-shadow glow | 3.5s |
| `wobble` | Tilting oscillation | 2.8s |
| `rock` | Wider rocking motion | 4s |
| `morph` | Border-radius morphing | 8s |
| `spin` | Continuous rotation | 8s |
| `orbit` | Orbital path around center | 14s |
| `aurora-drift` | Hue-shifting gradient drift | 12s |

Set `vl-loop="-1"` for infinite repetition (default) or a number like `vl-loop="3"` for a fixed count.

### hover

Interaction effects triggered by `:hover` and `:focus-visible`.

```html
<a vl-hover="gradient-sweep">
```

**Hover effects:**

| Name | Description |
|---|---|
| `hover-lift` | Upward translation + float shadow |
| `hover-glow` | Glow box-shadow |
| `underline-expand` | Expanding underline from center |
| `icon-shift` | Rightward shift of last child |
| `gradient-sweep` | Gradient overlay sweep |
| `border-trace` | Gradient border reveal |

### state

Transition properties for smooth state changes (class toggling, attribute changes, theme switches).

```html
<div vl-state="smooth">
```

`smooth` applies cinematic transitions to `transform`, `opacity`, `background-color`, `color`, `box-shadow`, and `border-color`.

### exit

Plays when the element exits. Typically triggered by state change or view exit.

```html
<div vl-exit="fade-out-up">
```

**Exit effects:**

| Name | Description |
|---|---|
| `fade-out` | Opacity dissolve |
| `fade-out-up` | Opacity + upward translation |
| `fade-out-down` | Opacity + downward translation |
| `shrink-out` | Opacity + scale reduction |

## Easing tokens

Velora provides four core easing curves, available as CSS custom properties:

| Token | Curve | Character |
|---|---|---|
| `--vl-ease-cinematic` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | The signature Velora curve. Slow start, fast middle, gentle landing. Cinematic quality. |
| `--vl-ease-out-soft` | `cubic-bezier(0.16, 1, 0.3, 1)` | Fast exit from rest, long deceleration. Natural for entrances and reveals. |
| `--vl-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Overshoots target slightly, then settles. Physical, elastic quality. |
| `--vl-ease-in-out-smooth` | `cubic-bezier(0.45, 0, 0.55, 1)` | Symmetric acceleration and deceleration. Clean for loops and ambient motion. |

Additional premium easing tokens:

| Token | Curve | Character |
|---|---|---|
| `--vl-ease-elastic` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Strong overshoot and bounce. Use sparingly for emphasis. |
| `--vl-ease-smooth-out` | `cubic-bezier(0, 0.55, 0.45, 1)` | Gentle out curve. Quieter than `--vl-ease-out-soft`. |

## Duration tokens

| Token | Value | Use case |
|---|---|---|
| `--vl-duration-instant` | `80ms` | Micro-interactions, toggles |
| `--vl-duration-fast` | `150ms` | Button feedback, hover states |
| `--vl-duration-normal` | `300ms` | Standard transitions |
| `--vl-duration-slow` | `500ms` | Entrance animations |
| `--vl-duration-slower` | `800ms` | Cinematic reveals, scene choreography |

## Composing motion

Motion in Velora is composed, not configured. Combine multiple channels on a single element:

```html
<article
  vl-base="balanced"
  vl-enter="flow-in"
  vl-scroll="depth-drift"
  vl-loop="glow-breathe"
  vl-hover="hover-lift"
  vl-state="smooth"
  vl-exit="fade-out">
```

Each channel operates independently. The cascade resolves them without conflict because each channel writes to its own set of CSS custom properties (`--vl-enter-name`, `--vl-scroll-name`, `--vl-loop-name`, etc.).

### Child choreography

The `vl-children` attribute orchestrates animation across direct children:

```html
<ul vl-children="stagger" vl-stagger="120ms">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>
```

| Mode | Behavior |
|---|---|
| `stagger` | Sequential `fade-up` with configurable delay between children |
| `cascade` | Sequential `flow-in` with configurable delay |
| `sequence` | Each child waits for the previous to complete |
| `orchestrate` | Alternating `fade-up` / `flow-in` with staggered delay |

### Timeline binding

The `vl-timeline` attribute controls what drives animation progress:

```html
<div vl-enter="fade-up" vl-timeline="view">
```

| Value | Behavior |
|---|---|
| `view` | Progress driven by element's position in viewport (`animation-timeline: view()`) |
| `scroll` | Progress driven by document scroll position (`animation-timeline: scroll(root)`) |
| `auto` | Standard time-based animation |
| `hover` | Animation paused until hover |

### Range control

The `vl-range` attribute fine-tunes when scroll-driven animations activate:

| Preset | Range | Best for |
|---|---|---|
| `entry` | `entry 0%` to `entry 100%` | Entrance-only effects |
| `entry-short` | `entry 15%` to `cover 35%` | Quick reveals |
| `entry-long` | `entry 0%` to `cover 70%` | Extended entrance |
| `cover` | `cover 0%` to `cover 100%` | Full scroll distance |
| `contain` | `contain 0%` to `contain 100%` | While element is fully visible |
| `scene-soft` | `entry 0%` to `cover 82%` | Relaxed scene pacing |
| `scene-focus` | `entry 20%` to `cover 65%` | Focused mid-scroll effect |

## Text effects

Velora includes specialized text animation presets:

| Effect | Description |
|---|---|
| `text-reveal` | Clip-path reveal left-to-right |
| `text-reveal-up` | Clip-path reveal upward with translation |
| `text-reveal-down` | Clip-path reveal downward with translation |
| `text-line-reveal` | Line-level wipe with horizontal shift |
| `text-word-rise` | Word-level rise with blur |
| `typewriter` | Character-by-character typing with blinking caret |
| `typewriter-soft` | Softer typing variant with fading caret |
| `typewriter-loop` | Typing that reverses and repeats |
| `clip-rise` | Clip-path + vertical shift, ideal for headlines |

## Backward compatibility

The `vl-effect` attribute remains fully supported. It maps to the same keyframes and CSS properties as the channel-specific attributes. New development should prefer the channel model (`vl-enter`, `vl-scroll`, `vl-loop`, etc.) for clearer intent and better composability.
