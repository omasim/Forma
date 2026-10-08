// Builds dist/forma-icons.svg — a <symbol> sprite (ids: fi-<name>) from Lucide (ISC licence).
// FORMA names are kept stable across versions; ALIASES maps them onto Lucide file names.
import fs from 'node:fs';
import path from 'node:path';

export const ALIASES = {
  'check-circle': 'circle-check', 'x-circle': 'circle-x', warning: 'triangle-alert', 'alert-circle': 'circle-alert', help: 'circle-help',
  edit: 'pencil', home: 'house', layout: 'layout-dashboard', 'more-horizontal': 'ellipsis', 'more-vertical': 'ellipsis-vertical', 'more-h': 'ellipsis', 'more-v': 'ellipsis-vertical',
  'plus-circle': 'circle-plus', sidebar: 'panel-left', close: 'x', 'external-link': 'external-link', grid: 'layout-grid', kanban: 'square-kanban',
  'chart-line': 'chart-line', 'chart-pie': 'chart-pie', 'chart-area': 'chart-area', 'trending-down': 'trending-down', speed: 'gauge', waveform: 'audio-waveform',
  branch: 'git-branch', 'git-pull': 'git-pull-request', diff: 'git-compare', api: 'braces', cube: 'box', 'ab-test': 'split', compare: 'git-compare-arrows',
  sparkle: 'sparkle', model: 'boxes', neurons: 'network', pipeline: 'workflow', checkpoint: 'flag', eval: 'clipboard-check', prompt: 'message-square-text', inference: 'cpu', token: 'coins', 'token-count': 'hash', dataset: 'database', vector: 'move-3d',
  stop: 'square', volume: 'volume-2', 'x-social': 'twitter', huggingface: 'smile', 'shopping-cart': 'shopping-cart', qr: 'qr-code', 'sun-moon': 'sun-moon', wand: 'wand-sparkles', zip: 'file-archive', csv: 'file-spreadsheet', 'file-json': 'file-json', unlock: 'lock-open', 'toggle-left': 'toggle-left', 'toggle-right': 'toggle-right', radio: 'circle-dot', checkbox: 'square-check', message: 'message-circle', 'message-square': 'message-square', 'split-h': 'columns-2', 'split-v': 'rows-2', window: 'app-window', expand: 'expand', collapse: 'shrink', drag: 'grip-vertical', 'layers-3': 'layers-3', sort: 'arrow-up-down', move: 'move', 'arrow-left': 'arrow-left',
};

