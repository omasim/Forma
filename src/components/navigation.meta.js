import { ic } from './_helpers.js';

export default [
  {
    id: 'link', name: 'Link', category: 'Navigation',
    description: 'Inline text links with a quiet underline that strengthens on hover.',
    classes: { base: 'link', modifiers: ['link-quiet'] },
    examples: [{ title: 'Links', html: `<p class="t-body">Read the <a class="link" href="#">token reference</a> or browse <a class="link link-quiet" href="#">all themes</a>.</p>` }],
  },
  {
    id: 'navbar', name: 'Navbar', category: 'Navigation',
    description: 'Top application bar: brand, primary links, actions. Sticky translucent variant.',
    classes: { base: 'navbar', modifiers: ['navbar-sticky'], parts: ['navbar-brand', 'navbar-nav', 'navbar-link', 'navbar-end', 'navbar-toggle', 'navbar-collapse'] },
    examples: [{ title: 'Navbar', html: `<nav class="navbar" aria-label="Main">
  <a class="navbar-brand" href="#">Forma</a>
  <ul class="navbar-nav navbar-collapse">
    <li><a class="navbar-link" href="#" aria-current="page">Dashboard</a></li>
    <li><a class="navbar-link" href="#">Models</a></li>
    <li><a class="navbar-link" href="#">Datasets</a></li>
    <li><a class="navbar-link" href="#">Evals</a></li>
  </ul>
  <div class="navbar-end">
    <button class="btn btn-sm btn-ghost" data-forma-open="cmdk">${ic('search')}<kbd class="kbd">⌘K</kbd></button>
    <button class="btn btn-icon btn-ghost btn-sm" aria-label="Notifications">${ic('bell')}</button>
    <button class="btn btn-icon btn-ghost btn-sm navbar-toggle" aria-label="Menu">${ic('menu')}</button>
    <span class="avatar avatar-sm avatar-accent">ÖA</span>
  </div>
</nav>` }],
    a11y: ['<nav aria-label> landmark; the current page uses aria-current="page".', 'Below 880px .navbar-collapse hides and .navbar-toggle opens a drawer.'],
  },
  {
    id: 'sidebar', name: 'Sidebar', category: 'Navigation',
    description: 'App navigation rail with sections, counts and a collapsed icon-only mode. Pairs with .app-shell.',
    classes: { base: 'sidebar', parts: ['sidebar-header', 'sidebar-section', 'sidebar-item', 'sidebar-label', 'sidebar-count', 'sidebar-footer', 'app-shell', 'app-main'], states: ['data-collapsed'] },
    examples: [{ title: 'Sidebar', html: `<nav class="sidebar" aria-label="Workspace" id="sb-demo" style="block-size:380px">
  <div class="sidebar-header"><span class="avatar avatar-sm avatar-square avatar-accent">N</span><span class="sidebar-label t-body-sm">Nage Workspace</span></div>
  <a class="sidebar-item" href="#" aria-current="page">${ic('home')}<span class="sidebar-label">Overview</span></a>
  <p class="sidebar-section">Models</p>
  <a class="sidebar-item" href="#">${ic('box')}<span class="sidebar-label">Forge</span><span class="sidebar-count">3</span></a>
  <a class="sidebar-item" href="#">${ic('box')}<span class="sidebar-label">Fehm</span><span class="sidebar-count">1</span></a>
  <p class="sidebar-section">Data</p>
  <a class="sidebar-item" href="#">${ic('database')}<span class="sidebar-label">Datasets</span><span class="sidebar-count">12</span></a>
  <div class="sidebar-footer"><button class="sidebar-item" data-forma="sidebar-toggle" data-target="sb-demo" aria-expanded="true">${ic('sidebar')}<span class="sidebar-label">Collapse</span></button></div>
</nav>` }],
    a11y: ['Collapsed items keep their accessible names (labels are hidden visually only by display:none → use title/tooltip: Forma.js adds data-tooltip from the label).'],
    js: { auto: 'data-forma="sidebar-toggle"' },
    v5: { 'sidebar-collapsible.is-collapsed': 'sidebar[data-collapsed]', 'nav-tabs-v': 'tabs tabs-vertical' },
  },
  {
    id: 'breadcrumb', name: 'Breadcrumb', category: 'Navigation',
    description: 'Hierarchy trail as an ordered list.',
    classes: { base: 'breadcrumb', modifiers: ['breadcrumb-chevron'] },
    examples: [{ title: 'Breadcrumb', html: `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>
  <li><a href="#">Home</a></li><li><a href="#">Models</a></li><li><a href="#">Forge</a></li><li><span aria-current="page">forge-14b-sft-v1</span></li>
</ol></nav>` }],
    v5: { 'breadcrumb-item / breadcrumb-sep': '<ol> items, separators are generated' },
  },
  {
    id: 'pagination', name: 'Pagination', category: 'Navigation',
    description: 'Page links with current, disabled and ellipsis states.',
    classes: { base: 'pagination', parts: ['page-link', 'page-ellipsis', 'pagination-info'] },
    examples: [{ title: 'Pagination', html: `<nav aria-label="Pagination" class="split"><span class="pagination-info">Showing 21–40 of 412</span><ul class="pagination">
  <li><a class="page-link" href="#" aria-label="Previous page">${ic('chevron-left')}</a></li>
  <li><a class="page-link" href="#">1</a></li><li><a class="page-link" href="#" aria-current="page">2</a></li><li><a class="page-link" href="#">3</a></li>
  <li><span class="page-ellipsis">…</span></li><li><a class="page-link" href="#">21</a></li>
  <li><a class="page-link" href="#" aria-label="Next page">${ic('chevron-right')}</a></li>
</ul></nav>` }],
    v5: { 'page-btn.is-active': 'page-link[aria-current="page"]' },
  },
  {
    id: 'tabs', name: 'Tabs', category: 'Navigation',
    description: 'WAI-ARIA tabs in four looks: line, underline, pill, vertical. Arrow keys, Home/End, automatic activation.',
    classes: { base: 'tabs', variants: ['tabs-underline', 'tabs-pill', 'tabs-vertical'], parts: ['tab-list', 'tab', 'tab-panel'] },
    examples: [{ title: 'Line & pill tabs', html: `<div class="stack gap-6">
  <div class="tabs" data-forma="tabs">
    <div class="tab-list" role="tablist" aria-label="Run details">
      <button class="tab" role="tab" aria-selected="true">Overview</button>
      <button class="tab" role="tab">Data</button>
      <button class="tab" role="tab">Analysis <span class="badge">3</span></button>
      <button class="tab" role="tab">Settings</button>
    </div>
    <div class="tab-panel" role="tabpanel">Key metrics, recent activity and system status.</div>
    <div class="tab-panel" role="tabpanel" hidden>Tables and filters.</div>
    <div class="tab-panel" role="tabpanel" hidden>Charts and insights.</div>
    <div class="tab-panel" role="tabpanel" hidden>Configuration.</div>
  </div>
  <div class="tabs tabs-pill" data-forma="tabs">
    <div class="tab-list" role="tablist" aria-label="Filter"><button class="tab" role="tab" aria-selected="true">All</button><button class="tab" role="tab">Active</button><button class="tab" role="tab">Archived</button></div>
    <div class="tab-panel" role="tabpanel">All runs.</div><div class="tab-panel" role="tabpanel" hidden>Active runs.</div><div class="tab-panel" role="tabpanel" hidden>Archived runs.</div>
  </div>
</div>` }],
    a11y: ['Forma.js wires ids, aria-controls, aria-labelledby and tabindex; only the selected tab is in the Tab order.', 'Panels toggle with the hidden attribute, never inline styles.'],
    js: { auto: 'data-forma="tabs"', api: 'Forma.tabs(el).select(index)', events: ['forma:tab'] },
    v5: { 'tab-item.is-active + switchTab(group, i, el)': 'tab[aria-selected] (automatic)', 'tab-list-pill / tab-item-pill': 'tabs tabs-pill', 'tab-list-underline': 'tabs tabs-underline' },
  },
  {
    id: 'steps', name: 'Steps', category: 'Navigation',
    description: 'Progress through a multi-step flow, horizontal or vertical.',
    classes: { base: 'steps', modifiers: ['steps-vertical'], parts: ['step', 'step-title', 'step-desc'], states: ['data-state="done"', 'aria-current="step"'] },
    examples: [{ title: 'Steps', html: `<div class="stack gap-6">
  <ol class="steps" aria-label="Setup progress">
    <li class="step" data-state="done"><span class="step-title">Account</span></li>
    <li class="step" data-state="done"><span class="step-title">Dataset</span></li>
    <li class="step" aria-current="step"><span class="step-title">Pipeline</span><span class="step-desc">Choose a base model</span></li>
    <li class="step"><span class="step-title">Evaluate</span></li>
    <li class="step"><span class="step-title">Deploy</span></li>
  </ol>
  <ol class="steps steps-vertical" aria-label="Onboarding">
    <li class="step" data-state="done"><div><p class="step-title">Account created</p><p class="step-desc">E-mail verified</p></div></li>
    <li class="step" aria-current="step"><div><p class="step-title">Configure pipeline</p><p class="step-desc">Pick a base model and start training</p></div></li>
    <li class="step"><div><p class="step-title">Deploy</p></div></li>
  </ol>
</div>` }],
    v5: { 'step-nav / step-nav-dot.done': 'steps / step[data-state=done]', 'onb / onb-step': 'steps steps-vertical' },
  },
  {
    id: 'wizard', name: 'Wizard', category: 'Navigation',
    description: 'Multi-step form: steps + panels + navigation. Validates each panel before advancing.',
    classes: { base: 'wizard', parts: ['wizard-panel', 'wizard-nav', 'wizard-count'] },
    attributes: ['data-wizard-next', 'data-wizard-prev'],
    examples: [{ title: 'Wizard', html: `<form class="wizard card" data-forma="wizard" novalidate>
  <ol class="steps"><li class="step"><span class="step-title">Account</span></li><li class="step"><span class="step-title">Profile</span></li><li class="step"><span class="step-title">Review</span></li></ol>
  <section class="wizard-panel stack"><div class="field"><label class="field-label" for="wz-mail">E-mail</label><input class="input" id="wz-mail" type="email" required></div></section>
  <section class="wizard-panel stack" hidden><div class="field"><label class="field-label" for="wz-name">Display name</label><input class="input" id="wz-name" required></div></section>
  <section class="wizard-panel" hidden><p class="t-body-sm t-secondary">All set. Submit to create your workspace.</p></section>
  <div class="wizard-nav"><button type="button" class="btn btn-ghost" data-wizard-prev>Back</button><span class="wizard-count" aria-live="polite"></span><button type="button" class="btn btn-primary" data-wizard-next>Continue</button></div>
</form>` }],
    a11y: ['Focus moves to the first field of each new panel; the step counter is announced.'],
    js: { auto: 'data-forma="wizard"', api: 'Forma.wizard(el) → { next, prev, go(i), index }', events: ['forma:step'] },
    v5: { 'FormaWizard(el)': 'Forma.wizard(el)' },
  },
  {
    id: 'mega-menu', name: 'Mega Menu', category: 'Navigation',
    description: 'Wide, multi-column navigation panel on the Popover API.',
    classes: { base: 'mega', modifiers: ['mega-static'], parts: ['mega-col-title', 'mega-link', 'mega-link-title', 'mega-link-desc', 'mega-feature'] },
    examples: [{ title: 'Mega menu', html: `<div class="mega mega-static">
  <div><p class="mega-col-title">Product</p>
    <a class="mega-link" href="#">${ic('layers', 'fi-lg fi-accent')}<span><span class="mega-link-title">Components</span><span class="mega-link-desc">72 accessible building blocks</span></span></a>
    <a class="mega-link" href="#">${ic('palette', 'fi-lg fi-accent')}<span><span class="mega-link-title">Themes</span><span class="mega-link-desc">55 contrast-proven looks</span></span></a></div>
  <div><p class="mega-col-title">Developers</p>
    <a class="mega-link" href="#">${ic('bot', 'fi-lg fi-accent')}<span><span class="mega-link-title">MCP server</span><span class="mega-link-desc">Let agents build with FORMA</span></span></a>
    <a class="mega-link" href="#">${ic('file-code', 'fi-lg fi-accent')}<span><span class="mega-link-title">llms.txt</span><span class="mega-link-desc">Machine-readable reference</span></span></a></div>
  <div class="mega-feature"><p class="card-eyebrow">New in 6.0</p><p class="mega-link-title">Contrast-proven themes</p><p class="mega-link-desc">Every token is checked against WCAG at build time.</p></div>
</div>` }],
  },
  {
    id: 'bottom-nav', name: 'Bottom Navigation', category: 'Navigation',
    description: 'Mobile tab bar with safe-area padding and 44px targets.',
    classes: { base: 'bottom-nav', parts: ['bottom-nav-item'] },
    examples: [{ title: 'Bottom nav', html: `<nav class="bottom-nav" aria-label="Primary" style="position:static">
  <a class="bottom-nav-item" href="#" aria-current="page">${ic('home')}Home</a><a class="bottom-nav-item" href="#">${ic('box')}Models</a>
  <a class="bottom-nav-item" href="#">${ic('plus-circle')}New</a><a class="bottom-nav-item" href="#">${ic('chart-bar')}Evals</a><a class="bottom-nav-item" href="#">${ic('user')}Profile</a>
</nav>` }],
  },
  {
    id: 'footer', name: 'Footer', category: 'Navigation',
    description: 'Site footer with link columns and a legal row.',
    classes: { base: 'footer', parts: ['footer-grid', 'footer-title', 'footer-links', 'footer-bottom'] },
    examples: [{ title: 'Footer', html: `<footer class="footer"><div class="container">
  <div class="footer-grid">
    <div class="stack gap-3"><span class="navbar-brand">Forma</span><p class="t-body-sm t-secondary">A museum-grade design system.</p></div>
    <div><p class="footer-title">Product</p><ul class="footer-links"><li><a href="#">Components</a></li><li><a href="#">Themes</a></li><li><a href="#">Changelog</a></li></ul></div>
    <div><p class="footer-title">Developers</p><ul class="footer-links"><li><a href="#">Docs</a></li><li><a href="#">llms.txt</a></li><li><a href="#">MCP</a></li></ul></div>
  </div>
  <div class="footer-bottom"><span>© 2026 Ömer Asım · MIT</span><span>Istanbul</span></div>
</div></footer>` }],
  },
];
