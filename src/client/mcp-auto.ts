/**
 * Harness UI Enhancer — MCP + Automation.
 *
 * Two INDEPENDENT sidebar-foot controls, each styled exactly like the official
 * Settings trigger (`VOzbGW_trigger`):
 *   - full sidebar width, only horizontal padding, no permanent pill shape
 *   - hover shows a rounded-rect background
 *   - when the sidebar collapses to rail width, the text label hides and only
 *     the icon remains
 *
 * Each opens its OWN Settings-style modal dialog with the exact same chrome as
 * the product Settings panel: a left nav rail (`VOzbGW_nav` lookalike) and a
 * right content column with header/actions/close/options.
 *
 * No product class names are read or written. Everything is built with
 * `--dsw-alias-*` / `--dsw-font-*` tokens and scoped to our own class names.
 */

import * as React from 'react'

/** Icon paths (reused from ui-primitives gear/clock glyphs). */
const PLUG_PATH =
  'M11 1.5a.6.6 0 0 1 1.2 0V5h.8a.5.5 0 0 1 .5.5v5a3 3 0 0 1-3 3h2.5v1H3v-1h2.5a3 3 0 0 1-3-3v-5A.5.5 0 0 1 3 5h.8V1.5a.6.6 0 0 1 1.2 0V5h5V1.5Z'
const CLOCK_PATH =
  'M8 0.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 1.6a5.9 5.9 0 1 1 0 11.8 5.9 5.9 0 0 1 0-11.8ZM8 3a.8.8 0 0 1 .8.8v3.7l2.4 1.4a.8.8 0 0 1-.8 1.4L7.2 8.5V3.8A.8.8 0 0 1 8 3Z'
const CLOSE_PATH =
  'M14.1168 13.197L13.197 14.1167L1.8833 2.80303L2.80309 1.88324L14.1168 13.197ZM13.197 1.88326L14.1168 2.80305L2.80309 14.1168L1.8833 13.197L13.197 1.88326Z'

function Icon({ d, size = 16, className }: { d: string; size?: number; className?: string }): React.ReactElement {
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true, className },
    React.createElement('path', { d, fill: 'currentColor' }))
}

/** Minimal client↔host JSON call (same-origin route). */
async function api(request) {
  const response = await fetch('/enhancer/enhancer-api', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(request) })
  const text = await response.text()
  let data = {}
  try {
    data = JSON.parse(text)
  } catch {
    /* non-JSON error body */
  }
  if (!response.ok || data.ok !== true) {
    const prefix = response.status === 405 ? '后端路由未就绪，请重启 dsh web 后重试。' : ''
    throw new Error(prefix + (data.error || `HTTP ${response.status}`))
  }
  return data
}

/* ------------------------------------------------------------------ */
/* independent dialog visibility state                                 */
/* ------------------------------------------------------------------ */

interface DialogState {
  mcpOpen: boolean
  autoOpen: boolean
}
const state: DialogState = { mcpOpen: false, autoOpen: false }
const listeners = new Set<() => void>()
function notify() {
  for (const l of listeners) l()
}
function useDialogState(): [DialogState, (patch: Partial<DialogState>) => void] {
  const [, force] = React.useReducer((c: number) => c + 1, 0)
  React.useEffect(() => {
    listeners.add(force)
    return () => { listeners.delete(force) }
  }, [])
  const patch = (p: Partial<DialogState>) => { Object.assign(state, p); notify() }
  return [state, patch]
}

/* ------------------------------------------------------------------ */
/* sidebar-foot trigger (exact Settings-trigger look + rail collapse)  */
/* ------------------------------------------------------------------ */

const RAIL_COLLAPSE_WIDTH = 80

function useCollapsed(ref: React.RefObject<HTMLElement | null | undefined>): boolean {
  const [collapsed, setCollapsed] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? el.clientWidth
      setCollapsed(width < RAIL_COLLAPSE_WIDTH)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return collapsed
}

