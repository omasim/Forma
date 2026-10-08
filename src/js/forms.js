// Tabs, form controls, validation, wizard, combobox, date picker.
import { $, $$, h, ensureId, emit, announce, roving, formatBytes } from './util.js';
import { define } from './core.js';

/* ── Tabs ────────────────────────────────────────────────────────────────── */
export function tabs(root) {
  const list = $('[role="tablist"]', root); if (!list) return;
  const tabEls = $$('[role="tab"]', list).filter((t) => t.closest('[role="tablist"]') === list);
  const panels = $$(':scope > [role="tabpanel"]', root);
  if (root.classList.contains('tabs-vertical')) list.setAttribute('aria-orientation', 'vertical');
  tabEls.forEach((t, i) => {
    ensureId(t, 'tab'); const p = panels[i]; if (p) { ensureId(p, 'tp'); t.setAttribute('aria-controls', p.id); p.setAttribute('aria-labelledby', t.id); if (!p.querySelector('a,button,input,select,textarea,[tabindex]')) p.tabIndex = 0; }
  });
  const select = (i, focus = false) => {
    tabEls.forEach((t, k) => { const on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (panels[k]) panels[k].hidden = !on; });
    if (focus) tabEls[i].focus();
    emit(root, 'tab', { index: i, tab: tabEls[i] });
  };
  const initial = Math.max(0, tabEls.findIndex((t) => t.getAttribute('aria-selected') === 'true'));
  select(initial);
  list.addEventListener('click', (e) => { const t = e.target.closest('[role="tab"]'); if (t && tabEls.includes(t)) select(tabEls.indexOf(t)); });
  roving(list, () => tabEls, { orientation: list.getAttribute('aria-orientation') === 'vertical' ? 'vertical' : 'horizontal', onMove: (t) => select(tabEls.indexOf(t)) });
  return { select };
}
define('tabs', tabs);

/* ── Toggle groups & pressed state ───────────────────────────────────────── */
if (typeof document !== 'undefined') document.addEventListener('click', (e) => {
  const b = e.target.closest?.('.btn-group > [aria-pressed], .segmented > button[aria-pressed], [role="group"] > .tag[aria-pressed], .swatches > [aria-pressed], .slots > [aria-pressed], .tag[aria-pressed], .toolbar-btn[aria-pressed], .product-fav[aria-pressed]');
  if (!b || b.disabled) return;
  const group = b.parentElement;
  const exclusive = group.matches('.btn-group, .segmented, .swatches, .slots, [data-exclusive]');
  if (exclusive) $$(':scope > [aria-pressed]', group).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  else b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
  emit(b, 'toggle', { pressed: b.getAttribute('aria-pressed') === 'true' });
});

/* ── Small controls ──────────────────────────────────────────────────────── */
define('indeterminate', (el) => { el.indeterminate = true; }, 'input[data-indeterminate]');

define('range', (r) => {
  const out = r.closest('.field')?.querySelector('output');
  const sync = () => { const pct = ((r.value - (r.min || 0)) / ((r.max || 100) - (r.min || 0))) * 100; r.style.setProperty('--_pct', `${pct}%`); if (out) out.value = r.value; };
  r.addEventListener('input', sync); sync();
}, 'input.range:not(.range-dual input)');

define('range-dual', (wrap) => {
  const [lo, hi] = $$('input[type="range"]', wrap); if (!lo || !hi) return;
  const out = wrap.closest('.field')?.querySelector('output');
  const fmt = wrap.dataset.format || '';
  const sync = (e) => {
    if (+lo.value > +hi.value) { if (e?.target === lo) lo.value = hi.value; else hi.value = lo.value; }
    const span = (+lo.max || 100) - (+lo.min || 0);
    wrap.style.setProperty('--_lo', `${((lo.value - (lo.min || 0)) / span) * 100}%`);
    wrap.style.setProperty('--_hi', `${((hi.value - (hi.min || 0)) / span) * 100}%`);
    if (out) out.value = fmt ? `${fmt}${lo.value} – ${fmt}${hi.value}` : `${lo.value} – ${hi.value}`;
  };
  lo.addEventListener('input', sync); hi.addEventListener('input', sync); sync();
});

define('stepper', (s) => {
  const input = $('input', s);
  s.addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]'); if (!b) return;
    const step = Number(input.step) || 1, dir = Number(b.dataset.step);
    let v = (Number(input.value) || 0) + dir * step;
    if (input.min !== '') v = Math.max(Number(input.min), v);
    if (input.max !== '') v = Math.min(Number(input.max), v);
    input.value = v; input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true }));
  });
});

