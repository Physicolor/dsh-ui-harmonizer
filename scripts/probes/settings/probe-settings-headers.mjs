/**
 * Settings-section header probe (v2).
 *
 * Opens Settings from the sidebar launcher, walks every nav item, and for each
 * section records the header that is actually on screen: the section root, the
 * page-title node, the page-description node, their computed typography, and a
 * screenshot. That is the evidence for "every page must open with the same
 * official skeleton".
 *
 * Run: node scripts/probes/settings/probe-settings-headers.mjs [url]
 */
import { createRequire } from 'node:module'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { authCookieFor } from '../../lib/auth.mjs'

const PW_ROOT = 'C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32'
const require = createRequire(PW_ROOT + '/noop.js')
const { chromium } = require('playwright-core')
const CHROME_CANDIDATES = [
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1246/chrome-win64/chrome.exe',
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',
]
const CREDENTIALS = 'D:/dsh-home/.credentials.yaml'
const PROFILE_DIR = process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-harmony'
const URL_ARG = process.argv[2] ?? process.env.DSH_URL ?? 'http://127.0.0.1:19387'
const OUT = 'D:/dsh-home/probe-ui/settings-headers'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
const errors = []
page.on('pageerror', e => errors.push('pageerror: ' + e.message))
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(4000)

/** Open the settings dialog: click every candidate launcher until a dialog shows. */
const openSettings = async () => {
  for (const sel of ["[data-slot='settings.launcher'] button", "[data-slot='settings.trigger'] button", "[data-slot='sidebar.settings'] button", "[data-slot='sidebar'] button[class*='_trigger']"]) {
    try {
      const el = page.locator(sel).first()
      if (await el.count() === 0) continue
      await el.click({ timeout: 4000 })
      await page.waitForTimeout(1200)
      if (await page.locator("[role='dialog']").count() > 0) return sel
    } catch { /* try the next candidate */ }
  }
  return null
}
const openedBy = await openSettings()
console.log('settings opened by: ' + openedBy)
await page.waitForTimeout(1200)

const dialogShape = await page.evaluate(() => {
  const dialog = document.querySelector("[role='dialog']")
  if (dialog === null) return null
  const describe = el => {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect()
    return { tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 50), slot: el.getAttribute('data-slot'),
      text: (el.textContent ?? '').trim().slice(0, 20), box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`, display: cs.display, role: el.getAttribute('role') }
  }
  return { cls: String(dialog.className), descendants: [...dialog.querySelectorAll(':scope > *, :scope > * > *')].slice(0, 24).map(describe) }
})
console.log('dialog shape: ' + JSON.stringify(dialogShape, null, 2))

/** Every button in the left rail of the dialog. */
const navItems = await page.evaluate(() => {
  const dialog = document.querySelector("[role='dialog']")
  if (dialog === null) return []
  return [...dialog.querySelectorAll('button')].map((b, i) => {
    const r = b.getBoundingClientRect()
    return { i, label: (b.textContent ?? '').trim().slice(0, 20), cls: String(b.className).slice(0, 30), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), current: b.getAttribute('aria-current') }
  }).filter(b => b.w > 60 && b.h > 20 && b.x < 500)
})
console.log(`nav items: ${navItems.length}`)
for (const n of navItems) console.log(`  [${n.i}] "${n.label}" ${n.w}x${n.h} @${n.x},${n.y}`)

const COLLECT = () => {
  const describe = el => {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect()
    return {
      tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 70),
      text: (el.textContent ?? '').trim().slice(0, 60),
      box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      font: `${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight}`, color: cs.color,
      margin: cs.margin, padding: cs.padding, borderBottom: `${cs.borderBottomWidth} ${cs.borderBottomStyle}`,
      gap: cs.gap, display: cs.display, maxWidth: cs.maxWidth,
    }
  }
  const section = document.querySelector("[data-slot='settings.section']")
  if (section === null) return { found: false }
  const titleSel = "h1, h2, h3, [class$='_title'], [class$='_heading']"
  const titles = [...section.querySelectorAll(titleSel)]
    .filter(el => !el.closest("[class$='_row'], [class$='_card'], [class$='_rowCard']"))
    .slice(0, 5).map(describe)
  const intros = [...section.querySelectorAll("p, [class$='_intro'], [class$='_sub'], [class$='_subtitle']")]
    .filter(el => (el.textContent ?? '').trim().length > 6)
    .filter(el => !el.closest("[class$='_row'], [class$='_card'], [class$='_rowCard'], [class$='_field']"))
    .slice(0, 5).map(describe)
  return {
    found: true,
    section: describe(section),
    childCount: section.children.length,
    firstChildren: [...section.children].slice(0, 4).map(el => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 50) })),
    titles, intros,
    headHtml: section.innerHTML.slice(0, 900),
  }
}

const sections = []
for (const n of navItems) {
  if (n.label === '') continue
  const ok = await page.evaluate(i => {
    const dialog = document.querySelector("[role='dialog']")
    if (dialog === null) return false
    const b = [...dialog.querySelectorAll('button')][i]
    if (b === undefined) return false
    b.click(); return true
  }, n.i)
  if (!ok) continue
  await page.waitForTimeout(900)
  const info = await page.evaluate(COLLECT)
  sections.push({ nav: n.label, ...info })
  await page.screenshot({ path: `${OUT}/section-${n.i}-${n.label.replace(/[^\p{L}\p{N}_-]+/gu, '_')}.png` }).catch(() => null)
}

writeFileSync(`${OUT}/settings-headers.json`, JSON.stringify({ url: URL_ARG, openedBy, dialogShape, navItems, sections, errors }, null, 2), 'utf8')
const line = (...a) => console.log(...a)
line('\n=== sections ===')
for (const s of sections) {
  line(`-- ${s.nav} ${s.found ? '' : '(no section)'}`)
  if (!s.found) continue
  line(`   section <${s.section.tag} class="${s.section.cls}"> ${JSON.stringify(s.section.box)} flex=${s.section.display} gap=${s.section.gap} maxW=${s.section.maxWidth}`)
  for (const t of s.titles) line(`   TITLE <${t.tag} class="${t.cls}"> "${t.text.slice(0, 30)}" ${t.font} color=${t.color} margin=${t.margin} bb=${t.borderBottom}`)
  for (const t of s.intros) line(`   INTRO <${t.tag} class="${t.cls}"> "${t.text.slice(0, 30)}" ${t.font} padding=${t.padding} bb=${t.borderBottom}`)
  line(`   children: ${JSON.stringify(s.firstChildren)}`)
}
line(`errors: ${errors.length}`)
line('written: ' + OUT)
await context.close()
