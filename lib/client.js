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
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\self\sheet-tokens.module.css.mjs
		const css$22 = ":root{--enhancer-content-width:748px;--enhancer-sidebar-scale:1}";
		const tagId$22 = "dsh-ui-harmonizer/sheet-tokens.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$22) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$22;
			tag.textContent = css$22;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\chat-chrome-scale.module.css.mjs
		const css$21 = "body{--enhancer-chat-scale:calc(var(--dsh-content-font-size,14px) / 14px)}";
		const tagId$21 = "dsh-ui-harmonizer/chat-chrome-scale.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$21) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$21;
			tag.textContent = css$21;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-widgets\width-handle-squeeze.module.css.mjs
		const css$20 = "body.dsx-stats-active [data-width-handle]{--enhc-squeeze:calc(var(--dsx-rail-w,0px) / 2);--enhc-content:min(var(--dsh-chat-content-width), calc(100% - var(--dsx-rail-w,0px) - var(--dsh-scrollbar-width,0px) - 2px));transition:right var(--ds-transition-duration-slow) var(--ds-ease-in-out), left var(--ds-transition-duration-slow) var(--ds-ease-in-out)}body.dsx-stats-active [data-width-handle][data-side=left]{right:calc(50% + var(--enhc-content) / 2 + 24px + var(--enhc-squeeze))}body.dsx-stats-active [data-width-handle][data-side=right]{left:calc(50% + var(--enhc-content) / 2 + 24px - var(--enhc-squeeze))}";
		const tagId$20 = "dsh-ui-harmonizer/width-handle-squeeze.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$20) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$20;
			tag.textContent = css$20;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\composer-and-menu.module.css.mjs
		const css$19 = "[data-slot=\"conversation.composer.bar\"] [class$=_trigger]{font-size:calc(13px * var(--enhancer-chat-scale,1));line-height:calc(20px * var(--enhancer-chat-scale,1));height:calc(28px * var(--enhancer-chat-scale,1))}[data-slot=\"conversation.composer.bar\"] [class$=_trigger] svg,[data-slot=\"conversation.composer.bar\"] [class$=_add] svg{width:calc(14px * var(--enhancer-chat-scale,1));height:calc(14px * var(--enhancer-chat-scale,1))}[data-slot=\"conversation.composer.bar\"] [class$=_primary] svg{width:calc(16px * var(--enhancer-chat-scale,1));height:calc(16px * var(--enhancer-chat-scale,1))}[role=menu][class*=_list_]{padding:calc(4px * var(--enhancer-chat-scale,1));border-radius:calc(12px * var(--enhancer-chat-scale,1));min-width:calc(218px * var(--enhancer-chat-scale,1));max-width:calc(360px * var(--enhancer-chat-scale,1))}[role=menu] [class*=_item_]{font-size:calc(14px * var(--enhancer-chat-scale,1));line-height:calc(22px * var(--enhancer-chat-scale,1));min-height:calc(40px * var(--enhancer-chat-scale,1));padding:calc(8px * var(--enhancer-chat-scale,1)) calc(10px * var(--enhancer-chat-scale,1));border-radius:calc(10px * var(--enhancer-chat-scale,1));gap:calc(8px * var(--enhancer-chat-scale,1))}[role=menu] [class*=_itemIcon_],[role=menu] [class*=_check_]{width:calc(16px * var(--enhancer-chat-scale,1));height:calc(16px * var(--enhancer-chat-scale,1))}[role=menu] [class*=_label_]{font-size:calc(12px * var(--enhancer-chat-scale,1));line-height:calc(16px * var(--enhancer-chat-scale,1));padding:calc(8px * var(--enhancer-chat-scale,1)) calc(10px * var(--enhancer-chat-scale,1))}";
		const tagId$19 = "dsh-ui-harmonizer/composer-and-menu.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$19) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$19;
			tag.textContent = css$19;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\sidebar-chrome.module.css.mjs
		const css$18 = "[data-slot=sidebar] [class*=_newSession]:is([class$=_newSession],[class*=_newSession\\ ]){font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(38px * var(--enhancer-sidebar-scale))}[data-slot=sidebar] [class*=_newSessionLabel]:is([class$=_newSessionLabel],[class*=_newSessionLabel\\ ]){max-width:calc(200px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton]{width:calc(28px * var(--enhancer-sidebar-scale));height:calc(28px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton] svg{width:calc(16px * var(--enhancer-sidebar-scale));height:calc(16px * var(--enhancer-sidebar-scale))}[data-sidebar-collapsed] [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton]{width:36px;height:36px}[data-sidebar-collapsed] [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton] svg{width:16px;height:16px}[data-slot=sidebar\\.settings] [class$=_trigger]{font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(34px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badge]{font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(49px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badge] svg{width:calc(14px * var(--enhancer-sidebar-scale));height:calc(14px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badgeCount]{font-size:calc(12px * var(--enhancer-sidebar-scale));line-height:calc(16px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces]{font-size:calc(14px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_title]{font-size:calc(14px * var(--enhancer-sidebar-scale));line-height:calc(20px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_meta],[data-slot=sidebar\\.workspaces] [class$=_time]{font-size:calc(12px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_sectionHeader]{font-size:calc(13px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar\\.workspaces] [class$=_iconButton]{width:calc(28px * var(--enhancer-sidebar-scale));height:calc(28px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar\\.workspaces] [class$=_iconButton] svg{width:calc(16px * var(--enhancer-sidebar-scale));height:calc(16px * var(--enhancer-sidebar-scale))}[data-sidebar-collapsed] [data-slot=sidebar\\.workspaces] [class$=_iconButton]{width:36px;height:36px}[data-sidebar-collapsed] [data-slot=sidebar\\.workspaces] [class$=_iconButton] svg{width:16px;height:16px}";
		const tagId$18 = "dsh-ui-harmonizer/sidebar-chrome.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$18) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$18;
			tag.textContent = css$18;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\self\settings-section-headers.module.css.mjs
		const css$17 = "[data-slot=settings\\.section] .enhc-page-title{color:var(--dsw-alias-label-primary);margin:0;font-size:18px;font-weight:600;line-height:26px}[data-slot=settings\\.section] .enhc-page-intro{color:var(--dsw-alias-label-tertiary);border-bottom:1px solid var(--dsw-alias-border-l2);margin:0 0 12px;padding-bottom:12px;font-size:13px;line-height:20px}[data-slot=settings\\.section] [class$=_titleRow]>svg{display:none}";
		const tagId$17 = "dsh-ui-harmonizer/settings-section-headers.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$17) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$17;
			tag.textContent = css$17;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\settings-and-crumb.module.css.mjs
		const css$16 = "button[class$=_crumb],button[class$=_crumbCurrent]{max-width:560px}[class$=_versionPicker] select{-webkit-appearance:none;appearance:none;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);cursor:pointer;border:none;border-radius:18px;min-width:0;height:32px;padding:0 32px 0 14px;font-size:13px;line-height:20px}[class$=_versionPicker] select:hover{background-color:var(--dsw-alias-interactive-bg-hover)}[class$=_versionPicker] select:focus-visible{outline:2px solid var(--dsw-alias-border-l3);outline-offset:1px}[class$=_versionPicker] select option{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:13px}";
		const tagId$16 = "dsh-ui-harmonizer/settings-and-crumb.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$16) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$16;
			tag.textContent = css$16;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\self\settings-controls.module.css.mjs
		const css$15 = ".uitw-stepper-control{align-items:center;gap:8px;display:inline-flex}.uitw-stepper{background:var(--dsw-alias-bg-module-platform);border-radius:18px;justify-content:center;align-items:center;min-width:72px;height:36px;display:inline-flex;position:relative}.uitw-stepper-value{text-align:center;font-variant-numeric:tabular-nums;min-width:18px;color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px}.uitw-stepper-arrows{opacity:0;transition:opacity var(--ds-transition-duration-fast,.15s) var(--ds-ease-in-out,ease);flex-direction:column;gap:2px;display:flex;position:absolute;right:8px}.uitw-stepper:hover .uitw-stepper-arrows,.uitw-stepper:focus-within .uitw-stepper-arrows{opacity:1}.uitw-stepper-arrow{background:color-mix(in srgb, var(--dsw-alias-bg-layer-1) 75%, transparent);width:17px;height:12px;color:var(--dsw-alias-label-primary);cursor:pointer;border:none;border-radius:3px;justify-content:center;align-items:center;padding:0;display:inline-flex}.uitw-stepper-arrow:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.uitw-stepper-arrow:disabled{opacity:.4;cursor:default}.uitw-stepper-unit{color:var(--dsw-alias-label-secondary);font-size:14px;line-height:22px}.uitw-segmented{background:var(--dsw-alias-bg-module-platform);border-radius:20px;align-items:center;gap:4px;padding:4px;display:inline-flex}.uitw-segment{appearance:none;font:var(--dsw-font-s-14,14px/22px var(--dsw-font-family));color:var(--dsw-alias-label-primary);cursor:pointer;white-space:nowrap;transition:background var(--ds-transition-duration-fast) var(--ds-ease-in-out);background:0 0;border:none;border-radius:16px;padding:6px 14px}.uitw-segment:hover:not(.uitw-segment-on){background:var(--dsw-alias-interactive-bg-hover)}.uitw-segment-on{background:var(--dsw-alias-state-business-primary);color:#fff}.uitw-switch{box-sizing:border-box;corner-shape:round;background:var(--dsw-alias-border-l3);cursor:pointer;border:0;border-radius:999px;flex:none;width:36px;height:20px;padding:2px;display:inline-block;position:relative}.uitw-switch[aria-checked=true]{background:var(--dsw-alias-brand-primary)}.uitw-switch:disabled{cursor:default;opacity:.5}.uitw-switch:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}.uitw-switch-thumb{corner-shape:round;background:var(--dsw-alias-label-primary-foreground);border-radius:50%;width:16px;height:16px;transition:transform .12s;display:block}.uitw-switch[aria-checked=false] .uitw-switch-thumb{background:var(--dsw-alias-switch-thumb)}.uitw-switch[aria-checked=true] .uitw-switch-thumb{transform:translate(16px)}";
		const tagId$15 = "dsh-ui-harmonizer/settings-controls.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$15) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$15;
			tag.textContent = css$15;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-genui\genui-switch.module.css.mjs
		const css$14 = "body .V1MMBW_switch{box-sizing:border-box;corner-shape:round;background:var(--dsw-alias-border-l3);border:0;border-radius:999px;width:36px;height:20px;padding:2px;transition:none}body .V1MMBW_switch.V1MMBW_switchOn{background:var(--dsw-alias-brand-primary);border-color:#0000}body .V1MMBW_switch .V1MMBW_switchKnob{corner-shape:round;background:var(--dsw-alias-switch-thumb);width:16px;height:16px;box-shadow:none;border-radius:50%;transition:transform .12s;top:2px;left:2px}body .V1MMBW_switch.V1MMBW_switchOn .V1MMBW_switchKnob{background:var(--dsw-alias-label-primary-foreground);left:2px;transform:translate(16px)}body .V1MMBW_switchRow:focus-within .V1MMBW_switch{box-shadow:none;outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}";
		const tagId$14 = "dsh-ui-harmonizer/genui-switch.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$14) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$14;
			tag.textContent = css$14;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\commandcode-provider\cc-switch-focus-ring.module.css.mjs
		const css$13 = "body .cc-toggle:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary))}";
		const tagId$13 = "dsh-ui-harmonizer/cc-switch-focus-ring.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$13) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$13;
			tag.textContent = css$13;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-better-sidebar\toggle-buttons.module.css.mjs
		const css$12 = "body [class$=_toggleButton]{border:1px solid var(--dsw-alias-border-l2);width:32px;height:32px;color:var(--dsw-alias-label-secondary);background:0 0;border-radius:16px}body [class$=_toggleButton]:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}body [class$=_toggleButton][aria-pressed=true],body [class$=_toggleButton][aria-pressed=true]:hover{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary-inverted);border-color:#0000}";
		const tagId$12 = "dsh-ui-harmonizer/toggle-buttons.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$12) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$12;
			tag.textContent = css$12;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-widgets\capsule-no-override-note.module.css.mjs
		const css$11 = "";
		const tagId$11 = "dsh-ui-harmonizer/capsule-no-override-note.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$11) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$11;
			tag.textContent = css$11;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-better-sidebar\panel-chrome.module.css.mjs
		const css$10 = "body .nArs4W_panel{background:var(--enhc-solid-fill,var(--dsw-alias-bg-layer-1));border:none;border-left:1px solid var(--dsw-alias-border-l2);box-shadow:var(--dsw-shadow-lv3);border-radius:14px 0 0 14px;top:6px;overflow:hidden}body .nArs4W_bottomPanel{background:var(--enhc-solid-fill,var(--dsw-alias-bg-base));border-top:1px solid var(--dsw-alias-border-l2)}";
		const tagId$10 = "dsh-ui-harmonizer/panel-chrome.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$10) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$10;
			tag.textContent = css$10;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\session-header.module.css.mjs
		const css$9 = "[data-slot=conversation\\.header]>header:has([class$=_titleCluster]>[class$=_tabs]),[data-slot=\"conversation.session.header\"]>header{transition:margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out);margin-right:var(--dsh-sidebar-width,0px)!important;border-bottom:none!important;min-height:0!important;padding:10px 28px 10px 20px!important}[data-slot=conversation\\.header]>header,[data-slot=\"conversation.session.header\"]>header{z-index:21;background:var(--enhc-solid-fill,var(--dsw-alias-bg-base));position:relative}[data-slot=conversation\\.header]>header:after,[data-slot=\"conversation.session.header\"]>header:after{content:none}[class$=_titleCluster]>[class$=_tabs]{align-self:center;align-items:center;gap:24px;margin:0 0 0 8px;padding-left:0}[class$=_titleCluster]>[class$=_tabs] [class*=_tab]{padding:5px 0}";
		const tagId$9 = "dsh-ui-harmonizer/session-header.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$9) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$9;
			tag.textContent = css$9;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-better-sidebar\panel-tabs.module.css.mjs
		const css$8 = "body .nArs4W_tabBar{height:44px;min-height:44px}body .nArs4W_panel .nArs4W_tab{border-right:none;align-self:stretch;gap:6px;height:auto;padding:0 12px;font-size:14px;line-height:20px}body .nArs4W_panel .nArs4W_tab svg{width:16px;height:16px}body .nArs4W_panel .nArs4W_tabClose{width:16px;height:16px}body .nArs4W_panel .nArs4W_tabClose svg{width:14px;height:14px}body .nArs4W_panel .nArs4W_tabBarPlus{width:20px;height:20px}body .nArs4W_panel .nArs4W_tabBarPlus svg{width:16px;height:16px}body .nArs4W_panel .nArs4W_pane{background:var(--dsw-alias-bg-layer-1)}body .nArs4W_panel .nArs4W_paneContent,body .nArs4W_panel .nArs4W_paneTab,body .nArs4W_panel .nArs4W_explorer,body .nArs4W_panel .nArs4W_explorerBody{min-width:0;max-width:100%}body .nArs4W_panel .nArs4W_explorerBody{overflow-x:hidden}body .nArs4W_panel .nArs4W_explorerRow{max-width:100%}";
		const tagId$8 = "dsh-ui-harmonizer/panel-tabs.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$8) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$8;
			tag.textContent = css$8;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-better-sidebar\root-squeeze.module.css.mjs
		const css$7 = "html #root{width:100%;margin-right:0}html #root>div[data-slot=root]>div>div:nth-child(2){margin-bottom:0}[data-slot=conversation\\.session]>[class$=_viewArea]{margin-right:var(--dsh-sidebar-width,0px);transition:margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out)}";
		const tagId$7 = "dsh-ui-harmonizer/root-squeeze.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$7) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$7;
			tag.textContent = css$7;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\flow-item-rendering.module.css.mjs
		const css$6 = "[data-slot=conversation\\.session] [class$=_flowItem]{content-visibility:auto;contain-intrinsic-size:auto 120px}";
		const tagId$6 = "dsh-ui-harmonizer/flow-item-rendering.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$6) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$6;
			tag.textContent = css$6;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-better-sidebar\composer-seat-yield.module.css.mjs
		const css$5 = "div[class$=_composerSeat]{margin-right:var(--dsh-sidebar-width,0px);transition:margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out)}";
		const tagId$5 = "dsh-ui-harmonizer/composer-seat-yield.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$5;
			tag.textContent = css$5;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\harness\frame-column-transition.module.css.mjs
		const css$4 = "html [class$=_frame]{transition:grid-template-columns var(--ds-transition-duration-slow) var(--ds-ease-in-out)}html.enhc-window-resizing [class$=_frame]{transition:none}";
		const tagId$4 = "dsh-ui-harmonizer/frame-column-transition.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\plugins\dsh-widgets\rail-overlay-squeeze.module.css.mjs
		const css$3 = "body.dsx-stats-active [data-conversation-scroll]:has([data-conversation-composer-overlay])>[class$=_composerSeat]{right:calc(var(--dsh-scrollbar-width,0px) + var(--dsx-rail-w,220px))}";
		const tagId$3 = "dsh-ui-harmonizer/rail-overlay-squeeze.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-harmonizer";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region \0dsh-css:D:\dsh-home\plugins\dsh-ui-harmonizer\src\client\self\center-card-overlay.module.css.mjs
		const css$2 = "html.enhc-center-card-on div:has(>[data-slot=main],>[data-slot=conversation]){border-radius:18px 0 0}html.enhc-center-card-on .enhc-center-card{display:block}.enhc-center-card{box-sizing:border-box;border-top:1px solid var(--dsw-alias-border-l2);box-shadow:var(--dsw-shadow-lv3);pointer-events:none;background:0 0;border-bottom:none;border-left:none;border-right:none;border-radius:18px 0 0;display:none}html.enhc-center-card-on .enhc-center-card-wrapped{border-top:none;border-radius:0;box-shadow:-20px 10px 36px -18px #0000001c,0 -10px 26px -16px #0000000f,16px 26px 42px -22px #00000014}html.enhc-center-card-on [data-slot=conversation\\.header]>header,html.enhc-center-card-on [data-slot=\"conversation.session.header\"]>header{box-shadow:inset 0 1px 0 var(--dsw-alias-border-l2);border-radius:18px 0 0}";
		const tagId$2 = "dsh-ui-harmonizer/center-card-overlay.module.css";
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
		function getRowCardTitle() {
			return isZh() ? "圆角卡片" : "Rounded Card";
		}
		function getRowCardDesc() {
			return isZh() ? "将对话区域显示为左上圆角的卡片，附投影" : "Display the chat area as a rounded card with shadow";
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
		//#region src/client/harness/controls/segmented-control.tsx
		/**
		* `SegmentedControl` — the official selector-pill recipe, replicated.
		*
		* Layer: harness (a copy of the product's own control, used wherever this
		* plugin needs a two-or-more-way exclusive choice). The class names are ours
		* (`uitw-segmented` / `uitw-segment`), but the geometry they carry in
		* `self/settings-controls.module.css` is transcribed from the official
		* selector pills — re-check it against the installed primitives when the
		* product's control language changes.
		*/
		/**
		* Product-style segmented control (one row, mutually exclusive options).
		* Local mirror so the selection paints immediately on click.
		* @param props.options - the option ids and their labels.
		* @param props.value - the selected option id.
		* @param props.onChange - called with the newly selected id.
		* @returns the radiogroup element.
		*/
		function SegmentedControl({ options, value, onChange }) {
			const [local, setLocal] = useMirrored(value);
			return react.createElement("div", {
				className: "uitw-segmented",
				role: "radiogroup"
			}, options.map((option) => react.createElement("button", {
				key: option.id,
				type: "button",
				role: "radio",
				"aria-checked": local === option.id,
				className: local === option.id ? "uitw-segment uitw-segment-on" : "uitw-segment",
				onClick: () => {
					setLocal(option.id);
					onChange(option.id);
				}
			}, option.label)));
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
			card: false
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
		//#region src/client/core/react/use-popover-position.ts
		/**
		* `usePopoverPosition` — fixed-coordinate placement for a menu opened from a trigger.
		*
		* Layer: core (infrastructure, React). Extracted verbatim from the inline
		* geometry `FontSelector` computed in its click handler; the numbers are the
		* product's own menu behaviour (218px min width, 12px viewport margin, 40px
		* rows plus 2px of padding), so this is a recipe, not a knob.
		*
		* It only COMPUTES: the caller hands the returned object to the menu's style.
		*/
		const MIN_WIDTH = 218;
		const VIEWPORT_MARGIN = 12;
		const ROW_HEIGHT = 40;
		/**
		* Place a `position: fixed` menu under (or above) the clicked trigger.
		*
		* Always returns a fresh object, so the caller can call it on every open and
		* store the result in state; `null` is never returned (the caller only asks
		* while opening).
		* @param trigger - the element that was clicked (its rect anchors the menu).
		* @param rowCount - number of rows the menu will carry, for the height estimate.
		* @returns the fixed left/top and the available max height.
		*/
		function computePopoverPosition(trigger, rowCount) {
			const rect = trigger.getBoundingClientRect();
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			const estHeight = 4 + rowCount * ROW_HEIGHT + 2;
			const openDown = rect.bottom + 4 + estHeight <= vh - VIEWPORT_MARGIN;
			return {
				left: Math.min(Math.max(rect.right - MIN_WIDTH, VIEWPORT_MARGIN), vw - MIN_WIDTH - VIEWPORT_MARGIN),
				top: openDown ? rect.bottom + 4 : rect.top - estHeight - 4,
				maxHeight: vh - 24
			};
		}
		/**
		* State holder for the placement above: `null` until the menu is opened, and
		* the last resolved placement thereafter (it is intentionally NOT recomputed on
		* scroll or resize — the menu closes on pointerdown elsewhere).
		* @returns the current position and its setter.
		*/
		function usePopoverPosition() {
			return react.useState(null);
		}
		//#endregion
		//#region src/client/harness/controls/icon-paths.ts
		/**
		* Icon path data — official recipe copy.
		*
		* Layer: harness (normalization against the DSH body itself). These two path
		* strings are transcribed from `@deepseek-ai/dsh-client-ui-primitives`; they
		* are the product's own glyphs, so they must be re-checked against the
		* installed primitives package whenever the product's icon set is revised.
		* Nothing here is designable by us — do not "improve" the numbers.
		*/
		/** Chevron-down, as shipped by the official icon set. */
		const CHEVRON_PATH = "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z";
		/** Check mark, as shipped by the official icon set. */
		const CHECK_PATH = "M15.0498 3.92579L8.49512 12.3818C8.25774 12.6881 8.04517 12.9645 7.84668 13.1689C7.63957 13.3823 7.38732 13.5841 7.04492 13.6719C6.86373 13.7183 6.6757 13.7346 6.48926 13.7197C6.13666 13.6915 5.8528 13.5355 5.6123 13.3604C5.38201 13.1926 5.12573 12.9567 4.83984 12.6953L1.03125 9.21289L1.96875 8.1875L5.77734 11.6699C6.08684 11.9529 6.27773 12.1249 6.43066 12.2363C6.50183 12.2882 6.54699 12.3135 6.57324 12.3252C6.58525 12.3305 6.59269 12.3322 6.5957 12.333C6.59802 12.3336 6.59961 12.334 6.59961 12.334C6.63317 12.3367 6.66758 12.3335 6.7002 12.3252C6.7002 12.3252 6.70211 12.3251 6.7041 12.3242C6.70698 12.3229 6.71348 12.319 6.72461 12.3115C6.74849 12.2956 6.78843 12.2642 6.84961 12.2012C6.98138 12.0654 7.13957 11.8628 7.39648 11.5313L13.9502 3.07422L15.0498 3.92579Z";
		//#endregion
		//#region src/client/self/settings/font-selector.tsx
		/**
		* `FontSelector` — this plugin's own font-preset picker.
		*
		* Layer: self (the options are OUR `FONT_PRESETS`, not a product control) and
		* the only reason it is not in `harness/`: nothing here is transcribed from the
		* product except the selector-pill look, which the class-free inline styles
		* below reproduce. The pill's geometry is a deliberate copy of the official
		* selector pill; re-check it when the product's control language changes.
		*
		* Two behaviours that must not be "simplified" without re-measuring:
		* - the local mirror (via `useMirrored`) so the pill label updates immediately
		*   on pick, with external changes adopted by the effect;
		* - the installed-font probe, which greys a preset whose family is absent.
		*/
		/**
		* Custom font selector: product selector-pill button + fixed menu.
		* Holds a local mirror of the selected id so the pill label updates
		* immediately on pick; external changes are adopted via the effect.
		* @param props.value - the persisted preset id.
		* @param props.onChange - called with the picked preset id.
		* @param props.presets - the preset table to list.
		* @returns the trigger pill and, while open, its menu.
		*/
		function FontSelector({ value, onChange, presets }) {
			const [local, setLocal] = useMirrored(value);
			const [open, setOpen] = react.useState(false);
			const [pos, setPos] = usePopoverPosition();
			const wrapRef = react.useRef(null);
			react.useEffect(() => {
				if (!open) return;
				const onDown = (e) => {
					if (wrapRef.current !== null && !wrapRef.current.contains(e.target)) setOpen(false);
				};
				const onKey = (e) => {
					if (e.key === "Escape") setOpen(false);
				};
				document.addEventListener("pointerdown", onDown);
				document.addEventListener("keydown", onKey);
				return () => {
					document.removeEventListener("pointerdown", onDown);
					document.removeEventListener("keydown", onKey);
				};
			}, [open]);
			const selectedLabel = getPresetLabel((presets.find((p) => p.id === local) ?? presets[0]).id);
			const toggle = (e) => {
				if (!open) setPos(computePopoverPosition(e.currentTarget, presets.length));
				setOpen((v) => !v);
			};
			const pillStyle = {
				display: "inline-flex",
				alignItems: "center",
				gap: 12,
				height: 36,
				padding: "0 14px",
				border: "none",
				borderRadius: 18,
				background: "var(--dsw-alias-bg-module-platform)",
				font: "inherit",
				fontSize: 14,
				lineHeight: "22px",
				color: "var(--dsw-alias-label-primary)",
				cursor: "pointer",
				whiteSpace: "nowrap",
				maxWidth: "100%"
			};
			const menuStyle = {
				position: "fixed",
				zIndex: 1100,
				boxSizing: "border-box",
				minWidth: 218,
				maxWidth: 360,
				padding: 4,
				display: "flex",
				flexDirection: "column",
				border: "1px solid var(--dsw-alias-border-inverted)",
				borderRadius: 12,
				background: "var(--dsw-specific-menu)",
				boxShadow: "var(--dsw-shadow-lv3)",
				...pos
			};
			const itemStyle = {
				display: "flex",
				alignItems: "center",
				gap: 8,
				width: "100%",
				minHeight: 40,
				padding: "8px 10px",
				border: "none",
				borderRadius: 10,
				background: "transparent",
				cursor: "pointer",
				fontSize: 14,
				lineHeight: "22px",
				color: "var(--dsw-alias-label-primary)",
				textAlign: "left"
			};
			const checkIcon = react.createElement("svg", {
				width: 16,
				height: 16,
				viewBox: "0 0 16 16",
				fill: "none",
				style: { flex: "none" }
			}, react.createElement("path", {
				d: CHECK_PATH,
				fill: "currentColor"
			}));
			return react.createElement("div", {
				ref: wrapRef,
				style: {
					position: "relative",
					display: "inline-flex",
					maxWidth: "100%"
				}
			}, [react.createElement("button", {
				type: "button",
				style: open ? {
					...pillStyle,
					background: "var(--dsw-alias-interactive-bg-hover)"
				} : pillStyle,
				"aria-haspopup": "menu",
				"aria-expanded": open,
				onClick: toggle,
				key: "trigger"
			}, [react.createElement("span", {
				key: "label",
				style: {
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
					minWidth: 0
				}
			}, selectedLabel), react.createElement("svg", {
				key: "chevron",
				width: 14,
				height: 14,
				viewBox: "0 0 14 14",
				fill: "none",
				style: {
					flex: "none",
					color: "var(--dsw-alias-label-tertiary)"
				}
			}, react.createElement("path", {
				d: CHEVRON_PATH,
				fill: "currentColor"
			}))]), open && pos !== null ? react.createElement("div", {
				key: "menu",
				role: "menu",
				style: {
					...menuStyle,
					maxHeight: pos.maxHeight,
					overflowY: "auto"
				}
			}, presets.map((p) => react.createElement("button", {
				key: p.id,
				type: "button",
				role: "menuitem",
				style: itemStyle,
				onMouseEnter: (e) => {
					e.currentTarget.style.background = "var(--dsw-alias-interactive-bg-hover)";
				},
				onMouseLeave: (e) => {
					e.currentTarget.style.background = "transparent";
				},
				onClick: () => {
					setLocal(p.id);
					setOpen(false);
					onChange(p.id);
				}
			}, [
				react.createElement("span", {
					key: "label",
					style: {
						flex: 1,
						minWidth: 0,
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap"
					}
				}, getPresetLabel(p.id)),
				p.probe !== null && !isFamilyInstalled(p.probe) ? react.createElement("span", {
					key: "missing",
					title: p.probe,
					style: {
						flex: "none",
						fontSize: 12,
						lineHeight: "18px",
						color: "var(--dsw-alias-label-tertiary)"
					}
				}, getFontMissingLabel()) : null,
				p.id === local ? react.createElement("span", {
					key: "check",
					style: { flex: "none" }
				}, checkIcon) : null
			]))) : null]);
		}
		//#endregion
		//#region src/client/self/settings/general-rows.tsx
		/**
		* `SettingsGeneralRow` — the "界面定制" block registered in Settings → General.
		*
		* Layer: self (this plugin's own five knobs). The row/control shells it
		* composes come from `harness/controls/*`; the labels come from `i18n.ts` so a
		* language switch re-reads them. Every control is a MODULE-LEVEL constant —
		* never defined inline here — so React keeps its identity across renders.
		*/
		/**
		* The interface customization block: chat width, sidebar size, font family,
		* font scope and the center-column card toggle.
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
					control: react.createElement(SegmentedControl, {
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
						}
					})
				}),
				react.createElement(SettingsRow, {
					key: "center-card",
					title: getRowCardTitle(),
					desc: getRowCardDesc(),
					control: react.createElement(SwitchControl, {
						checked: state.card,
						onChange: (v) => {
							onApply({ card: v });
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
				const state = {
					...DEFAULT_STATE,
					...parsed
				};
				if (!Number.isFinite(state.width) || state.width < 640 || state.width > 1e3) state.width = DEFAULT_STATE.width;
				if (!Number.isFinite(state.sidebarSize) || state.sidebarSize < 12 || state.sidebarSize > 20) state.sidebarSize = DEFAULT_STATE.sidebarSize;
				if (typeof state.fontId !== "string" || !FONT_PRESETS.some((p) => p.id === state.fontId)) state.fontId = DEFAULT_STATE.fontId;
				if (state.fontScope !== "content" && state.fontScope !== "ui") state.fontScope = DEFAULT_STATE.fontScope;
				if (typeof state.card !== "boolean") state.card = DEFAULT_STATE.card;
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
			root.classList.toggle("enhc-center-card-on", state.card);
			applyFont(state);
		}
		/**
		* Dispose everything this module wrote: the inline font properties, the root
		* custom properties and the card class. Called from the plugin fiber's effect
		* disposer so stopping/updating the plugin leaves zero residue.
		*/
		function disposeDynamicStyle() {
			clearFontProps();
			const root = document.documentElement;
			for (const property of ROOT_PROPERTIES) root.style.removeProperty(property);
			root.classList.remove("enhc-center-card-on");
		}
		//#endregion
		//#region src/client/harness/anchors.ts
		/**
		* Find the center column element. The AppFrame wraps the conversation slot in
		* `div.centerCol`, and the slot outlet (whose wrapper is display:contents) is
		* its direct DOM child — a stable, hash-independent seam.
		*
		* DSH 0.1.5 moved the conversation from a root child slot (`conversation`) to a
		* keyed entry of the new `main` slot, which declares `main.conversation`. Both
		* anchors are display:contents wrappers, so `parentElement` can no longer be
		* trusted on the newer tree; resolve the column by its stable class suffix and
		* keep the old parent lookup as the fallback for 0.1.0/0.1.1 builds.
		* @returns the center column element, or null if not yet mounted.
		*/
		function findCenterColumn() {
			const slot = document.querySelector("[data-slot=\"main.conversation\"], [data-slot=\"conversation\"]");
			if (slot === null || slot === void 0) return null;
			const col = slot.closest("[class$=\"_centerCol\"]");
			if (col instanceof HTMLElement) return col;
			const parent = slot.parentElement;
			if (parent === null || parent === void 0) return null;
			return parent;
		}
		//#endregion
		//#region src/client/harness/center-card.tsx
		/**
		* `CenterColCard` — rounded center-column card overlay.
		*
		* Layer: harness (it aligns itself to DSH's own center column via
		* `./anchors.ts`; the target is the product's layout, not our own UI).
		*
		* Other than a left sidebar, DeepSeek Harness's main content area is a flat
		* `--dsw-alias-bg-base` fill with no real card surface, separated only by the
		* neighbors' hairline borders. This component adds the "rounded card" chrome
		* the user asked for, non-invasively, without touching any harness source.
		*
		* Wrapped-card model (v0.8.0): the AppFrame's shell.overlay outlet is ITSELF
		* a stacking context (`z-index:20; position:absolute; inset:0`), so nothing
		* registered inside it can ever out-paint the session header (raised to 21 to
		* mask the widgets rail). Instead of fighting layers, the card is split by
		* painting surface:
		*
		* - The SESSION HEADER (the highest relevant element, z-21) carries the
		*   card's top edge while it exists: border-top + the 14px top-left radius,
		*   styled in enhancer.module.css under the card-on root class — so the card
		*   visibly WRAPS the header at zero pixel cost, and nothing can hide it.
		* - This overlay becomes a pure SHADOW CASTER in that mode: one transparent
		*   box spanning header + content (from the column's own top) casting
		*   `--dsw-shadow-lv3`, whose fringes read as the card's elevation, including
		*   the left bleed over the sidebar. No border/radius → no doubled lines,
		*   and the header never clips the shadow (it paints above it like content).
		* - Routes without a session header (e.g. trajectory) fall back to this box
		*   drawing the classic self-contained card: border-top + radius + shadow.
		*
		* Visibility is controlled purely by the `enhc-center-card-on` class on
		* <html> (flipped by applyState from the Settings toggle), so the component
		* stays mounted for cheap geometry tracking and a class flip turns its paint
		* on/off with zero re-render. All side effects are owned by the fiber.
		*/
		/**
		* HOW THE LONG-LIVED 1Hz POLL WAS RETIRED (removed 2026-09-30), and why no
		* replacement is needed.
		*
		* The overlay used to run `setInterval(measure, 1000)` for the whole life of
		* the session: an unconditional wake-up that read `getBoundingClientRect()` on
		* the center column — a forced layout of the AppFrame — every second, on every
		* page, forever, including while the tab was hidden or the card's paint was
		* switched off. It was defended as "belt and braces for layout changes no
		* observer reports", but that set is empty for this box:
		*
		*   - size changes of the column itself → ResizeObserver (`onResize`);
		*   - viewport changes → `window.resize` (`schedule`);
		*   - the product's 0.3s column-track ease → `transitionrun` / `transitionend`
		*     / `transitioncancel` on the frame, which set the cheap `animating` path
		*     and do the full re-anchor when the ease ends;
		*   - left/top drift with no size change → an ancestor reflow, i.e. a layout
		*     change of a boxed-in element, which is always accompanied by a size
		*     change of at least one ancestor this observer is attached to (the center
		*     column is sized by the same grid track that moves it), so the observer
		*     fires there too.
		*
		* A poll that samples once a second also cannot be correct for a sub-second
		* reflow, so it was strictly worse than the event paths: it burned a forced
		* re-layout per second to hide, at best, a fraction of the cases it promised to
		* catch. If a safety net is ever wanted here, drive it from those same events
		* (a few reads after `transitionend`) — never from a clock that outlives the
		* gesture.
		*/
		/**
		* Passive rounded-card chrome overlay. Renders a transparent box aligned to
		* the center column; what it paints (full card vs. shadow only) comes from
		* `.enhc-center-card` / `.enhc-center-card-wrapped` (see
		* `self/center-card-overlay.module.css`), gated by the root class.
		*
		* Geometry tracking is deliberately free of per-frame React work and of
		* per-frame forced layout (measured 2026-09-17):
		*
		* - The box is a ref'd, always-mounted div. Every geometry update writes
		*   `left/top/width/height` straight to `element.style`, and the `-wrapped`
		*   paint mode flips through `classList` — no `setState`, so a ResizeObserver
		*   burst during the product's 0.3s column-track ease cannot re-render the
		*   overlay at animation cadence.
		* - The shell animates its column track with `grid-template-columns` on the
		*   AppFrame, i.e. a LAYOUT property: while that transition runs, every
		*   `getBoundingClientRect()` forces a full re-layout of the frame. The
		*   ResizeObserver entry already carries the new content box, so during a
		*   track transition the width/height come from `entry.contentRect` (free)
		*   and the box rides the animation without a single forced reflow. Only
		*   after `transitionend` does a full read re-anchor left/top.
		* - The header probe that decides `wrapped` is cached in a closure variable
		*   and re-evaluated on the (rare) full read, not per frame.
		*
		* Measured before the observer-based tracking, on a 1578x846 viewport with a
		* long conversation loaded, one right-sidebar toggle cost 8 RO callbacks /
		* 55-58ms of the 0.3s animation window plus 8 React renders; the same
		* callback cost 172ms over 18 callbacks on a left-sidebar toggle.
		*
		* PREMISE FOR WRITING DOM DIRECTLY (explicit, do not break): every geometry
		* update below writes `box.style.left/top/width/height` (and flips the
		* `enhc-center-card-wrapped` class) on a node React rendered. That is only safe
		* because of two facts held together:
		*
		*   1. this component never re-renders — no state, no props, no context — so
		*      the effect runs once per mount and React never reconciles the node
		*      again, and
		*   2. the `style` prop passed to `React.createElement` carries ONLY
		*      `position` and `pointerEvents` (the static part React owns). Geometry
		*      properties must never be added to that object: React writes the style
		*      prop on commit, and any future re-render would then restore the props'
		*      values and wipe the measured geometry.
		*
		* If a re-render ever becomes necessary here, geometry tracking has to move to
		* state (or into an inner element React does not own).
		* @returns the always-mounted transparent overlay box.
		*/
		function CenterColCard() {
			const boxRef = react.useRef(null);
			react.useEffect(() => {
				const box = boxRef.current;
				if (box === null) return;
				const col = findCenterColumn();
				if (col === null || col === void 0) return;
				const frame = col.closest("[class$=\"_frame\"]");
				const headerSelector = "[data-slot='conversation.header'] > header:has([class$='_tabs']), [data-slot='conversation.session.header'] > header";
				let animating = false;
				let frameHandle = 0;
				/** Last full-read geometry; the cheap path keeps left/top from here. */
				const anchor = {
					left: 0,
					top: 0
				};
				/** Cached `wrapped` mode; null until the first probe. */
				let wrapped = null;
				const paint = (left, top, width, height) => {
					if (!(width > 0) || !(height > 0)) return;
					anchor.left = left;
					anchor.top = top;
					box.style.left = `${left}px`;
					box.style.top = `${top + 1}px`;
					box.style.width = `${width}px`;
					box.style.height = `${Math.max(height - 1, 0)}px`;
				};
				const syncWrapped = () => {
					const next = document.querySelector(headerSelector) !== null;
					if (next === wrapped) return;
					wrapped = next;
					box.classList.toggle("enhc-center-card-wrapped", next);
				};
				/** Full read: forces layout, so it only runs while no track ease is live. */
				const measure = () => {
					frameHandle = 0;
					const r = col.getBoundingClientRect();
					syncWrapped();
					paint(r.left, r.top, r.width, r.height);
				};
				const schedule = () => {
					if (frameHandle !== 0 || animating) return;
					frameHandle = window.requestAnimationFrame(measure);
				};
				const onResize = (entries) => {
					const entry = entries[entries.length - 1];
					if (animating && entry !== void 0) {
						paint(anchor.left, anchor.top, entry.contentRect.width, entry.contentRect.height);
						return;
					}
					schedule();
				};
				const onTransitionRun = (event) => {
					if (event.propertyName === "grid-template-columns") animating = true;
				};
				const onTransitionDone = (event) => {
					if (event.propertyName !== "grid-template-columns") return;
					animating = false;
					measure();
				};
				measure();
				const observer = new ResizeObserver(onResize);
				observer.observe(col);
				window.addEventListener("resize", schedule);
				frame?.addEventListener("transitionrun", onTransitionRun);
				frame?.addEventListener("transitionend", onTransitionDone);
				frame?.addEventListener("transitioncancel", onTransitionDone);
				return () => {
					if (frameHandle !== 0) cancelAnimationFrame(frameHandle);
					observer.disconnect();
					window.removeEventListener("resize", schedule);
					frame?.removeEventListener("transitionrun", onTransitionRun);
					frame?.removeEventListener("transitionend", onTransitionDone);
					frame?.removeEventListener("transitioncancel", onTransitionDone);
				};
			}, []);
			return react.createElement("div", {
				ref: boxRef,
				className: "enhc-center-card",
				style: {
					position: "absolute",
					pointerEvents: "none"
				}
			});
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
		* material watcher (theme events when the theme service is present, plus a
		* cheap poll so a theme applied by plain CSS is still noticed).
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
			const poll = window.setInterval(refreshMaterial, 2e3);
			const disposeService = provide("uiHarmony", service);
			return {
				service,
				refreshMaterial,
				dispose: () => {
					disposeService();
					if (unsubscribeTheme !== void 0) unsubscribeTheme();
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
		//#region src/client/index.ts
		/**
		* Harness UI Harmonizer — browser half entry (assembly root).
		*
		* Four slots are registered (all through `ctx.slots.inject`, so each one is
		* unregistered with the fiber):
		*
		*   1. `settings.general.item` id `ui-enhancer-header`, order -100 — GeneralHeader
		*   2. `settings.general.item` id `ui-enhancer`,        order  30 — SettingsGeneralRow
		*   3. `shell.overlay`         id `enhancer-center-card`, order 30 — CenterColCard
		*   4. `settings.section`      id `ui-harmony`,         order  40 — DoctorView
		*
		* One shared EnhancerState lives in the apply closure; the two settings rows
		* receive it plus an onApply callback that mutates it and pushes CSS.
		*
		* ELEVEN effects are installed, in this order — the order is a LAYOUT CONTRACT,
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
		*  10. native-title tooltips — replace the OS tooltip with the product's bubble
		*  11. third-party text      — normalize foreign provider strings (text only)
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
					id: "dsh-ui-harmonizer:center-card",
					role: "frame-overlay",
					tokens: [
						"--dsw-alias-border-l2",
						"--dsw-shadow-lv3",
						"--enhc-solid-fill"
					],
					opaque: false,
					note: "transparent shadow/border caster over the center column; paints no fill of its own"
				}), harmony.service.registerSurface({
					id: "dsh-ui-harmonizer:settings-rows",
					role: "settings-page",
					tokens: ["--dsw-alias-border-l2", "--dsw-alias-state-business-primary"],
					opaque: false,
					note: "five rows in Settings → General, plus the UI Compatibility page"
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
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "enhancer-center-card",
				order: 30
			}, () => react.createElement(CenterColCard)));
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