define('otp', (g) => {
  const inputs = $$('input', g);
  const done = () => { const v = inputs.map((i) => i.value).join(''); if (v.length === inputs.length) emit(g, 'complete', { value: v }); };
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/\s/g, '').slice(-1); if (inp.value && inputs[i + 1]) inputs[i + 1].focus(); done(); });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !inp.value && inputs[i - 1]) { inputs[i - 1].focus(); inputs[i - 1].value = ''; e.preventDefault(); }
      if (e.key === 'ArrowLeft' && inputs[i - 1]) inputs[i - 1].focus();
      if (e.key === 'ArrowRight' && inputs[i + 1]) inputs[i + 1].focus();
    });
    inp.addEventListener('paste', (e) => {
      const text = (e.clipboardData?.getData('text') || '').replace(/\s/g, ''); if (!text) return;
      e.preventDefault(); inputs.slice(i).forEach((x, k) => { x.value = text[k] || ''; });
      inputs[Math.min(inputs.length - 1, i + text.length)].focus(); done();
    });
  });
});

define('counter', (c) => {
  const input = document.getElementById(c.dataset.counterFor); if (!input) return;
  const max = Number(input.maxLength > 0 ? input.maxLength : c.dataset.max);
  const sync = () => { const n = input.value.length; c.textContent = max ? `${n} / ${max}` : String(n); c.classList.toggle('is-over', max && n >= max); };
  input.addEventListener('input', sync); sync();
}, '[data-counter-for]');

define('dropzone', (z) => {
  const input = $('input[type="file"]', z); if (!input) return;
  const fire = (files) => emit(z, 'files', { files: Array.from(files || []) });
  ['dragenter', 'dragover'].forEach((t) => z.addEventListener(t, (e) => { e.preventDefault(); z.setAttribute('data-dragover', ''); }));
  ['dragleave', 'dragend', 'drop'].forEach((t) => z.addEventListener(t, () => z.removeAttribute('data-dragover')));
  z.addEventListener('drop', (e) => { e.preventDefault(); if (e.dataTransfer?.files?.length) { try { input.files = e.dataTransfer.files; } catch { /* read-only in some browsers */ } fire(e.dataTransfer.files); } });
  input.addEventListener('change', () => fire(input.files));
});

define('copy', (b) => {
  b.addEventListener('click', async () => {
    const target = b.dataset.copyTarget ? document.querySelector(b.dataset.copyTarget) : null;
    const text = b.dataset.copyText ?? target?.innerText ?? b.closest('.message-body, .code-block, pre')?.innerText ?? '';
    try { await navigator.clipboard.writeText(text); } catch { return; }
    const label = b.getAttribute('aria-label'); const orig = b.textContent;
    if (!b.querySelector('svg')) b.textContent = b.dataset.copiedLabel || 'Copied';
    announce('Copied to clipboard');
    setTimeout(() => { if (!b.querySelector('svg')) b.textContent = orig; if (label) b.setAttribute('aria-label', label); }, 1600);
  });
});

define('reveal', (b) => {
  const holder = b.parentElement.querySelector('[data-secret]'); if (!holder) return;
  const masked = holder.textContent;
  b.addEventListener('click', () => { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); holder.textContent = on ? holder.dataset.secret : masked; b.textContent = on ? 'Hide' : 'Show'; });
});

define('dismiss', (b) => {
  b.addEventListener('click', () => { const t = b.closest('.alert, .callout, .toast, .chip, .upsell, [data-dismissible]'); if (!t) return; const next = t.nextElementSibling?.querySelector?.('button, a') || null; t.remove(); next?.focus(); emit(document, 'dismiss', { el: t }); });
});

define('sidebar-toggle', (b) => {
  const sb = document.getElementById(b.dataset.target) || b.closest('.sidebar'); if (!sb) return;
  const labelItems = () => $$('.sidebar-item', sb).forEach((i) => { const l = $('.sidebar-label', i); if (l && !i.dataset.tooltip) i.setAttribute('aria-label', l.textContent.trim()); });
  b.addEventListener('click', () => { const c = !sb.hasAttribute('data-collapsed'); sb.toggleAttribute('data-collapsed', c); b.setAttribute('aria-expanded', String(!c)); labelItems(); });
});

