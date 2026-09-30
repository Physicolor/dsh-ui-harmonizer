/**
 * Harmony Probe — rendered-level audit of dsh-ui-harmonizer on a LIVE page.
 *
 * Answers with measurements, not reasoning:
 *   1. Which stylesheet actually wins `--dsw-font-markdown-*` (ours vs the
 *      official theme's) and does the selected font preset reach the pixels?
 *   2. Is the picked family even installed on this machine?
 *   3. Is `html.enhc-panel-open` permanently stuck (the panelOpen bug)?
 *   4. How many of our own CSS rules match zero elements (dead-rule inventory).
 *
 * It authenticates with a cookie minted from the persisted browser-session
 * secret (see lib/auth.mjs) so it never needs the one-time launch URL and
 * never restarts or disturbs the user's instance.
 *
 * Run: node scripts/probes/plugin-eco/probe-harmony.mjs [url] [outfile]
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
const OUT = process.argv[3] ?? 'D:/dsh-home/probe-ui/harmony-probe.json'

/** Font passes the probe exercises: id + scope; `current` keeps what is stored. */
const FONT_PASSES = [
  { fontId: 'current', fontScope: null },
  { fontId: 'serif', fontScope: 'content' },
  { fontId: 'yahei', fontScope: 'ui' },
  { fontId: 'mono', fontScope: 'content' },
  { fontId: 'default', fontScope: 'content' },
]

