/**
 * Follow-up measurement for the 上下文洞察 (shell.overlay) dashboard:
 *
 *  A. dark mode — flip `body[data-ds-dark-theme]` (the product's own dark token
 *     scope) and list every element inside `.lc-ov-card` that keeps a LIGHT
 *     background while the card itself is dark;
 *  B. icon inventory — dump the SVG markup/size/fills of the sidebar-foot
 *     action entries (dsh-context's `.lc-ov-entry` and its neighbours), the
 *     view-ring chip icon and the panel's own head icon, so the plugin's
 *     polychrome sheet can be compared with the product's own icon language;
 *  C. paint order around the card/rail overlap, with pointer-events forced to
 *     auto so elementsFromPoint reports PAINT order (the widgets magnify layer
 *     lives in its own pointer-events:none portal), before and while the pointer
 *     hovers the widgets area.
 *
 * Read-only on the session. Run:
 *   node scripts/probes/views/probe-context-overview-dark-and-icons.mjs [url] [title]
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

const groups = page.locator("[data-slot='sidebar.workspaces'] [class*='_projectRow']")
const groupCount = await groups.count()
for (let i = 0; i < groupCount; i++) {
  const g = groups.nth(i)
  if ((await g.getAttribute('aria-expanded')) === 'false') { await g.click(); await page.waitForTimeout(300) }
}
await page.waitForTimeout(1200)
await page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']").filter({ hasText: TITLE }).first().click().catch(() => {})
await page.waitForTimeout(5000)

// ── B. icon inventory (before opening the panel) ────────────────────────────
const ICONS = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [+r.width.toFixed(1), +r.height.toFixed(1)] }
  const svgInfo = svg => {
    if (svg === null) return null
    const paths = [...svg.querySelectorAll('path,rect,circle,line,polyline,polygon')]
    const fills = [...new Set(paths.map(p => p.getAttribute('fill') ?? getComputedStyle(p).fill))]
    const strokes = [...new Set(paths.map(p => p.getAttribute('stroke') ?? getComputedStyle(p).stroke))]
    return { viewBox: svg.getAttribute('viewBox'), size: R(svg), parts: paths.length, fills, strokes,
      computedColor: getComputedStyle(svg).color, head: svg.outerHTML.slice(0, 200) }
  }
  const entries = [...document.querySelectorAll('.lc-ov-entry')].map(btn => ({
    cls: String(btn.className), label: (btn.textContent ?? '').trim(), title: btn.getAttribute('title'), aria: btn.getAttribute('aria-label'),
    rect: R(btn), svg: svgInfo(btn.querySelector('svg')),
  }))
  // neighbouring foot actions: every button in the same footer container
  const foot = document.querySelector('.lc-ov-entry')?.closest("[class*='footerActions'], [class*='footArea']")
  const neighbours = foot === null || foot === undefined ? [] : [...foot.querySelectorAll('button')].map(btn => ({
    label: (btn.textContent ?? '').trim().slice(0, 24), cls: String(btn.className).slice(0, 60),
    svg: svgInfo(btn.querySelector('svg')),
  }))
  const chip = document.querySelector("[class*='_tabs'] .lc-title-icon")
  return { entries, neighbours, chip: svgInfo(chip) }
})()`
console.log('=== icon inventory (page, panel closed) ===')
const icons = await page.evaluate(ICONS)
console.log(JSON.stringify(icons, null, 1))
writeFileSync(`${OUT}/icons.json`, JSON.stringify(icons, null, 1), 'utf8')

const entry = page.locator('.lc-ov-entry').first()
await entry.click({ timeout: 8000 }).catch(async () => { await entry.dispatchEvent('click').catch(() => {}) })
await page.waitForTimeout(1500)

// ── A. dark mode ────────────────────────────────────────────────────────────
const DARK = String.raw`(() => {
  const lum = (css) => { const m = String(css).match(/rgba?\(([^)]+)\)/); if (m === null) return null
    const p = m[1].split(/[ ,/]+/).map(Number); if (p.length > 3 && p[3] < 0.5) return null
    return +(((0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]) / 255).toFixed(3)) }
  const R = el => { const r = el.getBoundingClientRect(); return [+r.width.toFixed(1), +r.height.toFixed(1)] }
  const card = document.querySelector('.lc-ov-card')
  const bodyAttr = document.body.getAttribute('data-ds-dark-theme')
  const readTok = el => { const cs = el === null ? null : getComputedStyle(el); if (cs === null) return null; const o = {}
    for (const t of ['--dsw-alias-bg-layer-1','--dsw-alias-bg-layer-2','--dsw-alias-label-primary','--dsw-alias-bg-mask-1','--dsw-alias-border-l2','--dsw-alias-interactive-bg-hover','--dsw-specific-input-major']) o[t] = cs.getPropertyValue(t).trim()
    return o }
  const lightPatches = []
  const bgs = {}
  if (card !== null) for (const el of card.querySelectorAll('*')) {
    const cs = getComputedStyle(el)
    const L = lum(cs.backgroundColor)
    if (L !== null && L > 0.6) lightPatches.push({ cls: String(el.className).slice(0, 46) || el.tagName.toLowerCase(), bg: cs.backgroundColor, color: cs.color, rect: R(el) })
    if (L !== null) { const k = cs.backgroundColor + ' | ' + cs.color; const it = bgs[k] ?? (bgs[k] = { n: 0, sample: String(el.className).slice(0, 40) || el.tagName.toLowerCase() }); it.n++ }
  }
  return {
    bodyAttr, bodyClass: String(document.body.className),
    cardBg: card === null ? null : { bg: getComputedStyle(card).backgroundColor, color: getComputedStyle(card).color, border: getComputedStyle(card).borderColor },
    backdropBg: document.querySelector('.lc-ov-backdrop') === null ? null : getComputedStyle(document.querySelector('.lc-ov-backdrop')).backgroundColor,
    tokens: { body: readTok(document.body), outlet: readTok(document.querySelector("[data-slot='shell.overlay']")), card: readTok(card), search: readTok(document.querySelector('.lc-ov-search')) },
    lightPatchCount: lightPatches.length, lightPatches: lightPatches.slice(0, 40),
    distinct: Object.entries(bgs).sort((a, b) => b[1].n - a[1].n).slice(0, 20).map(([k, v]) => ({ key: k, n: v.n, sample: v.sample })),
    hardcoded: (() => { const out = []
      if (card !== null) for (const el of card.querySelectorAll('[style]')) {
        const s = el.getAttribute('style') ?? ''
        if (/color|background|border|fill/i.test(s)) out.push({ cls: String(el.className).slice(0, 40) || el.tagName.toLowerCase(), style: s.slice(0, 80) })
      }
      return out.slice(0, 20) })(),
  }
})()`

console.log('\n=== light theme tokens (before) ===')
const lightTokens = await page.evaluate(`(() => { const c = getComputedStyle(document.querySelector('.lc-ov-card')); const o = {}; for (const t of ['--dsw-alias-bg-layer-1','--dsw-alias-bg-layer-2','--dsw-alias-label-primary','--dsw-alias-bg-mask-1']) o[t] = c.getPropertyValue(t).trim(); return o })()`)
console.log(JSON.stringify(lightTokens))

await page.evaluate(() => document.body.setAttribute('data-ds-dark-theme', ''))
await page.waitForTimeout(800)
const dark = await page.evaluate(DARK)
writeFileSync(`${OUT}/dark-mode.json`, JSON.stringify({ lightTokens, dark }, null, 1), 'utf8')
console.log('\n=== dark mode ===')
console.log(JSON.stringify({ cardBg: dark.cardBg, backdropBg: dark.backdropBg, tokens: dark.tokens, lightPatchCount: dark.lightPatchCount, lightPatches: dark.lightPatches, hardcoded: dark.hardcoded }, null, 1))
console.log('\n=== dark distinct backgrounds ===')
console.log(JSON.stringify(dark.distinct, null, 1))
await page.screenshot({ path: `${OUT}/overview-dark.png` })
await page.evaluate(() => document.body.removeAttribute('data-ds-dark-theme'))
await page.waitForTimeout(500)

// ── C. paint order around the card/rail overlap ─────────────────────────────
const PAINT = String.raw`(() => {
  const card = document.querySelector('.lc-ov-card')
  const cr = card.getBoundingClientRect()
  const rail = document.querySelector('.dsx-stats-rail')
  const rr = rail === null ? null : rail.getBoundingClientRect()
  const nm = el => { const s = String(el.className || el.tagName); return s.length > 46 ? s.slice(0, 46) : s }
  const mag = document.querySelector('.dsx-magnify-layer')
  const chainOf = el => { const out = []; let n = el; let i = 0; while (n !== null && n !== document.documentElement && i < 12) { const cs = getComputedStyle(n); out.push({ cls: nm(n), slot: n.getAttribute('data-slot') ?? undefined, pos: cs.position, z: cs.zIndex, pe: cs.pointerEvents, display: cs.display }); n = n.parentElement; i++ } return out }
  const pts = []
  if (rr !== null) { const x0 = Math.max(cr.left + 4, rr.left + 4); for (let y = Math.round(cr.top + 10); y < Math.round(Math.min(cr.bottom, rr.bottom) - 10); y += 120) for (let x = Math.round(x0); x < Math.round(Math.min(cr.right, rr.right) - 4); x += 160) pts.push([x, y]) }
  const stacks = pts.map(([x, y]) => ({ at: [x, y], els: document.elementsFromPoint(x, y).slice(0, 6).map(nm) }))
  const above = stacks.filter(s => { const i = s.els.findIndex(c => c.startsWith('lc-ov-card')); return i > 0 })
  return {
    card: [cr.left, cr.top, cr.width, cr.height].map(n => Math.round(n)),
    rail: rr === null ? null : [rr.left, rr.top, rr.width, rr.height].map(n => Math.round(n)),
    magnify: mag === null ? null : { cls: String(mag.className), rect: [mag.getBoundingClientRect().left, mag.getBoundingClientRect().top, mag.getBoundingClientRect().width, mag.getBoundingClientRect().height].map(n => Math.round(n)), display: getComputedStyle(mag).display, opacity: getComputedStyle(mag).opacity, z: getComputedStyle(mag).zIndex, chain: chainOf(mag) },
    samples: stacks.slice(0, 10), aboveCardCount: above.length, aboveCard: above.slice(0, 6),
  }
})()`

const forcePE = async () => { await page.addStyleTag({ content: '*{pointer-events:auto !important}' }); await page.waitForTimeout(200) }
await forcePE()
const paintNoHover = await page.evaluate(PAINT)
console.log('\n=== paint order, no hover (pointer-events forced) ===')
console.log(JSON.stringify({ aboveCardCount: paintNoHover.aboveCardCount, samples: paintNoHover.samples, magnify: paintNoHover.magnify }, null, 1))

if (paintNoHover.rail !== null) {
  await page.mouse.move(paintNoHover.rail[0] + 60, paintNoHover.rail[1] + 300)
  await page.waitForTimeout(1000)
  const paintHover = await page.evaluate(PAINT)
  writeFileSync(`${OUT}/paint-order.json`, JSON.stringify({ paintNoHover, paintHover }, null, 1), 'utf8')
  console.log('\n=== paint order, hovering the widgets area ===')
  console.log(JSON.stringify({ aboveCardCount: paintHover.aboveCardCount, aboveCard: paintHover.aboveCard, magnify: paintHover.magnify, samples: paintHover.samples }, null, 1))
  await page.screenshot({ path: `${OUT}/overview-hover-forced-pe.png` })
} else {
  writeFileSync(`${OUT}/paint-order.json`, JSON.stringify({ paintNoHover }, null, 1), 'utf8')
}

console.log('\n=== page errors ===')
console.log(errors.length === 0 ? '(none)' : errors.join('\n'))
await context.close()
