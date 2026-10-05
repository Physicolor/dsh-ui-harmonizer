/**
 * Why the widgets rail ("组件") collapses to 0×0 on the 上下文 view.
 *
 * Walks the rail's ancestor chain in each view and prints, for every ancestor,
 * the box, the position/display/overflow, and the rail's own computed geometry
 * plus the `dsx-slot-cut` state — so the collapsing box is named exactly.
 *
 * Run: node scripts/probes/views/probe-rail-ancestry.mjs [url] [sessionTitle]
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

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-rail2', {
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
if ((await railBtn.getAttribute('aria-pressed').catch(() => null)) !== 'true') {
  await railBtn.click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(2000)
}

const DEEP = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)] }
  const D = el => { const s = getComputedStyle(el); return { pos: s.position, disp: s.display, w: s.width, h: s.height, top: s.top, right: s.right, bottom: s.bottom, left: s.left, overflow: s.overflow, z: s.zIndex, transform: s.transform.slice(0, 30) } }
  const tabs = document.querySelector("[class*='_tabs']")
  const active = tabs === null ? null : [...tabs.children].find(c => c.getAttribute('aria-selected') === 'true')
  const rail = document.querySelector('.dsx-stats-rail')
  const chain = []
  for (let el = rail; el !== null && el !== document.documentElement; el = el.parentElement) {
    chain.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 60), slot: el.getAttribute('data-slot'), rect: R(el), ...D(el) })
  }
  return {
    view: active === null ? null : (active.textContent ?? '').trim(),
    railVar: getComputedStyle(document.documentElement).getPropertyValue('--dsx-rail-w').trim(),
    railTopVar: getComputedStyle(document.documentElement).getPropertyValue('--dsx-rail-top').trim(),
    railSelf: rail === null ? null : { rect: R(rail), ...D(rail), parentCls: String(rail.parentElement.className).slice(0, 60), parentRect: R(rail.parentElement) },
    cutSlots: [...document.querySelectorAll('.dsx-slot-cut')].length,
    allSlots: [...document.querySelectorAll('[class*="dsx-stats-card-slot"]')].map(e => ({ cls: String(e.className), rect: R(e) })),
    chain,
    scrollBody: (() => { const sb = document.querySelector('[data-conversation-scroll]'); return sb === null ? null : { cls: String(sb.className).slice(0, 40), rect: R(sb), paddingRight: getComputedStyle(sb).paddingRight, pos: getComputedStyle(sb).position } })(),
  }
})()`

const labels = await page.evaluate(() => { const t = document.querySelector("[class*='_tabs']"); return t === null ? [] : [...t.children].map(c => (c.textContent ?? '').trim()) })
for (const label of labels) {
  await page.locator("[class*='_tabs']").getByText(label, { exact: true }).first().click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(2500)
  const snap = await page.evaluate(DEEP)
  console.log(`===== view "${label}" =====`)
  console.log(JSON.stringify({ view: snap.view, railVar: snap.railVar, railTopVar: snap.railTopVar, cutSlots: snap.cutSlots, railSelf: snap.railSelf, allSlots: snap.allSlots, scrollBody: snap.scrollBody }, null, 1))
  console.log('--- ancestor chain (rail -> html) ---')
  for (const a of snap.chain) console.log(`${a.rect.join(',')} ${a.tag}.${a.cls} slot=${a.slot ?? ''} pos=${a.pos} disp=${a.disp} w=${a.w} h=${a.h} top=${a.top} right=${a.right} bottom=${a.bottom} left=${a.left} overflow=${a.overflow}`)
}
await context.close()
