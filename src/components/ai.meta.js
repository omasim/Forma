import { ic } from './_helpers.js';

export default [
  {
    id: 'chat', name: 'Chat', category: 'AI',
    description: 'A complete assistant surface: log, empty state with suggestions, messages, composer. Auto-scroll, Enter to send, Shift+Enter newline.',
    classes: { base: 'chat', parts: ['chat-log', 'chat-empty', 'chat-empty-title', 'suggestions', 'suggestion'] },
    examples: [{ title: 'Assistant', html: `<section class="chat" data-forma="chat" style="block-size:520px" aria-label="Assistant">
  <div class="chat-log" role="log" aria-live="polite">
    <div class="message message-user"><div class="message-body"><p>Show me how to use the KPI component.</p></div></div>
    <div class="message"><span class="message-avatar" aria-hidden="true">AI</span><div class="message-body">
      <p>Wrap cards in <code>.kpi-grid</code> — it auto-fits columns:</p>
      <pre class="code-block"><code>&lt;div class="kpi"&gt;
  &lt;span class="kpi-label"&gt;MRR&lt;/span&gt;
  &lt;span class="kpi-value"&gt;$48,210&lt;/span&gt;
&lt;/div&gt;</code></pre>
      <div class="citations"><a class="citation" href="#"><span class="citation-index">1</span><span>FORMA docs · KPI</span></a></div>
      <div class="message-actions"><button class="btn btn-icon btn-ghost btn-sm" aria-label="Copy" data-forma="copy">${ic('copy')}</button><button class="btn btn-icon btn-ghost btn-sm" aria-label="Retry">${ic('refresh-cw')}</button><button class="btn btn-icon btn-ghost btn-sm" aria-label="Good response">${ic('thumbs-up')}</button></div>
    </div></div>
    <div class="message"><span class="message-avatar" aria-hidden="true">AI</span><div class="message-body"><span class="thinking"><span class="thinking-dots" aria-hidden="true"><span></span><span></span><span></span></span><span class="thinking-shimmer">Thinking…</span></span></div></div>
  </div>
  <form class="composer"><label class="sr-only" for="cmp">Message</label><textarea class="composer-input" id="cmp" rows="1" placeholder="Ask anything…"></textarea>
    <div class="composer-bar"><button type="button" class="btn btn-icon btn-ghost btn-sm" aria-label="Attach file">${ic('paperclip')}</button><select class="select" aria-label="Model"><option>forge-14b</option><option>fehm-8b</option></select><button class="btn btn-icon btn-accent btn-sm composer-send" aria-label="Send">${ic('arrow-up')}</button></div></form>
</section>` }],
    a11y: ['The log is role="log" aria-live="polite": new assistant messages are announced once complete, not per token.', 'Forma.chat.add() inserts text with textContent; pass { html } only for trusted, sanitised markup.'],
    js: { auto: 'data-forma="chat"', api: 'Forma.chat(el) → { add({ role, text, html }), thinking(), stream(text|AsyncIterable), clear() }', events: ['forma:submit'] },
    v5: { 'chat-container / chat-messages': 'chat / chat-log', 'chat-bubble-user / chat-bubble-ai': 'message message-user / message' },
  },
  {
    id: 'message', name: 'Message', category: 'AI',
    description: 'User and assistant turns with avatar, actions, timestamps, error state, streaming caret and collapsible reasoning.',
    classes: { base: 'message', modifiers: ['message-user'], parts: ['message-avatar', 'message-body', 'message-name', 'message-actions', 'message-time', 'thinking', 'thinking-dots', 'thinking-shimmer', 'streaming', 'reasoning', 'reasoning-body'], attributes: ['data-status="error"'] },
    examples: [{ title: 'Streaming & reasoning', html: `<div class="stack gap-5">
  <div class="message"><span class="message-avatar" aria-hidden="true">AI</span><div class="message-body">
    <details class="reasoning"><summary>Thought for 4 seconds</summary><p class="reasoning-body">The user wants a dark theme toggle; data-mode on the root covers it without JS.</p></details>
    <p class="streaming">Set <code>data-mode="dark"</code> on any element and its subtree switches</p></div></div>
  <div class="message" data-status="error"><span class="message-avatar" aria-hidden="true">AI</span><div class="message-body"><p>${ic('warning')} The model timed out. <button class="btn btn-link btn-sm">Retry</button></p></div></div>
</div>` }],
  },
  {
    id: 'tool-call', name: 'Tool Call', category: 'AI',
    description: 'Agent steps: tool name, arguments, running/done/error state.',
    classes: { base: 'tool-call', parts: ['tool-call-head', 'tool-call-name'], attributes: ['data-state="running|done|error"'] },
    examples: [{ title: 'Agent steps', html: `<div class="stack gap-2" style="max-inline-size:520px">
  <div class="tool-call" data-state="done"><div class="tool-call-head">${ic('search')}<span class="tool-call-name">web_search</span><span>“FORMA llms.txt”</span></div></div>
  <div class="tool-call" data-state="running"><div class="tool-call-head">${ic('terminal')}<span class="tool-call-name">run_build</span></div><pre>npm run build → 55 themes · 660 contrast checks</pre></div>
</div>` }],
  },
  {
    id: 'citation', name: 'Citations', category: 'AI',
    description: 'Source chips and inline citation markers.',
    classes: { base: 'citations', parts: ['citation', 'citation-index', 'cite'] },
    examples: [{ title: 'Sources', html: `<p class="t-body-sm">Contrast is checked against WCAG 2.2<sup class="cite">1</sup> and APCA is tracked<sup class="cite">2</sup>.</p>
<div class="citations mt-4"><a class="citation" href="#"><span class="citation-index">1</span><span>w3.org · Understanding SC 1.4.3</span></a><a class="citation" href="#"><span class="citation-index">2</span><span>git.apcacontrast.com</span></a></div>` }],
  },
  {
    id: 'composer', name: 'Composer', category: 'AI',
    description: 'Prompt input that grows with content, with attachments, model picker and send.',
    classes: { base: 'composer', parts: ['composer-input', 'composer-bar', 'composer-send', 'composer-attachments', 'composer-hint'] },
    examples: [{ title: 'Composer', html: `<form class="composer" style="margin:0">
  <div class="composer-attachments"><span class="chip">${ic('file-text', 'fi-xs')} brief.pdf <button class="chip-remove" type="button" aria-label="Remove brief.pdf">×</button></span></div>
  <label class="sr-only" for="cmp2">Message</label><textarea class="composer-input" id="cmp2" rows="1" placeholder="Describe the layout you want…"></textarea>
  <div class="composer-bar"><button type="button" class="btn btn-icon btn-ghost btn-sm" aria-label="Attach">${ic('paperclip')}</button><button type="button" class="btn btn-ghost btn-sm">${ic('globe')} Web</button><button class="btn btn-icon btn-accent btn-sm composer-send" aria-label="Send">${ic('arrow-up')}</button></div>
</form><p class="composer-hint">Enter to send · Shift+Enter for a new line</p>` }],
    v5: { 'chat-input-bar / chat-input / chat-send-btn': 'composer / composer-input / composer-send' },
  },
  {
    id: 'model-card', name: 'Model Card', category: 'AI',
    description: 'A model, tool or system at a glance: name, id, status, description, metadata grid.',
    classes: { base: 'model-card', parts: ['model-card-head', 'model-card-name', 'model-card-id'] },
    examples: [{ title: 'Model cards', html: `<div class="grid" style="--min:260px">
  <article class="card model-card"><header class="model-card-head"><div><h3 class="model-card-name">Forge</h3><p class="model-card-id">14B · QWEN3-14B · APACHE 2.0</p></div><span class="badge badge-warning badge-dot">Training</span></header>
    <p class="t-body-sm t-secondary">AI engineering assistant: data generation, dataset analysis, fine-tune configuration.</p>
    <dl class="dl dl-grid"><div><dt>engine</dt><dd>Unsloth + TRL</dd></div><div><dt>stages</dt><dd>SFT → DPO</dd></div><div><dt>data</dt><dd>100K conv.</dd></div></dl></article>
  <article class="card model-card"><header class="model-card-head"><div><h3 class="model-card-name">Fehm</h3><p class="model-card-id">8B · QWEN3-8B · APACHE 2.0</p></div><span class="badge badge-success badge-dot">Active</span></header>
    <p class="t-body-sm t-secondary">Chat assistant and generative UI layer. Multilingual.</p>
    <dl class="dl dl-grid"><div><dt>engine</dt><dd>Unsloth + TRL</dd></div><div><dt>stages</dt><dd>SFT → DPO</dd></div><div><dt>data</dt><dd>200K conv.</dd></div></dl></article>
</div>` }],
    v5: { 'model-card / model-title / model-meta': 'card model-card / model-card-name / dl dl-grid' },
  },
  {
    id: 'phases', name: 'Pipeline Phases', category: 'AI',
    description: 'Roadmaps and training pipelines: numbered phases with step cards and meta badges.',
    classes: { base: 'phases', parts: ['phase-head', 'phase-num', 'phase-title', 'phase-time', 'phase-steps', 'phase-step', 'phase-step-title', 'phase-step-text', 'phase-step-meta'] },
    examples: [{ title: 'Pipeline', html: `<div class="phases">
  <section><header class="phase-head"><span class="phase-num">1</span><h3 class="phase-title">Data generation</h3><span class="phase-time">3 weeks</span></header>
    <div class="phase-steps"><article class="phase-step"><p class="phase-step-title">Synthetic conversations</p><p class="phase-step-text">80K conversations across five domains from a teacher model.</p><div class="phase-step-meta"><span class="badge badge-info badge-mono">5–7 days</span><span class="badge badge-success badge-mono">≈ $120</span><span class="badge badge-accent badge-mono">critical</span></div></article></div></section>
  <section><header class="phase-head"><span class="phase-num">2</span><h3 class="phase-title">Training</h3><span class="phase-time">1 week</span></header>
    <div class="phase-steps"><article class="phase-step"><p class="phase-step-title">SFT</p><p class="phase-step-text">QLoRA on 100K conversations, single A100.</p><div class="phase-step-meta"><span class="badge badge-info badge-mono">1 day</span><span class="badge badge-success badge-mono">≈ $50</span></div></article></div></section>
</div>` }],
    v5: { 'phase-section / steps-grid / step-card / meta-badge': 'phases section / phase-steps / phase-step / badge badge-mono' },
  },
];
