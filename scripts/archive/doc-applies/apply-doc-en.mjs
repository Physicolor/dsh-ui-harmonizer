/**
 * One-shot doc sync (English copy shipped in the package): rewrite the
 * "What this plugin normalizes automatically" + "Known third-party pages"
 * sections to describe the unified header architecture (0.9.0).
 *
 * Run: node scripts/apply-doc-en.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'D:/dsh-home/plugins/dsh-ui-harmonizer/docs/settings-section-style.md'
const START = '## What this plugin normalizes automatically'
const END = '## Recommendation for plugin authors'

const SECTION = `## What this plugin normalizes automatically

The header has exactly **one** implementation, in \`src/client/settings-page.ts\`:
a React recipe (\`SettingsPageHeader\`, used by this plugin's own pages) and a DOM
reconciler (\`mountSettingsPageHeaders\`, used on everyone else's). The reconciler
never rewrites your mark-up — it only stamps your page's **real** heading and
description with \`enhc-page-title\` / \`enhc-page-intro\`, marks your own header box
\`enhc-page-head\` when you already group both (its gap becomes the official 4px),
and injects an \`<h2 class="enhc-page-title">\` only when the page has a description
and no title at all. Every stylesheet rule keys on those three class names, so a
page that already follows the recipe is left exactly as authored.

| Problem | Auto-handling |
| --- | --- |
| Title font weight/size off | the real heading gets \`enhc-page-title\` → 18/26 600 + label-primary |
| Description font off | the real description gets \`enhc-page-intro\` → 13/20 tertiary + \`padding-bottom:12px\` + hairline |
| Icon in the title row | \`[data-slot='settings.section'] [class$='_titleRow'] > svg { display:none }\` |
| Title + description in your own header box | that box gets \`enhc-page-head\` → \`gap:4px\` (overrides a custom 2px gap) |
| Title + description as siblings of the section, container gap exactly 12px | the description gets \`data-enhc-gap="tight"\` → title→description compressed to the official 4px; any other container gap keeps your own rhythm |
| Missing \`<h2>\` but a description present | injects \`<h2 class="enhc-page-title">\` (18/600) labelled from the active settings-nav item (\`aria-current="true"\`); purely additive |

Boundaries: normalization only touches the **header** (visual). It does not reorder
your content, never moves or wraps your nodes (a foreign React tree stays intact),
does not remove functional icons (only a logo that sits directly in the title row),
and does not fabricate description copy (if a title is missing and no nav label can
be resolved, it skips rather than write wrong text).

## Known third-party pages

| Page | Previously non-conforming | Normalized |
| --- | --- | --- |
| Models / Agent Presets / Bundled plugins (official) | the official pages disagree with each other (models: 16/500 title, 14/22 intro) | real \`h2\` + \`p\` stamped → 18/26 600 + 13/20 tertiary + hairline |
| Command Code (\`cc-*\`, hyphens, not underscores) | 16/24 500 title, no hairline — the old \`_title\` suffix rules never matched | matched **structurally** (first \`h2\`, first description paragraph), same recipe as every other page |
| Notifications (\`dsh-notification\`, \`dsh_notification_*\`) | description had no hairline; title–description too tight (~-6px due to gap + negative margin) | its \`dsh_notification_heading\` is adopted as the header box (\`gap:4px\`) and the subtitle is stamped \`enhc-page-intro\` (hairline added) |
| Plugin market (\`dshmarket\`, \`eGUBIq_*\`) | 22px logo beside the title | direct \`titleRow\` svg \`display:none\` |
| Side cards (\`dsh-better-sidebar\`, \`Pz1RTq_*\`) | no \`<h2>\` at all, only a \`p.intro\` | injected \`h2.enhc-page-title\` labelled "侧边卡片" |
| Widgets (\`dsh-widgets\`) | — (self-drawn inline div header, already conformant) | untouched |

`

const text = readFileSync(FILE, 'utf8')
const start = text.indexOf(START)
const end = text.indexOf(END)
if (start < 0 || end < 0 || end <= start) {
  console.error(`anchors missing (start=${start}, end=${end})`)
  process.exit(1)
}
writeFileSync(FILE, text.slice(0, start) + SECTION + text.slice(end), 'utf8')
console.log(`updated ${FILE} (${end - start} → ${SECTION.length} chars)`)
