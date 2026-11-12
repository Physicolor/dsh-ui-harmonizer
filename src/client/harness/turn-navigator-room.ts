/**
 * Turn navigator: show it whenever it genuinely fits, not when a third party
 * happens to leave the product's container above 900px.
 *
 * Layer: harness (the product's own conversation chrome). Seam: the product's
 * `[data-conversation-scroll]` host and its `_column` class SUFFIX. No private
 * module class name is read, no element is moved, and no CSS variable is
 * consumed — the two boxes are measured directly.
 *
 * WHY
 *
 * The product hides the navigator with a single container query
 * (`@container (width <= 900px) { .frame { display: none } }`) whose container is
 * the navigator's own slot — and that slot's inline size is the conversation
 * scroll box's content width minus its own 32px-per-side padding. So every
 * `padding-right` any plugin writes on `[data-conversation-scroll]` shrinks the
 * navigator's container 1:1 and switches the navigator off long before the
 * transcript runs out of room. Measured 2026-10-10 on 0.2.0-rc.2: the rail's
 * 460px reservation put the container at 789px on a 1600px viewport while the
 * transcript (748px) still had 260px of centering slack, 130px of it on the
 * right — room the navigator could have used and was not allowed to.
 *
 * WHAT THIS MEASURES
 *
 * The navigator occupies the right edge of the strip between the transcript and
 * the column edge: 28px wide, 12px in from the slot's padding box. The column is
 * laid out with `margin: 0 auto` inside the scroll host's content box, so the
 * strip is half of `content box width - column width`, and the navigator fits
 * whenever that half is at least `28 + 12 + 16 = 56px`. A right-side rail's
 * reservation is already part of the host's padding and therefore already out of
 * its content box, so no third-party variable has to be trusted for it — which
 * matters, because a plugin animating its own reservation leaves its published
 * variable and its padding disagreeing in the middle of the transition.
 *
 * This module publishes the result so the stylesheet can gate on it:
 *
 *   <html data-nav-room='1'>                  the navigator may be shown
 *   --enhc-nav-free / --enhc-nav-free-left    the measured widths (px, for probes)
 *   --enhc-nav-needed                          the width the navigator requires
 *
 * Nothing else is written and the product keeps ownership of the navigator's own
 * behaviour — this only removes a `display: none` that the container query
 * applied for a reason that does not hold. The default (no attribute) is the
 * product's behaviour, so an unmeasured or unmounted page is unchanged.
 */

/** The navigator's own width (`TurnNavigator.module.css`, `.frame`). */
export const NAV_FRAME_WIDTH = 28

/** The navigator's inset from the slot's padding box (`right: 12px`). */
export const NAV_FRAME_OFFSET = 12

/** Clearance kept between the navigator and the nearest content edge. */
export const NAV_FRAME_GAP = 16

/** Free width the navigator needs on one side: 28 + 12 + 16. */
export const NAV_MIN_FREE = NAV_FRAME_WIDTH + NAV_FRAME_OFFSET + NAV_FRAME_GAP

/** Root attribute the stylesheet gates on. */
const ROOM_ATTRIBUTE = 'data-nav-room'

/** The conversation's scroll host — the product's own hook for this region. */
const SCROLL_SELECTOR = '[data-conversation-scroll]'

/** The transcript column: the element that carries the resolved chat width. */
const CONTENT_SELECTOR = "[class$='_column']"

/** Variables carrying the measurements, for probes and bug reports. */
const FREE_VAR = '--enhc-nav-free'
const FREE_LEFT_VAR = '--enhc-nav-free-left'
const NEEDED_VAR = '--enhc-nav-needed'

/** The live conversation scroll host, or null outside a session. */
function scrollHost(): HTMLElement | null {
  return document.querySelector<HTMLElement>(SCROLL_SELECTOR)
}

/** The live transcript column, or null while it is not mounted. */
function contentColumn(): HTMLElement | null {
  return scrollHost()?.querySelector<HTMLElement>(CONTENT_SELECTOR) ?? null
}

/**
 * The two free widths beside the transcript, in px.
 *
 * The scroll host is the product's harness box: its content box holds the
 * centered column, so half of `content box width - column width` is the slack on
 * each side, and the navigator's `right: 12px` inset and its own width both fit
 * inside that half. A right-side rail's reservation is part of the host's
 * padding, so it is already out of the content box — this does not have to
 * subtract it, which also keeps the answer right while a plugin animates its own
 * reservation (dsh-widgets' padding and its published `--dsx-rail-w` disagree
 * mid-transition).
 *
 * The column's own resolved width is read back rather than recomputed from
 * `--dsh-chat-content-width`, so an explicit `--dsh-chat-user-width` (the width
 * row or either drag handle) and the product's adaptive clamp are honored
 * without duplicating its resolution.
 * @returns `{ right, left }` free widths; `0` for both when there is no session.
 */
