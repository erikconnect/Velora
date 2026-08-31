/** Tooling only — renders generated benchmarks.json on the benchmarks page. */
(async function initBenchmarksPage() {
  const tbody = document.getElementById("bench-metrics-body");
  const cdnEl = document.getElementById("bench-cdn-snippet");
  const statusEl = document.getElementById("bench-publish-status");

  try {
    const res = await fetch("/data/benchmarks.json", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();

    if (tbody && Array.isArray(data.claims)) {
      tbody.innerHTML = data.claims
        .map(
          (row) => `<tr>
        <th scope="row">${escapeHtml(row.metric)}</th>
        <td><strong>${escapeHtml(String(row.velora))}</strong></td>
        <td>${escapeHtml(String(row.baseline))}</td>
        <td>${escapeHtml(String(row.evidence))}</td>
      </tr>`,
        )
        .join("");
    }

    if (statusEl) {
      statusEl.textContent =
        data.publishStatus === "ready-not-published"
          ? "Package dist ready; npm publish pending."
          : String(data.publishStatus ?? "—");
    }

    if (cdnEl && data.cdn?.unpkg?.motionCore) {
      const url = data.cdn.unpkg.motionCore;
      cdnEl.textContent = `<link rel="stylesheet" href="${url}" />`;
    }
  } catch {
    if (tbody) {
      tbody.innerHTML =
        '<tr><td colspan="4">Run <code>pnpm --filter @velora/css build</code> to generate benchmarks.json</td></tr>';
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
