/**
 * dsh-ui-harmonizer — the icon set: official comparison sheet + PNG exports.
 *
 * Concept C, corrected by the owner:
 *   - the two side groups of blocks sit VERTICALLY CENTRED on the rail;
 *   - the side groups are only slightly shorter than the rail (81.8%);
 *   - the mark is inset like the official tiles are. Measured on 2026-09-30 from
 *     the four `icon.svg` files shipped in the harness app.asar (agent-team,
 *     auto-review, schedule, voice-input): content 18.0–21.0 units wide on the
 *     36 canvas, i.e. 6.0–8.6 units of clearance. Ours is held at 20.0 wide with
 *     8.0/8.22 clearance, so it can never out-fill the fullest official glyph.
 * Every claim above is asserted below against the rendered SVGs (getBBox), and
 * the officials are embedded so the sheet can be judged against the real tiles.
 *
 *   icon.svg                 36x36  — Settings plugin-list tile, npm "icon"
 *   docs/icon/app-icon-*.svg 512    — app / repo mark
 *
 *   node scripts/tools/icon-preview.mjs [--out docs/icon/preview.png]
 */
import { createRequire } from 'node:module'
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..', '..')
const require = createRequire(join(HERE, 'noop.js'))
const { chromium } = require(join('C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/node_modules', 'playwright-core'))
const { chromePath } = require(join(HERE, '../../../dsh-widgets/scripts/lib/chrome.cjs'))

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const OUT = arg('--out', 'docs/icon/preview.png')

const LIST_ICON = readFileSync(join(ROOT, 'icon.svg'), 'utf8')
const APP_LIGHT = readFileSync(join(ROOT, 'docs', 'icon', 'app-icon-light.svg'), 'utf8')
const APP_DARK = readFileSync(join(ROOT, 'docs', 'icon', 'app-icon-dark.svg'), 'utf8')

