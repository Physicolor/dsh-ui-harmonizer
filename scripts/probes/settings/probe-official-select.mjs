/**
 * The product's own Select (Settings → General → 权限 / 语言): the trigger, the
 * rules that style it, and the menu that opens — DOM, computed geometry, tokens.
 * This is the spec every ecosystem settings row has to match.
 *
 *   node scripts/probes/settings/probe-official-select.mjs [url]
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
const URL_ARG = process.argv.slice(2).find((a) => a.startsWith('http')) ?? 'http://127.0.0.1:19387'
/** `--clean` disables this plugin's own sheets first: the product's numbers, unmodified. */
const CLEAN = process.argv.includes('--clean')
const OUT = process.env.DSH_PROBE_OUT ?? (CLEAN ? 'D:/dsh-home/probe-ui/select-clean' : 'D:/dsh-home/probe-ui/select')
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)
if (CLEAN) {
  const off = await page.evaluate(() => {
    let n = 0
    for (const sheet of document.styleSheets) {
      let hit = false
      try { hit = [...sheet.cssRules].some((r) => (r.cssText ?? '').includes('--enhancer-chat-scale')) } catch { continue }
      if (hit) { sheet.disabled = true; n += 1 }
    }
    return n
  })
  console.log(`--clean: disabled ${off} of this plugin's sheets`)
}
await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
await page.waitForTimeout(1800)
await page.evaluate(() => {
  const dialog = document.querySelector("[role='dialog']")
  if (dialog === null) return
  for (const b of dialog.querySelectorAll('button')) {
    const r = b.getBoundingClientRect()
    if (r.width > 60 && r.x < 460 && r.height < 60 && (b.textContent ?? '').trim() === '通用设置') { b.click(); return }
  }
})
await page.waitForTimeout(1500)

/** Describe an element: geometry + the computed properties a control is made of. */
const DESCRIBE = `(el) => {
  if (el === null) return null
  const cs = getComputedStyle(el); const r = el.getBoundingClientRect()
  return {
    tag: el.tagName.toLowerCase(), cls: String(el.className), rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 },
    role: el.getAttribute('role'), state: el.getAttribute('data-state'), expanded: el.getAttribute('aria-expanded'),
    bg: cs.backgroundColor, backdrop: cs.backdropFilter, radius: cs.borderRadius, cornerShape: cs.cornerShape,
    border: cs.borderWidth + ' ' + cs.borderStyle + ' ' + cs.borderColor, padding: cs.padding, gap: cs.gap,
    font: cs.fontSize + '/' + cs.lineHeight, color: cs.color, boxShadow: cs.boxShadow.slice(0, 120),
    transition: cs.transitionProperty + ' ' + cs.transitionDuration + ' ' + cs.transitionTimingFunction,
    outline: cs.outlineWidth + ' ' + cs.outlineStyle,
    text: (el.textContent ?? '').trim().replace(/\\s+/gu, ' ').slice(0, 40),
  }
}`

const before = await page.evaluate(`(() => {
  const D = ${DESCRIBE}
  const trigger = [...document.querySelectorAll("[role='dialog'] button")].find(b => /_selector/.test(String(b.className)) && b.textContent.trim() === '完全权限')
  if (trigger === undefined) return { error: 'trigger not found', seen: [...document.querySelectorAll("[role='dialog'] button")].map(b => String(b.className) + '|' + b.textContent.trim().slice(0, 12)).slice(0, 30) }
  document.querySelectorAll('*').forEach(el => el.setAttribute('data-probe-pre', '1'))
  const r = trigger.getBoundingClientRect()
  return { trigger: D(trigger), parent: D(trigger.parentElement), row: D(trigger.closest("[class*='_row'], [class*='_field']")) }
})()`)
console.log('--- trigger ---')
console.log(JSON.stringify(before, null, 1))

await page.evaluate(() => {
  const trigger = [...document.querySelectorAll("[role='dialog'] button")].find(b => /_selector/.test(String(b.className)) && b.textContent.trim() === '完全权限')
  trigger.click()
})
await page.waitForTimeout(600)

const after = await page.evaluate(`(() => {
  const D = ${DESCRIBE}
  const added = [...document.querySelectorAll('*:not([data-probe-pre])')]
  const roots = added.filter(el => el.parentElement !== null && el.parentElement.hasAttribute('data-probe-pre'))
  const tree = (el, depth) => ({ ...D(el), children: depth <= 0 ? [] : [...el.children].map(c => tree(c, depth - 1)) })
  const keys = [...new Set([...added, ...document.querySelectorAll("[role='dialog'] *")].flatMap(el => String(el.className).split(/\\s+/u)).filter(c => /_/.test(c)).map(c => c.replace(/_[0-9a-z]+_\\d+$/u, '')))].filter(k => k.length > 4)
  const sheets = []
  for (const sheet of document.styleSheets) {
    let list = null
    try { list = sheet.cssRules } catch { continue }
    const walk = (rs) => {
      for (const rule of rs) {
        if (rule.cssRules !== undefined && rule.selectorText === undefined) { walk(rule.cssRules); continue }
        if (rule.selectorText === undefined) continue
        if (keys.some(k => rule.selectorText.includes(k))) sheets.push(rule.selectorText + ' { ' + rule.style.cssText + ' }')
      }
    }
    walk(list)
  }
  const html = getComputedStyle(document.documentElement), body = getComputedStyle(document.body)
  const read = (n) => body.getPropertyValue(n).trim() || html.getPropertyValue(n).trim()
  const tokens = Object.fromEntries(['--dsw-alias-bg-layer-1','--dsw-alias-bg-layer-2','--dsw-alias-bg-module-platform','--dsw-alias-bg-overlay','--dsw-alias-border-l1','--dsw-alias-border-l2','--dsw-alias-border-l3','--dsw-alias-interactive-bg-hover','--dsw-alias-menu-icon','--dsw-elevation-prominent','--dsw-menu-surface-fill','--dsw-menu-backdrop-filter','--dsw-radius-sm','--dsw-radius-md','--dsw-radius-lg','--dsw-shadow-lv2','--dsw-shadow-lv3'].map(n => [n, read(n)]))
  const triggerHtml = document.querySelector("[role='dialog'] button[class*='_selector']")?.outerHTML ?? null
  const selectedHtml = document.querySelector("[role='menu'] [class*='_selected_']")?.outerHTML ?? null
  return { roots: roots.map(el => tree(el, 3)), keys, sheets: [...new Set(sheets)], tokens, triggerHtml, selectedHtml, addedCount: added.length }
})()`)

writeFileSync(`${OUT}/official-select.json`, JSON.stringify({ before, after }, null, 2), 'utf8')
console.log('--- trigger html ---')
console.log(after.triggerHtml)
console.log('--- selected item html ---')
console.log(after.selectedHtml)
console.log('--- tokens ---')
console.log(JSON.stringify(after.tokens, null, 1))
console.log('--- rules ---')
for (const r of after.sheets) console.log('  ' + r.replace(/\s+/gu, ' ').slice(0, 420))
await context.close()
