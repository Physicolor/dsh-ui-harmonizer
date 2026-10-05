/**
 * Right-panel toggle: snap the frame's grid track, then glide the content with
 * compositor-friendly covers.
 *
 * Layer: harness/chrome (DOM behaviour aimed at the DSH shell's own chrome).
 * Seams: `<html>` root classes the harness stylesheet keys on
 * (`harness/frame-column-transition.module.css`), the product's own
 * `data-sidebar-right-*` toggle attributes, and the two class-suffix hosts the
 * conversation is built from. No private module class names (all three
 * selectors are suffix/attribute matches, the same seam the rest of this plugin
 * uses).
 *
 * WHY THIS EXISTS
 *
 * `harness/frame-column-transition.module.css` keeps the AppFrame's
 * `grid-template-columns` transition permanently, because DSH 0.2.0 gates it
 * behind `[data-animating]` and sets that attribute on the same commit that
 * writes the new track — so the transition never starts and the conversation
 * snaps. That permanent tween is right for the LEFT panel, whose track change
 * costs one relayout. It is wrong for the RIGHT panel, because opening/closing
 * it rewrites a LAYOUT property across the whole frame:
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
 *       the compositor thread spends 0.6ms and the GPU thread 0ms, so nothing
 *       is lost to compositing or upload;
 *     - sampled at frame granularity the whole 226ms ease produced 3 frames
 *       (~13fps inside the window, 70-80fps outside it).
 *
 * So on a right-panel toggle the ease buys a 300ms glide at the cost of the
 * frame budget of the entire window. This module collapses the tween to a
 * single frame and re-adds the motion as covers:
 *
 *   - the transcript column `[class$='_column']` gets a `transform` cover
 *     (compositor property; probe V: `overflow: visible`, `position: static`,
 *     0 `position: fixed` descendants out of 10878, so it is the only host that
 *     can carry a transform without moving dsh-widgets' rail);
 *   - the composer capsule `[data-slot=conversation.composer.bar] [class*='_card']`
 *     gets a `left` cover. It CANNOT take a transform: its subtree contains
 *     `[data-slot=conversation.input.overlay]` -> `.dsx-stats-drawer` ->
 *     `.dsx-stats-drawer-zoom` -> `.dsx-stats-rail`, three `position: fixed`
 *     nodes, so a transform on this host rewrites their containing block and
 *     drags the rail into the viewport (measured: rail 1247 -> 553, and an
 *     inverse transform on the rail itself does not repair it — 1247 -> 412).
 *     `left` is a layout property, so it does not create a containing block and
 *     the fixed subtree stays put (measured: rail drift 0.0 at 60/150/240ms).
 *
 * The track is snapped by setting `data-enhc-instant` on `<html>` in a
 * CAPTURE-phase listener, i.e. before the product's own handler writes the new
 * track — a bubble-phase or observer-based gate is too late, because the
 * before-change style is already the after-change one by then. It is an
 * attribute rather than a class because the theme observer on `<html>`'s
 * `class` would rebuild the material layer on each write (measured 6.74ms); see
 * `INSTANT_ATTR`.
 *
 * Everything here is behaviour, not policy: whether any of it runs is decided
 * by the `enhc-panel-glide` root class, which `core/apply.ts` flips from the
 * Settings switch (a class is right for that one: it is written once per
 * settings change, not twice per toggle). The CSS gate is written against both
 * (`html.enhc-panel-glide[data-enhc-instant]`), so with the setting off this
 * module is inert twice over.
 *
 * NOT claimed: this does not make the right-panel toggle free. The snap still
 * costs one full-frame relayout (measured 227ms of blocking in the window,
 * against 272ms with the ease) — the residual is the product's, not this
 * module's. What it removes is the 300ms of per-frame relayout.
 *
 * WHY THE COVER RUNS ON THE PRODUCT'S OWN CLOCK
 *
 * The first cut of this module held the transcript's visual edge at its
 * pre-toggle position while it waited for the layout to settle (a rAF hold plus
 * a ResizeObserver re-pin) and only then eased to the resting value. Sync-anchor
 * probing (four arms, ON/OFF x open/close) showed that is wrong twice over:
 *
 *   - it starts LATE. The hold released only after two stable readings; on a
 *     long conversation the click blocks the thread (~180ms measured), so the
 *     cover was created with `elapsed ~= 180ms` and its ease was compacted into
 *     the old `MIN_COVER_MS = 120` floor. Measured glide window: 616 -> 600 ->
 *     538 -> 431 -> 324 -> 312 px over ~150ms, against the panel's own 300ms;
 *   - it moves the transcript the WRONG WAY FIRST. The pin writes
 *     `before - layout` after the frame has already snapped the track, so the
 *     column is dragged back out over the panel (measured +304px here) for the
 *     whole hold. That is the "flash, then slide" report: the panel is already
 *     at its resting place while the transcript is still painted on top of it.
 *
 * The product states the invariant this module has to meet (the `data-animating`
 * doc block in AppFrame): "Track and panel travel on one shared curve only while
 * animating ... an occupant that used its own would detach the panel's edge from
 * the conversation's while squeezing." Both the track and the occupant read
 * `--ds-transition-duration-slow` (0.3s) and `--ds-ease-in-out`
 * (`cubic-bezier(0.4, 0, 0.2, 1)`). Snap-and-cover is only compliant if the
 * cover runs that same 300ms on that same curve, starting when the layout
 * actually moves.
 *
 * So: the cover is armed on the first frame the layout is seen to move, it
 * always runs the FULL `COVER_MS`, and it has no hold and no re-pin. The offset
 * eases from `before - layout` to `0`, which makes the first covered frame
 * identical to the pre-toggle position and the last covered frame identical to
 * whatever the layout rests at — nothing is predicted and no frame is painted
 * outside the corridor between the two.
 *
 * WHY THE SEED IS CORRECTED AND THE PROGRESS IS NOT
 *
 * The transcript's snapped layout is not immediately final: the column's own
 * `max-width` catches up in a LATER TASK OF THE SAME FRAME (measured on close:
 * the centre track is already back to 1427px while the column still reports a
 * centred edge of 670px, then 616px once `max-width` has been committed). A
 * `getBoundingClientRect()` in the driver's rAF callback forces a flush, so it
 * reads the first value, but the frame is PAINTED against the second one — the
 * offset seeded from the transient then paints the transcript 54px outside its
 * corridor (`visual = 616 + (-358) = 258px` against a 312..616px corridor).
 *
 * Holding the visual edge until the layout looked settled (the previous
 * design's `hold`/`pin`) removed that pop but reintroduced the flash, because
 * waiting for two stable readings cost ~180ms. So the seed is corrected
 * instead, and it is corrected in the one place that is guaranteed to run after
 * layout and before paint and to fire exactly when the value changes: a
 * ResizeObserver on the host (`max-width` changes the column's border box; the
 * composer capsule changes width for the same reason).
 *
 * The correction re-derives `from = before - layout` from the LIVE box and
 * re-seats the running animation's keyframes, keeping its clock (`setKeyframes`
 * does not restart it). Because the keyframes are `from -> 0`, the painted
 * offset is `(1 - progress) * from`, so the layout can be recovered from the
 * painted box by taking that offset back out — no re-pin, no second driver.
 * What the correction must NOT do is touch the progress: re-seating `from` so
 * that `layout + (1 - p) * from == before` would freeze the transcript for the
 * whole ease, which is the hold this design exists to avoid. Re-seating it to
 * `before - layout` makes the painted box `before + p * (layout - before)` for
 * whatever the layout currently is, so a transient shows up as a slightly wrong
 * ENDPOINT ESTIMATE that the next correction fixes, never as a jump.
 *
 * WHY THE GATE IS FINISHED, NOT SKIPPED
 *
 * With the cover armed on the ResizeObserver the motion itself was right, but
 * it was one frame LATE: measured on an open (long conversation, loaded thread)
 * the dock's slide took `startTime` 94.6ms after the click and the transcript
 * cover 219.8ms, against a 151.7ms worst frame gap — one frame, and on this
 * thread a frame is ~100ms.
 *
 * The frame is the gate's own duration. `0.001s` is deliberate (a transition is
 * what publishes the `transitionrun` beat dsh-widgets' rail yield reads,
 * measure.ts:161-167, and `0s` — i.e. no transition at all — costs that beat),
 * but a NON-ZERO duration also means the computed value is still the OLD one
 * for the whole rendering step that starts the transition: measured in
 * isolation, `transition: width 0.001s` reads 700px in the step that writes
 * 200px and 200px only in the next one. So the step whose paint should hold the
 * transcript still does not lay the new track out, no box changes, no
 * ResizeObserver delivery happens in it — while the product's panel slide needs
 * no layout and starts in that very step.
 *
 * Finishing the gate's transitions in the microtask that follows the product's
 * own track write settles the value inside that same task, so the layout, the
 * product's own ResizeObserver, both covers and the slide all land in ONE
 * rendering step. The transition still runs and still dispatches
 * `transitionrun`/`transitionstart`/`transitionend`, which is the whole point of
 * keeping it (`finish()` in a `MutationObserver` callback on the writing task
 * reads the new value in that task and still emits run/start/end — verified in
 * isolation before this was written).
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
 * The product slides its right-hand occupant on CLOSE (the closed-state rule
 * carries `transform: translateX(--dsh-sidebar-width)` and the open-state rule
 * puts `transition: transform` on the same elements) but not on OPEN: the dock
 * is mounted *by* the commit that also sets `data-sidebar-right-open`, so its
 * first computed style is already the open one and there is no before-change
 * style for the transition to start from. Measured: four open arms, no
 * `transform` animation on `[data-dockkit-host="dock"]`, the element inserted
 * directly at its resting rect. The panel therefore *pops* while the transcript
 * eases — the two halves of the product's own "one shared curve" contract
 * disagree. `frame-column-transition.module.css` uses this attribute to run the
 * missing half as a keyframe slide, which needs no before-change style.
 *
 * It is tracked separately from the instant gate so the slide can never be
 * applied to a CLOSE, where the occupant is already animating on the product's
 * own transition. Like that gate it is an attribute, not a class, for the
 * measured `refreshMaterial` cost documented on `INSTANT_ATTR`.
 */
