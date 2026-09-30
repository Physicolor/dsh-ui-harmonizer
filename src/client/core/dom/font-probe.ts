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
export function isFamilyInstalled(family: string): boolean {
  try {
    const ctx = document.createElement('canvas').getContext('2d')
    if (ctx === null) return true
    const probe = '汉字漢字abcXYZ0123'
    const width = (font: string): number => { ctx.font = font; return ctx.measureText(probe).width }
    const sansBaseline = width('72px sans-serif')
    const monoBaseline = width('72px monospace')
    const bogusSans = width('72px "__enhc_missing__", sans-serif')
    const bogusMono = width('72px "__enhc_missing__", monospace')
    const withSans = width(`72px "${family}", sans-serif`)
    const withMono = width(`72px "${family}", monospace`)
    // Installed when the family changes at least one of the two baselines.
    return (withSans !== sansBaseline && withSans !== bogusSans) || (withMono !== monoBaseline && withMono !== bogusMono)
  } catch {
    return true
  }
}
