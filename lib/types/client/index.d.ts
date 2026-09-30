/**
 * Harness UI Harmonizer — browser half entry (assembly root).
 *
 * Four slots are registered (all through `ctx.slots.inject`, so each one is
 * unregistered with the fiber):
 *
 *   1. `settings.general.item` id `ui-enhancer-header`, order -100 — GeneralHeader
 *   2. `settings.general.item` id `ui-enhancer`,        order  30 — SettingsGeneralRow
 *   3. `shell.overlay`         id `enhancer-center-card`, order 30 — CenterColCard
 *   4. `settings.section`      id `ui-harmony`,         order  40 — DoctorView
 *
 * One shared EnhancerState lives in the apply closure; the two settings rows
 * receive it plus an onApply callback that mutates it and pushes CSS.
 *
 * ELEVEN effects are installed, in this order — the order is a LAYOUT CONTRACT,
 * not a detail: the mounters below assume the earlier ones already published
 * their CSS variables and declared their surfaces, and the two DOM moves run
 * before the header reconciler so it sees the final header row.
 *
 *   1. harmony contract      — create the runtime, publish the negotiation variables
 *   2. surface declarations  — declare our own surfaces to that runtime
 *   3. css lifecycle         — applyState + disposeDynamicStyle (the state push)
 *   4. session tabs          — move the 对话/轨迹 tabs into the title cluster
 *   5. bottom toggle         — move the workbench toggle to the cluster's end
 *   6. settings page headers — mark/inject the page heading + description
 *   7. row popup width       — pin a portalled menu to its launcher row
 *   8. stylesheet keeper     — restore a hand-injected sheet the loader stole
 *   9. frame track animation — keep the column-track transition, minus resize
 *  10. native-title tooltips — replace the OS tooltip with the product's bubble
 *  11. third-party text      — normalize foreign provider strings (text only)
 *
 * The four slots are registered AFTER those effects, so the surfaces they render
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
