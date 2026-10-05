/**
 * The filename says it: measure the widgets magnify layer while dsh-context's
 * dashboard modal is open — where it lives, what z-index it carries, and
 * whether it really paints above the modal card on hover.
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
const OUT = 'D:/dsh-home/probe-ui/context-overview'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-ov', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
const errors = []
page.on('pageerror', e => errors.push(e && e.message ? e.message : String(e)))
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)
const groups = page.locator("[data-slot='sidebar.workspaces'] [class*='_projectRow']")
const n = await groups.count()
for (let i = 0; i < n; i++) {
  const g = groups.nth(i)
  if ((await g.getAttribute('aria-expanded')) === 'false') { await g.click(); await page.waitForTimeout(250) }
}
await page.waitForTimeout(1000)
await page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']").filter({ hasText: TITLE }).first().click().catch(() => {})
await page.waitForTimeout(4500)

// make sure the widgets rail is ON
const capsule = page.getByLabel('组件', { exact: true }).first()
if ((await capsule.count()) > 0) {
  const pressed = await capsule.getAttribute('aria-pressed').catch(() => null)
  if (pressed !== 'true') { await capsule.click({ timeout: 8000 }).catch(() => {}); await page.waitForTimeout(1800) }
}
console.log('rail active:', await page.evaluate(() => document.body.classList.contains('dsx-stats-active')))

await page.locator('.lc-ov-entry').first().click({ timeout: 8000 }).catch(async () => { await page.locator('.lc-ov-entry').first().dispatchEvent('click').catch(() => {}) })
await page.waitForTimeout(1500)

const MEASURE = String.raw`(() => {
  const nm = el => el === null ? null : String(el.className || el.tagName).slice(0, 44)
  const chain = el => { const out = []; let n = el; let i = 0; while (n !== null && n !== document.documentElement && i < 8) { const cs = getComputedStyle(n); out.push({ cls: nm(n), pos: cs.position, z: cs.zIndex, pe: cs.pointerEvents, display: cs.display, op: cs.opacity, tr: cs.transform === 'none' ? undefined : 'transform' }); n = n.parentElement; i++ } return out }
  const card = document.querySelector('.lc-ov-card')
  const cr = card === null ? null : card.getBoundingClientRect()
  const rail = document.querySelector('.dsx-stats-rail')
  const rr = rail === null ? null : rail.getBoundingClientRect()
  const mag = document.querySelector('.dsx-magnify-layer')
  const magShell = document.querySelector('[class*="dsx-magnify"]')
  const points = []
  if (rr !== null && cr !== null) {
    for (const [fx, fy] of [[0.1, 0.1], [0.3, 0.3], [0.5, 0.5], [0.2, 0.8]]) {
      const x = Math.round(rr.left + rr.width * fx), y = Math.round(rr.top + rr.height * fy)
      points.push({ at: [x, y], insideCard: x >= cr.left && x <= cr.right && y >= cr.top && y <= cr.bottom,
        stack: document.elementsFromPoint(x, y).slice(0, 6).map(el => ({ cls: nm(el), z: getComputedStyle(el).zIndex, pe: getComputedStyle(el).pointerEvents })) })
    }
  }
  return {
    rail: rr === null ? null : [rr.left, rr.top, rr.width, rr.height].map(Math.round),
    card: cr === null ? null : [cr.left, cr.top, cr.width, cr.height].map(Math.round),
    magnify: magShell === null ? null : { cls: nm(magShell), rect: (() => { const r = magShell.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round) })(), z: getComputedStyle(magShell).zIndex, pos: getComputedStyle(magShell).position, pe: getComputedStyle(magShell).pointerEvents, display: getComputedStyle(magShell).display, inlineStyle: (magShell.getAttribute('style') ?? '').slice(0, 120), chain: chain(magShell) },
    points,
  }
})()`

const before = await page.evaluate(MEASURE)
console.log('\n=== before hover ===')
console.log(JSON.stringify({ rail: before.rail, card: before.card, magnify: before.magnify, points: before.points.map(p => p.stack.slice(0, 2)) }, null, 1))

if (before.rail !== null) {
  await page.mouse.move(before.rail[0] + Math.round(before.rail[2] / 2), before.rail[1] + Math.round(before.rail[3] / 2))
  await page.waitForTimeout(1200)
  const after = await page.evaluate(MEASURE)
  writeFileSync(`${OUT}/magnify.json`, JSON.stringify({ before, after, errors }, null, 1), 'utf8')
  console.log('\n=== while hovering the rail ===')
  console.log(JSON.stringify({ magnify: after.magnify, points: after.points }, null, 1))
  await page.screenshot({ path: `${OUT}/hover-magnify.png` })
} else {
  console.log('rail rect unavailable — rail off?')
}
console.log('\npage errors:', errors.length === 0 ? '(none)' : errors.join(' | '))
await context.close()
