# Showcase Reference Six Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescrever os `main` de 6 páginas do showcase para ficarem visualmente muito próximas dos HTMLs de referência, preservando apenas `header` e `footer` do shell atual.

**Architecture:** A implementação mantém o shell global existente e substitui a camada de conteúdo de cada página por uma transposição estrutural do HTML-modelo correspondente. A base compartilhada de `showcase-reference-pages.css` só permanece para tokens de integração, resets locais e pequenos utilitários; a composição de cada página passa a ser dirigida principalmente pelo HTML específico e por variantes CSS por página quando necessário.

**Tech Stack:** HTML estático no showcase, CSS do Velora, CSS local do showcase, Vite para build.

---

## File Structure

**Modificar:**

- `apps/showcase/pages/core/landing.html` — trocar o `main` atual por uma composição editorial fiel a `velora_landing_page_refined.html`
- `apps/showcase/pages/color/design-tokens.html` — trocar o `main` atual por uma composição fiel a `tokens_foundation_refined.html`
- `apps/showcase/pages/tools/system-modules.html` — trocar o `main` atual por um bento técnico fiel a `system_modules_overview.html`
- `apps/showcase/pages/tools/architecture.html` — trocar o `main` atual por uma composição blueprint com painel lateral fixo e seções densas
- `apps/showcase/pages/tools/brand-voice.html` — trocar o `main` atual por uma composição clara/editorial fiel a `brand_voice_editorial_strategy.html`
- `apps/showcase/pages/tools/accessibility.html` — trocar o `main` atual por uma composição técnica com sidenav e bento fiel a `accessibility_wcag_guidelines.html`
- `apps/showcase/public/css/showcase-reference-pages.css` — reduzir a dependência de “template” e introduzir estilos por página necessários para suportar as estruturas reais dos modelos

**Consultar durante a implementação:**

- `packages/pages/velora_landing_page_refined.html`
- `packages/pages/tokens_foundation_refined.html`
- `packages/pages/system_modules_overview.html`
- `packages/pages/architectural_blueprint.html`
- `packages/pages/brand_voice_editorial_strategy.html`
- `packages/pages/accessibility_wcag_guidelines.html`

**Verificar:**

- `apps/showcase/package.json`

### Task 1: Preparar a Base de Integração do Showcase

**Files:**
- Modify: `apps/showcase/public/css/showcase-reference-pages.css`
- Test: `apps/showcase/package.json`

- [ ] **Step 1: Escrever a base CSS que permita composições mais literais por página**

```css
.showcase-ref-page {
    width: min(100%, 100rem);
    margin: 0 auto;
    padding: 0 0 5rem;
}

.showcase-ref-page > section,
.showcase-ref-page > header,
.showcase-ref-page > div {
    width: 100%;
}

.showcase-ref-page--landing,
.showcase-ref-page--tokens,
.showcase-ref-page--modules,
.showcase-ref-page--architecture,
.showcase-ref-page--brand,
.showcase-ref-page--accessibility {
    position: relative;
}

.showcase-ref-page--brand {
    color: #1b1c19;
}
```

- [ ] **Step 2: Adicionar variantes específicas que suportem os layouts reais dos modelos**

```css
.showcase-ref-page--architecture {
    width: min(100%, 110rem);
}

.showcase-ref-page--architecture .showcase-ref-shell {
    display: grid;
    grid-template-columns: 18rem minmax(0, 1fr);
    min-height: 100%;
}

.showcase-ref-page--accessibility .showcase-ref-shell {
    display: grid;
    grid-template-columns: 16rem minmax(0, 1fr);
}

.showcase-ref-page--brand .showcase-ref-shell {
    display: grid;
    grid-template-columns: 18rem minmax(0, 1fr);
    background: #fbf9f4;
}
```

- [ ] **Step 3: Adicionar fallback responsivo para páginas com sidebar e composição densa**

```css
@media (max-width: 980px) {
    .showcase-ref-page--architecture .showcase-ref-shell,
    .showcase-ref-page--accessibility .showcase-ref-shell,
    .showcase-ref-page--brand .showcase-ref-shell {
        grid-template-columns: 1fr;
    }

    .showcase-ref-page--architecture .showcase-ref-sidebar,
    .showcase-ref-page--accessibility .showcase-ref-sidebar,
    .showcase-ref-page--brand .showcase-ref-sidebar {
        position: static;
        width: 100%;
        border-right: 0;
        border-bottom: 1px solid color-mix(in oklch, var(--vl-border-subtle) 60%, transparent);
    }
}
```

