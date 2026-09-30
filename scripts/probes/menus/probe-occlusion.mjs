/**
 * Occlusion probe for `button[data-update-available]` (report 2026-09-16).
 *
 * Dumps the button's ancestor chain and the topmost element at its centre with
 * the same geometry, plus which stylesheet rules give the blocker its position,
 * so "who covers it and why" is answered by measurement instead of reading.
 *
 * Run: node scripts/probes/menus/probe-occlusion.mjs [url] [outfile]
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
const OUT = process.argv[3] ?? 'D:/dsh-home/probe-ui/occlusion-probe.json'

function collect() {
  const desc = el => {
    if (el === null) return null
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      tag: el.tagName.toLowerCase(),
      cls: String(el.className).slice(0, 60),
      slot: el.getAttribute('data-slot'),
      pos: cs.position, z: cs.zIndex, display: cs.display, overflow: cs.overflow,
      transform: cs.transform === 'none' ? null : cs.transform.slice(0, 40),
      filter: cs.filter === 'none' ? null : cs.filter,
      isolation: cs.isolation === 'auto' ? null : cs.isolation,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    }
  }
  const chain = el => {
    const out = []
    for (let n = el; n !== null && n !== document.documentElement; n = n.parentElement) out.push(desc(n))
    return out
  }

  const btn = document.querySelector('button[data-update-available]')
  if (btn === null) return { found: false }
  const r = btn.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  const top = document.elementFromPoint(cx, cy)
  const btnCs = getComputedStyle(btn)

  // Which rules set position/inset/z-index on the blocker (author stylesheets only).
  const hits = []
  const probeProps = ['position', 'z-index', 'inset', 'top', 'bottom', 'left', 'right', 'transform', 'isolation', 'pointer-events', 'display', 'height', 'max-height', 'background-color']
  const seen = new Set()
  const walk = (el, tag) => {
    if (el === null) return
    for (const sheet of document.styleSheets) {
      let rules = null
      try { rules = sheet.cssRules } catch { continue }
      if (rules === null) continue
      const visit = (list) => {
        for (const rule of list) {
          if (rule.cssRules !== undefined) { visit(rule.cssRules); continue }
          if (rule.selectorText === undefined) continue
          let matched = false
          try { matched = el.matches(rule.selectorText) } catch { continue }
          if (!matched) continue
          const key = tag + '|' + rule.selectorText
          if (seen.has(key)) continue
          seen.add(key)
          const decl = []
          for (const p of probeProps) {
            const v = rule.style.getPropertyValue(p)
            if (v !== '') decl.push(`${p}:${v}`)
          }
          if (decl.length > 0) hits.push({ for: tag, selector: rule.selectorText.slice(0, 110), decl: decl.join('; '), href: (sheet.href ?? '').split('/').pop() || '(inline)' })
        }
      }
      visit(rules)
    }
  }
  walk(top, 'blocker')
  walk(btn, 'button')

  return {
    found: true,
    button: { ...desc(btn), text: (btn.textContent ?? '').trim().slice(0, 20), pointerEvents: btnCs.pointerEvents, visibility: btnCs.visibility, opacity: btnCs.opacity },
    buttonChain: chain(btn.parentElement),
    blocker: desc(top),
    blockerChain: chain(top),
    ruleHits: hits.slice(0, 60),
    closestSlot: (() => { const s = btn.closest('[data-slot]'); return s === null ? null : s.getAttribute('data-slot') })(),
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
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(3500)

const result = { url: URL_ARG, authority, ...(await page.evaluate(collect)) }
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8')

const line = (...a) => console.log(...a)
line(`url=${URL_ARG} slot=${result.closestSlot} found=${result.found}`)
line('=== button ===')
line('  ' + JSON.stringify(result.button))
line('=== button ancestors ===')
for (const a of result.buttonChain ?? []) line('  ' + JSON.stringify(a))
line('=== blocker (topmost at button centre) ===')
line('  ' + JSON.stringify(result.blocker))
line('=== blocker ancestors ===')
for (const a of result.blockerChain ?? []) line('  ' + JSON.stringify(a))
line('=== matching rules ===')
for (const h of result.ruleHits ?? []) line(`  [${h.for}] ${h.selector}  =>  ${h.decl}   <${h.href}>`)
line('written: ' + OUT)
await context.close()
