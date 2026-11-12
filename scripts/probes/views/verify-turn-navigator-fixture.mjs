/**
 * Turn navigator reveal — static fixture acceptance.
 *
 * Deliberately does NOT touch a running Harness instance: the page is a local
 * fixture whose geometry mirrors the measured DOM (see
 * `nav-room.ts`'s header and `docs/MEASUREMENTS.md` §4), and the two stylesheets
 * under test are read from the REAL artifacts:
 *
 *   - the product's `TurnNavigator.module.css` and `ConversationRoot.module.css`,
 *     extracted from the installed `dsh-client-ui-chat` /
 *     `dsh-client-ui-conversation` bundles;
 *   - this plugin's compiled `lib/client.js`, whose emitted text is what a
 *     browser actually loads.
 *
 * What it asserts, on the shipped geometry:
 *   1. `--dsh-chat-content-width: 748px` + `scroll body 853px` (rail on) puts the
 *      navigator's container at 789px, and the product hides the frame;
 *   2. with the room flag published, the frame is visible;
 *   3. its right edge is flush with the slot's padding box, 12px in from the
 *      column edge, 40px wide including the inset — no collision with the
 *      transcript column;
 *   4. it is hit-testable at its centre;
 *   5. the measurement is a pure function of the two boxes: 853 - 748 = 105 of
 *      slack, 52.5 on each side, and the gate is exactly `free >= 56`;
 *   6. an artificially narrow strip (`free` 35px) keeps it hidden;
 *   7. a wider column (`content width 1080`, sidebar closed) reveals it.
 *
 * Run: node scripts/probes/views/verify-turn-navigator-fixture.mjs
 */
import path from 'node:path'
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const REPO = path.resolve(import.meta.dirname, '..', '..', '..')
const WIDGETS_LIB = process.env.DSH_WIDGETS_LIB ?? 'D:/dsh-home/plugins/dsh-widgets/scripts/lib'
const require = createRequire(path.join(WIDGETS_LIB, 'x.cjs'))
const { chromium } = require(path.join(WIDGETS_LIB, 'playwright-core.cjs'))
const { chromePath } = require(path.join(WIDGETS_LIB, 'chrome.cjs'))

const OUT = path.join(REPO, '.tmp-nav-room', 'fixture')
mkdirSync(OUT, { recursive: true })

/**
 * Locate the installed product package that owns a sheet.
 * @param name - the package directory under `@deepseek-ai`.
 * @returns the bundle path, or null when the package is not installed.
 */
function productBundle(name) {
  const roots = [
    process.env.DSH_PRODUCT_ROOT,
    'C:/Users/12404/AppData/Local/npm-cache/_npx/7eff65a5cfe9d1d1/node_modules/@deepseek-ai',
    path.join(process.env.LOCALAPPDATA ?? '', 'Programs/DeepSeek Harness/resources/app.asar.unpacked/dsh/node_modules/@deepseek-ai'),
  ].filter(Boolean)
  for (const root of roots) {
    const file = path.join(root, name, 'lib', 'client.js')
    if (existsSync(file)) return file
  }
  return null
}

/**
 * Slice one `css$N = "…"` literal out of a client bundle.
 *
 * The bundle is built output, so the assignment is addressed by the marker that
 * follows it (the sheet's tag id) rather than by a variable name that changes
 * per module.
 * @param bundle - the bundle text.
 * @param marker - a comment or tag id that follows the literal.
 * @returns the CSS text.
 */
