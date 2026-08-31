/**
 * docs-live.js — replay scroll for in-page Velora demos (docs tooling only).
 */
(function () {
  document.querySelectorAll("[data-docs-replay]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const live = btn.closest(".docs-live");
      const scroller = live?.querySelector("[data-docs-scroll]");
      if (!scroller) return;
      scroller.scrollTop = 0;
      window.requestAnimationFrame(() => {
        scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
      });
    });
  });
})();
