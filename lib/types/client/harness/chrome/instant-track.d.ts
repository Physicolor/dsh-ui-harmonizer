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
export declare const PANEL_GLIDE_CLASS = "enhc-panel-glide";
/**
 * Mount the right-panel motion. Returns the disposer `ctx.effect` wants; the
 * listener, the pending timer, the snap class, the carry and the reservation
 * hold all go away with it.
 */
export declare function mountInstantTrack(): () => void;
