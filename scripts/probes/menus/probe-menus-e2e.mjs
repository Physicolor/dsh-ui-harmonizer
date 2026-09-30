/**
 * End-to-end menu probe: opens the REAL menus the 2026-09-16 report names and
 * measures their rows, then asks Chromium which rule produced the box.
 *
 * The synthetic fixture in probe-fix-verify proves the rule's arithmetic; this
 * proves the same arithmetic reaches the product's own Menu component:
 *   - the composer's permission picker (`aria-haspopup="menu"`),
 *   - the sidebar conversation menu (重命名 / 分叉对话 / 归档对话),
 *   - the hero workspace picker when the page happens to be on the hero.
 *
 * Run: node scripts/probes/menus/probe-menus-e2e.mjs [url] [outfile]
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
const OUT = process.argv[3] ?? 'D:/dsh-home/probe-ui/menus-e2e-probe.json'

/** Metrics of whatever `[role='menu']` is currently open. */
const MENU_SNAPSHOT = () => {
  const menu = document.querySelector("[role='menu']")
  if (menu === null) return { open: false }
  const items = [...menu.querySelectorAll("[class^='_item_'], [role='menuitem']")].slice(0, 8).map(el => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      cls: String(el.className).slice(0, 34),
      text: (el.textContent ?? '').trim().slice(0, 16),
      padding: cs.padding, gap: cs.gap, minHeight: cs.minHeight,
      height: Math.round(r.height * 10) / 10, fontSize: cs.fontSize, radius: cs.borderRadius,
    }
  })
  const list = menu.querySelector("[class^='_list_']")
  const listCs = list === null ? null : getComputedStyle(list)
  return {
    open: true,
    listClass: list === null ? null : String(list.className).slice(0, 30),
    list: listCs === null ? null : { padding: listCs.padding, minWidth: listCs.minWidth, radius: listCs.borderRadius },
    itemCount: items.length,
    items,
  }
}

const chromePath = CHROME_CANDIDATES.find(p => existsSync(p))
if (chromePath === undefined) { console.error('no chromium binary found'); process.exit(2) }

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  executablePath: chromePath, headless: true, viewport: { width: 1440, height: 900 },
})
const { authority, cookie } = authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ARG, days: 1 })
await context.addCookies([cookie])

const page = await context.newPage()
const cdp = await context.newCDPSession(page)
await cdp.send('Network.enable')
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
await cdp.send('DOM.enable')
await cdp.send('CSS.enable')

await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(3500)

const onHero = await page.evaluate(() => document.querySelector("[class*='heroWorkspaceRow']") !== null)

/** Open one candidate trigger, snapshot, close. */
const tryTrigger = async (label, selector, pick) => {
  const handles = await page.$$(selector)
  const order = pick === 'last' ? [...handles].reverse() : pick === 'all' ? handles : handles
  const collected = []
  for (let i = 0; i < order.length; i++) {
    try {
      await order[i].click({ timeout: 4000 })
      await page.waitForTimeout(700)
      const snap = await page.evaluate(MENU_SNAPSHOT)
      if (snap.open) {
        const label2 = await order[i].evaluate(el => (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 24))
        const rule = await matchedRuleForFirstItem(cdp)
        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)
        collected.push({ triggerText: label2, ...snap, rule })
        if (pick !== 'all') return { label, ...collected[0] }
      } else {
        await page.keyboard.press('Escape')
      }
    } catch { /* try the next candidate */ }
  }
  return collected.length > 0 ? { label, open: true, opened: collected } : { label, open: false }
}

/** Which rule set the item's box — Chromium's cascade, not our guess. */
async function matchedRuleForFirstItem(cdpSession) {
  const { root } = await cdpSession.send('DOM.getDocument', { depth: -1 })
  const { nodeId } = await cdpSession.send('DOM.querySelector', { nodeId: root.nodeId, selector: "[role='menu'] [class^='_item_']" })
  if (nodeId === 0) return null
  const res = await cdpSession.send('CSS.getMatchedStylesForNode', { nodeId })
  const props = ['padding', 'gap', 'min-height', 'font-size', 'line-height', 'border-radius']
  return (res.matchedCSSRules ?? []).map(m => {
    const decl = props.map(p => { const v = m.rule.style.cssProperties.find(x => x.name === p); return v === undefined ? null : `${p}:${v.value}` }).filter(Boolean)
    return decl.length === 0 ? null : { selector: m.rule.selectorList.text.slice(0, 90), decl: decl.join('; ') }
  }).filter(Boolean)
}

