import { ic } from './_helpers.js';

export default [
  {
    id: 'field', name: 'Field', category: 'Forms',
    description: 'Label, control, hint and message as one accessible unit. Validation state lives on the control via aria-invalid.',
    classes: { base: 'field', parts: ['field-label', 'field-label-row', 'field-hint', 'field-message', 'field-counter', 'fieldset', 'form-grid', 'span-all', 'form-actions'], variants: ['field-message-error', 'field-message-success', 'field-message-warning'], modifiers: ['field-required'] },
    examples: [{ title: 'Form layout', html: `<form class="stack gap-5" data-forma="validate" novalidate>
  <div class="form-grid">
    <div class="field">
      <label class="field-label" for="f-name">Model name</label>
      <input class="input" id="f-name" name="name" required minlength="3" placeholder="forge-14b" aria-describedby="f-name-hint">
      <p class="field-hint" id="f-name-hint">Letters, numbers and hyphens.</p>
    </div>
    <div class="field">
      <label class="field-label" for="f-mail">Contact e-mail</label>
      <input class="input" id="f-mail" type="email" name="email" required placeholder="you@studio.com">
    </div>
    <div class="field span-all">
      <div class="field-label-row"><label class="field-label" for="f-desc">Description</label><span class="field-counter" data-counter-for="f-desc">0 / 280</span></div>
      <textarea class="textarea" id="f-desc" maxlength="280" placeholder="What does this model do?"></textarea>
    </div>
  </div>
  <div class="form-actions"><button type="button" class="btn btn-ghost">Cancel</button><button class="btn btn-primary">Save</button></div>
</form>` },
      { title: 'Messages', html: `<div class="stack gap-4">
  <div class="field"><label class="field-label" for="v1">Username</label><input class="input" id="v1" value="omer" aria-invalid="true" aria-describedby="v1-m"><p class="field-message field-message-error" id="v1-m">${ic('x-circle')} Already taken.</p></div>
  <div class="field"><label class="field-label" for="v2">Slug</label><input class="input" id="v2" value="forge-14b" aria-describedby="v2-m"><p class="field-message field-message-success" id="v2-m">${ic('check-circle')} Available.</p></div>
</div>` }],
    a11y: ['Every control has a <label for>.', 'Hints and messages are connected with aria-describedby; Forma.validate wires this automatically.', 'Errors set aria-invalid="true" — color is never the only signal (icon + text).'],
    v5: { 'field-wrap': 'field', 'form-row form-row-2': 'form-grid', 'field-msg field-msg-error': 'field-message field-message-error', 'field-error (on wrapper)': 'aria-invalid="true" on the control' },
  },
  {
    id: 'input', name: 'Input', category: 'Forms',
    description: 'Text input, textarea and native select. Sizes, addons, icons, search.',
    classes: { base: 'input', parts: ['textarea', 'select', 'input-group', 'input-addon', 'input-addon-plain', 'search'], sizes: ['input-sm', 'input-lg', 'select-sm', 'select-lg'], states: ['aria-invalid', 'disabled', 'readonly'] },
    examples: [{ title: 'Inputs', html: `<div class="grid" style="--min:220px">
  <div class="field"><label class="field-label" for="i1">Website</label><div class="input-group"><span class="input-addon">https://</span><input class="input" id="i1" placeholder="studio.com"></div></div>
  <div class="field"><label class="field-label" for="i2">Budget</label><div class="input-group"><input class="input" id="i2" inputmode="decimal" value="1,200"><span class="input-addon">USD</span></div></div>
  <div class="field"><label class="field-label" for="i3">Medium</label><select class="select" id="i3"><option>Oil on canvas</option><option>Digital</option><option>Mixed media</option></select></div>
  <div class="field"><label class="field-label" for="i4">Search</label><div class="search">${ic('search')}<input class="input" id="i4" type="search" placeholder="Search works"><kbd class="kbd">/</kbd></div></div>
  <div class="field"><label class="field-label" for="i5">Small</label><input class="input input-sm" id="i5" placeholder="Small"></div>
  <div class="field"><label class="field-label" for="i6">Disabled</label><input class="input" id="i6" disabled value="Locked"></div>
</div>` }],
    a11y: ['Placeholder is never a label.', 'Textareas grow with content (field-sizing) up to 320px.'],
    v5: { 'input-addon-wrap': 'input-group', 'search-field': 'search', 'select-wrap > select.select': 'select.select' },
  },
  {
    id: 'checkbox', name: 'Checkbox & Radio', category: 'Forms',
    description: 'Native inputs, restyled. Indeterminate state, descriptions, and selectable cards.',
    classes: { base: 'checkbox', parts: ['radio', 'check', 'check-desc', 'choice-group', 'choice-group-row', 'choice-card', 'choice-card-body', 'choice-card-title', 'choice-card-desc', 'choice-card-meta'] },
    examples: [
      { title: 'Checkboxes & radios', html: `<div class="grid-2">
  <fieldset class="choice-group"><legend class="field-label">Notify me</legend>
    <label class="check"><input type="checkbox" class="checkbox" checked> Training complete</label>
    <label class="check"><input type="checkbox" class="checkbox" data-indeterminate> Some evals</label>
    <label class="check"><input type="checkbox" class="checkbox"><span>Weekly digest<span class="check-desc">Every Monday, 09:00</span></span></label>
    <label class="check"><input type="checkbox" class="checkbox" disabled> Disabled</label>
  </fieldset>
  <fieldset class="choice-group"><legend class="field-label">Visibility</legend>
    <label class="check"><input type="radio" class="radio" name="vis" checked> Private</label>
    <label class="check"><input type="radio" class="radio" name="vis"> Team</label>
    <label class="check"><input type="radio" class="radio" name="vis"> Public</label>
  </fieldset>
</div>` },
      { title: 'Choice cards', html: `<fieldset class="choice-group"><legend class="field-label">Pipeline</legend>
  <label class="choice-card"><input type="radio" class="radio" name="pipe"><span class="choice-card-body"><span class="choice-card-title">SFT</span><span class="choice-card-desc">Core skill training.</span></span><span class="choice-card-meta">≈ $40</span></label>
  <label class="choice-card"><input type="radio" class="radio" name="pipe" checked><span class="choice-card-body"><span class="choice-card-title">SFT + DPO</span><span class="choice-card-desc">Two-phase, for alignment quality.</span></span><span class="choice-card-meta">≈ $70</span></label>
  <label class="choice-card"><input type="radio" class="radio" name="pipe"><span class="choice-card-body"><span class="choice-card-title">SFT + DPO + GRPO</span><span class="choice-card-desc">For reasoning models.</span></span><span class="choice-card-meta">≈ $120</span></label>
</fieldset>` }],
    a11y: ['Real <input type="checkbox|radio">: native keyboard, forms and screen-reader support.', 'Group with <fieldset><legend>.', 'Control borders meet 3:1 (WCAG 1.4.11) in every theme.', 'data-indeterminate sets the indeterminate property via Forma.js.'],
    v5: { 'checkbox + checkbox-box span': '<label class="check"><input class="checkbox">', 'radio-card / checkbox-card / opt': 'choice-card' },
  },
  {
    id: 'switch', name: 'Switch', category: 'Forms',
    description: 'Immediate on/off settings, as a native checkbox with role="switch".',
    classes: { base: 'switch', modifiers: ['switch-lg'], parts: ['setting-row', 'setting-row-label', 'setting-row-desc'] },
    examples: [{ title: 'Settings list', html: `<div class="card">
  <label class="setting-row"><span><span class="setting-row-label">E-mail notifications</span><span class="setting-row-desc">When a training run finishes.</span></span><input type="checkbox" class="switch" role="switch" checked></label>
  <label class="setting-row"><span><span class="setting-row-label">Auto checkpoint</span><span class="setting-row-desc">Save after each epoch.</span></span><input type="checkbox" class="switch" role="switch"></label>
  <label class="setting-row"><span><span class="setting-row-label">Early stopping</span><span class="setting-row-desc">Stop on validation loss increase.</span></span><input type="checkbox" class="switch switch-lg" role="switch" checked></label>
</div>` }],
    a11y: ['<input type="checkbox" role="switch"> — announced as on/off, toggled with Space.'],
    v5: { 'sw > sw-track > input + sw-bg + sw-dot': '<input type="checkbox" class="switch" role="switch">' },
  },
  {
    id: 'range', name: 'Range', category: 'Forms',
    description: 'Native range slider with filled track; dual-thumb min/max via Forma.js.',
    classes: { base: 'range', parts: ['range-scale', 'range-output', 'range-dual'] },
    examples: [{ title: 'Range', html: `<div class="stack gap-5">
  <div class="field"><div class="field-label-row"><label class="field-label" for="r1">Temperature</label><output class="range-output" for="r1">0.7</output></div>
    <input type="range" class="range" id="r1" min="0" max="2" step="0.1" value="0.7" data-forma="range"><div class="range-scale"><span>0</span><span>1</span><span>2</span></div></div>
  <div class="field"><div class="field-label-row"><span class="field-label" id="r2l">Price</span><output class="range-output">$20 – $80</output></div>
    <div class="range-dual" data-forma="range-dual" role="group" aria-labelledby="r2l"><input type="range" class="range" min="0" max="100" value="20" aria-label="Minimum price"><input type="range" class="range" min="0" max="100" value="80" aria-label="Maximum price"></div></div>
</div>` }],
    a11y: ['Each thumb is a real range input with its own label.', 'Dual range: the two inputs share one track, so their boxes overlap; each thumb stays individually operable by pointer and keyboard (arrow keys, Page Up/Down, Home/End).'],
    js: { auto: 'data-forma="range" | "range-dual"' },
  },
  {
    id: 'segmented', name: 'Segmented Control', category: 'Forms',
    description: 'A compact single choice between 2–5 options. Radio-backed for forms.',
    classes: { base: 'segmented', parts: ['segmented-badge'] },
    examples: [{ title: 'Segmented', html: `<div class="segmented" role="radiogroup" aria-label="Billing">
  <label><input type="radio" name="bill" checked> Monthly</label>
  <label><input type="radio" name="bill"> Annual <span class="segmented-badge">−20%</span></label>
</div>` }],
    v5: { 'billing-toggle / billing-opt': 'segmented', 'tab-list-pill': 'segmented (for choices) or tabs-pill (for panels)' },
  },
  {
    id: 'stepper', name: 'Number Stepper', category: 'Forms',
    description: 'Numeric input with − / + buttons; respects min, max and step.',
    classes: { base: 'stepper', modifiers: ['stepper-sm'] },
    examples: [{ title: 'Stepper', html: `<div class="stepper" data-forma="stepper">
  <button type="button" aria-label="Decrease" data-step="-1">−</button>
  <input type="number" value="2" min="1" max="10" aria-label="Quantity">
  <button type="button" aria-label="Increase" data-step="1">+</button>
</div>` }],
    js: { auto: 'data-forma="stepper"' },
    v5: { 'cart-qty': 'stepper stepper-sm' },
  },
  {
    id: 'otp', name: 'OTP Input', category: 'Forms',
    description: 'One-time codes: auto-advance, backspace, paste-to-fill.',
    classes: { base: 'otp', parts: ['otp-sep'] },
    examples: [{ title: 'Verification code', html: `<div class="otp" data-forma="otp" role="group" aria-label="Verification code">
  <input inputmode="numeric" maxlength="1" aria-label="Digit 1" autocomplete="one-time-code"><input inputmode="numeric" maxlength="1" aria-label="Digit 2"><input inputmode="numeric" maxlength="1" aria-label="Digit 3">
  <span class="otp-sep" aria-hidden="true">–</span>
  <input inputmode="numeric" maxlength="1" aria-label="Digit 4"><input inputmode="numeric" maxlength="1" aria-label="Digit 5"><input inputmode="numeric" maxlength="1" aria-label="Digit 6">
</div>` }],
    js: { auto: 'data-forma="otp"', events: ['forma:complete'] },
  },
  {
    id: 'combobox', name: 'Combobox', category: 'Forms',
    description: 'Searchable single or multi select (WAI-ARIA combobox + listbox). Replaces v5 .cselect.',
    classes: { base: 'combobox', parts: ['combobox-control', 'combobox-input', 'listbox', 'listbox-group', 'listbox-empty', 'option', 'option-desc'] },
    examples: [{ title: 'Multi select with search', html: `<div class="field" style="max-inline-size:360px">
  <label class="field-label" id="cb1-l" for="cb1">Base models</label>
  <div class="combobox" data-forma="combobox" data-multiple>
    <div class="combobox-control"><input class="combobox-input" id="cb1" placeholder="Search models…"></div>
    <div class="listbox" role="listbox" aria-labelledby="cb1-l" hidden>
      <div class="listbox-group">Qwen</div>
      <div class="option" role="option" data-value="qwen3-14b" aria-selected="true">Qwen3-14B <span class="option-desc">14B</span></div>
      <div class="option" role="option" data-value="qwen3-8b">Qwen3-8B <span class="option-desc">8B</span></div>
      <div class="listbox-group">Meta</div>
      <div class="option" role="option" data-value="llama-70b">Llama-3.3-70B <span class="option-desc">70B</span></div>
      <div class="option" role="option" data-value="llama-8b" aria-disabled="true">Llama-3.1-8B <span class="option-desc">deprecated</span></div>
    </div>
  </div>
</div>` }],
    a11y: ['role=combobox with aria-expanded, aria-controls and aria-activedescendant is applied by Forma.js.', 'Arrow keys move, Enter selects, Escape closes, typing filters.'],
    js: { auto: 'data-forma="combobox"', api: 'Forma.combobox(el)', events: ['forma:change'] },
    v5: { 'cselect / cselect-trigger / cselect-option': 'combobox / combobox-control / option' },
  },
  {
    id: 'upload', name: 'File Upload', category: 'Forms',
    description: 'Drag-and-drop zone backed by a real file input, with a file list and per-file progress.',
    classes: { base: 'dropzone', parts: ['dropzone-icon', 'dropzone-title', 'dropzone-hint', 'file-list', 'file-item', 'file-item-name', 'file-item-meta'], states: ['data-dragover', 'aria-invalid'] },
    examples: [{ title: 'Upload', html: `<div class="stack gap-3">
  <label class="dropzone" data-forma="dropzone">
    <span class="dropzone-icon">${ic('cloud-upload', 'fi-2xl')}</span>
    <span class="dropzone-title"><strong>Click to upload</strong> or drag and drop</span>
    <span class="dropzone-hint">CSV, JSONL or Parquet · up to 2 GB</span>
    <input type="file" multiple accept=".csv,.jsonl,.parquet">
  </label>
  <ul class="file-list">
    <li class="file-item">${ic('file-text', 'fi-lg fi-tertiary')}<div><div class="file-item-name">conversations-alpha-50k.jsonl</div><div class="file-item-meta">35.2 MB · 72%</div><div class="progress-track"><div class="progress-fill progress-fill-accent" style="--value:72%"></div></div></div><button class="btn btn-icon btn-ghost btn-sm" aria-label="Remove file">${ic('x')}</button></li>
    <li class="file-item" data-state="error">${ic('file-text', 'fi-lg fi-error')}<div><div class="file-item-name">eval-set.csv</div><div class="file-item-meta">Unsupported encoding</div></div><button class="btn btn-icon btn-ghost btn-sm" aria-label="Remove file">${ic('x')}</button></li>
  </ul>
</div>` }],
    js: { auto: 'data-forma="dropzone"', events: ['forma:files'], api: 'Forma.formatBytes(n)' },
    v5: { 'upload-zone': 'dropzone', 'upload-item': 'file-item' },
  },
  {
    id: 'datepicker', name: 'Date Picker', category: 'Forms',
    description: 'Calendar grid with keyboard navigation, single date or range. Rendered by Forma.js from a native date input.',
    classes: { base: 'datepicker', parts: ['datepicker-head', 'datepicker-title', 'datepicker-grid', 'datepicker-weekday', 'datepicker-day', 'datepicker-foot', 'date-field'] },
    examples: [{ title: 'Inline calendar', html: `<div class="datepicker" data-forma="datepicker" data-value="2026-10-08" aria-label="Choose a date"></div>` }],
    a11y: ['Grid pattern: arrow keys move by day/week, PageUp/PageDown by month, Home/End to week edges.', 'Today is marked with aria-current="date".'],
    js: { auto: 'data-forma="datepicker"', api: 'Forma.datepicker(el, { value, range, min, max, locale })', events: ['forma:change'] },
  },
  {
    id: 'validation', name: 'Validation', category: 'Forms',
    description: 'Native constraint validation, enhanced: inline messages, an error summary, password strength. Messages in English and Turkish.',
    classes: { base: 'form-summary', parts: ['form-summary-title', 'strength', 'strength-bar', 'strength-label'] },
    attributes: ['data-forma="validate"', 'data-strength'],
    examples: [{ title: 'Summary & strength', html: `<div class="stack gap-4">
  <div class="form-summary" role="alert" tabindex="-1"><p class="form-summary-title">2 fields need attention</p><ul><li><a href="#f-name">Model name is required</a></li><li><a href="#f-mail">Enter a valid e-mail</a></li></ul></div>
  <div class="field"><label class="field-label" for="pw">Password</label><input class="input" id="pw" type="password" data-strength aria-describedby="pw-s">
    <div class="strength" id="pw-s" data-score="3" aria-live="polite"><span class="strength-bar"></span><span class="strength-bar"></span><span class="strength-bar"></span><span class="strength-bar"></span><span class="strength-label">Good</span></div></div>
</div>` }],
    a11y: ['Uses the browser constraint API (required, type, minlength, pattern) — no custom rule syntax to learn.', 'On submit, focus moves to the summary; each entry links to its field.', 'Messages are localised: Forma.validate.locale = "tr".'],
    js: { auto: 'data-forma="validate"', api: 'Forma.validate(form) · Forma.validate.messages.tr', events: ['forma:invalid', 'forma:valid'] },
    v5: { 'data-validate="required|email"': 'native required / type="email"', 'pw-strength': 'strength' },
  },
];
