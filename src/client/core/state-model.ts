/**
 * The plugin's own state shape: types, product defaults and the storage key.
 *
 * This module owns nothing but the model. Persistence lives in
 * `./state-store.ts`; the product's chat-width channel (a DSH key, not ours)
 * lives in `../harness/chat-width.ts`.
 */

import { getFontLabel } from './i18n.ts'

/** Where the chosen stack applies. `content` = chat prose only; `ui` = the
 *  whole interface (`--dsw-font-family`, which the product fixes at :root). */
export type FontScope = 'content' | 'ui'

/** Resolved preset with locale-aware label (for use in components). */
export function getPresetLabel(id: string): string {
  return getFontLabel(id)
}

/** One sizing knob's in-memory value. */
export interface EnhancerState {
  /** Chat column width (px). */
  width: number
  /** Sidebar base font size (px); 14 is the product default. */
  sidebarSize: number
  /** Selected font preset id. */
  fontId: string
  /** Whether the font stack applies to chat prose only or the whole UI. */
  fontScope: FontScope
  /** Center-column rounded-card overlay (top-left corner + top edge + shadow). */
  card: boolean
}

/** Product defaults; the plugin applies these on boot and treats them as the neutral baseline. */
export const DEFAULT_STATE: EnhancerState = { width: 748, sidebarSize: 14, fontId: 'default', fontScope: 'content', card: false }

/** localStorage key holding the persisted enhancer state. */
export const STORAGE_KEY = 'harness-ui-enhancer.state'
