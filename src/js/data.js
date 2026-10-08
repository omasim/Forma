// Table, tree, kanban, calendar, toolbar, TOC, gallery.
import { $, $$, h, ensureId, emit, announce, roving } from './util.js';
import { define } from './core.js';
import { dialog } from './overlays.js';

/* ── Table: sort, select, filter ─────────────────────────────────────────── */
export function table(t) {
  const tbody = t.tBodies[0]; if (!tbody) return;
  const wrap = t.closest('.table-wrap') || t.parentElement;
  const status = $('[data-table-status]', wrap);
  const rows = () => Array.from(tbody.rows);
  $$('th[aria-sort] .sort-btn', t).forEach((btn) => {
    const th = btn.closest('th'); const col = th.cellIndex;
    btn.addEventListener('click', () => {
      const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
      $$('th[aria-sort]', t).forEach((x) => x.setAttribute('aria-sort', x === th ? dir : 'none'));
      const val = (r) => { const c = r.cells[col]; const v = c?.dataset.value ?? c?.textContent.trim() ?? ''; const n = parseFloat(v.replace(/[^\d.-]/g, '')); return Number.isNaN(n) || /[a-z]/i.test(v.replace(/[\d.,\s%$€₺hm-]/gi, '')) ? v.toLowerCase() : n; };
      const sorted = rows().sort((a, b) => { const x = val(a), y = val(b); const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true }); return dir === 'ascending' ? r : -r; });
      tbody.append(...sorted);
      announce(`Sorted by ${btn.textContent.trim()}, ${dir}`);
      emit(t, 'sort', { column: col, direction: dir });
    });
  });
  const all = $('[data-select-all]', t);
  const boxes = () => $$('tbody input[type="checkbox"]', t);
  const sync = () => {
    const b = boxes(); const n = b.filter((x) => x.checked).length;
    b.forEach((x) => x.closest('tr')?.setAttribute('aria-selected', String(x.checked)));
    if (all) { all.checked = n === b.length && n > 0; all.indeterminate = n > 0 && n < b.length; }
    if (status) status.textContent = n ? `${n} of ${b.length} selected` : `${rows().filter((r) => !r.hidden).length} rows`;
    emit(t, 'select', { count: n });
  };
  all?.addEventListener('change', () => { boxes().forEach((x) => { x.checked = all.checked; }); sync(); });
  tbody.addEventListener('change', (e) => { if (e.target.matches('input[type="checkbox"]')) sync(); });
  const filter = $('[data-table-filter]', wrap);
  filter?.addEventListener('input', () => { const q = filter.value.trim().toLowerCase(); rows().forEach((r) => { r.hidden = q && !r.textContent.toLowerCase().includes(q); }); sync(); });
  if (boxes().length) sync();
}
define('table', table);

/* ── Tree ────────────────────────────────────────────────────────────────── */
export function tree(root) {
  const items = () => $$('[role="treeitem"]', root).filter((i) => !i.closest('[aria-expanded="false"] > [role="group"]'));
  const label = (i) => $(':scope > .tree-item', i) || i;
  $$('[role="treeitem"]', root).forEach((i, n) => { i.tabIndex = n === 0 ? 0 : -1; });
  const focus = (i) => { $$('[role="treeitem"]', root).forEach((x) => { x.tabIndex = x === i ? 0 : -1; }); i.focus(); };
  root.addEventListener('click', (e) => {
    const i = e.target.closest('[role="treeitem"]'); if (!i || !root.contains(i)) return;
    if (!label(i).contains(e.target)) return;
    if (i.hasAttribute('aria-expanded')) i.setAttribute('aria-expanded', String(i.getAttribute('aria-expanded') !== 'true'));
    $$('[aria-selected="true"]', root).forEach((x) => x.removeAttribute('aria-selected'));
    label(i).setAttribute('aria-selected', 'true'); focus(i);
    emit(root, 'select', { item: i });
  });
  root.addEventListener('keydown', (e) => {
    const i = document.activeElement.closest?.('[role="treeitem"]'); if (!i) return;
    const vis = items(), k = vis.indexOf(i);
    const exp = i.getAttribute('aria-expanded');
    const rtl = getComputedStyle(root).direction === 'rtl';
    const key = rtl ? ({ ArrowLeft: 'ArrowRight', ArrowRight: 'ArrowLeft' }[e.key] || e.key) : e.key;
    if (key === 'ArrowDown' && vis[k + 1]) focus(vis[k + 1]);
    else if (key === 'ArrowUp' && vis[k - 1]) focus(vis[k - 1]);
    else if (key === 'ArrowRight') { if (exp === 'false') i.setAttribute('aria-expanded', 'true'); else if (exp === 'true') { const c = $('[role="treeitem"]', i); if (c) focus(c); } }
    else if (key === 'ArrowLeft') { if (exp === 'true') i.setAttribute('aria-expanded', 'false'); else { const p = i.parentElement.closest('[role="treeitem"]'); if (p) focus(p); } }
    else if (key === 'Home') focus(vis[0]);
    else if (key === 'End') focus(vis[vis.length - 1]);
    else if (key === 'Enter' || key === ' ') label(i).click();
    else return;
    e.preventDefault();
  });
}
define('tree', tree);

