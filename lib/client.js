window.__ModuleLoader__.load({
	id: "dsh-ui-harmonizer",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\self\sheet-tokens.module.css.mjs
		const css$27 = ":root{--enhancer-content-width:748px;--enhancer-sidebar-scale:1}";
		const tagId$27 = "dsh-ui-harmonizer/sheet-tokens.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$27) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$27;
			tag.textContent = css$27;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\chat-chrome-scale.module.css.mjs
		const css$26 = "body{--enhancer-chat-scale:calc(var(--dsh-content-font-size,14px) / 14px)}";
		const tagId$26 = "dsh-ui-harmonizer/chat-chrome-scale.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$26) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$26;
			tag.textContent = css$26;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-widgets\width-handle-squeeze.module.css.mjs
		const css$25 = "body.dsx-stats-active [data-width-handle]{--enhc-squeeze:calc(var(--dsx-rail-w,0px) / 2);--enhc-content:min(var(--dsh-chat-content-width), calc(100% - var(--dsx-rail-w,0px) - var(--dsh-scrollbar-width,0px) - 2px));transition:right var(--ds-transition-duration-slow) var(--ds-ease-in-out), left var(--ds-transition-duration-slow) var(--ds-ease-in-out)}body.dsx-stats-active [data-width-handle][data-side=left]{right:calc(50% + var(--enhc-content) / 2 + 24px + var(--enhc-squeeze))}body.dsx-stats-active [data-width-handle][data-side=right]{left:calc(50% + var(--enhc-content) / 2 + 24px - var(--enhc-squeeze))}";
		const tagId$25 = "dsh-ui-harmonizer/width-handle-squeeze.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$25) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$25;
			tag.textContent = css$25;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\composer-and-menu.module.css.mjs
		const css$24 = "[data-slot=\"conversation.composer.bar\"] [class$=_trigger],[data-slot=\"conversation.composer.bar\"] [class$=_add],[data-slot=\"conversation.composer.bar\"] [class$=_primary]{zoom:var(--enhancer-chat-scale,1)}[role=menu][class*=_list_]{padding:calc(4px * var(--enhancer-chat-scale,1));border-radius:calc(16px * var(--enhancer-chat-scale,1));min-width:calc(144px * var(--enhancer-chat-scale,1));max-width:calc(360px * var(--enhancer-chat-scale,1))}[role=menu] [class*=_item_]{font-size:calc(13px * var(--enhancer-chat-scale,1));line-height:calc(20px * var(--enhancer-chat-scale,1));min-height:calc(34px * var(--enhancer-chat-scale,1));padding:calc(6px * var(--enhancer-chat-scale,1)) calc(8px * var(--enhancer-chat-scale,1));border-radius:calc(12px * var(--enhancer-chat-scale,1));gap:calc(6px * var(--enhancer-chat-scale,1))}[role=menu] [class*=_itemIcon_],[role=menu] [class*=_check_]{width:calc(14px * var(--enhancer-chat-scale,1));height:calc(14px * var(--enhancer-chat-scale,1))}";
		const tagId$24 = "dsh-ui-harmonizer/composer-and-menu.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$24) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$24;
			tag.textContent = css$24;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\sidebar-chrome.module.css.mjs
		const css$23 = "[data-slot=sidebar] [class*=_newSession]:is([class$=_newSession],[class*=_newSession\\ ]){font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(38px * var(--enhancer-sidebar-scale))}[data-slot=sidebar] [class*=_newSessionLabel]:is([class$=_newSessionLabel],[class*=_newSessionLabel\\ ]){max-width:calc(200px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton]{width:calc(28px * var(--enhancer-sidebar-scale));height:calc(28px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton] svg{width:calc(16px * var(--enhancer-sidebar-scale));height:calc(16px * var(--enhancer-sidebar-scale))}[data-sidebar-collapsed] [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton]{width:36px;height:36px}[data-sidebar-collapsed] [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton] svg{width:16px;height:16px}[data-slot=sidebar\\.settings] [class$=_trigger]{font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(34px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badge]{font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(49px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badge] svg{width:calc(14px * var(--enhancer-sidebar-scale));height:calc(14px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badgeCount]{font-size:calc(12px * var(--enhancer-sidebar-scale));line-height:calc(16px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces]{font-size:calc(14px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_title]{font-size:calc(14px * var(--enhancer-sidebar-scale));line-height:calc(20px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_meta],[data-slot=sidebar\\.workspaces] [class$=_time]{font-size:calc(12px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_sectionHeader]{font-size:calc(13px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar\\.workspaces] [class$=_iconButton]{width:calc(28px * var(--enhancer-sidebar-scale));height:calc(28px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar\\.workspaces] [class$=_iconButton] svg{width:calc(16px * var(--enhancer-sidebar-scale));height:calc(16px * var(--enhancer-sidebar-scale))}[data-sidebar-collapsed] [data-slot=sidebar\\.workspaces] [class$=_iconButton]{width:36px;height:36px}[data-sidebar-collapsed] [data-slot=sidebar\\.workspaces] [class$=_iconButton] svg{width:16px;height:16px}";
		const tagId$23 = "dsh-ui-harmonizer/sidebar-chrome.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$23) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$23;
			tag.textContent = css$23;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\self\settings-section-headers.module.css.mjs
		const css$22 = "[data-slot=settings\\.section] .enhc-page-title{color:var(--dsw-alias-label-primary);margin:0;font-size:18px;font-weight:600;line-height:26px}[data-slot=settings\\.section] .enhc-page-intro{color:var(--dsw-alias-label-tertiary);border-bottom:1px solid var(--dsw-alias-border-l2);margin:0 0 12px;padding-bottom:12px;font-size:13px;line-height:20px}[data-slot=settings\\.section] [class$=_titleRow]>svg{display:none}";
		const tagId$22 = "dsh-ui-harmonizer/settings-section-headers.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$22) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$22;
			tag.textContent = css$22;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\settings-and-crumb.module.css.mjs
		const css$21 = "button[class$=_crumb],button[class$=_crumbCurrent]{max-width:560px}[class$=_versionPicker] select{-webkit-appearance:none;appearance:none;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);cursor:pointer;border:none;border-radius:18px;min-width:0;height:32px;padding:0 32px 0 14px;font-size:13px;line-height:20px}[class$=_versionPicker] select:hover{background-color:var(--dsw-alias-interactive-bg-hover)}[class$=_versionPicker] select:focus-visible{outline:2px solid var(--dsw-alias-border-l3);outline-offset:1px}[class$=_versionPicker] select option{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:13px}";
		const tagId$21 = "dsh-ui-harmonizer/settings-and-crumb.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$21) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$21;
			tag.textContent = css$21;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\self\settings-controls.module.css.mjs
		const css$20 = ".uitw-stepper-control{align-items:center;gap:8px;display:inline-flex}.uitw-stepper{background:var(--dsw-alias-bg-module-platform);border-radius:var(--dsw-radius-md,12px);justify-content:center;align-items:center;min-width:72px;height:36px;display:inline-flex;position:relative}.uitw-stepper-value{text-align:center;font-variant-numeric:tabular-nums;min-width:18px;color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px}.uitw-stepper-arrows{opacity:0;transition:opacity var(--ds-transition-duration-fast,.15s) var(--ds-ease-in-out,ease);flex-direction:column;gap:2px;display:flex;position:absolute;right:8px}.uitw-stepper:hover .uitw-stepper-arrows,.uitw-stepper:focus-within .uitw-stepper-arrows{opacity:1}.uitw-stepper-arrow{background:color-mix(in srgb, var(--dsw-alias-bg-layer-1) 75%, transparent);width:17px;height:12px;color:var(--dsw-alias-label-primary);cursor:pointer;border:none;border-radius:4px;justify-content:center;align-items:center;padding:0;display:inline-flex}.uitw-stepper-arrow:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.uitw-stepper-arrow:disabled{opacity:.4;cursor:default}.uitw-stepper-unit{color:var(--dsw-alias-label-secondary);font-size:14px;line-height:22px}.uitw-select-wrap{max-width:100%;display:inline-flex;position:relative}.uitw-select{box-sizing:border-box;border-radius:var(--dsw-radius-md,12px);background:var(--dsw-alias-bg-module-platform);max-width:100%;height:36px;color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;border:0;align-items:center;gap:12px;padding:0 14px;font-size:14px;line-height:22px;display:inline-flex}.uitw-select:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.uitw-select:disabled{cursor:default}.uitw-select-label{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.uitw-select-chevron{flex:none}.uitw-switch{box-sizing:border-box;corner-shape:round;background:var(--dsw-alias-border-l3);cursor:pointer;border:0;border-radius:999px;flex:none;width:36px;height:20px;padding:2px;display:inline-block;position:relative}.uitw-switch[aria-checked=true]{background:var(--dsw-alias-brand-primary)}.uitw-switch:disabled{cursor:default;opacity:.5}.uitw-switch:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}.uitw-switch-thumb{corner-shape:round;background:var(--dsw-alias-label-primary-foreground);border-radius:50%;width:16px;height:16px;transition:transform .12s;display:block}.uitw-switch[aria-checked=false] .uitw-switch-thumb{background:var(--dsw-alias-switch-thumb)}.uitw-switch[aria-checked=true] .uitw-switch-thumb{transform:translate(16px)}";
		const tagId$20 = "dsh-ui-harmonizer/settings-controls.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$20) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$20;
			tag.textContent = css$20;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-genui\genui-switch.module.css.mjs
		const css$19 = "body .V1MMBW_switch{box-sizing:border-box;corner-shape:round;background:var(--dsw-alias-border-l3);border:0;border-radius:999px;width:36px;height:20px;padding:2px;transition:none}body .V1MMBW_switch.V1MMBW_switchOn{background:var(--dsw-alias-brand-primary);border-color:#0000}body .V1MMBW_switch .V1MMBW_switchKnob{corner-shape:round;background:var(--dsw-alias-switch-thumb);width:16px;height:16px;box-shadow:none;border-radius:50%;transition:transform .12s;top:2px;left:2px}body .V1MMBW_switch.V1MMBW_switchOn .V1MMBW_switchKnob{background:var(--dsw-alias-label-primary-foreground);left:2px;transform:translate(16px)}body .V1MMBW_switchRow:focus-within .V1MMBW_switch{box-shadow:none;outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}";
		const tagId$19 = "dsh-ui-harmonizer/genui-switch.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$19) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$19;
			tag.textContent = css$19;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\commandcode-provider\cc-switch-focus-ring.module.css.mjs
		const css$18 = "body .cc-toggle:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary))}";
		const tagId$18 = "dsh-ui-harmonizer/cc-switch-focus-ring.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$18) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$18;
			tag.textContent = css$18;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-better-sidebar\toggle-buttons.module.css.mjs
		const css$17 = "body [class$=_toggleButton]{border:1px solid var(--dsw-alias-border-l2);width:32px;height:32px;color:var(--dsw-alias-label-secondary);background:0 0;border-radius:16px}body [class$=_toggleButton]:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}body [class$=_toggleButton][aria-pressed=true],body [class$=_toggleButton][aria-pressed=true]:hover{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary-inverted);border-color:#0000}";
		const tagId$17 = "dsh-ui-harmonizer/toggle-buttons.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$17) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$17;
			tag.textContent = css$17;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-widgets\capsule-no-override-note.module.css.mjs
		const css$16 = "";
		const tagId$16 = "dsh-ui-harmonizer/capsule-no-override-note.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$16) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$16;
			tag.textContent = css$16;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-better-sidebar\panel-chrome.module.css.mjs
		const css$15 = "body .nArs4W_panel{background:var(--enhc-solid-fill,var(--dsw-alias-bg-layer-1));border:none;border-left:1px solid var(--dsw-alias-border-l2);box-shadow:var(--dsw-shadow-lv3);border-radius:14px 0 0 14px;top:6px;overflow:hidden}body .nArs4W_bottomPanel{background:var(--enhc-solid-fill,var(--dsw-alias-bg-base));border-top:1px solid var(--dsw-alias-border-l2)}";
		const tagId$15 = "dsh-ui-harmonizer/panel-chrome.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$15) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$15;
			tag.textContent = css$15;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\session-header.module.css.mjs
		const css$14 = "[data-slot=conversation\\.header]>header:has([class$=_titleCluster]>[class$=_tabs]),[data-slot=\"conversation.session.header\"]>header{transition:margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out);margin-right:var(--dsh-sidebar-width,0px)!important;border-bottom:none!important;min-height:0!important;padding:10px 28px 10px 20px!important}[data-slot=conversation\\.header]>header,[data-slot=\"conversation.session.header\"]>header{z-index:21;background:var(--enhc-solid-fill,var(--dsw-alias-bg-base));position:relative}[data-slot=conversation\\.header]>header:after,[data-slot=\"conversation.session.header\"]>header:after{content:none}[class$=_titleCluster]>[class$=_tabs]{flex:none;align-self:center;align-items:center;gap:24px;margin:0 0 0 8px;padding-left:0}[class$=_titleCluster]>[class$=_tabs] [class*=_tab]{padding:5px 0}[class$=_titleRow] [data-enhc-header-hidden]{display:none!important}";
		const tagId$14 = "dsh-ui-harmonizer/session-header.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$14) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$14;
			tag.textContent = css$14;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-better-sidebar\panel-tabs.module.css.mjs
		const css$13 = "body .nArs4W_tabBar{height:44px;min-height:44px}body .nArs4W_panel .nArs4W_tab{border-right:none;align-self:stretch;gap:6px;height:auto;padding:0 12px;font-size:14px;line-height:20px}body .nArs4W_panel .nArs4W_tab svg{width:16px;height:16px}body .nArs4W_panel .nArs4W_tabClose{width:16px;height:16px}body .nArs4W_panel .nArs4W_tabClose svg{width:14px;height:14px}body .nArs4W_panel .nArs4W_tabBarPlus{width:20px;height:20px}body .nArs4W_panel .nArs4W_tabBarPlus svg{width:16px;height:16px}body .nArs4W_panel .nArs4W_pane{background:var(--dsw-alias-bg-layer-1)}body .nArs4W_panel .nArs4W_paneContent,body .nArs4W_panel .nArs4W_paneTab,body .nArs4W_panel .nArs4W_explorer,body .nArs4W_panel .nArs4W_explorerBody{min-width:0;max-width:100%}body .nArs4W_panel .nArs4W_explorerBody{overflow-x:hidden}body .nArs4W_panel .nArs4W_explorerRow{max-width:100%}";
		const tagId$13 = "dsh-ui-harmonizer/panel-tabs.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$13) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$13;
			tag.textContent = css$13;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-better-sidebar\root-squeeze.module.css.mjs
		const css$12 = "html #root{width:100%;margin-right:0}html #root>div[data-slot=root]>div>div:nth-child(2){margin-bottom:0}[data-slot=conversation\\.session]>[class$=_viewArea]{margin-right:var(--dsh-sidebar-width,0px);transition:margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out)}";
		const tagId$12 = "dsh-ui-harmonizer/root-squeeze.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$12) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$12;
			tag.textContent = css$12;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\flow-item-rendering.module.css.mjs
		const css$11 = "[data-slot=conversation\\.session] [class$=_flowItem]{content-visibility:auto;contain-intrinsic-size:auto 120px}";
		const tagId$11 = "dsh-ui-harmonizer/flow-item-rendering.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$11) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$11;
			tag.textContent = css$11;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-better-sidebar\composer-seat-yield.module.css.mjs
		const css$10 = "div[class$=_composerSeat]{margin-right:var(--dsh-sidebar-width,0px);transition:margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out)}";
		const tagId$10 = "dsh-ui-harmonizer/composer-seat-yield.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$10) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$10;
			tag.textContent = css$10;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\frame-column-transition.module.css.mjs
		const css$9 = "html [class$=_frame]{transition:grid-template-columns var(--ds-transition-duration-slow) var(--ds-ease-in-out)}html.enhc-window-resizing [class$=_frame]{transition:none}html.enhc-panel-glide[data-enhc-instant] [class$=_frame],html.enhc-panel-glide[data-enhc-instant] [class$=_scrollBody]{transition-duration:1ms!important}html.enhc-panel-glide[data-enhc-opening] [data-sidebar-right-panel]:not([data-sidebar-right-panel=fullscreen]) [data-dockkit-host=dock]{animation:xCkKQa_enhc-panel-glide-in var(--ds-transition-duration-slow) var(--ds-ease-in-out) both}@keyframes xCkKQa_enhc-panel-glide-in{0%{transform:translateX(var(--dsh-sidebar-width,100%))}to{transform:none}}";
		const tagId$9 = "dsh-ui-harmonizer/frame-column-transition.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$9) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$9;
			tag.textContent = css$9;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-widgets\rail-overlay-squeeze.module.css.mjs
		const css$8 = "body.dsx-stats-active [data-conversation-scroll]:has([data-conversation-composer-overlay])>[class$=_composerSeat]{right:calc(var(--dsh-scrollbar-width,0px) + var(--dsx-rail-w,220px))}";
		const tagId$8 = "dsh-ui-harmonizer/rail-overlay-squeeze.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$8) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$8;
			tag.textContent = css$8;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-widgets\rail-vs-context-view.module.css.mjs
		const css$7 = "body.dsx-stats-active [data-conversation-scroll]:has(.lc-root)>[data-composer-seat]:not(:has([data-approval-key],[data-question-key],[data-plan-review-key])){height:0;min-height:0;margin:0;padding:0;display:flex;overflow:hidden}";
		const tagId$7 = "dsh-ui-harmonizer/rail-vs-context-view.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$7) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$7;
			tag.textContent = css$7;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-context\overview-modal-layer.module.css.mjs
		const css$6 = "body:has(.lc-ov-backdrop) div:has(>[data-slot=shell\\.overlay]){z-index:300}body:has(.lc-ov-backdrop) .dsx-magnify-layer{display:none}";
		const tagId$6 = "dsh-ui-harmonizer/overview-modal-layer.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$6) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$6;
			tag.textContent = css$6;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-context\overview-window-shell.module.css.mjs
		const css$5 = "body .lc-ov-card{border-radius:var(--dsw-radius-panel);background:var(--dsw-alias-bg-layer-2);box-shadow:var(--dsw-elevation-prominent);border:0;padding:0}body .lc-ov-head{margin-bottom:4px;padding:22px 24px 0}body .lc-ov-title{font-size:16px;font-weight:500;line-height:24px}.lc-ov-head .lc-modal-close{box-sizing:border-box;border-radius:28px;justify-content:center;align-items:center;width:28px;height:28px;padding:0;display:inline-flex}.lc-ov-head .lc-modal-close:hover{background:var(--dsw-alias-interactive-bg-hover)}body .lc-ov-scroll{padding:0 24px 24px}";
		const tagId$5 = "dsh-ui-harmonizer/overview-window-shell.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$5;
			tag.textContent = css$5;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-context\overview-content-rhythm.module.css.mjs
		const css$4 = ".lc-ov-card .lc-card{border-radius:20px;padding:12px 14px}.lc-ov-card .lc-ov-kpis{gap:10px}";
		const tagId$4 = "dsh-ui-harmonizer/overview-content-rhythm.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-context\entry-icon-monochrome.module.css.mjs
		const css$3 = ".lc-ov-entry-icon *,.lc-ov-head-icon *{fill:currentColor}";
		const tagId$3 = "dsh-ui-harmonizer/entry-icon-monochrome.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-context\dark-active-pill.module.css.mjs
		const css$2 = "body[data-ds-dark-theme] .lc-ov-card .lc-gran-on,body[data-ds-dark-theme] .lc-ov-card .lc-gran-on:hover,body[data-ds-dark-theme] .lc-ov-card .lc-ov-chip-on,body[data-ds-dark-theme] .lc-ov-card .lc-ov-chip-on:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}";
		const tagId$2 = "dsh-ui-harmonizer/dark-active-pill.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\self\doctor-page.module.css.mjs
		const css$1 = ".enhc-doctor{flex-direction:column;gap:12px;min-height:100%;display:flex}.enhc-doctor-bar{flex-wrap:wrap;align-items:center;gap:8px;display:flex}.enhc-doctor-btn{appearance:none;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14,14px/22px var(--dsw-font-family));cursor:pointer;transition:background var(--ds-transition-duration-fast) var(--ds-ease-in-out);border-radius:18px;padding:7px 14px}.enhc-doctor-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.enhc-doctor-btn:disabled{opacity:.5;cursor:default}.enhc-doctor-btn-quiet{color:var(--dsw-alias-label-secondary);background:0 0;border-color:#0000}.enhc-doctor-stats{grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;display:grid}.enhc-doctor-stat{border-bottom:1px solid var(--dsw-alias-border-l2);padding:8px 0 10px}.enhc-doctor-stat-v{font:var(--dsw-font-l-20,500 20px/28px var(--dsw-font-family));color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}.enhc-doctor-stat-l{font:var(--dsw-font-xs-13,13px/20px var(--dsw-font-family));color:var(--dsw-alias-label-tertiary)}.enhc-warn{color:var(--dsw-alias-state-warn-primary)}.enhc-doctor-block{flex-direction:column;gap:4px;display:flex}.enhc-doctor-h3{font:var(--dsw-font-s-14,14px/22px var(--dsw-font-family));color:var(--dsw-alias-label-primary);margin:4px 0 0;font-weight:600}.enhc-doctor-rows{flex-direction:column;display:flex}.enhc-doctor-row{border-bottom:1px solid var(--dsw-alias-border-l2);align-items:baseline;gap:12px;padding:6px 0;display:flex}.enhc-doctor-code{min-width:0;font:var(--dsw-font-markdown-code,12px/19px var(--ds-font-family-code));color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;flex:1;overflow:hidden}.enhc-doctor-right{font:var(--dsw-font-xs-13,13px/20px var(--dsw-font-family));color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;flex:none}.enhc-doctor-empty{font:var(--dsw-font-xs-13,13px/20px var(--dsw-font-family));color:var(--dsw-alias-label-tertiary);margin:0}";
		const tagId$1 = "dsh-ui-harmonizer/doctor-page.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-genui\width-hygiene.module.css.mjs
		const css = "[data-genui-panel]{box-sizing:border-box;contain:inline-size;display:block;min-width:0!important}[data-genui]{contain:inline-size;min-width:0!important;max-width:100%!important}[data-genui-tool]{contain:inline-size;min-width:0!important;max-width:100%!important}[data-genui-panel-body]{min-width:0!important;max-width:100%!important;overflow-x:auto!important}[data-genui-panel] svg,[data-genui] svg,[data-genui] pre,[data-genui] canvas,[data-genui] img,[data-genui-mermaid] svg{height:auto;max-width:100%!important}[class*=panelToggle]{box-sizing:border-box;max-width:100%!important;padding:11px 16px!important}[class*=panelToggle] [class*=panelTitle]{flex:1!important;min-width:0!important}[class*=panelToggle] [class*=panelBadge],[class*=panelToggle] [class*=panelChevron]{margin-left:8px;flex:none!important}[class*=toolFallback]{min-width:0!important}[class*=toolFallbackMeta]{flex:1!important;min-width:0!important}[class*=tlTime]{flex:none!important;min-width:0!important}[data-genui-panel-body] [class*=banner],[data-genui-tool] [class*=banner],[data-genui] [class*=banner]{width:auto!important;max-width:100%!important;margin-left:0!important;margin-right:0!important;padding-left:16px!important;padding-right:16px!important}[data-genui-tool] [class*=steps],[data-genui] [class*=steps]{padding-left:16px!important;padding-right:16px!important}";
		const tagId = "dsh-ui-harmonizer/width-hygiene.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region src/client/harness/settings-header/classes.ts
		/**
		* The settings-page header class pair — the plugin's ONLY header hook.
		*
		* Layer: harness (these classes are stamped onto the DSH body's own settings
		* pages, so they belong with the normalization code, not with our own UI).
		*
		* PRIVATE HASH CLASSES ARE NOT USED HERE; the opposite is true: these are OUR
		* class names, and `self/settings-section-headers.module.css` is the only
		* stylesheet that may key on them. The Doctor reads them to count stamped
		* pages — see `self/doctor/`.
		*/
		/** Page-title class. Kept on the page's REAL heading node — nothing is wrapped. */
		const TITLE_CLASS = "enhc-page-title";
		/** Page-description class, carrying the closing hairline. */
		const INTRO_CLASS = "enhc-page-intro";
		//#endregion
		//#region src/client/harness/settings-header/recipe.tsx
		/**
		* `SettingsPageHeader` — the React half of the one settings-header architecture.
		*
		* Layer: harness. It renders the same two nodes the official pages ship (an
		* `<h2>` page title and a `<p>` page description, as siblings, with NO wrapper
		* of our own), so this plugin's own pages are structurally identical to a
		* foreign page's. Any change here must be mirrored by the reconciler in
		* `./reconciler.ts`, which stamps the same class pair onto other people's pages.
		*/
		/**
		* The page header as a React element: exactly the two nodes a foreign page
		* ships, with no wrapper of our own — one skeleton for every page.
		* @param props.title - page title text.
		* @param props.intro - page description text.
		* @returns the title and description as siblings.
		*/
		function SettingsPageHeader({ title, intro }) {
			return react.createElement(react.Fragment, null, react.createElement("h2", {
				className: TITLE_CLASS,
				key: "title"
			}, title), react.createElement("p", {
				className: INTRO_CLASS,
				key: "intro"
			}, intro));
		}
		//#endregion
		//#region src/client/core/i18n.ts
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
		function detectLocale() {
			try {
				const stored = localStorage.getItem("dsh-language");
				if (stored !== null && stored !== "") return stored;
			} catch {}
			try {
				const htmlLang = document.documentElement.lang;
				if (htmlLang) return htmlLang;
			} catch {}
			try {
				return navigator.language;
			} catch {
				return "zh-CN";
			}
		}
		function isZh() {
			return detectLocale().startsWith("zh");
		}
		function getGeneralTitle() {
			return isZh() ? "通用设置" : "General";
		}
		function getGeneralDesc() {
			return isZh() ? "管理语言、外观、界面与对话行为等基础偏好。" : "Manage language, appearance, interface and chat behavior preferences.";
		}
		function getRowWidthTitle() {
			return isZh() ? "对话内容宽度" : "Chat Content Width";
		}
		function getRowWidthDesc() {
			return isZh() ? "对话内容宽度，与对话区两侧的拖拽条共用同一个记忆值" : "Chat content width — shares one stored value with the drag handles beside the transcript";
		}
		function getRowSidebarSizeTitle() {
			return isZh() ? "工作区字号" : "Workspace Font Size";
		}
		function getRowSidebarSizeDesc() {
			return isZh() ? "左侧工作区列表、按钮与图标的整体大小" : "Overall size of the left workspace list, buttons and icons";
		}
		function getRowFontTitle() {
			return isZh() ? "字体" : "Font";
		}
		function getRowFontDesc() {
			return isZh() ? "对话正文与代码块使用的字体栈；未安装的字体会标记出来" : "Font stack for chat prose and code blocks; missing families are flagged";
		}
		/** Second half of the font row: which surfaces the stack applies to. */
		function getScopeTitle() {
			return isZh() ? "字体作用范围" : "Font Scope";
		}
		function getScopeDesc() {
			return isZh() ? "「整个界面」会覆盖官方固定的界面字体（官方没有此项设置）" : "\"Whole UI\" overrides the product-defined interface font (the product has no such setting)";
		}
		function getScopeContentLabel() {
			return isZh() ? "对话正文" : "Chat only";
		}
		function getScopeUiLabel() {
			return isZh() ? "整个界面" : "Whole UI";
		}
		/** Suffix on a preset the machine does not have installed. */
		function getFontMissingLabel() {
			return isZh() ? "未安装" : "not installed";
		}
		/** Right-panel toggle: snap the frame track, glide the content on the compositor. */
		function getRowPanelGlideTitle() {
			return isZh() ? "侧栏开合平顺" : "Smooth Panel Toggle";
		}
		function getRowPanelGlideDesc() {
			return isZh() ? "右侧栏展开/收起时不再逐帧重排整个界面：轨道一步到位，正文与输入框改由合成层平移" : "Stop the right panel toggle from re-laying out the whole frame each frame: the grid track snaps and the transcript and composer glide on the compositor";
		}
		function getFontLabel(id) {
			const zh = isZh();
			switch (id) {
				case "default": return zh ? "系统默认（HarmonyOS Sans SC）" : "System Default (HarmonyOS Sans SC)";
				case "harmony": return "HarmonyOS Sans SC";
				case "yahei": return zh ? "微软雅黑优先" : "Microsoft YaHei";
				case "noto": return "Noto Sans SC";
				case "serif": return zh ? "衬线（宋体风）" : "Serif";
				case "mono": return zh ? "等宽" : "Monospace";
				case "courier": return "Courier New";
				default: return id;
			}
		}
		function getDoctorSectionLabel() {
			return isZh() ? "UI 兼容性" : "UI Compatibility";
		}
		function getDoctorTitle() {
			return isZh() ? "UI 兼容性检查" : "UI Compatibility";
		}
		function getDoctorDesc() {
			return isZh() ? "本机只读审计：本插件有哪些 CSS 规则已经失效、哪些地方在读其他插件的私有类、哪些表面被谁占用。数据不出本机，不联网、不调用模型。" : "Local read-only audit: which of this plugin's CSS rules no longer match anything, where it still reads another plugin's private classes, and which surface is owned by whom. Nothing leaves the machine.";
		}
		function getDoctorRunLabel() {
			return isZh() ? "运行检查" : "Run check";
		}
		function getDoctorExportLabel() {
			return isZh() ? "导出 Markdown" : "Export Markdown";
		}
		function getDoctorResetLabel() {
			return isZh() ? "清空跨视图记录" : "Reset cross-view ledger";
		}
		function getDoctorRulesLabel() {
			return isZh() ? "规则命中" : "Rule matches";
		}
		function getDoctorCouplingsLabel() {
			return isZh() ? "跨插件耦合" : "Foreign couplings";
		}
		function getDoctorConflictsLabel() {
			return isZh() ? "冲突与冗余" : "Conflicts / redundancy";
		}
		function getDoctorSurfacesLabel() {
			return isZh() ? "表面占用" : "Surfaces";
		}
		function getDoctorMaterialLabel() {
			return isZh() ? "材质状态" : "Material";
		}
		/** Stat label: selectors that matched in no observed view yet. */
		function getDoctorDeadEveryViewLabel() {
			return isZh() ? "所有视图均未命中" : "dead in every view";
		}
		/** Rules-block subtitle: dead in every view the ledger has seen. */
		function getDoctorDeadInEveryObservedView() {
			return isZh() ? "所有已观察视图中均未命中" : "dead in every observed view";
		}
		function getDoctorViewsObservedLabel() {
			return isZh() ? "已观察视图" : "views observed";
		}
		/** Right-hand column of a row in the dead-in-every-view list. */
		function getDoctorZeroMatchesEveryView() {
			return isZh() ? "所有视图中命中 0 次" : "0 matches in every view";
		}
		/** Right-hand column of a coupling row; `count` is its live match count. */
		function getDoctorMatchCount(count) {
			return isZh() ? `命中 ${count} 处` : `${count} matches`;
		}
		function getDoctorGlassLabel() {
			return isZh() ? "半透明玻璃" : "glass";
		}
		function getDoctorSolidLabel() {
			return isZh() ? "实色" : "solid";
		}
		/** Note under a list whose rows were capped; `shown` of `total` are rendered. */
		function getDoctorTruncatedNote(shown, total) {
			return isZh() ? `仅显示前 ${shown} 条，共 ${total} 条` : `showing first ${shown} of ${total}`;
		}
		/**
		* Note under a list that clipped cell TEXT (not rows) at `limit` characters.
		*
		* Separate from {@link getDoctorTruncatedNote} on purpose: the two cuts used to
		* be silent and inconsistent (cells were sliced in the view layer with no
		* marker at all), so the reader could not tell a short selector from a clipped
		* one. Each cut now names itself.
		*/
		function getDoctorTruncatedCellsNote(limit) {
			return isZh() ? `部分单元格已截断至前 ${limit} 个字符（导出的 Markdown 保留全文）` : `some cells truncated to the first ${limit} characters (the Markdown export keeps the full text)`;
		}
		/** Returns the [introPrefix, title] pairs for the title-fill logic,
		*  keyed by current locale. */
		function getKnownTitles() {
			if (isZh()) return [["管理侧边卡片", "侧边卡片"]];
			return [["Manage side cards", "Side Cards"]];
		}
		//#endregion
		//#region src/client/self/settings/general-header.tsx
		/**
		* `GeneralHeader` — the header block registered first on Settings → General.
		*
		* Layer: self (our own page copy), rendered through the harness header recipe
		* so it is structurally identical to every other page's header.
		*/
		/**
		* The General settings page header block (title + description), registered
		* first in General.
		*
		* Rendered by {@link SettingsPageHeader}, the plugin's single header recipe: the
		* same two sibling nodes (`h2.enhc-page-title` + `p.enhc-page-intro`) that the
		* reconciler puts on every other settings page, and the same skeleton the
		* official pages ship. It used to be an inline-styled div column of its own — a
		* second implementation of the official header numbers that no stylesheet rule
		* could reach.
		* @returns the official two-node header.
		*/
		function GeneralHeader() {
			return react.createElement(SettingsPageHeader, {
				title: getGeneralTitle(),
				intro: getGeneralDesc()
			});
		}
		//#endregion
		//#region src/client/harness/controls/settings-row.tsx
		/**
		* `SettingsRow` — the official settings-row skeleton.
		*
		* Layer: harness (copied from the product's settings pages): title and
		* description stacked on the left with a 48px right gutter, the control in a
		* `flex: none` box capped at 60% width, and the row's closing hairline. The
		* tokens are the product's own, so the row reads as native on any page it is
		* injected into.
		*/
		/**
		* One settings row: title + description on the left, control on the right.
		* @param props.title - row label.
		* @param props.desc - one-line explanation under the label.
		* @param props.control - the control element rendered on the right.
		* @returns the row element.
		*/
		function SettingsRow({ title, desc, control }) {
			return react.createElement("div", { style: {
				display: "flex",
				alignItems: "center",
				gap: 8,
				padding: "16px 0",
				borderBottom: "1px solid var(--dsw-alias-border-l2)"
			} }, [react.createElement("div", {
				key: "text",
				style: {
					flex: 1,
					minWidth: 0,
					display: "flex",
					flexDirection: "column",
					gap: 4,
					paddingRight: 48
				}
			}, [react.createElement("div", {
				key: "title",
				style: {
					fontSize: 14,
					lineHeight: "22px",
					color: "var(--dsw-alias-label-primary)"
				}
			}, title), react.createElement("div", {
				key: "desc",
				style: {
					fontSize: 12,
					lineHeight: "18px",
					color: "var(--dsw-alias-label-tertiary)"
				}
			}, desc)]), react.createElement("div", {
				key: "control",
				style: {
					flex: "none",
					maxWidth: "60%",
					minWidth: 0
				}
			}, control)]);
		}
		//#endregion
		//#region src/client/core/react/use-mirrored.ts
		/**
		* `useMirrored` — the props → local state mirror every control in this plugin uses.
		*
		* Layer: core (infrastructure). Extracted from the five controls that each
		* carried the same two lines (`components.tsx`), so the reason for the mirror
		* lives in exactly one place:
		*
		* The parent mutates the SHARED state object in place (`Object.assign(state, …)`
		* in index.ts) and never re-renders this component, so a purely controlled
		* control would give no visual feedback on click. The local copy paints the
		* click immediately, and the effect adopts an EXTERNAL change (another surface
		* editing the same knob, or a state reload) on the next render.
		*
		* @param value - the controlled value coming from shared state.
		* @returns the local mirror and its setter.
		*/
		function useMirrored(value) {
			const [local, setLocal] = react.useState(value);
			react.useEffect(() => {
				setLocal(value);
			}, [value]);
			return [local, setLocal];
		}
		//#endregion
		//#region src/client/harness/controls/stepper-control.tsx
		/**
		* `StepperControl` — the official stepper recipe, replicated.
		*
		* Layer: harness (copied from the product's theme font-size row): a pill
		* carrying the centred value, an up/down arrow column revealed on hover and
		* anchored to the pill's right edge, and the unit label after the pill. The
		* geometry lives in `self/settings-controls.module.css` (`uitw-stepper*`);
		* re-check it against the installed primitives when the product changes.
		*
		* Values follow the persisted setting; the arrows step by `step` and clamp to
		* [min, max].
		*/
		/**
		* Numeric stepper with a local mirror so the value updates immediately on
		* click; an external change to the same knob is adopted on the next render.
		* @param props.min - smallest allowed value (also disables the down arrow).
		* @param props.max - largest allowed value (also disables the up arrow).
		* @param props.step - increment per arrow press.
		* @param props.value - the persisted value.
		* @param props.onChange - called with the clamped next value.
		* @param props.unit - unit suffix printed after the pill and in arrow labels.
		* @returns the stepper element.
		*/
		function StepperControl({ min, max, step, value, onChange, unit }) {
			const [local, setLocal] = useMirrored(value);
			const bump = (delta) => {
				const next = Math.min(max, Math.max(min, local + delta));
				if (next === local) return;
				setLocal(next);
				onChange(next);
			};
			const arrow = (key, dir, disabled, delta) => react.createElement("button", {
				key,
				type: "button",
				className: "uitw-stepper-arrow",
				disabled,
				"aria-label": `${delta > 0 ? "+" : ""}${delta} ${unit}`,
				onClick: () => bump(delta)
			}, react.createElement("svg", {
				width: 9,
				height: 9,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": true
			}, react.createElement("path", {
				d: dir === "up" ? "M4 10l4-4 4 4" : "M4 6l4 4 4-4",
				stroke: "currentColor",
				strokeWidth: 1.6,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})));
			return react.createElement("div", { className: "uitw-stepper-control" }, [react.createElement("div", {
				key: "pill",
				className: "uitw-stepper"
			}, [react.createElement("span", {
				key: "v",
				className: "uitw-stepper-value"
			}, String(local)), react.createElement("span", {
				key: "a",
				className: "uitw-stepper-arrows"
			}, [arrow("up", "up", local >= max, step), arrow("down", "down", local <= min, -step)])]), react.createElement("span", {
				key: "u",
				className: "uitw-stepper-unit"
			}, unit)]);
		}
		//#endregion
		//#region src/client/harness/controls/switch-control.tsx
		/**
		* `SwitchControl` — the product's OWN Switch, one class pair instead of a look-alike.
		*
		* Layer: harness. The geometry lives in
		* `self/settings-controls.module.css` (`.uitw-switch` / `.uitw-switch-thumb`)
		* rather than in inline styles, for the same reason every other control in this
		* plugin is class-driven: only a stylesheet can express `corner-shape: round`,
		* `:focus-visible` and `:disabled`. The declarations there are copied from
		* `@deepseek-ai/dsh-client-ui-primitives`' `Switch.module.css` (read out of the
		* live CSSOM; the product's core CSS carries no data-plugin tag) — 36×20,
		* `padding: 2px`, radius 999px, track `--dsw-alias-border-l3` → on
		* `--dsw-alias-brand-primary`, 16px thumb sliding `translate(16px)` on a .12s
		* transform with no thumb shadow.
		*
		* REPLACED 2026-09-30: the previous inline recipe was 36×22 / radius 11, filled
		* `--dsw-alias-state-business-primary` (DeepSeek BLUE) when on, and carried a
		* 16px thumb with a `0 1px 2px` drop shadow sliding on `left` — a different
		* control from the one the product's own settings rows draw.
		*/
		/**
		* A controlled button that flips on click. It holds a local mirror of the value
		* so the thumb slides and the fill changes immediately on click; external value
		* changes (another surface editing the same switch) are adopted via the effect.
		* Without the mirror the parent's in-place state mutation never re-renders this
		* component and the click gives no visual feedback.
		* @param props.checked - the persisted on/off value.
		* @param props.onChange - called with the flipped value.
		* @returns the switch element.
		*/
		function SwitchControl({ checked, onChange }) {
			const [local, setLocal] = useMirrored(checked);
			return react.createElement("button", {
				type: "button",
				role: "switch",
				"aria-checked": local,
				className: "uitw-switch",
				onClick: () => {
					const next = !local;
					setLocal(next);
					onChange(next);
				}
			}, react.createElement("span", { className: "uitw-switch-thumb" }));
		}
		//#endregion
		//#region src/client/harness/controls/select-control.tsx
		/**
		* `SelectControl` — the product's own Select, RENDERED BY THE PRODUCT'S OWN CODE.
		*
		* Layer: harness. This plugin does not re-implement the control: it calls
		* `Menu` from `@deepseek-ai/dsh-client-ui-primitives`, exactly as the product's
		* settings rows do. That is what makes the popup the real thing — the portalled
		* translucent surface, the check on the chosen row, the arrow walk, Escape,
		* outside-dismiss and focus return all come from the shipped component, so they
		* cannot drift from the product's.
		*
		* THE OFFICIAL CALL SITE this mirrors (extracted from the app bundle,
		* `@deepseek-ai/dsh-client-ui-permission-presets/lib/client.js`, `PermissionRow` —
		* the 权限 row in Settings → General):
		*
		*   Menu({ open, onClose, items: options.map(o => ({ id: o.id, label })),
		*          selectedId, onSelect, align: 'end', portal: true,
		*          anchor: <button className={styles.selector} aria-haspopup="menu"
		*                          aria-expanded={open} onClick={toggle}>
		*                    {label}<IconChevronDownOutlineRegular className={styles.chevron}/>
		*                  </button> })
		*
		* The anchor's classes are the product's own trigger recipe, transcribed in
		* `self/settings-controls.module.css` and verified against the live DOM by
		* `scripts/probes/settings/verify-select-parity.mjs` (36px, radius 12,
		* `--dsw-alias-bg-module-platform`, no border, padding 0 14, gap 12, 14px/22px).
		*
		* REPLACED 2026-09-30: the previous version hand-built the surface, its material
		* layer, the rows and the check from measured CSSOM values. It matched the
		* product's numbers but was still a re-implementation — and the product's own
		* `Menu` was importable all along (the loader's frozen platform table resolves
		* `@deepseek-ai/dsh-client-ui-primitives`; `@omdsh-dev/dsh-genui` has required it
		* from its bundle since v0.1). The rule this file now follows: never rebuild a
		* product control, render the product's component.
		*/
		/**
		* A controlled single-choice dropdown in the product's own Select language.
		*
		* Holds a local mirror of the value so the trigger's text updates on pick even
		* when the parent mutates its state in place (same reason `SwitchControl` does);
		* external value changes are adopted via the effect.
		* @param props.options - the rows, in display order.
		* @param props.value - the persisted id.
		* @param props.onChange - called with the picked id.
		* @param props.ariaLabel - accessible name for the trigger (the row's title).
		* @returns the trigger and, while open, the product's Menu surface.
		*/
		function SelectControl({ options, value, onChange, ariaLabel }) {
			const [local, setLocal] = useMirrored(value);
			const [open, setOpen] = react.useState(false);
			const selected = options.find((o) => o.id === local) ?? options[0];
			const items = options.map((o) => ({
				id: o.id,
				label: o.note === void 0 ? o.label : `${o.label} · ${o.note}`
			}));
			return (0, _deepseek_ai_dsh_client_ui_primitives.Menu)({
				open,
				items,
				selectedId: local,
				align: "end",
				portal: true,
				onSelect: (id) => {
					setOpen(false);
					setLocal(id);
					onChange(id);
				},
				onClose: () => {
					setOpen(false);
				},
				anchor: react.createElement("button", {
					type: "button",
					className: "uitw-select",
					"aria-haspopup": "menu",
					"aria-expanded": open,
					"aria-label": ariaLabel,
					onClick: () => {
						setOpen((v) => !v);
					}
				}, [react.createElement("span", {
					key: "label",
					className: "uitw-select-label"
				}, selected?.label ?? ""), react.createElement(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, {
					key: "chevron",
					className: "uitw-select-chevron"
				})])
			});
		}
		//#endregion
		//#region src/client/core/state-model.ts
		/**
		* The plugin's own state shape: types, product defaults and the storage key.
		*
		* This module owns nothing but the model. Persistence lives in
		* `./state-store.ts`; the product's chat-width channel (a DSH key, not ours)
		* lives in `../harness/chat-width.ts`.
		*/
		/** Resolved preset with locale-aware label (for use in components). */
		function getPresetLabel(id) {
			return getFontLabel(id);
		}
		/** Product defaults; the plugin applies these on boot and treats them as the neutral baseline. */
		const DEFAULT_STATE = {
			width: 748,
			sidebarSize: 14,
			fontId: "default",
			fontScope: "content",
			panelGlide: true
		};
		/** localStorage key holding the persisted enhancer state. */
		const STORAGE_KEY = "harness-ui-enhancer.state";
		//#endregion
		//#region src/client/core/dom/font-probe.ts
		/**
		* Font-installed probe — pure DOM, no React.
		*
		* Layer: core (infrastructure). No `--dsw-*` token is read here and no CSS is
		* involved: the answer comes from canvas text metrics alone, so this module is
		* safe to call from any surface (settings row, Doctor, a future diagnostics
		* page). Moved verbatim out of `components.tsx`.
		*/
		/**
		* Whether a font family is installed, measured by comparing rendered text
		* width against two different baselines. `document.fonts.check` reports true
		* for unknown families in Chromium, so it cannot answer this question, and a
		* single baseline gives false negatives when the family happens to be the
		* platform's default for that generic (measured: Consolas is Chromium's
		* default `monospace` on Windows, so a monospace baseline alone reported it
		* missing).
		* @param family - family name to test (the preset's first entry).
		* @returns true when the family resolves differently from either baseline.
		*/
		function isFamilyInstalled(family) {
			try {
				const ctx = document.createElement("canvas").getContext("2d");
				if (ctx === null) return true;
				const probe = "汉字漢字abcXYZ0123";
				const width = (font) => {
					ctx.font = font;
					return ctx.measureText(probe).width;
				};
				const sansBaseline = width("72px sans-serif");
				const monoBaseline = width("72px monospace");
				const bogusSans = width("72px \"__enhc_missing__\", sans-serif");
				const bogusMono = width("72px \"__enhc_missing__\", monospace");
				const withSans = width(`72px "${family}", sans-serif`);
				const withMono = width(`72px "${family}", monospace`);
				return withSans !== sansBaseline && withSans !== bogusSans || withMono !== monoBaseline && withMono !== bogusMono;
			} catch {
				return true;
			}
		}
		//#endregion
		//#region src/client/self/settings/font-selector.tsx
		/**
		* `FontSelector` — this plugin's font-preset picker.
		*
		* Layer: self (the options are OUR `FONT_PRESETS`, not a product control). The
		* control itself is NOT bespoke: it is `harness/controls/SelectControl`, i.e. the
		* product's own settings Select, so this row is drawn by the same rules as
		* 权限 / 语言. The only local content is the option table and the installed-font
		* hint, which greys nothing and blocks nothing — an absent family is annotated,
		* never hidden, because the reader may be picking a family for another machine's
		* config or about to install it.
		*
		* REPLACED 2026-09-30: this file used to carry ~60 lines of inline styles for a
		* look-alike pill and menu (radius 18, a 1px `border-inverted`, the
		* `--dsw-specific-menu` fill, `--dsw-shadow-lv3`, 40px rows). Every one of those
		* numbers was a different control than the product draws; the shared
		* SelectControl now carries the measured recipe instead.
		*/
		/**
		* Font-preset dropdown: the product's settings Select over our presets.
		* @param props.value - the persisted preset id.
		* @param props.onChange - called with the picked preset id.
		* @param props.presets - the preset table to list.
		* @returns the trigger and, while open, its menu.
		*/
		function FontSelector({ value, onChange, presets }) {
			const options = presets.map((p) => ({
				id: p.id,
				label: getPresetLabel(p.id),
				note: p.probe !== null && !isFamilyInstalled(p.probe) ? getFontMissingLabel() : void 0
			}));
			return react.createElement(SelectControl, {
				options,
				value,
				onChange
			});
		}
		//#endregion
		//#region src/client/self/settings/general-rows.tsx
		/**
		* `SettingsGeneralRow` — the "界面定制" block registered in Settings → General.
		*
		* Layer: self (this plugin's own knobs). The row/control shells it composes come
		* from `harness/controls/*`; the labels come from `i18n.ts` so a language switch
		* re-reads them. Every control is a MODULE-LEVEL constant — never defined inline
		* here — so React keeps its identity across renders.
		*/
		/**
		* The interface customization block: chat width, sidebar size, font family,
		* font scope and the right-panel glide.
		* @param props.state - the shared enhancer state.
		* @param props.onApply - patch applier (mutates shared state + re-applies CSS).
		* @param props.presets - font preset table handed to the selector.
		* @returns the column of rows.
		*/
		function SettingsGeneralRow({ state, onApply, presets }) {
			return react.createElement("div", { style: {
				display: "flex",
				flexDirection: "column"
			} }, [
				react.createElement(SettingsRow, {
					key: "width",
					title: getRowWidthTitle(),
					desc: getRowWidthDesc(),
					control: react.createElement(StepperControl, {
						min: 640,
						max: 1e3,
						step: 4,
						value: state.width,
						unit: "px",
						onChange: (v) => {
							onApply({ width: v });
						}
					})
				}),
				react.createElement(SettingsRow, {
					key: "sidebar",
					title: getRowSidebarSizeTitle(),
					desc: getRowSidebarSizeDesc(),
					control: react.createElement(StepperControl, {
						min: 12,
						max: 20,
						step: 1,
						value: state.sidebarSize,
						unit: "px",
						onChange: (v) => {
							onApply({ sidebarSize: v });
						}
					})
				}),
				react.createElement(SettingsRow, {
					key: "font-family",
					title: getRowFontTitle(),
					desc: getRowFontDesc(),
					control: react.createElement(FontSelector, {
						value: state.fontId,
						presets,
						onChange: (v) => {
							onApply({ fontId: v });
						}
					})
				}),
				react.createElement(SettingsRow, {
					key: "font-scope",
					title: getScopeTitle(),
					desc: getScopeDesc(),
					control: react.createElement(SelectControl, {
						options: [{
							id: "content",
							label: getScopeContentLabel()
						}, {
							id: "ui",
							label: getScopeUiLabel()
						}],
						value: state.fontScope,
						onChange: (v) => {
							onApply({ fontScope: v });
						},
						ariaLabel: getScopeTitle()
					})
				}),
				react.createElement(SettingsRow, {
					key: "panel-glide",
					title: getRowPanelGlideTitle(),
					desc: getRowPanelGlideDesc(),
					control: react.createElement(SwitchControl, {
						checked: state.panelGlide,
						onChange: (v) => {
							onApply({ panelGlide: v });
						}
					})
				})
			]);
		}
		//#endregion
		//#region src/client/harness/chat-width.ts
		/**
		* The PRODUCT's own chat-width preference — the same key its `WidthHandle`s
		* (the two `div[data-width-handle]` drag strips beside the transcript) write on
		* release, and the same one `ConversationRoot` re-reads on every column resize.
		*
		* The width row and those handles therefore share ONE value: the row writes this
		* key plus `--dsh-chat-user-width`, and a drag by either handle lands here for
		* the next panel open. Writing the key alone would not repaint (the product only
		* re-reads it on resize), which is why the inline property is written too.
		*/
		const CHAT_WIDTH_KEY = "dsh.conversation.contentWidth";
		/** The product's edge budget (24px inset + 40px handle strip + 24px safe zone per side). */
		const CHAT_WIDTH_EDGE_BUDGET = 176;
		/** The row's upper bound (the product's own adaptive ceiling tops out at 920). */
		const CHAT_WIDTH_MAX = 1e3;
		/**
		* The element that consumes `--dsh-chat-user-width`: `ConversationRoot` is the
		* only `*_root[data-phase]` node under the conversation outlet.
		* @returns the conversation root, or null before it is mounted.
		*/
		function conversationRoot() {
			const root = (document.querySelector("[data-slot=\"main.conversation\"], [data-slot=\"conversation\"]") ?? document).querySelector("[class$=\"_root\"][data-phase]");
			return root instanceof HTMLElement ? root : null;
		}
		/**
		* Clamp a width into the product's contract, measured against the live column
		* exactly the way `resolveContentWidth` does.
		* @param width - the wanted transcript width in px.
		* @returns the width the product will actually accept.
		*/
		function clampChatWidth(width) {
			const root = conversationRoot();
			const ceiling = root === null ? CHAT_WIDTH_MAX : Math.min(CHAT_WIDTH_MAX, Math.max(640, root.offsetWidth - CHAT_WIDTH_EDGE_BUDGET));
			return Math.min(Math.max(Math.round(width), 640), ceiling);
		}
		/**
		* Read the product's persisted chat width.
		* @returns the stored width, or null when unset, unreadable, or not a number.
		*/
		function readChatWidth() {
			try {
				const raw = localStorage.getItem(CHAT_WIDTH_KEY);
				if (raw === null) return null;
				const value = Number(raw);
				return Number.isFinite(value) && value > 0 ? value : null;
			} catch {
				return null;
			}
		}
		/**
		* Publish a width on the product's channel: the persisted key AND the inline
		* property the CSS axis reads.
		* @param width - a width already clamped by {@link clampChatWidth}.
		*/
		function writeChatWidth(width) {
			try {
				localStorage.setItem(CHAT_WIDTH_KEY, `${width}`);
			} catch {}
			const root = conversationRoot();
			if (root !== null) root.style.setProperty("--dsh-chat-user-width", `${width}px`);
		}
		/**
		* Adopt the product's persisted chat width INTO a live state object.
		* @param state - the live state object to update in place.
		* @returns true when a stored width was adopted.
		*/
		function adoptSharedWidth(state) {
			const shared = readChatWidth();
			if (shared === null) return false;
			state.width = Math.min(Math.max(Math.round(shared), 640), CHAT_WIDTH_MAX);
			return true;
		}
		//#endregion
		//#region src/client/core/harmony/contract.ts
		/** Custom property names published on `<html>`. */
		const VARS = {
			contract: "--enhc-contract",
			surfaceSolid: "--enhc-surface-solid",
			glassAware: "--enhc-glass-aware",
			contentWidth: "--enhc-content-width",
			sidebarScale: "--enhc-sidebar-scale"
		};
		//#endregion
		//#region src/client/self/font-presets.ts
		/** Font presets: id → stack (null keeps the product default). Labels are
		*  resolved at render time via getFontLabel() so language switches take effect
		*  without a page reload. `mono` presets also own the code/code-block tokens;
		*  prose presets leave code on the product's own code family. `probe` is the
		*  family name the settings row checks against the machine's installed fonts. */
		const FONT_PRESETS = [
			{
				id: "default",
				stack: null,
				mono: false,
				probe: null
			},
			{
				id: "harmony",
				stack: "'HarmonyOS Sans SC', 'HarmonyOS Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif",
				mono: false,
				probe: "HarmonyOS Sans SC"
			},
			{
				id: "yahei",
				stack: "'Microsoft YaHei', 'PingFang SC', 'Segoe UI', sans-serif",
				mono: false,
				probe: "Microsoft YaHei"
			},
			{
				id: "noto",
				stack: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
				mono: false,
				probe: "Noto Sans SC"
			},
			{
				id: "serif",
				stack: "Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif",
				mono: false,
				probe: "Georgia"
			},
			{
				id: "mono",
				stack: "'JetBrains Mono', 'SF Mono', Consolas, 'Courier New', monospace",
				mono: true,
				probe: "JetBrains Mono"
			},
			{
				id: "courier",
				stack: "'Courier New', 'Consolas', monospace",
				mono: true,
				probe: "Courier New"
			}
		];
		//#endregion
		//#region src/client/core/state-store.ts
		/**
		* Persistence on this plugin's OWN storage key (`STORAGE_KEY`).
		*
		* The width bounds are imported from the product channel in
		* `../harness/chat-width.ts` so this file never keeps a second copy of them.
		*/
		/**
		* Adopt the product's persisted chat width when there is one.
		* @param state - the state loaded from this plugin's own key.
		* @returns the state with the shared width applied when one is stored.
		*/
		function withSharedWidth(state) {
			const next = { ...state };
			adoptSharedWidth(next);
			return next;
		}
		/**
		* Read the persisted state, falling back to defaults on any parse or shape
		* error (the key may be absent, corrupted, or from an older schema that also
		* carried a now-removed `fontSize` field).
		* @returns the merged persisted state.
		*/
		function loadState() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw === null) return withSharedWidth({ ...DEFAULT_STATE });
				const parsed = JSON.parse(raw);
				delete parsed.card;
				const state = {
					...DEFAULT_STATE,
					...parsed
				};
				if (!Number.isFinite(state.width) || state.width < 640 || state.width > 1e3) state.width = DEFAULT_STATE.width;
				if (!Number.isFinite(state.sidebarSize) || state.sidebarSize < 12 || state.sidebarSize > 20) state.sidebarSize = DEFAULT_STATE.sidebarSize;
				if (typeof state.fontId !== "string" || !FONT_PRESETS.some((p) => p.id === state.fontId)) state.fontId = DEFAULT_STATE.fontId;
				if (state.fontScope !== "content" && state.fontScope !== "ui") state.fontScope = DEFAULT_STATE.fontScope;
				if (typeof state.panelGlide !== "boolean") state.panelGlide = DEFAULT_STATE.panelGlide;
				return withSharedWidth(state);
			} catch {
				return withSharedWidth({ ...DEFAULT_STATE });
			}
		}
		/** Persist the current state to localStorage. */
		function saveState(state) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
			} catch {}
		}
		//#endregion
		//#region src/client/harness/fonts.ts
		/**
		* Font application on the product's official channels.
		*
		* The chosen stack is written as INLINE custom properties on `<body>` / `<html>`
		* publishing `--dsw-font-*` and the `--dsh-content-font-*` references. This is
		* deliberate: the tokens are declared by the theme inside a `<style>` tag that
		* the product appends AFTER our bundle's tag (measured: ours at head order 4,
		* the theme's at 25), so an equal-specificity stylesheet rule of ours loses no
		* matter when we rewrite it. Inline properties are order-independent and the
		* disposer removes them.
		*/
		/** One preset resolved to a stack, or null for the product default. */
		function presetStack(id) {
			const preset = FONT_PRESETS.find((p) => p.id === id);
			if (preset === void 0 || preset.stack === null) return null;
			return {
				stack: preset.stack,
				mono: preset.mono
			};
		}
		/** Official size channel, referenced so the product's own row keeps working. */
		const SIZE = "var(--dsh-content-font-size, 14px)";
		const LINE = "calc(24px + var(--dsh-content-font-delta, 0px))";
		const DELTA = "var(--dsh-content-font-delta, 0px)";
		const SIZE_2 = "var(--dsh-content-font-size-secondary, 13px)";
		const DELTA_2 = "var(--dsh-content-font-delta-secondary, 0px)";
		/**
		* Prose tokens, expressed on top of the product's own size variables.
		*
		* Every size here is a reference to the official channel (`--dsh-content-font-
		* size` and its delta), never a fixed px, so installing this plugin cannot
		* freeze or fight the product's own font-size row. Only the family changes.
		* @param family - the font stack to substitute.
		* @returns token name → value.
		*/
		function proseTokens(family) {
			const f = family;
			return {
				"--dsw-font-markdown-base": `400 ${SIZE}/${LINE} ${f}`,
				"--dsw-font-markdown-base-strong": `600 ${SIZE}/${LINE} ${f}`,
				"--dsw-font-markdown-base-italic": `italic 400 ${SIZE}/${LINE} ${f}`,
				"--dsw-font-markdown-base-strong-italic": `italic 600 ${SIZE}/${LINE} ${f}`,
				"--dsw-font-markdown-h1": `700 calc(21px + ${DELTA})/calc(30px + ${DELTA}) ${f}`,
				"--dsw-font-markdown-h2": `700 calc(19px + ${DELTA})/calc(28px + ${DELTA}) ${f}`,
				"--dsw-font-markdown-h3": `700 calc(18px + ${DELTA})/calc(26px + ${DELTA}) ${f}`,
				"--dsw-font-markdown-h4": `600 ${SIZE}/calc(24px + ${DELTA}) ${f}`,
				"--dsw-font-markdown-table": `400 ${SIZE_2}/calc(22px + ${DELTA_2}) ${f}`,
				"--dsw-font-markdown-table-head": `500 ${SIZE_2}/calc(22px + ${DELTA_2}) ${f}`
			};
		}
		/**
		* Code tokens, only written for monospace presets — a prose stack must never
		* drag the code family with it (the product keeps `--ds-font-family-code`).
		* @param family - the monospace stack to substitute.
		* @returns token name → value.
		*/
		function codeTokens(family) {
			return {
				"--dsw-font-markdown-code": `400 12px/19px ${family}`,
				"--dsw-font-markdown-code-block": `400 11px/19px ${family}`,
				"--dsw-font-markdown-code-block-small": `400 11px/16px ${family}`,
				"--dsw-font-markdown-code-font-family": family
			};
		}
		/** Inline properties this plugin owns right now, for exact removal. */
		let appliedFontProps = [];
		/** Remove every inline font property the plugin wrote. */
		function clearFontProps() {
			for (const { el, name } of appliedFontProps) el.style.removeProperty(name);
			appliedFontProps = [];
		}
		/**
		* Apply the chosen font stack.
		* @param state - current enhancer state.
		*/
		function applyFont(state) {
			clearFontProps();
			const preset = presetStack(state.fontId);
			if (preset === null) return;
			const root = document.documentElement;
			const body = document.body;
			if (body === null) return;
			if (state.fontScope === "ui") {
				root.style.setProperty("--dsw-font-family", preset.stack);
				appliedFontProps.push({
					el: root,
					name: "--dsw-font-family"
				});
			}
			const tokens = {
				...proseTokens(preset.stack),
				...preset.mono ? codeTokens(preset.stack) : {}
			};
			for (const [name, value] of Object.entries(tokens)) {
				body.style.setProperty(name, value);
				appliedFontProps.push({
					el: body,
					name
				});
			}
		}
		//#endregion
		//#region src/client/harness/chrome/instant-track.ts
		/**
		* Right-panel toggle: snap the frame's grid track, then glide the content with
		* compositor-friendly covers.
		*
		* Layer: harness/chrome (DOM behaviour aimed at the DSH shell's own chrome).
		* Seams: `<html>` root classes the harness stylesheet keys on
		* (`harness/frame-column-transition.module.css`), the product's own
		* `data-sidebar-right-*` toggle attributes, and the two class-suffix hosts the
		* conversation is built from. No private module class names (all three
		* selectors are suffix/attribute matches, the same seam the rest of this plugin
		* uses).
		*
		* WHY THIS EXISTS
		*
		* `harness/frame-column-transition.module.css` keeps the AppFrame's
		* `grid-template-columns` transition permanently, because DSH 0.2.0 gates it
		* behind `[data-animating]` and sets that attribute on the same commit that
		* writes the new track — so the transition never starts and the conversation
		* snaps. That permanent tween is right for the LEFT panel, whose track change
		* costs one relayout. It is wrong for the RIGHT panel, because opening/closing
		* it rewrites a LAYOUT property across the whole frame:
		*
		*   measured (1707x1067, one right-panel toggle, long conversation loaded)
		*     - the center track eases 1427px -> 659px, and every frame of the 300ms
		*       window re-lays out the entire frame (scrollHeight 10857 -> 10905 ->
		*       10929 -> stable);
		*     - the product's own ResizeObserver wakes per frame: 27 callbacks against
		*       10 for the equivalent left-panel toggle (3.7x);
		*     - main-thread exclusive time in that window goes to UpdateLayoutTree
		*       (506.8ms of a 987.0ms busy window; Layerize 210.3ms, Paint 71.3ms),
		*       i.e. the thread is re-styling and re-laying out, not painting — while
		*       the compositor thread spends 0.6ms and the GPU thread 0ms, so nothing
		*       is lost to compositing or upload;
		*     - sampled at frame granularity the whole 226ms ease produced 3 frames
		*       (~13fps inside the window, 70-80fps outside it).
		*
		* So on a right-panel toggle the ease buys a 300ms glide at the cost of the
		* frame budget of the entire window. This module collapses the tween to a
		* single frame and re-adds the motion as covers:
		*
		*   - the transcript column `[class$='_column']` gets a `transform` cover
		*     (compositor property; probe V: `overflow: visible`, `position: static`,
		*     0 `position: fixed` descendants out of 10878, so it is the only host that
		*     can carry a transform without moving dsh-widgets' rail);
		*   - the composer capsule `[data-slot=conversation.composer.bar] [class*='_card']`
		*     gets a `left` cover. It CANNOT take a transform: its subtree contains
		*     `[data-slot=conversation.input.overlay]` -> `.dsx-stats-drawer` ->
		*     `.dsx-stats-drawer-zoom` -> `.dsx-stats-rail`, three `position: fixed`
		*     nodes, so a transform on this host rewrites their containing block and
		*     drags the rail into the viewport (measured: rail 1247 -> 553, and an
		*     inverse transform on the rail itself does not repair it — 1247 -> 412).
		*     `left` is a layout property, so it does not create a containing block and
		*     the fixed subtree stays put (measured: rail drift 0.0 at 60/150/240ms).
		*
		* The track is snapped by setting `data-enhc-instant` on `<html>` in a
		* CAPTURE-phase listener, i.e. before the product's own handler writes the new
		* track — a bubble-phase or observer-based gate is too late, because the
		* before-change style is already the after-change one by then. It is an
		* attribute rather than a class because the theme observer on `<html>`'s
		* `class` would rebuild the material layer on each write (measured 6.74ms); see
		* `INSTANT_ATTR`.
		*
		* Everything here is behaviour, not policy: whether any of it runs is decided
		* by the `enhc-panel-glide` root class, which `core/apply.ts` flips from the
		* Settings switch (a class is right for that one: it is written once per
		* settings change, not twice per toggle). The CSS gate is written against both
		* (`html.enhc-panel-glide[data-enhc-instant]`), so with the setting off this
		* module is inert twice over.
		*
		* NOT claimed: this does not make the right-panel toggle free. The snap still
		* costs one full-frame relayout (measured 227ms of blocking in the window,
		* against 272ms with the ease) — the residual is the product's, not this
		* module's. What it removes is the 300ms of per-frame relayout.
		*
		* WHY THE COVER RUNS ON THE PRODUCT'S OWN CLOCK
		*
		* The first cut of this module held the transcript's visual edge at its
		* pre-toggle position while it waited for the layout to settle (a rAF hold plus
		* a ResizeObserver re-pin) and only then eased to the resting value. Sync-anchor
		* probing (four arms, ON/OFF x open/close) showed that is wrong twice over:
		*
		*   - it starts LATE. The hold released only after two stable readings; on a
		*     long conversation the click blocks the thread (~180ms measured), so the
		*     cover was created with `elapsed ~= 180ms` and its ease was compacted into
		*     the old `MIN_COVER_MS = 120` floor. Measured glide window: 616 -> 600 ->
		*     538 -> 431 -> 324 -> 312 px over ~150ms, against the panel's own 300ms;
		*   - it moves the transcript the WRONG WAY FIRST. The pin writes
		*     `before - layout` after the frame has already snapped the track, so the
		*     column is dragged back out over the panel (measured +304px here) for the
		*     whole hold. That is the "flash, then slide" report: the panel is already
		*     at its resting place while the transcript is still painted on top of it.
		*
		* The product states the invariant this module has to meet (the `data-animating`
		* doc block in AppFrame): "Track and panel travel on one shared curve only while
		* animating ... an occupant that used its own would detach the panel's edge from
		* the conversation's while squeezing." Both the track and the occupant read
		* `--ds-transition-duration-slow` (0.3s) and `--ds-ease-in-out`
		* (`cubic-bezier(0.4, 0, 0.2, 1)`). Snap-and-cover is only compliant if the
		* cover runs that same 300ms on that same curve, starting when the layout
		* actually moves.
		*
		* So: the cover is armed on the first frame the layout is seen to move, it
		* always runs the FULL `COVER_MS`, and it has no hold and no re-pin. The offset
		* eases from `before - layout` to `0`, which makes the first covered frame
		* identical to the pre-toggle position and the last covered frame identical to
		* whatever the layout rests at — nothing is predicted and no frame is painted
		* outside the corridor between the two.
		*
		* WHY THE SEED IS CORRECTED AND THE PROGRESS IS NOT
		*
		* The transcript's snapped layout is not immediately final: the column's own
		* `max-width` catches up in a LATER TASK OF THE SAME FRAME (measured on close:
		* the centre track is already back to 1427px while the column still reports a
		* centred edge of 670px, then 616px once `max-width` has been committed). A
		* `getBoundingClientRect()` in the driver's rAF callback forces a flush, so it
		* reads the first value, but the frame is PAINTED against the second one — the
		* offset seeded from the transient then paints the transcript 54px outside its
		* corridor (`visual = 616 + (-358) = 258px` against a 312..616px corridor).
		*
		* Holding the visual edge until the layout looked settled (the previous
		* design's `hold`/`pin`) removed that pop but reintroduced the flash, because
		* waiting for two stable readings cost ~180ms. So the seed is corrected
		* instead, and it is corrected in the one place that is guaranteed to run after
		* layout and before paint and to fire exactly when the value changes: a
		* ResizeObserver on the host (`max-width` changes the column's border box; the
		* composer capsule changes width for the same reason).
		*
		* The correction re-derives `from = before - layout` from the LIVE box and
		* re-seats the running animation's keyframes, keeping its clock (`setKeyframes`
		* does not restart it). Because the keyframes are `from -> 0`, the painted
		* offset is `(1 - progress) * from`, so the layout can be recovered from the
		* painted box by taking that offset back out — no re-pin, no second driver.
		* What the correction must NOT do is touch the progress: re-seating `from` so
		* that `layout + (1 - p) * from == before` would freeze the transcript for the
		* whole ease, which is the hold this design exists to avoid. Re-seating it to
		* `before - layout` makes the painted box `before + p * (layout - before)` for
		* whatever the layout currently is, so a transient shows up as a slightly wrong
		* ENDPOINT ESTIMATE that the next correction fixes, never as a jump.
		*
		* WHY THE GATE IS FINISHED, NOT SKIPPED
		*
		* With the cover armed on the ResizeObserver the motion itself was right, but
		* it was one frame LATE: measured on an open (long conversation, loaded thread)
		* the dock's slide took `startTime` 94.6ms after the click and the transcript
		* cover 219.8ms, against a 151.7ms worst frame gap — one frame, and on this
		* thread a frame is ~100ms.
		*
		* The frame is the gate's own duration. `0.001s` is deliberate (a transition is
		* what publishes the `transitionrun` beat dsh-widgets' rail yield reads,
		* measure.ts:161-167, and `0s` — i.e. no transition at all — costs that beat),
		* but a NON-ZERO duration also means the computed value is still the OLD one
		* for the whole rendering step that starts the transition: measured in
		* isolation, `transition: width 0.001s` reads 700px in the step that writes
		* 200px and 200px only in the next one. So the step whose paint should hold the
		* transcript still does not lay the new track out, no box changes, no
		* ResizeObserver delivery happens in it — while the product's panel slide needs
		* no layout and starts in that very step.
		*
		* Finishing the gate's transitions in the microtask that follows the product's
		* own track write settles the value inside that same task, so the layout, the
		* product's own ResizeObserver, both covers and the slide all land in ONE
		* rendering step. The transition still runs and still dispatches
		* `transitionrun`/`transitionstart`/`transitionend`, which is the whole point of
		* keeping it (`finish()` in a `MutationObserver` callback on the writing task
		* reads the new value in that task and still emits run/start/end — verified in
		* isolation before this was written).
		*/
		/** Root class `core/apply.ts` keeps while the user has the option enabled. */
		const PANEL_GLIDE_CLASS = "enhc-panel-glide";
		/**
		* Root ATTRIBUTE that collapses the frame's track tween to one frame.
		*
		* An attribute rather than a class, and that is a measured cost decision, not
		* style. `core/harmony/runtime.ts:87-89` keeps a `MutationObserver` on
		* `<html>`'s `class` (a theme may flip by class) whose callback is
		* `refreshMaterial()`, i.e. a `getComputedStyle(document.body)` plus several
		* property reads and writes — and a forced style recalc is exactly what this
		* module exists to avoid. Measured on the live page (`.tmp-h4cost.cjs`, 20
		* add/remove cycles of a class vs 20 `setAttribute` calls on `<html>`,
		* back-to-back in one task): **6.74ms mean / 9.6ms max per class mutation**
		* against **0.02ms mean** per attribute mutation, ~270ms vs 0.4ms over the
		* sample. Both calls here happen in the CAPTURE-phase click handler, i.e.
		* BEFORE the product writes the new track, so that ~6.7ms used to sit directly
		* in the pre-commit critical path of every toggle — twice, once on the way in
		* and once on the way out. The observer's filter does not list the attribute,
		* so these writes wake nothing.
		*/
		const INSTANT_ATTR = "data-enhc-instant";
		/**
		* Root ATTRIBUTE that marks an OPENING toggle, for the duration of the snap.
		*
		* The product slides its right-hand occupant on CLOSE (the closed-state rule
		* carries `transform: translateX(--dsh-sidebar-width)` and the open-state rule
		* puts `transition: transform` on the same elements) but not on OPEN: the dock
		* is mounted *by* the commit that also sets `data-sidebar-right-open`, so its
		* first computed style is already the open one and there is no before-change
		* style for the transition to start from. Measured: four open arms, no
		* `transform` animation on `[data-dockkit-host="dock"]`, the element inserted
		* directly at its resting rect. The panel therefore *pops* while the transcript
		* eases — the two halves of the product's own "one shared curve" contract
		* disagree. `frame-column-transition.module.css` uses this attribute to run the
		* missing half as a keyframe slide, which needs no before-change style.
		*
		* It is tracked separately from the instant gate so the slide can never be
		* applied to a CLOSE, where the occupant is already animating on the product's
		* own transition. Like that gate it is an attribute, not a class, for the
		* measured `refreshMaterial` cost documented on `INSTANT_ATTR`.
		*/
		const OPENING_ATTR = "data-enhc-opening";
		/**
		* When the release FIRST runs, counted from the click — and not a lifetime.
		*
		* It has to be late enough that the product's commit has landed (the frame's
		* track write is measured 30-50ms after the click, but on a starved thread the
		* whole commit has run as late as ~178ms) and early enough that the snap's
		* `transition-duration: 0.001s` is off the frame and the viewport well before
		* their next legitimate transition. If the covers or the OPEN slide are still
		* moving at this point the release defers (see `release`), so this value does
		* not truncate them.
		*/
		const HOLD_MS = 420;
		/**
		* The cover's clock, in ms — the product's own `--ds-transition-duration-slow`.
		*
		* Deliberately NOT compacted for the time the snap spends blocking the thread:
		* the panel and the track run their own 300ms from the moment they are written,
		* so a shorter cover is what detaches the transcript from them.
		*/
		const COVER_MS = 300;
		/** The product's own `--ds-ease-in-out`. */
		const COVER_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
		/** The product's right-panel toggle and its collapsed-state affordance. */
		const TOGGLE_SELECTOR = "[data-sidebar-right-toggle],[data-sidebar-right-expand]";
		/** AppFrame's grid, which carries the collapsed marker and the inline track. */
		const FRAME_SELECTOR = "[class$=\"_frame\"]";
		/**
		* The conversation viewport, whose box follows the frame's centre track.
		*
		* Included in the gate because on the CLOSE direction it is the second half of
		* the same squeeze: the track is instantly 1427px wide while the viewport's own
		* easing is still on the old padding, so the content box is momentarily the
		* full width and the column centres away from its track (measured per frame
		* 312 -> 647 -> 325 -> 368 -> 386; the OFF arm is monotone 312 -> 336 -> 364 ->
		* 383 -> 386, where track and padding ease together). Collapsing both keeps the
		* layout in agreement at every frame, which is what makes the cover's `from`
		* the true displacement (-74px) instead of a transient (-344px).
		*
		* In the sessions measured for this change the viewport's `padding-right` never
		* left 0px and the settle microtask never found a transition on it, i.e. the
		* rule is inert there and only bites when a rail does squeeze the viewport —
		* which is why it is kept: inert is free, and the disagreement it prevents is
		* exactly one frame of a wrong centre.
		*/
		const SCROLL_SELECTOR = "[class$=\"_scrollBody\"]";
		/**
		* The product's right-hand occupant — the element that carries the slide.
		*
		* The same node as `[class*="_tabCell"]`; selected by the dockkit host marker,
		* which the product publishes itself rather than hashing.
		*/
		const DOCK_SELECTOR = "[data-sidebar-right-panel] [data-dockkit-host=\"dock\"]";
		/**
		* Name of the OPEN slide this module adds through `OPENING_ATTR` (stylesheet).
		*
		* Named here because the release below has to ask the element whether the
		* animation it started is still on screen.
		*/
		const OPENING_ANIMATION = "enhc-panel-glide-in";
		/**
		* How long before the gate's release gives up waiting for motion to finish.
		*
		* Added to `HOLD_MS` to get the deadline. The slide cannot start until the
		* product's own commit mounts the dock, measured at ~180-265ms after the click
		* on a loaded thread — so a deadline counted from the click truncates it.
		* Measured before this wait existed: `animationcancel` at `currentTime
		* 254.7/300` (84.9%) and the dock snapping from `translateX(10.35px)` straight
		* to `none`. The longest honest wait is the latest start seen (265ms) plus the
		* 300ms the slide and the covers then run, so 400ms of margin keeps the whole
		* deferral inside 820ms of the click.
		*/
		const RELEASE_MAX_WAIT_MS = 400;
		/**
		* How often the deferred release re-asks whether anything is still moving.
		*
		* A poll and not an event: the things being waited for are three different
		* objects (two covers and the product's slide), and each of them already stops
		* on its own. There is no single event to hang the release on, and the covers
		* report through their own clock.
		*
		* One frame, because this is the only cost of the wait: every poll that finds
		* motion still schedules again, and the gate stays up until one finds none. The
		* gate is not free while it is up — `data-enhc-opening` keeps the stylesheet's
		* `animation: enhc-panel-glide-in ... both` on the dock, i.e. a finished
		* animation holding a composited transform for as long as the release is late.
		* At 60ms that measured a 72.6ms tail past `animationend` on a calm run and
		* 237ms on the starved one; at one frame it is a tail of one frame.
		*/
		const RELEASE_POLL_MS = 16;
		/**
		* A transition this short is the gate's own; the product's are 200-300ms.
		*
		* The gate's duration is `0.001s` (see the stylesheet), so anything under a
		* frame is the snap and nothing else.
		*/
		const SETTLE_MAX_MS = 2;
		/** Transcript column — `xz4KEq_column`; the only transform-safe cover host. */
		const PROSE_SELECTOR = "[class$=\"_column\"]";
		/**
		* The conversation header, whose right edge rides the same track change.
		*
		* Its left edge is pinned to the left column and its right edge is the panel's,
		* so it is the one host covered by WIDTH rather than by position; the pair of
		* selectors is the same pair the header stylesheet anchors on, so the two
		* halves cannot drift apart. Anchored on the slot the product guarantees, never
		* on a hashed module class.
		*/
		const HEADER_SELECTOR = "[data-slot='conversation.header'] > header:has([class$='_titleCluster'] > [class$='_tabs']), [data-slot='conversation.session.header'] > header";
		/** The element that paints the input capsule inside the composer bar. */
		const COMPOSER_SELECTOR = "[data-slot=\"conversation.composer.bar\"] [class*=\"_card\"]";
		/**
		* How long the layout change may take before the cover is given up.
		*
		* This is a time budget, not a frame count, because the snap itself blocks the
		* main thread: measured on a long conversation the click froze the thread for
		* ~178ms, so no frame ran at all in that window and a `4`-frame budget was
		* consumed before the new geometry was even readable.
		*/
		const DEADLINE_MS = 600;
		/** Upper bound on the polling ticks, in case frames come far faster than rAF. */
		const MAX_TRIES = 60;
		/**
		* Read an element's left edge, or null when it is gone.
		*
		* Both callers read a host that has no cover of its own yet: `releaseCovers()`
		* runs at the top of the click and a new cover is only created after both hosts
		* have been read, so the value here is always the layout's, never an in-flight
		* cover's.
		*
		* @param el - candidate element.
		* @returns the viewport-space left edge in px, or null.
		*/
		function leftOf(el) {
			if (el === null || !el.isConnected) return null;
			return el.getBoundingClientRect().left;
		}
		/**
		* Cover one host whose layout has just moved: keep it painted where it was,
		* then ease it to where the layout now is.
		*
		* Called on the first frame the driver sees movement, and every write it makes
		* happens inside that frame's callback, i.e. before the frame is painted — so
		* the snapped layout is never painted uncovered and no hold is needed to hide
		* it.
		*
		* ON THE `width` MODE. The header cannot be covered positionally, because the
		* thing that moves inside it does not move by one offset: the right-anchored
		* buttons travel the panel's whole width while the badges and tabs travel only
		* the distance the title gives up, and the title itself does not move at all —
		* it changes width. Covering the pool of hosts that have no `position: fixed`
		* descendant (`_headerUtilities`, `_headerActions`, the tab strip) was the
		* first design and it still left the title to truncate instantly, because a
		* relative offset cannot stretch a box. Covering the header's own width does
		* all of it at once: measured, setting `header.style.width` back to its closed
		* value while the panel is open reproduces the closed header exactly — header
		* `280,1427,50`, title column 212px, tab strip `867.5,139,26` against the open
		* state's `280,659,78` / 41.5px / `697,87,58`.
		*
		* `width` also skips the reseat observer below, deliberately. Reseat exists to
		* re-derive a seed from a still-moving layout, and it can do that for a
		* positional cover because the identity endpoint lets the painted value be
		* un-blended (`painted - (1 - progress) * keyFrom`). A width cover has no such
		* endpoint — the layout width IS the far keyframe — so the same arithmetic
		* would only recover the value it wrote. Nothing is lost: `settleTransitions`
		* commits the frame's track inside the click's own task, and the width being
		* covered is that track's. If the arm ever did land on a stale width, `from`
		* reads under 0.5px and no cover is created — the failure is "no glide this
		* once", never a wrong glide.
		*
		* @param element - the box to offset, or to resize when `property` is `width`.
		* @param property - which mechanism this host allows.
		* @param before - px left edge (positional) or width (`width`) captured before
		*   the toggle.
		* @returns the cover record, or null when nothing should run.
		*/
		function startCover(element, property, before) {
			const sizing = property === "width";
			const position = property === "left" && getComputedStyle(element).position === "static" ? element.style.position : null;
			if (property === "left" && position !== null) element.style.position = "relative";
			const inline = property === "transform" ? element.style.transform : property === "width" ? element.style.width : element.style.left;
			let animation = null;
			let ro = null;
			let released = false;
			const stop = () => {
				if (released) return;
				released = true;
				if (ro !== null) {
					ro.disconnect();
					ro = null;
				}
				if (animation !== null) {
					animation.cancel();
					animation = null;
				}
				if (property === "transform") element.style.transform = inline;
				else if (sizing) element.style.width = inline;
				else element.style.left = inline;
				if (position !== null) element.style.position = position;
			};
			const rect = element.isConnected ? element.getBoundingClientRect() : null;
			if (rect === null) {
				stop();
				return null;
			}
			const seeds = sizing ? rect.width : rect.left;
			const from = before - seeds;
			if (!(Math.abs(from) > .5)) {
				stop();
				return null;
			}
			/**
			* The value to write for a given distance from the current layout.
			*
			* The positional modes animate their own offset and end at the identity;
			* `width` animates an absolute width and ends at the layout's, which is why
			* the seed is added back in here and nowhere else.
			*
			* @param offset - `from` for the pre-toggle geometry, 0 for the post-toggle.
			* @returns the property value for that keyframe.
			*/
			const valueOf = (offset) => property === "transform" ? `translateX(${offset}px)` : sizing ? `${seeds + offset}px` : `${offset}px`;
			if (property === "transform") element.style.transform = valueOf(from);
			else if (sizing) element.style.width = valueOf(from);
			else element.style.left = valueOf(from);
			animation = element.animate([{ [property]: valueOf(from) }, { [property]: valueOf(0) }], {
				duration: COVER_MS,
				easing: COVER_EASING,
				fill: "both"
			});
			/**
			* Re-derive the seed from the LIVE box, for as long as the snapped layout is
			* still moving under us.
			*
			* The seed is captured the moment the layout is first seen to move, and on
			* close that moment is not the layout's final value: the centre track is
			* already back to its full width while the column is still at its
			* still-constrained `max-width`, so the edge read there is a transient
			* (measured 670px) and the settled one is 616px. Seeding from the transient
			* writes a 54px-too-large offset, and the frame that paints the settled
			* layout paints it 54px outside the corridor (measured `616 - 358 = 258px`
			* against a `312..616px` corridor) — the "flash" half of the report.
			*
			* A ResizeObserver is the correction point because it fires exactly when
			* `max-width` changes the host's box and it is guaranteed to run after layout
			* and before paint, i.e. in the frame that would otherwise paint the bad
			* value.
			*
			* The keyframes run `keyFrom -> 0`, so the painted offset at any instant is
			* `(1 - progress) * keyFrom`; taking that back out of the painted box leaves
			* the layout, with no second driver and no read-back of our own writes. Only
			* the seed is re-seated — `setKeyframes` keeps the clock — so the ease
			* continues without a restart and without a hold.
			*/
			let keyFrom = from;
			const reseat = () => {
				if (released || animation === null) return;
				const effect = animation.effect;
				if (!(effect instanceof KeyframeEffect)) return;
				const progress = effect.getComputedTiming().progress;
				if (typeof progress !== "number") return;
				const next = before - (element.getBoundingClientRect().left - (1 - progress) * keyFrom);
				if (!(Math.abs(next - keyFrom) > .5)) return;
				keyFrom = next;
				effect.setKeyframes([{ [property]: valueOf(next) }, { [property]: valueOf(0) }]);
			};
			if (!sizing) {
				ro = new ResizeObserver(reseat);
				ro.observe(element);
			}
			animation.finished.then(stop, () => {});
			/**
			* Still moving pixels?
			*
			* The driver's own clock, not a timer of ours: `released` flips when the ease
			* finishes (or is cancelled), so this is exactly "the gate still has an
			* unfinished cover to protect" — the condition the release waits for.
			*/
			const busy = () => !released;
			return {
				stop,
				busy
			};
		}
		/**
		* Is this click opening the right panel (rather than closing it)?
		*
		* Read from the product's own collapsed marker on the frame. Both markers are
		* checked because the attribute is written by the same commit as the track and
		* the inline track is the more primitive of the two: on a narrow window the
		* attribute can also mean "no room for the panel", which is still a state the
		* slide must not be added to.
		*
		* @returns true when the panel is collapsed right now, i.e. this click opens.
		*/
		function openingFrom(frame) {
			if (frame === null) return false;
			const track = frame.style.gridTemplateColumns;
			if (track !== "") return /minmax\(\s*[^,]+,\s*0px\s*\)\s*$/.test(track);
			return frame.hasAttribute("data-rightbar-collapsed");
		}
		/**
		* Has the settle failure been reported this session? See `settleTransitions`.
		*/
		let settleFailureReported = false;
		/**
		* Has a failure to READ the gate's transitions been reported this session?
		*
		* Same reasoning as `settleFailureReported`, for the other silent path: a
		* `getAnimations()` that throws leaves the 1ms transition to settle on its own
		* — a one-frame desync — and without a line in the console the only symptom is
		* the animation being slightly late again, with nothing to explain it.
		*/
		let settleReadFailureReported = false;
		/**
		* Settle the gate's own ~0ms transitions, in the task that started them.
		*
		* The gate is `transition-duration: 0.001s !important` on the frame and the
		* conversation viewport (see the stylesheet): non-zero on purpose, because the
		* `transitionrun` it publishes is the beat dsh-widgets' rail yield reads, and
		* because a transition that is not created at all cannot be finished either.
		* What a non-zero duration costs is that the computed value stays the OLD one
		* for the whole rendering step that starts it, so the first frame after the
		* click does not lay the new track out — measured in isolation, a
		* `transition: width 0.001s` writes 200px and reads 700px in the same step.
		*
		* `finish()` moves the transition to its end without cancelling it, so
		* `transitionrun`/`transitionstart`/`transitionend` are all still dispatched
		* (measured: identical event list with and without the call) while the computed
		* value becomes the new one inside THIS task. The layout, the product's own
		* ResizeObserver, the covers and the panel's slide then land on one frame
		* instead of two.
		*
		* @param hosts - the two elements the gate collapses.
		* @returns how many transitions were settled (0 when the product has not
		*   written its track yet, e.g. because the commit was deferred).
		*/
		function settleTransitions(hosts) {
			let settled = 0;
			for (const host of hosts) {
				if (host === null || !host.isConnected) continue;
				let list;
				try {
					list = host.getAnimations();
				} catch (error) {
					if (!settleReadFailureReported) {
						settleReadFailureReported = true;
						console.info("[dsh-ui-harmonizer] the panel-glide gate could not be read:", error);
					}
					continue;
				}
				for (const animation of list) {
					if (!(animation instanceof CSSTransition)) continue;
					if (animation.playState !== "running") continue;
					const timing = animation.effect === null ? null : animation.effect.getTiming();
					const duration = timing === null ? null : timing.duration;
					if (typeof duration !== "number" || duration > SETTLE_MAX_MS) continue;
					try {
						animation.finish();
						settled += 1;
					} catch (error) {
						if (!settleFailureReported) {
							settleFailureReported = true;
							console.info("[dsh-ui-harmonizer] the panel-glide gate could not be settled:", error);
						}
					}
				}
			}
			return settled;
		}
		/**
		* Mount the right-panel snap-and-cover. Returns the disposer `ctx.effect`
		* wants; the listener, the pending frame, the snap class and every live cover
		* all go away with it.
		*/
		function mountInstantTrack() {
			const root = document.documentElement;
			let holdTimer = 0;
			let frameHandle = 0;
			let covers = [];
			/** Observes the two cover hosts for the current click; replaced each toggle. */
			let motionRo = null;
			/**
			* Settles the gate's ~0ms transitions in the very task that starts them.
			*
			* Armed in the click and disarmed with the snap class, so the two hosts it
			* watches are only observed during the toggle window.
			*/
			let settleMo = null;
			/**
			* Token identifying the newest toggle.
			*
			* `frameHandle` is a single slot, so a click overwrites the previous click's
			* pending frame and can no longer cancel it. That orphaned `step` then runs
			* against the layout of a LATER click: it sees movement, creates a cover, and
			* captures the inline style of the moment — which is whatever the newer
			* click's cover had already written. When that orphan cover is finally
			* stopped it "restores" the borrowed value as if it were the original,
			* leaving the transcript permanently offset (measured: 9 clicks at 130ms left
			* `transform: translateX(-230px)` and `left: -230px` behind). Every `step`
			* therefore carries the token it was born with and bails once a newer click
			* has made it stale.
			*/
			let generation = 0;
			/**
			* When the release stops waiting for motion that has not finished.
			*
			* A release that waits is only safe with a hard cap: the OPEN slide is
			* started by a selector this module cannot verify up front (a fullscreen
			* presentation, a narrow window with no room for the dock, an option flipped
			* off mid-flight), and a gate left up forever would squash the product's own
			* 300ms transitions for good.
			*/
			let releaseDeadline = 0;
			const releaseCovers = () => {
				for (const cover of covers) cover.stop();
				covers = [];
				if (motionRo !== null) {
					motionRo.disconnect();
					motionRo = null;
				}
				if (settleMo !== null) {
					settleMo.disconnect();
					settleMo = null;
				}
			};
			/**
			* Is the OPEN slide still on screen (or still coming)?
			*
			* `getAnimations()` is what separates "running" from "not started yet": the
			* attribute alone cannot, because the dock it animates is mounted by the
			* product's commit ~180-265ms after the click, and an element that does not
			* exist yet has no animation to find. `null` from the query therefore means
			* "the commit has not run yet", which is a keep-waiting answer, not a
			* finished one — but only while the attribute is up, because on a CLOSE
			* there is no slide of this module's at all.
			*/
			const slideRunning = () => {
				if (!root.hasAttribute(OPENING_ATTR)) return false;
				const dock = document.querySelector(DOCK_SELECTOR);
				if (dock === null) return true;
				for (const animation of dock.getAnimations()) if (animation instanceof CSSAnimation && animation.animationName === OPENING_ANIMATION) return animation.playState === "running";
				return false;
			};
			/**
			* Drop the gate and every cover it owns.
			*
			* Deferred while anything is still moving, and that is the fix for a visible
			* truncation: `HOLD_MS` is counted from the CLICK, while the OPEN slide
			* cannot start before the product's commit mounts the dock and the covers
			* cannot start before the settled layout is readable — both measured 180-265ms
			* later. Releasing on the click's clock therefore cancelled the slide at
			* `currentTime 254.7/300` (84.9%, with no `animationend` at all) and the dock
			* snapped from `translateX(10.35px)` straight to `none`; the covers, which
			* run the same 300ms from the same late start, were cut by the same margin.
			*
			* The INSTANT gate is NOT deferred. Its whole job is the one-frame snap of the
			* track, which is already done by the time this first runs, and leaving
			* `transition-duration: 0.001s !important` on the frame and the viewport would
			* squash any unrelated transition that happens to start in the meantime (the
			* rail's yield writes the viewport's padding). Only the OPEN slide waits.
			*/
			const release = () => {
				holdTimer = 0;
				if (settleMo !== null) {
					settleMo.disconnect();
					settleMo = null;
				}
				root.removeAttribute(INSTANT_ATTR);
				if ((covers.some((cover) => cover.busy()) || slideRunning()) && performance.now() < releaseDeadline) {
					holdTimer = window.setTimeout(release, RELEASE_POLL_MS);
					return;
				}
				releaseCovers();
				root.removeAttribute(OPENING_ATTR);
			};
			/**
			* One toggle: snap the track now, cover the boxes that moved the moment they
			* move.
			* @param event - the capture-phase click.
			*/
			const onClick = (event) => {
				if (!root.classList.contains("enhc-panel-glide")) return;
				const target = event.target;
				if (!(target instanceof Element) || target.closest(TOGGLE_SELECTOR) === null) return;
				const frame = document.querySelector(FRAME_SELECTOR);
				const opening = openingFrom(frame);
				releaseCovers();
				generation += 1;
				const mine = generation;
				const prose = document.querySelector(PROSE_SELECTOR);
				const composer = document.querySelector(COMPOSER_SELECTOR);
				const header = document.querySelector(HEADER_SELECTOR);
				const proseBefore = leftOf(prose);
				const composerBefore = leftOf(composer);
				const headerBefore = header !== null && header.isConnected ? header.getBoundingClientRect().width : null;
				root.setAttribute(INSTANT_ATTR, "");
				if (opening) root.setAttribute(OPENING_ATTR, "");
				else root.removeAttribute(OPENING_ATTR);
				if (holdTimer !== 0) window.clearTimeout(holdTimer);
				releaseDeadline = performance.now() + HOLD_MS + RELEASE_MAX_WAIT_MS;
				holdTimer = window.setTimeout(release, HOLD_MS);
				const startedAt = performance.now();
				let tries = 0;
				/**
				* Hosts that already carry a cover for THIS click.
				*
				* Two independent arming channels feed `arm`, and both legitimately fire for
				* the same toggle: the ResizeObserver (which catches the box change in the
				* frame that made it, before that frame paints) and the rAF poll (which
				* covers a shift that changed no box size). The second one to arrive must
				* not stack a second, competing ease on the same host.
				*/
				const armed = /* @__PURE__ */ new Set();
				const arm = (host, property, before) => {
					if (host === null || before === null || armed.has(host)) return;
					const cover = startCover(host, property, before);
					if (cover === null) return;
					armed.add(host);
					covers.push(cover);
				};
				const armAll = () => {
					arm(prose, "transform", proseBefore);
					arm(composer, "left", composerBefore);
					arm(header, "width", headerBefore);
				};
				/**
				* Arm on the box change itself.
				*
				* ResizeObserver delivery happens after layout and BEFORE paint of the very
				* frame that changed the box, so a cover armed here is always written in
				* time: the frame that first holds the new geometry is the frame that first
				* paints the held edge, and no frame can paint the jump uncovered. The rAF
				* poll below cannot promise that — it only runs if a frame happens to come
				* up between the layout change and the paint that follows it, and on a
				* loaded main thread (measured 107ms between frames) that window is exactly
				* what is lost.
				*/
				if (motionRo !== null) motionRo.disconnect();
				motionRo = new ResizeObserver(() => {
					if (mine !== generation || !root.classList.contains("enhc-panel-glide")) return;
					armAll();
				});
				if (prose !== null) motionRo.observe(prose);
				if (composer !== null) motionRo.observe(composer);
				if (header !== null) motionRo.observe(header);
				if (settleMo !== null) settleMo.disconnect();
				settleMo = new MutationObserver(() => {
					if (mine !== generation || !root.classList.contains("enhc-panel-glide")) return;
					if (settleTransitions([frame, document.querySelector(SCROLL_SELECTOR)]) > 0) armAll();
				});
				if (frame !== null) settleMo.observe(frame, {
					attributes: true,
					attributeFilter: ["style"]
				});
				const scrollBody = document.querySelector(SCROLL_SELECTOR);
				if (scrollBody !== null) settleMo.observe(scrollBody, {
					attributes: true,
					attributeFilter: ["style"]
				});
				const step = () => {
					frameHandle = 0;
					if (mine !== generation || !root.classList.contains("enhc-panel-glide")) return;
					tries += 1;
					const proseNow = leftOf(prose);
					const composerNow = leftOf(composer);
					const proseMoved = proseNow !== null && proseBefore !== null && Math.abs(proseNow - proseBefore) > .5;
					const composerMoved = composerNow !== null && composerBefore !== null && Math.abs(composerNow - composerBefore) > .5;
					const headerNow = header === null || !header.isConnected ? null : header.getBoundingClientRect().width;
					const headerMoved = headerNow !== null && headerBefore !== null && Math.abs(headerNow - headerBefore) > .5;
					const moved = proseMoved || composerMoved || headerMoved;
					if (!moved && tries < MAX_TRIES && performance.now() - startedAt < DEADLINE_MS) {
						frameHandle = window.requestAnimationFrame(step);
						return;
					}
					if (!moved) return;
					armAll();
				};
				frameHandle = window.requestAnimationFrame(step);
			};
			document.addEventListener("click", onClick, true);
			return () => {
				document.removeEventListener("click", onClick, true);
				if (frameHandle !== 0) window.cancelAnimationFrame(frameHandle);
				if (holdTimer !== 0) window.clearTimeout(holdTimer);
				releaseCovers();
				root.removeAttribute(INSTANT_ATTR);
				root.removeAttribute(OPENING_ATTR);
			};
		}
		//#endregion
		//#region src/client/core/apply.ts
		/**
		* Every root custom property this plugin publishes, in ONE place so the disposer
		* cannot drift from the writers.
		*
		* `--enhc-*` is the Harmony Contract surface (see harmony/contract.ts `VARS`);
		* the `--enhancer-*` pair are the pre-0.10 internal names, kept because the
		* sidebar stylesheet still sizes itself with `--enhancer-sidebar-scale`
		* (27 consumers) and because the Doctor recognizes this plugin's own sheets by
		* it. Both generations are written with the same value.
		*/
		const ROOT_PROPERTIES = [
			VARS.contentWidth,
			VARS.sidebarScale,
			"--enhancer-content-width",
			"--enhancer-sidebar-scale"
		];
		/**
		* Push the current state into the page and persist it. Idempotent; safe to call
		* on every slider move.
		* @param state - current enhancer state.
		*/
		function applyState(state) {
			saveState(state);
			const root = document.documentElement;
			const width = clampChatWidth(state.width);
			writeChatWidth(width);
			const scale = String(state.sidebarSize / 14);
			root.style.setProperty(VARS.contentWidth, `${width}px`);
			root.style.setProperty(VARS.sidebarScale, scale);
			root.style.setProperty("--enhancer-content-width", `${width}px`);
			root.style.setProperty("--enhancer-sidebar-scale", scale);
			root.classList.toggle(PANEL_GLIDE_CLASS, state.panelGlide);
			applyFont(state);
		}
		/**
		* Dispose everything this module wrote: the inline font properties and the root
		* custom properties. Called from the plugin fiber's effect disposer so
		* stopping/updating the plugin leaves zero residue.
		*/
		function disposeDynamicStyle() {
			clearFontProps();
			const root = document.documentElement;
			for (const property of ROOT_PROPERTIES) root.style.removeProperty(property);
			root.classList.remove(PANEL_GLIDE_CLASS);
			root.classList.remove("enhc-center-card-on");
			root.removeAttribute("data-enhc-instant");
			root.removeAttribute("data-enhc-opening");
		}
		//#endregion
		//#region src/client/harness/chrome/title-tooltip.ts
		/**
		* Unified native-title tooltips ("tooltip harmonizer").
		*
		* Layer: harness/chrome (DOM behaviour aimed at the DSH shell's own chrome).
		* Seams: the product's Tooltip design language, reproduced with official alias
		* tokens (`--dsw-alias-tooltip-bg`, `--dsw-static-neutral-bluish-00`,
		* `--ds-ease-in-out`) and the raw HTML `title` attribute; the only tag we write is
		* our own `<style data-plugin-css>`. No third-party private class names.
		*
		* The product ships a styled Tooltip primitive (@deepseek-ai/dsh-client-ui-primitives)
		* — dark inverted bubble, `--dsw-alias-tooltip-bg`, fixed positioning in the
		* z-index-100 popup band, 500ms hover delay, immediate on keyboard focus — but
		* any element that only carries the raw HTML `title` attribute (e.g. the model
		* selector trigger `_trigger`) never routes through it and falls back to the
		* OS-native tooltip, which looks foreign next to the rest of the UI.
		*
		* This module harmonizes exactly those stragglers: whenever hovering/focusing
		* an element with a `title` would pop the native tooltip, the attribute is
		* temporarily lifted and the same text is shown in a bubble that replicates
		* the official primitive's geometry and tokens (values extracted from the
		* compiled `.bubble` stylesheet):
		*
		* - placed 8px below the anchor (`side="bottom"` like the product's own
		*   toolbar tooltips), flipped above when there is no room below;
		* - horizontally centered on the anchor, clamped to a 12px viewport margin;
		* - 500ms hover delay, keyboard focus shows immediately;
		* - padding 3px 7px, radius 8px, font 13px/20px, white-space pre-line,
		*   max-width 50vw, z-index 100 (the shell's menu/tooltip/modal band);
		* - 0.15s fade-in on var(--ds-ease-in-out), disabled under reduced motion.
		*
		* The `title` attribute itself stays in the DOM the whole time except during
		* an active hover (that removal is what suppresses the native popup; some app
		* components also key labels off it, so it is restored verbatim — and if the
		* app rewrote the title mid-hover, its newer value wins). Everything else is
		* owned by the returned disposer: listeners, timers, the bubble node and the
		* injected <style> tag disappear together with the plugin fiber.
		*/
		/** Hover delay before the bubble appears; mirrors the product's own toolbars (delayMs=500). */
		const HOVER_DELAY_MS = 500;
		/** Viewport margin the bubble never crosses, mirroring the primitive's EDGE_MARGIN. */
		const EDGE_MARGIN = 12;
		/** Gap between the anchor edge and the bubble, mirroring the primitive (+/-8). */
		const ANCHOR_GAP = 8;
		/** CSS for the bubble. Literal `enhc-tt-*` classes (runtime-set, unhashed),
		*  official alias tokens with conservative fallbacks for boot-time hovers. */
		const TOOLTIP_CSS = `
.enhc-tt-bubble {
  position: fixed;
  z-index: 100;
  width: max-content;
  max-width: 50vw;
  box-sizing: border-box;
  padding: 3px 7px;
  border-radius: 8px;
  background: var(--dsw-alias-tooltip-bg, #16181d);
  color: var(--dsw-static-neutral-bluish-00, #f9fafb);
  font-size: 13px;
  line-height: 20px;
  white-space: pre-line;
  overflow-wrap: break-word;
  pointer-events: none;
  animation: enhc-tt-in 0.15s var(--ds-ease-in-out, ease-in-out);
}
.enhc-tt-bubble[data-side="bottom"] { transform: translate(-50%); }
.enhc-tt-bubble[data-side="top"] { transform: translate(-50%, -100%); }
@keyframes enhc-tt-in { 0% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .enhc-tt-bubble { animation: none; }
}
`;
		/** Opt-out marker: an ancestor carrying this attribute keeps its native tooltip. */
		const OPT_OUT_SELECTOR = "[data-enhc-no-tooltip]";
		/** Loader id of this plugin and tag id of its injected stylesheet. Both spellings
		*  are the ones the loader knows (`tsdown.config.ts`: banner id `dsh-ui-harmonizer`,
		*  tagId `<id>/<basename>`), so an unload sweep actually finds and removes the tag
		*  instead of leaving it behind for the whole session. */
		const PLUGIN_ID$1 = "dsh-ui-harmonizer";
		const STYLE_TAG_ID = `${PLUGIN_ID$1}/title-tooltip`;
		/** Currently presented tip, if any. */
		let active = null;
		/** Pending show timer (null when nothing scheduled). */
		let showTimer = null;
		/** Lazily created bubble node; display toggled via [hidden]. */
		let bubble = null;
		/**
		* Resolve the effective anchor for a hover/focus target: the nearest element
		* carrying a `title`, unless opted out or meaningless (html/body document
		* titles). Returns null when the native tooltip should simply stay silent.
		* @param target - event target from the delegated listener.
		* @returns the anchor element or null.
		*/
		function resolveAnchor(target) {
			const anchor = (target instanceof Element ? target : null)?.closest("[title]") ?? null;
			if (anchor === null) return null;
			const tag = anchor.tagName;
			if (tag === "HTML" || tag === "BODY") return null;
			if (anchor.closest(OPT_OUT_SELECTOR) !== null) return null;
			if ((anchor.getAttribute("title") ?? "").trim() === "") return null;
			return anchor;
		}
		/**
		* Create the singleton bubble node (hidden) plus its style tag.
		* @returns the bubble element.
		*/
		function ensureBubble() {
			if (document.getElementById("enhc-tt-style") === null) {
				const style = document.createElement("style");
				style.id = "enhc-tt-style";
				style.dataset.plugin = PLUGIN_ID$1;
				style.dataset.pluginCss = STYLE_TAG_ID;
				style.dataset.pluginDynamic = STYLE_TAG_ID;
				style.textContent = TOOLTIP_CSS;
				document.head.appendChild(style);
			}
			if (bubble === null || !bubble.isConnected) {
				bubble = document.createElement("div");
				bubble.className = "enhc-tt-bubble";
				bubble.dataset.side = "bottom";
				bubble.setAttribute("role", "tooltip");
				bubble.hidden = true;
				document.body.appendChild(bubble);
			}
			return bubble;
		}
		/**
		* Compute bottom/top placement and clamp horizontally, mirroring the
		* primitive's fit(): measure after setting text, flip sides vertically when
		* the preferred side would clip, and slide into the viewport horizontally.
		* @param el - anchor element.
		*/
		function place(el) {
			const tip = ensureBubble();
			const r = el.getBoundingClientRect();
			const x = r.left + r.width / 2;
			let side = "bottom";
			let y = r.bottom + ANCHOR_GAP;
			tip.style.left = `${x}px`;
			tip.style.top = `${y}px`;
			const box = tip.getBoundingClientRect();
			const fitsBelow = r.bottom + ANCHOR_GAP + box.height <= window.innerHeight - EDGE_MARGIN;
			const fitsAbove = r.top - ANCHOR_GAP - box.height >= EDGE_MARGIN;
			if (!fitsBelow && fitsAbove) {
				side = "top";
				y = r.top - ANCHOR_GAP;
			}
			let left = x;
			if (box.right > window.innerWidth - EDGE_MARGIN) left += window.innerWidth - EDGE_MARGIN - box.right;
			if (left < EDGE_MARGIN) left = EDGE_MARGIN;
			tip.dataset.side = side;
			tip.style.left = `${left}px`;
			tip.style.top = `${y}px`;
		}
		/**
		* Show the bubble for the given anchor immediately (keyboard focus path uses
		* zero delay, mirroring the primitive).
		* @param tip - active anchor + lifted text.
		*/
		function showNow(tip) {
			const tipEl = ensureBubble();
			tipEl.textContent = tip.title;
			tipEl.hidden = false;
			place(tip.el);
		}
		/**
		* Tear down the current presentation: cancel the pending timer, restore the
		* lifted title (unless the app already wrote a fresh one mid-hover) and hide
		* the bubble. Safe to call with nothing active.
		*/
		function settle() {
			if (showTimer !== null) {
				clearTimeout(showTimer);
				showTimer = null;
			}
			if (active !== null) {
				if (!active.el.hasAttribute("title")) active.el.setAttribute("title", active.title);
				active = null;
			}
			if (bubble !== null) bubble.hidden = true;
		}
		/**
		* Enter a new anchor: settle the previous one, lift the native title so the
		* browser cannot pop its own tooltip, and schedule the delayed show.
		* @param anchor - newly hovered element.
		*/
		function enter(anchor) {
			settle();
			const title = anchor.getAttribute("title");
			if (title === null || title.trim() === "") return;
			active = {
				el: anchor,
				title
			};
			anchor.removeAttribute("title");
			showTimer = window.setTimeout(() => {
				showTimer = null;
				if (active !== null) showNow(active);
			}, HOVER_DELAY_MS);
		}
		let teardownPrevious = null;
		/**
		* Mount the unified title-tooltip behavior. Idempotent: a second call first
		* disposes the previous instance.
		* @returns disposer removing listeners, timers, the bubble and the style tag.
		*/
		function mountTitleTooltips() {
			teardownPrevious?.();
			ensureBubble();
			const onMouseOver = (e) => {
				const anchor = resolveAnchor(e.target);
				if (anchor !== null && anchor === active?.el) return;
				if (anchor === null) return;
				enter(anchor);
			};
			const onMouseOut = (e) => {
				if (active === null) return;
				const to = e.relatedTarget;
				if (to instanceof Node && active.el.contains(to)) return;
				settle();
			};
			const onFocusIn = (e) => {
				const anchor = resolveAnchor(e.target);
				if (anchor === null || anchor === active?.el) return;
				settle();
				const title = anchor.getAttribute("title");
				if (title === null || title.trim() === "") return;
				active = {
					el: anchor,
					title
				};
				anchor.removeAttribute("title");
				showNow(active);
			};
			const onFocusOut = (e) => {
				if (active === null) return;
				const to = e.relatedTarget;
				if (to instanceof Node && active.el.contains(to)) return;
				settle();
			};
			const onLeave = () => settle();
			const onKeyDown = (e) => {
				if (e.key === "Escape") settle();
			};
			const onResize = () => {
				if (active !== null && active.el.isConnected) place(active.el);
				else settle();
			};
			document.addEventListener("mouseover", onMouseOver);
			document.addEventListener("mouseout", onMouseOut);
			document.addEventListener("focusin", onFocusIn);
			document.addEventListener("focusout", onFocusOut);
			document.addEventListener("scroll", onLeave, true);
			window.addEventListener("wheel", onLeave, { passive: true });
			window.addEventListener("resize", onResize);
			window.addEventListener("blur", onLeave);
			document.addEventListener("keydown", onKeyDown);
			const dispose = () => {
				settle();
				document.removeEventListener("mouseover", onMouseOver);
				document.removeEventListener("mouseout", onMouseOut);
				document.removeEventListener("focusin", onFocusIn);
				document.removeEventListener("focusout", onFocusOut);
				document.removeEventListener("scroll", onLeave, true);
				window.removeEventListener("wheel", onLeave);
				window.removeEventListener("resize", onResize);
				window.removeEventListener("blur", onLeave);
				document.removeEventListener("keydown", onKeyDown);
				bubble?.remove();
				bubble = null;
				document.getElementById("enhc-tt-style")?.remove();
				if (teardownPrevious === dispose) teardownPrevious = null;
			};
			teardownPrevious = dispose;
			return dispose;
		}
		//#endregion
		//#region src/client/core/text-adapters.ts
		/** Marker attribute written on an element once its text is normalized. */
		const MARK = "data-enhc-normalized";
		/** Apply every rule to one string, or return the input unchanged. */
		function normalize(text, adapter) {
			let next = text;
			for (const rule of adapter.rules) {
				if (!rule.match.test(next)) continue;
				next = next.replace(rule.match, (...args) => rule.replace(args));
			}
			return next;
		}
		/**
		* Start normalizing the third-party surfaces listed in `adapters`.
		*
		* @param adapters - the rule lists to run; an empty list mounts a no-op watcher.
		* @returns the disposer `ctx.effect` wants: the observer, the timers, every marker
		*   attribute and every text/attribute value we overwrote.
		*/
		function mountTextAdapters(adapters) {
			/**
			* Elements we wrote to, with the value each rewrite replaced. Keyed by element
			* (so re-writes update one record instead of appending) and pruned of detached
			* nodes, so a long session cannot grow it without bound.
			*/
			const written = /* @__PURE__ */ new Map();
			/** The record for `el`, created on first write. */
			const record = (el) => {
				const existing = written.get(el);
				if (existing !== void 0) return existing;
				const fresh = {
					text: null,
					attributes: /* @__PURE__ */ new Map()
				};
				written.set(el, fresh);
				return fresh;
			};
			const rewriteText = (el, adapter) => {
				if (el.children.length > 0) return;
				const text = el.textContent ?? "";
				if (text === "" || text.length > 80) return;
				const next = normalize(text, adapter);
				if (next === text) return;
				record(el).text = text;
				el.textContent = next;
				el.setAttribute(MARK, adapter.plugin);
			};
			const rewriteAttribute = (el, name, adapter) => {
				const raw = el.getAttribute(name);
				if (raw === null || raw === "" || raw.length > 240) return;
				const next = normalize(raw, adapter);
				if (next === raw) return;
				record(el).attributes.set(name, raw);
				el.setAttribute(name, next);
				el.setAttribute(MARK, adapter.plugin);
			};
			const apply = () => {
				for (const el of written.keys()) if (!el.isConnected) written.delete(el);
				for (const adapter of adapters) for (const root of document.querySelectorAll(adapter.scope)) {
					for (const el of root.querySelectorAll("span, button")) rewriteText(el, adapter);
					for (const name of adapter.attributes ?? []) for (const el of root.querySelectorAll(`[${name}]`)) rewriteAttribute(el, name, adapter);
				}
			};
			apply();
			const observer = new MutationObserver(apply);
			observer.observe(document.body, {
				childList: true,
				subtree: true,
				characterData: true,
				attributes: true,
				attributeFilter: ["title", "aria-label"]
			});
			const tick = window.setInterval(apply, 800);
			const stopTick = window.setTimeout(() => window.clearInterval(tick), 15e3);
			return () => {
				observer.disconnect();
				window.clearInterval(tick);
				window.clearTimeout(stopTick);
				for (const [el, was] of written) {
					if (was.text !== null && el.children.length === 0) el.textContent = was.text;
					for (const [name, value] of was.attributes) el.setAttribute(name, value);
					el.removeAttribute(MARK);
				}
				written.clear();
			};
		}
		//#endregion
		//#region src/client/plugins/commandcode-provider/adapters.ts
		/** Capitalize a single lower-case option word (`high` → `High`). */
		function titleCase(match) {
			const word = match[1] ?? "";
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		}
		/** One entry per surface of the CommandCode provider we normalize. */
		const COMMANDCODE_TEXT_ADAPTERS = [{
			plugin: "@mars-sea/dsh-commandcode-provider",
			why: "registers its models as `${model.name} (CC)` and its reasoning levels in lower case, so the composer reads \"DeepSeek V4.1 Flash (CC) high\" where the product voice has \"DeepSeek V4.1 Flash · High\"",
			scope: "[data-slot=\"conversation.composer\"]",
			attributes: ["title", "aria-label"],
			rules: [
				{
					note: "drop the provider brand suffix from a model name (the chip label, its tooltip and its aria-label)",
					match: /\s*[（(]\s*CC\s*[)）]/gu,
					replace: () => ""
				},
				{
					note: "title-case a reasoning-effort label",
					match: /^(off|minimal|low|medium|high|max)$/u,
					replace: titleCase
				},
				{
					note: "title-case the effort at the end of a title/aria-label",
					match: /([·，,]|\s)(off|minimal|low|medium|high|max)\s*$/u,
					replace: (m) => `${m[1] ?? ""}${(m[2] ?? "").charAt(0).toUpperCase()}${(m[2] ?? "").slice(1).toLowerCase()}`
				}
			]
		}];
		//#endregion
		//#region src/client/core/harmony/material.ts
		/**
		* Material detection: does the interface currently read as opaque or glass?
		* Derived from the live semantic tokens, never from a plugin's identity.
		*/
		/**
		* Parse a CSS color and decide whether it is meaningfully translucent.
		*
		* Themes express glass by replacing the semantic tokens with semi-transparent
		* values (`ctx.theme.overrideTokens`), so the tokens themselves are the one
		* honest signal — plugin identity is not. Unresolved values (`var(...)`,
		* `color-mix(...)`) are treated as opaque: guessing there would flip the
		* material on a token that simply had not been computed yet.
		* @param value - the computed custom property value.
		* @returns true when the value resolves to alpha < 0.98.
		*/
		function isTranslucent(value) {
			const v = value.trim().toLowerCase();
			if (v === "") return false;
			if (v === "transparent") return true;
			const rgb = /^rgba?\(([^)]+)\)$/u.exec(v);
			if (rgb !== null) {
				const parts = rgb[1].split(/[\s,/]+/u).filter((s) => s !== "");
				if (parts.length < 4) return false;
				const alpha = Number(parts[3].replace("%", ""));
				if (!Number.isFinite(alpha)) return false;
				return parts[3].includes("%") ? alpha / 100 < .98 : alpha < .98;
			}
			const hex = /^#([0-9a-f]{4}|[0-9a-f]{8})$/u.exec(v);
			if (hex !== null) {
				const digits = hex[1];
				const pair = digits.length === 4 ? digits[3] + digits[3] : digits.slice(6, 8);
				return Number.parseInt(pair, 16) / 255 < .98;
			}
			return false;
		}
		/**
		* Read the material state from the live tokens.
		* @returns true when the base/layer surfaces are translucent.
		*/
		function detectGlass() {
			try {
				const style = getComputedStyle(document.body);
				return [
					style.getPropertyValue("--dsw-alias-bg-base"),
					style.getPropertyValue("--dsw-alias-bg-layer-1"),
					style.getPropertyValue("--dsw-specific-sidebar-fill")
				].some(isTranslucent);
			} catch {
				return false;
			}
		}
		//#endregion
		//#region src/client/core/harmony/runtime.ts
		/**
		* The contract runtime: service registration, published variables and the
		* material watcher.
		*/
		/**
		* Create the contract runtime: the service, the published variables and the
		* material watcher (a MutationObserver on the theme attributes — the way the
		* product actually applies a theme — plus the optional `theme/change` hook and
		* a cheap poll so nothing else can leave the published variables stale).
		* @param provide - `ctx.reflect.provide`, injected so this module stays inert.
		* @param onThemeChange - optional subscription hook (`ctx.on('theme/change', …)`).
		* @returns the runtime plus a disposer.
		*/
		function createHarmonyRuntime(provide, onThemeChange) {
			const surfaces = /* @__PURE__ */ new Map();
			const listeners = /* @__PURE__ */ new Set();
			let glass = detectGlass();
			const notify = () => {
				for (const listener of listeners) listener();
			};
			const service = {
				version: "1.0",
				registerSurface: (surface) => {
					surfaces.set(surface.id, surface);
					notify();
					return () => {
						surfaces.delete(surface.id);
						notify();
					};
				},
				surfaces: () => [...surfaces.values()],
				glassAware: () => glass,
				onChange: (listener) => {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				}
			};
			const root = document.documentElement;
			root.style.setProperty(VARS.contract, "1.0");
			const refreshMaterial = () => {
				const next = detectGlass();
				root.style.setProperty(VARS.glassAware, next ? "1" : "0");
				const base = next ? "transparent" : getComputedStyle(document.body).getPropertyValue("--dsw-alias-bg-base").trim() || "var(--dsw-alias-bg-base)";
				root.style.setProperty("--enhc-solid-fill", base);
				const wasSolid = root.style.getPropertyValue(VARS.surfaceSolid) !== "0";
				root.style.setProperty(VARS.surfaceSolid, next ? "0" : "1");
				if (next !== glass) {
					glass = next;
					notify();
				} else if (!wasSolid && !next) notify();
			};
			refreshMaterial();
			const unsubscribeTheme = onThemeChange?.(refreshMaterial);
			const THEME_ATTRS = [
				"class",
				"data-ds-dark-theme",
				"data-ds-theme-source"
			];
			const themeObserver = new MutationObserver(refreshMaterial);
			themeObserver.observe(root, {
				attributes: true,
				attributeFilter: THEME_ATTRS
			});
			if (document.body !== null) themeObserver.observe(document.body, {
				attributes: true,
				attributeFilter: THEME_ATTRS
			});
			const poll = window.setInterval(refreshMaterial, 2e3);
			const disposeService = provide("uiHarmony", service);
			return {
				service,
				refreshMaterial,
				dispose: () => {
					disposeService();
					if (unsubscribeTheme !== void 0) unsubscribeTheme();
					themeObserver.disconnect();
					window.clearInterval(poll);
					surfaces.clear();
					listeners.clear();
					root.style.removeProperty(VARS.contract);
					root.style.removeProperty(VARS.glassAware);
					root.style.removeProperty(VARS.surfaceSolid);
					root.style.removeProperty("--enhc-solid-fill");
				}
			};
		}
		//#endregion
		//#region src/client/self/doctor/engine.ts
		/**
		* Layer: self. The read-only Harmony Doctor audit engine.
		*
		* It belongs to `self/` because what it audits is THIS plugin's own rules and
		* couplings — our selectors, our declarations, our reach into other plugins'
		* private surfaces — so the findings are ours to fix.
		*
		* Data sources, and nothing else: `document.styleSheets` (our injected
		* CSS-module and tooltip sheets, plus `adoptedStyleSheets`) for the rule and
		* coupling inventory, and the `localStorage` ledger under `LEDGER_KEY` for the
		* cross-view "dead everywhere" verdict.
		*
		* Harmony Doctor —the audit engine.
		*
		* A coordinator whose coordination targets are invisible to it is the core
		* failure this plugin kept hitting: 107 of 134 of its own selectors matched
		* nothing on one view, and its panel-state predicate keyed on a class that
		* better-sidebar 0.24.1 no longer ships. Both failures were silent.
		*
		* The Doctor makes them loud, with measurements only:
		*
		*   1. **Dead-rule ledger.** A selector is only dead when it matches nothing
		*      in ANY view it has been observed in. The ledger persists across views
		*      (hero —session —settings —panels), so the verdict sharpens as the
		*      user moves around instead of being decided by whichever screen was open
		*      when someone pressed the button.
		*   2. **Foreign coupling health.** Selectors that name another plugin's hashed
		*      CSS-module class or undocumented `data-*` host, with a live match count — *      the difference between "still works" and "dead since their last release".
		*   3. **Conflict / redundancy checks.** Which of our declarations actually win
		*      (inline self-check) and which are no-ops (measured by disabling our own
		*      sheets and re-reading the computed value).
		*   4. **Surface inventory.** Every slot, every cross-plugin data attribute and
		*      every published contract variable, so "who owns this surface" is data
		*      rather than folklore.
		*
		* Everything is read-only apart from a synchronous disable/restore of our own
		* stylesheets, which never paints.
		*/
		/** Path/storage key for the cross-view ledger. */
		const LEDGER_KEY = "harness-ui-harmonizer.audit-ledger";
		/**
		* Foreign-plugin markers we know we (or a sibling) reach into.
		*
		* Two corrections measured 2026-09-30:
		*   - `data-dsh-*` is NOT a better-sidebar private hook: the PRODUCT uses that
		*     namespace itself (`data-dsh-automatic-focus` is written by the shell and
		*     read by its theme CSS), so it is registered as a harness hook. Reporting it
		*     as a third-party coupling pointed the blame at the wrong owner and inflated
		*     that owner's match count.
		*   - the old `market-hash` entry (`.eGUBIq_` / `.Pz1RTq_`) matched NOTHING in the
		*     installed `dshmarket` — a dead registration that three documents then
		*     repeated as current fact. Removed rather than kept "for history": the
		*     Doctor's job is to report what actually bites.
		*/
		const FOREIGN_PATTERNS = [
			{
				id: "better-sidebar-hash",
				owner: "dsh-better-sidebar",
				test: /\.nArs4W_[A-Za-z0-9_]+/gu
			},
			{
				id: "harness-data-hooks",
				owner: "harness (product)",
				test: /\[data-dsh-[a-z-]+\]/gu
			},
			{
				id: "widgets-hash",
				owner: "dsh-widgets",
				test: /(?:\.dsx-[a-z-]+|--dsx-[a-z-]+)/gu
			},
			{
				id: "widgets-data",
				owner: "dsh-widgets",
				test: /\[data-dsx-[a-z-]+\]/gu
			},
			{
				id: "notification-hash",
				owner: "dsh-notification",
				test: /\.dsh_notification_[a-z_]+/gu
			},
			{
				id: "genui-data",
				owner: "@omdsh-dev/dsh-genui",
				test: /\[data-genui[a-z-]*\]/gu
			}
		];
		/**
		* Read the cross-view ledger.
		* @returns the ledger (empty on any storage failure).
		*/
		function readLedger() {
			try {
				const raw = localStorage.getItem(LEDGER_KEY);
				if (raw === null) return { views: {} };
				const parsed = JSON.parse(raw);
				return typeof parsed.views === "object" && parsed.views !== null ? parsed : { views: {} };
			} catch {
				return { views: {} };
			}
		}
		/**
		* Record this view's matched selectors into the ledger.
		* @param view - view name (e.g. `hero`, `settings-general`).
		* @param matched - selectors that matched at least one element.
		* @param total - selectors evaluated in this view.
		*/
		function writeLedger(view, matched, total) {
			try {
				const ledger = readLedger();
				ledger.views[view] = {
					matched: [...matched],
					total
				};
				localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
			} catch {}
		}
		/** Clear the ledger (offered in the UI so a stale verdict can be discarded). */
		function resetLedger() {
			try {
				localStorage.removeItem(LEDGER_KEY);
			} catch {}
		}
		/** Our own injected stylesheets (CSS-module tags and the tooltip tag). */
		function ourSheets() {
			const out = [];
			const isOurs = (node) => {
				if (node === null || node.nodeType !== 1) return false;
				const attrs = [...node.attributes].map((a) => `${a.name}=${a.value}`).join(" ");
				return /harmonizer|harness-ui-enhancer/iu.test(attrs);
			};
			for (const sheet of document.styleSheets) try {
				if (isOurs(sheet.ownerNode)) out.push({
					owner: sheet.ownerNode.dataset.pluginCss ?? "inline",
					sheet
				});
			} catch {}
			for (const sheet of document.adoptedStyleSheets ?? []) try {
				if ([...sheet.cssRules].some((r) => (r.cssText ?? "").includes("--enhancer-content-width") || (r.cssText ?? "").includes(".enhc-"))) out.push({
					owner: "adoptedStyleSheet",
					sheet
				});
			} catch {}
			return out;
		}
		/**
		* Walk every rule of our sheets.
		* @param visit - called with each style rule's selector list, text and media.
		*/
		function eachRule(visit) {
			const walk = (rules, media) => {
				for (const rule of rules) {
					const anyRule = rule;
					if (anyRule.selectorText !== void 0) visit(anyRule.selectorText, anyRule.cssText, media);
					if (anyRule.cssRules !== void 0 && anyRule.cssRules.length > 0) walk(anyRule.cssRules, anyRule.conditionText !== void 0 && anyRule.selectorText === void 0 ? media === null ? anyRule.conditionText : `${media} && ${anyRule.conditionText}` : media);
				}
			};
			for (const { sheet } of ourSheets()) try {
				walk(sheet.cssRules, null);
			} catch {}
		}
		/**
		* Split a selector list on its TOP-LEVEL commas only.
		*
		* `selectorText` is a serialized list, so a naive `split(',')` tears apart
		* `:has(> [data-slot='main'], > [data-slot='conversation'])` into fragments that
		* match nothing and are then reported as dead rules —a false positive the first
		* probe run produced (measured: one such fragment appeared in the "matched" list
		* while its sibling was counted as dead).
		* @param selectorText - the rule's selector list.
		* @returns the individual selectors, trimmed.
		*/
		function splitSelectors(selectorText) {
			const out = [];
			let depth = 0;
			let quote = null;
			let start = 0;
			for (let i = 0; i < selectorText.length; i++) {
				const ch = selectorText[i];
				if (quote !== null) {
					if (ch === quote) quote = null;
					continue;
				}
				if (ch === "\"" || ch === "'") {
					quote = ch;
					continue;
				}
				if (ch === "(" || ch === "[") depth++;
				else if (ch === ")" || ch === "]") depth--;
				else if (ch === "," && depth === 0) {
					out.push(selectorText.slice(start, i).trim());
					start = i + 1;
				}
			}
			out.push(selectorText.slice(start).trim());
			return out.filter((s) => s !== "");
		}
		/**
		* Count matches for one selector without throwing on un-queryable syntax.
		* @param selector - a single selector (no comma).
		* @returns element count, or -1 when the selector cannot be evaluated.
		*/
		function countMatches(selector) {
			try {
				return document.querySelectorAll(selector).length;
			} catch {
				return -1;
			}
		}
		/**
		* Audit our own rules in the current view and merge the result into the ledger.
		* @param view - view name.
		* @returns the per-view verdict plus the cross-view verdict.
		*/
		function auditRules(view) {
			const seen = /* @__PURE__ */ new Set();
			const matched = /* @__PURE__ */ new Set();
			const dead = [];
			let total = 0;
			eachRule((selectorText, _cssText, media) => {
				for (const selector of splitSelectors(selectorText)) {
					total++;
					seen.add(selector);
					if (countMatches(selector) === 0) dead.push({
						selector,
						media
					});
					else matched.add(selector);
				}
			});
			writeLedger(view, [...matched], total);
			const ledger = readLedger();
			const viewsSeen = Object.keys(ledger.views);
			const matchedEver = /* @__PURE__ */ new Set();
			for (const entry of Object.values(ledger.views)) for (const s of entry.matched) matchedEver.add(s);
			const deadEverywhere = [];
			if (viewsSeen.length > 1) {
				for (const selector of seen) if (!matchedEver.has(selector)) deadEverywhere.push({
					selector,
					media: null
				});
			}
			return {
				totalSelectors: total,
				matchedInThisView: matched.size,
				deadInThisView: dead.length,
				viewsSeen,
				deadInEveryView: deadEverywhere.slice(0, 200),
				deadRowsInThisView: dead.slice(0, 200)
			};
		}
		/**
		* Inventory selectors that couple us to another plugin's private surface.
		* @returns one row per (plugin, selector) with a live match count.
		*/
		function auditCouplings() {
			const rows = /* @__PURE__ */ new Map();
			eachRule((selectorText) => {
				for (const pattern of FOREIGN_PATTERNS) {
					if (!new RegExp(pattern.test.source, "gu").test(selectorText)) continue;
					for (const selector of splitSelectors(selectorText)) {
						const occurrences = (selector.match(new RegExp(pattern.test.source, "gu")) ?? []).length;
						if (occurrences === 0) continue;
						const key = `${pattern.id}|${selector}`;
						const existing = rows.get(key);
						if (existing !== void 0) {
							existing.occurrences += occurrences;
							continue;
						}
						rows.set(key, {
							plugin: pattern.owner,
							kind: pattern.id,
							selector,
							matches: countMatches(selector),
							occurrences
						});
					}
				}
			});
			return [...rows.values()].sort((a, b) => a.matches - b.matches);
		}
		/**
		* Inventory every surface on the page: slots, cross-plugin data attributes,
		* published contract variables and surfaces other plugins declared to us.
		* @param service - the live contract service, when available.
		* @returns sorted surface rows.
		*/
		function auditSurfaces(service) {
			const rows = [];
			const slots = /* @__PURE__ */ new Map();
			for (const el of document.querySelectorAll("[data-slot]")) {
				const name = el.getAttribute("data-slot") ?? "";
				slots.set(name, (slots.get(name) ?? 0) + 1);
			}
			for (const [name, count] of slots) rows.push({
				kind: "slot",
				name,
				count,
				detail: ""
			});
			const attrs = /* @__PURE__ */ new Map();
			for (const el of document.querySelectorAll("*")) for (const attr of el.attributes) {
				if (!/^data-(dsh|dsx|genui|duc|enhc)/u.test(attr.name)) continue;
				attrs.set(attr.name, (attrs.get(attr.name) ?? 0) + 1);
			}
			for (const [name, count] of attrs) rows.push({
				kind: "data-attribute",
				name,
				count,
				detail: ""
			});
			const root = getComputedStyle(document.documentElement);
			for (const [key, name] of Object.entries(VARS)) rows.push({
				kind: "contract-variable",
				name,
				count: 1,
				detail: root.getPropertyValue(name).trim() || "(unset)",
				...key === "" ? {} : {}
			});
			const declared = service?.surfaces() ?? [];
			for (const surface of declared) rows.push({
				kind: "declared-surface",
				name: surface.id,
				count: 1,
				detail: `${surface.role}${surface.occupies === void 0 ? "" : ` · ${surface.occupies}`}`
			});
			return rows;
		}
		/**
		* Check whether our declarations are the ones in effect.
		*
		* Two honest tests, no CSSOM guessing:
		* - **inline self-check**: a property we set inline must read back as we set it;
		* - **redundancy test**: disabling our own sheets must CHANGE the computed value
		*   of a contested property, otherwise our rule achieves nothing the product
		*   (or another plugin) already achieves.
		* @param probes - selector/property pairs worth contesting.
		* @returns findings.
		*/
		function auditConflicts(probes) {
			const rows = [];
			const inlineTargets = [];
			for (const el of [document.documentElement, document.body]) for (const name of Object.keys(el.style)) if (name.startsWith("--")) inlineTargets.push([el, name]);
			for (const [el, name] of inlineTargets) {
				const ours = el.style.getPropertyValue(name).trim();
				const winner = getComputedStyle(el).getPropertyValue(name).trim();
				if (winner === "" && ours !== "") rows.push({
					property: name,
					target: el === document.body ? "body (inline)" : "html (inline)",
					ours,
					winner,
					verdict: "someone-else-wins"
				});
			}
			const sheets = ourSheets();
			for (const probe of probes) {
				const el = document.querySelector(probe.target);
				if (el === null) continue;
				const before = getComputedStyle(el).getPropertyValue(probe.property);
				const disabled = [];
				for (const { sheet } of sheets) {
					disabled.push(sheet.disabled);
					sheet.disabled = true;
				}
				const without = getComputedStyle(el).getPropertyValue(probe.property);
				for (const [i, { sheet }] of sheets.entries()) sheet.disabled = disabled[i];
				const after = getComputedStyle(el).getPropertyValue(probe.property);
				if (before === after && before === without) rows.push({
					property: probe.property,
					target: probe.target,
					ours: before || "(none)",
					winner: without || "(none)",
					verdict: "redundant"
				});
				else if (before !== after) rows.push({
					property: probe.property,
					target: probe.target,
					ours: before,
					winner: after,
					verdict: "someone-else-wins"
				});
			}
			return rows;
		}
		/** Properties worth contesting, derived from the measured 0.1.5 conflicts. */
		const CONFLICT_PROBES = [
			{
				target: "[data-input-scroll]",
				property: "font-size"
			},
			{
				target: "[data-slot='conversation.header'] > header",
				property: "background-color"
			},
			{
				target: "[data-slot='conversation.header'] > header",
				property: "min-height"
			},
			{
				target: "[data-slot='conversation.session']",
				property: "margin-right"
			},
			{
				target: "[class$='_flowItem']",
				property: "content-visibility"
			},
			{
				target: "body",
				property: "--dsw-font-markdown-base"
			},
			{
				target: "html",
				property: "--dsw-font-family"
			}
		];
		/**
		* Run the whole audit in the current view.
		* @param options - the live contract service and the view name.
		* @returns the report, ready to render or export.
		*/
		function runDoctor(options) {
			const root = getComputedStyle(document.documentElement);
			getComputedStyle(document.body);
			return {
				contractVersion: "1.0",
				at: (/* @__PURE__ */ new Date()).toISOString(),
				url: location.href,
				view: options.view,
				material: {
					glassAware: options.service?.glassAware() ?? false,
					solidFill: root.getPropertyValue("--enhc-solid-fill").trim(),
					surfaceSolid: root.getPropertyValue(VARS.surfaceSolid).trim()
				},
				rules: auditRules(options.view),
				couplings: auditCouplings(),
				surfaces: auditSurfaces(options.service),
				conflicts: auditConflicts(CONFLICT_PROBES)
			};
		}
		/**
		* Render the report as Markdown for a GitHub issue or a README table.
		* @param report - the report to serialize.
		* @returns Markdown text.
		*/
		function reportToMarkdown(report) {
			const lines = [];
			lines.push(`# Harmony Doctor report`, "", `- generated: ${report.at}`, `- url: ${report.url}`, `- view: ${report.view}`, `- contract: ${report.contractVersion}`, `- material: ${report.material.glassAware ? "translucent (glass)" : "opaque"} (solid-fill: ${report.material.solidFill || "unset"})`, "");
			lines.push(`## Rules`);
			lines.push(`- total selectors: ${report.rules.totalSelectors}`);
			lines.push(`- matched in this view: ${report.rules.matchedInThisView}`);
			lines.push(`- dead in this view: ${report.rules.deadInThisView}`);
			lines.push(`- views observed: ${report.rules.viewsSeen.join(", ")}`);
			lines.push(`- dead in EVERY observed view: ${report.rules.deadInEveryView.length}`);
			if (report.rules.deadInEveryView.length > 0) {
				lines.push("", "| selector | media |", "| --- | --- |");
				for (const row of report.rules.deadInEveryView) lines.push(`| \`${row.selector}\` | ${row.media ?? "-"} |`);
			}
			lines.push("", "## Foreign couplings");
			lines.push("", "| plugin | kind | matches | selector |", "| --- | --- | --- | --- |");
			for (const row of report.couplings) lines.push(`| ${row.plugin} | ${row.kind} | ${row.matches} | \`${row.selector.slice(0, 90)}\` |`);
			lines.push("", "## Conflicts / redundancy");
			lines.push("", "| verdict | property | target | ours | winner |", "| --- | --- | --- | --- | --- |");
			for (const row of report.conflicts) lines.push(`| ${row.verdict} | ${row.property} | \`${row.target}\` | ${row.ours} | ${row.winner} |`);
			lines.push("", "## Surfaces");
			lines.push("", "| kind | name | count | detail |", "| --- | --- | --- | --- |");
			for (const row of report.surfaces) lines.push(`| ${row.kind} | \`${row.name}\` | ${row.count} | ${row.detail} |`);
			return lines.join("\n");
		}
		//#endregion
		//#region src/client/self/doctor/view-context.ts
		/**
		* `currentView` — the ledger's view key.
		*
		* Layer: self (the Doctor is this plugin's own page). The returned strings are
		* PERSISTED as the cross-view ledger key in `doctor.ts`, so they must not be
		* renamed or re-cased: `settings` / `session` / `hero` are the vocabulary the
		* stored ledger is keyed on, and changing one silently resets its history.
		*/
		/**
		* Name the view the audit is running in, from the DOM rather than from state:
		* the ledger only becomes meaningful when the names are stable and distinct.
		* @returns a view key such as `settings`, `session` or `hero`.
		*/
		function currentView() {
			if (document.querySelector("[data-slot='settings.section']") !== null) return "settings";
			return document.querySelector("[data-slot='conversation.session'] [class*='_flowItem'], [class*='markdown']") === null ? "hero" : "session";
		}
		//#endregion
		//#region src/client/self/doctor/parts.tsx
		/**
		* Doctor page primitives — the two small presentational pieces.
		*
		* Layer: self (our own page). They carry no state and no DOM writes, so they
		* stay separate from `./view.tsx` and are re-rendered freely.
		*
		* TRUNCATION IS OWNED HERE, AND ONLY HERE (fixed 2026-09-30). The page used to
		* cut in two places: `view.tsx` sliced the conflict rows' `ours`/`winner` cells
		* at 40 chars while building the rows, and this file capped the row list at
		* {@link ROW_CAP} — so a row was silently clipped with no marker at all (the
		* cell cut), and the note below the list only ever described the ROW cap. A
		* reader could not tell a short selector from a clipped one. Both cuts now live
		* in this layer, each one is marked: the cell cut appends an ellipsis and the
		* list cut prints {@link getDoctorTruncatedNote}. Callers must not slice.
		*/
		/** The one and only row cap; callers must not slice as well. */
		const ROW_CAP = 60;
		/** The one and only character cap for a cell; callers must not slice as well. */
		const CELL_CAP = 40;
		/**
		* Clip one cell to {@link CELL_CAP} characters and mark the clip.
		*
		* The marker (an ellipsis) is part of the contract: without it the two cut
		* states are indistinguishable in the UI. The full text stays in the report and
		* in the Markdown export, so the visible cut never hides data from the reader
		* who exports.
		* @param text - the raw cell text.
		* @returns the text, clipped with a trailing ellipsis when it was too long.
		*/
		function clipCell(text) {
			return text.length > CELL_CAP ? `${text.slice(0, CELL_CAP)}…` : text;
		}
		/**
		* Small stat block: the value above its label.
		* @param props.label - what the number counts.
		* @param props.value - the rendered number.
		* @param props.tone - `warn` paints the value in the warning colour.
		* @returns the stat element.
		*/
		function Stat({ label, value, tone }) {
			return react.createElement("div", { className: "enhc-doctor-stat" }, [react.createElement("div", {
				key: "v",
				className: tone === "warn" ? "enhc-doctor-stat-v enhc-warn" : "enhc-doctor-stat-v"
			}, value), react.createElement("div", {
				key: "l",
				className: "enhc-doctor-stat-l"
			}, label)]);
		}
		/**
		* A titled list of `<selector> · matches` rows, capped at {@link ROW_CAP}
		* entries with an explicit truncation note below it. Cell text longer than
		* {@link CELL_CAP} is clipped here too, with its own note, so every cut this
		* page makes is announced exactly once.
		* @param props.title - block heading.
		* @param props.rows - the row pairs; an empty array renders the empty text.
		* @param props.empty - text shown when there are no rows.
		* @returns the block element.
		*/
		function RowList({ title, rows, empty }) {
			const truncated = rows.length > ROW_CAP;
			const shown = truncated ? rows.slice(0, ROW_CAP) : rows;
			const clippedCells = shown.some((row) => row.left.length > CELL_CAP || row.right.length > CELL_CAP);
			return react.createElement("div", { className: "enhc-doctor-block" }, [
				react.createElement("h3", {
					key: "h",
					className: "enhc-doctor-h3"
				}, title),
				rows.length === 0 ? react.createElement("p", {
					key: "e",
					className: "enhc-doctor-empty"
				}, empty) : react.createElement("div", {
					key: "l",
					className: "enhc-doctor-rows"
				}, shown.map((row, i) => react.createElement("div", {
					key: `${i}-${row.left}`,
					className: "enhc-doctor-row"
				}, [react.createElement("code", {
					key: "l",
					className: "enhc-doctor-code"
				}, clipCell(row.left)), react.createElement("span", {
					key: "r",
					className: row.tone === "warn" ? "enhc-doctor-right enhc-warn" : "enhc-doctor-right"
				}, clipCell(row.right))]))),
				truncated ? react.createElement("p", {
					key: "t",
					className: "enhc-doctor-empty"
				}, getDoctorTruncatedNote(ROW_CAP, rows.length)) : null,
				clippedCells ? react.createElement("p", {
					key: "c",
					className: "enhc-doctor-empty"
				}, getDoctorTruncatedCellsNote(CELL_CAP)) : null
			]);
		}
		//#endregion
		//#region src/client/self/doctor/view.tsx
		/**
		* Harmony Doctor — the settings page.
		*
		* Layer: self (this plugin's own page inside `settings.section`). It runs the
		* audit engine on demand and renders the result inline, with a Markdown export
		* for a README table or an upstream issue. It is intentionally boring: no
		* network, no model calls, no write path beyond the ledger key that makes
		* cross-view verdicts possible (`./view-context.ts`).
		*/
		/**
		* The audit page: a run/export/reset bar over the last report.
		* @param props.service - the harmony service the engine audits against.
		* @returns the page element.
		*/
		function DoctorView({ service }) {
			const [report, setReport] = react.useState(null);
			const run = () => {
				setReport(runDoctor({
					view: currentView(),
					service
				}));
			};
			const exportMd = () => {
				if (report === null) return;
				const text = reportToMarkdown(report);
				const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
				const url = URL.createObjectURL(blob);
				const anchor = document.createElement("a");
				anchor.href = url;
				anchor.download = `harmony-doctor-${report.view}-${Date.now()}.md`;
				document.body.append(anchor);
				anchor.click();
				requestAnimationFrame(() => {
					anchor.remove();
					URL.revokeObjectURL(url);
				});
			};
			const reset = () => {
				resetLedger();
				setReport(null);
			};
			const deadRows = (report?.rules.deadInEveryView ?? []).map((r) => ({
				left: r.selector,
				right: getDoctorZeroMatchesEveryView(),
				tone: "warn"
			}));
			const couplingRows = (report?.couplings ?? []).map((c) => ({
				left: c.selector,
				right: `${c.plugin} · ${getDoctorMatchCount(c.matches)}`,
				tone: c.matches === 0 ? "warn" : void 0
			}));
			const conflictRows = (report?.conflicts ?? []).map((c) => ({
				left: `${c.property} @ ${c.target}`,
				right: `${c.verdict} · ours=${c.ours} winner=${c.winner}`,
				tone: c.verdict === "redundant" ? "warn" : void 0
			}));
			const surfaceRows = (report?.surfaces ?? []).map((s) => ({
				left: s.name,
				right: `${s.kind}${s.detail === "" ? "" : ` · ${s.detail}`}${s.count > 1 ? ` · ${s.count}x` : ""}`
			}));
			return react.createElement("div", { className: "enhc-doctor" }, [
				react.createElement(SettingsPageHeader, {
					key: "head",
					title: getDoctorTitle(),
					intro: getDoctorDesc()
				}),
				react.createElement("div", {
					key: "bar",
					className: "enhc-doctor-bar"
				}, [
					react.createElement("button", {
						key: "run",
						type: "button",
						className: "enhc-doctor-btn",
						onClick: run
					}, getDoctorRunLabel()),
					react.createElement("button", {
						key: "exp",
						type: "button",
						className: "enhc-doctor-btn",
						onClick: exportMd,
						disabled: report === null
					}, getDoctorExportLabel()),
					react.createElement("button", {
						key: "rst",
						type: "button",
						className: "enhc-doctor-btn enhc-doctor-btn-quiet",
						onClick: reset
					}, getDoctorResetLabel())
				]),
				report === null ? react.createElement("p", {
					key: "idle",
					className: "enhc-doctor-empty"
				}, "—") : react.createElement("div", { key: "body" }, [
					react.createElement("div", {
						key: "stats",
						className: "enhc-doctor-stats"
					}, [
						react.createElement(Stat, {
							key: "a",
							label: getDoctorRulesLabel(),
							value: `${report.rules.matchedInThisView}/${report.rules.totalSelectors}`
						}),
						react.createElement(Stat, {
							key: "b",
							label: getDoctorDeadEveryViewLabel(),
							value: String(report.rules.deadInEveryView.length),
							tone: report.rules.deadInEveryView.length > 0 ? "warn" : void 0
						}),
						react.createElement(Stat, {
							key: "c",
							label: getDoctorViewsObservedLabel(),
							value: String(report.rules.viewsSeen.length)
						}),
						react.createElement(Stat, {
							key: "d",
							label: getDoctorCouplingsLabel(),
							value: String(report.couplings.length)
						}),
						react.createElement(Stat, {
							key: "e",
							label: getDoctorMaterialLabel(),
							value: report.material.glassAware ? getDoctorGlassLabel() : getDoctorSolidLabel()
						})
					]),
					react.createElement(RowList, {
						key: "rules",
						title: `${getDoctorRulesLabel()} — ${getDoctorDeadInEveryObservedView()}`,
						rows: deadRows,
						empty: "—"
					}),
					react.createElement(RowList, {
						key: "couplings",
						title: getDoctorCouplingsLabel(),
						rows: couplingRows,
						empty: "—"
					}),
					react.createElement(RowList, {
						key: "conflicts",
						title: getDoctorConflictsLabel(),
						rows: conflictRows,
						empty: "—"
					}),
					react.createElement(RowList, {
						key: "surfaces",
						title: getDoctorSurfacesLabel(),
						rows: surfaceRows,
						empty: "—"
					})
				])
			]);
		}
		//#endregion
		//#region src/client/core/dom/layout-container.ts
		/**
		* `layoutContainer` — the ancestor that actually lays a node out.
		*
		* Layer: core (pure DOM, no React, no tokens). Shared by the settings-header
		* reconciler and anything else that has to reason about the product's slot
		* outlets, which are `display: contents` wrappers contributing no box of their
		* own. Moved verbatim out of `settings-page.ts`.
		*/
		/**
		* Walk up while a node is `display: contents`, which contributes no box of its
		* own (the product's slot outlets use it, so the flex container above is the
		* one owning the gap).
		* @param node - the element to start from (usually a header's parent).
		* @returns the first ancestor that creates a box.
		*/
		function layoutContainer(node) {
			for (let el = node; el !== null; el = el.parentElement) if (getComputedStyle(el).display !== "contents") return el;
			return null;
		}
		//#endregion
		//#region src/client/harness/settings-header/reconciler.ts
		/**
		* Harness UI Harmonizer — the ONE settings-page header reconciler.
		*
		* Every settings page in the product opens with the same two nodes: an `<h2>`
		* page title and a `<p>` page description, as siblings inside the page's own
		* container. That is the whole skeleton — the official pages ship exactly it
		* (`rtSEdW_section > h2.rtSEdW_title + p.rtSEdW_intro`, `zGbnIq_*`, `pbvGtq_*`).
		*
		* Layer: harness. This module is the single owner of that block on pages we do
		* NOT render: it marks the real heading and description with our class pair
		* (`./classes.ts`), injects the heading when a page ships a description but no
		* title, and makes the title→description distance the OFFICIAL one on every
		* page. Our own pages use the React recipe in `./recipe.tsx` and must end up
		* structurally identical.
		*
		* TWO INVARIANTS, measured on the live panel (scripts/probe-header-geometry.mjs):
		*
		* 1. **Identical coordinates.** The title's viewport position is the same on
		*    every page. The container usually starts flush (measured: title top is the
		*    same 54px below the dialog on all eight pages), and a container that adds
		*    its own `padding-top`/`border-top` is compensated with a matching negative
		*    margin on the title.
		* 2. **Official spacing.** The product's own title→description distance is the
		*    section container's `gap` — 12px on every official page (measured with this
		*    plugin's stylesheets disabled: models / agent presets / bundled plugins all
		*    read 12px). Container gaps differ per page (4 / 12 / 16 / none), and a
		*    block container has no gap at all, so the reconciler MEASURES the container
		*    and writes the difference onto the description's `margin-top`:
		*    `margin-top = 12px − containerGap`. One number, identical on every page,
		*    including third-party ones whose container has its own rhythm.
		*
		* Both are inline styles written by the reconciler and removed again on dispose,
		* so a page that is not a settings section is never touched.
		*/
		/** The official title→description distance: the official section's own `gap`. */
		const OFFICIAL_HEAD_GAP = 12;
		/** Description candidate: `<p>` plus the vocabulary third-party pages use. */
		const INTRO_SELECTOR = "p, [class$='_intro'], [class$='_subtitle'], [class$='_sub']";
		/** Anything inside these is a row/card-level label, never the page header. */
		const NESTED_SCOPE = "[class$='_row'], [class$='_rowCard'], [class$='_card'], [class$='_field']";
		/**
		* A cheap content digest for the header fingerprint.
		*
		* The signature used `title.textContent?.length` and therefore treated a
		* re-worded title of the SAME length as "unchanged": switching Settings →
		* Language left the page showing the previous locale's heading until the user
		* navigated away and back (measured symptom: `Settings` → `设置`, both 8 chars
		* in the nav, page title frozen in the first language). A hash of the TEXT is
		* the smallest fix — same cost class as building the signature string, exact
		* for any content change, and it keeps the fingerprint free of per-mutation
		* `getComputedStyle` work by short-circuiting on the O(1) identity checks
		* first (see the call site).
		* @param text - the title's text content (empty string for a null text node).
		* @returns a 32-bit unsigned digest of the text.
		*/
		function hashText(text) {
			let hash = 2166136261;
			for (let i = 0; i < text.length; i++) {
				hash ^= text.charCodeAt(i);
				hash = Math.imul(hash, 16777619);
			}
			return hash >>> 0;
		}
		/**
		* Applied work per section element. A plain Map (not a WeakMap) because the
		* disposer has to walk it; it stays tiny — one live settings page at a time —
		* and {@link prune} drops the nodes the panel already unmounted.
		*/
		const applied = /* @__PURE__ */ new Map();
		/**
		* Undo everything one page's record holds.
		* @param record - the record to unwind.
		* @param keepInjected - an injected `<h2>` that must survive this pass (it was
		*   just created for the page being normalized, so removing it would undo the
		*   very work being done).
		*/
		function release(record, keepInjected = null) {
			for (const node of record.stamped) node.classList.remove(TITLE_CLASS, INTRO_CLASS);
			for (const { el, property } of record.spaced) el.style.removeProperty(property);
			if (record.injected !== null && record.injected !== keepInjected) record.injected.remove();
			record.injected = keepInjected;
			record.stamped = [];
			record.spaced = [];
		}
		/** Drop records for sections the settings panel has unmounted. */
		function prune() {
			for (const [section, record] of applied) {
				if (section.isConnected) continue;
				release(record);
				applied.delete(section);
			}
		}
		/**
		* The page's title node.
		*
		* A real heading wins. The class-name vocabulary (`_title` / `_heading`) is only
		* a fallback, and a match there must not be a WRAPPER: `dsh_notification_heading`
		* is a head box that CONTAINS the `<h2>`, and treating it as the title put our
		* 18/600 rule on the box — the description inherits the weight and the box's own
		* gap is replaced. Nodes that already wrap a heading are therefore rejected, as
		* are row/card-level labels.
		* @param section - the `settings.section` root.
		* @returns the title node, or null when the page has none.
		*/
		function findTitle(section) {
			const usable = (node) => node.closest(NESTED_SCOPE) === null;
			for (const node of section.querySelectorAll("h1, h2, h3, h4, h5, h6")) if (usable(node) && node instanceof HTMLElement) return node;
			for (const node of section.querySelectorAll("[class$='_title'], [class$='_heading']")) {
				if (!usable(node)) continue;
				if (node.querySelector("h1, h2, h3, h4, h5, h6") !== null) continue;
				if (node instanceof HTMLElement) return node;
			}
			return null;
		}
		/**
		* The page's description node: the first description-like node with real text
		* that is not a field/row/card caption. First in document order is deliberate —
		* when a page styles a wrapper (`div.nUhMVa_sub` around its own `<p>`), the
		* wrapper is the node the page itself presents as the intro, and stamping the
		* inner paragraph instead would leave the page's own box unstyled.
		* @param section - the `settings.section` root.
		* @returns the description node, or null when the page has none.
		*/
		function findIntro(section) {
			for (const node of section.querySelectorAll(INTRO_SELECTOR)) {
				if (node.closest(NESTED_SCOPE) !== null) continue;
				if ((node.textContent ?? "").trim().length <= 6) continue;
				if (node instanceof HTMLElement) return node;
			}
			return null;
		}
		/**
		* Whether the two header nodes share their parent, i.e. the page laid them out
		* as the official skeleton does. Only then can the gap between them be measured
		* and corrected; a page that puts its description somewhere else is left with
		* its own layout.
		* @param title - the title node.
		* @param intro - the description node.
		* @returns true when both are siblings.
		*/
		function areSiblings(title, intro) {
			return title.parentElement !== null && title.parentElement === intro.parentElement;
		}
		/**
		* The label for a page whose own mark-up has no title: the active settings-nav
		* item (product contract: `aria-current="true"` on exactly one cell), then the
		* known intro-prefix table. Never invents prose — an unresolvable page is left
		* alone.
		* @param intro - the page's description node.
		* @returns the title text, or '' when it cannot be resolved.
		*/
		function resolveInjectedTitle(intro) {
			for (const el of document.querySelectorAll("[role=\"dialog\"] nav button")) if (el.getAttribute("aria-current") === "true" || el.classList.toString().includes("_active")) {
				const text = el.textContent?.trim() ?? "";
				if (text !== "") return text;
			}
			for (const el of document.querySelectorAll("[class$='_navCell']")) if (el.getAttribute("aria-current") === "true" || /(^|\s)\S*_active(\s|$)/u.test(el.className)) {
				const text = el.textContent?.trim() ?? "";
				if (text !== "") return text;
			}
			const text = (intro.textContent ?? "").trim();
			return getKnownTitles().find(([prefix]) => text.startsWith(prefix))?.[1] ?? "";
		}
		/**
		* Mark one page's header and give it the official geometry.
		*
		* Idempotent, additive and reversible by construction: existing nodes only lose
		* the classes and inline spacing we added, the injected `<h2>` is ours to remove,
		* and nothing is moved or re-parented (a foreign React tree must never see a
		* wrapper it did not render).
		* @param section - the `settings.section` root.
		*/
		function normalizeSection(section) {
			const intro = findIntro(section);
			if (intro === null) return;
			const record = applied.get(section) ?? {
				stamped: [],
				injected: null,
				spaced: [],
				title: null,
				intro: null,
				signature: ""
			};
			let title = findTitle(section);
			if (title === null) {
				const text = resolveInjectedTitle(intro);
				if (text === "") return;
				if (record.injected === null || !record.injected.isConnected) {
					const injected = document.createElement("h2");
					injected.className = TITLE_CLASS;
					injected.textContent = text;
					intro.parentElement?.insertBefore(injected, intro);
					record.injected = injected;
					console.info(`[harness-ui-harmonizer] injected settings page title: ${JSON.stringify(text)}`);
				} else if (record.injected.textContent !== text) record.injected.textContent = text;
				title = record.injected;
			}
			const siblings = areSiblings(title, intro);
			const container = siblings ? layoutContainer(title.parentElement) : null;
			const containerGap = container === null ? 0 : Number.parseFloat(getComputedStyle(container).rowGap);
			const gapCorrection = Number.isFinite(containerGap) ? OFFICIAL_HEAD_GAP - containerGap : OFFICIAL_HEAD_GAP;
			const containerInset = container === null ? 0 : (Number.parseFloat(getComputedStyle(container).paddingTop) || 0) + (Number.parseFloat(getComputedStyle(container).borderTopWidth) || 0);
			const signature = `${siblings}|${containerGap}|${containerInset}|${hashText(title.textContent ?? "")}`;
			if (record.title === title && record.intro === intro && record.signature === signature) return;
			release(record, title === record.injected ? title : null);
			title.classList.add(TITLE_CLASS);
			intro.classList.add(INTRO_CLASS);
			record.stamped = [title, intro];
			record.title = title;
			record.intro = intro;
			record.signature = signature;
			if (siblings) {
				if (Math.abs(gapCorrection) > .01) {
					intro.style.marginTop = `${gapCorrection}px`;
					record.spaced.push({
						el: intro,
						property: "margin-top"
					});
				}
				if (containerInset > .01) {
					title.style.marginTop = `${-containerInset}px`;
					record.spaced.push({
						el: title,
						property: "margin-top"
					});
				}
			}
			applied.set(section, record);
		}
		/**
		* Mount the settings-page header normalizer.
		*
		* Re-scans on DOM/attribute changes (the settings panel renders its section
		* lazily and swaps it on navigation) and keeps polling briefly for a late
		* nav/section, exactly like the title fill it replaces — but now through one
		* code path that also handles the pages that DO ship a header.
		* @returns disposer that removes every class, inline spacing and injected title.
		*/
		function mountSettingsPageHeaders() {
			const scan = () => {
				const section = document.querySelector("[data-slot='settings.section']");
				if (section !== null) normalizeSection(section);
				prune();
			};
			scan();
			let frame = 0;
			const schedule = () => {
				if (frame !== 0) return;
				frame = window.requestAnimationFrame(() => {
					frame = 0;
					scan();
				});
			};
			const observer = new MutationObserver(schedule);
			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [
					"class",
					"aria-current",
					"aria-expanded"
				]
			});
			const tick = window.setInterval(scan, 700);
			const stopTick = window.setTimeout(() => window.clearInterval(tick), 12e3);
			return () => {
				if (frame !== 0) window.cancelAnimationFrame(frame);
				observer.disconnect();
				window.clearInterval(tick);
				window.clearTimeout(stopTick);
				for (const [section, record] of applied) {
					release(record);
					applied.delete(section);
				}
			};
		}
		//#endregion
		//#region src/client/harness/chrome/menu-anchor.ts
		/**
		* Popup width follows its row — a portalled menu is pinned to the row that opened it.
		*
		* Layer: harness/chrome (DOM behaviour aimed at the DSH shell's own chrome).
		* Seams: the official slot seats `[data-slot='settings.launcher']` /
		* `[data-slot='settings.trigger']` plus the trigger's `aria-haspopup` /
		* `aria-expanded` state. No private (hashed) class names are read.
		*
		* The product's `Menu` primitive renders a portalled dropdown card whose width is
		* content-driven: the shipped `_list_` recipe is `min-width:218px;
		* max-width:360px`, so a menu opened from a full-width sidebar row lands NARROWER
		* than the row it hangs from. Measured on the desktop account menu (settings
		* launcher seat, `settings.launcher`): the row is the sidebar's full 256px while
		* the 设置 / 意见反馈 / 退出登录 card painted 218px — an obvious "the popup does
		* not belong to this row" seam.
		*
		* This adapter closes that seam for the sidebar's own rows: when a portalled menu
		* opens from a trigger registered in the settings-launcher seat, the card is
		* pinned to the trigger row's width (and therefore shares its left AND right
		* edge). Everything is scoped to that seat — the composer's model/permission
		* pickers and every other menu keep their own recipe untouched.
		*
		* Why JS and not CSS: the portal destroys the DOM relationship (the card is a
		* child of `<body>`, the row lives in the sidebar), and the card carries no
		* owner class when the account plugin leaves `listClassName` unset. The one
		* stable contract at popup time is the OPEN TRIGGER — `aria-haspopup` +
		* `aria-expanded="true"` — plus the slot its row was registered into.
		*/
		/** Seats whose rows own a full-width popup. */
		const LAUNCHER_SEATS = ["[data-slot='settings.launcher']", "[data-slot='settings.trigger']"];
		/** Our marker on a card we sized (removed again on dispose). */
		const MARKER = "data-enhc-anchor-width";
		/** Inline properties this adapter writes, for exact removal. */
		const OWNED_PROPERTIES = [
			"width",
			"min-width",
			"max-width",
			"box-sizing"
		];
		/**
		* The row a just-opened portalled menu belongs to.
		*
		* The primitive does not link the two nodes (no `aria-controls`, the card is
		* portalled to `<body>`), so the open trigger is the link. Triggers outside the
		* launcher seats are ignored — those menus are not row-shaped.
		*
		* DIALOG TRIGGERS ARE EXCLUDED (fixed 2026-09-30). The seat check alone was not
		* enough: `[data-slot='settings.trigger']` holds the shell's own settings button,
		* whose `aria-haspopup` is `dialog` and whose `aria-expanded` is `true` for as
		* long as the settings dialog is open. The old selector `[aria-haspopup]
		* [aria-expanded='true']` therefore matched it while that dialog was up, and any
		* menu opened on a settings page was force-pinned to the sidebar button's width
		* (and marked `data-enhc-anchor-width`) — a third-party plugin resizing the
		* product's own popups. Accept only MENU triggers: the modern spelling `menu`,
		* plus the legacy boolean `true` that older primitives used.
		* @returns the trigger element, or null when the open menu is not a row menu.
		*/
		function openRowTrigger() {
			const selector = "[aria-haspopup='menu'][aria-expanded='true'], [aria-haspopup='true'][aria-expanded='true']";
			for (const seat of LAUNCHER_SEATS) {
				const seatEl = document.querySelector(seat);
				if (seatEl === null) continue;
				const trigger = seatEl.querySelector(selector);
				if (trigger instanceof HTMLElement) return trigger;
			}
			return null;
		}
		/**
		* Pin one portalled menu card to the width of the row that opened it.
		* @param card - the `[role='menu']` element the primitive just mounted.
		*/
		function alignCard(card) {
			const trigger = openRowTrigger();
			if (trigger === null) return;
			const width = Math.round(trigger.getBoundingClientRect().width);
			if (!(width > 0)) return;
			card.style.boxSizing = "border-box";
			card.style.width = `${width}px`;
			card.style.minWidth = `${width}px`;
			card.style.maxWidth = `${width}px`;
			card.setAttribute(MARKER, String(width));
		}
		/**
		* Mount the row-width adapter.
		*
		* A MutationObserver on `document.body` sees the portal mount; the card is
		* already positioned by the primitive's layout effect at that point, so
		* re-measuring the row is free of layout thrash (one rect read per open).
		*
		* State is per mount: the set of cards we wrote to lives in this closure, so a
		* second mount cannot release the first instance's cards (and vice versa) —
		* only this instance's disposer clears exactly its own inline widths.
		* @returns disposer that clears the inline width from any card still mounted.
		*/
		function mountMenuAnchorWidth() {
			/** Menus this instance wrote to. Closed menus leave the document, so it is pruned. */
			const touched = /* @__PURE__ */ new Set();
			const inspect = (node) => {
				if (!(node instanceof HTMLElement)) return;
				if (node.matches("[role='menu']")) {
					touched.add(node);
					alignCard(node);
					return;
				}
				for (const card of node.querySelectorAll("[role='menu']")) {
					touched.add(card);
					alignCard(card);
				}
			};
			const observer = new MutationObserver((records) => {
				for (const record of records) for (const node of record.addedNodes) inspect(node);
				for (const card of touched) if (!card.isConnected) touched.delete(card);
			});
			observer.observe(document.body, { childList: true });
			return () => {
				observer.disconnect();
				for (const card of touched) {
					for (const property of OWNED_PROPERTIES) card.style.removeProperty(property);
					card.removeAttribute(MARKER);
				}
				touched.clear();
			};
		}
		//#endregion
		//#region src/client/harness/chrome/style-keeper.ts
		/**
		* Third-party stylesheet keeper — restores a hand-injected `<style>` the loader stole.
		*
		* Layer: harness/chrome (DOM behaviour aimed at the DSH client-module loader, i.e.
		* the shell's own runtime, not any one plugin). Seams: the loader's own tag
		* attributes `data-plugin` / `data-plugin-css` plus the element id a hand-injected
		* sheet carries; no third-party private class names.
		*
		* WHY THIS EXISTS (measured, 2026-09-30)
		*
		* The product's client-module loader inventories injected styles per plugin:
		*
		*   const claimStyles = (id) => {
		*     // preset-emitted tags arrive pre-tagged with data-plugin; any untagged tag
		*     // is claimed for the materializing plugin (HMR bookkeeping).
		*     for (const el of document.querySelectorAll("style:not([data-plugin])"))
		*       el.setAttribute("data-plugin", id);
		*     ...
		*   };
		*   const removeOwnedStyles = (id) => {
		*     for (const el of document.querySelectorAll("style[data-plugin]"))
		*       if (el.getAttribute("data-plugin") === id) el.remove();
		*   };
		*
		* `claimStyles` runs after EVERY module factory materializes and claims every
		* untagged `<style>` in the document — not only the ones that factory just
		* added. A plugin that injects its stylesheet by hand in `apply()` (no bundler
		* preset, so no `data-plugin` attribute) is therefore adopted by whichever
		* plugin materializes next, and `removeOwnedStyles` deletes it the moment that
		* adopter reloads, unloads or is pruned by a graph update. Because such plugins
		* inject idempotently (`if (document.getElementById(ID)) return` inside
		* `apply()`, which only runs once), the loss is permanent for the session: the
		* settings page keeps rendering as unstyled HTML until a full page reload.
		*
		* Observed symptom: dsh-notification's 通知 page rendered as a raw text dump in
		* the desktop app (no cards, no badges, default browser buttons) while the same
		* bundle rendered correctly against the same markup in a web probe — and
		* `#dsh-notification-style` was simply absent from the document.
		*
		* WHAT IT DOES
		*
		* Snapshot every untagged stylesheet, and if one disappears, restore it after a
		* short grace period — unless a stylesheet with the same identity is already
		* back, which is exactly what happens when its owner legitimately hot-reloaded
		* and re-injected (the loader removes the tag first so the idempotent guard lets
		* the fresh CSS through). That ordering keeps HMR fresh AND survives a theft:
		* the owner is never the one being reloaded when the thief unloads.
		*
		* The restored node is left untagged, exactly as the original was, so the loader
		* keeps full ownership semantics; it is the owner's stylesheet, not ours to mark
		* or to delete — dispose therefore leaves it in place.
		*
		* WHICH SHEETS: `data-plugin-css` is the discriminator. The bundler preset stamps
		* both attributes on the tags it emits, and those belong to the loader (a hot
		* reload deletes them so the preset's own guard lets the new CSS through). A tag
		* WITHOUT `data-plugin-css` was injected by plugin code and only ever runs once —
		* including one the claim pass has ALREADY mis-adopted (it then carries
		* `data-plugin` with no `data-plugin-css`), which is exactly the state a probe
		* finds in a session that has already lost the styles.
		*
		* TRADE-OFF (documented, not hidden): a plugin disabled mid-session keeps its
		* hand-injected stylesheet until the next page load. Its DOM is unmounted at the
		* same moment, so nothing is painted with it; the alternative — losing the
		* stylesheet for every plugin still on screen — is the reported bug.
		*/
		/** How long an owner has to re-inject before we conclude the styles were stolen. */
		const GRACE_MS = 500;
		/**
		* Snapshot a stylesheet, if it is one we should keep.
		*
		* The discriminator is `data-plugin-css`: the bundler preset stamps BOTH
		* `data-plugin` and `data-plugin-css="<package>/<file>.css"` on the tags it emits,
		* and those are the loader's to create and destroy (a hot reload deletes them so
		* the preset's guard lets fresh CSS through). A tag without `data-plugin-css` is
		* hand-injected by plugin code and only reaches `apply()` once — whether or not
		* the claim pass has already mistaken it for another plugin's.
		* @param state - this instance's snapshot map.
		* @param node - a `<style>` element.
		*/
		function remember(state, node) {
			if (node.dataset.pluginCss !== void 0) return;
			if (state.seen.has(node)) return;
			state.seen.set(node, {
				id: node.id,
				attributes: [...node.attributes].map((attr) => [attr.name, attr.value]),
				text: node.textContent ?? ""
			});
		}
		/**
		* Whether an equivalent stylesheet is in the document again.
		* @param snapshot - the stylesheet that disappeared.
		* @returns true when its owner (or an identical injection) is back.
		*/
		function isBack(snapshot) {
			if (snapshot.id !== "" && document.getElementById(snapshot.id) !== null) return true;
			if (snapshot.id !== "") return false;
			for (const node of document.querySelectorAll("style")) if ((node.textContent ?? "") === snapshot.text) return true;
			return false;
		}
		/**
		* Put a disappeared stylesheet back, unless its owner already re-injected it.
		* @param state - this instance's snapshot map (the restored tag is remembered here).
		* @param snapshot - what to restore.
		*/
		function restore(state, snapshot) {
			if (isBack(snapshot)) return;
			const style = document.createElement("style");
			for (const [name, value] of snapshot.attributes) {
				if (name === "data-plugin") continue;
				style.setAttribute(name, value);
			}
			style.textContent = snapshot.text;
			document.head.appendChild(style);
			remember(state, style);
			console.info(`[harness-ui-harmonizer] restored a stolen third-party stylesheet${snapshot.id === "" ? "" : ` (#${snapshot.id})`}`);
		}
		/**
		* Mount the stylesheet keeper.
		*
		* Observes the whole tree for `<style>` nodes appearing (any plugin may inject
		* at any time) and disappearing (the theft), and restores the disappeared ones
		* after {@link GRACE_MS}. Nothing is written to a stylesheet's content, and no
		* attribute is added to a foreign tag, so an untouched document stays untouched.
		*
		* All state is per mount (see {@link KeeperState}), so two mounts never share
		* snapshots or timers.
		* @returns disposer: stops watching and cancels pending restores.
		*/
		function mountStyleKeeper() {
			const state = {
				seen: /* @__PURE__ */ new Map(),
				timers: /* @__PURE__ */ new Set()
			};
			for (const node of document.querySelectorAll("style")) if (node instanceof HTMLStyleElement) remember(state, node);
			const observer = new MutationObserver((records) => {
				for (const record of records) {
					for (const node of record.addedNodes) if (node instanceof HTMLStyleElement) remember(state, node);
					for (const node of record.removedNodes) {
						if (!(node instanceof HTMLStyleElement)) continue;
						const snapshot = state.seen.get(node);
						if (snapshot === void 0) continue;
						state.seen.delete(node);
						const handle = window.setTimeout(() => {
							state.timers.delete(handle);
							restore(state, snapshot);
						}, GRACE_MS);
						state.timers.add(handle);
					}
				}
			});
			observer.observe(document.head, { childList: true });
			observer.observe(document.body, { childList: true });
			return () => {
				observer.disconnect();
				for (const handle of state.timers) window.clearTimeout(handle);
				state.timers.clear();
				state.seen.clear();
			};
		}
		//#endregion
		//#region src/client/harness/chrome/frame-track.ts
		/**
		* The AppFrame track's animation gate — a root class while the window is being resized.
		*
		* Layer: harness/chrome (DOM behaviour aimed at the DSH shell's own chrome).
		* Seams: the `<html>` root class the harness stylesheet keys on
		* (`harness/frame-column-transition.module.css`), i.e. our own root class plus the
		* window `resize` event — no private class names, no product internals.
		*
		* DSH 0.2.0 puts the frame's `transition: grid-template-columns …` behind
		* `[data-animating]`, and the component sets that attribute in a
		* `useLayoutEffect` on the SAME commit that writes the new inline track. CSS
		* Transitions start from the before-change style, which at that moment still
		* has `transition-property: all; duration: 0s` — so no transition ever starts
		* and the conversation column snaps to its new width in one frame (measured:
		* 1640px -> 776px in a single frame, no transitionrun/start/end on the frame,
		* `data-animating` cleared 600ms later by the component's fallback timer).
		*
		* The stylesheet (frame-column-transition.module.css) therefore keeps the transition
		* on the frame permanently. That is safe for every case the product itself excludes
		* (its `[data-dragging]` / `[data-rightbar-instant]` /
		* `[data-rightbar-fullscreen]` rules are more specific), EXCEPT the one it
		* guards in JS: a viewport change (`viewportChanged` in AppFrame skips
		* `setAnimating`), where an eased track would make the columns lag the window
		* edge while the user drags it.
		*
		* This module owns exactly that exception: while the window is being resized,
		* `<html>` carries `enhc-window-resizing` and the frame's transition is off.
		* The class is held for a settle window after the last resize event, because
		* the resize burst and the grid write are not ordered (the first event of a
		* drag can arrive after React already committed the new track) — a short hold
		* keeps the tail of a drag instant instead of easing.
		*/
		/** Root class the stylesheet keys the "no transition" rule on. */
		const RESIZE_CLASS = "enhc-window-resizing";
		/** How long the class outlives the last resize event. */
		const RESIZE_SETTLE_MS = 240;
		/**
		* Mount the resize exception. Returns the disposer `ctx.effect` wants; the
		* class, the listener and any pending timer all go away with it.
		*/
		function mountFrameTrackTransition() {
			let timer = 0;
			const root = document.documentElement;
			const onResize = () => {
				if (!root.classList.contains(RESIZE_CLASS)) root.classList.add(RESIZE_CLASS);
				if (timer !== 0) window.clearTimeout(timer);
				timer = window.setTimeout(() => {
					timer = 0;
					root.classList.remove(RESIZE_CLASS);
				}, RESIZE_SETTLE_MS);
			};
			window.addEventListener("resize", onResize);
			return () => {
				window.removeEventListener("resize", onResize);
				if (timer !== 0) window.clearTimeout(timer);
				root.classList.remove(RESIZE_CLASS);
			};
		}
		//#endregion
		//#region src/client/harness/header-fit.ts
		/**
		* PROGRESSIVE HEADER-BADGE HIDING
		*
		* The header row is a single flex line:
		*
		*   [ _titleCluster (flex: 1 1 0%, min-width: 0)
		*       [ _crumbs      (flex: 0 1 auto, min-width: 0, overflow: hidden)
		*       | _headerActions (flex: none) > seat (display: contents) > [badges]
		*       | tabs         (relocated here by index.ts) ]
		*     _headerUtilities (flex: none, margin-left: 20px)
		*     _headerCorner    (flex: none) ]
		*
		* Only `_crumbs` can shrink, so when the header narrows the product's own
		* behaviour is to squeeze the session title first and the badges not at all.
		* Measured on the three-badge reference session at 1707x1067 with the panel
		* open: the row has 611px, the title's content wants 212px, and the title is
		* allowed 0 of them while the badges keep all 312.
		*
		* The user asked for the opposite trade — hide 标准模式, then 智能体团队, then
		* 子智能体 as the space goes, and bring them back when it returns. That is what
		* this module does, and it is why the stylesheet's tab rule (`flex: none`) and
		* this one are a pair: the tab rule makes wrapping impossible, this one decides
		* how much of the row the badges are allowed to keep.
		*
		* HOW THE DECISION IS MADE
		*
		* Empirically, not arithmetically. The badges' widths are not constants a rule
		* could be written from: 标准模式's label is `span`-level and the product's own
		* `@container (width <= 540px)` (measured against `_titleRow`) hides it entirely
		* below a 540px row, `智能体团队`'s label disappears below 480px, and the
		* background-task count changes width as jobs start and finish. Reading
		* `_crumbs.clientWidth` after applying a candidate rung is the only measure
		* that stays true for all of those, and it costs one forced layout per rung
		* (the row is 5 flex items deep — measured sub-millisecond).
		*
		* The ladder is a PREFIX of the ordered badge list: rung `n` means "the first
		* `n` badges are hidden", so the whole state is one integer and re-running the
		* fit is idempotent.
		*
		* WHY THE FLOOR IS 160px
		*
		* The title is the thing the badges are spent on, so the fit keeps it above a
		* legibility floor rather than chasing its full content width — a long session
		* title would otherwise retire every badge at a window width that still has
		* plenty of room for a truncated one. 160px is ~9 glyphs of the header title's
		* 13px type plus the leading icon: measured against the reference sessions, it
		* is the point where a title is still identifying itself, and it is what
		* produces "标准模式 hidden, the rest kept" at a 611px row and "nothing hidden"
		* at a 957px one. The floor is a floor, not a target: when the row is too
		* narrow for the title to reach it even with every badge gone (measured at a
		* 400px header, the 1024-1440px window with the panel open) the fit stops at
		* the last rung and accepts the squeeze.
		*
		* `TITLE_SLACK` is the hysteresis that keeps the boundary quiet: a badge comes
		* back only with 24px MORE room than it needed to leave. Without it the rung
		* would flip every frame while a header sits exactly on a threshold, and the
		* open animation crosses several thresholds on the way in.
		*/
		/** The header row whose width decides how many badges fit. */
		const ROW_SELECTOR = "[class$='_titleRow']";
		/** The session title — the box the badges have to leave room for. */
		const CRUMBS_SELECTOR = "[class$='_titleCluster'] > [class$='_crumbs']";
		/**
		* The badges' seat.
		*
		* Matched by SLOT ATTRIBUTE, never by class: the product's own module class is
		* hashed (`Dc7zOa_…`) and a suffix match on the seat's wrapper is exactly the
		* kind of selector that dies silently on the next build. The seat is
		* `display: contents`, so its children are the row's flex items.
		*/
		const SEAT_SELECTOR = "[data-slot='conversation.session.header.actions']";
		/** Marks a badge this module has taken out of the row. The stylesheet hides it. */
		const HIDDEN_ATTR = "data-enhc-header-hidden";
		/** px the title keeps before the next badge is dropped. See the module doc. */
		const TITLE_FLOOR = 160;
		/**
		* Rung order. `other` is last and catches everything this module cannot name —
		* today the background-task counter — so an unrecognized badge is only ever the
		* badge that survives longest, never one that is hidden by surprise.
		*/
		const RANK = {
			preset: 0,
			team: 1,
			subagent: 2,
			other: 3
		};
		/**
		* Name a badge from the attributes the product guarantees.
		*
		* Every one of these is locale-free and hash-free, which is the point: the
		* strings the user sees (标准模式, 智能体团队, 子智能体) are runtime locale
		* lookups — they do not exist anywhere in the app archive — so matching text
		* would work in exactly one language and break on the next build's class hashes
		* anyway. Sources, read out of the archive:
		*
		*   subagent  SubagentCatalogAction: the trigger is `aria-haspopup="tree"`.
		*   team      TeamAction: the root carries `data-team-action`.
		*   preset    AgentPresetLabel renders a bare `span` — the only non-`div`
		*             badge in the seat, and the only badge whose box is its own label.
		*
		* @param el - one direct child of the seat.
		* @returns the rung this badge belongs to.
		*/
		function classifyBadge(el) {
			if (el.querySelector("[aria-haspopup=\"tree\"]") !== null) return "subagent";
			if (el.matches("[data-team-action]") || el.querySelector("[data-team-action]") !== null) return "team";
			if (el.tagName === "SPAN") return "preset";
			return "other";
		}
		/**
		* The seat's children, sorted into the ladder order.
		*
		* A stable sort on the rung keeps same-rung badges (there is one `other` today)
		* in their document order, so the ladder never reorders what the user sees.
		*
		* @param seat - the badges' seat.
		* @returns the badge elements, most-spendable first.
		*/
		function orderBadges(seat) {
			return [...seat.children].map((el, index) => ({
				el,
				index,
				rank: RANK[classifyBadge(el)]
			})).sort((a, b) => a.rank - b.rank || a.index - b.index).map((entry) => entry.el);
		}
		/**
		* Put the row into rung `hidden`: hide the first `hidden` badges, show the rest.
		*
		* Writes are guarded by a `hasAttribute` compare because `setAttribute` dirties
		* style even when the value is unchanged — re-asserting the same rung on every
		* frame of a panel animation would otherwise re-invalidate the header fifteen
		* times a second for nothing.
		*
		* @param badges - the ordered badges.
		* @param hidden - how many of them, from the front, should be gone.
		*/
		function applyRung(badges, hidden) {
			for (let i = 0; i < badges.length; i += 1) {
				const gone = i < hidden;
				if (gone === badges[i].hasAttribute(HIDDEN_ATTR)) continue;
				if (gone) badges[i].setAttribute(HIDDEN_ATTR, "");
				else badges[i].removeAttribute(HIDDEN_ATTR);
			}
		}
		/**
		* Mount the fit. Returns the disposer `ctx.effect` wants; every observer, the
		* attribute this module wrote and the last rung all go away with it.
		*/
		function mountHeaderFit() {
			let row = null;
			let seat = null;
			let crumbs = null;
			let badges = [];
			/** The rung currently applied. The search starts here, not at zero. */
			let hidden = 0;
			/**
			* Apply rung `n` and read back what the title gets.
			*
			* The read is the point of the whole module: it is the product's own layout
			* answering "is the title readable now?", which is a question no arithmetic
			* over badge widths can answer while the widths themselves depend on the row.
			*
			* @param n - candidate rung.
			* @returns `_crumbs`'s content width in that rung.
			*/
			const titleWidthAt = (n) => {
				applyRung(badges, n);
				return crumbs === null ? TITLE_FLOOR : crumbs.clientWidth;
			};
			/**
			* Re-run the ladder against the row's current width.
			*
			* Runs inside the observers' callbacks (after layout, before paint), so the
			* rung the user first sees is the rung the layout implies — the badges never
			* paint at a width they are about to be removed from.
			*/
			const fit = () => {
				if (badges.length === 0) {
					hidden = 0;
					return;
				}
				let next = Math.min(hidden, badges.length);
				while (next < badges.length && titleWidthAt(next) < TITLE_FLOOR) next += 1;
				while (next > 0 && titleWidthAt(next - 1) >= 184) next -= 1;
				hidden = next;
				applyRung(badges, hidden);
			};
			const seatObserver = new MutationObserver(() => {
				badges = seat === null ? [] : orderBadges(seat);
				fit();
			});
			/**
			* (Re)bind to the current row/seat and hand them to the observers.
			*
			* Called on mount and whenever the current nodes leave the document. The
			* ResizeObserver delivers an initial entry to a newly observed target, so a
			* rebind always ends in a `fit()` without any extra polling.
			*/
			const sync = () => {
				const nextRow = document.querySelector(ROW_SELECTOR);
				const nextSeat = document.querySelector(SEAT_SELECTOR);
				const nextCrumbs = document.querySelector(CRUMBS_SELECTOR);
				if (nextRow === row && nextSeat === seat && nextCrumbs === crumbs) return;
				row = nextRow;
				seat = nextSeat;
				crumbs = nextCrumbs;
				rowSizeObserver.disconnect();
				if (row !== null) rowSizeObserver.observe(row);
				seatObserver.disconnect();
				if (seat !== null) seatObserver.observe(seat, {
					childList: true,
					subtree: true,
					characterData: true
				});
				badges = seat === null ? [] : orderBadges(seat);
				fit();
			};
			const rowSizeObserver = new ResizeObserver(() => {
				if (row === null || !row.isConnected) {
					sync();
					return;
				}
				fit();
			});
			/**
			* Rebind when the header is rebuilt (session switch, hot reload).
			*
			* The document-level observer exists only for that: while the bound nodes are
			* connected it does one `isConnected` check and returns, because every
			* geometry and badge-set change already reaches this module through the two
			* observers above. `isConnected` is a DOM flag, so the steady-state cost of
			* this observer is the callback itself, no layout.
			*/
			const documentObserver = new MutationObserver(() => {
				if (row !== null && row.isConnected && seat !== null && seat.isConnected) return;
				sync();
			});
			sync();
			documentObserver.observe(document.body, {
				childList: true,
				subtree: true
			});
			return () => {
				documentObserver.disconnect();
				seatObserver.disconnect();
				rowSizeObserver.disconnect();
				for (const node of document.querySelectorAll(`[${HIDDEN_ATTR}]`)) node.removeAttribute(HIDDEN_ATTR);
				badges = [];
				hidden = 0;
			};
		}
		//#endregion
		//#region src/client/index.ts
		/**
		* Harness UI Harmonizer — browser half entry (assembly root).
		*
		* Three slots are registered (all through `ctx.slots.inject`, so each one is
		* unregistered with the fiber):
		*
		*   1. `settings.general.item` id `ui-enhancer-header`, order -100 — GeneralHeader
		*   2. `settings.general.item` id `ui-enhancer`,        order  30 — SettingsGeneralRow
		*   3. `settings.section`      id `ui-harmony`,         order  40 — DoctorView
		*
		* One shared EnhancerState lives in the apply closure; the two settings rows
		* receive it plus an onApply callback that mutates it and pushes CSS.
		*
		* THIRTEEN effects are installed, in this order — the order is a LAYOUT CONTRACT,
		* not a detail: the mounters below assume the earlier ones already published
		* their CSS variables and declared their surfaces, and the two DOM moves run
		* before the header reconciler so it sees the final header row.
		*
		*   1. harmony contract      — create the runtime, publish the negotiation variables
		*   2. surface declarations  — declare our own surfaces to that runtime
		*   3. css lifecycle         — applyState + disposeDynamicStyle (the state push)
		*   4. session tabs          — move the 对话/轨迹 tabs into the title cluster
		*   5. bottom toggle         — move the workbench toggle to the cluster's end
		*   6. settings page headers — mark/inject the page heading + description
		*   7. row popup width       — pin a portalled menu to its launcher row
		*   8. stylesheet keeper     — restore a hand-injected sheet the loader stole
		*   9. frame track animation — keep the column-track transition, minus resize
		*  10. instant track         — snap the track on a right-panel toggle, glide the
		*                             content with covers (after 9: it wraps our tween)
		*  11. header badge fit      — retire header badges as the row narrows (after 10,
		*                             and after the two DOM moves: it measures that row)
		*  12. native-title tooltips — replace the OS tooltip with the product's bubble
		*  13. third-party text      — normalize foreign provider strings (text only)
		*
		* The four slots are registered AFTER those effects, so the surfaces they render
		* always find the styles and root classes already in place. The fiber's effect
		* disposers remove every dynamic style tag, root property, class, listener and
		* DOM move this plugin made.
		*/
		/**
		* Plugin id stamped on every style tag we own, and the label on every
		* `ctx.effect` (fiber diagnostics). ONE spelling: the historical
		* `harness-ui-enhancer` survived in three places (here, tsdown.config.ts's
		* bundle id, title-tooltip's tag id) and the loader could only sweep the tags
		* that matched its own id — the tooltip bubble's stylesheet leaked on unload
		* because of it. `dsh-ui-harmonizer` is the package name and the loader's id.
		*/
		const PLUGIN_ID = "dsh-ui-harmonizer";
		/** Required services: the slot registry (React is a platform module). */
		const inject = ["slots"];
		/**
		* Client plugin body: restore persisted state, apply CSS, register surfaces.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			const state = loadState();
			applyState(state);
			const harmony = createHarmonyRuntime((name, value) => ctx.reflect.provide(name, value));
			ctx.effect(() => () => harmony.dispose(), `${PLUGIN_ID}: harmony contract`);
			ctx.effect(() => {
				const disposers = [harmony.service.registerSurface({
					id: "dsh-ui-harmonizer:settings-rows",
					role: "settings-page",
					tokens: ["--dsw-alias-border-l2", "--dsw-alias-state-business-primary"],
					opaque: false,
					note: "the rows in Settings → General, plus the UI Compatibility page"
				})];
				return () => {
					for (const dispose of disposers) dispose();
				};
			}, `${PLUGIN_ID}: surface declarations`);
			ctx.effect(() => {
				applyState(state);
				return disposeDynamicStyle;
			}, `${PLUGIN_ID}: css lifecycle`);
			ctx.effect(() => {
				let origin = null;
				const relocateTabs = () => {
					const titleCluster = document.querySelector("[class$=\"_titleCluster\"]");
					const actions = titleCluster?.querySelector("[class$=\"_headerActions\"]");
					const tabs = document.querySelector("[data-slot=\"conversation.session.header\"] [class$=\"_tabs\"]");
					if (!titleCluster || !tabs) return;
					if (tabs.parentElement === titleCluster) return;
					if (origin === null) origin = {
						parent: tabs.parentNode,
						nextSibling: tabs.nextSibling
					};
					const ref = actions !== void 0 && actions !== null ? actions.nextSibling : null;
					titleCluster.insertBefore(tabs, ref);
				};
				relocateTabs();
				const observer = new MutationObserver(relocateTabs);
				observer.observe(document.body, {
					childList: true,
					subtree: true
				});
				return () => {
					observer.disconnect();
					const tabs = document.querySelector("[data-slot=\"conversation.session.header\"] [class$=\"_tabs\"]");
					if (tabs === null || origin === null) return;
					if (!origin.parent.isConnected) return;
					const cluster = document.querySelector("[class$=\"_titleCluster\"]");
					if (tabs.parentElement !== cluster) return;
					const ref = origin.nextSibling !== null && origin.parent.contains(origin.nextSibling) ? origin.nextSibling : null;
					origin.parent.insertBefore(tabs, ref);
				};
			}, `${PLUGIN_ID}: session tabs relocation`);
			ctx.effect(() => {
				let origin = null;
				const placeBottomToggle = () => {
					const button = document.querySelector("[data-dsh-bottom-toggle]");
					const holder = button === null ? null : button.parentElement;
					const cluster = holder === null ? null : holder.parentElement;
					if (holder === null || cluster === null) return;
					if (!cluster.className.includes("_titleCluster")) return;
					if (cluster.lastElementChild === holder) return;
					if (origin === null) origin = {
						parent: holder.parentNode,
						nextSibling: holder.nextSibling
					};
					cluster.appendChild(holder);
				};
				placeBottomToggle();
				const observer = new MutationObserver(placeBottomToggle);
				observer.observe(document.body, {
					childList: true,
					subtree: true
				});
				return () => {
					observer.disconnect();
					const button = document.querySelector("[data-dsh-bottom-toggle]");
					const holder = button === null ? null : button.parentElement;
					if (holder === null || origin === null) return;
					if (!origin.parent.isConnected) return;
					if (!holder.parentElement?.className.includes("_titleCluster")) return;
					const ref = origin.nextSibling !== null && origin.parent.contains(origin.nextSibling) ? origin.nextSibling : null;
					origin.parent.insertBefore(holder, ref);
				};
			}, `${PLUGIN_ID}: bottom-panel toggle placement`);
			ctx.effect(() => mountSettingsPageHeaders(), `${PLUGIN_ID}: settings page headers`);
			ctx.effect(() => mountMenuAnchorWidth(), `${PLUGIN_ID}: row popup width`);
			ctx.effect(() => mountStyleKeeper(), `${PLUGIN_ID}: third-party stylesheet keeper`);
			ctx.effect(() => mountFrameTrackTransition(), `${PLUGIN_ID}: frame track animation`);
			ctx.effect(() => mountInstantTrack(), `${PLUGIN_ID}: instant track + panel glide`);
			ctx.effect(() => mountHeaderFit(), `${PLUGIN_ID}: header badge fit`);
			ctx.effect(() => mountTitleTooltips(), `${PLUGIN_ID}: unified native-title tooltips`);
			ctx.effect(() => mountTextAdapters(COMMANDCODE_TEXT_ADAPTERS), `${PLUGIN_ID}: third-party text adapters`);
			const patch = (next) => {
				if (next.width === void 0) adoptSharedWidth(state);
				Object.assign(state, next);
				applyState(state);
			};
			const surfaceProps = {
				state,
				onApply: patch,
				presets: FONT_PRESETS
			};
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "ui-enhancer-header",
				order: -100
			}, GeneralHeader));
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "ui-enhancer",
				order: 30
			}, () => react.createElement(SettingsGeneralRow, surfaceProps)));
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "ui-harmony",
				order: 40,
				label: () => getDoctorSectionLabel()
			}, () => react.createElement(DoctorView, { service: harmony.service })));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map