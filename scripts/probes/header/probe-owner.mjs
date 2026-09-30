/**
 * Ownership probe: for a set of controls in the session header, report what the
 * live DOM says about each one — its own classes, its aria/title, its seat slot
 * and the stylesheet tag that defines its classes (product = no data-plugin,
 * a plugin = data-plugin="<package>").
 *
 * Run: node scripts/probes/header/probe-owner.mjs [url] [sessionTitleSubstring]
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
const TITLE = process.argv[3] ?? '这个弹出的宽度'
const OUT = 'D:/dsh-home/probe-ui/owner'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)
await page.evaluate(t => {
  const rows = [...document.querySelectorAll("[data-slot='sidebar.workspaces'] [class*='_sessionRow']")]
  const row = rows.find(r => (r.textContent ?? '').includes(t))
  if (row !== undefined) row.click()
}, TITLE)
await page.waitForTimeout(3500)

const report = await page.evaluate(() => {
  const R = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}` }
  /** Which <style> tag declares this class, and who owns that tag? */
  const ownerOfClass = cls => {
    const owners = new Set()
    for (const sheet of document.styleSheets) {
      let rules = null
      try { rules = sheet.cssRules } catch { continue }
      for (const rule of rules) {
        if (rule.selectorText !== undefined && rule.selectorText.includes(cls)) {
          const tag = sheet.ownerNode
          owners.add(tag === null ? '(inline)' : (tag.dataset?.plugin ?? tag.dataset?.pluginCss ?? '(product — no data-plugin)'))
        }
      }
    }
    return [...owners]
  }
  const seat = el => {
    for (let n = el; n !== null && n !== document.body; n = n.parentElement) {
      const slot = n.getAttribute?.('data-slot')
      if (slot !== null && slot !== undefined) return slot
    }
    return null
  }
  const describe = el => ({
    tag: el.tagName.toLowerCase(),
    cls: String(el.className),
    rect: R(el),
    ariaLabel: el.getAttribute('aria-label'),
    title: el.getAttribute('title'),
    text: (el.textContent ?? '').trim().replace(/\s+/gu, ' ').slice(0, 40),
    outerHtml: el.outerHTML.slice(0, 420),
    seat: seat(el),
    classOwners: String(el.className).split(/\s+/u).filter(Boolean).map(c => `${c} -> ${JSON.stringify(ownerOfClass(c))}`),
  })
  const targets = {}
  for (const [key, sel] of Object.entries({
    rightExpand: '[data-sidebar-right-expand]',
    openInApp: '[class*="WgQWqa"]',
    corner: "[data-slot='conversation.session.header.corner']",
    utilities: "[class*='_headerUtilities']",
    rightbar: "[class*='OUqwTW_']",
  })) {
    targets[key] = [...document.querySelectorAll(sel)].map(describe)
  }
  /* Right sidebar package styles: any tag whose data-plugin names it. */
  targets.rightbarStyleTags = [...document.querySelectorAll('style[data-plugin*="sidebar-right"], style[data-plugin*="open-in-app"], style[data-plugin*="better-sidebar"]')]
    .map(t => `${t.dataset.plugin} :: ${t.dataset.pluginCss ?? ''}`)
  targets.allStyleOwners = [...new Set([...document.querySelectorAll('style[data-plugin]')].map(t => t.dataset.plugin))].sort()
  return targets
})
writeFileSync(`${OUT}/owner.json`, JSON.stringify(report, null, 2), 'utf8')
console.log(JSON.stringify(report, null, 2).slice(0, 9000))
await context.close()