/* ── Kanban: drag & drop + keyboard ──────────────────────────────────────── */
export function kanban(board) {
  const cols = () => $$('.kanban-col', board);
  const count = (c) => { const n = $('.kanban-count', c); if (n) n.textContent = $$('.kanban-card', c).length; };
  const insert = (col, card, before) => { const add = $('.kanban-add', col); col.insertBefore(card, before || add || null); };
  let dragging = null;
  board.addEventListener('dragstart', (e) => { const c = e.target.closest('.kanban-card'); if (!c) return; dragging = c; c.setAttribute('data-dragging', ''); e.dataTransfer.effectAllowed = 'move'; });
  board.addEventListener('dragend', () => { dragging?.removeAttribute('data-dragging'); dragging = null; cols().forEach((c) => c.removeAttribute('data-dragover')); });
  board.addEventListener('dragover', (e) => { const col = e.target.closest('.kanban-col'); if (!col || !dragging) return; e.preventDefault(); cols().forEach((c) => c.toggleAttribute('data-dragover', c === col)); });
  board.addEventListener('drop', (e) => {
    const col = e.target.closest('.kanban-col'); if (!col || !dragging) return; e.preventDefault();
    const from = dragging.closest('.kanban-col'); const over = e.target.closest('.kanban-card');
    insert(col, dragging, over && over !== dragging ? over : null); count(from); count(col);
    emit(board, 'move', { card: dragging, from, to: col });
  });
  $$('.kanban-card', board).forEach((c) => { c.draggable = true; c.setAttribute('aria-roledescription', 'draggable card'); });
  let lifted = null;
  board.addEventListener('keydown', (e) => {
    const card = e.target.closest('.kanban-card'); if (!card) return;
    const name = $('.kanban-card-title', card)?.textContent.trim() || 'Card';
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (lifted === card) { card.removeAttribute('aria-grabbed'); lifted = null; announce(`${name} dropped in ${card.closest('.kanban-col').getAttribute('aria-label')}`); emit(board, 'move', { card, to: card.closest('.kanban-col') }); } else { lifted?.removeAttribute('aria-grabbed'); lifted = card; card.setAttribute('aria-grabbed', 'true'); announce(`${name} lifted. Use arrow keys to move, Space to drop, Escape to cancel.`); } return; }
    if (e.key === 'Escape' && lifted) { lifted.removeAttribute('aria-grabbed'); lifted = null; announce('Move cancelled'); return; }
    if (lifted !== card) return;
    const cs = cols(), from = card.closest('.kanban-col'), ci = cs.indexOf(from);
    const rtl = getComputedStyle(board).direction === 'rtl';
    const dir = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
    if (dir) { const to = cs[ci + dir]; if (!to) return; e.preventDefault(); insert(to, card); count(from); count(to); card.focus(); announce(`Moved to ${to.getAttribute('aria-label')}`); }
    else if (e.key === 'ArrowUp' && card.previousElementSibling?.classList.contains('kanban-card')) { e.preventDefault(); from.insertBefore(card, card.previousElementSibling); card.focus(); }
    else if (e.key === 'ArrowDown' && card.nextElementSibling?.classList.contains('kanban-card')) { e.preventDefault(); from.insertBefore(card.nextElementSibling, card); card.focus(); }
  });
}
define('kanban', kanban);

/* ── Calendar (month) ────────────────────────────────────────────────────── */
export function calendar(root, opts = {}) {
  const locale = opts.locale || root.dataset.locale || document.documentElement.lang || undefined;
  const weekStart = Number(opts.weekStart ?? root.dataset.weekStart ?? 1);
  let events = opts.events || JSON.parse(root.dataset.events || '[]');
  const [y, m] = (opts.month || root.dataset.month || new Date().toISOString().slice(0, 7)).split('-').map(Number);
  let view = new Date(y, m - 1, 1);
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const render = () => {
    const offset = (view.getDay() - weekStart + 7) % 7; const start = new Date(view); start.setDate(1 - offset);
    const grid = h('div', { class: 'calendar-grid', role: 'grid' });
    const wd = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const head = h('div', { role: 'row', class: 'grid-row' }); grid.append(head);
    for (let i = 0; i < 7; i++) head.append(h('div', { class: 'calendar-weekday', role: 'columnheader', text: wd.format(new Date(2024, 0, 7 + weekStart + i)) }));
    let row;
    const today = iso(new Date());
    for (let i = 0; i < 42; i++) {
      if (i % 7 === 0) { row = h('div', { role: 'row', class: 'grid-row' }); grid.append(row); }
      const d = new Date(start); d.setDate(start.getDate() + i); const id = iso(d);
      const cell = h('div', { class: 'calendar-cell', role: 'gridcell', 'data-outside': d.getMonth() !== view.getMonth() || null, 'aria-current': id === today ? 'date' : null }, h('span', { class: 'calendar-date', text: d.getDate() }));
      for (const ev of events.filter((x) => x.date === id)) cell.append(h(ev.href ? 'a' : 'span', { class: 'calendar-event', 'data-tone': ev.tone, href: ev.href, text: ev.title }));
      row.append(cell);
    }
    const nav = (dir, label, g) => h('button', { type: 'button', class: 'btn btn-icon btn-ghost btn-sm', 'aria-label': label, text: g, onclick: () => { view.setMonth(view.getMonth() + dir); render(); } });
    root.replaceChildren(h('div', { class: 'calendar-head' }, h('h3', { class: 'calendar-title', 'aria-live': 'polite', text: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(view) }), h('div', { class: 'cluster gap-1' }, nav(-1, 'Previous month', '‹'), nav(1, 'Next month', '›'))), grid);
  };
  render();
  return { setEvents(list) { events = list; render(); } };
}
define('calendar', calendar);

