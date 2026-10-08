// Accessible SVG charts: line, area, bar (grouped), donut, gauge, sparkline.
// Marks follow the FORMA data-viz rules: 2px lines, 4px rounded bar ends anchored to
// the baseline, 2px surface gaps, recessive grid, legend for ≥2 series, direct labels
// for ≤4 line series, hover + keyboard tooltip, and a hidden data table.
import { $, h, uid } from './util.js';
import { define } from './core.js';

const S = (tag, attrs = {}, ...kids) => h(`svg:${tag}`, attrs, ...kids);

function formatter(spec, locale) {
  if (typeof spec === 'function') return spec;
  const m = /^0(?:\.(0+))?(?:'(.*)')?$/.exec(spec || '');
  const dec = m?.[1]?.length ?? undefined, suffix = m?.[2] ?? '';
  const nf = new Intl.NumberFormat(locale, dec != null ? { minimumFractionDigits: dec, maximumFractionDigits: dec } : { maximumFractionDigits: 2 });
  return (v) => (v == null ? '—' : nf.format(v) + suffix);
}
function niceTicks(min, max, count = 4) {
  if (min === max) { max = min + 1; }
  const span = max - min, step0 = span / count, mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((s) => s >= step0);
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  const out = []; for (let v = lo; v <= hi + step / 2; v += step) out.push(+v.toFixed(10));
  return out;
}
const seriesClass = (i, n) => (n === 1 ? 's-accent' : `s-${(i % 8) + 1}`);

function dataTable(o, fmt) {
  const t = h('table', { class: 'sr-only' }, h('caption', { text: o.title || 'Chart data' }),
    h('thead', {}, h('tr', {}, h('th', { scope: 'col', text: o.xLabel || '' }), o.series.map((s) => h('th', { scope: 'col', text: s.name || 'Value' })))),
    h('tbody', {}, o.labels.map((l, i) => h('tr', {}, h('th', { scope: 'row', text: l }), o.series.map((s) => h('td', { text: fmt(s.values[i]) }))))));
  return t;
}
function legend(o) {
  if (o.series.length < 2 && o.type !== 'donut') return null;
  const items = o.type === 'donut' ? o.labels.map((l, i) => [l, seriesClass(i, 2), o.series[0].values[i]]) : o.series.map((s, i) => [s.name, seriesClass(i, o.series.length)]);
  const fmt = formatter(o.format, o.locale);
  return h('ul', { class: 'chart-legend' }, items.map(([name, cls, v]) => h('li', { class: cls }, h('span', { class: `chart-swatch${o.type === 'line' ? ' chart-swatch-line' : ''}`, 'aria-hidden': 'true' }), v != null ? `${name} · ${fmt(v)}` : name)));
}

function tooltipLayer(canvas) {
  let tip = $('.chart-tooltip', canvas);
  if (!tip) { tip = h('div', { class: 'chart-tooltip', 'aria-hidden': 'true' }); canvas.append(tip); }
  return {
    show(x, y, title, rows) {
      tip.replaceChildren(h('strong', { text: title }), ...rows.map(([name, val, cls]) => h('div', { class: `chart-tooltip-row ${cls || ''}` }, h('span', { class: 'chart-swatch', 'aria-hidden': 'true' }), name ? h('span', { text: name }) : null, h('b', { text: val }))));
      tip.setAttribute('data-show', '');
      const cw = canvas.clientWidth; const tw = tip.offsetWidth;
      tip.style.left = `${Math.max(0, Math.min(cw - tw, x + 12))}px`; tip.style.top = `${Math.max(0, y - tip.offsetHeight - 10)}px`;
    },
    hide() { tip.removeAttribute('data-show'); },
  };
}