const menus = []
menus.push(await tryTrigger('composer: every menu trigger', "[data-slot='conversation.composer.bar'] [aria-haspopup='menu']", 'all'))
// The report's "权限选择器": the composer's access-mode chip. It carries no
// aria-haspopup, so it needs its own pass — measured, not assumed.
menus.push(await tryTrigger('composer access-mode (permission) picker', "[data-slot='conversation.composer.bar'] button[aria-label^='访问模式']", 'all'))
menus.push(await tryTrigger('sidebar conversation menu', "[data-slot='sidebar.workspaces'] [aria-haspopup='menu'], [data-slot='sidebar'] [aria-haspopup='menu']", 'all'))
menus.push(await tryTrigger('session header menu', "[data-slot='conversation.session.header'] [aria-haspopup='menu']", 'first'))

// The report's screenshots come from the HERO (new-session) screen, so open one
// and repeat there: the workspace picker plus an occlusion sweep over it.
let heroOpened = false
try {
  await page.click("[data-slot='sidebar'] [class*='_newSession']", { timeout: 6000 })
  await page.waitForTimeout(2500)
  heroOpened = await page.evaluate(() => document.querySelector("[class*='heroWorkspaceRow']") !== null)
} catch { /* the run stays on the session view */ }
if (heroOpened) {
  menus.push(await tryTrigger('hero workspace picker', "[class*='heroWorkspaceRow'] button", 'first'))
  menus.push(await tryTrigger('hero permission picker', "[data-slot='conversation.composer.bar'] [aria-haspopup='menu']", 'first'))
}

/** Interactive elements whose own box never receives the hit test. */
const heroObscured = heroOpened ? await page.evaluate(() => {
  const out = []
  for (const el of document.querySelectorAll('button, a[href], input, [role="button"], [role="menuitem"]')) {
    const r = el.getBoundingClientRect()
    if (r.width < 6 || r.height < 6) continue
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue
    if (getComputedStyle(el).pointerEvents === 'none') continue
    let own = 0
    const tops = new Set()
    for (const fx of [0.15, 0.5, 0.85]) for (const fy of [0.3, 0.7]) {
      const top = document.elementFromPoint(r.left + r.width * fx, r.top + r.height * fy)
      if (top === null) continue
      if (top === el || el.contains(top)) own++
      else tops.add(`${top.tagName.toLowerCase()}.${String(top.className).slice(0, 34)}`)
    }
    if (own === 0 && tops.size > 0) out.push({ cls: String(el.className).slice(0, 34), text: (el.textContent ?? '').trim().slice(0, 14), rect: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`, by: [...tops].slice(0, 3) })
  }
  return out
}) : null

const result = { url: URL_ARG, authority, onHero, heroOpened, heroObscured, menus, generatedAt: new Date().toISOString() }
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8')

const line = (...a) => console.log(...a)
line(`url=${URL_ARG} authority=${authority} onHero=${onHero} heroOpened=${heroOpened}`)
for (const m of menus) {
  line(`=== ${m.label} ===`)
  if (!m.open) { line('  (no menu opened)'); continue }
  const opened = m.opened ?? [m]
  for (const o of opened) {
    line(`  trigger="${o.triggerText}" list=${JSON.stringify(o.list)} items=${o.itemCount}`)
    for (const it of o.items) line(`    "${it.text}" pad=${it.padding} gap=${it.gap} minH=${it.minHeight} h=${it.height} font=${it.fontSize} radius=${it.radius}`)
    for (const r of o.rule ?? []) line(`    rule: ${r.selector} => ${r.decl}`)
  }
}
if (heroObscured !== null) {
  line(`=== hero occlusion sweep: ${heroObscured.length} covered ===`)
  for (const o of heroObscured) line(`    ${o.cls} "${o.text}" ${o.rect} by=${o.by.join(' | ')}`)
}
line('written: ' + OUT)
await context.close()
