# Showcase Cinematic Scenes Design

## Objetivo

Transformar 6 páginas de referência do showcase em experiências full-canvas, onde cada `section` funciona como uma cena cinematográfica orquestrada que demonstra o framework em ação.

Páginas alvo:

- `apps/showcase/pages/core/landing.html`
- `apps/showcase/pages/color/design-tokens.html`
- `apps/showcase/pages/tools/system-modules.html`
- `apps/showcase/pages/tools/architecture.html`
- `apps/showcase/pages/tools/brand-voice.html`
- `apps/showcase/pages/tools/accessibility.html`

## Regra Central

As páginas deixam de ser apenas ports fiéis dos HTMLs-modelo e passam a ser versões cinematográficas desses mesmos modelos.

Isso significa:

- preservar a identidade estrutural principal de cada referência
- converter cada `section` em uma cena full-canvas
- demonstrar o framework operando visualmente em cada página
- usar motion e interpolação como prova de capacidade, não como decoração

## Shell Global

O `header` e o `footer` atuais continuam sendo preservados como shell global.

Porém, nessas 6 páginas:

- o `v1-scroll-progress` horizontal do topo deve ser desativado
- um novo indicador lateral de progressão deve ser introduzido
- esse indicador lateral deve se inspirar na linguagem de `apps/showcase/pages/scenes/scroll-reveal.html`
- a progressão lateral precisa reforçar a leitura de cena, estado e avanço da página

## Regra De Layout

- cada `section` deve ocupar largura total real da viewport
- o layout deve seguir o modelo de full-canvas total
- não deve haver sensação de container global envolvendo a página
- colunas de leitura, painéis, overlays e áreas técnicas entram como elementos de cena

## Regra De Cena

Cada cena deve ter uma função clara:

- introduzir
- tensionar
- demonstrar
- decompor
- concluir

Cada cena deve apresentar pelo menos:

- uma entrada orquestrada
- uma interpolação ligada ao scroll
- uma mudança de estado ou revelação visual

## Como Cada Página Deve Evoluir

### Landing

Virar uma sequência-manifesto:

- cena de abertura
- cena de profundidade/layering
- cena de motion e sistema
- cena editorial de posicionamento
- cena final de payoff

### Design Tokens

Virar uma demonstração material do sistema:

- cena de matéria base
- cena de swatches vivos
- cena tipográfica
- cena de easing/interpolação
- cena de layout primitives em ação

### System Modules

Virar uma sequência técnica orquestrada:

- cena hero de arquitetura modular
- cena bento principal
- cena de métricas
- cena de relação entre módulos
- cena de fechamento/CTA

### Architecture

Virar um blueprint cinematográfico:

- shell lateral técnico
- cena hero de fundação
- cena de tonal stack
- cena de atuadores
- cena de transições/view logic

### Brand Voice

Virar uma experiência editorial:

- shell lateral claro
- cena de manifesto da voz
- cena de traits
- cena de método aplicado
- cena de phrasing/prática
- cena final de direção editorial

### Accessibility

Virar uma prova operacional do sistema:

- shell lateral técnico
- cena hero de integridade
- cena de contraste
- cena de semântica
- cena de motion safety
- cena de foco/ARIA e fechamento

## O Que Não Deve Acontecer

- sections continuarem parecendo blocos em container central
- motion ornamental sem demonstrar capacidade do framework
- cenas repetirem o mesmo ritmo visual entre as 6 páginas
- a progressão lateral ser apenas decorativa
- a nova camada cinematográfica apagar totalmente a identidade dos HTMLs-modelo

## Critérios De Sucesso

- as 6 páginas passam a parecer experiências full-canvas
- cada página possui cenas com ritmo, progressão e payoff visual
- o framework aparece explicitamente em ação dentro do conteúdo
- o progresso lateral substitui com clareza o progresso antigo do topo
- a build do showcase continua passando
