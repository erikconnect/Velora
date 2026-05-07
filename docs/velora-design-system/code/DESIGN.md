# Design System Specification: Kinetic Elegance

## 1. Overview & Creative North Star

### The Creative North Star: "The Technical Aesthete"
This design system is built on the philosophy of **Kinetic Elegance**. It rejects the bloated, over-engineered patterns of the modern web in favor of a "Browser-First" precision. We are moving away from the "template" look—characterized by generic padding and loud shadows—toward a high-end editorial experience.

The aesthetic is defined by **intentional asymmetry** and **tonal depth**. By utilizing a "Zero JS" approach, the visual language remains sharp and technical, using the browser's native capabilities to create a premium, tactile environment. We don't just display information; we curate it through a lens of sophisticated brutalism and architectural layering.

---

## 2. Colors & Surface Philosophy

The palette is rooted in `oklch()` for superior perceptual uniformity, ensuring that the deep greens and warm creams maintain their "soul" across all display types.

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders are prohibited for sectioning or containment. 
Boundaries must be defined through:
1.  **Background Color Shifts:** Placing a `surface-container-low` section against a `surface` background.
2.  **Tonal Transitions:** Using depth to separate concepts.
3.  **Negative Space:** Utilizing the spacing scale to create implicit boundaries.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine material. Use the surface tiers to create nested importance:
*   **Surface (Base):** The foundational floor (`#0d0f0c`).
*   **Surface-Container-Low:** Subtle recession for secondary content.
*   **Surface-Container-High/Highest:** Use these for active "cards" or floating elements to create a natural, upward lift.

### Glass & Texture
To avoid a "flat" digital feel, employ **Glassmorphism** for floating UI (modals, popovers). 
*   **Token:** Use `surface-container` colors at 70-80% opacity + `backdrop-blur: 12px`.
*   **Gradients:** Main CTAs or Hero backgrounds should use a subtle linear gradient from `primary` to `primary-container` at a 145-degree angle to provide a "machined metal" sheen.

---

## 3. Typography: The Editorial Voice

The contrast between the technical **Space Grotesk** and the humanist **Manrope** creates a "Technical Editorial" rhythm.

*   **Display & Headlines (Space Grotesk):** Use for high-impact messaging. 
    *   *Styling:* Bold weight, `-0.03em` tracking (tight). This creates a "block" of text that feels architectural and authoritative.
*   **Body & Titles (Manrope):** Use for all long-form reading and functional UI. 
    *   *Styling:* Regular to Medium weights. Increase tracking to `0.01em` for body-sm to ensure legibility against dark surfaces.
*   **Labels (Manrope):** All-caps with `0.05em` letter spacing to denote technical data or metadata.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than structural lines.

### The Layering Principle
Stacking tiers creates soft, natural lift. For instance, a `surface-container-lowest` card placed on a `surface-container-low` section creates a recessed, "etched" look. Placing a `surface-container-highest` card on a `surface` base creates a prominent "protruding" effect.

### Ambient Shadows
Shadows should feel like light passing through tinted glass, not black ink.
*   **Opacity:** 4% to 8% maximum.
*   **Blur:** High values (20px - 40px) to simulate a distant light source.
*   **Color:** Use a tinted version of `on-surface` (the cream/green mix) to ensure the shadow feels integrated into the environment.

### The "Ghost Border" Fallback
If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. This creates a "glint" on the edge of the container rather than a heavy stroke.

---

## 5. Components

### Buttons: Kinetic Actuators
*   **Primary:** Background: `primary` (`#bbcbb1`), Text: `on-primary` (`#364430`). High contrast, no border, `sm` (0.125rem) roundedness for a sharp, technical edge.
*   **Secondary:** Background: `secondary-container`, Text: `on-secondary-container`. Subtle and recessed.
*   **Tertiary:** Transparent background, `label-md` typography, underline appears only on hover.

### Inputs & Forms
*   **Surface:** Use `surface-container-highest`.
*   **State:** On focus, transition the "Ghost Border" from 15% to 60% opacity using a `primary` tint.
*   **Validation:** Error states use `error` (`#ed7f64`) for text, but the container should use a subtle `error-container` fill to avoid "vibrating" against the dark background.

### Cards & Lists
*   **Constraint:** Zero dividers.
*   **Separation:** Use `48px` to `64px` of vertical white space to separate list groups. 
*   **Interaction:** On hover, a card should shift from `surface-container-low` to `surface-container-high` with a `0.2s` ease-out transition.

### Contextual Tooltips & Popovers
*   **Style:** Full glassmorphism. Semi-transparent `surface-bright` with a heavy backdrop blur. This allows the underlying "Kinetic Green" accents to bleed through, maintaining a sense of place.

---

## 6. Do's and Don'ts

### Do
*   **DO** use extreme typographic scale. Pair a `display-lg` headline with `body-sm` metadata for high-end contrast.
*   **DO** embrace "Negative Space." Let the `Surface Noir` breathe; it is a luxury material, not just a background.
*   **DO** use the `primary` (Kinetic Green) sparingly. It is a laser-sight, not a paint bucket.

### Don't
*   **DON'T** use 100% white. Always use `on-surface` (Velora Cream) to maintain the warmth and premium feel.
*   **DON'T** use `rounded-full` for anything other than small chips or tags. Rectilinear shapes with `sm` or `md` corners feel more architectural and "technical."
*   **DON'T** use standard CSS drop shadows. If a shadow doesn't look like ambient light, remove it.