// Shared helpers. No globals, no innerHTML with user data.
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
let n = 0;
export const uid = (p = 'f') => `${p}-${(++n).toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
export const ensureId = (el, p) => (el.id ||= uid(p));
export const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(`forma:${name}`, { bubbles: true, detail }));
export const isRTL = (el) => getComputedStyle(el).direction === 'rtl';

export const storage = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* private mode / blocked */ } },
};

const FOCUSABLE = 'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
export const focusables = (root) => $$(FOCUSABLE, root).filter((el) => el.offsetParent !== null || el.getClientRects().length);

/** Screen-reader announcements through two shared live regions. */
let regions;
export function announce(text, politeness = 'polite') {
  if (!regions) {
    regions = {};
    for (const p of ['polite', 'assertive']) {
      const r = document.createElement('div');
      r.className = 'sr-only'; r.setAttribute('aria-live', p); r.setAttribute('aria-atomic', 'true');
      document.body.append(r); regions[p] = r;
    }
  }
  const r = regions[politeness] || regions.polite;
  r.textContent = '';
  setTimeout(() => { r.textContent = text; }, 30);
}

export function formatBytes(bytes, locale) {
  if (!Number.isFinite(bytes)) return '';
  const u = ['B', 'KB', 'MB', 'GB', 'TB']; let i = 0; let v = bytes;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: i ? 1 : 0 }).format(v)} ${u[i]}`;
}

/** Build an element: h('span', { class: 'x', text: 'hi' }, child) — text is always textContent. */
export function h(tag, props = {}, ...children) {
  const el = document.createElementNS(tag.startsWith('svg:') ? 'http://www.w3.org/2000/svg' : 'http://www.w3.org/1999/xhtml', tag.replace('svg:', ''));
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'text') el.textContent = v;
    else if (k === 'class') el.setAttribute('class', v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c != null) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return el;
}

export function icon(name, cls = '') {
  const svg = h('svg:svg', { class: `fi ${cls}`.trim(), 'aria-hidden': 'true' });
  svg.append(h('svg:use', { href: `${iconBase()}#fi-${name}` }));
  return svg;
}
let base;
export function iconBase() {
  if (base !== undefined) return base;
  // Inline sprite on the page wins; otherwise resolve next to forma.js / forma.css.
  if (document.getElementById('forma-icons')) return (base = '');
  const link = document.querySelector('link[href*="forma"][href$=".css"]');
  base = link ? new URL('forma-icons.svg', link.href).href : '';
  return base;
}

/** Roving tabindex + arrow-key navigation for a set of items. */
export function roving(container, itemsFn, { orientation = 'both', loop = true, onMove, typeahead = false } = {}) {
  let buffer = '', timer;
  container.addEventListener('keydown', (e) => {
    const items = itemsFn().filter((i) => !i.hasAttribute('disabled') && i.getAttribute('aria-disabled') !== 'true');
    const idx = items.indexOf(document.activeElement);
    if (idx < 0) return;
    const rtl = isRTL(container);
    const next = { ArrowDown: orientation !== 'horizontal' ? 1 : 0, ArrowUp: orientation !== 'horizontal' ? -1 : 0,
      ArrowRight: orientation !== 'vertical' ? (rtl ? -1 : 1) : 0, ArrowLeft: orientation !== 'vertical' ? (rtl ? 1 : -1) : 0 }[e.key];
    let target;
    if (next) { target = items[loop ? (idx + next + items.length) % items.length : Math.min(items.length - 1, Math.max(0, idx + next))]; }
    else if (e.key === 'Home') target = items[0];
    else if (e.key === 'End') target = items[items.length - 1];
    else if (typeahead && e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      clearTimeout(timer); buffer += e.key.toLowerCase(); timer = setTimeout(() => { buffer = ''; }, 500);
      target = items.slice(idx + 1).concat(items.slice(0, idx + 1)).find((i) => i.textContent.trim().toLowerCase().startsWith(buffer));
    }
    if (target) {
      e.preventDefault();
      items.forEach((i) => i.setAttribute('tabindex', i === target ? '0' : '-1'));
      target.focus(); onMove?.(target, e);
    }
  });
}