function renderXY(canvas, o) {
  const W = Math.max(280, canvas.clientWidth || 560), H = o.height || 220;
  const pad = { t: 12, r: o.type === 'line' && o.series.length > 1 && o.series.length <= 4 ? 64 : 12, b: 26, l: 40 };
  const fmt = formatter(o.format, o.locale);
  const all = o.series.flatMap((s) => s.values).filter((v) => v != null);
  const ticks = niceTicks(Math.min(0, ...all), Math.max(...all));
  const y0 = ticks[0], y1 = ticks[ticks.length - 1];
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b, n = o.labels.length;
  const Y = (v) => pad.t + ih - ((v - y0) / (y1 - y0)) * ih;
  const bar = o.type === 'bar';
  const X = (i) => (bar ? pad.l + (iw / n) * (i + 0.5) : pad.l + (n === 1 ? iw / 2 : (iw / (n - 1)) * i));
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': o.summary || `${o.title || 'Chart'}: ${o.series.map((s) => `${s.name || 'value'} from ${fmt(s.values[0])} to ${fmt(s.values.at(-1))}`).join('; ')}`, tabindex: '0', focusable: 'true' });
  const grid = S('g', { class: 'chart-grid' }), axis = S('g', { class: 'chart-axis' });
  ticks.forEach((t) => { grid.append(S('line', { x1: pad.l, x2: W - pad.r, y1: Y(t), y2: Y(t) })); axis.append(S('text', { x: pad.l - 8, y: Y(t) + 3, 'text-anchor': 'end', text: fmt(t) })); });
  axis.append(S('line', { class: 'chart-baseline', x1: pad.l, x2: W - pad.r, y1: Y(Math.max(0, y0)), y2: Y(Math.max(0, y0)) }));
  const step = Math.ceil(n / Math.max(1, Math.floor(iw / 56)));
  o.labels.forEach((l, i) => { if (i % step === 0 || i === n - 1) axis.append(S('text', { x: X(i), y: H - 8, 'text-anchor': 'middle', text: l })); });
  svg.append(grid, axis);
  const marks = S('g');
  if (bar) {
    const groupW = (iw / n) * 0.72, bw = (groupW - 2 * (o.series.length - 1)) / o.series.length;
    o.series.forEach((s, si) => s.values.forEach((v, i) => {
      if (v == null) return;
      const x = X(i) - groupW / 2 + si * (bw + 2), y = Y(Math.max(0, v)), hgt = Math.abs(Y(v) - Y(0)), r = Math.min(4, bw / 2, hgt);
      const d = `M${x},${y + hgt} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${y + hgt} Z`;
      marks.append(S('path', { class: `chart-bar ${seriesClass(si, o.series.length)}`, d }));
    }));
  } else {
    o.series.forEach((s, si) => {
      const pts = s.values.map((v, i) => (v == null ? null : [X(i), Y(v)]));
      const d = pts.reduce((acc, p, i) => (p ? acc + `${acc && pts[i - 1] ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}` : acc), '');
      const cls = seriesClass(si, o.series.length);
      if (o.type === 'area') marks.append(S('path', { class: `chart-area ${cls}`, d: `${d}L${X(n - 1)},${Y(Math.max(0, y0))}L${X(0)},${Y(Math.max(0, y0))}Z` }));
      marks.append(S('path', { class: `chart-line ${cls}`, d }));
      const last = pts.findLast((p) => p);
      if (last && o.series.length > 1 && o.series.length <= 4) marks.append(S('text', { class: 'chart-direct-label', x: last[0] + 8, y: last[1] + 4, text: s.name }));
    });
  }
  svg.append(marks);
  const cross = S('line', { class: 'chart-crosshair', y1: pad.t, y2: pad.t + ih, opacity: 0 });
  const dots = S('g'); svg.append(cross, dots);
  const tip = tooltipLayer(canvas);
  let idx = -1;
  const show = (i) => {
    idx = Math.max(0, Math.min(n - 1, i)); const x = X(idx);
    if (!bar) { cross.setAttribute('x1', x); cross.setAttribute('x2', x); cross.setAttribute('opacity', 1); }
    dots.replaceChildren(...(bar ? [] : o.series.map((s, si) => (s.values[idx] == null ? null : S('circle', { class: `chart-dot ${seriesClass(si, o.series.length)}`, cx: x, cy: Y(s.values[idx]), r: 4 }))).filter(Boolean)));
    const scale = canvas.clientWidth / W;
    tip.show(x * scale, Math.min(...o.series.map((s) => Y(s.values[idx] ?? y0))) * scale, o.labels[idx], o.series.map((s, si) => [o.series.length > 1 ? s.name : '', fmt(s.values[idx]), seriesClass(si, o.series.length)]));
  };
  const hide = () => { cross.setAttribute('opacity', 0); dots.replaceChildren(); tip.hide(); };
  svg.addEventListener('pointermove', (e) => { const r = svg.getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width) * W; const i = bar ? Math.floor(((x - pad.l) / iw) * n) : Math.round(((x - pad.l) / iw) * (n - 1)); if (i >= 0 && i < n) show(i); });
  svg.addEventListener('pointerleave', hide); svg.addEventListener('blur', hide);
  svg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx < 0 ? n - 1 : idx - 1); } else if (e.key === 'Escape') hide(); });
  svg.addEventListener('focus', () => show(idx < 0 ? n - 1 : idx));
  return svg;
}