/** One Settings-trigger-style foot button. */
function TriggerButton({
  kind,
  label,
  onClick,
}: {
  kind: 'mcp' | 'auto'
  label: string
  onClick: () => void
}): React.ReactElement {
  const ref = React.useRef<HTMLElement | null>(null)
  const collapsed = useCollapsed(ref)
  return React.createElement('button', {
    ref,
    type: 'button',
    className: 'enhancer-trigger',
    title: label,
    'aria-label': label,
    onClick,
  }, [
    React.createElement(Icon, { key: 'i', d: kind === 'mcp' ? PLUG_PATH : CLOCK_PATH, size: 16, className: 'enhancer-trigger-icon' }),
    React.createElement('span', { key: 'l', className: collapsed ? 'enhancer-trigger-label enhancer-trigger-label-hidden' : 'enhancer-trigger-label' }, label),
  ])
}

/**
 * Two trigger buttons stacked vertically, wrapped in a transparent container
 * (zero padding) that goes inside one sidebar.footer.action slot entry.
 * The wrapper does NOT add any spacing — the shell controls the gap between
 * this entry and the settings trigger, while the gap between MCP and 自动化
 * is our own controlled value.
 */
export function AutoLauncher(): React.ReactElement {
  const [, patch] = useDialogState()
  return React.createElement('div', { className: 'enhancer-trigger-group' }, [
    React.createElement(TriggerButton, { key: 'mcp', kind: 'mcp', label: 'MCP', onClick: () => patch({ mcpOpen: true }) }),
    React.createElement(TriggerButton, { key: 'auto', kind: 'auto', label: '自动化', onClick: () => patch({ autoOpen: true }) }),
  ])
}

/* ------------------------------------------------------------------ */
/* Settings-style modal chrome                                         */
/* ------------------------------------------------------------------ */

interface NavCell {
  id: string
  label: string
  icon: string
  active?: boolean
}

function useEscClose(open: boolean, onClose: () => void): void {
  React.useEffect(() => {
    if (!open) return
    const priorOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = priorOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])
}

function SettingsDialog({
  navTitle,
  navCells,
  title,
  subtitle,
  action,
  onClose,
  children,
}: {
  navTitle: string
  navCells: NavCell[]
  title: string
  subtitle: string
  action?: React.ReactNode
  onClose: () => void
  children: React.ReactNode
}): React.ReactElement {
  return React.createElement('div', { className: 'enhancer-overlay', onClick: onClose }, [
    React.createElement('div', {
      key: 'panel',
      className: 'enhancer-panel',
      role: 'dialog',
      'aria-modal': true,
      'aria-label': title,
      onClick: (e) => e.stopPropagation(),
    }, [
      React.createElement('nav', { key: 'nav', className: 'enhancer-nav' }, [
        React.createElement('div', { key: 'nt', className: 'enhancer-navTitle' }, navTitle),
        React.createElement('div', { key: 'nl', className: 'enhancer-navList' },
          navCells.map((cell) => React.createElement('button', {
            key: cell.id,
            type: 'button',
            className: cell.active ? 'enhancer-navCell enhancer-navCell-active' : 'enhancer-navCell',
            'aria-current': cell.active ? 'true' : undefined,
          }, [
            React.createElement(Icon, { key: 'i', d: cell.icon, size: 16, className: 'enhancer-navIcon' }),
            React.createElement('span', { key: 'l', className: 'enhancer-navLabel' }, cell.label),
          ]))),
      ]),
      React.createElement('div', { key: 'right', className: 'enhancer-right' }, [
        React.createElement('div', { key: 'header', className: 'enhancer-header' }, [
          React.createElement('div', { key: 'hb', className: 'enhancer-headingBox' }, [
            React.createElement('h2', { key: 'h', className: 'enhancer-title' }, title),
            React.createElement('p', { key: 's', className: 'enhancer-subtitle' }, subtitle),
          ]),
          React.createElement('div', { key: 'actions', className: 'enhancer-headerActions' }, action),
          React.createElement('button', { key: 'close', type: 'button', className: 'enhancer-close', 'aria-label': '关闭', onClick: onClose },
            React.createElement(Icon, { d: CLOSE_PATH, size: 14 })),
        ]),
        React.createElement('div', { key: 'options', className: 'enhancer-options' }, children),
      ]),
    ]),
  ])
}

/* ------------------------------------------------------------------ */
/* shared form / row styles                                            */
/* ------------------------------------------------------------------ */

