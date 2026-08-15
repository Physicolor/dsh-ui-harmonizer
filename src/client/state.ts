/**
 * State and CSS application for Harness UI Enhancer.
 *
 * Two channels push values into the page:
 * - Static override rules in enhancer.module.css read CSS custom properties
 *   (--enhancer-*) which applyState() updates on <html>.
 * - Markdown font shorthand (font: <weight> <size>/<line> <family>) cannot be
 *   expressed through a custom property, so applyState() also rewrites one
 *   dynamic <style data-plugin="harness-ui-enhancer"> tag holding the body
 *   --dsw-font-markdown-* overrides. The tag carries the plugin id so the
 *   loader's unload sweep removes it together with the bundled stylesheet.
 */

/** Font presets: id → label + CSS font stack (null keeps the product default). */
export const FONT_PRESETS = [
  { id: 'default', label: '系统默认（HarmonyOS Sans SC）', stack: null },
  { id: 'harmony', label: 'HarmonyOS Sans SC', stack: "'HarmonyOS Sans SC', 'HarmonyOS Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
  { id: 'yahei', label: '微软雅黑优先', stack: "'Microsoft YaHei', 'PingFang SC', 'Segoe UI', sans-serif" },
  { id: 'noto', label: 'Noto Sans SC', stack: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
  { id: 'serif', label: '衬线（宋体风）', stack: "Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif" },
  { id: 'mono', label: '等宽', stack: "'JetBrains Mono', 'SF Mono', Consolas, 'Courier New', monospace" },
] as const

/** One sizing knob's in-memory value. */
export interface EnhancerState {
  /** Chat column width (px). */
  width: number
  /** Chat/markdown base font size (px). */
  fontSize: number
  /** Sidebar base font size (px); 14 is the product default. */
  sidebarSize: number
  /** Selected font preset id. */
  fontId: string
}

/** Product defaults; the plugin applies these on boot and treats them as the neutral baseline. */
export const DEFAULT_STATE: EnhancerState = { width: 748, fontSize: 14, sidebarSize: 14, fontId: 'default' }

/** localStorage key holding the persisted enhancer state. */
const STORAGE_KEY = 'harness-ui-enhancer.state'

/**
 * Read the persisted state, falling back to defaults on any parse or shape
 * error (the key may be absent, corrupted, or from an older schema).
 * @returns the merged persisted state.
 */
export function loadState(): EnhancerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return { ...DEFAULT_STATE }
    const parsed = JSON.parse(raw) as Partial<EnhancerState>
    const state = { ...DEFAULT_STATE, ...parsed }
    // Validate ranges; a stale hand-edited value should not break the page.
    if (!Number.isFinite(state.width) || state.width < 600 || state.width > 1200) state.width = DEFAULT_STATE.width
    if (!Number.isFinite(state.fontSize) || state.fontSize < 12 || state.fontSize > 24) state.fontSize = DEFAULT_STATE.fontSize
    if (!Number.isFinite(state.sidebarSize) || state.sidebarSize < 12 || state.sidebarSize > 20) state.sidebarSize = DEFAULT_STATE.sidebarSize
    if (typeof state.fontId !== 'string' || !FONT_PRESETS.some(p => p.id === state.fontId)) state.fontId = DEFAULT_STATE.fontId
    return state
  } catch {
    return { ...DEFAULT_STATE }
  }
}

/** Persist the current state to localStorage. */
function saveState(state: EnhancerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage may be unavailable (private mode, quota); the live state still works.
  }
}

/** CSS custom properties consumed by enhancer.module.css. */
const ROOT_PROPERTIES = [
  '--enhancer-content-width',
  '--enhancer-font-size',
  '--enhancer-font-line',
  '--enhancer-sidebar-scale',
  '--enhancer-chat-scale',
] as const

/** One <style data-plugin> tag lazily created and reused for the dynamic markdown rules. */
let dynamicStyle: HTMLStyleElement | null = null

/**
 * Render the markdown font overrides for the current state.
 * @param state - current enhancer state.
 * @returns the CSS text for the dynamic style tag.
 */
function markdownCss(state: EnhancerState): string {
  const preset = FONT_PRESETS.find(p => p.id === state.fontId)
  const fam = preset?.stack ?? 'var(--dsw-font-family)'
  const fs = state.fontSize
  const lh = Math.round(fs * 28 / 16)
  const fmt = (weight: number, size: number, line: number, family: string): string =>
    `${weight} ${size}px/${line}px ${family}`
  return [
    'body {',
    `  --dsw-font-markdown-base: ${fmt(400, fs, lh, fam)};`,
    `  --dsw-font-markdown-base-strong: ${fmt(600, fs, lh, fam)};`,
    `  --dsw-font-markdown-base-italic: ${fmt(400, fs, lh, fam)};`,
    `  --dsw-font-markdown-base-strong-italic: ${fmt(600, fs, lh, fam)};`,
    `  --dsw-font-markdown-h1: ${fmt(700, Math.round(fs * 1.5), Math.round(fs * 2.125), fam)};`,
    `  --dsw-font-markdown-h2: ${fmt(700, Math.round(fs * 1.375), Math.round(fs * 2), fam)};`,
    `  --dsw-font-markdown-h3: ${fmt(700, Math.round(fs * 1.25), Math.round(fs * 1.875), fam)};`,
    `  --dsw-font-markdown-h4: ${fmt(600, fs, Math.round(fs * 1.75), fam)};`,
    `  --dsw-font-markdown-code: ${fmt(400, Math.round(fs * 0.875), Math.round(fs * 1.375), fam)};`,
    `  --dsw-font-markdown-code-block: ${fmt(400, Math.round(fs * 0.8125), Math.round(fs * 1.375), fam)};`,
    `  --dsw-font-markdown-small: ${fmt(400, Math.round(fs * 0.875), Math.round(fs * 1.5), fam)};`,
    `  --dsw-font-markdown-table: ${fmt(400, Math.round(fs * 0.9375), Math.round(fs * 1.5625), fam)};`,
    '}',
  ].join('\n')
}

/**
 * Push the current state into the page: root custom properties plus the
 * dynamic markdown style tag, and persist to localStorage. Idempotent; safe
 * to call on every slider move.
 * @param state - current enhancer state.
 */
export function applyState(state: EnhancerState): void {
  saveState(state)
  const root = document.documentElement
  root.style.setProperty('--enhancer-content-width', `${state.width}px`)
  root.style.setProperty('--enhancer-font-size', `${state.fontSize}px`)
  root.style.setProperty('--enhancer-font-line', `${Math.round(state.fontSize * 1.5)}px`)
  root.style.setProperty('--enhancer-sidebar-scale', String(state.sidebarSize / 14))
  root.style.setProperty('--enhancer-chat-scale', String(state.fontSize / 14))

  if (dynamicStyle === null) {
    dynamicStyle = document.createElement('style')
    dynamicStyle.dataset.plugin = 'harness-ui-enhancer'
    dynamicStyle.dataset.enhancerDynamic = 'markdown'
    document.head.appendChild(dynamicStyle)
  }
  dynamicStyle.textContent = markdownCss(state)
}

/**
 * Dispose the dynamic style tag. Called from the plugin fiber's effect
 * disposer so stopping/updating the plugin removes it.
 */
export function disposeDynamicStyle(): void {
  if (dynamicStyle !== null) {
    dynamicStyle.remove()
    dynamicStyle = null
  }
  const root = document.documentElement
  for (const property of ROOT_PROPERTIES) root.style.removeProperty(property)
}
