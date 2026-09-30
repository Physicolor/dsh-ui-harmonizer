/**
 * Switch inventory, per settings page: which plugin's switch control actually
 * RENDERS where, plus the full rule set behind each one (from the live CSSOM).
 *
 * Why per page: a stylesheet can be loaded without its element ever appearing —
 * adapting a control that never renders is dead CSS, which is exactly what the
 * Harmony Doctor flags. This probe separates "loaded" from "on screen".
 *
 * Run: node scripts/probes/settings/probe-switch-rules.mjs [url]
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
const OUT = 'D:/dsh-home/probe-ui/switches'
mkdirSync(OUT, { recursive: true })

const STEMS = {
  official: ['_switch_1ik0f'],
  'dsh-widgets (ours)': ['dsx-switch'],
  'dsh-ui-harmonizer (ours)': ['uitw-switch'],
  'dshmarket': ['nUhMVa_switch'],
  'dsh-genui': ['V1MMBW_switch'],
  'commandcode': ['cc-toggle'],
  'dsh-notification': ['dsh_notification_checkbox'],
}

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)
await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
await page.waitForTimeout(1200)

const nav = await page.evaluate(() => {
  const dialog = document.querySelector("[role='dialog']")
  if (dialog === null) return []
  return [...dialog.querySelectorAll('button')].map((b, i) => {
    const r = b.getBoundingClientRect()
    return { i, label: (b.textContent ?? '').trim().slice(0, 16), x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) }
  }).filter(b => b.w > 60 && b.x < 460 && b.label !== '' && b.h < 60)
})

const SCAN = (stems) => {
  const R = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.width * 100) / 100}x${Math.round(r.height * 100) / 100}` }
  const out = {}
  for (const [owner, list] of Object.entries(stems)) {
    const els = []
    for (const s of list) for (const el of document.querySelectorAll(`[class*="${s}"]`)) els.push(el)
    out[owner] = els.filter(el => { const r = el.getBoundingClientRect(); return r.width >= 4 && r.height >= 4 }).map(el => {
      const cs = getComputedStyle(el)
      const kid = el.querySelector('*')
      const kcs = kid === null ? null : getComputedStyle(kid)
      return {
        cls: String(el.className).slice(0, 40), box: R(el), bg: cs.backgroundColor, radius: cs.borderRadius, border: cs.borderWidth,
        on: el.getAttribute('aria-checked') ?? (el.checked ?? (String(el.className).includes('On') ? 'classOn' : null)),
        thumb: kid === null ? null : `${R(kid)} r=${kcs.borderRadius} bg=${kcs.backgroundColor} shadow=${kcs.boxShadow === 'none' ? 'none' : 'yes'} xform=${kcs.transform}`,
      }
    })
  }
  return out
}

const pages = []
for (const item of nav) {
  await page.evaluate(i => {
    const dialog = document.querySelector("[role='dialog']")
    const b = dialog === null ? null : [...dialog.querySelectorAll('button')][i]
    if (b !== null) b.click()
  }, item.i)
  await page.waitForTimeout(1100)
  const found = await page.evaluate(SCAN, STEMS)
  const counts = Object.fromEntries(Object.entries(found).map(([k, v]) => [k, v.length]))
  if (Object.values(counts).some(n => n > 0)) pages.push({ nav: item.label, counts, instances: found })
}
writeFileSync(`${OUT}/switch-pages.json`, JSON.stringify({ url: URL_ARG, pages }, null, 2), 'utf8')

console.log('owner'.padEnd(26) + pages.map(p => p.nav.padEnd(12)).join(''))
for (const owner of Object.keys(STEMS)) {
  const row = pages.map(p => String(p.counts[owner] ?? 0).padEnd(12)).join('')
  console.log(owner.padEnd(26) + row)
}
for (const p of pages) {
  for (const [owner, list] of Object.entries(p.instances)) {
    for (const i of list) console.log(`  [${p.nav}] ${owner}: ${i.box} r=${i.radius} bg=${i.bg} border=${i.border} on=${i.on} thumb=${i.thumb}`)
  }
}
await context.close()
