#!/usr/bin/env node
// FORMA test suite. Run after `npm run build`.
//   1. contrast report has no failures
//   2. every site page passes `forma lint`
//   3. the linter catches what it should
//   4. MCP server answers over stdio
//   5. (if Playwright is available) every page loads without errors, axe finds no
//      serious/critical violations in light and dark.
//      Exclusion: .range-dual inputs overlap by design (two thumbs on one track); each is a
//      separate keyboard-operable control, so target-size is reviewed manually there.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { lint, fix } from '../lib/lint.mjs';
import { exportTheme } from '../lib/tokens.mjs';
import { parseGoogleSpec } from '../lib/fonts.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
let failed = 0;
const ok = (name, cond, detail = '') => { console.log(`${cond ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`); if (!cond) failed++; };

// 1. Contrast
const report = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/contrast-report.json'), 'utf8'));
ok('contrast: all theme × mode checks pass', report.failures.length === 0, `${report.checks} checks`);

// 1b. Package metadata matches the build (counts can't drift)
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/forma.manifest.json'), 'utf8'));
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const total = manifest.counts.components + manifest.counts.sectorComponents;
ok('package.json description matches the manifest', pkg.description.includes(`${manifest.counts.themes} `) && pkg.description.includes(`${total} `), pkg.description);
ok('package.json version matches the build', manifest.version === pkg.version);

// 2. Lint the site
const spec = JSON.parse(fs.readFileSync(path.join(ROOT, 'forma-spec.json'), 'utf8'));
spec.extraClasses = [...fs.readFileSync(path.join(SITE, 'assets/site.css'), 'utf8').matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]);
const pages = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'dist') walk(p); } else if (p.endsWith('.html')) pages.push(p); } };
walk(SITE);
const problems = pages.flatMap((p) => lint(fs.readFileSync(p, 'utf8'), spec).filter((x) => x.severity === 'error').map((x) => `${path.relative(SITE, p)}:${x.line} ${x.message}`));
ok(`lint: ${pages.length} site pages`, problems.length === 0, problems.slice(0, 5).join('; '));

// 3. Linter self-test
const bad = '<div class="kpi-card"><span class="kpi-trend kpi-up">+3</span></div><button class="btn btn-primry"><svg class="fi"></svg></button><input class="input" id="q"><div class="tab-item is-active">x</div>';
const found = lint(bad, spec).map((x) => x.rule);
ok('lint catches v5 classes', found.filter((r) => r === 'deprecated-class').length >= 3, found.join(','));
ok('lint catches typos', lint('<button class="btn btn-primry">x</button>', spec).some((x) => x.message.includes('btn-primary')));
ok('lint catches unnamed icon buttons', found.includes('accessible-name'));
ok('lint catches unlabeled inputs', found.includes('form-label'));
ok('lint ignores author classes', lint('<div class="hero my-thing"><p class="lede">x</p></div>', spec).length === 0);

// 3b. lint --fix
const fx = fix('<div class="modal-hd x">a</div><span class="pb-pro">b</span><div class="popover-wrap">c</div>', spec);
ok('lint --fix renames 1:1 v5 classes, keeps author classes', fx.html.includes('class="dialog-header x"') && fx.html.includes('class="badge badge-plan badge-accent"'), fx.html);
ok('lint --fix leaves markup changes for a human', fx.manual.some((m) => m.from === 'popover-wrap') && fx.html.includes('popover-wrap'));
ok('deprecated map has no HTML tag names', !['span', 'div', 'label', 'input'].some((t) => t in spec.deprecated));

// 3c. Token exports
const dt = JSON.parse(exportTheme(spec, 'museum', 'dtcg')[0].content);
ok('tokens: DTCG color has srgb components + hex', dt.color.accent.default.$value.colorSpace === 'srgb' && /^#[0-9A-F]{6}$/i.test(dt.color.accent.default.$value.hex));
ok('tokens: radius follows the theme scale', JSON.parse(exportTheme(spec, 'brutalist', 'dtcg')[0].content).radius.lg.$value.value === 0);
ok('tokens: Swift + Kotlin export every color', ['swift', 'kotlin'].every((f) => Object.keys(spec.themes[0].colors.light).every((k) => exportTheme(spec, 'museum', f)[0].content.includes(k.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())))));
ok('fonts: Google spec parsing', JSON.stringify(parseGoogleSpec('Lora:ital,wght@0,400;1,400').faces) === JSON.stringify([{ weight: 400, italic: false }, { weight: 400, italic: true }]));

