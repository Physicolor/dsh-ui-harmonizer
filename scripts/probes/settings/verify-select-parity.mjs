/**
 * Parity check: OUR settings controls vs the PRODUCT's own, measured side by side
 * on one settings page.
 *
 * The product's Select (Settings → General → 权限) is the reference. This opens
 * that menu, then ours (字体作用范围 / 字体), then dsh-widgets' settings rows, and
 * compares the numbers a control is made of. Non-zero exit on any mismatch, so it
 * re-runs as a regression after a product or plugin update.
 *
 *   node scripts/probes/settings/verify-select-parity.mjs [url]
 */
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { authCookieFor } from '../../lib/auth.mjs'

const require = createRequire('C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/noop.js')
const { chromium } = require('playwright-core')
const EXE = ['C:/Users/12404/AppData/Local/ms-playwright/chromium-1246/chrome-win64/chrome.exe',
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'].find(p => existsSync(p))
const URL_ARG = process.argv.slice(2).find(a => a.startsWith('http')) ?? 'http://127.0.0.1:19387'
const OUT = process.env.DSH_PROBE_OUT ?? 'D:/dsh-home/probe-ui/select-verify'
mkdirSync(OUT, { recursive: true })

const READ = `(el) => {
  if (el === null) return null
  const cs = getComputedStyle(el), r = el.getBoundingClientRect()
  return {
    box: Math.round(r.width) + 'x' + Math.round(r.height), h: Math.round(r.height),
    radius: cs.borderTopLeftRadius, bg: cs.backgroundColor,
    border: cs.borderTopWidth === '0px' ? 'none' : cs.borderTopWidth + ' ' + cs.borderTopStyle,
    padding: cs.padding, gap: cs.gap, font: cs.fontSize + '/' + cs.lineHeight,
    shadow: cs.boxShadow === 'none' ? 'none' : 'yes', backdrop: cs.backdropFilter,
  }
}`
const M = `(sel) => { const el = document.querySelector(sel); return el === null ? null : (${READ})(el) }`

const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: EXE, headless: true, viewport: { width: 1400, height: 900 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
const errors = []
page.on('pageerror', e => errors.push(String(e.message).slice(0, 200)))
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)

const openNav = async (label) => {
  await page.evaluate((l) => {
    const dialog = document.querySelector("[role='dialog']")
    if (dialog === null) return
    for (const b of dialog.querySelectorAll('button')) {
      const r = b.getBoundingClientRect()
      if (r.width > 60 && r.x < 460 && r.height < 60 && (b.textContent ?? '').trim() === l) { b.click(); return }
    }
  }, label)
  await page.waitForTimeout(1400)
}
const openSettings = async () => {
  await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
  await page.waitForTimeout(1800)
}
/* A reader is passed as SOURCE and eval'd inside the page: a bare arrow-function
 * STRING would be serialized as a value (undefined) instead of being called. */
const measure = (sel) => page.evaluate(([readSrc, s]) => {
  const read = eval(readSrc)
  return read(document.querySelector(s))
}, [READ, sel])
const measureAll = (sel) => page.evaluate(([readSrc, s]) => {
  const read = eval(readSrc)
  return [...document.querySelectorAll(s)].map(el => read(el))
}, [READ, sel])
/** Close an open menu WITHOUT Escape: inside the settings dialog Escape closes the dialog itself. */
const closeMenus = async () => {
  await page.evaluate(() => { document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })) })
  await page.waitForTimeout(350)
}
/** Re-open the dialog if a stray key closed it. */
const ensureGeneral = async () => {
  const ok = await page.evaluate(() => document.querySelector("[role='dialog']") !== null && document.querySelectorAll('button.uitw-select').length > 0)
  if (ok) return
  await openSettings()
  await openNav('通用设置')
}
const clickText = (text, scope = 'dialog') => page.evaluate(({ text, scope }) => {
  const root = scope === 'dialog' ? document.querySelector("[role='dialog']") : document
  const hits = [...(root ?? document).querySelectorAll('button, [role="menuitem"]')]
  for (const el of hits) {
    if ((el.textContent ?? '').trim() === text && el.getBoundingClientRect().height > 8) { el.click(); return true }
  }
  return false
}, { text, scope })

/** A screenshot clip that keeps the open menu (or a control) in frame. */
const clipAround = async (sel = '[role="menu"]') => {
  const box = await page.evaluate((s) => {
    const el = document.querySelector(s)
    if (el === null) return null
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, w: r.width, h: r.height }
  }, sel)
  if (box === null) return { x: 560, y: 170, width: 840, height: 440 }
  const pad = 90
  const x = Math.max(0, Math.round(box.x - pad))
  const y = Math.max(0, Math.round(box.y - pad))
  return {
    x,
    y,
    width: Math.max(1, Math.round(Math.min(box.w + pad * 2, 1400 - x))),
    height: Math.max(1, Math.round(Math.min(box.h + pad * 2, 900 - y))),
  }
}

