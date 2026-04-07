import "@velora/css";
import "./showcase.css";

const KEY_THEME = "velora-ds-theme";
const KEY_VT = "velora-ds-vt";
const KEY_LAYOUT = "velora-ds-layout";

const root = document.documentElement;

function readStored(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStored(key, value) {
    try {
        if (value === null || value === "") {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, value);
        }
    } catch {
        /* modo privado */
    }
}

function applyTheme(value) {
    if (value === "light" || value === "dark") {
        root.dataset.theme = value;
    } else {
        delete root.dataset.theme;
    }
}

function applyVt(value) {
    const allowed = ["wipe", "glide", "iris", "cinema", "snap"];
    if (allowed.includes(value)) {
        root.dataset.vtPreset = value;
    } else {
        delete root.dataset.vtPreset;
    }
}

function applyLayout(value) {
    const allowed = ["compact", "presentation"];
    if (allowed.includes(value)) {
        root.dataset.layout = value;
    } else {
        delete root.dataset.layout;
    }
}

function syncThemeUI() {
    const theme = root.dataset.theme;
    const active = theme === "light" || theme === "dark" ? theme : "auto";
    document.querySelectorAll("[data-ds-theme]").forEach((btn) => {
        const v = btn.getAttribute("data-ds-theme");
        btn.classList.toggle("is-active", v === active);
    });
}

function syncVtUI() {
    const cur = root.dataset.vtPreset || "velora";
    document.querySelectorAll("[data-ds-vt]").forEach((btn) => {
        const v = btn.getAttribute("data-ds-vt");
        btn.classList.toggle("is-active", v === cur);
    });
}

function syncLayoutUI() {
    const cur = root.dataset.layout || "default";
    document.querySelectorAll("[data-ds-layout]").forEach((btn) => {
        const v = btn.getAttribute("data-ds-layout");
        btn.classList.toggle("is-active", v === cur);
    });
}

function init() {
    const t = readStored(KEY_THEME);
    if (t === "light" || t === "dark") {
        applyTheme(t);
    } else {
        applyTheme("");
    }

    const vt = readStored(KEY_VT);
    if (["wipe", "glide", "iris", "cinema", "snap"].includes(vt || "")) {
        applyVt(vt);
    } else {
        applyVt("");
    }

    const lo = readStored(KEY_LAYOUT);
    if (lo === "compact" || lo === "presentation") {
        applyLayout(lo);
    } else {
        applyLayout("");
    }

    syncThemeUI();
    syncVtUI();
    syncLayoutUI();

    document.querySelectorAll("[data-ds-theme]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const v = btn.getAttribute("data-ds-theme");
            if (v === "auto") {
                applyTheme("");
                writeStored(KEY_THEME, "");
            } else {
                applyTheme(v);
                writeStored(KEY_THEME, v);
            }
            syncThemeUI();
        });
    });

    document.querySelectorAll("[data-ds-vt]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const v = btn.getAttribute("data-ds-vt");
            if (v === "velora") {
                applyVt("");
                writeStored(KEY_VT, "");
            } else {
                applyVt(v);
                writeStored(KEY_VT, v);
            }
            syncVtUI();
        });
    });

    document.querySelectorAll("[data-ds-layout]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const v = btn.getAttribute("data-ds-layout");
            if (v === "default") {
                applyLayout("");
                writeStored(KEY_LAYOUT, "");
            } else {
                applyLayout(v);
                writeStored(KEY_LAYOUT, v);
            }
            syncLayoutUI();
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
