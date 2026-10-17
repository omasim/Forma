// Dialog, popover positioning, menu, tooltip, toast, command palette, confirm().
import { $, $$, h, icon, uid, ensureId, emit, announce, roving, isRTL } from './util.js';
import { define } from './core.js';

/* ── Dialog ──────────────────────────────────────────────────────────────── */
export const dialog = {
  open(idOrEl) {
    const d = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
    if (!d || d.open) return d;
    d.showModal();
    emit(d, 'open');
    return d;
  },
  close(idOrEl, value) {
    const d = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
    if (d?.open) d.close(value);
    return d;
  },
};

let delegated = false;
export function setupDialogs() {
  if (delegated) return; delegated = true;
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-forma-open]');
    if (opener) { e.preventDefault(); const d = dialog.open(opener.dataset.formaOpen); if (d) opener.setAttribute('aria-expanded', 'true'); return; }
    const closer = e.target.closest('[data-forma-close]');
    if (closer) { const d = closer.closest('dialog'); if (d) { e.preventDefault(); dialog.close(d, closer.dataset.formaClose || ''); } return; }
    // Light dismiss: click on the ::backdrop (the dialog element itself, outside its box).
    if (e.target instanceof HTMLDialogElement && e.target.open && e.target.getAttribute('role') !== 'alertdialog' && !e.target.hasAttribute('data-static')) {
      const r = e.target.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(e.target);
    }
  });
  document.addEventListener('close', (e) => {
    if (!(e.target instanceof HTMLDialogElement)) return;
    $$(`[data-forma-open="${e.target.id}"]`).forEach((o) => o.setAttribute('aria-expanded', 'false'));
    emit(e.target, 'close', { value: e.target.returnValue });
  }, true);
}

/** Promise-based confirm built on a real <dialog>. */
export function confirm({ title = 'Are you sure?', text = '', confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false } = {}) {
  return new Promise((resolve) => {
    const tid = uid('ct'), did = uid('cd');
    const ok = h('button', { class: `btn ${danger ? 'btn-danger' : 'btn-primary'}`, 'data-forma-close': 'confirm', text: confirmLabel });
    const cancel = h('button', { class: 'btn btn-ghost', 'data-forma-close': 'cancel', text: cancelLabel, autofocus: danger });
    const d = h('dialog', { class: 'dialog dialog-sm', role: danger ? 'alertdialog' : 'dialog', 'aria-labelledby': tid, 'aria-describedby': text ? did : null },
      h('div', { class: 'dialog-header' }, h('div', {}, h('h2', { class: 'dialog-title', id: tid, text: title }), text ? h('p', { class: 'dialog-desc', id: did, text }) : null)),
      h('div', { class: 'dialog-footer' }, cancel, ok));
    document.body.append(d);
    d.addEventListener('close', () => { resolve(d.returnValue === 'confirm'); setTimeout(() => d.remove(), 400); }, { once: true });
    d.showModal();
    (danger ? cancel : ok).focus();
  });
}

/* ── Positioning ─────────────────────────────────────────────────────────── */
/** Place a fixed-position panel next to an anchor, flipping/shifting to stay in the viewport. */
export function position(panel, anchor, { placement = 'bottom-start', offset = 6, x, y } = {}) {
  // Take the panel out of the UA's centred popover layout first, so its measured size is final.
  Object.assign(panel.style, { position: 'fixed', margin: '0', insetInline: 'auto', insetBlock: 'auto' });
  // offset* ignores the opening scale animation, which getBoundingClientRect() would include.
  const pr = { width: panel.offsetWidth, height: panel.offsetHeight };
  const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
  let top, left;
  if (x != null) { top = y; left = x; }
  else {
    const ar = anchor.getBoundingClientRect();
    const rtl = isRTL(anchor);
    let [side, align = 'start'] = placement.split('-');
    if (rtl && align !== 'center') align = align === 'start' ? 'end' : 'start';
    if (side === 'bottom' && ar.bottom + offset + pr.height > vh && ar.top - offset - pr.height > 0) side = 'top';
    else if (side === 'top' && ar.top - offset - pr.height < 0) side = 'bottom';
    if (side === 'bottom' || side === 'top') {
      top = side === 'bottom' ? ar.bottom + offset : ar.top - offset - pr.height;
      left = align === 'start' ? ar.left : align === 'end' ? ar.right - pr.width : ar.left + ar.width / 2 - pr.width / 2;
    } else {
      left = side === 'right' ? ar.right + offset : ar.left - offset - pr.width;
      top = ar.top + ar.height / 2 - pr.height / 2;
    }
  }
  left = Math.max(8, Math.min(left, vw - pr.width - 8));
  top = Math.max(8, Math.min(top, vh - pr.height - 8));
  Object.assign(panel.style, { position: 'fixed', top: `${Math.round(top)}px`, left: `${Math.round(left)}px`, margin: '0', insetInline: 'auto', insetBlock: 'auto' });
  panel.style.top = `${Math.round(top)}px`; panel.style.left = `${Math.round(left)}px`;
}

