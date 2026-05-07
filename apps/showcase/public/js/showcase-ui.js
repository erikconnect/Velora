/**
 * showcase-ui.js — Velora Showcase
 * Binds the showcase header controls (theme toggle, editorial palette, page-
 * transition selector, mobile drawer) to the state already applied by
 * showcase-state.js.
 *
 * Place this script at the end of <body> (after the DOM is ready).
 * This file is NOT part of the Velora CSS framework — showcase tooling only.
 */
(function () {
  const root = document.documentElement;
  const ls   = localStorage;

  const THEME_KEY      = 'vl-theme';
  const TRANSITION_KEY = 'vl-page-transition';
  const EDITORIAL_KEY  = 'vl-editorial-theme';

  const ALLOWED_EDITORIAL   = ['noir', 'earth', 'aethel', 'meridian'];
  const ALLOWED_TRANSITIONS = ['cinema', 'wipe', 'glide', 'iris', 'snap'];

  const EDITORIAL_META = {
    noir:     { pack: 'velora-noir',     theme: 'dark'  },
    earth:    { pack: 'velora-earth',    theme: 'light' },
    aethel:   { pack: 'velora-aethel',  theme: 'dark'  },
    meridian: { pack: 'velora-meridian', theme: 'dark'  },
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  function syncThemeButtons(theme) {
    document.querySelectorAll('.ds-theme-btn').forEach(btn => {
      const active = btn.dataset.dsTheme === theme;
      btn.classList.toggle('is-active', active);
      btn.classList.toggle('vl-badge--accent', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function applyTheme(theme) {
    if (theme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    ls.setItem(THEME_KEY, theme);
    syncThemeButtons(theme);
  }

  function applyEditorial(value, { persist = true, syncThemeToggle = true } = {}) {
    const v     = ALLOWED_EDITORIAL.includes(value) ? value : 'noir';
    const meta  = EDITORIAL_META[v];

    root.setAttribute('data-editorial-theme', v);
    root.setAttribute('data-theme-pack', meta.pack);
    root.setAttribute('data-theme', meta.theme);

    if (persist) {
      ls.setItem(EDITORIAL_KEY, v);
      ls.setItem(THEME_KEY, meta.theme);
    }
    if (syncThemeToggle) syncThemeButtons(meta.theme);

    // Sync all editorial selects on the page (desktop + mobile)
    document.querySelectorAll('.ds-editorial-select').forEach(sel => {
      sel.value = v;
    });
  }

  function applyTransition(value) {
    const v = ALLOWED_TRANSITIONS.includes(value) ? value : 'cinema';
    root.setAttribute('vl-page-transition', v);
    ls.setItem(TRANSITION_KEY, v);
    document.querySelectorAll('.ds-vt-select').forEach(sel => {
      sel.value = v;
    });
  }

  // ── Boot: sync UI controls to current state ───────────────────────────────
  const currentTheme      = root.getAttribute('data-theme') || 'auto';
  const currentEditorial  = root.getAttribute('data-editorial-theme') || '';
  const currentTransition = root.getAttribute('vl-page-transition') || 'cinema';

  syncThemeButtons(currentTheme);
  document.querySelectorAll('.ds-vt-select').forEach(sel => {
    sel.value = currentTransition;
  });
  if (currentEditorial) {
    document.querySelectorAll('.ds-editorial-select').forEach(sel => {
      sel.value = currentEditorial;
    });
  }

  // ── Theme buttons ─────────────────────────────────────────────────────────
  document.querySelectorAll('.ds-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.dsTheme || 'auto';
      applyTheme(theme);
      if (theme === 'light') {
        applyEditorial('earth', { syncThemeToggle: false });
      } else if (theme === 'dark') {
        applyEditorial('noir', { syncThemeToggle: false });
      } else if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyEditorial(prefersDark ? 'noir' : 'earth', { syncThemeToggle: false });
      }
    });
  });

  // ── Editorial selects ─────────────────────────────────────────────────────
  document.querySelectorAll('.ds-editorial-select').forEach(sel => {
    sel.addEventListener('change', e => {
      applyEditorial(e.target.value, { syncThemeToggle: true });
    });
  });

  // ── Transition selects ────────────────────────────────────────────────────
  document.querySelectorAll('.ds-vt-select').forEach(sel => {
    sel.addEventListener('change', e => {
      applyTransition(e.target.value);
    });
  });

  // ── Mobile drawer (hamburger menu) ────────────────────────────────────────
  const header  = document.querySelector('.vl-header');
  const menuBtn = document.querySelector('.vl-header__menu-btn');
  const drawer  = document.querySelector('.vl-header__drawer');

  if (header && menuBtn && drawer) {
    function openDrawer() {
      header.setAttribute('data-menu-open', '');
      menuBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }

    function closeDrawer() {
      header.removeAttribute('data-menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }

    menuBtn.addEventListener('click', () => {
      header.hasAttribute('data-menu-open') ? closeDrawer() : openDrawer();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && header.hasAttribute('data-menu-open')) {
        closeDrawer();
        menuBtn.focus();
      }
    });
  }
})();
