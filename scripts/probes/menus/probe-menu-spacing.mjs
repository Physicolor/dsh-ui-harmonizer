/**
 * Menu-spacing / occlusion probe for the 2026-09-16 regression report.
 *
 * Answers three things with measurements from the LIVE page:
 *   1. What does `--enhancer-chat-scale` actually compute to, and does
 *      `calc(8px * var(--enhancer-chat-scale, 1))` survive (the suspect:
 *      `calc(14px / 14)` is a LENGTH `1px`, and length × length is invalid at
 *      computed-value time, which zeroes every padding/gap it touches).
 *   2. Which candidate replacement expression actually yields a unitless
 *      number in this browser (`padding: calc(8px * <candidate>)` → 8px).
 *   3. Is the update button (`button[data-update-available]`) hit-testable at
 *      its own centre — and if not, which element sits on top of it.
 *
 * Run: node scripts/probes/menus/probe-menu-spacing.mjs [url] [outfile]
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
const OUT = process.argv[3] ?? 'D:/dsh-home/probe-ui/menu-spacing-probe.json'

/** Everything measured in-page; must be self-contained (it is serialized). */
function collect() {
  const html = document.documentElement
  const body = document.body
  const htmlCs = getComputedStyle(html)
  const bodyCs = getComputedStyle(body)

  const vars = {
    contentFontSize: bodyCs.getPropertyValue('--dsh-content-font-size').trim(),
    contentFontDelta: bodyCs.getPropertyValue('--dsh-content-font-delta').trim(),
    chatScaleOnBody: bodyCs.getPropertyValue('--enhancer-chat-scale').trim(),
    chatScaleOnHtml: htmlCs.getPropertyValue('--enhancer-chat-scale').trim(),
    sidebarScale: htmlCs.getPropertyValue('--enhancer-sidebar-scale').trim(),
  }

  // Probe element inheriting the live variables from <body>.
  const probe = document.createElement('div')
  probe.style.position = 'fixed'
  probe.style.left = '-9999px'
  const read = (prop, value) => {
    probe.style.cssText = `position:fixed;left:-9999px;${prop}:${value}`
    body.appendChild(probe)
    const computed = getComputedStyle(probe).getPropertyValue(prop).trim()
    probe.remove()
    return computed
  }

  const candidates = {
    current: 'calc(var(--dsh-content-font-size, 14px) / 14)',
    divByLength: 'calc(var(--dsh-content-font-size, 14px) / 14px)',
    deltaRatio: 'calc(1 + var(--dsh-content-font-delta, 0px) / 14px)',
    tanAtan2: 'tan(atan2(var(--dsh-content-font-size, 14px), 14px))',
    literal1: '1',
  }
  const scaleChecks = {}
  for (const [name, expr] of Object.entries(candidates)) {
    const resolved = read('--probe-scale', expr)
    // The real test: can 8px be multiplied by it?
    const px = read('padding', `calc(8px * ${expr})`)
    scaleChecks[name] = { expr, resolved: resolved || '(empty)', times8px: px || '(empty)' }
  }
  scaleChecks['bare current var'] = {
    expr: 'var(--enhancer-chat-scale, 1)',
    resolved: vars.chatScaleOnBody || '(empty)',
    times8px: read('padding', 'calc(8px * var(--enhancer-chat-scale, 1))') || '(empty)',
  }
  scaleChecks['literal 1px (the suspect value)'] = {
    expr: '1px',
    resolved: '1px',
    times8px: read('padding', 'calc(8px * 1px)') || '(empty)',
  }

  /** Rendered metrics of every menu item currently in the DOM. */
  const menuMetrics = () => [...document.querySelectorAll("[role='menu'] [class^='_item_']")].slice(0, 6).map(el => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      cls: String(el.className).slice(0, 44),
      text: (el.textContent ?? '').trim().slice(0, 18),
      padding: cs.padding,
      gap: cs.gap,
      minHeight: cs.minHeight,
      height: Math.round(r.height * 10) / 10,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      radius: cs.borderRadius,
    }
  })
  const menuList = () => {
    const list = document.querySelector("[role='menu'] [class^='_list_']")
    if (list === null) return null
    const cs = getComputedStyle(list)
    return { padding: cs.padding, minWidth: cs.minWidth, maxWidth: cs.maxWidth, radius: cs.borderRadius, height: Math.round(list.getBoundingClientRect().height) }
  }

  // ---- update button occlusion -------------------------------------------
  const updateBtn = document.querySelector('button[data-update-available]')
  let update = { found: updateBtn !== null }
  if (updateBtn !== null) {
    const r = updateBtn.getBoundingClientRect()
    const points = []
    const hit = (x, y) => {
      const top = document.elementFromPoint(x, y)
      return {
        x: Math.round(x), y: Math.round(y),
        hit: top === null ? null : `${top.tagName.toLowerCase()}.${String(top.className).slice(0, 40)}`,
        inside: top !== null && (top === updateBtn || updateBtn.contains(top) || top.contains(updateBtn)),
      }
    }
    // 5x3 grid across the button, plus its exact centre.
    for (let i = 0; i <= 4; i++) {
      for (let j = 0; j <= 2; j++) points.push(hit(r.left + (r.width * i) / 4, r.top + (r.height * j) / 2))
    }
    const blockers = {}
    for (const p of points) if (!p.inside) blockers[p.hit] = (blockers[p.hit] ?? 0) + 1
    const cs = getComputedStyle(updateBtn)
    update = {
      found: true,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      visible: r.width > 0 && r.height > 0,
      zIndex: cs.zIndex, position: cs.position,
      points: points.length,
      blockedPoints: points.filter(p => !p.inside).length,
      blockers,
      samples: points.filter(p => !p.inside).slice(0, 6),
      centre: (() => {
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        return top === null ? null : `${top.tagName.toLowerCase()}.${String(top.className).slice(0, 60)}`
      })(),
    }
  }

  // Anything else overlapping the update button's rect (top-layer / fixed).
  const overlaps = updateBtn === null ? [] : [...document.querySelectorAll('body *')].filter(el => {
    if (el === updateBtn || el.contains(updateBtn) || updateBtn.contains(el)) return false
    const cs = getComputedStyle(el)
    if (cs.position !== 'fixed' && cs.position !== 'absolute') return false
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return false
    const r = el.getBoundingClientRect()
    const u = updateBtn.getBoundingClientRect()
    const overlap = Math.max(0, Math.min(r.right, u.right) - Math.max(r.left, u.left)) * Math.max(0, Math.min(r.bottom, u.bottom) - Math.max(r.top, u.top))
    if (overlap < 1) return false
    return { cls: `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 46)}`, z: cs.zIndex, position: cs.position, area: Math.round(overlap), pointerEvents: cs.pointerEvents }
  }).slice(0, 10)

  return { vars, scaleChecks, update, overlaps, url: location.href }
}

