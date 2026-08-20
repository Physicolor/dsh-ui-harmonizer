/**
 * Harness UI Enhancer — React components.
 *
 * One surface: SettingsGeneralRow, the "界面定制" block inside Settings →
 * General. It reads and writes one shared EnhancerState through the props
 * passed by apply(). Everything is plain React.createElement — no JSX — and
 * styles are inline so the component file carries no CSS module of its own
 * (the plugin-wide rules live in enhancer.module.css).
 */

import * as React from 'react'
import type { FONT_PRESETS } from './state.ts'

/** Icon path constants copied from @deepseek-ai/dsh-client-ui-primitives. */
const CHEVRON_PATH = 'M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z'
const CHECK_PATH = 'M15.0498 3.92579L8.49512 12.3818C8.25774 12.6881 8.04517 12.9645 7.84668 13.1689C7.63957 13.3823 7.38732 13.5841 7.04492 13.6719C6.86373 13.7183 6.6757 13.7346 6.48926 13.7197C6.13666 13.6915 5.8528 13.5355 5.6123 13.3604C5.38201 13.1926 5.12573 12.9567 4.83984 12.6953L1.03125 9.21289L1.96875 8.1875L5.77734 11.6699C6.08684 11.9529 6.27773 12.1249 6.43066 12.2363C6.50183 12.2882 6.54699 12.3135 6.57324 12.3252C6.58525 12.3305 6.59269 12.3322 6.5957 12.333C6.59802 12.3336 6.59961 12.334 6.59961 12.334C6.63317 12.3367 6.66758 12.3335 6.7002 12.3252C6.7002 12.3252 6.70211 12.3251 6.7041 12.3242C6.70698 12.3229 6.71348 12.319 6.72461 12.3115C6.74849 12.2956 6.78843 12.2642 6.84961 12.2012C6.98138 12.0654 7.13957 11.8628 7.39648 11.5313L13.9502 3.07422L15.0498 3.92579Z'

/** Props both surfaces receive: the shared state and an apply callback. */
export interface EnhancerSurfaceProps {
  state: {
    width: number
    fontSize: number
    sidebarSize: number
    fontId: string
    card: boolean
  }
  onApply: (patch: { width?: number; fontSize?: number; sidebarSize?: number; fontId?: string; card?: boolean }) => void
  presets: Readonly<typeof FONT_PRESETS>
}

/** Custom font selector: product selector-pill button + fixed menu.
 * Holds a local mirror of the selected id so the pill label updates
 * immediately on pick; external changes are adopted via the effect. */
