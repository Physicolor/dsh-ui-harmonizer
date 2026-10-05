/**
 * The sidebar path: open the right sidebar, pick 上下文 in its guide (the panel
 * picker), and report what the panel body renders. Read-only.
 *
 * Run: node scripts/probes/views/probe-sidebar-context-panel.mjs [url] [sessionTitle]
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
const OUT = 'D:/dsh-home/probe-ui/context-view'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-ctxsidebar', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
const lines = []
page.on('console', m => lines.push(`[${m.type()}] ${m.text()}`))
page.on('pageerror', e => lines.push(`[pageerror] ${e && e.message ? e.message : String(e)}`))
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)

const groups = page.locator("[data-slot='sidebar.workspaces'] [class*='_projectRow']")
const groupCount = await groups.count()
for (let i = 0; i < groupCount; i++) {
  const g = groups.nth(i)
  if ((await g.getAttribute('aria-expanded')) === 'false') { await g.click(); await page.waitForTimeout(300) }
}
await page.waitForTimeout(1500)
await page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']").filter({ hasText: TITLE }).first().click().catch(() => {})
await page.waitForTimeout(5000)

await page.getByLabel('打开右侧边栏', { exact: true }).first().click({ timeout: 8000 }).catch(() => {})
await page.waitForTimeout(2500)

const PANEL = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)] }
  const host = document.querySelector("[class*='_tabHostBody'], [class*='_paneBody']")
  const pane = document.querySelector("[data-sidebar-right-panel]")
  const lc = document.querySelector("[data-sidebar-right-panel] .lc-root")
  const out = (el) => el === null ? null : {
    rect: R(el), cls: String(el.className).slice(0, 70), textLen: (el.textContent ?? '').length,
    display: getComputedStyle(el).display, height: getComputedStyle(el).height, overflow: getComputedStyle(el).overflow,
    head: el.innerHTML.slice(0, 300),
  }
  return {
    pane: pane === null ? null : { rect: R(pane), ariaHidden: pane.getAttribute('aria-hidden'), inlineWidth: pane.style.width },
    host: out(host),
    lcRoot: out(lc),
    tabs: [...document.querySelectorAll("[data-dockkit-strip] *")].map(e => ({ cls: String(e.className).slice(0, 50), text: (e.textContent ?? '').trim().slice(0, 24) })).slice(0, 15),
  }
})()`

console.log('=== guide (picker) state ===')
console.log(JSON.stringify(await page.evaluate(PANEL), null, 1).slice(0, 1400))

const entry = page.locator("[class*='_guide'] [class*='_entry']").filter({ hasText: '上下文' }).first()
console.log('context entry count:', await entry.count())
await entry.click({ timeout: 8000 }).catch(e => console.log('entry click failed:', e.message))
await page.waitForTimeout(3500)

console.log('=== after picking 上下文 in the sidebar picker ===')
const after = await page.evaluate(PANEL)
console.log(JSON.stringify(after, null, 1).slice(0, 2500))
await page.screenshot({ path: `${OUT}/sidebar-context-panel.png` })
writeFileSync(`${OUT}/sidebar-context-panel.json`, JSON.stringify({ after, lines }, null, 2), 'utf8')
console.log('=== console (tail) ===')
console.log(lines.slice(-25).join('\n'))
await context.close()