- [ ] **Step 4: Rodar build para verificar que a base CSS continua compatível**

Run: `npm run build`  
Expected: build do showcase concluído sem erro

- [ ] **Step 5: Commit**

```bash
git add apps/showcase/public/css/showcase-reference-pages.css
git commit -m "refactor: prepare showcase reference layout foundation"
```

### Task 2: Recriar `landing` e `design-tokens` com Fidelidade Alta

**Files:**
- Modify: `apps/showcase/pages/core/landing.html`
- Modify: `apps/showcase/pages/color/design-tokens.html`
- Modify: `apps/showcase/public/css/showcase-reference-pages.css`
- Test: `apps/showcase/package.json`

- [ ] **Step 1: Substituir o `main` de `landing.html` por uma estrutura próxima ao modelo**

```html
<main id="content" class="vl-main">
  <div class="showcase-ref-page showcase-ref-page--landing">
    <section class="showcase-ref-landing-hero">
      <div class="showcase-ref-landing-copy">
        <p class="showcase-ref-kicker">V.04.22 Build Alpha</p>
        <h1 class="showcase-ref-title">Engineered for <em>Precision</em></h1>
        <p class="showcase-ref-lead">A high-performance UI framework that rejects bloated patterns and leans on visual tokens, architectural layering and browser-native motion.</p>
        <div class="showcase-ref-actions">
          <a href="/pages/tools/architecture.html">View Architecture</a>
          <a href="/pages/tools/system-modules.html">System Modules</a>
        </div>
      </div>
      <div class="showcase-ref-landing-metrics">
        <p>LATENCY: 0.04MS</p>
        <p>RE-FLOW: OPTIMIZED</p>
        <p>V-SYNC: ENABLED</p>
      </div>
    </section>

    <section class="showcase-ref-landing-value">
      <h2>The Browser-First Paradigm</h2>
      <p>Velora leverages native browser capabilities to achieve visual depth without runtime overhead.</p>
    </section>
    <section class="showcase-ref-landing-modules">
      <article><h3>Tonal Layering</h3><p>Hierarchy through recession and tonal shifts.</p></article>
      <article><h3>Kinetic Ease</h3><p>Motion that stays on the compositor and reads as structure.</p></article>
      <article><h3>Zero JS Motion</h3><p>Core interaction logic powered by the browser.</p></article>
    </section>
    <section class="showcase-ref-landing-editorial">
      <h2>Velora is not a tool. It is an Editorial Voice.</h2>
      <p>We move away from the template look and toward a high-end editorial experience.</p>
    </section>
  </div>
</main>
```

- [ ] **Step 2: Substituir o `main` de `design-tokens.html` por uma estrutura fiel ao modelo**

```html
<main id="content" class="vl-main">
  <div class="showcase-ref-page showcase-ref-page--tokens">
    <header class="showcase-ref-tokens-header">
      <p class="showcase-ref-kicker">v2.4.0 Core Foundation</p>
      <h1 class="showcase-ref-title">Tokens &amp; Blueprint</h1>
      <p class="showcase-ref-lead">The atomic structure of the Velora ecosystem, built on perceptual color science and architectural typography.</p>
    </header>

    <section class="showcase-ref-tokens-swatches">
      <article><h2>Surface Noir</h2><p>#0D0F0C</p></article>
      <article><h2>Velora Cream</h2><p>#E1E7DC</p></article>
      <article><h2>Kinetic Green</h2><p>#BBCBB1</p></article>
    </section>
    <section class="showcase-ref-tokens-type">
      <h2>The Editorial Voice</h2>
      <p>Display with Space Grotesk, reading texture with Manrope.</p>
    </section>
    <section class="showcase-ref-tokens-motion">
      <h2>Cinematic Easing</h2>
      <p>Core transitions use deliberate timing and restrained motion bands.</p>
    </section>
    <section class="showcase-ref-tokens-layout">
      <h2>Layout Primitives</h2>
      <p>Asymmetric containers replace generic twelve-column sameness.</p>
    </section>
  </div>
</main>
```

- [ ] **Step 3: Adaptar links e CTAs dessas duas páginas para rotas reais do showcase**

```html
<a href="/pages/tools/architecture.html">View Architecture</a>
<a href="/pages/color/color-system.html">Color System</a>
<a href="/pages/tools/system-modules.html">System Modules</a>
<a href="/pages/tools/converter.html">Migration</a>
```

- [ ] **Step 4: Adicionar CSS local das duas páginas sem recolocar aparência de template**