export function FontSelector({ value, onChange, presets }: {
  value: string
  onChange: (id: string) => void
  presets: Readonly<typeof FONT_PRESETS>
}): React.ReactElement {
  const [local, setLocal] = React.useState(value)
  React.useEffect(() => { setLocal(value) }, [value])
  const [open, setOpen] = React.useState(false)
  const [pos, setPos] = React.useState<{ left: number; top: number; maxHeight: number } | null>(null)
  const wrapRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent): void => {
      if (wrapRef.current !== null && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent): void => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = presets.find(p => p.id === local) ?? presets[0]
  const toggle = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!open) {
      const rect = e.currentTarget.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const MARGIN = 12
      const estHeight = 4 * 2 + presets.length * 40 + 2
      const openDown = rect.bottom + 4 + estHeight <= vh - MARGIN
      setPos({
        left: Math.min(Math.max(rect.right - 218, MARGIN), vw - 218 - MARGIN),
        top: openDown ? rect.bottom + 4 : rect.top - estHeight - 4,
        maxHeight: vh - MARGIN * 2,
      })
    }
    setOpen(v => !v)
  }

  const pillStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 12, height: 36, padding: '0 14px',
    border: 'none', borderRadius: 18, background: 'var(--dsw-alias-bg-module-platform)',
    font: 'inherit', fontSize: 14, lineHeight: '22px', color: 'var(--dsw-alias-label-primary)',
    cursor: 'pointer', whiteSpace: 'nowrap', maxWidth: '100%',
  }
  const menuStyle: React.CSSProperties = {
    position: 'fixed', zIndex: 1100, boxSizing: 'border-box', minWidth: 218, maxWidth: 360,
    padding: 4, display: 'flex', flexDirection: 'column',
    border: '1px solid var(--dsw-alias-border-inverted)', borderRadius: 12,
    background: 'var(--dsw-specific-menu)', boxShadow: 'var(--dsw-shadow-lv3)',
    ...pos,
  }
  const itemStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 40,
    padding: '8px 10px', border: 'none', borderRadius: 10, background: 'transparent',
    cursor: 'pointer', fontSize: 14, lineHeight: '22px', color: 'var(--dsw-alias-label-primary)',
    textAlign: 'left',
  }
  const checkIcon = React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', style: { flex: 'none' } },
    React.createElement('path', { d: CHECK_PATH, fill: 'currentColor' }))

  return React.createElement('div', { ref: wrapRef, style: { position: 'relative', display: 'inline-flex', maxWidth: '100%' } }, [
    React.createElement('button', {
      type: 'button',
      style: open ? { ...pillStyle, background: 'var(--dsw-alias-interactive-bg-hover)' } : pillStyle,
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      onClick: toggle,
      key: 'trigger',
    }, [
      React.createElement('span', { key: 'label', style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 } }, selected.label),
      React.createElement('svg', { key: 'chevron', width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', style: { flex: 'none', color: 'var(--dsw-alias-label-tertiary)' } },
        React.createElement('path', { d: CHEVRON_PATH, fill: 'currentColor' })),
    ]),
    open && pos !== null
      ? React.createElement('div', { key: 'menu', role: 'menu', style: { ...menuStyle, maxHeight: pos.maxHeight, overflowY: 'auto' } },
        presets.map(p => React.createElement('button', {
          key: p.id, type: 'button', role: 'menuitem',
          style: itemStyle,
          onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'var(--dsw-alias-interactive-bg-hover)' },
          onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'transparent' },
          onClick: () => { setLocal(p.id); setOpen(false); onChange(p.id) },
        }, [
          React.createElement('span', { key: 'label', style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, p.label),
          p.id === local ? React.createElement('span', { key: 'check', style: { flex: 'none' } }, checkIcon) : null,
        ])))
      : null,
  ])
}

/** Slider row: title + description left, range + value right. */
export function SettingsRow({ title, desc, control }: {
  title: string
  desc: string
  control: React.ReactNode
}): React.ReactElement {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '16px 0', borderBottom: '1px solid var(--dsw-alias-border-l2)' } }, [
    React.createElement('div', { key: 'text', style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 48 } }, [
      React.createElement('div', { key: 'title', style: { fontSize: 14, lineHeight: '22px', color: 'var(--dsw-alias-label-primary)' } }, title),
      React.createElement('div', { key: 'desc', style: { fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary)' } }, desc),
    ]),
    React.createElement('div', { key: 'control', style: { flex: 'none', maxWidth: '60%', minWidth: 0 } }, control),
  ])
}

/** Range control with product styling (class uitw-slider from enhancer.module.css).
 * Holds a local mirror of the value so the thumb tracks the pointer
 * immediately; external value changes (another surface editing the same knob)
 * are adopted via the effect. */
export function SliderControl({ min, max, step, value, onChange, unit }: {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  unit: string
}): React.ReactElement {
  const [local, setLocal] = React.useState(value)
  React.useEffect(() => { setLocal(value) }, [value])
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, flex: 'none' } }, [
    React.createElement('input', {
      key: 'range',
      type: 'range', min, max, step, value: local,
      className: 'uitw-slider',
      style: { width: 160, accentColor: 'var(--dsw-alias-brand-primary)' },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = Number(e.target.value)
        setLocal(next)
        onChange(next)
      },
    }),
    React.createElement('span', { key: 'value', style: { width: 48, fontSize: 13, lineHeight: '20px', color: 'var(--dsw-alias-label-secondary)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' } }, `${local}${unit}`),
  ])
}

