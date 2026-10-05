/**
 * Measure the OFFICIAL settings window: the shell's radius / padding / shadow,
 * the nav column vs the content column spacing, the section container's gap and
 * the header rhythm — the numbers dsh-context's 上下文洞察 dashboard is to be
 * reconciled with (see docs/settings-section-style.md for the header spec).
 *
 * Read-only: opens the app, clicks the sidebar 设置 trigger, reads geometry.
 * Run: node scripts/probes/views/probe-settings-window-geometry.mjs [url]
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

// open settings: the sidebar foot trigger, with text fallbacks
const trigger = page.locator("[data-slot='settings.trigger']").first()
console.log('trigger count:', await trigger.count())
await trigger.click({ timeout: 8000 }).catch(async () => {
  await page.getByText('设置', { exact: true }).first().click({ timeout: 8000 }).catch(() => {})
})
await page.waitForTimeout(2500)

const REPORT = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] }
  const nm = el => el === null ? null : (String(el.className || el.tagName).slice(0, 52))
  const info = (label, el) => { if (el === null) return { label, missing: true }
    const cs = getComputedStyle(el)
    return { label, cls: nm(el), slot: el.getAttribute('data-slot') ?? undefined, rect: R(el),
      radius: cs.borderRadius, padding: cs.padding, margin: cs.margin, gap: cs.gap, display: cs.display,
      bg: cs.backgroundColor, shadow: cs.boxShadow === 'none' ? undefined : cs.boxShadow.slice(0, 80), border: cs.border.slice(0, 40),
      font: cs.fontSize + '/' + cs.lineHeight + ' ' + cs.fontWeight, color: cs.color, overflow: cs.overflow }
  }
  const overlayRoots = []
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el)
    if (cs.position !== 'fixed' && cs.position !== 'absolute') continue
    const r = el.getBoundingClientRect()
    if (r.width < 420 || r.height < 380) continue
    overlayRoots.push(info('overlay?' + (overlayRoots.length), el))
  }
  const section = document.querySelector("[data-slot='settings.section']")
  const slot = document.querySelector("[data-slot='settings']")
  const nav = document.querySelector("[class*='_nav']")
  const h2 = section === null ? null : section.querySelector('h2')
  const intro = section === null ? null : [...section.querySelectorAll('p')].find(p => (p.textContent ?? '').length > 12) ?? null
  const tree = (el, depth) => { if (el === null || depth < 0) return null
    const kids = [...el.children].slice(0, 8).map(c => tree(c, depth - 1)).filter(Boolean)
    return { i: info('n', el), kids }
  }
  return {
    url: location.href,
    overlayRoots: overlayRoots.slice(0, 6),
    settingsSlot: slot === null ? null : info('settings.slot', slot),
    section: section === null ? null : info('settings.section', section),
    sectionTree: section === null ? null : tree(section, 2),
    nav: nav === null ? null : info('nav?', nav),
    h2: h2 === null ? null : info('h2', h2),
    intro: intro === null ? null : info('p', intro),
    firstRow: section === null ? null : (() => { const cand = [...section.querySelectorAll('*')].find(el => { const r = el.getBoundingClientRect(); return r.height > 30 && r.width > 400 && getComputedStyle(el).borderBottomWidth !== '0px' }); return cand === undefined ? null : info('hairlineRow', cand) })(),
  }
})()`

const report = await page.evaluate(REPORT)
console.log(JSON.stringify({ url: report.url, overlayRoots: report.overlayRoots, settingsSlot: report.settingsSlot, section: report.section, nav: report.nav, h2: report.h2, intro: report.intro, firstRow: report.firstRow }, null, 1))
await page.screenshot({ path: `${OUT}/settings-window.png` })
writeFileSync(`${OUT}/settings-window.json`, JSON.stringify(report, null, 1), 'utf8')
console.log('\npage errors:', errors.length === 0 ? '(none)' : errors.join(' | '))
await context.close()
