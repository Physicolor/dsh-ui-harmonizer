/**
 * Right-panel toggle: the track lands in one frame, the conversation glides, and
 * the panel slides over the space it took.
 *
 * WHAT THE MOTION IS
 *
 * The frame's grid track is snapped to its final value in the click's own task
 * (`data-enhc-instant` + finishing the 1ms transition that publishes the beat
 * dsh-widgets' rail yield reads), and the right-hand occupant gets the slide it
 * is missing on the OPEN direction (`data-enhc-opening`). Everything else is a
 * CARRY, and a carry is only legal because the clip is held:
 *
 *   1. at the click, before the product writes the track, the conversation
 *      viewport's width is read (the CLIP every child of it is painted inside);
 *   2. in the commit's own task the clip is pinned back to the wider of the two
 *      widths, so the boxes that are about to glide are never painted outside it;
 *   3. the payload's own measure — the transcript column's width, the composer
 *      capsule's width — is pinned to what the commit produced, so widening the
 *      clip re-centres those boxes instead of re-wrapping their text;
 *   4. each payload box is painted at its PRE-toggle left edge and eased to the
 *      left edge the layout actually landed on;
 *   5. when the ease ends, the offsets, the width pins and the clip pin are all
 *      dropped in ONE task, and the painted box does not move — the left edge
 *      the ease ended on IS the resting one.
 *
 * WHY THAT IS THE ONLY WAY TO GLIDE THE CONVERSATION
 *
 * The conversation is not one box: the transcript column and the composer capsule
 * both live inside `_scrollBody`, the scroll container, and its padding box is
 * the clip (measured: 1425px wide closed, 657px open, a 5px scrollbar, and the
 * panel's column — 768px of it — is taken out of it in the SAME commit that
 * writes the track). A cover that only moved a box was therefore painted outside
 * the new clip from its very first frame: measured on a 1707x1067 window, 588px
 * of transcript at its old 466px left edge ran 117px past the 937px clip and the
 * panel's surface covered that strip — the report "the area appears pressed
 * against the sidebar and only then translates". Holding the clip during the
 * carry is what removes that, and it is also why the payload's width has to be
 * pinned: without it, widening the clip returns the column to its 748px closed
 * measure and re-wraps the transcript on the frame the carry starts.
 *
 * The one thing this does not do is grow the payload smoothly. The column's
 * measure IS a function of the clip (748px closed, 588px open on that window), so
 * the re-wrap has to happen somewhere: it happens in the commit frame, once, and
 * both ends of the carry are then exact — the box starts where it was and ends
 * where the layout rests. Animating the width instead measures p50 7.3ms /
 * p90 53.8ms per frame on a 2.9k-node conversation (4.2 / 8.2 idle-adjacent) and
 * ~4x that on the long threads this product is used for, which is the 13fps
 * squeeze this module exists to remove.
 *
 * The header is the one host carried by WIDTH instead, because its LEFT edge is
 * pinned to the left column and only its right edge travels; its content (the
 * tabs, the badge pool, the right-hand buttons) is small enough that the reflow
 * per frame is cheap, and the alternative — a positional offset — cannot widen a
 * title column.
 *
 * WHY THE SNAP EXISTS (unchanged)
 *
 * `harness/frame-column-transition.module.css` keeps the AppFrame's
 * `grid-template-columns` transition permanently, because DSH 0.2.0 gates it
 * behind `[data-animating]` and sets that attribute on the same commit that
 * writes the new track — so the transition never starts. That permanent tween is
 * right for the LEFT panel, whose track change costs one relayout. It is wrong
 * for the RIGHT panel, because opening/closing it rewrites a LAYOUT property
 * across the whole frame:
 *
 *   measured (1707x1067, one right-panel toggle, long conversation loaded)
 *     - the center track eases 1427px -> 659px, and every frame of the 300ms
 *       window re-lays out the entire frame (scrollHeight 10857 -> 10905 ->
 *       10929 -> stable);
 *     - the product's own ResizeObserver wakes per frame: 27 callbacks against
 *       10 for the equivalent left-panel toggle (3.7x);
 *     - main-thread exclusive time in that window goes to UpdateLayoutTree
 *       (506.8ms of a 987.0ms busy window; Layerize 210.3ms, Paint 71.3ms),
 *       i.e. the thread is re-styling and re-laying out, not painting — while
 *       the compositor thread spends 0.6ms and the GPU thread 0ms;
 *     - sampled at frame granularity the whole 226ms ease produced 3 frames
 *       (~13fps inside the window, 70-80fps outside it).
 *
 * The track is snapped by setting `data-enhc-instant` on `<html>` in a
 * CAPTURE-phase listener, i.e. before the product's own handler writes the new
 * track — a bubble-phase or observer-based gate is too late, because the
 * before-change style is already the after-change one by then. It is an
 * attribute rather than a class because the theme observer on `<html>`'s
 * `class` would rebuild the material layer on each write (measured 6.74ms); see
 * `INSTANT_ATTR`.
 *
 * WHY THE GATE IS FINISHED, NOT SKIPPED
 *
 * `0.001s` is deliberate (a transition is what publishes the `transitionrun`
 * beat dsh-widgets' rail yield reads, and `0s` — i.e. no transition at all —
 * costs that beat), but a NON-ZERO duration also means the computed value is
 * still the OLD one for the whole rendering step that starts the transition:
 * measured in isolation, `transition: width 0.001s` reads 700px in the step that
 * writes 200px and 200px only in the next one. So the step whose paint should
 * hold the new layout does not lay the new track out at all — while the
 * product's panel slide needs no layout and starts in that very step.
 *
 * Finishing the gate's transitions in the microtask that follows the product's
 * own track write settles the value inside that same task, so the layout, the
 * product's own ResizeObserver, the carry and the slide all land in ONE
 * rendering step. The transition still runs and still dispatches
 * `transitionrun`/`transitionstart`/`transitionend`, which is the whole point of
 * keeping it (`finish()` in a `MutationObserver` callback on the writing task
 * reads the new value in that task and still emits run/start/end — verified in
 * isolation before this was written).
 *
 * WHY THE OPEN DIRECTION NEEDS A SLIDE OF ITS OWN
 *
 * The product's occupant owns two rules (module `OUqwTW`):
 *
 *   [data-dockkit-host=dock]                            { transform: translateX(var(--dsh-sidebar-width));
 *                                                         visibility: hidden;
 *                                                         transition: transform .3s, visibility 0s linear .3s }
 *   [data-sidebar-right-open] [data-dockkit-host=dock]  { transform: none; visibility: visible;
 *                                                         transition: transform .3s }
 *
 * so the slide is written for BOTH directions — but it only ever RUNS on the
 * close. `SidebarPanel` renders `DockLayout` while expanded, i.e. React mounts
 * the dock IN THE SAME COMMIT that sets `data-sidebar-right-open`; a newly
 * created element has no before-change style, so no transition starts and the
 * dock is inserted directly at its resting rect. `frame-column-transition.module.css`
 * restores the missing half as a keyframe slide (`anim_enhc-panel-glide-in`),
 * which needs no before-change style.
 *
 * WHY THE PANEL'S SURFACE IS NO LONGER PAINTED
 *
 * An earlier build filled the strip the dock had not covered yet with the panel's
 * own surface (read from the dock's first painted child), because the
 * conversation had already shrunk away and the strip showed the frame's
 * background — a grey block that appeared first and was then covered. With the
 * clip held the strip is painted with the CONVERSATION, which is what belongs
 * there while the panel is still arriving, so that fill would now hide the very
 * motion this module is for. Nothing else needed it: the dock covers the strip
 * by the end of the slide.
 *
 * Layer: harness/chrome (DOM behaviour aimed at the DSH shell's own chrome).
 * Seams: `<html>` root classes the harness stylesheet keys on, the product's own
 * `data-sidebar-right-*` toggle attributes, `data-conversation-scroll`, and the
 * hashed module classes the conversation is built from (`_frame`, `_scrollBody`,
 * `_column`, plus the composer bar and header slots the product publishes). No
 * private class names are invented; every hashed one is a suffix match.
 *
 * Everything here is behaviour, not policy: whether any of it runs is decided by
 * the `enhc-panel-glide` root class, which `core/apply.ts` flips from the
 * Settings switch. The CSS gate is written against both
 * (`html.enhc-panel-glide[data-enhc-instant]`), so with the setting off this
 * module is inert twice over.
 */

