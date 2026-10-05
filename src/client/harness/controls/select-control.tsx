/**
 * `SelectControl` — the product's own Select, RENDERED BY THE PRODUCT'S OWN CODE.
 *
 * Layer: harness. This plugin does not re-implement the control: it calls
 * `Menu` from `@deepseek-ai/dsh-client-ui-primitives`, exactly as the product's
 * settings rows do. That is what makes the popup the real thing — the portalled
 * translucent surface, the check on the chosen row, the arrow walk, Escape,
 * outside-dismiss and focus return all come from the shipped component, so they
 * cannot drift from the product's.
 *
 * THE OFFICIAL CALL SITE this mirrors (extracted from the app bundle,
 * `@deepseek-ai/dsh-client-ui-permission-presets/lib/client.js`, `PermissionRow` —
 * the 权限 row in Settings → General):
 *
 *   Menu({ open, onClose, items: options.map(o => ({ id: o.id, label })),
 *          selectedId, onSelect, align: 'end', portal: true,
 *          anchor: <button className={styles.selector} aria-haspopup="menu"
 *                          aria-expanded={open} onClick={toggle}>
 *                    {label}<IconChevronDownOutlineRegular className={styles.chevron}/>
 *                  </button> })
 *
 * The anchor's classes are the product's own trigger recipe, transcribed in
 * `self/settings-controls.module.css` and verified against the live DOM by
 * `scripts/probes/settings/verify-select-parity.mjs` (36px, radius 12,
 * `--dsw-alias-bg-module-platform`, no border, padding 0 14, gap 12, 14px/22px).
 *
 * REPLACED 2026-09-30: the previous version hand-built the surface, its material
 * layer, the rows and the check from measured CSSOM values. It matched the
 * product's numbers but was still a re-implementation — and the product's own
 * `Menu` was importable all along (the loader's frozen platform table resolves
 * `@deepseek-ai/dsh-client-ui-primitives`; `@omdsh-dev/dsh-genui` has required it
 * from its bundle since v0.1). The rule this file now follows: never rebuild a
 * product control, render the product's component.
 */

import * as React from 'react'
import { IconChevronDownOutlineRegular, Menu, type MenuItem } from '@deepseek-ai/dsh-client-ui-primitives'
import { useMirrored } from '../../core/react/use-mirrored.ts'

/** One row of a {@link SelectControl}. */
export interface SelectOption<T extends string> {
  /** Value written on pick. */
  id: T
  /** Row text, also the trigger's text while this option is the value. */
  label: string
  /** Optional trailing hint (e.g. "未安装" for an absent font family). */
  note?: string
}

/**
 * A controlled single-choice dropdown in the product's own Select language.
 *
 * Holds a local mirror of the value so the trigger's text updates on pick even
 * when the parent mutates its state in place (same reason `SwitchControl` does);
 * external value changes are adopted via the effect.
 * @param props.options - the rows, in display order.
 * @param props.value - the persisted id.
 * @param props.onChange - called with the picked id.
 * @param props.ariaLabel - accessible name for the trigger (the row's title).
 * @returns the trigger and, while open, the product's Menu surface.
 */
export function SelectControl<T extends string>({ options, value, onChange, ariaLabel }: {
  options: readonly SelectOption<T>[]
  value: T
  onChange: (id: T) => void
  ariaLabel?: string
}): React.ReactElement {
  const [local, setLocal] = useMirrored(value)
  const [open, setOpen] = React.useState(false)
  const selected = options.find(o => o.id === local) ?? options[0]
  /* The product's rows take one label node; an absent font family is appended to
   * the text rather than styled, because the row's own markup is not ours. */
  const items: MenuItem[] = options.map(o => ({
    id: o.id,
    label: o.note === undefined ? o.label : `${o.label} · ${o.note}`,
  }))

  return Menu({
    open,
    items,
    selectedId: local,
    align: 'end',
    portal: true,
    onSelect: (id) => { setOpen(false); setLocal(id as T); onChange(id as T) },
    onClose: () => { setOpen(false) },
    anchor: React.createElement('button', {
      type: 'button',
      className: 'uitw-select',
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      'aria-label': ariaLabel,
      onClick: () => { setOpen(v => !v) },
    }, [
      React.createElement('span', { key: 'label', className: 'uitw-select-label' }, selected?.label ?? ''),
      React.createElement(IconChevronDownOutlineRegular, { key: 'chevron', className: 'uitw-select-chevron' }),
    ]),
  })
}
