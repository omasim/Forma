// Theme parameters → full, contrast-verified color token sets for dark & light mode.
import { oklchToHex, solve, contrast, mixHex } from '../../lib/color.mjs';

export const CONTRAST = {
  text: 4.5,          // WCAG 1.4.3 AA, normal text
  textPrimary: 12,    // comfortable body text
  textSecondary: 6,   // supporting text
  ui: 3,              // WCAG 1.4.11 non-text (indicators, focus, control borders)
};

const DEFAULTS = {
  neutral: { h: 95, c: 0.006, dark: { base: 0.135 }, light: { base: 0.975 } },
  accent: { h: 186, c: 0.12, dark: 0.80, light: 0.62 },
  semantic: {
    error: { h: 25, c: 0.16 }, success: { h: 150, c: 0.11 },
    warning: { h: 75, c: 0.13 }, info: { h: 250, c: 0.12 },
  },
};

const merge = (a, b) => {
  if (b === undefined) return a;
  if (typeof a !== 'object' || a === null) return b;
  const out = { ...a };
  for (const k of Object.keys(b)) out[k] = merge(a[k], b[k]);
  return out;
};

function surfaces(n, mode) {
  const { h, c } = n;
  if (mode === 'dark') {
    const b = n.dark.base;
    return {
      'bg-base': oklchToHex(b, c, h),
      'bg-surface': oklchToHex(b + 0.025, c, h),
      'bg-elevated': oklchToHex(b + 0.055, c, h),
      'bg-subtle': oklchToHex(b + 0.085, c, h),
      'bg-hover': oklchToHex(b + 0.115, c, h),
    };
  }
  const b = n.light.base;
  return {
    'bg-base': oklchToHex(b, c, h),
    'bg-surface': oklchToHex(Math.min(1, b + 0.025), c * 0.4, h),
    'bg-elevated': oklchToHex(Math.min(1, b + 0.025), c * 0.4, h),
    'bg-subtle': oklchToHex(b - 0.035, c, h),
    'bg-hover': oklchToHex(b - 0.065, c, h),
  };
}

