/**
 * FORMA — type declarations for the optional behaviour layer.
 * `import * as Forma from '@nage/forma'` (ESM) or the `window.Forma` global (IIFE build).
 */

export type Mode = 'light' | 'dark';
export type ModePreference = Mode | 'system';
export type Placement =
  | 'top' | 'top-start' | 'top-end' | 'top-center'
  | 'bottom' | 'bottom-start' | 'bottom-end' | 'bottom-center'
  | 'left' | 'right';

/** Library version, e.g. "6.0.1". */
export const version: string;

/** Register a declarative behaviour for elements matching `[data-forma~="name"]` (or `selector`). */
export function define(name: string, init: (el: HTMLElement) => unknown, selector?: string): void;
/** Initialise every registered behaviour inside `root`. Safe to call repeatedly: each element is set up once. */
export function init(root?: ParentNode | Element): void;

export const mode: {
  /** The mode the page shows now. */
  readonly current: Mode;
  /** The stored choice; "system" follows the OS. */
  readonly preference: ModePreference;
  set(value?: ModePreference, options?: { persist?: boolean }): Mode;
  toggle(): Mode;
};

export const theme: {
  /** Active theme id; "museum" when none is set. */
  readonly current: string;
  /** Apply a theme, loading `themes/<id>.css` next to forma.css when it isn't loaded yet. */
  set(id: string | null, options?: { base?: string | URL; persist?: boolean }): Promise<void>;
  restore(options?: { base?: string | URL }): Promise<void> | undefined;
};

export const dialog: {
  open(idOrEl: string | HTMLDialogElement): HTMLDialogElement | null;
  close(idOrEl: string | HTMLDialogElement, returnValue?: string): HTMLDialogElement | null;
};

export interface ConfirmOptions { title?: string; text?: string; confirmLabel?: string; cancelLabel?: string; danger?: boolean }
/** A native <dialog> confirmation. Resolves true when confirmed. */
export function confirm(options?: ConfirmOptions): Promise<boolean>;

/** Place a fixed panel next to an anchor (RTL-aware), flipping and shifting to stay on screen. */
export function position(panel: HTMLElement, anchor: Element | null, options?: { placement?: Placement; offset?: number; x?: number; y?: number }): void;

export function menu(el: HTMLElement): void;
export function tooltip(el: HTMLElement): void;

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export interface ToastOptions {
  type?: ToastType;
  title?: string;
  /** Inserted as text, never as HTML. */
  text?: string;
  message?: string;
  /** Milliseconds; 0 keeps it until dismissed. Default 5000 (8000 for errors). */
  duration?: number;
  action?: { label: string; onClick?: () => void };
  position?: 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';
  dismissible?: boolean;
}
export interface ToastHandle { el: HTMLElement; dismiss(): void }
export const toast: {
  (options: ToastOptions | string): ToastHandle;
  success(title: string, text?: string, options?: ToastOptions): ToastHandle;
  error(title: string, text?: string, options?: ToastOptions): ToastHandle;
  warning(title: string, text?: string, options?: ToastOptions): ToastHandle;
  info(title: string, text?: string, options?: ToastOptions): ToastHandle;
};

export function command(dialog: HTMLDialogElement): void;

export function tabs(root: HTMLElement): { select(index: number, focus?: boolean): void } | undefined;

type Message = string | ((el: HTMLInputElement) => string);
export interface ValidationMessages {
  valueMissing: Message; typeMismatch: { email: string; url: string; _: string }; tooShort: Message; tooLong: Message;
  rangeUnderflow: Message; rangeOverflow: Message; patternMismatch: Message; stepMismatch: Message; badInput: Message;
  mismatch: Message; summary: (n: number) => string; strength: string[];
}
export const validate: {
  /** Constraint-API validation with inline messages and an error summary. Emits `forma:valid` / `forma:invalid`. */
  (form: HTMLFormElement): void;
  /** Force a message locale; default is <html lang>. */
  locale: string | null;
  /** Message tables by language. Add your own: `Forma.validate.messages.de = {...}`. */
  messages: Record<string, ValidationMessages>;
};

export function wizard(root: HTMLElement): { next(): void; prev(): void; go(index: number): void; readonly index: number } | undefined;
export function combobox(root: HTMLElement): { readonly value: string | string[] | undefined } | undefined;
export function datepicker(root: HTMLElement, options?: { locale?: string; weekStart?: number; range?: boolean; min?: string; max?: string; value?: string }): { readonly value: string | undefined; set(date: Date): void } | undefined;
export function formatBytes(bytes: number, locale?: string): string;

export function table(table: HTMLTableElement): void;
export function tree(root: HTMLElement): void;
export function kanban(board: HTMLElement): void;
export interface CalendarEvent { /** YYYY-MM-DD */ date: string; title: string; tone?: string; href?: string }
export function calendar(root: HTMLElement, options?: { locale?: string; weekStart?: number; month?: string; events?: CalendarEvent[] }): { setEvents(events: CalendarEvent[]): void };
export function toc(nav: HTMLElement, options?: { headings?: string }): void;

export interface ChartSeries { name: string; values: number[]; color?: string }
export interface ChartOptions {
  type?: 'line' | 'area' | 'bar' | 'donut' | 'gauge';
  labels?: string[];
  series?: ChartSeries[];
  /** Number pattern: "0" (integer), "0.0" (one decimal), "0.0'%'" (with a suffix), or a formatter function. */
  format?: string | ((value: number) => string);
  locale?: string;
  title?: string;
  summary?: string;
  center?: string; centerLabel?: string;
  value?: number; label?: string; warn?: number | null; danger?: number | null;
  height?: number;
}
export function chart(el: HTMLElement, options?: ChartOptions): { update(next: Partial<ChartOptions>): void } | undefined;
export function sparkline(svg: SVGSVGElement, values?: number[]): void;

export interface ChatApi {
  /** `text` is inserted as text. `html` is for trusted, already-sanitised markup only. */
  add(message: { role?: 'user' | 'assistant'; text?: string; html?: string; name?: string }): HTMLElement;
  thinking(label?: string): { done(): void };
  stream(source: string | AsyncIterable<string>, options?: { speed?: number }): Promise<HTMLElement>;
  clear(): void;
}
export function chat(root: HTMLElement): ChatApi;

export function copy(text: string): Promise<boolean>;
/** Speak a message through the shared live region. */
export function announce(text: string, politeness?: 'polite' | 'assertive'): void;

/** Events are dispatched as `forma:<name>` CustomEvents that bubble. */
export interface FormaEventMap {
  'forma:open': CustomEvent<undefined>;
  'forma:mode': CustomEvent<{ mode: Mode; preference: ModePreference }>;
  'forma:theme': CustomEvent<{ theme: string }>;
  'forma:tab': CustomEvent<{ index: number; tab: HTMLElement }>;
  'forma:select': CustomEvent<{ item: HTMLElement; value?: string }>;
  'forma:change': CustomEvent<{ value: unknown }>;
  'forma:toggle': CustomEvent<{ pressed: boolean }>;
  'forma:move': CustomEvent<{ card: HTMLElement; from?: HTMLElement; to: HTMLElement }>;
  'forma:valid': CustomEvent<Record<string, never>>;
  'forma:invalid': CustomEvent<{ fields: HTMLElement[] }>;
  'forma:submit': CustomEvent<{ text: string }>;
}

declare global {
  interface Window { Forma: typeof import('./forma'); }
  interface HTMLElementEventMap extends FormaEventMap {}
}
