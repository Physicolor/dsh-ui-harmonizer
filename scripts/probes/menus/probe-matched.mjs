/**
 * Matched-styles probe for one node: "which rule gives this element that
 * property?" — answers by Chromium's own cascade instead of by reading sheets.
 *
 * Run: node scripts/probes/menus/probe-matched.mjs <url> <selector> [property]
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
const URL_ARG = process.argv[2] ?? process.env.DSH_URL ?? 'http://127.0.0.1:19387'
const SELECTOR = process.argv[3] ?? 'p.dsh_notification_subtitle'
const PROPERTY = process.argv[4] ?? 'font-weight'

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-harmony', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(3500)
// Open settings and walk to the page the selector lives on.
await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
await page.waitForTimeout(1200)
for (const label of ['通知', '模型', 'Command Code', '侧边卡片']) {
  const btn = page.locator("[role='dialog'] nav button", { hasText: label }).first()
  if (await btn.count() === 0) continue
  await btn.click().catch(() => null)
  await page.waitForTimeout(700)
  if (await page.locator(SELECTOR).count() > 0) break
}

const found = await page.evaluate(sel => {
  const el = document.querySelector(sel)
  if (el === null) return null
  const cs = getComputedStyle(el)
  return { html: el.outerHTML.slice(0, 200), computed: { weight: cs.fontWeight, size: cs.fontSize, family: cs.fontFamily }, parent: el.parentElement === null ? null : el.parentElement.outerHTML.slice(0, 200) }
}, SELECTOR)
console.log('node: ' + JSON.stringify(found, null, 2))

const cdp = await context.newCDPSession(page)
await cdp.send('DOM.enable')
await cdp.send('CSS.enable')
const { root } = await cdp.send('DOM.getDocument', { depth: -1 })
const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: SELECTOR })
if (nodeId === 0) { console.log('selector not found'); await context.close(); process.exit(0) }
const res = await cdp.send('CSS.getMatchedStylesForNode', { nodeId })
const sheetName = id => String(id)
console.log(`=== rules mentioning ${PROPERTY} ===`)
for (const m of res.matchedCSSRules ?? []) {
  const value = m.rule.style.cssProperties.find(p => p.name === PROPERTY && p.disabled !== true)
  if (value !== undefined) console.log(`  ${m.rule.selectorList.text.slice(0, 100)}  =>  ${PROPERTY}:${value.value}   <${sheetName(m.rule.styleSheetId).split('/').pop()}>`)
}
for (const entry of res.inherited ?? []) {
  for (const m of entry.matchedCSSRules ?? []) {
    const value = m.rule.style.cssProperties.find(p => p.name === PROPERTY && p.disabled !== true)
    if (value !== undefined) console.log(`  [inherited] ${m.rule.selectorList.text.slice(0, 90)}  =>  ${PROPERTY}:${value.value}   <${sheetName(m.rule.styleSheetId).split('/').pop()}>`)
  }
}
await context.close()
