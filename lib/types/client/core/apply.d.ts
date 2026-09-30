/**
 * State and CSS application for dsh-ui-harmonizer.
 *
 * Three channels push values into the page:
 * - Static override rules in enhancer.module.css read CSS custom properties
 *   (--enhancer-*) which applyState() updates on <html>.
 * - Content font size is NOT owned here any more. DSH 0.1.5 ships its own
 *   content-size row (`ui-theme` namespace, field `fontSize`) and publishes it
 *   as an inline `--dsh-content-font-size` on <body>; our rules derive from
 *   that variable in CSS (`calc(...)`), so one owner, no double source.
 * - The chosen font stack is applied through INLINE custom properties on
 *   <body> / <html>. This is deliberate: the tokens are declared by the theme
 *   inside a `<style>` tag that the product appends AFTER our bundle's tag
 *   (measured: ours at head order 4, the theme's at 25), so an equal-specificity
 *   stylesheet rule of ours loses no matter when we rewrite it. Inline
 *   properties are order-independent and the disposer removes them.
 */
import type { EnhancerState } from './state-model.ts';
/**
 * Push the current state into the page and persist it. Idempotent; safe to call
 * on every slider move.
 * @param state - current enhancer state.
 */
export declare function applyState(state: EnhancerState): void;
/**
 * Dispose everything this module wrote: the inline font properties, the root
 * custom properties and the card class. Called from the plugin fiber's effect
 * disposer so stopping/updating the plugin leaves zero residue.
 */
export declare function disposeDynamicStyle(): void;
