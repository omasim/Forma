import { ic } from './_helpers.js';

export default [
  {
    id: 'dialog', name: 'Dialog', category: 'Overlays',
    description: 'Modal dialogs on native <dialog>: real focus trap, inert page, Escape, top layer, animated entry and exit.',
    classes: { base: 'dialog', sizes: ['dialog-sm', 'dialog-lg', 'dialog-xl'], parts: ['dialog-header', 'dialog-title', 'dialog-desc', 'dialog-body', 'dialog-footer', 'dialog-close', 'dialog-icon', 'dialog-icon-error', 'dialog-icon-warning', 'dialog-icon-accent'] },
    attributes: ['data-forma-open="id"', 'data-forma-close'],
    examples: [{ title: 'Dialog & confirm', html: `<div class="cluster">
  <button class="btn btn-primary" data-forma-open="dlg-train">Start training</button>
  <button class="btn btn-destructive" data-forma-open="dlg-delete">Delete account</button>
</div>
<dialog class="dialog" id="dlg-train" aria-labelledby="dlg-train-t" aria-describedby="dlg-train-d">
  <header class="dialog-header"><div><h2 class="dialog-title" id="dlg-train-t">Start training</h2><p class="dialog-desc" id="dlg-train-d">Estimated ≈ 5 hours · ≈ $45</p></div><button class="dialog-close" data-forma-close aria-label="Close">${ic('x')}</button></header>
  <div class="dialog-body">
    <div class="field"><label class="field-label" for="dlg-name">Run name</label><input class="input" id="dlg-name" value="forge-14b-dpo" autofocus></div>
    <div class="field"><label class="field-label" for="dlg-base">Base model</label><select class="select" id="dlg-base"><option>Qwen3-14B</option><option>Qwen3-8B</option></select></div>
  </div>
  <footer class="dialog-footer"><button class="btn btn-ghost" data-forma-close>Cancel</button><button class="btn btn-accent" data-forma-close="launch">Launch</button></footer>
</dialog>
<dialog class="dialog dialog-sm" id="dlg-delete" role="alertdialog" aria-labelledby="dlg-del-t" aria-describedby="dlg-del-d">
  <div class="dialog-header"><div><span class="dialog-icon dialog-icon-error">${ic('trash', 'fi-lg')}</span><h2 class="dialog-title" id="dlg-del-t">Delete account?</h2><p class="dialog-desc" id="dlg-del-d">All models and datasets are removed permanently. This cannot be undone.</p></div></div>
  <footer class="dialog-footer"><button class="btn btn-ghost" data-forma-close autofocus>Keep account</button><button class="btn btn-danger" data-forma-close="delete">Delete</button></footer>
</dialog>` }],
    a11y: ['Opened with showModal(): focus is trapped, the page behind is inert, Escape closes, focus returns to the trigger.', 'Destructive confirms use role="alertdialog" and autofocus the safe action.', 'data-forma-close="value" sets dialog.returnValue; listen to the native close event.'],
    js: { auto: 'data-forma-open / data-forma-close', api: 'Forma.dialog.open(id) · Forma.dialog.close(id, value) · Forma.confirm({ title, text, danger }) → Promise<boolean>' },
    v5: { 'modal-wrap > modal / modal-hd / modal-bd / modal-ft': 'dialog.dialog / dialog-header / dialog-body / dialog-footer', 'alert-dialog': 'dialog.dialog-sm[role=alertdialog]' },
  },
  {
    id: 'drawer', name: 'Drawer & Sheet', category: 'Overlays',
    description: 'Side drawers and bottom sheets — the same native dialog, different entrance.',
    classes: { base: 'drawer', modifiers: ['drawer-start'], parts: ['sheet', 'sheet-handle'] },
    examples: [{ title: 'Drawer & sheet', html: `<div class="cluster">
  <button class="btn" data-forma-open="drw-filters">${ic('filter')} Filters</button>
  <button class="btn" data-forma-open="sht-share">${ic('share')} Share</button>
</div>
<dialog class="dialog drawer" id="drw-filters" aria-labelledby="drw-t">
  <header class="dialog-header"><h2 class="dialog-title" id="drw-t">Filters</h2><button class="dialog-close" data-forma-close aria-label="Close">${ic('x')}</button></header>
  <div class="dialog-body"><fieldset class="choice-group"><legend class="field-label">Status</legend><label class="check"><input type="checkbox" class="checkbox" checked> Running</label><label class="check"><input type="checkbox" class="checkbox"> Queued</label><label class="check"><input type="checkbox" class="checkbox"> Done</label></fieldset></div>
  <footer class="dialog-footer"><button class="btn btn-ghost" data-forma-close>Reset</button><button class="btn btn-primary" data-forma-close>Apply</button></footer>
</dialog>
<dialog class="dialog sheet" id="sht-share" aria-labelledby="sht-t">
  <span class="sheet-handle" aria-hidden="true"></span>
  <header class="dialog-header"><h2 class="dialog-title" id="sht-t">Share run</h2><button class="dialog-close" data-forma-close aria-label="Close">${ic('x')}</button></header>
  <div class="dialog-body"><div class="input-group"><input class="input" readonly value="https://nage.ai/r/forge-14b" aria-label="Link"><button class="btn btn-sm" data-forma="copy" data-copy-text="https://nage.ai/r/forge-14b">Copy</button></div></div>
</dialog>` }],
    a11y: ['Same guarantees as Dialog. Drawers mirror automatically in RTL.'],
    v5: { 'drawer (static demo)': 'dialog.dialog.drawer', 'bottom-sheet': 'dialog.dialog.sheet', 'mobile-drawer': 'dialog.dialog.drawer.drawer-start' },
  },
  {
    id: 'popover', name: 'Popover', category: 'Overlays',
    description: 'Non-modal floating panels on the native Popover API — light-dismiss and Escape built in. Positioned to the trigger by Forma.js.',
    classes: { base: 'popover', parts: ['popover-title'] },
    attributes: ['popover', 'popovertarget'],
    examples: [{ title: 'Popover', html: `<button class="btn" popovertarget="pop-about">About Forge-14B</button>
<div class="popover" id="pop-about" popover>
  <p class="popover-title">Forge-14B</p>
  <p>AI engineering assistant on Qwen3-14B. Trained with SFT + DPO across five domains.</p>
</div>` }],
    a11y: ['popovertarget wires aria-expanded on the trigger automatically.', 'Forma.js flips the panel when it would overflow the viewport.'],
    js: { auto: '[popover]', api: 'Forma.position(panel, trigger, { placement })' },
    v5: { 'popover-wrap > popover-box popover-bottom': '[popover].popover + popovertarget' },
  },
  {
    id: 'menu', name: 'Menu', category: 'Overlays',
    description: 'Action menus: popover + role="menu" with roving focus, type-ahead, checkable items and shortcuts.',
    classes: { base: 'menu', modifiers: ['menu-static'], parts: ['menu-item', 'menu-item-danger', 'menu-shortcut', 'menu-separator', 'menu-label'] },
    examples: [{ title: 'Dropdown menu', html: `<button class="btn" popovertarget="menu-actions" aria-haspopup="menu">Actions ${ic('chevron-down')}</button>
<div class="menu" id="menu-actions" popover role="menu" aria-label="Actions">
  <p class="menu-label">Run</p>
  <button class="menu-item" role="menuitem">${ic('edit')} Rename <span class="menu-shortcut">⌘E</span></button>
  <button class="menu-item" role="menuitem">${ic('copy')} Duplicate <span class="menu-shortcut">⌘D</span></button>
  <button class="menu-item" role="menuitemcheckbox" aria-checked="true">${ic('bell')} Notify on finish</button>
  <hr class="menu-separator">
  <button class="menu-item menu-item-danger" role="menuitem">${ic('trash')} Delete <span class="menu-shortcut">⌘⌫</span></button>
</div>` }],
    a11y: ['Arrow keys / Home / End move focus, type-ahead jumps, Escape closes and returns focus, Tab leaves.', 'Context menus: data-forma="context-menu" data-menu="id" opens the menu at the pointer.'],
    js: { auto: '[role=menu][popover]', api: 'Forma.menu(el)' },
    v5: { 'menu > menu-content.is-open + Forma.toggleMenu()': '[popover].menu + popovertarget', 'menu-item.is-danger': 'menu-item menu-item-danger', 'context-menu': 'menu menu-static' },
  },
  {
    id: 'command', name: 'Command Palette', category: 'Overlays',
    description: '⌘K / Ctrl+K launcher with fuzzy filtering, groups and keyboard navigation.',
    classes: { base: 'command', parts: ['command-input', 'command-list', 'command-group', 'command-item', 'command-item-icon', 'command-item-desc', 'command-footer', 'command-empty'] },
    examples: [{ title: 'Command palette (press ⌘K)', html: `<button class="btn" data-forma-open="cmdk">${ic('search')} Search… <kbd class="kbd">⌘K</kbd></button>
<dialog class="dialog command" id="cmdk" data-forma="command" data-hotkey="mod+k" aria-label="Command palette">
  <div class="dialog-body">
    <div class="command-input">${ic('search', 'fi-lg')}<input placeholder="Type a command or search…" aria-label="Search commands"></div>
    <div class="command-list" role="listbox" aria-label="Commands">
      <p class="command-group">Quick actions</p>
      <div class="command-item" role="option"><span class="command-item-icon">${ic('plus')}</span><span>Create new model <span class="command-item-desc">Forge, Fehm or Cortex</span></span></div>
      <div class="command-item" role="option"><span class="command-item-icon">${ic('upload')}</span><span>Upload dataset <span class="command-item-desc">CSV, JSONL, Parquet</span></span></div>
      <div class="command-item" role="option"><span class="command-item-icon">${ic('play')}</span><span>Start training</span></div>
      <p class="command-group">Navigate</p>
      <div class="command-item" role="option"><span class="command-item-icon">${ic('chart-bar')}</span><span>Analytics</span></div>
      <div class="command-item" role="option"><span class="command-item-icon">${ic('settings')}</span><span>Settings</span></div>
      <p class="command-empty" hidden>No results.</p>
    </div>
    <div class="command-footer"><span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> navigate</span><span><kbd class="kbd">↵</kbd> select</span><span><kbd class="kbd">esc</kbd> close</span></div>
  </div>
</dialog>` }],
    a11y: ['Input owns the list via aria-activedescendant; results count is announced.'],
    js: { auto: 'data-forma="command"', events: ['forma:command'] },
  },
  {
    id: 'toast', name: 'Toast', category: 'Overlays',
    description: 'Transient notifications in a polite live region. Pause on hover/focus, actions, auto-dismiss.',
    classes: { base: 'toast', variants: ['toast-success', 'toast-error', 'toast-warning', 'toast-info'], parts: ['toast-region', 'toast-body', 'toast-title', 'toast-text', 'toast-action', 'toast-close', 'toast-timer'], modifiers: ['toast-static'] },
    examples: [{ title: 'Trigger toasts', html: `<div class="cluster">
  <button class="btn" onclick="Forma.toast.success('Changes saved', 'Your settings were updated.')">Success</button>
  <button class="btn" onclick="Forma.toast.error('Upload failed', 'File exceeds the 10 MB limit.')">Error</button>
  <button class="btn" onclick="Forma.toast({ title: 'Checkpoint deleted', action: { label: 'Undo', onClick: () => Forma.toast.info('Restored') } })">With action</button>
</div>
<div class="toast toast-static toast-success" role="status" style="margin-block-start:var(--space-4);max-inline-size:380px">${ic('check-circle')}<div class="toast-body"><p class="toast-title">Training completed</p><p class="toast-text">forge-sft-v1 is ready for DPO.</p></div><button class="toast-close" aria-label="Dismiss">${ic('x')}</button></div>` }],
    a11y: ['All text is inserted with textContent — no HTML injection.', 'Errors use an assertive region, everything else polite.', 'Timers pause while hovered or focused (WCAG 2.2.1).'],
    js: { api: "Forma.toast({ type, title, text, duration, action, position }) · .success() .error() .warning() .info()" },
    v5: { 'FormaToast.show({ message })': "Forma.toast({ text })" },
  },
];
