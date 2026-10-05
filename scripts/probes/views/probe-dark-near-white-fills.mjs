/**
 * In DARK mode, does the PRODUCT itself paint near-white opaque fills anywhere
 * (its own active tabs / primary buttons), or is the near-white pill unique to
 * dsh-context's panel? Decides whether the active-pill fill is off-spec or
 * product-consistent.
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
await page.locator('.lc-ov-entry').first().click({ timeout: 8000 }).catch(async () => { await page.locator('.lc-ov-entry').first().dispatchEvent('click').catch(() => {}) })
await page.waitForTimeout(1200)
await page.evaluate(() => { document.body.setAttribute('data-ds-dark-theme', ''); document.documentElement.setAttribute('data-ds-theme-source', 'dark') })
await page.waitForTimeout(2600)

const SCAN = String.raw`(() => {
  const lum = (css) => { const m = String(css).match(/rgba?\(([^)]+)\)/); if (m === null) return null
    const p = m[1].split(/[ ,/]+/).map(Number); if (p.length > 3 && p[3] < 0.9) return null
    return +(((0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]) / 255).toFixed(3)) }
  const nm = el => String(el.className || el.tagName).slice(0, 48)
  const owner = el => el.closest('.lc-ov-card, .lc-ov-backdrop') !== null ? 'dsh-context-panel'
    : el.closest('.lc-root, .lc-modal-card') !== null ? 'dsh-context-view'
    : el.closest('.dsx-stats-rail, .dsx-surface, .dsx-stats-drawer') !== null ? 'dsh-widgets'
    : el.closest('.duc-') !== null ? 'dsh-usage-center' : 'product'
  const light = []
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el)
    const L = lum(cs.backgroundColor)
    if (L === null || L < 0.85) continue
    const r = el.getBoundingClientRect()
    if (r.width < 4 || r.height < 4) continue
    light.push({ owner: owner(el), cls: nm(el), bg: cs.backgroundColor, color: cs.color,
      rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], text: (el.textContent ?? '').trim().slice(0, 18) })
  }
  const tabs = document.querySelector("[class*='_tabs']")
  const activeTab = tabs === null ? null : [...tabs.children].find(c => c.getAttribute('aria-selected') === 'true') ?? null
  const tabInfo = activeTab === null ? null : (() => { const cs = getComputedStyle(activeTab); return { text: (activeTab.textContent ?? '').trim(), bg: cs.backgroundColor, color: cs.color } })()
  const byOwner = {}
  for (const l of light) byOwner[l.owner] = (byOwner[l.owner] ?? 0) + 1
  return { byOwner, count: light.length, light: light.slice(0, 30), tabInfo,
    dark: document.body.hasAttribute('data-ds-dark-theme') }
})()`

const res = await page.evaluate(SCAN)
console.log('=== dark mode: near-white opaque fills, by owner ===')
console.log(JSON.stringify({ dark: res.dark, byOwner: res.byOwner, count: res.count, activeTab: res.tabInfo }, null, 1))
console.log('\n=== samples (product first) ===')
for (const l of [...res.light].sort((a, b) => (a.owner === 'product' ? -1 : 1) - (b.owner === 'product' ? -1 : 1))) {
  console.log(`  ${l.owner.padEnd(20)} ${l.cls.padEnd(46)} ${l.bg.padEnd(22)} on ${JSON.stringify(l.color).padEnd(22)} ${JSON.stringify(l.rect)} "${l.text}"`)
}
writeFileSync(`${OUT}/dark-near-white.json`, JSON.stringify(res, null, 1), 'utf8')
await page.evaluate(() => { document.body.removeAttribute('data-ds-dark-theme'); document.documentElement.setAttribute('data-ds-theme-source', 'light') })
await context.close()
