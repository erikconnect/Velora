# Design Token Catalog — Velora

All tokens use the `--vl-*` prefix and are declared in `packages/css/src/00-tokens.css`.

## Colors

```css
/* Brand palette */
--vl-brand-stone
--vl-brand-olive
--vl-brand-moss
--vl-brand-deep

/* Semantic — surface */
--vl-bg-main
--vl-bg-surface
--vl-bg-surface-elevated
--vl-bg-inset

/* Semantic — text */
--vl-text-primary
--vl-text-secondary
--vl-text-muted
--vl-text-inverse

/* Semantic — accent */
--vl-color-primary
--vl-color-secondary
--vl-color-accent
--vl-color-success
--vl-color-warning
--vl-color-danger
```

All colors use OKLCH and `color-mix(in oklch, ...)` for automatic tinting.

## Spacing

```css
--vl-space-2xs:  0.125rem   /*  2px */
--vl-space-xs:   0.25rem    /*  4px */
--vl-space-sm:   0.5rem     /*  8px */
--vl-space-md:   1rem       /* 16px */
--vl-space-lg:   2rem       /* 32px */
--vl-space-xl:   4rem       /* 64px */
--vl-space-2xl:  6rem       /* 96px */
--vl-space-3xl:  8rem       /* 128px */
```

## Typography

```css
/* Font families */
--vl-font-family          /* Manrope / Plus Jakarta Sans — body */
--vl-font-family-display  /* Space Grotesk — headings */
--vl-font-family-mono     /* JetBrains Mono — code */

/* Sizes (fluid via clamp()) */
--vl-font-size-xs
--vl-font-size-sm
--vl-font-size-base
--vl-font-size-lg
--vl-font-size-xl
--vl-font-size-2xl
--vl-font-size-3xl
--vl-font-size-4xl

/* Weights */
--vl-font-weight-normal:    400;
--vl-font-weight-medium:    500;
--vl-font-weight-semibold:  600;
--vl-font-weight-bold:      700;

/* Line heights */
--vl-line-height-tight:    1.2;
--vl-line-height-snug:     1.35;
--vl-line-height-normal:   1.5;
--vl-line-height-relaxed:  1.65;

/* Letter spacing */
--vl-tracking-tight:    -0.02em;
--vl-tracking-normal:    0;
--vl-tracking-wide:      0.04em;
--vl-tracking-display:   0.06em;
```

## Border Radius

```css
--vl-radius-sm    /* ~4px */
--vl-radius-md    /* ~8px */
--vl-radius-lg    /* ~12px */
--vl-radius-xl    /* ~16px */
--vl-radius-2xl   /* ~24px */
--vl-radius-full  /* 999px */
```

## Container Query Breakpoints

```css
--vl-cq-sm:  36rem   /* ~576px */
--vl-cq-md:  48rem   /* ~768px */
--vl-cq-lg:  56rem   /* ~896px */
--vl-cq-xl:  72rem   /* ~1152px */
```

## Motion Tokens

See [motion-reference.md](./motion-reference.md) for the full motion token list.