/** Root class `core/apply.ts` keeps while the user has the option enabled. */
export const PANEL_GLIDE_CLASS = 'enhc-panel-glide'

/**
 * Root ATTRIBUTE that collapses the frame's track tween to one frame.
 *
 * An attribute rather than a class, and that is a measured cost decision, not
 * style. `core/harmony/runtime.ts:87-89` keeps a `MutationObserver` on
 * `<html>`'s `class` (a theme may flip by class) whose callback is
 * `refreshMaterial()`, i.e. a `getComputedStyle(document.body)` plus several
 * property reads and writes — and a forced style recalc is exactly what this
 * module exists to avoid. Measured on the live page (`.tmp-h4cost.cjs`, 20
 * add/remove cycles of a class vs 20 `setAttribute` calls on `<html>`,
 * back-to-back in one task): **6.74ms mean / 9.6ms max per class mutation**
 * against **0.02ms mean** per attribute mutation, ~270ms vs 0.4ms over the
 * sample. Both calls here happen in the CAPTURE-phase click handler, i.e.
 * BEFORE the product writes the new track, so that ~6.7ms used to sit directly
 * in the pre-commit critical path of every toggle — twice, once on the way in
 * and once on the way out. The observer's filter does not list the attribute,
 * so these writes wake nothing.
 */
const INSTANT_ATTR = 'data-enhc-instant'

/**
 * Root ATTRIBUTE that marks an OPENING toggle, for the duration of the snap.
 *
 * The product mounts its occupant in the commit that opens the panel, so the
 * dock's own slide never starts (see the header). This attribute is what the
 * stylesheet's keyframe slide is gated on, and it is tracked separately from the
 * instant gate so the slide can never be applied to a CLOSE, where the occupant
 * is already animating on the product's own transition.
 */
const OPENING_ATTR = 'data-enhc-opening'

/**
 * When the release FIRST runs, counted from the click — and not a lifetime.
 *
 * It has to be late enough that the product's commit has landed (the frame's
 * track write is measured 30-50ms after the click, but on a starved thread the
 * whole commit has run as late as ~178ms) and early enough that the snap's
 * `transition-duration: 0.001s` is off the frame and the viewport well before
 * their next legitimate transition. If the panel's slide is still moving at this
 * point the release defers (see `release`), so this value does not truncate it.
 */
const HOLD_MS = 420

/**
 * Is the conversation's own glide enabled?
 *
 * OFF (rolled back 2026-10-30, owner report: the motion was worse than no motion —
 * position drift and a visible re-wrap mid-squeeze). OFF means the toggle is the
 * snap plus the panel's own slide and nothing else: the conversation lands with
 * the track, in the click's frame, at exactly the geometry the product computes.
 *
 * ON is the FLIP below: per-host left + width interpolation inside a clip held at
 * its wider state. It is geometrically exact and verified, but it re-wraps the
 * transcript on every frame, which measures 6-8 painted positions per 300ms toggle
 * on a long conversation — visible as a stutter. The smooth recipe is a content-box
 * pinch (padding-right through a CSS transition, which outranks the owners'
 * `!important`), measured at 39 steps; see
 * `docs/handoff/RIGHT-PANEL-LANDING-2026-10-30.md`, section "第四轮追加".
 */
const MOTION_ENABLED = false

/**
 * The flip's clock and curve, in ms — the product's own
 * `--ds-transition-duration-slow` and `--ds-ease-in-out`.
 *
 * Same values for both hosts and for the panel's own slide, so the three never
 * disagree about when the motion is over.
 */
const FLIP_MS = 300
const FLIP_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

/** The product's right-panel toggle and its collapsed-state affordance. */
const TOGGLE_SELECTOR = '[data-sidebar-right-toggle],[data-sidebar-right-expand]'

/** AppFrame's grid, which carries the collapsed marker and the inline track. */
const FRAME_SELECTOR = '[class$="_frame"]'

/**
 * The conversation viewport — the scroll container whose padding box IS the clip.
 *
 * Measured on 1707x1067: 1427px wide closed, 659px open, 5px of that a scrollbar,
 * and both the transcript column and the composer capsule are descendants of it.
 * Every carry in this module is legal only because this box is pinned back to its
 * wider state for the length of the ease — see `startFlip`.
 */
const SCROLL_SELECTOR = '[class$="_scrollBody"]'

/**
 * The conversation's scroll body, selected by the attribute the PRODUCT
 * publishes (`data-conversation-scroll`).
 *
 * The same element as `_scrollBody` in practice, but read through the stable,
 * self-published seam for the reservation hold below: that is the channel every
 * right-side occupant writes on, and naming the attribute avoids hash-coupling.
 */
const RESERVATION_SELECTOR = '[data-conversation-scroll]'

/**
 * The product's right-hand occupant — the element that carries the slide.
 *
 * The same node as `[class*="_tabCell"]`; selected by the dockkit host marker,
 * which the product publishes itself rather than hashing.
 */
const DOCK_SELECTOR = '[data-sidebar-right-panel] [data-dockkit-host="dock"]'

/**
 * Name of the OPEN slide this module adds through `OPENING_ATTR` (stylesheet).
 *
 * Named here because the release below has to ask the element whether the
 * animation it started is still on screen.
 */
const OPENING_ANIMATION = 'enhc-panel-glide-in'

