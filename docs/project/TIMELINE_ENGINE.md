# Timeline Engine

The timeline engine is the mechanism by which Velora connects animation progress to time, scroll position, or interaction state. It determines *when* and *how fast* animations play, independent of *what* they do.

Every animation in Velora has a timeline. By default, that timeline is time — a standard CSS animation that starts on page load and runs for a fixed duration. But Velora's attribute grammar allows any animation to be rebound to scroll position, viewport visibility, hover state, or explicit state control, all through a single attribute.

## The `vl-timeline` attribute

```html
<div vl-enter="fade-up" vl-timeline="view">
```

The `vl-timeline` attribute sets the `animation-timeline` CSS property and adjusts related defaults (timing function, range) to match the timeline model.

### view

```html
<h2 vl-enter="clip-rise" vl-timeline="view">
```

Binds animation progress to the element's visibility within the nearest scroll container.

- `animation-timeline: view()` — progress is driven by the element's intersection with the viewport.
- Default `animation-range: entry 5% cover 42%` — the animation starts when 5% of the element has entered the viewport and completes when 42% of the viewport is covered.
- `animation-timing-function: linear` — progress maps linearly to scroll position (the easing curve of the keyframes themselves provides the visual shaping).

This is the most common timeline for entrance effects. The element animates *as the user scrolls it into view*, not on page load.

### scroll

```html
<div vl-scroll="rotate-scroll" vl-timeline="scroll">
```

Binds animation progress to the scroll position of the root document.

- `animation-timeline: scroll(root)` — progress is driven by how far the page has been scrolled.
- `animation-timing-function: linear`

Use `scroll` for effects that should progress continuously as the user scrolls the entire page, regardless of any particular element's position. Marquees, rotation effects, and page-wide progress indicators are typical use cases.

### auto

```html
<div vl-enter="pop-in" vl-timeline="auto">
```

Standard time-based animation.

- `animation-timeline: auto` — progress is driven by elapsed time.
- Duration and easing are determined by the effect's defaults or overridden via `vl-duration` and `vl-speed`.

This is the default when no `vl-timeline` is specified. It is the classical CSS animation model.

### hover

```html
<div vl-loop="spin" vl-timeline="hover">
```

Animation is paused by default and plays only while the element is hovered.

- `animation-play-state: paused` — initial state.
- `animation-play-state: running` — on `:hover`.

This creates scrub-like behavior for hover interactions. The animation resumes from where it left off when the user re-hovers.

### state

Used in combination with `vl-state="smooth"` to define transition properties for state changes. Not an animation timeline in the strict sense — it configures CSS transitions rather than animations.

## Scroll-driven animations in depth

Scroll-driven animations are the engine behind Velora's most distinctive effects. They deserve detailed treatment.

### How scroll timelines work

A scroll-driven animation replaces the time axis with a scroll progress axis. Instead of "play for 800ms at 60fps," the browser resolves "map 0% to 100% animation progress across a defined scroll range."

The CSS property `animation-timeline` accepts two functions:

- `view()` — progress is based on the target element's visibility within a scrollport.
- `scroll()` — progress is based on the scroll position of a specified scroller.

The `animation-range` property defines the start and end points within that timeline:

```css
animation-range: entry 5% cover 42%;
```

This means: start at 5% of the entry phase (element just starting to enter the viewport) and end at 42% of the cover phase (element covering 42% of the viewport).

### Timeline ranges

Velora provides range presets via the `vl-range` attribute:

| Preset | CSS value | Description |
|---|---|---|
| `entry` | `entry 0% entry 100%` | Full entry phase only — animation completes as the element finishes entering the viewport |
| `entry-short` | `entry 15% cover 35%` | Quick entrance reveal |
| `entry-long` | `entry 0% cover 70%` | Extended entrance that continues well into the viewport |
| `cover` | `cover 0% cover 100%` | Full traversal — animation spans the entire time the element is visible |
| `contain` | `contain 0% contain 100%` | While the element is fully contained within the viewport |
| `scene-soft` | `entry 0% cover 82%` | Relaxed scene pacing, good for editorial content |
| `scene-focus` | `entry 20% cover 65%` | Focused mid-scroll effect, tighter window |
| `custom` | `var(--vl-range, entry 5% cover 42%)` | Uses the `--vl-range` custom property for arbitrary values |

```html
<div vl-enter="fade-up" vl-timeline="view" vl-range="entry-long">
```

