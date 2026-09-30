/**
 * Header geometry probe: is the settings page header at the SAME coordinates on
 * every page, and how far apart are the page title and its description?
 *
 * Answers, per nav item:
 *  - the page container's own vertical rhythm (padding-top, row-gap),
 *  - the title's and the description's boxes (absolute page coordinates),
 *  - the measured title→description distance (`intro.top - title.bottom`),
 *  - the shape of the header: are the two nodes siblings, and inside what?
 *
 * Then it repeats the measurement for the OFFICIAL pages with this plugin's
 * stylesheets temporarily removed, which is the only way to read the product's
 * own spacing instead of our override of it.
 *
 * Run: node scripts/probes/settings/probe-header-geometry.mjs [url]
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
const URL_ARG = process.argv[2] ?? process.env.DSH_URL ?? 'http://127.0.0.1:19387'
const OUT = 'D:/dsh-home/probe-ui/header-geometry'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-harmony', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(3500)
await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
await page.waitForTimeout(1200)

const GEOMETRY = () => {
  const rect = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x * 100) / 100, y: Math.round(r.y * 100) / 100, w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 } }
  const section = document.querySelector("[data-slot='settings.section']")
  if (section === null) return { found: false }
  const title = section.querySelector('h2')
  const intro = section.querySelector('p')
  if (title === null || intro === null) return { found: true, missing: title === null ? 'title' : 'intro' }
  const container = title.parentElement
  const cs = container === null ? null : getComputedStyle(container)
  const chain = []
  for (let el = container; el !== null && el !== document.body; el = el.parentElement) {
    const s = getComputedStyle(el)
    chain.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 26)}[gap=${s.rowGap} pad=${s.paddingTop}]`)
    if (chain.length > 4) break
  }
  const tr = title.getBoundingClientRect()
  const ir = intro.getBoundingClientRect()
  return {
    found: true,
    titleClass: String(title.className).slice(0, 60),
    introClass: String(intro.className).slice(0, 60),
    title: rect(title),
    intro: rect(intro),
    /** The number the user sees: description top minus title bottom. */
    gapTitleToIntro: Math.round((ir.top - tr.bottom) * 100) / 100,
    titleTopFromSection: Math.round((tr.top - section.getBoundingClientRect().top) * 100) / 100,
    titleTopFromDialog: Math.round((tr.top - document.querySelector("[role='dialog']").getBoundingClientRect().top) * 100) / 100,
    containerGap: cs === null ? null : cs.rowGap,
    containerPadTop: cs === null ? null : cs.paddingTop,
    sameParent: container === intro.parentElement,
    parentClass: container === null ? null : String(container.className).slice(0, 60),
    chain,
    siblingCount: container === null ? 0 : container.childElementCount,
  }
}

const navItems = await page.evaluate(() => {
  const dialog = document.querySelector("[role='dialog']")
  if (dialog === null) return []
  return [...dialog.querySelectorAll('button')].map((b, i) => {
    const r = b.getBoundingClientRect()
    return { i, label: (b.textContent ?? '').trim().slice(0, 20), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  }).filter(b => b.w > 60 && b.h > 20 && b.x < 500)
})

const withCss = []
for (const n of navItems) {
  if (n.label === '') continue
  const clicked = await page.evaluate(i => {
    const dialog = document.querySelector("[role='dialog']")
    const b = dialog === null ? undefined : [...dialog.querySelectorAll('button')][i]
    if (b === undefined) return false
    b.click(); return true
  }, n.i)
  if (!clicked) continue
  await page.waitForTimeout(900)
  withCss.push({ nav: n.label, ...(await page.evaluate(GEOMETRY)) })
}

/** The product's own numbers: drop our sheets, re-measure, then restore. */
const OFFICIAL = ['模型', 'Agent 预设', '内置插件']
const withoutCss = []
for (const label of OFFICIAL) {
  const item = navItems.find(n => n.label === label)
  if (item === undefined) continue
  await page.evaluate(i => {
    const dialog = document.querySelector("[role='dialog']")
    const b = [...dialog.querySelectorAll('button')][i]
    if (b !== undefined) b.click()
  }, item.i)
  await page.waitForTimeout(900)
  const before = await page.evaluate(() => document.querySelectorAll("style[data-plugin='dsh-ui-harmonizer'], style[data-plugin-css^='dsh-ui-harmonizer']").length)
  await page.evaluate(() => {
    for (const tag of document.querySelectorAll("style[data-plugin='dsh-ui-harmonizer'], style[data-plugin-css^='dsh-ui-harmonizer']")) tag.dataset.enhcStash = '1'
    for (const tag of document.querySelectorAll("style[data-enc-probe-stash]")) tag.remove()
    for (const tag of document.querySelectorAll("style[data-enc-probe-stash]")) tag.remove()
    // Disable rather than remove so the sheet comes back on demand.
    for (const tag of document.querySelectorAll("style[data-enhc-stash='1']")) { tag.setAttribute('data-enc-probe-stash', '1'); tag.media = 'not all' }
  })
  await page.waitForTimeout(400)
  withoutCss.push({ nav: label, sheets: before, ...(await page.evaluate(GEOMETRY)) })
  await page.evaluate(() => {
    for (const tag of document.querySelectorAll("style[data-enc-probe-stash='1']")) { tag.media = ''; tag.removeAttribute('data-enc-probe-stash') }
  })
  await page.waitForTimeout(300)
}

const result = { url: URL_ARG, withCss, withoutCss }
writeFileSync(`${OUT}/header-geometry.json`, JSON.stringify(result, null, 2), 'utf8')

const line = (...a) => console.log(...a)
line('=== WITH our CSS ===')
for (const r of withCss) {
  if (!r.found || r.missing !== undefined) { line(`-- ${r.nav} (${r.missing ?? 'no section'})`); continue }
  line(`-- ${r.nav}`)
  line(`   title y=${r.title.y} h=${r.title.h} | intro y=${r.intro.y} | gap=${r.gapTitleToIntro}px`)
  line(`   titleTopFromDialog=${r.titleTopFromDialog} containerGap=${r.containerGap} padTop=${r.containerPadTop} sameParent=${r.sameParent} siblings=${r.siblingCount}`)
  line(`   title=${r.titleClass} parent=${r.parentClass}`)
}
line('=== WITHOUT our CSS (the product\'s own numbers) ===')
for (const r of withoutCss) {
  if (!r.found || r.missing !== undefined) { line(`-- ${r.nav} (${r.missing ?? 'no section'})`); continue }
  line(`-- ${r.nav}  sheetsDisabled=${r.sheets}`)
  line(`   title y=${r.title.y} h=${r.title.h} | intro y=${r.intro.y} | gap=${r.gapTitleToIntro}px  containerGap=${r.containerGap} padTop=${r.containerPadTop}`)
  line(`   title=${r.titleClass}`)
}
await context.close()
