# Showcase Cinematic Scenes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar as 6 páginas de referência do showcase em experiências full-canvas com cenas cinematográficas, removendo o progresso horizontal do topo e introduzindo progressão lateral inspirada em `scroll-reveal`.

**Architecture:** A implementação preserva `header` e `footer` globais, mas substitui o indicador de progresso do topo por uma trilha lateral e converte cada `section` das 6 páginas em uma cena full-width. O CSS compartilhado passa a fornecer scaffold cinematográfico e componentes de progressão/cena, enquanto cada página recebe estrutura própria orientada a atos visuais e demonstrações do framework.

**Tech Stack:** HTML estático, CSS do Velora, CSS local do showcase, JavaScript leve já existente no showcase, Vite para build.

---

## File Structure

**Modificar:**

- `apps/showcase/public/css/showcase-reference-pages.css`
- `apps/showcase/pages/core/landing.html`
- `apps/showcase/pages/color/design-tokens.html`
- `apps/showcase/pages/tools/system-modules.html`
- `apps/showcase/pages/tools/architecture.html`
- `apps/showcase/pages/tools/brand-voice.html`
- `apps/showcase/pages/tools/accessibility.html`

**Consultar:**

- `apps/showcase/pages/scenes/scroll-reveal.html`
- `apps/showcase/public/js/showcase-controls.js`
- `apps/showcase/public/css/04d-premium.css`

### Task 1: Shell Global Cinematográfico

**Files:**
- Modify: `apps/showcase/public/css/showcase-reference-pages.css`
- Modify: `apps/showcase/pages/core/landing.html`
- Modify: `apps/showcase/pages/color/design-tokens.html`
- Modify: `apps/showcase/pages/tools/system-modules.html`
- Modify: `apps/showcase/pages/tools/architecture.html`
- Modify: `apps/showcase/pages/tools/brand-voice.html`
- Modify: `apps/showcase/pages/tools/accessibility.html`

- [ ] **Step 1: Remover o progresso horizontal do topo das 6 páginas**

```html
<!-- remover -->
<div class="vl-scroll-progress vl-scroll-progress--glow"></div>
```

- [ ] **Step 2: Inserir uma trilha lateral inspirada em `scroll-reveal` em todas as 6 páginas**

```html
<div class="showcase-cinema-rail" aria-hidden="true">
  <div class="showcase-cinema-rail__line"></div>
  <div class="showcase-cinema-rail__progress"></div>
  <div class="showcase-cinema-rail__stops">
    <span class="is-active"></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
  <span class="showcase-cinema-rail__label">Scroll Interpolation</span>
</div>
```

- [ ] **Step 3: Criar o scaffold full-canvas global no CSS**

```css
.showcase-ref-page {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0 0 8rem;
}

.showcase-ref-page > header,
.showcase-ref-page > section,
.showcase-ref-page > div {
    width: 100vw;
    max-width: 100vw;
    margin-inline: calc(50% - 50vw);
    padding-inline: 0;
}

.showcase-cinema-rail {
    position: fixed;
    right: clamp(1rem, 2vw, 2rem);
    top: 50%;
    translate: 0 -50%;
    z-index: 30;
}
```

- [ ] **Step 4: Adicionar fallback responsivo da trilha lateral**

```css
@media (max-width: 980px) {
    .showcase-cinema-rail {
        right: 0.75rem;
        scale: 0.9;
    }
}
```

- [ ] **Step 5: Rodar build**

Run: `npm run build`  
Expected: build completo sem erro

### Task 2: `landing` e `design-tokens` como Sequências de Cenas

**Files:**
- Modify: `apps/showcase/pages/core/landing.html`
- Modify: `apps/showcase/pages/color/design-tokens.html`
- Modify: `apps/showcase/public/css/showcase-reference-pages.css`

- [ ] **Step 1: Reestruturar `landing` em 5 cenas full-canvas**

```html
<div class="showcase-ref-page showcase-ref-page--landing showcase-ref-page--cinema">
  <section class="showcase-cinema-scene showcase-cinema-scene--hero">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--layering">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--modules">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--editorial">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--payoff">...</section>
</div>
```

- [ ] **Step 2: Reestruturar `design-tokens` em 5 cenas full-canvas**

```html
<div class="showcase-ref-page showcase-ref-page--tokens showcase-ref-page--cinema">
  <section class="showcase-cinema-scene showcase-cinema-scene--matter">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--swatches">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--type">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--easing">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--layout">...</section>
</div>
```

- [ ] **Step 3: Dar a cada cena entrada, interpolação e mudança de estado**

```html
<section class="showcase-cinema-scene showcase-cinema-scene--swatches" vl-effect="fade-up" vl-timeline="view">
  <div class="showcase-cinema-stage" vl-children="stagger" vl-stagger="0.08">...</div>
</section>
```

- [ ] **Step 4: Rodar build**

Run: `npm run build`  
Expected: `landing.html` e `design-tokens.html` gerados sem erro

