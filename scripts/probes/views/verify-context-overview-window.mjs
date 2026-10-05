/**
 * Verification for the window reconciliation of dsh-context's 上下文洞察
 * dashboard: the same run measures the OFFICIAL Settings window first and then
 * the dashboard, so every assertion compares two live values of the same theme
 * (or the resolved token the official rule itself reads).
 *
 * Checks
 *   S1  the dashboard's radius / background / shadow equal the settings window's
 *   S2  the content column starts 54px below the window's top edge (as Settings does)
 *   S3  the title row speaks the dialog recipe (16/24 500) with a 28px round close seat
 *   S4  the content inset is 24px, the inner cards are 20px / 12px 14px, the KPI
 *       band holds the official card-list gap of 10px
 *   S5  the modal layer and dark-mode reconciliations still hold (no regression)
 *   S6  at 390×844 the window keeps its radius / 24px inset and does not overflow
 *
 * Run: node scripts/probes/views/verify-context-overview-window.mjs [url] [title]
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
const OUT = 'D:/dsh-home/probe-ui/context-overview/verify'
mkdirSync(OUT, { recursive: true })

const results = []
const check = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail === undefined ? '' : `  — ${detail}`}`) }

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-ovverify', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
const errors = []
page.on('pageerror', e => errors.push(e && e.message ? e.message : String(e)))
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)

// open a session first (the sidebar foot carries the 上下文洞察 entry)
const groups = page.locator("[data-slot='sidebar.workspaces'] [class*='_projectRow']")
const groupCount = await groups.count()
for (let i = 0; i < groupCount; i++) {
  const g = groups.nth(i)
  if ((await g.getAttribute('aria-expanded')) === 'false') { await g.click(); await page.waitForTimeout(300) }
}
await page.waitForTimeout(1000)
await page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']").filter({ hasText: TITLE }).first().click().catch(() => {})
await page.waitForTimeout(4000)

// ── S: the official settings window ─────────────────────────────────────────
const SETTINGS = String.raw`(() => {
  const nav = document.querySelector("[class*='_nav']")
  if (nav === null) return null
  const panel = nav.parentElement
  const content = document.querySelector("[class*='_options']")
  const cs = getComputedStyle(panel)
  const pr = panel.getBoundingClientRect()
  const cr = content === null ? null : content.getBoundingClientRect()
  return {
    panel: { cls: String(panel.className), radius: cs.borderTopLeftRadius, bg: cs.backgroundColor, shadow: cs.boxShadow,
      border: cs.borderTopWidth, padding: cs.padding, top: Math.round(pr.top), rect: [pr.width, pr.height].map(Math.round) },
    contentOffset: cr === null ? null : Math.round(cr.top - pr.top),
    contentPadding: content === null ? null : getComputedStyle(content).padding,
    tokens: (() => { const r = getComputedStyle(document.body); const o = {}
      for (const t of ['--dsw-radius-panel', '--dsw-elevation-prominent', '--dsw-alias-bg-layer-2', '--dsw-alias-bg-layer-1']) o[t] = r.getPropertyValue(t).trim()
      return o })(),
  }
})()`
await page.locator("[data-slot='settings.trigger']").first().click({ timeout: 8000 }).catch(() => {})
await page.waitForTimeout(2500)
const settings = await page.evaluate(SETTINGS)
console.log('=== official settings window ===')
console.log(JSON.stringify(settings, null, 1))
check('settings window measured (control)', settings !== null && settings.panel.radius !== '0px', settings === null ? 'not found' : `radius=${settings.panel.radius} contentOffset=${settings.contentOffset}`)
// close settings again
await page.keyboard.press('Escape').catch(() => {})
await page.waitForTimeout(1200)
if (await page.evaluate(() => document.querySelector("[class*='_nav']") !== null)) {
  await page.evaluate(() => { const m = document.querySelector("[class*='_mask']"); if (m !== null) m.click() })
  await page.waitForTimeout(1200)
}

// ── the dashboard ───────────────────────────────────────────────────────────
await page.locator('.lc-ov-entry').first().click({ timeout: 8000 }).catch(async () => { await page.locator('.lc-ov-entry').first().dispatchEvent('click').catch(() => {}) })
await page.waitForTimeout(1600)

const DASH = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] }
  const card = document.querySelector('.lc-ov-card')
  const head = document.querySelector('.lc-ov-head')
  const scroll = document.querySelector('.lc-ov-scroll')
  const title = document.querySelector('.lc-ov-title')
  const close = document.querySelector('.lc-ov-head .lc-modal-close')
  const inner = document.querySelector('.lc-ov-card .lc-card')
  const kpis = document.querySelector('.lc-ov-card .lc-ov-kpis')
  const cs = el => el === null ? null : getComputedStyle(el)
  const c = cs(card)
  return {
    card: card === null ? null : { radius: c.borderTopLeftRadius, bg: c.backgroundColor, shadow: c.boxShadow, border: c.borderTopWidth, padding: c.padding, rect: R(card) },
    head: head === null ? null : { padding: cs(head).padding, marginBottom: cs(head).marginBottom, rect: R(head) },
    scroll: scroll === null ? null : { padding: cs(scroll).padding, rect: R(scroll) },
    contentOffset: card === null || scroll === null ? null : Math.round(R(scroll)[1] - R(card)[1]),
    title: title === null ? null : { font: cs(title).fontSize + '/' + cs(title).lineHeight + ' ' + cs(title).fontWeight },
    close: close === null ? null : { rect: R(close).slice(2), radius: cs(close).borderTopLeftRadius },
    inner: inner === null ? null : { radius: cs(inner).borderTopLeftRadius, padding: cs(inner).padding },
    kpisGap: kpis === null ? null : cs(kpis).gap,
    tokens: (() => { const r = getComputedStyle(document.body); const o = {}
      for (const t of ['--dsw-radius-panel', '--dsw-elevation-prominent', '--dsw-alias-bg-layer-2']) o[t] = r.getPropertyValue(t).trim()
      return o })(),
    overlayZ: (() => { const l = document.querySelector("div:has(> [data-slot='shell.overlay'])"); return l === null ? null : getComputedStyle(l).zIndex })(),
  }
})()`
const dash = await page.evaluate(DASH)
console.log('\n=== dashboard ===')
console.log(JSON.stringify(dash, null, 1))
await page.screenshot({ path: `${OUT}/window-light.png` })

const norm = s => String(s).replace(/\s+/g, ' ').trim()
check('S1 radius == the settings window radius (and --dsw-radius-panel)',
  dash.card !== null && dash.card.radius === settings.panel.radius && dash.card.radius === dash.tokens['--dsw-radius-panel'],
  `card=${dash.card.radius} settings=${settings.panel.radius} token=${dash.tokens['--dsw-radius-panel']}`)
check('S1 background == the settings window background (bg-layer-2)',
  dash.card !== null && dash.card.bg === settings.panel.bg && dash.tokens['--dsw-alias-bg-layer-2'] !== '',
  `card=${dash.card.bg} settings=${settings.panel.bg} token=${dash.tokens['--dsw-alias-bg-layer-2']}`)
check('S1 shadow == --dsw-elevation-prominent (the settings window shadow)', dash.card !== null && norm(dash.card.shadow) === norm(settings.panel.shadow),
  `card=${norm(dash.card?.shadow).slice(0, 70)}… settings=${norm(settings.panel.shadow).slice(0, 70)}…`)
check('S1 no CSS border on the window (the stroke lives in the elevation)', dash.card !== null && dash.card.border === '0px', `border=${dash.card?.border}`)
check('S2 content column starts at the settings offset', dash.contentOffset !== null && Math.abs(dash.contentOffset - settings.contentOffset) <= 2,
  `dashboard=${dash.contentOffset} settings=${settings.contentOffset}`)
check('S3 title speaks the dialog recipe 16px/24px 500', dash.title !== null && dash.title.font === '16px/24px 500', JSON.stringify(dash.title))
check('S3 close seat is the 28px round one', dash.close !== null && dash.close.rect[0] === 28 && dash.close.rect[1] === 28 && dash.close.radius === '28px', JSON.stringify(dash.close))
check('S4 content inset is 24px all round (bottom kept)', dash.scroll !== null && dash.scroll.padding === '0px 24px 24px' && dash.head.padding === '22px 24px 0px',
  `scroll=${dash.scroll?.padding} head=${dash.head?.padding}`)
check('S4 inner cards take the official card recipe (20px / 12px 14px)', dash.inner !== null && dash.inner.radius === '20px' && dash.inner.padding === '12px 14px', JSON.stringify(dash.inner))
check('S4 KPI band uses the official card-list gap', dash.kpisGap === '10px', `gap=${dash.kpisGap}`)
check('S5 modal layer still out-paints the shell chrome', Number(dash.overlayZ) > 21, `overlay z=${dash.overlayZ}`)

// dark chrome: the official layer order (window layer-2 over mask, cards layer-1)
await page.evaluate(() => document.body.setAttribute('data-ds-dark-theme', ''))
await page.waitForTimeout(600)
const dark = await page.evaluate(DASH)
console.log('\n=== dashboard (dark) ===')
console.log(JSON.stringify({ radius: dark.card.radius, bg: dark.card.bg, inner: dark.inner, contentOffset: dark.contentOffset }, null, 1))
check('S5 dark chrome keeps the official layer order (window layer-2, cards layer-1)',
  dark.card.bg === 'rgb(44, 44, 46)' && dark.inner !== null && dark.inner.radius === '20px',
  `window=${dark.card.bg} (layer-2 #2c2c2e expected)`)
await page.screenshot({ path: `${OUT}/window-dark.png` })
await page.evaluate(() => document.body.removeAttribute('data-ds-dark-theme'))

// ── narrow viewport: the window must stay a window ──────────────────────────
await page.setViewportSize({ width: 390, height: 844 })
await page.waitForTimeout(700)
const NARROW = String.raw`(() => {
  const card = document.querySelector('.lc-ov-card')
  const head = document.querySelector('.lc-ov-head')
  const scroll = document.querySelector('.lc-ov-scroll')
  if (card === null) return null
  const cr = card.getBoundingClientRect()
  const hr = head === null ? null : head.getBoundingClientRect()
  return {
    radius: getComputedStyle(card).borderTopLeftRadius,
    scrollPadding: scroll === null ? null : getComputedStyle(scroll).padding,
    cardRight: Math.round(cr.right), headRight: hr === null ? null : Math.round(hr.right), headHeight: hr === null ? null : Math.round(hr.height),
    overflowX: document.documentElement.scrollWidth - window.innerWidth,
    innerWidth: window.innerWidth,
  }
})()`
const narrow = await page.evaluate(NARROW)
console.log('\n=== dashboard (390×844) ===')
console.log(JSON.stringify(narrow, null, 1))
check('S6 narrow viewport: window radius and 24px inset survive the wrap',
  narrow !== null && narrow.radius === '28px' && narrow.scrollPadding === '0px 24px 24px',
  `radius=${narrow?.radius} scroll=${narrow?.scrollPadding} headHeight=${narrow?.headHeight}`)
check('S6 narrow viewport: no horizontal overflow, title row inside the window',
  narrow !== null && narrow.overflowX <= 1 && narrow.headRight !== null && narrow.headRight <= narrow.cardRight + 1,
  `overflowX=${narrow?.overflowX} headRight=${narrow?.headRight} cardRight=${narrow?.cardRight}`)
await page.screenshot({ path: `${OUT}/window-narrow.png` })
await page.setViewportSize({ width: 1560, height: 960 })

console.log('\n=== page errors ===')
console.log(errors.length === 0 ? '(none)' : errors.join('\n'))
writeFileSync(`${OUT}/verify-context-overview-window.json`, JSON.stringify({ results, settings, dash, dark, narrow, errors }, null, 1), 'utf8')
const failed = results.filter(r => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed${failed.length === 0 ? '' : `; FAILED: ${failed.map(f => f.name).join(' | ')}`}`)
await context.close()
process.exit(failed.length === 0 && errors.length === 0 ? 0 : 1)