### Custom ranges

For precise control beyond presets, set the `--vl-range` custom property:

```html
<div
  vl-enter="fade-up"
  vl-timeline="view"
  vl-range="custom"
  style="--vl-range: entry 10% cover 60%;">
```

Or define ranges in your own CSS:

```css
.my-section [vl-enter] {
  --vl-range: entry 8% cover 55%;
}
```

## Scrub mode

The `vl-scrub` attribute ensures animations are continuously linked to scroll progress with no momentum or overshoot.

```html
<div vl-scroll="cinema-zoom" vl-scrub>
```

This sets:
- `animation-fill-mode: both` — the animation holds at start and end.
- `animation-timing-function: linear` — progress maps directly to scroll position.

Scrub mode is implicit for most scroll-driven effects, but the explicit attribute is useful when combining scroll timelines with effects that normally use non-linear easing.

## Pin mode

The `vl-pin` attribute makes an element sticky at the top of the viewport.

```html
<section vl-pin>
  <div vl-scroll="cinema-zoom">Sticky content</div>
</section>
```

This sets:
- `position: sticky`
- `top: 0`
- `z-index: var(--vl-z-sticky)`

Pinning is essential for scroll-driven storytelling where a section should remain fixed while its internal elements animate with scroll progress.

The `sticky-story` scene preset uses pin mode implicitly.

## One-shot reveals

The `vl-once` attribute ensures an animation plays only once and holds its final state.

```html
<div vl-enter="fade-up" vl-timeline="view" vl-once>
```

This sets:
- `animation-fill-mode: forwards`
- `animation-iteration-count: 1`
- When combined with `vl-timeline="view"`, the range is tightened to `entry 10% cover 36%` for a crisp reveal.

Without `vl-once`, scroll-driven animations will reverse when the element scrolls out of view. With `vl-once`, the element reveals once and stays revealed.

## Orchestration patterns

Complex interfaces combine multiple timeline behaviors into coordinated sequences.

### Staggered scroll reveals

```html
<section vl-scene>
  <div vl-children="stagger" vl-stagger="120ms">
    <div vl-enter="fade-up" vl-timeline="view">Item 1</div>
    <div vl-enter="fade-up" vl-timeline="view">Item 2</div>
    <div vl-enter="fade-up" vl-timeline="view">Item 3</div>
  </div>
</section>
```

Children share the same scroll-driven timeline but enter with staggered delays, creating a wave effect as the user scrolls.

### Mixed timeline composition

```html
<section vl-scene="cinematic-hero">
  <h1 vl-enter="reveal-cinematic">
    Time-based entrance on page load
  </h1>
  <div vl-scroll="parallax" vl-depth="2">
    Scroll-driven parallax as user scrolls past
  </div>
  <aside vl-loop="glow-breathe">
    Continuous ambient loop
  </aside>
</section>
```

Three different timeline models coexist in one scene: time-based entrance for the headline, scroll-driven parallax for the background element, and a continuous time-based loop for ambient glow. Each operates independently.

### Progressive disclosure

```html
<article vl-enter="flow-in" vl-timeline="view" vl-range="entry-short">
  <h2>Title reveals quickly</h2>
</article>

<article vl-enter="flow-in" vl-timeline="view" vl-range="entry-long">
  <p>Body content reveals more slowly, over a longer scroll distance</p>
</article>
```

Different range presets on the same effect create a choreographed progression where elements reveal at different rates as the user scrolls.

## Fallback behavior

Browsers without scroll-driven animation support (primarily older versions) receive automatic fallback:

```css
@supports not (animation-timeline: view()) {
  [vl-timeline="view"],
  [vl-timeline="scroll"] {
    animation-timeline: auto;
    animation-range: normal;
  }
}
```

Scroll-driven effects degrade to time-based animations with `--vl-duration-slower` and `--vl-ease-cinematic`. Content still animates — it just runs on page load instead of scroll position.

## View transitions as timeline

Page-level transitions operate on a separate timeline mechanism — the View Transitions API. When navigating between pages in an MPA, the browser captures the old page state, renders the new page, and animates between them.

Velora's transition presets (`vl-page-transition`) and shared element classes (`.vl-vt-shared-hero`, `.vl-vt-shared-nav`) define how this page-level timeline plays out. The mechanism is different from animation timelines, but the principle is the same: the browser handles progression, CSS defines the motion.

See the scene and transition presets for details on available page transition choreography.
