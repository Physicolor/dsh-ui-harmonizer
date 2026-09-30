/**
 * The product's own Switch: its DOM, its stylesheet rules (read out of the live
 * CSSOM, whatever tag or sheet they came in on) and its computed geometry in both
 * states. This is the spec the rest of the ecosystem has to match.
 *
 * Run: node scripts/probes/settings/probe-official-switch.mjs [url]
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

const report = await page.evaluate(() => {
  const R = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 } }
  /* Every rule whose selector mentions the switch's own classes (or its thumb's),
   * from ANY sheet — the product's core CSS does not ride a data-plugin tag. */
  const rules = []
  const probe = document.querySelector('button[class*="_switch"], [role="switch"]')
  const keys = probe === null ? [] : [probe, ...probe.querySelectorAll('*')]
    .flatMap(el => String(el.className).split(/\s+/u).filter(Boolean))
    .map(c => c.replace(/_[0-9a-z]+_\d+$/u, ''))
  if (keys.length > 0) {
    for (const sheet of document.styleSheets) {
      let list = null
      try { list = sheet.cssRules } catch { continue }
      const walk = (rs) => {
        for (const rule of rs) {
          if (rule.cssRules !== undefined && rule.selectorText === undefined) { walk(rule.cssRules); continue }
          if (rule.selectorText === undefined) continue
          if (keys.some(k => rule.selectorText.includes(k))) rules.push(`${rule.selectorText} { ${rule.style.cssText} }`)
        }
      }
      walk(list)
    }
  }
  const describe = (el) => {
    if (el === null) return null
    const cs = getComputedStyle(el)
    return {
      tag: el.tagName.toLowerCase(), cls: String(el.className), rect: R(el),
      bg: cs.backgroundColor, radius: cs.borderRadius, border: `${cs.borderWidth} ${cs.borderStyle} ${cs.borderColor}`,
      padding: cs.padding, transition: `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}`,
      ariaChecked: el.getAttribute('aria-checked'), role: el.getAttribute('role'),
      children: [...el.children].map(c => {
        const ccs = getComputedStyle(c)
        return { tag: c.tagName.toLowerCase(), cls: String(c.className).slice(0, 40), rect: R(c), bg: ccs.backgroundColor, radius: ccs.borderRadius, transform: ccs.transform, boxShadow: ccs.boxShadow.slice(0, 60) }
      }),
    }
  }
  const switches = [...document.querySelectorAll('button[class*="_switch"], [role="switch"], button[aria-checked]')]
    .filter(el => el.getBoundingClientRect().height > 8)
    .map(el => ({ ...describe(el), label: (el.closest('label')?.textContent ?? el.parentElement?.parentElement?.textContent ?? '').trim().replace(/\s+/gu, ' ').slice(0, 30) }))
  return {
    keys,
    rules: [...new Set(rules)],
    tokens: (() => {
      const html = getComputedStyle(document.documentElement)
      const body = getComputedStyle(document.body)
      const read = (n) => body.getPropertyValue(n).trim() || html.getPropertyValue(n).trim()
      return {
        '--dsw-alias-switch-thumb': read('--dsw-alias-switch-thumb'),
        '--dsw-alias-border-l3': read('--dsw-alias-border-l3'),
        '--dsw-alias-brand-primary': read('--dsw-alias-brand-primary'),
        '--dsw-focus-ring-width': read('--dsw-focus-ring-width'),
        '--dsw-focus-ring-color': read('--dsw-focus-ring-color'),
      }
    })(),
    switches, html: probe === null ? null : probe.outerHTML.slice(0, 600),
  }
})
writeFileSync(`${OUT}/official-switch.json`, JSON.stringify(report, null, 2), 'utf8')
console.log('class key:', report.key)
console.log('--- rules ---')
for (const r of report.rules) console.log('  ' + r.replace(/\s+/gu, ' ').slice(0, 320))
console.log('--- dom ---')
console.log(report.html)
console.log('--- instances ---')
console.log(JSON.stringify(report.switches, null, 1).slice(0, 3000))
await context.close()
