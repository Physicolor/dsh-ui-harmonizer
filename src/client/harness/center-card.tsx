/**
 * `CenterColCard` — rounded center-column card overlay.
 *
 * Layer: harness (it aligns itself to DSH's own center column via
 * `./anchors.ts`; the target is the product's layout, not our own UI).
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
 *   `--dsw-shadow-lv3`, whose fringes read as the card's elevation, including
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
import { TOP_SHIM, findCenterColumn } from './anchors.ts'

/**
 * HOW THE LONG-LIVED 1Hz POLL WAS RETIRED (removed 2026-09-30), and why no
 * replacement is needed.
 *
 * The overlay used to run `setInterval(measure, 1000)` for the whole life of
 * the session: an unconditional wake-up that read `getBoundingClientRect()` on
 * the center column — a forced layout of the AppFrame — every second, on every
 * page, forever, including while the tab was hidden or the card's paint was
 * switched off. It was defended as "belt and braces for layout changes no
 * observer reports", but that set is empty for this box:
 *
 *   - size changes of the column itself → ResizeObserver (`onResize`);
 *   - viewport changes → `window.resize` (`schedule`);
 *   - the product's 0.3s column-track ease → `transitionrun` / `transitionend`
 *     / `transitioncancel` on the frame, which set the cheap `animating` path
 *     and do the full re-anchor when the ease ends;
 *   - left/top drift with no size change → an ancestor reflow, i.e. a layout
 *     change of a boxed-in element, which is always accompanied by a size
 *     change of at least one ancestor this observer is attached to (the center
 *     column is sized by the same grid track that moves it), so the observer
 *     fires there too.
 *
 * A poll that samples once a second also cannot be correct for a sub-second
 * reflow, so it was strictly worse than the event paths: it burned a forced
 * re-layout per second to hide, at best, a fraction of the cases it promised to
 * catch. If a safety net is ever wanted here, drive it from those same events
 * (a few reads after `transitionend`) — never from a clock that outlives the
 * gesture.
 */

/**
 * Passive rounded-card chrome overlay. Renders a transparent box aligned to
 * the center column; what it paints (full card vs. shadow only) comes from
 * `.enhc-center-card` / `.enhc-center-card-wrapped` (see
 * `self/center-card-overlay.module.css`), gated by the root class.
 *
 * Geometry tracking is deliberately free of per-frame React work and of
 * per-frame forced layout (measured 2026-09-17):
 *
 * - The box is a ref'd, always-mounted div. Every geometry update writes
 *   `left/top/width/height` straight to `element.style`, and the `-wrapped`
 *   paint mode flips through `classList` — no `setState`, so a ResizeObserver
 *   burst during the product's 0.3s column-track ease cannot re-render the
 *   overlay at animation cadence.
 * - The shell animates its column track with `grid-template-columns` on the
 *   AppFrame, i.e. a LAYOUT property: while that transition runs, every
 *   `getBoundingClientRect()` forces a full re-layout of the frame. The
 *   ResizeObserver entry already carries the new content box, so during a
 *   track transition the width/height come from `entry.contentRect` (free)
 *   and the box rides the animation without a single forced reflow. Only
 *   after `transitionend` does a full read re-anchor left/top.
 * - The header probe that decides `wrapped` is cached in a closure variable
 *   and re-evaluated on the (rare) full read, not per frame.
 *
 * Measured before the observer-based tracking, on a 1578x846 viewport with a
 * long conversation loaded, one right-sidebar toggle cost 8 RO callbacks /
 * 55-58ms of the 0.3s animation window plus 8 React renders; the same
 * callback cost 172ms over 18 callbacks on a left-sidebar toggle.
 *
 * PREMISE FOR WRITING DOM DIRECTLY (explicit, do not break): every geometry
 * update below writes `box.style.left/top/width/height` (and flips the
 * `enhc-center-card-wrapped` class) on a node React rendered. That is only safe
 * because of two facts held together:
 *
 *   1. this component never re-renders — no state, no props, no context — so
 *      the effect runs once per mount and React never reconciles the node
 *      again, and
 *   2. the `style` prop passed to `React.createElement` carries ONLY
 *      `position` and `pointerEvents` (the static part React owns). Geometry
 *      properties must never be added to that object: React writes the style
 *      prop on commit, and any future re-render would then restore the props'
 *      values and wipe the measured geometry.
 *
 * If a re-render ever becomes necessary here, geometry tracking has to move to
 * state (or into an inner element React does not own).
 * @returns the always-mounted transparent overlay box.
 */
