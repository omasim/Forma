# Changelog

## 6.0.0 — October 2026

A ground-up rewrite. Same museum voice; new engine.

### Engine
- Tokens in **W3C DTCG** JSON; every artifact (CSS, themes, docs, llms.txt, spec, MCP data) is generated from one source.
- Colors are **computed** from OKLCH parameters per theme and **proven against WCAG 2.2 AA** at build time (text ≥ 4.5:1, primary ≥ 12:1, controls and focus ≥ 3:1). The build fails otherwise.
- One `light-dark()` value per color token: `data-mode` works on any subtree; themes can be scoped to a section.
- `@layer` architecture — your unlayered CSS always wins.
- Logical properties throughout; RTL works without extra CSS.
- Default theme fonts self-hosted (latin + latin-ext); fixed relative font paths.

### Components
- 101 core + 25 sector components, all with metadata, examples, accessibility notes and migration notes.
- Native first: `<dialog>` (dialog, drawer, sheet, command palette, confirm), Popover API (popover, menu, mega menu, tooltip), `<details>` (accordion, facets), real checkbox/radio/switch.
- New: combobox, OTP, segmented control, number stepper, tree view, description list, calendar, citations, tool call, composer, footer, bottom navigation.
- One `:focus-visible` rule that components never override.

### Themes
- 59 themes, each ~10 parameters. Fixed renamed Google fonts (Source Sans 3, Source Serif 4, Fredoka); licensed fonts replaced (Didot → Bodoni Moda, SF Pro → Inter).
- Dark-native themes (Terminal, Cyberpunk, Synthwave…) default to dark unless `data-mode` says otherwise.

### JavaScript
- ESM + IIFE builds, ~52 KB min, zero dependencies. Auto-init via `data-forma` with a MutationObserver.
- WAI-ARIA patterns: tabs, menu, combobox, tree, grid date picker, toolbar; kanban keyboard moves.
- No user text is inserted as HTML. `localStorage` access is guarded.
- Validation uses the browser constraint API with English and Turkish messages.
- Accessible SVG charts with hover/keyboard tooltips, legends, direct labels and hidden data tables; CVD-validated categorical palette.

### AI
- `llms.txt`, `llms-full.txt`, `forma-spec.json`, `AGENTS.md`, Cursor `.mdc` rules and Copilot instructions — all generated.
- Real, zero-dependency **MCP server** (`npx @nage/forma mcp`) and **`forma lint`** for agent-written HTML.

### Breaking changes from v5
- `data-theme="dark|light"` → `data-mode`. `data-theme` now names a visual theme.
- JS globals (`switchTab`, `toggleTheme`, `FormaToast`, …) → `Forma.*`.
- Renamed classes are listed per component in the docs; `forma lint` flags them.

## 5.1 — March 2026
- 72 components, 55 themes, 6 sector modules, AI chat components.

## 5.0 — March 2026
- Modular CSS/JS framework; GSAP replaced by IntersectionObserver.

## 4.7 — March 2026
- Original single-file design system.