/** Build one mode. Returns { tokens, checks } where checks documents every proof. */
export function buildMode(params, mode) {
  const p = merge(DEFAULTS, params);
  const dark = mode === 'dark';
  const away = dark ? 'lighter' : 'darker';
  const t = surfaces(p.neutral, mode);
  const checks = [];
  const textBgs = [t['bg-base'], t['bg-surface'], t['bg-elevated'], t['bg-subtle']];
  const { h, c } = p.neutral;

  const text = (name, preferL, target) => {
    const r = solve({ C: c * 1.5, H: h, preferL, bgs: textBgs, target, direction: away });
    t[name] = r.hex; checks.push({ token: name, against: 'all surfaces', ratio: r.ratio, target });
  };
  text('text-primary', dark ? 0.93 : 0.18, CONTRAST.textPrimary);
  text('text-secondary', dark ? 0.70 : 0.45, CONTRAST.textSecondary);
  text('text-tertiary', dark ? 0.60 : 0.55, CONTRAST.text);
  // Disabled text is exempt from WCAG contrast; keep it legible but clearly inert.
  t['text-disabled'] = oklchToHex(dark ? p.neutral.dark.base + 0.3 : p.neutral.light.base - 0.32, c, h);

  // Control border (checkbox, radio, switch track, input outline on focus-less state)
  const cb = solve({ C: c, H: h, preferL: dark ? 0.45 : 0.72, bgs: [t['bg-surface'], t['bg-elevated']], target: CONTRAST.ui, direction: away });
  t['border-control'] = cb.hex; checks.push({ token: 'border-control', against: 'surface/elevated', ratio: cb.ratio, target: CONTRAST.ui });

  // Accent fill — ≥3:1 against surfaces so it works as an indicator / focus ring.
  const A = p.accent;
  let fill = solve({ C: A.c, H: A.h, preferL: dark ? A.dark : A.light, bgs: [t['bg-base'], t['bg-surface'], t['bg-elevated']], target: CONTRAST.ui, direction: away });
  // Text placed on the accent fill.
  const darkInk = t['bg-base'], lightInk = '#FFFFFF';
  let onAccent = contrast(fill.hex, darkInk) >= contrast(fill.hex, lightInk) ? darkInk : lightInk;
  if (contrast(fill.hex, onAccent) < CONTRAST.text) {
    fill = solve({ C: A.c, H: A.h, preferL: fill.L, bgs: [onAccent, t['bg-base'], t['bg-surface']], target: CONTRAST.text, direction: onAccent === darkInk ? 'lighter' : 'darker' });
  }
  t['accent'] = fill.hex;
  t['accent-contrast'] = onAccent;
  t['accent-hover'] = oklchToHex(fill.L + (dark ? 0.04 : -0.05), A.c, A.h);
  checks.push({ token: 'accent', against: 'surfaces', ratio: Math.min(contrast(fill.hex, t['bg-base']), contrast(fill.hex, t['bg-elevated'])), target: CONTRAST.ui });
  checks.push({ token: 'accent-contrast', against: 'accent', ratio: contrast(onAccent, fill.hex), target: CONTRAST.text });

  // Accent as text: must survive surfaces and its own 12% tint.
  // Tinted backgrounds (badges, alerts) are color-mix(… 13%) over any surface; check them all with margin.
  const tints = (hex) => textBgs.map((bg) => mixHex(hex, bg, 0.16));
  const at = solve({ C: A.c, H: A.h, preferL: fill.L, bgs: [...textBgs, ...tints(fill.hex)], target: CONTRAST.text, direction: away });
  t['accent-text'] = at.hex; checks.push({ token: 'accent-text', against: 'surfaces + accent-muted', ratio: at.ratio, target: CONTRAST.text });

  for (const [name, s] of Object.entries(p.semantic)) {
    const r = solve({ C: s.c, H: s.h, preferL: dark ? 0.72 : 0.5, bgs: [...textBgs], target: CONTRAST.text, direction: away });
    // also hold against its own tint
    const r2 = solve({ C: s.c, H: s.h, preferL: r.L, bgs: [...textBgs, ...tints(r.hex)], target: CONTRAST.text, direction: away });
    t[name] = r2.hex; checks.push({ token: name, against: 'surfaces + own tint', ratio: r2.ratio, target: CONTRAST.text });
  }
  // Solid destructive / status fills use a white-or-ink label.
  for (const name of Object.keys(p.semantic)) {
    const ink = contrast(t[name], darkInk) >= contrast(t[name], lightInk) ? darkInk : lightInk;
    t[`on-${name}`] = ink; checks.push({ token: `on-${name}`, against: name, ratio: contrast(ink, t[name]), target: CONTRAST.text });
  }

  // Categorical data colors. Deliberately theme-independent: a series keeps its color
  // across themes, and this fixed order is validated for colour-vision deficiency
  // (adjacent CVD ΔE ≥ 8, normal-vision ΔE ≥ 15). Single-series charts use --accent.
  // Light slots 3–5 sit under 3:1 on white → charts ship direct labels / a table view.
  const CATEGORICAL = {
    light: ['#2A78D6', '#EB6834', '#1BAF7A', '#EDA100', '#E87BA4', '#008300', '#4A3AA7', '#E34948'],
    dark: ['#3987E5', '#D95926', '#199E70', '#C98500', '#D55181', '#008300', '#9085E9', '#E66767'],
  };
  CATEGORICAL[mode].forEach((hex, i) => { t[`data-${i + 1}`] = hex; });

  return { tokens: t, checks };
}

export function buildPalette(params = {}) {
  return { dark: buildMode(params, 'dark'), light: buildMode(params, 'light') };
}