/** Everything measured inside the page. Must be self-contained (serialized). */
function collect() {
  const rootCs = getComputedStyle(document.documentElement)
  const bodyCs = getComputedStyle(document.body)

  const styleTags = [...document.head.querySelectorAll('style')].map((t, i) => {
    const text = t.textContent ?? ''
    return {
      order: i,
      plugin: t.dataset.plugin ?? null,
      pluginCss: t.dataset.pluginCss ?? null,
      dynamic: t.dataset.enhancerDynamic ?? null,
      bytes: text.length,
      definesMarkdownBase: /--dsw-font-markdown-base\s*:/.test(text),
      definesFontFamily: /--dsw-font-family\s*:/.test(text),
      definesContentFontSize: /--dsh-content-font-size\s*:/.test(text),
    }
  })

  // Synthetic probes: elements that consume the very tokens the product uses,
  // so the token -> pixel chain is measured even in an empty session. They are
  // left in the DOM (off-screen, opacity 0 so they still get text runs) because
  // CDP reads their *resolved* platform font afterwards.
  for (const old of document.querySelectorAll('[data-harmony-probe]')) old.remove()
  const host = document.createElement('div')
  host.setAttribute('data-harmony-probe', '1')
  host.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none'
  const mk = (css) => { const el = document.createElement('span'); el.style.cssText = css; el.textContent = '汉字漢字abcXYZ0123'; host.appendChild(el); return el }
  const proseEl = mk('font: var(--dsw-font-markdown-base)')
  const codeEl = mk('font: var(--dsw-font-markdown-code-block)')
  const uiEl = mk('font-family: var(--dsw-font-family)')
  document.body.appendChild(host)
  const m = (el) => ({ font: getComputedStyle(el).font, fontFamily: getComputedStyle(el).fontFamily, fontSize: getComputedStyle(el).fontSize })

  // Real elements, when a conversation happens to be on screen.
  const real = (sel) => { const el = document.querySelector(sel); return el === null ? null : m(el) }

  let enhancerState = null
  try { enhancerState = JSON.parse(localStorage.getItem('harness-ui-enhancer.state') ?? 'null') } catch (e) { enhancerState = 'parse-error:' + String(e) }

  const out = {
    at: new Date().toISOString(),
    url: location.href,
    contract: {
      version: rootCs.getPropertyValue('--enhc-contract').trim(),
      glassAware: rootCs.getPropertyValue('--enhc-glass-aware').trim(),
      surfaceSolid: rootCs.getPropertyValue('--enhc-surface-solid').trim(),
      solidFill: rootCs.getPropertyValue('--enhc-solid-fill').trim(),
      contentWidth: rootCs.getPropertyValue('--enhc-content-width').trim(),
    },
    enhancerState,
    styleTags,
    markdownDeclarers: styleTags.filter(t => t.definesMarkdownBase).map(t => t.order),
    computed: {
      root: { markdownBase: rootCs.getPropertyValue('--dsw-font-markdown-base').trim(), fontFamily: rootCs.getPropertyValue('--dsw-font-family').trim(), contentFontSize: rootCs.getPropertyValue('--dsh-content-font-size').trim() },
      body: { markdownBase: bodyCs.getPropertyValue('--dsw-font-markdown-base').trim(), fontFamily: bodyCs.getPropertyValue('--dsw-font-family').trim(), contentFontSize: bodyCs.getPropertyValue('--dsh-content-font-size').trim() },
      inlineBody: document.body.getAttribute('style'),
    },
    synthetic: { prose: m(proseEl), codeBlock: m(codeEl), ui: m(uiEl) },
    rendered: {
      markdownRoot: real('[class*="markdown"]'),
      markdownP: real('[class*="markdown"] p'),
      userBubble: real("[data-slot='conversation.session'] [class$='_bubble']"),
      composer: real('[data-input-scroll]'),
      // Material probe: the header is the surface that used to paint an
      // unblurred opaque rectangle over a glass theme.
      headerBackground: (() => {
        const header = document.querySelector("[data-slot='conversation.session.header'] > header")
        return header === null ? null : getComputedStyle(header).backgroundColor
      })(),
      baseToken: getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim(),
    },
    sidebarInventory: [...document.querySelectorAll("[data-slot='sidebar.workspaces'] *")]
      .filter(el => el.children.length <= 2 && (el.textContent ?? '').trim() !== '')
      .slice(0, 24)
      .map(el => ({
        tag: el.tagName,
        cls: String(el.className).slice(0, 44),
        text: (el.textContent ?? '').trim().slice(0, 28),
        w: Math.round(el.getBoundingClientRect().width),
        role: el.getAttribute('role') ?? '',
      })),
    shell: {
      hasConversationSlot: document.querySelector("[data-slot='main.conversation'], [data-slot='conversation']") !== null,
      tabsInTitleCluster: document.querySelector("[class$='_titleCluster'] > [class$='_tabs']") !== null,
      tabsAnywhere: document.querySelector("[data-slot='conversation.session.header'] [class$='_tabs']") !== null,
      settingsSectionPresent: document.querySelector("[data-slot='settings.section']") !== null,
    },
    panel: (() => {
      const count = (sel) => document.querySelectorAll(sel).length
      return {
        enhcPanelOpen: document.documentElement.classList.contains('enhc-panel-open'),
        centerCardOn: document.documentElement.classList.contains('enhc-center-card-on'),
        panelNodes: count('.nArs4W_panel'),
        bottomPanelNodes: count('.nArs4W_bottomPanel'),
        toggleButtons: count('.nArs4W_toggleButton'),
        toggleCluster: count("[class$='_toggleCluster']"),
        panelResize: count('.nArs4W_panelResize'),
        panelHidden: count('.nArs4W_panelHidden'),
        bottomToggle: count('[data-dsh-bottom-toggle]'),
        panelVisibility: [...document.querySelectorAll('.nArs4W_panel, .nArs4W_bottomPanel')].map(el => ({ cls: String(el.className).slice(0, 60), display: getComputedStyle(el).display, hidden: el.hasAttribute('hidden') })),
        ariaPressed: [...document.querySelectorAll('.nArs4W_toggleButton')].map(b => b.getAttribute('aria-pressed')),
        ownerVars: {
          sidebarWidth: rootCs.getPropertyValue('--dsh-sidebar-width').trim(),
          titleBarStrip: rootCs.getPropertyValue('--dsh-title-bar-strip').trim(),
          sidebarHeight: rootCs.getPropertyValue('--dsh-sidebar-height').trim(),
        },
        betterSidebarAttrs: ['data-dsh-sidebar-collapsed', 'data-dsh-panel-host'].map(a => ({ attr: a, anywhere: count('[' + a + ']'), onBody: document.body.hasAttribute(a) })),
      }
    })(),
  }

  // Dead-rule inventory over our own injected stylesheets.
  const isOurs = (node) => {
    if (!node || node.nodeType !== 1) return false
    const attrs = [...node.attributes].map(a => `${a.name}=${a.value}`).join(' ')
    return /harmonizer|harness-ui-enhancer/i.test(attrs)
  }
  // Sheets live either in <style> tags or in adoptedStyleSheets; ours are the
  // ones whose owner marker mentions the plugin (a CSS module tag id, or the
  // rule text itself when adopted without an owner node).
  const sheetLists = []
  for (const s of document.styleSheets) { try { if (isOurs(s.ownerNode)) sheetLists.push({ owner: s.ownerNode?.dataset?.pluginCss ?? s.ownerNode?.dataset?.plugin ?? null, sheet: s }) } catch { /* ignore */ } }
  for (const s of document.adoptedStyleSheets ?? []) {
    let ours = false
    try { ours = [...s.cssRules].some(r => (r.cssText ?? '').includes('--enhancer-content-width') || (r.cssText ?? '').includes('.enhc-')) } catch { /* ignore */ }
    if (ours) sheetLists.push({ owner: 'adoptedStyleSheet', sheet: s })
  }

  const dead = []
  const matched = []
  let total = 0
  const walk = (rules, media) => {
    for (const r of rules) {
      // A style rule may also expose nested `cssRules` (CSS nesting), so the
      // selector test must come FIRST or every rule is skipped as a container.
      if (r.selectorText !== undefined) {
        for (const sel of r.selectorText.split(',').map(s => s.trim()).filter(Boolean)) {
          total++
          let n = 0
          try { n = document.querySelectorAll(sel).length } catch { n = -1 }
          if (n === 0) dead.push({ sel: sel.slice(0, 140), media: media ?? null })
          else matched.push(sel.slice(0, 140))
        }
      }
      if (r.cssRules !== undefined && r.cssRules.length > 0) {
        walk(r.cssRules, r.conditionText !== undefined && r.selectorText === undefined ? (media ? media + ' && ' : '') + r.conditionText : media)
      }
    }
  }
  for (const entry of sheetLists) { try { walk(entry.sheet.cssRules, null) } catch { /* ignore */ } }
  out.ourStyleTags = sheetLists.map(e => { try { return { owner: e.owner, rules: e.sheet.cssRules.length } } catch { return { owner: e.owner, rules: -1 } } })
  out.ruleAudit = { totalSelectors: total, matchedSelectors: matched.length, deadSelectors: dead.length, dead: dead.slice(0, 500), matched: [...new Set(matched)].slice(0, 600) }

  // DOM contract inventory: every slot and every cross-plugin data attribute
  // currently on the page, with occupancy — the raw material for Harmony Doctor.
  const slots = {}
  for (const el of document.querySelectorAll('[data-slot]')) {
    const name = el.getAttribute('data-slot')
    const rect = el.getBoundingClientRect()
    if (slots[name] === undefined) slots[name] = { count: 0, sample: null }
    slots[name].count++
    if (slots[name].sample === null) slots[name].sample = { w: Math.round(rect.width), h: Math.round(rect.height), cls: String(el.className).slice(0, 70) }
  }
  out.slots = slots
  const dataAttrs = {}
  for (const el of document.querySelectorAll('*')) {
    for (const attr of el.attributes) {
      if (!attr.name.startsWith('data-dsh-') && !attr.name.startsWith('data-genui') && !attr.name.startsWith('data-duc-')) continue
      dataAttrs[attr.name] = (dataAttrs[attr.name] ?? 0) + 1
    }
  }
  out.crossPluginDataAttrs = dataAttrs
  out.sessionLinks = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h !== null && /session|\/s\//i.test(h)).slice(0, 8)
  out.url = location.href

  // The synthetic probe host stays in the DOM: CDP reads its platform fonts.
  return out
}

