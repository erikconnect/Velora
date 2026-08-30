# Showcase Page Playbook

Guia rápido para criar/editar páginas sem quebrar contrato no Velora.

## 1) Estrutura mínima obrigatória

- `body` deve usar `showcase-page-shell`.
- Incluir `Skip to content` com `href="#content"`.
- Header canônico `vl-header` + controles padrão.
- Footer canônico (não inventar variantes sem CSS correspondente).

## 2) Navegação de seção (bussola)

Use sempre a estrutura canônica:

- `nav.showcase-cinema-rail.vl-bussola`
- `data-velora-signature="bussola"`
- `vl-bussola__cap`
- `vl-bussola__stop`
- `vl-bussola__label`
- `vl-bussola__dot`

Regras:

- Cada `href="#..."` da bussola deve apontar para um `id` real da página.
- A assinatura visível é sempre `✦ velora`; apenas os stops mudam por página.
- Use de 1 a 6 stops por página.
- Evite `#content` como stop da bussola quando houver seção específica.
- IDs devem ser `kebab-case` e estáveis (ex.: `about-hero`, `forms-validation`).
- Seções com **pin+scrub** (`vl-scene` + `vl-timeline="view"` + `vl-pin`) devem declarar `view-timeline-name: --vl-scene, --tl-N` — só `--tl-N` (bussola) apaga o relógio do scene engine e as acts ficam estáticas.
- Evite `overflow-x: clip` no ancestral do `[vl-stage]` sticky (quebra o pin).
- Classes de layout no stage (ex. `.scene-tl-stage`) **não podem** setar `position: relative|absolute|fixed` — isso sobrescreve o sticky do `[vl-stage]` (CSS unlayered > `@layer velora.*`).

## 3) Contrato de motion (`vl-*`)

Antes de usar qualquer atributo `vl-*`, confirme no contrato:

- `docs/project/CONTRACT.md`
- `apps/showcase/scripts/validate-showcase-contract.mjs`

Nunca usar aliases deprecados:

- `vl-type` → `vl-timeline` + canais
- `vl-easing` → tokens / contrato do efeito
- `vl-transition` → `vl-page-transition` + classes VT compartilhadas

`vl-delay` é **estável** (atraso por elemento). Para coleções, preferir `vl-children` + `vl-stagger`.

## 4) Motion authorship (relógio + choreography)

Toda seção narrativa escolhe **um** modelo de tempo. Páginas de ensino (ex.: Core) podem ser **híbridas**: gate nas listas de leitura, scrub só nos demos de progresso.

### 4.1 Escolher o relógio

| Intent | Markup | Comportamento |
|---|---|---|
| Abertura / hero no load | `vl-enter` (sem gate; timeline `auto` implícita) | Toca no tempo ao carregar |
| Reveal de leitura (entra e termina) | wrapper `vl-in-view` + filhos `vl-enter` | Gate temporal; **sai do range → reset → re-entry replay** (stagger incluso) |
| Progresso ligado ao scroll | `vl-timeline="view"` e/ou `vl-scroll` + `vl-range` | Scrub; sem `vl-once` rebobina com o scroll |
| Reveal one-shot no scroll | `vl-timeline="view"` + `vl-once` | Entra na faixa e segura o estado final |
| Coreografia pin + atos | `vl-scene` + `vl-timeline="view"` + `vl-pin` + `vl-scrub` + `vl-stage` + `vl-act`/`vl-span` | Um relógio compartilhado (`--vl-scene`) |

Regra prática:

1. Texto/cards de seção que devem “chegar” → **`vl-in-view`**
2. Demo que ensina progresso/range → **`vl-timeline="view"` / `vl-scroll`**
3. História pinada com beats → **scene engine**
4. Não misturar (2) e (1) no mesmo elemento; no mesmo *ato* da página, ok lado a lado

### 4.2 Choreography de filhos

