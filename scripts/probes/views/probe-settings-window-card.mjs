/**
 * Second pass on the official settings window: the WINDOW CARD itself (radius,
 * background, shadow, border) and the content column's spacing rhythm, plus the
 * nav items — the numbers to reconcile dsh-context's dashboard card with.
 *
 * Run: node scripts/probes/views/probe-settings-window-card.mjs [url]
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
const OUT = 'D:/dsh-home/probe-ui/settings-window'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-settings', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
const errors = []
page.on('pageerror', e => errors.push(e && e.message ? e.message : String(e)))
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)
await page.locator("[data-slot='settings.trigger']").first().click({ timeout: 8000 }).catch(() => {})
await page.waitForTimeout(2500)

const REPORT = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] }
  const nm = el => el === null ? null : (String(el.className || el.tagName).slice(0, 46))
  const info = (el) => { if (el === null) return null
    const cs = getComputedStyle(el)
    return { cls: nm(el), slot: el.getAttribute('data-slot') ?? undefined, rect: R(el), radius: cs.borderRadius,
      padding: cs.padding, margin: cs.margin, gap: cs.gap === 'normal' ? undefined : cs.gap, display: cs.display,
      bg: cs.backgroundColor, shadow: cs.boxShadow === 'none' ? undefined : cs.boxShadow.slice(0, 90),
      border: cs.border === '0px none rgb(15, 17, 21)' ? undefined : cs.border.slice(0, 46),
      font: cs.fontSize + '/' + cs.lineHeight + ' ' + cs.fontWeight, color: cs.color,
      flex: cs.flex === '0 1 auto' ? undefined : cs.flex, overflow: cs.overflowY }
  }
  const nav = document.querySelector("[class*='_nav']")
  const chain = []
  let n = nav
  for (let i = 0; n !== null && i < 6; i++) { chain.push(info(n)); n = n.parentElement }
  const win = nav === null ? null : nav.parentElement
  const winKids = win === null ? [] : [...win.children].map(info)
  const section = document.querySelector("[data-slot='settings.section']")
  // the real content column = the ancestor box that holds the section
  let content = section
  while (content !== null && (content.getBoundingClientRect().width < 200 || getComputedStyle(content).display === 'contents')) content = content.parentElement
  const contentKids = content === null ? [] : [...content.children].slice(0, 8).map(info)
  const sectionKids = section === null ? [] : [...section.children].slice(0, 10).map(el => {
    const i = info(el)
    i.text = (el.textContent ?? '').trim().slice(0, 24)
    return i
  })
  const rows = section === null ? [] : [...section.querySelectorAll('*')].filter(el => {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect()
    return r.width > 380 && r.height > 36 && (cs.borderBottomWidth !== '0px' || cs.paddingBottom !== '0px' || cs.minHeight !== '0px')
  }).slice(0, 6).map(info)
  const navItems = nav === null ? [] : [...nav.children].slice(0, 5).map(el => { const i = info(el); i.text = (el.textContent ?? '').trim().slice(0, 16); return i })
  return { chain, winKids, content: info(content), contentKids, sectionKids, rows, navItems }
})()`

const report = await page.evaluate(REPORT)
const out = JSON.stringify(report, null, 1)
writeFileSync(`${OUT}/settings-card.json`, out, 'utf8')
console.log(out.slice(0, 5200))
console.log('\npage errors:', errors.length === 0 ? '(none)' : errors.join(' | '))
await context.close()