const report = {}
await openSettings()
await openNav('通用设置')

/* --- the product's own Select (权限) --- */
report.officialTriggerClosed = await measure('[role="dialog"] button[class*="_selector"]')
await clickText('完全权限')
await page.waitForTimeout(500)
report.officialMenuOpen = await measure('[role="menu"]')
report.officialItem = await measure('[role="menu"] [role="menuitem"]')
await page.screenshot({ path: `${OUT}/01-official-open.png`, clip: { x: 560, y: 170, width: 840, height: 440 } })
await closeMenus()
await ensureGeneral()

/* --- ours: font family + font scope --- */
await page.evaluate(() => { document.querySelectorAll('button.uitw-select')[1].scrollIntoView({ block: 'center' }) })
await page.waitForTimeout(400)
report.ourTriggersClosed = await measureAll('button.uitw-select')
await page.evaluate(() => document.querySelectorAll('button.uitw-select')[1].click())
await page.waitForTimeout(400)
report.ourMenuOpen = await measure('[role="menu"]')
report.ourMaterial = await measure('[role="menu"] [class*="_material_"]')
report.ourItem = await measure('[role="menu"] [role="menuitem"]')
await page.screenshot({ path: `${OUT}/02-ours-open-light.png`, clip: await clipAround() })
await closeMenus()

/* Dark theme, ours only (the product's own tokens flip under the same marker). */
await page.evaluate(() => document.body.setAttribute('data-ds-dark-theme', ''))
await page.waitForTimeout(500)
await page.evaluate(() => document.querySelectorAll('button.uitw-select')[1].click())
await page.waitForTimeout(400)
report.ourMenuDark = await measure('[role="menu"]')
report.ourMaterialDark = await measure('[role="menu"] [class*="_material_"]')
await page.screenshot({ path: `${OUT}/03-ours-open-dark.png`, clip: await clipAround() })
await closeMenus()
await page.evaluate(() => document.body.removeAttribute('data-ds-dark-theme'))
await page.waitForTimeout(300)

/* --- dsh-widgets: its settings rows (the product's Menu, `.dsx-select` trigger) ---
 * Scoped to the settings DIALOG: dsh-widgets renders the same page again inside
 * its rail panel (off-viewport), and a bare `.dsx-select` query picks that copy. */
