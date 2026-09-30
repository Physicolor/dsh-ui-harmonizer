/**
 * Does the market's own switch ever reach the screen? Opens the market settings
 * page, waits, scrolls its list, hovers rows, and counts the control each step.
 *
 * Run: node scripts/probe-market-switch.mjs [url]
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

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)
await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
await page.waitForTimeout(1200)
await page.getByRole('button', { name: '插件市场', exact: false }).first().click({ timeout: 5000 }).catch(() => null)
await page.waitForTimeout(3000)

const count = () => page.evaluate(() => ({
  switches: document.querySelectorAll('[class*="nUhMVa_switch"]').length,
  rows: document.querySelectorAll('[class*="nUhMVa_"]').length,
  classes: [...new Set([...document.querySelectorAll('[class*="nUhMVa_"]')].map(el => String(el.className).split(/\s+/u)[0]))].slice(0, 24),
}))
console.log('after open:', JSON.stringify(await count()))
/* Scroll the settings pane and hover a few rows: row actions are often revealed. */
await page.mouse.move(900, 500)
for (let i = 0; i < 5; i++) {
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(400)
}
console.log('after scroll:', JSON.stringify(await count()))
const dialog = await page.locator("[role='dialog']")
const box = await dialog.boundingBox()
if (box !== null) {
  for (const y of [300, 420, 540, 660]) {
    await page.mouse.move(box.x + box.width * 0.75, y)
    await page.waitForTimeout(400)
    const c = await count()
    if (c.switches > 0) { console.log(`hover y=${y}:`, JSON.stringify(c)); break }
  }
}
console.log('final:', JSON.stringify(await count()))
await context.close()
