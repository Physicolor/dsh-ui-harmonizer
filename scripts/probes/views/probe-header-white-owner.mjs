/**
 * WHO paints the session header white while dsh-context's 上下文洞察 modal is
 * open in dark mode? Scan every stylesheet for rules that match the header and
 * set a background, testing each selector against the live element (the same
 * technique that named dsh-context/base.css as the composer-seat hider).
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

const SCAN = String.raw`(() => {
  const hdr = document.querySelector("[data-slot='conversation.header'] > header, [data-slot='conversation.session.header'] > header")
  if (hdr === null) return { error: 'no header' }
  const cs = getComputedStyle(hdr)
  const sheetName = sh => { const o = sh.ownerNode; if (o === null) return 'inline?'
    return o.dataset ? [o.dataset.plugin, o.dataset.pluginCss, o.getAttribute('href')].filter(Boolean).join(' | ') : String(o) }
  const hits = []
  const walk = (rules, sh) => {
    for (const r of rules) {
      if (r.cssRules !== undefined && r.selectorText === undefined) { try { walk(r.cssRules, sh) } catch { /* ignore */ } ; continue }
      if (r.selectorText === undefined) continue
      let s = r.style
      if (s === undefined || s === null) continue
      const bg = s.getPropertyValue('background-color') || s.getPropertyValue('background') || s.getPropertyValue('background-image')
      if (!bg) continue
      let m = false
      try { m = hdr.matches(r.selectorText) } catch { m = false }
      if (m) hits.push({ sel: r.selectorText.slice(0, 150), bg: String(bg).slice(0, 90), sheet: sheetName(sh) })
    }
  }
  for (const sh of document.styleSheets) { try { walk(sh.cssRules, sh) } catch { /* cross-origin */ } }
  for (const sh of (document.adoptedStyleSheets ?? [])) { try { walk(sh.cssRules, sh) } catch { /* ignore */ } }
  const parent = hdr.parentElement
  return {
    header: { cls: String(hdr.className), bg: cs.backgroundColor, bgImage: cs.backgroundImage.slice(0, 80), color: cs.color,
      backdrop: cs.backdropFilter, mix: cs.mixBlendMode, opacity: cs.opacity, z: cs.zIndex,
      layer1: cs.getPropertyValue('--dsw-alias-bg-layer-1').trim(), base: cs.getPropertyValue('--dsw-alias-bg-base').trim() },
    parent: parent === null ? null : { cls: String(parent.className).slice(0, 60), bg: getComputedStyle(parent).backgroundColor },
    dark: document.body.hasAttribute('data-ds-dark-theme'),
    modalOpen: document.querySelector('.lc-ov-backdrop') !== null,
    hits,
  }
})()`

const dark = await page.evaluate(() => document.body.hasAttribute('data-ds-dark-theme'))
console.log('booted dark:', dark)
if (!dark) { await page.evaluate(() => document.body.setAttribute('data-ds-dark-theme', '')); await page.waitForTimeout(600) }

const closed = await page.evaluate(SCAN)
console.log('\n=== dark + modal CLOSED ===')
console.log(JSON.stringify(closed, null, 1))

await page.locator('.lc-ov-entry').first().click({ timeout: 8000 }).catch(async () => { await page.locator('.lc-ov-entry').first().dispatchEvent('click').catch(() => {}) })
await page.waitForTimeout(2000)
const open = await page.evaluate(SCAN)
console.log('\n=== dark + modal OPEN ===')
console.log(JSON.stringify(open, null, 1))

writeFileSync(`${OUT}/header-white-owner.json`, JSON.stringify({ closed, open }, null, 1), 'utf8')
await page.evaluate(() => document.body.removeAttribute('data-ds-dark-theme'))
await context.close()
