# Elementor + Velora

Elementor does not need a Velora plugin. Treat Velora as **CSS + HTML attributes** on widgets.

## 1. Load motion-core

**Site Settings → Custom Code → Head** (or theme enqueue):

```html
<link rel="stylesheet" href="/wp-content/themes/your-theme/assets/css/velora-motion-core.css" />
```

Copy `packages/css/dist/motion-core.css` into your child theme assets.

## 2. HTML widget / container

On a Container or HTML widget, add attributes in **Advanced → Attributes** (Elementor Pro) or use a shortcode wrapper:

```html
<section vl-in-view>
  <h2 vl-enter="fade-up">Product story</h2>
  <p vl-enter="fade-up" vl-delay="100ms">Motion is CSS-only — no ScrollTrigger.</p>
</section>
```

## 3. Pinned scenes

For `vl-scene` + `vl-timeline="view"` pin+scrub, prefer a full-width container with sufficient scroll height in the template — Elementor section height controls the scroll runway.

## 4. Reduced motion

Velora handles OS `prefers-reduced-motion`. Avoid Elementor motion effects on the same nodes — they fight the cascade.

## 5. Skins

Optional: enqueue `theme.css` and set `data-editorial-theme="noir"` on `<html>` if you want Velora editorial tokens. Most Elementor sites keep their own design system and use **motion-core only**.
