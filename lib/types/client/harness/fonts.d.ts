/**
 * Font application on the product's official channels.
 *
 * The chosen stack is written as INLINE custom properties on `<body>` / `<html>`
 * publishing `--dsw-font-*` and the `--dsh-content-font-*` references. This is
 * deliberate: the tokens are declared by the theme inside a `<style>` tag that
 * the product appends AFTER our bundle's tag (measured: ours at head order 4,
 * the theme's at 25), so an equal-specificity stylesheet rule of ours loses no
 * matter when we rewrite it. Inline properties are order-independent and the
 * disposer removes them.
 */
import type { EnhancerState } from '../core/state-model.ts';
/** Remove every inline font property the plugin wrote. */
export declare function clearFontProps(): void;
/**
 * Apply the chosen font stack.
 * @param state - current enhancer state.
 */
export declare function applyFont(state: EnhancerState): void;
