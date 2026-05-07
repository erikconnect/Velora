(() => {
  const root = document.documentElement;
  const themeButtons = Array.from(document.querySelectorAll(".ds-theme-btn"));
  const transitionSelect = document.querySelector(".ds-vt-select");
  const editorialSelect = document.querySelector(".ds-editorial-select");
  const THEME_KEY = "vl-theme";
  const TRANSITION_KEY = "vl-page-transition";
  const EDITORIAL_KEY = "vl-editorial-theme";
  const applyThemePackFromEditorial = (editorial) => {
    const pack = editorial === "earth" ? "velora-earth" : "velora-noir";
    root.setAttribute("data-theme-pack", pack);
  };

  const applyTheme = (theme) => {
    if (theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }

    themeButtons.forEach((button) => {
      const isActive = button.dataset.dsTheme === theme;
      button.classList.toggle("is-active", isActive);
      button.classList.toggle("vl-badge--accent", isActive);
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
    applyThemePackFromEditorial(v);
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

  /* ── Mobile navigation (hamburger) ──────────────────────────────────── */
  const header = document.querySelector(".vl-header");
  const menuBtn = document.querySelector(".vl-header__menu-btn");
  const drawer = document.querySelector(".vl-header__drawer");

  if (menuBtn && drawer && header) {
    menuBtn.addEventListener("click", () => {
      const isOpen = header.hasAttribute("data-menu-open");
      if (isOpen) {
        header.removeAttribute("data-menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
        drawer.setAttribute("aria-hidden", "true");
      } else {
        header.setAttribute("data-menu-open", "");
        menuBtn.setAttribute("aria-expanded", "true");
        drawer.setAttribute("aria-hidden", "false");
      }
    });

    // Close on outside click / Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.hasAttribute("data-menu-open")) {
        header.removeAttribute("data-menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
        drawer.setAttribute("aria-hidden", "true");
        menuBtn.focus();
      }
    });

    // Sync mobile controls with desktop values on open
    const mobileVtSelect = drawer.querySelector(".ds-vt-select");
    const mobileEditorialSelect = drawer.querySelector(".ds-editorial-select");
    const mobileThemeBtns = Array.from(drawer.querySelectorAll(".ds-theme-btn"));

    if (mobileVtSelect && transitionSelect) {
      mobileVtSelect.value = transitionSelect.value;
      mobileVtSelect.addEventListener("change", (e) => {
        if (transitionSelect) transitionSelect.value = e.target.value;
        const nextTransition = e.target.value;
        root.setAttribute("vl-page-transition", nextTransition);
        localStorage.setItem(TRANSITION_KEY, nextTransition);
      });
    }

    if (mobileEditorialSelect && editorialSelect) {
      mobileEditorialSelect.value = editorialSelect.value;
      mobileEditorialSelect.addEventListener("change", (e) => {
        applyEditorial(e.target.value, { syncThemeToggle: true });
        if (editorialSelect) syncEditorialSelect(e.target.value);
      });
    }

    mobileThemeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.dataset.dsTheme || "auto";
        localStorage.setItem(THEME_KEY, theme);
        applyTheme(theme);
        if (theme === "light") applyEditorial("earth", { syncThemeToggle: false });
        else if (theme === "dark") applyEditorial("noir", { syncThemeToggle: false });
        if (theme === "auto" && editorialSelect) {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          applyEditorial(prefersDark ? "noir" : "earth", { syncThemeToggle: false });
        }
      });
    });
  }

})();
