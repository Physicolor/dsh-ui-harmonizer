/**
 * Switch alignment, verified — our controls and the normalised third-party ones
 * measured against the product's own Switch, in one run.
 *
 * 1. reference: the product's `_switch_1ik0f_5` (settings → 通用设置), light + dark
 * 2. ours: dsh-ui-harmonizer's `.uitw-switch` (通用设置) and dsh-widgets'
 *    `.dsx-switch-*` (组件 → 组件设置)
 * 3. third-party: dsh-genui's `V1MMBW_switch` — the plugin renders it only inside
 *    a genui panel, so it is exercised with a SYNTHETIC FIXTURE built from its own
 *    DOM (the technique probe-css-integrity.mjs already uses for the Menu), once
 *    with our sheets live and once with them disabled, to show the delta
 * 4. commandcode's `cc-toggle` focus ring
 *
 * Run: node scripts/probes/settings/probe-switch-align.mjs [url]
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

const READER = () => {
  const R = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.width * 100) / 100}x${Math.round(r.height * 100) / 100}` }
  const readOne = (el, label) => {
    if (el === null) return null
    const cs = getComputedStyle(el)
    const thumb = el.querySelector('*')
    const tcs = thumb === null ? null : getComputedStyle(thumb)
    return {
      label,
      box: R(el), radius: cs.borderRadius, bg: cs.backgroundColor, border: cs.borderWidth,
      cornerShape: cs.cornerShape ?? '(unsupported)',
      on: el.getAttribute('aria-checked') ?? (el.checked === undefined ? (String(el.className).includes('On') ? 'classOn' : null) : String(el.checked)),
      thumb: thumb === null ? null : { box: R(thumb), bg: tcs.backgroundColor, radius: tcs.borderRadius, shadow: tcs.boxShadow, transform: tcs.transform, transition: tcs.transitionProperty + ' ' + tcs.transitionDuration },
    }
  }
  const out = {}
  out.officialOn = readOne(document.querySelector('[class*="_switch_"][aria-checked="true"]'), 'product switch (on)')
  out.harmonizer = [
    readOne(document.querySelector('.uitw-switch[aria-checked="true"]'), 'uitw-switch (on)'),
    readOne(document.querySelector('.uitw-switch[aria-checked="false"]'), 'uitw-switch (off)'),
  ].filter(Boolean)
  out.widgets = [
    readOne(document.querySelector('.dsx-switch-input:checked + .dsx-switch-track'), 'dsx-switch (on)'),
    readOne(document.querySelector('.dsx-switch-input:not(:checked) + .dsx-switch-track'), 'dsx-switch (off)'),
  ].filter(Boolean)
  out.ccToggle = readOne(document.querySelector('.cc-toggle'), 'cc-toggle')
  return out
}

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)
await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
await page.waitForTimeout(1500)

const results = {}
/** Crop a control (with breathing room) for a visual receipt. Scrolls it into
 *  view first: a clip outside the viewport is rejected by the screenshot API. */
const shot = async (selector, name) => {
  const box = await page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (el === null) return null
    el.scrollIntoView({ block: 'center' })
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, w: r.width, h: r.height }
  }, selector)
  if (box === null) { console.log(`shot ${name}: selector not found`); return }
  await page.waitForTimeout(150)
  const vp = page.viewportSize() ?? { width: 1560, height: 960 }
  const x = Math.max(0, Math.min(box.x - 20, vp.width - 60))
  const y = Math.max(0, Math.min(box.y - 12, vp.height - 44))
  if (box.y < 0 || box.y + box.h > vp.height) { console.log(`shot ${name}: off-viewport (y=${Math.round(box.y)})`); return }
  await page.screenshot({
    path: `${OUT}/align-${name}.png`,
    clip: { x, y, width: Math.min(box.w + 40, vp.width - x), height: Math.min(box.h + 24, vp.height - y) },
  })
  console.log(`shot ${name}: ok`)
}
/** Click a settings nav row by its visible label (the dialog's own buttons). */
const openNav = async (label) => {
  const ok = await page.evaluate((l) => {
    const dialog = document.querySelector("[role='dialog']")
    if (dialog === null) return false
    for (const b of dialog.querySelectorAll('button')) {
      const r = b.getBoundingClientRect()
      if (r.width < 60 || r.x > 460 || r.height > 60) continue
      if ((b.textContent ?? '').trim() === l) { b.click(); return true }
    }
    return false
  }, label)
  await page.waitForTimeout(1200)
  return ok
}
/** Click any button on the page whose trimmed text is exactly `label`. */
const clickText = async (label) => {
  const ok = await page.evaluate((l) => {
    for (const b of document.querySelectorAll('button')) {
      if ((b.textContent ?? '').trim() === l) { b.click(); return true }
    }
    return false
  }, label)
  await page.waitForTimeout(1200)
  return ok
}

console.log('nav 通用设置:', await openNav('通用设置'))
results.generalLight = await page.evaluate(READER)
await shot('[class*="_switch_"][aria-checked="true"]', 'official-on')
await shot('.uitw-switch', 'uitw-off')

