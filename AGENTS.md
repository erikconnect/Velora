## Learned User Preferences

- Prefer communication in Portuguese.
- Zero-JS motion is non-negotiable: never introduce JS animation runtimes; keep the CSS-only / HTML+CSS path.
- Treat Velora as a declarative CSS motion runtime and modern reference—not a utility framework; prioritize positioning, consistency, technical demos, and perceived value over feature volume.
- Prefer evaluate-then-plan against the execution roadmap before large changes; often wants page-by-page reformulation using Velora CSS and the Showcase template.
- Showcase pages should feel cinematic and exercise the design system plus motion catalog resources, not generic or simplistic layouts.
- Prefer complex, coordinated scenes (3D stages, large type, enter/exit choreography, horizontal/stacked sections) over sparse section layouts.
- Keep showcase UI patterns consistent across pages; avoid exaggerated glow and one-off chrome that breaks the shared look.
- Stage 3D should be a reusable CSS-only stage contract (perspective/preserve-3d on the container; positional transforms via CSS vars on items; motion on inner content), not cube-triad-specific demos; preserve text-ring-orbit and circle-text-scroll.
- Aim for GSAP-like scene authorship in HTML/CSS (shared scene clock, relative timing, pin+scrub)—preferred product direction for the scene engine.
- Core motion must stay host-agnostic and work with any UI (Tailwind and others); **Skins** is the product name for the Velora design-system layer (named themes via `data-editorial-theme`); Showcase is the cinematic reference UI, not the motion contract.
- Prefer modern CSS capabilities (e.g. `if()`, typed `attr()`, `sibling-index()`) as progressive enhancement for scene choreography.
- Prefer fixing contract/consistency before expanding demos; prefer a lean public Showcase that archives surplus pages in-repo rather than deleting Skins/DS work; reuse existing motion examples rather than inventing parallel systems.

## Learned Workspace Facts

- Monorepo layout: canonical CSS in `packages/css/src/`; Vite playground in `apps/showcase/`; Astro docs app in `apps/docs/`; markdown source of truth in repo-root `docs/`; plus `design-system/`, `examples/`, `experiments/`, and `starters/html-css-minimal/`.
- Always edit CSS in `packages/css/src/` and sync to showcase (`pnpm sync:showcase-css`); `apps/showcase/public/css/` is derived and must not be edited as source.
- Motion is attribute-driven (`vl-effect`, `vl-timeline`, `vl-range`, `vl-scene`, related `vl-*`); rules live in ordered `@layer velora.*` (reset → tokens → layout → motion → components → transitions → utilities → overrides).
- Product surfaces split: Velora core = scene/motion engine; Showcase = cinematic reference UI/DS; docs site documents the framework once the API is stable.
- `@velora/css` ships separable entrypoints: `motion-core` (host-agnostic engine) vs `theme` / full bundle (visual Skins); editorial skins use `html[data-editorial-theme]` (e.g. noir, earth, aethel, meridian).
- Lean Showcase restarts should snapshot retired pages under a dated in-repo `archive/` (outside live Vite registry and contract checks), not delete recoverable DS/skin work.
- Workspace tooling is pnpm + Turborepo; common checks include `pnpm verify:contract` and showcase CSS drift checks.
- Root `AGENTS.md` holds learned memory only; agent operating instructions live under `docs/agents/AGENTS.md` and must not be mixed into the learned-memory file.