/** Canvas width-diff font availability. Two baselines are required: a single
 *  one gives false negatives when the family IS the platform default for that
 *  generic (measured: Consolas is Chromium's default `monospace` on Windows).
 *  `document.fonts.check` is unusable — it returns true for unknown families. */
function fontAvailability() {
  const families = ['HarmonyOS Sans SC', 'HarmonyOS Sans', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'Georgia', 'Times New Roman', 'Songti SC', 'SimSun', 'JetBrains Mono', 'SF Mono', 'Consolas', 'Courier New', '__definitely_missing__']
  const c = document.createElement('canvas').getContext('2d')
  const probe = '汉字漢字abcXYZ0123'
  const w = (font) => { c.font = font; return Math.round(c.measureText(probe).width * 100) / 100 }
  const base = { sans: w('72px sans-serif'), mono: w('72px monospace') }
  const bogus = { sans: w('72px "__enhc_missing__", sans-serif'), mono: w('72px "__enhc_missing__", monospace') }
  const out = {}
  for (const f of families) {
    const withSans = w(`72px "${f}", sans-serif`)
    const withMono = w(`72px "${f}", monospace`)
    out[f] = {
      available: (withSans !== base.sans && withSans !== bogus.sans) || (withMono !== base.mono && withMono !== bogus.mono),
      withSans, withMono,
    }
  }
  return { baselines: { ...base, bogusSans: bogus.sans, bogusMono: bogus.mono }, families: out }
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
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)) })
const bad = []
page.on('response', r => { if (r.status() >= 400) bad.push({ status: r.status(), url: r.url().slice(0, 160) }) })

