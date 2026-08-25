# Velora Skin Contract

A Skin is a complete design-system model. It is not a palette preset. Core owns
behavior; a Skin gives that behavior a recognizable product voice; Showcase proves the
combination with real semantic interfaces.

## Ownership boundary

| Layer | Owns | Must not own |
| --- | --- | --- |
| Core | attributes, timelines, states, fallbacks, reduced motion | brand, component anatomy, editorial layout |
| Skin | color, type, spacing, grid, geometry, material, media, component voice, motion tokens | new behavioral attributes or JavaScript animation |
| Showcase | narrative, examples, art direction, comparison | private framework behavior or one-off inline APIs |

## Required token families

Every named Skin must define coherent values for:

- color and color scheme;
- body, display and mono typography;
- type weight, line-height and tracking;
- spacing scale, density and content width;
- grid columns and gaps;
- radii, border weight, elevation, blur and surface opacity;
- media aspect ratio and treatment;
- motion distance, duration and easing;
- light/dark intent and accessible contrast.

The shared contract includes `--vl-skin-content-max`, `--vl-skin-grid-columns`,
`--vl-skin-grid-gap`, `--vl-skin-density`, `--vl-skin-border-width`,
`--vl-skin-media-ratio`, `--vl-skin-media-filter`, and `--vl-skin-surface-alpha`.
Skins also retoken the existing `--vl-*` typography, spacing, geometry, elevation and
motion families; they do not introduce parallel component behavior.

## Named models

- **Noir:** dark cinematic base, kinetic green, measured depth and long editorial landings.
- **Earth:** warm light laboratory, organic spacing, softer geometry and restrained motion.
- **Aethel:** architectural black, copper massing, dense grid and decisive motion.
- **Meridian:** terrain intelligence, cartographic lines, translucent fields and spatial drift.

## Acceptance rules

1. The same semantic product markup must remain understandable under every Skin.
2. Switching Skin may change composition through tokens and documented recipes, never by
   forking Core behavior.
3. Motion personality can change distance, duration and easing, but always honors
   `prefers-reduced-motion`.
4. A Skin preview must demonstrate typography, hierarchy, media, component anatomy and
   motion voice—not only swatches.
5. Showcase-local styling cannot become an undocumented requirement for consumers.
