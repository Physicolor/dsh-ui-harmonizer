/**
 * Regression check for rail-vs-context-view.module.css.
 *
 * The bug it fixes: with dsh-widgets' 组件 rail on, switching the conversation
 * view to 上下文 (dsh-context) dropped the whole rail to 0×0 — dsh-context hides
 * the composer seat, and the rail is mounted inside it.
 *
 * Asserts, against the LIVE desktop instance and the bundle the app actually
 * serves (no injected probe CSS):
 *   1. the fix's stylesheet is on the page;
 *   2. rail ON  + 上下文  → the rail keeps a real box and stays hit-testable;
 *   3. rail ON  + 对话 / 轨迹 → the rail is unchanged (no regression);
 *   4. rail ON  + 上下文  → the composer card stays invisible;
 *   5. rail OFF + 上下文  → the seat is still `display: none` (dsh-context's
 *      own shape is preserved when the rail is not asking for it).
 *
 * Read-only on the session: it clicks view tabs and the rail capsule only.
 *
 * Run: node scripts/probes/views/verify-rail-under-context-view.mjs [url] [sessionTitle]
 */
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { authCookieFor } from '../../lib/auth.mjs'

const PW_ROOT = 'C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32'
const require = createRequire(PW_ROOT + '/noop.js')
const { chromium } = require('playwright-core')
const CHROME_CANDIDATES = [
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1246/chrome-win64/chrome.exe',
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',
]
const URL_ARG = process.argv[2] ?? 'http://127.0.0.1:19387'
const TITLE = process.argv[3] ?? '帮我检查我下载了一个上下文'
const OUT = 'D:/dsh-home/probe-ui/context-view/rail'
mkdirSync(OUT, { recursive: true })

const results = []
const check = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail === undefined ? '' : `  — ${detail}`}`) }

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-verify', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
const errors = []
page.on('pageerror', e => errors.push(e && e.message ? e.message : String(e)))
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)

// Open the session under test.
const groups = page.locator("[data-slot='sidebar.workspaces'] [class*='_projectRow']")
const groupCount = await groups.count()
for (let i = 0; i < groupCount; i++) {
  const g = groups.nth(i)
  if ((await g.getAttribute('aria-expanded')) === 'false') { await g.click(); await page.waitForTimeout(300) }
}
await page.waitForTimeout(1200)
await page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']").filter({ hasText: TITLE }).first().click().catch(() => {})
await page.waitForTimeout(5000)

const SNAP = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)] }
  const tabs = document.querySelector("[class*='_tabs']")
  const active = tabs === null ? null : [...tabs.children].find(c => c.getAttribute('aria-selected') === 'true')
  const seat = document.querySelector('[data-composer-seat]')
  const rail = document.querySelector('.dsx-stats-rail')
  const card = document.querySelector('[data-composer-card]')
  const cs = el => el === null ? null : getComputedStyle(el)
  const railRect = rail === null ? null : R(rail)
  const hits = railRect === null || railRect[2] === 0 || railRect[3] === 0 ? [] : [[0.5, 0.05], [0.25, 0.2], [0.75, 0.35], [0.5, 0.6], [0.3, 0.85]].map(([fx, fy]) => {
    const x = Math.round(railRect[0] + railRect[2] * fx)
    const y = Math.round(railRect[1] + railRect[3] * fy)
    const el = document.elementFromPoint(x, y)
    return { at: [x, y], inRail: el !== null && rail.contains(el), cls: el === null ? null : String(el.className).slice(0, 34) }
  })
  return {
    view: active === null ? null : (active.textContent ?? '').trim(),
    railOn: document.body.classList.contains('dsx-stats-active'),
    seatDisplay: cs(seat)?.display ?? null,
    seatRect: seat === null ? null : R(seat),
    railRect,
    railVisible: railRect !== null && railRect[2] > 0 && railRect[3] > 0,
    hits,
    cardVisibleArea: (() => { if (card === null) return null; const r = card.getBoundingClientRect(); const ix = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)); const iy = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)); return Math.round(ix * iy) })(),
    lcRoot: (() => { const lc = document.querySelector('.lc-root'); return lc === null ? null : R(lc) })(),
  }
})()`

