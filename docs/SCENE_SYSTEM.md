# Scene System

A scene in Velora is a self-contained unit of cinematic composition. It is not a component. It is not a section wrapper. It is a container that defines layout, choreography, and scroll behavior for its children as a single coordinated experience.

Scenes are Velora's answer to a fundamental question in interface motion: how do you orchestrate multiple elements moving together with rhythm, without writing imperative animation code?

## The `vl-scene` attribute

Any element with the `vl-scene` attribute becomes a scene container. The attribute establishes:

- **Container query scope** — the element becomes a `container-type: inline-size` context named `vl-scene`, enabling responsive behavior based on the scene's own width rather than the viewport.
- **Layout containment** — `contain: layout style` isolates the scene's layout and style from the rest of the document.
- **Relative positioning** — provides a positioning context for absolute or sticky children.

```html
<section vl-scene="cinematic-hero">
  <h1>Headline</h1>
  <p>Subhead</p>
  <img src="hero.jpg" alt="">
</section>
```

When `vl-scene` carries a named preset value, Velora applies a complete layout and motion choreography. When used without a value (just the bare attribute), it provides the container scaffolding for custom composition.

## Scene presets

### cinematic-hero

Full-viewport hero with depth-entry choreography. The signature Velora entrance.

```html
<section vl-scene="cinematic-hero">
  <h1>Title</h1>
  <p>Subtitle</p>
  <div>Media</div>
  <nav>Actions</nav>
</section>
```

**Layout:** Centered grid, `min-height: 100svh`, isolated overflow.

**Choreography:** Each direct child animates with `vl-reveal-cinematic` — a deep perspective entrance combining opacity, 3D translation, scale, blur, and brightness. Children are staggered:

| Child | Delay |
|---|---|
| 1st | 0ms |
| 2nd | 160ms |
| 3rd | 300ms |
| 4th | 440ms |
| 5th+ | 560ms |

The result is a cascading reveal where the headline lands first, supporting content follows, and media settles last. The perspective and blur create physical depth — content appears to emerge from behind the screen surface.

### sticky-story

Scroll-pinned storytelling section. The scene sticks to the viewport while its children reveal as the user scrolls past.

```html
<section vl-scene="sticky-story">
  <article>Chapter one</article>
  <article>Chapter two</article>
  <article>Chapter three</article>
</section>
```

**Layout:** Sticky positioned (`top: 0`), `min-height: 100svh`, grid with `align-content: start`.

**Choreography:** Each child uses `vl-fade-up` driven by `animation-timeline: view(block)` with range `entry 0%` to `cover 55%`. As the user scrolls, content fades and rises into view progressively.

This preset is designed for long-form editorial, case study presentations, and product narratives where the background or context should remain fixed while content chapters advance.

### glass-bento

Auto-grid with glassmorphism tiles. Each tile scales in as it enters the viewport.

```html
<section vl-scene="glass-bento">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</section>
```

**Layout:** CSS Grid with `repeat(auto-fill, minmax(min(100%, 18rem), 1fr))` and `gap: var(--vl-space-md)`. Responsive by default — no breakpoints needed.

**Tile treatment:** Each child receives:
- Glassmorphic background (`backdrop-filter: blur(12px) saturate(1.4)`)
- Subtle border
- `vl-scale-in` animation driven by `view(block)` timeline, range `entry 5%` to `cover 45%`

Tiles scale in as they enter the viewport, creating a reveal grid effect.

### product-reveal

Two-column layout for media + copy. The media tilts in from one side while copy fades up from the other.

```html
<section vl-scene="product-reveal">
  <div>
    <img src="product.jpg" alt="">
  </div>
  <div>
    <h2>Product name</h2>
    <p>Description</p>
  </div>
</section>
```

**Layout:** Two-column grid (`1fr 1fr`) with `gap: var(--vl-space-xl)`, centered alignment. Collapses to single column below `44rem` container width (via `@container` query).

**Choreography:**
- First child: `vl-tilt-in` (perspective Y-axis rotation) driven by scroll, range `entry 5%` to `cover 48%`
- Last child: `vl-fade-up` driven by scroll, range `entry 10%` to `cover 50%`

