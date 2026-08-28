/**
 * Minimal i18n for dsh-ui-harmonizer.
 *
 * Every getter re-evaluates on each call so switching Settings → Language
 * takes effect without a page reload. Detection priority:
 *   1. localStorage key 'dsh-language' (written by the official Settings panel)
 *   2. <html lang="…"> attribute (synced by the product when the setting changes)
 *   3. navigator.language (fallback for SSR / private mode)
 */

/** Detect current locale, re-evaluated on every call. */
function detectLocale(): string {
  try {
    const stored = localStorage.getItem('dsh-language')
    if (stored !== null && stored !== '') return stored
  } catch { /* private mode / quota */ }
  try {
    const htmlLang = document.documentElement.lang
    if (htmlLang) return htmlLang
  } catch { /* SSR */ }
  try {
    return navigator.language
  } catch {
    return 'zh-CN'
  }
}

function isZh(): boolean {
  return detectLocale().startsWith('zh')
}

/* ------------------------------------------------------------------ */
/*  GeneralHeader (Settings → General page header)                     */
/* ------------------------------------------------------------------ */
export function getGeneralTitle(): string {
  return isZh() ? '通用设置' : 'General'
}
export function getGeneralDesc(): string {
  return isZh()
    ? '管理语言、外观、界面与对话行为等基础偏好。'
    : 'Manage language, appearance, interface and chat behavior preferences.'
}

/* ------------------------------------------------------------------ */
/*  SettingsGeneralRow — the five setting rows                         */
/* ------------------------------------------------------------------ */
export function getRowWidthTitle(): string {
  return isZh() ? '对话内容宽度' : 'Chat Content Width'
}
export function getRowWidthDesc(): string {
  return isZh() ? '对话列的最大宽度，滑动即时预览' : 'Maximum width of the chat column; preview on slide'
}

export function getRowFontSizeTitle(): string {
  return isZh() ? '对话字号' : 'Chat Font Size'
}
export function getRowFontSizeDesc(): string {
  return isZh() ? 'markdown 正文与输入框文字大小' : 'Font size for markdown body and input box'
}

export function getRowSidebarSizeTitle(): string {
  return isZh() ? '工作区字号' : 'Workspace Font Size'
}
export function getRowSidebarSizeDesc(): string {
  return isZh() ? '左侧工作区列表、按钮与图标的整体大小' : 'Overall size of the left workspace list, buttons and icons'
}

export function getRowFontTitle(): string {
  return isZh() ? 'UI 字体' : 'UI Font'
}
export function getRowFontDesc(): string {
  return isZh() ? '界面与对话使用的字体栈' : 'Font stack used by the interface and chat'
}

export function getRowCardTitle(): string {
  return isZh() ? '圆角卡片' : 'Rounded Card'
}
export function getRowCardDesc(): string {
  return isZh() ? '将对话区域显示为左上圆角的卡片，附投影' : 'Display the chat area as a rounded card with shadow'
}

/* ------------------------------------------------------------------ */
/*  FontSelector presets (state.ts labels)                             */
/* ------------------------------------------------------------------ */
export function getFontLabel(id: string): string {
  const zh = isZh()
  switch (id) {
    case 'default': return zh ? '系统默认（HarmonyOS Sans SC）' : 'System Default (HarmonyOS Sans SC)'
    case 'harmony': return 'HarmonyOS Sans SC'
    case 'yahei': return zh ? '微软雅黑优先' : 'Microsoft YaHei'
    case 'noto': return 'Noto Sans SC'
    case 'serif': return zh ? '衬线（宋体风）' : 'Serif'
    case 'mono': return zh ? '等宽' : 'Monospace'
    default: return id
  }
}

/* ------------------------------------------------------------------ */
/*  index.ts KNOWN_TITLES — intro-prefix → page title fallback         */
/* ------------------------------------------------------------------ */
/** Returns the [introPrefix, title] pairs for the title-fill logic,
 *  keyed by current locale. */
export function getKnownTitles(): ReadonlyArray<readonly [prefix: string, title: string]> {
  if (isZh()) {
    return [['管理侧边卡片', '侧边卡片']]
  }
  return [['Manage side cards', 'Side Cards']]
}