const cdp = await context.newCDPSession(page)
await cdp.send('DOM.enable')
await cdp.send('CSS.enable')
await cdp.send('Network.enable')
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })

/** Actual rendered platform font for a selector (glyph counts included). */
async function platformFonts(selector) {
  try {
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 })
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector })
    if (nodeId === 0) return null
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
    return fonts.map(f => ({ family: f.familyName, glyphs: f.glyphCount, isCustom: f.isCustomFont }))
  } catch (e) { return 'cdn-error:' + String(e).slice(0, 120) }
}

let targetUrl = URL_ARG
const boot = async (url = targetUrl) => {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
  await page.waitForTimeout(4000)
}

/** Open a session so the session header, its utilities and the panels exist. */
const openSession = async () => {
  const inSession = async () => page.evaluate(() => document.querySelector("[data-slot='conversation.session.header'] > header") !== null)
  if (await inSession()) return 'already-in-session'
  const diag = await page.evaluate(() => {
    const sidebar = document.querySelector("[data-slot='sidebar.workspaces']")
    const rows = sidebar === null ? [] : [...sidebar.querySelectorAll('[role="button"], button, a, [class*="row"], [class*="item"]')]
      .slice(0, 12)
      .map(el => ({ tag: el.tagName, cls: String(el.className).slice(0, 50), text: (el.textContent ?? '').trim().slice(0, 30), href: el.getAttribute('href') }))
    const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h !== null && /session/i.test(h)).slice(0, 5)
    return { rows, links, sidebarText: (sidebar?.textContent ?? '').trim().slice(0, 120) }
  })
  if (diag.links.length > 0) {
    await page.goto(new URL(diag.links[0], URL_ARG).href, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(7000)
    if (await inSession()) return 'goto:' + diag.links[0]
  }
  const clicked = await page.evaluate(() => {
    const sidebar = document.querySelector("[data-slot='sidebar.workspaces']")
    if (sidebar === null) return null
    const candidates = [...sidebar.querySelectorAll('[role="button"], button, a, [class*="row"], [class*="item"]')]
    const target = candidates.find(el => (el.textContent ?? '').trim().length > 2 && el.getBoundingClientRect().width > 0)
    if (target === undefined) return null
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    return (target.textContent ?? '').trim().slice(0, 30)
  })
  await page.waitForTimeout(7000)
  return { clicked, inSessionNow: await inSession(), diag }
}

