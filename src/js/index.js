/*!
 * FORMA — tiny, dependency-free behaviour layer.
 * Everything is optional: CSS works alone; this adds keyboard support, ARIA wiring and
 * a few interactive components. Auto-initialises [data-forma] elements, including ones
 * added later (MutationObserver).
 */
import { define, init, observe, mode, theme, restoreMode } from './core.js';
import { dialog, confirm, position, menu, tooltip, toast, command, setupDialogs, setupPopovers } from './overlays.js';
import { tabs, validate, wizard, combobox, datepicker, formatBytes } from './forms.js';
import { table, tree, kanban, calendar, toc } from './data.js';
import { chart, sparkline } from './chart.js';
import { chat } from './chat.js';
import { announce } from './util.js';

const version = typeof __FORMA_VERSION__ !== 'undefined' ? __FORMA_VERSION__ : 'dev';

/** Clipboard helper with announcement. */
async function copy(text) { try { await navigator.clipboard.writeText(text); announce('Copied to clipboard'); return true; } catch { return false; } }

function start() {
  setupDialogs();
  setupPopovers();
  init(document);
  observe();
}

if (typeof document !== 'undefined') {
  restoreMode();
  if (document.documentElement.hasAttribute('data-forma-restore-theme')) theme.restore();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}

export {
  version, define, init, mode, theme,
  dialog, confirm, position, menu, tooltip, toast, command,
  tabs, validate, wizard, combobox, datepicker, formatBytes,
  table, tree, kanban, calendar, toc, chart, sparkline, chat, copy, announce,
};
