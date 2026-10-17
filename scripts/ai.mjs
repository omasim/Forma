// AI-facing files, generated from component metadata so they can never drift from the CSS.
import fs from 'node:fs';
import path from 'node:path';
import { primitiveTokens } from './build.mjs';
import { buildPalette } from './lib/palette.mjs';
import { TOOLS } from '../mcp/server.mjs';

const write = (f, c) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c); };
const kb = (s) => Math.round(Buffer.byteLength(s) / 102.4) / 10;

/** Every class selector that exists in the compiled CSS. */
export function cssClasses(css) {
  const out = new Set();
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\([^)]*\)/g, '').matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) if (!/^\d/.test(m[1])) out.add(m[1]);
  return [...out].sort();
}

export const RULES = (V, manifest) => `# FORMA v${V} — rules for writing markup

FORMA is a CSS design system with an optional JS behaviour layer. Follow these rules when generating UI.

1. **Use only FORMA classes that exist.** Look them up (llms-full.txt, forma-spec.json, or the MCP tool \`get_component\`). Never invent classes such as \`btn-blue\` or \`card-shadow\`.
2. **Never hard-code colors, fonts, radii or spacing.** Use tokens: \`var(--accent)\`, \`var(--text-secondary)\`, \`var(--space-4)\`, \`var(--radius-lg)\`.
3. **Native elements first.** Modals are \`<dialog class="dialog">\` opened with \`data-forma-open="id"\`; menus and popovers use the \`popover\` attribute + \`popovertarget\`; accordions are \`<details class="disclosure">\`; checkboxes are \`<input type="checkbox" class="checkbox">\`.
4. **State lives in ARIA attributes, not classes:** \`aria-selected\`, \`aria-pressed\`, \`aria-current="page"\`, \`aria-invalid="true"\`, \`aria-expanded\`. Tabs need \`role="tablist"/"tab"/"tabpanel"\` and \`data-forma="tabs"\` on the wrapper.
5. **Every control needs a name:** \`<label for>\` for inputs; \`aria-label\` for icon-only buttons; \`alt\` for images.
6. **Icons:** \`<svg class="fi" aria-hidden="true"><use href="forma-icons.svg#fi-NAME"/></svg>\`.
7. **Modes and themes:** \`data-mode="light|dark"\` (omit to follow the OS) and \`data-theme="<id>"\` after loading \`themes/<id>.css\`. Never use \`data-theme="dark"\` — that was v5.
8. **Layout:** \`.container\`, \`.stack\`, \`.cluster\`, \`.split\`, \`.grid\` (\`--min\`), \`.grid-2/3/4\`, \`.dash\` + \`.span-N\`; gaps via \`.gap-N\` or \`--gap\`.
9. **Charts:** \`<figure class="chart" data-forma="chart" data-type="line|area|bar|donut" data-labels="…" data-series='[{"name":"A","values":[…]}]'>\` with a \`.chart-canvas\` child. Never two y-axes.
10. **Validate before you finish:** run \`npx @nage/forma lint file.html\` (add \`--fix\` to upgrade v5 classes) or the MCP tool \`validate_html\`.
11. **React:** prefer plain markup with \`data-forma\`; use \`@nage/forma/react\` (\`FormaProvider\`, \`Chart\`, \`Icon\`, \`useFormaEvent\`) for theme/mode, charts and events.

Components: ${manifest.counts.components + manifest.counts.sectorComponents} · Themes: ${manifest.counts.themes} · Docs: https://forma-design-five.vercel.app/llms-full.txt
`;

