/**
 * Focused diagnostic: why does the reconciler not find a page's description?
 * Walks the current settings section with the exact candidate selector and
 * reports, per candidate, the reason it was accepted or rejected.
 *
 * Run: node scripts/probe-intro-candidates.mjs <url> <navLabel>
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
const URL_ARG = process.argv[2] ?? process.env.DSH_URL ?? 'http://127.0.0.1:19387'
const NAV = process.argv[3] ?? '鎻掍欢甯傚満'

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-harmony', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(3500)
await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
await page.waitForTimeout(1200)
await page.locator("[role='dialog'] nav button", { hasText: NAV }).first().click().catch(() => null)
await page.waitForTimeout(6000)

const out = await page.evaluate(() => {
  const INTRO_SELECTOR = "p, [class$='_intro'], [class$='_subtitle'], [class$='_sub']"
  const NESTED_SCOPE = "[class$='_row'], [class$='_rowCard'], [class$='_card'], [class$='_field']"
  const section = document.querySelector("[data-slot='settings.section']")
  if (section === null) return { section: false }
  const rows = []
  for (const node of section.querySelectorAll(INTRO_SELECTOR)) {
    const nested = node.closest(NESTED_SCOPE)
    rows.push({
      tag: node.tagName.toLowerCase(),
      cls: String(node.className).slice(0, 46),
      text: (node.textContent ?? '').trim().slice(0, 26),
      nested: nested === null ? null : `${nested.tagName.toLowerCase()}.${String(nested.className).slice(0, 30)}`,
      tooShort: (node.textContent ?? '').trim().length <= 6,
    })
  }
  return { section: true, rows: rows.slice(0, 20) }
})
console.log(JSON.stringify(out, null, 2))
await context.close()

