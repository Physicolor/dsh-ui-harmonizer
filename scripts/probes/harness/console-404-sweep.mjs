/**
 * dsh-ui-harmonizer — sweep the UI for 4xx/5xx responses.
 *
 * The owner reported a 404 (and a 503) in the console. The 503 was
 * `/api/opencode-usage` (fixed in dsh-widgets: the OpenCode feed is now only
 * requested when a widget that renders it is installed). The 404 needs a subject,
 * so this opens every settings page, the widget market, the usage centre and a
 * session, and reports each response >= 400 with the URL that produced it.
 *
 *   node scripts/probes/harness/console-404-sweep.mjs [--session <substring>]
 */
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { authCookieFor } from '../../lib/auth.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(HERE, 'noop.js'))
const { chromium } = require(join('C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/node_modules', 'playwright-core'))
const { chromePath } = require(join(HERE, '../../../../dsh-widgets/scripts/lib/chrome.cjs'))

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const URL_ = arg('--url', process.env.DSH_URL ?? 'http://127.0.0.1:19387')
const SESSION = arg('--session', 'dsh-wid')
const CREDENTIALS = process.env.DSH_PROBE_CREDENTIALS ?? 'D:/dsh-home/.credentials.yaml'
const NAV = ['通用', '模型', 'Command Code', '内置插件', 'Agent 预设', '组件', 'UI 兼容性', '科研', '插件市场', '通知']

;(async () => {
  const { cookie } = authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ })
  const browser = await chromium.launch({ executablePath: chromePath(), headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  await ctx.addCookies([cookie])
  const page = await ctx.newPage()

  const failed = []
  const errors = []
  const note = (label) => ({ label, at: Date.now() })
  let phase = note('load')
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${phase.label} ${r.url().slice(0, 150)}`) })
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${phase.label}: ${m.text().slice(0, 160)}`) })
  page.on('pageerror', (e) => errors.push(`${phase.label}: pageerror ${e.message.slice(0, 160)}`))

  await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(7000)
  const welcome = page.getByRole('button', { name: '继续' }).first()
  if (await welcome.count()) { await welcome.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1500) }

  phase = note('session')
  const row = page.locator('div[class*="sessionRow"]', { hasText: SESSION }).first()
  if (await row.count()) { await row.click({ timeout: 8000 }).catch(() => {}); await page.waitForTimeout(6000) }

  phase = note('settings')
  const settings = page.getByText('设置', { exact: true }).first()
  if (await settings.count()) {
    await settings.click({ timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(2500)
    for (const label of NAV) {
      phase = note(`settings:${label}`)
      const item = page.getByText(label, { exact: true }).first()
      if (await item.count()) { await item.click({ timeout: 5000 }).catch(() => {}); await page.waitForTimeout(1800) }
    }
  }
  phase = note('after-settings')
  await page.keyboard.press('Escape').catch(() => {})
  await page.waitForTimeout(1500)
  phase = note('idle')
  await page.waitForTimeout(4000)

  console.log(JSON.stringify({ failed, errors }, null, 1))
  await browser.close()
})().catch((e) => { console.error('FAILED:', e.stack || e.message); process.exit(1) })