export function freeBesidesTranscript(): { right: number; left: number } {
  const scroll = scrollHost()
  const column = contentColumn()
  if (scroll === null || column === null) return { right: 0, left: 0 }
  const scrollStyle = getComputedStyle(scroll)
  const scrollBox = scroll.getBoundingClientRect()
  const padStart = Number.parseFloat(scrollStyle.paddingLeft)
  const padEnd = Number.parseFloat(scrollStyle.paddingRight)
  const contentBox = scrollBox.width - (Number.isFinite(padStart) ? padStart : 0) - (Number.isFinite(padEnd) ? padEnd : 0)
  const columnBox = column.getBoundingClientRect()
  const contentWidth = columnBox.width < 1 ? contentBox : columnBox.width
  const slack = Math.max(0, contentBox - contentWidth) / 2
  return { right: slack, left: slack }
}

/**
 * The last published state, as `room|right|left`. Every write below is a custom
 * property or attribute on `<html>`, which invalidates the whole tree; the host
 * runs 100+ style tags and its own root observers, so a measurement that repeats
 * a value must cost nothing.
 */
let published: string | null = null

/**
 * Measure and publish. Safe to call at any time; publishes "no room" when the
 * conversation is not mounted.
 * @returns true when this call changed what is published.
 */
export function publishTurnNavigatorRoom(): boolean {
  const { right, left } = freeBesidesTranscript()
  const room = right >= NAV_MIN_FREE && left >= NAV_MIN_FREE
  const next = `${room ? '1' : ''}|${Math.round(right)}|${Math.round(left)}`
  if (next === published) return false
  published = next

  const root = document.documentElement
  root.style.setProperty(NEEDED_VAR, `${NAV_MIN_FREE}px`)
  root.style.setProperty(FREE_VAR, `${Math.round(right)}px`)
  root.style.setProperty(FREE_LEFT_VAR, `${Math.round(left)}px`)
  if (room) root.setAttribute(ROOM_ATTRIBUTE, '1')
  else root.removeAttribute(ROOM_ATTRIBUTE)
  return true
}

/**
 * Install the room probe.
 *
 * Re-measures on a viewport resize, on a size change of the conversation host or
 * of the transcript column (a rail, a panel, the product's own track, a mounted
 * session), and on the conversation host appearing or being replaced. Work is
 * coalesced into one animation frame, and a measurement that changes nothing
 * writes nothing.
 * @returns the disposer, which also clears every published value.
 */
export function mountTurnNavigatorRoom(): () => void {
  let frame = 0
  const schedule = (): void => {
    if (frame !== 0) return
    frame = requestAnimationFrame(() => {
      frame = 0
      publishTurnNavigatorRoom()
    })
  }

  let scroll: HTMLElement | null = null
  let column: HTMLElement | null = null
  const sizes = new ResizeObserver(schedule)

  /** Track the current host/column pair; re-binds when the product swaps one. */
  const bind = (): void => {
    const nextScroll = scrollHost()
    const nextColumn = contentColumn()
    if (nextScroll !== scroll) {
      if (scroll !== null) sizes.unobserve(scroll)
      scroll = nextScroll
      if (scroll !== null) sizes.observe(scroll)
    }
    if (nextColumn !== column) {
      if (column !== null) sizes.unobserve(column)
      column = nextColumn
      if (column !== null) sizes.observe(column)
    }
  }

  // The session mounts its transcript after this plugin loads, so the host and
  // the column are picked up from a child-list watch. Only element additions and
  // removals can change them, so attribute and character records are dropped
  // before doing any work — a streaming conversation emits the latter constantly.
  const structure = new MutationObserver((records) => {
    let relevant = false
    for (const record of records) {
      if (record.addedNodes.length === 0 && record.removedNodes.length === 0) continue
      relevant = true
      break
    }
    if (!relevant) return
    bind()
    schedule()
  })

  bind()
  structure.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('resize', schedule)
  // The right sidebar animates the frame's grid margin, which is neither a
  // viewport resize nor a size change of the conversation host: the host is
  // squeezed by its parent. `transitionend` catches it, bound on `<html>` so the
  // app's per-component transitions do not each schedule a measurement.
  document.documentElement.addEventListener('transitionend', schedule)
  schedule()

  return () => {
    if (frame !== 0) cancelAnimationFrame(frame)
    sizes.disconnect()
    structure.disconnect()
    window.removeEventListener('resize', schedule)
    document.documentElement.removeEventListener('transitionend', schedule)
    published = null
    const root = document.documentElement
    root.removeAttribute(ROOM_ATTRIBUTE)
    root.style.removeProperty(FREE_VAR)
    root.style.removeProperty(FREE_LEFT_VAR)
    root.style.removeProperty(NEEDED_VAR)
  }
}