const OPENING_ATTR = 'data-enhc-opening'

/**
 * When the release FIRST runs, counted from the click — and not a lifetime.
 *
 * It has to be late enough that the product's commit has landed (the frame's
 * track write is measured 30-50ms after the click, but on a starved thread the
 * whole commit has run as late as ~178ms) and early enough that the snap's
 * `transition-duration: 0.001s` is off the frame and the viewport well before
 * their next legitimate transition. If the covers or the OPEN slide are still
 * moving at this point the release defers (see `release`), so this value does
 * not truncate them.
 */
const HOLD_MS = 420

/**
 * The cover's clock, in ms — the product's own `--ds-transition-duration-slow`.
 *
 * Deliberately NOT compacted for the time the snap spends blocking the thread:
 * the panel and the track run their own 300ms from the moment they are written,
 * so a shorter cover is what detaches the transcript from them.
 */
const COVER_MS = 300

/** The product's own `--ds-ease-in-out`. */
const COVER_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

/** The product's right-panel toggle and its collapsed-state affordance. */
const TOGGLE_SELECTOR = '[data-sidebar-right-toggle],[data-sidebar-right-expand]'

/** AppFrame's grid, which carries the collapsed marker and the inline track. */
const FRAME_SELECTOR = '[class$="_frame"]'