```css
.showcase-ref-page--landing .showcase-ref-landing-hero {
    min-height: calc(100svh - 4rem);
    display: grid;
    align-content: center;
}

.showcase-ref-page--tokens .showcase-ref-tokens-swatches {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.5rem;
}
```

- [ ] **Step 5: Rodar build para verificar as duas páginas**

Run: `npm run build`  
Expected: `dist/pages/core/landing.html` e `dist/pages/color/design-tokens.html` gerados sem erro

- [ ] **Step 6: Commit**

```bash
git add apps/showcase/pages/core/landing.html apps/showcase/pages/color/design-tokens.html apps/showcase/public/css/showcase-reference-pages.css
git commit -m "feat: align landing and token pages with reference layouts"
```

### Task 3: Recriar `system-modules` e `architecture` com Estruturas Técnicas Densas

**Files:**
- Modify: `apps/showcase/pages/tools/system-modules.html`
- Modify: `apps/showcase/pages/tools/architecture.html`
- Modify: `apps/showcase/public/css/showcase-reference-pages.css`
- Test: `apps/showcase/package.json`

- [ ] **Step 1: Portar `system-modules.html` para um bento técnico mais literal**

```html
<main id="content" class="vl-main">
  <div class="showcase-ref-page showcase-ref-page--modules">
    <section class="showcase-ref-modules-hero">
      <p class="showcase-ref-kicker">Core Specification v2.4</p>
      <h1 class="showcase-ref-title">System Modules <span>Overview</span></h1>
      <p class="showcase-ref-lead">Composable slices of responsibility: tokens, structures, forms, dialogs and motion.</p>
    </section>
    <section class="showcase-ref-modules-bento">
      <article class="showcase-ref-modules-card showcase-ref-modules-card--wide"><h2>Tonal Layering</h2><p>Structural boundaries through luminosity shifts and negative space.</p></article>
      <article class="showcase-ref-modules-card showcase-ref-modules-card--metrics"><h2>Operational Metrics</h2><p>0.02ms render latency, 0.00kb JS execution, OKLCH color space.</p></article>
      <article class="showcase-ref-modules-card"><h3>Kinetic Ease</h3><p>High-end editorial motion with native browser acceleration.</p></article>
      <article class="showcase-ref-modules-card"><h3>Zero JS Motion</h3><p>Immersive transitions that respect the main thread.</p></article>
      <article class="showcase-ref-modules-card"><h3>Architectural Primitives</h3><p>Grid and stack systems defined at the CSS layer.</p></article>
      <article class="showcase-ref-modules-band"><h2>Perceptual Color Calibration</h2><p>The palette remains uniform across display types through oklch().</p></article>
    </section>
  </div>
</main>
```

- [ ] **Step 2: Portar `architecture.html` com shell interno de sidebar e canvas**

```html
<main id="content" class="vl-main">
  <div class="showcase-ref-page showcase-ref-page--architecture">
    <div class="showcase-ref-shell">
      <aside class="showcase-ref-sidebar">
        <nav>
          <a href="/pages/tools/architecture.html">Core Philosophy</a>
          <a href="/pages/color/design-tokens.html">Tonal Layering</a>
          <a href="/pages/motion/motion-principles.html">Motion Primitives</a>
          <a href="/pages/tools/system-modules.html">Performance Metrics</a>
        </nav>
      </aside>
      <div class="showcase-ref-canvas">
        <section class="showcase-ref-architecture-hero">
          <p class="showcase-ref-kicker">Foundational Core</p>
          <h1 class="showcase-ref-title">Architectural Blueprint.</h1>
          <p class="showcase-ref-lead">Browser-native performance for tactile, high-end experiences.</p>
        </section>
        <section class="showcase-ref-architecture-stack"><h2>The Tonal Stack</h2><p>Depth is the relationship between materials, not shadow tricks.</p></section>
        <section class="showcase-ref-architecture-actuators"><h2>Kinetic Actuators</h2><p>Buttons and controls behave like mechanical interfaces.</p></section>
        <section class="showcase-ref-architecture-boundaries"><h2>What belongs inside the framework</h2><p>Tokens, structures and motion primitives; not one-off hacks.</p></section>
      </div>
    </div>
  </div>
</main>
```

- [ ] **Step 3: Adaptar navegação interna e CTAs para links do showcase**

