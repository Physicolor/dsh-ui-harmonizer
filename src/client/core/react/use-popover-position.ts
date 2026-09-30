/**
 * `usePopoverPosition` — fixed-coordinate placement for a menu opened from a trigger.
 *
 * Layer: core (infrastructure, React). Extracted verbatim from the inline
 * geometry `FontSelector` computed in its click handler; the numbers are the
 * product's own menu behaviour (218px min width, 12px viewport margin, 40px
 * rows plus 2px of padding), so this is a recipe, not a knob.
 *
 * It only COMPUTES: the caller hands the returned object to the menu's style.
 */

import * as React from 'react'

/** A resolved fixed placement for the popover. */
export interface PopoverPosition {
  left: number
  top: number
  maxHeight: number
}

/* Product menu metrics: min width, the viewport margin the menu keeps, the
   per-row height and the 2px of vertical padding inside the sheet. */
const MIN_WIDTH = 218
const VIEWPORT_MARGIN = 12
const ROW_HEIGHT = 40
const SHEET_PADDING = 2

/**
 * Place a `position: fixed` menu under (or above) the clicked trigger.
 *
 * Always returns a fresh object, so the caller can call it on every open and
 * store the result in state; `null` is never returned (the caller only asks
 * while opening).
 * @param trigger - the element that was clicked (its rect anchors the menu).
 * @param rowCount - number of rows the menu will carry, for the height estimate.
 * @returns the fixed left/top and the available max height.
 */
export function computePopoverPosition(trigger: HTMLElement, rowCount: number): PopoverPosition {
  const rect = trigger.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const estHeight = SHEET_PADDING * 2 + rowCount * ROW_HEIGHT + 2
  const openDown = rect.bottom + 4 + estHeight <= vh - VIEWPORT_MARGIN
  return {
    left: Math.min(Math.max(rect.right - MIN_WIDTH, VIEWPORT_MARGIN), vw - MIN_WIDTH - VIEWPORT_MARGIN),
    top: openDown ? rect.bottom + 4 : rect.top - estHeight - 4,
    maxHeight: vh - VIEWPORT_MARGIN * 2,
  }
}

/**
 * State holder for the placement above: `null` until the menu is opened, and
 * the last resolved placement thereafter (it is intentionally NOT recomputed on
 * scroll or resize — the menu closes on pointerdown elsewhere).
 * @returns the current position and its setter.
 */
export function usePopoverPosition(): [PopoverPosition | null, (next: PopoverPosition | null) => void] {
  return React.useState<PopoverPosition | null>(null)
}