/**
 * The conversation viewport, whose box follows the frame's centre track.
 *
 * Included in the gate because on the CLOSE direction it is the second half of
 * the same squeeze: the track is instantly 1427px wide while the viewport's own
 * easing is still on the old padding, so the content box is momentarily the
 * full width and the column centres away from its track (measured per frame
 * 312 -> 647 -> 325 -> 368 -> 386; the OFF arm is monotone 312 -> 336 -> 364 ->
 * 383 -> 386, where track and padding ease together). Collapsing both keeps the
 * layout in agreement at every frame, which is what makes the cover's `from`
 * the true displacement (-74px) instead of a transient (-344px).
 *
 * In the sessions measured for this change the viewport's `padding-right` never
 * left 0px and the settle microtask never found a transition on it, i.e. the
 * rule is inert there and only bites when a rail does squeeze the viewport —
 * which is why it is kept: inert is free, and the disagreement it prevents is
 * exactly one frame of a wrong centre.
 */
const SCROLL_SELECTOR = '[class$="_scrollBody"]'

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
 * 300ms the slide and the covers then run, so 400ms of margin keeps the whole
 * deferral inside 820ms of the click.
 */
const RELEASE_MAX_WAIT_MS = 400

/**
 * How often the deferred release re-asks whether anything is still moving.
 *
 * A poll and not an event: the things being waited for are three different
 * objects (two covers and the product's slide), and each of them already stops
 * on its own. There is no single event to hang the release on, and the covers
 * report through their own clock.
 *
 * One frame, because this is the only cost of the wait: every poll that finds
 * motion still schedules again, and the gate stays up until one finds none. The
 * gate is not free while it is up — `data-enhc-opening` keeps the stylesheet's
 * `animation: enhc-panel-glide-in ... both` on the dock, i.e. a finished
 * animation holding a composited transform for as long as the release is late.
 * At 60ms that measured a 72.6ms tail past `animationend` on a calm run and
 * 237ms on the starved one; at one frame it is a tail of one frame.
 */