const inputClass = 'enhancer-input'
const textareaClass = 'enhancer-textarea'
const pillBtnClass = 'enhancer-pillBtn'
const dangerBtnClass = 'enhancer-dangerBtn'
const ghostBtnClass = 'enhancer-ghostBtn'
const toggleOnClass = 'enhancer-toggleOn'
const toggleOffClass = 'enhancer-toggleOff'

/* ------------------------------------------------------------------ */
/* MCP panel                                                           */
/* ------------------------------------------------------------------ */

function McpPanel() {
  const [servers, setServers] = React.useState<Array<Record<string, unknown>>>([])
  const [busy, setBusy] = React.useState(false)
  const [err, setErr] = React.useState('')
  const [name, setName] = React.useState('')
  const [command, setCommand] = React.useState('')
  const refresh = async () => {
    try {
      const r = await api({ kind: 'mcp/list' })
      setServers(Array.isArray(r.servers) ? r.servers : [])
      setErr('')
    } catch (e) {
      setErr(String(e instanceof Error ? e.message : e))
    }
  }
  React.useEffect(() => { void refresh() }, [])
  const add = async () => {
    if (!name.trim() || !command.trim()) return
    setBusy(true)
    try {
      await api({ kind: 'mcp/apply', op: 'add', serverName: name.trim(), server: { serverName: name.trim(), transport: 'stdio', command: command.trim() } })
      setName(''); setCommand('')
      await refresh()
    } catch (e) {
      setErr(String(e instanceof Error ? e.message : e))
    } finally {
      setBusy(false)
    }
  }
  const remove = async (serverName: string) => {
    try {
      await api({ kind: 'mcp/apply', op: 'remove', serverName })
      await refresh()
    } catch (e) {
      setErr(String(e instanceof Error ? e.message : e))
    }
  }

  return React.createElement('div', { className: 'enhancer-section' }, [
    servers.length === 0
      ? React.createElement('div', { key: 'empty', className: 'enhancer-empty' }, '尚未配置 MCP 服务器。')
      : servers.map((s) => React.createElement('div', { key: String(s.serverName), className: 'enhancer-row' }, [
          React.createElement(Icon, { key: 'i', d: PLUG_PATH, size: 16, className: 'enhancer-rowIcon' }),
          React.createElement('div', { key: 'text', className: 'enhancer-rowText' }, [
            React.createElement('div', { key: 't', className: 'enhancer-rowTitle' }, String(s.serverName)),
            React.createElement('div', { key: 'd', className: 'enhancer-rowDesc' }, String(s.command || s.url || s.transport)),
          ]),
          React.createElement('button', { key: 'rm', type: 'button', className: dangerBtnClass, onClick: () => void remove(String(s.serverName)) }, '移除'),
        ])),
    React.createElement('div', { key: 'form', className: 'enhancer-form' }, [
      React.createElement('input', { key: 'name', className: inputClass, placeholder: '服务器名 (serverName)', value: name, onChange: (e) => setName(e.target.value) }),
      React.createElement('input', { key: 'cmd', className: inputClass, placeholder: '启动命令 (stdio, 如 npx -y …)', value: command, onChange: (e) => setCommand(e.target.value) }),
      React.createElement('button', { key: 'add', type: 'button', className: pillBtnClass, disabled: busy || !name.trim() || !command.trim(), onClick: () => void add() }, busy ? '添加中…' : '添加 MCP 服务器'),
    ]),
    err !== '' ? React.createElement('div', { key: 'err', className: 'enhancer-error' }, err) : null,
  ])
}

export function McpDialog(): React.ReactElement | null {
  const [s, patch] = useDialogState()
  const close = () => patch({ mcpOpen: false })
  useEscClose(s.mcpOpen, close)
  if (!s.mcpOpen) return null
  return React.createElement(SettingsDialog, {
    navTitle: 'MCP',
    navCells: [{ id: 'mcp', label: 'MCP 服务器', icon: PLUG_PATH, active: true }],
    title: 'MCP 服务器',
    subtitle: '管理 dsh-mcp-client 服务器条目，写入 profiles/web/cordis.patch.yml，实时生效。',
    onClose: close,
  }, React.createElement(McpPanel))
}

/* ------------------------------------------------------------------ */
/* Automation (scheduled tasks) panel                                  */
/* ------------------------------------------------------------------ */

