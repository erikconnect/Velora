# No JavaScript Manifesto

Velora ships zero JavaScript for motion. This is not a limitation. It is the entire point.

## The argument

For fifteen years, the web animation ecosystem operated on a shared assumption: CSS is too limited for real motion work, so JavaScript must orchestrate it. This assumption was correct in 2010. It was defensible in 2018. It is wrong in 2026.

The browser specification committees did not stand still. Year by year, the CSS specification absorbed the capabilities that justified JavaScript animation libraries. Each new feature removed one more reason to run animation logic on the main thread.

Velora is the acknowledgment that the reasons have run out.

## The platform in 2026

Every capability in Velora's motion system maps to a stable, shipping browser feature. No polyfills. No flags. No experimental APIs.

### @view-transition

The View Transitions API provides page-level transitions for multi-page applications. A single CSS at-rule enables cross-document transitions with no JavaScript router:

```css
@view-transition {
  navigation: auto;
}
```

The browser captures a snapshot of the old page, renders the new page, and cross-fades between them using CSS-defined animations on `::view-transition-old(root)` and `::view-transition-new(root)` pseudo-elements.

Velora ships six cinematic view transition presets (velora, wipe, glide, iris, cinema, snap) applied with a single HTML attribute:

```html
<html vl-page-transition="cinema">
```

Shared elements morph between pages using `view-transition-name` — headlines, navigation, media, cards — all with CSS-only keyframes.

**What this replaced:** Client-side routers, page transition libraries, manual DOM snapshotting, JavaScript-orchestrated crossfades. All of it.

### scroll-timeline and view-timeline

CSS scroll-driven animations bind animation progress to scroll position. Two timeline types:

- `animation-timeline: scroll()` — progress tracks the scroll position of a scroll container.
- `animation-timeline: view()` — progress tracks the element's visibility within a scroll container.

Combined with `animation-range`, developers can define exactly when an animation starts and ends relative to scroll position:

```css
[vl-scroll="parallax"] {
  animation-name: vl-parallax-shift;
  animation-timeline: view(block);
  animation-range: cover;
}
```

The browser resolves these on the compositor thread. No scroll event listeners. No `requestAnimationFrame` polling. No intersection observer callbacks. No JavaScript.

**What this replaced:** ScrollMagic, GSAP ScrollTrigger, Locomotive Scroll, custom intersection observer setups, every `window.addEventListener('scroll', ...)` handler ever written for parallax effects.

### @starting-style

The `@starting-style` rule defines the initial state of elements before their first style computation. This enables CSS-only entry animations for dynamically inserted content — elements that appear via `display: none` to `display: block`, or content injected by the server.

**What this replaced:** JavaScript libraries that detect when elements enter the DOM and apply animation classes.

### interpolate-size

The `interpolate-size` property enables smooth transitions to and from `auto` dimensions. Elements can animate from `height: 0` to `height: auto` without JavaScript measuring the target height.

**What this replaced:** JavaScript height calculation hacks, `max-height` workarounds, ResizeObserver-based animation triggers.

### CSS nesting

Native CSS nesting eliminates the need for preprocessors to scope animation rules within component contexts:

```css
[vl-scene="cinematic-hero"] {
  display: grid;
  min-height: 100svh;

  & > * {
    animation: vl-reveal-cinematic 800ms var(--vl-ease-cinematic) both;
  }

  & > *:nth-child(2) {
    animation-delay: 160ms;
  }
}
```

**What this replaced:** Sass/Less nesting, BEM naming conventions used solely for specificity management.

### @layer

The `@layer` at-rule provides explicit cascade ordering. Velora uses eight named layers:

```css
@layer velora.reset, velora.tokens, velora.layout, velora.motion,
       velora.components, velora.transitions, velora.utilities, velora.overrides;
```

Layer order is deterministic. Token definitions never accidentally override motion rules. Component styles never break transition animations. No specificity wars. No `!important` escalation (except `prefers-reduced-motion`, where it is correct).

**What this replaced:** BEM methodologies designed to manage specificity, CSS-in-JS scoping, `!important` overrides, specificity calculation tools.

### Container queries

Container queries enable responsive behavior based on an element's own dimensions, not the viewport:

```css
@container (max-width: 44rem) {
  [vl-scene="product-reveal"] {
    grid-template-columns: 1fr;
  }
}
```

Velora scenes are container query contexts by default. They respond to their own width, making them truly portable across layouts.

**What this replaced:** Viewport-based breakpoint systems, ResizeObserver-based responsive components, JavaScript-calculated layout switching.

### :has()

The `:has()` relational selector enables parent selection based on child state — a capability previously impossible without JavaScript:

```css
[vl-scene][vl-scene-trigger="zone"]:has(> [vl-scene-trigger-zone]:hover)
  :is([vl-scroll]) {
    animation-play-state: running;
}
```

Velora uses `:has()` for scene trigger zones — gating animation playback based on whether a specific child element is hovered or focused.

**What this replaced:** JavaScript event delegation, parent state management, class toggling for UI state.

## The performance case

The argument for CSS-only motion is not philosophical. It is mechanical.

### Zero bundle size

Velora's motion system adds zero bytes to your JavaScript bundle. CSS is parsed by the browser's style engine, which is separate from the JavaScript engine. There is no initialization cost, no module evaluation, no tree-shaking to worry about.

A typical JavaScript animation library adds 15-45KB (gzipped) to a bundle. That code must be downloaded, parsed, compiled, and executed before a single animation can play. With Velora, animation is ready the moment the stylesheet is parsed.

### GPU-composited by default

CSS animations on `transform` and `opacity` are compositor-eligible. The browser promotes these elements to their own compositing layer and animates them on the GPU. The main thread is never involved.

Velora's keyframes are designed around compositor-friendly properties. Transforms use `translate3d()` and `scale()`. Opacity changes use `opacity`. Filter animations use `blur()` and `brightness()`. The browser's compositor handles all of it at hardware speed.

### No main thread blocking

JavaScript animation libraries run on the main thread. They compete with your application logic, your event handlers, your React renders, your data fetching. When the main thread is busy, JavaScript animations jank.

CSS animations do not have this problem. They run on the compositor thread — a separate thread that handles visual compositing independent of JavaScript execution. A complex React re-render will not jank a Velora animation. A long-running fetch handler will not stutter a scroll-driven parallax effect.

### No garbage collection pauses

JavaScript animation libraries allocate and deallocate objects every frame — tween objects, easing calculations, callback closures. The garbage collector must periodically pause to clean up. These pauses cause micro-jank.

CSS animations allocate nothing on the JavaScript heap. There are no objects to garbage collect. The animation state lives entirely within the browser's style engine.

## The scope

Velora's no-JavaScript constraint applies to the motion and presentation layer. It does not claim that JavaScript is unnecessary for web applications. Application logic, data fetching, state management, form validation, routing logic — these are JavaScript's domain.

But animation is not. Not anymore.

The browser already has the animation engine. It already has the scroll observer. It already has the transition orchestrator. It already has the compositor thread.

Velora provides the grammar. The browser provides the runtime.

The main thread is free.