const RELEASE_POLL_MS = 16

/**
 * A transition this short is the gate's own; the product's are 200-300ms.
 *
 * The gate's duration is `0.001s` (see the stylesheet), so anything under a
 * frame is the snap and nothing else.
 */
const SETTLE_MAX_MS = 2

/** Transcript column — `xz4KEq_column`; the only transform-safe cover host. */
const PROSE_SELECTOR = '[class$="_column"]'

/**
 * The conversation header, whose right edge rides the same track change.
 *
 * Its left edge is pinned to the left column and its right edge is the panel's,
 * so it is the one host covered by WIDTH rather than by position; the pair of
 * selectors is the same pair the header stylesheet anchors on, so the two
 * halves cannot drift apart. Anchored on the slot the product guarantees, never
 * on a hashed module class.
 */
const HEADER_SELECTOR =
  "[data-slot='conversation.header'] > header:has([class$='_titleCluster'] > [class$='_tabs']), [data-slot='conversation.session.header'] > header"

/** The element that paints the input capsule inside the composer bar. */
const COMPOSER_SELECTOR = '[data-slot="conversation.composer.bar"] [class*="_card"]'

/**
 * How long the layout change may take before the cover is given up.
 *
 * This is a time budget, not a frame count, because the snap itself blocks the
 * main thread: measured on a long conversation the click froze the thread for
 * ~178ms, so no frame ran at all in that window and a `4`-frame budget was
 * consumed before the new geometry was even readable.
 */
const DEADLINE_MS = 600

/** Upper bound on the polling ticks, in case frames come far faster than rAF. */
const MAX_TRIES = 60

/** One running cover, kept so a new toggle (or dispose) can cancel it. */
interface Glide {
  /** Stop the driver and drop every style this cover wrote. */
  stop: () => void
  /** Is the ease still moving pixels? (`stop` is idempotent, this is not an exit.) */
  busy: () => boolean
}

/**
 * Read an element's left edge, or null when it is gone.
 *
 * Both callers read a host that has no cover of its own yet: `releaseCovers()`
 * runs at the top of the click and a new cover is only created after both hosts
 * have been read, so the value here is always the layout's, never an in-flight
 * cover's.
 *
 * @param el - candidate element.
 * @returns the viewport-space left edge in px, or null.
 */
function leftOf(el: HTMLElement | null): number | null {
  if (el === null || !el.isConnected) return null
  return el.getBoundingClientRect().left
}

/**
 * Which property a cover drives.
 *
 * `left` and `transform` are the positional mode: both hold a box painted where
 * it was and ease it to where the layout now is, and both end at the identity,
 * so releasing the cover cannot snap. They differ only in whether the offset is
 * a layout offset (`left`, which needs a positioned box but does NOT create a
 * containing block, so `position: fixed` descendants are untouched) or a paint
 * offset (`transform`, which does create one).
 *
 * `width` is the sizing mode, for a host whose LEFT edge is pinned and whose
 * right edge is what travels — the conversation header, whose left edge is the
 * left column's edge and whose right edge is the panel's. Its endpoint is the
 * layout width, not the identity, so it is only valid where that width is known
 * to be final by the time the cover arms; see `startCover`.
 */
type CoverProperty = 'left' | 'transform' | 'width'

