/**
 * Compatibility page — renders primitive matrix from generated JSON.
 */
(function () {
  "use strict";

  const table = document.getElementById("compat-matrix-table");
  const baseline = document.getElementById("compat-baseline-note");
  const presetCount = document.getElementById("compat-preset-count");

  if (!table) return;

  const tbody = table.querySelector("tbody");

  const BROWSER_LABEL = {
    stable: "✓",
    progressive: "◐",
    experimental: "⚗",
    unsupported: "—",
  };

  function cell(level) {
    const sym = BROWSER_LABEL[level] ?? "—";
    return `<td data-level="${level}" title="${level}">${sym}</td>`;
  }

  fetch("/data/compatibility-matrix.json")
    .then((r) => r.json())
    .then((data) => {
      if (baseline && data.baseline) {
        baseline.textContent = `Documented baseline: Chrome ${data.baseline.chrome}, Safari ${data.baseline.safari}, Firefox ${data.baseline.firefox}. ${data.baseline.note}`;
      }
      if (presetCount && data.presetCount) {
        presetCount.textContent = String(data.presetCount);
      }
      tbody.innerHTML = data.primitives
        .map(
          (row) => `<tr>
            <th scope="row"><code>${row.name}</code></th>
            <td><span class="showcase-support-badge" data-level="${row.status === "experimental" ? "experimental" : row.status === "progressive" ? "progressive" : "stable"}">${row.status}</span></td>
            ${cell(row.chrome)}
            ${cell(row.safari)}
            ${cell(row.firefox)}
            <td>${row.fallback}</td>
          </tr>`,
        )
        .join("");
    })
    .catch(() => {
      tbody.innerHTML =
        '<tr><td colspan="6">Run <code>pnpm generate:catalog</code> to build compatibility data.</td></tr>';
    });
})();
