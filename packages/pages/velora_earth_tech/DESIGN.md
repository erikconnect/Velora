# Design System Strategy: Warm & Technical Editorial

## 1. Overview & Creative North Star: "The Human Laboratory"
This design system moves away from the cold, sterile nature of traditional technical interfaces. Our Creative North Star is **"The Human Laboratory"**—a space where scientific precision meets organic warmth. We are moving from the high-contrast "Surface Noir" into a sophisticated, editorial world that feels like a premium print journal or a high-end architectural studio.

To break the "standard template" look, we prioritize:
*   **Intentional Asymmetry:** Avoid perfectly centered layouts. Use offset text blocks and asymmetrical negative space to create a rhythmic, editorial flow.
*   **The Technical Whisper:** We use monospace-adjacent headlines (Space Grotesk) to signal precision, but wrap them in soft, warm-toned containers to signal accessibility.
*   **Organic Brutalism:** Use large, bold type scales and sharp corners (low roundedness) balanced against the "human" softness of the cream and moss-green palette.

## 2. Colors: Tonal Depth over Linework
This system is defined by its warmth and the total absence of traditional borders. We rely on "chromatic layering" to define hierarchy.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Boundaries must be established through shifts in background tokens. For example, a main content area using `surface` (#fbf9f4) should transition into a sidebar or footer using `surface-container-low` (#f5f3ee). This creates "implied edges" that feel more sophisticated than rigid strokes.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine, recycled paper. 
*   **Base:** Use `surface` for the primary canvas.
*   **Elevation 1:** Use `surface-container` (#f0eee9) for primary content blocks.
*   **Elevation 2 (Internal):** Use `surface-container-high` (#eae8e3) for nested elements like input fields or inner cards.
*   **Floating Elements:** Use `surface-container-lowest` (#ffffff) for elements that need to "pop" with a clean, crisp finish.

### The Glass & Gradient Rule
To prevent a flat "flat-design" look, use `surface-tint` (#556252) at low opacities (5-10%) with a `backdrop-blur` of 20px for global navigation or modals. For main CTAs, use a subtle linear gradient from `primary` (#182317) to `primary_container` (#2d392b) at a 135-degree angle to add a "signature sheen."

## 3. Typography: The Editorial Voice
Our typography pairing is a dialogue between the industrial and the artisanal.

*   **Display & Headlines (Space Grotesk):** This is our "Technical" voice. Its geometric, open apertures suggest clarity and engineering. Use `display-lg` and `headline-lg` with tight letter-spacing (-0.02em) to create an authoritative, editorial header style.
*   **Body & Titles (Manrope):** This is our "Human" voice. Manrope provides a contemporary, warm readability. Use `body-lg` (1rem) for long-form text with a generous line-height (1.6) to ensure the interface feels "inviting" and airy.
*   **The Precision Label:** Use `label-md` in `on_tertiary_container` for metadata or technical specs. This creates a distinct visual layer that looks like a technical annotation on an architectural plan.

## 4. Elevation & Depth: Tonal Layering
We reject the heavy drop-shadows of early web design. Depth in this system is achieved through "Tonal Stacking."

*   **The Layering Principle:** To lift a card, do not add a shadow. Instead, place a `surface-container-lowest` card on a `surface-container-low` background. The subtle shift from #f5f3ee to #ffffff provides a sophisticated, natural lift.
*   **Ambient Shadows:** If an element must float (e.g., a dropdown or modal), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(27, 28, 25, 0.06)`. The shadow color is derived from `on_surface` to keep it grounded in the palette.
*   **The Ghost Border Fallback:** If accessibility requires a stroke, use the `outline_variant` (#c4c8bf) at **15% opacity**. It should be felt, not seen.

## 5. Components: Precision & Soul

### Buttons
*   **Primary:** Background: `primary` (#182317) | Text: `on_primary`. Shape: `DEFAULT` (0.25rem) for a sharp, technical look.
*   **Secondary:** Background: `secondary_container` (#e0e5d3) | Text: `on_secondary_container`. Use this for lower-priority actions to maintain the "Warm" feel.
*   **Tertiary:** No background. Use `label-md` (Manrope) in `primary` with a 1px underline that appears only on hover.

### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Execution:** Separate list items by increasing vertical padding (using 1.5rem spacing) and using a subtle hover state shift to `surface-container`.
*   **Technical Detail:** Add a small "01", "02" index in `label-sm` (Space Grotesk) to list items to lean into the "Technical" brand voice.

### Input Fields
*   **Style:** Filled, not outlined. Use `surface-container-high` as the background with a bottom-only border of 1px using `outline` (#747871) only when focused. This mimics a signature line on a document.

### Chips
*   **Style:** Small, rectangular (roundedness: `sm`). Use `tertiary_container` (#403426) for a deep, earthy accent that contrasts against the cream surfaces.

## 6. Do’s and Don’ts

### Do:
*   **Do** use massive amounts of negative space. If you think there is enough space, double it.
*   **Do** align text to a strict baseline grid to maintain the "Technical" precision.
*   **Do** use `primary` (Deep Green) for text rather than pure black to keep the "Warm" tone.

### Don't:
*   **Don't** use `9999px` (full) roundedness for buttons. It feels too "app-like" and destroys the editorial vibe. Stick to `DEFAULT` or `none`.
*   **Don't** use high-contrast dividers. They clutter the technical "clarity" of the system.
*   **Don't** use bright, saturated colors. This system lives in the muted, earthy, and sophisticated range.