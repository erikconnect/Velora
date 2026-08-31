/**
 * Motion Lab — registry-driven preset inspector (showcase-only UI).
 * Data: /data/presets-full.json from pnpm generate:catalog
 */
(function () {
  "use strict";

  const detailRoot = document.getElementById("lab-preset-detail");
  const listRoot = document.getElementById("lab-preset-list");
  const previewTarget = document.getElementById("lab-preset-preview-target");
  const filterInput = document.getElementById("lab-preset-filter");
  const channelSelect = document.getElementById("lab-preset-channel");
  const coverageKnown = document.getElementById("lab-coverage-known");
  const coverageDemo = document.getElementById("lab-coverage-demo");
  const coverageGaps = document.getElementById("lab-coverage-gaps");

  if (!detailRoot || !listRoot) return;

  const CHANNEL_ATTR = {
    enter: "vl-enter",
    exit: "vl-exit",
    scroll: "vl-scroll",
    hover: "vl-hover",
    loop: "vl-loop-effect",
    state: "vl-state",
    effect: "vl-effect",
    pageTransition: "vl-page-transition",
    scene: "vl-scene",
    base: "vl-base",
  };

  let registry = new Map();
  let allPresets = [];
  let selectedName = null;

  function badge(level) {
    const map = { stable: "stable", progressive: "progressive", experimental: "experimental" };
    const data = map[level] || "stable";
    const label = level.charAt(0).toUpperCase() + level.slice(1);
    return `<span class="showcase-support-badge" data-level="${data}">${label}</span>`;
  }

  function fallbackText(preset) {
    if (preset.enhancements?.length) {
      return "Enhancement may be omitted; content stays visible with time-based or static fallback.";
    }
    return "Composed resting state remains readable without animation.";
  }

  function htmlUsage(preset) {
    const attr = preset.attribute || CHANNEL_ATTR[preset.channel] || "vl-effect";
    if (preset.channel === "loop") {
      return `&lt;div ${attr}="float" vl-loop="-1"&gt;…&lt;/div&gt;`;
    }
    if (preset.channel === "pageTransition") {
      return `&lt;html ${attr}="${preset.name}"&gt;`;
    }
    return `&lt;div ${attr}="${preset.name}"&gt;…&lt;/div&gt;`;
  }

  function renderDetail(preset) {
    if (!preset) {
      detailRoot.innerHTML =
        '<p class="api-note">Select a preset from the list or click a demo card.</p>';
      if (previewTarget) previewTarget.innerHTML = "";
      return;
    }

    const primitives = [
      ...(preset.requires || []),
      ...(preset.enhancements || []),
    ].filter(Boolean);

    detailRoot.innerHTML = `
      <header class="motion-lab-inspector__detail-head">
        <h3><code>${preset.name}</code></h3>
        ${badge(preset.status)}
      </header>
      <dl class="motion-lab-inspector__meta">
        <div><dt>Channel</dt><dd>${preset.channel}</dd></div>
        <div><dt>HTML</dt><dd><pre class="api-code">${htmlUsage(preset)}</pre></dd></div>
        <div><dt>Primitives</dt><dd>${primitives.map((p) => `<code>${p}</code>`).join(" ") || "animation"}</dd></div>
        <div><dt>Fallback</dt><dd>${fallbackText(preset)}</dd></div>
        <div><dt>Reduced motion</dt><dd>${preset.reducedMotion || "static"}</dd></div>
        <div><dt>Source</dt><dd><code>${preset.source || "—"}</code></dd></div>
        ${preset.description ? `<div><dt>Description</dt><dd>${preset.description}</dd></div>` : ""}
      </dl>
    `;

    if (previewTarget) {
      previewTarget.replaceChildren();
      const el = document.createElement("div");
      el.className = "api-target motion-lab-inspector__preview-target";
      el.textContent = preset.name;
      const attr = preset.attribute || CHANNEL_ATTR[preset.channel] || "vl-effect";
      if (preset.channel === "loop") {
        el.setAttribute("vl-loop", "-1");
        el.setAttribute("vl-loop-effect", preset.name);
      } else {
        el.setAttribute(attr, preset.name);
      }
      if (["enter", "exit", "effect", "scroll"].includes(preset.channel)) {
        el.setAttribute("vl-timeline", "view");
      }
      previewTarget.appendChild(el);
    }
  }

  function renderList(presets) {
    listRoot.innerHTML = presets
      .map(
        (p) =>
          `<li><button type="button" class="motion-lab-inspector__list-btn${selectedName === p.name ? " is-active" : ""}" data-preset="${p.name}">${p.name}<span>${p.channel}</span></button></li>`,
      )
      .join("");
  }

  function selectPreset(name) {
    selectedName = name;
    const preset = registry.get(name);
    renderDetail(preset);
    renderList(filterPresets());
    if (preset && location.hash !== `#preset-${name}`) {
      history.replaceState(null, "", `#preset-${encodeURIComponent(name)}`);
    }
  }

  function filterPresets() {
    const q = (filterInput?.value || "").trim().toLowerCase();
    const ch = channelSelect?.value || "all";
    return allPresets.filter((p) => {
      if (ch !== "all" && p.channel !== ch) return false;
      if (!q) return true;
      return (
        p.name.includes(q) ||
        p.channel.includes(q) ||
        (p.attribute || "").includes(q)
      );
    });
  }

  function applyFilters() {
    renderList(filterPresets());
  }

  function normalizeCardLabel(label) {
    if (!label) return null;
    let text = label.trim();
    text = text.replace(/^vl-\w+\s+/i, "");
    text = text.replace(/^(State|Scroll|Hover|Enter|Exit)\s*·\s*/i, "");
    text = text.split("@")[0].trim();
    if (registry.has(text)) return text;
    const tail = label.split("·").pop()?.trim();
    if (tail && registry.has(tail)) return tail;
    return null;
  }

  function inferPresetFromCard(card) {
    const fromLabel = normalizeCardLabel(card.querySelector("strong")?.textContent);
    if (fromLabel) return fromLabel;

    for (const [channel, attr] of Object.entries(CHANNEL_ATTR)) {
      const nodes = [
        ...(card.hasAttribute(attr) ? [card] : []),
        ...card.querySelectorAll(`[${attr}]`),
      ];
      for (const node of nodes) {
        const raw = node.getAttribute(attr);
        if (!raw) continue;
        const token = raw.split(/\s+/)[0].replace(/@.*$/, "");
        if (registry.has(token)) return token;
      }
    }
    return null;
  }

  function updateCoverage(demoCount) {
    if (coverageKnown) coverageKnown.textContent = String(allPresets.length);
    if (coverageDemo) coverageDemo.textContent = String(demoCount);
    if (coverageGaps) {
      coverageGaps.textContent = String(Math.max(0, allPresets.length - demoCount));
    }
  }

  function countDemonstratedPresets() {
    const seen = new Set();
    document.querySelectorAll(".api-card").forEach((card) => {
      const name = inferPresetFromCard(card);
      if (name) seen.add(name);
    });
    updateCoverage(seen.size);
    return seen;
  }

  function populateChannels() {
    if (!channelSelect) return;
    const channels = [...new Set(allPresets.map((p) => p.channel))].sort();
    channelSelect.innerHTML =
      '<option value="all">All channels</option>' +
      channels.map((c) => `<option value="${c}">${c}</option>`).join("");
  }

  listRoot.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-preset]");
    if (!btn) return;
    selectPreset(btn.getAttribute("data-preset"));
  });

  document.addEventListener("click", (event) => {
    const card = event.target.closest(".api-card");
    if (!card || !listRoot.closest("main")?.contains(card)) return;
    const name = inferPresetFromCard(card);
    if (name) selectPreset(name);
  });

  filterInput?.addEventListener("input", applyFilters);
  channelSelect?.addEventListener("change", applyFilters);

  fetch("/data/presets-full.json")
    .then((r) => r.json())
    .then((data) => {
      allPresets = (data.presets || []).slice().sort((a, b) => a.name.localeCompare(b.name));
      registry = new Map(allPresets.map((p) => [p.name, p]));
      populateChannels();
      applyFilters();
      countDemonstratedPresets();

      const hash = location.hash.replace(/^#preset-/, "");
      if (hash && registry.has(decodeURIComponent(hash))) {
        selectPreset(decodeURIComponent(hash));
      } else if (allPresets[0]) {
        selectPreset(allPresets[0].name);
      }
    })
    .catch(() => {
      detailRoot.innerHTML =
        '<p class="api-note">Inspector data unavailable. Run <code>pnpm generate:catalog</code>.</p>';
    });
})();
