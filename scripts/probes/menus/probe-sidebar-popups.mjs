/**
 * Enumerate every sidebar control that opens a popup, and measure the popup
 * against the control it hangs from. Evidence for "a row popup should be as wide
 * as its row" and the list of places where that is checkable in the web build.
 *
 * Run: node scripts/probes/menus/probe-sidebar-popups.mjs [url]
 */
import { createRequire } from 'node:module'
import { existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { authCookieFor } from '../../lib/auth.mjs'

const PW_ROOT = 'C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32'
const require = createRequire(PW_ROOT + '/noop.js')
const { chromium } = require('playwright-core')
const CHROME_CANDIDATES = [
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1246/chrome-win64/chrome.exe',
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',
]
const CREDENTIALS = 'D:/dsh-home/.credentials.yaml'
const PROFILE_DIR = process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-harmony'
const URL_ARG = process.argv[2] ?? process.env.DSH_URL ?? 'http://127.0.0.1:19387'
const OUT = 'D:/dsh-home/probe-ui/sidebar-popups'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(4000)

// Expand the sidebar first: a collapsed rail hides the rows this probe is about.
await page.evaluate(() => {
  const toggle = document.querySelector("[data-slot='sidebar'] [class*='_toggle']")
  if (toggle !== null && toggle.getBoundingClientRect().width < 40) toggle.click()
})
await page.waitForTimeout(1200)

const results = await page.evaluate(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms))
  const rect = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } }
  const sidebar = document.querySelector("[data-slot='sidebar']")
  // Rows (session / workspace / project) open context menus on click too, and
  // their overflow buttons only exist once the row is hovered.
  const rows = [...sidebar.querySelectorAll("[class*='_sessionRow'], [class*='_workspaceRow'], [class*='_projectRow'], [class*='_groupSection'], [class*='_sectionHeader']")]
    .filter(el => { const r = el.getBoundingClientRect(); return r.width > 120 && r.height > 12 })
  for (const row of rows.slice(0, 6)) {
    row.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }))
    row.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  }
  await sleep(300)
  const buttons = [...sidebar.querySelectorAll('button, [role="button"]')].filter(b => {
    const r = b.getBoundingClientRect()
    return r.width > 8 && r.height > 8
  })
  const out = []
  for (const b of buttons) {
    const before = rect(b)
    const label = (b.getAttribute('aria-label') ?? b.textContent ?? '').trim().slice(0, 22)
    b.click()
    await sleep(600)
    const menu = document.querySelector("[role='menu']")
    const dialog = document.querySelector("[role='dialog']")
    if (menu !== null) {
      const list = menu.querySelector("[class^='_list_']") ?? menu
      const item = menu.querySelector("[class^='_item_']")
      out.push({
        row: { cls: String(b.className).slice(0, 50), label, box: before, slot: b.closest('[data-slot]')?.getAttribute('data-slot') ?? null, popup: b.getAttribute('aria-haspopup') },
        menu: {
          cls: String(menu.className).slice(0, 50),
          box: rect(menu),
          listCls: String(list.className).slice(0, 60),
          listBox: rect(list),
          style: list.getAttribute('style'),
          itemBox: item === null ? null : rect(item),
          itemCls: item === null ? null : String(item.className).slice(0, 40),
        },
      })
    } else if (dialog !== null) {
      out.push({ row: { cls: String(b.className).slice(0, 50), label, box: before, slot: b.closest('[data-slot]')?.getAttribute('data-slot') ?? null }, menu: null, dialog: true })
      const close = dialog.querySelector("button[aria-label*='关闭'], button[aria-label*='Close']")
      if (close !== null) close.click()
    } else {
      out.push({ row: { cls: String(b.className).slice(0, 50), label, box: before, slot: b.closest('[data-slot]')?.getAttribute('data-slot') ?? null }, menu: null })
    }
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await sleep(250)
  }
  return out
})

console.log(`sidebar controls tested: ${results.length}`)
for (const r of results) {
  if (r.menu === null) { console.log(`  (no menu) ${r.row.cls} "${r.row.label}" slot=${r.row.slot} ${JSON.stringify(r.row.box)}${r.dialog ? ' -> DIALOG' : ''}`); continue }
  console.log(`  MENU ${r.row.cls} "${r.row.label}" slot=${r.row.slot} row=${JSON.stringify(r.row.box)}`)
  console.log(`        menu=${JSON.stringify(r.menu.box)} list=${JSON.stringify(r.menu.listBox)} style=${r.menu.style}`)
  console.log(`        listCls=${r.menu.listCls} item=${r.menu.itemCls}`)
}
writeFileSync(`${OUT}/sidebar-popups.json`, JSON.stringify(results, null, 2), 'utf8')
console.log('written: ' + OUT)
await context.close()
