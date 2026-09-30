/**
 * `FontSelector` — this plugin's own font-preset picker.
 *
 * Layer: self (the options are OUR `FONT_PRESETS`, not a product control) and
 * the only reason it is not in `harness/`: nothing here is transcribed from the
 * product except the selector-pill look, which the class-free inline styles
 * below reproduce. The pill's geometry is a deliberate copy of the official
 * selector pill; re-check it when the product's control language changes.
 *
 * Two behaviours that must not be "simplified" without re-measuring:
 * - the local mirror (via `useMirrored`) so the pill label updates immediately
 *   on pick, with external changes adopted by the effect;
 * - the installed-font probe, which greys a preset whose family is absent.
 */

import * as React from 'react'
import { getPresetLabel } from '../../core/state-model.ts'
import { isFamilyInstalled } from '../../core/dom/font-probe.ts'
import { computePopoverPosition, usePopoverPosition } from '../../core/react/use-popover-position.ts'
import { useMirrored } from '../../core/react/use-mirrored.ts'
import { CHEVRON_PATH, CHECK_PATH } from '../../harness/controls/icon-paths.ts'
import { getFontMissingLabel } from '../../core/i18n.ts'
import type { FONT_PRESETS } from '../font-presets.ts'

/**
 * Custom font selector: product selector-pill button + fixed menu.
 * Holds a local mirror of the selected id so the pill label updates
 * immediately on pick; external changes are adopted via the effect.
 * @param props.value - the persisted preset id.
 * @param props.onChange - called with the picked preset id.
 * @param props.presets - the preset table to list.
 * @returns the trigger pill and, while open, its menu.
 */
export function FontSelector({ value, onChange, presets }: {
  value: string
  onChange: (id: string) => void
  presets: Readonly<typeof FONT_PRESETS>
}): React.ReactElement {
  const [local, setLocal] = useMirrored(value)
  const [open, setOpen] = React.useState(false)
  const [pos, setPos] = usePopoverPosition()
  const wrapRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent): void => {
      if (wrapRef.current !== null && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent): void => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = presets.find(p => p.id === local) ?? presets[0]
  const selectedLabel = getPresetLabel(selected.id)
  const toggle = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!open) setPos(computePopoverPosition(e.currentTarget, presets.length))
    setOpen(v => !v)
  }

  const pillStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 12, height: 36, padding: '0 14px',
    border: 'none', borderRadius: 18, background: 'var(--dsw-alias-bg-module-platform)',
    font: 'inherit', fontSize: 14, lineHeight: '22px', color: 'var(--dsw-alias-label-primary)',
    cursor: 'pointer', whiteSpace: 'nowrap', maxWidth: '100%',
  }
  const menuStyle: React.CSSProperties = {
    position: 'fixed', zIndex: 1100, boxSizing: 'border-box', minWidth: 218, maxWidth: 360,
    padding: 4, display: 'flex', flexDirection: 'column',
    border: '1px solid var(--dsw-alias-border-inverted)', borderRadius: 12,
    background: 'var(--dsw-specific-menu)', boxShadow: 'var(--dsw-shadow-lv3)',
    ...pos,
  }
  const itemStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 40,
    padding: '8px 10px', border: 'none', borderRadius: 10, background: 'transparent',
    cursor: 'pointer', fontSize: 14, lineHeight: '22px', color: 'var(--dsw-alias-label-primary)',
    textAlign: 'left',
  }
  const checkIcon = React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', style: { flex: 'none' } },
    React.createElement('path', { d: CHECK_PATH, fill: 'currentColor' }))

  return React.createElement('div', { ref: wrapRef, style: { position: 'relative', display: 'inline-flex', maxWidth: '100%' } }, [
    React.createElement('button', {
      type: 'button',
      style: open ? { ...pillStyle, background: 'var(--dsw-alias-interactive-bg-hover)' } : pillStyle,
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      onClick: toggle,
      key: 'trigger',
    }, [
      React.createElement('span', { key: 'label', style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 } }, selectedLabel),
      React.createElement('svg', { key: 'chevron', width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', style: { flex: 'none', color: 'var(--dsw-alias-label-tertiary)' } },
        React.createElement('path', { d: CHEVRON_PATH, fill: 'currentColor' })),
    ]),
    open && pos !== null
      ? React.createElement('div', { key: 'menu', role: 'menu', style: { ...menuStyle, maxHeight: pos.maxHeight, overflowY: 'auto' } },
        presets.map(p => React.createElement('button', {
          key: p.id, type: 'button', role: 'menuitem',
          style: itemStyle,
          onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'var(--dsw-alias-interactive-bg-hover)' },
          onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'transparent' },
          onClick: () => { setLocal(p.id); setOpen(false); onChange(p.id) },
        }, [
          React.createElement('span', { key: 'label', style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, getPresetLabel(p.id)),
          p.probe !== null && !isFamilyInstalled(p.probe)
            ? React.createElement('span', {
              key: 'missing',
              title: p.probe,
              style: { flex: 'none', fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary)' },
            }, getFontMissingLabel())
            : null,
          p.id === local ? React.createElement('span', { key: 'check', style: { flex: 'none' } }, checkIcon) : null,
        ])))
      : null,
  ])
}