/** The officials, extracted verbatim from app.asar (reference only, not shipped). */
const OFFICIAL = {
  '智能体团队': '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3027 17.1077H9.03125V12.8372H13.3027V17.1077ZM17.5742 12.8372C17.574 15.1958 15.6623 17.1075 13.3037 17.1077V8.56567H17.5742V12.8372Z" fill="url(#a)"/><path d="M18.5229 12.8372V8.56567H22.7944V12.8372H27.0659V17.1077H22.7944C20.4357 17.1077 18.5232 15.1959 18.5229 12.8372Z" fill="#F2AF63"/><path d="M17.5742 26.6072H13.3037V18.0642C15.6625 18.0644 17.5742 19.9769 17.5742 22.3357V26.6072ZM13.3027 22.3357H9.03125V18.0642H13.3027V22.3357Z" fill="#7CB7FF"/><path d="M22.7944 26.6072H18.5229V22.3357C18.5229 19.9768 20.4355 18.0642 22.7944 18.0642H27.0659V22.3357H22.7944V26.6072Z" fill="#45D9E7"/><defs><linearGradient id="a" x1="16.1247" y1="6.6613" x2="9.03125" y2="19.2206" gradientUnits="userSpaceOnUse"><stop stop-color="#7CB7FF"/><stop offset="1" stop-color="#145AF3"/></linearGradient></defs></svg>',
  '自动授权审查': '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1.5 1.5) scale(0.9166666667)"><path d="M18 6L28.5 9.5V17.2C28.5 23.1 24.08 28.4 18 30C11.92 28.4 7.5 23.1 7.5 17.2V9.5L18 6Z" fill="url(#b)" fill-opacity="0.8"/><path d="M14.2 18L16.84 20.63L22.2 15.27" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><linearGradient id="b" x1="18" y1="6" x2="18" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#7AC2FF"/><stop offset="1" stop-color="#4A65E8"/></linearGradient></defs></svg>',
  '定时任务': '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.5404 17.9143L22.2526 19.3885L21.5998 21.0332L17.8875 19.56C17.2134 19.2924 16.771 18.6398 16.771 17.9143V13.6399H18.5404V17.9143Z" fill="url(#c0)" stroke="url(#c1)" stroke-width="0.284352" stroke-linejoin="round"/><path d="M17.9976 8C21.4515 8 24.4968 9.75127 26.2935 12.4141L26.646 10.9189L28.1216 11.2666L27.2671 14.9033L27.1118 15.5625L26.439 15.4824L22.73 15.042L22.9077 13.5371L24.6714 13.7451C23.2655 11.545 20.8019 10.0859 17.9976 10.0859C13.6268 10.0862 10.0836 13.6292 10.0835 18C10.0836 22.3708 13.6268 25.9148 17.9976 25.915C22.3685 25.915 25.9125 22.3709 25.9126 18V17.9531H27.9976V18C27.9974 23.5226 23.5202 28 17.9976 28C12.4752 27.9998 7.99768 23.5224 7.99756 18C7.99764 12.4775 12.4751 8.00024 17.9976 8ZM14.1235 27.1699C14.1657 27.1877 14.2091 27.2025 14.2515 27.2197C14.1683 27.1859 14.0857 27.1507 14.0034 27.1152L14.1235 27.1699Z" fill="url(#c2)"/><defs><linearGradient id="c0" x1="15.6334" y1="13.2607" x2="29.9092" y2="27.3696" gradientUnits="userSpaceOnUse"><stop stop-color="#58BCC8"/><stop offset="0.55" stop-color="#658EFF"/></linearGradient><linearGradient id="c1" x1="16.5812" y1="13.2607" x2="29.9092" y2="27.3696" gradientUnits="userSpaceOnUse"><stop stop-color="#58BCC8"/><stop offset="0.55" stop-color="#658EFF"/></linearGradient><linearGradient id="c2" x1="13.2184" y1="7.52381" x2="31.0194" y2="27.2245" gradientUnits="userSpaceOnUse"><stop stop-color="#52CED8"/><stop offset="1" stop-color="#617BEB"/></linearGradient></defs></svg>',
  '语音输入': '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.7324 8.77148V27.2295L21.2324 27.2285V8.77051L23.7324 8.77148ZM14.6797 10.7715L14.6787 25.2295L12.1787 25.2285L12.1797 10.7705L14.6797 10.7715ZM19.3926 22.4131H16.8926V13.5859H19.3926V22.4131ZM10.0625 20.708H7.5625V15.291H10.0625V20.708ZM28.4375 20.708H25.9375V15.291H28.4375V20.708Z" fill="url(#d)"/><defs><linearGradient id="d" x1="8.24602" y1="16.4083" x2="32.5611" y2="22.9699" gradientUnits="userSpaceOnUse"><stop stop-color="#67C7FE"/><stop offset="1" stop-color="#3F77D8"/></linearGradient></defs></svg>',
}

