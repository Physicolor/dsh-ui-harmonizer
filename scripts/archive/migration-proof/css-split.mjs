#!/usr/bin/env node
/**
 * One-shot generator for the enhancer.module.css split (2026-09-30 refactor).
 *
 * Splits the single sheet into per-target `.module.css` fragments under
 * src/client/{harness,plugins/<pkg>,self}/ and writes src/client/styles/index.ts,
 * whose import order IS the original rule order (= the cascade order).
 *
 * Hard rules encoded here:
 *   - a fragment is a CONTIGUOUS, byte-exact slice of the original file; the
 *     only addition is a `/* @dsh-split-header ... *\/` block on top (comments
 *     are stripped by lightningcss, so the compiled CSS is untouched by them);
 *   - import order = original line order (a target may own several non-adjacent
 *     slices; they are emitted as separate files and interleaved in index.ts);
 *   - basenames are globally unique (the bundler uses basename as the
 *     `<style data-plugin-css>` tag id — see tsdown.config.ts tagId).
 *
 *   node scripts/tools/css-split.mjs          # generate (idempotent)
 *
 * Verify with scripts/tools/css-split-check.mjs.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SRC = join(ROOT, 'src', 'client', 'enhancer.module.css')

/** path (relative to src/client) | serves | why here | original line range (inclusive). */
const SPEC = [
  {
    file: 'self/sheet-tokens.module.css',
    from: 1,
    to: 12,
    serves: 'this plugin\'s own token defaults (`--enhancer-content-width`, `--enhancer-sidebar-scale`) plus the sheet\'s original preamble comment',
    why: 'those variables are this plugin\'s settings channel (state.ts writes them), not the product\'s',
  },
  {
    file: 'harness/chat-chrome-scale.module.css',
    from: 13,
    to: 59,
    serves: 'DSH\'s content-size channel (`--dsh-content-font-size` -> `--enhancer-chat-scale`) and the note that the conversation column width belongs to the product',
    why: 'the product owns both values; this sheet only derives from them',
  },
  {
    file: 'plugins/dsh-widgets/width-handle-squeeze.module.css',
    from: 60,
    to: 98,
    serves: 'dsh-widgets\' transcript rail (`body.dsx-stats-active`) - re-anchoring the product\'s width handles on the squeezed content box',
    why: 'the rail that shifts the content is dsh-widgets\'',
  },
  {
    file: 'harness/composer-and-menu.module.css',
    from: 99,
    to: 155,
    serves: 'DSH\'s composer bar (trigger pills, add/send icons) and the ui-primitives dropdown Menu',
    why: 'both are product surfaces, scaled through the product\'s own channel',
  },
  {
    file: 'harness/sidebar-chrome.module.css',
    from: 156,
    to: 248,
    serves: 'DSH sidebar slots: new-session row, brand wordmark, logo row, settings trigger, footer badge, workspaces region',
    why: 'every selector is a product slot name (`data-slot=...`)',
  },
  {
    file: 'self/settings-section-headers.module.css',
    from: 249,
    to: 292,
    serves: 'this plugin\'s settings-header normalizer - the `enhc-page-title` / `enhc-page-intro` skeleton it writes into `settings.section`',
    why: 'the classes are this plugin\'s own; without it they never exist',
  },
  {
    file: 'harness/settings-and-crumb.module.css',
    from: 293,
    to: 326,
    serves: 'the product\'s session-title crumb buttons and the plugin-manager version picker select',
    why: 'both are product chrome on product slots',
  },
  {
    file: 'self/settings-controls.module.css',
    from: 327,
    to: 485,
    serves: 'this plugin\'s own settings-row controls: `.uitw-stepper*`, `.uitw-segmented*`, `.uitw-switch*`',
    why: '`.uitw-*` is this plugin\'s control namespace (components.tsx renders it)',
  },
  {
    file: 'plugins/dsh-genui/genui-switch.module.css',
    from: 486,
    to: 567,
    serves: 'dsh-genui\'s `V1MMBW_switch`, with the shared verdict note covering every third-party on/off control',
    why: 'the rules only match dsh-genui\'s hashed classes',
  },
  {
    file: 'plugins/commandcode-provider/cc-switch-focus-ring.module.css',
    from: 568,
    to: 574,
    serves: '@mars-sea/dsh-commandcode-provider\'s `.cc-toggle` focus ring',
    why: 'one rule, one third-party class',
  },
  {
    file: 'self/range-slider.module.css',
    from: 575,
    to: 607,
    serves: 'this plugin\'s own range control skin (`input.uitw-slider`)',
    why: '`.uitw-slider` is this plugin\'s class',
  },
  {
    file: 'plugins/dsh-better-sidebar/toggle-buttons.module.css',
    from: 608,
    to: 652,
    serves: 'dsh-better-sidebar\'s toggle buttons (`.nArs4W_toggleButton`) restyled as session-header capsules',
    why: 'the selectors are that plugin\'s hashed classes',
  },
  {
    file: 'plugins/dsh-widgets/capsule-no-override-note.module.css',
    from: 653,
    to: 660,
    serves: 'a comment only: dsh-widgets\' `.dsx-stats-capsule[aria-pressed=true]` is deliberately left alone',
    why: 'it documents a dsh-widgets surface; kept as its own slice to preserve byte order',
  },
  {
    file: 'plugins/dsh-better-sidebar/panel-chrome.module.css',
    from: 661,
    to: 692,
    serves: 'dsh-better-sidebar\'s right/bottom panel frames (`nArs4W_panel`, `nArs4W_bottomPanel`)',
    why: 'third-party hashed classes',
  },
  {
    file: 'harness/session-header.module.css',
    from: 693,
    to: 808,
    serves: 'DSH\'s conversation header: geometry, opaque surface, divider removal, relocated session tabs',
    why: 'the selectors are the product\'s header slots; the single better-sidebar fallback var is inert without it',
  },
  {
    file: 'plugins/dsh-better-sidebar/panel-tabs.module.css',
    from: 809,
    to: 887,
    serves: 'dsh-better-sidebar\'s panel tab bar, tabs, close/plus buttons and explorer column',
    why: 'third-party hashed classes',
  },
  {
    file: 'plugins/dsh-better-sidebar/root-squeeze.module.css',
    from: 888,
    to: 917,
    serves: 'dsh-better-sidebar\'s layout push - neutralizing `#root` and yielding `--dsh-sidebar-width` on the session viewArea',
    why: 'the squeeze and the variable are that plugin\'s',
  },
  {
    file: 'harness/flow-item-rendering.module.css',
    from: 918,
    to: 932,
    serves: 'DSH\'s conversation flow items (`content-visibility: auto`)',
    why: 'a product-surface rendering optimisation that also serves ordinary scrolling',
  },
  {
    file: 'plugins/dsh-better-sidebar/composer-seat-yield.module.css',
    from: 933,
    to: 951,
    serves: 'the product\'s composer seat yielding `--dsh-sidebar-width`',
    why: 'the property value is better-sidebar\'s published variable',
  },
  {
    file: 'harness/frame-column-transition.module.css',
    from: 952,
    to: 989,
    serves: 'DSH 0.2.0\'s AppFrame grid-template-columns transition',
    why: 'it patches the product\'s own frame animation',
  },
  {
    file: 'plugins/dsh-widgets/rail-overlay-squeeze.module.css',
    from: 990,
    to: 1010,
    serves: 'dsh-widgets\' rail against the product\'s trajectory composer-overlay seat',
    why: 'the rule only comes alive while `body.dsx-stats-active` is on',
  },
  {
    file: 'self/center-card-overlay.module.css',
    from: 1011,
    to: 1102,
    serves: 'this plugin\'s rounded center-column card (`enhc-center-card`, shell.overlay + header inset line)',
    why: 'it is this plugin\'s own overlay (card-overlay.tsx)',
  },
  {
    file: 'self/doctor-page.module.css',
    from: 1103,
    to: 1203,
    serves: 'this plugin\'s Harmony Doctor page (`enhc-doctor*`)',
    why: 'the page is this plugin\'s own',
  },
  {
    file: 'plugins/dsh-genui/width-hygiene.module.css',
    from: 1204,
    to: 1253,
    serves: 'dsh-genui\'s render_ui panels and tool cards - width hygiene for panelToggle / banner / steps',
    why: 'the selectors are dsh-genui\'s `data-genui-*` contract and its hashed classes',
  },
]

