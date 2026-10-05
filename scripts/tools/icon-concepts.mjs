/**
 * dsh-ui-harmonizer — icon concept sheet.
 *
 * The plugin's job is an INTERPOSITION: without it the tree is
 * `DSH → community Cordis plugins` (everything wired straight through); with it
 * it becomes `DSH → 【design spec + reinforcement】 → the adapted plugins, and
 * the harness itself`. These are the five visual metaphors that can carry that,
 * rendered side by side on the product's light and dark surfaces so the choice
 * can be made against the real tile rather than in isolation.
 *
 *   node scripts/tools/icon-concepts.mjs [--out docs/icon/concepts.png]
 */
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(HERE, 'noop.js'))
const { chromium } = require(join('C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/node_modules', 'playwright-core'))
const { chromePath } = require(join(HERE, '../../../dsh-widgets/scripts/lib/chrome.cjs'))

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const OUT = arg('--out', 'docs/icon/concepts.png')

const A = '#8FC2FF'
const B = '#145AF3'
const CYAN = '#45D9E7'
const AMBER = '#F2AF63'
const LIGHT = '#7CB7FF'
const MID = '#4A8CF7'

const defs = (id, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse"><stop stop-color="${A}"/><stop offset="1" stop-color="${B}"/></linearGradient>`

const wrap = (inner, d = '') => `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><defs>${d}</defs>${inner}</svg>`

/** A — sandwich: the rail's own row family, with the middle band as the spec layer. */
const conceptA = wrap(
  `<rect x="7" y="7" width="22" height="5.5" rx="2" fill="${LIGHT}"/>
   <rect x="4.5" y="15" width="27" height="6" rx="2.4" fill="url(#ga)"/>
   <rect x="7" y="23.5" width="22" height="5.5" rx="2" fill="${MID}"/>`,
  defs('ga', 31.5, 15, 4.5, 21),
)

/** B — coupler: one platform block above, three plugin blocks below, joined through ours. */
const conceptB = wrap(
  `<rect x="10" y="7" width="16" height="6" rx="2.2" fill="${LIGHT}"/>
   <rect x="16.5" y="14" width="3" height="8" rx="1.5" fill="url(#gb)"/>
   <rect x="7" y="23" width="6.5" height="6.5" rx="2" fill="${CYAN}"/>
   <rect x="14.75" y="23" width="6.5" height="6.5" rx="2" fill="url(#gb)"/>
   <rect x="22.5" y="23" width="6.5" height="6.5" rx="2" fill="${MID}"/>`,
  defs('gb', 19.5, 14, 16.5, 22),
)

/** C — align: irregular blocks on the left, the spec rule in the middle, aligned blocks on the right. */
const conceptC = wrap(
  `<rect x="6.5" y="8" width="6" height="5" rx="1.8" fill="${LIGHT}"/>
   <rect x="6.5" y="17" width="8" height="6" rx="2" fill="${CYAN}"/>
   <rect x="16.5" y="7" width="3.2" height="22" rx="1.6" fill="url(#gc)"/>
   <rect x="22" y="8" width="7" height="6" rx="2" fill="${MID}"/>
   <rect x="22" y="18" width="7" height="6" rx="2" fill="url(#gc)"/>`,
  defs('gc', 19.7, 7, 16.5, 29),
)

/** E — nesting: the shell, our layer inside it, the plugin at the core. */
const conceptE = wrap(
  `<rect x="5" y="5" width="26" height="26" rx="8" stroke="${LIGHT}" stroke-width="2.4"/>
   <rect x="10.5" y="10.5" width="15" height="15" rx="4.6" fill="url(#ge)"/>
   <rect x="15.5" y="15.5" width="5" height="5" rx="1.6" fill="#FFFFFF"/>`,
  defs('ge', 25.5, 10.5, 10.5, 25.5),
)

/** F1/F2 — equalizer: the name itself. Levels differ (F1) vs levelled to one line (F2). */
const bars = (tops) => tops.map(([x, y, h, c, rx]) => `<rect x="${x}" y="${y}" width="3" height="${h}" rx="${rx}" fill="${c}"/>`).join('')
const conceptF1 = wrap(bars([[7, 12, 17, LIGHT, 1.5], [12, 9, 20, CYAN, 1.5], [17, 7, 22, 'url(#gf)', 1.8], [22.5, 10, 19, MID, 1.5], [27, 13, 16, AMBER, 1.5]]), defs('gf', 20, 7, 17, 29))
const conceptF2 = wrap(bars([[7, 7, 22, LIGHT, 1.5], [12, 7, 22, CYAN, 1.5], [17, 7, 22, 'url(#gf)', 1.8], [22.5, 7, 22, MID, 1.5], [27, 7, 22, AMBER, 1.5]]), defs('gf', 20, 7, 17, 29))

const CONCEPTS = [
  ['A 夹层 Sandwich', '上下是平台与插件，中间那条更宽的渐变带就是规范层', conceptA],
  ['B 连接件 Coupler', '上面是 Harness，下面三个插件，中间的短棒把它们接起来', conceptB],
  ['C 对齐 Align', '左边大小不一（未适配）→ 中间规范导轨 → 右边整齐（已适配）', conceptC],
  ['E 套层 Nested', '外壳是 Harness，中间高亮层是规范，内核是插件', conceptE],
  ['F1 均衡器（不齐）', 'harmonizer 本义：不同的高度并存', conceptF1],
  ['F2 均衡器（调平）', 'harmonizer 本义：被调到同一条基准线', conceptF2],
]

const tile = ([label, why, svg], bg, fg) => `
  <div class="cell">
    <div class="tile" style="background:${bg}">${svg}</div>
    <div class="name" style="color:${fg}">${label}</div>
    <div class="why" style="color:${fg}">${why}</div>
  </div>`

const lightTile = '#ffffff', lightText = '#1f2329', darkTile = '#2a2d33', darkText = '#e8eaed'
const row = (bg, fg, tileBg, big) => `<div class="row" style="background:${bg}">
    ${CONCEPTS.map(([l, w, s]) => tile([l, w, big ? s.replace('width="36" height="36"', 'width="72" height="72"') : s], tileBg, fg)).join('')}
  </div>`

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin:0; font:13px/1.45 "Segoe UI", system-ui, sans-serif; }
  .row { display:flex; gap:22px; padding:20px 24px 26px; align-items:flex-start; }
  .cell { display:flex; flex-direction:column; align-items:center; gap:6px; width:170px; }
  .tile { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 2px rgba(16,24,40,.06); }
  .tile svg { width:26px; height:26px; }
  .name { font-weight:600; font-size:12px; text-align:center; }
  .why { font-size:11px; opacity:.7; text-align:center; }
  .h { font-weight:600; padding:14px 24px 0; }
</style></head><body>
  <div class="h" style="background:#f5f6f8;color:${lightText}">列表图标 @26px — 浅色</div>
  ${row('#f5f6f8', lightText, lightTile, false)}
  <div class="h" style="background:#1b1d21;color:${darkText}">列表图标 @26px — 深色</div>
  ${row('#1b1d21', darkText, darkTile, false)}
  <div class="h" style="background:#f5f6f8;color:${lightText}">放大 2×</div>
  ${row('#f5f6f8', lightText, lightTile, true)}
</body></html>`

const browser = await chromium.launch({ executablePath: chromePath(), headless: true })
const page = await browser.newPage({ viewport: { width: 1180, height: 640 }, deviceScaleFactor: 2 })
await page.setContent(html)
await page.waitForTimeout(300)
mkdirSync(dirname(OUT), { recursive: true })
await page.screenshot({ path: OUT, fullPage: true })
console.log('wrote', OUT)
await browser.close()
