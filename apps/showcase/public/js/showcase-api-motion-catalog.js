/**
 * Motion API Catalog — DX runtime toolbar (showcase-only).
 * Tunes delay / duration / speed for the selected card against Velora CONTRACT attrs.
 * Shipped motion remains CSS-only; this script does not drive animation logic.
 */
(function () {
  "use strict";

  /** Stable motion attrs from docs/project/CONTRACT.md §2.1 (card-scoped). */
  const API_COMMANDS = [
    "vl-effect",
    "vl-enter",
    "vl-exit",
    "vl-scroll",
    "vl-loop",
    "vl-loop-effect",
    "vl-hover",
    "vl-state",
    "vl-base",
    "vl-motion",
    "vl-timeline",
    "vl-range",
    "vl-duration",
    "vl-speed",
    "vl-direction",
    "vl-scene",
    "vl-stage",
    "vl-act",
    "vl-span",
    "vl-pin",
    "vl-scrub",
    "vl-once",
    "vl-children",
    "vl-stagger",
  ];

  const MOTION_TARGET_SELECTOR = [
    "[vl-effect]",
    "[vl-enter]",
    "[vl-exit]",
    "[vl-scroll]",
    "[vl-loop]",
    "[vl-loop-effect]",
    "[vl-hover]",
    "[vl-state]",
    "[vl-base]",
    "[vl-motion]",
    "[vl-children] > *",
    "[vl-stage] > *",
  ].join(", ");

  const SECTION_KIND_MAP = {
    channels: "channel",
    "timeline-modes": "timeline",
    entrances: "timeline",
    "stage-3d": "3d",
    hover: "interaction",
    "hover-cards": "interaction",
    "editor-illustration": "interaction",
    text: "text",
    ambient: "ambient",
    "cube-triad": "scene",
    scroll: "timeline",
    "scene-engine": "scene",
    timeline: "timeline",
    transitions: "transition",
    children: "channel",
    params: "reference",
  };

  const cards = Array.from(document.querySelectorAll(".api-card"));
  if (!cards.length) return;

  cards.forEach((card) => {
    const sectionId = card.closest("section[id]")?.id || "";
    const fallbackKind = card.classList.contains("api-card--lead") ? "reference" : "channel";
    card.dataset.apiKind = SECTION_KIND_MAP[sectionId] || fallbackKind;
  });

  const filterButtons = Array.from(document.querySelectorAll(".api-kind-filter__btn"));
  const groups = Array.from(document.querySelectorAll(".api-group"));
  const delayRange = document.getElementById("api-delay-range");
  const durationRange = document.getElementById("api-duration-range");
  const speedRange = document.getElementById("api-speed-range");
  const delayValue = document.getElementById("api-delay-value");
  const durationValue = document.getElementById("api-duration-value");
  const speedValue = document.getElementById("api-speed-value");
  const selectedLabel = document.getElementById("api-selected-card");
  const commandList = document.getElementById("api-command-list");
  const liveHint = document.getElementById("api-live-hint");
  const liveReadout = document.getElementById("api-live-readout");
  const drawerBtn = document.getElementById("api-controls-drawer-btn");
  const drawer = document.getElementById("api-controls-drawer");
  const playBtn = document.getElementById("api-play-btn");
  const pauseBtn = document.getElementById("api-pause-btn");
  const replayBtn = document.getElementById("api-replay-btn");

  /** Primary attrs shown first in the live readout. */
  const READOUT_PRIORITY = [
    "vl-scene",
    "vl-stage",
    "vl-act",
    "vl-span",
    "vl-pin",
    "vl-scrub",
    "vl-effect",
    "vl-enter",
    "vl-exit",
    "vl-scroll",
    "vl-loop",
    "vl-loop-effect",
    "vl-hover",
    "vl-state",
    "vl-timeline",
    "vl-range",
    "vl-duration",
    "vl-speed",
    "vl-direction",
    "vl-children",
    "vl-stagger",
    "vl-once",
    "vl-base",
    "vl-motion",
  ];

  const MOTION_HINTS = {
    "vl-enter": "Entrada quando o alvo cruza o viewport (ou timeline view).",
    "vl-exit": "Saída ao sair do viewport ou fim de cena.",
    "vl-scroll": "Motion acoplada ao scroll — scrub no eixo da página.",
    "vl-loop": "Loop CSS contínuo ou N repetições via keyframes.",
    "vl-loop-effect": "Preset de loop (orbit, wobble, glow…).",
    "vl-hover": "Canal de pointer — hover/focus disparam transições.",
    "vl-effect": "Efeito legacy/interaction no atributo vl-effect.",
    "vl-state": "Estado suave persistente no elemento.",
    "vl-timeline": "Driver: view, scroll, hover ou tempo.",
    "vl-range": "Janela de scroll/viewport onde a motion é ativa.",
    "vl-scene": "Relógio de cena — acts com timing relativo.",
    "vl-stage": "Palco 3D/2D — filhos posicionados por vars.",
    "vl-pin": "Pin numérico durante scrub de cena.",
    "vl-scrub": "Liga progresso de scroll ao relógio da cena.",
    "vl-children": "Orquestra filhos (stagger / orchestrate).",
    "vl-stagger": "Atraso entre filhos em ms.",
  };

  const TIMELINE_HINTS = {
    view: "Timeline view — dispara ao entrar no viewport.",
    scroll: "Timeline scroll — progresso ligado ao scroll.",
    hover: "Timeline hover — gate por pointer/focus.",
  };

  let selectedCard = null;
  let isPaused = false;
  let replayTimer = null;

  function parseTimeMs(value, fallback = 0) {
    if (value == null || value === "") return fallback;
    const match = String(value).trim().match(/^([\d.]+)\s*(ms|s)?$/i);
    if (!match) return fallback;
    const amount = Number.parseFloat(match[1]);
    const unit = (match[2] || "ms").toLowerCase();
    return unit === "s" ? amount * 1000 : amount;
  }

  function getRuntimeValues() {
    return {
      delayMs: Number(delayRange?.value || 0),
      durationMs: Number(durationRange?.value || 1400),
      speedRate: Number(speedRange?.value || 1),
    };
  }

  function getMotionTargets(card) {
    const seen = new Set();
    const nodes = [];

    card.querySelectorAll(MOTION_TARGET_SELECTOR).forEach((node) => {
      if (seen.has(node)) return;
      seen.add(node);
      nodes.push(node);
    });

    return nodes;
  }

  function getStaggerDelayMs(node) {
    const container = node.closest("[vl-children]");
    if (!container || !container.contains(node)) return 0;

    const step = parseTimeMs(container.getAttribute("vl-stagger"), 100);
    const siblings = Array.from(container.children);
    const index = siblings.indexOf(node);
    return index >= 0 ? index * step : 0;
  }

  function applyDurationVars(node, durationMs) {
    const duration = `${durationMs}ms`;
    node.style.setProperty("--vl-motion-duration", duration);
    node.style.setProperty("--vl-enter-duration", duration);
    node.style.setProperty("--vl-exit-duration", duration);
    node.style.setProperty("--vl-loop-duration", duration);
    node.setAttribute("vl-duration", duration);
  }

  function clearForcedAnimationStyles(nodes) {
    nodes.forEach((node) => {
      node.style.removeProperty("animation");
      node.style.removeProperty("animation-play-state");
    });
  }

  function resetScrollStories(card) {
    const scenes = card.querySelectorAll("[vl-scene]");
    if (!scenes.length) return;

    const scene = scenes[0];
    const top = window.scrollY + scene.getBoundingClientRect().top - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  }

  function syncWebAnimations(card, values, paused) {
    card.getAnimations({ subtree: true }).forEach((anim) => {
      const target = anim.effect?.target;
      const stagger =
        target instanceof Element && card.contains(target) ? getStaggerDelayMs(target) : 0;
      const delay = values.delayMs + stagger;

      anim.playbackRate = values.speedRate;
      if (anim.effect && typeof anim.effect.updateTiming === "function") {
        try {
          anim.effect.updateTiming({
            duration: values.durationMs,
            delay,
          });
        } catch {
          /* scroll/view timelines may reject timing updates */
        }
      }
      if (paused) anim.pause();
      else anim.play();
    });
  }

  function applyRuntimeToCard(card) {
    if (!card) return;

    const values = getRuntimeValues();
    const duration = `${values.durationMs}ms`;
    const targets = getMotionTargets(card);

    card.style.setProperty("--vl-motion-duration", duration);
    card.style.setProperty("--vl-enter-duration", duration);
    card.style.setProperty("--vl-exit-duration", duration);
    card.style.setProperty("--vl-loop-duration", duration);
    card.style.setProperty("--vl-motion-speed-scale", String(values.speedRate));

    targets.forEach((node) => {
      const totalDelay = values.delayMs + getStaggerDelayMs(node);
      applyDurationVars(node, values.durationMs);
      node.style.animationDelay = `${totalDelay}ms`;
      node.style.animationPlayState = isPaused ? "paused" : "running";
    });

    syncWebAnimations(card, values, isPaused);
  }

    function replayCardAnimations(card, options = {}) {
    if (!card) return;

    const resetScroll = options.resetScroll === true;
    window.clearTimeout(replayTimer);
    const values = getRuntimeValues();

    replayTimer = window.setTimeout(() => {
      if (resetScroll) resetScrollStories(card);
      const targets = getMotionTargets(card);

      targets.forEach((node) => {
        node.getAnimations().forEach((anim) => anim.cancel());
      });

      requestAnimationFrame(() => {
        targets.forEach((node) => {
          node.style.animation = "none";
          void node.offsetHeight;
        });

        requestAnimationFrame(() => {
          clearForcedAnimationStyles(targets);
          isPaused = false;
          updateActionState();
          applyRuntimeToCard(card);
        });
      });
    }, values.delayMs);
  }

  function collectActiveAttributes(card) {
    const found = new Map();

    function add(node, attr) {
      const value = node.getAttribute(attr);
      const key = `${attr}=${value ?? ""}`;
      if (found.has(key)) return;
      found.set(key, { attr, value: value ?? "", node });
    }

    API_COMMANDS.forEach((attr) => {
      if (card.hasAttribute(attr)) add(card, attr);
      card.querySelectorAll(`[${attr}]`).forEach((node) => add(node, attr));
    });

    return Array.from(found.values()).sort((a, b) => {
      const ai = READOUT_PRIORITY.indexOf(a.attr);
      const bi = READOUT_PRIORITY.indexOf(b.attr);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }

  function formatAttrToken({ attr, value }) {
    if (value === "") return attr;
    return `${attr}="${value}"`;
  }

  function deriveMotionHint(card, active) {
    if (!active.length) {
      return "Card de referência — sem attrs de motion no alvo.";
    }

    const primary =
      active.find(({ attr }) => attr === "vl-scene") ||
      active.find(({ attr }) => attr === "vl-enter") ||
      active.find(({ attr }) => attr === "vl-scroll") ||
      active.find(({ attr }) => attr === "vl-effect") ||
      active.find(({ attr }) => attr === "vl-hover") ||
      active.find(({ attr }) => attr === "vl-loop") ||
      active[0];

    let hint = MOTION_HINTS[primary.attr] || "Motion via attrs Velora no alvo selecionado.";

    const timeline = active.find(({ attr }) => attr === "vl-timeline");
    if (timeline?.value && TIMELINE_HINTS[timeline.value]) {
      hint = `${hint} ${TIMELINE_HINTS[timeline.value]}`;
    }

    if (card.querySelector("[vl-scene]")) {
      hint = `${hint} Replay reposiciona scroll da cena.`;
    } else if (primary.attr === "vl-hover" || primary.attr === "vl-effect") {
      hint = `${hint} Passe o pointer para re-disparar.`;
    }

    return hint;
  }

  function renderLiveReadout(card) {
    if (!card) {
      if (liveHint) liveHint.textContent = "Clique num card para ver o que está em motion.";
      if (liveReadout) {
        liveReadout.hidden = true;
        liveReadout.textContent = "";
      }
      return;
    }

    const active = collectActiveAttributes(card);
    const tokens = active.map(formatAttrToken);

    if (liveHint) liveHint.textContent = deriveMotionHint(card, active);
    if (liveReadout) {
      if (tokens.length) {
        liveReadout.hidden = false;
        liveReadout.textContent = tokens.join(" · ");
      } else {
        liveReadout.hidden = true;
        liveReadout.textContent = "";
      }
    }
  }

  function renderAvailableCommands(card) {
    if (!commandList || !card) return;

    const active = collectActiveAttributes(card);
    if (!active.length) {
      commandList.innerHTML =
        '<span class="api-runtime-command-chip is-empty">Sem attrs de motion neste card</span>';
      return;
    }

    commandList.innerHTML = active
      .map(({ attr, value }) => {
        const label = value ? `${attr}="${value}"` : attr;
        return `<span class="api-runtime-command-chip is-available">${label}</span>`;
      })
      .join("");
  }

  function setDrawerOpen(open) {
    if (!drawer || !drawerBtn) return;
    drawer.hidden = !open;
    drawerBtn.classList.toggle("is-active", open);
    drawerBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function updateActionState() {
    if (playBtn) playBtn.classList.toggle("is-active", !isPaused);
    if (pauseBtn) pauseBtn.classList.toggle("is-active", isPaused);
  }

  function selectCard(card) {
    cards.forEach((item) => item.classList.remove("is-selected"));
    selectedCard = card;
    card.classList.add("is-selected");
    const label = card.querySelector("strong")?.textContent?.trim() || "card";
    if (selectedLabel) selectedLabel.textContent = label;
    renderLiveReadout(card);
    renderAvailableCommands(card);
    applyRuntimeToCard(card);
  }

  function getVisibleCards() {
    return cards.filter((card) => !card.classList.contains("is-filter-hidden"));
  }

  function applyCardFilter(kind) {
    cards.forEach((card) => {
      const show = kind === "all" || card.dataset.apiKind === kind;
      card.classList.toggle("is-filter-hidden", !show);
    });

    groups.forEach((group) => {
      const groupCards = Array.from(group.querySelectorAll(".api-card"));
      const hasVisible = groupCards.some((card) => !card.classList.contains("is-filter-hidden"));
      group.classList.toggle("is-filter-empty", !hasVisible);
    });

    filterButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.filterKind === kind);
    });

    if (!selectedCard || selectedCard.classList.contains("is-filter-hidden")) {
      const firstVisible = getVisibleCards()[0];
      if (firstVisible) selectCard(firstVisible);
      else if (selectedLabel) selectedLabel.textContent = "Nenhum";
    }
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => selectCard(card));
    card.addEventListener("focusin", () => {
      if (!selectedCard) selectCard(card);
    });
    card.addEventListener("mouseenter", () => replayCardAnimations(card));
    card.addEventListener("focusin", () => replayCardAnimations(card));
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextKind = button.dataset.filterKind || "all";
      applyCardFilter(nextKind);
    });
  });

  if (delayRange && delayValue) {
    delayRange.addEventListener("input", () => {
      delayValue.textContent = `${Number(delayRange.value)}ms`;
      replayCardAnimations(selectedCard, { resetScroll: true });
    });
  }

  if (durationRange && durationValue) {
    durationRange.addEventListener("input", () => {
      durationValue.textContent = `${Number(durationRange.value)}ms`;
      replayCardAnimations(selectedCard, { resetScroll: true });
    });
  }

  if (speedRange && speedValue) {
    speedRange.addEventListener("input", () => {
      speedValue.textContent = `${Number(speedRange.value).toFixed(2)}x`;
      applyRuntimeToCard(selectedCard);
    });
  }

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      isPaused = false;
      updateActionState();
      applyRuntimeToCard(selectedCard);
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      isPaused = true;
      updateActionState();
      applyRuntimeToCard(selectedCard);
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      isPaused = false;
      updateActionState();
      replayCardAnimations(selectedCard, { resetScroll: true });
    });
  }

  if (drawerBtn && drawer) {
    drawerBtn.addEventListener("click", () => {
      setDrawerOpen(drawer.hidden);
    });
  }

  const firstVisible = getVisibleCards()[0] || cards[0];
  if (firstVisible) selectCard(firstVisible);
  applyCardFilter("all");
  updateActionState();
})();