export async function buildAiFiles({ ROOT, SITE, manifest, components, sectorMeta, themes }) {
  const V = manifest.version;
  const all = [...components, ...sectorMeta];
  const css = fs.readFileSync(path.join(ROOT, 'dist/forma.all.css'), 'utf8') + fs.readFileSync(path.join(ROOT, 'dist/forma-themes.css'), 'utf8');
  const classes = cssClasses(css);
  const known = new Set(classes);

  // v5 → v6 map, derived from each component's migration notes.
  const deprecated = {};
  const NOT_CLASSES = new Set(['is', 'on', 'demo', 'static', 'standalone', 'span', 'div', 'label', 'input', 'button', 'select', 'dialog', 'details', 'summary', 'ul', 'li', 'nav', 'table', 'tr', 'td', 'th', 'img', 'svg', 'form', 'and', 'or', 'with', 'the']);
  for (const c of all) for (const [old, now] of Object.entries(c.v5 || {})) {
    const olds = old.replace(/\([^)]*\)/g, ' ').split(' / '), nows = now.split(' / ');
    // "empty-state-icon / -title / -text" → the shorthand parts share the first part's stem
    const stem = nows[0].replace(/-[a-z0-9]+$/, '');
    const full = nows.map((n) => (n.startsWith('-') ? stem + n : n));
    olds.forEach((part, i) => {
      const target = olds.length === full.length ? full[i] : now;
      for (const tok of part.split(/[\s.(),+]+/)) if (/^[a-z][a-z0-9-]+$/.test(tok) && !known.has(tok) && !NOT_CLASSES.has(tok)) deprecated[tok] ||= target;
    });
  }
  Object.assign(deprecated, { 'kpi-card': 'kpi', 'kpi-trend': 'metric-delta', 'kpi-up': 'metric-delta[data-trend=up]', 'cselect': 'combobox', 'sw': 'switch', 'picon': 'avatar avatar-square', 'data-table': 'table', 'tab-item': 'tab', 'page-btn': 'page-link', 'modal-wrap': 'dialog.dialog', 'h-bar-list': 'hbars' });
  for (const k of Object.keys(deprecated)) if (known.has(k)) delete deprecated[k];

  const tokens = primitiveTokens().map((t) => ({ name: `--${t.name}`, type: t.type, value: Array.isArray(t.value) ? `cubic-bezier(${t.value.join(', ')})` : t.value, ...(t.description ? { description: t.description } : {}) }));
  const spec = {
    $schema: 'https://forma-design-five.vercel.app/forma-spec.schema.json',
    name: 'FORMA', version: V, license: 'MIT', released: manifest.released,
    browsers: manifest.browsers,
    install: { css: 'dist/forma.min.css', js: 'dist/forma.min.js', esm: 'dist/forma.esm.js', themes: 'dist/themes/<id>.css', sectors: 'dist/sectors/forma-<sector>.css', icons: 'dist/forma-icons.svg', cdn: `https://cdn.jsdelivr.net/npm/@nage/forma@${V}/dist/` },
    layers: ['forma.reset', 'forma.tokens', 'forma.base', 'forma.components', 'forma.sectors', 'forma.themes', 'forma.utilities'],
    modes: { attribute: 'data-mode', values: ['light', 'dark'], default: 'follows prefers-color-scheme' },
    counts: manifest.counts,
    components: all.map(({ group, ...c }) => c),
    themes: themes.map((t) => { const p = buildPalette(t.palette || {}); return { id: t.id, name: t.name, category: t.category, description: t.description, default: !!t.default, mode: t.mode || null, fonts: Object.fromEntries(Object.entries(t.fonts || {}).map(([k, f]) => [k, typeof f === 'string' ? f : f.family.replace(' Variable', '')])), shape: { radiusScale: Number(t.shape?.radius ?? 1), borderWidth: t.shape?.borderWidth || '1px' }, colors: { light: p.light.tokens, dark: p.dark.tokens } }; }),
    tokens,
    classes,
    deprecated,
    icons: JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/forma-icons.json'), 'utf8')),
  };
  const specJson = JSON.stringify(spec, null, 1);

  const llms = `# FORMA

> A museum-grade, token-driven CSS design system. ${all.length} accessible components, ${themes.length} themes whose every color is computed and proven against WCAG AA in light and dark, an optional dependency-free JS layer, and machine-readable docs. MIT. v${V}.

FORMA is plain HTML + classes. Link \`forma.min.css\` (and optionally \`forma.min.js\`). Mode: \`data-mode="light|dark"\`. Theme: \`data-theme="<id>"\` + \`themes/<id>.css\`. Colors, spacing, type come from CSS custom properties — never hard-code them.

## Docs
- [Complete reference](https://forma-design-five.vercel.app/llms-full.txt): every component with classes, example HTML, accessibility rules and JS API
- [Machine-readable spec](https://forma-design-five.vercel.app/forma-spec.json): components, themes (computed colors), tokens, all valid classes, v5→v6 map
- [Rules for agents](https://forma-design-five.vercel.app/AGENTS.md): ten rules for generating valid FORMA markup
- [Getting started](https://forma-design-five.vercel.app/docs/): install, tokens, layers, browser support, migration

## Files
- [forma.min.css](https://forma-design-five.vercel.app/dist/forma.min.css): core, ${manifest.sizes['forma.min.css']} KB
- [forma.min.js](https://forma-design-five.vercel.app/dist/forma.min.js): optional behaviour, ${manifest.sizes['forma.min.js']} KB
- [forma-icons.svg](https://forma-design-five.vercel.app/dist/forma-icons.svg): ${manifest.counts.icons} icons, use as \`#fi-<name>\`
- [forma.manifest.json](https://forma-design-five.vercel.app/dist/forma.manifest.json): version, counts, sizes, contrast results

## Components
${[...new Set(all.map((c) => c.category))].map((cat) => `- ${cat}: ${all.filter((c) => c.category === cat).map((c) => `${c.name} (.${c.classes.base})`).join(', ')}`).join('\n')}

## Themes
${themes.map((t) => t.id).join(', ')}

## Optional
- [MCP server](https://forma-design-five.vercel.app/ai.html): \`npx -y @nage/forma mcp\` — get_component, get_theme, validate_html, …
`;

  const fmtClasses = (cls) => Object.entries(cls).filter(([, v]) => v && (!Array.isArray(v) || v.length)).map(([k, v]) => `- ${k}: ${(Array.isArray(v) ? v : [v]).map((x) => (x.includes('=') || x.startsWith('data-') || x.startsWith('aria-') || x.startsWith('--') ? `\`${x}\`` : `\`.${x}\``)).join(' ')}`).join('\n');
  const full = `# FORMA v${V} — complete reference

