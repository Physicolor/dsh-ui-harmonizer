/**
 * Which attribute actually flips the product's dark theme?
 *
 * The theme plugin's token CSS scopes dark under `body[data-ds-dark-theme]`,
 * while the shell writes `data-ds-theme-source` on <html>. Measure the header /
 * sidebar / center backgrounds under each combination with in-page computed
 * styles (plus screenshots for the pixel check).
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

const SNAP = String.raw`(() => {
  const cs = el => el === null ? null : getComputedStyle(el)
  const pick = sel => { const el = document.querySelector(sel); if (el === null) return null
    const c = cs(el); const r = el.getBoundingClientRect()
    return { sel, cls: String(el.className).slice(0, 40), bg: c.backgroundColor, color: c.color,
      base: c.getPropertyValue('--dsw-alias-bg-base').trim(), layer1: c.getPropertyValue('--dsw-alias-bg-layer-1').trim(),
      sidebarFill: c.getPropertyValue('--dsw-specific-sidebar-fill').trim(), scheme: c.colorScheme,
      rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] } }
  return {
    htmlAttrs: [...document.documentElement.attributes].map(a => a.name + '=' + String(a.value).slice(0, 30)),
    bodyAttrs: [...document.body.attributes].map(a => a.name + '=' + String(a.value).slice(0, 30)),
    bodyBg: cs(document.body).backgroundColor,
    sidebar: pick("[data-slot='sidebar']") ?? pick("[class*='_sidebarCol']"),
    header: pick("[data-slot='conversation.header'] > header, [data-slot='conversation.session.header'] > header"),
    centerCol: pick("[class*='_centerCol']"),
    convRoot: pick("[class*='_root'][class*='_Dc7zOa'], [class*='Dc7zOa_root']"),
    composer: pick("[data-composer-seat]"),
    rail: pick('.dsx-stats-rail'),
  }
})()`

const cases = [
  { name: 'light', apply: () => { document.documentElement.setAttribute('data-ds-theme-source', 'light'); document.body.removeAttribute('data-ds-dark-theme') } },
  { name: 'body-only', apply: () => { document.documentElement.setAttribute('data-ds-theme-source', 'light'); document.body.setAttribute('data-ds-dark-theme', '') } },
  { name: 'html-dark-only', apply: () => { document.documentElement.setAttribute('data-ds-theme-source', 'dark'); document.body.removeAttribute('data-ds-dark-theme') } },
  { name: 'html+body', apply: () => { document.documentElement.setAttribute('data-ds-theme-source', 'dark'); document.body.setAttribute('data-ds-dark-theme', '') } },
]

const out = {}
for (const c of cases) {
  await page.evaluate(c.apply)
  await page.waitForTimeout(700)
  out[c.name] = await page.evaluate(SNAP)
  await page.screenshot({ path: `${OUT}/theme-${c.name}.png` })
  console.log(`\n=== ${c.name} ===`)
  console.log(JSON.stringify(out[c.name], null, 1))
}
writeFileSync(`${OUT}/theme-attr-matrix.json`, JSON.stringify(out, null, 1), 'utf8')
await page.evaluate(() => { document.documentElement.setAttribute('data-ds-theme-source', 'light'); document.body.removeAttribute('data-ds-dark-theme') })
await context.close()
