/**
 * dsh-ui-harmonizer — what does the built-in plugin list read for an icon?
 *
 * The Settings → plugin list shows a brand icon for `dsh-better-sidebar` and the
 * generic placeholder for our plugins. That package declares `"icon": "./icon.svg"`
 * and ships the file, so the question is what the PRODUCT's own bundles do — i.e.
 * which fields/paths the inventory reads, and what an official icon looks like.
 *
 *   node scripts/probes/harness/official-plugin-icons.mjs [--dump <substring>]
 */
import { readFileSync } from 'node:fs'

const ASAR = process.env.DSH_ASAR ?? 'D:/Users/12404/AppData/Local/Programs/DeepSeek Harness/resources/app.asar'
const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const DUMP = arg('--dump', null)

const fd = readFileSync(ASAR)
const jsonLen = fd.readUInt32LE(12)
const header = JSON.parse(fd.subarray(16, 16 + jsonLen).toString('utf8'))
const dataStart = 16 + jsonLen

const entries = []
const walk = (node, prefix) => {
  for (const [name, val] of Object.entries(node.files ?? {})) {
    const p = prefix === '' ? name : `${prefix}/${name}`
    if (val.files) walk(val, p)
    else entries.push({ path: p, offset: Number(val.offset), size: val.size })
  }
}
walk(header, '')
const read = (e) => fd.subarray(dataStart + e.offset, dataStart + e.offset + e.size).toString('utf8')

/** Every `@deepseek-ai/*` package.json that declares an icon, with the file it names. */
const declared = []
for (const e of entries.filter((x) => /@deepseek-ai\/[^/]+\/package\.json$/.test(x.path))) {
  let pkg
  try { pkg = JSON.parse(read(e)) } catch { continue }
  if (typeof pkg.icon !== 'string') continue
  const dir = e.path.replace(/\/package\.json$/, '')
  const iconPath = `${dir}/${pkg.icon.replace(/^\.\//, '')}`
  const iconEntry = entries.find((x) => x.path === iconPath)
  declared.push({ pkg: pkg.name, version: pkg.version, icon: pkg.icon, present: iconEntry !== undefined, bytes: iconEntry?.size ?? 0 })
}
console.log('official packages declaring an icon:', declared.length)
for (const d of declared.slice(0, 10)) console.log(`  ${d.pkg}@${d.version}  ${d.icon}  present=${d.present} ${d.bytes}B`)

const svgFiles = entries.filter((x) => /\.svg$/.test(x.path) && x.path.includes('@deepseek-ai'))
console.log('official .svg files:', svgFiles.length, svgFiles.slice(0, 6).map((x) => x.path).join(', '))

if (DUMP !== null) {
  const hit = entries.find((x) => x.path.includes(DUMP) && /\.svg$/.test(x.path))
  if (hit === undefined) console.log(`\n(no svg matching "${DUMP}")`)
  else { console.log(`\n--- ${hit.path} (${hit.size}B) ---`); console.log(read(hit).slice(0, 1200)) }
}

const PKG = arg('--pkg', null)
if (PKG !== null) {
  const hit = entries.find((x) => x.path.includes(PKG) && /\/package\.json$/.test(x.path))
  if (hit === undefined) console.log(`\n(no package.json matching "${PKG}")`)
  else {
    console.log(`\n--- ${hit.path} ---`)
    const pkg = JSON.parse(read(hit))
    console.log(JSON.stringify({ name: pkg.name, version: pkg.version, description: pkg.description, displayName: pkg.displayName, icon: pkg.icon, dsh: pkg.dsh }, null, 1))
  }
}