```html
<a href="/pages/tools/system-modules.html">Modules</a>
<a href="/pages/color/design-tokens.html">Tokens</a>
<a href="/pages/tools/accessibility.html">Accessibility</a>
<a href="/pages/motion/motion-principles.html">Motion Principles</a>
```

- [ ] **Step 4: Adicionar CSS estrutural para grids, sidebar e blocos técnicos**

```css
.showcase-ref-page--modules .showcase-ref-modules-bento {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 0.25rem;
}

.showcase-ref-page--architecture .showcase-ref-sidebar {
    position: sticky;
    top: 0;
    align-self: start;
    min-height: calc(100svh - 4rem);
}

.showcase-ref-page--architecture .showcase-ref-canvas {
    padding-top: 2rem;
}
```

- [ ] **Step 5: Rodar build para verificar as duas páginas**

Run: `npm run build`  
Expected: `dist/pages/tools/system-modules.html` e `dist/pages/tools/architecture.html` gerados sem erro

- [ ] **Step 6: Commit**

```bash
git add apps/showcase/pages/tools/system-modules.html apps/showcase/pages/tools/architecture.html apps/showcase/public/css/showcase-reference-pages.css
git commit -m "feat: port technical reference layouts into showcase tools pages"
```

### Task 4: Recriar `brand-voice` e `accessibility` com Identidade Própria

**Files:**
- Modify: `apps/showcase/pages/tools/brand-voice.html`
- Modify: `apps/showcase/pages/tools/accessibility.html`
- Modify: `apps/showcase/public/css/showcase-reference-pages.css`
- Test: `apps/showcase/package.json`

- [ ] **Step 1: Portar `brand-voice.html` para um canvas claro com sidebar editorial**

```html
<main id="content" class="vl-main">
  <div class="showcase-ref-page showcase-ref-page--brand">
    <div class="showcase-ref-shell">
      <aside class="showcase-ref-sidebar">
        <nav>
          <a href="/pages/tools/brand-voice.html">Voice &amp; Tone</a>
          <a href="/pages/color/design-tokens.html">Visual Identity</a>
          <a href="/pages/motion/motion-principles.html">Motion Principles</a>
          <a href="/pages/tools/accessibility.html">Accessibility</a>
        </nav>
      </aside>
      <div class="showcase-ref-canvas">
        <header class="showcase-ref-brand-header">
          <p class="showcase-ref-kicker">Module 02: Communication</p>
          <h1 class="showcase-ref-title">Editorial Voice</h1>
          <p class="showcase-ref-lead">Precision of a technician, warmth of a storyteller.</p>
        </header>
        <section class="showcase-ref-brand-traits"><h2>Personality Traits</h2><p>Precise, cinematic, human-centric and performance-driven.</p></section>
        <section class="showcase-ref-brand-method"><h2>The Applied Method</h2><p>Explain the mechanism, use active verbs and avoid vague promises.</p></section>
        <section class="showcase-ref-brand-why"><h2>Why this matters</h2><p>Voice is part of the system, not garnish.</p></section>
      </div>
    </div>
  </div>
</main>
```

- [ ] **Step 2: Portar `accessibility.html` para um shell técnico com sidenav e bento de regras**

```html
<main id="content" class="vl-main">
  <div class="showcase-ref-page showcase-ref-page--accessibility">
    <div class="showcase-ref-shell">
      <aside class="showcase-ref-sidebar">
        <nav>
          <a href="/pages/tools/accessibility.html">Contrast Ratio</a>
          <a href="/pages/motion/zero-js-motion.html">Motion Safety</a>
          <a href="/pages/components/forms.html">Semantics</a>
          <a href="/pages/tools/contrast-tool.html">Keyboard Focus</a>
        </nav>
      </aside>
      <div class="showcase-ref-canvas">
        <section class="showcase-ref-accessibility-hero">
          <p class="showcase-ref-kicker">Documentation / Standards</p>
          <h1 class="showcase-ref-title">The Architectural Foundations of Digital Inclusivity</h1>
          <p class="showcase-ref-lead">WCAG 2.1 alignment without sacrificing aesthetic precision.</p>
        </section>
        <section class="showcase-ref-accessibility-grid">
          <article><h2>Color Contrast</h2><p>Perceptual contrast powered by oklch().</p></article>
          <article><h2>Touch Target</h2><p>48x48px minimum for interactive actuators.</p></article>
          <article><h2>Semantic Shells</h2><p>Native HTML and landmark clarity by default.</p></article>
          <article><h2>Motion Safety</h2><p>`prefers-reduced-motion` honored automatically.</p></article>
        </section>
        <section class="showcase-ref-accessibility-cta"><h2>Build accessibly from the start</h2><p>Use the contrast tool and the system pages as operational references.</p></section>
      </div>
    </div>
  </div>
</main>
```

