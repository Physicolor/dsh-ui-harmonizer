/**
 * Unified native-title tooltips ("tooltip harmonizer").
 *
 * The product ships a styled Tooltip primitive (@deepseek-ai/dsh-client-ui-primitives)
 * — dark inverted bubble, `--dsw-alias-tooltip-bg`, fixed positioning in the
 * z-index-100 popup band, 500ms hover delay, immediate on keyboard focus — but
 * any element that only carries the raw HTML `title` attribute (e.g. the model
 * selector trigger `_trigger`) never routes through it and falls back to the
 * OS-native tooltip, which looks foreign next to the rest of the UI.
 *
 * This module harmonizes exactly those stragglers: whenever hovering/focusing
 * an element with a `title` would pop the native tooltip, the attribute is
 * temporarily lifted and the same text is shown in a bubble that replicates
 * the official primitive's geometry and tokens (values extracted from the
 * compiled `.bubble` stylesheet):
 *
 * - placed 8px below the anchor (`side="bottom"` like the product's own
 *   toolbar tooltips), flipped above when there is no room below;
 * - horizontally centered on the anchor, clamped to a 12px viewport margin;
 * - 500ms hover delay, keyboard focus shows immediately;
 * - padding 3px 7px, radius 8px, font 13px/20px, white-space pre-line,
 *   max-width 50vw, z-index 100 (the shell's menu/tooltip/modal band);
 * - 0.15s fade-in on var(--ds-ease-in-out), disabled under reduced motion.
 *
 * The `title` attribute itself stays in the DOM the whole time except during
 * an active hover (that removal is what suppresses the native popup; some app
 * components also key labels off it, so it is restored verbatim — and if the
 * app rewrote the title mid-hover, its newer value wins). Everything else is
 * owned by the returned disposer: listeners, timers, the bubble node and the
 * injected <style> tag disappear together with the plugin fiber.
 */

/** Hover delay before the bubble appears; mirrors the product's own toolbars (delayMs=500). */
const HOVER_DELAY_MS = 500
/** Viewport margin the bubble never crosses, mirroring the primitive's EDGE_MARGIN. */
const EDGE_MARGIN = 12
/** Gap between the anchor edge and the bubble, mirroring the primitive (+/-8). */
const ANCHOR_GAP = 8

/** CSS for the bubble. Literal `enhc-tt-*` classes (runtime-set, unhashed),
 *  official alias tokens with conservative fallbacks for boot-time hovers. */
const TOOLTIP_CSS = `
.enhc-tt-bubble {
  position: fixed;
  z-index: 100;
  width: max-content;
  max-width: 50vw;
  box-sizing: border-box;
  padding: 3px 7px;
  border-radius: 8px;
  background: var(--dsw-alias-tooltip-bg, #16181d);
  color: var(--dsw-static-neutral-bluish-00, #f9fafb);
  font-size: 13px;
  line-height: 20px;
  white-space: pre-line;
  overflow-wrap: break-word;
  pointer-events: none;
  animation: enhc-tt-in 0.15s var(--ds-ease-in-out, ease-in-out);
}
.enhc-tt-bubble[data-side="bottom"] { transform: translate(-50%); }
.enhc-tt-bubble[data-side="top"] { transform: translate(-50%, -100%); }
@keyframes enhc-tt-in { 0% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .enhc-tt-bubble { animation: none; }
}
`

/** Opt-out marker: an ancestor carrying this attribute keeps its native tooltip. */
const OPT_OUT_SELECTOR = '[data-enhc-no-tooltip]'
/** Tag id of the injected stylesheet (swept together with the plugin tags). */
const STYLE_TAG_ID = 'harness-ui-harmonizer/title-tooltip'

/** One active presentation: which element, and the title text lifted from it. */
interface ActiveTip {
  el: Element
  title: string
}

/** Currently presented tip, if any. */
let active: ActiveTip | null = null
/** Pending show timer (null when nothing scheduled). */
let showTimer: number | null = null
/** Lazily created bubble node; display toggled via [hidden]. */
let bubble: HTMLDivElement | null = null

/**
 * Resolve the effective anchor for a hover/focus target: the nearest element
 * carrying a `title`, unless opted out or meaningless (html/body document
 * titles). Returns null when the native tooltip should simply stay silent.
 * @param target - event target from the delegated listener.
 * @returns the anchor element or null.
 */
function resolveAnchor(target: EventTarget | null): Element | null {
  const start = target instanceof Element ? target : null
  const anchor = start?.closest('[title]') ?? null
  if (anchor === null) return null
  const tag = anchor.tagName
  if (tag === 'HTML' || tag === 'BODY') return null
  if (anchor.closest(OPT_OUT_SELECTOR) !== null) return null
  if ((anchor.getAttribute('title') ?? '').trim() === '') return null
  return anchor
}

/**
 * Create the singleton bubble node (hidden) plus its style tag.
 * @returns the bubble element.
 */
function ensureBubble(): HTMLDivElement {
  if (document.getElementById('enhc-tt-style') === null) {
    const style = document.createElement('style')
    style.id = 'enhc-tt-style'
    style.dataset.plugin = 'harness-ui-harmonizer'
    style.dataset.pluginDynamic = STYLE_TAG_ID
    style.textContent = TOOLTIP_CSS
    document.head.appendChild(style)
  }
  if (bubble === null || !bubble.isConnected) {
    bubble = document.createElement('div')
    bubble.className = 'enhc-tt-bubble'
    bubble.dataset.side = 'bottom'
    bubble.setAttribute('role', 'tooltip')
    bubble.hidden = true
    document.body.appendChild(bubble)
  }
  return bubble
}

