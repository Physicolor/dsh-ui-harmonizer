/**
 * Unified native-title tooltips ("tooltip harmonizer").
 *
 * Layer: harness/chrome (DOM behaviour aimed at the DSH shell's own chrome).
 * Seams: the product's Tooltip design language, reproduced with official alias
 * tokens (`--dsw-alias-tooltip-bg`, `--dsw-static-neutral-bluish-00`,
 * `--ds-ease-in-out`) and the raw HTML `title` attribute; the only tag we write is
 * our own `<style data-plugin-css>`. No third-party private class names.
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
/**
 * Mount the unified title-tooltip behavior. Idempotent: a second call first
 * disposes the previous instance.
 * @returns disposer removing listeners, timers, the bubble and the style tag.
 */
export declare function mountTitleTooltips(): () => void;
