/** Font presets: id → stack (null keeps the product default). Labels are
 *  resolved at render time via getFontLabel() so language switches take effect
 *  without a page reload. `mono` presets also own the code/code-block tokens;
 *  prose presets leave code on the product's own code family. `probe` is the
 *  family name the settings row checks against the machine's installed fonts. */
export const FONT_PRESETS = [
  { id: 'default', stack: null, mono: false, probe: null },
  { id: 'harmony', stack: "'HarmonyOS Sans SC', 'HarmonyOS Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif", mono: false, probe: 'HarmonyOS Sans SC' },
  { id: 'yahei', stack: "'Microsoft YaHei', 'PingFang SC', 'Segoe UI', sans-serif", mono: false, probe: 'Microsoft YaHei' },
  { id: 'noto', stack: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif", mono: false, probe: 'Noto Sans SC' },
  { id: 'serif', stack: "Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif", mono: false, probe: 'Georgia' },
  { id: 'mono', stack: "'JetBrains Mono', 'SF Mono', Consolas, 'Courier New', monospace", mono: true, probe: 'JetBrains Mono' },
  { id: 'courier', stack: "'Courier New', 'Consolas', monospace", mono: true, probe: 'Courier New' },
] as const