/**
 * Compute bottom/top placement and clamp horizontally, mirroring the
 * primitive's fit(): measure after setting text, flip sides vertically when
 * the preferred side would clip, and slide into the viewport horizontally.
 * @param el - anchor element.
 */
function place(el: Element): void {
  const tip = ensureBubble()
  const r = el.getBoundingClientRect()
  const x = r.left + r.width / 2
  let side: 'bottom' | 'top' = 'bottom'
  let y = r.bottom + ANCHOR_GAP
  // Measure with the current text; transforms translate the final box into place.
  tip.style.left = `${x}px`
  tip.style.top = `${y}px`
  const box = tip.getBoundingClientRect()
  const fitsBelow = r.bottom + ANCHOR_GAP + box.height <= window.innerHeight - EDGE_MARGIN
  const fitsAbove = r.top - ANCHOR_GAP - box.height >= EDGE_MARGIN
  if (!fitsBelow && fitsAbove) {
    side = 'top'
    y = r.top - ANCHOR_GAP
  }
  let left = x
  if (box.right > window.innerWidth - EDGE_MARGIN) left += window.innerWidth - EDGE_MARGIN - box.right
  if (left < EDGE_MARGIN) left = EDGE_MARGIN
  tip.dataset.side = side
  tip.style.left = `${left}px`
  tip.style.top = `${y}px`
}

/**
 * Show the bubble for the given anchor immediately (keyboard focus path uses
 * zero delay, mirroring the primitive).
 * @param tip - active anchor + lifted text.
 */
function showNow(tip: ActiveTip): void {
  const tipEl = ensureBubble()
  tipEl.textContent = tip.title
  tipEl.hidden = false
  place(tip.el)
}

/**
 * Tear down the current presentation: cancel the pending timer, restore the
 * lifted title (unless the app already wrote a fresh one mid-hover) and hide
 * the bubble. Safe to call with nothing active.
 */
function settle(): void {
  if (showTimer !== null) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (active !== null) {
    if (!active.el.hasAttribute('title')) active.el.setAttribute('title', active.title)
    active = null
  }
  if (bubble !== null) bubble.hidden = true
}

/**
 * Enter a new anchor: settle the previous one, lift the native title so the
 * browser cannot pop its own tooltip, and schedule the delayed show.
 * @param anchor - newly hovered element.
 */
function enter(anchor: Element): void {
  settle()
  const title = anchor.getAttribute('title')
  if (title === null || title.trim() === '') return
  active = { el: anchor, title }
  anchor.removeAttribute('title')
  showTimer = window.setTimeout(() => {
    showTimer = null
    if (active !== null) showNow(active)
  }, HOVER_DELAY_MS)
}

// Module-level disposer so a hot reload / re-mount tears down the previous
// instance's listeners first (the closure bundle re-executes in the same page).
let teardownPrevious: (() => void) | null = null

/**
 * Mount the unified title-tooltip behavior. Idempotent: a second call first
 * disposes the previous instance.
 * @returns disposer removing listeners, timers, the bubble and the style tag.
 */
export function mountTitleTooltips(): () => void {
  teardownPrevious?.()
  ensureBubble() // pre-create bubble + style tag so the first hover needs no setup

  const onMouseOver = (e: MouseEvent): void => {
    const anchor = resolveAnchor(e.target)
    if (anchor !== null && anchor === active?.el) return // re-entering descendants
    if (anchor === null) {
      // Moving onto a sibling without a title leaves through mouseout; hover
      // ending anywhere without a following over-event is handled there too.
      return
    }
    enter(anchor)
  }

  const onMouseOut = (e: MouseEvent): void => {
    if (active === null) return
    const to = e.relatedTarget
    // Leaving into the anchor's own subtree does not count as leaving; moving
    // onto another titled element settles here and re-enters via mouseover.
    if (to instanceof Node && active.el.contains(to)) return
    settle()
  }

  const onFocusIn = (e: FocusEvent): void => {
    const anchor = resolveAnchor(e.target)
    if (anchor === null || anchor === active?.el) return
    settle()
    const title = anchor.getAttribute('title')
    if (title === null || title.trim() === '') return
    active = { el: anchor, title }
    anchor.removeAttribute('title')
    showNow(active) // keyboard focus shows immediately, mirroring the primitive
  }

  const onFocusOut = (e: FocusEvent): void => {
    if (active === null) return
    const to = e.relatedTarget
    if (to instanceof Node && active.el.contains(to)) return
    settle()
  }

  const onLeave = (): void => settle()
  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') settle()
  }
  const onResize = (): void => {
    if (active !== null && active.el.isConnected) place(active.el)
    else settle()
  }

  document.addEventListener('mouseover', onMouseOver)
  document.addEventListener('mouseout', onMouseOut)
  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('focusout', onFocusOut)
  document.addEventListener('scroll', onLeave, true) // scroll does not bubble; capture catches container scrolls
  window.addEventListener('wheel', onLeave, { passive: true })
  window.addEventListener('resize', onResize)
  window.addEventListener('blur', onLeave)
  document.addEventListener('keydown', onKeyDown)

  const dispose = (): void => {
    settle()
    document.removeEventListener('mouseover', onMouseOver)
    document.removeEventListener('mouseout', onMouseOut)
    document.removeEventListener('focusin', onFocusIn)
    document.removeEventListener('focusout', onFocusOut)
    document.removeEventListener('scroll', onLeave, true)
    window.removeEventListener('wheel', onLeave)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('blur', onLeave)
    document.removeEventListener('keydown', onKeyDown)
    bubble?.remove()
    bubble = null
    document.getElementById('enhc-tt-style')?.remove()
    if (teardownPrevious === dispose) teardownPrevious = null
  }
  teardownPrevious = dispose
  return dispose
}
