// FORMA color engine — OKLCH ⇄ sRGB, WCAG contrast, contrast-targeted solving.
// Zero dependencies. Every theme palette is *computed* from a few parameters and
// *proven* against WCAG at build time, so no theme can ship an unreadable token.

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

export function oklchToLinearSrgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);
const encode = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const decode = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

/** OKLCH → hex, reducing chroma until the color fits in sRGB. */
export function oklchToHex(L, C, H) {
  L = clamp(L);
  let c = C, rgb = oklchToLinearSrgb(L, c, H);
  while (!inGamut(rgb) && c > 0) { c = Math.max(0, c - 0.002); rgb = oklchToLinearSrgb(L, c, H); }
  return '#' + rgb.map((v) => Math.round(clamp(encode(clamp(v))) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(decode);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Composite a translucent color over an opaque background (for checking alpha tokens). */
export function mixHex(fg, bg, alpha) {
  const f = hexToRgb(fg), g = hexToRgb(bg);
  return '#' + f.map((v, i) => Math.round((v * alpha + g[i] * (1 - alpha)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Find the lightness closest to `preferL` (keeping C,H) whose contrast against
 * every background in `bgs` is ≥ target. Searches in the direction away from
 * the backgrounds (lighter on dark bg, darker on light bg).
 */
export function solveL({ C, H, preferL, bgs, target, direction }) {
  const ok = (L) => bgs.every((bg) => contrast(oklchToHex(L, C, H), bg) >= target);
  if (ok(preferL)) return preferL;
  const step = direction === 'lighter' ? 0.002 : -0.002;
  for (let L = preferL; L >= 0 && L <= 1; L += step) if (ok(L)) return L;
  return direction === 'lighter' ? 1 : 0;
}

/** Solve and return { hex, L, ratio } — ratio is the worst-case contrast. */
export function solve(opts) {
  const L = solveL(opts);
  const hex = oklchToHex(L, opts.C, opts.H);
  const ratio = Math.min(...opts.bgs.map((bg) => contrast(hex, bg)));
  return { hex, L, ratio };
}