The slight offset between media and copy creates a parallax-like depth separation.

### editorial-cinema

Full-bleed editorial layout with clip-rise reveals. Designed for long-form content, magazine-style layouts, and visual essays.

```html
<section vl-scene="editorial-cinema">
  <figure>Full-width image</figure>
  <blockquote>Pull quote</blockquote>
  <p>Body text</p>
</section>
```

**Layout:** Grid with `gap: var(--vl-space-xl)`, container query scoped.

**Choreography:** Every direct child uses `vl-clip-rise` driven by scroll, range `entry 5%` to `cover 42%`. Content reveals upward through a clip-path mask, creating a curtain-rise effect.

## Compound scene effects

Beyond named presets, Velora provides scene-level effect attributes for more granular control:

### scene-hero-reveal

Orchestrated hero entrance with mixed animation types per child position.

```html
<div vl-effect="scene-hero-reveal">
  <h1>Headline</h1>       <!-- fade-up, cinematic easing -->
  <p>Subhead</p>           <!-- scale-in, spring easing, 120ms delay -->
  <img src="..." alt="">   <!-- blur-in, soft easing, 240ms delay -->
  <nav>Actions</nav>       <!-- fade-up, staggered from 240ms+ -->
</div>
```

### scene-feature-flow

Scroll-driven progressive reveal with offset ranges per child.

```html
<div vl-effect="scene-feature-flow" vl-timeline="view">
  <div>Feature 1</div>  <!-- range: entry 0% cover 35% -->
  <div>Feature 2</div>  <!-- range: entry 5% cover 40% -->
  <div>Feature 3</div>  <!-- range: entry 10% cover 45% -->
</div>
```

### scene-story-pin

Sticky section where children reveal via scroll-driven fade-up.

### scene-layer-stack

3D perspective container where children stack with increasing depth on scroll.

```html
<div vl-effect="scene-layer-stack">
  <div>Layer 1</div>  <!-- 1rem distance -->
  <div>Layer 2</div>  <!-- 2rem distance -->
  <div>Layer 3</div>  <!-- 3rem distance -->
</div>
```

## Scene triggers

Scenes can gate their animations behind interaction states using CSS-only trigger patterns.

### Basic trigger

```html
<section vl-scene vl-scene-trigger>
  <div vl-scroll="parallax">Content</div>
</section>
```

Scroll-driven animations within the scene are paused until the scene receives `:hover` or `:focus-within`. This is useful for interactive showcases where motion should begin on user engagement.

### Zone trigger

```html
<section vl-scene vl-scene-trigger="zone">
  <button vl-scene-trigger-zone>Activate</button>
  <div vl-scroll="parallax">Content</div>
</section>
```

In zone mode (requires `@supports selector(:has(*))`), animations are gated behind hover or focus on a specific trigger zone element. A baseline fallback activates on scene-level hover/focus for browsers without `:has()` support.

## Custom scene composition

Named presets are starting points. For custom scenes, compose from primitives:

```html
<section vl-scene>
  <h2 vl-enter="reveal-cinematic" vl-timeline="view" vl-range="entry-short">
    Section title
  </h2>
  <div
    vl-children="stagger"
    vl-stagger="100ms"
    vl-timeline="view"
    vl-range="scene-soft">
    <article>Item 1</article>
    <article>Item 2</article>
    <article>Item 3</article>
  </div>
  <aside vl-scroll="depth-drift" vl-depth="2">
    Background element
  </aside>
</section>
```

This custom scene combines a cinematic headline reveal, staggered content items, and a parallax background — all from composable attributes, all resolved in CSS.

## Density modes

Scenes respect the document's density mode set via `data-layout` on the root element:

| Mode | Effect |
|---|---|
| `default` | Standard spacing and typography |
| `compact` | Tighter spacing, slightly smaller base font |
| `presentation` | Generous spacing, larger base font, relaxed line height |

Density modes adjust spacing tokens globally, and scenes inherit these values through CSS custom properties. No scene-specific overrides are needed.