const original = readFileSync(SRC, 'utf8')
if (original.charCodeAt(0) === 0xfeff) throw new Error('original file starts with a BOM')
if (original.includes('\r')) throw new Error('original file contains CR - refusing to split')
const lines = original.split('\n')

// Tiling check: the ranges must cover the file exactly, in order.
let cursor = 1
for (const s of SPEC) {
  if (s.from !== cursor) throw new Error(`${s.file}: range starts at L${s.from}, expected L${cursor}`)
  if (s.to < s.from || s.to > lines.length) throw new Error(`${s.file}: bad range L${s.from}-L${s.to}`)
  cursor = s.to + 1
}
if (cursor !== lines.length + 1) throw new Error(`ranges stop at L${cursor - 1}, file has ${lines.length} lines`)

const seen = new Set()
for (const s of SPEC) {
  const base = s.file.split('/').pop()
  if (seen.has(base)) throw new Error(`duplicate basename ${base} - tagId collision`)
  seen.add(base)
}

const bodies = []
for (const s of SPEC) {
  const body = lines.slice(s.from - 1, s.to).join('\n')
  bodies.push(body)
  const header = [
    '/* @dsh-split-header',
    ` * ${s.file} - Serves: ${s.serves}.`,
    ` * Why here: ${s.why}.`,
    ` * Origin: src/client/enhancer.module.css L${s.from}-L${s.to}, byte-identical below; this header is the only addition.`,
    ' */',
    '',
  ].join('\n')
  const abs = join(ROOT, 'src', 'client', s.file)
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, header + body + '\n', 'utf8')
}

// The split must reconstruct the original byte for byte (modulo the trailing LF
// every fragment file carries for POSIX hygiene).
const rebuilt = bodies.join('\n')
if (rebuilt !== original) throw new Error('rebuilt text differs from the original - aborting')

const index = [
  '/* Sheet split of src/client/enhancer.module.css - IMPORT ORDER IS CASCADE ORDER.',
  ' * Each entry is a byte-exact slice of the original; do not reorder or re-sort. */',
  ...SPEC.map((s) => `import '../${s.file}'`),
  '',
].join('\n')
mkdirSync(join(ROOT, 'src', 'client', 'styles'), { recursive: true })
writeFileSync(join(ROOT, 'src', 'client', 'styles', 'index.ts'), index, 'utf8')

console.log(`[css-split] wrote ${SPEC.length} fragments + styles/index.ts`)
for (const s of SPEC) {
  const bytes = Buffer.byteLength(readFileSync(join(ROOT, 'src', 'client', s.file), 'utf8'))
  console.log(`  ${s.file.padEnd(58)} L${String(s.from).padStart(4)}-${String(s.to).padEnd(4)} ${String(bytes).padStart(6)} B`)
}
