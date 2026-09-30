/**
 * Audit: do our other settings controls follow the product's own recipes?
 *
 * Measures the product's selector pill (`RotMhW_switcher`, 内置插件 page) against
 * dsh-widgets' native `<select class="dsx-select">` (组件设置 tab) and the
 * harmonizer's own segmented control (`.uitw-segmented` / `.uitw-segment-on`,
 * 通用设置) — the three controls that share "pick one of N" in the same rows.
 *
 * Run: node scripts/probes/settings/probe-official-controls.mjs [url]
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
const OUT = 'D:/dsh-home/probe-ui/switches'
mkdirSync(OUT, { recursive: true })

const READ = (selectors) => {
  const R = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}` }
  const out = {}
  for (const [name, sel] of Object.entries(selectors)) {
    const el = document.querySelector(sel)
    if (el === null) { out[name] = null; continue }
    const cs = getComputedStyle(el)
    out[name] = {
      tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), box: R(el),
      radius: cs.borderRadius, bg: cs.backgroundColor, color: cs.color, border: `${cs.borderWidth} ${cs.borderStyle} ${cs.borderColor}`,
      padding: cs.padding, font: `${cs.fontSize}/${cs.lineHeight}`, appearance: cs.appearance,
      boxShadow: cs.boxShadow === 'none' ? 'none' : 'yes', focusOutline: `${cs.outlineWidth} ${cs.outlineStyle}`,
    }
  }
  return out
}

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)
await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
await page.waitForTimeout(1500)

const openNav = async (label) => {
  await page.evaluate((l) => {
    const dialog = document.querySelector("[role='dialog']")
    if (dialog === null) return
    for (const b of dialog.querySelectorAll('button')) {
      const r = b.getBoundingClientRect()
      if (r.width > 60 && r.x < 460 && r.height < 60 && (b.textContent ?? '').trim() === l) { b.click(); return }
    }
  }, label)
  await page.waitForTimeout(1300)
}

const results = {}
await openNav('通用设置')
results.harmonizerGeneral = await page.evaluate(READ, { segmented: '.uitw-segmented', segmentOn: '.uitw-segment-on', switchTrack: '.uitw-switch' })
await openNav('组件')
await page.evaluate(() => { for (const b of document.querySelectorAll('button')) if ((b.textContent ?? '').trim() === '组件设置') { b.click(); return } })
await page.waitForTimeout(1500)
results.widgetsSettings = await page.evaluate(READ, { select: '.dsx-select', switchTrack: '.dsx-switch-track' })
results.widgetsSelectHtml = await page.evaluate(() => document.querySelector('.dsx-select')?.outerHTML.slice(0, 300) ?? null)

await openNav('内置插件')
results.officialSwitcher = await page.evaluate(READ, { switcher: '[class*="_switcher"]', officialSwitch: '[class*="_switch_"]' })
results.officialSwitcherHtml = await page.evaluate(() => document.querySelector('[class*="_switcher"]')?.outerHTML.slice(0, 300) ?? null)

writeFileSync(`${OUT}/official-controls.json`, JSON.stringify(results, null, 2), 'utf8')
console.log(JSON.stringify(results, null, 1))
await context.close()
