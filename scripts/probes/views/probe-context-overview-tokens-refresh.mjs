/**
 * Two questions at once:
 *
 *  1. do dsh-context's "active" pills (`.lc-gran-on`, `.lc-ov-chip-on`) resolve
 *     the same tokens the product's own primary buttons do, in BOTH themes, or
 *     do they resolve to light values under dark chrome?
 *  2. how fast does harmonizer's `--enhc-solid-fill` follow a theme flip (the
 *     literal it paints the session header / better-sidebar chrome with)?
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
const TITLE = process.argv[3] ?? '帮我检查我下载了一个上下文'
const OUT = 'D:/dsh-home/probe-ui/context-overview'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-ov', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)
const groups = page.locator("[data-slot='sidebar.workspaces'] [class*='_projectRow']")
const n = await groups.count()
for (let i = 0; i < n; i++) {
  const g = groups.nth(i)
  if ((await g.getAttribute('aria-expanded')) === 'false') { await g.click(); await page.waitForTimeout(250) }
}
await page.waitForTimeout(1000)
await page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']").filter({ hasText: TITLE }).first().click().catch(() => {})
await page.waitForTimeout(4500)
await page.locator('.lc-ov-entry').first().click({ timeout: 8000 }).catch(async () => { await page.locator('.lc-ov-entry').first().dispatchEvent('click').catch(() => {}) })
await page.waitForTimeout(1500)

const TOKENS = String.raw`(() => {
  const T = ['--dsw-alias-button-primary-fill','--dsw-alias-brand-primary','--dsw-alias-label-primary-foreground','--dsw-alias-bg-layer-1','--dsw-alias-bg-layer-2','--dsw-alias-bg-base']
  const read = (label, el) => { if (el === null) return { label, missing: true }
    const cs = getComputedStyle(el); const o = {}
    for (const t of T) o[t.replace('--dsw-alias-', '')] = cs.getPropertyValue(t).trim()
    return { label, cls: String(el.className).slice(0, 40), bg: cs.backgroundColor, color: cs.color, ...o } }
  const byText = (sel, text) => [...document.querySelectorAll(sel)].find(el => (el.textContent ?? '').trim() === text) ?? null
  return {
    dark: document.body.hasAttribute('data-ds-dark-theme'),
    htmlSource: document.documentElement.getAttribute('data-ds-theme-source'),
    enhcFill: getComputedStyle(document.documentElement).getPropertyValue('--enhc-solid-fill').trim(),
    body: read('body', document.body),
    chipOn: read('chip-on', document.querySelector('.lc-ov-chip-on')),
    granOn: read('gran-on', document.querySelector('.lc-gran-on')),
    rangeOn: read('range-on', document.querySelector('.lc-ov-range .lc-gran-on') ?? document.querySelector('.lc-gran-on')),
    newSession: read('newSession', byText('button', '新会话') ?? document.querySelector("[class*='_newSession']")),
    send: read('send', document.querySelector("[class*='_primary'], [class*='send']")),
    kpi: read('kpi-card', document.querySelector('.lc-card')),
    header: read('header', document.querySelector("[data-slot='conversation.header'] > header")),
  }
})()`

const snapAll = async (tag) => {
  const v = await page.evaluate(TOKENS)
  console.log(`\n=== ${tag} (dark=${v.dark}, html=${v.htmlSource}, enhc-solid-fill=${v.enhcFill}) ===`)
  for (const key of ['body', 'chipOn', 'granOn', 'newSession', 'kpi', 'header']) {
    console.log('  ' + JSON.stringify(v[key]))
  }
  return v
}

const out = {}
out.boot = await snapAll('boot')

await page.evaluate(() => { document.body.removeAttribute('data-ds-dark-theme'); document.documentElement.setAttribute('data-ds-theme-source', 'light') })
await page.waitForTimeout(2600)
out.light = await snapAll('forced light')

// latency of --enhc-solid-fill after the flip to dark
const before = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--enhc-solid-fill').trim())
const t0 = Date.now()
await page.evaluate(() => { document.body.setAttribute('data-ds-dark-theme', ''); document.documentElement.setAttribute('data-ds-theme-source', 'dark') })
let latency = null
const trace = []
for (let i = 0; i < 40; i++) {
  await page.waitForTimeout(100)
  const v = await page.evaluate(() => ({
    fill: getComputedStyle(document.documentElement).getPropertyValue('--enhc-solid-fill').trim(),
    base: getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim(),
    visible: document.visibilityState,
  }))
  trace.push({ ms: Date.now() - t0, ...v })
  if (v.fill !== before && latency === null) latency = Date.now() - t0
  if (i > 8 && latency !== null) break
}
out.flip = { before, latencyMs: latency, trace }
console.log(`\n=== flip to dark: --enhc-solid-fill ${before} → latency ${latency}ms; visibility=${trace[0]?.visible} ===`)
console.log(JSON.stringify(trace.filter((t, i) => i < 4 || i > trace.length - 4), null, 1))
out.dark = await snapAll('forced dark')

writeFileSync(`${OUT}/tokens-and-refresh.json`, JSON.stringify(out, null, 1), 'utf8')
await page.evaluate(() => { document.body.removeAttribute('data-ds-dark-theme'); document.documentElement.setAttribute('data-ds-theme-source', 'light') })
await context.close()
