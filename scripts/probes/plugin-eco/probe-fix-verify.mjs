/**
 * Verification probe for the 2026-09-16 UI regression report.
 *
 * Measures, on the LIVE page, the four facts the report is about:
 *   1. `--enhancer-chat-scale` resolution + whether `calc(Npx * var(…))` is
 *      valid (the menu-spacing regression: length × length is invalid at
 *      computed-value time, so padding/gap/min-height fall back to 0/normal).
 *   2. A synthetic Menu fixture (`[role='menu'] > [class^='_list_'] >
 *      [class^='_item_']`) that only OUR rule can style — so it reads the real
 *      item box (8px 10px / gap 8 / min-height 40) once the variable is a number.
 *   3. The sidebar footer row: which entries it holds, their boxes, and whether
 *      each is inside the sidebar column (the "update button is covered" report).
 *   4. A sweep of every interactive element whose centre is covered by something
 *      else, so nothing else is hiding silently.
 *
 * `--simulate` injects the candidate fit rule for the usage-center entry
 * (`flex:1 1 0; min-width:0; width:auto`) WITHOUT touching any plugin source, so
 * the fix design is validated before it is written.
 *
 * Run: node scripts/probes/plugin-eco/probe-fix-verify.mjs [url] [outfile] [--simulate]
 */

import { createRequire } from 'node:module'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'
import { authCookieFor } from '../../lib/auth.mjs'

const PW_ROOT = 'C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32'
const require = createRequire(PW_ROOT + '/noop.js')
const { chromium } = require('playwright-core')

const CHROME_CANDIDATES = [
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1246/chrome-win64/chrome.exe',
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',
]
const CREDENTIALS = process.env.DSH_PROBE_CREDENTIALS ?? 'D:/dsh-home/.credentials.yaml'
const PROFILE_DIR = process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-harmony'

const argv = process.argv.slice(2)
const SIMULATE = argv.includes('--simulate')
const positional = argv.filter(a => !a.startsWith('--'))
const URL_ARG = positional[0] ?? process.env.DSH_URL ?? 'http://127.0.0.1:19387'
const OUT = positional[1] ?? 'D:/dsh-home/probe-ui/fix-verify.json'

/** In-page measurement; self-contained because it is serialized. */
function collect() {
  const cs = el => getComputedStyle(el)
  const box = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right) } }

  // 1. variable + scale arithmetic
  const bodyCs = cs(document.body)
  const probe = document.createElement('div')
  probe.style.cssText = 'position:fixed;left:-9999px'
  document.body.appendChild(probe)
  const readPad = expr => { probe.style.padding = '0'; probe.style.padding = `calc(8px * ${expr})`; const v = cs(probe).padding; probe.style.padding = '0'; return v }
  const scale = {
    chatScale: bodyCs.getPropertyValue('--enhancer-chat-scale').trim(),
    contentFontSize: bodyCs.getPropertyValue('--dsh-content-font-size').trim(),
    viaLiveVar: readPad('var(--enhancer-chat-scale, 1)'),
    viaDivByLength: readPad('calc(var(--dsh-content-font-size, 14px) / 14px)'),
    viaDivisionByNumber: readPad('calc(var(--dsh-content-font-size, 14px) / 14)'),
  }
  probe.remove()

  // 2. synthetic menu fixture (only our [role='menu'] rules can match these)
  const fx = document.createElement('div')
  fx.setAttribute('role', 'menu')
  fx.style.cssText = 'position:fixed;left:-9999px;top:0'
  fx.innerHTML = '<div class="_list_probe"><div class="_item_probe"><span class="_label_probe">x</span></div></div>'
  document.body.appendChild(fx)
  const item = fx.querySelector('._item_probe')
  const list = fx.querySelector('._list_probe')
  const label = fx.querySelector('._label_probe')
  const menu = {
    item: { padding: cs(item).padding, gap: cs(item).gap, minHeight: cs(item).minHeight, fontSize: cs(item).fontSize, lineHeight: cs(item).lineHeight, radius: cs(item).borderRadius },
    list: { padding: cs(list).padding, minWidth: cs(list).minWidth, radius: cs(list).borderRadius },
    label: { fontSize: cs(label).fontSize, padding: cs(label).padding },
  }
  fx.remove()

  // 3. sidebar footer row
  const row = document.querySelector("[class$='_footerActions']")
  const col = document.querySelector("[class$='_sidebarCol']")
  const rowBox = row === null ? null : row.getBoundingClientRect()
  const colBox = col === null ? null : col.getBoundingClientRect()
  const footer = {
    row: rowBox === null ? null : { box: box(row), display: cs(row).display, flexWrap: cs(row).flexWrap, overflow: cs(row).overflow },
    sidebar: colBox === null ? null : { box: box(col), overflow: cs(col).overflow },
    entries: row === null ? [] : [...row.querySelectorAll('button')].map(b => {
      const r = b.getBoundingClientRect()
      const centre = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      const reveals = document.elementFromPoint(Math.min(r.right - 3, colBox === null ? r.right - 3 : colBox.right - 3), r.top + r.height / 2)
      const self = el => el === null ? null : `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 34)}`
      return {
        cls: String(b.className).slice(0, 34),
        text: (b.textContent ?? '').trim().slice(0, 12),
        box: box(b),
        overflowPastSidebar: colBox === null ? null : Math.round(r.right - colBox.right),
        hitAtCentre: self(centre),
        centreIsSelf: centre === b || (centre !== null && b.contains(centre)),
        hitInsideSidebar: self(reveals),
      }
    }),
  }

  // 4. occlusion sweep over interactive elements
  const SEL = 'button, a[href], input, select, textarea, [role="button"], [role="menuitem"], [role="tab"]'
  const obscured = []
  for (const el of document.querySelectorAll(SEL)) {
    const r = el.getBoundingClientRect()
    if (r.width < 6 || r.height < 6) continue
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue
    if (cs(el).visibility === 'hidden' || cs(el).pointerEvents === 'none') continue
    // Sample a small grid; an element counts as covered when NO sample point hits it.
    const pts = []
    for (const fx2 of [0.15, 0.5, 0.85]) for (const fy of [0.3, 0.7]) pts.push([r.left + r.width * fx2, r.top + r.height * fy])
    let own = 0
    const tops = new Set()
    for (const [x, y] of pts) {
      const top = document.elementFromPoint(x, y)
      if (top === null) continue
      if (top === el || el.contains(top)) own++
      else tops.add(`${top.tagName.toLowerCase()}.${String(top.className).slice(0, 34)}`)
    }
    if (own === 0 && tops.size > 0) {
      obscured.push({
        cls: String(el.className).slice(0, 34),
        text: (el.textContent ?? '').trim().slice(0, 16),
        box: box(el),
        coveredBy: [...tops].slice(0, 3),
      })
    }
  }

  return { scale, menu, footer, obscured: obscured.slice(0, 25), obscuredTotal: obscured.length, url: location.href }
}

