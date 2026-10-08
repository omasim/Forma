import { ic } from './_helpers.js';

export default [
  {
    id: 'dashboard', name: 'Dashboard Grid', category: 'Dashboard',
    description: '12-column widget grid (span-3…12) with a page heading. Collapses gracefully.',
    classes: { base: 'dash', parts: ['span-3', 'span-4', 'span-6', 'span-8', 'span-12', 'widget', 'widget-head', 'widget-title', 'widget-body', 'widget-foot', 'page-head', 'page-title', 'page-desc'] },
    examples: [{ title: 'Dashboard', html: `<div class="page-head"><div><h1 class="page-title">Overview</h1><p class="page-desc">Week 41 · all workspaces</p></div><div class="cluster"><button class="btn btn-sm">${ic('download')} Export</button><button class="btn btn-sm btn-primary">${ic('plus')} New run</button></div></div>
<div class="dash">
  <section class="widget span-4"><header class="widget-head"><h2 class="widget-title">Traffic</h2><span class="badge badge-success">+18%</span></header><div class="widget-body metric"><span class="metric-value">12.4K</span><span class="metric-label">Daily page views</span></div></section>
  <section class="widget span-4"><header class="widget-head"><h2 class="widget-title">System</h2></header><div class="widget-body stack gap-2"><span class="status"><span class="status-dot status-dot-success"></span>API — operational</span><span class="status"><span class="status-dot status-dot-success"></span>Database — operational</span><span class="status"><span class="status-dot status-dot-warning"></span>CDN — high load</span></div></section>
  <section class="widget span-4"><header class="widget-head"><h2 class="widget-title">Quick actions</h2></header><div class="widget-body stack gap-2"><button class="btn btn-sm btn-block">${ic('plus')} Add product</button><button class="btn btn-sm btn-block">${ic('download')} Download report</button></div><footer class="widget-foot">Updated 5 min ago</footer></section>
</div>` }],
    v5: { 'dash-grid / dash-widget / dash-widget-2x': 'dash / widget / span-8' },
  },
  {
    id: 'notifications', name: 'Notification Center', category: 'Dashboard',
    description: 'Inbox panel with tabs, unread state and mark-all-read.',
    classes: { base: 'notifications', parts: ['notifications-head', 'notifications-title', 'notification-list', 'notification', 'notification-body', 'notification-time'], attributes: ['data-unread'] },
    examples: [{ title: 'Notifications', html: `<section class="notifications" aria-labelledby="nc-t"><header class="notifications-head"><h2 class="notifications-title" id="nc-t">Notifications</h2><button class="btn btn-link btn-sm">Mark all read</button></header>
  <div class="tabs tabs-underline" data-forma="tabs"><div class="tab-list" role="tablist" aria-label="Notification type"><button class="tab" role="tab" aria-selected="true">All</button><button class="tab" role="tab">Mentions</button><button class="tab" role="tab">System</button></div>
  <div class="tab-panel" role="tabpanel" style="padding:0"><ul class="notification-list">
    <li class="notification" data-unread><span class="avatar avatar-sm avatar-accent">SL</span><p class="notification-body"><strong>Sara L.</strong> mentioned you in <strong>Q4 report</strong><time class="notification-time">2 min ago</time></p></li>
    <li class="notification"><span class="icon-tile" style="inline-size:28px;block-size:28px">${ic('rocket', 'fi-sm')}</span><p class="notification-body">Deployment <strong>prod-6.0.1</strong> completed<time class="notification-time">14 min ago</time></p></li>
    <li class="notification"><span class="icon-tile" style="inline-size:28px;block-size:28px">${ic('hard-drive', 'fi-sm fi-warning')}</span><p class="notification-body">Storage at 80% — consider upgrading<time class="notification-time">3 h ago</time></p></li>
  </ul></div><div class="tab-panel" role="tabpanel" hidden></div><div class="tab-panel" role="tabpanel" hidden></div></div>
</section>` }],
    v5: { 'notif-center / notif-item.is-unread': 'notifications / notification[data-unread]', 'notif-stack / notif': 'toast-region / toast' },
  },
  {
    id: 'settings', name: 'Settings Page', category: 'Dashboard',
    description: 'Settings layout: side nav, two-column sections, secret field, danger zone.',
    classes: { base: 'settings', parts: ['settings-nav', 'settings-section', 'settings-section-title', 'settings-section-desc', 'danger-zone', 'secret', 'secret-value'] },
    examples: [{ title: 'Settings', html: `<div class="settings">
  <nav class="settings-nav" aria-label="Settings"><a class="sidebar-item" href="#" aria-current="page">General</a><a class="sidebar-item" href="#">API keys</a><a class="sidebar-item" href="#">Billing</a></nav>
  <div>
    <section class="settings-section"><div><h2 class="settings-section-title">API key</h2><p class="settings-section-desc">Used to authenticate requests. Keep it secret.</p></div>
      <div class="stack gap-2"><div class="secret"><span class="secret-value" data-secret="nage_sk_live_3fX9K2">nage_sk_••••••••••••FX9K</span><button class="btn btn-sm btn-ghost" data-forma="reveal" aria-pressed="false">Show</button><button class="btn btn-sm btn-ghost" data-forma="copy" data-copy-text="nage_sk_live_3fX9K2">Copy</button></div><p class="field-hint">Last used 2 hours ago · 840K / 1M tokens</p></div></section>
    <section class="settings-section"><div><h2 class="settings-section-title">Delete workspace</h2><p class="settings-section-desc">Permanently removes all models and datasets.</p></div>
      <div class="card danger-zone"><p class="card-title">Danger zone</p><p class="card-desc">This action cannot be undone.</p><div class="mt-4"><button class="btn btn-destructive btn-sm">Delete workspace</button></div></div></section>
  </div>
</div>` }],
    v5: { 'settings-page / settings-row': 'settings / settings-section or setting-row' },
  },
  {
    id: 'team', name: 'Team Members', category: 'Dashboard',
    description: 'Member list with roles and an invite field.',
    classes: { base: 'members', parts: ['member', 'member-name', 'member-email', 'invite'] },
    examples: [{ title: 'Team', html: `<div class="stack gap-4">
  <form class="invite"><label class="sr-only" for="inv">E-mail address</label><input class="input" id="inv" type="email" placeholder="colleague@studio.com"><button class="btn btn-primary">Invite</button></form>
  <ul class="members">
    <li class="member"><span class="avatar avatar-sm avatar-accent">AK</span><div><p class="member-name">Aiko Kobayashi</p><p class="member-email">aiko@forma.design</p></div><span class="badge badge-accent">Owner</span><button class="btn btn-icon btn-ghost btn-sm" aria-label="More for Aiko">${ic('more-horizontal')}</button></li>
    <li class="member"><span class="avatar avatar-sm avatar-info">SL</span><div><p class="member-name">Sara Lee</p><p class="member-email">sara@forma.design</p></div><select class="select" aria-label="Role for Sara"><option>Admin</option><option>Member</option><option>Viewer</option></select><button class="btn btn-icon btn-ghost btn-sm" aria-label="More for Sara">${ic('more-horizontal')}</button></li>
  </ul>
</div>` }],
    v5: { 'team-list / team-member / team-role-owner': 'members / member / badge' },
  },
  {
    id: 'audit', name: 'Audit Log', category: 'Dashboard',
    description: 'Chronological record of who changed what.',
    classes: { base: 'audit', parts: ['audit-row', 'audit-time', 'audit-action', 'audit-text'], attributes: ['data-type="create|update|delete"'] },
    examples: [{ title: 'Audit log', html: `<ol class="audit">
  <li class="audit-row"><time class="audit-time">14:32:08</time><span class="audit-action" data-type="create">create</span><span class="audit-text"><strong>Aiko K.</strong> created API key <strong>ci-runner</strong></span></li>
  <li class="audit-row"><time class="audit-time">13:05:41</time><span class="audit-action" data-type="update">update</span><span class="audit-text"><strong>Sara L.</strong> changed role of <strong>Tom P.</strong> to Admin</span></li>
  <li class="audit-row"><time class="audit-time">09:12:00</time><span class="audit-action" data-type="delete">delete</span><span class="audit-text"><strong>System</strong> removed 3 old checkpoints</span></li>
</ol>` }],
  },
  {
    id: 'usage', name: 'Usage Meter', category: 'Dashboard',
    description: 'Quota consumption with warning and critical levels, plus an upsell banner.',
    classes: { base: 'usage', parts: ['usage-head', 'usage-label', 'usage-value', 'usage-foot', 'upsell', 'upsell-body', 'upsell-title', 'upsell-text'], attributes: ['data-level="warn|critical"'] },
    examples: [{ title: 'Usage', html: `<div class="stack gap-5">
  <div class="usage"><div class="usage-head"><span class="usage-label">API tokens</span><span class="usage-value">840K / 1M</span></div><div class="progress-track" role="progressbar" aria-label="API tokens" aria-valuenow="84"><div class="progress-fill progress-fill-accent" style="--value:84%"></div></div><div class="usage-foot"><span>7 days left</span><span>1M</span></div></div>
  <div class="usage" data-level="critical"><div class="usage-head"><span class="usage-label">Storage</span><span class="usage-value">47 / 50 GB</span></div><div class="progress-track" role="progressbar" aria-label="Storage" aria-valuenow="94"><div class="progress-fill" style="--value:94%"></div></div><div class="usage-foot"><span>Critical — 3 GB left</span><span>50 GB</span></div></div>
  <div class="upsell"><span class="icon-tile icon-tile-accent">${ic('zap')}</span><div class="upsell-body"><p class="upsell-title">Upgrade to Pro — remove limits</p><p class="upsell-text">Unlimited API, 128K context, priority support.</p></div><button class="btn btn-accent btn-sm">Upgrade</button></div>
</div>` }],
    v5: { 'usage-fill-crit': 'usage[data-level=critical]', 'upgrade-banner': 'upsell' },
  },
  {
    id: 'profile', name: 'Profile', category: 'Dashboard',
    description: 'Identity rows (avatar + name + sub) and a profile card.',
    classes: { base: 'profile', modifiers: ['profile-lg'], parts: ['profile-name', 'profile-sub', 'profile-card', 'profile-stats'] },
    examples: [{ title: 'Profile', html: `<div class="grid-2">
  <div class="stack gap-3"><div class="profile"><span class="avatar avatar-sm avatar-accent">ÖA</span><div><p class="profile-name">Ömer Asım</p><p class="profile-sub">Systems architect</p></div></div>
    <div class="profile profile-lg"><span class="avatar avatar-lg avatar-square avatar-info">EV</span><div><p class="profile-name">Elena Vasquez</p><p class="profile-sub">elena@studio.com</p></div></div></div>
  <div class="card profile-card"><span class="avatar avatar-xl avatar-accent avatar-status">ÖA</span><div><p class="profile-name">Ömer Asım</p><p class="profile-sub">Istanbul · Pro plan</p></div>
    <dl class="profile-stats"><div><dt>Models</dt><dd>3</dd></div><div><dt>Runs</dt><dd>142</dd></div><div><dt>Joined</dt><dd>2026</dd></div></dl><button class="btn btn-sm btn-block">Edit profile</button></div>
</div>` }],
    v5: { 'prof-card prof-md / prof-name / prof-email': 'profile / profile-name / profile-sub' },
  },
  {
    id: 'auth', name: 'Auth', category: 'Dashboard',
    description: 'Sign-in and sign-up cards, OAuth buttons, centred or split layout.',
    classes: { base: 'auth-card', parts: ['auth', 'auth-title', 'auth-subtitle', 'auth-oauth', 'auth-foot', 'auth-split', 'auth-aside'] },
    examples: [{ title: 'Sign in', html: `<form class="auth-card" style="margin-inline:auto">
  <div><h1 class="auth-title">Sign in</h1><p class="auth-subtitle">Welcome back to the studio.</p></div>
  <div class="auth-oauth"><button type="button" class="btn btn-block">${ic('github')} Continue with GitHub</button></div>
  <div class="divider-label">or with e-mail</div>
  <div class="field"><label class="field-label" for="au-mail">E-mail</label><input class="input" id="au-mail" type="email" autocomplete="email"></div>
  <div class="field"><div class="field-label-row"><label class="field-label" for="au-pw">Password</label><a class="link t-caption" href="#">Forgot?</a></div><input class="input" id="au-pw" type="password" autocomplete="current-password"></div>
  <button class="btn btn-primary btn-block btn-lg">Sign in</button>
  <p class="auth-foot">No account? <a class="link" href="#">Create one</a></p>
</form>` }],
    a11y: ['Correct autocomplete tokens so password managers work.'],
  },
];
