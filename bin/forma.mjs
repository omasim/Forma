#!/usr/bin/env node
// forma — CLI: lint, contrast, theme, mcp.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint, fix } from '../lib/lint.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [cmd, ...args] = process.argv.slice(2);
const spec = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'forma-spec.json'), 'utf8'));

function glob(pattern) {
  // Minimal glob: supports **/ and * in the last segment. Plain paths pass through.
  if (!/[*]/.test(pattern)) return fs.existsSync(pattern) ? [pattern] : [];
  const [base] = pattern.split(/[*]/); const dir = path.dirname(base + 'x');
  const rx = new RegExp('^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*\//g, '(?:.*/)?').replace(/\*/g, '[^/]*') + '$');
  const out = []; const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules' && !e.name.startsWith('.')) walk(p); } else if (rx.test(p)) out.push(p); } };
  if (fs.existsSync(dir)) walk(dir); return out;
}

const C = { red: (s) => `\x1b[31m${s}\x1b[0m`, yel: (s) => `\x1b[33m${s}\x1b[0m`, dim: (s) => `\x1b[2m${s}\x1b[0m`, grn: (s) => `\x1b[32m${s}\x1b[0m` };

if (cmd === 'lint') {
  const s = spec(); let errors = 0, warnings = 0;
  const cssArgs = []; const pats = []; let doFix = false;
  for (let i = 0; i < args.length; i++) { if (args[i] === '--css') cssArgs.push(args[++i]); else if (args[i] === '--fix') doFix = true; else pats.push(args[i]); }
  s.extraClasses = cssArgs.flatMap(glob).flatMap((f) => [...fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]));
  const files = pats.flatMap(glob);
  if (!files.length) { console.error('usage: forma lint <file|glob>…'); process.exit(2); }
  for (const f of files) {
    if (doFix) {
      const r = fix(fs.readFileSync(f, 'utf8'), s);
      if (r.fixed.length) { fs.writeFileSync(f, r.html); for (const x of r.fixed) console.log(`${C.grn('✓')} ${f}:${x.line}  ${x.from} → ${x.to} ${C.dim('fixed')}`); }
      for (const x of r.manual) console.log(`${C.yel('!')} ${f}:${x.line}  ${x.from} needs markup changes: ${x.to} ${C.dim('manual')}`);
    }
    for (const p of lint(fs.readFileSync(f, 'utf8'), s)) {
      if (p.severity === 'error') errors++; else warnings++;
      console.log(`${p.severity === 'error' ? C.red('✗') : C.yel('!')} ${f}:${p.line}  ${p.message} ${C.dim(p.rule)}`);
    }
  }
  console.log(errors + warnings ? `${errors} error(s), ${warnings} warning(s) in ${files.length} file(s)` : C.grn(`✓ ${files.length} file(s) clean`));
  process.exit(errors ? 1 : 0);
} else if (cmd === 'contrast') {
  const { contrast } = await import('../lib/color.mjs');
  const [a, b] = args; if (!a || !b) { console.error('usage: forma contrast <#fg> <#bg>'); process.exit(2); }
  const r = contrast(a, b); console.log(`${r.toFixed(2)}:1  AA text ${r >= 4.5 ? C.grn('pass') : C.red('fail')} · AA large/UI ${r >= 3 ? C.grn('pass') : C.red('fail')} · AAA ${r >= 7 ? C.grn('pass') : C.red('fail')}`);
} else if (cmd === 'theme') {
  const t = spec().themes.find((x) => x.id === args[0]);
  if (!t) { console.log(spec().themes.map((x) => `${x.id.padEnd(14)} ${x.category.padEnd(9)} ${x.name}`).join('\n')); process.exit(args[0] ? 1 : 0); }
  console.log(JSON.stringify(t, null, 2));
} else if (cmd === 'tokens') {
  const { exportTheme, FORMATS } = await import('../lib/tokens.mjs');
  const outIdx = args.indexOf('--out'); const out = outIdx >= 0 ? args.splice(outIdx, 2)[1] : null;
  const [format, themeId = 'museum'] = args;
  if (!FORMATS.includes(format)) { console.error(`usage: forma tokens <${FORMATS.join('|')}> [theme] [--out dir]`); process.exit(2); }
  let files; try { files = exportTheme(spec(), themeId, format); } catch (e) { console.error(e.message); process.exit(1); }
  if (!out) { for (const f of files) process.stdout.write(files.length > 1 ? `// ${f.file}\n${f.content}` : f.content); }
  else { fs.mkdirSync(out, { recursive: true }); for (const f of files) { fs.writeFileSync(path.join(out, f.file), f.content); console.log(C.grn('✓'), path.join(out, f.file)); } }
} else if (cmd === 'fonts') {
  const { selfHostTheme } = await import('../lib/fonts.mjs');
  const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : null; };
  const outDir = opt('--out') || 'forma-fonts';
  const subsets = opt('--subsets')?.split(',');
  const all = JSON.parse(fs.readFileSync(path.join(ROOT, 'themes/themes.json'), 'utf8')).themes;
  const ids = args.includes('all') ? all.map((t) => t.id) : args;
  if (!ids.length) { console.error('usage: forma fonts <theme…|all> [--out dir] [--subsets latin,latin-ext]'); process.exit(2); }
  for (const id of ids) {
    const t = all.find((x) => x.id === id);
    if (!t) { console.error(C.red(`unknown theme "${id}"`)); process.exitCode = 1; continue; }
    const specs = [...new Set(Object.values(t.fonts || {}).filter((f) => typeof f === 'object' && f.google).map((f) => f.google))];
    if (!specs.length) { console.log(C.dim(`${id}: fonts already self-hosted in forma.css`)); continue; }
    console.log(`${id}:`);
    try {
      const r = await selfHostTheme({ themeCss: fs.readFileSync(path.join(ROOT, 'dist/themes', `${id}.css`), 'utf8'), googleSpecs: specs, outDir, themeId: id, subsets });
      console.log(C.grn(`✓ ${path.join(outDir, id + '.css')}`) + C.dim(` + ${r.files} font file(s), ${r.kb} KB`));
    } catch (e) { console.error(C.red(`✗ ${id}: ${e.message}`)); process.exitCode = 1; }
  }
} else if (cmd === 'mcp') {
  const { serve } = await import('../mcp/server.mjs'); serve();
} else {
  console.log(`forma ${spec().version}\n\n  forma lint [--fix] [--css my.css] <glob>   check HTML against the FORMA spec (+ a11y basics);\n                            --fix rewrites v5 classes that have a 1:1 v6 replacement\n  forma contrast <fg> <bg>  WCAG contrast ratio\n  forma theme [id]          list themes or print one theme's tokens\n  forma tokens <dtcg|swift|kotlin|json> [theme] [--out dir]   export a theme for Figma, iOS, Android\n  forma fonts <theme…|all> [--out dir] [--subsets latin,latin-ext]   self-host a theme's fonts (no Google Fonts)\n  forma mcp                 start the MCP server on stdio`);
}
