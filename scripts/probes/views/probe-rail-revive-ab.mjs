/**
 * A/B for the fix: in the 上下文 view with the widgets rail on, the composer
 * seat is `display: none` (dsh-context/base.css) and therefore takes the whole
 * rail subtree with it. Try the candidate rules LIVE (injected as a <style>)
 * and measure whether the rail comes back, stays hit-testable, and whether the
 * composer card stays invisible.
 *
 * Read-only on the session; the injected <style> is probe-owned and removed
 * before the browser closes.
 *
 * Run: node scripts/probes/views/probe-rail-revive-ab.mjs [url] [sessionTitle]
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

const CANDIDATE = `
body.dsx-stats-active [data-conversation-scroll]:has(.lc-root) > [data-composer-seat]:not(:has([data-approval-key], [data-question-key], [data-plan-review-key])) {
  display: flex;
  height: 0;
  min-height: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
`

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-revive', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)

const groups = page.locator("[data-slot='sidebar.workspaces'] [class*='_projectRow']")
const groupCount = await groups.count()
for (let i = 0; i < groupCount; i++) {
  const g = groups.nth(i)
  if ((await g.getAttribute('aria-expanded')) === 'false') { await g.click(); await page.waitForTimeout(300) }
}
await page.waitForTimeout(1200)
await page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']").filter({ hasText: TITLE }).first().click().catch(() => {})
await page.waitForTimeout(5000)
const railBtn = page.getByLabel('组件', { exact: true }).first()
if ((await railBtn.getAttribute('aria-pressed').catch(() => null)) !== 'true') { await railBtn.click().catch(() => {}); await page.waitForTimeout(2000) }

const MEASURE = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)] }
  const seat = document.querySelector('[data-composer-seat]')
  const rail = document.querySelector('.dsx-stats-rail')
  const card = document.querySelector('[data-composer-card]')
  const cs = el => el === null ? null : getComputedStyle(el)
  const box = rail === null || R(rail)[2] === 0 ? null : R(rail)
  const probe = box === null ? null : document.elementFromPoint(Math.round(box[0] + box[2] / 2), Math.round(box[1] + 80))
  return {
    seat: seat === null ? null : { display: cs(seat).display, rect: R(seat), transform: cs(seat).transform, filter: cs(seat).filter, contain: cs(seat).contain, overflow: cs(seat).overflow },
    rail: rail === null ? null : { rect: R(rail), display: cs(rail).display, visibility: cs(rail).visibility, opacity: cs(rail).opacity, pointerEvents: cs(rail).pointerEvents },
    card: card === null ? null : { rect: R(card), display: cs(card).display, visibleArea: (() => { const r = card.getBoundingClientRect(); const ix = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)); const iy = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)); return Math.round(ix * iy) })() },
    hitAtRail: probe === null ? null : { tag: probe.tagName.toLowerCase(), cls: String(probe.className).slice(0, 50) },
    htmlRailW: cs(document.documentElement).getPropertyValue('--dsx-rail-w').trim(),
  }
})()`

await page.locator("[class*='_tabs']").getByText('上下文', { exact: true }).first().click().catch(() => {})
await page.waitForTimeout(2500)
console.log('=== 上下文 BEFORE the candidate rules ===')
console.log(JSON.stringify(await page.evaluate(MEASURE), null, 1))
await page.screenshot({ path: `${OUT}/revive-before.png` })

await page.addStyleTag({ content: CANDIDATE })
await page.waitForTimeout(1500)
console.log('=== 上下文 AFTER the candidate rules ===')
const after = await page.evaluate(MEASURE)
console.log(JSON.stringify(after, null, 1))
await page.screenshot({ path: `${OUT}/revive-after.png` })

// Hit-test five points inside the rail: every one must resolve to a descendant
// of `.dsx-stats-rail`, or the restored box is painted but not interactive.
const HIT = String.raw`(() => {
  const rail = document.querySelector('.dsx-stats-rail')
  if (rail === null) return null
  const r = rail.getBoundingClientRect()
  if (r.width === 0 || r.height === 0) return null
  const pts = [[0.5, 0.05], [0.25, 0.2], [0.75, 0.35], [0.5, 0.6], [0.3, 0.85]]
  return pts.map(([fx, fy]) => {
    const el = document.elementFromPoint(Math.round(r.left + r.width * fx), Math.round(r.top + r.height * fy))
    return {
      at: [Math.round(r.left + r.width * fx), Math.round(r.top + r.height * fy)],
      tag: el === null ? null : el.tagName.toLowerCase(),
      cls: el === null ? null : String(el.className).slice(0, 40),
      inRail: el !== null && rail.contains(el),
    }
  })
})()`
console.log('=== hit tests inside the rail ===')
console.log(JSON.stringify(await page.evaluate(HIT), null, 1))

// The dashboard must keep its own geometry: the restored seat takes no room.
const SHEET = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)] }
  const lc = document.querySelector('.lc-root')
  const sb = document.querySelector('[data-conversation-scroll]')
  return {
    lcRoot: lc === null ? null : R(lc),
    scrollBody: sb === null ? null : { rect: R(sb), scrollH: sb.scrollHeight, clientH: sb.clientHeight },
    card: (() => { const c = document.querySelector('[data-composer-card]'); return c === null ? null : R(c) })(),
  }
})()`
console.log('=== dashboard geometry with the seat restored ===')
console.log(JSON.stringify(await page.evaluate(SHEET), null, 1))
await page.screenshot({ path: `${OUT}/revive-after-click.png` })
writeFileSync(`${OUT}/revive-ab.json`, JSON.stringify(after, null, 2), 'utf8')
await context.close()
