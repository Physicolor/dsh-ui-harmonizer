/**
 * The AppFrame track's animation gate — a root class while the window is being resized.
 *
 * Layer: harness/chrome (DOM behaviour aimed at the DSH shell's own chrome).
 * Seams: the `<html>` root class the harness stylesheet keys on
 * (`harness/frame-column-transition.module.css`), i.e. our own root class plus the
 * window `resize` event — no private class names, no product internals.
 *
 * DSH 0.2.0 puts the frame's `transition: grid-template-columns …` behind
 * `[data-animating]`, and the component sets that attribute in a
 * `useLayoutEffect` on the SAME commit that writes the new inline track. CSS
 * Transitions start from the before-change style, which at that moment still
 * has `transition-property: all; duration: 0s` — so no transition ever starts
 * and the conversation column snaps to its new width in one frame (measured:
 * 1640px -> 776px in a single frame, no transitionrun/start/end on the frame,
 * `data-animating` cleared 600ms later by the component's fallback timer).
 *
 * The stylesheet (frame-column-transition.module.css) therefore keeps the transition
 * on the frame permanently. That is safe for every case the product itself excludes
 * (its `[data-dragging]` / `[data-rightbar-instant]` /
 * `[data-rightbar-fullscreen]` rules are more specific), EXCEPT the one it
 * guards in JS: a viewport change (`viewportChanged` in AppFrame skips
 * `setAnimating`), where an eased track would make the columns lag the window
 * edge while the user drags it.
 *
 * This module owns exactly that exception: while the window is being resized,
 * `<html>` carries `enhc-window-resizing` and the frame's transition is off.
 * The class is held for a settle window after the last resize event, because
 * the resize burst and the grid write are not ordered (the first event of a
 * drag can arrive after React already committed the new track) — a short hold
 * keeps the tail of a drag instant instead of easing.
 */
/**
 * Mount the resize exception. Returns the disposer `ctx.effect` wants; the
 * class, the listener and any pending timer all go away with it.
 */
export declare function mountFrameTrackTransition(): () => void;
