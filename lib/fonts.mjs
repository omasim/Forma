// Self-host a theme's fonts: download them from the npm registry (Fontsource packages, OFL)
// and write a theme stylesheet with local @font-face rules instead of the Google Fonts @import.
// Used by `forma fonts <theme…> --out <dir>`. Node 18+, no dependencies.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const REGISTRY = 'https://registry.npmjs.org';

/** "Lora:ital,wght@0,400;1,400" → { family, faces: [{ weight: 400, italic: false }, …] } */
export function parseGoogleSpec(spec) {
  const [family, axes = ''] = spec.split(':');
  const faces = [];
  if (!axes) faces.push({ weight: 400, italic: false });
  else {
    const [names, values] = axes.split('@');
    const keys = names.split(',');
    for (const tuple of values.split(';')) {
      const v = tuple.split(',');
      const get = (k) => (keys.indexOf(k) >= 0 ? v[keys.indexOf(k)] : undefined);
      const ital = get('ital'), wght = get('wght');
      faces.push({ weight: wght ? Number(wght.split('..')[0]) : 400, italic: ital === '1' });
    }
  }
  return { family: family.trim(), faces };
}

export const slugOf = (family) => family.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Minimal tar reader: → Map(name → Buffer) for entries that pass `keep(name)`. */
function untar(buf, keep) {
  const files = new Map();
  let off = 0;
  while (off + 512 <= buf.length) {
    const header = buf.subarray(off, off + 512);
    if (header.every((b) => b === 0)) break;
    const field = (s, l) => header.subarray(s, s + l).toString('utf8').replace(/\0.*$/s, '');
    const name = (field(345, 155) ? field(345, 155) + '/' : '') + field(0, 100);
    const size = parseInt(field(124, 12).trim() || '0', 8);
    const type = String.fromCharCode(header[156] || 48);
    const start = off + 512;
    if ((type === '0' || type === '\0') && keep(name)) files.set(name, buf.subarray(start, start + size));
    off = start + Math.ceil(size / 512) * 512;
  }
  return files;
}

async function fetchOk(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

/** Download one family from Fontsource; → [{ file, data, css }] where css are @font-face blocks pointing at ./fonts/<slug>/<file>. */
export async function fetchFamily(spec, { subsets } = {}) {
  const { family, faces } = typeof spec === 'string' ? parseGoogleSpec(spec) : spec;
  const slug = slugOf(family);
  const meta = await (await fetchOk(`${REGISTRY}/@fontsource%2F${slug}/latest`)).json();
  const tgz = Buffer.from(await (await fetchOk(meta.dist.tarball)).arrayBuffer());
  const wanted = new Set(faces.map((f) => `${f.weight}${f.italic ? '-italic' : ''}.css`));
  const tar = untar(zlib.gunzipSync(tgz), (n) => wanted.has(path.basename(n)) || n.endsWith('.woff2'));
  const blocks = [], files = [];
  for (const cssName of wanted) {
    const css = [...tar].find(([n]) => n === `package/${cssName}`)?.[1]?.toString('utf8');
    if (!css) { console.warn(`  ! ${family}: no ${cssName} in @fontsource/${slug}@${meta.version}`); continue; }
    for (const block of css.split(/\n(?=\/\*)/)) {
      const sub = block.match(/\/\* ([\w-]+) \*\//)?.[1];
      const m = block.match(/url\(\.\/files\/([^)]+\.woff2)\)/);
      if (!m) continue;
      if (subsets && !subsets.some((s) => sub?.includes(`-${s}-`))) continue;
      const data = tar.get(`package/files/${m[1]}`);
      if (!data) continue;
      files.push({ file: `${slug}/${m[1]}`, data });
      blocks.push(block.replace(/src: url\(\.\/files\/[^;]+;/, `src: url(./fonts/${slug}/${m[1]}) format('woff2');`).trim());
    }
  }
  return { family, slug, version: meta.version, files, css: blocks.join('\n') };
}

/** Write `<out>/<theme>.css` (theme + local @font-face, no Google import) and `<out>/fonts/…`. */
export async function selfHostTheme({ themeCss, googleSpecs, outDir, themeId, subsets, log = console.log }) {
  const faces = [];
  let count = 0, bytes = 0;
  // One download per family, with the union of the weights/styles every role asks for.
  const byFamily = new Map();
  for (const spec of googleSpecs) {
    const p = parseGoogleSpec(spec);
    const cur = byFamily.get(p.family) || { family: p.family, faces: [] };
    for (const f of p.faces) if (!cur.faces.some((x) => x.weight === f.weight && x.italic === f.italic)) cur.faces.push(f);
    byFamily.set(p.family, cur);
  }
  for (const spec of byFamily.values()) {
    const fam = await fetchFamily(spec, { subsets });
    for (const f of fam.files) {
      const p = path.join(outDir, 'fonts', f.file);
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, f.data); count++; bytes += f.data.length;
    }
    faces.push(`/* ${fam.family} — @fontsource/${fam.slug}@${fam.version} (OFL) */\n${fam.css}`);
    log(`  ${fam.family}: ${fam.files.length} file(s)`);
  }
  const css = themeCss.replace(/@import url\("https:\/\/fonts\.googleapis\.com[^"]*"\);\n?/, '');
  const out = css.replace(/(\/\* Theme:[^\n]*\n)/, `$1${faces.join('\n')}\n`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${themeId}.css`), out);
  return { files: count, kb: Math.round(bytes / 1024) };
}
