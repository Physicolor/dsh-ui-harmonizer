/**
 * Harness UI Harmonizer — browser half entry (assembly root).
 *
 * Three slots are registered (all through `ctx.slots.inject`, so each one is
 * unregistered with the fiber):
 *
 *   1. `settings.general.item` id `ui-enhancer-header`, order -100 — GeneralHeader
 *   2. `settings.general.item` id `ui-enhancer`,        order  30 — SettingsGeneralRow
 *   3. `settings.section`      id `ui-harmony`,         order  40 — DoctorView
 *
 * One shared EnhancerState lives in the apply closure; the two settings rows
 * receive it plus an onApply callback that mutates it and pushes CSS.
 *
 * FOURTEEN effects are installed, in this order — the order is a LAYOUT CONTRACT,
 * not a detail: the mounters below assume the earlier ones already published
 * their CSS variables and declared their surfaces, and the two DOM moves run
 * before the header reconciler so it sees the final header row.
 *
 *   1. turn navigator room   — publish the free width beside the transcript
 *   2. harmony contract      — create the runtime, publish the negotiation variables
 *   3. surface declarations  — declare our own surfaces to that runtime
 *   4. css lifecycle         — applyState + disposeDynamicStyle (the state push)
 *   5. session tabs          — move the 对话/轨迹 tabs into the title cluster
 *   6. bottom toggle         — move the workbench toggle to the cluster's end
 *   7. settings page headers — mark/inject the page heading + description
 *   8. row popup width       — pin a portalled menu to its launcher row
 *   9. stylesheet keeper     — restore a hand-injected sheet the loader stole
 *  10. frame track animation — keep the column-track transition, minus resize
 *  11. instant track         — the right-panel toggle's motion: snap the track and
 *                             cover the content when nothing reserves the
 *                             conversation's right strip, or run every reservation
 *                             on the product's own 300ms when something does
 *                             (after 10: it wraps our tween)
 *  12. header badge fit      — retire header badges as the row narrows (after 11,
 *                             and after the two DOM moves: it measures that row)
 *  13. native-title tooltips — replace the OS tooltip with the product's bubble
 *  14. third-party text      — normalize foreign provider strings (text only)
 *
 * The three slots are registered AFTER those effects, so the surfaces they render
 * always find the styles and root classes already in place. The fiber's effect
 * disposers remove every dynamic style tag, root property, class, listener and
 * DOM move this plugin made.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import './styles/index.ts';
/** Required services: the slot registry (React is a platform module). */
export declare const inject: string[];
/**
 * Client plugin body: restore persisted state, apply CSS, register surfaces.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
