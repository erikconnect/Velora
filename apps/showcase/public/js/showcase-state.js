/**
 * showcase-state.js — Velora Showcase
 * Runs synchronously in <head> to apply stored theme/editorial/transition to
 * <html> before first paint, preventing any flash of unstyled content (FOUC).
 *
 * Priority chain: localStorage → html attribute default → hardcoded fallback.
 * All values are sanitized against an allowlist before being written to the DOM.
 *
 * This file is NOT part of the Velora CSS framework — showcase tooling only.
 */
(function () {
  const root = document.documentElement;
  const ls   = localStorage;

  const ALLOWED_THEMES      = ['light', 'dark', 'auto'];
  const ALLOWED_EDITORIAL   = ['noir', 'earth', 'aethel', 'meridian'];
  const ALLOWED_TRANSITIONS = ['cinema', 'wipe', 'glide', 'iris', 'snap'];

  const EDITORIAL_META = {
    noir:     { pack: 'velora-noir',     theme: 'dark'  },
    earth:    { pack: 'velora-earth',    theme: 'light' },
    aethel:   { pack: 'velora-aethel',  theme: 'dark'  },
    meridian: { pack: 'velora-meridian', theme: 'dark'  },
  };

  function sanitize(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  // ── Editorial theme (takes priority — it also controls data-theme) ──────
  const savedEditorial = ls.getItem('vl-editorial-theme');
  if (savedEditorial && ALLOWED_EDITORIAL.includes(savedEditorial)) {
    const meta  = EDITORIAL_META[savedEditorial];
    root.setAttribute('data-editorial-theme', savedEditorial);
    root.setAttribute('data-theme-pack', meta.pack);
    root.setAttribute('data-theme', meta.theme);
  } else {
    // ── Standalone theme ──────────────────────────────────────────────────
    const savedTheme = ls.getItem('vl-theme');
    const theme = sanitize(
      savedTheme || root.getAttribute('data-theme'),
      ALLOWED_THEMES,
      'auto'
    );
    if (theme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }

  // ── Page transition ───────────────────────────────────────────────────────
  const savedTransition = ls.getItem('vl-page-transition');
  const transition = sanitize(
    savedTransition || root.getAttribute('vl-page-transition'),
    ALLOWED_TRANSITIONS,
    'cinema'
  );
  root.setAttribute('vl-page-transition', transition);
})();
