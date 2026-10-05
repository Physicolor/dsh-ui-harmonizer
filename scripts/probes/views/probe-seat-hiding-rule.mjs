/**
 * Name the stylesheet that hides the composer seat on the 上下文 view.
 *
 * Scans EVERY stylesheet (document.styleSheets + document.adoptedStyleSheets)
 * for rules whose selector mentions the composer seat or dsh-context's
 * `.lc-root`, and prints each one's owner tag, selector and the display/height
 * it declares. Read-only.
 *
 * Run: node scripts/probes/views/probe-seat-hiding-rule.mjs [url] [sessionTitle]
 */
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
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

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-seat2', {
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
await page.locator("[class*='_tabs']").getByText('上下文', { exact: true }).first().click().catch(() => {})
await page.waitForTimeout(2500)

const SCAN = String.raw`(() => {
  const owner = (sheet) => {
    try {
      const n = sheet.ownerNode
      if (n === null || n === undefined) return 'adopted'
      return n.getAttribute('data-plugin-css') ?? n.getAttribute('data-plugin') ?? n.id ?? 'tag<' + n.tagName + '>'
    } catch { return '?' }
  }
  const out = []
  const sources = []
  for (const s of document.styleSheets) sources.push([s, 'document'])
  for (const s of (document.adoptedStyleSheets ?? [])) sources.push([s, 'adopted'])
  const walk = (rules, sheet, kind) => {
    for (const rule of rules) {
      if (rule.cssRules !== undefined && rule.selectorText === undefined) { walk(rule.cssRules, sheet, kind); continue }
      const sel = rule.selectorText
      if (sel === undefined) continue
      if (!/composer-seat|composerSeat|composer\.composer|lc-root|input\.overlay/i.test(sel)) continue
      const d = rule.style.display
      const h = rule.style.height
      const v = rule.style.visibility
      if (d === '' && h === '' && v === '') continue
      out.push({ from: kind, owner: owner(sheet), sel: sel.slice(0, 200), display: d, height: h, visibility: v })
    }
  }
  for (const [s, kind] of sources) { try { walk(s.cssRules, s, kind) } catch { /* cross-origin */ } }
  const seat = document.querySelector('[data-composer-seat]')
  const cs = seat === null ? null : getComputedStyle(seat)
  const hits = []
  if (seat !== null) {
    for (const [s, kind] of sources) {
      let rules = null
      try { rules = s.cssRules } catch { continue }
      const rec = (list) => { for (const rule of list) {
        if (rule.cssRules !== undefined && rule.selectorText === undefined) { rec(rule.cssRules); continue }
        const sel = rule.selectorText
        if (sel === undefined) continue
        if (!/composer-seat|composerSeat/i.test(sel)) continue
        let m = false
        try { m = seat.matches(sel) } catch { m = false }
        hits.push({ owner: owner(s), sel: sel.slice(0, 160), matches: m, display: rule.style.display })
      } }
      rec(rules)
    }
  }
  return {
    seatDisplay: cs === null ? null : cs.display,
    seatRect: seat === null ? null : (() => { const r = seat.getBoundingClientRect(); return [r.x, r.y, r.width, r.height] })(),
    sheets: sources.length,
    rules: out.slice(0, 60),
    seatSelectors: hits.slice(0, 60),
  }
})()`

const res = await page.evaluate(SCAN)
console.log(JSON.stringify(res, null, 1))
await context.close()
