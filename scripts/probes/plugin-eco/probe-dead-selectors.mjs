/**
 * Dead-selector sweep: every rule in our own injected stylesheet, tested
 * against the live DOM. A selector that matches NOTHING is either
 * state-dependent (settings panel closed, widgets absent, dark mode) or a
 * silently broken anchor — exactly how the header rules died when the product
 * moved the header out of its slot. The list is a candidate set, not a verdict.
 *
 * Run: node scripts/probes/plugin-eco/probe-dead-selectors.mjs [url] [sessionTitleSubstring]
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
const OUT = 'D:/dsh-home/probe-ui/dead-selectors'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-header', {
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

const report = await page.evaluate(() => {
  const out = { total: 0, dead: [], sheets: [] }
  for (const tag of document.querySelectorAll("style[data-plugin='dsh-ui-harmonizer'], style[data-plugin-css^='dsh-ui-harmonizer']")) {
    const sheet = tag.sheet
    if (sheet === null) continue
    out.sheets.push({ id: tag.dataset.pluginCss ?? tag.dataset.plugin ?? '', rules: sheet.cssRules.length })
    const walk = (rules, media) => {
      for (const rule of rules) {
        if (rule.cssRules !== undefined && rule.selectorText === undefined) { walk(rule.cssRules, rule.conditionText ?? media); continue }
        if (rule.selectorText === undefined) continue
        out.total += 1
        for (const sel of rule.selectorText.split(',')) {
          const s = sel.trim()
          if (s === '') continue
          let n = -1
          try { n = document.querySelectorAll(s).length } catch { n = -2 }
          if (n <= 0) out.dead.push({ sel: s, n, media, css: rule.style.cssText.slice(0, 90) })
        }
      }
    }
    walk(sheet.cssRules, '')
  }
  return out
})
writeFileSync(`${OUT}/dead.json`, JSON.stringify(report, null, 2), 'utf8')
console.log(`rules=${report.total} dead selectors=${report.dead.length}`)
for (const d of report.dead) console.log(`[n=${d.n}] ${d.media ? `@${d.media} ` : ''}${d.sel}   :: ${d.css}`)
await context.close()
