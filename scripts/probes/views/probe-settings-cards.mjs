/**
 * The official CARD and SEGMENTED-control recipes inside the settings window
 * (Plugins page = the card-heaviest official surface), so dsh-context's
 * dashboard tiles can be reconciled with the same numbers.
 *
 * Run: node scripts/probes/views/probe-settings-cards.mjs [url]
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
const OUT = 'D:/dsh-home/probe-ui/settings-window'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-settings', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
const errors = []
page.on('pageerror', e => errors.push(e && e.message ? e.message : String(e)))
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)
await page.locator("[data-slot='settings.trigger']").first().click({ timeout: 8000 }).catch(() => {})
await page.waitForTimeout(2000)

const PAGES = ['插件', '通用', '模型', '会话日志']
const REPORT = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] }
  const nm = el => String(el.className || el.tagName).slice(0, 44)
  const cs = el => getComputedStyle(el)
  const cards = {}
  const segs = []
  for (const el of document.querySelectorAll("[class*='options'] *, [data-slot='settings.section'] *")) {
    const c = cs(el); const r = el.getBoundingClientRect()
    if (r.width < 120 || r.height < 28 || r.height > 400) continue
    const radius = parseFloat(c.borderTopLeftRadius)
    const hasEdge = c.borderTopWidth !== '0px' || c.boxShadow !== 'none' || (c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'rgb(255, 255, 255)')
    if (radius >= 6 && hasEdge) {
      const key = nm(el)
      cards[key] = cards[key] ?? { n: 0, sample: { rect: R(el), radius: c.borderRadius, padding: c.padding, gap: c.gap === 'normal' ? undefined : c.gap,
        border: c.border.slice(0, 40), bg: c.backgroundColor, shadow: c.boxShadow === 'none' ? undefined : c.boxShadow.slice(0, 60), display: c.display,
        text: (el.textContent ?? '').trim().slice(0, 20) } }
      cards[key].n++
    }
    if (el.getAttribute('role') === 'tablist' || /segment|gran|toggle/i.test(nm(el))) {
      const kids = [...el.children]
      if (kids.length >= 2) segs.push({ cls: nm(el), n: kids.length, rect: R(el), gap: c.gap, padding: c.padding, radius: c.borderRadius, bg: c.backgroundColor,
        kid: { rect: R(kids[0]), padding: cs(kids[0]).padding, radius: cs(kids[0]).borderRadius, font: cs(kids[0]).fontSize + '/' + cs(kids[0]).lineHeight, h: R(kids[0])[3] },
        text: (el.textContent ?? '').trim().slice(0, 30) })
    }
  }
  return { url: location.href, cards, segs: segs.slice(0, 6) }
})()`

const out = {}
for (const p of PAGES) {
  const item = page.locator("[class*='_nav'] button, [class*='_nav'] a, [class*='_nav'] [role='tab']").filter({ hasText: p }).first()
  if ((await item.count()) === 0) { console.log(`(no nav item ${p})`); continue }
  await item.click({ timeout: 6000 }).catch(() => {})
  await page.waitForTimeout(1800)
  out[p] = await page.evaluate(REPORT)
  console.log(`\n=== ${p} ===`)
  for (const [k, v] of Object.entries(out[p].cards)) console.log(`  card ×${v.n}  ${k}\n      ${JSON.stringify(v.sample)}`)
  for (const s of out[p].segs) console.log(`  seg  ${JSON.stringify(s)}`)
}
writeFileSync(`${OUT}/settings-cards.json`, JSON.stringify(out, null, 1), 'utf8')
console.log('\npage errors:', errors.length === 0 ? '(none)' : errors.join(' | '))
await context.close()
