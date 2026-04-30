(() => {
  const STORAGE_KEY = "vl-scene-creator-state";
  const BUILDER_VERSION = 2;
  const BASE_DOCUMENT_DURATION = 18000;
  const TIMELINE_STEP = 50;
  const MIN_SCENE_LENGTH = 1200;
  const MIN_ELEMENT_LENGTH = 250;
  const DEFAULT_SCENE_GAP = 400;

  const SCENE_OPTIONS = {
    effect: ["scene-hero-reveal", "scene-feature-flow", "scene-story-pin", "scene-layer-stack"],
    timeline: ["view", "scroll", "auto"],
    range: ["entry", "cover", "contain", "custom"],
  };

  const ELEMENT_OPTIONS = {
    effect: [
      "flow-in",
      "fade-in",
      "fade-up",
      "slide-up",
      "scale-in",
      "blur-in",
      "drift-in",
      "clip-rise",
      "mask-reveal",
      "rotate-in",
      "flip-in",
      "zoom-in",
      "zoom-out",
      "swing-in",
      "glow-in",
      "typewriter",
      "typewriter-soft",
      "text-reveal",
      "text-reveal-up",
      "text-reveal-down",
      "text-line-reveal",
      "text-word-rise",
      "shimmer-text",
      "scroll-marquee",
      "depth-drift",
      "rotate-scroll",
      "wipe-reveal",
      "depth-push",
    ],
    timeline: ["view", "scroll", "auto", "hover", "state"],
    range: ["entry", "cover", "contain", "custom"],
    speed: ["fast", "normal", "slow"],
    depth: ["1", "2", "3", "4"],
    stagger: ["60ms", "80ms", "100ms", "120ms", "150ms", "200ms"],
  };

  const DESIGN_TOKEN_OPTIONS = [
    { value: "", label: "Default" },
    { value: "--vl-bg-main", label: "bg-main" },
    { value: "--vl-bg-surface", label: "bg-surface" },
    { value: "--vl-bg-elevated", label: "bg-elevated" },
    { value: "--vl-text-main", label: "text-main" },
    { value: "--vl-text-muted", label: "text-muted" },
    { value: "--vl-brand-primary", label: "brand-primary" },
    { value: "--vl-brand-secondary", label: "brand-secondary" },
    { value: "--vl-brand-accent", label: "brand-accent" },
    { value: "--vl-border-subtle", label: "border-subtle" },
  ];

  const ELEMENT_LIBRARY = {
    kicker: { label: "Kicker" },
    title: { label: "Title" },
    text: { label: "Paragraph" },
    button: { label: "CTA" },
    list: { label: "List" },
    grid: { label: "Grid" },
    flex: { label: "Flexbox" },
    buttonGroup: { label: "Buttons" },
    image: { label: "Image" },
    video: { label: "Video" },
    quote: { label: "Quote" },
    code: { label: "Code" },
    divider: { label: "Divider" },
    html: { label: "Custom Tag" },
    chips: { label: "Chip Row" },
    cards: { label: "Card Grid" },
    steps: { label: "Steps" },
  };

  const HTML_TAG_OPTIONS = [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "span", "small", "strong", "em", "mark",
    "div", "section", "article", "main", "aside", "nav", "header", "footer",
    "ul", "ol", "li", "dl", "dt", "dd",
    "blockquote", "pre", "code", "details", "summary",
    "figure", "figcaption", "time", "label",
    "a", "img", "video", "audio", "iframe",
    "custom",
  ];

  const DESIGN_SYSTEM_COMPONENTS = {
    heroBanner: {
      label: "Hero Banner",
      description: "Kicker, title, supporting body, and primary CTA.",
      build() {
        return [
          createElement("kicker", { label: "Hero Kicker", text: "Design System" }),
          createElement("title", { label: "Hero Title", text: "Ship premium product experiences" }),
          createElement("text", { label: "Hero Body", text: "Compose narrative-first pages with motion-native Velora components." }),
          createElement("button", { label: "Hero CTA", text: "Get Started", href: "/pages/core/landing.html" }),
        ];
      },
    },
    featureGrid: {
      label: "Feature Grid",
      description: "Section heading with cards and CTA.",
      build() {
        return [
          createElement("title", { label: "Feature Title", text: "Feature highlights" }),
          createElement("cards", { label: "Feature Cards", items: defaultItems("cards", 4, "Feature") }),
          createElement("button", { label: "Feature CTA", text: "View all features", href: "/pages/library/gallery.html" }),
        ];
      },
    },
    faqAccordion: {
      label: "FAQ Accordion",
      description: "FAQ heading with accordion-like step rows.",
      build() {
        return [
          createElement("title", { label: "FAQ Title", text: "Frequently asked questions" }),
          createElement("steps", { label: "FAQ Rows", items: defaultItems("steps", 5, "Question") }),
        ];
      },
    },
    blogTeasers: {
      label: "Blog Teasers",
      description: "Blog cards block with tags.",
      build() {
        return [
          createElement("title", { label: "Blog Title", text: "Latest stories" }),
          createElement("chips", { label: "Blog Tags", items: ["CSS", "Motion", "Systems", "Accessibility"] }),
          createElement("cards", { label: "Blog Teasers", items: defaultItems("cards", 3, "Article") }),
        ];
      },
    },
    ctaBand: {
      label: "CTA Band",
      description: "Compact call-to-action strip with chips.",
      build() {
        return [
          createElement("title", { label: "CTA Title", text: "Ready to launch with Velora?" }),
          createElement("chips", { label: "CTA Chips", items: ["No JS", "120fps", "Design Tokens"] }),
          createElement("button", { label: "CTA Button", text: "Start building", href: "/pages/scenes/scene-creator.html" }),
        ];
      },
    },
  };

  const state = {
    version: BUILDER_VERSION,
    documentTitle: "Velora Scroll Narrative",
    playhead: 2200,
    selectedSceneId: null,
    selectedElementId: null,
    scenes: [],
  };

  const dragState = {
    active: false,
    mode: null,
    targetType: null,
    sceneId: null,
    elementId: null,
    startX: 0,
    originStart: 0,
    originLength: 0,
    trackWidth: 1,
  };

  const previewState = {
    delayMs: 0,
    speedRate: 1,
    timerId: null,
    sceneTimerIds: [],
  };

  const nodes = {
    documentTitle: document.querySelector('[data-role="document-title"]'),
    addSceneTemplate: document.querySelector('[data-role="add-scene-template"]'),
    addScene: document.querySelector('[data-role="add-scene"]'),
    duplicateScene: document.querySelector('[data-role="duplicate-scene"]'),
    removeScene: document.querySelector('[data-role="remove-scene"]'),
    sequenceScenes: document.querySelector('[data-role="sequence-scenes"]'),
    wizardOpen: document.querySelector('[data-role="wizard-open"]'),
    wizardModal: document.querySelector('[data-role="wizard-modal"]'),
    wizardHeroType: document.querySelector('[data-role="wizard-hero-type"]'),
    wizardDensity: document.querySelector('[data-role="wizard-density"]'),
    wizardCtaStyle: document.querySelector('[data-role="wizard-cta-style"]'),
    wizardCancel: document.querySelector('[data-role="wizard-cancel"]'),
    wizardGenerate: document.querySelector('[data-role="wizard-generate"]'),
    wizardGenerateScene: document.querySelector('[data-role="wizard-generate-scene"]'),
    sceneList: document.querySelector('[data-role="scene-list"]'),
    previewRoot: document.querySelector('[data-role="preview-root"]'),
    previewMeta: document.querySelector('[data-role="preview-meta"]'),
    sceneSelect: document.querySelector('[data-role="scene-select"]'),
    sceneTemplate: document.querySelector('[data-role="scene-template"]'),
    sceneTag: document.querySelector('[data-role="scene-tag"]'),
    sceneName: document.querySelector('[data-role="scene-name"]'),
    sceneEffect: document.querySelector('[data-role="scene-effect"]'),
    sceneTimeline: document.querySelector('[data-role="scene-timeline"]'),
    sceneRange: document.querySelector('[data-role="scene-range"]'),
    sceneRangeCustom: document.querySelector('[data-role="scene-range-custom"]'),
    sceneEntryWindow: document.querySelector('[data-role="scene-entry-window"]'),
    sceneExitWindow: document.querySelector('[data-role="scene-exit-window"]'),
    sceneBgColor: document.querySelector('[data-role="scene-bg-color"]'),
    sceneTextColor: document.querySelector('[data-role="scene-text-color"]'),
    sceneInlineCss: document.querySelector('[data-role="scene-inline-css"]'),
    sceneLength: document.querySelector('[data-role="scene-length"]'),
    moveSceneUp: document.querySelector('[data-role="move-scene-up"]'),
    moveSceneDown: document.querySelector('[data-role="move-scene-down"]'),
    elementSelect: document.querySelector('[data-role="element-select"]'),
    addElementKind: document.querySelector('[data-role="add-element-kind"]'),
    addElement: document.querySelector('[data-role="add-element"]'),
    addDesignComponent: document.querySelector('[data-role="add-design-component"]'),
    designComponentSelect: document.querySelector('[data-role="design-component-select"]'),
    designComponentMeta: document.querySelector('[data-role="design-component-meta"]'),
    removeElement: document.querySelector('[data-role="remove-element"]'),
    moveElementUp: document.querySelector('[data-role="move-element-up"]'),
    moveElementDown: document.querySelector('[data-role="move-element-down"]'),
    cascadeElements: document.querySelector('[data-role="cascade-elements"]'),
    elementLabel: document.querySelector('[data-role="element-label"]'),
    elementText: document.querySelector('[data-role="element-text"]'),
    elementHref: document.querySelector('[data-role="element-href"]'),
    elementItemCount: document.querySelector('[data-role="element-item-count"]'),
    elementTag: document.querySelector('[data-role="element-tag"]'),
    elementCustomTag: document.querySelector('[data-role="element-custom-tag"]'),
    elementSrc: document.querySelector('[data-role="element-src"]'),
    elementAlt: document.querySelector('[data-role="element-alt"]'),
    elementBgColor: document.querySelector('[data-role="element-bg-color"]'),
    elementTextColor: document.querySelector('[data-role="element-text-color"]'),
    elementInlineCss: document.querySelector('[data-role="element-inline-css"]'),
    elementKindMeta: document.querySelector('[data-role="element-kind-meta"]'),
    elementEffect: document.querySelector('[data-role="element-effect"]'),
    elementTimeline: document.querySelector('[data-role="element-timeline"]'),
    elementRange: document.querySelector('[data-role="element-range"]'),
    elementRangeCustom: document.querySelector('[data-role="element-range-custom"]'),
    elementSpeed: document.querySelector('[data-role="element-speed"]'),
    elementDepth: document.querySelector('[data-role="element-depth"]'),
    elementStagger: document.querySelector('[data-role="element-stagger"]'),
    elementMute: document.querySelector('[data-role="element-mute"]'),
    elementStart: document.querySelector('[data-role="element-start"]'),
    elementLength: document.querySelector('[data-role="element-length"]'),
    previewDelay: document.querySelector('[data-role="preview-delay"]'),
    previewSpeed: document.querySelector('[data-role="preview-speed"]'),
    previewDelayValue: document.querySelector('[data-role="preview-delay-value"]'),
    previewSpeedValue: document.querySelector('[data-role="preview-speed-value"]'),
    previewSelectedEffect: document.querySelector('[data-role="preview-selected-effect"]'),
    previewReplaySelected: document.querySelector('[data-role="preview-replay-selected"]'),
    previewReplayScene: document.querySelector('[data-role="preview-replay-scene"]'),
    sceneLanes: document.querySelector('[data-role="scene-lanes"]'),
    elementLanes: document.querySelector('[data-role="element-lanes"]'),
    timelineScrub: document.querySelector('[data-role="timeline-scrub"]'),
    timelinePlayhead: document.querySelector('[data-role="timeline-playhead"]'),
    timelineTime: document.querySelector('[data-role="timeline-time"]'),
    supportWarning: document.querySelector('[data-role="support-warning"]'),
    outputHtml: document.querySelector('[data-role="output-html"]'),
    outputCss: document.querySelector('[data-role="output-css"]'),
    outputJson: document.querySelector('[data-role="output-json"]'),
    copyHtml: document.querySelector('[data-role="copy-html"]'),
    copyCss: document.querySelector('[data-role="copy-css"]'),
    copyJson: document.querySelector('[data-role="copy-json"]'),
    exportJson: document.querySelector('[data-role="export-json"]'),
    importJson: document.querySelector('[data-role="import-json"]'),
    download: document.querySelector('[data-role="download"]'),
    reset: document.querySelector('[data-role="reset"]'),
    message: document.querySelector('[data-role="message"]'),
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function makeId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function quantizeMs(value) {
    return Math.round(value / TIMELINE_STEP) * TIMELINE_STEP;
  }

  function formatClock(ms) {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    const cents = String(centiseconds).padStart(2, "0");
    return `${minutes}:${secs}.${cents}`;
  }

  function fillSelect(node, values, labels) {
    node.innerHTML = values
      .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(labels?.[value] || value)}</option>`)
      .join("");
  }

  function defaultItems(type, count, seedLabel) {
    if (type === "chips") {
      return Array.from({ length: count }, (_, index) => `Tag ${index + 1}`);
    }
    if (type === "cards") {
      return Array.from({ length: count }, (_, index) => ({
        title: `${seedLabel} ${index + 1}`,
        body: `Structured reveal rhythm for section ${index + 1}.`,
      }));
    }
    if (type === "steps") {
      return Array.from({ length: count }, (_, index) => ({
        title: `${seedLabel} phase ${index + 1}`,
        body: `Narrative checkpoint ${index + 1} keeps momentum and context.`,
      }));
    }
    if (type === "list") {
      return Array.from({ length: count }, (_, index) => `${seedLabel} item ${index + 1}`);
    }
    if (type === "grid") {
      return Array.from({ length: count }, (_, index) => `${seedLabel} cell ${index + 1}`);
    }
    if (type === "flex") {
      return Array.from({ length: count }, (_, index) => `${seedLabel} block ${index + 1}`);
    }
    if (type === "buttonGroup") {
      return Array.from({ length: count }, (_, index) => `Button ${index + 1}`);
    }
    return [];
  }

  function sanitizeTagName(tagName) {
    const value = String(tagName || "").trim().toLowerCase();
    if (!value || value === "custom") {
      return "div";
    }
    if (!/^[a-z][a-z0-9-]*$/.test(value)) {
      return "div";
    }
    if (value === "script") {
      return "div";
    }
    return value;
  }

  function createElement(type, overrides = {}) {
    const base = {
      id: makeId("el"),
      type,
      label: ELEMENT_LIBRARY[type].label,
      text: "",
      href: "#",
      items: [],
      tagName: type === "title"
        ? "h2"
        : type === "text"
          ? "p"
          : type === "list"
            ? "ul"
            : type === "quote"
              ? "blockquote"
              : type === "code"
                ? "pre"
                : type === "divider"
                  ? "hr"
                  : type === "html"
                    ? "div"
                    : type === "button"
                      ? "a"
                      : type === "image"
                        ? "img"
                        : type === "video"
                          ? "video"
                          : "div",
      customTagName: "",
      mediaSrc: "",
      mediaAlt: "",
      bgColorToken: "",
      textColorToken: "",
      inlineCss: "",
      effect: type === "text" || type === "quote" ? "blur-in" : type === "cards" || type === "steps" ? "fade-up" : type === "image" || type === "video" ? "mask-reveal" : "flow-in",
      timeline: "view",
      range: "entry",
      rangeCustom: "entry 0% cover 42%",
      speed: "normal",
      depth: "2",
      stagger: "100ms",
      clipStart: 200,
      clipLength: 1200,
      muted: false,
    };
    const element = { ...base, ...overrides };
    element.label = String(element.label || ELEMENT_LIBRARY[type].label);
    element.text = String(element.text ?? "");
    element.href = String(element.href || "#");
    element.items = Array.isArray(element.items) ? clone(element.items) : [];
    element.tagName = sanitizeTagName(element.tagName || base.tagName);
    element.customTagName = String(element.customTagName || "").trim().toLowerCase();
    element.mediaSrc = String(element.mediaSrc || "");
    element.mediaAlt = String(element.mediaAlt || "");
    element.bgColorToken = String(element.bgColorToken || "");
    element.textColorToken = String(element.textColorToken || "");
    element.inlineCss = String(element.inlineCss || "");
    element.depth = String(element.depth || "2");
    element.clipStart = quantizeMs(Number(element.clipStart || 0));
    element.clipLength = quantizeMs(Number(element.clipLength || 1200));
    element.muted = Boolean(element.muted);
    return element;
  }

  const TEMPLATE_REGISTRY = {
    blank: {
      label: "Blank Canvas",
      createScene(overrides = {}) {
        return {
          id: makeId("scene"),
          name: overrides.name || "Blank Canvas",
          template: "blank",
          tagName: "section",
          sceneEffect: "scene-layer-stack",
          timeline: "view",
          range: "entry",
          rangeCustom: "entry 0% cover 60%",
          scrollStart: 0,
          scrollLength: 3200,
          elements: [],
        };
      },
    },
    hero: {
      label: "Hero Reveal",
      createScene(overrides = {}) {
        return {
          id: makeId("scene"),
          name: overrides.name || "Launch Hero",
          template: "hero",
          tagName: "section",
          sceneEffect: "scene-hero-reveal",
          timeline: "view",
          range: "entry",
          rangeCustom: "entry 0% cover 48%",
          scrollStart: 0,
          scrollLength: 3200,
          elements: [
            createElement("kicker", { label: "Kicker", text: "Featured Scene", clipStart: 120, clipLength: 700 }),
            createElement("title", { label: "Title", text: overrides.title || "Build elegant product launches with Velora", clipStart: 320, clipLength: 1100, effect: "fade-up" }),
            createElement("text", { label: "Subtitle", text: overrides.subtitle || "Compose cinematic sections with zero-JS motion attributes and token-driven styling.", clipStart: 560, clipLength: 1050 }),
            createElement("chips", { label: "Signal Chips", items: defaultItems("chips", overrides.itemCount || 4, "Tag"), clipStart: 920, clipLength: 1100, effect: "slide-up" }),
            createElement("button", { label: "Primary CTA", text: overrides.cta || "Launch Scene", clipStart: 1260, clipLength: 950 }),
          ],
        };
      },
    },
    features: {
      label: "Feature Flow",
      createScene(overrides = {}) {
        const title = overrides.title || "Feature storytelling timed for scroll";
        return {
          id: makeId("scene"),
          name: overrides.name || "Feature Grid",
          template: "features",
          tagName: "section",
          sceneEffect: "scene-feature-flow",
          timeline: "view",
          range: "cover",
          rangeCustom: "entry 10% cover 64%",
          scrollStart: 0,
          scrollLength: 3400,
          elements: [
            createElement("title", { label: "Title", text: title, clipStart: 180, clipLength: 950, effect: "fade-up" }),
            createElement("text", { label: "Subtitle", text: overrides.subtitle || "Each card enters in sequence for a clean product education narrative.", clipStart: 420, clipLength: 900 }),
            createElement("cards", { label: "Feature Cards", items: defaultItems("cards", overrides.itemCount || 4, title), clipStart: 760, clipLength: 1550, effect: "fade-up", stagger: "120ms" }),
            createElement("button", { label: "Secondary CTA", text: overrides.cta || "See features", clipStart: 1540, clipLength: 980 }),
          ],
        };
      },
    },
    story: {
      label: "Story Pin",
      createScene(overrides = {}) {
        const title = overrides.title || "Pinned narrative sequence";
        return {
          id: makeId("scene"),
          name: overrides.name || "Narrative Story",
          template: "story",
          tagName: "article",
          sceneEffect: "scene-story-pin",
          timeline: "view",
          range: "contain",
          rangeCustom: "entry 0% cover 52%",
          scrollStart: 0,
          scrollLength: 3600,
          elements: [
            createElement("kicker", { label: "Context", text: "Story Flow", clipStart: 100, clipLength: 650 }),
            createElement("title", { label: "Title", text: title, clipStart: 260, clipLength: 950, effect: "fade-up" }),
            createElement("text", { label: "Narrative", text: overrides.subtitle || "Guide the reader from context to action with a controlled, step-by-step rhythm.", clipStart: 520, clipLength: 900 }),
            createElement("steps", { label: "Story Steps", items: defaultItems("steps", overrides.itemCount || 4, title), clipStart: 900, clipLength: 1650, effect: "fade-up", stagger: "150ms" }),
            createElement("button", { label: "Story CTA", text: overrides.cta || "Read story", clipStart: 1760, clipLength: 900 }),
          ],
        };
      },
    },
    scroll: {
      label: "Scroll Reveal",
      createScene(overrides = {}) {
        const title = overrides.title || "Scroll-driven reveal stack";
        return {
          id: makeId("scene"),
          name: overrides.name || "Reveal Stack",
          template: "scroll",
          tagName: "section",
          sceneEffect: "scene-layer-stack",
          timeline: "scroll",
          range: "entry",
          rangeCustom: "entry 0% cover 60%",
          scrollStart: 0,
          scrollLength: 3600,
          elements: [
            createElement("title", { label: "Title", text: title, clipStart: 160, clipLength: 900, effect: "fade-up", timeline: "scroll" }),
            createElement("text", { label: "Subtitle", text: overrides.subtitle || "Tune page-scroll choreography while stacking layered product moments.", clipStart: 420, clipLength: 900, timeline: "scroll" }),
            createElement("cards", { label: "Layer Cards", items: defaultItems("cards", overrides.itemCount || 4, "Layer"), clipStart: 760, clipLength: 1700, effect: "drift-in", timeline: "scroll", depth: "3", stagger: "80ms" }),
            createElement("button", { label: "Scroll CTA", text: overrides.cta || "Scroll scene", clipStart: 1680, clipLength: 900, timeline: "scroll" }),
          ],
        };
      },
    },
  };

  function listSceneTemplates() {
    return Object.keys(TEMPLATE_REGISTRY);
  }

  function getDocumentDuration() {
    const maxEnd = state.scenes.reduce((max, scene) => Math.max(max, scene.scrollStart + scene.scrollLength), 0);
    return Math.max(BASE_DOCUMENT_DURATION, quantizeMs(maxEnd + DEFAULT_SCENE_GAP));
  }

  function sortedScenes() {
    return [...state.scenes].sort((left, right) => left.scrollStart - right.scrollStart);
  }

  function getSelectedScene() {
    return state.scenes.find((scene) => scene.id === state.selectedSceneId) || state.scenes[0] || null;
  }

  function getSelectedElement(scene = getSelectedScene()) {
    if (!scene) {
      return null;
    }
    return scene.elements.find((element) => element.id === state.selectedElementId) || scene.elements[0] || null;
  }

  function setSelectedScene(sceneId) {
    const scene = state.scenes.find((item) => item.id === sceneId) || state.scenes[0] || null;
    state.selectedSceneId = scene ? scene.id : null;
    state.selectedElementId = scene && scene.elements[0] ? scene.elements[0].id : null;
  }

  function setSelectedElement(elementId) {
    const scene = getSelectedScene();
    if (!scene) {
      state.selectedElementId = null;
      return;
    }
    const element = scene.elements.find((item) => item.id === elementId) || scene.elements[0] || null;
    state.selectedElementId = element ? element.id : null;
  }

  function sequenceScenes() {
    let cursor = 0;
    state.scenes.forEach((scene) => {
      scene.scrollStart = cursor;
      scene.scrollLength = clamp(quantizeMs(scene.scrollLength), MIN_SCENE_LENGTH, 12000);
      clampSceneElements(scene);
      cursor += scene.scrollLength + DEFAULT_SCENE_GAP;
    });
  }

  function cascadeElements(scene) {
    let cursor = 120;
    scene.elements.forEach((element) => {
      element.clipStart = clamp(cursor, 0, Math.max(scene.scrollLength - MIN_ELEMENT_LENGTH, 0));
      element.clipLength = clamp(element.clipLength || 900, MIN_ELEMENT_LENGTH, scene.scrollLength - element.clipStart);
      cursor += 260;
    });
  }

  function clampSceneElements(scene) {
    scene.elements.forEach((element) => {
      element.clipStart = clamp(quantizeMs(Number(element.clipStart || 0)), 0, Math.max(scene.scrollLength - MIN_ELEMENT_LENGTH, 0));
      element.clipLength = clamp(quantizeMs(Number(element.clipLength || MIN_ELEMENT_LENGTH)), MIN_ELEMENT_LENGTH, Math.max(scene.scrollLength - element.clipStart, MIN_ELEMENT_LENGTH));
    });
  }

  function createScene(templateKey, overrides = {}) {
    const scene = TEMPLATE_REGISTRY[templateKey].createScene(overrides);
    scene.scrollStart = overrides.scrollStart ?? 0;
    scene.scrollLength = overrides.scrollLength ?? scene.scrollLength;
    scene.entryWindow = clamp(Number(scene.entryWindow ?? overrides.entryWindow ?? 10), 0, 95);
    scene.exitWindow = clamp(Number(scene.exitWindow ?? overrides.exitWindow ?? 90), 5, 100);
    if (scene.entryWindow >= scene.exitWindow) {
      scene.exitWindow = clamp(scene.entryWindow + 5, 5, 100);
    }
    clampSceneElements(scene);
    return scene;
  }

  function ensureStateShape() {
    if (!Array.isArray(state.scenes) || !state.scenes.length) {
      state.scenes = [createScene("hero")];
      sequenceScenes();
    }

    state.scenes = state.scenes.map((scene, index) => normalizeScene(scene, index));
    if (!state.scenes.some((scene) => scene.id === state.selectedSceneId)) {
      state.selectedSceneId = state.scenes[0]?.id || null;
    }

    const scene = getSelectedScene();
    if (!scene || !scene.elements.some((element) => element.id === state.selectedElementId)) {
      state.selectedElementId = scene?.elements[0]?.id || null;
    }

    state.playhead = clamp(quantizeMs(Number(state.playhead || 0)), 0, getDocumentDuration());
  }

  function normalizeScene(input, index) {
    const template = TEMPLATE_REGISTRY[input.template] ? input.template : "hero";
    const base = createScene(template, { name: input.name });
    const scene = {
      ...base,
      ...input,
      id: String(input.id || base.id || makeId("scene")),
      name: String(input.name || base.name || `Scene ${index + 1}`),
      template,
      tagName: input.tagName === "article" ? "article" : "section",
      sceneEffect: SCENE_OPTIONS.effect.includes(input.sceneEffect) ? input.sceneEffect : base.sceneEffect,
      timeline: SCENE_OPTIONS.timeline.includes(input.timeline) ? input.timeline : base.timeline,
      range: SCENE_OPTIONS.range.includes(input.range) ? input.range : base.range,
      rangeCustom: String(input.rangeCustom || base.rangeCustom),
      entryWindow: clamp(Number(input.entryWindow ?? base.entryWindow ?? 10), 0, 95),
      exitWindow: clamp(Number(input.exitWindow ?? base.exitWindow ?? 90), 5, 100),
      bgColorToken: String(input.bgColorToken || base.bgColorToken || ""),
      textColorToken: String(input.textColorToken || base.textColorToken || ""),
      inlineCss: String(input.inlineCss || base.inlineCss || ""),
      scrollStart: quantizeMs(Number.isFinite(Number(input.scrollStart)) ? Number(input.scrollStart) : index * (base.scrollLength + DEFAULT_SCENE_GAP)),
      scrollLength: clamp(quantizeMs(Number(input.scrollLength || base.scrollLength)), MIN_SCENE_LENGTH, 12000),
    };

    if (scene.entryWindow >= scene.exitWindow) {
      scene.exitWindow = clamp(scene.entryWindow + 5, 5, 100);
    }

    scene.elements = Array.isArray(input.elements) && input.elements.length
      ? input.elements.map((element) => normalizeElement(element, scene.scrollLength))
      : base.elements.map((element) => normalizeElement(element, scene.scrollLength));

    clampSceneElements(scene);
    return scene;
  }

  function normalizeElement(input, sceneLength) {
    const type = ELEMENT_LIBRARY[input.type] ? input.type : "text";
    const base = createElement(type);
    const element = {
      ...base,
      ...input,
      id: String(input.id || base.id || makeId("el")),
      type,
      label: String(input.label || base.label),
      text: String(input.text ?? base.text),
      href: String(input.href || base.href),
      tagName: sanitizeTagName(input.tagName || base.tagName),
      customTagName: String(input.customTagName || base.customTagName || "").trim().toLowerCase(),
      mediaSrc: String(input.mediaSrc || base.mediaSrc || ""),
      mediaAlt: String(input.mediaAlt || base.mediaAlt || ""),
      bgColorToken: String(input.bgColorToken || base.bgColorToken || ""),
      textColorToken: String(input.textColorToken || base.textColorToken || ""),
      inlineCss: String(input.inlineCss || base.inlineCss || ""),
      effect: ELEMENT_OPTIONS.effect.includes(input.effect) ? input.effect : base.effect,
      timeline: ELEMENT_OPTIONS.timeline.includes(input.timeline) ? input.timeline : base.timeline,
      range: ELEMENT_OPTIONS.range.includes(input.range) ? input.range : base.range,
      rangeCustom: String(input.rangeCustom || base.rangeCustom),
      speed: ELEMENT_OPTIONS.speed.includes(input.speed) ? input.speed : base.speed,
      depth: ELEMENT_OPTIONS.depth.includes(String(input.depth)) ? String(input.depth) : base.depth,
      stagger: ELEMENT_OPTIONS.stagger.includes(input.stagger) ? input.stagger : base.stagger,
      clipStart: clamp(quantizeMs(Number(input.clipStart || base.clipStart)), 0, Math.max(sceneLength - MIN_ELEMENT_LENGTH, 0)),
      clipLength: clamp(quantizeMs(Number(input.clipLength || base.clipLength)), MIN_ELEMENT_LENGTH, Math.max(sceneLength, MIN_ELEMENT_LENGTH)),
      muted: Boolean(input.muted),
      items: Array.isArray(input.items) ? clone(input.items) : clone(base.items),
    };

    element.clipLength = clamp(element.clipLength, MIN_ELEMENT_LENGTH, Math.max(sceneLength - element.clipStart, MIN_ELEMENT_LENGTH));
    return element;
  }

  function replaceSceneTemplate(scene, templateKey) {
    const rebuilt = createScene(templateKey, { name: scene.name, scrollLength: scene.scrollLength });
    const previousElements = Array.isArray(scene.elements) ? scene.elements.map((element) => normalizeElement(element, scene.scrollLength)) : [];

    function claimPreviousByType(type) {
      const index = previousElements.findIndex((element) => element.type === type);
      if (index === -1) {
        return null;
      }
      const [claimed] = previousElements.splice(index, 1);
      return claimed;
    }

    const mergedElements = rebuilt.elements.map((templateElement) => {
      const previous = claimPreviousByType(templateElement.type);
      if (!previous) {
        return normalizeElement(templateElement, scene.scrollLength);
      }
      return normalizeElement(
        {
          ...templateElement,
          ...previous,
          id: previous.id,
          type: templateElement.type,
          label: previous.label || templateElement.label,
          text: previous.text || templateElement.text,
          href: previous.href || templateElement.href,
          items: Array.isArray(previous.items) && previous.items.length ? previous.items : templateElement.items,
        },
        scene.scrollLength,
      );
    });

    previousElements.forEach((extra) => {
      mergedElements.push(normalizeElement(extra, scene.scrollLength));
    });

    scene.template = templateKey;
    scene.sceneEffect = rebuilt.sceneEffect;
    scene.timeline = rebuilt.timeline;
    scene.range = rebuilt.range;
    scene.rangeCustom = rebuilt.rangeCustom;
    scene.elements = mergedElements;
    clampSceneElements(scene);
    state.selectedElementId = scene.elements[0]?.id || null;
  }

  function duplicateScene() {
    const scene = getSelectedScene();
    if (!scene) {
      return;
    }
    const next = clone(scene);
    next.id = makeId("scene");
    next.name = `${scene.name} Copy`;
    next.scrollStart = scene.scrollStart + scene.scrollLength + DEFAULT_SCENE_GAP;
    next.elements = next.elements.map((element) => ({ ...element, id: makeId("el") }));
    state.scenes.push(next);
    sequenceScenes();
    setSelectedScene(next.id);
  }

  function removeSelectedScene() {
    if (state.scenes.length === 1) {
      nodes.message.textContent = "At least one scene is required in the document.";
      return;
    }
    state.scenes = state.scenes.filter((scene) => scene.id !== state.selectedSceneId);
    sequenceScenes();
    setSelectedScene(state.scenes[0]?.id || null);
  }

  function moveSelectedScene(offset) {
    const scene = getSelectedScene();
    if (!scene) {
      return;
    }
    const index = state.scenes.findIndex((item) => item.id === scene.id);
    const targetIndex = clamp(index + offset, 0, state.scenes.length - 1);
    if (index === targetIndex) {
      return;
    }
    const [item] = state.scenes.splice(index, 1);
    state.scenes.splice(targetIndex, 0, item);
    sequenceScenes();
  }

  function addElementToScene(scene, type) {
    if (!scene) {
      return null;
    }
    const element = createElement(type, {
      label: `${ELEMENT_LIBRARY[type].label} ${scene.elements.length + 1}`,
      text: type === "kicker"
        ? "New Label"
        : type === "title"
          ? "New heading"
          : type === "text" || type === "html"
            ? "Add content for this element."
            : type === "quote"
              ? "\"Design systems are stories told through constraints.\""
              : type === "code"
                ? "const scene = { motion: 'native' };"
            : type === "button"
              ? "Call to action"
              : "",
      items: type === "chips"
        ? defaultItems("chips", 4, "Tag")
        : type === "cards"
          ? defaultItems("cards", 3, "Card")
          : type === "steps"
            ? defaultItems("steps", 3, "Step")
            : type === "list"
              ? defaultItems("list", 4, "List")
              : type === "grid"
                ? defaultItems("grid", 4, "Grid")
                : type === "flex"
                  ? defaultItems("flex", 3, "Flex")
                  : type === "buttonGroup"
                    ? defaultItems("buttonGroup", 3, "Button")
              : [],
      mediaSrc: type === "image" ? "/img/placeholder.svg" : "",
      mediaAlt: type === "image" ? "Image description" : type === "video" ? "Video" : "",
      clipStart: Math.min(scene.scrollLength - MIN_ELEMENT_LENGTH, 240 + scene.elements.length * 220),
      clipLength: type === "cards" || type === "steps" ? 1300 : 900,
    });
    scene.elements.push(element);
    clampSceneElements(scene);
    state.selectedElementId = element.id;
    return element;
  }

  function addElementToSelectedScene(type) {
    const scene = getSelectedScene();
    return addElementToScene(scene, type);
  }

  function addDesignComponentToScene(scene, componentKey) {
    const preset = DESIGN_SYSTEM_COMPONENTS[componentKey];
    if (!scene || !preset) {
      return 0;
    }

    const startCursor = Math.min(scene.scrollLength - MIN_ELEMENT_LENGTH, 180 + scene.elements.length * 160);
    const presetElements = preset.build();

    presetElements.forEach((element, index) => {
      element.id = makeId("el");
      element.label = `${preset.label} ${index + 1}`;
      element.clipStart = Math.min(scene.scrollLength - MIN_ELEMENT_LENGTH, startCursor + (index * 220));
      element.clipLength = element.type === "cards" || element.type === "steps" ? 1300 : 900;
      scene.elements.push(normalizeElement(element, scene.scrollLength));
    });

    clampSceneElements(scene);
    state.selectedElementId = scene.elements.at(-1)?.id || null;
    return presetElements.length;
  }

  function removeSelectedElement() {
    const scene = getSelectedScene();
    if (!scene || !scene.elements.length) {
      nodes.message.textContent = "No elements available to remove in this scene.";
      return;
    }
    scene.elements = scene.elements.filter((element) => element.id !== state.selectedElementId);
    state.selectedElementId = scene.elements[0]?.id || null;
  }

  function moveSelectedElement(offset) {
    const scene = getSelectedScene();
    const element = getSelectedElement(scene);
    if (!scene || !element) {
      return;
    }
    const index = scene.elements.findIndex((item) => item.id === element.id);
    const targetIndex = clamp(index + offset, 0, scene.elements.length - 1);
    if (index === targetIndex) {
      return;
    }
    const [item] = scene.elements.splice(index, 1);
    scene.elements.splice(targetIndex, 0, item);
  }

  function buildCollectionMarkup(element) {
    if (element.type === "chips") {
      return `<div class="sc-chip-row">${element.items.map((item) => `<span class="sc-chip">${escapeHtml(item)}</span>`).join("")}</div>`;
    }
    if (element.type === "cards") {
      return `<div class="sc-card-grid">${element.items
        .map((item) => `<article class="sc-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`)
        .join("")}</div>`;
    }
    if (element.type === "steps") {
      return `<div class="sc-steps">${element.items
        .map((item) => `<div class="sc-step"><strong>${escapeHtml(item.title)}</strong><p class="sc-subtitle">${escapeHtml(item.body)}</p></div>`)
        .join("")}</div>`;
    }
    if (element.type === "list") {
      const tag = element.tagName === "ol" ? "ol" : "ul";
      return `<${tag} class="sc-el-list">${element.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
    }
    if (element.type === "grid") {
      return `<div class="sc-el-grid">${element.items.map((item) => `<div class="sc-el-grid-item">${escapeHtml(item)}</div>`).join("")}</div>`;
    }
    if (element.type === "flex") {
      return `<div class="sc-el-flex">${element.items.map((item) => `<div class="sc-el-flex-item">${escapeHtml(item)}</div>`).join("")}</div>`;
    }
    if (element.type === "buttonGroup") {
      return `<div class="sc-el-button-row">${element.items.map((item) => `<a class="sc-chip sc-chip--cta" href="#">${escapeHtml(item)}</a>`).join("")}</div>`;
    }
    return "";
  }

  function buildStyleAttrFromTokens(bgColorToken, textColorToken, inlineCss, extraStyles = "") {
    const segments = [];
    if (bgColorToken) {
      segments.push(`background:var(${bgColorToken});`);
    }
    if (textColorToken) {
      segments.push(`color:var(${textColorToken});`);
    }
    if (inlineCss && inlineCss.trim()) {
      segments.push(inlineCss.trim().endsWith(";") ? inlineCss.trim() : `${inlineCss.trim()};`);
    }
    if (extraStyles) {
      segments.push(extraStyles);
    }
    return segments.join(" ");
  }

  function sceneAttrMarkup(scene) {
    const style = buildStyleAttrFromTokens(
      scene.bgColorToken,
      scene.textColorToken,
      scene.inlineCss,
      `--scene-progress:${((state.playhead - scene.scrollStart) / Math.max(scene.scrollLength, 1)).toFixed(3)};`,
    );
    const attrs = [
      `class="sc-scene scene-custom"`,
      `data-scene-id="${escapeHtml(scene.id)}"`,
      `vl-effect="${escapeHtml(scene.sceneEffect)}"`,
      `vl-timeline="${escapeHtml(scene.timeline)}"`,
      `vl-range="${escapeHtml(scene.range === "custom" ? "custom" : scene.range)}"`,
      `style="${escapeHtml(style)}"`,
    ];
    return attrs.join(" ");
  }

  function elementAttrMarkup(element) {
    const style = buildStyleAttrFromTokens(element.bgColorToken, element.textColorToken, element.inlineCss);
    const attrs = [
      `class="sc-el sc-el--${escapeHtml(element.type)}"`,
      `data-element-id="${escapeHtml(element.id)}"`,
      `vl-effect="${escapeHtml(element.effect)}"`,
      `vl-timeline="${escapeHtml(element.timeline)}"`,
      `vl-range="${escapeHtml(element.range === "custom" ? "custom" : element.range)}"`,
      `vl-speed="${escapeHtml(element.speed)}"`,
      `vl-depth="${escapeHtml(element.depth)}"`,
      `vl-stagger="${escapeHtml(element.stagger)}"`,
      element.type === "chips" || element.type === "cards" || element.type === "steps" || element.type === "list" || element.type === "grid" || element.type === "flex" || element.type === "buttonGroup" ? 'vl-children="stagger"' : "",
      style ? `style="${escapeHtml(style)}"` : "",
    ].filter(Boolean);
    return attrs.join(" ");
  }

  function renderElementMarkup(element) {
    const attrs = elementAttrMarkup(element);
    if (element.type === "kicker") {
      return `<p ${attrs} class="vl-kicker sc-el sc-el--kicker">${escapeHtml(element.text)}</p>`;
    }
    if (element.type === "title") {
      return `<h2 ${attrs} class="sc-title sc-el sc-el--title">${escapeHtml(element.text)}</h2>`;
    }
    if (element.type === "text") {
      return `<p ${attrs} class="sc-subtitle sc-el sc-el--text">${escapeHtml(element.text)}</p>`;
    }
    if (element.type === "button") {
      return `<a ${attrs} class="sc-chip sc-chip--cta sc-el sc-el--button" href="${escapeHtml(element.href || "#")}">${escapeHtml(element.text)}</a>`;
    }
    if (element.type === "quote") {
      return `<blockquote ${attrs} class="sc-subtitle sc-el sc-el--quote">${escapeHtml(element.text || "Quote text")}</blockquote>`;
    }
    if (element.type === "code") {
      return `<pre ${attrs} class="sc-el sc-el--code"><code>${escapeHtml(element.text || "const scene = { motion: 'native' };")}</code></pre>`;
    }
    if (element.type === "divider") {
      return `<hr ${attrs} class="sc-el sc-el--divider" />`;
    }
    if (element.type === "image") {
      return `<img ${attrs} class="sc-el sc-el--image" src="${escapeHtml(element.mediaSrc || "/img/placeholder.svg")}" alt="${escapeHtml(element.mediaAlt || "Image")}" loading="lazy" />`;
    }
    if (element.type === "video") {
      return `<video ${attrs} class="sc-el sc-el--video" src="${escapeHtml(element.mediaSrc || "")}" aria-label="${escapeHtml(element.mediaAlt || "Video")}" controls muted playsinline></video>`;
    }
    if (element.type === "html") {
      const rawTag = element.tagName === "custom" ? element.customTagName : element.tagName;
      const safeTag = sanitizeTagName(rawTag || "div");
      if (safeTag === "img") {
        return `<img ${attrs} class="sc-el sc-el--html" src="${escapeHtml(element.mediaSrc || "")}" alt="${escapeHtml(element.mediaAlt || "")}" loading="lazy" />`;
      }
      if (safeTag === "video") {
        return `<video ${attrs} class="sc-el sc-el--html" src="${escapeHtml(element.mediaSrc || "")}" aria-label="${escapeHtml(element.mediaAlt || "Video")}" controls muted playsinline></video>`;
      }
      if (safeTag === "a") {
        return `<a ${attrs} class="sc-el sc-el--html" href="${escapeHtml(element.href || "#")}">${escapeHtml(element.text || "Link")}</a>`;
      }
      return `<${safeTag} ${attrs} class="sc-el sc-el--html">${escapeHtml(element.text || "Custom HTML element")}</${safeTag}>`;
    }
    return `<div ${attrs}>${buildCollectionMarkup(element)}</div>`;
  }

  function generatedDocumentMarkup() {
    return [
      `<main class="sc-document" aria-label="${escapeHtml(state.documentTitle)}">`,
      ...sortedScenes().map((scene, index) => {
        const sceneTag = scene.tagName || "section";
        const selectedScene = scene.id === state.selectedSceneId;
        const startPercent = Math.round((scene.scrollStart / getDocumentDuration()) * 100);
        const endPercent = Math.round(((scene.scrollStart + scene.scrollLength) / getDocumentDuration()) * 100);
        return [
          `<${sceneTag} ${sceneAttrMarkup(scene)} data-selected="${String(selectedScene)}">`,
          `<div class="sc-scene-window" style="--sc-entry:${(scene.entryWindow / 100).toFixed(3)};--sc-exit:${(scene.exitWindow / 100).toFixed(3)};">`,
          `<span class="sc-scene-window__mask-left"></span>`,
          `<span class="sc-scene-window__mask-right"></span>`,
          `<span class="sc-scene-window__entry"></span>`,
          `<span class="sc-scene-window__exit"></span>`,
          `</div>`,
          `<div class="sc-scene-meta"><span>${escapeHtml(scene.name)}</span><span>${startPercent}% - ${endPercent}%</span></div>`,
          ...scene.elements.map((element) => renderElementMarkup(element)),
          `</${sceneTag}>`,
        ].join("\n");
      }),
      `</main>`,
    ].join("\n");
  }

  function generatedCssSnippet() {
    const lines = [
      ".sc-document { display: grid; gap: clamp(2rem, 6vw, 5rem); padding: clamp(1.25rem, 3vw, 2.5rem); background: var(--vl-bg-main); color: var(--vl-text-main); }",
      ".scene-custom { position: relative; display: grid; gap: 0.9rem; min-height: min(92vh, 48rem); align-content: center; padding: clamp(1.25rem, 3vw, 2rem); border-radius: 1.5rem; border: 1px solid var(--vl-border-subtle); background: color-mix(in srgb, var(--vl-bg-surface) 84%, #02050d 16%); }",
      ".sc-scene-meta { display: flex; justify-content: space-between; gap: 1rem; font: 600 0.72rem/1.2 \"JetBrains Mono\", monospace; letter-spacing: 0.04em; text-transform: uppercase; color: var(--vl-text-muted); }",
      ".sc-title { margin: 0; font-size: clamp(1.8rem, 4vw, 3.4rem); line-height: 1.05; }",
      ".sc-subtitle { margin: 0; max-width: 62ch; color: var(--vl-text-muted); }",
      ".sc-chip-row { display: flex; flex-wrap: wrap; gap: 0.55rem; }",
      ".sc-chip { display: inline-flex; align-items: center; justify-content: center; width: fit-content; border-radius: 999px; border: 1px solid var(--vl-border-subtle); padding: 0.35rem 0.75rem; background: color-mix(in srgb, var(--vl-bg-surface) 80%, #000 20%); color: var(--vl-text-main); text-decoration: none; }",
      ".sc-chip--cta { padding-inline: 0.95rem; font-weight: 600; }",
      ".sc-el-button-row { display: flex; flex-wrap: wrap; gap: 0.55rem; }",
      ".sc-el-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 0.7rem; }",
      ".sc-el-grid-item { border: 1px solid var(--vl-border-subtle); border-radius: 0.8rem; padding: 0.65rem 0.75rem; background: color-mix(in srgb, var(--vl-bg-surface) 82%, #000 18%); }",
      ".sc-el-flex { display: flex; flex-wrap: wrap; gap: 0.6rem; }",
      ".sc-el-flex-item { border: 1px solid var(--vl-border-subtle); border-radius: 999px; padding: 0.35rem 0.65rem; background: color-mix(in srgb, var(--vl-bg-surface) 82%, #000 18%); }",
      ".sc-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: 0.8rem; }",
      ".sc-card { border: 1px solid var(--vl-border-subtle); border-radius: 1rem; padding: 0.9rem; background: color-mix(in srgb, var(--vl-bg-surface) 80%, #000 20%); }",
      ".sc-card h3 { margin: 0 0 0.35rem; font-size: 1rem; }",
      ".sc-card p { margin: 0; color: var(--vl-text-muted); font-size: 0.92rem; }",
      ".sc-steps { display: grid; gap: 0.8rem; counter-reset: sc-step; }",
      ".sc-step { border-left: 2px solid var(--vl-border-subtle); padding-left: 0.8rem; }",
      ".sc-step strong::before { counter-increment: sc-step; content: counter(sc-step) '. '; color: var(--vl-text-muted); }",
    ];

    sortedScenes().forEach((scene) => {
      if (scene.range === "custom" && scene.rangeCustom.trim()) {
        lines.push(`[data-scene-id="${scene.id}"] { --vl-range: ${scene.rangeCustom.trim()}; }`);
      }
      scene.elements.forEach((element) => {
        if (element.range === "custom" && element.rangeCustom.trim()) {
          lines.push(`[data-element-id="${element.id}"] { --vl-range: ${element.rangeCustom.trim()}; }`);
        }
      });
    });

    return lines.join("\n");
  }

  function generatedStandaloneHtml() {
    return [
      "<!DOCTYPE html>",
      "<html lang=\"en\">",
      "  <head>",
      "    <meta charset=\"UTF-8\" />",
      "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />",
      `    <title>${escapeHtml(state.documentTitle)}</title>`,
      "    <link rel=\"stylesheet\" href=\"/css/velora.css\" />",
      "    <style>",
      "      body { margin: 0; background: var(--vl-bg-main); color: var(--vl-text-main); }",
      ...generatedCssSnippet().split("\n").map((line) => `      ${line}`),
      "    </style>",
      "  </head>",
      "  <body>",
      ...generatedDocumentMarkup().split("\n").map((line) => `    ${line}`),
      "  </body>",
      "</html>",
    ].join("\n");
  }

  function generatedStateJson() {
    return JSON.stringify(
      {
        version: BUILDER_VERSION,
        documentTitle: state.documentTitle,
        playhead: state.playhead,
        selectedSceneId: state.selectedSceneId,
        selectedElementId: state.selectedElementId,
        scenes: state.scenes,
      },
      null,
      2,
    );
  }

  function legacyCollectionClip(legacyClips, prefix) {
    const matches = legacyClips.filter((clip) => clip.key.startsWith(prefix));
    if (!matches.length) {
      return null;
    }
    const start = Math.min(...matches.map((clip) => clip.start));
    const end = Math.max(...matches.map((clip) => clip.start + clip.length));
    return {
      clipStart: start,
      clipLength: end - start,
      muted: matches.every((clip) => clip.muted),
    };
  }

  function convertLegacyState(payload) {
    const templateKey = TEMPLATE_REGISTRY[payload.template] ? payload.template : "hero";
    const scene = createScene(templateKey, {
      title: payload.title,
      subtitle: payload.subtitle,
      cta: payload.cta,
      itemCount: clamp(Number(payload.itemCount || 4), 2, 8),
      name: `${TEMPLATE_REGISTRY[templateKey].label} Scene`,
    });

    scene.sceneEffect = SCENE_OPTIONS.effect.includes(payload.effect) ? payload.effect : scene.sceneEffect;
    scene.timeline = SCENE_OPTIONS.timeline.includes(payload.timeline) ? payload.timeline : scene.timeline;
    scene.range = SCENE_OPTIONS.range.includes(payload.range) ? payload.range : scene.range;
    scene.rangeCustom = String(payload.rangeCustom || scene.rangeCustom);

    const legacyClips = Array.isArray(payload.timelineClips)
      ? payload.timelineClips
          .filter((clip) => clip && typeof clip === "object" && typeof clip.key === "string")
          .map((clip) => ({
            key: clip.key,
            start: clamp(quantizeMs(Number(clip.start || 0)), 0, 12000),
            length: clamp(quantizeMs(Number(clip.length || 1200)), MIN_ELEMENT_LENGTH, 12000),
            muted: Boolean(clip.muted),
          }))
      : [];

    const clipMap = new Map(legacyClips.map((clip) => [clip.key, clip]));
    const collectionClip = legacyCollectionClip(legacyClips, "item-");

    scene.elements.forEach((element) => {
      const key = element.type === "title" ? "title" : element.label === "Subtitle" || element.type === "text" ? "subtitle" : element.type === "button" ? "cta" : null;
      const legacyClip = (key && clipMap.get(key)) || (element.type === "chips" || element.type === "cards" || element.type === "steps" ? collectionClip : null);
      element.timeline = ELEMENT_OPTIONS.timeline.includes(payload.timeline) ? payload.timeline : element.timeline;
      element.range = ELEMENT_OPTIONS.range.includes(payload.range) ? payload.range : element.range;
      element.rangeCustom = String(payload.rangeCustom || element.rangeCustom);
      element.speed = ELEMENT_OPTIONS.speed.includes(payload.speed) ? payload.speed : element.speed;
      element.depth = ELEMENT_OPTIONS.depth.includes(String(payload.depth)) ? String(payload.depth) : element.depth;
      element.stagger = ELEMENT_OPTIONS.stagger.includes(payload.stagger) ? payload.stagger : element.stagger;
      if (legacyClip) {
        element.clipStart = legacyClip.start;
        element.clipLength = legacyClip.length;
        element.muted = legacyClip.muted;
      }
    });

    const maxEnd = Math.max(...scene.elements.map((element) => element.clipStart + element.clipLength), scene.scrollLength);
    scene.scrollStart = 0;
    scene.scrollLength = clamp(quantizeMs(maxEnd + 1200), MIN_SCENE_LENGTH, 12000);
    clampSceneElements(scene);

    return {
      version: BUILDER_VERSION,
      documentTitle: "Velora Scroll Narrative",
      playhead: clamp(quantizeMs(Number(payload.playhead || 1200)), 0, BASE_DOCUMENT_DURATION),
      selectedSceneId: scene.id,
      selectedElementId: scene.elements[0]?.id || null,
      scenes: [scene],
    };
  }

  function normalizeImportedState(payload) {
    if (payload && typeof payload === "object" && Array.isArray(payload.scenes)) {
      return {
        version: BUILDER_VERSION,
        documentTitle: String(payload.documentTitle || "Velora Scroll Narrative"),
        playhead: Number(payload.playhead || 0),
        selectedSceneId: String(payload.selectedSceneId || ""),
        selectedElementId: String(payload.selectedElementId || ""),
        scenes: payload.scenes,
      };
    }
    return convertLegacyState(payload || {});
  }

  function hydrateFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      Object.assign(state, normalizeImportedState(parsed));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function validateState() {
    const warnings = [];
    const hasScrollTimeline = CSS.supports("animation-timeline: scroll()");
    const hasViewTimeline = CSS.supports("animation-timeline: view()");

    if (!hasViewTimeline) {
      warnings.push("View timeline support is limited in this browser. Preview output still exports correctly for supported environments.");
    }
    if (!hasScrollTimeline) {
      warnings.push("Scroll timeline support is limited in this browser. Scroll-linked scenes still export as authored.");
    }

    const scenes = sortedScenes();
    for (let index = 1; index < scenes.length; index += 1) {
      const previousEnd = scenes[index - 1].scrollStart + scenes[index - 1].scrollLength;
      if (scenes[index].scrollStart < previousEnd) {
        warnings.push("Scene timeline overlap detected. Use Sequence Scenes to restore a clean page-scroll progression.");
        break;
      }
    }

    scenes.forEach((scene) => {
      if (scene.range === "custom" && !scene.rangeCustom.trim()) {
        warnings.push(`${scene.name}: add a custom scene range or switch back to a preset range.`);
      }
      scene.elements.forEach((element) => {
        if (element.range === "custom" && !element.rangeCustom.trim()) {
          warnings.push(`${scene.name} / ${element.label}: custom range is empty.`);
        }
      });
    });

    nodes.supportWarning.textContent = warnings.join("\n");
  }

  function renderSceneList() {
    const countNode = document.querySelector('[data-role="scenes-count"]');
    if (countNode) {
      countNode.textContent = String(state.scenes.length);
    }
    nodes.sceneList.innerHTML = sortedScenes()
      .map((scene) => {
        const active = scene.id === state.selectedSceneId;
        const startPercent = Math.round((scene.scrollStart / getDocumentDuration()) * 100);
        const endPercent = Math.round(((scene.scrollStart + scene.scrollLength) / getDocumentDuration()) * 100);
        return [
          `<button type="button" class="sc-scene-pill" data-role="scene-pill" data-scene-id="${scene.id}" aria-pressed="${String(active)}">`,
          `  <strong>${escapeHtml(scene.name)}</strong>`,
          `  <span>${escapeHtml(scene.tagName)} • ${escapeHtml(TEMPLATE_REGISTRY[scene.template].label)}</span>`,
          `  <span>${startPercent}% - ${endPercent}%</span>`,
          `</button>`,
        ].join("\n");
      })
      .join("\n");
  }

  function renderPreview() {
    nodes.previewRoot.innerHTML = generatedDocumentMarkup();
    const selectedScene = getSelectedScene();
    const selectedElement = getSelectedElement(selectedScene);

    nodes.previewRoot.querySelectorAll("[data-scene-id]").forEach((node) => {
      const scene = state.scenes.find((item) => item.id === node.getAttribute("data-scene-id"));
      if (!scene) {
        return;
      }
      const sceneProgress = (state.playhead - scene.scrollStart) / Math.max(scene.scrollLength, 1);
      const active = state.playhead >= scene.scrollStart && state.playhead <= scene.scrollStart + scene.scrollLength;
      node.dataset.active = String(active);
      node.style.opacity = String(active ? 1 : 0.72);
      node.style.transform = `translateY(${active ? 0 : 8}px)`;
      node.style.setProperty("--scene-progress", String(sceneProgress.toFixed(3)));
      if (scene.range === "custom" && scene.rangeCustom.trim()) {
        node.style.setProperty("--vl-range", scene.rangeCustom.trim());
      }
      if (selectedScene && scene.id === selectedScene.id) {
        node.dataset.selected = "true";
      }
    });

    nodes.previewRoot.querySelectorAll("[data-element-id]").forEach((node) => {
      const scene = state.scenes.find((item) => item.elements.some((element) => element.id === node.getAttribute("data-element-id")));
      const element = scene?.elements.find((item) => item.id === node.getAttribute("data-element-id"));
      if (!scene || !element) {
        return;
      }
      const absoluteStart = scene.scrollStart + element.clipStart;
      const active = !element.muted && state.playhead >= absoluteStart && state.playhead <= absoluteStart + element.clipLength;
      node.dataset.active = String(active);
      node.style.opacity = element.muted ? "0.45" : active ? "1" : "0.82";
      if (element.range === "custom" && element.rangeCustom.trim()) {
        node.style.setProperty("--vl-range", element.rangeCustom.trim());
      }
      if (selectedElement && element.id === selectedElement.id) {
        node.dataset.selected = "true";
      }
      if (element.effect === "shimmer-text") {
        node.classList.add("sc-el--shimmer-text");
      }
    });

    const totalElements = state.scenes.reduce((count, scene) => count + scene.elements.length, 0);
    nodes.previewMeta.textContent = `${state.scenes.length} scenes • ${totalElements} elements • ${Math.round((state.playhead / getDocumentDuration()) * 100)}% scroll`;
  }

  function renderTimelineLanes() {
    const duration = getDocumentDuration();
    nodes.timelineScrub.max = String(duration);
    nodes.timelineScrub.value = String(clamp(state.playhead, 0, duration));
    nodes.timelineTime.textContent = `${formatClock(state.playhead)} / ${formatClock(duration)}`;
    nodes.timelinePlayhead.style.left = `${clamp((state.playhead / duration) * 100, 0, 100)}%`;

    nodes.sceneLanes.innerHTML = sortedScenes()
      .map((scene) => {
        const left = (scene.scrollStart / duration) * 100;
        const width = (scene.scrollLength / duration) * 100;
        return [
          `<div class="sc-lane">`,
          `  <span class="sc-lane-label">${escapeHtml(scene.name)}</span>`,
          `  <div class="sc-lane-track">`,
          `    <button type="button" class="sc-clip" data-role="timeline-clip" data-clip-type="scene" data-scene-id="${scene.id}" data-active="${String(scene.id === state.selectedSceneId)}" style="left:${left}%;width:${Math.max(width, 2)}%">`,
          `      <span class="sc-clip-handle sc-clip-handle--start" data-role="clip-handle" data-handle-type="start"></span>`,
          `      <span class="sc-clip-label">${escapeHtml(scene.tagName)} • ${escapeHtml(TEMPLATE_REGISTRY[scene.template].label)}</span>`,
          `      <span class="sc-clip-handle sc-clip-handle--end" data-role="clip-handle" data-handle-type="end"></span>`,
          `    </button>`,
          `  </div>`,
          `</div>`,
        ].join("\n");
      })
      .join("\n");

    const selectedScene = getSelectedScene();
    nodes.elementLanes.innerHTML = selectedScene
      ? selectedScene.elements
          .map((element) => {
            const absoluteStart = selectedScene.scrollStart + element.clipStart;
            const left = (absoluteStart / duration) * 100;
            const width = (element.clipLength / duration) * 100;
            return [
              `<div class="sc-lane">`,
              `  <span class="sc-lane-label">${escapeHtml(element.label)}</span>`,
              `  <div class="sc-lane-track">`,
              `    <button type="button" class="sc-clip" data-role="timeline-clip" data-clip-type="element" data-scene-id="${selectedScene.id}" data-element-id="${element.id}" data-active="${String(element.id === state.selectedElementId)}" data-muted="${String(element.muted)}" style="left:${left}%;width:${Math.max(width, 2)}%">`,
              `      <span class="sc-clip-handle sc-clip-handle--start" data-role="clip-handle" data-handle-type="start"></span>`,
              `      <span class="sc-clip-label">${escapeHtml(element.type)}${element.muted ? " • muted" : ""}</span>`,
              `      <span class="sc-clip-handle sc-clip-handle--end" data-role="clip-handle" data-handle-type="end"></span>`,
              `    </button>`,
              `  </div>`,
              `</div>`,
            ].join("\n");
          })
          .join("\n")
      : '<p class="sc-empty">Select a scene to tune its child elements.</p>';
  }

  function syncInputs() {
    const selectedScene = getSelectedScene();
    const selectedElement = getSelectedElement(selectedScene);

    nodes.documentTitle.value = state.documentTitle;
    nodes.sceneSelect.innerHTML = sortedScenes().map((scene) => `<option value="${scene.id}">${escapeHtml(scene.name)}</option>`).join("");
    if (selectedScene) {
      nodes.sceneSelect.value = selectedScene.id;
      nodes.sceneTemplate.value = selectedScene.template;
      nodes.sceneTag.value = selectedScene.tagName;
      nodes.sceneName.value = selectedScene.name;
      nodes.sceneEffect.value = selectedScene.sceneEffect;
      nodes.sceneTimeline.value = selectedScene.timeline;
      nodes.sceneRange.value = selectedScene.range;
      nodes.sceneRangeCustom.value = selectedScene.rangeCustom;
      nodes.sceneRangeCustom.disabled = selectedScene.range !== "custom";
      if (nodes.sceneEntryWindow) {
        nodes.sceneEntryWindow.value = String(Math.round(selectedScene.entryWindow));
      }
      if (nodes.sceneExitWindow) {
        nodes.sceneExitWindow.value = String(Math.round(selectedScene.exitWindow));
      }
      nodes.sceneBgColor.value = selectedScene.bgColorToken || "";
      nodes.sceneTextColor.value = selectedScene.textColorToken || "";
      nodes.sceneInlineCss.value = selectedScene.inlineCss || "";
      nodes.sceneLength.value = String(selectedScene.scrollLength);
    }

    nodes.elementSelect.innerHTML = selectedScene
      ? selectedScene.elements.map((element) => `<option value="${element.id}">${escapeHtml(element.label)}</option>`).join("")
      : "";

    if (selectedElement) {
      nodes.elementSelect.value = selectedElement.id;
      nodes.elementLabel.value = selectedElement.label;
      nodes.elementText.value = selectedElement.type === "chips" || selectedElement.type === "cards" || selectedElement.type === "steps" || selectedElement.type === "list" || selectedElement.type === "grid" || selectedElement.type === "flex" || selectedElement.type === "buttonGroup"
        ? JSON.stringify(selectedElement.items, null, 2)
        : selectedElement.text;
      nodes.elementHref.value = selectedElement.href || "#";
      nodes.elementItemCount.value = String(Array.isArray(selectedElement.items) ? selectedElement.items.length : 0);
      nodes.elementTag.value = selectedElement.tagName === "custom" ? "custom" : selectedElement.tagName;
      nodes.elementCustomTag.value = selectedElement.customTagName || "";
      nodes.elementSrc.value = selectedElement.mediaSrc || "";
      nodes.elementAlt.value = selectedElement.mediaAlt || "";
      nodes.elementBgColor.value = selectedElement.bgColorToken || "";
      nodes.elementTextColor.value = selectedElement.textColorToken || "";
      nodes.elementInlineCss.value = selectedElement.inlineCss || "";
      nodes.elementKindMeta.textContent = ELEMENT_LIBRARY[selectedElement.type].label;
      nodes.elementEffect.value = selectedElement.effect;
      nodes.elementTimeline.value = selectedElement.timeline;
      nodes.elementRange.value = selectedElement.range;
      nodes.elementRangeCustom.value = selectedElement.rangeCustom;
      nodes.elementRangeCustom.disabled = selectedElement.range !== "custom";
      nodes.elementSpeed.value = selectedElement.speed;
      nodes.elementDepth.value = selectedElement.depth;
      nodes.elementStagger.value = selectedElement.stagger;
      nodes.elementMute.value = selectedElement.muted ? "muted" : "active";
      nodes.elementStart.value = String(selectedElement.clipStart);
      nodes.elementLength.value = String(selectedElement.clipLength);
      if (nodes.previewSelectedEffect) {
        nodes.previewSelectedEffect.textContent = `Effect: ${selectedElement.effect}`;
      }

      const isCollection = selectedElement.type === "chips" || selectedElement.type === "cards" || selectedElement.type === "steps" || selectedElement.type === "list" || selectedElement.type === "grid" || selectedElement.type === "flex" || selectedElement.type === "buttonGroup";
      const supportsSrc = selectedElement.type === "image" || selectedElement.type === "video" || selectedElement.type === "html";
      const supportsCustomTag = selectedElement.type === "html";
      const supportsHref = selectedElement.type === "button" || (selectedElement.type === "html" && (nodes.elementTag.value === "a" || nodes.elementTag.value === "custom"));
      nodes.elementHref.disabled = !supportsHref;
      nodes.elementItemCount.disabled = !isCollection;
      nodes.elementTag.disabled = !supportsCustomTag;
      nodes.elementCustomTag.disabled = !(supportsCustomTag && nodes.elementTag.value === "custom");
      nodes.elementSrc.disabled = !supportsSrc;
      nodes.elementAlt.disabled = !supportsSrc;
    }
    if (!selectedElement && nodes.previewSelectedEffect) {
      nodes.previewSelectedEffect.textContent = "Effect: —";
    }

    if (nodes.previewDelay && nodes.previewDelayValue) {
      nodes.previewDelay.value = String(previewState.delayMs);
      nodes.previewDelayValue.textContent = `${previewState.delayMs}ms`;
    }
    if (nodes.previewSpeed && nodes.previewSpeedValue) {
      nodes.previewSpeed.value = String(previewState.speedRate);
      nodes.previewSpeedValue.textContent = `${previewState.speedRate.toFixed(2)}x`;
    }

    const selectedPreset = nodes.designComponentSelect?.value;
    if (nodes.designComponentMeta && selectedPreset && DESIGN_SYSTEM_COMPONENTS[selectedPreset]) {
      nodes.designComponentMeta.textContent = DESIGN_SYSTEM_COMPONENTS[selectedPreset].description;
    }

    nodes.outputHtml.value = generatedDocumentMarkup();
    nodes.outputCss.value = generatedCssSnippet();
    nodes.outputJson.value = generatedStateJson();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, generatedStateJson());
  }

  function render() {
    ensureStateShape();
    validateState();
    renderSceneList();
    renderPreview();
    renderTimelineLanes();
    syncInputs();
    saveState();
  }

  function replaySelectedElementAnimation() {
    const selectedElement = getSelectedElement();
    if (!selectedElement) {
      return;
    }
    const elementNode = nodes.previewRoot.querySelector(`[data-element-id="${selectedElement.id}"]`);
    if (!elementNode) {
      return;
    }
    if (previewState.timerId) {
      window.clearTimeout(previewState.timerId);
      previewState.timerId = null;
    }
    previewState.timerId = window.setTimeout(() => {
      elementNode.style.animation = "none";
      void elementNode.offsetWidth;
      elementNode.style.animation = "";
      elementNode.getAnimations({ subtree: true }).forEach((animation) => {
        animation.playbackRate = previewState.speedRate;
      });
    }, previewState.delayMs);
  }

  function replaySelectedSceneAnimations() {
    const scene = getSelectedScene();
    if (!scene) {
      return;
    }
    previewState.sceneTimerIds.forEach((timerId) => window.clearTimeout(timerId));
    previewState.sceneTimerIds = [];

    const stepDelay = Math.max(40, Math.round((previewState.delayMs || 0) / 2));
    scene.elements.forEach((element, index) => {
      const node = nodes.previewRoot.querySelector(`[data-element-id="${element.id}"]`);
      if (!node) {
        return;
      }
      const timerId = window.setTimeout(() => {
        node.style.animation = "none";
        void node.offsetWidth;
        node.style.animation = "";
        node.getAnimations({ subtree: true }).forEach((animation) => {
          animation.playbackRate = previewState.speedRate;
        });
      }, previewState.delayMs + (index * stepDelay));
      previewState.sceneTimerIds.push(timerId);
    });
  }

  function updateScene(patch) {
    const scene = getSelectedScene();
    if (!scene) {
      return;
    }
    if (patch.template) {
      replaceSceneTemplate(scene, patch.template);
    }
    if (typeof patch.name === "string") {
      scene.name = patch.name;
    }
    if (patch.tagName) {
      scene.tagName = patch.tagName === "article" ? "article" : "section";
    }
    if (patch.sceneEffect && SCENE_OPTIONS.effect.includes(patch.sceneEffect)) {
      scene.sceneEffect = patch.sceneEffect;
    }
    if (patch.timeline && SCENE_OPTIONS.timeline.includes(patch.timeline)) {
      scene.timeline = patch.timeline;
    }
    if (patch.range && SCENE_OPTIONS.range.includes(patch.range)) {
      scene.range = patch.range;
    }
    if (typeof patch.rangeCustom === "string") {
      scene.rangeCustom = patch.rangeCustom;
    }
    if (typeof patch.entryWindow === "number") {
      scene.entryWindow = clamp(patch.entryWindow, 0, 95);
      if (scene.entryWindow >= scene.exitWindow) {
        scene.exitWindow = clamp(scene.entryWindow + 5, 5, 100);
      }
    }
    if (typeof patch.exitWindow === "number") {
      scene.exitWindow = clamp(patch.exitWindow, 5, 100);
      if (scene.exitWindow <= scene.entryWindow) {
        scene.entryWindow = clamp(scene.exitWindow - 5, 0, 95);
      }
    }
    if (typeof patch.bgColorToken === "string") {
      scene.bgColorToken = patch.bgColorToken;
    }
    if (typeof patch.textColorToken === "string") {
      scene.textColorToken = patch.textColorToken;
    }
    if (typeof patch.inlineCss === "string") {
      scene.inlineCss = patch.inlineCss;
    }
    if (typeof patch.scrollLength === "number") {
      scene.scrollLength = clamp(quantizeMs(patch.scrollLength), MIN_SCENE_LENGTH, 12000);
      clampSceneElements(scene);
    }
    if (typeof patch.scrollStart === "number") {
      scene.scrollStart = clamp(quantizeMs(patch.scrollStart), 0, Math.max(getDocumentDuration() - MIN_SCENE_LENGTH, 0));
    }
    render();
  }

  function parseCollectionItems(type, raw, fallback) {
    if (!raw.trim()) {
      return clone(fallback);
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return clone(fallback);
      }
      if (type === "chips" || type === "list" || type === "grid" || type === "flex" || type === "buttonGroup") {
        return parsed.map((item) => String(item));
      }
      return parsed.map((item, index) => ({
        title: String(item.title || `${ELEMENT_LIBRARY[type].label} ${index + 1}`),
        body: String(item.body || "Supporting detail."),
      }));
    } catch {
      return clone(fallback);
    }
  }

  function updateSelectedElement(patch) {
    const scene = getSelectedScene();
    const element = getSelectedElement(scene);
    if (!scene || !element) {
      return;
    }

    if (typeof patch.label === "string") {
      element.label = patch.label;
    }
    if (typeof patch.text === "string") {
      if (element.type === "chips" || element.type === "cards" || element.type === "steps" || element.type === "list" || element.type === "grid" || element.type === "flex" || element.type === "buttonGroup") {
        element.items = parseCollectionItems(element.type, patch.text, element.items);
      } else {
        element.text = patch.text;
      }
    }
    if (typeof patch.href === "string") {
      element.href = patch.href;
    }
    if (typeof patch.itemCount === "number" && (element.type === "chips" || element.type === "cards" || element.type === "steps" || element.type === "list" || element.type === "grid" || element.type === "flex" || element.type === "buttonGroup")) {
      const nextCount = clamp(Math.round(patch.itemCount), 1, 8);
      const seed = element.type === "cards" || element.type === "steps" ? element.label : element.type === "list" ? "List" : element.type === "grid" ? "Grid" : element.type === "flex" ? "Flex" : element.type === "buttonGroup" ? "Button" : "Tag";
      element.items = defaultItems(element.type, nextCount, seed);
    }
    if (typeof patch.tagName === "string") {
      element.tagName = patch.tagName === "custom" ? "custom" : sanitizeTagName(patch.tagName);
    }
    if (typeof patch.customTagName === "string") {
      element.customTagName = patch.customTagName.trim().toLowerCase();
      if (element.tagName === "custom" && element.customTagName) {
        element.tagName = "custom";
      }
    }
    if (typeof patch.mediaSrc === "string") {
      element.mediaSrc = patch.mediaSrc;
    }
    if (typeof patch.mediaAlt === "string") {
      element.mediaAlt = patch.mediaAlt;
    }
    if (typeof patch.bgColorToken === "string") {
      element.bgColorToken = patch.bgColorToken;
    }
    if (typeof patch.textColorToken === "string") {
      element.textColorToken = patch.textColorToken;
    }
    if (typeof patch.inlineCss === "string") {
      element.inlineCss = patch.inlineCss;
    }
    if (patch.effect && ELEMENT_OPTIONS.effect.includes(patch.effect)) {
      element.effect = patch.effect;
    }
    if (patch.timeline && ELEMENT_OPTIONS.timeline.includes(patch.timeline)) {
      element.timeline = patch.timeline;
    }
    if (patch.range && ELEMENT_OPTIONS.range.includes(patch.range)) {
      element.range = patch.range;
    }
    if (typeof patch.rangeCustom === "string") {
      element.rangeCustom = patch.rangeCustom;
    }
    if (patch.speed && ELEMENT_OPTIONS.speed.includes(patch.speed)) {
      element.speed = patch.speed;
    }
    if (patch.depth && ELEMENT_OPTIONS.depth.includes(String(patch.depth))) {
      element.depth = String(patch.depth);
    }
    if (patch.stagger && ELEMENT_OPTIONS.stagger.includes(patch.stagger)) {
      element.stagger = patch.stagger;
    }
    if (typeof patch.muted === "boolean") {
      element.muted = patch.muted;
    }
    if (typeof patch.clipStart === "number") {
      element.clipStart = clamp(quantizeMs(patch.clipStart), 0, Math.max(scene.scrollLength - MIN_ELEMENT_LENGTH, 0));
      element.clipLength = clamp(element.clipLength, MIN_ELEMENT_LENGTH, Math.max(scene.scrollLength - element.clipStart, MIN_ELEMENT_LENGTH));
    }
    if (typeof patch.clipLength === "number") {
      element.clipLength = clamp(quantizeMs(patch.clipLength), MIN_ELEMENT_LENGTH, Math.max(scene.scrollLength - element.clipStart, MIN_ELEMENT_LENGTH));
    }

    render();
  }

  function beginClipDrag(event) {
    const handle = event.target.closest('[data-role="clip-handle"]');
    const clipNode = event.target.closest('[data-role="timeline-clip"]');
    if (!clipNode) {
      return;
    }

    const targetType = clipNode.getAttribute("data-clip-type");
    const sceneId = clipNode.getAttribute("data-scene-id");
    const elementId = clipNode.getAttribute("data-element-id");
    const scene = state.scenes.find((item) => item.id === sceneId);
    const element = scene?.elements.find((item) => item.id === elementId);
    const track = clipNode.closest(".sc-lane-track");
    if (!track || !scene) {
      return;
    }

    dragState.active = true;
    dragState.mode = handle ? handle.getAttribute("data-handle-type") : "move";
    dragState.targetType = targetType;
    dragState.sceneId = sceneId;
    dragState.elementId = elementId;
    dragState.startX = event.clientX;
    dragState.trackWidth = Math.max(track.getBoundingClientRect().width, 1);

    if (targetType === "scene") {
      dragState.originStart = scene.scrollStart;
      dragState.originLength = scene.scrollLength;
      setSelectedScene(sceneId);
    } else {
      dragState.originStart = element.clipStart;
      dragState.originLength = element.clipLength;
      setSelectedScene(sceneId);
      setSelectedElement(elementId);
    }

    event.preventDefault();
  }

  function onClipDrag(event) {
    if (!dragState.active) {
      return;
    }

    const scene = state.scenes.find((item) => item.id === dragState.sceneId);
    const element = scene?.elements.find((item) => item.id === dragState.elementId);
    if (!scene) {
      return;
    }

    const duration = getDocumentDuration();
    const deltaPx = event.clientX - dragState.startX;
    const deltaMs = quantizeMs((deltaPx / dragState.trackWidth) * duration);

    if (dragState.targetType === "scene") {
      if (dragState.mode === "move") {
        scene.scrollStart = clamp(quantizeMs(dragState.originStart + deltaMs), 0, Math.max(duration - scene.scrollLength, 0));
      } else if (dragState.mode === "start") {
        const nextStart = clamp(quantizeMs(dragState.originStart + deltaMs), 0, dragState.originStart + dragState.originLength - MIN_SCENE_LENGTH);
        scene.scrollStart = nextStart;
        scene.scrollLength = clamp(quantizeMs(dragState.originLength - (scene.scrollStart - dragState.originStart)), MIN_SCENE_LENGTH, 12000);
      } else if (dragState.mode === "end") {
        scene.scrollLength = clamp(quantizeMs(dragState.originLength + deltaMs), MIN_SCENE_LENGTH, 12000);
      }
      clampSceneElements(scene);
    } else if (element) {
      if (dragState.mode === "move") {
        element.clipStart = clamp(quantizeMs(dragState.originStart + deltaMs), 0, Math.max(scene.scrollLength - element.clipLength, 0));
      } else if (dragState.mode === "start") {
        const nextStart = clamp(quantizeMs(dragState.originStart + deltaMs), 0, dragState.originStart + dragState.originLength - MIN_ELEMENT_LENGTH);
        element.clipStart = nextStart;
        element.clipLength = clamp(quantizeMs(dragState.originLength - (element.clipStart - dragState.originStart)), MIN_ELEMENT_LENGTH, Math.max(scene.scrollLength - element.clipStart, MIN_ELEMENT_LENGTH));
      } else if (dragState.mode === "end") {
        element.clipLength = clamp(quantizeMs(dragState.originLength + deltaMs), MIN_ELEMENT_LENGTH, Math.max(scene.scrollLength - element.clipStart, MIN_ELEMENT_LENGTH));
      }
    }

    render();
  }

  function endClipDrag() {
    dragState.active = false;
    dragState.mode = null;
    dragState.targetType = null;
    dragState.sceneId = null;
    dragState.elementId = null;
  }

  async function copyText(content, successMessage) {
    try {
      await navigator.clipboard.writeText(content);
      nodes.message.textContent = successMessage;
    } catch {
      nodes.message.textContent = "Clipboard access was denied. Copy directly from the output field instead.";
    }
  }

  function downloadFile(name, content, type) {
    const blob = new Blob([content], { type });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(href);
  }

  function downloadHtml() {
    downloadFile("velora-scroll-document.html", generatedStandaloneHtml(), "text/html");
    nodes.message.textContent = "Standalone multi-scene HTML downloaded.";
  }

  function downloadJson() {
    downloadFile("velora-scroll-document.json", generatedStateJson(), "application/json");
    nodes.message.textContent = "Scene document JSON downloaded.";
  }

  function importJson() {
    try {
      const parsed = JSON.parse(nodes.outputJson.value);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("invalid-shape");
      }
      Object.assign(state, normalizeImportedState(parsed));
      render();
      nodes.message.textContent = "Document JSON imported.";
    } catch {
      nodes.message.textContent = "Invalid JSON. Paste a scene document or legacy scene state object and try again.";
    }
  }

  function switchTab(target) {
    document.querySelectorAll(".sc-tab").forEach((tab) => {
      tab.setAttribute("aria-selected", String(tab.getAttribute("data-tab") === target));
    });
    document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
      panel.hidden = panel.getAttribute("data-tab-panel") !== target;
    });
  }

  function clearSceneDropTargets() {
    nodes.previewRoot.querySelectorAll("[data-scene-id]").forEach((node) => {
      node.removeAttribute("data-drop-target");
    });
  }

  function getDraggedKind(event) {
    const kind = event.dataTransfer?.getData("text/velora-element-kind") || "";
    return ELEMENT_LIBRARY[kind] ? kind : null;
  }

  function toggleWizard(open) {
    if (!nodes.wizardModal) {
      return;
    }
    nodes.wizardModal.hidden = !open;
    nodes.wizardModal.setAttribute("aria-hidden", String(!open));
  }

  function applyLayoutWizard({ heroType, density, ctaStyle }) {
    const densityMap = {
      low: { itemCount: 3, scenes: ["hero", "features", "cta"] },
      medium: { itemCount: 4, scenes: ["hero", "features", "story", "cta"] },
      high: { itemCount: 6, scenes: ["hero", "features", "story", "scroll", "cta"] },
    };

    const heroCopy = {
      product: {
        name: "Product Hero",
        title: "Launch motion-rich products faster",
        subtitle: "Use Velora to compose premium sections and scroll-linked storytelling without writing complex code.",
      },
      story: {
        name: "Story Hero",
        title: "Tell the product story in scenes",
        subtitle: "Guide users from context to proof and action with cinematic scroll pacing.",
      },
      minimal: {
        name: "Editorial Hero",
        title: "A calm narrative canvas",
        subtitle: "Start simple, then layer in components only where they support the message.",
      },
    };

    const ctaLabel = ctaStyle === "subtle" ? "Learn more" : ctaStyle === "balanced" ? "Explore details" : "Start now";
    const pack = densityMap[density] || densityMap.medium;
    const copy = heroCopy[heroType] || heroCopy.product;

    const buildScene = (key, index) => {
      if (key === "cta") {
        const ctaScene = createScene("blank", {
          name: ctaStyle === "subtle" ? "Quiet CTA" : "Action Scene",
          scrollLength: 2600,
        });
        addElementToScene(ctaScene, "title");
        addElementToScene(ctaScene, "text");
        addElementToScene(ctaScene, ctaStyle === "subtle" ? "buttonGroup" : "button");
        ctaScene.elements[0].text = ctaStyle === "subtle" ? "Continue the journey" : "Ready to take the next step?";
        ctaScene.elements[1].text = "Keep momentum with a clear next action and lightweight supporting context.";
        if (ctaStyle === "subtle") {
          ctaScene.elements[2].items = ["Docs", "Examples", "Contact"];
        } else {
          ctaScene.elements[2].text = ctaLabel;
        }
        return ctaScene;
      }

      const scene = createScene(key, {
        name: index === 0 ? copy.name : undefined,
        title: index === 0 ? copy.title : undefined,
        subtitle: index === 0 ? copy.subtitle : undefined,
        itemCount: pack.itemCount,
        cta: ctaLabel,
      });
      return scene;
    };

    state.documentTitle = `${copy.name} Scrolltelling`;
    state.scenes = pack.scenes.map((key, index) => buildScene(key, index));

    if (heroType === "minimal") {
      state.scenes.forEach((scene, index) => {
        scene.bgColorToken = index % 2 === 0 ? "--vl-bg-main" : "--vl-bg-surface";
        scene.textColorToken = "--vl-text-main";
      });
    }

    sequenceScenes();
    setSelectedScene(state.scenes[0]?.id || null);
    state.playhead = 0;
    switchTab("scene");
    render();
    nodes.message.textContent = "Layout Wizard generated a new multi-scene draft.";
  }

  function regenerateSelectedSceneFromWizard({ heroType, density, ctaStyle }) {
    const selectedScene = getSelectedScene();
    if (!selectedScene) {
      nodes.message.textContent = "Select a scene before regenerating it.";
      return;
    }

    const densityItemCount = density === "low" ? 3 : density === "high" ? 6 : 4;
    const heroCopy = {
      product: {
        name: "Product Scene",
        title: "Launch motion-rich products faster",
        subtitle: "Use Velora to compose premium sections and scroll-linked storytelling without writing complex code.",
      },
      story: {
        name: "Story Scene",
        title: "Tell the product story in scenes",
        subtitle: "Guide users from context to proof and action with cinematic scroll pacing.",
      },
      minimal: {
        name: "Editorial Scene",
        title: "A calm narrative canvas",
        subtitle: "Start simple, then layer in components only where they support the message.",
      },
    };

    const copy = heroCopy[heroType] || heroCopy.product;
    const ctaLabel = ctaStyle === "subtle" ? "Learn more" : ctaStyle === "balanced" ? "Explore details" : "Start now";
    const targetTemplate = selectedScene.template === "blank" ? (heroType === "story" ? "story" : "hero") : selectedScene.template;

    const replacement = createScene(targetTemplate, {
      name: selectedScene.name || copy.name,
      title: copy.title,
      subtitle: copy.subtitle,
      itemCount: densityItemCount,
      cta: ctaLabel,
      scrollLength: selectedScene.scrollLength,
    });

    replacement.id = selectedScene.id;
    replacement.scrollStart = selectedScene.scrollStart;
    replacement.scrollLength = selectedScene.scrollLength;
    replacement.tagName = selectedScene.tagName;
    replacement.bgColorToken = selectedScene.bgColorToken;
    replacement.textColorToken = selectedScene.textColorToken;
    replacement.inlineCss = selectedScene.inlineCss;

    if (ctaStyle === "subtle") {
      replacement.elements
        .filter((element) => element.type === "button")
        .forEach((element) => {
          element.type = "buttonGroup";
          element.label = "Action Buttons";
          element.items = ["Docs", "Examples", "Contact"];
        });
    }

    const index = state.scenes.findIndex((scene) => scene.id === selectedScene.id);
    if (index === -1) {
      return;
    }
    state.scenes[index] = normalizeScene(replacement, index);
    setSelectedScene(state.scenes[index].id);
    switchTab("scene");
    render();
    nodes.message.textContent = "Selected scene regenerated from wizard settings.";
  }

  function bindEvents() {
    nodes.documentTitle.addEventListener("input", (event) => {
      state.documentTitle = event.target.value;
      render();
    });

    nodes.addScene.addEventListener("click", () => {
      const templateKey = nodes.addSceneTemplate.value;
      const lastScene = sortedScenes().at(-1);
      const next = createScene(templateKey, {
        scrollStart: lastScene ? lastScene.scrollStart + lastScene.scrollLength + DEFAULT_SCENE_GAP : 0,
      });
      state.scenes.push(next);
      setSelectedScene(next.id);
      switchTab("scene");
      render();
      nodes.message.textContent = `${TEMPLATE_REGISTRY[templateKey].label} scene added to the page timeline.`;
    });

    nodes.duplicateScene.addEventListener("click", () => {
      duplicateScene();
      render();
      nodes.message.textContent = "Selected scene duplicated.";
    });

    nodes.removeScene.addEventListener("click", () => {
      removeSelectedScene();
      render();
    });

    nodes.sequenceScenes.addEventListener("click", () => {
      sequenceScenes();
      render();
      nodes.message.textContent = "Scenes resequenced into a clean page-scroll progression.";
    });

    nodes.wizardOpen.addEventListener("click", () => {
      toggleWizard(true);
    });

    nodes.wizardCancel.addEventListener("click", () => {
      toggleWizard(false);
    });

    nodes.wizardModal.addEventListener("click", (event) => {
      if (event.target === nodes.wizardModal) {
        toggleWizard(false);
      }
    });

    nodes.wizardGenerate.addEventListener("click", () => {
      applyLayoutWizard({
        heroType: nodes.wizardHeroType.value,
        density: nodes.wizardDensity.value,
        ctaStyle: nodes.wizardCtaStyle.value,
      });
      toggleWizard(false);
    });

    nodes.wizardGenerateScene.addEventListener("click", () => {
      regenerateSelectedSceneFromWizard({
        heroType: nodes.wizardHeroType.value,
        density: nodes.wizardDensity.value,
        ctaStyle: nodes.wizardCtaStyle.value,
      });
      toggleWizard(false);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        toggleWizard(false);
      }
    });

    nodes.sceneList.addEventListener("click", (event) => {
      const button = event.target.closest('[data-role="scene-pill"]');
      if (!button) {
        return;
      }
      setSelectedScene(button.getAttribute("data-scene-id"));
      switchTab("scene");
      render();
    });

    nodes.previewRoot.addEventListener("click", (event) => {
      const elementNode = event.target.closest("[data-element-id]");
      const sceneNode = event.target.closest("[data-scene-id]");
      if (elementNode) {
        const parentScene = elementNode.closest("[data-scene-id]");
        if (parentScene) {
          setSelectedScene(parentScene.getAttribute("data-scene-id"));
        }
        setSelectedElement(elementNode.getAttribute("data-element-id"));
        switchTab("element");
      } else if (sceneNode) {
        setSelectedScene(sceneNode.getAttribute("data-scene-id"));
        switchTab("scene");
      }
      render();
    });

    nodes.previewRoot.addEventListener("dragover", (event) => {
      const kind = getDraggedKind(event);
      if (!kind) {
        return;
      }
      const sceneNode = event.target.closest("[data-scene-id]");
      if (!sceneNode) {
        return;
      }
      event.preventDefault();
      clearSceneDropTargets();
      sceneNode.setAttribute("data-drop-target", "true");
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "copy";
      }
    });

    nodes.previewRoot.addEventListener("dragleave", (event) => {
      if (!event.relatedTarget || !nodes.previewRoot.contains(event.relatedTarget)) {
        clearSceneDropTargets();
      }
    });

    nodes.previewRoot.addEventListener("drop", (event) => {
      const kind = getDraggedKind(event);
      if (!kind) {
        return;
      }
      const sceneNode = event.target.closest("[data-scene-id]");
      if (!sceneNode) {
        return;
      }
      event.preventDefault();
      clearSceneDropTargets();
      const scene = state.scenes.find((item) => item.id === sceneNode.getAttribute("data-scene-id"));
      if (!scene) {
        return;
      }
      setSelectedScene(scene.id);
      addElementToScene(scene, kind);
      switchTab("element");
      render();
      nodes.message.textContent = `${ELEMENT_LIBRARY[kind].label} dropped into ${scene.name}.`;
    });

    nodes.sceneSelect.addEventListener("change", (event) => {
      setSelectedScene(event.target.value);
      render();
    });

    nodes.sceneTemplate.addEventListener("change", (event) => updateScene({ template: event.target.value }));
    nodes.sceneTag.addEventListener("change", (event) => updateScene({ tagName: event.target.value }));
    nodes.sceneName.addEventListener("input", (event) => updateScene({ name: event.target.value }));
    nodes.sceneEffect.addEventListener("change", (event) => updateScene({ sceneEffect: event.target.value }));
    nodes.sceneTimeline.addEventListener("change", (event) => updateScene({ timeline: event.target.value }));
    nodes.sceneRange.addEventListener("change", (event) => updateScene({ range: event.target.value }));
    nodes.sceneRangeCustom.addEventListener("input", (event) => updateScene({ rangeCustom: event.target.value }));
    if (nodes.sceneEntryWindow) {
      nodes.sceneEntryWindow.addEventListener("input", (event) => updateScene({ entryWindow: Number(event.target.value || 10) }));
    }
    if (nodes.sceneExitWindow) {
      nodes.sceneExitWindow.addEventListener("input", (event) => updateScene({ exitWindow: Number(event.target.value || 90) }));
    }
    nodes.sceneBgColor.addEventListener("change", (event) => updateScene({ bgColorToken: event.target.value }));
    nodes.sceneTextColor.addEventListener("change", (event) => updateScene({ textColorToken: event.target.value }));
    nodes.sceneInlineCss.addEventListener("input", (event) => updateScene({ inlineCss: event.target.value }));
    nodes.sceneLength.addEventListener("input", (event) => updateScene({ scrollLength: Number(event.target.value || MIN_SCENE_LENGTH) }));
    nodes.moveSceneUp.addEventListener("click", () => {
      moveSelectedScene(-1);
      render();
    });
    nodes.moveSceneDown.addEventListener("click", () => {
      moveSelectedScene(1);
      render();
    });

    nodes.elementSelect.addEventListener("change", (event) => {
      setSelectedElement(event.target.value);
      render();
    });

    nodes.addElement.addEventListener("click", () => {
      addElementToSelectedScene(nodes.addElementKind.value);
      render();
      nodes.message.textContent = `${ELEMENT_LIBRARY[nodes.addElementKind.value].label} added to the selected scene.`;
    });

    nodes.addDesignComponent.addEventListener("click", () => {
      const scene = getSelectedScene();
      const presetKey = nodes.designComponentSelect.value;
      const addedCount = addDesignComponentToScene(scene, presetKey);
      if (!addedCount) {
        nodes.message.textContent = "Select a scene before adding a design system component.";
        return;
      }
      switchTab("element");
      render();
      nodes.message.textContent = `${DESIGN_SYSTEM_COMPONENTS[presetKey].label} inserted (${addedCount} elements).`;
    });

    nodes.designComponentSelect.addEventListener("change", (event) => {
      const preset = DESIGN_SYSTEM_COMPONENTS[event.target.value];
      if (preset) {
        nodes.designComponentMeta.textContent = preset.description;
      }
    });

    document.querySelectorAll('[data-role="dock-component"]').forEach((chip) => {
      chip.addEventListener("click", () => {
        const kind = chip.getAttribute("data-kind");
        if (!ELEMENT_LIBRARY[kind]) {
          return;
        }
        addElementToSelectedScene(kind);
        switchTab("element");
        render();
        nodes.message.textContent = `${ELEMENT_LIBRARY[kind].label} added from dock.`;
      });

      chip.addEventListener("dragstart", (event) => {
        const kind = chip.getAttribute("data-kind");
        if (!ELEMENT_LIBRARY[kind] || !event.dataTransfer) {
          return;
        }
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData("text/velora-element-kind", kind);
      });
    });

    nodes.removeElement.addEventListener("click", () => {
      removeSelectedElement();
      render();
    });

    nodes.moveElementUp.addEventListener("click", () => {
      moveSelectedElement(-1);
      render();
    });
    nodes.moveElementDown.addEventListener("click", () => {
      moveSelectedElement(1);
      render();
    });
    nodes.cascadeElements.addEventListener("click", () => {
      const scene = getSelectedScene();
      if (!scene) {
        return;
      }
      cascadeElements(scene);
      render();
      nodes.message.textContent = "Selected scene elements cascaded across its scroll range.";
    });

    nodes.elementLabel.addEventListener("input", (event) => updateSelectedElement({ label: event.target.value }));
    nodes.elementText.addEventListener("input", (event) => updateSelectedElement({ text: event.target.value }));
    nodes.elementHref.addEventListener("input", (event) => updateSelectedElement({ href: event.target.value }));
    nodes.elementItemCount.addEventListener("input", (event) => updateSelectedElement({ itemCount: Number(event.target.value || 1) }));
    nodes.elementTag.addEventListener("change", (event) => updateSelectedElement({ tagName: event.target.value }));
    nodes.elementCustomTag.addEventListener("input", (event) => updateSelectedElement({ customTagName: event.target.value, tagName: "custom" }));
    nodes.elementSrc.addEventListener("input", (event) => updateSelectedElement({ mediaSrc: event.target.value }));
    nodes.elementAlt.addEventListener("input", (event) => updateSelectedElement({ mediaAlt: event.target.value }));
    nodes.elementBgColor.addEventListener("change", (event) => updateSelectedElement({ bgColorToken: event.target.value }));
    nodes.elementTextColor.addEventListener("change", (event) => updateSelectedElement({ textColorToken: event.target.value }));
    nodes.elementInlineCss.addEventListener("input", (event) => updateSelectedElement({ inlineCss: event.target.value }));
    nodes.elementEffect.addEventListener("change", (event) => updateSelectedElement({ effect: event.target.value }));
    nodes.elementTimeline.addEventListener("change", (event) => updateSelectedElement({ timeline: event.target.value }));
    nodes.elementRange.addEventListener("change", (event) => updateSelectedElement({ range: event.target.value }));
    nodes.elementRangeCustom.addEventListener("input", (event) => updateSelectedElement({ rangeCustom: event.target.value }));
    nodes.elementSpeed.addEventListener("change", (event) => updateSelectedElement({ speed: event.target.value }));
    nodes.elementDepth.addEventListener("change", (event) => updateSelectedElement({ depth: event.target.value }));
    nodes.elementStagger.addEventListener("change", (event) => updateSelectedElement({ stagger: event.target.value }));
    nodes.elementMute.addEventListener("change", (event) => updateSelectedElement({ muted: event.target.value === "muted" }));
    nodes.elementStart.addEventListener("input", (event) => updateSelectedElement({ clipStart: Number(event.target.value || 0) }));
    nodes.elementLength.addEventListener("input", (event) => updateSelectedElement({ clipLength: Number(event.target.value || MIN_ELEMENT_LENGTH) }));
    if (nodes.previewDelay) {
      nodes.previewDelay.addEventListener("input", (event) => {
        previewState.delayMs = Number(event.target.value || 0);
        if (nodes.previewDelayValue) {
          nodes.previewDelayValue.textContent = `${previewState.delayMs}ms`;
        }
        replaySelectedElementAnimation();
      });
    }
    if (nodes.previewSpeed) {
      nodes.previewSpeed.addEventListener("input", (event) => {
        previewState.speedRate = Number(event.target.value || 1);
        if (nodes.previewSpeedValue) {
          nodes.previewSpeedValue.textContent = `${previewState.speedRate.toFixed(2)}x`;
        }
        replaySelectedElementAnimation();
      });
    }
    if (nodes.previewReplaySelected) {
      nodes.previewReplaySelected.addEventListener("click", () => {
        replaySelectedElementAnimation();
      });
    }
    if (nodes.previewReplayScene) {
      nodes.previewReplayScene.addEventListener("click", () => {
        replaySelectedSceneAnimations();
      });
    }

    nodes.timelineScrub.addEventListener("input", (event) => {
      state.playhead = clamp(quantizeMs(Number(event.target.value || 0)), 0, getDocumentDuration());
      render();
    });

    // Inspector tab switching
    document.querySelectorAll(".sc-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        switchTab(tab.getAttribute("data-tab"));
      });
    });

    nodes.sceneLanes.addEventListener("pointerdown", beginClipDrag);
    nodes.elementLanes.addEventListener("pointerdown", beginClipDrag);
    window.addEventListener("pointermove", onClipDrag);
    window.addEventListener("pointerup", endClipDrag);
    window.addEventListener("pointercancel", endClipDrag);

    nodes.copyHtml.addEventListener("click", () => copyText(nodes.outputHtml.value, "HTML snippet copied."));
    nodes.copyCss.addEventListener("click", () => copyText(nodes.outputCss.value, "CSS snippet copied."));
    nodes.copyJson.addEventListener("click", () => copyText(nodes.outputJson.value, "Document JSON copied."));
    nodes.exportJson.addEventListener("click", downloadJson);
    nodes.importJson.addEventListener("click", importJson);
    nodes.download.addEventListener("click", downloadHtml);
    nodes.reset.addEventListener("click", () => {
      state.documentTitle = "Velora Scroll Narrative";
      state.scenes = [createScene("hero"), createScene("features"), createScene("story")];
      sequenceScenes();
      setSelectedScene(state.scenes[0].id);
      state.playhead = 2200;
      render();
      nodes.message.textContent = "Builder reset to the default multi-scene composition.";
    });
  }

  function init() {
    fillSelect(nodes.addSceneTemplate, listSceneTemplates(), Object.fromEntries(listSceneTemplates().map((key) => [key, TEMPLATE_REGISTRY[key].label])));
    fillSelect(nodes.sceneTemplate, listSceneTemplates(), Object.fromEntries(listSceneTemplates().map((key) => [key, TEMPLATE_REGISTRY[key].label])));
    fillSelect(nodes.sceneEffect, SCENE_OPTIONS.effect);
    fillSelect(nodes.sceneTimeline, SCENE_OPTIONS.timeline);
    fillSelect(nodes.sceneRange, SCENE_OPTIONS.range);
    fillSelect(nodes.elementEffect, ELEMENT_OPTIONS.effect);
    fillSelect(nodes.elementTimeline, ELEMENT_OPTIONS.timeline);
    fillSelect(nodes.elementRange, ELEMENT_OPTIONS.range);
    fillSelect(nodes.elementSpeed, ELEMENT_OPTIONS.speed);
    fillSelect(nodes.elementDepth, ELEMENT_OPTIONS.depth);
    fillSelect(nodes.elementStagger, ELEMENT_OPTIONS.stagger);
    fillSelect(nodes.addElementKind, Object.keys(ELEMENT_LIBRARY), Object.fromEntries(Object.entries(ELEMENT_LIBRARY).map(([key, value]) => [key, value.label])));
    fillSelect(nodes.elementTag, HTML_TAG_OPTIONS);
    fillSelect(nodes.sceneBgColor, DESIGN_TOKEN_OPTIONS.map((item) => item.value), Object.fromEntries(DESIGN_TOKEN_OPTIONS.map((item) => [item.value, item.label])));
    fillSelect(nodes.sceneTextColor, DESIGN_TOKEN_OPTIONS.map((item) => item.value), Object.fromEntries(DESIGN_TOKEN_OPTIONS.map((item) => [item.value, item.label])));
    fillSelect(nodes.elementBgColor, DESIGN_TOKEN_OPTIONS.map((item) => item.value), Object.fromEntries(DESIGN_TOKEN_OPTIONS.map((item) => [item.value, item.label])));
    fillSelect(nodes.elementTextColor, DESIGN_TOKEN_OPTIONS.map((item) => item.value), Object.fromEntries(DESIGN_TOKEN_OPTIONS.map((item) => [item.value, item.label])));
    fillSelect(nodes.designComponentSelect, Object.keys(DESIGN_SYSTEM_COMPONENTS), Object.fromEntries(Object.entries(DESIGN_SYSTEM_COMPONENTS).map(([key, value]) => [key, value.label])));

    hydrateFromStorage();
    if (!state.scenes.length) {
      state.scenes = [createScene("hero"), createScene("features"), createScene("story")];
      sequenceScenes();
    }
    ensureStateShape();
    bindEvents();
    render();
  }

  init();
})();