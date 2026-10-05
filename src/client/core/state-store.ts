/**
 * Persistence on this plugin's OWN storage key (`STORAGE_KEY`).
 *
 * The width bounds are imported from the product channel in
 * `../harness/chat-width.ts` so this file never keeps a second copy of them.
 */

import { DEFAULT_STATE, STORAGE_KEY, type EnhancerState } from './state-model.ts'
import { FONT_PRESETS } from '../self/font-presets.ts'
import { adoptSharedWidth, CHAT_WIDTH_MAX, CHAT_WIDTH_MIN } from '../harness/chat-width.ts'

/**
 * Adopt the product's persisted chat width when there is one.
 * @param state - the state loaded from this plugin's own key.
 * @returns the state with the shared width applied when one is stored.
 */
function withSharedWidth(state: EnhancerState): EnhancerState {
  const next = { ...state }
  adoptSharedWidth(next)
  return next
}

/**
 * Read the persisted state, falling back to defaults on any parse or shape
 * error (the key may be absent, corrupted, or from an older schema that also
 * carried a now-removed `fontSize` field).
 * @returns the merged persisted state.
 */
export function loadState(): EnhancerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return withSharedWidth({ ...DEFAULT_STATE })
    const parsed = JSON.parse(raw) as Partial<EnhancerState> & { card?: unknown }
    /* Removed in 0.10.0: the center-column rounded card. A profile that had it
     * on still carries the key in localStorage; drop it here so nothing reads a
     * field the plugin no longer owns. */
    delete parsed.card
    const state: EnhancerState = { ...DEFAULT_STATE, ...parsed }
    if (!Number.isFinite(state.width) || state.width < CHAT_WIDTH_MIN || state.width > CHAT_WIDTH_MAX) state.width = DEFAULT_STATE.width
    if (!Number.isFinite(state.sidebarSize) || state.sidebarSize < 12 || state.sidebarSize > 20) state.sidebarSize = DEFAULT_STATE.sidebarSize
    if (typeof state.fontId !== 'string' || !FONT_PRESETS.some(p => p.id === state.fontId)) state.fontId = DEFAULT_STATE.fontId
    if (state.fontScope !== 'content' && state.fontScope !== 'ui') state.fontScope = DEFAULT_STATE.fontScope
    if (typeof state.panelGlide !== 'boolean') state.panelGlide = DEFAULT_STATE.panelGlide
    return withSharedWidth(state)
  } catch {
    return withSharedWidth({ ...DEFAULT_STATE })
  }
}

/** Persist the current state to localStorage. */
export function saveState(state: EnhancerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage may be unavailable (private mode, quota); the live state still works.
  }
}
