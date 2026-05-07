# Library Redesign Design

## Goal
Redesign `apps/showcase/pages/library` so the Library feels like a curated Velora documentation system rather than a raw port of `packages/pages`, while staying inside the existing design system, motion vocabulary, and shared site shell.

## Approved Direction
- Visual direction: hybrid
- Primary emphasis: layout and motion in balanced proportion
- Scaling strategy: family of templates, not one universal template and not fully bespoke page-by-page design
- Delivery scope: apply the new family across the full Library in this phase
- Recommended approach approved: hybrid editorial controlled

## Problem Statement
The current Library pages already contain valuable content, but most of them read like imported HTML with shared typography layered on top. The result is structurally correct but visually flat:
- weak contextual hero treatment
- limited orientation once a reader enters a page
- long uninterrupted reading flow
- inconsistent sense of hierarchy between documentation, demos, and tools
- motion applied at the markup level, but without a deliberate editorial rhythm

## Design Goals
1. Make the Library feel authored and intentional.
2. Preserve readability for long-form technical content.
3. Improve scanability and orientation on long pages.
4. Use motion to guide reading, not decorate it.
5. Reuse Velora tokens, surfaces, typography, and `vl-*` patterns instead of inventing a parallel system.
6. Make the redesign scalable across all generated Library pages.

## Non-Goals
- Rewriting the substantive copy of every Library page
- Replacing the global header/footer shell
- Introducing a new branding language outside Velora
- Adding heavy JavaScript-driven page behaviors as a dependency for core reading
- Turning every Library page into a bespoke showcase page

## Visual Thesis
The Library should feel like a technical publication with product-grade art direction: a strong editorial top, a precise and highly legible technical body, and restrained motion that creates depth and progression.

## Content Model
Each Library page should be reframed into a guided reading structure instead of a plain article dump.

### Shared Reading Flow
1. Hero context
2. Summary or orientation rail
3. Main content bands
4. Related reading or next-step navigation

### Hero Context
Each page gets a top section that establishes:
- category or template type
- page title
- short lead
- 2-3 quick signals such as theme, topic, or reading type

The hero should feel stronger than the current intro note, but should remain compact enough that documentation still starts early in the page.

### Summary / Orientation Rail
Immediately below the hero, pages can include one or more of:
- compact summary of what the page covers
- section anchors / TOC
- related path back to the Library index
- “read next” links for adjacent docs

This layer is more utilitarian than the hero and should support fast orientation.

### Main Content Bands
The main article body should be visually segmented into readable bands:
- thesis / introduction
- principles / highlights
- technical explanation
- example or demo blocks
- conclusion / related reading

This does not require rewriting all HTML semantics. The generator and shared CSS can wrap or style existing structures so the content reads in sections with clearer rhythm.

## Template Family
The redesign uses four reusable templates.

### 1. Spec Template
Use for architecture, tokens, color system, typography, accessibility, and foundational references.

Characteristics:
- compact hero
- structured summary rail
- optional sticky TOC on long pages
- dense but highly legible content rhythm
- final related-spec section

Desired feel:
authoritative, systematic, refined

### 2. Showcase Template
Use for pages focused on examples, motion systems, demonstrations, and exploratory content.

Characteristics:
- more visual hero
- “what you are seeing” framing near the top
- interleaving between demos and explanation
- stronger motion moments than spec pages
- related demos at the end

Desired feel:
dynamic, premium, controlled

### 3. Tool Template
Use for pages that behave like operational references or utilitarian explainers.

Characteristics:
- faster top-level orientation
- strong quick-nav or anchor affordance
- denser section headers
- higher scanability
- focused usage panels and constraints

Desired feel:
fast, practical, crisp

### 4. Editorial Template
Use for narrative or conceptual pages with a more atmospheric reading mode.

Characteristics:
- more expressive hero
- larger visual pauses between sections
- optional pull-quote or thesis blocks
- broader spacing rhythm
- softer but still structured flow

