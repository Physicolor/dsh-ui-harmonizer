/**
 * One-shot splice #2: the settings-header CSS is now "two nodes, official
 * spacing written by the reconciler" — the head-wrapper rules and the
 * `data-enhc-gap` flag are gone.
 *
 * Run: node scripts/apply-settings-header-css2.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = new URL('../src/client/enhancer.module.css', import.meta.url)
const css = readFileSync(FILE, 'utf8')

const START = '/* Settings page headers — ONE recipe for every page.'
const END = '/* Session title crumb'

const start = css.indexOf(START)
const end = css.indexOf(END)
if (start < 0 || end < 0 || end <= start) {
  console.error(`anchors not found (start=${start}, end=${end})`)
  process.exit(1)
}

const block = `/* Settings page headers — ONE skeleton for every page.
 *
 * The architecture lives in settings-page.ts: this plugin's own pages render
 * \`SettingsPageHeader\` and every other page is normalized by the reconciler.
 * Both produce the same two sibling nodes — \`h2.enhc-page-title\` and
 * \`p.enhc-page-intro\` — which is exactly the skeleton the official pages ship
 * (\`_section > h2._title + p._intro\`). There is no wrapper of ours anywhere, so a
 * page cannot end up with a different header shape than its neighbours.
 *
 * The distance between the two nodes is NOT a stylesheet constant: the official
 * value is the official section's own \`gap\` (12px, measured on models / agent
 * presets / bundled plugins with this plugin's sheets disabled), while
 * third-party containers use their own (4 / 16 / none at all). The reconciler
 * measures the container and writes the difference onto the description's
 * \`margin-top\`, so the rendered distance — and the title's position on screen —
 * is identical on every page. See scripts/probe-header-geometry.mjs. */
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
  /* \`margin-top\` is left to the reconciler: it is the one number that has to
   * differ per page so the rendered result does not. */
  margin: 0 0 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
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