interface Task {
  id: string
  name: string
  workspace: string
  prompt: string
  frequencyMinutes: number
  enabled: boolean
  nextAt?: number
  lastRunAt?: number
  history?: Array<{ at: number; ok: boolean; note: string; sessionId?: string }>
}

function formatTime(ts?: number): string {
  return ts === undefined ? '—' : new Date(ts).toLocaleString()
}

function TaskItem({ task, onChanged }: { task: Task; onChanged: () => void }) {
  const [expanded, setExpanded] = React.useState(false)
  const [err, setErr] = React.useState('')
  const [running, setRunning] = React.useState(false)

  const toggle = async () => {
    try { await api({ kind: 'tasks/toggle', id: task.id }); onChanged() } catch (e) { setErr(String(e instanceof Error ? e.message : e)) }
  }
  const runNow = async () => {
    setRunning(true)
    try { await api({ kind: 'tasks/run-now', id: task.id }); onChanged() } catch (e) { setErr(String(e instanceof Error ? e.message : e)) } finally { setRunning(false) }
  }
  const remove = async () => {
    try { await api({ kind: 'tasks/delete', id: task.id }); onChanged() } catch (e) { setErr(String(e instanceof Error ? e.message : e)) }
  }

  const history = Array.isArray(task.history) ? task.history : []

  return React.createElement('div', { className: 'enhancer-task' }, [
    React.createElement('div', { key: 'row', className: 'enhancer-row' }, [
      React.createElement(Icon, { key: 'i', d: CLOCK_PATH, size: 16, className: 'enhancer-rowIcon' }),
      React.createElement('div', { key: 'text', className: 'enhancer-rowText' }, [
        React.createElement('div', { key: 't', className: 'enhancer-rowTitle' }, task.name),
        React.createElement('div', { key: 'd', className: 'enhancer-rowDesc' },
          `每 ${task.frequencyMinutes} 分钟 · 下次 ${formatTime(task.nextAt)} · 上次 ${task.lastRunAt !== undefined ? formatTime(task.lastRunAt) : '从未运行'}`),
      ]),
      React.createElement('button', {
        key: 'toggle',
        type: 'button',
        className: task.enabled ? toggleOnClass : toggleOffClass,
        onClick: () => void toggle(),
      }, task.enabled ? '已启用' : '已暂停'),
      React.createElement('button', { key: 'run', type: 'button', className: ghostBtnClass, disabled: running, onClick: () => void runNow() }, running ? '运行中…' : '立即运行'),
      React.createElement('button', { key: 'expand', type: 'button', className: ghostBtnClass, onClick: () => setExpanded((v) => !v) }, expanded ? '收起' : '详情'),
      React.createElement('button', { key: 'del', type: 'button', className: dangerBtnClass, onClick: () => void remove() }, '删除'),
    ]),
    expanded
      ? React.createElement('div', { key: 'detail', className: 'enhancer-taskDetail' }, [
          React.createElement('div', { key: 'ws', className: 'enhancer-rowDesc' }, `工作区: ${task.workspace || '（默认）'}`),
          React.createElement('div', { key: 'pr', className: 'enhancer-taskPrompt' }, task.prompt),
          history.length > 0
            ? React.createElement('div', { key: 'hist', className: 'enhancer-history' },
                history.slice(-5).reverse().map((h, idx) => React.createElement('div', { key: `${h.at}-${idx}`, className: 'enhancer-historyItem' }, [
                  React.createElement('span', { key: 't', className: 'enhancer-historyTime' }, formatTime(h.at)),
                  React.createElement('span', { key: 'o', className: h.ok ? 'enhancer-historyOk' : 'enhancer-historyFail' }, h.ok ? '✓' : '✗'),
                  React.createElement('span', { key: 'n', className: 'enhancer-historyNote' }, String(h.note ?? '')),
                ])))
            : null,
          err !== '' ? React.createElement('div', { key: 'err', className: 'enhancer-error' }, err) : null,
        ])
      : (err !== '' ? React.createElement('div', { key: 'err', className: 'enhancer-error' }, err) : null),
  ])
}

