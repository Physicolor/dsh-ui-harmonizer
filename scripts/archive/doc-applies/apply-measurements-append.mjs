/**
 * Append this round's measurements to docs/MEASUREMENTS.md (UTF-8 exact).
 * Run: node scripts/apply-measurements-append.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'D:/dsh-home/plugins/dsh-ui-harmonizer/docs/MEASUREMENTS.md'
const MARK = '## 2026-09-30 settings headers, row popup width, stylesheet keeper'

const SECTION = `
${MARK}

Environment: live DSH web profile (web2, DSH 0.2.0-rc.2) on this machine,
1560x960 viewport, plugins: dsh-widgets, dsh-usage-center, dsh-ui-harmonizer,
dsh-genui, dsh-notification, research-cordis, dshmarket, dsh-better-sidebar.
Raw JSON in \`D:/dsh-home/probe-ui/settings-headers/\`, \`.../menu-anchor/\`,
\`.../style-keeper/\`.

### Settings page headers — one recipe on every page

Probe: \`node scripts/probe-settings-headers.mjs http://127.0.0.1:3080\` (opens the
panel, walks all 11 nav items, records the section root, every title/description
candidate with computed typography, and a screenshot per page).

| Page | Title node after the reconciler | Intro node | Computed |
| --- | --- | --- | --- |
| 通用设置 | \`h2.enhc-page-title\` (React recipe) | \`p.enhc-page-intro\` | 18/26 600 · 13/20 + hairline |
| 模型 | \`h2.zGbnIq_title.enhc-page-title\` | \`p.zGbnIq_intro.enhc-page-intro\` | idem |
| Command Code | \`h2.cc-title.enhc-page-title\` | \`p.cc-intro.enhc-page-intro\` | idem (was 16/24 500, no hairline, never matched by the old \`_title\` suffix rules) |
| 内置插件 | \`h2.pbvGtq_heading.enhc-page-title\` | \`p.pbvGtq_intro.enhc-page-intro\` | idem |
| Agent 预设 | \`h2.rtSEdW_title.enhc-page-title\` | \`p.rtSEdW_intro.enhc-page-intro\` | idem |
| UI 兼容性 | \`h2.enhc-page-title\` (React recipe) | \`p.enhc-page-intro\` | idem |
| 插件市场 | \`h2.nUhMVa_title.enhc-page-title\` | \`p...\` (the market's own sub node) | idem |
| 通知 | \`h2.dsh_notification_title.enhc-page-title\` | \`p.dsh_notification_subtitle.enhc-page-intro\` | idem, head box adopted: parent \`dsh_notification_heading.enhc-page-head\`, weight reads back 400 (a first version stamped the small wrapper as the title and the description inherited 600 — caught by this probe) |
| 侧边卡片 | injected \`h2.enhc-page-title\` (label from the active nav item) | \`p._2vuxea_intro.enhc-page-intro\` | idem |

Structural facts the probe pins down:

- The official pages disagree with each other (models 16/500 + 14/22, agent
  presets 18/600 + 13/20) — the "official recipe" only exists after
  normalization, which is why one owner matters.
- A head box is adopted only when its children really are just the title and the
  description: the Agent-presets \`rtSEdW_section\` root (title + intro + two group
  blocks) must NOT be stamped, or the whole page's rhythm collapses to a 4px gap.
  Measured after the fix: \`section.rtSEdW_section\` carries no \`enhc-page-head\`.
- The \`-8px\` compression is conditional on the container gap: the reconciler
  flags \`data-enhc-gap="tight"\` only when \`rowGap\` is the official 12px.

### Row popup width

Probe: \`node scripts/probe-menu-anchor.mjs http://127.0.0.1:3080\`. The desktop
account menu itself is desktop-only (the account plugin registers into
\`settings.launcher\` and only runs with the preload bridge), so the mechanism is
driven with a fixture that reproduces the Menu primitive's mark-up — a
\`width:100%\` anchor inside the launcher seat plus a portalled \`[role=menu]\` card
in \`<body>\` — and checked against a negative control.

| Case | Row | Card | Inline style written |
| --- | --- | --- | --- |
| Fixture inside \`settings.launcher\` | 234px | 234px | \`width/min-width/max-width: 234px; box-sizing: border-box\` |
| Fixture outside the seat (composer) | 812px | 226px (own recipe) | none — no marker attribute |

\`border-box\` matters: without it the product's own 4px list padding made the card
8px wider than the row (measured 242px against a 234px row).

### Third-party stylesheet keeper

Probe: \`node scripts/probe-style-keeper.mjs http://127.0.0.1:3080\` — opens
Settings → 通知 and reproduces the loader's theft with its own semantics
(\`setAttribute('data-plugin', thief)\` + \`remove()\`).

| Step | \`#dsh-notification-style\` | \`.dsh_notification_card\` |
| --- | --- | --- |
| baseline | present, 38 rules | \`1px\` border, \`12px\` radius, \`flex\` |
| after the theft | absent | \`0px\`, \`0px\`, \`block\` (the reported "page not drawn") |
| after the grace period | restored, 38 rules | \`1px\`, \`12px\`, \`flex\` |

9/9 checks: baseline styled; the theft really removes the styles; the keeper
restores them; the card is styled again; no duplicate when the owner re-injects
first; bundler-emitted sheets (\`data-plugin-css\`) are left alone; an
already-claimed hand-written sheet (the state a long-running session is in) is kept
too; and its stolen \`data-plugin\` claim is not restored.

Root cause (product loader, verifiable in the shipped bundle): \`claimStyles(id)\`
adopts **every** \`style:not([data-plugin])\` in the document for the plugin
materializing at that moment, and \`removeOwnedStyles(id)\` deletes every
\`style[data-plugin=id]\` when that adopter reloads, unloads or is pruned
(\`entries.js replace/reconcile/prune\`).

### CSS hygiene

\`src/client/enhancer.module.css\` carried 48 mojibake characters in comments from
an old PowerShell \`Get-Content -Raw\` / \`Set-Content\` round trip (file re-encoded
as GBK: \`—\` → \`鈥?\`, \`×\` → \`脳\`, one Chinese phrase destroyed, and the byte after
each em dash — a space — replaced by the lossy placeholder). Repaired by
\`scripts/fix-css-mojibake.mjs\` + \`scripts/fix-css-emdash-space.mjs\` (Node, UTF-8
in/out). Comment-only damage; the build was never affected.
`

const text = readFileSync(FILE, 'utf8')
if (text.includes(MARK)) {
  console.log('already present')
} else {
  writeFileSync(FILE, `${text.replace(/\s*$/u, '')}\n${SECTION}`, 'utf8')
  console.log(`appended to ${FILE}`)
}
