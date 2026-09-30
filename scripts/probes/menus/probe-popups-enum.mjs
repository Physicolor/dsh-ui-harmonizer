/**
 * One-off enumerator: lists every composer / sidebar popup trigger, opens each,
 * and measures whatever popup appears (menu, listbox or dialog) so nothing that
 * the 2026-09-16 report named is left unverified.
 *
 * Run: node scripts/probes/menus/probe-popups-enum.mjs [url]
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
const CREDENTIALS = process.env.DSH_PROBE_CREDENTIALS ?? 'D:/dsh-home/.credentials.yaml'
const PROFILE_DIR = process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-harmony'
const URL_ARG = process.argv[2] ?? process.env.DSH_URL ?? 'http://127.0.0.1:19387'

const chromePath = CHROME_CANDIDATES.find(p => existsSync(p))
const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  executablePath: chromePath, headless: true, viewport: { width: 1440, height: 900 },
})
const { cookie } = authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ARG, days: 1 })
await context.addCookies([cookie])
const page = await context.newPage()
const cdp = await context.newCDPSession(page)
await cdp.send('Network.enable')
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(3500)

const clickNewSession = async () => {
  try { await page.click("[data-slot='sidebar'] [class*='_newSession']", { timeout: 5000 }); await page.waitForTimeout(2000) } catch {}
}
await clickNewSession()

/** Every candidate trigger, described. */
const list = await page.evaluate(() => {
  const rows = []
  const scopes = [
    ['composer', "[data-slot='conversation.composer.bar']"],
    ['sidebar', "[data-slot='sidebar']"],
    ['header', "[data-slot='conversation.session.header']"],
    ['hero', "[class*='heroWorkspaceRow']"],
  ]
  for (const [scope, sel] of scopes) {
    const rootEl = document.querySelector(sel)
    if (rootEl === null) continue
    for (const b of rootEl.querySelectorAll('button, [role="button"], [role="combobox"], select')) {
      const r = b.getBoundingClientRect()
      if (r.width < 4 || r.height < 4) continue
      rows.push({
        scope,
        idx: rows.length,
        tag: b.tagName.toLowerCase(),
        cls: String(b.className).slice(0, 30),
        label: (b.getAttribute('aria-label') ?? b.textContent ?? '').trim().slice(0, 26),
        haspopup: b.getAttribute('aria-haspopup'),
        role: b.getAttribute('role'),
        box: `${Math.round(r.x)},${Math.round(r.y)}`,
      })
    }
  }
  return rows
})
console.log(`candidate triggers: ${list.length}`)
for (const t of list) console.log(`  [${t.scope}] "${t.label}" popup=${t.haspopup} role=${t.role} ${t.cls} @${t.box}`)

/** What opened after a click, and its row metrics. */
const snapshot = () => {
  const popup = document.querySelector("[role='menu'], [role='listbox'], [role='dialog'], [data-radix-popper-content-wrapper] > *")
  if (popup === null) return null
  const rows = [...popup.querySelectorAll("[role='menuitem'], [role='option'], [role='menuitemcheckbox'], [role='menuitemradio'], [class^='_item_'], li")].slice(0, 8)
  return {
    role: popup.getAttribute('role'),
    cls: String(popup.className).slice(0, 34),
    rowCount: rows.length,
    rows: rows.map(el => {
      const cs = getComputedStyle(el)
      return `${(el.textContent ?? '').trim().slice(0, 12)}[pad=${cs.padding} gap=${cs.gap} minH=${cs.minHeight} h=${Math.round(el.getBoundingClientRect().height)}]`
    }),
  }
}

const results = []
for (let i = 0; i < list.length; i++) {
  const t = list[i]
  const handle = page.locator(`button, [role="button"], [role="combobox"], select`).nth(0) // placeholder
  void handle
  const clicked = await page.evaluate(idx => {
    const rows = []
    const scopes = [
      [null, "[data-slot='conversation.composer.bar']"],
      [null, "[data-slot='sidebar']"],
      [null, "[data-slot='conversation.session.header']"],
      [null, "[class*='heroWorkspaceRow']"],
    ]
    for (const [, sel] of scopes) {
      const rootEl = document.querySelector(sel)
      if (rootEl === null) continue
      for (const b of rootEl.querySelectorAll('button, [role="button"], [role="combobox"], select')) {
        const r = b.getBoundingClientRect()
        if (r.width < 4 || r.height < 4) continue
        rows.push(b)
      }
    }
    const el = rows[idx]
    if (el === undefined) return false
    el.click()
    return true
  }, i)
  if (!clicked) continue
  await page.waitForTimeout(650)
  const snap = await page.evaluate(snapshot)
  results.push({ trigger: `[${t.scope}] ${t.label}`, opened: snap })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)
  // A dialog may need an explicit close (the settings modal does).
  await page.evaluate(() => {
    const close = document.querySelector("[role='dialog'] button[aria-label*='关闭'], [role='dialog'] button[aria-label*='Close']")
    if (close !== null) close.click()
  })
  await page.waitForTimeout(200)
}

console.log('\n=== popup results ===')
for (const r of results) {
  if (r.opened === null) { console.log(`  ${r.trigger} -> (nothing)`); continue }
  console.log(`  ${r.trigger} -> role=${r.opened.role} rows=${r.opened.rowCount} ${r.opened.cls}`)
  for (const row of r.opened.rows) console.log(`       ${row}`)
}
await context.close()