export function CenterColCard(): React.ReactElement {
  const boxRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const box = boxRef.current
    if (box === null) return
    const col = findCenterColumn()
    if (col === null || col === undefined) return
    // The frame owns the animated grid track; its `transitionrun/end` events
    // tell us when a geometry read would force a re-layout of the whole shell.
    const frame = col.closest('[class$="_frame"]')
    // "Session header present" = the card must wrap it instead of drawing its
    // own top edge. The product moved the header out of the
    // `conversation.session.header` slot (that node is now `display: contents`
    // and the header is its PARENT), so the old child selector matched nothing
    // and this probe reported `false` forever — the chrome stayed in self-drawn
    // mode while a real header sat on top of it. Anchor on the parent slot, and
    // keep the wrapped test on the tab strip: it exists only on a session
    // header, which is what the old slot presence meant (the blank/sessionless
    // header stays on the self-drawn path).
    const headerSelector = "[data-slot='conversation.header'] > header:has([class$='_tabs']), [data-slot='conversation.session.header'] > header"
    let animating = false
    let frameHandle = 0
    /** Last full-read geometry; the cheap path keeps left/top from here. */
    const anchor = { left: 0, top: 0 }
    /** Cached `wrapped` mode; null until the first probe. */
    let wrapped: boolean | null = null

    const paint = (left: number, top: number, width: number, height: number): void => {
      if (!(width > 0) || !(height > 0)) return
      anchor.left = left
      anchor.top = top
      box.style.left = `${left}px`
      box.style.top = `${top + TOP_SHIM}px`
      box.style.width = `${width}px`
      box.style.height = `${Math.max(height - TOP_SHIM, 0)}px`
    }
    const syncWrapped = (): void => {
      const next = document.querySelector(headerSelector) !== null
      if (next === wrapped) return
      wrapped = next
      box.classList.toggle('enhc-center-card-wrapped', next)
    }
    /** Full read: forces layout, so it only runs while no track ease is live. */
    const measure = (): void => {
      frameHandle = 0
      const r = col.getBoundingClientRect()
      syncWrapped()
      paint(r.left, r.top, r.width, r.height)
    }
    const schedule = (): void => {
      if (frameHandle !== 0 || animating) return
      frameHandle = window.requestAnimationFrame(measure)
    }
    const onResize = (entries: ResizeObserverEntry[]): void => {
      const entry = entries[entries.length - 1]
      if (animating && entry !== undefined) {
        // Free path: `contentRect` is the observer's own measurement, so the
        // box tracks the easing column with zero forced re-layout. left/top
        // are stable across a track ease (only the track's width moves).
        paint(anchor.left, anchor.top, entry.contentRect.width, entry.contentRect.height)
        return
      }
      schedule()
    }
    // Typed as `Event`, not `TransitionEvent`: an Element's addEventListener
    // overload takes the BASE listener type (a narrower parameter fails the
    // overload with TS2769), so the transition event is asserted at use.
    const onTransitionRun = (event: Event): void => {
      if ((event as TransitionEvent).propertyName === 'grid-template-columns') animating = true
    }
    const onTransitionDone = (event: Event): void => {
      if ((event as TransitionEvent).propertyName !== 'grid-template-columns') return
      animating = false
      measure()
    }

    measure()
    const observer = new ResizeObserver(onResize)
    observer.observe(col)
    window.addEventListener('resize', schedule)
    frame?.addEventListener('transitionrun', onTransitionRun)
    frame?.addEventListener('transitionend', onTransitionDone)
    frame?.addEventListener('transitioncancel', onTransitionDone)
    // No settle poll: see the file header for why the 1Hz interval was deleted
    // and why these four event paths fully cover the geometry this box reads.
    return () => {
      if (frameHandle !== 0) cancelAnimationFrame(frameHandle)
      observer.disconnect()
      window.removeEventListener('resize', schedule)
      frame?.removeEventListener('transitionrun', onTransitionRun)
      frame?.removeEventListener('transitionend', onTransitionDone)
      frame?.removeEventListener('transitioncancel', onTransitionDone)
    }
  }, [])

  // `style` carries the STATIC contract only (position/pointerEvents); the
  // effect above owns left/top/width/height on this same node. Adding a
  // geometry property here would let a future re-render wipe the measurement.
  return React.createElement('div', {
    ref: boxRef,
    className: 'enhc-center-card',
    style: { position: 'absolute', pointerEvents: 'none' },
  })
}
