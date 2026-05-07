---
name: velora-component
description: "Design and build UI components using the Velora design system. Use when: creating a new Velora component, adding motion/animation with vl-effect attributes, composing scenes with vl-scene, writing CSS inside the velora.components or velora.motion layers, applying design tokens (--vl-*), building showcase pages, wiring scroll-driven or view-transition animations. Enforces zero-JS motion, vl-* namespace, reduced-motion support, and layer discipline."
argument-hint: "Describe the component to build (e.g. 'hero section with fade-up headline and CTA')"
---

# Velora Component Builder

## When to Use
- Creating a new `.vl-*` component class
- Composing a section or page using `vl-scene`, `vl-effect`, `vl-timeline`
- Adding scroll-driven or view-transition animations
- Applying Velora tokens (colors, spacing, motion) to existing markup
- Building showcase/demo pages inside `packages/pages/` or `apps/showcase/`
- Reviewing or refactoring component CSS for layer and namespace compliance

---

## Core Rules (Never Break These)

| Rule | Detail |
|------|--------|
| **Zero-JS motion** | All animation via CSS attributes and keyframes — no GSAP, Framer, Anime.js |
| **vl-* namespace** | Classes → `.vl-*` · Variables → `--vl-*` · Attributes → `vl-*` |
| **Reduced-motion** | Every animated element must respect `@media (prefers-reduced-motion: reduce)` |
| **Layer discipline** | CSS goes in the correct `@layer velora.*` — never outside a layer |
| **Token-first** | Never hard-code colors, spacing, or timing — use `--vl-*` tokens |
| **Semantic HTML** | `<section>`, `<article>`, `<h1>`–`<h6>`, `<button>` over generic divs |
| **No runtime deps** | No React, Vue, or CSS framework imports in core components |

---

## Step-by-Step Procedure

### 1. Clarify the Component

Before writing any code, answer:
- What is the visual purpose? (card, hero, CTA, kicker, badge, etc.)
- What motion behavior? (entrance on scroll, hover, infinite, page transition)
- Where does it live? (new CSS class, inline markup, showcase page)
- Which theme? (`velora-noir` dark or `velora-earth` light)

### 2. Pick the Right Abstraction

| Need | Use |
|------|-----|
| Full-bleed section | `<section vl-scene data-vl-scene-density="immersive">` |
| Standard content area | `<div class="vl-container">` |
| Eyebrow/label | `<span class="vl-kicker">` |
| Primary action | `<button class="vl-cta">` |
| Image-clipped text | `<h2 class="vl-text-mask">` |
| Cinematic headline | `<h2 class="vl-text-reveal">` |
| Loading state | `<div class="vl-skeleton-shimmer">` |
| Film grain overlay | `<div class="vl-noise">` |

### 3. Compose the HTML Skeleton

Use this composition pattern as a starting point:

```html
<section vl-scene data-vl-scene-density="editorial">
  <div class="vl-container">
    <span class="vl-kicker">Label</span>
    <h2 vl-effect="fade-up" vl-timeline="view" vl-range="entry 5% cover 40%">
      Headline
    </h2>
    <p vl-effect="fade-up" vl-timeline="view" vl-speed="slow">Body copy</p>
    <button class="vl-cta" vl-effect="pop-in" vl-timeline="view">
      Call to Action
    </button>
  </div>
</section>
```

### 4. Wire Motion Attributes

See [motion-reference.md](./references/motion-reference.md) for the full attribute grammar.

**Key combos:**

| Goal | Attributes |
|------|-----------|
| Fade-up on scroll enter | `vl-effect="fade-up" vl-timeline="view"` |
| Slow blur entrance | `vl-effect="blur-in" vl-timeline="view" vl-speed="slow"` |
| Staggered children list | Parent: `vl-children="stagger"` · each child: `vl-effect="fade-up"` |
| Scroll-scrubbed parallax | `vl-timeline="scroll" vl-scrub vl-effect="fade-up"` |
| Hover micro-interaction | `vl-timeline="hover" vl-effect="scale-in"` |
| Infinite ambient loop | `vl-loop="-1"` + CSS keyframe (e.g. `vl-kicker-glow`) |

### 5. Write the CSS (if a new class is needed)

