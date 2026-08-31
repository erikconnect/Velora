/**
 * Motion Playground — showcase UI only (P1.1).
 * Sets public vl-* attributes on a preview node; motion is CSS-only.
 */
(function () {
  "use strict";

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

  const MOTION_ATTRS = new Set([
    "vl-enter",
    "vl-exit",
    "vl-scroll",
    "vl-hover",
    "vl-loop-effect",
    "vl-effect",
    "vl-state",
    "vl-base",
    "vl-page-transition",
    "vl-timeline",
    "vl-delay",
    "vl-duration",
    "vl-loop",
    "vl-motion",
  ]);

  const gate = document.getElementById("playground-preview-gate");
  const target = document.getElementById("playground-preview-target");
  const markupEl = document.getElementById("playground-markup");
  const channelSelect = document.getElementById("playground-channel");
  const presetSelect = document.getElementById("playground-preset");
  const timelineSelect = document.getElementById("playground-timeline");
  const delayInput = document.getElementById("playground-delay");
  const durationInput = document.getElementById("playground-duration");
  const copyBtn = document.getElementById("playground-copy");
  const replayBtn = document.getElementById("playground-replay");

  if (!gate || !target || !markupEl || !channelSelect || !presetSelect) return;

  let presets = [];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function clearMotionAttrs(el) {
    for (const name of [...el.attributes].map((a) => a.name)) {
      if (MOTION_ATTRS.has(name)) el.removeAttribute(name);
    }
  }

  function selectedPreset() {
    const name = presetSelect.value;
    return presets.find((p) => p.name === name) ?? null;
  }

  function populateChannels() {
    const channels = [...new Set(presets.map((p) => p.channel))].sort();
    channelSelect.innerHTML = channels
      .map((ch) => `<option value="${ch}">${ch}</option>`)
      .join("");
    if (channels.includes("enter")) channelSelect.value = "enter";
  }

  function populatePresets(channel) {
    const list = presets.filter((p) => p.channel === channel);
    presetSelect.innerHTML = list
      .map((p) => `<option value="${p.name}">${p.name}</option>`)
      .join("");
  }

  function buildMarkup() {
    const preset = selectedPreset();
    if (!preset) return "";

    const attr = preset.attribute || CHANNEL_ATTR[preset.channel] || "vl-effect";
    const parts = [`${attr}="${preset.name}"`];

    const timeline = timelineSelect?.value;
    if (timeline) parts.push(`vl-timeline="${timeline}"`);

    const delay = delayInput?.value?.trim();
    if (delay) parts.push(`vl-delay="${delay}"`);

    const duration = durationInput?.value?.trim();
    if (duration) parts.push(`vl-duration="${duration}"`);

    if (preset.channel === "loop") parts.push('vl-loop="-1"');

    return `<div ${parts.join(" ")}>Preview content</div>`;
  }

  function applyPreview() {
    const preset = selectedPreset();
    clearMotionAttrs(target);

    if (!preset) {
      markupEl.textContent = "<!-- Select a preset -->";
      return;
    }

    const attr = preset.attribute || CHANNEL_ATTR[preset.channel] || "vl-effect";
    target.setAttribute(attr, preset.name);

    const timeline = timelineSelect?.value;
    if (timeline) target.setAttribute("vl-timeline", timeline);
    else target.removeAttribute("vl-timeline");

    const delay = delayInput?.value?.trim();
    if (delay) target.setAttribute("vl-delay", delay);
    else target.removeAttribute("vl-delay");

    const duration = durationInput?.value?.trim();
    if (duration) target.setAttribute("vl-duration", duration);
    else target.removeAttribute("vl-duration");

    if (preset.channel === "loop") target.setAttribute("vl-loop", "-1");
    else target.removeAttribute("vl-loop");

    const markup = buildMarkup();
    markupEl.innerHTML = escapeHtml(markup);
  }

  function replayPreview() {
    gate.removeAttribute("vl-in-view");
    void gate.offsetWidth;
    gate.setAttribute("vl-in-view", "");
  }

  async function init() {
    try {
      const res = await fetch("/data/presets-index.json", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      presets = data.presets ?? [];
    } catch {
      markupEl.textContent = "Could not load presets-index.json — run pnpm generate:catalog";
      return;
    }

    populateChannels();
    populatePresets(channelSelect.value);
    applyPreview();

    channelSelect.addEventListener("change", () => {
      populatePresets(channelSelect.value);
      applyPreview();
      replayPreview();
    });

    presetSelect.addEventListener("change", () => {
      applyPreview();
      replayPreview();
    });

    for (const el of [timelineSelect, delayInput, durationInput]) {
      el?.addEventListener("input", () => {
        applyPreview();
      });
      el?.addEventListener("change", () => {
        applyPreview();
        replayPreview();
      });
    }

    replayBtn?.addEventListener("click", replayPreview);

    copyBtn?.addEventListener("click", async () => {
      const text = buildMarkup();
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.textContent = "Copy markup";
        }, 1500);
      } catch {
        copyBtn.textContent = "Copy failed";
      }
    });

    const params = new URLSearchParams(window.location.search);
    const presetParam = params.get("preset");
    const channelParam = params.get("channel");
    if (channelParam && [...channelSelect.options].some((o) => o.value === channelParam)) {
      channelSelect.value = channelParam;
      populatePresets(channelParam);
    }
    if (presetParam && [...presetSelect.options].some((o) => o.value === presetParam)) {
      presetSelect.value = presetParam;
    }
    applyPreview();
    replayPreview();
  }

  init();
})();