function renderDonut(canvas, o) {
  const vals = o.series[0].values, total = vals.reduce((a, b) => a + b, 0) || 1, fmt = formatter(o.format, o.locale);
  const R = 52, C = 2 * Math.PI * R, gap = 2;
  const svg = S('svg', { viewBox: '0 0 140 140', role: 'img', 'aria-label': o.summary || `${o.title || 'Breakdown'}: ${o.labels.map((l, i) => `${l} ${fmt(vals[i])}`).join(', ')}` });
  svg.append(S('circle', { class: 'donut-track', cx: 70, cy: 70, r: R, 'stroke-width': 14 }));
  let acc = 0;
  vals.forEach((v, i) => {
    const len = (v / total) * C;
    svg.append(S('circle', { class: `donut-seg ${seriesClass(i, 2)}`, cx: 70, cy: 70, r: R, 'stroke-width': 14, 'stroke-dasharray': `${Math.max(0, len - gap)} ${C}`, 'stroke-dashoffset': -acc, transform: 'rotate(-90 70 70)' }, S('title', { text: `${o.labels[i]}: ${fmt(v)}` })));
    acc += len;
  });
  if (o.center) { svg.append(S('text', { class: 'donut-center', x: 70, y: 74, 'text-anchor': 'middle', text: o.center })); if (o.centerLabel) svg.append(S('text', { class: 'donut-center-label', x: 70, y: 90, 'text-anchor': 'middle', text: o.centerLabel })); }
  const wrap = h('div', { class: 'donut' }, svg, legend(o));
  return wrap;
}

function renderGauge(el, o) {
  const v = Math.max(0, Math.min(100, Number(o.value))), R = 54, len = Math.PI * R;
  const tone = o.danger != null && v >= o.danger ? 'var(--error)' : o.warn != null && v >= o.warn ? 'var(--warning)' : 'var(--accent)';
  const svg = S('svg', { viewBox: '0 0 140 84', role: 'img', 'aria-label': `${o.label || 'Value'}: ${v}%` },
    S('path', { class: 'gauge-track', d: 'M16 76 A54 54 0 0 1 124 76', 'stroke-width': 10 }),
    S('path', { class: 'gauge-fill', d: 'M16 76 A54 54 0 0 1 124 76', 'stroke-width': 10, 'stroke-dasharray': len, 'stroke-dashoffset': len * (1 - v / 100), style: `--_c:${tone}` }),
    S('text', { class: 'gauge-value', x: 70, y: 72, 'text-anchor': 'middle', text: `${v}` }));
  el.replaceChildren(svg, o.label ? h('span', { class: 'gauge-label', text: o.label }) : '');
}

export function sparkline(svg, values) {
  const vals = values || (svg.dataset.values || '').split(',').map(Number).filter((n) => !Number.isNaN(n));
  if (!vals.length) return;
  const W = 120, H = 32, min = Math.min(...vals), max = Math.max(...vals), sp = max - min || 1;
  const pts = vals.map((v, i) => [(i / (vals.length - 1 || 1)) * W, H - 2 - ((v - min) / sp) * (H - 4)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('preserveAspectRatio', 'none');
  svg.replaceChildren(S('path', { class: 'chart-area s-accent', d: `${d}L${W},${H}L0,${H}Z` }), S('path', { class: 'chart-line s-accent', d }));
}
define('sparkline', sparkline);

/** Forma.chart(el, { type, labels, series:[{name, values}], format, ... }) */
export function chart(el, opts = {}) {
  const ds = el.dataset;
  const o = {
    type: opts.type || ds.type || 'line',
    labels: opts.labels || (ds.labels ? ds.labels.split(',') : []),
    series: opts.series || (ds.series ? JSON.parse(ds.series) : []),
    format: opts.format ?? ds.format, locale: opts.locale || document.documentElement.lang || undefined,
    title: opts.title || $('.chart-title', el)?.textContent, summary: opts.summary || ds.summary,
    center: opts.center ?? ds.center, centerLabel: opts.centerLabel ?? ds.centerLabel,
    value: opts.value ?? ds.value, label: opts.label ?? ds.label, warn: opts.warn ?? (ds.warn != null ? Number(ds.warn) : null), danger: opts.danger ?? (ds.danger != null ? Number(ds.danger) : null),
    height: opts.height || (ds.height ? Number(ds.height) : undefined),
  };
  if (o.type === 'gauge') { renderGauge(el, o); return; }
  if (!o.labels.length && o.series[0]) o.labels = o.series[0].values.map((_, i) => String(i + 1));
  const canvas = $('.chart-canvas', el) || el;
  const fmt = formatter(o.format, o.locale);
  const draw = () => {
    const node = o.type === 'donut' ? renderDonut(canvas, o) : renderXY(canvas, o);
    const tip = $('.chart-tooltip', canvas);
    canvas.replaceChildren(node, ...(tip ? [tip] : []), dataTable(o, fmt));
    let lg = $(':scope > .chart-legend', el); lg?.remove();
    if (o.type !== 'donut') { lg = legend(o); if (lg) el.append(lg); }
  };
  draw();
  if (o.type !== 'donut' && typeof ResizeObserver !== 'undefined') { let w = canvas.clientWidth; new ResizeObserver(() => { if (Math.abs(canvas.clientWidth - w) > 8) { w = canvas.clientWidth; draw(); } }).observe(canvas); }
  return { update(next) { Object.assign(o, next); draw(); } };
}
define('chart', chart);
export { uid };
