#!/usr/bin/env node
// FORMA build — one source of truth → every artifact.
//   tokens/*.json + themes/themes.json + src/**  →  dist/ + site/ + AI files
// Only dev tooling (esbuild, lucide-static, fontsource) is used; dist has zero runtime deps.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';
import { buildPalette } from './lib/palette.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = (...p) => path.join(ROOT, ...p);
const DIST = r('dist');
const pkg = JSON.parse(fs.readFileSync(r('package.json'), 'utf8'));
export const VERSION = pkg.version;
const TARGET = ['chrome123', 'edge123', 'firefox120', 'safari17.5'];
const LAYERS = '@layer forma.reset, forma.tokens, forma.base, forma.components, forma.sectors, forma.themes, forma.utilities;';
const BANNER = `/*! FORMA v${VERSION} | MIT | https://forma-design-five.vercel.app */`;

const write = (file, content) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); };
const read = (file) => fs.readFileSync(file, 'utf8');
const kb = (s) => Math.round(Buffer.byteLength(s) / 102.4) / 10;

/* ── Tokens ─────────────────────────────────────────────────────────────── */
function flatten(obj, prefix = []) {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out.push({ name: [...prefix, k].join('-'), type: v.$type, value: v.$value, description: v.$description });
    else if (v && typeof v === 'object') out.push(...flatten(v, [...prefix, k]));
  }
  return out;
}
const tokenValue = (t) => (t.type === 'cubicBezier' ? `cubic-bezier(${t.value.join(', ')})` : String(t.value));
export function primitiveTokens() { return flatten(JSON.parse(read(r('tokens/primitives.tokens.json')))); }

/* ── Themes ─────────────────────────────────────────────────────────────── */
export const THEMES = JSON.parse(read(r('themes/themes.json')));
export const BASE_THEME = THEMES.themes.find((t) => t.default);

const GENERIC = { display: 'Georgia, serif', ui: 'ui-sans-serif, system-ui, sans-serif', mono: 'ui-monospace, Menlo, monospace' };
function fontStack(role, f) {
  if (!f) return null;
  const fam = typeof f === 'string' ? f : f.family;
  const fallback = (typeof f === 'object' && f.fallback) || GENERIC[role];
  return `'${fam}', ${fallback}`;
}
export function googleFontsUrl(theme) {
  const fams = Object.values(theme.fonts || {}).filter((f) => typeof f === 'object' && f.google);
  if (!fams.length) return null;
  const uniq = [...new Map(fams.map((f) => [f.google, f])).values()];
  return 'https://fonts.googleapis.com/css2?' + uniq.map((f) => 'family=' + f.google.replace(/ /g, '+')).join('&') + '&display=swap';
}

/** Theme → CSS declarations (colors via light-dark(), fonts, shape) + proof report. */
export function themeDeclarations(theme) {
  const pal = buildPalette(theme.palette || {});
  const decl = [];
  for (const name of Object.keys(pal.dark.tokens)) decl.push(`--${name}: light-dark(${pal.light.tokens[name]}, ${pal.dark.tokens[name]});`);
  for (const role of ['display', 'ui', 'mono']) {
    const s = fontStack(role, theme.fonts?.[role]);
    if (s) decl.push(`--font-${role}: ${s};`);
  }
  const sh = theme.shape || {};
  if (sh.radius !== undefined) decl.push(`--radius-scale: ${sh.radius};`);
  if (sh.borderWidth) decl.push(`--border-width-default: ${sh.borderWidth};`);
  if (sh.displayWeight) decl.push(`--weight-display: ${sh.displayWeight};`);
  if (sh.displayTracking) decl.push(`--tracking-display: ${sh.displayTracking};`);
  if (sh.labelTransform) decl.push(`--label-transform: ${sh.labelTransform};`);
  if (sh.labelTracking) decl.push(`--label-tracking: ${sh.labelTracking};`);
  return { decl, palette: pal };
}

function scopeCss(css, sel) {
  // Prefix each top-level rule with the theme selector. Supports `&` for the theme root itself.
  return css.replace(/(^|})\s*([^{}@]+)\{/g, (m, end, selectors) =>
    `${end}\n${selectors.split(',').map((s) => s.trim()).map((s) => (s.startsWith('&') ? sel + s.slice(1) : `${sel} ${s}`)).join(', ')} {`);
}

