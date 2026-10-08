#!/usr/bin/env node
// forma — CLI: lint, contrast, theme, mcp.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from '../lib/lint.mjs';

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
  const cssArgs = []; const pats = [];
  for (let i = 0; i < args.length; i++) { if (args[i] === '--css') cssArgs.push(args[++i]); else pats.push(args[i]); }
  s.extraClasses = cssArgs.flatMap(glob).flatMap((f) => [...fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]));
  const files = pats.flatMap(glob);
  if (!files.length) { console.error('usage: forma lint <file|glob>…'); process.exit(2); }
  for (const f of files) {
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
} else if (cmd === 'mcp') {
  const { serve } = await import('../mcp/server.mjs'); serve();
} else {
  console.log(`forma ${spec().version}\n\n  forma lint [--css my.css] <glob>   check HTML against the FORMA spec (+ a11y basics)\n  forma contrast <fg> <bg>  WCAG contrast ratio\n  forma theme [id]          list themes or print one theme's tokens\n  forma mcp                 start the MCP server on stdio`);
}
