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
import * as React from 'react';
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
export declare function CenterColCard(): React.ReactElement;