/** Product-style switch toggle (track + thumb). A controlled button that
 * flips on click; the active state uses the DeepSeek business blue. */
export function SwitchControl({ checked, onChange }: {
  checked: boolean
  onChange: (value: boolean) => void
}): React.ReactElement {
  const track: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: 36,
    height: 22,
    padding: 0,
    border: 'none',
    borderRadius: 11,
    cursor: 'pointer',
    background: checked ? 'var(--dsw-alias-state-business-primary)' : 'var(--dsw-alias-border-l3)',
    transition: 'background var(--ds-transition-duration-fast) var(--ds-ease-in-out)',
    flex: 'none',
  }
  const thumb: React.CSSProperties = {
    position: 'absolute',
    top: 3,
    left: checked ? 17 : 3,
    width: 16,
    height: 16,
    borderRadius: 8,
    background: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    transition: 'left var(--ds-transition-duration-fast) var(--ds-ease-in-out)',
  }
  return React.createElement('button', {
    type: 'button',
    role: 'switch',
    'aria-checked': checked,
    style: track,
    onClick: () => { onChange(!checked) },
  }, React.createElement('span', { style: thumb }))
}

/** The "界面定制" block registered in Settings → General. */export function SettingsGeneralRow({ state, onApply, presets }: EnhancerSurfaceProps): React.ReactElement {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column' } }, [
    React.createElement(SettingsRow, {
      key: 'width',
      title: '对话内容宽度',
      desc: '对话列的最大宽度，滑动即时预览',
      control: React.createElement(SliderControl, {
        min: 748, max: 1000, step: 4, value: state.width, unit: 'px',
        onChange: (v) => { onApply({ width: v }) },
      }),
    }),
    React.createElement(SettingsRow, {
      key: 'font',
      title: '对话字号',
      desc: 'markdown 正文与输入框文字大小',
      control: React.createElement(SliderControl, {
        min: 12, max: 20, step: 1, value: state.fontSize, unit: 'px',
        onChange: (v) => { onApply({ fontSize: v }) },
      }),
    }),
    React.createElement(SettingsRow, {
      key: 'sidebar',
      title: '工作区字号',
      desc: '左侧工作区列表、按钮与图标的整体大小',
      control: React.createElement(SliderControl, {
        min: 12, max: 20, step: 1, value: state.sidebarSize, unit: 'px',
        onChange: (v) => { onApply({ sidebarSize: v }) },
      }),
    }),
    React.createElement(SettingsRow, {
      key: 'font-family',
      title: 'UI 字体',
      desc: '界面与对话使用的字体栈',
      control: React.createElement(FontSelector, {
        value: state.fontId,
        presets,
        onChange: (v) => { onApply({ fontId: v }) },
      }),
    }),
    React.createElement(SettingsRow, {
      key: 'center-card',
      title: '圆角卡片',
      desc: '将对话区域显示为左上圆角的卡片，附投影',
      control: React.createElement(SwitchControl, {
        checked: state.card,
        onChange: (v) => { onApply({ card: v }) },
      }),
    }),
  ])
}

/** The "通用设置" page header block (title + description), registered first in General. */
export function GeneralHeader(): React.ReactElement {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, padding: '4px 0 12px', borderBottom: '1px solid var(--dsw-alias-border-l2)' } }, [
    React.createElement('div', { key: 'title', style: { fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--dsw-alias-label-primary)' } }, '通用设置'),
    React.createElement('div', { key: 'desc', style: { fontSize: 13, lineHeight: '20px', color: 'var(--dsw-alias-label-tertiary)' } }, '管理语言、外观、界面与对话行为等基础偏好。'),
  ])
}