const passes = []
await boot()
const sessionOpen = await openSession()
targetUrl = page.url()
const availability = await page.evaluate(fontAvailability)
const first = await page.evaluate(collect)
const cdpFonts = {
  syntheticProse: await platformFonts("[data-harmony-probe] span:nth-child(1)"),
  syntheticCode: await platformFonts("[data-harmony-probe] span:nth-child(2)"),
  uiChrome: await platformFonts("[data-harmony-probe] span:nth-child(3)"),
}
passes.push({ fontId: 'current (as stored)', markers: first, cdpFonts })

for (const pass of FONT_PASSES.filter(p => p.fontId !== 'current')) {
  await page.evaluate((spec) => {
    const key = 'harness-ui-enhancer.state'
    let state = {}
    try { state = JSON.parse(localStorage.getItem(key) ?? '{}') } catch { state = {} }
    state.fontId = spec.fontId
    if (spec.fontScope !== null) state.fontScope = spec.fontScope
    localStorage.setItem(key, JSON.stringify(state))
  }, pass)
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
  await page.waitForTimeout(3500)
  const markers = await page.evaluate(collect)
  passes.push({
    fontId: pass.fontId,
    fontScope: pass.fontScope,
    markers,
    cdpFonts: {
      syntheticProse: await platformFonts("[data-harmony-probe] span:nth-child(1)"),
      syntheticCode: await platformFonts("[data-harmony-probe] span:nth-child(2)"),
      syntheticUi: await platformFonts("[data-harmony-probe] span:nth-child(3)"),
    },
  })
}

/** Views the rule audit is run in. A selector is only "dead" when it matches
 *  nothing in ANY of them — the single-view number is meaningless, because a
 *  hero screen simply has no settings section mounted. */