> Generated from the same source as the CSS. ${all.length} components · ${themes.length} themes · ${manifest.contrast.checks} contrast checks (all pass).

${RULES(V, manifest).split('\n').slice(2).join('\n')}

## Install
\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nage/forma@${V}/dist/forma.min.css">
<script src="https://cdn.jsdelivr.net/npm/@nage/forma@${V}/dist/forma.min.js" defer></script>
<!-- optional theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nage/forma@${V}/dist/themes/swiss.css">
<html data-theme="swiss" data-mode="dark">
\`\`\`

## Tokens
Color tokens (each is one \`light-dark()\` value, recomputed per theme): ${Object.keys(spec.themes[0].colors.dark).map((n) => `\`--${n}\``).join(', ')}.
Derived: \`--border-faint|default|muted|strong\`, \`--accent-muted\`, \`--accent-subtle\`, \`--{error,success,warning,info}-muted\`, \`--{…}-border\`, \`--shadow-xs…xl\`, \`--focus-ring\`.
Use \`--accent\` for fills/indicators and \`--accent-text\` for accent-colored text; \`--accent-contrast\` is text on an accent fill.

${tokens.map((t) => `- \`${t.name}\`: ${t.value}`).join('\n')}

## Typography helpers
\`.t-display-xl|lg|md|sm\` (display serif), \`.t-heading\`, \`.t-subheading\`, \`.t-body\`, \`.t-body-sm\`, \`.t-label\`, \`.t-caption\`, \`.t-meta\`, \`.t-mono\`, colors \`.t-primary|secondary|tertiary|accent|error|success|warning|info\`, \`.t-num\`, \`.t-truncate\`, \`.t-clamp-2|3\`.

## JavaScript (optional)
Auto-initialises \`[data-forma]\` elements (also ones added later). Global \`Forma\` (IIFE) or \`import * as Forma from '@nage/forma'\`.
- \`Forma.mode.set('light'|'dark'|'system')\`, \`Forma.mode.toggle()\` · \`Forma.theme.set(id)\`
- \`Forma.dialog.open(id)\`, \`Forma.dialog.close(id, value)\`, \`Forma.confirm({ title, text, danger })\` → Promise<boolean>
- \`Forma.toast({ type, title, text, duration, action })\`, \`Forma.toast.success(title, text)\`
- \`Forma.chart(el, { type, labels, series, format })\`, \`Forma.tabs(el)\`, \`Forma.combobox(el)\`, \`Forma.datepicker(el)\`, \`Forma.wizard(el)\`, \`Forma.validate(form)\`, \`Forma.chat(el)\`
- Events bubble as \`forma:<name>\` (forma:change, forma:tab, forma:select, forma:mode, forma:theme…)

---

${all.map((c) => `## ${c.name}  ·  ${c.category}
${c.description}

