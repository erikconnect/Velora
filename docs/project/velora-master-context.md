



Este é o **Master Document (System Prompt / Context File)** definitivo do Velora. Ele foi estruturado para servir como "cérebro" para qualquer outra IA (ChatGPT, Claude, Cursor, GitHub Copilot) entender 100% do escopo, das regras de negócio, da arquitetura técnica e do estado da arte do CSS que definimos.

Você pode copiar todo o texto abaixo e salvá-lo como `velora-master-context.md` ou colá-lo na área de "Knowledge" ou "Project Context" de qualquer agente de IA.

***

# 📂 MASTER CONTEXT DOCUMENT: VELORA FRAMEWORK
**Versão:** v0.1 (MVP Focus)
**Data de Referência:** 2026 (Foco em Web Platform moderna, Chrome 140+)
**Identidade:** Velora — Motion-Native Frontend Platform

## 1. Visão do Projeto e Tese de Produto
O Velora é um framework frontend focado em construir sites premium, imersivos e cinematográficos (foco em marketing, agências, portfólios e dashboards modernos). 
**O grande diferencial:** Ele vai na contramão do ecossistema moderno focado em JavaScript (React/Vue). O Velora é um sistema de renderização "Browser-first". Ele extrai o poder máximo da GPU usando puramente HTML Semântico e as mais recentes features de CSS, entregando performance a 120fps com **Zero JavaScript para animações e roteamento.**

## 2. Estratégia de Negócios e Viabilidade (Plano de Ação)
O projeto inicial (Blueprint) previa a criação simultânea de um framework, um construtor visual (Builder) e integração com IA. Para garantir viabilidade financeira e sucesso técnico, a estratégia foi "pivotada" e dividida:
*   **Fase 1 (Atual - Escopo deste Documento):** Lançar a biblioteca open-source (`core`), provar o valor técnico com documentação impressionante e construir uma comunidade.
*   **Fase 2 (Monetização de Curto Prazo):** Vender pacotes de templates premium (Scenes, Landing Pages, Dashboards) construídos em Velora.
*   **Fase 3 e 4 (Futuro Distante - Não fazer agora):** Visual Builder (SaaS) e Geração via IA.

## 3. As Regras de Ouro da Arquitetura (STRICT MODE PARA IAs)
**⚠️ ATENÇÃO AGENTES DE IA: Ao ler este documento, você DEVE seguir rigidamente estas regras ao gerar código para o Velora:**
1.  **PROIBIDO FRAMEWORKS JS:** Não sugira, instale ou gere código usando React, Vue, Framer Motion, GSAP ou Locomotive Scroll. 
2.  **ZERO JAVASCRIPT PARA ANIMAÇÕES:** Toda animação deve usar funcionalidades nativas do CSS (`@starting-style`, `view-timeline`, `scroll-timeline`, `transition-behavior: allow-discrete`).
3.  **ZERO JAVASCRIPT PARA ROTEAMENTO:** Navegação no estilo SPA (Single Page Application) com transições fluidas entre páginas será feita EXCLUSIVAMENTE via API nativa de CSS: `@view-transition { navigation: auto; }` (MPA Cross-document transitions).
4.  **CORES E DESIGN SYSTEM:** Utilize exclusivamente o espaço de cor `oklch()` para todas as variáveis, garantindo contrastes perfeitos e suporte a color-mix.
5.  **ENCAPSULAMENTO:** Todo o código CSS do framework deve estar contido em Cascade Layers (`@layer`).

## 4. Stack Tecnológico Padrão
*   **Gerenciador de Pacotes:** `pnpm`
*   **Monorepo:** `Turborepo` (com workspaces para `packages/*` e `apps/*`)
*   **Ferramentas de Build Core:** `Vite` e `PostCSS` (se necessário)
*   **Documentação e Site:** `Astro.build` (Foco máximo em output de HTML estático)
*   **Linguagens:** HTML5, CSS3 Moderno, TypeScript (apenas para observers muito específicos).

## 5. Estrutura do CSS e Nomenclatura (O Motor do Velora)
As classes devem usar o prefixo `.vl-` e as variáveis CSS o prefixo `--vl-`.

**A Ordem Rigorosa das Layers (Especificidade):**
```css
@layer velora.reset, velora.tokens, velora.layout, velora.motion, velora.components, velora.transitions, velora.utilities, velora.overrides;
```

**Módulo 1: Reset e Base (`velora.reset`)**
*   Deve conter o reset padrão e a habilitação nativa para animar altura para `auto`: `:root { interpolate-size: allow-keywords; }`.

