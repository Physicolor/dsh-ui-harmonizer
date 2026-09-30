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
export function isTranslucent(value: string): boolean {
  const v = value.trim().toLowerCase()
  if (v === '') return false
  if (v === 'transparent') return true
  const rgb = /^rgba?\(([^)]+)\)$/u.exec(v)
  if (rgb !== null) {
    const parts = rgb[1].split(/[\s,/]+/u).filter(s => s !== '')
    if (parts.length < 4) return false
    const alpha = Number(parts[3].replace('%', ''))
    if (!Number.isFinite(alpha)) return false
    return parts[3].includes('%') ? alpha / 100 < 0.98 : alpha < 0.98
  }
  const hex = /^#([0-9a-f]{4}|[0-9a-f]{8})$/u.exec(v)
  if (hex !== null) {
    const digits = hex[1]
    const pair = digits.length === 4 ? digits[3] + digits[3] : digits.slice(6, 8)
    return Number.parseInt(pair, 16) / 255 < 0.98
  }
  return false
}

/**
 * Read the material state from the live tokens.
 * @returns true when the base/layer surfaces are translucent.
 */
export function detectGlass(): boolean {
  try {
    const style = getComputedStyle(document.body)
    const candidates = [
      style.getPropertyValue('--dsw-alias-bg-base'),
      style.getPropertyValue('--dsw-alias-bg-layer-1'),
      style.getPropertyValue('--dsw-specific-sidebar-fill'),
    ]
    return candidates.some(isTranslucent)
  } catch {
    return false
  }
}
