/**
 * The PRODUCT's chat-width channel — DSH-owned, not ours.
 *
 * Everything here reads or writes the product's own localStorage key and its
 * `--dsh-chat-user-width` inline property; the bounds mirror the product's own
 * `ConversationRoot` contract. Nothing in this file is plugin-private state.
 */
import type { EnhancerState } from '../core/state-model.ts';
/** The product's width floor (`ConversationRoot`'s CONTENT_MIN). */
export declare const CHAT_WIDTH_MIN = 640;
/** The row's upper bound (the product's own adaptive ceiling tops out at 920). */
export declare const CHAT_WIDTH_MAX = 1000;
/**
 * Clamp a width into the product's contract, measured against the live column
 * exactly the way `resolveContentWidth` does.
 * @param width - the wanted transcript width in px.
 * @returns the width the product will actually accept.
 */
export declare function clampChatWidth(width: number): number;
/**
 * Publish a width on the product's channel: the persisted key AND the inline
 * property the CSS axis reads.
 * @param width - a width already clamped by {@link clampChatWidth}.
 */
export declare function writeChatWidth(width: number): void;
/**
 * Adopt the product's persisted chat width INTO a live state object.
 * @param state - the live state object to update in place.
 * @returns true when a stored width was adopted.
 */
export declare function adoptSharedWidth(state: EnhancerState): boolean;
