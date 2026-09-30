/**
 * Our own switch, in its real row: opens 组件 → 组件设置, names the setting each
 * switch belongs to, measures it against the product's spec and screenshots the
 * rows (the numbers alone do not show whether the row still reads right).
 *
 * Run: node scripts/probes/settings/probe-widgets-switch.mjs [url]
 */
import { createRequire } from 'node:module'
import { existsSync, mkdirSync } from 'node:fs'
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

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)
await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
await page.waitForTimeout(1500)
await page.evaluate(() => {
  const dialog = document.querySelector("[role='dialog']")
  for (const b of dialog.querySelectorAll('button')) {
    const r = b.getBoundingClientRect()
    if (r.width > 60 && r.x < 460 && r.height < 60 && (b.textContent ?? '').trim() === '组件') { b.click(); return }
  }
})
await page.waitForTimeout(1500)
const tab = await page.evaluate(() => {
  for (const b of document.querySelectorAll('button')) {
    if ((b.textContent ?? '').trim() === '组件设置') { b.click(); return true }
  }
  return false
})
await page.waitForTimeout(1500)

const report = await page.evaluate(() => {
  const R = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}` }
  const activeTab = [...document.querySelectorAll('button')].filter(b => /tab/i.test(String(b.className)) && /active|on/i.test(String(b.className))).map(b => (b.textContent ?? '').trim())
  const rows = [...document.querySelectorAll('.dsx-switch-row')].map(row => {
    const track = row.querySelector('.dsx-switch-track')
    const thumb = row.querySelector('.dsx-switch-thumb')
    const input = row.querySelector('input')
    const tcs = getComputedStyle(track)
    const rowText = (row.closest('div')?.parentElement?.textContent ?? '').trim().replace(/\s+/gu, ' ').slice(0, 40)
    return {
      row: rowText,
      on: input?.checked ?? null,
      aria: `${row.querySelector('input')?.getAttribute('role')}/${row.querySelector('input')?.getAttribute('aria-label') ?? '(none)'}`,
      track: `${R(track)} r=${tcs.borderRadius} bg=${tcs.backgroundColor} corner=${tcs.cornerShape}`,
      thumb: `${R(thumb)} bg=${getComputedStyle(thumb).backgroundColor} shadow=${getComputedStyle(thumb).boxShadow} xform=${getComputedStyle(thumb).transform}`,
      rowBox: (() => { const r = row.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y)] })(),
    }
  })
  return { activeTab, rows }
})
console.log(JSON.stringify(report, null, 1))
await page.screenshot({ path: `${OUT}/widgets-settings-page.png` })
await context.close()
