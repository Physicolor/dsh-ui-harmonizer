/**
 * `SettingsGeneralRow` — the "界面定制" block registered in Settings → General.
 *
 * Layer: self (this plugin's own knobs). The row/control shells it composes come
 * from `harness/controls/*`; the labels come from `i18n.ts` so a language switch
 * re-reads them. Every control is a MODULE-LEVEL constant — never defined inline
 * here — so React keeps its identity across renders.
 */
import * as React from 'react';
import type { EnhancerSurfaceProps } from './surface-props.ts';
/**
 * The interface customization block: chat width, sidebar size, font family,
 * font scope and the right-panel glide.
 * @param props.state - the shared enhancer state.
 * @param props.onApply - patch applier (mutates shared state + re-applies CSS).
 * @param props.presets - font preset table handed to the selector.
 * @returns the column of rows.
 */
export declare function SettingsGeneralRow({ state, onApply, presets }: EnhancerSurfaceProps): React.ReactElement;