- [ ] **Step 3: Ajustar links, termos e botões para o universo real do showcase**

```html
<a href="/pages/tools/contrast-tool.html">Read Full Spec</a>
<a href="/pages/tools/accessibility.html">Accessibility</a>
<a href="/pages/core/landing.html">Overview</a>
<a href="/pages/motion/zero-js-motion.html">Motion Safety</a>
```

- [ ] **Step 4: Adicionar CSS específico para o modo claro/editorial e para a grade técnica de acessibilidade**

```css
.showcase-ref-page--brand {
    background: #fbf9f4;
}

.showcase-ref-page--brand .showcase-ref-canvas {
    padding: 8rem 2rem 4rem;
}

.showcase-ref-page--accessibility .showcase-ref-accessibility-grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 2rem;
}
```

- [ ] **Step 5: Rodar build para verificar as duas páginas**

Run: `npm run build`  
Expected: `dist/pages/tools/brand-voice.html` e `dist/pages/tools/accessibility.html` gerados sem erro

- [ ] **Step 6: Commit**

```bash
git add apps/showcase/pages/tools/brand-voice.html apps/showcase/pages/tools/accessibility.html apps/showcase/public/css/showcase-reference-pages.css
git commit -m "feat: match showcase brand and accessibility pages to references"
```

### Task 5: Verificação Final de Fidelidade e Integração

**Files:**
- Modify: `apps/showcase/pages/core/landing.html`
- Modify: `apps/showcase/pages/color/design-tokens.html`
- Modify: `apps/showcase/pages/tools/system-modules.html`
- Modify: `apps/showcase/pages/tools/architecture.html`
- Modify: `apps/showcase/pages/tools/brand-voice.html`
- Modify: `apps/showcase/pages/tools/accessibility.html`
- Modify: `apps/showcase/public/css/showcase-reference-pages.css`
- Test: `apps/showcase/package.json`

- [ ] **Step 1: Revisar se nenhum `main` voltou a parecer template compartilhado**

```html
<!-- revisar que cada página tenha blocos únicos -->
<div class="showcase-ref-page showcase-ref-page--landing"><section class="showcase-ref-landing-hero"><h1>Engineered for Precision</h1></section></div>
<div class="showcase-ref-page showcase-ref-page--tokens"><section class="showcase-ref-tokens-swatches"><article><h2>Surface Noir</h2></article></section></div>
<div class="showcase-ref-page showcase-ref-page--modules"><section class="showcase-ref-modules-bento"><article><h2>Tonal Layering</h2></article></section></div>
<div class="showcase-ref-page showcase-ref-page--architecture"><div class="showcase-ref-shell"><aside class="showcase-ref-sidebar"></aside><div class="showcase-ref-canvas"></div></div></div>
<div class="showcase-ref-page showcase-ref-page--brand"><div class="showcase-ref-shell"><aside class="showcase-ref-sidebar"></aside><div class="showcase-ref-canvas"></div></div></div>
<div class="showcase-ref-page showcase-ref-page--accessibility"><div class="showcase-ref-shell"><aside class="showcase-ref-sidebar"></aside><div class="showcase-ref-canvas"></div></div></div>
```

- [ ] **Step 2: Revisar links adaptados e remover destinos antigos ou irrelevantes**

```html
<!-- substituir exemplos -->
href="#"
href="/docs"
href="/guide"

<!-- por destinos reais do showcase -->
href="/pages/core/landing.html"
href="/pages/tools/system-modules.html"
href="/pages/tools/contrast-tool.html"
```

- [ ] **Step 3: Rodar build final completo**

Run: `npm run build`  
Expected: build completo sem erros

- [ ] **Step 4: Conferir o estado final**

Run: `git status --short`  
Expected: apenas alterações nas 6 páginas-alvo e em `showcase-reference-pages.css` relacionadas a esta rodada

- [ ] **Step 5: Commit**

```bash
git add apps/showcase/pages/core/landing.html apps/showcase/pages/color/design-tokens.html apps/showcase/pages/tools/system-modules.html apps/showcase/pages/tools/architecture.html apps/showcase/pages/tools/brand-voice.html apps/showcase/pages/tools/accessibility.html apps/showcase/public/css/showcase-reference-pages.css
git commit -m "feat: port six showcase pages closer to reference source layouts"
```
