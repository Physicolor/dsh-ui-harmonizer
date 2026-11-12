/**
 * Text adapters for the `@mars-sea/dsh-commandcode-provider` plugin — the ONE
 * third-party surface this file normalizes.
 *
 * Layer: plugins/<package> (the plugin-data half; the framework that runs these
 * rules is `core/text-adapters.ts`, and it embeds no package of its own).
 * Seams: the SHELL's composer slot `[data-slot="conversation.composer"]` and the
 * `title` / `aria-label` attributes on its trigger — no private class names.
 *
 * WHAT IT NORMALIZES: the provider brands its models as `${model.name} (CC)` and
 * writes its reasoning levels in lower case, so the composer reads
 * "DeepSeek V4.1 Flash (CC) high" where the product voice has
 * "DeepSeek V4.1 Flash · High".
 */
import type { TextAdapter } from '../../core/text-adapters.ts';
/** One entry per surface of the CommandCode provider we normalize. */
export declare const COMMANDCODE_TEXT_ADAPTERS: readonly TextAdapter[];