/* ── Validation (constraint API + localized messages) ────────────────────── */
const MESSAGES = {
  en: { valueMissing: 'This field is required', typeMismatch: { email: 'Enter a valid e-mail address', url: 'Enter a valid URL', _: 'Invalid format' }, tooShort: (el) => `Use at least ${el.minLength} characters`, tooLong: (el) => `Use at most ${el.maxLength} characters`, rangeUnderflow: (el) => `Must be ${el.min} or more`, rangeOverflow: (el) => `Must be ${el.max} or less`, patternMismatch: (el) => el.title || 'Invalid format', stepMismatch: 'Invalid value', badInput: 'Enter a number', mismatch: 'Fields do not match', summary: (n) => `${n} field${n === 1 ? '' : 's'} need${n === 1 ? 's' : ''} attention`, strength: ['', 'Weak', 'Fair', 'Good', 'Strong'] },
  tr: { valueMissing: 'Bu alan zorunludur', typeMismatch: { email: 'Geçerli bir e-posta adresi girin', url: 'Geçerli bir URL girin', _: 'Geçersiz biçim' }, tooShort: (el) => `En az ${el.minLength} karakter olmalı`, tooLong: (el) => `En fazla ${el.maxLength} karakter olmalı`, rangeUnderflow: (el) => `En az ${el.min} olmalı`, rangeOverflow: (el) => `En fazla ${el.max} olmalı`, patternMismatch: (el) => el.title || 'Geçersiz biçim', stepMismatch: 'Geçersiz değer', badInput: 'Bir sayı girin', mismatch: 'Alanlar eşleşmiyor', summary: (n) => `${n} alan düzeltilmeli`, strength: ['', 'Zayıf', 'Orta', 'İyi', 'Güçlü'] },
};
const msgs = () => MESSAGES[validate.locale] || MESSAGES[(document.documentElement.lang || 'en').slice(0, 2)] || MESSAGES.en;

function messageFor(el) {
  const v = el.validity, m = msgs();
  if (el.dataset.match) { const other = document.querySelector(el.dataset.match); if (other && other.value !== el.value) return m.mismatch; }
  for (const k of ['valueMissing', 'typeMismatch', 'tooShort', 'tooLong', 'rangeUnderflow', 'rangeOverflow', 'patternMismatch', 'stepMismatch', 'badInput']) {
    if (!v[k]) continue;
    const msg = m[k];
    if (k === 'typeMismatch') return msg[el.type] || msg._;
    return typeof msg === 'function' ? msg(el) : msg;
  }
  return '';
}

export function validateField(el) {
  if (!el.willValidate) return true;
  if (el.dataset.match) { const other = document.querySelector(el.dataset.match); el.setCustomValidity(other && other.value !== el.value ? msgs().mismatch : ''); }
  const field = el.closest('.field') || el.parentElement;
  const msg = el.checkValidity() ? '' : messageFor(el);
  let out = field.querySelector('.field-message[data-forma-msg]');
  if (msg) {
    if (!out) { out = h('p', { class: 'field-message field-message-error', 'data-forma-msg': '', id: `${ensureId(el, 'fld')}-msg` }); field.append(out); }
    out.textContent = msg;
    el.setAttribute('aria-invalid', 'true');
    const d = new Set((el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean)); d.add(out.id); el.setAttribute('aria-describedby', [...d].join(' '));
  } else {
    out?.remove(); el.removeAttribute('aria-invalid');
  }
  return !msg;
}

export function validate(form) {
  form.noValidate = true;
  const fields = () => $$('input, select, textarea', form).filter((f) => f.willValidate);
  form.addEventListener('blur', (e) => { if (e.target.matches?.('input, select, textarea') && (e.target.value || e.target.hasAttribute('aria-invalid'))) validateField(e.target); }, true);
  form.addEventListener('input', (e) => { if (e.target.hasAttribute?.('aria-invalid')) validateField(e.target); });
  form.addEventListener('submit', (e) => {
    const bad = fields().filter((f) => !validateField(f));
    let summary = $('.form-summary[data-forma-summary]', form);
    if (bad.length) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (form.hasAttribute('data-summary') || bad.length > 2) {
        if (!summary) { summary = h('div', { class: 'form-summary', role: 'alert', tabindex: '-1', 'data-forma-summary': '' }); form.prepend(summary); }
        summary.replaceChildren(h('p', { class: 'form-summary-title', text: msgs().summary(bad.length) }),
          h('ul', {}, bad.map((f) => h('li', {}, h('a', { href: `#${ensureId(f, 'fld')}`, text: `${(form.querySelector(`label[for="${f.id}"]`)?.textContent || f.name || f.id).replace(/\s*\*$/, '')}: ${messageFor(f) || f.validationMessage}`, onclick: (ev) => { ev.preventDefault(); f.focus(); } })))));
        summary.focus();
      } else bad[0].focus();
      emit(form, 'invalid', { fields: bad });
    } else { summary?.remove(); emit(form, 'valid', {}); }
  });
}
validate.locale = null;
validate.messages = MESSAGES;
validate.field = validateField;
define('validate', validate);

