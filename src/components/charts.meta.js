export default [
  {
    id: 'chart', name: 'Chart Container', category: 'Charts',
    description: 'The frame every chart sits in: title, headline value, canvas, legend, table toggle, tooltip. Series colors --data-1…8 are CVD-validated and stay the same across themes.',
    classes: { base: 'chart', parts: ['chart-head', 'chart-title', 'chart-subtitle', 'chart-value', 'chart-canvas', 'chart-legend', 'chart-swatch', 'chart-swatch-line', 'chart-tooltip', 's-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-7', 's-8', 's-accent', 's-muted'] },
    examples: [{ title: 'Line chart (two series)', html: `<figure class="chart" data-forma="chart" data-type="line" data-labels="Mon,Tue,Wed,Thu,Fri,Sat,Sun"
  data-series='[{"name":"Forge","values":[1.84,1.52,1.21,0.98,0.76,0.54,0.34]},{"name":"Fehm","values":[1.6,1.41,1.2,1.08,0.9,0.81,0.7]}]' data-format="0.00">
  <figcaption class="chart-head"><div><p class="chart-title">Training loss</p><p class="chart-subtitle">Last 7 epochs</p></div><p class="chart-value">0.34</p></figcaption>
  <div class="chart-canvas"></div>
</figure>` }],
    a11y: ['Each SVG gets role="img" and an aria-label summary; Forma.chart also renders a visually hidden data table, and a "Show data" toggle on request.', 'Two or more series always get a legend; up to four are also direct-labelled.', 'Hover and keyboard focus (arrow keys) drive the tooltip and crosshair.', 'Never two y-axes.'],
    js: { auto: 'data-forma="chart" data-type="line|area|bar|donut|gauge"', api: 'Forma.chart(el, { type, labels, series, format })' },
  },
  {
    id: 'bar-chart', name: 'Bar Chart', category: 'Charts',
    description: 'CSS-only vertical bars for small series (no JS), or Forma.chart type="bar" for grouped bars with axes.',
    classes: { base: 'bars', parts: ['bars-item', 'bars-fill', 'bars-label'], attributes: ['--value', 'data-muted'] },
    examples: [{ title: 'Weekly runs', html: `<figure class="chart"><figcaption class="chart-head"><p class="chart-title">Runs per day</p><p class="chart-value">96</p></figcaption>
  <div class="bars" role="img" aria-label="Runs per day: Mon 8, Tue 12, Wed 18, Thu 14, Fri 22, Sat 6, Sun 16">
    <div class="bars-item"><div class="bars-fill" style="--value:36%"></div><span class="bars-label">Mon</span></div>
    <div class="bars-item"><div class="bars-fill" style="--value:55%"></div><span class="bars-label">Tue</span></div>
    <div class="bars-item"><div class="bars-fill" style="--value:82%"></div><span class="bars-label">Wed</span></div>
    <div class="bars-item"><div class="bars-fill" style="--value:64%"></div><span class="bars-label">Thu</span></div>
    <div class="bars-item"><div class="bars-fill" style="--value:100%"></div><span class="bars-label">Fri</span></div>
    <div class="bars-item" data-muted><div class="bars-fill" style="--value:27%"></div><span class="bars-label">Sat</span></div>
    <div class="bars-item" data-muted><div class="bars-fill" style="--value:73%"></div><span class="bars-label">Sun</span></div>
  </div></figure>` },
      { title: 'Grouped bars (JS)', html: `<figure class="chart" data-forma="chart" data-type="bar" data-labels="Data gen,Language,Code,GenUI,Reasoning" data-series='[{"name":"Forge","values":[91,78,87,71,82]},{"name":"Fehm","values":[74,94,62,88,58]}]' data-format="0'%'">
  <figcaption class="chart-head"><p class="chart-title">Benchmark by domain</p></figcaption><div class="chart-canvas"></div></figure>` }],
    v5: { 'bar-chart / bar-col / bar-fill': 'bars / bars-item / bars-fill' },
  },
  {
    id: 'hbars', name: 'Horizontal Bars', category: 'Charts',
    description: 'Ranked comparisons with labels and values — readable at any width.',
    classes: { base: 'hbars', parts: ['hbar', 'hbar-label', 'hbar-track', 'hbar-fill', 'hbar-value'] },
    examples: [{ title: 'Domain scores', html: `<ul class="hbars" aria-label="Domain score">
  <li class="hbar"><span class="hbar-label">Data generation</span><span class="hbar-track"><span class="hbar-fill" style="--value:91%"></span></span><span class="hbar-value">91%</span></li>
  <li class="hbar"><span class="hbar-label">Dataset analysis</span><span class="hbar-track"><span class="hbar-fill" style="--value:87%"></span></span><span class="hbar-value">87%</span></li>
  <li class="hbar"><span class="hbar-label">Fine-tune config</span><span class="hbar-track"><span class="hbar-fill" style="--value:82%"></span></span><span class="hbar-value">82%</span></li>
  <li class="hbar"><span class="hbar-label">Code generation</span><span class="hbar-track"><span class="hbar-fill" style="--value:74%"></span></span><span class="hbar-value">74%</span></li>
</ul>` }],
    v5: { 'h-bar-list / h-bar-item': 'hbars / hbar' },
  },
  {
    id: 'donut', name: 'Donut', category: 'Charts',
    description: 'Part-to-whole for up to five parts, with center total and legend.',
    classes: { base: 'donut', parts: ['donut-seg', 'donut-track', 'donut-center', 'donut-center-label'] },
    examples: [{ title: 'Language mix', html: `<figure class="chart" data-forma="chart" data-type="donut" data-labels="Turkish,English,Mixed,Other" data-series='[{"values":[45,35,15,5]}]' data-center="200K" data-center-label="samples" data-format="0'%'">
  <figcaption class="chart-head"><p class="chart-title">Dataset language mix</p></figcaption><div class="chart-canvas"></div></figure>` }],
    a11y: ['Segments are separated by a 2px gap; the legend lists values, never color alone.'],
  },
  {
    id: 'gauge', name: 'Gauge', category: 'Charts',
    description: 'A single value against a range (0–100 by default), with threshold coloring.',
    classes: { base: 'gauge', parts: ['gauge-track', 'gauge-fill', 'gauge-value', 'gauge-label'] },
    examples: [{ title: 'Gauges', html: `<div class="cluster gap-6">
  <div class="gauge" data-forma="chart" data-type="gauge" data-value="84" data-label="Eval score"></div>
  <div class="gauge" data-forma="chart" data-type="gauge" data-value="94" data-label="VRAM" data-warn="80" data-danger="90"></div>
</div>` }],
  },
  {
    id: 'sparkline', name: 'Sparkline', category: 'Charts',
    description: 'Word-sized trend line for KPIs and tables.',
    classes: { base: 'sparkline' },
    examples: [{ title: 'Sparkline', html: `<div class="card metric" style="max-inline-size:260px"><span class="metric-label">Tokens / day</span><span class="metric-value">2.4M</span><svg class="sparkline" data-forma="sparkline" data-values="8,9,7,11,12,10,14,16,15,19,21,24" role="img" aria-label="Tokens per day, rising from 0.8M to 2.4M"></svg></div>` }],
  },
  {
    id: 'heatmap', name: 'Heatmap', category: 'Charts',
    description: 'Intensity over a grid (activity by day/week) with a single-hue sequential scale, levels 0–5.',
    classes: { base: 'heatmap', parts: ['heatmap-cell', 'heatmap-legend'], attributes: ['data-level="0..5"'] },
    examples: [{ title: 'Activity', html: `<div class="stack gap-3"><div class="heatmap" style="--cols:7" role="img" aria-label="Training activity over 3 weeks">
  <span>W1</span><i class="heatmap-cell" data-level="0"></i><i class="heatmap-cell" data-level="2"></i><i class="heatmap-cell" data-level="3"></i><i class="heatmap-cell" data-level="1"></i><i class="heatmap-cell" data-level="4"></i><i class="heatmap-cell" data-level="0"></i><i class="heatmap-cell" data-level="1"></i>
  <span>W2</span><i class="heatmap-cell" data-level="2"></i><i class="heatmap-cell" data-level="5"></i><i class="heatmap-cell" data-level="4"></i><i class="heatmap-cell" data-level="3"></i><i class="heatmap-cell" data-level="2"></i><i class="heatmap-cell" data-level="1"></i><i class="heatmap-cell" data-level="0"></i>
  <span>W3</span><i class="heatmap-cell" data-level="3"></i><i class="heatmap-cell" data-level="4"></i><i class="heatmap-cell" data-level="5"></i><i class="heatmap-cell" data-level="5"></i><i class="heatmap-cell" data-level="3"></i><i class="heatmap-cell" data-level="2"></i><i class="heatmap-cell" data-level="1"></i>
</div><div class="heatmap-legend">Less <i class="heatmap-cell" data-level="0"></i><i class="heatmap-cell" data-level="1"></i><i class="heatmap-cell" data-level="2"></i><i class="heatmap-cell" data-level="3"></i><i class="heatmap-cell" data-level="4"></i><i class="heatmap-cell" data-level="5"></i> More</div></div>` }],
    v5: { 'heat-cell[data-v] / heatmap-cell[data-level]': 'heatmap-cell[data-level]' },
  },
  {
    id: 'treemap', name: 'Treemap', category: 'Charts',
    description: 'Proportional areas via flex weights (--w).',
    classes: { base: 'treemap', parts: ['treemap-cell', 'treemap-label', 'treemap-value'] },
    examples: [{ title: 'Token distribution', html: `<div class="treemap" role="img" aria-label="Token distribution: Turkish SFT 45%, English 28%, Mixed 15%, Code 8%, Other 4%">
  <div class="treemap-cell s-1" style="--w:45"><span class="treemap-label">Turkish SFT</span><span class="treemap-value">45%</span></div>
  <div class="treemap-cell s-2" style="--w:28"><span class="treemap-label">English</span><span class="treemap-value">28%</span></div>
  <div class="treemap-cell s-3" style="--w:15"><span class="treemap-label">Mixed</span><span class="treemap-value">15%</span></div>
  <div class="treemap-cell s-4" style="--w:8"><span class="treemap-label">Code</span><span class="treemap-value">8%</span></div>
  <div class="treemap-cell s-5" style="--w:4"><span class="treemap-label">Other</span><span class="treemap-value">4%</span></div>
</div>` }],
  },
];