/** Every [popover] opened by a popovertarget invoker gets positioned next to it. */
export function setupPopovers() {
  document.addEventListener('toggle', (e) => {
    const p = e.target;
    if (!(p instanceof HTMLElement) || !p.hasAttribute('popover') || e.newState !== 'open') return;
    if (p.classList.contains('tooltip') || p.dataset.place === 'none') return;
    const invoker = p._formaInvoker || document.querySelector(`[popovertarget="${p.id}"]`);
    if (p._formaPoint) { position(p, null, p._formaPoint); p._formaPoint = null; }
    else if (invoker) position(p, invoker, { placement: p.dataset.placement || 'bottom-start' });
    if (p.getAttribute('role') === 'menu') focusFirstItem(p);
  }, true);
  const reflow = () => $$('[popover]').forEach((p) => {
    if (!p.matches(':popover-open') || p.classList.contains('tooltip')) return;
    const inv = p._formaInvoker || document.querySelector(`[popovertarget="${p.id}"]`);
    if (inv) position(p, inv, { placement: p.dataset.placement || 'bottom-start' });
  });
  addEventListener('resize', reflow); addEventListener('scroll', reflow, true);
}

/* ── Menu ────────────────────────────────────────────────────────────────── */
const menuItems = (m) => $$('[role^="menuitem"]', m);
function focusFirstItem(m) { const first = menuItems(m).find((i) => i.getAttribute('aria-disabled') !== 'true'); first?.focus(); }
export function menu(m) {
  menuItems(m).forEach((i, n) => i.setAttribute('tabindex', n ? '-1' : '0'));
  roving(m, () => menuItems(m), { orientation: 'vertical', typeahead: true });
  m.addEventListener('click', (e) => {
    const item = e.target.closest('[role^="menuitem"]');
    if (!item || item.getAttribute('aria-disabled') === 'true') return;
    if (item.getAttribute('role') === 'menuitemcheckbox') { item.setAttribute('aria-checked', String(item.getAttribute('aria-checked') !== 'true')); return; }
    if (item.getAttribute('role') === 'menuitemradio') { menuItems(m).filter((i) => i.getAttribute('role') === 'menuitemradio').forEach((i) => i.setAttribute('aria-checked', String(i === item))); }
    emit(m, 'select', { item, value: item.dataset.value ?? item.textContent.trim() });
    m.hidePopover?.();
  });
  m.addEventListener('keydown', (e) => { if (e.key === 'Tab') m.hidePopover?.(); });
  m.addEventListener('toggle', (e) => {
    if (e.newState === 'closed') { const inv = m._formaInvoker || document.querySelector(`[popovertarget="${m.id}"]`); if (m.contains(document.activeElement) || document.activeElement === document.body) inv?.focus(); }
  });
}
define('menu', menu, '[role="menu"][popover]');
// Context menus: data-forma="context-menu" data-menu="menu-id"
define('context-menu', (area) => {
  area.addEventListener('contextmenu', (e) => {
    const m = document.getElementById(area.dataset.menu); if (!m) return;
    e.preventDefault(); m._formaPoint = { x: e.clientX, y: e.clientY }; m._formaInvoker = area; m.showPopover();
  });
});

/* ── Tooltip ─────────────────────────────────────────────────────────────── */
export function tooltip(el) {
  const text = el.dataset.tooltip; if (!text) return;
  const tip = h('div', { class: 'tooltip', role: 'tooltip', id: uid('tt'), popover: 'manual', text });
  document.body.append(tip);
  el.setAttribute('data-tooltip-ready', '');
  const desc = el.getAttribute('aria-describedby');
  if (!el.getAttribute('aria-label') || el.getAttribute('aria-label') !== text) el.setAttribute('aria-describedby', [desc, tip.id].filter(Boolean).join(' '));
  let t;
  const show = () => { clearTimeout(t); t = setTimeout(() => { if (!tip.isConnected) return; tip.showPopover?.(); position(tip, el, { placement: el.dataset.tooltipPlacement || 'top-center', offset: 8 }); }, 250); };
  const hide = () => { clearTimeout(t); try { tip.hidePopover?.(); } catch { /* already hidden */ } };
  el.addEventListener('pointerenter', show); el.addEventListener('pointerleave', hide);
  el.addEventListener('focus', show); el.addEventListener('blur', hide);
  el.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
  tip.addEventListener('pointerenter', () => clearTimeout(t)); tip.addEventListener('pointerleave', hide); // hoverable (WCAG 1.4.13)
}
define('tooltip', tooltip, '[data-tooltip]');

