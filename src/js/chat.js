// Chat surface: send on Enter, auto-scroll, add messages, thinking, streaming.
import { $, h, emit, icon } from './util.js';
import { define } from './core.js';

export function chat(root) {
  const log = $('.chat-log', root), form = $('.composer', root), input = $('.composer-input', root), send = $('.composer-send', root);
  const nearBottom = () => !log || log.scrollHeight - log.scrollTop - log.clientHeight < 80;
  const scroll = (force) => { if (log && (force || nearBottom())) log.scrollTop = log.scrollHeight; };
  const syncSend = () => { if (send && input) send.disabled = !input.value.trim(); };
  input?.addEventListener('input', syncSend); syncSend();
  input?.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form?.requestSubmit(); } });
  form?.addEventListener('submit', (e) => {
    e.preventDefault(); const text = input.value.trim(); if (!text) return;
    api.add({ role: 'user', text }); input.value = ''; syncSend();
    emit(root, 'submit', { text });
  });
  const api = {
    /** Add a message. `text` is inserted as text; `html` only for trusted, sanitised markup. */
    add({ role = 'assistant', text = '', html, name } = {}) {
      $('.chat-empty', log)?.remove();
      const body = h('div', { class: 'message-body' });
      if (html) body.innerHTML = html; else text.split(/\n{2,}/).forEach((p) => body.append(h('p', { text: p })));
      const msg = h('div', { class: `message${role === 'user' ? ' message-user' : ''}` }, role === 'user' ? null : h('span', { class: 'message-avatar', 'aria-hidden': 'true', text: name || 'AI' }), body);
      log.append(msg); scroll(role === 'user'); return msg;
    },
    thinking(label = 'Thinking…') {
      const msg = h('div', { class: 'message', 'data-thinking': '' }, h('span', { class: 'message-avatar', 'aria-hidden': 'true', text: 'AI' }),
        h('div', { class: 'message-body' }, h('span', { class: 'thinking' }, h('span', { class: 'thinking-dots', 'aria-hidden': 'true' }, h('span'), h('span'), h('span')), h('span', { class: 'thinking-shimmer', text: label }))));
      log.append(msg); scroll(); return { done: () => msg.remove() };
    },
    /** Stream text into a new assistant message. Accepts a string (typed out) or an async iterable of chunks. */
    async stream(source, { speed = 14 } = {}) {
      $('[data-thinking]', log)?.remove();
      const p = h('p', { class: 'streaming' }); const msg = api.add({ role: 'assistant' }); $('.message-body', msg).replaceChildren(p);
      log.setAttribute('aria-busy', 'true');
      if (typeof source === 'string') { for (const ch of source) { p.textContent += ch; scroll(); await new Promise((r) => setTimeout(r, speed)); } }
      else for await (const chunk of source) { p.textContent += chunk; scroll(); }
      p.classList.remove('streaming'); log.removeAttribute('aria-busy');
      $('.message-body', msg).append(h('div', { class: 'message-actions' }, h('button', { class: 'btn btn-icon btn-ghost btn-sm', 'aria-label': 'Copy', 'data-forma': 'copy', 'data-copy-text': p.textContent }, icon('copy'))));
      return msg;
    },
    clear() { log.replaceChildren(); },
  };
  root._forma = api;
  scroll(true);
  return api;
}
define('chat', chat);
