// @nage/forma/react — thin React bindings. No JSX, no build step; React is a peer dependency.
//
// FORMA's behaviour layer already watches the DOM (MutationObserver) and sets up every
// [data-forma] element React renders, once. These helpers cover the rest: applying a theme
// and mode, listening to forma:* events, and driving imperative APIs (charts, toasts, dialogs).
import { createElement, useEffect, useRef, useCallback } from 'react';
import * as Forma from '../dist/forma.esm.js';

export { Forma };

/** Apply a theme and/or mode for the whole page. Pass undefined to leave either alone. */
export function useFormaTheme({ theme, mode } = {}) {
  useEffect(() => { if (theme !== undefined) Forma.theme.set(theme, { persist: false }); }, [theme]);
  useEffect(() => { if (mode !== undefined) Forma.mode.set(mode, { persist: false }); }, [mode]);
}

/** <FormaProvider theme="swiss" mode="dark">…</FormaProvider> — same as useFormaTheme, as a wrapper. */
export function FormaProvider({ theme, mode, children }) {
  useFormaTheme({ theme, mode });
  return children ?? null;
}

/** Initialise FORMA behaviours inside a ref'd subtree right away (useful before the observer runs, e.g. in tests). */
export function useForma(ref) {
  useEffect(() => { if (ref?.current) Forma.init(ref.current); }, [ref]);
  return Forma;
}

/** Listen to a FORMA event ("tab", "select", "change", "move", …) on a ref'd element. */
export function useFormaEvent(ref, name, handler) {
  const saved = useRef(handler);
  saved.current = handler;
  useEffect(() => {
    const el = ref?.current; if (!el) return undefined;
    const type = name.startsWith('forma:') ? name : `forma:${name}`;
    const fn = (e) => saved.current(e);
    el.addEventListener(type, fn);
    return () => el.removeEventListener(type, fn);
  }, [ref, name]);
}

/** A chart that re-renders when its props change. */
export function Chart({ type = 'line', labels, series, format, title, summary, height, className = '', ...rest }) {
  const ref = useRef(null);
  const api = useRef(null);
  useEffect(() => {
    const opts = { type, labels, series, format, title, summary, height };
    if (!api.current) api.current = Forma.chart(ref.current, opts);
    else api.current.update(opts);
  }, [type, JSON.stringify(labels), JSON.stringify(series), format, title, summary, height]);
  return createElement('figure', { ref, className: `chart ${className}`.trim(), ...rest },
    title ? createElement('figcaption', { className: 'chart-title' }, title) : null,
    createElement('div', { className: 'chart-canvas' }));
}

/** <Icon name="search" /> — an icon from the FORMA sprite (set `sprite` if it isn't next to forma.css). */
export function Icon({ name, sprite = 'forma-icons.svg', className = '', label, ...rest }) {
  return createElement('svg', { className: `fi ${className}`.trim(), 'aria-hidden': label ? undefined : 'true', role: label ? 'img' : undefined, 'aria-label': label, ...rest },
    createElement('use', { href: `${sprite}#fi-${name}` }));
}

/** const open = useDialog('settings'); <button onClick={open}>… */
export function useDialog(id) {
  return useCallback(() => Forma.dialog.open(id), [id]);
}

export const toast = Forma.toast;
export const confirm = Forma.confirm;
