/**
 * One-off: is the conversation title in the header ellipsized, and by which
 * max-width? Compares the crumb's full text against its rendered box, with our
 * crumb rule (button[class$='_crumb']) dead in this build.
 *
 * Run: node scripts/probes/header/probe-crumb.mjs [url] [sessionTitleSubstring]
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
const TITLE = process.argv[3] ?? '这个弹出的宽度'

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)
await page.evaluate(t => {
  const rows = [...document.querySelectorAll("[data-slot='sidebar.workspaces'] [class*='_sessionRow']")]
  const row = rows.find(r => (r.textContent ?? '').includes(t))
  if (row !== undefined) row.click()
}, TITLE)
await page.waitForTimeout(3500)

const out = await page.evaluate(() => {
  const crumbs = [...document.querySelectorAll("[class*='_crumb']")]
  return crumbs.map(el => {
    const cs = getComputedStyle(el)
    return {
      tag: el.tagName.toLowerCase(),
      cls: String(el.className),
      text: (el.textContent ?? '').trim(),
      len: (el.textContent ?? '').trim().length,
      box: Math.round(el.getBoundingClientRect().width),
      scrollW: el.scrollWidth,
      maxWidth: cs.maxWidth,
      overflow: cs.overflow,
      textOverflow: cs.textOverflow,
      whiteSpace: cs.whiteSpace,
      title: el.getAttribute('title'),
    }
  })
})
console.log(JSON.stringify(out, null, 2))
await context.close()
