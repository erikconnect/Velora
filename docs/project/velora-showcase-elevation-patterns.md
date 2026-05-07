# Showcase Elevation & Shadow Patterns Framework Component

**Location**: `packages/css/src/04e-showcase-elevation-patterns.css`

**Imported in**: `packages/css/src/velora.css`

## Overview

A reusable framework component library for displaying shadow depth and elevation systems in showcase/documentation pages.

## Theme Setup

Apply the `showcase-elevation-theme` class to your page container to activate all component theme variables:

```html
<div class="showcase-elevation-theme">
  <!-- Your elevation showcase content -->
</div>
```

This provides:
- Color tokens: `--shd-accent`, `--shd-ink`, `--shd-line`, `--shd-panel-*`, etc.
- Shadow tokens: `--shd-shadow-low`, `--shd-shadow-med`, `--shd-shadow-high`, `--shd-shadow-float`, `--shd-shadow-glow`
- Panel backgrounds: `--shd-panel`, `--shd-panel-elevated`, `--shd-panel-bright`, `--shd-panel-deep`

## Component Patterns

### 1. 3D Plane Stack (Perspective-Based)

For displaying elevation with 3D perspective effect:

```html
<div class="shd-3d-viewport">
  <div class="shd-3d-stack">
    <div class="shd-plane shd-plane-01" vl-effect="hover-depth-press">
      <div class="shd-plane__left">
        <span class="shd-plane__index">01</span>
        <span class="shd-plane__name">Container Low</span>
      </div>
      <span class="shd-plane__right">20px blur<br>alpha 4%</span>
    </div>
    <div class="shd-plane shd-plane-02" vl-effect="hover-depth-press">
      <!-- ... -->
    </div>
    <!-- More planes: shd-plane-03, shd-plane-04 -->
  </div>
</div>
```

**Classes**:
- `.shd-3d-viewport` - Container with perspective
- `.shd-3d-stack` - Flex column layout for stacking
- `.shd-plane` - Base plane element
- `.shd-plane-01`, `.shd-plane-02`, `.shd-plane-03`, `.shd-plane-04` - Elevation variants
- `.shd-plane__left` - Left content group
- `.shd-plane__index` - Numeric index
- `.shd-plane__name` - Layer name
- `.shd-plane__right` - Right detail text

### 2. Layer Stack (Flat Stack)

For displaying layers without 3D perspective:

```html
<div class="showcase-cinema-layer-stack">
  <div class="showcase-cinema-layer-stack__plane showcase-cinema-layer-stack__plane--base">
    <span>Canvas</span>
  </div>
  <div class="showcase-cinema-layer-stack__plane showcase-cinema-layer-stack__plane--surface">
    <span>Surface</span>
  </div>
  <div class="showcase-cinema-layer-stack__plane showcase-cinema-layer-stack__plane--raised">
    <span>Elevated</span>
  </div>
  <div class="showcase-cinema-layer-stack__plane showcase-cinema-layer-stack__plane--accent">
    <span>Primary</span>
  </div>
</div>
```

**Classes**:
- `.showcase-cinema-layer-stack` - Container
- `.showcase-cinema-layer-stack__plane` - Base layer item
- `.showcase-cinema-layer-stack__plane--base` - Background layer
- `.showcase-cinema-layer-stack__plane--surface` - Surface layer
- `.showcase-cinema-layer-stack__plane--raised` - Elevated layer
- `.showcase-cinema-layer-stack__plane--accent` - Primary/accent layer

## UI Component Patterns

### Modal Shell

```html
<div class="shd-modal-shell">
  <div class="shd-modal-head">
    <span class="shd-modal-title">Dialog.tsx</span>
    <span class="shd-modal-close">✕</span>
  </div>
  <div class="shd-modal-line-1"></div>
  <div class="shd-modal-line-2"></div>
  <div class="shd-modal-line-3"></div>
  <div class="shd-modal-actions">
    <div class="shd-modal-btn"></div>
    <div class="shd-modal-btn--primary"></div>
  </div>
</div>
```

### Popover Shell

```html
<div class="shd-popover-shell">
  <div class="shd-popover-row">
    <div class="shd-popover-row-line-a"></div>
    <div class="shd-popover-row-line-b"></div>
  </div>
  <div class="shd-popover-fly">
    <span class="shd-popover-fly-label">On hover</span>
    <div class="shd-popover-fly-line-a"></div>
    <div class="shd-popover-fly-line-b"></div>
  </div>
  <div class="shd-popover-row shd-popover-row--bottom">
    <!-- ... -->
  </div>
</div>
```

### List Shell

```html
<div class="shd-list-shell">
  <div class="shd-list-item shd-list-item--a">
    <div class="shd-list-avatar"></div>
    <div class="shd-list-content">
      <div class="shd-list-line-a"></div>
      <div class="shd-list-line-b"></div>
    </div>
  </div>
  <!-- More items: shd-list-item--b, shd-list-item--c -->
</div>
```

## Spacing & Runtime Utilities

- `.shd-hero__orbit-ring--runtime` - Custom CSS variable injection for orbit animation
- `.shd-heat-bar--offset` - Margin-top: 2rem for heat bar
- `.shd-perf-item__fill--72` - Width: 72% for performance metric fills
- `.shd-inline-metrics` - Margin-top: 2rem
- `.shd-sidecard-offset` - Margin-top: 1.5rem
- `.shd-scene-header` - Margin-bottom: 2.5rem
- `.shd-chip-row` - Margin-top: 1.75rem
- `.shd-spec-stage` - Flex column with 1rem gap
- `.shd-payoff-links` - Margin-top: 3.5rem
- `.shd-mock-title--compact` - Compact margin (0.25rem 0 0.15rem)

## Responsive Behavior

Both patterns have responsive breakpoints:
- **1100px**: Grid/layout adjustments
- **820px**: Reduced perspective, hidden labels, size reductions

## Dark/Light Mode

All components automatically adapt to light and dark themes via framework tokens:
- Background colors use `var(--vl-bg-main)`, `var(--vl-bg-surface)`, etc.
- Text colors use `var(--vl-text-primary)`, `var(--vl-text-secondary)`, `var(--vl-text-muted)`
- Border colors use `var(--vl-border-subtle)`, `var(--vl-border-strong)`

## Integration Example

From `apps/showcase/pages/color/ambient-shadows.html`:

```html
<div class="showcase-ref-page showcase-ref-page--shadows showcase-elevation-theme">
  <!-- Page content uses all component patterns -->
</div>
```

The page-local CSS overrides theme variables and adds page-specific animations, while framework CSS provides base component structure and responsiveness.

## Reusability

To use these components in another showcase page:

1. Add `showcase-elevation-theme` class to your page container
2. Define custom theme variables in page-local `<style>` if needed (optional)
3. Use component markup patterns for elevation/shadow visualizations
4. Add page-specific animations via page-local CSS

All framework components are locked in `velora.css` layer to ensure consistency.