define('strength', (input) => {
  const meter = document.getElementById((input.getAttribute('aria-describedby') || '').split(' ').find((id) => document.getElementById(id)?.classList.contains('strength')))
    || input.closest('.field')?.querySelector('.strength');
  if (!meter) return;
  const label = $('.strength-label', meter);
  input.addEventListener('input', () => {
    const v = input.value; let s = 0;
    if (v.length >= 8) s++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++; if (/\d/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v) || v.length >= 14) s++;
    if (!v) s = 0;
    meter.dataset.score = String(s); if (label) label.textContent = msgs().strength[s];
  });
}, 'input[data-strength]');

/* ── Wizard ──────────────────────────────────────────────────────────────── */
export function wizard(root) {
  const panels = $$('.wizard-panel', root), steps = $$('.steps .step', root);
  const count = $('.wizard-count', root), next = $('[data-wizard-next]', root), prev = $('[data-wizard-prev]', root);
  let index = Math.max(0, panels.findIndex((p) => !p.hidden));
  const go = (i, focus = true) => {
    index = Math.max(0, Math.min(panels.length - 1, i));
    panels.forEach((p, k) => { p.hidden = k !== index; });
    steps.forEach((s, k) => { s.toggleAttribute('aria-current', k === index); if (k === index) s.setAttribute('aria-current', 'step'); if (k < index) s.dataset.state = 'done'; else delete s.dataset.state; });
    if (count) count.textContent = `${index + 1} / ${panels.length}`;
    if (prev) prev.disabled = index === 0;
    if (next) next.textContent = index === panels.length - 1 ? (next.dataset.finishLabel || 'Finish') : (next.dataset.nextLabel || 'Continue');
    if (focus) (panels[index].querySelector('input, select, textarea, button') || panels[index]).focus?.();
    emit(root, 'step', { index });
  };
  const valid = () => $$('input, select, textarea', panels[index]).every((f) => validateField(f));
  next?.addEventListener('click', (e) => { e.preventDefault(); if (!valid()) { panels[index].querySelector('[aria-invalid="true"]')?.focus(); return; } if (index === panels.length - 1) { root.tagName === 'FORM' ? root.requestSubmit() : emit(root, 'finish', {}); } else go(index + 1); });
  prev?.addEventListener('click', (e) => { e.preventDefault(); go(index - 1); });
  go(index, false);
  return { next: () => next?.click(), prev: () => go(index - 1), go, get index() { return index; } };
}
define('wizard', wizard);

