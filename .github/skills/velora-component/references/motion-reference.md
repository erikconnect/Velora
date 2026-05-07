# Motion Attribute Grammar — Velora

All motion in Velora is declared via HTML attributes. Zero JavaScript required.

## Core Attributes

| Attribute | Purpose | Example Values |
|-----------|---------|----------------|
| `vl-effect` | Motion preset keyframe | `fade-up`, `fade-down`, `slide-left`, `slide-right`, `scale-in`, `pop-in`, `blur-in` |
| `vl-timeline` | Progress model | `view` · `scroll` · `hover` · `auto` · `state` |
| `vl-range` | Scroll animation range | `entry 5% cover 40%` |
| `vl-speed` | Duration category | `fast` · `normal` · `slow` |
| `vl-duration` | Explicit duration override | `1200ms` |
| `vl-ease` | Easing override | Uses `--vl-ease-*` tokens |
| `vl-scrub` | Continuous scroll-linked (boolean) | (presence = enabled) |
| `vl-pin` | Sticky scene (boolean) | (presence = enabled) |
| `vl-loop` | Loop count | `-1` (infinite) or integer |
| `vl-children` | Child choreography | `stagger` · `cascade` · `sequence` |
| `vl-stagger` | Stagger interval override | `120ms` |

## Available `vl-effect` Presets

### Entrance
- `fade-up` — fades in and rises
- `fade-down` — fades in and descends
- `slide-left` — slides in from the right
- `slide-right` — slides in from the left
- `scale-in` — scales up from smaller
- `pop-in` — spring bounce scale
- `blur-in` — blurs from blurry to sharp

### Exit
- `fade-out` — fades and exits
- `fade-out-up` — fades and rises out
- `fade-out-down` — fades and descends out
- `shrink-out` — scales down to nothing

### Infinite / Ambient
- `kicker-glow` — soft pulsing glow (for `.vl-kicker`)
- `text-mask-pan` — panning gradient across text mask
- `mesh-drift` — slow mesh background drift
- `marquee-vertical` — vertical scrolling ticker

### Scroll-Driven
- `text-clip-reveal` — reveal text via clip-path on scroll
- `scroll-progress-scale` — scale element as scroll progresses

## `vl-timeline` Modes

| Value | Behavior |
|-------|---------|
| `view` | Triggers when element enters viewport (Intersection Observer) |
| `scroll` | Links animation progress to scroll position (scroll-driven) |
| `hover` | Triggers on `:hover` / `:focus-visible` |
| `auto` | Plays immediately on load |
| `state` | Triggered by JS `data-vl-state` attribute toggle |

## Motion Tokens

```css
/* Easing */
--vl-ease-cinematic:     cubic-bezier(0.2, 0.8, 0.2, 1);
--vl-ease-out-soft:      cubic-bezier(0.16, 1, 0.3, 1);
--vl-ease-spring:        cubic-bezier(0.34, 1.56, 0.64, 1);
--vl-ease-in-out-smooth: cubic-bezier(0.45, 0, 0.55, 1);

/* Duration */
--vl-duration-instant:  80ms;
--vl-duration-fast:     150ms;
--vl-duration-normal:   300ms;
--vl-duration-slow:     500ms;
--vl-duration-slower:   800ms;

/* Stagger */
--vl-stagger-step: 45ms;

/* Distance */
--vl-motion-distance: 1.25rem;
```

## Stagger Children Pattern

```html
<ul vl-children="stagger" vl-stagger="80ms">
  <li vl-effect="fade-up" vl-timeline="view">Item 1</li>
  <li vl-effect="fade-up" vl-timeline="view">Item 2</li>
  <li vl-effect="fade-up" vl-timeline="view">Item 3</li>
</ul>
```

## Reduced-Motion Guard

**Always required** alongside any animation:

```css
@layer velora.motion {
  @media (prefers-reduced-motion: reduce) {
    [vl-effect] {
      animation: none !important;
      transition: none !important;
    }
  }
}
```