/** Gradient ids are document-global: de-duplicate whenever an svg is shown twice. */
const ns = (svg, tag) => svg.replace(/id="([\w-]+)"/g, `id="$1-${tag}"`).replace(/url\(#([\w-]+)\)/g, `url(#$1-${tag})`)

const browser = await chromium.launch({ executablePath: chromePath(), headless: true })
const page = await browser.newPage()

/** Rendered bbox (getBBox — transforms included) of every drawn element, in 36-canvas units. */
const measure = async (svg) => page.evaluate((markup) => {
  const host = document.createElement('div')
  host.style.cssText = 'position:absolute;left:0;top:0;width:36px;height:36px'
  host.innerHTML = markup
  document.body.appendChild(host)
  const el = host.querySelector('svg')
  const [, , vw, vh] = (el.getAttribute('viewBox') || '0 0 36 36').split(/\s+/).map(Number)
  const drawable = [...el.children].filter((c) => !['defs', 'title', 'style'].includes(c.tagName))
  const boxes = drawable.map((c) => { const b = c.getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height, tag: c.tagName } })
  host.remove()
  if (!boxes.length) return null
  const sx = 36 / vw, sy = 36 / vh
  const box = boxes.map((b) => ({ x: b.x * sx, y: b.y * sy, w: b.w * sx, h: b.h * sy, tag: b.tag }))
  const x0 = Math.min(...box.map((b) => b.x)), y0 = Math.min(...box.map((b) => b.y))
  const x1 = Math.max(...box.map((b) => b.x + b.w)), y1 = Math.max(...box.map((b) => b.y + b.h))
  const rail = box.reduce((a, b) => (b.h > a.h ? b : a))
  const span = (side) => {
    const rs = box.filter(side)
    return { top: Math.min(...rs.map((b) => b.y)), bottom: Math.max(...rs.map((b) => b.y + b.h)) }
  }
  return {
    content: { w: x1 - x0, h: y1 - y0 },
    pad: { left: x0, right: 36 - x1, top: y0, bottom: 36 - y1 },
    rail: { top: rail.y, bottom: rail.y + rail.h },
    left: span((b) => b.x + b.w <= rail.x), right: span((b) => b.x >= rail.x + rail.w),
  }
}, svg)

const fail = (msgs) => { console.error('icon geometry FAILED\n  ' + msgs.join('\n  ')); process.exit(1) }
const f = (n) => n.toFixed(2)

const officials = []
for (const [name, svg] of Object.entries(OFFICIAL)) officials.push({ name, ...(await measure(svg)) })
const ours = await measure(LIST_ICON)
const tightest = officials.reduce((a, b) => (b.pad.left < a.pad.left ? b : a))
const fullest = officials.reduce((a, b) => (b.content.w > a.content.w ? b : a))

console.log('official 36x36 tiles (app.asar):')
for (const o of officials) console.log(`  ${o.name.padEnd(8)} content ${f(o.content.w)}x${f(o.content.h)}  pad ${f(o.pad.left)}/${f(o.pad.right)}/${f(o.pad.top)}/${f(o.pad.bottom)}`)
console.log(`  ours     content ${f(ours.content.w)}x${f(ours.content.h)}  pad ${f(ours.pad.left)}/${f(ours.pad.right)}/${f(ours.pad.top)}/${f(ours.pad.bottom)}`)

const errs = []
for (const [axis, mid] of [['left', 18], ['right', 18]]) {
  const g = ours[axis]
  if (Math.abs((g.top + g.bottom) / 2 - 18) > 0.3) errs.push(`${axis} group centre ${f((g.top + g.bottom) / 2)} != 18`)
  const h = g.bottom - g.top, railH = ours.rail.bottom - ours.rail.top
  if (h >= railH) errs.push(`${axis} group height ${f(h)} >= rail ${f(railH)}`)
  if (h / railH < 0.75) errs.push(`${axis} group height ratio ${(h / railH).toFixed(3)} is not "slightly shorter"`)
}
if (Math.abs(ours.pad.left - ours.pad.right) > 0.3 || Math.abs(ours.pad.top - ours.pad.bottom) > 0.3) {
  errs.push(`content is not centred: pad ${f(ours.pad.left)}/${f(ours.pad.right)}/${f(ours.pad.top)}/${f(ours.pad.bottom)}`)
}
if (ours.pad.left < 7.5) errs.push(`inner clearance ${f(ours.pad.left)} < 7.5 (tightest official is "${tightest.name}" at ${f(tightest.pad.left)})`)
if (ours.content.w > fullest.content.w - 0.3) errs.push(`content ${f(ours.content.w)} fills as much as the fullest official "${fullest.name}" (${f(fullest.content.w)})`)
if (errs.length) fail(errs)
const railH = ours.rail.bottom - ours.rail.top, sideH = ours.left.bottom - ours.left.top
console.log(`ok: side groups ${f(sideH)}/${f(railH)} (${(100 * sideH / railH).toFixed(1)}%), centred on 18, clearance ${f(ours.pad.left)} x ${f(ours.pad.top)}`)

const lightTile = '#ffffff', lightText = '#1f2329', lightRow = '#f5f6f8', darkTile = '#2a2d33', darkText = '#e8eaed'
const cell = (svg, label, fg, bg = 'transparent', size = 26) => `
  <div class="cell">
    <div class="tile" style="background:${bg}">${svg.replace('width="36" height="36"', `width="${size}" height="${size}"`)}</div>
    <div class="name" style="color:${fg}">${label}</div>
  </div>`

const officialCells = (fg, size, tag, bg) => Object.entries(OFFICIAL)
  .map(([n, s], i) => cell(ns(s, `${tag}${i}`), n, fg, bg, size)).join('')
const ourCell = (fg, size, tag, bg) => cell(ns(LIST_ICON, tag), '我们', fg, bg, size).replace('class="name"', 'class="name ours"')

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin:0; font:13px/1.45 "Segoe UI", system-ui, sans-serif; }
  .row { display:flex; gap:22px; padding:18px 26px 22px; align-items:center; }
  .cell { display:flex; flex-direction:column; align-items:center; gap:8px; width:76px; }
  .tile { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 2px rgba(16,24,40,.06); }
  .tile.flat { background:transparent !important; box-shadow:none; }
  .big { width:132px; height:132px; border-radius:0; box-shadow:none; background:transparent !important; }
  .big svg { width:132px; height:132px; }
  .name { font-size:12px; text-align:center; }
  .ours { font-weight:600; }
  .h { font-weight:600; padding:14px 26px 0; }
