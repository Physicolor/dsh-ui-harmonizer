/**
 * Anchor check: a handful of production anchors, each with the suffix selector
 * the stylesheet uses and the substring selector that would survive a second
 * modifier class on the node. Answers "is the rule dead, or is it just this
 * view?" for the selectors the dead-selector sweep flagged.
 *
 * Run: node scripts/probes/header/probe-anchors.mjs [url] [sessionTitleSubstring]
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
const TITLE = process.argv[3] ?? '这个弹出的宽度'

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()

const CANDIDATES = [
  "[data-slot='conversation.session.header'] > header",
  "[data-slot='conversation.header'] > header",
  "[data-slot='conversation.header'] > header:has([class$='_titleCluster'] > [class$='_tabs'])",
  "button[class$='_crumb']",
  "button[class$='_crumbCurrent']",
  "[class*='_crumbCurrent']",
  "[class$='_newSessionLabel']",
  "[class*='_newSessionLabel']",
  "[data-slot='sidebar'] [class$='_brand'] svg",
  "[data-slot='sidebar'] [class*='_brand'] svg",
  "[data-slot='sidebar.workspaces'] [class$='_meta']",
  "[class*='_meta']",
]

for (const url of [URL_ARG]) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(4500)
  await page.evaluate(t => {
    const rows = [...document.querySelectorAll("[data-slot='sidebar.workspaces'] [class*='_sessionRow']")]
    const row = rows.find(r => (r.textContent ?? '').includes(t))
    if (row !== undefined) row.click()
  }, TITLE)
  await page.waitForTimeout(3500)
}

const result = await page.evaluate(list => list.map(sel => {
  let els = []
  try { els = [...document.querySelectorAll(sel)] } catch { return { sel, err: true } }
  return {
    sel,
    n: els.length,
    sample: els.slice(0, 3).map(el => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 44)}`),
  }
}), CANDIDATES)

console.log(JSON.stringify(result, null, 2))
mkdirSync('D:/dsh-home/probe-ui/anchors', { recursive: true })
writeFileSync('D:/dsh-home/probe-ui/anchors/anchors.json', JSON.stringify(result, null, 2), 'utf8')
await context.close()
