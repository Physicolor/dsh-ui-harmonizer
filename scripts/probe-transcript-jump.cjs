/**
 * Does the transcript jump because off-screen flow items are placeholders?
 *
 * `flow-item-rendering.module.css` sets `content-visibility: auto` with
 * `contain-intrinsic-size: auto 120px`. An item that has never been rendered is
 * laid out at 120px; the moment it enters the viewport its real height replaces
 * that guess, so everything above it moves. This probe measures the evidence
 * instead of guessing:
 *
 *   - how many flow items are actual placeholders (height === 120)
 *   - whether a scroll/jump changes heights above the viewport
 *   - whether the scroll container's scrollTop moves on its own after a frame
 *
 * Run:  node scripts/probe-transcript-jump.cjs
 * Env:  DSH_LIVE_AUTHORITY (default 127.0.0.1:56636)
 */
const path = require('node:path')

const HARNESS = 'D:/dsh-home/plugins/dsh-widgets/scripts/lib/probe-harness.cjs'
const { liveAvailable, liveContext, report, close } = require(HARNESS)

const AUTHORITY = process.env.DSH_LIVE_AUTHORITY || '127.0.0.1:56636'

async function main() {
  const r = report('transcript jump')
  if (!(await liveAvailable(AUTHORITY))) {
    r.check(false, 'live GUI reachable', AUTHORITY)
    await close()
    process.exit(r.exitCode())
  }

  const ctx = await liveContext({ authority: AUTHORITY, viewport: { width: 1500, height: 1000 } })
  const page = await ctx.newPage()
  page.on('pageerror', (error) => console.log('  pageerror:', error.message))
  await page.goto(`http://${AUTHORITY}/`, { waitUntil: 'load' })
  await page.waitForTimeout(2500)

  const census = await page.evaluate(() => {
    const items = [...document.querySelectorAll("[data-slot='conversation.session'] [class$='_flowItem']")]
    const heights = items.map((item) => Math.round(item.getBoundingClientRect().height))
    const scroll = document.querySelector("[data-slot='conversation.session'] [class*='_scrollBody'], [class*='_scrollBody']")
    return {
      count: items.length,
      placeholders: heights.filter((h) => h === 120).length,
      heights: heights.slice(0, 20),
      scrollTop: scroll ? scroll.scrollTop : null,
      scrollHeight: scroll ? scroll.scrollHeight : null,
      clientHeight: scroll ? scroll.clientHeight : null,
      cv: items[0] ? getComputedStyle(items[0]).contentVisibility : null,
      cis: items[0] ? getComputedStyle(items[0]).containIntrinsicSize : null,
    }
  })
  console.log('  census', JSON.stringify(census))

  r.check(census.cv === 'auto', 'content-visibility:auto is active', String(census.cv))
  r.check(census.placeholders === 0, 'no unrendered 120px placeholders', `${census.placeholders}/${census.count}`)

  // Scroll to the bottom and watch for a self-induced shift: if placeholders
  // expand, the distance from the top grows after the scroll settles.
  const jump = await page.evaluate(async () => {
    const scroll = document.querySelector("[class*='_scrollBody']")
    if (!scroll) return null
    const items = [...document.querySelectorAll("[class$='_flowItem']")]
    const before = items.slice(0, 10).map((item) => Math.round(item.getBoundingClientRect().height))
    const top0 = scroll.scrollTop
    scroll.scrollTop = scroll.scrollHeight
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    await new Promise((resolve) => setTimeout(resolve, 300))
    const after = items.slice(0, 10).map((item) => Math.round(item.getBoundingClientRect().height))
    const top1 = scroll.scrollTop
    const atBottom = Math.abs(scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight) < 2
    return {
      movedBy: Math.round(top1 - top0),
      grown: before.map((h, i) => after[i] - h),
      atBottom,
      scrollHeight: scroll.scrollHeight,
    }
  })
  console.log('  jump', JSON.stringify(jump))

  await close()
  process.exit(r.exitCode())
}

main().catch(async (error) => {
  console.error(error)
  await close()
  process.exit(1)
})
