# Velora Starter (HTML/CSS Minimal)

Starter oficial para iniciar projeto do zero com Velora usando apenas HTML + CSS.

## O que este starter cobre

- HTML base com shell mínimo
- import do framework via `@import "@velora/css";`
- exemplos canônicos com `vl-*`
- sem runtime JS para animações

## Como usar

1. Copie esta pasta para seu projeto.
2. Instale o pacote:

```bash
pnpm add @velora/css
```

3. Mantenha `@import "@velora/css";` no `styles.css`.
4. Abra `index.html` e comece a editar conteúdo/estrutura.

## Regras de contrato

- Use apenas atributos `vl-*` do `CONTRACT.md`.
- Não use aliases deprecados (`vl-type`, `vl-delay`, `vl-easing`, `vl-transition`).
- Para páginas com navegação de seções, use `nav.vl-bussola` com IDs reais.
