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

import type { TextAdapter } from '../../core/text-adapters.ts'

/** Capitalize a single lower-case option word (`high` → `High`). */
function titleCase(match: RegExpMatchArray): string {
  const word = match[1] ?? ''
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

/** One entry per surface of the CommandCode provider we normalize. */
export const COMMANDCODE_TEXT_ADAPTERS: readonly TextAdapter[] = [
  {
    plugin: '@mars-sea/dsh-commandcode-provider',
    why: 'registers its models as `${model.name} (CC)` and its reasoning levels in lower case, so the composer reads "DeepSeek V4.1 Flash (CC) high" where the product voice has "DeepSeek V4.1 Flash · High"',
    scope: '[data-slot="conversation.composer"]',
    attributes: ['title', 'aria-label'],
    rules: [
      { note: 'drop the provider brand suffix from a model name (the chip label, its tooltip and its aria-label)', match: /\s*[（(]\s*CC\s*[)）]/gu, replace: () => '' },
      { note: 'title-case a reasoning-effort label', match: /^(off|minimal|low|medium|high|max)$/u, replace: titleCase },
      { note: 'title-case the effort at the end of a title/aria-label', match: /([·，,]|\s)(off|minimal|low|medium|high|max)\s*$/u, replace: (m) => `${m[1] ?? ''}${(m[2] ?? '').charAt(0).toUpperCase()}${(m[2] ?? '').slice(1).toLowerCase()}` },
    ],
  },
]
