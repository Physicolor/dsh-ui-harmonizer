/**
 * dsh-ui-harmonizer — Settings → General surface check (refactor guard).
 *
 * The refactor moves the settings rows, the controls and the page-header
 * reconciler between files; the one thing it must not change is what the user
 * sees on `Settings → 通用`. This opens the page on the live app, records the
 * header + every row (title, control kind, geometry) and screenshots it, so the
 * same command run before and after the move can be diffed.
 *
 *   node scripts/verify/settings-page.cjs [--out docs/architecture/baseline/general-page.json]
 *
 * URL from DSH_URL, default http://127.0.0.1:19387.
 */
const path = require('node:path')
const fs = require('node:fs')
const crypto = require('node:crypto')

const PW = 'C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/node_modules'
const { chromium } = require(path.join(PW, 'playwright-core'))
const { chromePath } = require('../../../dsh-widgets/scripts/lib/chrome.cjs')

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const URL_ = arg('--url', process.env.DSH_URL || 'http://127.0.0.1:19387')
const OUT = arg('--out', 'docs/architecture/baseline/general-page.json')

function authCookie() {
  const yaml = fs.readFileSync('D:/dsh-home/.credentials.yaml', 'utf8')
  const secret = Buffer.from(yaml.match(/secret:\s*([A-Za-z0-9_-]+)/)[1].replaceAll('-', '+').replaceAll('_', '/'), 'base64')
  const authority = new global.URL(URL_).host
  const b64u = (b) => Buffer.from(b).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
  const name = 'dsh-auth-' + b64u(crypto.createHash('sha256').update(authority).digest())
  const now = Date.now()
  const body = b64u(Buffer.from(JSON.stringify({ version: 1, authority, issuedAt: now, expiresAt: now + 86400000 }), 'utf8'))
  return { name, value: `v1.${body}.${b64u(crypto.createHmac('sha256', secret).update(body).digest())}` }
}

/**
 * Everything the General page is expected to show, read off the live DOM.
 *
 * The settings surface is a modal, and the official pages are NOT registered as
 * `settings.section` (that slot exists for third-party pages like our Doctor) —
 * so instead of guessing the product's container class, this records the signals
 * that tell whether OUR surfaces are on screen and how they look:
 *   - the row labels our Settings → General block ships,
 *   - every element carrying one of our `enhc-` classes (page titles, the row
 *     controls, the Doctor page chrome), with its geometry and computed style.
 */
const READ_PAGE = () => {
  const box = (el) => { const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] }
  const cs = (el, p) => getComputedStyle(el).getPropertyValue(p).trim()
  const text = document.body.innerText
  const labels = ['通用设置', '对话内容宽度', '工作区字号', '字体', '字体作用范围', '圆角卡片', 'UI 兼容性', '运行检查']
  const enhc = [...document.querySelectorAll("[class*='enhc-']")]
  return {
    labels: Object.fromEntries(labels.map((l) => [l, text.includes(l)])),
    enhcCount: enhc.length,
    enhc: enhc.slice(0, 24).map((el) => ({
      tag: el.tagName.toLowerCase(),
      cls: String(el.className).slice(0, 100),
      box: box(el),
      text: (el.textContent ?? '').trim().slice(0, 36),
      style: el.tagName === 'H2' || el.tagName === 'P'
        ? { fontSize: cs(el, 'font-size'), lineHeight: cs(el, 'line-height'), fontWeight: cs(el, 'font-weight'), color: cs(el, 'color'), marginTop: cs(el, 'margin-top') }
        : undefined,
    })),
    switches: [...document.querySelectorAll('[class*="enhc"], .uitw-switch, [role="switch"]')].slice(0, 10).map((el) => ({ cls: String(el.className).slice(0, 70), box: box(el) })),
  }
}

;(async () => {
  const c = authCookie()
  const browser = await chromium.launch({ executablePath: chromePath(), headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  await ctx.addCookies([{ name: c.name, value: c.value, domain: '127.0.0.1', path: '/', httpOnly: true, sameSite: 'Strict' }])
  const page = await ctx.newPage()
  await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(6000)
  const welcome = page.getByRole('button', { name: '继续' }).first()
  if (await welcome.count()) { await welcome.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1200) }

  // Settings lives at the foot of the left sidebar.
  const settings = page.getByText('设置', { exact: true }).first()
  if (!(await settings.count())) { console.error('FAIL  no 设置 entry in the sidebar'); await browser.close(); process.exit(1) }
  await settings.click({ timeout: 8000 })
  await page.waitForTimeout(2500)

  const general = page.getByText('通用', { exact: true }).first()
  if (await general.count()) { await general.click({ timeout: 6000 }).catch(() => {}); await page.waitForTimeout(1500) }

  const page1 = await page.evaluate(READ_PAGE)
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  await page.screenshot({ path: OUT.replace(/\.json$/, '.png') })
  fs.writeFileSync(OUT, `${JSON.stringify(page1, null, 1)}\n`, 'utf8')
  console.log(JSON.stringify(page1, null, 1))
  console.log(`\nwrote ${OUT} + ${OUT.replace(/\.json$/, '.png')}`)
  await browser.close()
})().catch((e) => { console.error('FAILED:', e.stack || e.message); process.exit(1) })
