// Smoke test for @nage/forma/react: a bundled app with tabs, a chart and a toast.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';

const APP = `
import { createElement as h, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FormaProvider, Chart, useFormaEvent, toast } from './react/index.js';
function App() {
  const ref = useRef(null); const [tab, setTab] = useState(-1); const [n, setN] = useState(3);
  useFormaEvent(ref, 'tab', (e) => setTab(e.detail.index));
  return h(FormaProvider, { mode: 'dark' },
    h('div', { ref, 'data-forma': 'tabs', className: 'tabs' },
      h('div', { role: 'tablist', className: 'tab-list', 'aria-label': 'Demo' },
        h('button', { role: 'tab', className: 'tab', 'aria-selected': 'true' }, 'A'), h('button', { role: 'tab', className: 'tab' }, 'B')),
      h('div', { role: 'tabpanel' }, 'A panel'), h('div', { role: 'tabpanel' }, 'B panel')),
    h('output', { id: 'tab' }, String(tab)),
    h('button', { id: 'more', onClick: () => setN(n + 1) }, 'More'),
    h(Chart, { id: 'ch', type: 'bar', labels: Array.from({ length: n }, (_, i) => 'L' + i), series: [{ name: 'S', values: Array.from({ length: n }, (_, i) => i + 1) }], title: 'Runs' }));
}
createRoot(document.getElementById('root')).render(h(App));
window.toastTest = () => toast.success('Saved');
`;

export async function runReactTest({ browser, esbuild, ROOT, ok }) {
  const entry = path.join(ROOT, '.react-test-entry.js');
  const out = path.join(os.tmpdir(), `forma-react-${process.pid}.js`);
  fs.writeFileSync(entry, APP);
  try {
    await esbuild.build({ entryPoints: [entry], bundle: true, outfile: out, format: 'iife', logLevel: 'silent', define: { 'process.env.NODE_ENV': '"production"' } });
  } finally { fs.rmSync(entry, { force: true }); }
  const html = '<!doctype html><html lang="en"><head><link rel="stylesheet" href="/forma.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>';
  const server = http.createServer((req, res) => {
    const map = { '/': ['text/html', html], '/app.js': ['text/javascript', fs.readFileSync(out)], '/forma.css': ['text/css', fs.readFileSync(path.join(ROOT, 'dist/forma.min.css'))] };
    const hit = map[req.url]; if (!hit) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': hit[0] }); res.end(hit[1]);
  }).listen(0);
  const page = await browser.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  try {
    await page.goto(`http://localhost:${server.address().port}/`);
    await page.waitForSelector('#ch .chart-bar');
    await page.waitForFunction(() => document.querySelector('[role=tab]')?.hasAttribute('aria-controls')); // FORMA has set the tabs up
    await page.locator('[role=tab]').nth(1).click();
    await page.waitForFunction(() => document.querySelector('#tab').textContent === '1', null, { timeout: 2000 }).catch(() => {});
    const tab = await page.locator('#tab').textContent();
    const mode = await page.evaluate(() => document.documentElement.dataset.mode);
    const bars1 = await page.locator('#ch .chart-bar').count();
    await page.click('#more'); await page.waitForTimeout(100);
    const bars2 = await page.locator('#ch .chart-bar').count();
    await page.evaluate(() => window.toastTest());
    const toasts = await page.locator('.toast').count();
    ok('react: provider, event hook, chart updates, toast', tab === '1' && mode === 'dark' && bars1 === 3 && bars2 === 4 && toasts === 1 && !errors.length, JSON.stringify({ tab, mode, bars1, bars2, toasts, errors }));
  } finally { await page.close(); server.close(); fs.rmSync(out, { force: true }); }
}