/* Turn our own switch ON inside the probe's own browser profile (its state is
 * localStorage-scoped there, not the user's), measure, then put it back. */
const toggled = await page.evaluate(() => {
  const el = document.querySelector('.uitw-switch')
  if (el === null) return false
  el.click()
  return true
})
await page.waitForTimeout(400)
results.harmonizerOn = await page.evaluate(READER).then(r => r.harmonizer)
await shot('.uitw-switch[aria-checked="true"]', 'uitw-on')
await page.evaluate(() => { document.querySelector('.uitw-switch')?.click() })
await page.waitForTimeout(400)
console.log('harmonizer switch clicked:', toggled)

/* Our widgets switch lives on the 组件 page's 组件设置 tab. */
console.log('nav 组件:', await openNav('组件'))
console.log('tab 组件设置:', await clickText('组件设置'))
for (const extra of ['设置', '组件设置']) { if ((await page.evaluate(READER)).widgets.length > 0) break; await clickText(extra) }
results.widgetsTab = await page.evaluate(READER)
await page.screenshot({ path: `${OUT}/context-widgets.png` })
await shot('.dsx-switch-input:checked + .dsx-switch-track', 'widgets-on')
await shot('.dsx-switch-input:not(:checked) + .dsx-switch-track', 'widgets-off')

/* Synthetic fixture for dsh-genui's switch: its own DOM, our sheet on and off. */
const FIXTURE = () => {
  const host = document.createElement('div')
  host.id = 'enhc-switch-fixture'
  host.style.cssText = 'position:fixed;left:20px;top:20px;z-index:99999;background:var(--dsw-alias-bg-base);padding:12px;display:flex;gap:12px'
  host.innerHTML = '<div class="V1MMBW_switch"><span class="V1MMBW_switchKnob"></span></div>'
    + '<div class="V1MMBW_switch V1MMBW_switchOn"><span class="V1MMBW_switchKnob"></span></div>'
  document.body.appendChild(host)
}
const FIXTURE_READ = () => {
  const host = document.getElementById('enhc-switch-fixture')
  if (host === null) return null
  const R = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.width * 100) / 100}x${Math.round(r.height * 100) / 100}` }
  return [...host.children].map(el => {
    const cs = getComputedStyle(el)
    const knob = el.querySelector('*')
    const kcs = getComputedStyle(knob)
    return {
      on: String(el.className).includes('On'),
      box: R(el), radius: cs.borderRadius, bg: cs.backgroundColor, border: cs.borderWidth,
      knob: { box: R(knob), bg: kcs.backgroundColor, radius: kcs.borderRadius, shadow: kcs.boxShadow, left: kcs.left, top: kcs.top, transform: kcs.transform, transition: kcs.transitionProperty + ' ' + kcs.transitionDuration },
    }
  })
}
await page.evaluate(FIXTURE)
await page.waitForTimeout(300)
results.genuiFixtureWithOurCss = await page.evaluate(FIXTURE_READ)
await page.evaluate(() => {
  for (const tag of document.querySelectorAll("style[data-plugin='dsh-ui-harmonizer'], style[data-plugin-css^='dsh-ui-harmonizer']")) tag.media = 'not all'
})
await page.waitForTimeout(300)
results.genuiFixtureWithoutOurCss = await page.evaluate(FIXTURE_READ)
await page.evaluate(() => {
  for (const tag of document.querySelectorAll("style[data-plugin='dsh-ui-harmonizer'], style[data-plugin-css^='dsh-ui-harmonizer']")) tag.media = ''
  document.getElementById('enhc-switch-fixture')?.remove()
})

/* Dark palette: the same two controls under the product's real dark tokens. */
await page.evaluate(() => { document.body.setAttribute('data-ds-dark-theme', '') })
await page.waitForTimeout(2600)
results.widgetsTabDark = await page.evaluate(READER)
await openNav('通用设置')
results.generalDark = await page.evaluate(READER)
await page.evaluate(() => { document.body.removeAttribute('data-ds-dark-theme') })

/* cc-toggle focus ring: `:focus-visible` only answers real keyboard focus, so tab
 * to the control instead of calling .focus() (which measured as no outline at all). */
console.log('nav Command Code:', await openNav('Command Code'))
results.ccFocus = await (async () => {
  await page.evaluate(() => { document.body.focus() })
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab')
    const hit = await page.evaluate(() => {
      const el = document.activeElement
      if (el === null || !String(el.className).includes('cc-toggle')) return null
      const cs = getComputedStyle(el)
      return { outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`, offset: cs.outlineOffset }
    })
    if (hit !== null) return { ...hit, tabs: i + 1 }
  }
  return { outline: '(never reached by Tab)', tabs: 80 }
})()

writeFileSync(`${OUT}/align.json`, JSON.stringify(results, null, 2), 'utf8')
for (const [k, v] of Object.entries(results)) console.log(`\n=== ${k} ===\n${JSON.stringify(v, null, 1).slice(0, 2200)}`)
await context.close()
