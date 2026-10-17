# Changelog

## 6.0.1 — October 2026

Everything found in the post-release review, fixed.

### Accessibility
- **Windows High Contrast (forced colors):** switches, checkboxes, radios, progress bars and sliders are redrawn with system colors; selected tabs, menu items and current nav links get a Highlight outline. Before, a switch's on/off state was invisible in this mode.
- **Right-to-left:** code, `kbd`, menu shortcuts and mono badges stay left-to-right inside RTL text (`.menu` no longer reads "menu."); large switches and range fills mirror.
- Popovers and menus were placed up to 2% off their invoker because the size was measured mid-animation; they now line up exactly in both directions.
- Settings rows put the description under the label instead of running them together.

### Compatibility
- Browsers without `light-dark()` (before Chrome 123, Firefox 120, Safari 17.5) get plain light/dark values from an `@supports` fallback instead of losing every color.

### New
- **TypeScript types** for the whole `Forma.*` API and every `forma:*` event (`types/forma.d.ts`).
- **React bindings** (`@nage/forma/react`): `FormaProvider`, `useFormaTheme`, `useFormaEvent`, `Chart`, `Icon`, `useDialog`. React is an optional peer dependency.
- **`forma lint --fix`** rewrites v5 classes with a one-to-one v6 replacement and lists the rest. The v5→v6 map no longer contains HTML tag names or broken shorthand entries.
- **`forma tokens <dtcg|swift|kotlin|json> [theme]`** exports any theme for Figma (W3C DTCG, one file per mode), SwiftUI, Jetpack Compose or plain JSON. Museum is prebuilt in `dist/tokens/`.
- **`forma fonts <theme…>`** self-hosts a theme's fonts from Fontsource and writes a stylesheet without the Google Fonts import.

### Quality
- Test suite now also covers keyboard patterns (tabs, menu, combobox, tree, date picker, kanban, dialog), RTL, forced colors, the `light-dark()` fallback, the React bindings, lint `--fix` and token exports.
- Visual regression: `npm run test:visual` compares every theme × mode with baselines in `tests/visual/`.
- Continuous integration on GitHub Actions; npm releases are published from GitHub Releases with provenance.
- The build is reproducible (no build timestamp), and CI fails if committed `dist/` or `site/` is out of date.
- `package.json` now states the real counts and repository.
- esbuild 0.25 (dev only).

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
