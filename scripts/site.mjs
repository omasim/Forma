// Generates the documentation site (site/) and AI files from the same metadata as dist/.
import fs from 'node:fs';
import path from 'node:path';
import { primitiveTokens, themeDeclarations } from './build.mjs';
import { buildPalette } from './lib/palette.mjs';
import { buildAiFiles } from './ai.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const write = (f, c) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c); };
const icon = (root, name, cls = '') => `<svg class="fi ${cls}" aria-hidden="true"><use href="${root}dist/forma-icons.svg#fi-${name}"/></svg>`;
const live = (html, root) => html.replace(/href="#fi-/g, `href="${root}dist/forma-icons.svg#fi-`);
const codeOf = (html) => esc(html.replace(/href="#fi-/g, 'href="forma-icons.svg#fi-'));

export async function buildSite({ ROOT, manifest, components, sectorMeta, themes, report }) {
  const SITE = path.join(ROOT, 'site');
  fs.rmSync(SITE, { recursive: true, force: true });
  fs.cpSync(path.join(ROOT, 'dist'), path.join(SITE, 'dist'), { recursive: true });
  fs.mkdirSync(path.join(SITE, 'assets'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'site-src/site.css'), path.join(SITE, 'assets/site.css'));
  const V = manifest.version;
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const all = [...components, ...sectorMeta];
  const categories = [...new Set(all.map((c) => c.category))];
  const byCat = (cat) => all.filter((c) => c.category === cat);
  const minRatio = (id) => Math.min(...report.filter((r) => r.theme === id && r.target === 4.5).map((r) => r.ratio));

  /* ── Layout ─────────────────────────────────────────────────────────── */
  const navLinks = [['Docs', 'docs/'], ['Components', 'components/'], ['Themes', 'themes.html'], ['Examples', 'examples/'], ['AI', 'ai.html']];
  const themeOptions = themes.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join('');
  const commandItems = (root) => [
    ...navLinks.map(([n, h]) => `<a class="command-item" role="option" href="${root}${h}"><span class="command-item-icon">${icon(root, 'arrow-right')}</span><span>${n}</span></a>`),
    ...all.map((c) => `<a class="command-item" role="option" href="${root}components/${c.id}.html"><span class="command-item-icon">${icon(root, 'box')}</span><span>${esc(c.name)} <span class="command-item-desc">${esc(c.category)}</span></span></a>`),
  ].join('');
  const header = (root, active) => `<a class="skip-link" href="#main">Skip to content</a>
<nav class="navbar navbar-sticky" aria-label="Main">
  <a class="navbar-brand" href="${root}index.html"><span>Forma</span><span class="badge badge-mono">v${V}</span></a>
  <ul class="navbar-nav navbar-collapse">${navLinks.map(([n, h]) => `<li><a class="navbar-link" href="${root}${h}"${active === n ? ' aria-current="page"' : ''}>${n}</a></li>`).join('')}</ul>
  <div class="navbar-end">
    <button class="btn btn-sm btn-ghost" data-forma-open="cmdk" aria-label="Search">${icon(root, 'search')}<kbd class="kbd">⌘K</kbd></button>
    <label class="sr-only" for="theme-pick">Theme</label>
    <select class="select select-sm" id="theme-pick" style="inline-size:auto" data-theme-picker>${themeOptions}</select>
    <button class="btn btn-icon btn-sm btn-ghost" data-forma="mode-toggle" aria-label="Dark mode">${icon(root, 'sun-moon')}</button>
  </div>
</nav>
<dialog class="dialog command" id="cmdk" data-forma="command" data-hotkey="mod+k" aria-label="Search the docs"><div class="dialog-body">
  <div class="command-input">${icon(root, 'search', 'fi-lg')}<input placeholder="Search components, pages…" aria-label="Search"></div>
  <div class="command-list" role="listbox" aria-label="Results"><p class="command-group">Pages & components</p>${commandItems(root)}<p class="command-empty" hidden>No results.</p></div>
  <div class="command-footer"><span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> navigate</span><span><kbd class="kbd">↵</kbd> open</span><span><kbd class="kbd">esc</kbd> close</span></div>
</div></dialog>`;
  const footer = (root) => `<footer class="footer"><div class="container"><div class="footer-grid">
  <div class="stack gap-3"><span class="navbar-brand">Forma</span><p class="t-body-sm t-secondary" style="max-inline-size:36ch">A museum-grade, token-driven design system. Every color proven against WCAG at build time.</p></div>
  <div><p class="footer-title">Product</p><ul class="footer-links"><li><a href="${root}components/">Components</a></li><li><a href="${root}themes.html">Themes</a></li><li><a href="${root}examples/">Examples</a></li><li><a href="${root}changelog.html">Changelog</a></li></ul></div>
  <div><p class="footer-title">Developers</p><ul class="footer-links"><li><a href="${root}docs/">Docs</a></li><li><a href="${root}llms.txt">llms.txt</a></li><li><a href="${root}forma-spec.json">forma-spec.json</a></li><li><a href="${root}ai.html">MCP server</a></li></ul></div>
  </div><div class="footer-bottom"><span>FORMA v${V} · MIT · ${manifest.counts.components + manifest.counts.sectorComponents} components · ${manifest.counts.themes} themes · ${manifest.contrast.checks} contrast checks</span><span>Built to <a class="link link-quiet" href="https://autorite.net">Autorité</a> standards by <a class="link link-quiet" href="https://omerasim.com">Ömer Asım</a> in Istanbul</span></div></div></footer>`;
  const page = ({ root = '', title, desc = '', active, body, themesCss = false, plain = false }) => `<!doctype html>
<html lang="en" data-forma-restore-theme>
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="stylesheet" href="${root}dist/forma.all.min.css">
${themesCss ? `<link rel="stylesheet" href="${root}dist/forma-themes.min.css">` : ''}
<link rel="stylesheet" href="${root}assets/site.css">
<link rel="alternate" type="text/plain" href="${root}llms.txt" title="llms.txt">
<script>try{var m=localStorage.getItem('forma-mode');if(m)document.documentElement.dataset.mode=m;var t=localStorage.getItem('forma-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
</head>
<body>
${plain ? '' : header(root, active)}
${body}
${plain ? '' : footer(root)}
<script src="${root}dist/forma.min.js"></script>
<script>
addEventListener('load',function(){document.querySelectorAll('.preview').forEach(function(el){if(el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1){el.tabIndex=0;el.setAttribute('role','region');el.setAttribute('aria-label','Example')}})});
(function(){var p=document.querySelector('[data-theme-picker]');if(!p)return;p.value=Forma.theme.current;p.addEventListener('change',function(){Forma.theme.set(p.value)});})();
</script>
</body></html>`;

  /* ── Component pages ────────────────────────────────────────────────── */
  const sideNav = (root, current) => `<nav class="doc-nav" aria-label="Components">
    <a class="sidebar-item" href="${root}docs/">${icon(root, 'book-open')}<span class="sidebar-label">Getting started</span></a>
    <a class="sidebar-item" href="${root}components/"${current === 'index' ? ' aria-current="page"' : ''}>${icon(root, 'grid')}<span class="sidebar-label">All components</span></a>
    ${categories.map((cat) => `<p class="sidebar-section">${esc(cat)}</p>${byCat(cat).map((c) => `<a class="sidebar-item" href="${root}components/${c.id}.html"${c.id === current ? ' aria-current="page"' : ''}><span class="sidebar-label">${esc(c.name)}</span></a>`).join('')}`).join('')}
  </nav>`;
  const classRows = (cls = {}) => Object.entries(cls).filter(([, v]) => v && (Array.isArray(v) ? v.length : true)).map(([k, v]) => `<tr><th scope="row" class="muted">${esc(k)}</th><td><div class="class-chips">${(Array.isArray(v) ? v : [v]).map((x) => `<code>${esc(x.startsWith('data-') || x.startsWith('aria-') || x.startsWith('--') || x.includes('=') ? x : '.' + x)}</code>`).join(' ')}</div></td></tr>`).join('');
  all.forEach((c, i) => {
    const root = '../';
    const prev = all[i - 1], next = all[i + 1];
    const sectorNote = c.sector ? `<div class="callout callout-info">${icon(root, 'info')}<p><strong>Sector module.</strong> Load <code>dist/sectors/forma-${c.sector}.css</code> (or <code>forma.all.css</code>) after <code>forma.css</code>.</p></div>` : '';
    const body = `<div class="doc-shell">${sideNav(root, c.id)}<main class="doc-main" id="main">
  <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="${root}components/">Components</a></li><li>${esc(c.category)}</li><li><span aria-current="page">${esc(c.name)}</span></li></ol></nav>
  <header class="section-head" style="margin-block:var(--space-5) var(--space-6)"><h1 class="section-title" style="font-size:var(--text-4xl)">${esc(c.name)}</h1><p class="section-desc" style="font-size:var(--text-md)">${esc(c.description)}</p>
    <div class="cluster gap-2"><span class="badge badge-mono">.${esc(c.classes.base)}</span>${c.js ? '<span class="badge badge-accent badge-mono">JS enhanced</span>' : '<span class="badge badge-success badge-mono">CSS only</span>'}${c.sector ? `<span class="badge badge-info badge-mono">sector · ${c.sector}</span>` : ''}</div></header>
  ${sectorNote}
  ${(c.examples || []).map((ex, k) => `<section class="example"><h2 class="example-title" id="${slug(ex.title)}">${esc(ex.title)}</h2><div class="preview">${live(ex.html, root)}</div><details class="code-toggle"><summary>${icon(root, 'code')} Show code</summary><div><div class="code-block-head"><span>HTML</span><button class="code-copy" data-forma="copy" data-copy-target="#code-${c.id}-${k}">Copy</button></div><pre tabindex="0" class="code-block" id="code-${c.id}-${k}"><code>${codeOf(ex.html)}</code></pre></div></details></section>`).join('')}
  <h2 class="doc-h2" id="classes">Classes</h2>
  <div class="table-wrap"><table class="table class-table"><tbody>${classRows(c.classes)}${c.attributes ? `<tr><th scope="row" class="muted">attributes</th><td><div class="class-chips">${c.attributes.map((a) => `<code>${esc(a)}</code>`).join(' ')}</div></td></tr>` : ''}</tbody></table></div>
  ${c.a11y ? `<h2 class="doc-h2" id="accessibility">Accessibility</h2><ul class="stack gap-2" style="padding-inline-start:var(--space-5)">${c.a11y.map((a) => `<li class="t-body-sm t-secondary">${esc(a)}</li>`).join('')}</ul>` : ''}
  ${c.js ? `<h2 class="doc-h2" id="javascript">JavaScript</h2><dl class="dl dl-divided">${c.js.auto ? `<dt>Auto-init</dt><dd><code>${esc(c.js.auto)}</code></dd>` : ''}${c.js.api ? `<dt>API</dt><dd><code>${esc(c.js.api)}</code></dd>` : ''}${c.js.events ? `<dt>Events</dt><dd>${c.js.events.map((e) => `<code>${esc(e)}</code>`).join(' ')}</dd>` : ''}</dl>` : ''}
  ${c.v5 ? `<h2 class="doc-h2" id="migration">Migrating from v5</h2><div class="table-wrap"><table class="table"><thead><tr><th scope="col">v5</th><th scope="col">v6</th></tr></thead><tbody>${Object.entries(c.v5).map(([a, b]) => `<tr><td><code>${esc(a)}</code></td><td><code>${esc(b)}</code></td></tr>`).join('')}</tbody></table></div>` : ''}
  <nav class="split mt-6" aria-label="Pager" style="padding-block-start:var(--space-6);border-block-start:1px solid var(--border-faint)">${prev ? `<a class="btn btn-ghost" href="${prev.id}.html">${icon(root, 'arrow-left')} ${esc(prev.name)}</a>` : '<span></span>'}${next ? `<a class="btn btn-ghost" href="${next.id}.html">${esc(next.name)} ${icon(root, 'arrow-right')}</a>` : ''}</nav>
</main></div>`;
    write(path.join(SITE, 'components', `${c.id}.html`), page({ root, title: `${c.name} — FORMA`, desc: c.description, active: 'Components', body }));
  });
  // Components index
  write(path.join(SITE, 'components/index.html'), page({ root: '../', title: 'Components — FORMA', desc: `${all.length} accessible components.`, active: 'Components', body: `<div class="doc-shell">${sideNav('../', 'index')}<main class="doc-main" id="main">
  <header class="section-head"><p class="section-number">Components</p><h1 class="section-title" style="font-size:var(--text-4xl)">${all.length} components</h1><p class="section-desc">${components.length} in the core stylesheet, ${sectorMeta.length} in six optional sector modules. Every one is token-driven, keyboard-accessible and documented for humans and machines.</p></header>
  ${categories.map((cat) => `<h2 class="doc-h2" id="${slug(cat)}">${esc(cat)}</h2><div class="grid" style="--min:220px">${byCat(cat).map((c) => `<a class="card card-interactive" href="${c.id}.html"><p class="card-title">${esc(c.name)}</p><p class="card-desc t-clamp-2">${esc(c.description)}</p><p class="mt-4"><code class="t-meta">.${esc(c.classes.base)}</code></p></a>`).join('')}</div>`).join('')}
</main></div>` }));

  /* ── Docs (getting started, tokens, migration) ──────────────────────── */
  const prims = primitiveTokens();
  const groupTok = (prefix) => prims.filter((t) => t.name.startsWith(prefix + '-'));
  const museum = buildPalette(themes.find((t) => t.default).palette);
  const colorNames = Object.keys(museum.dark.tokens);
  const migrations = all.filter((c) => c.v5).flatMap((c) => Object.entries(c.v5).map(([a, b]) => [c.name, a, b]));
  const docsBody = `<div class="doc-shell">${sideNav('../', 'docs')}<main class="doc-main" id="main"><div class="prose" style="max-inline-size:76ch">
  <p class="article-kicker">Documentation · v${V}</p>
  <h1>Getting started</h1>
  <p class="lead">FORMA is one stylesheet and an optional script. No build step, no framework, no runtime dependencies. Tokens, themes and components are generated from a single source and every color pair is proven against WCAG at build time.</p>
  <h2 id="install">Install</h2>
  <p>Use the CDN, npm, or download <code>dist/</code>.</p>
  <pre tabindex="0" class="code-block"><code>&lt;!-- CDN (jsDelivr, pinned) --&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nage/forma@${V}/dist/forma.min.css"&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/@nage/forma@${V}/dist/forma.min.js" defer&gt;&lt;/script&gt;

# npm
npm i @nage/forma
import '@nage/forma/dist/forma.css';
import * as Forma from '@nage/forma';</code></pre>
  <p>The default <strong>Museum</strong> theme is self-hosted (Cormorant, Syne, JetBrains Mono — latin and latin-ext, so Turkish works). Keep <code>dist/fonts/</code> next to the CSS.</p>
  <h2 id="files">Files</h2>
  <div class="table-wrap"><table class="table"><thead><tr><th scope="col">File</th><th scope="col">What</th><th scope="col" class="num">Size (min)</th></tr></thead><tbody>
    <tr><td><code>forma.min.css</code></td><td>Tokens, reset, base, ${components.length} components, utilities</td><td class="num">${manifest.sizes['forma.min.css']} KB</td></tr>
    <tr><td><code>forma.all.min.css</code></td><td>Core + all six sector modules</td><td class="num">${manifest.sizes['forma.all.min.css']} KB</td></tr>
    <tr><td><code>forma.min.js</code> / <code>forma.esm.js</code></td><td>Optional behaviour: ARIA wiring, keyboard, overlays, charts</td><td class="num">${manifest.sizes['forma.min.js']} KB</td></tr>
    <tr><td><code>themes/&lt;id&gt;.css</code></td><td>${manifest.counts.themes} themes, one file each (or <code>forma-themes.css</code> for all)</td><td class="num">≈2–4 KB</td></tr>
    <tr><td><code>sectors/forma-&lt;sector&gt;.css</code></td><td>health, finance, education, crm, publishing, data</td><td class="num">≈3 KB</td></tr>
    <tr><td><code>forma-icons.svg</code></td><td>${manifest.counts.icons} icons (Lucide, ISC) as a symbol sprite</td><td class="num">${Math.round(fs.statSync(path.join(ROOT, 'dist/forma-icons.svg')).size / 1024)} KB</td></tr>
    <tr><td><code>forma.manifest.json</code></td><td>Version, counts, sizes, contrast results — the single source for every number on this site</td><td class="num">—</td></tr>
  </tbody></table></div>
  <h2 id="modes">Light, dark and themes</h2>
  <p>Mode follows the operating system by default. Force it on any element — the whole subtree follows, because every color token is a single <code>light-dark()</code> value.</p>
  <pre tabindex="0" class="code-block"><code>&lt;html data-mode="dark"&gt;            &lt;!-- or "light"; omit to follow the OS --&gt;
&lt;html data-theme="cyberpunk"&gt;      &lt;!-- after loading themes/cyberpunk.css --&gt;
&lt;section data-theme="editorial" data-mode="light"&gt;…&lt;/section&gt;  &lt;!-- scoped --&gt;

Forma.mode.toggle();                 // persists the choice
Forma.theme.set('swiss');            // loads themes/swiss.css on demand</code></pre>
  <h2 id="tokens">Tokens</h2>
  <p>Primitives live in <code>tokens/primitives.tokens.json</code> (W3C DTCG format). Colors are <em>computed</em> per theme from a handful of OKLCH parameters, then checked: text ≥ 4.5:1 (primary ≥ 12:1, secondary ≥ 6:1) on every surface, controls and focus rings ≥ 3:1. The build fails if any check fails.</p>
  <h3>Color</h3>
  <div class="swatch-grid not-prose">${colorNames.filter((n) => !n.startsWith('on-')).map((n) => `<div class="token-swatch"><span class="token-swatch-color" style="--_c:var(--${n})"></span><span class="token-swatch-name">--${n}</span></div>`).join('')}</div>
  <p>Derived (alpha) tokens: <code>--border-faint|default|muted|strong</code>, <code>--accent-muted</code>, <code>--accent-subtle</code>, <code>--{error,success,warning,info}-muted</code> and <code>-border</code>, <code>--shadow-xs…xl</code>, <code>--focus-ring</code>.</p>
  <h3>Scale</h3>
  <div class="table-wrap"><table class="table"><thead><tr><th scope="col">Token</th><th scope="col">Value</th></tr></thead><tbody>${['text', 'space', 'radius', 'leading', 'tracking', 'duration', 'z', 'control', 'container'].flatMap(groupTok).map((t) => `<tr><td><code>--${t.name}</code></td><td class="muted"><code>${esc(Array.isArray(t.value) ? `cubic-bezier(${t.value})` : t.value)}</code></td></tr>`).join('')}</tbody></table></div>
  <h2 id="layers">Cascade layers</h2>
  <p>Everything sits in <code>@layer forma.reset, forma.tokens, forma.base, forma.components, forma.sectors, forma.themes, forma.utilities</code>. Your own unlayered CSS always wins — no specificity battles, no <code>!important</code>.</p>
  <h2 id="browsers">Browser support</h2>
  <p>Chrome/Edge 123+, Firefox 120+, Safari 17.5+ (2024 and newer). FORMA relies on <code>light-dark()</code>, <code>color-mix()</code>, <code>@layer</code>, <code>:has()</code>, container queries, <code>&lt;dialog&gt;</code> and the Popover API. Older browsers that lack <code>light-dark()</code> get plain light and dark color values from an <code>@supports</code> fallback, so text stays readable.</p>
  <h2 id="rtl">Right-to-left and High Contrast</h2>
  <p>Logical properties throughout, so <code>dir="rtl"</code> mirrors layouts, switches, sliders, menus and arrow-key navigation. Code, keyboard keys and shortcuts stay left-to-right inside RTL text. In Windows High Contrast (forced colors) switches, checkboxes, progress bars and selected tabs, menu items and nav links are redrawn with system colors. Both are covered by the test suite.</p>
  <h2 id="frameworks">React and TypeScript</h2>
  <p>Types ship with the package (<code>types/forma.d.ts</code>), including every <code>forma:*</code> event. React bindings are optional and have no build step:</p>
  <pre tabindex="0" class="code-block"><code>import { FormaProvider, Chart, Icon, useFormaEvent, toast } from '@nage/forma/react';

&lt;FormaProvider theme="swiss" mode="dark"&gt;
  &lt;Chart type="bar" labels={months} series={[{ name: 'Runs', values }]} title="Runs per month" /&gt;
&lt;/FormaProvider&gt;

useFormaEvent(boardRef, 'move', (e) =&gt; save(e.detail.card.id, e.detail.to.id));</code></pre>
  <p>Elements with <code>data-forma</code> that React renders are set up automatically, once, so markup-driven components (tabs, menus, combobox, kanban…) need no wrapper.</p>
  <h2 id="fonts">Self-hosting theme fonts</h2>
  <p>Museum's fonts ship in <code>dist/fonts/</code>. Other themes load theirs from Google Fonts. To serve them yourself (no third-party requests, works offline, GDPR-friendly), download them once from Fontsource (OFL) and use the generated stylesheet instead of <code>themes/&lt;id&gt;.css</code>:</p>
  <pre tabindex="0" class="code-block"><code>npx @nage/forma fonts swiss editorial --out public/forma --subsets latin,latin-ext
&lt;link rel="stylesheet" href="/forma/swiss.css"&gt;   &lt;!-- @font-face + theme, fonts in /forma/fonts/ --&gt;</code></pre>
  <h2 id="native">Figma, iOS and Android</h2>
  <p>Every theme exports to the platforms your designers and app teams use. <code>dist/tokens/</code> holds Museum; any other theme is one command away.</p>
  <pre tabindex="0" class="code-block"><code>npx @nage/forma tokens dtcg cyberpunk --out tokens/     # W3C DTCG, one file per mode (Figma variables, Tokens Studio)
npx @nage/forma tokens swift cyberpunk --out ios/       # SwiftUI Color with light/dark, spacing, radii
npx @nage/forma tokens kotlin cyberpunk --out android/  # Jetpack Compose palettes, dp/sp scales
npx @nage/forma tokens json cyberpunk                   # flat JSON for anything else</code></pre>
  <h2 id="a11y">Accessibility commitments</h2>
  <ul><li>WCAG 2.2 AA contrast proven for every theme in both modes (${manifest.contrast.checks} checks).</li><li>One <code>:focus-visible</code> rule components never override.</li><li>Native elements first: <code>&lt;dialog&gt;</code>, <code>[popover]</code>, <code>&lt;details&gt;</code>, real checkboxes and radios.</li><li>WAI-ARIA patterns for tabs, menu, combobox, tree, grid date picker; full keyboard support.</li><li>Reduced motion respected; spinners keep moving slowly so state stays visible.</li><li>No user text is ever inserted as HTML by forma.js.</li></ul>
  <h2 id="migration">Migrating from v5</h2>
  <p>v6 is a rewrite. Most class names survive; these changed:</p>
  <div class="table-wrap not-prose"><table class="table table-compact"><thead><tr><th scope="col">Component</th><th scope="col">v5</th><th scope="col">v6</th></tr></thead><tbody>${migrations.map(([c, a, b]) => `<tr><td class="muted">${esc(c)}</td><td><code>${esc(a)}</code></td><td><code>${esc(b)}</code></td></tr>`).join('')}</tbody></table></div>
  <p>Also: <code>data-theme="dark|light"</code> is now <code>data-mode</code>; <code>data-theme</code> names a visual theme. JS globals moved under <code>Forma.*</code>. Run <code>npx @nage/forma lint --fix "**/*.html"</code>: it rewrites every class with a one-to-one v6 replacement and lists the few that need new markup (a <code>&lt;dialog&gt;</code>, a popover, an ARIA attribute).</p>
  <p>Still on v5? Its documentation stays online at <a href="${pkg.forma?.v5Docs || '#'}">the v5 archive</a>.</p>
</div></main></div>`;
  write(path.join(SITE, 'docs/index.html'), page({ root: '../', title: 'Docs — FORMA', desc: 'Install, tokens, themes, migration.', active: 'Docs', body: docsBody }));

  /* ── Themes ─────────────────────────────────────────────────────────── */
  const cats = [...new Set(themes.map((t) => t.category))];
  const fontName = (f) => (typeof f === 'string' ? f : f?.family || '').replace(' Variable', '');
  const themeCard = (t) => `<article class="theme-card" data-theme="${t.id}" data-category="${t.category}">
    <div class="split"><span class="t-meta t-accent">${esc(t.category)}</span><div class="theme-card-dots" aria-hidden="true"><i style="--_c:var(--bg-base)"></i><i style="--_c:var(--bg-elevated)"></i><i style="--_c:var(--text-primary)"></i><i style="--_c:var(--accent)"></i></div></div>
    <h3 class="theme-card-title">${esc(t.name)}</h3><p class="t-body-sm t-secondary">${esc(t.description)}</p>
    <div class="cluster gap-2"><button class="btn btn-sm btn-primary" data-apply-theme="${t.id}">Apply</button><button class="btn btn-sm btn-accent">Accent</button><span class="badge badge-success badge-dot">Live</span></div>
    <input class="input input-sm" aria-label="Sample input in ${esc(t.name)}" placeholder="Type to preview ${esc(fontName(t.fonts.ui))}">
    <div class="spec-row"><span>${esc(fontName(t.fonts.display))} · ${esc(fontName(t.fonts.ui))}</span><span title="Lowest text contrast in this theme">min ${minRatio(t.id).toFixed(2)}:1</span></div>
  </article>`;
  write(path.join(SITE, 'themes.html'), page({ root: '', title: 'Themes — FORMA', desc: `${themes.length} contrast-proven themes.`, active: 'Themes', themesCss: true, body: `<main id="main" class="container" style="padding-block:var(--space-7) var(--space-9)">
  <header class="section-head"><p class="section-number">Themes</p><h1 class="section-title" style="font-size:var(--text-4xl)">${themes.length} themes, one markup</h1><p class="section-desc">Each theme is about ten parameters — hue, chroma, fonts, radius. The build computes every color for light and dark and refuses to ship anything under WCAG AA. Each card below is live: it is the same HTML with a different <code>data-theme</code>.</p></header>
  <div class="segmented" role="radiogroup" aria-label="Category" style="margin-block-end:var(--space-5)" data-theme-filter>${['all', ...cats].map((c, i) => `<label><input type="radio" name="tcat" value="${c}"${i ? '' : ' checked'}> ${c[0].toUpperCase() + c.slice(1)}</label>`).join('')}</div>
  <div class="theme-grid">${themes.map(themeCard).join('')}</div>
</main>
<script>
document.addEventListener('change',function(e){if(!e.target.closest('[data-theme-filter]'))return;var v=e.target.value;document.querySelectorAll('.theme-card').forEach(function(c){c.hidden=v!=='all'&&c.dataset.category!==v});});
document.addEventListener('click',function(e){var b=e.target.closest('[data-apply-theme]');if(!b)return;Forma.theme.set(b.dataset.applyTheme).thenaddEventListener('load',function(){document.querySelectorAll('.preview').forEach(function(el){if(el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1){el.tabIndex=0;el.setAttribute('role','region');el.setAttribute('aria-label','Example')}})});
(function(){var p=document.querySelector('[data-theme-picker]');if(p)p.value=b.dataset.applyTheme;Forma.toast.success('Theme applied',b.closest('.theme-card').querySelector('.theme-card-title').textContent)});});
</script>` }));

  /* ── Landing ────────────────────────────────────────────────────────── */
  const pick = (id) => all.find((c) => c.id === id);
  const featured = ['museum', 'swiss', 'cyberpunk', 'editorial', 'japanese', 'brutalist', 'nightsky', 'cottagecore'].map((id) => themes.find((t) => t.id === id)).filter(Boolean);
  write(path.join(SITE, 'index.html'), page({ root: '', title: `FORMA — museum-grade design system`, desc: `${all.length} components, ${themes.length} contrast-proven themes, one CSS file.`, active: '', themesCss: true, body: `<main id="main">
  <section class="landing-grid-bg"><div class="container hero hero-split">
    <div class="stack gap-5"><p class="hero-eyebrow">Design system · v${V}</p>
      <h1 class="hero-title">Every measurement follows a <em>rule</em>.</h1>
      <p class="hero-text">One stylesheet. ${all.length} accessible components. ${themes.length} themes whose every color is computed and proven against WCAG — in light and dark. Documented for people, agents and editors alike.</p>
      <div class="hero-actions"><a class="btn btn-lg btn-primary" href="docs/">Get started</a><a class="btn btn-lg btn-ghost" href="themes.html">Browse themes ${icon('', 'arrow-right')}</a></div>
      <div class="hero-meta"><div><span class="hero-meta-value">${all.length}</span><span class="hero-meta-label">components</span></div><div><span class="hero-meta-value">${themes.length}</span><span class="hero-meta-label">themes</span></div><div><span class="hero-meta-value">${manifest.contrast.checks}</span><span class="hero-meta-label">contrast proofs</span></div><div><span class="hero-meta-value">0</span><span class="hero-meta-label">runtime deps</span></div></div>
    </div>
    <div class="stack gap-3">${live(pick('kpi').examples[0].html.replace('<div class="kpi-grid">', '<div class="kpi-grid" style="grid-template-columns:1fr 1fr">'), '')}
      ${live(pick('chart').examples[0].html, '')}</div>
  </div></section>
  ${live(pick('props').examples[0].html, '')}
  <section class="container" style="padding-block:var(--space-9)">
    <header class="section-head"><p class="section-number">01 · Start</p><h2 class="section-title">Three lines to launch</h2><p class="section-desc">No npm, no bundler. Link the stylesheet, optionally the script, optionally a theme.</p></header>
    <pre tabindex="0" class="code-block"><code><span class="tok-c">&lt;!-- Core --&gt;</span>
&lt;link rel=<span class="tok-s">"stylesheet"</span> href=<span class="tok-s">"forma.min.css"</span>&gt;
&lt;script src=<span class="tok-s">"forma.min.js"</span> defer&gt;&lt;/script&gt;
<span class="tok-c">&lt;!-- Optional: a theme --&gt;</span>
&lt;link rel=<span class="tok-s">"stylesheet"</span> href=<span class="tok-s">"themes/swiss.css"</span>&gt;  &lt;html data-theme=<span class="tok-s">"swiss"</span>&gt;</code></pre>
  </section>
  <section class="container" style="padding-block:0 var(--space-9)">
    <header class="section-head"><p class="section-number">02 · Themes</p><h2 class="section-title">Same markup. Different worlds.</h2><p class="section-desc">These cards are identical HTML; only <code>data-theme</code> changes. Hover the buttons, type in the inputs.</p></header>
    <div class="theme-grid">${featured.map(themeCard).join('')}</div>
    <p class="mt-6"><a class="btn btn-outline" href="themes.html">All ${themes.length} themes ${icon('', 'arrow-right')}</a></p>
  </section>
  <section class="container" style="padding-block:0 var(--space-9)">
    <header class="section-head"><p class="section-number">03 · Proof</p><h2 class="section-title">Accessibility you can audit</h2></header>
    <div class="grid" style="--min:240px">
      <div class="card feature"><span class="icon-tile icon-tile-accent">${icon('', 'shield-check', 'fi-lg')}</span><p class="feature-title">Contrast is computed, not hoped for</p><p class="feature-desc">${manifest.contrast.checks} checks across ${themes.length} themes × 2 modes. The build fails below AA.</p></div>
      <div class="card feature"><span class="icon-tile">${icon('', 'checkbox', 'fi-lg')}</span><p class="feature-title">Native first</p><p class="feature-desc">&lt;dialog&gt;, popover, &lt;details&gt;, real inputs. Focus traps and Escape come from the browser.</p></div>
      <div class="card feature"><span class="icon-tile">${icon('', 'globe', 'fi-lg')}</span><p class="feature-title">RTL & i18n</p><p class="feature-desc">Logical properties everywhere; validation messages in English and Turkish.</p></div>
      <div class="card feature"><span class="icon-tile">${icon('', 'bot', 'fi-lg')}</span><p class="feature-title">AI-native</p><p class="feature-desc">llms.txt, a JSON spec, editor rules and an MCP server — all generated from the same source as the CSS.</p></div>
    </div>
  </section>
</main>` }));

  /* ── Examples ───────────────────────────────────────────────────────── */
  const exDir = path.join(ROOT, 'site-src/examples');
  const examples = fs.existsSync(exDir) ? fs.readdirSync(exDir).filter((f) => f.endsWith('.html')).sort() : [];
  const exMeta = [];
  for (const f of examples) {
    const src = fs.readFileSync(path.join(exDir, f), 'utf8');
    const meta = JSON.parse(src.match(/<!--meta(.*?)-->/s)?.[1] || '{}');
    const body = src.replace(/<!--meta.*?-->/s, '');
    exMeta.push({ file: f, ...meta });
    write(path.join(SITE, 'examples', f), page({ root: '../', title: `${meta.title} — FORMA example`, desc: meta.desc, plain: true, themesCss: !!meta.theme, body: live(body, '../').replace('<body', '<body') })
      .replace('<html lang="en" data-forma-restore-theme>', `<html lang="${meta.lang || 'en'}"${meta.theme ? ` data-theme="${meta.theme}"` : ''}${meta.mode ? ` data-mode="${meta.mode}"` : ''}>`)
      .replace(/<script>try\{var m=.*?<\/script>/s, ''));
  }
  write(path.join(SITE, 'examples/index.html'), page({ root: '../', title: 'Examples — FORMA', desc: 'Complete pages built only with FORMA.', active: 'Examples', themesCss: true, body: `<main id="main" class="container" style="padding-block:var(--space-7) var(--space-9)">
  <header class="section-head"><p class="section-number">Examples</p><h1 class="section-title" style="font-size:var(--text-4xl)">Real pages, nothing custom</h1><p class="section-desc">Each example uses only forma.css, forma.js and one theme — at most a line or two of page layout.</p></header>
  <div class="grid" style="--min:300px">${exMeta.map((e) => `<a class="card card-interactive card-flush" href="${e.file}"><div class="card-media" data-theme="${e.theme || 'museum'}" style="background:var(--bg-base)"><span class="t-display-sm" style="color:var(--text-primary)">${esc(e.title)}</span></div><div class="card-body"><p class="card-title">${esc(e.title)}</p><p class="card-desc">${esc(e.desc)}</p><div class="cluster gap-1 mt-4">${(e.uses || []).map((u) => `<span class="badge badge-mono">${esc(u)}</span>`).join('')}<span class="badge badge-accent badge-mono">${esc(e.theme || 'museum')}</span></div></div></a>`).join('')}</div>
</main>` }));

  /* ── Changelog, AI, 404 ─────────────────────────────────────────────── */
  const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  const md = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const clHtml = changelog.split('\n').map((l) => l.startsWith('## ') ? `<h2>${md(l.slice(3))}</h2>` : l.startsWith('### ') ? `<h3>${md(l.slice(4))}</h3>` : l.startsWith('- ') ? `<li>${md(l.slice(2))}</li>` : l.startsWith('# ') ? '' : l.trim() ? `<p>${md(l)}</p>` : '').join('\n').replace(/(<li>.*?<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`);
  write(path.join(SITE, 'changelog.html'), page({ root: '', title: 'Changelog — FORMA', active: '', body: `<main id="main" class="container container-md" style="padding-block:var(--space-7) var(--space-9)"><div class="prose"><p class="article-kicker">Changelog</p><h1>Version history</h1>${clHtml}</div></main>` }));

  const ai = await buildAiFiles({ ROOT, SITE, manifest, components, sectorMeta, themes });
  write(path.join(SITE, 'ai.html'), page({ root: '', title: 'AI — FORMA', desc: 'llms.txt, JSON spec, editor rules, MCP server.', active: 'AI', body: `<main id="main" class="container container-lg" style="padding-block:var(--space-7) var(--space-9)">
  <header class="section-head"><p class="section-number">AI-native</p><h1 class="section-title" style="font-size:var(--text-4xl)">Built for agents as much as people</h1><p class="section-desc">Every AI file is generated from the same component metadata as the CSS and these docs, so they never drift. All of them ship in the npm package.</p></header>
  <div class="table-wrap"><table class="table"><thead><tr><th scope="col">File</th><th scope="col">For</th><th scope="col" class="num">Size</th></tr></thead><tbody>
    ${ai.files.map((f) => `<tr><td><a class="link" href="${f.href}"><code>${esc(f.name)}</code></a></td><td class="muted">${esc(f.for)}</td><td class="num">${f.kb} KB</td></tr>`).join('')}
  </tbody></table></div>
  <h2 class="doc-h2" id="mcp">MCP server</h2>
  <p class="t-body t-secondary" style="max-inline-size:68ch">A zero-dependency Model Context Protocol server (stdio). It does not invent markup: it serves the real component specs, theme tokens and examples, and validates HTML an agent wrote against the spec — the same linter as the CLI.</p>
  <div class="grid-2 mt-4"><dl class="dl dl-divided">${ai.tools.map((t) => `<dt><code>${esc(t.name)}</code></dt><dd class="t-body-sm t-secondary">${esc(t.description)}</dd>`).join('')}</dl>
  <pre tabindex="0" class="code-block"><code>// claude_desktop_config.json  ·  or: claude mcp add forma -- npx -y @nage/forma mcp
{
  "mcpServers": {
    "forma": { "command": "npx", "args": ["-y", "@nage/forma", "mcp"] }
  }
}</code></pre></div>
  <h2 class="doc-h2" id="lint">Lint what agents write</h2>
  <pre tabindex="0" class="code-block"><code>npx @nage/forma lint "src/**/*.html"
  ✗ index.html:12  unknown class "kpi-trend" → did you mean "metric-delta"? (v5)
  ✗ index.html:20  icon-only &lt;button&gt; has no accessible name
  ✓ 2 problems in 1 file</code></pre>
</main>` }));
  write(path.join(SITE, '404.html'), page({ root: '/', title: 'Not found — FORMA', body: `<main id="main" class="state-page"><div><p class="state-code">404</p><h1 class="state-title">This room is closed</h1><p class="state-text">The page moved or never existed.</p><a class="btn btn-primary" href="/">Back to the lobby</a></div></main>` }));
  write(path.join(SITE, 'vercel.json'), JSON.stringify({ cleanUrls: false, headers: [{ source: '/(.*)\\.(txt|md|mdc)', headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }] }, { source: '/dist/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }, { key: 'Access-Control-Allow-Origin', value: '*' }] }] }, null, 2));
}