/**
 * Cover one host whose layout has just moved: keep it painted where it was,
 * then ease it to where the layout now is.
 *
 * Called on the first frame the driver sees movement, and every write it makes
 * happens inside that frame's callback, i.e. before the frame is painted — so
 * the snapped layout is never painted uncovered and no hold is needed to hide
 * it.
 *
 * ON THE `width` MODE. The header cannot be covered positionally, because the
 * thing that moves inside it does not move by one offset: the right-anchored
 * buttons travel the panel's whole width while the badges and tabs travel only
 * the distance the title gives up, and the title itself does not move at all —
 * it changes width. Covering the pool of hosts that have no `position: fixed`
 * descendant (`_headerUtilities`, `_headerActions`, the tab strip) was the
 * first design and it still left the title to truncate instantly, because a
 * relative offset cannot stretch a box. Covering the header's own width does
 * all of it at once: measured, setting `header.style.width` back to its closed
 * value while the panel is open reproduces the closed header exactly — header
 * `280,1427,50`, title column 212px, tab strip `867.5,139,26` against the open
 * state's `280,659,78` / 41.5px / `697,87,58`.
 *
 * `width` also skips the reseat observer below, deliberately. Reseat exists to
 * re-derive a seed from a still-moving layout, and it can do that for a
 * positional cover because the identity endpoint lets the painted value be
 * un-blended (`painted - (1 - progress) * keyFrom`). A width cover has no such
 * endpoint — the layout width IS the far keyframe — so the same arithmetic
 * would only recover the value it wrote. Nothing is lost: `settleTransitions`
 * commits the frame's track inside the click's own task, and the width being
 * covered is that track's. If the arm ever did land on a stale width, `from`
 * reads under 0.5px and no cover is created — the failure is "no glide this
 * once", never a wrong glide.
 *
 * @param element - the box to offset, or to resize when `property` is `width`.
 * @param property - which mechanism this host allows.
 * @param before - px left edge (positional) or width (`width`) captured before
 *   the toggle.
 * @returns the cover record, or null when nothing should run.
 */