export const ICONS = [
  // navigation
  'menu', 'x', 'home', 'chevron-up', 'chevron-down', 'chevron-left', 'chevron-right', 'chevrons-left', 'chevrons-right', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'arrow-up-right', 'arrow-down-left', 'external-link', 'map-pin', 'globe', 'sidebar', 'panel-top', 'panel-bottom', 'panel-left', 'panel-right', 'compass', 'route', 'navigation',
  // layout
  'grid', 'list', 'columns-3', 'table', 'kanban', 'layout', 'align-left', 'align-center', 'align-right', 'split-h', 'split-v', 'maximize', 'minimize', 'window', 'expand', 'collapse', 'drag', 'layers', 'layers-3', 'box', 'boxes',
  // actions
  'plus', 'minus', 'plus-circle', 'edit', 'trash', 'copy', 'save', 'upload', 'download', 'share', 'refresh-cw', 'rotate-ccw', 'search', 'filter', 'sort', 'move', 'zoom-in', 'zoom-out', 'eye', 'eye-off', 'link', 'more-horizontal', 'more-vertical', 'bookmark', 'tag', 'pin', 'scissors', 'undo', 'redo', 'log-in', 'log-out', 'send', 'reply', 'archive', 'printer',
  // status
  'check', 'check-circle', 'x-circle', 'warning', 'alert-circle', 'info', 'help', 'lock', 'unlock', 'shield', 'shield-check', 'scan', 'target', 'fingerprint', 'award', 'flag', 'star', 'heart', 'thumbs-up', 'thumbs-down', 'circle', 'loader',
  // controls
  'settings', 'sliders-horizontal', 'toggle-left', 'toggle-right', 'radio', 'checkbox', 'key', 'power',
  // communication
  'mail', 'message', 'message-square', 'bell', 'bell-off', 'inbox', 'phone', 'at-sign', 'rss', 'paperclip', 'megaphone', 'mic', 'video',
  // files
  'file', 'file-text', 'file-code', 'file-plus', 'file-minus', 'file-search', 'file-json', 'folder', 'folder-open', 'folder-plus', 'zip', 'csv', 'package', 'image', 'music', 'film', 'clipboard', 'notebook',
  // data
  'chart-bar', 'chart-line', 'chart-pie', 'chart-area', 'trending-up', 'trending-down', 'activity', 'database', 'percent', 'hash', 'speed', 'waveform', 'sigma', 'table-2',
  // dev
  'code', 'terminal', 'branch', 'git-merge', 'git-commit-horizontal', 'git-pull', 'diff', 'network', 'server', 'cloud', 'cloud-upload', 'cloud-download', 'wifi', 'api', 'webhook', 'cube', 'ab-test', 'compare', 'bug', 'braces', 'brackets', 'hard-drive', 'cpu', 'memory-stick', 'container', 'rocket',
  // AI / ML
  'brain', 'sparkle', 'sparkles', 'bot', 'model', 'neurons', 'pipeline', 'checkpoint', 'eval', 'prompt', 'inference', 'token', 'token-count', 'dataset', 'beaker', 'microscope', 'vector', 'wand', 'atom', 'lightbulb',
  // media
  'play', 'pause', 'stop', 'skip-forward', 'skip-back', 'rewind', 'volume', 'volume-x', 'aperture', 'feather', 'camera', 'headphones', 'tv',
  // social
  'github', 'figma', 'slack', 'linkedin', 'twitter', 'youtube', 'instagram',
  // commerce
  'credit-card', 'shopping-cart', 'shopping-bag', 'wallet', 'receipt', 'qr', 'store', 'truck', 'gift', 'banknote', 'coins', 'briefcase', 'coffee',
  // people & places
  'user', 'users', 'user-plus', 'building', 'building-2', 'graduation-cap', 'book-open', 'library', 'landmark',
  // health
  'heart-pulse', 'pill', 'stethoscope', 'thermometer', 'wind', 'syringe', 'hospital',
  // editor
  'bold', 'italic', 'underline', 'strikethrough', 'quote', 'heading', 'list-ordered', 'type', 'pilcrow',
  // abstract
  'zap', 'flame', 'infinity', 'sun', 'moon', 'sun-moon', 'palette', 'clock', 'calendar', 'repeat', 'hourglass', 'timer', 'leaf', 'mountain', 'waves', 'gem',
];

export async function buildIcons(ROOT) {
  const dir = path.join(ROOT, 'node_modules/lucide-static/icons');
  if (!fs.existsSync(dir)) return null;
  const used = new Set(ICONS);
  // Any icon referenced by component examples is included automatically.
  const scan = (p) => { if (!fs.existsSync(p)) return; for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    const f = path.join(p, e.name); if (e.isDirectory()) { scan(f); continue; }
    const s = fs.readFileSync(f, 'utf8');
    for (const m of s.matchAll(/ic\('([a-z0-9-]+)'|#fi-([a-z0-9-]+)|icon\((?:root|''), '([a-z0-9-]+)'/g)) used.add(m[1] || m[2] || m[3]);
  } };
  for (const d of ['src', 'site-src', 'scripts/site.mjs']) { const p = path.join(ROOT, d); if (fs.existsSync(p) && fs.statSync(p).isFile()) { const s = fs.readFileSync(p, 'utf8'); for (const m of s.matchAll(/icon\((?:root|''|'\.\.\/'), '([a-z0-9-]+)'/g)) used.add(m[1]); } else scan(p); }
  const symbols = []; const missing = [];
  for (const name of [...used].sort()) {
    const file = path.join(dir, `${ALIASES[name] || name}.svg`);
    if (!fs.existsSync(file)) { missing.push(name); continue; }
    const svg = fs.readFileSync(file, 'utf8');
    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\s+/g, ' ').trim();
    symbols.push(`<symbol id="fi-${name}" viewBox="0 0 24 24">${inner}</symbol>`);
  }
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" id="forma-icons" style="display:none"><!-- FORMA icons · Lucide (ISC) · https://lucide.dev -->\n${symbols.join('\n')}\n</svg>\n`;
  fs.writeFileSync(path.join(ROOT, 'dist/forma-icons.svg'), sprite);
  fs.writeFileSync(path.join(ROOT, 'dist/forma-icons.json'), JSON.stringify(symbols.map((s) => s.match(/id="fi-([^"]+)"/)[1]), null, 0));
  if (missing.length) console.warn('icons missing in Lucide:', missing.join(', '));
  return { count: symbols.length, missing };
}
