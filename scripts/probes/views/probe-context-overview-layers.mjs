/**
 * Open dsh-context's 上下文洞察 (shell.overlay dashboard) on the LIVE desktop
 * instance and MEASURE two reported defects:
 *
 *  1. layering: the dashboard is a full-viewport modal yet other chrome
 *     (header / sidebar / widgets rail) paints above it, and hovering the
 *     widgets area raises the rail above the card;
 *  2. dark mode: some elements inside the card do not follow the app theme.
 *
 * Read-only on the session: it opens a session, clicks the sidebar-foot entry
 * and moves the pointer. Nothing is typed into the composer.
 *
 * Run: node scripts/probes/views/probe-context-overview-layers.mjs [url] [title]
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
const errors = []
page.on('pageerror', e => errors.push(e && e.message ? e.message : String(e)))
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)

// ── open the session ────────────────────────────────────────────────────────
const groups = page.locator("[data-slot='sidebar.workspaces'] [class*='_projectRow']")
const groupCount = await groups.count()
for (let i = 0; i < groupCount; i++) {
  const g = groups.nth(i)
  if ((await g.getAttribute('aria-expanded')) === 'false') { await g.click(); await page.waitForTimeout(300) }
}
await page.waitForTimeout(1200)
await page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']").filter({ hasText: TITLE }).first().click().catch(() => {})
await page.waitForTimeout(5000)

// ── theme facts ─────────────────────────────────────────────────────────────
const THEME = String.raw`(() => {
  const toks = ['--dsw-alias-bg-layer-1','--dsw-alias-bg-layer-2','--dsw-alias-label-primary','--dsw-alias-bg-mask-1','--dsw-alias-border-l2','--dsw-alias-interactive-bg-hover']
  const read = el => { const cs = getComputedStyle(el); const o = {}; for (const t of toks) o[t] = cs.getPropertyValue(t).trim(); return o }
  const marked = [...document.querySelectorAll('*')].filter(el => [...el.attributes].some(a => /theme|scheme|dark/i.test(a.name) || /dark|light|theme/i.test(String(a.value)))).slice(0, 12)
    .map(el => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 50), attrs: [...el.attributes].map(a => a.name + '=' + String(a.value).slice(0, 40)) }))
  const sheet = document.querySelector('style[data-plugin-css="dsh-context/base.css"]')
  return {
    html: { cls: String(document.documentElement.className), attrs: [...document.documentElement.attributes].map(a => a.name + '=' + String(a.value).slice(0, 60)), colorScheme: getComputedStyle(document.documentElement).colorScheme, bg: getComputedStyle(document.body).backgroundColor, color: getComputedStyle(document.body).color },
    body: { cls: String(document.body.className) },
    rootTokens: read(document.documentElement),
    marked,
    hasContextBaseCss: sheet !== null,
    prefersDark: matchMedia('(prefers-color-scheme: dark)').matches,
  }
})()`
console.log('=== theme ===')
console.log(JSON.stringify(await page.evaluate(THEME), null, 1))

// ── open the 上下文洞察 dashboard ────────────────────────────────────────────
const entry = page.locator('.lc-ov-entry').first()
console.log('entry present:', await entry.count())
await entry.click({ timeout: 8000 }).catch(async () => { await entry.dispatchEvent('click').catch(() => {}) })
await page.waitForTimeout(1500)

const MEASURE = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)] }
  const desc = el => { if (el === null || el === undefined) return null
    const cs = getComputedStyle(el)
    const slot = el.getAttribute && el.getAttribute('data-slot')
    return { tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 60), slot: slot ?? undefined,
      pos: cs.position, z: cs.zIndex, tr: cs.transform === 'none' ? undefined : cs.transform.slice(0, 40), fi: cs.filter === 'none' ? undefined : cs.filter,
      op: cs.opacity === '1' ? undefined : cs.opacity, iso: cs.isolation === 'auto' ? undefined : cs.isolation, will: cs.willChange === 'auto' ? undefined : cs.willChange,
      display: cs.display, rect: R(el) } }
  const chain = el => { const out = []; let n = el; let i = 0; while (n !== null && n !== document.documentElement && i < 40) { out.push(desc(n)); n = n.parentElement; i++ } return out }

  const backdrop = document.querySelector('.lc-ov-backdrop')
  const card = document.querySelector('.lc-ov-card')
  const rail = document.querySelector('.dsx-stats-rail')

  // paint-order stack at a point: elementsFromPoint is in paint order.
  const stackAt = (x, y) => document.elementsFromPoint(x, y).slice(0, 7).map(el => { const d = desc(el); return (d.cls || d.tag) + (d.z ? ' z' + d.z : '') + (d.slot ? ' [' + d.slot + ']' : '') })

  // owners across the whole viewport on a 24px grid
  const owner = el => { if (el === null) return 'none'
    if (el.closest('.lc-ov-backdrop') !== null) return el.closest('.lc-ov-card') !== null ? 'ov-card' : 'ov-backdrop'
    if (el.closest('.dsx-stats-rail, .dsx-stats-drawer, .dsx-surface, .dsx-wave-deck') !== null) return 'rail'
    if (el.closest("[data-slot='conversation.header'], [data-slot='conversation.session.header']") !== null) return 'header'
    if (el.closest("[data-slot='sidebar'], [data-slot='sidebar.workspaces'], [class*='_sidebar']") !== null) return 'sidebar'
    if (el.closest("[data-slot='conversation']") !== null) return 'conversation'
    if (el.closest("[data-slot='shell.overlay']") !== null) return 'shell-overlay-other'
    return 'other:' + String(el.className).slice(0, 28) }
  const grid = (step) => { const counts = {}; const railAboveCard = []; const samples = []
    for (let y = step / 2; y < innerHeight; y += step) for (let x = step / 2; x < innerWidth; x += step) {
      const els = document.elementsFromPoint(x, y)
      if (els.length === 0) continue
      const top = owner(els[0]); counts[top] = (counts[top] ?? 0) + 1
      const ci = els.findIndex(e => e.closest && e.closest('.lc-ov-card') !== null)
      if (ci > 0) { const above = els.slice(0, ci).map(e => (String(e.className) || e.tagName).slice(0, 30)); railAboveCard.push({ at: [x, y], above: [...new Set(above)] }) }
      if (samples.length < 0) continue
    }
    return { counts, railAboveCardCount: railAboveCard.length, railAboveCard: railAboveCard.slice(0, 12),
      railAboveCardOwners: [...new Set(railAboveCard.flatMap(s => s.above))].slice(0, 14) } }

  // distinct opaque backgrounds inside the card
  const bgs = {}
  if (card !== null) for (const el of card.querySelectorAll('*')) {
    const cs = getComputedStyle(el)
    const bg = cs.backgroundColor
    const m = bg.match(/^rgba?\(([^)]+)\)$/); if (m === null) continue
    const parts = m[1].split(/[ ,/]+/).map(Number)
    if (parts.length > 3 && parts[3] === 0) continue
    const key = bg + ' | color ' + cs.color
    const item = bgs[key] ?? (bgs[key] = { n: 0, sample: String(el.className).slice(0, 40) || el.tagName.toLowerCase() })
    item.n++
  }
  return {
    backdrop: desc(backdrop), card: desc(card), rail: desc(rail),
    cardChain: backdrop === null ? null : chain(backdrop),
    railChain: rail === null ? null : chain(rail),
    grid: grid(24),
    grid24WithCardPoints: (() => { const cr = card === null ? null : card.getBoundingClientRect(); if (cr === null) return null
      const stack = [stackAt(Math.round(cr.left + 12), Math.round(cr.top + 12)), stackAt(Math.round(cr.left + cr.width - 12), Math.round(cr.top + 12)), stackAt(Math.round(cr.left + 12), Math.round(cr.bottom - 12)), stackAt(Math.round(cr.left + cr.width / 2), Math.round(cr.top + cr.height / 2))]
      return stack })(),
    cssVarsAtCard: (() => { if (card === null) return null; const cs = getComputedStyle(card); const out = {}
      for (const t of ['--dsw-alias-bg-layer-1','--dsw-alias-bg-layer-2','--dsw-alias-label-primary','--dsw-alias-bg-mask-1','--dsw-alias-border-l2','--dsw-alias-interactive-bg-hover']) out[t] = cs.getPropertyValue(t).trim()
      return { vars: out, color: cs.color, bg: cs.backgroundColor, border: cs.borderColor } })(),
    distinctBackgrounds: Object.entries(bgs).sort((a, b) => b[1].n - a[1].n).slice(0, 24).map(([k, v]) => ({ key: k, n: v.n, sample: v.sample })),
    tokens: (() => { const read = el => { const cs = el === null ? null : getComputedStyle(el); if (cs === null) return null; const o = {}; for (const t of ['--dsw-alias-bg-layer-1','--dsw-alias-bg-layer-2','--dsw-alias-label-primary','--dsw-alias-bg-mask-1','--dsw-alias-border-l2','--dsw-alias-interactive-bg-hover']) o[t] = cs.getPropertyValue(t).trim(); return o }
      return { html: read(document.documentElement), outlet: read(document.querySelector("[data-slot='shell.overlay']")), card: read(card), scroll: read(document.querySelector('.lc-ov-scroll')), search: read(document.querySelector('.lc-ov-search')) } })(),
  }
})()`

console.log('\n=== dashboard open (no hover) ===')
const noHover = await page.evaluate(MEASURE)
writeFileSync(`${OUT}/layers-no-hover.json`, JSON.stringify(noHover, null, 1), 'utf8')
console.log(JSON.stringify({ card: noHover.card, backdrop: noHover.backdrop, rail: noHover.rail, grid: { counts: noHover.grid.counts, railAboveCardCount: noHover.grid.railAboveCardCount, owners: noHover.grid.railAboveCardOwners } }, null, 1))
await page.screenshot({ path: `${OUT}/overview-open.png` })

// ── hover the widgets rail area, re-measure ─────────────────────────────────
const railRect = noHover.rail === null ? null : noHover.rail.rect
if (railRect !== null && railRect[2] > 0) {
  await page.mouse.move(Math.round(railRect[0] + railRect[2] / 2), Math.round(railRect[1] + railRect[3] / 2))
  await page.waitForTimeout(900)
  const hovered = await page.evaluate(MEASURE)
  writeFileSync(`${OUT}/layers-hover-rail.json`, JSON.stringify(hovered, null, 1), 'utf8')
  console.log('\n=== while hovering the rail ===')
  console.log(JSON.stringify({ grid: { counts: hovered.grid.counts, railAboveCardCount: hovered.grid.railAboveCardCount, owners: hovered.grid.railAboveCardOwners }, railAboveCard: hovered.grid.railAboveCard }, null, 1))
  await page.screenshot({ path: `${OUT}/overview-hover-rail.png` })
}

console.log('\n=== chain of .lc-ov-backdrop (self → root) ===')
console.log(JSON.stringify(noHover.cardChain, null, 1))
console.log('\n=== chain of .dsx-stats-rail (self → root) ===')
console.log(JSON.stringify(noHover.railChain, null, 1))
console.log('\n=== stack at card corners ===')
console.log(JSON.stringify(noHover.grid24WithCardPoints, null, 1))
console.log('\n=== tokens ===')
console.log(JSON.stringify(noHover.tokens, null, 1))
console.log('\n=== distinct backgrounds inside the card ===')
console.log(JSON.stringify(noHover.distinctBackgrounds, null, 1))
console.log('\n=== page errors ===')
console.log(errors.length === 0 ? '(none)' : errors.join('\n'))
await context.close()
