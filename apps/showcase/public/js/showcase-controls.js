(() => {
  const root = document.documentElement;
  const themeButtons = Array.from(document.querySelectorAll(".ds-theme-btn"));
  const transitionSelect = document.querySelector(".ds-vt-select");
  const editorialSelect = document.querySelector(".ds-editorial-select");
  const THEME_KEY = "vl-theme";
  const TRANSITION_KEY = "vl-page-transition";
  const EDITORIAL_KEY = "vl-editorial-theme";

  const applyTheme = (theme) => {
    if (theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }

    themeButtons.forEach((button) => {
      const isActive = button.dataset.dsTheme === theme;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const syncEditorialSelect = (value) => {
    if (!editorialSelect) return;
    editorialSelect.value = value;
  };

  /** Noir → dark · Earth tech → light (DESIGN.md) */
  const applyEditorial = (value, { persist = true, syncThemeToggle = true } = {}) => {
    const v = value === "earth" ? "earth" : "noir";
    root.setAttribute("data-editorial-theme", v);
    if (persist) {
      localStorage.setItem(EDITORIAL_KEY, v);
    }
    if (v === "earth") {
      root.setAttribute("data-theme", "light");
      if (persist) localStorage.setItem(THEME_KEY, "light");
      if (syncThemeToggle) applyTheme("light");
    } else {
      root.setAttribute("data-theme", "dark");
      if (persist) localStorage.setItem(THEME_KEY, "dark");
      if (syncThemeToggle) applyTheme("dark");
    }
    syncEditorialSelect(v);
  };

  const savedEditorial = localStorage.getItem(EDITORIAL_KEY);
  if (editorialSelect) {
    const initial = savedEditorial || root.getAttribute("data-editorial-theme") || "noir";
    applyEditorial(initial, { persist: false, syncThemeToggle: true });
  } else {
    const savedTheme = localStorage.getItem(THEME_KEY) || "auto";
    applyTheme(savedTheme);
  }

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.dsTheme || "auto";
      localStorage.setItem(THEME_KEY, theme);
      applyTheme(theme);
      if (theme === "light") {
        applyEditorial("earth", { syncThemeToggle: false });
      } else if (theme === "dark") {
        applyEditorial("noir", { syncThemeToggle: false });
      }
      if (theme === "auto" && editorialSelect) {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyEditorial(prefersDark ? "noir" : "earth", { syncThemeToggle: false });
      }
    });
  });

  if (editorialSelect) {
    editorialSelect.addEventListener("change", (event) => {
      applyEditorial(event.target.value, { syncThemeToggle: true });
    });
  }

  const savedTransition = localStorage.getItem(TRANSITION_KEY);
  const initialTransition = savedTransition || root.getAttribute("vl-page-transition") || "cinema";
  root.setAttribute("vl-page-transition", initialTransition);

  if (transitionSelect) {
    transitionSelect.value = initialTransition;
    transitionSelect.addEventListener("change", (event) => {
      const nextTransition = event.target.value;
      root.setAttribute("vl-page-transition", nextTransition);
      localStorage.setItem(TRANSITION_KEY, nextTransition);
    });
  }
})();
