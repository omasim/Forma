import type * as React from 'react';
import type * as FormaApi from '../types/forma';
import type { ChartOptions, ModePreference } from '../types/forma';

export const Forma: typeof FormaApi;
export function useFormaTheme(options?: { theme?: string | null; mode?: ModePreference }): void;
export function FormaProvider(props: { theme?: string | null; mode?: ModePreference; children?: React.ReactNode }): React.ReactNode;
export function useForma(ref: React.RefObject<HTMLElement | null>): typeof FormaApi;
type ShortName<K> = K extends `forma:${infer N}` ? N : never;
export type FormaEventName = ShortName<keyof FormaApi.FormaEventMap>;
export function useFormaEvent<N extends FormaEventName>(ref: React.RefObject<HTMLElement | null>, name: N, handler: (event: FormaApi.FormaEventMap[`forma:${N}`]) => void): void;
export function Chart(props: Omit<ChartOptions, 'type'> & { type?: ChartOptions['type']; className?: string } & Omit<React.HTMLAttributes<HTMLElement>, 'title'>): React.ReactElement;
export function Icon(props: { name: string; sprite?: string; label?: string; className?: string } & React.SVGAttributes<SVGSVGElement>): React.ReactElement;
export function useDialog(id: string): () => void;
export const toast: typeof FormaApi.toast;
export const confirm: typeof FormaApi.confirm;
