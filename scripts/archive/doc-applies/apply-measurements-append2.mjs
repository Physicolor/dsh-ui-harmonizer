/**
 * Measurements append (round 2): the header geometry invariant and the official
 * spacing value, superseding the "head box / tight flag / 4px" paragraph of the
 * round-1 append.
 *
 * Run: node scripts/apply-measurements-append2.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'D:/dsh-home/plugins/dsh-ui-harmonizer/docs/MEASUREMENTS.md'
const MARK = '## 2026-09-30 (round 2) settings-header geometry: identical coordinates, official spacing'

const SECTION = `
${MARK}

Probe: \`node scripts/probe-header-geometry.mjs http://127.0.0.1:3080\` — walks every
nav item and reports, per page, the title/description viewport boxes, the measured
distance between them, the container's own \`gap\` and \`padding-top\`, and the shape
of the header. It then repeats the measurement for the official pages with this
plugin's stylesheets disabled (\`media="not all"\`), which is the only way to read
the product's own numbers rather than our override of them.

**The product's own spacing (sheets disabled): 12px, on all three official pages**

| Page | title font | title→description | container gap |
| --- | --- | --- | --- |
| 模型 | 16/24 (500) | 12px | 12px |
| Agent 预设 | 18/26 (600, no line-height) | 12px | 12px |
| 内置插件 | 18/26 (600) | 12px | 12px |

This retracts the "official 4px title→description" claim of the older docs: 4px was
this plugin's own compression (a \`-8px\` bottom margin on the title against the
official 12px container gap).

**Before the fix (our CSS on): the distance was whatever the page's container did**

| Page | title y | title→description | container gap | header shape |
| --- | --- | --- | --- | --- |
| 通用设置 | 134 | 4px | 4px (our own wrapper) | \`div.enhc-page-head\` |
| 模型 | 134 | 12px | 12px | direct child |
| Command Code | 134 | **0px** | none (block flow) | direct child |
| 内置插件 | 134 | 12px | 12px | direct child |
| Agent 预设 | 134 | 12px | 12px | direct child |
| UI 兼容性 | 134 | 4px | 4px (our own wrapper) | \`div.enhc-page-head\` |
| 通知 | 134 | 4px | 2px (adopted head box) | \`div.dsh_notification_heading\` |
| 侧边卡片 | 134 | 16px | 16px | direct child |

**After the fix: one skeleton, one geometry**

\`h2.enhc-page-title\` + \`p.enhc-page-intro\` as siblings, no wrapper anywhere; the
reconciler measures the container (walking up through \`display: contents\` slot
outlets) and writes \`margin-top = 12px − container gap\` on the description, plus a
compensating negative \`margin-top\` on the title when the container contributes its
own \`padding-top\`/\`border-top\`.

| Page | title y | title→description | container gap (unchanged) |
| --- | --- | --- | --- |
| 通用设置 | 134 | 12px | none |
| 模型 | 134 | 12px | 12px |
| Command Code | 134 | 12px | none |
| 内置插件 | 134 | 12px | 12px |
| Agent 预设 | 134 | 12px | 12px |
| UI 兼容性 | 134 | 12px | 12px |
| 通知 | 134 | 12px | 2px |
| 侧边卡片 | 134 | 12px | 16px |

Every page reads \`titleTopFromDialog = 54\`, \`title y = 134\`, \`intro y = 172\`.
The containers still differ — the header no longer does.

Two defects the measurements caught while doing this, both now fixed and pinned by
the probe:

1. **A wrapper was mistaken for a title.** \`[class$='_heading']\` matches
   dsh-notification's \`div.dsh_notification_heading\`, the box AROUND the \`<h2>\`.
   Stamping it with 18/600 made the description inherit \`font-weight: 600\`
   (measured \`13px/20px 400\` → \`13px/20px 600\`). The title finder now only accepts
   a \`_title\`/\`_heading\` node that does not itself wrap a heading.
2. **The injected title was released in the same pass that created it.** The
   侧边卡片 page (whose title this plugin injects) lost its title entirely; a probe
   run showed the description with no heading above it. The release step now keeps a
   title created in the current pass.

`

const text = readFileSync(FILE, 'utf8')
if (text.includes(MARK)) {
  console.log('already present')
} else {
  writeFileSync(FILE, `${text.replace(/\s*$/u, '')}\n${SECTION}`, 'utf8')
  console.log(`appended to ${FILE}`)
}