/**
 * How long before the gate's release gives up waiting for motion to finish.
 *
 * Added to `HOLD_MS` to get the deadline. The slide cannot start until the
 * product's own commit mounts the dock, measured at ~180-265ms after the click
 * on a loaded thread — so a deadline counted from the click truncates it.
 * Measured before this wait existed: `animationcancel` at `currentTime
 * 254.7/300` (84.9%) and the dock snapping from `translateX(10.35px)` straight
 * to `none`. The longest honest wait is the latest start seen (265ms) plus the
 * 300ms the slide then runs, so 400ms of margin keeps the whole deferral inside
 * 820ms of the click.
 */
const RELEASE_MAX_WAIT_MS = 400

/**
 * How often the deferred release re-asks whether the slide is still running.
 *
 * A poll and not an event: the slide is started by a selector this module cannot
 * verify up front. One frame, because this is the only cost of the wait.
 */
const RELEASE_POLL_MS = 16

/**
 * A transition this short is the gate's own; the product's are 200-300ms.
 *
 * The gate's duration is `0.001s` (see the stylesheet), so anything under a
 * frame is the snap and nothing else.
 */
const SETTLE_MAX_MS = 2

/**
 * How long after a conversation switch a track transition still counts as part of it.
 *
 * The switch's own state writes land in the commit that mounts the new view; 400ms
 * covers a slow commit (measured ~150ms) with room for the remount's follow-up
 * renders, and is short enough that a left-sidebar toggle a moment later keeps its
 * own ease.
 */
const SWITCH_WINDOW_MS = 400

/** Transcript column — `xz4KEq_column`; a transform-safe carry host. */
const PROSE_SELECTOR = '[class$="_column"]'

/**
 * The element that paints the input capsule inside the composer bar.
 *
 * Carried by `left`, never by `transform`: its subtree contains
 * `[data-slot=conversation.input.overlay]` -> `.dsx-stats-drawer` ->
 * `.dsx-stats-drawer-zoom` -> `.dsx-stats-rail`, three `position: fixed` nodes,
 * so a transform on this host rewrites their containing block and drags the rail
 * into the viewport (measured: rail 1247 -> 553, and an inverse transform on the
 * rail does not repair it — 1247 -> 412). `left` is a layout property, so it does
 * not create a containing block and the fixed subtree stays put (measured: rail
 * drift 0.0 at 60/150/240ms).
 */
const COMPOSER_SELECTOR = '[data-slot="conversation.composer.bar"] [class*="_card"]'

/**
 * The conversation header, whose right edge rides the same track change.
 *
 * Its left edge is pinned to the left column and its right edge is the panel's,
 * so it is the one host carried by WIDTH rather than by position; the pair of
 * selectors is the same pair the header stylesheet anchors on, so the two halves
 * cannot drift apart. Anchored on the slot the product guarantees, never on a
 * hashed module class.
 */
const HEADER_SELECTOR =
  "[data-slot='conversation.header'] > header:has([class$='_titleCluster'] > [class$='_tabs']), [data-slot='conversation.session.header'] > header"

/**
 * The hosts carried by POSITION through one toggle, and how each is offset.
 *
 * `property` is a promise about the host, not a preference: the composer capsule
 * cannot take a transform (see `COMPOSER_SELECTOR`), and the column has no
 * `position: fixed` descendant to protect (measured 0 of 10878 in the corpus) so
 * the compositor path is free there.
 */
const CARRY_HOSTS: ReadonlyArray<{ selector: string; property: 'transform' | 'left' }> = [
  { selector: PROSE_SELECTOR, property: 'transform' },
  { selector: COMPOSER_SELECTOR, property: 'left' },
]

/** One running carry, kept so a new toggle (or dispose) can cancel it. */
interface Glide {
  /** Stop the animation and drop every style this carry wrote. */
  stop: () => void
  /** Is the ease still moving pixels? (`stop` is idempotent, this is not an exit.) */
  busy: () => boolean
}

/**
 * Read an element's painted left edge and width, or null when it is gone.
 *
 * @param el - candidate element.
 * @returns the border box in viewport space, or null.
 */
function boxOf(el: HTMLElement | null): { left: number; width: number } | null {
  if (el === null || !el.isConnected) return null
  const r = el.getBoundingClientRect()
  return { left: r.left, width: r.width }
}

/**
 * Animate a box from where it was to where it belongs — position AND width.
 *
 * `before` is the box on the frame the user clicked, `target` is the box the layout
 * settles on, and the animation interpolates LEFT and WIDTH between them on the
 * product's own 300ms curve. The transcript re-wraps on every frame of it, which
 * is the price of an honest squeeze (measured: 5 painted positions in a 300ms
 * toggle on a 3.3k-node conversation).
 *
 * The clip is held wide for the length of it. Without that, the conversation
 * viewport has already shrunk in the commit frame and the animated box is painted
 * cut by the sidebar (measured 117px of transcript, 131px of composer — the first
 * report). The panel's slide covers the strip instead.
 *
 * The box is centred in the pinned clip, so one reading is enough to place both
 * endpoints: at any width its left edge is `centre - width / 2`.
 *
 * @param clip - the conversation viewport whose padding box clips the hosts.
 * @param clipBefore - its width before the toggle.
 * @param hosts - `{el, property, before, resting}` per host; `before` from the click.
 * @returns the running animation, or null when there is nothing to animate.
 */
function startFlip(
  clip: HTMLElement | null,
  clipBefore: number,
  hosts: Array<{
    el: HTMLElement
    property: 'transform' | 'left'
    before: { left: number; width: number }
    resting: { left: number; width: number } | null
  }>,
): Glide | null {
  if (clip === null || !clip.isConnected || hosts.length === 0) return null
  const clipInline = clip.style.width
  const clipAfter = clip.getBoundingClientRect().width
  if (!(Math.abs(clipAfter - clipBefore) > 0.5)) return null
  const states = hosts.map((host) => {
    const after = boxOf(host.el)
    return {
      ...host,
      after,
      target: host.resting === null ? after : host.resting,
      inlineWidth: host.el.style.width,
      inlineMaxWidth: host.el.style.maxWidth,
      inlineOffset: host.property === 'transform' ? host.el.style.transform : host.el.style.left,
      position: host.property === 'left' && getComputedStyle(host.el).position === 'static' ? host.el.style.position : null,
    }
  }).filter((s): s is typeof s & { after: { left: number; width: number } } => s.after !== null && s.target !== null)
  if (states.length === 0) return null

  clip.style.width = `${Math.max(clipBefore, clipAfter)}px`
  let stopped = false
  const animations: Animation[] = []
  const restore = (): void => {
    for (const animation of animations) animation.cancel()
    animations.length = 0
    clip.style.width = clipInline
    for (const state of states) {
      state.el.style.width = state.inlineWidth
      state.el.style.maxWidth = state.inlineMaxWidth
      if (state.property === 'transform') state.el.style.transform = state.inlineOffset
      else state.el.style.left = state.inlineOffset
      if (state.position !== null) state.el.style.position = state.position
    }
  }
  const stop = (): void => {
    if (stopped) return
    stopped = true
    restore()
  }

  for (const state of states) {
    const target = state.target
    if (target === null) continue
    state.el.style.width = `${state.before.width}px`
    state.el.style.maxWidth = 'none'
    const from = boxOf(state.el)
    if (from === null) continue
    const centre = from.left + state.before.width / 2
    const offset = state.before.left - from.left
    const landingOffset = target.left - (centre - target.width / 2)
    if (!(Math.abs(target.width - state.before.width) > 0.5 || Math.abs(offset - landingOffset) > 0.5)) continue
    if (state.property === 'transform') {
      state.el.style.transform = `translateX(${offset}px)`
      animations.push(state.el.animate(
        [
          { width: `${state.before.width}px`, transform: `translateX(${offset}px)` },
          { width: `${target.width}px`, transform: `translateX(${landingOffset}px)` },
        ],
        { duration: FLIP_MS, easing: FLIP_EASING },
      ))
    } else {
      if (state.position !== null) state.el.style.position = 'relative'
      state.el.style.left = `${offset}px`
      animations.push(state.el.animate(
        [
          { width: `${state.before.width}px`, left: `${offset}px` },
          { width: `${target.width}px`, left: `${landingOffset}px` },
        ],
        { duration: FLIP_MS, easing: FLIP_EASING },
      ))
    }
  }

  if (animations.length === 0) {
    stop()
    return null
  }
  Promise.all(animations.map((animation) => animation.finished.catch(() => undefined))).then(stop, stop)
  return { stop, busy: () => !stopped }
}