await ensureGeneral()
await openNav('组件')
await page.evaluate(() => {
  const dialog = document.querySelector("[role='dialog']")
  if (dialog === null) return
  for (const b of dialog.querySelectorAll('button')) {
    if ((b.textContent ?? '').trim() === '组件设置') { b.click(); return }
  }
})
await page.waitForTimeout(1400)
report.widgetsSelect = await measureAll("[role='dialog'] .dsx-select")
/** No native form control may be left anywhere in the settings dialog. */
report.nativeSelectsInDialog = await page.evaluate(() => document.querySelectorAll("[role='dialog'] select").length)
await page.evaluate(() => { document.querySelector("[role='dialog'] .dsx-select")?.scrollIntoView({ block: 'center' }) })
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/04-widgets-select.png`, clip: { x: 460, y: 150, width: 940, height: 480 } })
/* …and its popup must be the product's surface, not the browser's. */
await page.evaluate(() => { document.querySelector("[role='dialog'] .dsx-select")?.click() })
await page.waitForTimeout(400)
report.widgetsMenuOpen = await measure('[role="menu"]')
report.widgetsItem = await measure('[role="menu"] [role="menuitem"]')
await page.screenshot({ path: `${OUT}/07-widgets-open.png`, clip: await clipAround() })
await closeMenus()

writeFileSync(`${OUT}/parity.json`, JSON.stringify({ report, pageErrors: errors }, null, 2), 'utf8')

/* --- The product's OWN Select again, this time with OUR sheets disabled ---
 * This is the check the owner asked for: with our layer ON the product's dropdown
 * must be indistinguishable from the product's dropdown with our layer OFF. */
await ensureGeneral()
await openNav('通用设置')
await page.evaluate(() => {
  window.__probeDisabled = []
  for (const sheet of document.styleSheets) {
    let hit = false
    try { hit = [...sheet.cssRules].some((r) => (r.cssText ?? '').includes('--enhancer-chat-scale')) } catch { continue }
    if (hit) { sheet.disabled = true; window.__probeDisabled.push(sheet) }
  }
  return window.__probeDisabled.length
})
await page.waitForTimeout(300)
await clickText('完全权限')
await page.waitForTimeout(500)
report.officialMenuClean = await measure('[role="menu"]')
report.officialItemClean = await measure('[role="menu"] [role="menuitem"]')
await page.screenshot({ path: `${OUT}/05-official-open-ours-off.png`, clip: { x: 560, y: 170, width: 840, height: 440 } })

/* --- The composer's own trigger pills: same on/off test, since our layer also
 * restates their metrics (composer-and-menu.module.css). --- */
const COMPOSER = "[data-slot='conversation.composer.bar'] [class*='_trigger']"
await page.keyboard.press('Escape')
await page.waitForTimeout(900)
report.composerOursOff = await measureAll(COMPOSER)
await page.evaluate(() => { for (const s of window.__probeDisabled ?? []) s.disabled = false })
await page.waitForTimeout(400)
report.composerOursOn = await measureAll(COMPOSER)

writeFileSync(`${OUT}/parity.json`, JSON.stringify({ report, pageErrors: errors }, null, 2), 'utf8')

/* Compare on the metrics a control is made of. */
const KEYS = [['h', 'height'], ['radius', 'radius'], ['bg', 'background'], ['border', 'border'], ['padding', 'padding'], ['font', 'font']]
/** The menu's own height is its ROW COUNT (the official 权限 menu has 3 rows, ours 2), so it is not a style metric. */
const MENU_KEYS = [['radius', 'radius'], ['bg', 'background'], ['border', 'border'], ['padding', 'padding'], ['shadow', 'shadow']]
const diffs = []
const cmp = (name, a, b, keys = KEYS) => {
  if (a === undefined || a === null || b === undefined || b === null) { diffs.push(`${name}: missing (ours=${a === undefined || a === null} official=${b === undefined || b === null})`); return }
  for (const [k, label] of keys) if (String(a[k]) !== String(b[k])) diffs.push(`${name} ${label}: ours ${a[k]} vs official ${b[k]}`)
}

console.log('--- official (product) ---')
console.log('trigger closed', JSON.stringify(report.officialTriggerClosed))
console.log('menu open     ', JSON.stringify(report.officialMenuOpen))
console.log('item          ', JSON.stringify(report.officialItem))
console.log('--- ours ---')
console.log('triggers      ', report.ourTriggersClosed.length, JSON.stringify(report.ourTriggersClosed))
console.log('menu open     ', JSON.stringify(report.ourMenuOpen))
console.log('material      ', JSON.stringify(report.ourMaterial))
console.log('item          ', JSON.stringify(report.ourItem))
console.log('menu dark     ', JSON.stringify(report.ourMenuDark))
console.log('material dark ', JSON.stringify(report.ourMaterialDark))
console.log('--- dsh-widgets .dsx-select ---')
for (const t of report.widgetsSelect) console.log('  ', JSON.stringify(t))
console.log('native <select> left in the dialog:', report.nativeSelectsInDialog)
console.log('widgets menu open ', JSON.stringify(report.widgetsMenuOpen))
console.log('widgets item      ', JSON.stringify(report.widgetsItem))
console.log('--- the product\'s dropdown, our sheets ON vs OFF ---')
console.log('menu  ours on ', JSON.stringify(report.officialMenuOpen))
console.log('menu  ours off', JSON.stringify(report.officialMenuClean))
console.log('item  ours on ', JSON.stringify(report.officialItem))
console.log('item  ours off', JSON.stringify(report.officialItemClean))
console.log('--- composer trigger pills, our sheets OFF vs ON ---')
console.log('off', JSON.stringify(report.composerOursOff))
console.log('on ', JSON.stringify(report.composerOursOn))
console.log('--- page errors ---', errors.length === 0 ? 'none' : errors.join(' | '))

cmp('trigger', report.ourTriggersClosed[1], report.officialTriggerClosed)
cmp('menu', report.ourMenuOpen, report.officialMenuOpen, MENU_KEYS)
cmp('item', report.ourItem, report.officialItem)
cmp('product menu (ours ON vs OFF)', report.officialMenuOpen, report.officialMenuClean, MENU_KEYS)
cmp('product item (ours ON vs OFF)', report.officialItem, report.officialItemClean)
cmp('dsh-widgets menu', report.widgetsMenuOpen, report.officialMenuOpen, MENU_KEYS)
cmp('dsh-widgets item', report.widgetsItem, report.officialItem)
if (report.nativeSelectsInDialog !== 0) diffs.push(`native <select> left in the settings dialog: ${report.nativeSelectsInDialog}`)
if (report.composerOursOn.length !== report.composerOursOff.length) {
  diffs.push(`composer triggers: count differs (ours on ${report.composerOursOn.length}, off ${report.composerOursOff.length})`)
} else {
  report.composerOursOn.forEach((t, i) => cmp(`composer trigger ${i} (ours ON vs OFF)`, t, report.composerOursOff[i]))
}
if (diffs.length > 0) { console.error('PARITY FAILED\n  ' + diffs.join('\n  ')); await context.close(); process.exit(1) }
console.log('parity ok: ours matches the product, and the product is unchanged by our layer')
await context.close()
