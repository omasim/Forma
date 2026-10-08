# FORMA

**A museum-grade, token-driven design system.** One stylesheet, an optional script, 126 accessible components and 59 themes. Every color in every theme is computed, then checked against WCAG at build time.

```html
<link rel="stylesheet" href="dist/forma.min.css">          <!-- 23 KB gzip -->
<script src="dist/forma.min.js" defer></script>            <!-- 18 KB gzip, optional -->
<link rel="stylesheet" href="dist/themes/swiss.css">       <!-- <1 KB gzip, optional -->
<html data-theme="swiss" data-mode="dark">
```

| | |
|---|---|
| Components | 101 core + 25 in six sector modules (health, finance, education, CRM, publishing, data) |
| Themes | 59. Each one is about ten parameters, and each is proven in light and dark (1,770 contrast checks) |
| Runtime dependencies | none |
| Browsers | Chrome/Edge 123+, Firefox 120+, Safari 17.5+ |
| Licence | MIT. Icons: Lucide (ISC). Fonts: OFL |

## Why v6 is different

- **One source.** Tokens (W3C DTCG JSON), theme parameters and component metadata generate everything: the CSS, the themes, the docs site, `llms.txt`, `forma-spec.json`, editor rules and the MCP server's data. The numbers on the website come from `dist/forma.manifest.json`, so they can't drift.
- **Contrast is proven.** `scripts/lib/palette.mjs` solves OKLCH lightness until:
  - primary text reaches ≥ 12:1, secondary text ≥ 6:1 and tertiary text ≥ 4.5:1 on every surface, including tinted badge and alert backgrounds;
  - accent, control borders and focus rings reach ≥ 3:1.
  
  The build fails if any check falls short.
- **Native first.** Overlays use `<dialog>` and the Popover API, accordions use `<details>`, and form controls are real inputs. The browser provides focus traps, Escape handling and the top layer.
- **Modern CSS.** `light-dark()` lets `data-mode` work on any subtree. Layers are ordered `reset, tokens, base, components, sectors, themes, utilities`, so your own CSS always wins. Logical properties make RTL work without extra CSS.
- **Accessible by test.** `npm test` loads every docs page and example in light and dark mode and runs axe (WCAG 2.2 AA). It reports zero serious or critical violations.
- **AI-native.** It ships `llms.txt`, `llms-full.txt`, `forma-spec.json`, `AGENTS.md`, Cursor and Copilot rules, a zero-dependency **MCP server** and **`forma lint`**, which checks HTML that agents write.

## Develop

```bash
npm install          # dev tools only: esbuild, lucide-static, fontsource, axe-core
npm run build        # → dist/, site/, llms*.txt, forma-spec.json, AGENTS.md
npm test             # contrast · lint · MCP · browser + axe (needs Playwright)
npm run preview      # serve site/
```

```
tokens/primitives.tokens.json   spacing, type, radius, motion… (DTCG)
themes/themes.json              59 themes as parameters
src/css/                        reset, base, utilities
src/components/<group>.css      component styles
src/components/<group>.meta.js  classes, examples, a11y, JS API, v5 migration  ← single source for docs & AI
src/sectors/                    six optional sector modules
src/js/                         ESM behaviour layer → dist/forma.js / forma.esm.js
scripts/                        build, palette solver, icons, site, AI files, tests
lib/                            color engine + linter (shipped, used by CLI & MCP)
mcp/server.mjs                  MCP server (stdio)
bin/forma.mjs                   CLI: lint · contrast · theme · mcp
site-src/                       docs-only CSS and example pages
```

## CLI

```bash
npx @nage/forma lint "src/**/*.html"            # unknown / v5 classes, missing names, unlabeled inputs
npx @nage/forma lint --css app.css "**/*.html"  # also accept your own classes
npx @nage/forma contrast "#4BD7C9" "#090806"    # 11.4:1  AA pass
npx @nage/forma theme cyberpunk                 # computed tokens
npx @nage/forma mcp                             # MCP server on stdio
```

## Migrating from v5

- `data-theme="dark|light"` is now `data-mode`. `data-theme` now names a visual theme.
- JS globals are now under `Forma.*`. `switchTab()` and the other tab helpers became automatic `data-forma="tabs"`. `FormaToast.show()` became `Forma.toast()`.
- Each renamed class is listed on its component's page and in `forma-spec.json → deprecated`. `forma lint` flags them and suggests the v6 replacement.

See `CHANGELOG.md` for the full list.