/* ── Combobox ────────────────────────────────────────────────────────────── */
export function combobox(root) {
  const input = $('.combobox-input', root), lb = $('[role="listbox"]', root), control = $('.combobox-control', root);
  if (!input || !lb) return;
  const multiple = root.hasAttribute('data-multiple');
  ensureId(lb, 'lb');
  input.setAttribute('role', 'combobox'); input.setAttribute('aria-controls', lb.id); input.setAttribute('aria-expanded', 'false'); input.setAttribute('aria-autocomplete', 'list'); input.autocomplete = 'off';
  if (multiple) lb.setAttribute('aria-multiselectable', 'true');
  const opts = () => $$('[role="option"]', lb);
  const visible = () => opts().filter((o) => !o.hidden && o.getAttribute('aria-disabled') !== 'true');
  let active = -1;
  let empty = $('.listbox-empty', lb); if (!empty) { empty = h('p', { class: 'listbox-empty', text: root.dataset.emptyText || 'No matches', hidden: true }); lb.append(empty); }
  const open = (v) => { lb.hidden = !v; input.setAttribute('aria-expanded', String(v)); root.toggleAttribute('data-open', v); if (!v) setActive(-1); };
  const setActive = (i) => {
    const vis = visible(); opts().forEach((o) => o.removeAttribute('data-active'));
    active = vis.length ? (i + vis.length) % vis.length : -1;
    if (i < 0 || active < 0) { input.removeAttribute('aria-activedescendant'); active = -1; return; }
    const o = vis[active]; ensureId(o, 'opt'); o.setAttribute('data-active', ''); input.setAttribute('aria-activedescendant', o.id); o.scrollIntoView({ block: 'nearest' });
  };
  const label = (o) => o.childNodes[0]?.textContent.trim() || o.textContent.trim();
  const renderChips = () => {
    if (!multiple) return;
    $$('.chip', control).forEach((c) => c.remove());
    opts().filter((o) => o.getAttribute('aria-selected') === 'true').forEach((o) => {
      control.insertBefore(h('span', { class: 'chip' }, label(o), h('button', { type: 'button', class: 'chip-remove', 'aria-label': `Remove ${label(o)}`, text: '×', onclick: (e) => { e.stopPropagation(); toggle(o); input.focus(); } })), input);
    });
  };
  const values = () => opts().filter((o) => o.getAttribute('aria-selected') === 'true').map((o) => o.dataset.value ?? label(o));
  const toggle = (o) => {
    if (o.getAttribute('aria-disabled') === 'true') return;
    if (multiple) { o.setAttribute('aria-selected', String(o.getAttribute('aria-selected') !== 'true')); renderChips(); input.value = ''; filter(); }
    else { opts().forEach((x) => x.setAttribute('aria-selected', String(x === o))); input.value = label(o); open(false); }
    announce(`${label(o)} ${o.getAttribute('aria-selected') === 'true' ? 'selected' : 'removed'}`);
    emit(root, 'change', { value: multiple ? values() : values()[0] });
  };
  const filter = () => {
    const q = input.value.trim().toLowerCase();
    const selectedLabel = !multiple && opts().find((o) => o.getAttribute('aria-selected') === 'true');
    const showAll = selectedLabel && label(selectedLabel).toLowerCase() === q;
    opts().forEach((o) => { o.hidden = !!q && !showAll && !o.textContent.toLowerCase().includes(q); });
    $$('.listbox-group', lb).forEach((g) => { let n = g.nextElementSibling, any = false; while (n && !n.classList.contains('listbox-group')) { if (n.matches('[role="option"]') && !n.hidden) any = true; n = n.nextElementSibling; } g.hidden = !any; });
    empty.hidden = visible().length > 0;
  };
  input.addEventListener('input', () => { filter(); open(true); setActive(0); });
  input.addEventListener('focus', () => { filter(); open(true); });
  control.addEventListener('click', (e) => { if (e.target === control) input.focus(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (lb.hidden) open(true); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); toggle(visible()[active]); }
    else if (e.key === 'Escape') { if (!lb.hidden) { e.preventDefault(); e.stopPropagation(); open(false); } }
    else if (e.key === 'Backspace' && multiple && !input.value) { const last = opts().filter((o) => o.getAttribute('aria-selected') === 'true').pop(); if (last) toggle(last); }
    else if (e.key === 'Tab') open(false);
  });
  lb.addEventListener('mousedown', (e) => e.preventDefault());
  lb.addEventListener('click', (e) => { const o = e.target.closest('[role="option"]'); if (o) toggle(o); });
  document.addEventListener('click', (e) => { if (!root.contains(e.target)) open(false); });
  renderChips(); if (!multiple) { const s = opts().find((o) => o.getAttribute('aria-selected') === 'true'); if (s) input.value = label(s); }
  open(false);
  return { get value() { return multiple ? values() : values()[0]; } };
}
define('combobox', combobox);

