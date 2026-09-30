/**
 * CDP matched-styles probe for the sidebar footer (the "update button is
 * covered" report, 2026-09-16).
 *
 * `document.styleSheets` does not see every sheet the product injects, so this
 * asks Chromium itself which rules apply to each node in the footer chain, with
 * the owning stylesheet URL — the only way to tell OUR rule from the product's
 * or from another plugin's.
 *
 * Run: node scripts/probes/menus/probe-footer-cdp.mjs [url] [outfile]
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

const URL_ARG = process.argv[2] ?? process.env.DSH_URL ?? 'http://127.0.0.1:19387'
const OUT = process.argv[3] ?? 'D:/dsh-home/probe-ui/footer-cdp-probe.json'

const chromePath = CHROME_CANDIDATES.find(p => existsSync(p))
if (chromePath === undefined) { console.error('no chromium binary found'); process.exit(2) }

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  executablePath: chromePath, headless: true, viewport: { width: 1440, height: 900 },
})
const { authority, cookie } = authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ARG, days: 1 })
await context.addCookies([cookie])

const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(3500)

const cdp = await context.newCDPSession(page)
await cdp.send('DOM.enable')
await cdp.send('CSS.enable')

const INTEREST = ['display', 'flex-direction', 'flex-wrap', 'flex', 'width', 'min-width', 'max-width', 'height', 'padding', 'margin', 'position', 'top', 'right', 'bottom', 'left', 'z-index', 'overflow', 'gap', 'justify-content', 'align-items', 'font-size']

/** Footer structure as the page sees it (slot children are flex items). */
const structure = await page.evaluate(() => {
  const box = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}` }
  const slot = document.querySelector("[data-slot='sidebar.footer.action']")
  const row = document.querySelector("[class$='_footerActions']")
  const foot = document.querySelector("[class$='_footArea']")
  const describe = el => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), box: box(el), display: getComputedStyle(el).display })
  return {
    foot: foot === null ? null : describe(foot),
    row: row === null ? null : describe(row),
    slot: slot === null ? null : describe(slot),
    slotChildren: slot === null ? [] : [...slot.children].map(describe),
    slotInnerChildren: slot === null ? [] : [...slot.querySelectorAll(':scope > * > *')].slice(0, 8).map(describe),
    allFooterButtons: row === null ? [] : [...row.querySelectorAll('button')].map(b => ({ ...describe(b), text: (b.textContent ?? '').trim().slice(0, 14), aria: b.getAttribute('aria-label') })),
  }
})

/** Matched rules for one node, via Chromium's own cascade. */
async function matched(selector, limit = 14) {
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 })
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector })
  if (nodeId === 0) return { selector, found: false, rules: [] }
  const res = await cdp.send('CSS.getMatchedStylesForNode', { nodeId })
  const pick = style => INTEREST.map(p => {
    const v = style.cssProperties.find(x => x.name === p && x.disabled !== true)
    return v === undefined ? null : `${p}:${v.value}`
  }).filter(Boolean).join('; ')
  const rules = (res.matchedCSSRules ?? []).map(m => ({
    origin: m.rule.origin,
    selector: m.rule.selectorList.text.slice(0, 110),
    sheet: (m.rule.styleSheetId === undefined ? '(inline)' : (res.cssKeyframesRules === undefined ? '' : '')) || String(m.rule.styleSheetId),
    props: pick(m.rule.style),
  })).filter(r => r.props !== '')
  const inline = pick(res.inlineStyle ?? { cssProperties: [] })
  return { selector, found: true, inline, rules: rules.slice(0, limit) }
}

const targets = [
  "[class$='_footArea']",
  "[class$='_footerActions']",
  "div[data-slot='sidebar.footer.action']",
  "div[data-slot='sidebar.footer.action'] > *",
  "[class$='_entryRow']",
  "button[data-update-available]",
]
const matchedReports = []
for (const t of targets) matchedReports.push(await matched(t))

/** Which stylesheets are even visible to the cascade, and are we in one? */
const sheets = await cdp.send('CSS.getAllStyleSheets').catch(() => null)
const sheetSummary = sheets === null ? null : (sheets.headers ?? []).map(h => ({ id: h.styleSheetId, url: (h.sourceURL ?? '(none)').split('/').pop(), title: h.title ?? null, length: h.length }))

const result = { url: URL_ARG, authority, structure, matched: matchedReports, sheetSummary }
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8')

const line = (...a) => console.log(...a)
line(`url=${URL_ARG} authority=${authority}`)
line('=== footer structure ===')
for (const [k, v] of Object.entries(structure)) line(`  ${k}: ${JSON.stringify(v)}`)
line('=== matched rules (Chromium cascade) ===')
for (const r of matchedReports) {
  line(`  -- ${r.selector} ${r.found ? '' : '(not found)'}${r.inline === '' ? '' : ' inline[' + r.inline + ']'}`)
  for (const rule of r.rules) line(`       ${rule.selector}  =>  ${rule.props}`)
}
line(`=== style sheets (${sheetSummary?.length ?? 0}) ===`)
for (const s of (sheetSummary ?? []).slice(0, 40)) line(`  ${s.id} ${s.length} ${s.url}`)
line('written: ' + OUT)
await context.close()