const VIEWS = [
  {
    name: 'hero',
    open: async () => { await page.evaluate(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })) }); await page.waitForTimeout(1200) },
  },
  {
    name: 'settings-general',
    open: async () => {
      await page.evaluate(() => { document.querySelector("[data-slot='settings.trigger']")?.click() })
      await page.waitForTimeout(2500)
    },
  },
  {
    name: 'doctor',
    open: async () => {
      const clicked = await page.evaluate(() => {
        const cells = [...document.querySelectorAll('nav button, [class*="_navCell"], [role="dialog"] button')]
        const target = cells.find(el => /兼容性|Compatibility/u.test(el.textContent ?? ''))
        if (target === undefined) return false
        target.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        return true
      })
      await page.waitForTimeout(1500)
      const ran = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('.enhc-doctor-btn')]
        const run = buttons.find(b => !/导出|Export|清空|Reset/u.test(b.textContent ?? ''))
        if (run === undefined) return false
        run.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        return true
      })
      await page.waitForTimeout(1200)
      const summary = await page.evaluate(() => ({
        opened: document.querySelector('.enhc-doctor') !== null,
        stats: [...document.querySelectorAll('.enhc-doctor-stat')].map(el => el.textContent ?? ''),
        rows: document.querySelectorAll('.enhc-doctor-row').length,
        blocks: [...document.querySelectorAll('.enhc-doctor-h3')].map(el => el.textContent ?? ''),
      }))
      return { navClicked: clicked, ran, summary }
    },
  },
  {
    // Glass coexistence, simulated instead of installing a third-party theme:
    // override the same semantic tokens those themes replace, wait for the
    // contract's material poll, and watch `--enhc-glass-aware` / the header fill.
    name: 'glass-simulated',
    open: async () => {
      const injected = await page.evaluate(() => {
        const style = document.createElement('style')
        style.id = 'enhc-probe-glass'
        style.textContent = 'body{--dsw-alias-bg-base:rgba(255,255,255,0.45);--dsw-alias-bg-layer-1:rgba(255,255,255,0.35);--dsw-specific-sidebar-fill:rgba(255,255,255,0.30)}'
        document.head.appendChild(style)
        return getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim()
      })
      // The material watcher polls at 2s; give it one full cycle.
      await page.waitForTimeout(3200)
      return { injectedBaseToken: injected }
    },
  },
  {
    name: 'glass-restored',
    open: async () => {
      const removed = await page.evaluate(() => {
        const style = document.getElementById('enhc-probe-glass')
        if (style === null) return false
        style.remove()
        return true
      })
      await page.waitForTimeout(3200)
      return { removedGlassTag: removed }
    },
  },
  {
    // Runs LAST on purpose: walking the workspace tree can collapse the sidebar,
    // so every measurement that needs a stable shell is taken first. In 0.1.5 a
    // session row is not an anchor and the tree mixes collapse buttons, directory
    // rows and session rows — the click is restricted to session-looking
    // elements and the whole inventory is reported so a bad guess stays diagnosable.
    name: 'session',
    open: async () => {
      // Measured structure (see the reported inventory): workspace projects are
      // `*_projectRow`, sessions are `*_sessionRow` and the currently selected
      // one is the "new session" placeholder — so the tree must be expanded
      // first and the placeholder skipped, or every click just reselects it.
      const inventory = await page.evaluate(() => [...document.querySelectorAll("[data-slot='sidebar.workspaces'] *")]
        .filter(el => (el.textContent ?? '').trim().length > 1 && el.getBoundingClientRect().width > 40)
        .slice(0, 30)
        .map(el => ({ tag: el.tagName, cls: String(el.className).slice(0, 50), text: (el.textContent ?? '').trim().slice(0, 30), w: Math.round(el.getBoundingClientRect().width) })))
      const hasContent = () => page.evaluate(() => document.querySelector("[data-slot='conversation.session'] [class*='_flowItem'], [class*='markdown']") !== null)
      const steps = []
      const expand = await page.evaluate(() => {
        const row = [...document.querySelectorAll("[class*='projectRow']")].find(el => el.getBoundingClientRect().width > 40)
        if (row === undefined) return null
        row.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        return (row.textContent ?? '').trim().slice(0, 30)
      })
      steps.push({ expandProject: expand })
      await page.waitForTimeout(3000)
      for (let attempt = 0; attempt < 4; attempt++) {
        if (await hasContent()) break
        const clicked = await page.evaluate((index) => {
          const rows = [...document.querySelectorAll("[class*='sessionRow']")]
            .filter(el => !/新会话|New session/iu.test(el.textContent ?? '') && el.getBoundingClientRect().width > 40)
          const target = rows[index]
          if (target === undefined) return null
          target.dispatchEvent(new MouseEvent('click', { bubbles: true }))
          return { cls: String(target.className).slice(0, 46), text: (target.textContent ?? '').trim().slice(0, 30) }
        }, attempt)
        if (clicked === null) break
        steps.push({ clickSession: clicked })
        await page.waitForTimeout(4000)
      }
      return { steps, hasContent: await hasContent(), inventory }
    },
  },
]

const viewReports = []
for (const view of VIEWS) {
  let extra = null
  try { extra = await view.open() } catch (e) { errors.push(`view ${view.name}: ${String(e)}`) }
  const snap = await page.evaluate(collect)
  viewReports.push({ name: view.name, audit: snap.ruleAudit, shell: snap.shell, contract: snap.contract, rendered: snap.rendered, extra })
}

const matchedAnywhere = new Set()
let totalSelectors = 0
for (const v of viewReports) {
  totalSelectors = Math.max(totalSelectors, v.audit.totalSelectors)
  for (const sel of v.audit.matched) matchedAnywhere.add(sel)
}
const perView = viewReports.map(v => `${v.name}: ${v.audit.matchedSelectors}/${v.audit.totalSelectors} matched, shell=${JSON.stringify(v.shell)}`)
const deadEverywhere = totalSelectors - matchedAnywhere.size

