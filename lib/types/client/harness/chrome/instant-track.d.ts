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
export declare const PANEL_GLIDE_CLASS = "enhc-panel-glide";
/**
 * Mount the right-panel snap-and-cover. Returns the disposer `ctx.effect`
 * wants; the listener, the pending frame, the snap class and every live cover
 * all go away with it.
 */
export declare function mountInstantTrack(): () => void;