**Módulo 2: Tokens (`velora.tokens`)**
*   Uso de `oklch`. Ex: `--vl-surface: oklch(25% 0.01 250);`
*   Tokens de espaçamento (`--vl-space-*`), tipografia e easing functions cinematográficas (`--vl-ease-cinematic: cubic-bezier(0.2, 0.8, 0.2, 1);`).

**Módulo 3: Layouts (`velora.layout`)**
*   Primitivas de estrutura semântica como `.vl-container`, `.vl-grid`, `.vl-stack`. Uso intenso de Container Queries (`@container`) no lugar de Media Queries genéricas.

**Módulo 4: Componentes ("Scenes" - `velora.components`)**
*   Componentes ricos como Cards, Modais, Drawers e Accordeons baseados apenas em estado HTML (`[open]`, `[data-theme]`, etc).

## 6. O "Wow Factor": As Três Tecnologias Chave do Velora
Sempre que uma IA for solicitada a criar um componente rico, ela deve explorar essas três tecnologias nativas que substituem bibliotecas JS antigas:

### A. MPA View Transitions (Navegação Fluida)
Substitui roteadores complexos (como React Router ou Swup).
*   **Configuração CSS Global:** `@view-transition { navigation: auto; }` e `html { view-transition-name: root; }`.
*   **Morphing/Shared Elements:** Basta que a página A e a página B tenham elementos com o mesmo `style="view-transition-name: identificador-unico;"` para o navegador interpolar forma, tamanho e posição entre as telas.

### B. Scroll-Driven Animations Nativas
Substitui bibliotecas como o ScrollMagic, Locomotive ou GSAP ScrollTrigger.
*   Vincula animações CSS à barra de rolagem rodando direto na thread da placa de vídeo.
*   **Exemplo Prático (Revelação 3D):**
    ```css
    .vl-scroll-reveal {
      view-timeline-name: --vl-reveal;
      animation: vl-3d-entry both linear; /* 'linear' é essencial aqui, a curva se dá pelo scroll */
      animation-timeline: --vl-reveal;
      animation-range: entry 5% cover 40%;
    }
    ```

### C. Acordeões, Menus e Modais Dinâmicos Nativos
Substitui lógicas de cálculo de `scrollHeight` via JS.
*   Uso da tag `<details>` e `<summary>`. O atributo `name="grupo"` agrupa acordeões para que apenas um fique aberto.
*   O pseudo-elemento `::details-content` em conjunto com `interpolate-size` permite animar a abertura:
    ```css
    .vl-accordion::details-content {
      height: 0;
      opacity: 0;
      transition: height 0.5s var(--vl-ease-cinematic), opacity 0.4s;
    }
    .vl-accordion[open]::details-content {
      height: auto;
      opacity: 1;
    }
    ```

## 7. Estrutura de Diretórios Esperada (Monorepo)
```text
velora/
├── pnpm-workspace.yaml
├── packages/
│   ├── css/
│   │   ├── src/
│   │   │   ├── velora.css
│   │   │   ├── 01-tokens.css
│   │   │   ├── 02-layout.css
│   │   │   ├── 03-motion.css
│   │   │   ├── 04-components.css
│   │   │   └── 05-transitions.css
│   │   └── package.json
│   └── shared-types/
└── apps/
    ├── docs/              # Site e Documentação Oficial (Astro)
    └── playground/        # HTML estático para testes locais isolados
```

## 8. Escopo do MVP (Fast-Track v0.1)
O objetivo estrito do MVP é ter os seguintes itens codificados e funcionando no `apps/playground`:
1.  **Fundation & Tokens:** Reset limpo, paleta neutra e tipografia.
2.  **Layout Helpers:** Grid, Stack e Container responsive.
3.  **Motion System:** Presets utilitários de animação 3D de entrada (`fade-up`, `slide-in`, `reveal-3d`).
4.  **Premium Components:** 
    *   Cards cinematográficos (com hover glow).
    *   Feature Accordions (com o motor 0 JS).
5.  **Page Transitions:** Sistema de nomes de transição configurados.
6.  **Templates Base:** Duas ou três cenas prontas demonstrando o potencial completo (ex: Hero section com scroll e View Transition ativado).

---
**FIM DO DOCUMENTO DE CONTEXTO.**
*Instrução Final para a IA leitora:* Confirme que você leu e compreendeu a exclusão total do ecossistema React/JS-Frameworks antes de propor o primeiro comando ou código. Todas as respostas devem ser otimizadas para CSS Nativo e Web Platform de 2026.