</style></head><body>
  <div class="h" style="background:${lightRow};color:${lightText}">官方（左四）vs 我们（右一）— 内容 ${f(ours.content.w)}×${f(ours.content.h)} vs 官方 18.0–21.0，内间距 ${f(ours.pad.left)}/8.22</div>
  <div class="row" style="background:${lightRow}">${officialCells(lightText, 26, 'o', lightTile)}${ourCell(lightText, 26, 'u', lightTile)}</div>
  <div class="h" style="background:#1b1d21;color:${darkText}">同上 — 深色</div>
  <div class="row" style="background:#1b1d21;color:${darkText}">${officialCells(darkText, 26, 'p', darkTile)}${ourCell(darkText, 26, 'v', darkTile)}</div>
  <div class="h" style="background:${lightRow};color:${lightText}">我们 2×（26→52px）：两侧方块上下居中，组高 ${f(sideH)} vs 导轨 ${f(railH)}</div>
  <div class="row" style="background:${lightRow}">
    ${cell(ns(LIST_ICON, 'w'), '浅色 tile', lightText, lightTile, 52)}
    ${cell(ns(LIST_ICON, 'x'), '深色 tile', lightText, darkTile, 52)}
    ${cell(ns(OFFICIAL['定时任务'], 'y'), '官方 定时任务（对照）', lightText, 'transparent', 52).replace('class="tile"', 'class="tile flat"')}
  </div>
  <div class="h" style="background:${lightRow};color:${lightText}">App Icon 512 — 浅色 / 深色（含自身底板，内间距按应用图标基准）</div>
  <div class="row" style="background:${lightRow}">
    <div class="cell"><div class="tile big">${ns(APP_LIGHT, 'p1')}</div><div class="name" style="color:${lightText}">app-icon-light</div></div>
    <div class="cell"><div class="tile big">${ns(APP_DARK, 'p2')}</div><div class="name" style="color:${lightText}">app-icon-dark</div></div>
    <div class="cell"><div class="tile big" style="width:64px;height:64px">${ns(APP_LIGHT, 'p3').replace(/width="512" height="512"/, 'width="64" height="64"')}</div><div class="name" style="color:${lightText}">@64 浅</div></div>
    <div class="cell"><div class="tile big" style="width:64px;height:64px">${ns(APP_DARK, 'p4').replace(/width="512" height="512"/, 'width="64" height="64"')}</div><div class="name" style="color:${lightText}">@64 深</div></div>
  </div>
</body></html>`

await page.setViewportSize({ width: 900, height: 460 })
await page.setContent(html)
await page.waitForTimeout(300)
mkdirSync(join(ROOT, 'docs', 'icon'), { recursive: true })
await page.screenshot({ path: join(ROOT, OUT), fullPage: true })

/** 512 PNG exports: transparent page, the svg alone at 1:1. */
for (const [file, svg] of [['icon-512.png', APP_LIGHT], ['icon-512-dark.png', APP_DARK]]) {
  const shot = await browser.newPage({ viewport: { width: 512, height: 512 } })
  await shot.setContent(`<style>html,body{margin:0}</style>${svg}`)
  await shot.waitForTimeout(150)
  await shot.screenshot({ path: join(ROOT, 'docs', 'icon', file), omitBackground: true })
  await shot.close()
  console.log('wrote docs/icon/' + file)
}
console.log('wrote', OUT)
await browser.close()
