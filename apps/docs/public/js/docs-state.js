/**
 * docs-state.js — Velora Docs (Astro)
 * Applies stored editorial/theme/transition before first paint (FOUC guard).
 * Shares localStorage keys with Showcase for consistent Skins across sites.
 * NOT part of @velora/css — docs tooling only.
 */
(function () {
  const root = document.documentElement;
  const ls = localStorage;

  const ALLOWED_THEMES = ["light", "dark", "auto"];
  const ALLOWED_EDITORIAL = ["noir", "earth", "aethel", "meridian"];
  const ALLOWED_TRANSITIONS = ["cinema", "wipe", "glide", "iris", "snap"];

  const EDITORIAL_META = {
    noir: { pack: "velora-noir", theme: "dark" },
    earth: { pack: "velora-earth", theme: "light" },
    aethel: { pack: "velora-aethel", theme: "dark" },
    meridian: { pack: "velora-meridian", theme: "dark" },
  };

  function sanitize(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  const savedEditorial = ls.getItem("vl-editorial-theme");
  if (savedEditorial && ALLOWED_EDITORIAL.includes(savedEditorial)) {
    const meta = EDITORIAL_META[savedEditorial];
    root.setAttribute("data-editorial-theme", savedEditorial);
    root.setAttribute("data-theme-pack", meta.pack);
    root.setAttribute("data-theme", meta.theme);
  } else {
    const savedTheme = ls.getItem("vl-theme");
    const theme = sanitize(savedTheme || root.getAttribute("data-theme"), ALLOWED_THEMES, "dark");
    if (theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
    if (!root.getAttribute("data-editorial-theme")) {
      root.setAttribute("data-editorial-theme", theme === "light" ? "earth" : "noir");
      root.setAttribute("data-theme-pack", theme === "light" ? "velora-earth" : "velora-noir");
    }
  }

  const savedTransition = ls.getItem("vl-page-transition");
  const transition = sanitize(
    savedTransition || root.getAttribute("vl-page-transition"),
    ALLOWED_TRANSITIONS,
    "cinema",
  );
  root.setAttribute("vl-page-transition", transition);
})();
