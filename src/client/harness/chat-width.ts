/**
 * The PRODUCT's chat-width channel — DSH-owned, not ours.
 *
 * Everything here reads or writes the product's own localStorage key and its
 * `--dsh-chat-user-width` inline property; the bounds mirror the product's own
 * `ConversationRoot` contract. Nothing in this file is plugin-private state.
 */

import type { EnhancerState } from '../core/state-model.ts'

/**
 * The PRODUCT's own chat-width preference — the same key its `WidthHandle`s
 * (the two `div[data-width-handle]` drag strips beside the transcript) write on
 * release, and the same one `ConversationRoot` re-reads on every column resize.
 *
 * The width row and those handles therefore share ONE value: the row writes this
 * key plus `--dsh-chat-user-width`, and a drag by either handle lands here for
 * the next panel open. Writing the key alone would not repaint (the product only
 * re-reads it on resize), which is why the inline property is written too.
 */
const CHAT_WIDTH_KEY = 'dsh.conversation.contentWidth'

/** The product's width floor (`ConversationRoot`'s CONTENT_MIN). */
export const CHAT_WIDTH_MIN = 640

/** The product's edge budget (24px inset + 40px handle strip + 24px safe zone per side). */
const CHAT_WIDTH_EDGE_BUDGET = 176

/** The row's upper bound (the product's own adaptive ceiling tops out at 920). */
export const CHAT_WIDTH_MAX = 1000

/**
 * The element that consumes `--dsh-chat-user-width`: `ConversationRoot` is the
 * only `*_root[data-phase]` node under the conversation outlet.
 * @returns the conversation root, or null before it is mounted.
 */
function conversationRoot(): HTMLElement | null {
  const slot = document.querySelector('[data-slot="main.conversation"], [data-slot="conversation"]')
  const scope: ParentNode = slot ?? document
  const root = scope.querySelector('[class$="_root"][data-phase]')
  return root instanceof HTMLElement ? root : null
}

/**
 * Clamp a width into the product's contract, measured against the live column
 * exactly the way `resolveContentWidth` does.
 * @param width - the wanted transcript width in px.
 * @returns the width the product will actually accept.
 */
export function clampChatWidth(width: number): number {
  const root = conversationRoot()
  const ceiling = root === null
    ? CHAT_WIDTH_MAX
    : Math.min(CHAT_WIDTH_MAX, Math.max(CHAT_WIDTH_MIN, root.offsetWidth - CHAT_WIDTH_EDGE_BUDGET))
  return Math.min(Math.max(Math.round(width), CHAT_WIDTH_MIN), ceiling)
}

/**
 * Read the product's persisted chat width.
 * @returns the stored width, or null when unset, unreadable, or not a number.
 */
function readChatWidth(): number | null {
  try {
    const raw = localStorage.getItem(CHAT_WIDTH_KEY)
    if (raw === null) return null
    const value = Number(raw)
    return Number.isFinite(value) && value > 0 ? value : null
  } catch {
    return null
  }
}

/**
 * Publish a width on the product's channel: the persisted key AND the inline
 * property the CSS axis reads.
 * @param width - a width already clamped by {@link clampChatWidth}.
 */
export function writeChatWidth(width: number): void {
  try {
    localStorage.setItem(CHAT_WIDTH_KEY, `${width}`)
  } catch {
    // The live property below still applies.
  }
  const root = conversationRoot()
  if (root !== null) root.style.setProperty('--dsh-chat-user-width', `${width}px`)
}

/**
 * Adopt the product's persisted chat width INTO a live state object.
 * @param state - the live state object to update in place.
 * @returns true when a stored width was adopted.
 */
export function adoptSharedWidth(state: EnhancerState): boolean {
  const shared = readChatWidth()
  if (shared === null) return false
  state.width = Math.min(Math.max(Math.round(shared), CHAT_WIDTH_MIN), CHAT_WIDTH_MAX)
  return true
}
