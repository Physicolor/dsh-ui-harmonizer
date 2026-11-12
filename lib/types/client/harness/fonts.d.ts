/**
 * Font application on the product's official channels.
 *
 * The chosen stack is written as INLINE custom properties on `<body>`
 * publishing `--dsw-font-*` and the `--dsh-content-font-*` references. This is
 * deliberate: the tokens are declared by the theme inside a `<style>` tag that
 * the product appends AFTER our bundle's tag (measured: ours at head order 4,
 * the theme's at 25), so an equal-specificity stylesheet rule of ours loses no
 * matter when we rewrite it. Inline properties are order-independent and the
 * disposer removes them.
 *
 * WHERE the whole-UI family is written is load-bearing, and the target element
 * moved in DSH 0.2.1: the theme used to fix `--dsw-font-family` at `:root`, so
 * an inline property on `<html>` won. 0.2.1 declares it in a `body{…}` rule
 * instead —
 *
 *   :root { --dsw-font-family: var(--dsh-font-family-text-default); … }
 *   body  { --dsw-font-family: var(--dsh-font-family-text, var(--dsh-font-family-text-default)), … }
 *
 * — and a declaration on `body` beats anything inherited from `<html>`, whatever
 * the inline origin. Measured on 0.2.1-rc.2 (live GUI, 2026-10-17): writing
 * `--dsw-font-family` inline on `<html>` left `getComputedStyle(body).fontFamily`
 * at the product default, while the same write on `<body>` — or the official
 * `--dsh-font-family-text` on either element — took effect. The whole-UI scope
 * therefore writes `<body>`, and also publishes the product's own role channel
 * so every rule that reads it directly agrees with the resolved token.
 *
 * A mono preset owns the product's code role the same way (`--dsh-font-family-code`
 * plus the `--ds-font-family-code` token the theme resolves from it).
 *
 * The resolved token is the load-bearing write: the product's own settings
 * applier CLEARS the role variable when its font field is empty (measured on
 * 0.2.1-rc.2 — our inline `--dsh-font-family-text` read back empty after a
 * reload that applied the stack correctly, while `--dsw-font-family` survived).
 * Publishing the role variable too keeps the two channels agreeing wherever the
 * product does not clear it.
 */
import type { EnhancerState } from '../core/state-model.ts';
/** Remove every inline font property the plugin wrote. */
export declare function clearFontProps(): void;
/**
 * Apply the chosen font stack.
 * @param state - current enhancer state.
 */
export declare function applyFont(state: EnhancerState): void;