function cssLiteralOf(bundle, marker) {
  const head = bundle.slice(0, bundle.lastIndexOf(marker))
  const matches = [...head.matchAll(/(?:const\s+)?css\$\d+\s*=\s*"/gu)]
  const last = matches.at(-1)
  if (last === undefined) throw new Error(`css assignment not found for ${marker}`)
  let i = (last.index ?? 0) + last[0].length
  let out = ''
  // Walk the JSON string literal; a backslash escapes the next character.
  for (; i < bundle.length; i++) {
    const ch = bundle[i]
    if (ch === '\\') { out += ch + bundle[i + 1]; i += 1; continue }
    if (ch === '"') return JSON.parse(`"${out}"`)
    out += ch
  }
  throw new Error(`css literal end not found for ${marker}`)
}

const chatBundle = productBundle('dsh-client-ui-chat')
const conversationBundle = productBundle('dsh-client-ui-conversation')
if (chatBundle === null || conversationBundle === null) {
  console.log('SKIP: the product client bundles are not installed on this machine')
  process.exit(0)
}
const turnNavigatorCss = cssLiteralOf(readFileSync(chatBundle, 'utf8'), 'TurnNavigator.module.css')

/**
 * The hash prefix the product's CSS-Module build gave one sheet's classes.
 *
 * The fixture must wear the SAME class names the extracted CSS rules address, so
 * they are read from the sheet instead of hardcoded (the prefix is a build hash
 * and changes between releases).
 * @param css - the sheet text.
 * @returns the shared prefix, e.g. `eGxaPq`.
 */
function classPrefix(css) {
  const match = /\.[A-Za-z0-9_-]+_(?:slot|frame|column|body)\b/u.exec(css)
  if (match === null) throw new Error('no hashed class found in the sheet')
  return match[0].slice(1, match[0].indexOf('_'))
}

const NAV_PREFIX = classPrefix(turnNavigatorCss)
const conversationRootCss = cssLiteralOf(readFileSync(conversationBundle, 'utf8'), 'ConversationRoot.module.css')
const COLUMN_PREFIX = classPrefix(conversationRootCss)
const pluginBundle = readFileSync(path.join(REPO, 'lib', 'client.js'), 'utf8')
const pluginRule = cssLiteralOf(pluginBundle, 'turn-navigator-room.module.css')

/** The fixture page: the measured DOM, the real sheets, nothing else. */
const HTML = `<!doctype html><html><head><meta charset="utf-8">
<style id="tokens">
  :root { --dsh-scrollbar-width: 0px; --dsh-composer-height: 238px; --dsh-conversation-viewport-height: 1000px; --dsh-composer-side-clearance: 16px; }
  html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
  [data-conversation-scroll] { width: 853px; background: #f6f6f6; min-height: 600px; }
</style>
<style id="product-conversation">${conversationRootCss}</style>
<style id="product-chat">${turnNavigatorCss}</style>
</head><body>
<div id="host"></div>
<script>
window.__fixture = (() => {
  const nav = ${JSON.stringify(NAV_PREFIX)}
  const col = ${JSON.stringify(COLUMN_PREFIX)}
  const host = document.getElementById('host')
  host.innerHTML = [
    '<div data-conversation-scroll>',
    '  <div class="' + col + '_body">',
    '    <div class="' + col + '_scrollBody"><div class="' + col + '_viewArea">',
    '      <div class="' + col + '_column"></div>',
    '      <div class="' + nav + '_slot"><nav class="' + nav + '_frame"><div class="' + nav + '_scroller"><div class="' + nav + '_marks">',
    '        <button class="' + nav + '_mark"></button><button class="' + nav + '_mark"></button>',
    '      </div></div></nav></div>',
    '    </div></div>',
    '  </div>',
    '</div>',
  ].join('\\n')
  const scroll = document.querySelector('[data-conversation-scroll]')
  document.documentElement.style.setProperty('--dsh-chat-content-width', '748px')
  document.documentElement.style.setProperty('--enhc-nav-needed', '56px')
  // The product resolves the column's width from --dsh-chat-content-width; the
  // fixture's reduced DOM chain does not carry every host rule that feeds it, so
  // the resolved column is pinned to the measured 748px explicitly. Everything
  // downstream (strip, container, navigator box) then follows from real CSS.
  document.querySelector('[class$="_column"]').style.maxWidth = '748px'
  return { scroll }
})()
</script></body></html>`

/** Reads the two boxes and re-derives the gate exactly as the module does. */
const MEASURE = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return { left: +r.left.toFixed(1), right: +r.right.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } }
  const cs = el => getComputedStyle(el)
  const scroll = document.querySelector('[data-conversation-scroll]')
  const column = scroll.querySelector("[class$='_column']")
  const slot = scroll.querySelector("[class$='_slot']:has(> nav)")
  const nav = slot === null ? null : slot.querySelector(':scope > nav')
  const style = cs(scroll)
  const padL = Number.parseFloat(style.paddingLeft) || 0
  const padR = Number.parseFloat(style.paddingRight) || 0
  const contentBox = scroll.getBoundingClientRect().width - padL - padR
  const columnW = column.getBoundingClientRect().width
  const free = (contentBox - columnW) / 2
  const attr = document.documentElement.getAttribute('data-nav-room')
  const navRect = nav === null ? null : nav.getBoundingClientRect()
  const columnRect = column.getBoundingClientRect()
  const hit = navRect === null || navRect.width === 0 ? null : (() => {
    const el = document.elementFromPoint(Math.round(navRect.left + navRect.width / 2), Math.round(navRect.top + navRect.height / 2))
    return el !== null && nav.contains(el)
  })()
  return {
    scrollW: +scroll.getBoundingClientRect().width.toFixed(1),
    padR, contentBox: +contentBox.toFixed(1), columnW: +columnW.toFixed(1),
    containerWidth: (() => { const probe = document.createElement('div'); probe.style.cssText = 'position:absolute;width:100cqw;height:0'; slot.appendChild(probe); const w = probe.getBoundingClientRect().width; probe.remove(); return +w.toFixed(1) })(),
    free: +free.toFixed(1),
    publishedFree: Number.parseFloat(cs(document.documentElement).getPropertyValue('--enhc-nav-free')) || null,
    attr,
    gate: attr === '1' && free >= 56,
    navDisplay: nav === null ? null : cs(nav).display,
    navRect: navRect === null ? null : { left: +navRect.left.toFixed(1), right: +navRect.right.toFixed(1), w: +navRect.width.toFixed(1), h: +navRect.height.toFixed(1) },
    columnRight: +columnRect.right.toFixed(1),
    slotPaddingBoxRight: +((() => { const r = slot.getBoundingClientRect(); return r.right - (Number.parseFloat(cs(slot).paddingRight) || 0) })()).toFixed(1),
    gapToColumn: navRect === null ? null : +(navRect.left - columnRect.right).toFixed(1),
    hit,
  }
})()`

const failures = []
const check = (ok, what, detail) => {
  if (!ok) failures.push(`${what}${detail === undefined ? '' : ` (${detail})`}`)
}

const browser = await chromium.launch({ executablePath: chromePath(), headless: true })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.setContent(HTML, { waitUntil: 'load' })
/** @type {Record<string, unknown>[]} */
const rows = []

/** Reproject the fixture onto a given scroll width and content width. */
async function arm(scrollW, contentW) {
  await page.evaluate(([w, c]) => {
    const scroll = document.querySelector('[data-conversation-scroll]')
    const column = scroll.querySelector("[class$='_column']")
    scroll.style.width = w + 'px'
    document.documentElement.style.setProperty('--dsh-chat-content-width', c + 'px')
    column.style.maxWidth = c + 'px'
    // Re-apply the module's own publisher logic (the bundle is not executed here).
    const style = getComputedStyle(scroll)
    const box = scroll.getBoundingClientRect().width - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0)
    const columnW = column.getBoundingClientRect().width
    const free = Math.round((box - columnW) / 2)
    document.documentElement.style.setProperty('--enhc-nav-free', free + 'px')
    document.documentElement.style.setProperty('--enhc-nav-free-left', free + 'px')
    if (free >= 56) document.documentElement.setAttribute('data-nav-room', '1')
    else document.documentElement.removeAttribute('data-nav-room')
  }, [scrollW, contentW])
  return page.evaluate(() => ({
    attr: document.documentElement.getAttribute('data-nav-room'),
    free: getComputedStyle(document.documentElement).getPropertyValue('--enhc-nav-free').trim(),
    columnW: document.querySelector("[class$='_column']").getBoundingClientRect().width,
  }))
}

// ── 1. the product's own behaviour, before the fix is applied ─────────────
//
// 853px of scroll box with the rail's 460px reservation inside it is the
// measured shape at a 1600px viewport (slot 853 ⇒ container 789). The column is
// the product's own resolved 748px, which leaves 52.5px of strip per side —
// under the 56px the navigator needs, so this arm must ALSO stay hidden after the
// fix: the rule may not reveal a navigator that would touch the transcript.
await arm(853, 748)
const baseline = await page.evaluate(MEASURE)
rows.push({ arm: 'A 853/748 rail-on (no fix sheet)', ...baseline })
check(baseline.scrollW === 853, 'scroll width is not the measured 853', String(baseline.scrollW))
check(baseline.containerWidth === 789, 'container width is not the measured 789', String(baseline.containerWidth))
check(baseline.navDisplay === 'none', 'baseline: the product should hide the navigator', String(baseline.navDisplay))

// ── 2..5 the fix sheet on the same rail-on shape, with a 66px strip ───────
await page.addStyleTag({ content: pluginRule })
const tight = await page.evaluate(MEASURE)
rows.push({ arm: 'B 853/748 rail-on + fix (52.5px)', ...tight })
check(tight.free === 52.5, 'the tight strip is not 52.5px', String(tight.free))
check(tight.attr === null, 'a 52.5px strip must not publish the room flag', String(tight.attr))
check(tight.navDisplay === 'none', 'a 52.5px strip must not reveal the navigator', String(tight.navDisplay))

await arm(880, 748)
const roomy = await page.evaluate(MEASURE)
rows.push({ arm: 'C 880/748 (66px strip)', ...roomy })
check(roomy.attr === '1', 'the room flag was not published for a 66px strip', String(roomy.attr))
check(roomy.free === 66, 'the strip is not 66px', String(roomy.free))
check(roomy.publishedFree === 66, 'published free width is not the strip', String(roomy.publishedFree))
check(roomy.navDisplay === 'block', 'the fix did not reveal the navigator', String(roomy.navDisplay))
check(roomy.navRect !== null && roomy.navRect.w === 28, 'the revealed navigator is not 28px wide', JSON.stringify(roomy.navRect))
check(roomy.navRect !== null && Math.abs(roomy.navRect.right - (roomy.slotPaddingBoxRight - 12)) <= 1.5, 'the navigator is not 12px in from the slot padding box', `navRight=${roomy.navRect?.right} slotInner=${roomy.slotPaddingBoxRight}`)
check(roomy.gapToColumn !== null && roomy.gapToColumn >= 0, 'the navigator touches the transcript column', String(roomy.gapToColumn))
check(roomy.hit === true, 'the revealed navigator is not hit-testable at its centre', String(roomy.hit))

// ── 6. the rail off: a much wider column, revealed by the product anyway ──
await arm(1300, 748)
const railOff = await page.evaluate(MEASURE)
rows.push({ arm: 'D 1300/748 rail-off', ...railOff })
check(railOff.attr === '1' && railOff.navDisplay === 'block', 'the rail-off shape did not reveal the navigator', `${railOff.attr}/${railOff.navDisplay}`)
check(railOff.gapToColumn !== null && railOff.gapToColumn >= 0, 'the rail-off navigator touches the column', String(railOff.gapToColumn))

// ── 7. the right sidebar open: the column keeps its floor, the strip shrinks ─
await arm(598, 520)
const sidebar = await page.evaluate(MEASURE)
rows.push({ arm: 'E 598/520 sidebar-open', ...sidebar })
check(sidebar.free === 39, 'the sidebar-open strip is not 39px', String(sidebar.free))
check(sidebar.attr === null && sidebar.navDisplay === 'none', 'an insufficient strip must keep the navigator hidden', `${sidebar.attr}/${sidebar.navDisplay}`)

// ── 8. the flag is what carries the decision ─────────────────────────────
await arm(880, 748)
await page.evaluate(() => document.documentElement.removeAttribute('data-nav-room'))
const unflagged = await page.evaluate(MEASURE)
rows.push({ arm: 'F 880/748 without the flag', ...unflagged })
check(unflagged.navDisplay === 'none', 'without the flag the navigator must stay hidden', String(unflagged.navDisplay))

await page.screenshot({ path: path.join(OUT, 'fixture-wide.png') })
await page.setViewportSize({ width: 900, height: 600 })
await arm(853, 748)
await page.screenshot({ path: path.join(OUT, 'fixture-tight.png') })
await arm(880, 748)
await page.screenshot({ path: path.join(OUT, 'fixture-roomy.png') })
writeFileSync(path.join(OUT, 'fixture.json'), JSON.stringify({ rows, failures }, null, 2), 'utf8')
await browser.close()

console.log('arm                        | scrollW | padR | contentBox | columnW | cqw | free | pub | attr | display | navRight | gap')
for (const r of rows) {
  console.log([
    String(r.arm).padEnd(26),
    String(r.scrollW).padStart(7),
    String(r.padR).padStart(4),
    String(r.contentBox).padStart(10),
    String(r.columnW).padStart(7),
    String(r.containerWidth).padStart(3),
    String(r.free).padStart(4),
    String(r.publishedFree).padStart(3),
    String(r.attr).padStart(4),
    String(r.navDisplay).padStart(7),
    String(r.navRect === null ? '-' : r.navRect.right).padStart(8),
    String(r.gapToColumn).padStart(5),
  ].join(' | '))
}
console.log(`\n${failures.length === 0 ? 'PASS' : 'FAIL'} — ${failures.length} failure(s)`)
for (const f of failures) console.log('  ' + f)
process.exit(failures.length === 0 ? 0 : 1)
