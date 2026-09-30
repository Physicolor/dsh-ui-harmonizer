/**
 * One-shot splice: replace the scattered "settings page header" rules in
 * enhancer.module.css with the unified recipe owned by settings-page.ts.
 *
 * Written as a script (not an editor edit) because the block it replaces carries
 * mojibake comment bytes from an old PowerShell round-trip, and re-typing them
 * through any shell would corrupt them further. Reads and writes UTF-8 exactly.
 *
 * Run: node scripts/apply-settings-header-css.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = new URL('../src/client/enhancer.module.css', import.meta.url)
const css = readFileSync(FILE, 'utf8')

const START = '/* Settings page headers'
const END = '/* Session title crumb'

const start = css.indexOf(START)
const end = css.indexOf(END)
if (start < 0 || end < 0 || end <= start) {
  console.error(`anchors not found (start=${start}, end=${end})`)
  process.exit(1)
}

const block = `/* Settings page headers — ONE recipe for every page.
 *
 * The architecture lives in settings-page.ts: this plugin's own pages render
 * \`SettingsPageHeader\` and every other page is normalized by the reconciler,
 * which puts the SAME three class names on the page's real heading and
 * description (injecting an \`h2\` when the page ships none). The rules below are
 * therefore the only place a settings header is styled, and they are keyed on
 * our own names instead of on each plugin's private classes:
 *
 *   .enhc-page-head   — optional head box a page already groups its header in
 *   .enhc-page-title  — the page title (official 18/26 600, label-primary)
 *   .enhc-page-intro  — the page description (official 13/20 tertiary + hairline)
 *
 * Geometry notes:
 * - Official sections lay their children out with \`gap:12px\`
 *   (rtSEdW_section / zGbnIq_section / pbvGtq_section), so the title→description
 *   gap is compressed to the official 4px by a -8px top margin on the
 *   description — but only when the reconciler measured that 12px gap and set
 *   \`data-enhc-gap="tight"\`, so a third-party container with its own spacing
 *   keeps its own rhythm.
 * - A page that already groups title + description in its own head box gets that
 *   box adopted instead (4px gap, no negative margin). */
[data-slot='settings.section'] :global(.enhc-page-head) {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
[data-slot='settings.section'] :global(.enhc-page-title) {
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
  margin: 0;
}
[data-slot='settings.section'] :global(.enhc-page-intro) {
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-tertiary);
  margin: 0 0 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}
[data-slot='settings.section'] :global(.enhc-page-title[data-enhc-gap='tight']) + :global(.enhc-page-intro) {
  margin-top: -8px;
}
[data-slot='settings.section'] :global(.enhc-page-head) > :global(.enhc-page-intro) {
  margin-top: 0;
}
/* Auto-normalizer: any plugin's settings-section title row may decorate the
 * page title with a logo/icon glyph, but every official page (models / plugins /
 * agent presets / general) is a bare 18px/600 text title. Drop a direct
 * \`<svg>\` that sits beside the title in a \`_titleRow\` so every section title
 * reads the same way (dshmarket's 22px market logo is the known case; the
 * selector is generic so any future plugin with an icon-in-title-row is
 * covered — the title text itself is untouched). */
[data-slot='settings.section'] [class$='_titleRow'] > svg {
  display: none;
}

`

writeFileSync(FILE, css.slice(0, start) + block + css.slice(end), 'utf8')
console.log(`replaced ${end - start} chars with ${block.length}`)
