import { ic } from './_helpers.js';

export default [
  {
    id: 'table', name: 'Data Table', category: 'Data',
    description: 'Semantic tables with toolbar, sortable headers (aria-sort), row selection, sticky header, striped/compact, and stack-on-narrow.',
    classes: { base: 'table', parts: ['table-wrap', 'table-toolbar', 'table-title', 'table-footer', 'sort-btn', 'num', 'muted', 'cell-strong'], modifiers: ['table-hover', 'table-striped', 'table-compact', 'table-sticky', 'table-stack'] },
    examples: [{ title: 'Training runs', html: `<div class="table-wrap cq">
  <div class="table-toolbar"><h3 class="table-title">Training runs</h3><div class="search">${ic('search')}<input class="input input-sm" type="search" placeholder="Filter" aria-label="Filter runs" data-table-filter></div><button class="btn btn-sm btn-primary">${ic('plus')} New run</button></div>
  <table class="table table-hover table-stack" data-forma="table">
    <thead><tr>
      <th scope="col"><input type="checkbox" class="checkbox" aria-label="Select all" data-select-all></th>
      <th scope="col" aria-sort="none"><button class="sort-btn">Model</button></th>
      <th scope="col">Stage</th>
      <th scope="col" class="num" aria-sort="none"><button class="sort-btn">Loss</button></th>
      <th scope="col" class="num">Duration</th>
      <th scope="col">Status</th>
    </tr></thead>
    <tbody>
      <tr><td><input type="checkbox" class="checkbox" aria-label="Select Forge-14B"></td><td data-label="Model" class="cell-strong">Forge-14B</td><td data-label="Stage" class="muted">DPO</td><td data-label="Loss" class="num">0.41</td><td data-label="Duration" class="num">4h 22m</td><td data-label="Status"><span class="status"><span class="status-dot status-dot-warning status-dot-pulse"></span>Running</span></td></tr>
      <tr><td><input type="checkbox" class="checkbox" aria-label="Select Cortex-14B"></td><td data-label="Model" class="cell-strong">Cortex-14B</td><td data-label="Stage" class="muted">SFT</td><td data-label="Loss" class="num">0.68</td><td data-label="Duration" class="num">—</td><td data-label="Status"><span class="status"><span class="status-dot"></span>Queued</span></td></tr>
      <tr><td><input type="checkbox" class="checkbox" aria-label="Select Fehm-8B"></td><td data-label="Model" class="cell-strong">Fehm-8B</td><td data-label="Stage" class="muted">SFT + DPO</td><td data-label="Loss" class="num">0.34</td><td data-label="Duration" class="num">5h 14m</td><td data-label="Status"><span class="status"><span class="status-dot status-dot-success"></span>Done</span></td></tr>
      <tr><td><input type="checkbox" class="checkbox" aria-label="Select Conflux-v1"></td><td data-label="Model" class="cell-strong">Conflux-v1</td><td data-label="Stage" class="muted">GRPO</td><td data-label="Loss" class="num">1.82</td><td data-label="Duration" class="num">1h 03m</td><td data-label="Status"><span class="status"><span class="status-dot status-dot-error"></span>Failed</span></td></tr>
    </tbody>
  </table>
  <div class="table-footer"><span data-table-status>4 runs</span><span>Page 1 of 1</span></div>
</div>` }],
    a11y: ['Sorting updates aria-sort on the <th>; the sort control is a real button.', 'Row selection mirrors aria-selected on the <tr>.', '.table-stack turns rows into labelled cards inside narrow containers (uses data-label).'],
    js: { auto: 'data-forma="table"', events: ['forma:sort', 'forma:select'] },
    v5: { 'data-table-wrap / data-table': 'table-wrap / table', 'dt-sort-btn.is-sorted': 'th[aria-sort] > .sort-btn', 'compare-table': 'table' },
  },
  {
    id: 'description-list', name: 'Description List', category: 'Data',
    description: 'Key–value pairs: inline, divided, or as a metadata grid.',
    classes: { base: 'dl', modifiers: ['dl-divided', 'dl-grid'] },
    examples: [{ title: 'Key–value', html: `<div class="grid-2">
  <dl class="dl dl-divided"><dt>Base model</dt><dd>Qwen3-14B</dd><dt>Licence</dt><dd>Apache 2.0</dd><dt>Stages</dt><dd>SFT → DPO</dd></dl>
  <dl class="dl dl-grid"><div><dt>engine</dt><dd>Unsloth + TRL</dd></div><div><dt>data</dt><dd>100K conv.</dd></div><div><dt>teacher</dt><dd>Qwen3-235B</dd></div><div><dt>context</dt><dd>128K</dd></div></dl>
</div>` }],
    v5: { 'specimen-grid / model-meta': 'dl / dl dl-grid' },
  },
  {
    id: 'kpi', name: 'KPI', category: 'Data',
    description: 'Headline numbers with trend and optional sparkline, in a responsive grid.',
    classes: { base: 'kpi', parts: ['kpi-grid', 'kpi-label', 'kpi-value', 'kpi-foot'] },
    examples: [{ title: 'KPI grid', html: `<div class="kpi-grid">
  <div class="kpi"><span class="kpi-label">Monthly revenue</span><span class="kpi-value">$48,210</span><span class="kpi-foot"><span class="metric-delta" data-trend="up">12.4%</span> vs last month</span><svg class="sparkline" data-forma="sparkline" data-values="12,14,13,17,16,19,22,21,25" role="img" aria-label="Revenue trend, rising"></svg></div>
  <div class="kpi"><span class="kpi-label">Active users</span><span class="kpi-value">3,847</span><span class="kpi-foot"><span class="metric-delta" data-trend="up">8.1%</span> this week</span></div>
  <div class="kpi"><span class="kpi-label">Churn</span><span class="kpi-value">2.3%</span><span class="kpi-foot"><span class="metric-delta" data-trend="up">−0.5 pt</span> improvement</span></div>
  <div class="kpi"><span class="kpi-label">NPS</span><span class="kpi-value">72</span><span class="kpi-foot"><span class="metric-delta">0.0</span> no change</span></div>
</div>` }],
    v5: { 'kpi-card / kpi-trend kpi-up / kpi-delta kpi-delta-up': 'kpi / metric-delta[data-trend=up]' },
  },
  {
    id: 'stats', name: 'Stats Row', category: 'Data',
    description: 'A ruled strip of totals.',
    classes: { base: 'stats', parts: ['stat', 'stat-value', 'stat-label'] },
    examples: [{ title: 'Stats', html: `<div class="stats"><div class="stat"><span class="stat-value">≈ $400</span><span class="stat-label">Total cost</span></div><div class="stat"><span class="stat-value">6 wk</span><span class="stat-label">Duration</span></div><div class="stat"><span class="stat-value">100K</span><span class="stat-label">Conversations</span></div><div class="stat"><span class="stat-value">3</span><span class="stat-label">Models</span></div></div>` }],
    v5: { 'stats-row / stat-block / stat-num': 'stats / stat / stat-value' },
  },
  {
    id: 'timeline', name: 'Timeline', category: 'Data',
    description: 'Events over time, vertical or horizontal, with tone markers.',
    classes: { base: 'timeline', modifiers: ['timeline-horizontal'], parts: ['timeline-item', 'timeline-title', 'timeline-text', 'timeline-time'], attributes: ['data-tone'] },
    examples: [{ title: 'Timeline', html: `<ol class="timeline">
  <li class="timeline-item" data-tone="success"><p class="timeline-title">Deployed to production</p><time class="timeline-time" datetime="2026-10-08T14:32">Today, 14:32</time></li>
  <li class="timeline-item" data-tone="accent"><p class="timeline-title">PR #142 merged</p><p class="timeline-text">feat: contrast-proven token engine</p><time class="timeline-time">Today, 12:05</time></li>
  <li class="timeline-item" data-tone="error"><p class="timeline-title">Staging build failed</p><p class="timeline-text">2 failing tests</p><time class="timeline-time">Yesterday, 18:44</time></li>
  <li class="timeline-item"><p class="timeline-title">Sprint 24 started</p><time class="timeline-time">Mon, 09:00</time></li>
</ol>` }],
  },
  {
    id: 'feed', name: 'Activity Feed', category: 'Data',
    description: 'Who did what, when — with unread markers and quoted context.',
    classes: { base: 'feed', parts: ['feed-item', 'feed-body', 'feed-quote', 'feed-time'], attributes: ['data-unread'] },
    examples: [{ title: 'Activity', html: `<ul class="feed">
  <li class="feed-item" data-unread><span class="avatar avatar-sm avatar-accent">EV</span><div class="feed-body"><strong>Elena V.</strong> commented on <strong>Invoice #0047</strong><p class="feed-quote">Payment confirmed — closing this.</p></div><time class="feed-time">2m</time></li>
  <li class="feed-item"><span class="avatar avatar-sm avatar-info">CK</span><div class="feed-body"><strong>Chris K.</strong> assigned <strong>BUG-88</strong> to you</div><time class="feed-time">18m</time></li>
  <li class="feed-item"><span class="avatar avatar-sm avatar-success">SY</span><div class="feed-body"><strong>Selin Y.</strong> closed milestone <strong>v6.0</strong></div><time class="feed-time">1h</time></li>
</ul>` }],
    v5: { 'activity-feed / activity-item': 'feed / feed-item' },
  },
  {
    id: 'kanban', name: 'Kanban', category: 'Data',
    description: 'Columns of cards with drag-and-drop and a keyboard alternative (Space to lift, arrows to move).',
    classes: { base: 'kanban', parts: ['kanban-col', 'kanban-head', 'kanban-count', 'kanban-card', 'kanban-card-title', 'kanban-card-meta', 'kanban-add'] },
    examples: [{ title: 'Board', html: `<div class="kanban" data-forma="kanban">
  <section class="kanban-col" aria-label="Backlog"><h3 class="kanban-head">Backlog <span class="kanban-count">2</span></h3>
    <article class="kanban-card" tabindex="0"><p class="kanban-card-title">Redesign onboarding</p><p class="kanban-card-meta"><span class="badge badge-info">Design</span>NGA-145</p></article>
    <article class="kanban-card" tabindex="0"><p class="kanban-card-title">Migrate legacy API</p><p class="kanban-card-meta"><span class="badge">Backend</span>NGA-142</p></article>
    <button class="kanban-add">${ic('plus')} Add card</button></section>
  <section class="kanban-col" aria-label="In progress"><h3 class="kanban-head">In progress <span class="kanban-count">1</span></h3>
    <article class="kanban-card" tabindex="0"><p class="kanban-card-title">Token engine dark-mode refresh</p><p class="kanban-card-meta"><span class="badge badge-accent">CSS</span>NGA-138</p></article></section>
  <section class="kanban-col" aria-label="Done"><h3 class="kanban-head">Done <span class="kanban-count">1</span></h3>
    <article class="kanban-card" tabindex="0"><p class="kanban-card-title">Wizard component</p><p class="kanban-card-meta"><span class="badge badge-success">Done</span>NGA-130</p></article></section>
</div>` }],
    a11y: ['Keyboard: focus a card, Space to lift, ←/→ to change column, Space to drop, Escape to cancel; moves are announced.'],
    js: { auto: 'data-forma="kanban"', events: ['forma:move'] },
    v5: { 'kanban-board / kanban-column': 'kanban / kanban-col' },
  },
  {
    id: 'calendar', name: 'Calendar', category: 'Data',
    description: 'Month view with events and today marker.',
    classes: { base: 'calendar', parts: ['calendar-head', 'calendar-title', 'calendar-grid', 'calendar-weekday', 'calendar-cell', 'calendar-date', 'calendar-event'], attributes: ['data-outside', 'aria-current="date"', 'data-tone'] },
    examples: [{ title: 'Month', html: `<div class="calendar" data-forma="calendar" data-month="2026-10" data-events='[{"date":"2026-10-08","title":"DPO run","tone":"accent"},{"date":"2026-10-12","title":"Release 6.0","tone":"success"},{"date":"2026-10-21","title":"Board review","tone":"warning"}]'></div>` }],
    js: { auto: 'data-forma="calendar"', api: 'Forma.calendar(el, { month, events, locale, weekStart })' },
  },
  {
    id: 'list', name: 'List', category: 'Data',
    description: 'Plain and interactive lists of rows.',
    classes: { base: 'list', modifiers: ['list-interactive'], parts: ['list-item', 'list-item-body', 'list-item-sub'] },
    examples: [{ title: 'List', html: `<ul class="list list-interactive">
  <li><a class="list-item" href="#">${ic('file-text', 'fi-tertiary')}<span class="list-item-body">Q3 report.pdf<span class="list-item-sub">2.4 MB · yesterday</span></span>${ic('chevron-right', 'fi-tertiary')}</a></li>
  <li><a class="list-item" href="#">${ic('file-code', 'fi-tertiary')}<span class="list-item-body">pipeline.yaml<span class="list-item-sub">3 KB · 2 days ago</span></span>${ic('chevron-right', 'fi-tertiary')}</a></li>
</ul>` }],
  },
  {
    id: 'tree', name: 'Tree View', category: 'Data',
    description: 'Hierarchies — files, schemas, taxonomies — with the WAI-ARIA tree pattern.',
    classes: { base: 'tree', parts: ['tree-item', 'tree-meta'] },
    examples: [{ title: 'Tree', html: `<ul class="tree" role="tree" aria-label="Schema" data-forma="tree">
  <li role="treeitem" aria-expanded="true"><span class="tree-item">${ic('database')} nage_prod</span>
    <ul role="group">
      <li role="treeitem" aria-expanded="true"><span class="tree-item">${ic('table')} runs <span class="tree-meta">4.2K</span></span>
        <ul role="group"><li role="treeitem"><span class="tree-item">id <span class="tree-meta">uuid</span></span></li><li role="treeitem" aria-selected="true"><span class="tree-item">loss <span class="tree-meta">float8</span></span></li></ul></li>
      <li role="treeitem" aria-expanded="false"><span class="tree-item">${ic('table')} datasets <span class="tree-meta">312</span></span><ul role="group"><li role="treeitem"><span class="tree-item">name</span></li></ul></li>
    </ul></li>
</ul>` }],
    a11y: ['Arrow keys move/expand/collapse; Home/End; Enter selects. Forma.js manages roving tabindex.'],
    js: { auto: 'data-forma="tree"', events: ['forma:select'] },
  },
];