${fmtClasses(c.classes)}${c.attributes ? `\n- attributes: ${c.attributes.map((a) => `\`${a}\``).join(' ')}` : ''}
${c.sector ? `\nRequires \`sectors/forma-${c.sector}.css\`.\n` : ''}
\`\`\`html
${(c.examples?.[0]?.html || '').replace(/href="#fi-/g, 'href="forma-icons.svg#fi-')}
\`\`\`
${c.a11y ? `\nAccessibility:\n${c.a11y.map((a) => `- ${a}`).join('\n')}\n` : ''}${c.js ? `\nJS: ${[c.js.auto && `auto \`${c.js.auto}\``, c.js.api && `API \`${c.js.api}\``, c.js.events && `events ${c.js.events.map((e) => `\`${e}\``).join(' ')}`].filter(Boolean).join(' · ')}\n` : ''}${c.v5 ? `\nFrom v5: ${Object.entries(c.v5).map(([a, b]) => `\`${a}\` → \`${b}\``).join('; ')}\n` : ''}`).join('\n---\n\n')}
---

## Themes
| id | name | category | display / ui fonts |
|---|---|---|---|
${spec.themes.map((t) => `| ${t.id} | ${t.name} | ${t.category} | ${t.fonts.display} / ${t.fonts.ui} |`).join('\n')}
`;

  const rules = RULES(V, manifest);
  const mdc = `---\ndescription: FORMA design system — use for any HTML/CSS UI work in this project\nglobs: ["**/*.html", "**/*.jsx", "**/*.tsx", "**/*.vue", "**/*.svelte", "**/*.astro"]\nalwaysApply: false\n---\n\n${rules}`;

  const out = [
    ['llms.txt', llms, 'LLM index (llmstxt.org)'],
    ['llms-full.txt', full, 'Complete reference for context windows'],
    ['forma-spec.json', specJson, 'Tools, validators, codegen'],
    ['AGENTS.md', rules, 'Coding agents (Claude Code, Codex, …)'],
    ['.cursor/rules/forma.mdc', mdc, 'Cursor project rules'],
    ['.github/copilot-instructions.md', rules, 'GitHub Copilot'],
  ];
  for (const [name, content] of out) { write(path.join(ROOT, name), content); write(path.join(SITE, name), content); }
  // Text mirrors so editor-rule files are viewable on the site.
  write(path.join(SITE, 'rules/forma.mdc.txt'), mdc);
  // Native token exports for the default theme (any theme: `forma tokens <format> <theme>`).
  const { exportTheme, FORMATS } = await import('../lib/tokens.mjs');
  for (const f of FORMATS) for (const { file, content } of exportTheme(spec, 'museum', f)) { write(path.join(ROOT, 'dist/tokens', file), content); write(path.join(SITE, 'dist/tokens', file), content); }
  return {
    tools: TOOLS,
    files: out.map(([name, content, forWhat]) => ({ name, for: forWhat, kb: kb(content), href: name.startsWith('.') ? (name.endsWith('.mdc') ? 'rules/forma.mdc.txt' : 'AGENTS.md') : name })),
  };
}
