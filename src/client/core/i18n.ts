/**
 * Minimal i18n for dsh-ui-harmonizer — every user-facing string, both languages.
 *
 * Layer: core (infrastructure; it is imported by self/ UI, harness/ reconcilers
 * and core/state-model alike, and depends on nothing but the DOM).
 * Seams: the official language switch as the product publishes it — localStorage
 * key `dsh-language` and `<html lang="…">` — with `navigator.language` as the
 * last-resort fallback. No private plugin classes, no product internals.
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
  return isZh()
    ? '对话内容宽度，与对话区两侧的拖拽条共用同一个记忆值'
    : 'Chat content width — shares one stored value with the drag handles beside the transcript'
}

export function getRowSidebarSizeTitle(): string {
  return isZh() ? '工作区字号' : 'Workspace Font Size'
}
export function getRowSidebarSizeDesc(): string {
  return isZh() ? '左侧工作区列表、按钮与图标的整体大小' : 'Overall size of the left workspace list, buttons and icons'
}

export function getRowFontTitle(): string {
  return isZh() ? '字体' : 'Font'
}
export function getRowFontDesc(): string {
  return isZh()
    ? '对话正文与代码块使用的字体栈；未安装的字体会标记出来'
    : 'Font stack for chat prose and code blocks; missing families are flagged'
}

/** Second half of the font row: which surfaces the stack applies to. */
export function getScopeTitle(): string {
  return isZh() ? '字体作用范围' : 'Font Scope'
}
export function getScopeDesc(): string {
  return isZh()
    ? '「整个界面」会覆盖官方固定的界面字体（官方没有此项设置）'
    : '"Whole UI" overrides the product-defined interface font (the product has no such setting)'
}
export function getScopeContentLabel(): string {
  return isZh() ? '对话正文' : 'Chat only'
}
export function getScopeUiLabel(): string {
  return isZh() ? '整个界面' : 'Whole UI'
}
/** Suffix on a preset the machine does not have installed. */
export function getFontMissingLabel(): string {
  return isZh() ? '未安装' : 'not installed'
}

/** Right-panel toggle: snap the frame track, glide the content on the compositor. */
export function getRowPanelGlideTitle(): string {
  return isZh() ? '侧栏开合平顺' : 'Smooth Panel Toggle'
}
export function getRowPanelGlideDesc(): string {
  return isZh()
    ? '右侧栏展开/收起时不再逐帧重排整个界面：轨道一步到位，正文与输入框改由合成层平移'
    : 'Stop the right panel toggle from re-laying out the whole frame each frame: the grid track snaps and the transcript and composer glide on the compositor'
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
    case 'courier': return 'Courier New'
    default: return id
  }
}

/* ------------------------------------------------------------------ */
/*  Harmony Doctor settings section                                    */
/* ------------------------------------------------------------------ */
export function getDoctorSectionLabel(): string {
  return isZh() ? 'UI 兼容性' : 'UI Compatibility'
}
export function getDoctorTitle(): string {
  return isZh() ? 'UI 兼容性检查' : 'UI Compatibility'
}
export function getDoctorDesc(): string {
  return isZh()
    ? '本机只读审计：本插件有哪些 CSS 规则已经失效、哪些地方在读其他插件的私有类、哪些表面被谁占用。数据不出本机，不联网、不调用模型。'
    : 'Local read-only audit: which of this plugin\'s CSS rules no longer match anything, where it still reads another plugin\'s private classes, and which surface is owned by whom. Nothing leaves the machine.'
}
export function getDoctorRunLabel(): string {
  return isZh() ? '运行检查' : 'Run check'
}
export function getDoctorExportLabel(): string {
  return isZh() ? '导出 Markdown' : 'Export Markdown'
}
export function getDoctorResetLabel(): string {
  return isZh() ? '清空跨视图记录' : 'Reset cross-view ledger'
}
export function getDoctorRulesLabel(): string {
  return isZh() ? '规则命中' : 'Rule matches'
}
export function getDoctorCouplingsLabel(): string {
  return isZh() ? '跨插件耦合' : 'Foreign couplings'
}
export function getDoctorConflictsLabel(): string {
  return isZh() ? '冲突与冗余' : 'Conflicts / redundancy'
}
export function getDoctorSurfacesLabel(): string {
  return isZh() ? '表面占用' : 'Surfaces'
}
export function getDoctorMaterialLabel(): string {
  return isZh() ? '材质状态' : 'Material'
}

/** Stat label: selectors that matched in no observed view yet. */
export function getDoctorDeadEveryViewLabel(): string {
  return isZh() ? '所有视图均未命中' : 'dead in every view'
}
/** Rules-block subtitle: dead in every view the ledger has seen. */
export function getDoctorDeadInEveryObservedView(): string {
  return isZh() ? '所有已观察视图中均未命中' : 'dead in every observed view'
}
export function getDoctorViewsObservedLabel(): string {
  return isZh() ? '已观察视图' : 'views observed'
}
/** Right-hand column of a row in the dead-in-every-view list. */
export function getDoctorZeroMatchesEveryView(): string {
  return isZh() ? '所有视图中命中 0 次' : '0 matches in every view'
}
/** Right-hand column of a coupling row; `count` is its live match count. */
export function getDoctorMatchCount(count: number): string {
  return isZh() ? `命中 ${count} 处` : `${count} matches`
}
export function getDoctorGlassLabel(): string {
  return isZh() ? '半透明玻璃' : 'glass'
}
export function getDoctorSolidLabel(): string {
  return isZh() ? '实色' : 'solid'
}
/** Note under a list whose rows were capped; `shown` of `total` are rendered. */
export function getDoctorTruncatedNote(shown: number, total: number): string {
  return isZh() ? `仅显示前 ${shown} 条，共 ${total} 条` : `showing first ${shown} of ${total}`
}
/**
 * Note under a list that clipped cell TEXT (not rows) at `limit` characters.
 *
 * Separate from {@link getDoctorTruncatedNote} on purpose: the two cuts used to
 * be silent and inconsistent (cells were sliced in the view layer with no
 * marker at all), so the reader could not tell a short selector from a clipped
 * one. Each cut now names itself.
 */
export function getDoctorTruncatedCellsNote(limit: number): string {
  return isZh() ? `部分单元格已截断至前 ${limit} 个字符（导出的 Markdown 保留全文）` : `some cells truncated to the first ${limit} characters (the Markdown export keeps the full text)`
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
