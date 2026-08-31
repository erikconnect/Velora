/**
 * Motion Catalog — registry-driven preset index (showcase-only UI).
 * Data source: packages/catalog/ via /data/*.json (pnpm generate:catalog).
 */
(function () {
  "use strict";

  const statsRoot = document.getElementById("catalog-registry-stats");
  const channelRoot = document.getElementById("catalog-registry-channels");
  const filterInput = document.getElementById("catalog-registry-filter");
  const tableBody = document.querySelector("#catalog-registry-table tbody");
  const countLabel = document.getElementById("catalog-registry-count");

  if (!statsRoot || !tableBody) return;

  const LEVEL_LABEL = {
    stable: "Stable",
    progressive: "Progressive",
    experimental: "Experimental",
  };

  let allPresets = [];

  function badge(level) {
    const label = LEVEL_LABEL[level] || level;
    return `<span class="showcase-support-badge" data-level="${level === "experimental" ? "experimental" : level === "progressive" ? "progressive" : "stable"}">${label}</span>`;
  }

  function renderStats(summary) {
    statsRoot.innerHTML = `
      <article class="catalog-registry-stat"><strong>${summary.presetCount}</strong><span>Public presets</span></article>
      <article class="catalog-registry-stat"><strong>${summary.byStatus?.stable ?? "—"}</strong><span>Stable</span></article>
      <article class="catalog-registry-stat"><strong>${summary.byStatus?.experimental ?? 0}</strong><span>Experimental</span></article>
      <article class="catalog-registry-stat"><strong>0 KB</strong><span>Animation runtime JS</span></article>
    `;

    if (channelRoot && summary.byChannel) {
      channelRoot.innerHTML = Object.entries(summary.byChannel)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(
          ([channel, count]) =>
            `<span class="api-chip">${channel} · ${count}</span>`,
        )
        .join("");
    }
  }

  function renderTable(presets) {
    tableBody.innerHTML = presets
      .map(
        (p) => `<tr>
          <td><code>${p.name}</code></td>
          <td>${p.channel}</td>
          <td><code>${p.attribute}="${p.name}"</code></td>
          <td>${badge(p.status)}</td>
          <td>${p.reducedMotion ?? "static"}</td>
        </tr>`,
      )
      .join("");
    if (countLabel) {
      countLabel.textContent = `${presets.length} presets shown`;
    }
  }

  function applyFilter(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      renderTable(allPresets);
      return;
    }
    renderTable(
      allPresets.filter(
        (p) =>
          p.name.includes(q) ||
          p.channel.includes(q) ||
          p.attribute.includes(q),
      ),
    );
  }

  Promise.all([
    fetch("/data/catalog-summary.json").then((r) => r.json()),
    fetch("/data/presets-index.json").then((r) => r.json()),
  ])
    .then(([summary, index]) => {
      renderStats(summary);
      allPresets = index.presets ?? [];
      renderTable(allPresets);
      if (filterInput) {
        filterInput.addEventListener("input", () =>
          applyFilter(filterInput.value),
        );
      }
    })
    .catch(() => {
      statsRoot.innerHTML =
        '<p class="api-note">Registry data unavailable. Run <code>pnpm generate:catalog</code>.</p>';
    });
})();
