/**
 * Same oracle, but inside a long conversation: the tool rows, the plan dock and
 * any plugin-injected card at phone width.
 */
const HARNESS = 'D:/dsh-home/plugins/dsh-widgets/scripts/lib/probe-harness.cjs'
const { liveContext, close } = require(HARNESS)
const AUTHORITY = process.env.DSH_LIVE_AUTHORITY || '127.0.0.1:56636'

async function shot(width, name) {
  const ctx = await liveContext({ authority: AUTHORITY, viewport: { width, height: 915 } })
  const page = await ctx.newPage()
  await page.goto(`http://${AUTHORITY}/`, { waitUntil: 'load' })
  await page.waitForTimeout(2500)
  const row = page.locator('text=dsh-life 通知、状态同步与任务 UI 修复').first()
  if (await row.count()) await row.click()
  await page.waitForTimeout(2500)
  const info = await page.evaluate(() => {
    const vw = window.innerWidth
    const overflow = [...document.querySelectorAll('body *')]
      .map((el) => {
        const r = el.getBoundingClientRect()
        return { tag: el.tagName, cls: String(el.className).slice(0, 46), right: Math.round(r.right), w: Math.round(r.width) }
      })
      .filter((r) => r.w > vw * 0.9 && r.right > vw + 2)
      .slice(0, 10)
    const ellipsis = [...document.querySelectorAll('*')]
      .filter((el) => el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0)
      .length
    return { vw, overflow, ellipsis, scrollWidth: document.body.scrollWidth }
  })
  console.log(name, JSON.stringify(info))
  await page.screenshot({ path: `D:/dsh-home/plugins/dsh-life/.screenshots/web-session-${name}.png` })
  await ctx.close()
}

async function main() {
  await shot(412, '412')
  await shot(360, '360')
  await close()
}
main().catch(async (e) => { console.error(e); await close(); process.exit(1) })
