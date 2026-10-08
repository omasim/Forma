// Component registry, auto-init, color mode and theme switching.
import { $$, storage, emit } from './util.js';

const registry = new Map(); // name → init(el)
const done = new WeakMap(); // el → Set(names)

/** Register a declarative component: elements with data-forma~="name" (or a custom selector). */
export function define(name, init, selector = `[data-forma~="${name}"]`) {
  registry.set(name, { init, selector });
}

export function init(root = document) {
  for (const [name, { init: fn, selector }] of registry) {
    const els = root.matches?.(selector) ? [root, ...$$(selector, root)] : $$(selector, root);
    for (const el of els) {
      let s = done.get(el); if (!s) done.set(el, (s = new Set()));
      if (s.has(name)) continue;
      s.add(name);
      try { fn(el); } catch (err) { console.error(`[forma] ${name} failed to init`, el, err); }
    }
  }
}

let observer;
export function observe() {
  if (observer || typeof MutationObserver === 'undefined') return;
  let queued = false; const pending = new Set();
  observer = new MutationObserver((records) => {
    for (const r of records) for (const n of r.addedNodes) if (n.nodeType === 1) pending.add(n);
    if (queued) return; queued = true;
    requestAnimationFrame(() => { queued = false; for (const n of pending) if (n.isConnected) init(n); pending.clear(); });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

/* ── Color mode ──────────────────────────────────────────────────────────── */
const MODE_KEY = 'forma-mode';
const mql = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
export const mode = {
  /** 'light' | 'dark' | 'system' */
  get preference() { return storage.get(MODE_KEY) || 'system'; },
  /** The mode actually in effect. */
  get current() {
    const forced = document.documentElement.dataset.mode;
    if (forced === 'light' || forced === 'dark') return forced;
    return mql?.matches ? 'dark' : 'light';
  },
  set(value = 'system', { persist = true } = {}) {
    const root = document.documentElement;
    if (value === 'system') delete root.dataset.mode; else root.dataset.mode = value;
    if (persist) storage.set(MODE_KEY, value === 'system' ? null : value);
    $$('[data-forma~="mode-toggle"]').forEach(syncToggle);
    emit(root, 'mode', { mode: mode.current, preference: value });
    return mode.current;
  },
  toggle() { return mode.set(mode.current === 'dark' ? 'light' : 'dark'); },
};
function syncToggle(btn) {
  btn.setAttribute('aria-pressed', String(mode.current === 'dark'));
  const label = btn.querySelector('[data-mode-label]');
  if (label) label.textContent = mode.current === 'dark' ? (btn.dataset.labelDark || 'Dark') : (btn.dataset.labelLight || 'Light');
}
mql?.addEventListener?.('change', () => { if (mode.preference === 'system') { $$('[data-forma~="mode-toggle"]').forEach(syncToggle); emit(document.documentElement, 'mode', { mode: mode.current, preference: 'system' }); } });
export function restoreMode() {
  const p = storage.get(MODE_KEY);
  if (p === 'light' || p === 'dark') document.documentElement.dataset.mode = p;
}
define('mode-toggle', (btn) => { syncToggle(btn); btn.addEventListener('click', () => mode.toggle()); });

/* ── Theme ───────────────────────────────────────────────────────────────── */
const THEME_KEY = 'forma-theme';
export const theme = {
  get current() { const t = document.documentElement.dataset.theme; return !t || t === 'light' || t === 'dark' ? 'museum' : t; },
  /**
   * Apply a theme by id. If the theme CSS is not loaded yet, a <link> is added,
   * resolved from `base` (default: the folder of the loaded forma.css + "themes/").
   */
  async set(id, { base, persist = true } = {}) {
    const root = document.documentElement;
    if (!id || id === 'museum') { delete root.dataset.theme; if (persist) storage.set(THEME_KEY, null); emit(root, 'theme', { theme: 'museum' }); return; }
    const all = document.querySelector('link[href*="forma-themes"]');
    if (!all && !document.querySelector(`link[data-forma-theme="${id}"]`)) {
      const core = document.querySelector('link[href*="forma"][href$=".css"]');
      const href = new URL(`${id}.css`, base || (core ? new URL('themes/', core.href) : location.href)).href;
      const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href });
      link.dataset.formaTheme = id;
      await new Promise((res) => { link.onload = link.onerror = res; document.head.append(link); });
    }
    root.dataset.theme = id;
    if (persist) storage.set(THEME_KEY, id);
    emit(root, 'theme', { theme: id });
  },
  restore(opts) { const t = storage.get(THEME_KEY); if (t) return theme.set(t, { ...opts, persist: false }); },
};
