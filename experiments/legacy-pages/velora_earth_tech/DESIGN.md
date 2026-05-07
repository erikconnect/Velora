---
version: "beta"
name: "Velora Earth Tech - Warm Analytical System"
description: "Earth Tech mode for analytical and product storytelling interfaces. Balances technical precision with warm editorial surfaces and native-first motion."
colors:
	primary: "#182317"
	secondary: "#CFC9B8"
	tertiary: "#6A7D57"
	neutral: "#FBF9F4"
	background: "#FBF9F4"
	surface: "#F0EEE9"
	text-primary: "#1B1C19"
	text-secondary: "#556252"
	accent: "#2D392B"
typography:
	display-lg:
		fontFamily: "Space Grotesk"
		fontSize: "64px"
		fontWeight: 600
		lineHeight: "68px"
		letterSpacing: "-0.02em"
	body-md:
		fontFamily: "Manrope"
		fontSize: "16px"
		fontWeight: 400
		lineHeight: "26px"
	label-md:
		fontFamily: "Manrope"
		fontSize: "12px"
		fontWeight: 600
		lineHeight: "16px"
		letterSpacing: "0.04em"
rounded:
	sm: "4px"
	md: "8px"
	lg: "14px"
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
		textColor: "#F5F3EE"
		background: "#182317"
		rounded: "{rounded.sm}"
		padding: "12px 18px"
	card:
		background: "#FFFFFF"
		rounded: "{rounded.lg}"
		padding: "{spacing.card-padding}"
---

## Overview

- Composition cues:
	- Layout: Modular editorial grid
	- Content Width: Full bleed with contained reading lanes
	- Framing: Paper-like tonal stacking
	- Grid: Strong and annotation-friendly

Creative direction is "Human Laboratory": precise, calm, and professional. Interfaces should feel clear and approachable, with technical confidence but no sterile look.

## Colors

The system is warm-light by default. Hierarchy is defined by tonal contrast and spacing, not by hard borders.

- Primary (#182317): Main actions and high-importance labels.
- Secondary (#CFC9B8): Soft accent and editorial highlight.
- Tertiary (#6A7D57): Supporting accent for data or tags.
- Neutral (#FBF9F4): Main background and reading surface.

- Usage: Background #FBF9F4, Surface #F0EEE9, Text Primary #1B1C19, Text Secondary #556252, Accent #2D392B.

### No-Line Rule

Avoid divider lines whenever possible. Prefer:
- Surface tone transitions.
- Generous white-space separators.
- Subtle shadow and blur on floating controls.

### Recommended Gradients

- `linear-gradient(135deg, rgba(24, 35, 23, 0.94), rgba(45, 57, 43, 0.86))`
- `linear-gradient(180deg, rgba(251, 249, 244, 0.9), rgba(240, 238, 233, 0.9))`

## Typography

Typography combines technical heading presence with comfortable long-form reading.

- Display (`display-lg`): Space Grotesk, 64px, 600, tight tracking.
- Body (`body-md`): Manrope, 16px, 400, line-height 26px.
- Labels (`label-md`): Manrope, 12px, 600, tracking 0.04em.

### Editorial Rules

- Keep metadata small and structured.
- Use sentence-case for explanatory text.
- Apply heading scale consistently across sections to support scanning.

## Layout

Layout should support storytelling and explainability.

- Layout type: Modular grid with annotation rails.
- Content width: Full bleed sections + constrained text lanes.
- Base unit: 8px.
- Scale: 8px, 16px, 24px, 32px, 40px, 48px.
- Section padding: 48px desktop, 24px mobile.

## Elevation & Depth

Depth is subtle and paper-like.

- Surface style: Tonal paper stack.
- Borders: Optional 1px ghost edge (`rgba(85, 98, 82, 0.18)`) only when needed.
- Shadows:
	- `0 20px 40px rgba(27, 28, 25, 0.06)`
	- `0 8px 20px rgba(27, 28, 25, 0.04)`
- Blur: 12px to 20px for glass overlays.

### Techniques

- Offset cards on lighter surfaces to create natural lift.
- Use gradient border shell on hero panels.
- Preserve soft depth transitions during motion states.

## Shapes

- Corner radii: 4px, 8px, 14px, 9999px.
- Icon treatment: Linear with consistent 1.5px to 2px stroke.
- Icon sets: Solar or neutral geometric set.

## Components

### Buttons

- Primary: Deep green fill, cream text, compact radius.
- Secondary: Soft container fill with dark text.
- Tertiary: Text-only with thin underline on interaction.

### Cards and Lists

- Card surface: white or low-contrast neutral.
- Radius: 14px.
- Padding: 24px.
- List separation: spacing and subhead markers, no heavy dividers.

### Inputs

- Filled input style by default.
- Focus ring uses primary tint and soft glow.
- Error state uses muted error containers rather than aggressive outlines.

## Do's and Don'ts

### Do

- Do keep generous spacing and readable text density.
- Do prefer tonal hierarchy over borders.
- Do keep interactions calm and purposeful.

### Don't

- Don't use saturated accent explosions.
- Don't collapse spacing in data-dense sections.
- Don't mix unrelated shadow recipes.

## Motion

Motion is restrained and interface-led.

- Motion level: minimal to moderate.
- Durations: 160ms, 240ms, 320ms, 700ms.
- Easings: `ease`, `cubic-bezier(0.4, 0, 0.2, 1)`.
- Hover patterns: text emphasis, soft surface raise.
- Scroll patterns: parallax-lite, reveal, range-based progress.

### Accessibility

- Respect `prefers-reduced-motion: reduce`.
- Replace transforms with opacity and color transitions in reduced mode.

## WebGL / ThreeJS (Optional Layer)

Optional for hero storytelling or atmospheric backgrounds only.

- Scene: Full-bleed analytical field.
- Effect: low-noise terrain haze or dot matrix drift.
- Motion: slow breathing + mild orbital behavior.
- Interaction: pointer-reactive drift with strict movement caps.
- Render: alpha canvas, antialias, DPR clamp.

### Techniques

- DOM-first content, canvas as background layer.
- Poster frame fallback for unsupported or low-power contexts.
- No critical information rendered only in canvas.

## Implementation Contract

- Native baseline required: all sections work with plain HTML/CSS.
- Integration layer optional: GSAP/Anime.js only in dedicated integration pages.
- Components must map to Velora tokens and motion attributes.