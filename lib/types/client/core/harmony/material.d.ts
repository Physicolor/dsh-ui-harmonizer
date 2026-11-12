/**
 * Material detection: does the interface currently read as opaque or glass?
 * Derived from the live semantic tokens, never from a plugin's identity.
 */
/**
 * Parse a CSS color and decide whether it is meaningfully translucent.
 *
 * Themes express glass by replacing the semantic tokens with semi-transparent
 * values (`ctx.theme.overrideTokens`), so the tokens themselves are the one
 * honest signal — plugin identity is not. Unresolved values (`var(...)`,
 * `color-mix(...)`) are treated as opaque: guessing there would flip the
 * material on a token that simply had not been computed yet.
 * @param value - the computed custom property value.
 * @returns true when the value resolves to alpha < 0.98.
 */
export declare function isTranslucent(value: string): boolean;
/**
 * Read the material state from the live tokens.
 * @returns true when the base/layer surfaces are translucent.
 */
export declare function detectGlass(): boolean;