const chromePath = CHROME_CANDIDATES.find(p => existsSync(p))
if (chromePath === undefined) { console.error('no chromium binary found'); process.exit(2) }

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  executablePath: chromePath, headless: true, viewport: { width: 1440, height: 900 },
})
const { authority, cookie } = authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ARG, days: 1 })
await context.addCookies([cookie])

const page = await context.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
// Plugin client bundles are served from disk under a stable URL, so a rebuilt
// lib/client.js would otherwise be answered from the HTTP cache.
const cdp = await context.newCDPSession(page)
await cdp.send('Network.enable')
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(3500)

const before = await page.evaluate(collect)

let after = null
if (SIMULATE) {
  await page.addStyleTag({
    content: `.duc-sidebar-entry{flex:1 1 0;min-width:0;width:auto;margin:4px 0 4px -4px}`,
  })
  await page.waitForTimeout(400)
  after = await page.evaluate(collect)
}

const result = { url: URL_ARG, authority, simulate: SIMULATE, before, after, errors: errors.slice(0, 8) }
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8')

const line = (...a) => console.log(...a)
const show = (label, snap) => {
  line(`===== ${label} =====`)
  line(`  scale: ${JSON.stringify(snap.scale)}`)
  line(`  menu fixture: item=${JSON.stringify(snap.menu.item)}`)
  line(`                list=${JSON.stringify(snap.menu.list)} label=${JSON.stringify(snap.menu.label)}`)
  line(`  footer row: ${JSON.stringify(snap.footer.row)} sidebar=${JSON.stringify(snap.footer.sidebar)}`)
  for (const e of snap.footer.entries) line(`    entry ${e.cls.padEnd(24)} ${e.text.padEnd(12)} box=${JSON.stringify(e.box)} past=${e.overflowPastSidebar} centreSelf=${e.centreIsSelf} hit=${e.hitAtCentre}`)
  line(`  obscured interactive elements: ${snap.obscuredTotal}`)
  for (const o of snap.obscured) line(`    ${o.cls.padEnd(26)} "${o.text}" box=${JSON.stringify(o.box)} by=${o.coveredBy.join(' | ')}`)
}
line(`url=${URL_ARG} authority=${authority} simulate=${SIMULATE}`)
show('BEFORE', before)
if (after !== null) show('AFTER SIMULATION', after)
if (errors.length > 0) line('page errors: ' + errors.join(' | '))
line('written: ' + OUT)
await context.close()
