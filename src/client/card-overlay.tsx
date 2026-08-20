/**
 * Harness UI Enhancer — rounded center-column card overlay.
 *
 * Other than a left sidebar, DeepSeek Harness's main content area is a flat
 * `--dsw-alias-bg-base` fill with no real card surface, separated only by the
 * neighbors' hairline borders. This component adds the "rounded card" chrome
 * the user asked for, non-invasively, without touching any harness source:
 *
 *  - A passive overlay (shell.overlay, pointer-events:none) that tracks the
 *    center column's box and paints a top border + top-left rounded corner +
 *    drop shadow. The shadow bleeds LEFT over the sidebar (the card's depth)
 *    and into a 1px top shim; right/bottom stay flush to the window (natural
 *    boundaries). No left border is drawn — the sidebar's own right hairline
 *    is the card's left edge.
 *  - The content's square top-left corner is rounded by giving the center
 *    column a border-radius (its existing overflow:hidden masks the corner);
 *    that rule lives in enhancer.module.css so the mask and the chrome share
 *    one radius source.
 *
 * Visibility is controlled purely by the `enhc-center-card-on` class on
 * <html> (flipped by applyState from the Settings toggle), so the component
 * stays mounted for cheap geometry tracking and a class flip turns its paint
 * on/off with zero re-render. All side effects are owned by the fiber.
 */

import * as React from 'react'

/** The overlay's top edge sits 1px below the page top so the drop shadow has
 * room to render inside the viewport (a flush top would clip it). */
const TOP_SHIM = 1

/** Resolution of the fixed overlay: left/top/width/height of the center column. */
interface CardBox {
  left: number
  top: number
  width: number
  height: number
}

/**
 * Find the center column element. The AppFrame wraps the conversation slot in
 * `div.centerCol`, and the slot outlet (whose wrapper is display:contents) is
 * its direct DOM child — a stable, hash-independent seam.
 * @returns the center column element, or null if not yet mounted.
 */
function findCenterColumn(): HTMLElement | null {
  const slot = document.querySelector('[data-slot="conversation"]')
  if (slot === null || slot === undefined) return null
  const parent = slot.parentElement
  if (parent === null || parent === undefined) return null
  return parent
}

/**
 * Passive rounded-card chrome overlay. Renders a transparent box aligned to
 * the center column; the actual border/corner/shadow come from
 * `.enhc-center-card` in enhancer.module.css, gated by the root class.
 * Geometry tracks the column via ResizeObserver (fires on sidebar drag /
 * collapse, details open-close, window resize) plus a slow settle poll so a
 * transition-ended layout still lands correctly.
 */
export function CenterColCard(): React.ReactElement {
  const [box, setBox] = React.useState<CardBox | null>(null)

  React.useEffect(() => {
    const col = findCenterColumn()
    if (col === null || col === undefined) return
    let timer: number | null = null
    const measure = (): void => {
      const r = col.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        setBox({ left: r.left, top: r.top, width: r.width, height: r.height })
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(col)
    window.addEventListener('resize', measure)
    // The product eases column tracks (0.3s): a settle poll re-measures after
    // the transition so the overlay never lags a drag-release settle.
    timer = window.setInterval(measure, 400)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      if (timer !== null) window.clearInterval(timer)
    }
  }, [])

  if (box === null) return React.createElement('div', { className: 'enhc-center-card' })
  return React.createElement('div', {
    className: 'enhc-center-card',
    style: {
      position: 'absolute',
      left: box.left,
      top: box.top + TOP_SHIM,
      width: box.width,
      height: box.height - TOP_SHIM,
      pointerEvents: 'none',
    },
  })
}