/**
 * Carry a host whose LEFT edge is pinned and whose right edge travels, by width.
 *
 * The header cannot be carried positionally: the right-anchored buttons travel
 * the panel's whole width while the badges and tabs travel only the distance the
 * title gives up, and the title itself does not move at all — it changes width.
 * Covering the header's own width does all of it at once: measured, setting
 * `header.style.width` back to its closed value while the panel is open
 * reproduces the closed header exactly (header `280,1427,50`, title column 212px,
 * tab strip `867.5,139,26` against the open state's `280,659,78` / 41.5px /
 * `697,87,58`).
 *
 * Unlike the positional carry this one does NOT pin the clip: the header sits
 * outside the scroll container and its container is the frame's own column, so a
 * wide header is simply clipped by that column — which is exactly what the panel
 * is taking.
 *
 * @param element - the header.
 * @param before - its width before the toggle.
 * @returns the running cover, or null when the width did not change.
 */
function startWidthCarry(element: HTMLElement | null, before: number | null): Glide | null {
  if (element === null || before === null || !element.isConnected) return null
  const box = boxOf(element)
  if (box === null) return null
  const from = before - box.width
  if (!(Math.abs(from) > 0.5)) return null
  const inline = element.style.width
  let stopped = false
  let animation: Animation
  const stop = (): void => {
    if (stopped) return
    stopped = true
    animation.cancel()
    element.style.width = inline
  }
  element.style.width = `${before}px`
  animation = element.animate(
    [{ width: `${before}px` }, { width: `${box.width}px` }],
    { duration: FLIP_MS, easing: FLIP_EASING, fill: 'both' },
  )
  animation.finished.then(stop, () => { /* cancelled or replaced */ })
  return { stop, busy: () => !stopped }
}

/**
 * Is this click opening the right panel (rather than closing it)?
 *
 * Read from the product's own collapsed marker on the frame. Both markers are
 * checked because the attribute is written by the same commit as the track and
 * the inline track is the more primitive of the two: on a narrow window the
 * attribute can also mean "no room for the panel", which is still a state the
 * slide must not be added to.
 *
 * @returns true when the panel is collapsed right now, i.e. this click opens.
 */
function openingFrom(frame: HTMLElement | null): boolean {
  if (frame === null) return false
  // The inline track is the primary signal: it is written on every toggle and
  // its third column is the panel's own max width, so `minmax(0px, 0px)` is
  // exactly "collapsed". (`data-rightbar-collapsed` is checked only as a
  // fallback: React writes it as `cond || void 0`, and an attribute that means
  // "collapsed" must not be confused with one that has merely gone empty.)
  const track = frame.style.gridTemplateColumns
  if (track !== '') return /minmax\(\s*[^,]+,\s*0px\s*\)\s*$/.test(track)
  return frame.hasAttribute('data-rightbar-collapsed')
}

/**
 * Has the settle failure been reported this session? See `settleTransitions`.
 */
let settleFailureReported = false

/**
 * Has a failure to READ the gate's transitions been reported this session?
 *
 * Same reasoning as `settleFailureReported`, for the other silent path: a
 * `getAnimations()` that throws leaves the 1ms transition to settle on its own
 * — a one-frame desync — and without a line in the console the only symptom is
 * the layout arriving a frame late again, with nothing to explain it.
 */
let settleReadFailureReported = false

/**
 * Settle the gate's own ~0ms transitions, in the task that started them.
 *
 * The gate is `transition-duration: 0.001s !important` on the frame and the
 * conversation viewport (see the stylesheet): non-zero on purpose, because the
 * `transitionrun` it publishes is the beat dsh-widgets' rail yield reads, and
 * because a transition that is not created at all cannot be finished either.
 * What a non-zero duration costs is that the computed value stays the OLD one
 * for the whole rendering step that starts it, so the first frame after the
 * click does not lay the new track out.
 *
 * `finish()` moves the transition to its end without cancelling it, so
 * `transitionrun`/`transitionstart`/`transitionend` are all still dispatched
 * (measured: identical event list with and without the call) while the computed
 * value becomes the new one inside THIS task. The layout, the product's own
 * ResizeObserver, the carry and the panel's slide then land on one frame instead
 * of two.
 *
 * @param hosts - the two elements the gate collapses.
 * @returns how many transitions were settled (0 when the product has not
 *   written its track yet, e.g. because the commit was deferred).
 */
function settleTransitions(hosts: Array<HTMLElement | null>): number {
  let settled = 0
  for (const host of hosts) {
    if (host === null || !host.isConnected) continue
    let list: Animation[]
    try {
      list = host.getAnimations()
    } catch (error) {
      // `getAnimations` is not expected to throw, but a host torn out of a
      // discarded document can. Reported once, for the same reason as below.
      if (!settleReadFailureReported) {
        settleReadFailureReported = true
        console.info('[dsh-ui-harmonizer] the panel-glide gate could not be read:', error)
      }
      continue
    }
    for (const animation of list) {
      if (!(animation instanceof CSSTransition)) continue
      if (animation.playState !== 'running') continue
      const timing = animation.effect === null ? null : animation.effect.getTiming()
      const duration = timing === null ? null : timing.duration
      // The product's own motions are 200-300ms, so a sub-frame duration can
      // only be the gate. Anything longer must keep running.
      if (typeof duration !== 'number' || duration > SETTLE_MAX_MS) continue
      try {
        animation.finish()
        settled += 1
      } catch (error) {
        // Unresolved timeline (no frame yet): leave it running — it is 1ms and
        // the next rendering step settles it exactly as it did before, which is
        // the pre-change behaviour. Reported ONCE per session because the
        // failure mode is otherwise invisible: the layout would silently arrive
        // a frame late and nothing in the page would say why.
        if (!settleFailureReported) {
          settleFailureReported = true
          console.info('[dsh-ui-harmonizer] the panel-glide gate could not be settled:', error)
        }
      }
    }
  }
  return settled
}

