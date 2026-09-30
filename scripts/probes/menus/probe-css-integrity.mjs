/**
 * CSS-integrity probe: proves or disproves that OUR stylesheet is what breaks
 * downstream surfaces, with a synthetic fixture instead of a live menu.
 *
 * Fixture (mirrors the product's Menu DOM): `[role='menu'] > [class^='_list_']
 * > [class^='_item_']`. Our rules for those selectors carry `calc(Npx *
 * var(--enhancer-chat-scale))`; if that variable is a LENGTH, every declaration
 * using it is invalid at computed-value time and falls back to the initial
 * value (padding 0 / gap normal / min-height auto). The fixture therefore reads
 * "0px" when broken and "8px 10px" when correct, with no menu to open.
 *
 * It also dumps the sidebar footer geometry (the `button[data-update-available]`
 * occlusion report) and which rules position those nodes.
 *
 * Run: node scripts/probes/menus/probe-css-integrity.mjs [url] [outfile]
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
const OUT = process.argv[3] ?? 'D:/dsh-home/probe-ui/css-integrity-probe.json'

function collect() {
  const cs = el => getComputedStyle(el)
  const box = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } }
  const desc = el => el === null ? null : {
    tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 50), slot: el.getAttribute('data-slot'),
    rect: box(el), pos: cs(el).position, z: cs(el).zIndex, display: cs(el).display,
  }

  // ---- synthetic Menu fixture -------------------------------------------
  const fixture = document.createElement('div')
  fixture.setAttribute('role', 'menu')
  fixture.style.cssText = 'position:fixed;left:-9999px;top:0'
  fixture.innerHTML = '<div class="_list_probe"><div class="_item_probe"><span class="_label_probe">x</span></div></div>'
  document.body.appendChild(fixture)
  const item = fixture.querySelector('._item_probe')
  const list = fixture.querySelector('._list_probe')
  const label = fixture.querySelector('._label_probe')
  const itemCs = cs(item)
  const menu = {
    item: { padding: itemCs.padding, gap: itemCs.gap, minHeight: itemCs.minHeight, fontSize: itemCs.fontSize, lineHeight: itemCs.lineHeight, radius: itemCs.borderRadius },
    list: { padding: cs(list).padding, minWidth: cs(list).minWidth, maxWidth: cs(list).maxWidth, radius: cs(list).borderRadius },
    label: { fontSize: cs(label).fontSize, lineHeight: cs(label).lineHeight, padding: cs(label).padding },
  }
  fixture.remove()

  // ---- sidebar footer geometry ------------------------------------------
  const footerSlot = document.querySelector("[data-slot='sidebar.footer.action']")
  const footerRow = document.querySelector("[class$='_footerActions']")
  const updateBtn = document.querySelector('button[data-update-available]')
  const sidebarCol = document.querySelector("[class$='_sidebarCol']")
  const footer = {
    slot: desc(footerSlot),
    row: footerRow === null ? null : {
      ...desc(footerRow),
      flexDirection: cs(footerRow).flexDirection, flexWrap: cs(footerRow).flexWrap,
      justifyContent: cs(footerRow).justifyContent, alignItems: cs(footerRow).alignItems,
      gap: cs(footerRow).gap, padding: cs(footerRow).padding, overflow: cs(footerRow).overflow,
      children: [...footerRow.children].map(c => ({ ...desc(c), flex: cs(c).flex, width: cs(c).width, minWidth: cs(c).minWidth })),
    },
    sidebar: sidebarCol === null ? null : { ...desc(sidebarCol), overflow: cs(sidebarCol).overflow },
    update: updateBtn === null ? null : {
      ...desc(updateBtn),
      text: (updateBtn.textContent ?? '').trim().slice(0, 16),
      outsideSidebar: sidebarCol === null ? null : Math.round(updateBtn.getBoundingClientRect().right - sidebarCol.getBoundingClientRect().right),
      hitAtCentre: (() => {
        const r = updateBtn.getBoundingClientRect()
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        return top === null ? null : `${top.tagName.toLowerCase()}.${String(top.className).slice(0, 40)}`
      })(),
      hitAtVisibleEdge: (() => {
        const r = updateBtn.getBoundingClientRect()
        const top = document.elementFromPoint(r.left + 4, r.top + r.height / 2)
        return top === null ? null : `${top.tagName.toLowerCase()}.${String(top.className).slice(0, 40)}`
      })(),
    },
  }

  // ---- which rules style the footer row / the update entry --------------
  const probeProps = ['display', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'gap', 'padding', 'width', 'flex', 'position', 'z-index', 'overflow']
  const ruleHits = []
  const walk = (el, tag) => {
    if (el === null) return
    for (const sheet of document.styleSheets) {
      let rules = null
      try { rules = sheet.cssRules } catch { continue }
      if (rules === null) continue
      const visit = list => {
        for (const rule of list) {
          if (rule.cssRules !== undefined) { visit(rule.cssRules); continue }
          if (rule.selectorText === undefined) continue
          let ok = false
          try { ok = el.matches(rule.selectorText) } catch { continue }
          if (!ok) continue
          const decl = probeProps.map(p => { const v = rule.style.getPropertyValue(p); return v === '' ? null : `${p}:${v}` }).filter(Boolean)
          if (decl.length > 0) ruleHits.push({ for: tag, selector: rule.selectorText.slice(0, 100), decl: decl.join('; '), owner: (sheet.href ?? '').split('/').pop() || '(inline)' })
        }
      }
      visit(rules)
    }
  }
  walk(footerRow, 'footerRow')
  walk(updateBtn, 'update')

  return { menu, footer, ruleHits: ruleHits.slice(0, 40), pageState: { chatScale: cs(document.body).getPropertyValue('--enhancer-chat-scale').trim(), contentFontSize: cs(document.body).getPropertyValue('--dsh-content-font-size').trim() } }
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

const withCss = await page.evaluate(collect)

// Same measurement with OUR stylesheet removed: isolates CSS from JS and from
// any product-side difference.
const withoutCss = await page.evaluate(() => {
  const tags = [...document.querySelectorAll('style')].filter(t => (t.textContent ?? '').includes('--enhancer-chat-scale'))
  for (const t of tags) t.remove()
  return tags.length
})
const afterRemoval = await page.evaluate(collect)

const result = { url: URL_ARG, authority, withCss, removedStyleTags: withoutCss, afterRemoval }
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8')

const line = (...a) => console.log(...a)
line(`url=${URL_ARG} authority=${authority} removedOurStyleTags=${withoutCss}`)
line(`state: ${JSON.stringify(withCss.pageState)}`)
line('=== synthetic menu fixture (role=menu > _list_ > _item_) ===')
line('  WITH our CSS   : ' + JSON.stringify(withCss.menu))
line('  WITHOUT our CSS: ' + JSON.stringify(afterRemoval.menu))
line('=== sidebar footer ===')
line('  WITH our CSS   : ' + JSON.stringify(withCss.footer, null, 2).split('\n').join('\n  '))
line('=== rules styling the footer row / update entry ===')
for (const h of withCss.ruleHits) line(`  [${h.for}] ${h.selector} => ${h.decl}`)
line('written: ' + OUT)
await context.close()
