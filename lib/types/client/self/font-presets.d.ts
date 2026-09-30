/** Font presets: id → stack (null keeps the product default). Labels are
 *  resolved at render time via getFontLabel() so language switches take effect
 *  without a page reload. `mono` presets also own the code/code-block tokens;
 *  prose presets leave code on the product's own code family. `probe` is the
 *  family name the settings row checks against the machine's installed fonts. */
export declare const FONT_PRESETS: readonly [{
    readonly id: "default";
    readonly stack: null;
    readonly mono: false;
    readonly probe: null;
}, {
    readonly id: "harmony";
    readonly stack: "'HarmonyOS Sans SC', 'HarmonyOS Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif";
    readonly mono: false;
    readonly probe: "HarmonyOS Sans SC";
}, {
    readonly id: "yahei";
    readonly stack: "'Microsoft YaHei', 'PingFang SC', 'Segoe UI', sans-serif";
    readonly mono: false;
    readonly probe: "Microsoft YaHei";
}, {
    readonly id: "noto";
    readonly stack: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";
    readonly mono: false;
    readonly probe: "Noto Sans SC";
}, {
    readonly id: "serif";
    readonly stack: "Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif";
    readonly mono: false;
    readonly probe: "Georgia";
}, {
    readonly id: "mono";
    readonly stack: "'JetBrains Mono', 'SF Mono', Consolas, 'Courier New', monospace";
    readonly mono: true;
    readonly probe: "JetBrains Mono";
}, {
    readonly id: "courier";
    readonly stack: "'Courier New', 'Consolas', monospace";
    readonly mono: true;
    readonly probe: "Courier New";
}];
