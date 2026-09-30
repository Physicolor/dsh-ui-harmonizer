/**
 * `SettingsRow` — the official settings-row skeleton.
 *
 * Layer: harness (copied from the product's settings pages): title and
 * description stacked on the left with a 48px right gutter, the control in a
 * `flex: none` box capped at 60% width, and the row's closing hairline. The
 * tokens are the product's own, so the row reads as native on any page it is
 * injected into.
 */

import * as React from 'react'

/**
 * One settings row: title + description on the left, control on the right.
 * @param props.title - row label.
 * @param props.desc - one-line explanation under the label.
 * @param props.control - the control element rendered on the right.
 * @returns the row element.
 */
export function SettingsRow({ title, desc, control }: {
  title: string
  desc: string
  control: React.ReactNode
}): React.ReactElement {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '16px 0', borderBottom: '1px solid var(--dsw-alias-border-l2)' } }, [
    React.createElement('div', { key: 'text', style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 48 } }, [
      React.createElement('div', { key: 'title', style: { fontSize: 14, lineHeight: '22px', color: 'var(--dsw-alias-label-primary)' } }, title),
      React.createElement('div', { key: 'desc', style: { fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary)' } }, desc),
    ]),
    React.createElement('div', { key: 'control', style: { flex: 'none', maxWidth: '60%', minWidth: 0 } }, control),
  ])
}