const fixSheet = await page.evaluate(() => document.querySelector('style[data-plugin-css="dsh-ui-harmonizer/rail-vs-context-view.module.css"]') !== null)
check('the fix stylesheet is served to the client', fixSheet === true, fixSheet ? 'style[data-plugin-css=…rail-vs-context-view…] present' : 'NOT FOUND — the host may still serve the previous bundle')

const setRail = async (want) => {
  const btn = page.getByLabel('组件', { exact: true }).first()
  const pressed = await btn.getAttribute('aria-pressed').catch(() => null)
  if ((pressed === 'true') !== want) { await btn.click({ timeout: 8000 }).catch(() => {}); await page.waitForTimeout(1800) }
  return await btn.getAttribute('aria-pressed').catch(() => null)
}
const setView = async (label) => {
  await page.locator("[class*='_tabs']").getByText(label, { exact: true }).first().click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(2200)
}

const labels = await page.evaluate(() => { const t = document.querySelector("[class*='_tabs']"); return t === null ? [] : [...t.children].map(c => (c.textContent ?? '').trim()) })
console.log('views:', JSON.stringify(labels))

// 2/4 — rail ON, 上下文: rail real + interactive, composer card invisible.
await setRail(true)
await setView('上下文')
const ctxOn = await page.evaluate(SNAP)
console.log(JSON.stringify(ctxOn, null, 1))
check('rail ON + 上下文 → rail keeps a real box', ctxOn.railVisible === true, `rail ${JSON.stringify(ctxOn.railRect)}`)
check('rail ON + 上下文 → rail is hit-testable', ctxOn.hits.length === 5 && ctxOn.hits.every(h => h.inRail === true), JSON.stringify(ctxOn.hits.map(h => h.inRail)))
check('rail ON + 上下文 → composer card stays invisible', ctxOn.cardVisibleArea === 0, `visibleArea=${ctxOn.cardVisibleArea}`)
check('rail ON + 上下文 → dashboard keeps its height', ctxOn.lcRoot !== null && ctxOn.lcRoot[3] > 500, `lc-root ${JSON.stringify(ctxOn.lcRoot)}`)
await page.screenshot({ path: `${OUT}/verify-context-rail-on.png` })

// 3 — rail ON, 对话 / 轨迹: unchanged.
for (const label of ['对话', '轨迹']) {
  await setView(label)
  const snap = await page.evaluate(SNAP)
  check(`rail ON + ${label} → rail visible`, snap.railVisible === true, `rail ${JSON.stringify(snap.railRect)}`)
  check(`rail ON + ${label} → seat shown`, snap.seatDisplay !== 'none', `seat display=${snap.seatDisplay}`)
}

// 5 — rail OFF, 上下文: dsh-context's own composer-less shape is preserved.
await setView('上下文')
await setRail(false)
const ctxOff = await page.evaluate(SNAP)
check('rail OFF + 上下文 → seat still hidden (dsh-context\'s own shape)', ctxOff.seatDisplay === 'none', `seat display=${ctxOff.seatDisplay}`)

console.log('=== page errors ===')
console.log(errors.length === 0 ? '(none)' : errors.join('\n'))
writeFileSync(`${OUT}/verify-rail-under-context-view.json`, JSON.stringify({ results, ctxOn, ctxOff, errors }, null, 2), 'utf8')
const failed = results.filter(r => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed${failed.length === 0 ? '' : `; FAILED: ${failed.map(f => f.name).join(' | ')}`}`)
await context.close()
process.exit(failed.length === 0 && errors.length === 0 ? 0 : 1)