### Task 3: `system-modules` e `architecture` como Sequências Técnicas Orquestradas

**Files:**
- Modify: `apps/showcase/pages/tools/system-modules.html`
- Modify: `apps/showcase/pages/tools/architecture.html`
- Modify: `apps/showcase/public/css/showcase-reference-pages.css`

- [ ] **Step 1: Reestruturar `system-modules` em cenas modulares full-canvas**

```html
<div class="showcase-ref-page showcase-ref-page--modules showcase-ref-page--cinema">
  <section class="showcase-cinema-scene showcase-cinema-scene--modules-hero">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--modules-bento">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--modules-metrics">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--modules-relations">...</section>
  <section class="showcase-cinema-scene showcase-cinema-scene--modules-cta">...</section>
</div>
```

- [ ] **Step 2: Reestruturar `architecture` em blueprint cinematográfico**

```html
<div class="showcase-ref-page showcase-ref-page--architecture showcase-ref-page--cinema">
  <div class="showcase-ref-shell">
    <aside class="showcase-ref-sidebar">...</aside>
    <div class="showcase-ref-canvas">
      <section class="showcase-cinema-scene showcase-cinema-scene--architecture-hero">...</section>
      <section class="showcase-cinema-scene showcase-cinema-scene--architecture-stack">...</section>
      <section class="showcase-cinema-scene showcase-cinema-scene--architecture-actuators">...</section>
      <section class="showcase-cinema-scene showcase-cinema-scene--architecture-transitions">...</section>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Rodar build**

Run: `npm run build`  
Expected: `system-modules.html` e `architecture.html` gerados sem erro

### Task 4: `brand-voice` e `accessibility` como Cenas Editoriais/Técnicas

**Files:**
- Modify: `apps/showcase/pages/tools/brand-voice.html`
- Modify: `apps/showcase/pages/tools/accessibility.html`
- Modify: `apps/showcase/public/css/showcase-reference-pages.css`

- [ ] **Step 1: Reestruturar `brand-voice` em cenas editoriais**

```html
<div class="showcase-ref-page showcase-ref-page--brand showcase-ref-page--cinema">
  <div class="showcase-ref-shell">
    <aside class="showcase-ref-sidebar">...</aside>
    <div class="showcase-ref-canvas">
      <section class="showcase-cinema-scene showcase-cinema-scene--brand-manifesto">...</section>
      <section class="showcase-cinema-scene showcase-cinema-scene--brand-traits">...</section>
      <section class="showcase-cinema-scene showcase-cinema-scene--brand-method">...</section>
      <section class="showcase-cinema-scene showcase-cinema-scene--brand-practice">...</section>
      <section class="showcase-cinema-scene showcase-cinema-scene--brand-direction">...</section>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Reestruturar `accessibility` em cenas de prova operacional**

```html
<div class="showcase-ref-page showcase-ref-page--accessibility showcase-ref-page--cinema">
  <div class="showcase-ref-shell">
    <aside class="showcase-ref-sidebar">...</aside>
    <div class="showcase-ref-canvas">
      <section class="showcase-cinema-scene showcase-cinema-scene--access-overview">...</section>
      <section class="showcase-cinema-scene showcase-cinema-scene--access-contrast">...</section>
      <section class="showcase-cinema-scene showcase-cinema-scene--access-semantics">...</section>
      <section class="showcase-cinema-scene showcase-cinema-scene--access-motion">...</section>
      <section class="showcase-cinema-scene showcase-cinema-scene--access-focus">...</section>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Rodar build**

Run: `npm run build`  
Expected: `brand-voice.html` e `accessibility.html` gerados sem erro

### Task 5: Verificação Final do Conjunto

**Files:**
- Modify: `apps/showcase/public/css/showcase-reference-pages.css`
- Modify: `apps/showcase/pages/core/landing.html`
- Modify: `apps/showcase/pages/color/design-tokens.html`
- Modify: `apps/showcase/pages/tools/system-modules.html`
- Modify: `apps/showcase/pages/tools/architecture.html`
- Modify: `apps/showcase/pages/tools/brand-voice.html`
- Modify: `apps/showcase/pages/tools/accessibility.html`

- [ ] **Step 1: Confirmar full-canvas real nas 6 páginas**

```css
.showcase-cinema-scene {
    width: 100vw;
    min-height: 100svh;
}
```

- [ ] **Step 2: Confirmar remoção do progresso horizontal e presença da trilha lateral**

```html
<!-- não deve existir -->
<div class="vl-scroll-progress vl-scroll-progress--glow"></div>

<!-- deve existir -->
<div class="showcase-cinema-rail" aria-hidden="true">...</div>
```

- [ ] **Step 3: Rodar build final completo**

Run: `npm run build`  
Expected: build completo sem erro

- [ ] **Step 4: Conferir estado final**

Run: `git status --short`  
Expected: alterações nas 6 páginas e no CSS compartilhado da rodada cinematográfica
