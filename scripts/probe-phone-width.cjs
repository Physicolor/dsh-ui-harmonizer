/**
 * What the REAL desktop UI looks like at phone width.
 *
 * This is the comparison oracle, not a shipping path: it answers "if we wrapped
 * the web UI in a WebView, what would the user actually get?" — including the
 * product's own narrow-width rule and every third-party plugin that injected
 * DOM without a phone contract.
 *
 * Run: DSH_HOME=D:/dsh-home DSH_LIVE_AUTHORITY=127.0.0.1:56636 node scripts/probe-phone-width.cjs
 */
const HARNESS = 'D:/dsh-home/plugins/dsh-widgets/scripts/lib/probe-harness.cjs'
const { liveContext, close } = require(HARNESS)
const AUTHORITY = process.env.DSH_LIVE_AUTHORITY || '127.0.0.1:56636'

async function main() {
  const ctx = await liveContext({ authority: AUTHORITY, viewport: { width: 412, height: 915 } })
  const page = await ctx.newPage()
  await page.goto(`http://${AUTHORITY}/`, { waitUntil: 'load' })
  await page.waitForTimeout(3000)

  const report = await page.evaluate(() => {
    const vw = window.innerWidth
    const all = [...document.querySelectorAll('body *')]
    const clipped = all
      .map((el) => {
        const r = el.getBoundingClientRect()
        return { cls: String(el.className).slice(0, 60), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) }
      })
      .filter((r) => r.w > 0 && (r.right > vw + 2 || r.left < -2))
      .slice(0, 15)
    const frame = document.querySelector("[class*='_frame']")
    const frameStyle = frame ? getComputedStyle(frame) : null
    const slots = [...document.querySelectorAll('[data-slot]')].map((n) => n.getAttribute('data-slot'))
    // Third-party surfaces: our own plugins and the genui renderer.
    const enhc = document.querySelectorAll("[class*='enhc'], [class*='_rail'], [class*='dsh-']").length
    return {
      vw,
      frame: frame ? { display: frameStyle.display, width: Math.round(frame.getBoundingClientRect().width) } : null,
      sidebar: (() => {
        const s = document.querySelector("[data-slot='sidebar']")
        return s ? { width: Math.round(s.getBoundingClientRect().width), display: getComputedStyle(s).display } : null
      })(),
      clippedCount: clipped.length,
      clipped: clipped.slice(0, 8),
      uniqueSlots: [...new Set(slots)].length,
      enhcNodes: enhc,
      bodyScrollWidth: document.body.scrollWidth,
    }
  })
  console.log(JSON.stringify(report, null, 2))
  await page.screenshot({ path: 'D:/dsh-home/plugins/dsh-life/.screenshots/web-412.png', fullPage: false })
  await close()
}
main().catch(async (e) => { console.error(e); await close(); process.exit(1) })