- `vl-children="stagger" | cascade | sequence | orchestrate` no **pai direto** dos itens.
- `vl-stagger` só com valores tokenizados do engine (`60ms`, `80ms`, `100ms`, `120ms`, …). Valores fora da lista caem no default (`--vl-stagger-step`).
- Filhos com canal próprio (`vl-enter`, etc.) usam o delay do pai; não precisam de `vl-timeline="view"` se o pai já é `vl-in-view`.
- **`sibling-index()`** (progressive): com suporte do browser, delays usam `calc((sibling-index() - 1) * var(--vl-stagger-step))` sem teto de 12. Sem suporte → fallback `:nth-child(1…12)`.
- Em scenes, omitir `vl-act` → default por DOM / `sibling-index()` no stage.

### 4.3 Anti-padrões

- Não aninhar `vl-in-view` dentro de `[vl-scene][vl-timeline="view"] [vl-stage]`.
- Não colocar `vl-timeline="view"` em todo card de leitura “só para animar” — isso scrubba; use gate.
- Não inventar `vl-range="entry 10% cover 45%"` como string livre: use presets (`entry`, `entry-short`, …) ou `vl-range="custom"` + `--vl-range`.
- Não editar motion em `apps/showcase/public/css/` — fonte é `packages/css/src/` + `pnpm sync:showcase-css`.
- Não criar `vl-*` novo só na página (ver §5).

### 4.4 Snippets mínimos

**Gate + stagger (leitura):**

```html
<div vl-in-view vl-children="stagger" vl-stagger="100ms">
  <article vl-enter="fade-up">…</article>
  <article vl-enter="fade-up">…</article>
  <article vl-enter="fade-up">…</article>
</div>
```

**Scrub demo (progresso):**

```html
<div vl-scroll="depth-drift" vl-range="cover">…</div>
<!-- ou -->
<article vl-enter="fade-up" vl-timeline="view" vl-range="entry-short">…</article>
```

**Scene (pin + acts):**

```html
<section vl-scene vl-timeline="view" vl-pin="3" vl-scrub>
  <div vl-stage>
    <h2 vl-enter="clip-rise" vl-act="1">…</h2>
    <p vl-enter="fade-up" vl-act="2">…</p>
  </div>
</section>
```

Referência viva: `apps/showcase/pages/core/core.html` (**Core opera** — cenas pin+stage+acts com componentes densos; não usar o desk minimal).

## 5) Separação de responsabilidades

- **Comportamento:** atributos `vl-*`.
- **Aparência/estrutura:** classes CSS.
- Não simular API de motion só com classes.
- Não criar novo `vl-*` em página sem atualizar:
  1. `packages/css/src`
  2. `docs/project/CONTRACT.md`
  3. catálogo correspondente
  4. validador de contrato

## 6) Catálogos oficiais (fonte viva)

- Motion: `apps/showcase/pages/motion/api-motion-catalog.html`
- Components and native UI: `apps/showcase/pages/core/elements.html`
- Coverage manifest: `apps/showcase/config/showcase-coverage.mjs`

Tudo que for “oficial” precisa aparecer neles.

## 7) Checklist obrigatório antes de subir

Na raiz do repositório:

1. `pnpm sync:showcase-css` (se tocou `packages/css/src`)
2. `pnpm verify:contract`
3. Conferir `apps/showcase/output/contract-checklist.md`
4. Validar visualmente: bussola, gate replay (sair/voltar), demos de scrub, reduced motion

## 8) Fluxo recomendado para editar conteúdo

1. Ajuste conteúdo e estrutura da página.
2. Escolha o relógio por seção (§4.1); marque demos vs leitura.
3. Garanta IDs finais das seções e a bussola.
4. Rode `pnpm --filter showcase sync:shell` para Header/Footer canônicos.
5. Rode `pnpm verify:contract`.
6. Só então parta para refinos visuais finos.

## 9) Convenções para cenas narrativas

- Classe de cena Showcase: `showcase-cinema-scene--<pagina>-<ato>` (look da referência UI).
- Engine host-agnostic: `vl-scene` + `vl-stage` + acts (§4.4) — não depende de classes de look.
- 3 a 5 atos por página é o ideal para legibilidade.
- Cada ato deve expor pelo menos um detalhe concreto do contrato (não só visual).

---

Se este playbook conflitar com `docs/project/CONTRACT.md`, o contrato em `docs/project/CONTRACT.md` prevalece.
