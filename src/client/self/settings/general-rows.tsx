/**
 * `SettingsGeneralRow` — the "界面定制" block registered in Settings → General.
 *
 * Layer: self (this plugin's own five knobs). The row/control shells it
 * composes come from `harness/controls/*`; the labels come from `i18n.ts` so a
 * language switch re-reads them. Every control is a MODULE-LEVEL constant —
 * never defined inline here — so React keeps its identity across renders.
 */

import * as React from 'react'
import type { FontScope } from '../../core/state-model.ts'
import { SettingsRow } from '../../harness/controls/settings-row.tsx'
import { StepperControl } from '../../harness/controls/stepper-control.tsx'
import { SwitchControl } from '../../harness/controls/switch-control.tsx'
import { SegmentedControl } from '../../harness/controls/segmented-control.tsx'
import { FontSelector } from './font-selector.tsx'
import type { EnhancerSurfaceProps } from './surface-props.ts'
import {
  getRowWidthTitle, getRowWidthDesc,
  getRowSidebarSizeTitle, getRowSidebarSizeDesc,
  getRowFontTitle, getRowFontDesc,
  getRowCardTitle, getRowCardDesc,
  getScopeTitle, getScopeDesc, getScopeContentLabel, getScopeUiLabel,
} from '../../core/i18n.ts'

/**
 * The interface customization block: chat width, sidebar size, font family,
 * font scope and the center-column card toggle.
 * @param props.state - the shared enhancer state.
 * @param props.onApply - patch applier (mutates shared state + re-applies CSS).
 * @param props.presets - font preset table handed to the selector.
 * @returns the column of rows.
 */
export function SettingsGeneralRow({ state, onApply, presets }: EnhancerSurfaceProps): React.ReactElement {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column' } }, [
    React.createElement(SettingsRow, {
      key: 'width',
      title: getRowWidthTitle(),
      desc: getRowWidthDesc(),
      control: React.createElement(StepperControl, {
        min: 640, max: 1000, step: 4, value: state.width, unit: 'px',
        onChange: (v) => { onApply({ width: v }) },
      }),
    }),
    React.createElement(SettingsRow, {
      key: 'sidebar',
      title: getRowSidebarSizeTitle(),
      desc: getRowSidebarSizeDesc(),
      control: React.createElement(StepperControl, {
        min: 12, max: 20, step: 1, value: state.sidebarSize, unit: 'px',
        onChange: (v) => { onApply({ sidebarSize: v }) },
      }),
    }),
    React.createElement(SettingsRow, {
      key: 'font-family',
      title: getRowFontTitle(),
      desc: getRowFontDesc(),
      control: React.createElement(FontSelector, {
        value: state.fontId,
        presets,
        onChange: (v) => { onApply({ fontId: v }) },
      }),
    }),
    React.createElement(SettingsRow, {
      key: 'font-scope',
      title: getScopeTitle(),
      desc: getScopeDesc(),
      control: React.createElement(SegmentedControl<FontScope>, {
        options: [
          { id: 'content', label: getScopeContentLabel() },
          { id: 'ui', label: getScopeUiLabel() },
        ],
        value: state.fontScope,
        onChange: (v) => { onApply({ fontScope: v }) },
      }),
    }),
    React.createElement(SettingsRow, {
      key: 'center-card',
      title: getRowCardTitle(),
      desc: getRowCardDesc(),
      control: React.createElement(SwitchControl, {
        checked: state.card,
        onChange: (v) => { onApply({ card: v }) },
      }),
    }),
  ])
}
