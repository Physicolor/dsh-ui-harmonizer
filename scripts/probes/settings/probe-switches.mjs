/**
 * Switch inventory: every on/off control the app currently renders, with the
 * plugin that owns its stylesheet — so "align our switches with the product's"
 * starts from a complete, attributed list instead of a guess.
 *
 * Walks every settings nav page (that is where switches live), and on each one
 * reports each control's box, radius, on/off colours, thumb geometry and the
 * `<style data-plugin>` that declares its classes. The product's own Switch
 * stylesheet is dumped verbatim too, so the spec can be read rather than
 * reverse-engineered from one screenshot.
 *
 * Run: node scripts/probes/settings/probe-switches.mjs [url]
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

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)
await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
await page.waitForTimeout(1500)

/** Measure every switch-ish control on the current page + attribute its classes. */
const SCAN = () => {
  const R = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 } }
  const ownerOf = (cls) => {
    const owners = new Set()
    for (const sheet of document.styleSheets) {
      let rules = null
      try { rules = sheet.cssRules } catch { continue }
      for (const rule of rules) {
        if (rule.selectorText !== undefined && rule.selectorText.includes(cls)) {
          owners.add(sheet.ownerNode?.dataset?.plugin ?? sheet.ownerNode?.dataset?.pluginCss ?? '(product/inline)')
        }
      }
    }
    return [...owners]
  }
  const describe = (el) => {
    const cs = getComputedStyle(el)
    const cls = String(el.className)
    return {
      tag: el.tagName.toLowerCase(),
      cls: cls.slice(0, 60),
      rect: R(el),
      bg: cs.backgroundColor,
      radius: cs.borderRadius,
      border: `${cs.borderWidth} ${cs.borderStyle}`,
      transition: cs.transitionProperty === 'none' ? 'none' : `${cs.transitionProperty} ${cs.transitionDuration}`,
      checked: el.checked ?? el.getAttribute('aria-checked') ?? null,
      owners: [...new Set(cls.split(/\s+/u).filter(Boolean).flatMap(c => ownerOf(c)))],
      text: (el.closest('label')?.textContent ?? el.parentElement?.textContent ?? '').trim().replace(/\s+/gu, ' ').slice(0, 26),
    }
  }
  const out = []
  for (const el of document.querySelectorAll('input[type="checkbox"], [role="switch"], [class*="switch" i], [class*="_toggle" i]')) {
    const r = el.getBoundingClientRect()
    if (r.width < 8 || r.height < 8) continue
    if (getComputedStyle(el).opacity === '0') { /* the hidden input of a custom switch: keep, it names the control */ }
    out.push(describe(el))
  }
  /* The product's own Switch stylesheet, if this view loaded it. */
  const sheets = [...document.querySelectorAll('style[data-plugin-css*="Switch"], style[data-plugin-css*="switch"]')]
    .map(t => ({ id: t.dataset.pluginCss, css: (t.textContent ?? '').slice(0, 1400) }))
  return { switches: out, sheets }
}

const nav = await page.evaluate(() => {
  const dialog = document.querySelector("[role='dialog']")
  if (dialog === null) return []
  return [...dialog.querySelectorAll('button')].map((b, i) => {
    const r = b.getBoundingClientRect()
    return { i, label: (b.textContent ?? '').trim().slice(0, 16), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }
  }).filter(b => b.w > 60 && b.x < 460 && b.label !== '')
})
console.log('nav items:', nav.map(n => n.label).join(' | '))

const pages = []
const seen = new Set()
for (const item of nav) {
  await page.evaluate(i => {
    const dialog = document.querySelector("[role='dialog']")
    const b = dialog === null ? null : [...dialog.querySelectorAll('button')][i]
    if (b !== null) b.click()
  }, item.i)
  await page.waitForTimeout(900)
  const scan = await page.evaluate(SCAN)
  if (scan.switches.length === 0 && scan.sheets.length === 0) continue
  const key = JSON.stringify(scan.switches.map(s => s.cls))
  if (seen.has(key)) continue
  seen.add(key)
  pages.push({ nav: item.label, ...scan })
}

const result = { url: URL_ARG, pages }
writeFileSync(`${OUT}/switches.json`, JSON.stringify(result, null, 2), 'utf8')
for (const p of pages) {
  console.log(`\n=== ${p.nav} ===`)
  for (const s of p.switches) console.log(`  ${s.rect.w}x${s.rect.h} r=${s.radius} bg=${s.bg} checked=${s.checked} | ${s.tag}.${s.cls} | owners=${JSON.stringify(s.owners)} | ${s.text}`)
  for (const sh of p.sheets) console.log(`  [sheet] ${sh.id}\n    ${sh.css.replace(/\s+/gu, ' ').slice(0, 900)}`)
}
await context.close()