const chromePath = CHROME_CANDIDATES.find(p => existsSync(p))
if (chromePath === undefined) { console.error('no chromium binary found'); process.exit(2) }

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  executablePath: chromePath,
  headless: true,
  viewport: { width: 1440, height: 900 },
})
const { authority, cookie } = authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ARG, days: 1 })
await context.addCookies([cookie])

const page = await context.newPage()
const errors = []
page.on('pageerror', e => errors.push('pageerror: ' + e.message))

await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(3500)

const hero = await page.evaluate(collect)

// ---- open the hero workspace menu ---------------------------------------
let heroMenu = { opened: false }
const workspaceBtn = page.locator("[class*='_workspace']").first()
try {
  await workspaceBtn.click({ timeout: 8000 })
  await page.waitForTimeout(900)
  heroMenu = await page.evaluate(() => {
    const items = [...document.querySelectorAll("[role='menu'] [class^='_item_']")].slice(0, 6).map(el => {
      const cs = getComputedStyle(el)
      return {
        text: (el.textContent ?? '').trim().slice(0, 18),
        padding: cs.padding, gap: cs.gap, minHeight: cs.minHeight,
        height: Math.round(el.getBoundingClientRect().height * 10) / 10,
        fontSize: cs.fontSize, lineHeight: cs.lineHeight,
      }
    })
    const list = document.querySelector("[role='menu'] [class^='_list_']")
    const listCs = list === null ? null : getComputedStyle(list)
    return {
      opened: document.querySelector("[role='menu']") !== null,
      itemCount: document.querySelectorAll("[role='menu'] [class^='_item_']").length,
      items,
      list: listCs === null ? null : { padding: listCs.padding, minWidth: listCs.minWidth, radius: listCs.borderRadius, height: Math.round(list.getBoundingClientRect().height) },
    }
  })
} catch (e) {
  heroMenu = { opened: false, error: String(e).slice(0, 160) }
}
await page.keyboard.press('Escape').catch(() => null)
await page.waitForTimeout(300)

const result = {
  url: URL_ARG,
  authority,
  cookieName: cookie.name,
  hero,
  heroMenu,
  errors: errors.slice(0, 10),
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8')

const line = (...a) => console.log(...a)
line(`url=${URL_ARG} authority=${authority}`)
line('=== variables ===')
for (const [k, v] of Object.entries(hero.vars)) line(`  ${k} = ${JSON.stringify(v)}`)
line('=== scale candidates (padding: calc(8px * X) must resolve to 8px) ===')
for (const [k, v] of Object.entries(hero.scaleChecks)) {
  line(`  ${k.padEnd(26)} resolved=${JSON.stringify(v.resolved).padEnd(12)} calc(8px*X)=${JSON.stringify(v.times8px)}`)
}
line('=== update button ===')
line('  ' + JSON.stringify(hero.update, null, 2).split('\n').join('\n  '))
line('=== overlapping positioned elements ===')
for (const o of hero.overlaps) line('  ' + JSON.stringify(o))
line('=== hero workspace menu ===')
line('  ' + JSON.stringify(heroMenu, null, 2).split('\n').join('\n  '))
line(`=== page errors: ${errors.length} ===`)
for (const e of errors.slice(0, 5)) line('  ' + e)
line('written: ' + OUT)

await context.close()
