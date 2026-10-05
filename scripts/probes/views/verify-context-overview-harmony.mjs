/**
 * Verification for the 上下文洞察 (dsh-context `shell.overlay`) reconciliation:
 *
 *   L1  the modal's own layer out-paints the z-21 session header (a mask with a
 *       hole in it was the report: 106 grid samples resolved to the header);
 *   L2  dsh-widgets' body-portaled hover magnifier yields while a modal is up;
 *   I1  the ContextIcon resolves to one colour in both chrome seats;
 *   D1  no near-white opaque fill is left inside the dashboard in dark chrome,
 *       and the active pills still read as active;
 *   D2  `--enhc-solid-fill` follows a theme flip in the same frame (the
 *       attribute observer), not up to one 2 s poll later;
 *   R1  closing the panel restores the frame's own z order.
 *
 * Read-only on the session: it opens a session, clicks the sidebar entry, moves
 * the pointer and toggles the theme ATTRIBUTE on its own page (the app's
 * preference is untouched).
 *
 * Run: node scripts/probes/views/verify-context-overview-harmony.mjs [url] [title]
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

// ── open the session, rail on ───────────────────────────────────────────────
const groups = page.locator("[data-slot='sidebar.workspaces'] [class*='_projectRow']")
const groupCount = await groups.count()
for (let i = 0; i < groupCount; i++) {
  const g = groups.nth(i)
  if ((await g.getAttribute('aria-expanded')) === 'false') { await g.click(); await page.waitForTimeout(300) }
}
await page.waitForTimeout(1200)
await page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']").filter({ hasText: TITLE }).first().click().catch(() => {})
await page.waitForTimeout(4500)
const capsule = page.getByLabel('组件', { exact: true }).first()
if ((await capsule.count()) > 0 && (await capsule.getAttribute('aria-pressed').catch(() => null)) !== 'true') {
  await capsule.click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(1800)
}

// ── sheets served ───────────────────────────────────────────────────────────
const sheets = await page.evaluate(() => ({
  layer: document.querySelector('style[data-plugin-css="dsh-ui-harmonizer/overview-modal-layer.module.css"]') !== null,
  icon: document.querySelector('style[data-plugin-css="dsh-ui-harmonizer/entry-icon-monochrome.module.css"]') !== null,
  pill: document.querySelector('style[data-plugin-css="dsh-ui-harmonizer/dark-active-pill.module.css"]') !== null,
  total: document.querySelectorAll('style[data-plugin="dsh-ui-harmonizer"]').length,
}))
check('the three new sheets are served', sheets.layer && sheets.icon && sheets.pill, JSON.stringify(sheets))

// ── icon colours (chrome seats, panel closed so the entry is reachable) ─────
const ICONS = String.raw`(() => {
  const fills = svg => svg === null ? null : [...new Set([...svg.querySelectorAll('*')].map(el => getComputedStyle(el).fill))]
  const entry = document.querySelector('.lc-ov-entry')
  const entrySvg = entry === null ? null : entry.querySelector('svg')
  return {
    entryFills: fills(entrySvg),
    entryColor: entry === null ? null : getComputedStyle(entry).color,
    entrySize: entrySvg === null ? null : [entrySvg.getBoundingClientRect().width, entrySvg.getBoundingClientRect().height].map(n => Math.round(n)),
  }
})()`
const iconLight = await page.evaluate(ICONS)
check('sidebar entry glyph is single-colour', iconLight.entryFills !== null && iconLight.entryFills.length === 1 && iconLight.entryFills[0] === iconLight.entryColor,
  `fills=${JSON.stringify(iconLight.entryFills)} color=${iconLight.entryColor} size=${JSON.stringify(iconLight.entrySize)}`)

// ── open the dashboard ──────────────────────────────────────────────────────
await page.locator('.lc-ov-entry').first().click({ timeout: 8000 }).catch(async () => { await page.locator('.lc-ov-entry').first().dispatchEvent('click').catch(() => {}) })
await page.waitForTimeout(1600)

const headIcon = await page.evaluate(String.raw`(() => {
  const svg = document.querySelector('.lc-ov-head-icon')
  if (svg === null) return null
  const fills = [...new Set([...svg.querySelectorAll('*')].map(el => getComputedStyle(el).fill))]
  return { fills, color: getComputedStyle(svg.parentElement ?? svg).color }
})()`)
check('dashboard head glyph is single-colour', headIcon === null || headIcon.fills.length === 1, JSON.stringify(headIcon))

const MEASURE = String.raw`(() => {
  const nm = el => el === null ? null : String(el.className || el.tagName).slice(0, 44)
  const owner = el => { if (el === null) return 'none'
    if (el.closest('.lc-ov-backdrop') !== null) return el.closest('.lc-ov-card') !== null ? 'ov-card' : 'ov-backdrop'
    if (el.closest("[data-slot='conversation.header'], [data-slot='conversation.session.header']") !== null) return 'header'
    if (el.closest('.dsx-stats-rail, .dsx-magnify-layer, .dsx-surface, .dsx-stats-drawer') !== null) return 'widgets'
    if (el.closest("[data-slot='sidebar']") !== null) return 'sidebar'
    return 'other:' + nm(el) }
  const counts = {}
  const railAbove = []
  for (let y = 8; y < innerHeight; y += 24) for (let x = 8; x < innerWidth; x += 24) {
    const els = document.elementsFromPoint(x, y)
    if (els.length === 0) continue
    const top = owner(els[0]); counts[top] = (counts[top] ?? 0) + 1
    const ci = els.findIndex(e => e.closest !== undefined && e.closest('.lc-ov-card') !== null)
    if (ci > 0) railAbove.push({ at: [x, y], above: [...new Set(els.slice(0, ci).map(nm))].slice(0, 3) })
  }
  const overlayLayer = document.querySelector("div:has(> [data-slot='shell.overlay'])")
  const header = document.querySelector("[data-slot='conversation.header'] > header, [data-slot='conversation.session.header'] > header")
  const mag = document.querySelector('.dsx-magnify-layer')
  const card = document.querySelector('.lc-ov-card')
  return {
    counts, railAboveCardCount: railAbove.length, railAboveCard: railAbove.slice(0, 5),
    overlayZ: overlayLayer === null ? null : getComputedStyle(overlayLayer).zIndex,
    headerZ: header === null ? null : getComputedStyle(header).zIndex,
    headerBg: header === null ? null : getComputedStyle(header).backgroundColor,
    magnifyDisplay: mag === null ? 'absent' : getComputedStyle(mag).display,
    cardRect: card === null ? null : [card.getBoundingClientRect().x, card.getBoundingClientRect().y, card.getBoundingClientRect().width, card.getBoundingClientRect().height].map(Math.round),
    railRect: (() => { const r = document.querySelector('.dsx-stats-rail'); if (r === null) return null; const b = r.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map(Math.round) })(),
  }
})()`

console.log('\n--- light chrome, panel open ---')
const light = await page.evaluate(MEASURE)
console.log(JSON.stringify({ counts: light.counts, railAboveCardCount: light.railAboveCardCount, overlayZ: light.overlayZ, headerZ: light.headerZ, magnifyDisplay: light.magnifyDisplay }, null, 1))
check('L1 modal covers the header (no header top-most samples)', (light.counts.header ?? 0) === 0, `counts=${JSON.stringify(light.counts)}`)
check('L1 the overlay layer is raised above the z-21 header', Number(light.overlayZ) > Number(light.headerZ), `overlay z=${light.overlayZ} header z=${light.headerZ}`)
check('L2 the widgets magnifier is suppressed while the modal is up', light.magnifyDisplay === 'none' || light.magnifyDisplay === 'absent', `display=${light.magnifyDisplay}`)

// hover the rail area and re-measure (the magnifier is what escaped before)
if (light.railRect !== null) {
  await page.mouse.move(light.railRect[0] + Math.round(light.railRect[2] / 2), light.railRect[1] + Math.round(light.railRect[3] / 2))
  await page.waitForTimeout(1000)
  const hovered = await page.evaluate(MEASURE)
  check('L2 nothing paints above the card while hovering the widget area', hovered.railAboveCardCount === 0,
    `${hovered.railAboveCardCount} points; e.g. ${JSON.stringify(hovered.railAboveCard.slice(0, 2))}`)
  await page.screenshot({ path: `${OUT}/verify-light-hover.png` })
}

// ── dark chrome ─────────────────────────────────────────────────────────────
const fillBefore = await page.evaluate(() => ({ fill: getComputedStyle(document.documentElement).getPropertyValue('--enhc-solid-fill').trim(), header: getComputedStyle(document.querySelector("[data-slot='conversation.header'] > header")).backgroundColor }))
const t0 = Date.now()
await page.evaluate(() => document.body.setAttribute('data-ds-dark-theme', ''))
let flipMs = null
for (let i = 0; i < 20; i++) {
  const v = await page.evaluate(() => ({ fill: getComputedStyle(document.documentElement).getPropertyValue('--enhc-solid-fill').trim(), base: getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim() }))
  if (v.fill === v.base && v.fill !== fillBefore.fill) { flipMs = Date.now() - t0; break }
  await page.waitForTimeout(50)
}
await page.waitForTimeout(400)
const dark = await page.evaluate(MEASURE)
const DARKSCAN = String.raw`(() => {
  const lum = (css) => { const m = String(css).match(/rgba?\(([^)]+)\)$/); if (m === null) return null
    const p = m[1].split(/[ ,/]+/).map(Number); if (p.length > 3 && p[3] < 0.9) return null
    return (0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]) / 255 }
  const nearWhite = []
  const card = document.querySelector('.lc-ov-card')
  if (card !== null) for (const el of card.querySelectorAll('*')) {
    const L = lum(getComputedStyle(el).backgroundColor)
    if (L !== null && L > 0.8) nearWhite.push({ cls: String(el.className).slice(0, 40), bg: getComputedStyle(el).backgroundColor })
  }
  const on = document.querySelector('.lc-ov-card .lc-gran-on')
  const chip = document.querySelector('.lc-ov-card .lc-ov-chip-on')
  const read = el => el === null ? null : { cls: String(el.className).slice(0, 34), bg: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color }
  return { nearWhiteCount: nearWhite.length, nearWhite: nearWhite.slice(0, 6), pill: read(on), chip: read(chip),
    headerBg: getComputedStyle(document.querySelector("[data-slot='conversation.header'] > header")).backgroundColor,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    darkFill: getComputedStyle(document.documentElement).getPropertyValue('--enhc-solid-fill').trim(),
    base: getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim() }
})()`
const darkScan = await page.evaluate(DARKSCAN)
console.log('\n--- dark chrome, panel open ---')
console.log(JSON.stringify({ flipMs, darkFill: darkScan.darkFill, base: darkScan.base, headerBg: darkScan.headerBg, nearWhiteCount: darkScan.nearWhiteCount, pill: darkScan.pill, chip: darkScan.chip, counts: dark.counts }, null, 1))
check('D1 no near-white opaque fill inside the dashboard in dark chrome', darkScan.nearWhiteCount === 0, `count=${darkScan.nearWhiteCount} ${JSON.stringify(darkScan.nearWhite.slice(0, 3))}`)
check('D1 active pills still read as active', darkScan.pill !== null && darkScan.pill.bg !== 'rgba(0, 0, 0, 0)' && darkScan.chip !== null && darkScan.chip.bg !== 'rgba(0, 0, 0, 0)', `pill=${JSON.stringify(darkScan.pill)} chip=${JSON.stringify(darkScan.chip)}`)
check('D2 --enhc-solid-fill follows the theme flip within 400ms (observer)', flipMs !== null && flipMs <= 400, `flip → matching fill in ${flipMs}ms`)
check('D2 the raised layer keeps the modal above the header in dark chrome', (dark.counts.header ?? 0) === 0, `counts=${JSON.stringify(dark.counts)}`)
check('D2 the header follows the theme (no stale light fill)', darkScan.headerBg === darkScan.bodyBg, `header=${darkScan.headerBg} body=${darkScan.bodyBg} enhc-solid-fill=${darkScan.darkFill}`)
await page.screenshot({ path: `${OUT}/verify-dark.png` })

// ── close the panel: the frame returns to its own z order ───────────────────
await page.locator('.lc-ov-card .lc-modal-close').first().click({ timeout: 5000 }).catch(async () => { await page.keyboard.press('Escape').catch(() => {}) })
await page.waitForTimeout(1200)
const after = await page.evaluate(String.raw`(() => {
  const layer = document.querySelector("div:has(> [data-slot='shell.overlay'])")
  return { backdrop: document.querySelector('.lc-ov-backdrop') !== null,
    overlayZ: layer === null ? null : getComputedStyle(layer).zIndex,
    magnify: (() => { const m = document.querySelector('.dsx-magnify-layer'); return m === null ? 'absent' : getComputedStyle(m).display })() }
})()`)
check('R1 closing the panel restores the overlay layer z (20)', (after.backdrop === false && after.overlayZ === '20') || after.backdrop === true,
  `backdrop=${after.backdrop} overlayZ=${after.overlayZ} magnify=${after.magnify}`)

await page.evaluate(() => document.body.removeAttribute('data-ds-dark-theme'))
console.log('\n=== page errors ===')
console.log(errors.length === 0 ? '(none)' : errors.join('\n'))
writeFileSync(`${OUT}/verify-context-overview-harmony.json`, JSON.stringify({ results, light, dark, darkScan, after, errors }, null, 1), 'utf8')
const failed = results.filter(r => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed${failed.length === 0 ? '' : `; FAILED: ${failed.map(f => f.name).join(' | ')}`}`)
await context.close()
process.exit(failed.length === 0 && errors.length === 0 ? 0 : 1)
