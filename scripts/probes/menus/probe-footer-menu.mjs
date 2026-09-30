/**
 * Sidebar footer / account popup probe.
 *
 * The report: the account popup (设置 / 意见反馈 / 退出登录) should be exactly as
 * wide as the grey account row it hangs from. This measures both, the popup's
 * geometry + the CSS that decides its width, and screenshots the pair.
 *
 * Run: node scripts/probes/menus/probe-footer-menu.mjs [url]
 */
import { createRequire } from 'node:module'
import { existsSync, writeFileSync, mkdirSync } from 'node:fs'
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
const OUT = 'D:/dsh-home/probe-ui/footer-menu'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(4000)

/** Everything in the bottom 160px of the sidebar, described. */
const footer = await page.evaluate(() => {
  const describe = el => {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect()
    return {
      tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 80), slot: el.getAttribute('data-slot'),
      text: (el.textContent ?? '').trim().slice(0, 30),
      box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      display: cs.display, position: cs.position, flex: cs.flexDirection, gap: cs.gap,
      padding: cs.padding, margin: cs.margin, width: cs.width, minWidth: cs.minWidth, maxWidth: cs.maxWidth,
      radius: cs.borderRadius, bg: cs.backgroundColor,
    }
  }
  const sidebar = document.querySelector("[data-slot='sidebar']")
  const all = sidebar === null ? [] : [...sidebar.querySelectorAll('*')].filter(el => {
    const r = el.getBoundingClientRect()
    return r.height > 0 && r.top > window.innerHeight - 170 && r.width > 0
  })
  return { viewport: { w: window.innerWidth, h: window.innerHeight }, nodes: all.slice(-45).map(describe) }
})
console.log('=== footer nodes (bottom 170px) ===')
for (const n of footer.nodes) console.log(`  <${n.tag} class="${n.cls}" slot=${n.slot}> "${n.text}" ${JSON.stringify(n.box)} w=${n.width} minW=${n.minWidth} maxW=${n.maxWidth} pad=${n.padding} gap=${n.gap} pos=${n.position}`)

// Click the bottom-most interactive row (the account row) and measure the popup.
const popup = await page.evaluate(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms))
  const sidebar = document.querySelector("[data-slot='sidebar']")
  const candidates = sidebar === null ? [] : [...sidebar.querySelectorAll('button, [role="button"]')]
    .filter(el => { const r = el.getBoundingClientRect(); return r.height > 16 && r.width > 120 && r.top > window.innerHeight - 120 })
  const out = []
  for (const row of candidates) {
    const rr = row.getBoundingClientRect()
    const desc = { cls: String(row.className).slice(0, 60), text: (row.textContent ?? '').trim().slice(0, 24), box: { x: Math.round(rr.x), y: Math.round(rr.y), w: Math.round(rr.width), h: Math.round(rr.height) } }
    row.click()
    await sleep(700)
    const menu = document.querySelector("[role='menu']")
    if (menu === null) { out.push({ ...desc, opened: null }); continue }
    const cs = getComputedStyle(menu)
    const mr = menu.getBoundingClientRect()
    const items = [...menu.querySelectorAll("[class^='_item_']")].slice(0, 5).map(el => {
      const ics = getComputedStyle(el); const ir = el.getBoundingClientRect()
      return { text: (el.textContent ?? '').trim().slice(0, 16), box: { x: Math.round(ir.x), w: Math.round(ir.width), h: Math.round(ir.height) }, padding: ics.padding, minWidth: ics.minWidth, width: ics.width, flex: ics.flex, gap: ics.gap }
    })
    out.push({
      ...desc,
      opened: {
        cls: String(menu.className).slice(0, 60),
        box: { x: Math.round(mr.x), y: Math.round(mr.y), w: Math.round(mr.width), h: Math.round(mr.height) },
        cssWidth: cs.width, minWidth: cs.minWidth, maxWidth: cs.maxWidth, padding: cs.padding, boxSizing: cs.boxSizing,
        anchorLeftAligned: Math.abs(Math.round(mr.x) - Math.round(rr.x)) <= 1,
        widthDelta: Math.round(mr.width) - Math.round(rr.width),
        html: menu.outerHTML.slice(0, 700),
        items,
      },
    })
    document.body.click()
    await sleep(300)
  }
  return out
})
console.log('\n=== account row candidates + popups ===')
for (const p of popup) {
  console.log(`  row <button class="${p.cls}"> "${p.text}" ${JSON.stringify(p.box)}`)
  if (p.opened === null) { console.log('     -> no menu'); continue }
  console.log(`     menu ${JSON.stringify(p.opened.box)} cssW=${p.opened.cssWidth} minW=${p.opened.minWidth} maxW=${p.opened.maxWidth} pad=${p.opened.padding} box=${p.opened.boxSizing}`)
  console.log(`     leftAligned=${p.opened.anchorLeftAligned} widthDelta=${p.opened.widthDelta}`)
  for (const i of p.opened.items) console.log(`       item "${i.text}" ${JSON.stringify(i.box)} pad=${i.padding} minW=${i.minWidth} w=${i.width} flex=${i.flex}`)
  console.log('     html: ' + p.opened.html.replace(/\s+/g, ' ').slice(0, 400))
}

// Screenshot with the menu open (the last candidate that opened one).
await page.evaluate(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms))
  const sidebar = document.querySelector("[data-slot='sidebar']")
  const row = [...sidebar.querySelectorAll('button, [role="button"]')]
    .filter(el => { const r = el.getBoundingClientRect(); return r.height > 16 && r.width > 120 && r.top > window.innerHeight - 120 }).pop()
  if (row !== undefined) { row.click(); await sleep(800) }
})
await page.screenshot({ path: `${OUT}/account-popup.png` })
await page.screenshot({ path: `${OUT}/account-popup-clip.png`, clip: { x: 0, y: 620, width: 620, height: 340 } })

writeFileSync(`${OUT}/footer-menu.json`, JSON.stringify({ footer, popup }, null, 2), 'utf8')
console.log('\nwritten: ' + OUT)
await context.close()