Place CSS in the correct layer:

```css
/* New UI component → velora.components */
@layer velora.components {
  .vl-my-component {
    background: var(--vl-bg-surface);
    color: var(--vl-text-primary);
    padding: var(--vl-space-md) var(--vl-space-lg);
    border-radius: var(--vl-radius-lg);
  }
}

/* New motion behavior → velora.motion */
@layer velora.motion {
  .vl-my-component[vl-effect="slide-left"] {
    animation: vl-slide-left var(--vl-duration-normal) var(--vl-ease-cinematic) forwards;
  }
}
```

**Reduced-motion guard** (always required for animated components):

```css
@layer velora.motion {
  @media (prefers-reduced-motion: reduce) {
    .vl-my-component {
      animation: none;
      transition: none;
    }
  }
}
```

### 6. Apply Design Tokens

See [token-reference.md](./references/token-reference.md) for the full token list.

**Quick reference:**

```css
/* Colors */
color: var(--vl-text-primary);
background: var(--vl-bg-surface);
border-color: var(--vl-color-accent);

/* Spacing */
padding: var(--vl-space-md);      /* 1rem */
gap: var(--vl-space-lg);          /* 2rem */
margin-top: var(--vl-space-xl);   /* 4rem */

/* Typography */
font-family: var(--vl-font-family-display);
font-size: var(--vl-font-size-2xl);
font-weight: var(--vl-font-weight-bold);

/* Motion */
animation-duration: var(--vl-duration-normal);   /* 300ms */
animation-timing-function: var(--vl-ease-cinematic);
animation-delay: calc(var(--vl-stagger-step) * var(--vl-stagger-index, 0));

/* Border */
border-radius: var(--vl-radius-lg);
```

### 7. View Transitions (MPA page-to-page morphing)

For shared-element transitions between pages:

```html
<!-- Same class on both pages ensures morphing -->
<img class="vl-vt-shared-hero" src="..." alt="...">
<h1 class="vl-vt-shared-hero">Title</h1>
```

Preset options via `data-vl-transition` on `<html>` or `<body>`:

| Preset | Effect |
|--------|--------|
| `velora` | Blur + scale + fade (default) |
| `wipe` | Clip-path horizontal wipe |
| `glide` | Smooth horizontal slide |
| `iris` | Circular radial reveal |
| `cinema` | Cinematic zoom |
| `snap` | Instant cut |

### 8. Quality Checklist Before Done

- [ ] All classes use `.vl-*` prefix
- [ ] All CSS variables use `--vl-*` prefix
- [ ] All motion attributes use `vl-*` (no `data-animate` or custom attributes)
- [ ] No hard-coded color, spacing, or timing values
- [ ] CSS is inside an `@layer velora.*` block
- [ ] `@media (prefers-reduced-motion: reduce)` guard present for any animation
- [ ] Semantic HTML tags used (`section`, `h1`–`h6`, `button`, `article`)
- [ ] No JavaScript animation libraries referenced
- [ ] Component tested in both `velora-noir` (dark) and `velora-earth` (light) themes if applicable

---

## Scene Density Modes

Control the spatial rhythm of a section with `data-vl-scene-density`:

| Value | Feel | Use case |
|-------|------|---------|
| `compact` | Tight, information-dense | Data tables, forms, lists |
| `editorial` | Balanced, readable | Standard content sections |
| `immersive` | Open, expansive | Hero sections, landing headers |
| `full-bleed` | 100dvh, centered | Full-screen intros, covers |

---

## File Placement

| What | Where |
|------|-------|
| New component CSS | `packages/css/src/` (correct layer file) |
| New showcase page | `packages/pages/<component-name>.html` |
| New demo in app | `apps/showcase/pages/<name>/` |
| Token additions | `packages/css/src/00-tokens.css` or `01a-motion-tokens.css` |
| New keyframe | `packages/css/src/04-motion.css` |

After editing CSS source, run:
```bash
pnpm sync:showcase-css
pnpm check:showcase-css
pnpm verify:contract
```

---

## References

- [Motion Attribute Grammar](./references/motion-reference.md)
- [Design Token Catalog](./references/token-reference.md)
- [Layer Architecture](./references/layer-reference.md)
