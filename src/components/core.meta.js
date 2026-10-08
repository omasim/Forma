import { ic } from './_helpers.js';

export default [
  {
    id: 'button', name: 'Button', category: 'Core',
    description: 'Actions. Eight intents, three sizes, icon-only, loading and grouped forms.',
    classes: { base: 'btn', variants: ['btn-primary', 'btn-secondary', 'btn-accent', 'btn-soft', 'btn-ghost', 'btn-outline', 'btn-destructive', 'btn-danger', 'btn-link'], sizes: ['btn-sm', 'btn-md', 'btn-lg'], modifiers: ['btn-icon', 'btn-block', 'is-loading'], parts: ['btn-group'] },
    examples: [
      { title: 'Intents', html: `<div class="cluster">
  <button class="btn btn-primary">Primary</button>
  <button class="btn">Secondary</button>
  <button class="btn btn-accent">Accent</button>
  <button class="btn btn-soft">Soft</button>
  <button class="btn btn-ghost">Ghost</button>
  <button class="btn btn-outline">Outline</button>
  <button class="btn btn-destructive">Delete</button>
  <button class="btn btn-danger">Delete forever</button>
  <button class="btn btn-link">Link</button>
</div>` },
      { title: 'Sizes, icons, states', html: `<div class="cluster">
  <button class="btn btn-sm">Small</button>
  <button class="btn">Medium</button>
  <button class="btn btn-lg">Large</button>
  <button class="btn btn-accent">${ic('plus')} New model</button>
  <button class="btn btn-icon" aria-label="Settings">${ic('settings')}</button>
  <button class="btn btn-primary" aria-busy="true">Saving</button>
  <button class="btn" disabled>Disabled</button>
</div>` },
      { title: 'Group (segmented toggle)', html: `<div class="btn-group" role="group" aria-label="Billing period">
  <button class="btn btn-sm" aria-pressed="true">Monthly</button>
  <button class="btn btn-sm" aria-pressed="false">Annual</button>
  <button class="btn btn-sm" aria-pressed="false">Custom</button>
</div>` },
    ],
    a11y: ['Icon-only buttons need aria-label.', 'Loading: set aria-busy="true" — the label stays in the accessibility tree while hidden visually.', 'Toggle groups use aria-pressed; Forma.js keeps it in sync when data-forma="toggle-group" is set.', 'Use <a class="btn"> only for navigation.'],
    v5: { 'btn-icon (standalone)': 'btn btn-icon' },
  },
  {
    id: 'badge', name: 'Badge', category: 'Core',
    description: 'Compact, non-interactive status labels.',
    classes: { base: 'badge', variants: ['badge-accent', 'badge-success', 'badge-warning', 'badge-error', 'badge-info', 'badge-outline', 'badge-solid'], modifiers: ['badge-pill', 'badge-dot', 'badge-mono', 'badge-plan'] },
    examples: [{ title: 'Badges', html: `<div class="cluster">
  <span class="badge">Draft</span>
  <span class="badge badge-accent">New</span>
  <span class="badge badge-success badge-dot">Published</span>
  <span class="badge badge-warning">Review</span>
  <span class="badge badge-error">Failed</span>
  <span class="badge badge-info">Beta</span>
  <span class="badge badge-outline">Archived</span>
  <span class="badge badge-solid badge-pill">12</span>
  <span class="badge badge-plan badge-accent">Pro</span>
</div>` }],
    a11y: ['Color is never the only signal: badges always carry text.'],
    v5: { 'plan-badge pb-pro': 'badge badge-plan badge-accent' },
  },
  {
    id: 'tag', name: 'Tag & Chip', category: 'Core',
    description: 'Tags are toggleable filters; chips are removable values.',
    classes: { base: 'tag', states: ['aria-pressed', 'is-active'], parts: ['chip', 'chip-remove'] },
    examples: [{ title: 'Filter tags & chips', html: `<div class="stack gap-3">
  <div class="cluster" role="group" aria-label="Filter by medium">
    <button class="tag" aria-pressed="true">All</button>
    <button class="tag" aria-pressed="false">Painting</button>
    <button class="tag" aria-pressed="false">Sculpture</button>
    <button class="tag" aria-pressed="false">Digital</button>
  </div>
  <div class="cluster">
    <span class="chip">Qwen3-14B <button class="chip-remove" aria-label="Remove Qwen3-14B">×</button></span>
    <span class="chip">SFT <button class="chip-remove" aria-label="Remove SFT">×</button></span>
  </div>
</div>` }],
    a11y: ['Tags are buttons with aria-pressed.', 'Each chip-remove button names the value it removes.'],
  },
  {
    id: 'avatar', name: 'Avatar', category: 'Core',
    description: 'People and entities — round or square, six sizes, initials or image, grouped.',
    classes: { base: 'avatar', sizes: ['avatar-xs', 'avatar-sm', 'avatar-md', 'avatar-lg', 'avatar-xl', 'avatar-2xl'], variants: ['avatar-accent', 'avatar-info', 'avatar-success', 'avatar-warning'], modifiers: ['avatar-square', 'avatar-status'], parts: ['avatar-group'] },
    examples: [{ title: 'Sizes & group', html: `<div class="cluster gap-4">
  <span class="avatar avatar-xs">A</span>
  <span class="avatar avatar-sm">ÖA</span>
  <span class="avatar avatar-md avatar-accent">EV</span>
  <span class="avatar avatar-lg avatar-square avatar-info">CK</span>
  <span class="avatar avatar-xl avatar-status">SY</span>
  <div class="avatar-group">
    <span class="avatar avatar-sm avatar-accent">F</span>
    <span class="avatar avatar-sm avatar-info">C</span>
    <span class="avatar avatar-sm avatar-success">E</span>
    <span class="avatar avatar-sm">+4</span>
  </div>
</div>` }],
    a11y: ['Images need alt text; decorative initials next to a visible name can be aria-hidden.'],
    v5: { 'picon picon-lg': 'avatar avatar-lg avatar-square' },
  },
  {
    id: 'divider', name: 'Divider', category: 'Core',
    description: 'Separation through restraint: three weights, vertical and labeled.',
    classes: { base: 'divider', variants: ['divider-faint', 'divider-strong', 'divider-vertical'], parts: ['divider-label'] },
    examples: [{ title: 'Dividers', html: `<div>
  <hr class="divider">
  <div class="divider-label">or continue with email</div>
  <p class="t-body-sm">Left <span class="divider-vertical" role="separator"></span> Right</p>
</div>` }],
  },
  {
    id: 'icon', name: 'Icon', category: 'Core',
    description: 'Stroke icons from the forma-icons.svg sprite (Lucide, ISC). Six sizes, semantic colors.',
    classes: { base: 'fi', sizes: ['fi-xs', 'fi-sm', 'fi-md', 'fi-lg', 'fi-xl', 'fi-2xl'], variants: ['fi-primary', 'fi-secondary', 'fi-tertiary', 'fi-accent', 'fi-success', 'fi-warning', 'fi-error', 'fi-info'], parts: ['icon-tile', 'icon-tile-accent'] },
    examples: [{ title: 'Icons', html: `<div class="cluster gap-4">
  ${ic('brain', 'fi-xl fi-accent')} ${ic('database', 'fi-xl')} ${ic('check-circle', 'fi-xl fi-success')} ${ic('warning', 'fi-xl fi-warning')} ${ic('x-circle', 'fi-xl fi-error')}
  <span class="icon-tile icon-tile-accent">${ic('sparkle', 'fi-lg')}</span>
</div>` }],
    a11y: ['Decorative icons: aria-hidden="true". Meaningful standalone icons: role="img" + aria-label, or a visible label.'],
    usage: '<svg class="fi"><use href="/dist/forma-icons.svg#fi-check"/></svg>',
  },
  {
    id: 'spinner', name: 'Spinner', category: 'Core',
    description: 'Indeterminate loading indicator.',
    classes: { base: 'spinner', sizes: ['spinner-xs', 'spinner-sm', 'spinner-md', 'spinner-lg', 'spinner-xl'], variants: ['spinner-accent'] },
    examples: [{ title: 'Spinners', html: `<div class="cluster gap-4" role="status" aria-label="Loading">
  <span class="spinner spinner-xs"></span><span class="spinner spinner-sm"></span><span class="spinner"></span>
  <span class="spinner spinner-lg spinner-accent"></span><span class="spinner spinner-xl"></span>
</div>` }],
    a11y: ['Wrap in role="status" with a label; spinners keep rotating slowly under reduced motion so the state stays visible.'],
  },
  {
    id: 'skeleton', name: 'Skeleton', category: 'Core',
    description: 'Shape-preserving placeholders while content loads.',
    classes: { base: 'skeleton', variants: ['skeleton-text', 'skeleton-title', 'skeleton-avatar', 'skeleton-block', 'skeleton-btn'] },
    examples: [{ title: 'Card skeleton', html: `<div class="card stack gap-2" role="status" aria-busy="true" aria-label="Loading card">
  <div class="cluster"><span class="skeleton skeleton-avatar"></span><span class="skeleton skeleton-title"></span></div>
  <span class="skeleton skeleton-text"></span><span class="skeleton skeleton-text" style="inline-size:70%"></span>
  <span class="skeleton skeleton-btn"></span>
</div>` }],
    v5: { 'skel-shimmer': 'skeleton', 'skel-text': 'skeleton skeleton-text' },
  },
  {
    id: 'progress', name: 'Progress', category: 'Core',
    description: 'Determinate and indeterminate progress. Width comes from --value.',
    classes: { base: 'progress', parts: ['progress-head', 'progress-value', 'progress-track', 'progress-fill'], variants: ['progress-accent', 'progress-success', 'progress-warning', 'progress-error', 'progress-indeterminate'], modifiers: ['progress-track-lg', 'progress-native'] },
    examples: [{ title: 'Progress', html: `<div class="stack gap-4">
  <div class="progress progress-accent">
    <div class="progress-head"><span>DPO training</span><span class="progress-value">62%</span></div>
    <div class="progress-track" role="progressbar" aria-label="DPO training" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="--value:62%"></div></div>
  </div>
  <div class="progress progress-success"><div class="progress-track progress-track-lg" role="progressbar" aria-label="Upload" aria-valuenow="100"><div class="progress-fill" style="--value:100%"></div></div></div>
  <div class="progress progress-indeterminate"><div class="progress-track" role="progressbar" aria-label="Queued"><div class="progress-fill"></div></div></div>
</div>` }],
    a11y: ['The track carries role="progressbar" with aria-valuenow; omit valuenow for indeterminate.'],
  },
  {
    id: 'status', name: 'Status Dot', category: 'Core',
    description: 'Tiny live-state indicators with text.',
    classes: { base: 'status', parts: ['status-dot'], variants: ['status-dot-success', 'status-dot-warning', 'status-dot-error', 'status-dot-info'], modifiers: ['status-dot-pulse'] },
    examples: [{ title: 'Statuses', html: `<div class="stack gap-2">
  <span class="status"><span class="status-dot status-dot-success status-dot-pulse"></span>API — operational</span>
  <span class="status"><span class="status-dot status-dot-warning"></span>Benchmark — queued</span>
  <span class="status"><span class="status-dot status-dot-error"></span>GRPO stage — failed</span>
  <span class="status"><span class="status-dot"></span>Idle</span>
</div>` }],
  },
  {
    id: 'kbd', name: 'Kbd', category: 'Core',
    description: 'Keyboard keys and shortcuts.',
    classes: { base: 'kbd' },
    examples: [{ title: 'Shortcut', html: `<p class="t-body-sm">Open the command palette with <kbd class="kbd">⌘</kbd> <kbd class="kbd">K</kbd></p>` }],
  },
  {
    id: 'tooltip', name: 'Tooltip', category: 'Core',
    description: 'Short labels on hover and focus. Declarative via data-tooltip; rich variant for longer content.',
    classes: { base: 'tooltip', modifiers: ['tooltip-rich'], parts: ['tooltip-title'] },
    attributes: ['data-tooltip'],
    examples: [{ title: 'Tooltips', html: `<div class="cluster">
  <button class="btn btn-icon" aria-label="Copy" data-tooltip="Copy to clipboard">${ic('copy')}</button>
  <button class="btn btn-sm" data-tooltip="Runs SFT then DPO on the current dataset">Start training</button>
</div>` }],
    a11y: ['Forma.js upgrades data-tooltip into a popover linked with aria-describedby, shown on hover and keyboard focus, dismissed with Escape (WCAG 1.4.13).', 'Never put essential or interactive content in a tooltip.'],
    js: { auto: 'data-tooltip', api: 'Forma.tooltip(el)' },
  },
  {
    id: 'code', name: 'Code & Log', category: 'Core',
    description: 'Code blocks with a copy action, inline code, and terminal/log output.',
    classes: { base: 'code-block', parts: ['code-block-head', 'code-copy', 'code-inline', 'log', 'log-line', 'log-time', 'log-info', 'log-ok', 'log-warn', 'log-error', 'tok-k', 'tok-s', 'tok-c', 'tok-n', 'tok-t'] },
    attributes: ['data-forma="copy"'],
    examples: [{ title: 'Code & log', html: `<div class="stack gap-4">
  <div>
    <div class="code-block-head"><span>index.html</span><button class="code-copy" data-forma="copy" data-copy-target="#code-ex">Copy</button></div>
    <pre class="code-block" id="code-ex"><code><span class="tok-c">&lt;!-- one stylesheet --&gt;</span>
&lt;link rel=<span class="tok-s">"stylesheet"</span> href=<span class="tok-s">"forma.min.css"</span>&gt;</code></pre>
  </div>
  <pre class="log"><span class="log-line"><span class="log-time">09:14:02</span><span class="log-info">INFO</span> Training started — Qwen3-14B</span>
<span class="log-line"><span class="log-time">09:22:41</span><span class="log-ok">OK  </span> Checkpoint saved</span>
<span class="log-line"><span class="log-time">09:23:12</span><span class="log-warn">WARN</span> VRAM 74.8 / 80 GB</span>
<span class="log-line"><span class="log-time">09:41:03</span><span class="log-error">ERR </span> Disk full — retrying</span></pre>
</div>` }],
    a11y: ['Copy buttons announce "Copied" through the shared live region.'],
    js: { auto: 'data-forma="copy"', api: 'Forma.copy(text)' },
  },
];
