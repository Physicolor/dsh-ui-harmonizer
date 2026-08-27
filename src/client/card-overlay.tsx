/**
 * Harness UI Enhancer — rounded center-column card overlay.
 *
 * Other than a left sidebar, DeepSeek Harness's main content area is a flat
 * `--dsw-alias-bg-base` fill with no real card surface, separated only by the
 * neighbors' hairline borders. This component adds the "rounded card" chrome
 * the user asked for, non-invasively, without touching any harness source.
 *
 * Wrapped-card model (v0.8.0): the AppFrame's shell.overlay outlet is ITSELF
 * a stacking context (`z-index:20; position:absolute; inset:0`), so nothing
 * registered inside it can ever out-paint the session header (raised to 21 to
 * mask the widgets rail). Instead of fighting layers, the card is split by
 * painting surface:
 *
 * - The SESSION HEADER (the highest relevant element, z-21) carries the
 *   card's top edge while it exists: border-top + the 14px top-left radius,
 *   styled in enhancer.module.css under the card-on root class — so the card
 *   visibly WRAPS the header at zero pixel cost, and nothing can hide it.
 * - This overlay becomes a pure SHADOW CASTER in that mode: one transparent
 *   box spanning header + content (from the column's own top) casting
 *   --dsw-shadow-lv3, whose fringes read as the card's elevation, including
 *   the left bleed over the sidebar. No border/radius → no doubled lines,
 *   and the header never clips the shadow (it paints above it like content).
 * - Routes without a session header (e.g. trajectory) fall back to this box
 *   drawing the classic self-contained card: border-top + radius + shadow.
 *
 * Visibility is controlled purely by the `enhc-center-card-on` class on
 * <html> (flipped by applyState from the Settings toggle), so the component
 * stays mounted for cheap geometry tracking and a class flip turns its paint
 * on/off with zero re-render. All side effects are owned by the fiber.
 */

import * as React from 'react'

/** The overlay's top edge sits 1px below the column top so the drop shadow has
 * room to render inside the viewport (a flush top would clip it). */
const TOP_SHIM = 1

/** Resolution of the fixed overlay: geometry plus which paint mode applies. */
interface CardBox {
  left: number
  top: number
  width: number
  height: number
  /** Session header present → the header owns border+radius, we cast shadow only. */
  wrapped: boolean
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
 * the center column; what it paints (full card vs. shadow only) comes from
 * `.enhc-center-card` / `.enhc-center-card-wrapped` in enhancer.module.css,
 * gated by the root class. Geometry tracks the column via ResizeObserver
 * (fires on sidebar drag / collapse, details open-close, window resize) plus
 * a slow settle poll so a transition-ended layout still lands correctly. The
 * wrapped flag re-evaluates on every measure so route switches (conversation
 * ↔ trajectory) flip the paint mode within ≤400ms without extra observers.
 */
export function CenterColCard(): React.ReactElement {
  const [box, setBox] = React.useState<CardBox | null>(null)

  React.useEffect(() => {
    const col = findCenterColumn()
    if (col === null || col === undefined) return
    let timer: number | null = null
    const measure = (): void => {
      const r = col.getBoundingClientRect()
      const wrapped = document.querySelector("[data-slot='conversation.session.header'] > header") !== null
      if (r.width > 0 && r.height > 0) {
        setBox({ left: r.left, top: r.top, width: r.width, height: r.height, wrapped })
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
    className: box.wrapped ? 'enhc-center-card enhc-center-card-wrapped' : 'enhc-center-card',
    style: {
      position: 'absolute',
      left: box.left,
      top: box.top + TOP_SHIM,
      width: box.width,
      height: Math.max(box.height - TOP_SHIM, 0),
      pointerEvents: 'none',
    },
  })
}