// 4. MCP
await new Promise((resolve) => {
  const proc = spawn(process.execPath, [path.join(ROOT, 'mcp/server.mjs')], { stdio: ['pipe', 'pipe', 'inherit'] });
  const out = []; let buf = '';
  proc.stdout.on('data', (d) => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { out.push(JSON.parse(buf.slice(0, i))); buf = buf.slice(i + 1); } if (out.length === 4) { proc.kill(); done(); } });
  const send = (m) => proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', ...m }) + '\n');
  send({ id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '0' } } });
  send({ method: 'notifications/initialized' });
  send({ id: 2, method: 'tools/list' });
  send({ id: 3, method: 'tools/call', params: { name: 'get_component', arguments: { id: 'dialog' } } });
  send({ id: 4, method: 'tools/call', params: { name: 'validate_html', arguments: { html: '<div class="kpi-card"></div>' } } });
  const timer = setTimeout(() => { proc.kill(); done(); }, 5000);
  function done() {
    clearTimeout(timer);
    ok('mcp: initialize', out[0]?.result?.serverInfo?.name === 'forma');
    ok('mcp: tools/list', out[1]?.result?.tools?.length >= 6, `${out[1]?.result?.tools?.length} tools`);
    ok('mcp: get_component', out[2]?.result?.content?.[0]?.text.includes('"dialog"'));
    ok('mcp: validate_html flags v5 class', out[3]?.result?.content?.[0]?.text.includes('kpi-card'));
    resolve();
  }
});

// 5. Browser
let pw;
for (const p of ['playwright', '/opt/npm-tools/node_modules/playwright/index.js']) { try { pw = await import(p); break; } catch { /* try next */ } }
if (!pw) { console.log('– browser tests skipped (playwright not installed)'); }
else {
  const server = http.createServer((req, res) => {
    let f = path.join(SITE, decodeURIComponent(req.url.split('?')[0]));
    if (f.endsWith('/')) f += 'index.html';
    fs.readFile(f, (e, data) => { if (e) { res.writeHead(404); res.end(); return; } const ext = path.extname(f); res.writeHead(200, { 'content-type': { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' }[ext] || 'text/plain' }); res.end(data); });
  }).listen(0);
  const base = `http://localhost:${server.address().port}/`;
  const chromium = pw.chromium || pw.default?.chromium;
  const browser = await chromium.launch(process.env.PLAYWRIGHT_BROWSERS_PATH ? {} : { executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
  const axeSrc = fs.readFileSync(path.join(ROOT, 'node_modules/axe-core/axe.min.js'), 'utf8');
  const rel = pages.map((p) => path.relative(SITE, p).split(path.sep).join('/')).filter((p) => !p.startsWith('404'));
  const errors = []; const violations = {};
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
    for (const p of rel) {
      const page = await ctx.newPage();
      page.on('pageerror', (e) => errors.push(`${p}: ${e.message}`));
      page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g|net::|Failed to load resource/.test(m.text())) errors.push(`${p}: ${m.text()}`); });
      await page.goto(base + p, { waitUntil: 'load' });
      await page.addScriptTag({ content: axeSrc });
      const res = await page.evaluate(async () => (await window.axe.run({ exclude: [['.range-dual input']] }, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'], resultTypes: ['violations'] })).violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => ({ id: v.id, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) })));
      for (const v of res) (violations[v.id] ||= []).push(`${scheme}:${p} ${v.nodes.join(' | ')}`);
      await page.close();
    }
    await ctx.close();
  }
  ok(`browser: ${rel.length} pages × 2 modes load without JS errors`, errors.length === 0, errors.slice(0, 5).join('; '));
  const vids = Object.keys(violations);
  ok('axe: no serious/critical WCAG violations', vids.length === 0, vids.map((id) => `${id} (${violations[id].length}) e.g. ${violations[id][0]}`).join('\n    '));
  const { runInteractionTests } = await import('./test-interaction.mjs');
  await runInteractionTests({ browser, base, ok });

  // React bindings: bundle a tiny app and drive it.
  let esbuild; try { esbuild = await import('esbuild'); fs.accessSync(path.join(ROOT, 'node_modules/react')); } catch { esbuild = null; }
  if (!esbuild) console.log('– react test skipped (react not installed)');
  else {
    const { runReactTest } = await import('./test-react.mjs');
    await runReactTest({ browser, esbuild, ROOT, ok });
  }
  await browser.close(); server.close();
}

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