/* ── Toast ───────────────────────────────────────────────────────────────── */
const ICONS = { success: 'check-circle', error: 'x-circle', warning: 'warning', info: 'info' };
function region(position = 'bottom-end') {
  let r = document.querySelector(`.toast-region[data-position="${position}"]`);
  if (!r) { r = h('section', { class: 'toast-region', 'data-position': position, 'aria-label': 'Notifications' }); document.body.append(r); }
  return r;
}
export function toast(opts = {}) {
  if (typeof opts === 'string') opts = { title: opts };
  const { type = 'info', title = '', text = opts.message || '', duration = type === 'error' ? 8000 : 5000, action, position: pos, dismissible = true } = opts;
  const el = h('div', { class: `toast toast-${type}`, role: type === 'error' ? 'alert' : 'status', style: { '--duration-toast': `${duration}ms` } },
    icon(ICONS[type] || 'info'),
    h('div', { class: 'toast-body' }, title ? h('p', { class: 'toast-title', text: title }) : null, text ? h('p', { class: 'toast-text', text }) : null,
      action ? h('div', { class: 'toast-action' }, h('button', { class: 'btn btn-sm btn-soft', text: action.label, onclick: () => { action.onClick?.(); dismiss(); } })) : null),
    dismissible ? h('button', { class: 'toast-close', 'aria-label': 'Dismiss', onclick: () => dismiss() }, icon('x')) : null,
    duration > 0 ? h('span', { class: 'toast-timer', 'aria-hidden': 'true' }) : null);
  region(pos).append(el);
  let timer, remaining = duration, started = Date.now();
  const start = () => { if (duration > 0) { started = Date.now(); timer = setTimeout(dismiss, remaining); } };
  const pause = () => { clearTimeout(timer); remaining -= Date.now() - started; };
  el.addEventListener('pointerenter', pause); el.addEventListener('pointerleave', start);
  el.addEventListener('focusin', pause); el.addEventListener('focusout', start);
  function dismiss() {
    clearTimeout(timer); if (!el.isConnected) return;
    el.setAttribute('data-leaving', '');
    const remove = () => el.remove();
    el.addEventListener('animationend', remove, { once: true }); setTimeout(remove, 400);
  }
  start();
  return { el, dismiss };
}
for (const t of ['success', 'error', 'warning', 'info']) toast[t] = (title, text, opts = {}) => toast({ ...opts, type: t, title, text });

/* ── Command palette ─────────────────────────────────────────────────────── */
export function command(d) {
  const input = $('.command-input input', d), list = $('.command-list', d), empty = $('.command-empty', d);
  if (!input || !list) return;
  ensureId(list, 'cmdl');
  input.setAttribute('role', 'combobox'); input.setAttribute('aria-controls', list.id); input.setAttribute('aria-expanded', 'true'); input.setAttribute('aria-autocomplete', 'list');
  const items = () => $$('.command-item', list).filter((i) => !i.hidden);
  let active = 0;
  const setActive = (n) => {
    const all = items(); if (!all.length) { input.removeAttribute('aria-activedescendant'); return; }
    active = (n + all.length) % all.length;
    all.forEach((i, k) => { ensureId(i, 'cmdi'); i.toggleAttribute('data-active', k === active); i.setAttribute('aria-selected', String(k === active)); });
    input.setAttribute('aria-activedescendant', all[active].id); all[active].scrollIntoView({ block: 'nearest' });
  };
  const filter = () => {
    const q = input.value.trim().toLowerCase();
    $$('.command-item', list).forEach((i) => { i.hidden = q && !fuzzy(i.textContent.toLowerCase(), q); });
    $$('.command-group', list).forEach((g) => { let n = g.nextElementSibling, any = false; while (n && !n.classList.contains('command-group')) { if (n.classList.contains('command-item') && !n.hidden) any = true; n = n.nextElementSibling; } g.hidden = !any; });
    const count = items().length; if (empty) empty.hidden = count > 0;
    setActive(0); announce(`${count} result${count === 1 ? '' : 's'}`);
  };
  input.addEventListener('input', filter);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); items()[active]?.click(); }
  });
  list.addEventListener('click', (e) => { const it = e.target.closest('.command-item'); if (!it) return; emit(d, 'command', { item: it, value: it.dataset.value ?? it.textContent.trim() }); d.close(it.dataset.value || ''); });
  list.addEventListener('pointermove', (e) => { const it = e.target.closest('.command-item'); if (it) setActive(items().indexOf(it)); });
  d.addEventListener('forma:open', () => { input.value = ''; filter(); input.focus(); });
  const hk = (d.dataset.hotkey || 'mod+k').toLowerCase();
  document.addEventListener('keydown', (e) => {
    const [mod, key] = hk.includes('+') ? hk.split('+') : [null, hk];
    if (e.key.toLowerCase() === key && (!mod || e.metaKey || e.ctrlKey)) { e.preventDefault(); d.open ? d.close() : dialog.open(d); }
  });
}
function fuzzy(text, q) { let i = 0; for (const c of text) if (c === q[i]) i++; return i === q.length; }
define('command', command);