Desired feel:
manifesto-like, curated, but still disciplined

## Motion System
Motion should support hierarchy, depth, and reading progression.

### Motion Principles
- noticeable but restrained
- consistent across the Library
- content-first
- progressive enhancement
- minimal variance in effect families

### Approved Motion Roles
1. Entrance sequencing in the hero
2. Scroll/view-based reveal rhythm across sections
3. Hover and active feedback for linked or interactive blocks
4. Sticky depth cues for orientation layers such as TOC or summary rail

### Entrance Sequence
At page top:
- label or category enters first
- title enters second with the strongest presence
- lead enters third
- summary rail or metadata follows with a small delay

### In-Flow Motion
In long content:
- use `fade-up`, `flow-in`, and `clip-rise` as the primary reveal families
- use `vl-children="stagger"` for groups of related highlights
- reserve stronger depth transforms for showcase pages and selected hero moments

### Hover / Interaction
For related-reading cards, anchors, and clickable reference blocks:
- clearer hover elevation or tonal shift
- small transform response where appropriate
- stronger active state clarity
- consistent affordance language across all Library pages

### Motion Limits
- no mass animation on every block
- no effect soup
- no highly ornamental 3D or kinetic effects on pure reference pages
- reduced-motion behavior must remain acceptable

## Layout System
The redesign should keep the central reading axis but add controlled supporting structure.

### Core Layout Principles
- preserve a readable main content width
- allow wider contextual bands near the top
- use asymmetry sparingly and only where it improves orientation
- prefer bands, rails, dividers, and tonal surfaces over excessive card grids

### Global Library Index
`pages/library/index.html` should become a proper front door:
- stronger hero
- clearer explanation of what the Library is
- curation of featured pages
- better grouping by template or category
- improved card hierarchy and hover behavior

## Styling Rules
The redesign must derive from the existing Velora system:
- keep shared shell from `index.html`
- use current fonts and token variables
- use tonal surfaces and borders already present in the framework
- extend `library-doc-content.css` rather than creating a disconnected page-specific style language

The redesign should feel like a stronger composition of the current system, not a new skin.

## Implementation Shape
The implementation should be system-first, even though the delivery covers the whole Library.

### Likely Change Areas
- `apps/showcase/public/css/library-doc-content.css`
- `apps/showcase/scripts/port-packages-pages.mjs`
- `apps/showcase/pages/library/index.html` generation logic
- optional shared metadata map to classify each Library page into `spec`, `showcase`, `tool`, or `editorial`

### Generator Responsibilities
The generator should evolve from “port article content into a shell” to “port content into a typed Library page layout”.

Expected responsibilities:
- assign template type per page
- emit hero and orientation structure
- wrap main content in stronger layout regions
- add related-reading affordances
- improve title normalization where raw filenames currently leak through

## Testing / Verification Expectations
When implementation begins, verification should include:
- visual check of the Library index
- spot check at least one page from each template family
- desktop and mobile checks for hero spacing and reading flow
- reduced-motion sanity check
- confirmation that generated pages still use the current shared shell

## Open Decisions Resolved In This Design
- Library should be hybrid, not purely editorial and not purely technical
- Templates should be a family, not one rigid layout and not unconstrained per-page design
- Motion should be elevated, but within the existing Velora language
- The first implementation phase should cover the full Library, not just a pilot subset

## Risks
- Over-styling could reduce documentation clarity
- Too much template variance could fragment the Library
- Generator changes could improve some pages while making edge-case legacy markup look worse

## Mitigations
- Keep the body reading width disciplined
- Limit motion families
- Use the same contextual building blocks across all templates
- Validate one representative page per template family before considering the rollout complete

## Success Criteria
- The Library index feels curated rather than merely generated
- Individual Library pages have clearer entry, orientation, and ending states
- Long pages are easier to scan and less visually monotonous
- Motion feels intentional and consistent
- The final result still reads unmistakably as Velora