/* ── Toolbar (roving) ────────────────────────────────────────────────────── */
define('toolbar', (tb) => {
  const items = () => $$('button, [role="button"]', tb);
  items().forEach((b, i) => { b.tabIndex = i ? -1 : 0; });
  roving(tb, items, { orientation: tb.getAttribute('aria-orientation') === 'vertical' ? 'vertical' : 'horizontal' });
});

/* ── TOC scroll-spy ──────────────────────────────────────────────────────── */
export function toc(nav, opts = {}) {
  let links = $$('a[href^="#"]', nav);
  if (nav.dataset.headings || opts.headings) {
    const scope = document.querySelector(nav.dataset.scope || 'main') || document.body;
    const hs = $$(opts.headings || nav.dataset.headings, scope);
    const list = h('ol', {}, hs.map((hd) => h('li', {}, h('a', { href: `#${ensureId(hd, 'sec')}`, text: hd.textContent.trim() }))));
    $('ol, ul', nav)?.replaceWith(list) || nav.append(list); links = $$('a', list);
  }
  const targets = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
  if (!targets.length) return;
  const bar = $('.toc-progress > span', nav);
  const io = new IntersectionObserver(() => {
    const y = 120; let current = targets[0];
    for (const t of targets) if (t.getBoundingClientRect().top - y <= 0) current = t;
    links.forEach((a) => a.removeAttribute('aria-current'));
    links.find((a) => a.hash === `#${current.id}`)?.setAttribute('aria-current', 'true');
  }, { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] });
  targets.forEach((t) => io.observe(t));
  if (bar) addEventListener('scroll', () => { const d = document.documentElement; bar.style.setProperty('--progress', `${Math.min(100, (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100)}%`); }, { passive: true });
}
define('toc', toc);

/* ── Gallery lightbox ────────────────────────────────────────────────────── */
define('gallery', (g) => {
  const items = $$('.gallery-item', g);
  let i = 0;
  const img = h('img', { alt: '' }), cap = h('p', { class: 'lightbox-caption' });
  const show = (n) => {
    i = (n + items.length) % items.length; const it = items[i];
    const src = it.dataset.full || it.querySelector('img')?.src || ''; img.src = src; img.alt = it.querySelector('img')?.alt || it.getAttribute('aria-label') || '';
    img.hidden = !src; cap.textContent = it.querySelector('.gallery-caption')?.textContent || it.getAttribute('aria-label') || '';
  };
  const d = h('dialog', { class: 'dialog lightbox', 'aria-label': g.getAttribute('aria-label') || 'Image viewer' },
    h('div', { class: 'dialog-body' }, img, cap),
    h('button', { class: 'btn btn-icon lightbox-nav lightbox-prev', 'aria-label': 'Previous image', text: '‹', onclick: () => show(i - 1) }),
    h('button', { class: 'btn btn-icon lightbox-nav lightbox-next', 'aria-label': 'Next image', text: '›', onclick: () => show(i + 1) }),
    h('button', { class: 'dialog-close', style: { position: 'absolute', insetBlockStart: '8px', insetInlineEnd: '8px' }, 'data-forma-close': '', 'aria-label': 'Close', text: '×' }));
  document.body.append(d);
  d.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
  items.forEach((it, n) => it.addEventListener('click', (e) => { e.preventDefault(); show(n); dialog.open(d); }));
});

/* ── Scrollable regions must be keyboard-reachable (WCAG 2.1.1) ─────────── */
define('scroll-region', (el) => {
  const check = () => { if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) { if (!el.hasAttribute('tabindex')) el.tabIndex = 0; } };
  check(); if (typeof ResizeObserver !== 'undefined') new ResizeObserver(check).observe(el);
}, 'pre.code-block, pre.log, .table-wrap, .kanban, .pipeline, .ticker, .tab-list, .command-list, .notification-list');