/* ── Date picker ─────────────────────────────────────────────────────────── */
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parse = (s) => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export function datepicker(root, opts = {}) {
  const locale = opts.locale || root.dataset.locale || document.documentElement.lang || undefined;
  const weekStart = Number(opts.weekStart ?? root.dataset.weekStart ?? 1);
  const range = opts.range ?? root.hasAttribute('data-range');
  const min = parse(opts.min || root.dataset.min), max = parse(opts.max || root.dataset.max);
  let sel = parse(opts.value || root.dataset.value), sel2 = parse(root.dataset.end);
  let view = new Date((sel || new Date()).getFullYear(), (sel || new Date()).getMonth(), 1);
  let focus = sel || new Date();
  const titleId = ensureId(root, 'dp') + '-t';
  root.setAttribute('role', 'application'); root.setAttribute('aria-roledescription', 'date picker');
  const render = (moveFocus) => {
    const today = iso(new Date());
    const first = new Date(view); const offset = (first.getDay() - weekStart + 7) % 7; const start = new Date(first); start.setDate(1 - offset);
    const wd = new Intl.DateTimeFormat(locale, { weekday: 'narrow' }), wdl = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    const grid = h('div', { class: 'datepicker-grid', role: 'grid', 'aria-labelledby': titleId });
    const head = h('div', { role: 'row', class: 'grid-row' }); grid.append(head);
    for (let i = 0; i < 7; i++) { const d = new Date(2024, 0, 7 + weekStart + i); head.append(h('span', { class: 'datepicker-weekday', role: 'columnheader', 'aria-label': wdl.format(d), text: wd.format(d) })); }
    let row;
    for (let i = 0; i < 42; i++) {
      if (i % 7 === 0) { row = h('div', { role: 'row', class: 'grid-row' }); grid.append(row); }
      const d = new Date(start); d.setDate(start.getDate() + i);
      const id = iso(d), out = d.getMonth() !== view.getMonth();
      const disabled = (min && d < min) || (max && d > max);
      const isSel = (sel && id === iso(sel)) || (sel2 && id === iso(sel2));
      const inRange = range && sel && sel2 && d > sel && d < sel2;
      const cell = h('span', { role: 'gridcell', class: 'grid-row', 'aria-selected': isSel ? 'true' : 'false' }); row.append(cell);
      const b = h('button', { type: 'button', class: 'datepicker-day', 'data-date': id, tabindex: id === iso(focus) ? '0' : '-1', 'data-selected': isSel || null, 'aria-pressed': null, 'aria-current': id === today ? 'date' : null, 'data-outside': out || null, 'data-in-range': inRange || null, 'data-range-edge': range && isSel ? '' : null, disabled: disabled || null, 'aria-label': new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(d), text: d.getDate() });
      cell.append(b);
    }
    const nav = (dir, label, glyph) => h('button', { type: 'button', class: 'btn btn-icon btn-ghost btn-sm', 'aria-label': label, text: glyph, onclick: () => { view.setMonth(view.getMonth() + dir); focus = new Date(view); render(); } });
    root.replaceChildren(
      h('div', { class: 'datepicker-head' }, nav(-1, 'Previous month', '‹'), h('p', { class: 'datepicker-title', id: titleId, 'aria-live': 'polite', text: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(view) }), nav(1, 'Next month', '›')),
      grid,
      h('div', { class: 'datepicker-foot' }, h('button', { type: 'button', class: 'btn btn-ghost btn-sm', text: root.dataset.todayLabel || 'Today', onclick: () => pick(new Date()) }), h('span', { class: 't-meta t-tertiary', text: sel ? (sel2 ? `${iso(sel)} → ${iso(sel2)}` : iso(sel)) : '' })));
    if (moveFocus) root.querySelector(`[data-date="${iso(focus)}"]`)?.focus();
  };
  const pick = (d) => {
    if (range && sel && !sel2 && d >= sel) sel2 = d; else { sel = d; sel2 = null; }
    focus = d; view = new Date(d.getFullYear(), d.getMonth(), 1); render(true);
    const value = range ? { start: sel && iso(sel), end: sel2 && iso(sel2) } : iso(sel);
    const target = root.dataset.input && document.querySelector(root.dataset.input); if (target && !range) target.value = iso(sel);
    emit(root, 'change', { value });
  };
  root.addEventListener('click', (e) => { const b = e.target.closest('.datepicker-day'); if (b && !b.disabled) pick(parse(b.dataset.date)); });
  root.addEventListener('keydown', (e) => {
    const b = e.target.closest('.datepicker-day'); if (!b) return;
    const d = parse(b.dataset.date); const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (getComputedStyle(root).direction === 'rtl') { map.ArrowLeft = 1; map.ArrowRight = -1; }
    if (map[e.key] != null) d.setDate(d.getDate() + map[e.key]);
    else if (e.key === 'PageUp') d.setMonth(d.getMonth() - 1);
    else if (e.key === 'PageDown') d.setMonth(d.getMonth() + 1);
    else if (e.key === 'Home') d.setDate(d.getDate() - ((d.getDay() - weekStart + 7) % 7));
    else if (e.key === 'End') d.setDate(d.getDate() + (6 - ((d.getDay() - weekStart + 7) % 7)));
    else return;
    e.preventDefault(); focus = d;
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) view = new Date(d.getFullYear(), d.getMonth(), 1);
    render(true);
  });
  render();
  return { get value() { return sel && iso(sel); }, set: pick };
}
define('datepicker', datepicker);

export { formatBytes };
