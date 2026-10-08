import { ic } from './_helpers.js';

export default [
  {
    id: 'card', name: 'Card', category: 'Surfaces',
    description: 'The container. Five tones, header/body/footer parts, media, horizontal layout, interactive.',
    classes: { base: 'card', variants: ['card-elevated', 'card-subtle', 'card-ghost', 'card-accent'], modifiers: ['card-flush', 'card-compact', 'card-interactive', 'card-horizontal'], parts: ['card-header', 'card-title', 'card-title-display', 'card-desc', 'card-body', 'card-footer', 'card-media', 'card-eyebrow'] },
    examples: [
      { title: 'Tones', html: `<div class="grid" style="--min:180px">
  <div class="card"><p class="card-title">card</p><p class="card-desc">Default panel.</p></div>
  <div class="card card-elevated"><p class="card-title">card-elevated</p><p class="card-desc">Lifted surface.</p></div>
  <div class="card card-subtle"><p class="card-title">card-subtle</p><p class="card-desc">Filled, no border.</p></div>
  <div class="card card-ghost"><p class="card-title">card-ghost</p><p class="card-desc">Border only.</p></div>
  <div class="card card-accent"><p class="card-title">card-accent</p><p class="card-desc">Highlighted.</p></div>
</div>` },
      { title: 'Structured & media', html: `<div class="grid" style="--min:260px">
  <article class="card">
    <header class="card-header"><div><h3 class="card-title-display">Untitled, 2024</h3><p class="card-desc">Oil on linen · 120 × 90 cm</p></div><span class="badge badge-success">Available</span></header>
    <p class="t-body-sm t-secondary">The work interrogates the boundary between presence and absence.</p>
    <footer class="card-footer"><span>Added 2h ago</span><button class="btn btn-sm btn-ghost">Details</button></footer>
  </article>
  <article class="card card-flush">
    <div class="card-media">${ic('image', 'fi-2xl fi-tertiary')}</div>
    <div class="card-body"><p class="card-eyebrow">Checkpoint</p><h3 class="card-title">forge-14b-sft-v1</h3><p class="card-desc">SFT completed, ready for DPO.</p></div>
    <footer class="card-footer"><span class="badge badge-warning">In progress</span><span>2h ago</span></footer>
  </article>
</div>` }],
    a11y: ['Use <article> for self-contained cards; make the whole card a link only when it has a single destination.'],
    v5: { 'card-media-thumb': 'card-media', 'imgtxt-card imgtxt-md': 'card card-flush card-horizontal' },
  },
  {
    id: 'feature-card', name: 'Feature Card', category: 'Surfaces',
    description: 'Icon + title + description, for capabilities and product features.',
    classes: { base: 'feature', parts: ['feature-title', 'feature-desc', 'icon-tile'] },
    examples: [{ title: 'Features', html: `<div class="grid" style="--min:200px">
  <div class="card feature"><span class="icon-tile icon-tile-accent">${ic('route', 'fi-lg')}</span><p class="feature-title">Cortex Router</p><p class="feature-desc">Routes each request to the right model.</p></div>
  <div class="card feature"><span class="icon-tile">${ic('layout', 'fi-lg')}</span><p class="feature-title">GenUI Layer</p><p class="feature-desc">Generates structured visual components.</p></div>
  <div class="card feature"><span class="icon-tile">${ic('git-merge', 'fi-lg')}</span><p class="feature-title">Conflux</p><p class="feature-desc">Multi-source fine-tuning.</p></div>
</div>` }],
    v5: { 'card-feature': 'card feature' },
  },
  {
    id: 'metric', name: 'Metric Card', category: 'Surfaces',
    description: 'A single number with label and trend. Display serif numerals, tabular figures.',
    classes: { base: 'metric', parts: ['metric-label', 'metric-value', 'metric-delta', 'delta-up', 'delta-down'], attributes: ['data-trend="up|down"'] },
    examples: [{ title: 'Metrics', html: `<div class="grid" style="--min:160px">
  <div class="card card-subtle metric"><span class="metric-label">Loss</span><span class="metric-value">0.34</span><span class="metric-delta" data-trend="up">−0.18 better</span></div>
  <div class="card card-subtle metric"><span class="metric-label">Eval</span><span class="metric-value">84.2</span><span class="metric-delta" data-trend="up">+6.1</span></div>
  <div class="card card-subtle metric"><span class="metric-label">Cost</span><span class="metric-value">$401</span><span class="metric-delta" data-trend="down">+12%</span></div>
</div>` }],
    a11y: ['Trend direction is shown with an arrow glyph and text, not color alone.'],
    v5: { 'card-metric': 'card card-subtle metric' },
  },
  {
    id: 'row-card', name: 'Row Card', category: 'Surfaces',
    description: 'Horizontal list item for runs, files, people.',
    classes: { base: 'row-card', parts: ['row-card-body', 'row-card-title', 'row-card-sub'] },
    examples: [{ title: 'Rows', html: `<div class="stack gap-2">
  <div class="row-card"><span class="avatar avatar-sm avatar-square avatar-accent">F</span><div class="row-card-body"><p class="row-card-title">Forge-14B — SFT checkpoint saved</p><p class="row-card-sub">models/forge-sft-v1 · 2h ago</p></div><span class="badge badge-success">OK</span></div>
  <div class="row-card"><span class="avatar avatar-sm avatar-square avatar-warning">C</span><div class="row-card-body"><p class="row-card-title">Cortex — GRPO queued</p><p class="row-card-sub">Waiting for an A100 slot</p></div><span class="badge badge-warning">Queued</span></div>
</div>` }],
    v5: { 'card-row': 'row-card' },
  },
  {
    id: 'accordion', name: 'Accordion', category: 'Surfaces',
    description: 'Native <details>/<summary> — keyboard and screen-reader support for free, animated height, no height cap.',
    classes: { base: 'accordion', modifiers: ['accordion-flush'], parts: ['disclosure', 'disclosure-meta', 'disclosure-body'] },
    examples: [{ title: 'Accordion', html: `<div class="accordion">
  <details class="disclosure" open name="faq"><summary>Is FORMA free? <span class="disclosure-meta">MIT</span></summary><div class="disclosure-body">Yes — MIT licensed, for personal and commercial use.</div></details>
  <details class="disclosure" name="faq"><summary>Do I need a build step?</summary><div class="disclosure-body">No. Link one stylesheet and, optionally, one script.</div></details>
  <details class="disclosure" name="faq"><summary>Which browsers?</summary><div class="disclosure-body">Evergreen browsers from 2024 on: Chrome/Edge 123+, Firefox 120+, Safari 17.5+.</div></details>
</div>` }],
    a11y: ['Native disclosure semantics. Shared name="" makes an exclusive group (one open at a time).'],
    v5: { 'expand-card + Forma.toggleAccordion()': '<details class="disclosure"> (no JS)' },
  },
  {
    id: 'alert', name: 'Alert', category: 'Surfaces',
    description: 'Prominent messages with title, text and actions. Also a full-width banner.',
    classes: { base: 'alert', variants: ['alert-info', 'alert-success', 'alert-warning', 'alert-error', 'alert-accent'], modifiers: ['alert-banner'], parts: ['alert-body', 'alert-title', 'alert-text', 'alert-actions', 'alert-close'] },
    examples: [{ title: 'Alerts', html: `<div class="stack gap-3">
  <div class="alert alert-accent" role="status">${ic('info')}<div class="alert-body"><p class="alert-title">DPO data ready</p><p class="alert-text">15,000 preference pairs generated.</p><div class="alert-actions"><button class="btn btn-sm btn-accent">Open pipeline</button><button class="btn btn-sm btn-ghost">Later</button></div></div></div>
  <div class="alert alert-success" role="status">${ic('check-circle')}<div class="alert-body"><p class="alert-title">Checkpoint saved</p><p class="alert-text">forge-14b-sft-v1 written to /models.</p></div><button class="alert-close" aria-label="Dismiss" data-forma="dismiss">${ic('x')}</button></div>
  <div class="alert alert-warning" role="alert">${ic('warning')}<div class="alert-body"><p class="alert-title">VRAM at 94%</p><p class="alert-text">Reduce batch size or raise gradient accumulation.</p></div></div>
  <div class="alert alert-error" role="alert">${ic('x-circle')}<div class="alert-body"><p class="alert-title">Training failed</p><p class="alert-text">Not enough disk space (47 / 50 GB).</p></div></div>
</div>` }],
    a11y: ['role="alert" for urgent, role="status" for informational messages.', 'data-forma="dismiss" removes the closest .alert and returns focus sensibly.'],
  },
  {
    id: 'callout', name: 'Callout', category: 'Surfaces',
    description: 'Quiet inline notes inside content and docs.',
    classes: { base: 'callout', variants: ['callout-info', 'callout-success', 'callout-warning', 'callout-error', 'callout-accent'] },
    examples: [{ title: 'Callouts', html: `<div class="stack gap-2">
  <div class="callout callout-info">${ic('info')}<p><strong>Tip.</strong> Themes change only tokens — markup stays the same.</p></div>
  <div class="callout callout-warning">${ic('warning')}<p><strong>Heads up.</strong> Licensed fonts need your own licence.</p></div>
</div>` }],
  },
  {
    id: 'empty-state', name: 'Empty & Error States', category: 'Surfaces',
    description: 'What to show when there is nothing yet, nothing found, or something broke.',
    classes: { base: 'empty-state', parts: ['empty-state-icon', 'empty-state-title', 'empty-state-text', 'empty-state-actions', 'state-page', 'state-code', 'state-title', 'state-text'] },
    examples: [{ title: 'Empty state', html: `<div class="card"><div class="empty-state">
  <span class="empty-state-icon">${ic('database', 'fi-xl')}</span>
  <h3 class="empty-state-title">No datasets yet</h3>
  <p class="empty-state-text">Upload your first dataset to start training. CSV, JSONL and Parquet are supported.</p>
  <div class="empty-state-actions"><button class="btn btn-primary">${ic('upload')} Upload dataset</button><button class="btn btn-ghost">Read the guide</button></div>
</div></div>` },
      { title: '404 page', html: `<section class="state-page card"><div><p class="state-code">404</p><h1 class="state-title">This room is closed</h1><p class="state-text">The page you were looking for has moved or never existed.</p><a class="btn btn-primary" href="#">Back to the lobby</a></div></section>` }],
    v5: { 'empty-icon / empty-title / empty-desc': 'empty-state-icon / -title / -text', 'error-page / error-code': 'state-page / state-code' },
  },
];
