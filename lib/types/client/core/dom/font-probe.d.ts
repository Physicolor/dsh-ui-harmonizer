/**
 * Font-installed probe — pure DOM, no React.
 *
 * Layer: core (infrastructure). No `--dsw-*` token is read here and no CSS is
 * involved: the answer comes from canvas text metrics alone, so this module is
 * safe to call from any surface (settings row, Doctor, a future diagnostics
 * page). Moved verbatim out of `components.tsx`.
 */
/**
 * Whether a font family is installed, measured by comparing rendered text
 * width against two different baselines. `document.fonts.check` reports true
 * for unknown families in Chromium, so it cannot answer this question, and a
 * single baseline gives false negatives when the family happens to be the
 * platform's default for that generic (measured: Consolas is Chromium's
 * default `monospace` on Windows, so a monospace baseline alone reported it
 * missing).
 * @param family - family name to test (the preset's first entry).
 * @returns true when the family resolves differently from either baseline.
 */
export declare function isFamilyInstalled(family: string): boolean;
