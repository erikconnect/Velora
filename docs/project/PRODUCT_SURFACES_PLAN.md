# Product Surfaces Plan (Velora)

Plano curto para separar claramente Framework, Showcase e Docs.

## Objetivo

Garantir que:

- **Showcase** seja apenas demonstração e storytelling técnico do Velora.
- **Framework** seja um kit CSS canônico + starter mínimo para começar projetos.
- **Docs** combinem (a) pasta **`docs/`** (Markdown: contrato, governança, agentes) e (b) app **`apps/docs`** (Astro: guias publicados), ambos alinhados aos catálogos do showcase.

---

## Bloco 1 — Boundary e Governança (primeiro)

### 1.1 Responsabilidades por superfície

- `packages/css`
  - Produto principal do framework.
  - Única fonte de verdade de tokens, estruturas, motion e transições.
- `apps/showcase`
  - Site de demonstração.
  - Exemplos editoriais, catálogos vivos e páginas narrativas.
  - Não define API oficial; apenas consome e demonstra.
- `docs/` (raiz do monorepo, Markdown)
  - Fonte narrativa versionada: `project/CONTRACT.md`, playbooks, `WORKSPACE.md`, handbook de agentes.
- `apps/docs` (Astro)
  - Site de documentação navegável; não substitui o contrato em Markdown — espelha e explica o mesmo modelo.

### 1.2 Regra de decisão

Se houver conflito entre superfícies:

1. `packages/css` prevalece
2. `docs/project/CONTRACT.md` prevalece (texto do contrato)
3. catálogos (`api-motion-catalog`, `api-design-catalog`) refletem o contrato
4. `docs/project` e ficheiros relacionados explicam o contrato
5. showcase exemplifica o contrato

### 1.3 Definition of Done (boundary)

- Nenhuma página de showcase introduz atributo `vl-*` fora do contrato.
- Nenhuma página de docs define comportamento novo sem existir no core.
- Todo item oficial aparece no core + contrato + catálogo correspondente.

---

## Bloco 2 — Entrega de Produto Framework (kit + starter)

### 2.1 Kit CSS oficial

Consolidar entregável do framework como:

- `@velora/css` com camadas estáveis e ordem canônica.
- Guia de import mínimo e import avançado por camadas.

### 2.2 Starter oficial (HTML/CSS mínimo)

Criar starter de referência para “projeto do zero”:

- HTML base
- import do CSS Velora
- shell mínimo (header/main/footer)
- exemplo de seção com `vl-*` canônico
- exemplo de acessibilidade/reduced-motion

### 2.3 Definition of Done (framework)

- Starter sobe localmente sem dependência de JS para motion.
- `pnpm verify:contract` passa.
- Instrução de “quick start” em docs aponta para starter.

---

## Bloco 3 — Curadoria de Conteúdo (showcase + docs)

### 3.1 Showcase (curado para demo)

- Páginas contam histórias e demonstram recursos.
- Cada página evidencia contratos reais (não efeito solto).
- Evitar duplicar explicação formal de API em excesso (isso é docs).

### 3.2 Docs (fonte de aprendizado)

- **Markdown (`docs/`):** contrato, governança, agentes — sempre versionado com o código.
- **Astro (`apps/docs`):** guias e páginas navegáveis — mesma história, outro formato.
- Estrutura alvo (Astro + narrativa):
  - Introdução
  - Instalação / setup
  - Contrato de atributos
  - Catálogo de efeitos/valores
  - Recipes
  - Migração (deprecated aliases)
  - Troubleshooting

### 3.3 Definition of Done (conteúdo)

- Showcase responde “como fica na prática”.
- Docs responde “como usar corretamente”.
- Navegação entre docs e catálogos é bidirecional e clara.

---

## Sequência recomendada de execução

1. Boundary/gov (este documento + `docs/project/CONTRACT.md` + playbook)
2. Starter oficial do framework
3. Curadoria final dos catálogos
4. Curadoria do conteúdo Astro em `apps/docs` para refletir o contrato e os catálogos
5. Revisão final de consistência com `pnpm verify:contract`

---

## Métricas simples de sucesso

- `pnpm verify:contract` verde no CI
- 0 atributos deprecated em páginas de showcase/docs
- 100% dos stops da bussola com IDs válidos
- Starter funcional em menos de 5 minutos