export function themeCss(theme) {
  const sel = `[data-theme="${theme.id}"]`;
  const { decl, palette } = themeDeclarations(theme);
  const font = googleFontsUrl(theme);
  let css = `${BANNER}\n/* Theme: ${theme.name} — ${theme.description || ''} */\n`;
  if (font) css += `@import url("${font}");\n`;
  css += `${LAYERS}\n@layer forma.themes {\n${sel} {\n  ${decl.join('\n  ')}\n}\n`;
  if (theme.mode) css += `${sel}:not([data-mode]) { color-scheme: ${theme.mode}; }\n`;
  if (theme.css) css += scopeCss(theme.css, sel) + '\n';
  css += '}\n';
  return { css, palette };
}

/* ── Fonts (self-hosted for the base theme) ─────────────────────────────── */
function baseFontFaces() {
  const sets = [
    ['cormorant', ['wght.css', 'wght-italic.css']],
    ['syne', ['wght.css']],
    ['jetbrains-mono', ['wght.css']],
  ];
  let css = '';
  for (const [name, files] of sets) {
    const dir = r('node_modules/@fontsource-variable', name);
    for (const f of files) {
      const src = read(path.join(dir, f));
      for (const block of src.split(/\n(?=\/\*)/)) {
        const m = block.match(/\/\* ([\w-]+) \*\//);
        if (!m || !/-(latin|latin-ext)-wght/.test(m[1])) continue;
        const file = block.match(/url\(\.\/files\/([^)]+)\)/)[1];
        fs.mkdirSync(r('dist/fonts'), { recursive: true });
        fs.copyFileSync(path.join(dir, 'files', file), r('dist/fonts', file));
        css += block.replace('./files/', './fonts/').trim() + '\n';
      }
    }
  }
  return css;
}

/* ── Components ─────────────────────────────────────────────────────────── */
export async function loadMeta(dir) {
  let files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.meta.js')).sort() : [];
  const orderFile = path.join(dir, 'order.json');
  if (fs.existsSync(orderFile)) { const order = JSON.parse(read(orderFile)); files = files.sort((a, b) => order.indexOf(a.replace('.meta.js', '')) - order.indexOf(b.replace('.meta.js', ''))); }
  const all = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(path.join(dir, f)).href + `?t=${Date.now()}`);
    const group = f.replace('.meta.js', '');
    for (const c of mod.default) all.push({ group, ...c });
  }
  return all;
}
const cssFiles = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.css')).sort().map((f) => path.join(dir, f)) : []);

async function minifyCss(css) {
  const out = await esbuild.transform(css, { loader: 'css', minify: true, target: TARGET, legalComments: 'inline' });
  return out.code;
}

/* ── CSS build ──────────────────────────────────────────────────────────── */
export async function buildCss() {
  const prims = primitiveTokens();
  const { decl: baseDecl, palette } = themeDeclarations(BASE_THEME);
  const order = JSON.parse(read(r('src/components/order.json')));
  const compCss = order.map((g) => r('src/components', `${g}.css`)).filter(fs.existsSync)
    .map((f) => `/* ── ${path.basename(f)} ── */\n${read(f)}`).join('\n');
  const sectorFiles = cssFiles(r('src/sectors'));

  const core = [
    BANNER,
    LAYERS,
    `@layer forma.reset {\n${read(r('src/css/reset.css'))}\n}`,
    `@layer forma.tokens {\n${baseFontFaces()}\n:root {\n  ${prims.map((t) => `--${t.name}: ${tokenValue(t)};`).join('\n  ')}\n  --label-transform: uppercase;\n  --label-tracking: var(--tracking-wider);\n  ${baseDecl.join('\n  ')}\n}\n}`,
    `@layer forma.base {\n${read(r('src/css/base.css'))}\n}`,
    `@layer forma.components {\n${compCss}\n}`,
    `@layer forma.utilities {\n${read(r('src/css/utilities.css'))}\n}`,
  ].join('\n\n');

  const sectors = {};
  for (const f of sectorFiles) {
    const name = path.basename(f, '.css');
    sectors[name] = `${BANNER}\n${LAYERS}\n@layer forma.sectors {\n${read(f)}\n}\n`;
  }
  const all = core + '\n' + Object.values(sectors).map((s) => s.replace(BANNER, '').replace(LAYERS, '')).join('\n');

  write(r('dist/forma.css'), core);
  write(r('dist/forma.min.css'), await minifyCss(core));
  write(r('dist/forma.all.css'), all);
  write(r('dist/forma.all.min.css'), await minifyCss(all));
  for (const [n, s] of Object.entries(sectors)) {
    write(r('dist/sectors', `forma-${n}.css`), s);
    write(r('dist/sectors', `forma-${n}.min.css`), await minifyCss(s));
  }
  return { palette, sectors: Object.keys(sectors) };
}

