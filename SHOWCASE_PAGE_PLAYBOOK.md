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
- `vl-bussola__cap`
- `vl-bussola__stop`
- `vl-bussola__label`
- `vl-bussola__dot`

Regras:

- Cada `href="#..."` da bussola deve apontar para um `id` real da página.
- Evite `#content` como stop da bussola quando houver seção específica.
- IDs devem ser `kebab-case` e estáveis (ex.: `about-hero`, `forms-validation`).

## 3) Contrato de motion (`vl-*`)

Antes de usar qualquer atributo `vl-*`, confirme no contrato:

- `CONTRACT.md`
- `apps/showcase/scripts/validate-showcase-contract.mjs`

Nunca usar aliases deprecados:

- `vl-type`
- `vl-delay`
- `vl-easing`
- `vl-transition`

## 4) Separação de responsabilidades

- **Comportamento:** atributos `vl-`*.
- **Aparência/estrutura:** classes CSS.
- Não simular API de motion só com classes.
- Não criar novo `vl-`* em página sem atualizar:
  1. `packages/css/src`
  2. `CONTRACT.md`
  3. catálogo correspondente
  4. validador de contrato

## 5) Catálogos oficiais (fonte viva)

- Motion: `apps/showcase/pages/motion/api-motion-catalog.html`
- Design: `apps/showcase/pages/components/api-design-catalog.html`

Tudo que for “oficial” precisa aparecer neles.

## 6) Checklist obrigatório antes de subir

Na raiz do repositório:

1. `pnpm verify:contract`
2. Conferir `apps/showcase/output/contract-checklist.md`
3. Validar visualmente a página alterada (âncoras da bussola + estados principais)

## 7) Fluxo recomendado para editar conteúdo

1. Ajuste conteúdo e estrutura da página.
2. Garanta IDs finais das seções.
3. Ajuste bussola para esses IDs.
4. Rode `pnpm verify:contract`.
5. Só então parta para refinos visuais finos.

## 8) Convenções para cenas narrativas

- Classe de cena: `showcase-cinema-scene--<pagina>-<ato>`
- 3 a 5 atos por página é o ideal para legibilidade.
- Cada ato deve expor pelo menos um detalhe concreto do contrato (não só visual).

---

Se este playbook conflitar com `CONTRACT.md`, o `CONTRACT.md` prevalece.