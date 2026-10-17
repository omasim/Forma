// FORMA linter — checks HTML against the generated spec. Shared by the CLI and the MCP server.
// Zero dependencies: a tolerant tag scanner, not a full HTML parser.

const levenshtein = (a, b) => {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
};

function* tags(html) {
  const re = /<([a-zA-Z][\w-]*)(\s[^<>]*?)?(\/?)>/g; let m;
  while ((m = re.exec(html))) {
    const attrs = {}; const raw = m[2] || '';
    for (const a of raw.matchAll(/([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) attrs[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? '';
    const line = html.slice(0, m.index).split('\n').length;
    yield { name: m[1].toLowerCase(), attrs, index: m.index, end: re.lastIndex, line };
  }
}

/**
 * @param {string} html
 * @param {{ classes: string[], deprecated: Record<string,string>, prefixes?: string[] }} spec
 * @returns {{ line:number, rule:string, message:string, severity:'error'|'warning' }[]}
 */
export function lint(html, spec) {
  const known = new Set([...spec.classes, ...(spec.extraClasses || [])]);
  const heads = new Set(spec.classes.map((c) => c.split('-')[0]));
  const deprecated = spec.deprecated || {};
  const problems = [];
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const labelFor = new Set([...html.matchAll(/<label[^>]*\sfor="([^"]+)"/g)].map((m) => m[1]));
  const list = [...tags(html)];
  list.forEach((t, i) => {
    const cls = (t.attrs.class || '').split(/\s+/).filter(Boolean);
    const formaish = cls.some((c) => known.has(c));
    for (const c of cls) {
      if (known.has(c)) continue;
      if (deprecated[c]) { problems.push({ line: t.line, rule: 'deprecated-class', severity: 'error', message: `"${c}" is a v5 class → use ${deprecated[c]}` }); continue; }
      if (!heads.has(c.split('-')[0])) continue; // not in a FORMA namespace → the author's own class
      let best = null, d = 3;
      for (const k of known) { if (Math.abs(k.length - c.length) > 2) continue; const x = levenshtein(c, k); if (x < d) { d = x; best = k; } }
      problems.push({ line: t.line, rule: 'unknown-class', severity: 'error', message: `unknown class "${c}"${best ? ` → did you mean "${best}"?` : ''}` });
    }
    // a11y heuristics
    const close = html.indexOf(`</${t.name}>`, t.end);
    const inner = close > -1 ? html.slice(t.end, close) : '';
    const text = inner.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, 'x').trim();
    const named = t.attrs['aria-label'] || t.attrs['aria-labelledby'] || t.attrs.title || /class="[^"]*sr-only/.test(inner);
    if ((t.name === 'button' || (t.name === 'a' && 'href' in t.attrs)) && !text && !named && !/<img[^>]+alt="[^"]+"/.test(inner)) problems.push({ line: t.line, rule: 'accessible-name', severity: 'error', message: `icon-only <${t.name}> has no accessible name (aria-label)` });
    if (t.name === 'img' && !('alt' in t.attrs)) problems.push({ line: t.line, rule: 'img-alt', severity: 'error', message: '<img> is missing alt' });
    if (['input', 'select', 'textarea'].includes(t.name) && !['hidden', 'submit', 'button', 'reset'].includes(t.attrs.type)) {
      const id = t.attrs.id; const wrapped = list.slice(0, i).reverse().find((p) => p.name === 'label' && html.indexOf('</label>', p.end) > t.index);
      if (!t.attrs['aria-label'] && !t.attrs['aria-labelledby'] && !(id && labelFor.has(id)) && !wrapped) problems.push({ line: t.line, rule: 'form-label', severity: 'error', message: `<${t.name}${id ? ` id="${id}"` : ''}> has no label` });
    }
    if (t.attrs['data-forma-open'] && !ids.has(t.attrs['data-forma-open'])) problems.push({ line: t.line, rule: 'dangling-ref', severity: 'warning', message: `data-forma-open="${t.attrs['data-forma-open']}" points to no element in this file` });
    if (t.attrs.popovertarget && !ids.has(t.attrs.popovertarget)) problems.push({ line: t.line, rule: 'dangling-ref', severity: 'warning', message: `popovertarget="${t.attrs.popovertarget}" points to no element in this file` });
    if (cls.includes('tab') && t.attrs.role !== 'tab') problems.push({ line: t.line, rule: 'aria-pattern', severity: 'warning', message: '.tab should have role="tab"' });
    if (cls.includes('dialog') && t.name !== 'dialog') problems.push({ line: t.line, rule: 'native-element', severity: 'warning', message: '.dialog must be a <dialog> element in v6' });
    if (t.attrs.style && /(?:^|;)\s*(?!--)[a-z-]+\s*:[^;]*(?:#[0-9a-f]{3,8}\b|rgba?\()/i.test(t.attrs.style) && formaish) problems.push({ line: t.line, rule: 'hardcoded-color', severity: 'warning', message: 'hard-coded color in style="" — use a token (var(--accent), …)' });
  });
  return problems;
}

const HTML_TAGS = new Set(['a', 'button', 'dialog', 'div', 'details', 'input', 'label', 'nav', 'section', 'select', 'span', 'table', 'textarea', 'ul']);
/** A deprecated-class target that can be applied mechanically: "a b c" or "tag.a.b" → ["a","b"]; otherwise null. */
export function fixableTarget(target) {
  const t = String(target).trim();
  if (/^[a-z][a-z0-9-]*(?: [a-z][a-z0-9-]*)*$/.test(t)) return t.split(' ');
  const m = t.match(/^([a-z]+)((?:\.[a-z][a-z0-9-]*)+)$/);
  if (m && HTML_TAGS.has(m[1])) return m[2].slice(1).split('.');
  return null;
}

/**
 * Rewrite v5 classes to their v6 replacements inside class="" attributes.
 * Only mechanical renames are applied; anything that needs new markup (a <dialog>, an ARIA
 * attribute, a popover) is left in place and reported back as `manual`.
 * @returns {{ html: string, fixed: {line:number, from:string, to:string}[], manual: {line:number, from:string, to:string}[] }}
 */
export function fix(html, spec) {
  const deprecated = spec.deprecated || {};
  const fixed = [], manual = [];
  const lineAt = (i) => html.slice(0, i).split('\n').length;
  const out = html.replace(/(\sclass\s*=\s*)(["'])([^"']*)\2/g, (m, pre, q, value, idx) => {
    const cls = value.split(/\s+/).filter(Boolean);
    const next = [];
    for (const c of cls) {
      const target = deprecated[c];
      if (!target) { next.push(c); continue; }
      const repl = fixableTarget(target);
      if (repl) { next.push(...repl); fixed.push({ line: lineAt(idx), from: c, to: repl.join(' ') }); }
      else { next.push(c); manual.push({ line: lineAt(idx), from: c, to: target }); }
    }
    const uniq = [...new Set(next)];
    return `${pre}${q}${uniq.join(' ')}${q}`;
  });
  return { html: out, fixed, manual };
}
