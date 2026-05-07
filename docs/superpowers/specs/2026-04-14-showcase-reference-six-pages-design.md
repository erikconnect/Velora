# Showcase Reference Six Pages Design

## Objetivo

Recriar o `main` de 6 páginas do showcase com fidelidade visual alta aos HTMLs de referência em `packages/pages`, preservando apenas o `header` e o `footer` já existentes no showcase.

As páginas alvo são:

- `apps/showcase/pages/core/landing.html`
- `apps/showcase/pages/color/design-tokens.html`
- `apps/showcase/pages/tools/system-modules.html`
- `apps/showcase/pages/tools/architecture.html`
- `apps/showcase/pages/tools/brand-voice.html`
- `apps/showcase/pages/tools/accessibility.html`

## Regra Central

O conteúdo dessas páginas deve deixar de ser uma interpretação inspirada nas referências e passar a ser uma transposição estrutural de alta fidelidade dos HTMLs-modelo correspondentes.

O showcase continua responsável apenas por:

- manter o `header` atual
- manter o `footer` atual
- adaptar links e caminhos para rotas reais do showcase
- adaptar assets e pequenos detalhes necessários para funcionamento real
- preservar acessibilidade e comportamento responsivo mínimo aceitável

## Mapeamento De Referência

- `pages/core/landing.html` <- `packages/pages/velora_landing_page_refined.html`
- `pages/color/design-tokens.html` <- `packages/pages/tokens_foundation_refined.html`
- `pages/tools/system-modules.html` <- `packages/pages/system_modules_overview.html`
- `pages/tools/architecture.html` <- `packages/pages/architectural_blueprint.html`
- `pages/tools/brand-voice.html` <- `packages/pages/brand_voice_editorial_strategy.html`
- `pages/tools/accessibility.html` <- `packages/pages/accessibility_wcag_guidelines.html`

## O Que Deve Ser Preservado

- ordem das seções do HTML-modelo
- hierarquia visual principal
- composição macro de cada bloco
- ritmo de espaçamento entre seções
- relação entre títulos, subtítulos, corpos e elementos auxiliares
- presença visual dos blocos gráficos e decorativos que definem a identidade da página

## O Que Pode Ser Adaptado

- `href` para apontar para páginas reais do showcase
- `src` e caminhos de assets quando necessário
- atributos do framework Velora quando ajudarem na integração sem alterar a composição
- pequenos ajustes semânticos para acessibilidade
- pequenos ajustes de responsividade quando o HTML-modelo não encaixar corretamente no shell atual

## O Que Não Deve Acontecer

- transformar as páginas em variações de um mesmo template compartilhado
- simplificar a composição dos modelos para caber na base atual
- substituir blocos característicos do modelo por cards genéricos do showcase
- reescrever o conteúdo com liberdade criativa excessiva
- usar motion que mude a leitura do layout original

## Estratégia De Implementação

Cada página será tratada individualmente.

Para cada uma:

1. ler o HTML-modelo correspondente
2. identificar a estrutura principal do `body/main`
3. portar essa estrutura para dentro do `main` da página do showcase
4. manter apenas `header` e `footer` existentes
5. adaptar links, assets e detalhes funcionais
6. usar CSS compartilhado apenas onde não comprometer a fidelidade do modelo
7. criar CSS específico por página quando a base compartilhada não for suficiente

## Critérios De Sucesso

- as 6 páginas ficam visualmente muito mais próximas dos HTMLs-modelo do que estão hoje
- cada página passa a ter assinatura própria real
- o shell global do showcase continua intacto
- links e navegação fazem sentido dentro do ecossistema real do projeto
- a build do showcase continua passando

## Fora De Escopo

- refatoração ampla do restante do showcase
- unificação completa entre `packages/css/src` e `apps/showcase/public/css`
- revisão das outras páginas fora dessas 6 referências
- migração da Library para `apps/docs`
