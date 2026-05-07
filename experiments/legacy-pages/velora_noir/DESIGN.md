---
version: "beta"
name: "Velora Noir - Kinetic Editorial System"
description: "Noir mode for premium technical interfaces. Focus on tonal layering, asymmetry, and motion-native storytelling with strict native HTML/CSS compatibility."
colors:
    primary: "#BBCBB1"
    secondary: "#A8B79D"
    tertiary: "#6A7B62"
    neutral: "#0D0F0C"
    background: "#0D0F0C"
    surface: "#11150F"
    text-primary: "#E8EFE2"
    text-secondary: "#BBCBB1"
    accent: "#9DD08C"
typography:
    display-lg:
        fontFamily: "Space Grotesk"
        fontSize: "72px"
        fontWeight: 700
        lineHeight: "76px"
        letterSpacing: "-0.03em"
    body-md:
        fontFamily: "Manrope"
        fontSize: "16px"
        fontWeight: 400
        lineHeight: "26px"
        letterSpacing: "0.01em"
    label-md:
        fontFamily: "Manrope"
        fontSize: "12px"
        fontWeight: 600
        lineHeight: "16px"
        letterSpacing: "0.05em"
rounded:
    sm: "2px"
    md: "6px"
    lg: "12px"
spacing:
    base: "8px"
    sm: "8px"
    md: "16px"
    lg: "24px"
    xl: "40px"
    section-padding: "48px"
    card-padding: "24px"
components:
    button-primary:
        textColor: "#364430"
        background: "#BBCBB1"
        rounded: "{rounded.sm}"
        padding: "12px 18px"
    card:
        background: "rgba(17, 21, 15, 0.82)"
        rounded: "{rounded.lg}"
        padding: "{spacing.card-padding}"
---

## Overview

- Composition cues:
    - Layout: Asymmetric grid
    - Content Width: Wide with controlled breakouts
    - Framing: Tonal glass
    - Density: Medium-high for product storytelling

This system follows the creative direction "Technical Aesthete": bold, engineered, and editorial. The page should feel precise and premium without looking generic or template-based.

## Colors

The palette is dark-biased, anchored in greens and warm neutrals. Every color decision should reinforce depth and hierarchy instead of decorative noise.

- Primary (#BBCBB1): Main action and emphasis token.
- Secondary (#A8B79D): Supporting accents and low-priority highlights.
- Tertiary (#6A7B62): Utility accents and contextual contrast.
- Neutral (#0D0F0C): Structural background baseline.

- Usage: Background #0D0F0C, Surface #11150F, Text Primary #E8EFE2, Text Secondary #BBCBB1, Accent #9DD08C.

### No-Line Rule

Avoid hard section dividers. Build separation through:
- Surface shifts (`surface` to `surface-container-low` style transitions).
- Spacing rhythm.
- Tonal gradients and light falloff.

### Recommended Gradients

- `linear-gradient(145deg, rgba(187, 203, 177, 0.26), rgba(54, 68, 48, 0.12))`
- `linear-gradient(180deg, rgba(13, 15, 12, 0.7), rgba(13, 15, 12, 0.94))`

## Typography

Typography uses contrast between geometric display and humanist body copy.

- Display (`display-lg`): Space Grotesk, 72px, 700, tracking -0.03em.
- Body (`body-md`): Manrope, 16px, 400, line-height 26px.
- Labels (`label-md`): Manrope, 12px, 600, all-caps rhythm.

### Editorial Rules

- Pair oversized headings with compact metadata.
- Keep body measure between 60ch and 72ch for dense narrative blocks.
- Reserve all-caps labels for technical metadata and motion parameters.

## Layout

Layout should look deliberate, not generic. Avoid over-centering everything.

- Layout type: Asymmetric grid with controlled offsets.
- Content width: 12-column structure with breakout zones.
- Base unit: 8px.
- Scale: 8px, 16px, 24px, 40px, 48px, 64px.
- Section padding: 48px desktop, 24px mobile.

## Elevation & Depth

Depth comes from tonal stacking and glass treatment, not from heavy black shadows.

- Surface style: Tonal glass.
- Borders: Optional ghost border (`rgba(232, 239, 226, 0.14)`) only for focus/accessibility.
- Shadows:
    - `0 20px 50px -14px rgba(0, 0, 0, 0.45)`
    - `inset 0 0 0 1px rgba(157, 208, 140, 0.12)`
- Blur: 12px to 24px for floating layers.

### Techniques

- Gradient border shell with 1px outer wrap.
- Inner surface with smaller radius to preserve edge shimmer.
- Ambient glow only around primary call-to-action zones.

## Shapes

- Corner radii: 2px, 6px, 12px, 9999px.
- Icon treatment: Linear and technical.
- Icon sets: Solar or neutral line sets with consistent stroke width.

## Components

### Buttons

- Primary: `#BBCBB1` background, dark text, sharp radius.
- Secondary: Surface-based button with subtle border tint.
- Tertiary: Text-only with underline on hover/focus-visible.

### Cards and Surfaces

- Card surface: `rgba(17, 21, 15, 0.82)`.
- Radius: 12px.
- Padding: 24px.
- Transition: surface and shadow only, 200ms to 300ms.

### Inputs

- Filled surfaces, no hard outlines by default.
- Focus adds ghost border + accent shadow.
- Error state prefers fill contrast over saturated red borders.

## Do's and Don'ts

### Do

- Do keep large negative space around hero messaging.
- Do use primary accent as a precision signal.
- Do preserve native-first interactions before any JS enhancement.

### Don't

- Don't use full-white text blocks on dark base; keep tonal warmth.
- Don't add arbitrary drop shadows.
- Don't rely on pill buttons as default style.

## Motion

Motion is controlled and cinematic, never noisy.

- Motion level: moderate.
- Durations: 180ms, 260ms, 420ms, 900ms.
- Easings: `ease`, `cubic-bezier(0.22, 1, 0.36, 1)`, `cubic-bezier(0.4, 0, 0.2, 1)`.
- Hover patterns: glow edge, text shift, border trace.
- Scroll patterns: reveal, depth-enter, media-zoom.

### Accessibility

- Honor `prefers-reduced-motion: reduce` with opacity-only transitions.
- Avoid continuous loop motion on text-heavy sections.

## WebGL / Canvas (Optional Layer)

Optional rendering layer for hero backgrounds only. Must include DOM fallback.

- Scene: Full-bleed atmospheric field.
- Effect: Sparse noise haze with deep green accents.
- Motion: Slow breathing pulse.
- Interaction: Subtle pointer drift.
- Render: alpha canvas, DPR clamp, lightweight shader pipeline.

### Techniques

- Noise field + low-frequency wave offset.
- Poster frame fallback image for low-power contexts.
- DOM content remains semantic and fully readable without canvas.

## Implementation Contract

- Native baseline required: HTML + CSS scene must stand alone.
- JS enhancement optional: GSAP/Anime.js only in dedicated integration surfaces.
- Component output must map to Velora attributes and token names.