const result = {
  url: URL_ARG,
  sessionOpen,
  authority,
  ua: await page.evaluate(() => navigator.userAgent),
  auth: { cookieName: cookie.name, secretSource: CREDENTIALS, note: 'cookie minted locally from the persisted browser-session secret' },
  availability,
  passes,
  ruleAudit: {
    totalSelectors,
    matchedInAtLeastOneView: matchedAnywhere.size,
    deadInEveryView: deadEverywhere,
    perView,
    deadInHeroView: viewReports[0]?.audit.dead ?? [],
  },
  views: viewReports.map(v => ({ name: v.name, contract: v.contract, matched: v.audit.matchedSelectors, shell: v.shell, extra: v.extra })),
  errors: errors.slice(0, 20),
  failedResponses: bad.slice(0, 20),
  boot: first,
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8')
await context.close()

// ---- console report -------------------------------------------------------
const line = (...parts) => console.log(...parts)
line(`url=${URL_ARG} authority=${authority} cookie=${cookie.name}`)
line('=== font availability (canvas width-diff, two baselines) ===')
for (const [f, v] of Object.entries(availability.families)) line(`  ${v.available ? 'YES' : 'NO '} ${f}`)
for (const p of passes) {
  const mk = p.markers
  line(`=== pass fontId=${p.fontId} scope=${p.fontScope ?? '(stored)'} ===`)
  line(`  stored state: ${JSON.stringify(mk.enhancerState)}`)
  line(`  body token  : ${mk.computed.body.markdownBase.slice(0, 130)}`)
  line(`  inline body : ${(mk.computed.inlineBody ?? '').slice(0, 90)}`)
  line(`  synthetic prose font: ${mk.synthetic.prose.font.slice(0, 120)}`)
  line(`  synthetic code  font: ${mk.synthetic.codeBlock.font.slice(0, 110)}`)
  line(`  synthetic ui   family: ${mk.synthetic.ui.fontFamily.slice(0, 100)}`)
  line(`  cdp prose/code/ui  : ${JSON.stringify(p.cdpFonts.syntheticProse)} ${JSON.stringify(p.cdpFonts.syntheticCode ?? null)} ${JSON.stringify(p.cdpFonts.syntheticUi ?? null)}`)
  line(`  markdown declarers  : [${mk.markdownDeclarers.join(',')}] of ${mk.styleTags.length} style tags`)
}
line('=== shell ===')
line('  ' + JSON.stringify(first.shell))
line('  sessionOpen: ' + sessionOpen + ' | sessionUrl: ' + targetUrl)
line('=== slots (data-slot inventory) ===')
for (const [name, v] of Object.entries(first.slots)) line(`  ${v.count}x ${name} ${JSON.stringify(v.sample)}`)
line('=== cross-plugin data attributes ===')
line('  ' + JSON.stringify(first.crossPluginDataAttrs))
line('=== panel ===')
line('  ' + JSON.stringify(first.panel))
line(`=== rule audit === total ${result.ruleAudit.totalSelectors}, matched in >=1 view ${result.ruleAudit.matchedInAtLeastOneView}, dead in EVERY view ${result.ruleAudit.deadInEveryView}`)
for (const p of result.ruleAudit.perView) line('  ' + p)
line('=== contract + material (per view) ===')
for (const v of viewReports) {
  line(`  ${v.name}: contract=${JSON.stringify(v.contract)}`)
  line(`      header-bg=${v.rendered?.headerBackground ?? 'n/a'} base-token=${v.rendered?.baseToken ?? 'n/a'} solid-fill=${v.contract?.solidFill ?? 'n/a'}`)
}
line('  glass-simulated extra:', JSON.stringify(viewReports.find(v => v.name === 'glass-simulated')?.extra ?? null))
line('  glass-restored extra:', JSON.stringify(viewReports.find(v => v.name === 'glass-restored')?.extra ?? null))
line('=== session view ===')
line('  ' + JSON.stringify(viewReports.find(v => v.name === 'session')?.extra ?? null))
const doctorView = viewReports.find(v => v.name === 'doctor')
if (doctorView !== undefined) line('=== doctor page (end-to-end) ===\n  ' + JSON.stringify(doctorView.extra))
for (const d of result.ruleAudit.deadInHeroView.slice(0, 40)) line('  DEAD(hero):', d.sel, d.media !== null ? `@${d.media}` : '')
line(`=== failed responses: ${bad.length} | page errors: ${errors.length} ===`)
for (const b of bad.slice(0, 5)) line('  ', JSON.stringify(b))
for (const e of errors.slice(0, 5)) line('  ', e)
line('written: ' + OUT)