function AutoPanel() {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [err, setErr] = React.useState('')
  const [showForm, setShowForm] = React.useState(false)
  const [creating, setCreating] = React.useState(false)
  const [name, setName] = React.useState('')
  const [workspace, setWorkspace] = React.useState('')
  const [prompt, setPrompt] = React.useState('')
  const [freq, setFreq] = React.useState('60')

  const refresh = async () => {
    try {
      const r = await api({ kind: 'tasks/list' })
      setTasks(Array.isArray(r.tasks) ? r.tasks : [])
      setErr('')
    } catch (e) {
      setErr(String(e instanceof Error ? e.message : e))
    }
  }
  React.useEffect(() => { void refresh() }, [])

  const create = async () => {
    if (!name.trim() || !prompt.trim()) return
    setCreating(true)
    try {
      await api({ kind: 'tasks/create', task: { name: name.trim(), workspace: workspace.trim(), prompt: prompt.trim(), frequencyMinutes: Number(freq) || 60 } })
      setName(''); setWorkspace(''); setPrompt(''); setFreq('60'); setShowForm(false)
      await refresh()
    } catch (e) {
      setErr(String(e instanceof Error ? e.message : e))
    } finally {
      setCreating(false)
    }
  }

  return React.createElement('div', { className: 'enhancer-section' }, [
    React.createElement('button', { key: 'add', type: 'button', className: pillBtnClass, onClick: () => setShowForm((v) => !v) }, showForm ? '收起新建表单' : '+ 新建定时任务'),
    showForm
      ? React.createElement('div', { key: 'form', className: 'enhancer-form enhancer-form-bordered' }, [
          React.createElement('label', { key: 'l1', className: 'enhancer-fieldLabel' }, '任务名称'),
          React.createElement('input', { key: 'f1', className: inputClass, placeholder: '如：每日晨间摘要', value: name, onChange: (e) => setName(e.target.value) }),
          React.createElement('label', { key: 'l2', className: 'enhancer-fieldLabel' }, '工作区'),
          React.createElement('input', { key: 'f2', className: inputClass, placeholder: '工作区目录路径（留空使用当前工作区）', value: workspace, onChange: (e) => setWorkspace(e.target.value) }),
          React.createElement('label', { key: 'l3', className: 'enhancer-fieldLabel' }, '提示词'),
          React.createElement('textarea', { key: 'f3', className: textareaClass, placeholder: '要发送给新会话的提示词…', rows: 4, value: prompt, onChange: (e) => setPrompt(e.target.value) }),
          React.createElement('label', { key: 'l4', className: 'enhancer-fieldLabel' }, '执行频率（分钟）'),
          React.createElement('input', { key: 'f4', className: inputClass, inputMode: 'numeric', placeholder: '60', value: freq, onChange: (e) => setFreq(e.target.value) }),
          React.createElement('button', { key: 'go', type: 'button', className: pillBtnClass, disabled: creating || !name.trim() || !prompt.trim(), onClick: () => void create() }, creating ? '创建中…' : '创建定时任务'),
        ])
      : null,
    tasks.length === 0 && !showForm
      ? React.createElement('div', { key: 'empty', className: 'enhancer-empty' }, '还没有定时任务。点击「新建定时任务」创建一个。')
      : tasks.map((t) => React.createElement(TaskItem, { key: t.id, task: t, onChanged: () => void refresh() })),
    React.createElement('div', { key: 'hint', className: 'enhancer-hint' },
      '定时任务到达执行时间时，会在工作区中新建一个会话并发送预设提示词（等价于 WorkBuddy 的定时任务 / ChatGPT Scheduled Tasks）。运行记录保留在下方历史中。'),
    err !== '' ? React.createElement('div', { key: 'err', className: 'enhancer-error' }, err) : null,
  ])
}

export function AutoDialog(): React.ReactElement | null {
  const [s, patch] = useDialogState()
  const close = () => patch({ autoOpen: false })
  useEscClose(s.autoOpen, close)
  if (!s.autoOpen) return null
  return React.createElement(SettingsDialog, {
    navTitle: '自动化',
    navCells: [{ id: 'auto', label: '定时任务', icon: CLOCK_PATH, active: true }],
    title: '定时任务',
    subtitle: '定期在工作区新建会话并发送预设提示词，查看运行历史。',
    onClose: close,
  }, React.createElement(AutoPanel))
}
