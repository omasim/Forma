#!/usr/bin/env node
// FORMA MCP server — Model Context Protocol over stdio (JSON-RPC 2.0, newline-delimited).
// Zero dependencies. Serves the real spec; never invents markup.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from '../lib/lint.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let _spec;
const S = () => (_spec ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'forma-spec.json'), 'utf8')));

export const TOOLS = [
  { name: 'list_components', description: 'List components (id, name, category, base class). Optional category filter.', inputSchema: { type: 'object', properties: { category: { type: 'string' } } } },
  { name: 'get_component', description: 'Full spec for one component: classes, variants, parts, example HTML, accessibility rules, JS API, v5 migration.', inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'Component id or name, e.g. "dialog" or "Data Table"' } }, required: ['id'] } },
  { name: 'search', description: 'Search components, classes and themes by keyword.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
  { name: 'list_themes', description: 'List themes with category, fonts and description.', inputSchema: { type: 'object', properties: { category: { type: 'string' } } } },
  { name: 'get_theme', description: 'Computed color tokens (light and dark), fonts and how to load a theme.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'get_tokens', description: 'Primitive design tokens (spacing, type, radius, motion, z-index…), optionally filtered by group prefix.', inputSchema: { type: 'object', properties: { group: { type: 'string', description: 'e.g. "space", "text", "radius"' } } } },
  { name: 'validate_html', description: 'Lint HTML against FORMA: unknown or v5 classes (with suggestions), missing accessible names, unlabeled inputs, broken references.', inputSchema: { type: 'object', properties: { html: { type: 'string' } }, required: ['html'] } },
  { name: 'get_page_skeleton', description: 'A minimal valid FORMA page (head, links, mode/theme attributes) to put generated components into.', inputSchema: { type: 'object', properties: { theme: { type: 'string' }, mode: { type: 'string', enum: ['light', 'dark', 'system'] }, title: { type: 'string' }, cdn: { type: 'boolean' } } } },
];

const find = (id) => { const k = String(id).toLowerCase(); return S().components.find((c) => c.id === k || c.name.toLowerCase() === k); };
const text = (t) => ({ content: [{ type: 'text', text: typeof t === 'string' ? t : JSON.stringify(t, null, 2) }] });

export function callTool(name, args = {}) {
  switch (name) {
    case 'list_components': return text(S().components.filter((c) => !args.category || c.category.toLowerCase().includes(args.category.toLowerCase())).map(({ id, name, category, classes }) => ({ id, name, category, base: classes.base })));
    case 'get_component': { const c = find(args.id); if (!c) return { ...text(`No component "${args.id}". Try search.`), isError: true }; return text(c); }
    case 'search': {
      const q = String(args.query || '').toLowerCase();
      const comps = S().components.filter((c) => [c.id, c.name, c.category, c.description, ...Object.values(c.classes).flat()].join(' ').toLowerCase().includes(q)).map((c) => ({ type: 'component', id: c.id, name: c.name }));
      const themes = S().themes.filter((t) => [t.id, t.name, t.category, t.description].join(' ').toLowerCase().includes(q)).map((t) => ({ type: 'theme', id: t.id, name: t.name }));
      return text([...comps, ...themes].slice(0, 30));
    }
    case 'list_themes': return text(S().themes.filter((t) => !args.category || t.category === args.category).map(({ id, name, category, description, fonts }) => ({ id, name, category, description, fonts })));
    case 'get_theme': { const t = S().themes.find((x) => x.id === args.id); if (!t) return { ...text(`No theme "${args.id}".`), isError: true }; return text({ ...t, usage: t.id === 'museum' ? 'Default — nothing to load.' : `<link rel="stylesheet" href="dist/themes/${t.id}.css"> and <html data-theme="${t.id}">` }); }
    case 'get_tokens': return text(S().tokens.filter((t) => !args.group || t.name.startsWith(args.group)));
    case 'validate_html': { const p = lint(String(args.html || ''), S()); return text(p.length ? p : 'No problems found.'); }
    case 'get_page_skeleton': {
      const base = args.cdn ? `https://cdn.jsdelivr.net/npm/@nage/forma@${S().version}/dist/` : 'dist/';
      const theme = args.theme && args.theme !== 'museum' ? args.theme : null;
      return text(`<!doctype html>\n<html lang="en"${theme ? ` data-theme="${theme}"` : ''}${args.mode && args.mode !== 'system' ? ` data-mode="${args.mode}"` : ''}>\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>${args.title || 'Untitled'}</title>\n  <link rel="stylesheet" href="${base}forma.min.css">\n${theme ? `  <link rel="stylesheet" href="${base}themes/${theme}.css">\n` : ''}  <script src="${base}forma.min.js" defer></script>\n</head>\n<body>\n  <main class="container" style="padding-block: var(--space-7)">\n    <!-- components here -->\n  </main>\n</body>\n</html>`);
    }
    default: return { ...text(`Unknown tool ${name}`), isError: true };
  }
}

function handle(msg) {
  const { id, method, params } = msg;
  if (method === 'initialize') return { jsonrpc: '2.0', id, result: { protocolVersion: params?.protocolVersion || '2025-06-18', capabilities: { tools: {}, resources: {} }, serverInfo: { name: 'forma', version: S().version }, instructions: 'FORMA design system. Use get_component before writing markup, and validate_html on what you produce.' } };
  if (method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
  if (method === 'tools/call') return { jsonrpc: '2.0', id, result: callTool(params.name, params.arguments) };
  if (method === 'resources/list') return { jsonrpc: '2.0', id, result: { resources: [{ uri: 'forma://llms-full.txt', name: 'FORMA complete reference', mimeType: 'text/markdown' }] } };
  if (method === 'resources/read') return { jsonrpc: '2.0', id, result: { contents: [{ uri: params.uri, mimeType: 'text/markdown', text: fs.readFileSync(path.join(ROOT, 'llms-full.txt'), 'utf8') }] } };
  if (method === 'ping') return { jsonrpc: '2.0', id, result: {} };
  if (id === undefined) return null; // notification
  return { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } };
}

export function serve() {
  let buf = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    buf += chunk; let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line) continue;
      let res;
      try { res = handle(JSON.parse(line)); } catch (e) { res = { jsonrpc: '2.0', id: null, error: { code: -32700, message: String(e.message) } }; }
      if (res) process.stdout.write(JSON.stringify(res) + '\n');
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) serve();