function startCover(
  element: HTMLElement,
  property: CoverProperty,
  before: number,
): Glide | null {
  const sizing = property === 'width'
  // `left` only offsets a positioned box. Forcing `relative` here is safe
  // because the very measurement that chose `left` over `transform` is the one
  // that found the fixed widgets subtree inside this host.
  const position =
    property === 'left' && getComputedStyle(element).position === 'static'
      ? element.style.position
      : null
  if (property === 'left' && position !== null) element.style.position = 'relative'
  const inline = property === 'transform' ? element.style.transform : property === 'width' ? element.style.width : element.style.left

  let animation: Animation | null = null
  let ro: ResizeObserver | null = null
  let released = false

  const stop = (): void => {
    if (released) return
    released = true
    if (ro !== null) {
      ro.disconnect()
      ro = null
    }
    if (animation !== null) {
      // The last keyframe is the layout's own value, so cancelling here is
      // invisible — and it is what keeps the finished animation out of
      // `document.getAnimations()` and drops the `fill: 'both'` hold.
      animation.cancel()
      animation = null
    }
    if (property === 'transform') element.style.transform = inline
    else if (sizing) element.style.width = inline
    else element.style.left = inline
    if (position !== null) element.style.position = position
  }

  const rect = element.isConnected ? element.getBoundingClientRect() : null
  if (rect === null) {
    stop()
    return null
  }
  const seeds = sizing ? rect.width : rect.left
  const from = before - seeds
  if (!(Math.abs(from) > 0.5)) {
    stop()
    return null
  }

  /**
   * The value to write for a given distance from the current layout.
   *
   * The positional modes animate their own offset and end at the identity;
   * `width` animates an absolute width and ends at the layout's, which is why
   * the seed is added back in here and nowhere else.
   *
   * @param offset - `from` for the pre-toggle geometry, 0 for the post-toggle.
   * @returns the property value for that keyframe.
   */
  const valueOf = (offset: number): string =>
    property === 'transform'
      ? `translateX(${offset}px)`
      : sizing
        ? `${seeds + offset}px`
        : `${offset}px`

  // Write the offset first so the animation takes over from the identical
  // value: the two happen in one task, so no frame can see the seam.
  if (property === 'transform') element.style.transform = valueOf(from)
  else if (sizing) element.style.width = valueOf(from)
  else element.style.left = valueOf(from)

  animation = element.animate(
    [{ [property]: valueOf(from) }, { [property]: valueOf(0) }],
    { duration: COVER_MS, easing: COVER_EASING, fill: 'both' },
  )

  /**
   * Re-derive the seed from the LIVE box, for as long as the snapped layout is
   * still moving under us.
   *
   * The seed is captured the moment the layout is first seen to move, and on
   * close that moment is not the layout's final value: the centre track is
   * already back to its full width while the column is still at its
   * still-constrained `max-width`, so the edge read there is a transient
   * (measured 670px) and the settled one is 616px. Seeding from the transient
   * writes a 54px-too-large offset, and the frame that paints the settled
   * layout paints it 54px outside the corridor (measured `616 - 358 = 258px`
   * against a `312..616px` corridor) — the "flash" half of the report.
   *
   * A ResizeObserver is the correction point because it fires exactly when
   * `max-width` changes the host's box and it is guaranteed to run after layout
   * and before paint, i.e. in the frame that would otherwise paint the bad
   * value.
   *
   * The keyframes run `keyFrom -> 0`, so the painted offset at any instant is
   * `(1 - progress) * keyFrom`; taking that back out of the painted box leaves
   * the layout, with no second driver and no read-back of our own writes. Only
   * the seed is re-seated — `setKeyframes` keeps the clock — so the ease
   * continues without a restart and without a hold.
   */
  let keyFrom = from
  const reseat = (): void => {
    if (released || animation === null) return
    const effect = animation.effect
    if (!(effect instanceof KeyframeEffect)) return
    const progress = effect.getComputedTiming().progress
    if (typeof progress !== 'number') return
    const painted = element.getBoundingClientRect().left
    const layout = painted - (1 - progress) * keyFrom
    const next = before - layout
    if (!(Math.abs(next - keyFrom) > 0.5)) return
    keyFrom = next
    effect.setKeyframes([{ [property]: valueOf(next) }, { [property]: valueOf(0) }])
  }
  // Positional covers only — see the note on the `width` mode above: a width
  // cover has no identity endpoint to un-blend, so there is nothing for this
  // observer to re-derive.
  if (!sizing) {
    ro = new ResizeObserver(reseat)
    ro.observe(element)
  }

  // Ending at the identity means the release below can never snap: the layout
  // is the endpoint, whatever it settled to while the ease was running.
  animation.finished.then(stop, () => { /* cancelled or replaced */ })
  /**
   * Still moving pixels?
   *
   * The driver's own clock, not a timer of ours: `released` flips when the ease
   * finishes (or is cancelled), so this is exactly "the gate still has an
   * unfinished cover to protect" — the condition the release waits for.
   */
  const busy = (): boolean => !released
  return { stop, busy }
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
 * the animation being slightly late again, with nothing to explain it.
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
 * click does not lay the new track out — measured in isolation, a
 * `transition: width 0.001s` writes 200px and reads 700px in the same step.
 *
 * `finish()` moves the transition to its end without cancelling it, so
 * `transitionrun`/`transitionstart`/`transitionend` are all still dispatched
 * (measured: identical event list with and without the call) while the computed
 * value becomes the new one inside THIS task. The layout, the product's own
 * ResizeObserver, the covers and the panel's slide then land on one frame
 * instead of two.
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
        // failure mode is otherwise invisible: the covers would silently arm a
        // frame late (the desync this function exists to remove) and nothing in
        // the page would say why.
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
 * Mount the right-panel snap-and-cover. Returns the disposer `ctx.effect`
 * wants; the listener, the pending frame, the snap class and every live cover
 * all go away with it.
 */
export function mountInstantTrack(): () => void {
  const root = document.documentElement
  let holdTimer = 0
  let frameHandle = 0
  let covers: Glide[] = []
  /** Observes the two cover hosts for the current click; replaced each toggle. */
  let motionRo: ResizeObserver | null = null
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
   * `frameHandle` is a single slot, so a click overwrites the previous click's
   * pending frame and can no longer cancel it. That orphaned `step` then runs
   * against the layout of a LATER click: it sees movement, creates a cover, and
   * captures the inline style of the moment — which is whatever the newer
   * click's cover had already written. When that orphan cover is finally
   * stopped it "restores" the borrowed value as if it were the original,
   * leaving the transcript permanently offset (measured: 9 clicks at 130ms left
   * `transform: translateX(-230px)` and `left: -230px` behind). Every `step`
   * therefore carries the token it was born with and bails once a newer click
   * has made it stale.
   */
  let generation = 0
  /**
   * When the release stops waiting for motion that has not finished.
   *
   * A release that waits is only safe with a hard cap: the OPEN slide is
   * started by a selector this module cannot verify up front (a fullscreen
   * presentation, a narrow window with no room for the dock, an option flipped
   * off mid-flight), and a gate left up forever would squash the product's own
   * 300ms transitions for good.
   */
  let releaseDeadline = 0

  const releaseCovers = (): void => {
    for (const cover of covers) cover.stop()
    covers = []
    if (motionRo !== null) {
      motionRo.disconnect()
      motionRo = null
    }
    if (settleMo !== null) {
      settleMo.disconnect()
      settleMo = null
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
   * Drop the gate and every cover it owns.
   *
   * Deferred while anything is still moving, and that is the fix for a visible
   * truncation: `HOLD_MS` is counted from the CLICK, while the OPEN slide
   * cannot start before the product's commit mounts the dock and the covers
   * cannot start before the settled layout is readable — both measured 180-265ms
   * later. Releasing on the click's clock therefore cancelled the slide at
   * `currentTime 254.7/300` (84.9%, with no `animationend` at all) and the dock
   * snapped from `translateX(10.35px)` straight to `none`; the covers, which
   * run the same 300ms from the same late start, were cut by the same margin.
   *
   * The INSTANT gate is NOT deferred. Its whole job is the one-frame snap of the
   * track, which is already done by the time this first runs, and leaving
   * `transition-duration: 0.001s !important` on the frame and the viewport would
   * squash any unrelated transition that happens to start in the meantime (the
   * rail's yield writes the viewport's padding). Only the OPEN slide waits.
   */
  const release = (): void => {
    holdTimer = 0
    // The snap is over, so the observer that settles its transition has nothing
    // left to watch.
    if (settleMo !== null) {
      settleMo.disconnect()
      settleMo = null
    }
    root.removeAttribute(INSTANT_ATTR)
    const moving = covers.some((cover) => cover.busy()) || slideRunning()
    if (moving && performance.now() < releaseDeadline) {
      holdTimer = window.setTimeout(release, RELEASE_POLL_MS)
      return
    }
    // Stopping the covers here (rather than leaving them to their own
    // `finished` handler) is what drops the motion ResizeObserver with the
    // gate. It is only reached once they have stopped moving themselves, or
    // once the deadline says waiting has become the bigger risk.
    releaseCovers()
    root.removeAttribute(OPENING_ATTR)
  }

  /**
   * One toggle: snap the track now, cover the boxes that moved the moment they
   * move.
   * @param event - the capture-phase click.
   */
  const onClick = (event: Event): void => {
    if (!root.classList.contains(PANEL_GLIDE_CLASS)) return
    const target = event.target
    if (!(target instanceof Element) || target.closest(TOGGLE_SELECTOR) === null) return
    const frame = document.querySelector<HTMLElement>(FRAME_SELECTOR)
    const opening = openingFrom(frame)

    releaseCovers()
    generation += 1
    const mine = generation
    const prose = document.querySelector<HTMLElement>(PROSE_SELECTOR)
    const composer = document.querySelector<HTMLElement>(COMPOSER_SELECTOR)
    const header = document.querySelector<HTMLElement>(HEADER_SELECTOR)
    // Read BEFORE the product's own handler writes the new track: the captures
    // run first, so these are still the pre-toggle edges — and for the header
    // that is the only moment its closed width exists, because the track change
    // itself is one synchronous layout away.
    const proseBefore = leftOf(prose)
    const composerBefore = leftOf(composer)
    const headerBefore =
      header !== null && header.isConnected ? header.getBoundingClientRect().width : null

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
    // deadline is what bounds the asking. The margin over it covers a cover
    // that starts as late as the slide does (measured 180-265ms after the
    // click) and then runs its own 300ms.
    releaseDeadline = performance.now() + HOLD_MS + RELEASE_MAX_WAIT_MS
    holdTimer = window.setTimeout(release, HOLD_MS)

    const startedAt = performance.now()
    let tries = 0
    /**
     * Hosts that already carry a cover for THIS click.
     *
     * Two independent arming channels feed `arm`, and both legitimately fire for
     * the same toggle: the ResizeObserver (which catches the box change in the
     * frame that made it, before that frame paints) and the rAF poll (which
     * covers a shift that changed no box size). The second one to arrive must
     * not stack a second, competing ease on the same host.
     */
    const armed = new Set<HTMLElement>()

    const arm = (host: HTMLElement | null, property: CoverProperty, before: number | null): void => {
      if (host === null || before === null || armed.has(host)) return
      const cover = startCover(host, property, before)
      if (cover === null) return
      armed.add(host)
      covers.push(cover)
    }
    const armAll = (): void => {
      // The other hosts may be gone (empty conversation, replaced composer); a
      // cover for one of them is simply skipped. Each successful cover measures
      // its own host.
      arm(prose, 'transform', proseBefore)
      arm(composer, 'left', composerBefore)
      // The header is sized, not moved: everything inside it — the title's
      // width, the badges, the tab strip, the right-hand buttons — is a
      // consequence of this one box, so covering it covers all of them.
      arm(header, 'width', headerBefore)
    }

    /**
     * Arm on the box change itself.
     *
     * ResizeObserver delivery happens after layout and BEFORE paint of the very
     * frame that changed the box, so a cover armed here is always written in
     * time: the frame that first holds the new geometry is the frame that first
     * paints the held edge, and no frame can paint the jump uncovered. The rAF
     * poll below cannot promise that — it only runs if a frame happens to come
     * up between the layout change and the paint that follows it, and on a
     * loaded main thread (measured 107ms between frames) that window is exactly
     * what is lost.
     */
    if (motionRo !== null) motionRo.disconnect()
    motionRo = new ResizeObserver(() => {
      if (mine !== generation || !root.classList.contains(PANEL_GLIDE_CLASS)) return
      armAll()
    })
    if (prose !== null) motionRo.observe(prose)
    if (composer !== null) motionRo.observe(composer)
    // The header is its own reason to arm: a conversation with no transcript
    // column and no composer (an empty session) still has a header, and its
    // toggle still moves it. Re-arming is impossible — `armed` holds the header
    // from the first delivery — so the frames this observer delivers while the
    // cover runs cost one set lookup each.
    if (header !== null) motionRo.observe(header)

    // The layout the product is about to write is only one rendering step away
    // — but "one step" is one frame too many, because the panel's slide is
    // started by that same commit while the gate's transition withholds the new
    // track until the step after. Settling it here, in the microtask that
    // follows the write, is what puts the two halves of the motion on one
    // frame; see `settleTransitions`.
    if (settleMo !== null) settleMo.disconnect()
    settleMo = new MutationObserver(() => {
      if (mine !== generation || !root.classList.contains(PANEL_GLIDE_CLASS)) return
      // Both hosts are settled on every delivery: the product writes the frame's
      // track and the viewport's padding in two batches, and whichever one
      // arrives second would otherwise leave the first host's tween running for
      // a frame. Settling an already-settled transition is a no-op, and
      // `armAll` is idempotent (each host is armed once).
      const settled = settleTransitions([frame, document.querySelector<HTMLElement>(SCROLL_SELECTOR)])
      // Only a settled gate proves the layout is final NOW; a delivery with
      // nothing to settle (an unrelated inline-style write, or the gate off)
      // must not shortcut the two channels that know better.
      if (settled > 0) armAll()
    })
    if (frame !== null) settleMo.observe(frame, { attributes: true, attributeFilter: ['style'] })
    const scrollBody = document.querySelector<HTMLElement>(SCROLL_SELECTOR)
    if (scrollBody !== null) settleMo.observe(scrollBody, { attributes: true, attributeFilter: ['style'] })

    const step = (): void => {
      frameHandle = 0
      // A newer click owns the driver now; this frame must not write styles.
      if (mine !== generation || !root.classList.contains(PANEL_GLIDE_CLASS)) return
      tries += 1
      const proseNow = leftOf(prose)
      const composerNow = leftOf(composer)
      const proseMoved = proseNow !== null && proseBefore !== null && Math.abs(proseNow - proseBefore) > 0.5
      const composerMoved = composerNow !== null && composerBefore !== null && Math.abs(composerNow - composerBefore) > 0.5
      // The header's PAINTED width, which is the only one this poll can see:
      // once its cover is armed this reads the ease rather than the layout, and
      // one frame of the ease is already more than the half-pixel that counts as
      // movement. That is what this channel is for.
      const headerNow = header === null || !header.isConnected ? null : header.getBoundingClientRect().width
      const headerMoved = headerNow !== null && headerBefore !== null && Math.abs(headerNow - headerBefore) > 0.5
      const moved = proseMoved || composerMoved || headerMoved
      // The product commits the track synchronously in this same task, but the
      // commit itself can block this thread for a long time — measured ~178ms on
      // a long conversation — so "not moved yet" is only re-polled until the
      // snap has had its chance, then given up on. No cover exists yet, so
      // these reads are always the layout's.
      if (!moved && tries < MAX_TRIES && performance.now() - startedAt < DEADLINE_MS) {
        frameHandle = window.requestAnimationFrame(step)
        return
      }
      if (!moved) return
      armAll()
    }
    frameHandle = window.requestAnimationFrame(step)
  }

  document.addEventListener('click', onClick, true)
  return () => {
    document.removeEventListener('click', onClick, true)
    if (frameHandle !== 0) window.cancelAnimationFrame(frameHandle)
    if (holdTimer !== 0) window.clearTimeout(holdTimer)
    releaseCovers()
    root.removeAttribute(INSTANT_ATTR)
    root.removeAttribute(OPENING_ATTR)
  }
}