/**
 * Read the reservation the right-side occupants currently hold on the
 * conversation.
 *
 * `padding-right` is the ONE channel every right-side occupant writes on:
 * dsh-widgets pads the scroll body with the rail's claim, and dsh-pinned-summary
 * pads it `!important` with the sum (rail claim or card width). Reading the
 * computed value therefore answers "is anything reserving space right now?"
 * without naming either plugin's variable.
 *
 * @param el - the conversation scroll body, or null before it is mounted.
 * @returns the reserved width in px, 0 when nothing is reserved.
 */
function readReservation(el: HTMLElement | null): number {
  if (el === null) return 0
  const value = Number.parseFloat(getComputedStyle(el).paddingRight)
  return Number.isFinite(value) && value > 0.5 ? value : 0
}

/**
 * Mount the right-panel motion. Returns the disposer `ctx.effect` wants; the
 * listener, the pending timer, the snap class, the carry and the reservation
 * hold all go away with it.
 */
export function mountInstantTrack(): () => void {
  const root = document.documentElement
  let holdTimer = 0
  /**
   * Settles the gate's ~0ms transitions in the very task that starts them.
   *
   * Armed in the click and disarmed with the snap class, so the two hosts it
   * watches are only observed during the toggle window.
   */
  let settleMo: MutationObserver | null = null
  /**
   * Token identifying the newest toggle.
   *
   * `holdTimer` is a single slot, so a click overwrites the previous click's
   * pending release and can no longer cancel it. Every callback therefore
   * carries the token it was born with and bails once a newer click has made it
   * stale.
   */
  let generation = 0
  /**
   * The carry the newest toggle started, so the next one can cancel it.
   *
   * A carry writes inline widths, a clip width and a transform/left; one left
   * behind by a toggle that was interrupted would keep the conversation offset
   * for the life of the page, so every path that ends a toggle stops it.
   */
  let carries: Glide[] = []
  /** When the last workspace conversation switch was clicked, see . */
  let switchAt = 0
  /** Observes track writes so a switch's grid tween can be finished before paint. */
  let switchMo: MutationObserver | null = null
  /**
   * Where each carried host came to rest, keyed by the state that produced it.
   *
   * A carry has to end exactly on the resting left edge, and on a CLOSE that
   * geometry is NOT readable from the commit frame: the product caps the
   * transcript column with a responsive `max-width` (measured 640px open, 748px
   * closed) that resolves one frame after the track widens, so the commit frame
   * still reports the open-state measure — 54px and 160px away from the truth.
   * Aiming at that number and correcting afterwards produced a visible
   * right-then-back overshoot (measured on the close: 312 -> 520 -> 466).
   *
   * The state that geometry belongs to is stamped on the frame itself (its inline
   * grid track) plus the reservation, and that pair IS readable in the commit
   * frame. So the last time each state was on screen is where its rest geometry
   * comes from: recorded on the way into a toggle (the state being left) and again
   * once a toggle has settled.
   */
  const restingByState = new Map<string, Array<{ center: number; width: number } | null>>()
  /**
   * When the release stops waiting for a slide that has not finished.
   *
   * A release that waits is only safe with a hard cap: the OPEN slide is started
   * by a selector this module cannot verify up front (a fullscreen presentation,
   * a narrow window with no room for the dock, an option flipped off mid-flight),
   * and a gate left up forever would squash the product's own 300ms transitions
   * for good.
   */
  let releaseDeadline = 0
  /**
   * The last non-zero reservation this page has seen, remembered for the close.
   *
   * With the panel OPEN the reservation is legitimately 0 (the grid took the
   * strip), so a close cannot read what it must return to. The value seen before
   * the panel took the track is that answer, and it is also what the owners
   * themselves restore — see `holdReservation`.
   */
  let lastReservation = 0
  /**
   * A temporary `padding-right` written by this module, when an owner missed the
   * toggle's own task.
   *
   * The OWNERS publish in the toggle's task by construction (dsh-pinned-summary
   * from its own `MutationObserver`, dsh-widgets from the frame's
   * `transitionrun`, which this module dispatches by finishing the gate). This
   * hold exists for the case where a third-party owner does not, and it matters
   * in BOTH directions:
   *
   *   - open:  a late owner paints the transcript collapsed while the track is
   *            already final;
   *   - close: a late owner leaves the content box at the full track width, so
   *            the transcript lands at the no-reservation centre and then JUMPS
   *            back when the reservation finally arrives (measured: ~+723ms
   *            after the click, 610 -> 570px).
   *
   * It is probed per frame (`probeHold`) so it is dropped the moment the owners
   * publish it themselves, and bounded by `HOLD_MS`.
   *
   * `previous`/`previousPriority` are the inline declaration this property had
   * BEFORE the hold. They are what `dropHold` puts back: a third-party inline
   * write made after the hold would otherwise be deleted with it (the CSSOM
   * keeps one declaration per property, so an owner writing inline replaces
   * ours, and one writing before us is replaced by ours).
   */
  let hold: { el: HTMLElement; value: number; previous: string; previousPriority: string } | null = null
  /** Bounds the hold; the carry is done well before this. */
  let holdDeadline = 0
  /** Has the hold's give-up path already been reported this session? */
  let holdFailureReported = false

  /**
   * Take the held `padding-right` back, if it is still ours.
   *
   * Called on every path that ends a toggle (a new click, the release, dispose)
   * so a hold can never survive into the next toggle. Removing it only reveals
   * the owner's own declaration, i.e. the value that was there before this
   * module held it.
   */
  /**
   * The state stamp a carry's resting geometry is filed under.
   *
   * Both halves are readable in the commit frame, which is what makes a lookup
   * possible at all: the frame's inline track is written by the same commit as
   * the layout, and the reservation is the owners' own publish.
   */
  const stateKey = (): string => {
    const frame = document.querySelector<HTMLElement>(FRAME_SELECTOR)
    const clip = document.querySelector<HTMLElement>(SCROLL_SELECTOR)
    return `${frame === null ? '' : frame.style.gridTemplateColumns}|${Math.round(readReservation(clip))}`
  }

  /**
   * Record where the carried hosts rest in the state that is on screen NOW.
   *
   * Called on the way into a toggle and once a toggle has settled, so a state
   * that has been seen once can be aimed at exactly on every later visit.
   */
  const rememberResting = (): void => {
    const seen = CARRY_HOSTS.map((spec) => boxOf(document.querySelector<HTMLElement>(spec.selector)))
    if (seen.every((box) => box === null)) return
    restingByState.set(stateKey(), seen.map((box) => (box === null ? null : { center: box.left + box.width / 2, width: box.width })))
  }

  const dropHold = (): void => {    if (hold === null) return
    const { el, value, previous, previousPriority } = hold
    hold = null
    // Only our own write: an owner that wrote an inline value after this module
    // must keep it. The check is by value, because the property is theirs too.
    const current = el.style.getPropertyValue('padding-right')
    if (!(Math.abs(Number.parseFloat(current) - value) < 0.5)) return
    if (previous === '') {
      el.style.removeProperty('padding-right')
      return
    }
    el.style.setProperty('padding-right', previous, previousPriority as 'important' | '')
  }

  /**
   * Stop every carry and drop the writes it owns.
   *
   * @param withOpening - also drop the OPEN slide (a new click owns the attr).
   */
  const endToggle = (withOpening: boolean): void => {
    for (const carry of carries) carry.stop()
    carries = []
    if (settleMo !== null) {
      settleMo.disconnect()
      settleMo = null
    }
    dropHold()
    if (withOpening) root.removeAttribute(OPENING_ATTR)
  }

  /**
   * Is the inline `padding-right` still the declaration this module wrote?
   *
   * A third-party inline write replaces ours (the CSSOM keeps one declaration
   * per property), and that write must never be deleted by this module's
   * cleanup — see the note on `hold`.
   *
   * @param el - the conversation scroll body.
   * @param value - the value the hold wrote.
   * @returns true when the element still carries the hold's own declaration.
   */
  const isHeld = (el: HTMLElement, value: number): boolean =>
    el.style.getPropertyPriority('padding-right') === 'important'
    && Math.abs(Number.parseFloat(el.style.getPropertyValue('padding-right')) - value) < 0.5

  /**
   * Hold the reservation at the value the toggle is about to settle on.
   *
   * Open: 0 — the panel's track IS the reservation's owner there (the grid
   * already took the strip away), so a late owner paints the transcript
   * collapsed.
   * Close: the last non-zero value seen before the panel took the track — the
   * owners restore exactly that, and while it is missing the content box is too
   * wide, so the transcript lands away from its resting place and jumps back when
   * the reservation arrives.
   *
   * The write is inline `!important` because that is what dsh-pinned-summary
   * itself uses; a plain declaration would lose to it.
   *
   * @param opening - is this click opening the panel?
   */
  const holdReservation = (opening: boolean): void => {
    const el = document.querySelector<HTMLElement>(RESERVATION_SELECTOR)
    const frame = document.querySelector<HTMLElement>(FRAME_SELECTOR)
    // The two states the product itself treats as "no animation": a fullscreen
    // presentation takes the whole stage (a reservation there is legitimate) and
    // `data-rightbar-instant` is the product asking for a plain cut. Holding in
    // either would be this module overriding a deliberate state.
    if (
      el === null
      || (frame !== null && (frame.hasAttribute('data-rightbar-instant') || frame.hasAttribute('data-rightbar-fullscreen')))
    ) {
      dropHold()
      return
    }
    const expected = opening ? 0 : lastReservation
    if (!(expected > 0.5) && !opening) {
      // Nothing to restore (a reservation-less close): leave the owners alone.
      dropHold()
      return
    }
    if (Math.abs(readReservation(el) - expected) < 0.5) {
      // The owner made it in time (the normal case): nothing to hold, and a
      // stale hold from an earlier edge of this same toggle goes away.
      dropHold()
      return
    }
    hold = {
      el,
      value: expected,
      previous: el.style.getPropertyValue('padding-right'),
      previousPriority: el.style.getPropertyPriority('padding-right'),
    }
    el.style.setProperty('padding-right', `${expected}px`, 'important')
    holdDeadline = performance.now() + HOLD_MS
    window.requestAnimationFrame(probeHold)
  }

  /**
   * Ask, once per frame, whether the owners have caught up (and drop the hold).
   *
   * The probe REMOVES the hold inside a rAF callback, reads the computed value,
   * and puts it back when the owners are still behind. That order is what makes
   * the probe invisible: nothing is painted between the read and the rewrite, so
   * no frame can ever show the stale reservation the hold is hiding.
   *
   * Cost, stated: while it runs this is one forced style/layout flush per frame
   * (the `getComputedStyle` read), for at most `HOLD_MS` — which is only paid on
   * the anomalous path. On this machine it has never been observed firing (the
   * owners publish in the toggle's task); `verify-panel-squeeze.cjs` reports
   * whether it did.
   */
  const probeHold = (): void => {
    if (hold === null) return
    const { el, value, previous, previousPriority } = hold
    if (!isHeld(el, value)) {
      // An owner replaced the inline declaration after the hold went up: its
      // write is the newer intent and is left exactly as it is.
      hold = null
      return
    }
    el.style.removeProperty('padding-right')
    const owned = readReservation(el)
    if (Math.abs(owned - value) < 0.5) {
      hold = null
      // Put back whatever inline declaration was there before this module
      // intervened (normally nothing), so the page is left as it was found.
      if (previous !== '') el.style.setProperty('padding-right', previous, previousPriority as 'important' | '')
      return
    }
    el.style.setProperty('padding-right', `${value}px`, 'important')
    if (performance.now() < holdDeadline) {
      window.requestAnimationFrame(probeHold)
      return
    }
    // Give up: the owners never agreed. The carry is over by now, so the
    // correction is a single step rather than a painted animation — reported
    // once, because without the line the only symptom would be a stutter that
    // nothing in the page explains.
    dropHold()
    if (!holdFailureReported) {
      holdFailureReported = true
      console.info(`[dsh-ui-harmonizer] the right-side reservation did not settle at ${value}px within ${HOLD_MS}ms; released the hold.`)
    }
  }

  /**
   * Is the OPEN slide still on screen (or still coming)?
   *
   * `getAnimations()` is what separates "running" from "not started yet": the
   * attribute alone cannot, because the dock it animates is mounted by the
   * product's commit ~180-265ms after the click, and an element that does not
   * exist yet has no animation to find. `null` from the query therefore means
   * "the commit has not run yet", which is a keep-waiting answer, not a
   * finished one — but only while the attribute is up, because on a CLOSE
   * there is no slide of this module's at all.
   */
  const slideRunning = (): boolean => {
    if (!root.hasAttribute(OPENING_ATTR)) return false
    const dock = document.querySelector<HTMLElement>(DOCK_SELECTOR)
    if (dock === null) return true
    for (const animation of dock.getAnimations()) {
      // `fill: both` keeps a finished animation in the list, so the state has
      // to be read: a finished one is holding the identity frame, which is
      // exactly the product's own open-state value — releasing then is safe.
      if (animation instanceof CSSAnimation && animation.animationName === OPENING_ANIMATION) {
        return animation.playState === 'running'
      }
    }
    return false
  }

  /**
   * Drop the gate and the transient writes it owns.
   *
   * Deferred while the panel is still sliding, and that is the fix for a visible
   * truncation: `HOLD_MS` is counted from the CLICK, while the OPEN slide cannot
   * start before the product's commit mounts the dock — measured 180-265ms
   * later. Releasing on the click's clock therefore cancelled the slide at
   * `currentTime 254.7/300` (84.9%, with no `animationend` at all) and the dock
   * snapped from `translateX(10.35px)` straight to `none`.
   *
   * The INSTANT gate is NOT deferred. Its whole job is the one-frame snap of the
   * track, which is already done by the time this first runs, and leaving
   * `transition-duration: 0.001s !important` on the frame and the viewport would
   * squash any unrelated transition that happens to start in the meantime (the
   * rail's yield writes the viewport's padding). Only the OPEN slide waits.
   */
  const release = (): void => {
    holdTimer = 0
    root.removeAttribute(INSTANT_ATTR)
    // The gate is down; the carry is not. `HOLD_MS` is counted from the CLICK
    // while the carry cannot start before the commit (~150ms measured) and then
    // runs its own 300ms, so releasing on the click's clock would kill it 30ms
    // before it lands — a snap-back on the last frames, which is the defect this
    // wait exists for. `endToggle` stops it, so it must not run before then.
    const moving = carries.some((carry) => carry.busy()) || slideRunning()
    if (moving && performance.now() < releaseDeadline) {
      holdTimer = window.setTimeout(release, RELEASE_POLL_MS)
      return
    }
    endToggle(true)
    // The page is now in the state the toggle produced: record where the hosts
    // rest in it, so the next toggle back into it can aim exactly.
    window.requestAnimationFrame(rememberResting)
  }

  /**
   * One toggle: snap the track, carry the payload, let the panel slide.
   * @param event - the capture-phase click.
   */
  const onClick = (event: Event): void => {
    if (!root.classList.contains(PANEL_GLIDE_CLASS)) return
    const target = event.target
    if (!(target instanceof Element) || target.closest(TOGGLE_SELECTOR) === null) return
    const frame = document.querySelector<HTMLElement>(FRAME_SELECTOR)
    const opening = openingFrom(frame)

    endToggle(false)
    generation += 1
    const mine = generation

    // Read BEFORE the product's own handler writes the track: this is the
    // reservation the panel is about to take away (open) or give back (close).
    // The close cannot read it later — with the panel open it is legitimately 0 —
    // so the remembered value is what its hold is built on.
    const reservation = readReservation(document.querySelector<HTMLElement>(RESERVATION_SELECTOR))
    if (reservation > 0.5) lastReservation = reservation

    // Everything the carry needs, read before the track moves: the clip's width
    // and each host's painted box. Measured here because the commit's own frame
    // is already the post-toggle geometry.
    const scrollBody = document.querySelector<HTMLElement>(SCROLL_SELECTOR)
    const clipBefore = scrollBody === null ? 0 : scrollBody.getBoundingClientRect().width
    const carryHosts = CARRY_HOSTS.map((spec, index) => {
      const el = document.querySelector<HTMLElement>(spec.selector)
      const box = boxOf(el)
      return el !== null && box !== null ? { el, property: spec.property, before: box, index } : null
    }).filter((h): h is NonNullable<typeof h> => h !== null)
    const header = document.querySelector<HTMLElement>(HEADER_SELECTOR)
    const headerBefore = header === null || !header.isConnected ? null : header.getBoundingClientRect().width
    // The state being LEFT is the one a later toggle returns to, so it is
    // recorded here, before the product overwrites the track.
    rememberResting()

    // Two attribute writes, and both are free: the theme observer's filter is
    // `['class','data-ds-dark-theme','data-ds-theme-source']`, so neither wakes
    // `refreshMaterial`. See `INSTANT_ATTR` for the measured 6.74ms/class-write
    // this avoids on the toggle's critical path.
    root.setAttribute(INSTANT_ATTR, '')
    // The product mounts its occupant in the same commit that opens the panel,
    // so an OPEN has no slide of its own; the stylesheet supplies one, and the
    // attribute must be up before that commit runs.
    if (opening) root.setAttribute(OPENING_ATTR, '')
    else root.removeAttribute(OPENING_ATTR)
    if (holdTimer !== 0) window.clearTimeout(holdTimer)
    // `HOLD_MS` is when the release STARTS asking, not when the gate goes: the
    // deadline is what bounds the asking. The margin over it covers a slide that
    // starts as late as 265ms after the click and then runs its own 300ms.
    releaseDeadline = performance.now() + HOLD_MS + RELEASE_MAX_WAIT_MS
    holdTimer = window.setTimeout(release, HOLD_MS)

    /**
     * Arm the carry against the layout the product just wrote.
     *
     * Called from the settle observer's microtask, i.e. in the commit's own task
     * and before it paints, so the first painted frame is already the carried
     * one. Nothing here predicts the layout: the clip's pre-toggle width, the
     * hosts' pre-toggle boxes and their post-commit boxes are all measured, and
     * the ease's last keyframe is the resting left edge itself.
     */
    const armCarry = (): void => {
      if (!MOTION_ENABLED) return
      if (mine !== generation || !root.classList.contains(PANEL_GLIDE_CLASS)) return
      if (scrollBody === null || carryHosts.length === 0) return
      // The state the track now describes: what a host rests at in it, if that
      // state has been on screen before. A miss falls back to the commit frame's
      // own numbers, which is exact on an OPEN (its measure is the resting one)
      // and one frame stale on a CLOSE.
      const resting = restingByState.get(stateKey()) ?? null
      const withResting = carryHosts.map((host) => {
        const cached = resting === null ? null : resting[host.index]
        return { ...host, resting: cached === null || cached === undefined ? null : { left: cached.center - cached.width / 2, width: cached.width } }
      })
      const carry = startFlip(scrollBody, clipBefore, withResting)
      if (carry !== null) carries.push(carry)
      const widthCarry = startWidthCarry(header, headerBefore)
      if (widthCarry !== null) carries.push(widthCarry)
    }

    /**
     * The hosts whose gated transitions this module finishes.
     *
     * NOT the composer seat. It is the one host whose inline style dsh-widgets
     * writes FROM its own transition handlers (`applyRailRight`): finishing its
     * 1 ms `right` transition re-enters that plugin, which writes the seat again,
     * which the observer below reports as a new delivery — an endless settle
     * pulse. The measured freeze: closing the panel over an open widget rail left
     * the renderer pegged at one core with `settleTransitions` on the stack for
     * 7.2 s; with `enhc-panel-glide` off (this path inert) the same close
     * completes in <6 s. The seat's gate still collapses its transition to 1 ms
     * in the stylesheet, so it settles on its own next rendering step.
     */
    const settleHosts: Array<HTMLElement | null> = [frame, scrollBody]
    /**
     * How many settle pulses one toggle may run.
     *
     * A safety net, not the mechanism: each pulse is bounded, but an owner that
     * answers EVERY settle with another gated transition would otherwise keep
     * the observer alive for the life of the page. Six is above the longest
     * legitimate chain seen (track -> claim -> padding) and far below anything a
     * user could notice; after it the remaining 1 ms transitions settle
     * themselves.
     */
    const SETTLE_ROUNDS_MAX = 6
    let settleRounds = 0
    /** Re-entrancy guard: `finish()` must never nest another settle pass. */
    let settling = false
    /**
     * Finish every gate transition that is running now, and every one those
     * finishes start.
     *
     * One pass is not enough, and the reason is measured: `finish()` on the
     * frame's track dispatches `transitionrun`, dsh-widgets' rail yield listens
     * for exactly that beat and answers it by writing `--dsx-rail-w` — which
     * starts the conversation's `padding-right` transition. A single pass would
     * leave that second transition running into the next rendering step, i.e.
     * the reservation would be one frame late. Four passes is well past the
     * longest chain seen (track -> claim -> padding) and each empty pass exits at
     * once.
     *
     * @returns how many transitions this call finished.
     */
    const settleAll = (): number => {
      if (settling) return 0
      settling = true
      try {
        let total = 0
        for (let pass = 0; pass < 4; pass += 1) {
          const settled = settleTransitions(settleHosts)
          if (settled === 0) break
          total += settled
        }
        return total
      } finally {
        settling = false
      }
    }

    if (settleMo !== null) settleMo.disconnect()
    settleMo = new MutationObserver(() => {
      if (mine !== generation || !root.classList.contains(PANEL_GLIDE_CLASS)) return
      if (settleRounds >= SETTLE_ROUNDS_MAX) {
        // This toggle has already been settled more often than any real chain
        // needs. Stop observing rather than feed an owner that answers every
        // settle with a new gated transition (see `settleHosts`).
        settleMo?.disconnect()
        settleMo = null
        return
      }
      settleRounds += 1
      if (settleAll() === 0) return
      // dsh-pinned-summary publishes its reservation from its OWN
      // MutationObserver, so it can run after this callback. One microtask hop
      // — still inside the task the product wrote the track in, still before
      // paint — settles whatever that write starts, so the carry below is
      // measured against a layout that is final NOW (a reservation that lands a
      // frame later would move the boxes the carry just seeded).
      queueMicrotask(() => {
        if (mine !== generation || !root.classList.contains(PANEL_GLIDE_CLASS)) return
        settleAll()
        holdReservation(opening)
        armCarry()
      })
    })
    if (frame !== null) settleMo.observe(frame, { attributes: true, attributeFilter: ['style'] })
    if (scrollBody !== null) settleMo.observe(scrollBody, { attributes: true, attributeFilter: ['style'] })
  }

  /**
   * A workspace conversation is being switched.
   *
   * The session view is re-mounted, and the right-side reservation (`padding-right`
   * on `[data-conversation-scroll]`, published by dsh-pinned-summary and
   * dsh-widgets) comes back a frame LATER than the new view's first paint. The
   * content box is therefore the full track for one frame and the transcript is
   * painted at the no-reservation centre before snapping back — measured on a
   * 1706px window: the column is painted at 616px and lands at 466px, i.e. the
   * "small pan and back" that fires on every conversation switch.
   *
   * Holding the last published value for the length of the remount is the same
   * mechanism the toggle already uses (`holdReservation`): it is dropped by
   * `probeHold` the moment the owners publish, so it costs one read per frame at
   * worst and nothing at all when they are on time.
   */
  const onClickSession = (event: Event): void => {
    if (!root.classList.contains(PANEL_GLIDE_CLASS)) return
    const target = event.target
    if (!(target instanceof Element) || target.closest('[class*="sessionRow"]') === null) return
    // A conversation switch re-mounts the view and can close the panel in the same
    // commit. The frame's permanent `grid-template-columns` ease is there for the
    // LEFT toggle; letting it run over a switch turns the new view's first layout
    // into a 300ms grid tween, and measured through it the transcript is painted
    // 287px wide at 462px before settling on 748px at 466px — the "small pan and
    // back" on every switch. Switching conversations is not a motion the user asked
    // for, so any track transition that starts inside this window is finished at
    // once (see `finishSwitchTween`).
    switchAt = performance.now()
    const el = document.querySelector<HTMLElement>(RESERVATION_SELECTOR)
    if (el === null || hold !== null) return
    const current = readReservation(el)
    if (!(current > 0.5)) return
    hold = {
      el,
      value: current,
      previous: el.style.getPropertyValue('padding-right'),
      previousPriority: el.style.getPropertyPriority('padding-right'),
    }
    el.style.setProperty('padding-right', `${current}px`, 'important')
    holdDeadline = performance.now() + HOLD_MS
    window.requestAnimationFrame(probeHold)
  }

  /**
   * Finish any track tween a conversation switch started, before it paints.
   *
   * Only transitions that began within `SWITCH_WINDOW_MS` of a session-row click
   * are touched, so the left sidebar's own toggle keeps its ease and this module's
   * right-panel snap is untouched.
   */
  const finishSwitchTween = (): void => {
    if (!root.classList.contains(PANEL_GLIDE_CLASS)) return
    if (performance.now() - switchAt > SWITCH_WINDOW_MS) return
    const frame = document.querySelector<HTMLElement>(FRAME_SELECTOR)
    if (frame === null) return
    for (const animation of frame.getAnimations()) {
      if (!(animation instanceof CSSTransition)) continue
      // 200-300ms is the product's per-toggle ease; the gate's 1ms snap is not ours
      // to finish here.
      const duration = animation.effect === null ? 0 : Number(animation.effect.getTiming().duration)
      if (!(duration > 32)) continue
      animation.finish()
    }
  }
  switchMo = new MutationObserver(finishSwitchTween)
  const startSwitchWatch = (): void => {
    const frameEl = document.querySelector<HTMLElement>(FRAME_SELECTOR)
    if (frameEl === null || switchMo === null) return
    switchMo.observe(frameEl, { attributes: true, attributeFilter: ['style'] })
  }
  // The frame is normally mounted long before this module does; the retry covers a
  // first paint that has not happened yet.
  if (document.querySelector(FRAME_SELECTOR) === null) window.requestAnimationFrame(startSwitchWatch)
  else startSwitchWatch()

  document.addEventListener('click', onClick, true)
  document.addEventListener('click', onClickSession, true)
  return () => {
    document.removeEventListener('click', onClick, true)
    document.removeEventListener('click', onClickSession, true)
    if (holdTimer !== 0) window.clearTimeout(holdTimer)
    if (switchMo !== null) {
      switchMo.disconnect()
      switchMo = null
    }
    endToggle(true)
    root.removeAttribute(INSTANT_ATTR)
  }
}