export async function buildThemes() {
  const report = [];
  let bundle = `${BANNER}\n${LAYERS}\n`;
  const imports = [];
  for (const theme of THEMES.themes) {
    const { css, palette } = themeCss(theme);
    write(r('dist/themes', `${theme.id}.css`), css);
    write(r('dist/themes', `${theme.id}.min.css`), await minifyCss(css));
    const font = googleFontsUrl(theme);
    if (font) imports.push(`@import url("${font}");`);
    bundle += css.replace(BANNER, '').replace(LAYERS, '').replace(/@import[^;]+;\n/, '');
    for (const mode of ['dark', 'light']) for (const c of palette[mode].checks) report.push({ theme: theme.id, mode, ...c, ratio: Math.round(c.ratio * 100) / 100, pass: c.ratio >= c.target });
  }
  const full = imports.join('\n') + '\n' + bundle;
  write(r('dist/forma-themes.css'), full);
  write(r('dist/forma-themes.min.css'), await minifyCss(full));
  return report;
}

/* ── JS ─────────────────────────────────────────────────────────────────── */
export async function buildJs() {
  const entry = r('src/js/index.js');
  if (!fs.existsSync(entry)) return;
  const common = { entryPoints: [entry], bundle: true, target: TARGET, legalComments: 'inline', banner: { js: BANNER } , define: { __FORMA_VERSION__: JSON.stringify(VERSION) } };
  await esbuild.build({ ...common, format: 'iife', globalName: 'Forma', outfile: r('dist/forma.js'), footer: { js: 'window.Forma=Forma;' } });
  await esbuild.build({ ...common, format: 'iife', globalName: 'Forma', minify: true, outfile: r('dist/forma.min.js'), footer: { js: 'window.Forma=Forma;' } });
  await esbuild.build({ ...common, format: 'esm', outfile: r('dist/forma.esm.js') });
  await esbuild.build({ ...common, format: 'esm', minify: true, outfile: r('dist/forma.esm.min.js') });
}

/* ── Main ───────────────────────────────────────────────────────────────── */
async function main() {
  const t0 = Date.now();
  fs.rmSync(DIST, { recursive: true, force: true });
  const { sectors } = await buildCss();
  const report = await buildThemes();
  await buildJs();
  const { buildIcons } = await import('./icons.mjs').catch(() => ({}));
  const icons = buildIcons ? await buildIcons(ROOT) : null;

  const failures = report.filter((x) => !x.pass);
  write(r('dist/contrast-report.json'), JSON.stringify({ version: VERSION, checks: report.length, failures }, null, 2));

  const components = await loadMeta(r('src/components'));
  const sectorMeta = await loadMeta(r('src/sectors'));
  const size = (f) => (fs.existsSync(r('dist', f)) ? kb(read(r('dist', f))) : 0);
  const manifest = {
    name: 'forma', version: VERSION, license: 'MIT',
    counts: { components: components.length, sectorComponents: sectorMeta.length, themes: THEMES.themes.length, sectors: sectors.length, icons: icons?.count ?? 0 },
    sizes: { 'forma.min.css': size('forma.min.css'), 'forma.min.js': size('forma.min.js'), 'forma.all.min.css': size('forma.all.min.css') },
    contrast: { checks: report.length, failures: failures.length },
    browsers: TARGET,
    builtAt: new Date().toISOString().slice(0, 10),
  };
  write(r('dist/forma.manifest.json'), JSON.stringify(manifest, null, 2));

  const { buildSite } = await import('./site.mjs').catch((e) => { if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e; return {}; });
  if (buildSite) await buildSite({ ROOT, manifest, components, sectorMeta, themes: THEMES.themes, report });

  console.log(`FORMA v${VERSION} built in ${Date.now() - t0}ms`);
  console.log(manifest.counts, manifest.sizes);
  if (failures.length) {
    console.error(`✗ ${failures.length} contrast failures`);
    for (const f of failures.slice(0, 20)) console.error(`  ${f.theme}/${f.mode} ${f.token} ${f.ratio} < ${f.target}`);
    process.exit(1);
  }
  console.log(`✓ ${report.length} contrast checks passed`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((e) => { console.error(e); process.exit(1); });
