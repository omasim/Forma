#!/usr/bin/env node
// Visual regression: one specimen (buttons, fields, card, alert, tabs, table, badges) rendered in
// every theme × mode and compared pixel by pixel with tests/visual/*.png.
//
//   node scripts/test-visual.mjs            compare with baselines (fails on differences)
//   node scripts/test-visual.mjs --update   write new baselines
//   node scripts/test-visual.mjs swiss      only themes whose id contains "swiss"
//
// Fonts are pinned to the self-hosted Museum faces and Google Fonts are blocked, so the result does
// not depend on the network or on the fonts installed on the machine. A theme's own typography is
// therefore not covered here; colors, borders, radii, spacing and theme `css` overrides are.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests/visual');
const args = process.argv.slice(2);
const update = args.includes('--update');
const only = args.find((a) => !a.startsWith('--'));
const THRESHOLD = 0.002; // share of pixels allowed to differ (anti-aliasing noise)

const themes = JSON.parse(fs.readFileSync(path.join(ROOT, 'themes/themes.json'), 'utf8')).themes.map((t) => t.id).filter((id) => !only || id.includes(only));

const specimen = (theme, mode) => `<!doctype html><html lang="en" data-mode="${mode}"${theme === 'museum' ? '' : ` data-theme="${theme}"`}><head><meta charset="utf-8">
<link rel="stylesheet" href="/dist/forma.min.css"><link rel="stylesheet" href="/dist/themes/${theme}.css">
<style>
  :root, [data-theme] { --font-display: 'Cormorant Variable', serif; --font-ui: 'Syne Variable', sans-serif; --font-mono: 'JetBrains Mono Variable', monospace; }
  *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
  body { margin: 0; padding: 24px; inline-size: 592px; }
</style></head><body>
<div class="stack" style="--gap: var(--space-4)">
  <h1 class="t-display-sm" style="margin:0">Specimen</h1>
  <div class="cluster" style="--gap: var(--space-2)">
    <button class="btn btn-primary">Primary</button><button class="btn btn-secondary">Secondary</button>
    <button class="btn btn-accent">Accent</button><button class="btn btn-ghost">Ghost</button><button class="btn btn-danger">Delete</button>
  </div>
  <div class="cluster" style="--gap: var(--space-2)">
    <span class="badge">Default</span><span class="badge badge-accent">Accent</span><span class="badge badge-success">Success</span><span class="badge badge-warning">Warning</span><span class="badge badge-error">Error</span>
    <input type="checkbox" class="checkbox" checked aria-label="a"><input type="radio" class="radio" checked aria-label="b"><input type="checkbox" class="switch" role="switch" checked aria-label="c">
  </div>
  <div class="field"><label class="field-label" for="i">Label</label><input class="input" id="i" value="Value"><p class="field-hint">Hint text</p></div>
  <div class="alert alert-info" role="status"><div class="alert-body"><p class="alert-title">Notice</p><p class="alert-text">Alert body text.</p></div></div>
  <div class="card"><div class="card-body"><h2 class="card-title">Card title</h2><p class="card-desc">Body text in secondary color. <a class="link" href="#">A link</a>.</p></div></div>
  <div class="tabs"><div role="tablist" class="tab-list"><button role="tab" class="tab" aria-selected="true">One</button><button role="tab" class="tab" aria-selected="false">Two</button></div></div>
  <table class="table"><thead><tr><th>Name</th><th class="num">Value</th></tr></thead><tbody><tr><td>Alpha</td><td class="num">1,204</td></tr><tr><td>Beta</td><td class="num">87</td></tr></tbody></table>
</div></body></html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/specimen') { res.writeHead(200, { 'content-type': 'text/html' }); res.end(specimen(url.searchParams.get('t'), url.searchParams.get('m'))); return; }
  const f = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!f.startsWith(path.join(ROOT, 'dist'))) { res.writeHead(404); res.end(); return; }
  fs.readFile(f, (e, data) => {
    if (e) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': { '.css': 'text/css', '.woff2': 'font/woff2' }[path.extname(f)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(0);
const base = `http://localhost:${server.address().port}`;

let pw;
for (const p of ['playwright', '/opt/npm-tools/node_modules/playwright/index.js']) { try { pw = await import(p); break; } catch { /* next */ } }
if (!pw) { console.error('playwright is not installed'); process.exit(1); }
const chromium = pw.chromium || pw.default.chromium;
const browser = await chromium.launch().catch(() => chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }));
const ctx = await browser.newContext({ viewport: { width: 640, height: 720 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
const page = await ctx.newPage();

fs.mkdirSync(OUT, { recursive: true });
const failed = [], written = [];
for (const theme of themes) {
  for (const mode of ['light', 'dark']) {
    await page.goto(`${base}/specimen?t=${theme}&m=${mode}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot({ fullPage: false });
    const file = path.join(OUT, `${theme}-${mode}.png`);
    if (update || !fs.existsSync(file)) { fs.writeFileSync(file, png); written.push(path.basename(file)); continue; }
    const diff = await page.evaluate(async ([a, b]) => {
      const load = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      if (ia.width !== ib.width || ia.height !== ib.height) return 1;
      const px = (img) => { const c = new OffscreenCanvas(img.width, img.height); const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, img.width, img.height).data; };
      const da = px(ia), db = px(ib); let n = 0;
      for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 24) n++;
      return n / (da.length / 4);
    }, [`data:image/png;base64,${fs.readFileSync(file).toString('base64')}`, `data:image/png;base64,${png.toString('base64')}`]);
    if (diff > THRESHOLD) { failed.push(`${theme}/${mode} ${(diff * 100).toFixed(2)}%`); fs.writeFileSync(path.join(OUT, `${theme}-${mode}.actual.png`), png); }
    else fs.rmSync(path.join(OUT, `${theme}-${mode}.actual.png`), { force: true });
  }
}
await browser.close(); server.close();

if (written.length) console.log(`wrote ${written.length} baseline(s) to tests/visual/`);
if (failed.length) {
  console.error(`✗ visual: ${failed.length} of ${themes.length * 2} differ from baseline (see tests/visual/*.actual.png):\n  ${failed.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ visual: ${themes.length} themes × 2 modes match their baselines`);
