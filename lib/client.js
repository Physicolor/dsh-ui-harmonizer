window.__ModuleLoader__.load({
	id: "harness-ui-enhancer",
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
		//#region \0dsh-css:D:\dsh-home\plugins\harness-ui-enhancer\src\client\enhancer.module.css.mjs
		const css = ":root{--enhancer-content-width:748px;--enhancer-font-size:14px;--enhancer-font-line:21px;--enhancer-sidebar-scale:1;--enhancer-chat-scale:1}div[data-phase]{--dsh-chat-content-width:var(--enhancer-content-width)}[data-input-scroll],[data-slot=conversation\\.session] [class$=_bubble]{font-size:var(--enhancer-font-size);line-height:var(--enhancer-font-line)}[data-slot=\"conversation.composer.bar\"] [class$=_trigger]{font-size:calc(13px * var(--enhancer-chat-scale,1));line-height:calc(20px * var(--enhancer-chat-scale,1));height:calc(28px * var(--enhancer-chat-scale,1))}[data-slot=\"conversation.composer.bar\"] [class$=_trigger] svg,[data-slot=\"conversation.composer.bar\"] [class$=_add] svg{width:calc(14px * var(--enhancer-chat-scale,1));height:calc(14px * var(--enhancer-chat-scale,1))}[data-slot=\"conversation.composer.bar\"] [class$=_primary] svg{width:calc(16px * var(--enhancer-chat-scale,1));height:calc(16px * var(--enhancer-chat-scale,1))}[role=menu] [class^=_list_]{padding:calc(4px * var(--enhancer-chat-scale,1));border-radius:calc(12px * var(--enhancer-chat-scale,1));min-width:calc(218px * var(--enhancer-chat-scale,1));max-width:calc(360px * var(--enhancer-chat-scale,1))}[role=menu] [class^=_item_]{font-size:calc(14px * var(--enhancer-chat-scale,1));line-height:calc(22px * var(--enhancer-chat-scale,1));min-height:calc(40px * var(--enhancer-chat-scale,1));padding:calc(8px * var(--enhancer-chat-scale,1)) calc(10px * var(--enhancer-chat-scale,1));border-radius:calc(10px * var(--enhancer-chat-scale,1));gap:calc(8px * var(--enhancer-chat-scale,1))}[role=menu] [class^=_itemIcon_],[role=menu] [class^=_check_]{width:calc(16px * var(--enhancer-chat-scale,1));height:calc(16px * var(--enhancer-chat-scale,1))}[role=menu] [class^=_label_]{font-size:calc(12px * var(--enhancer-chat-scale,1));line-height:calc(16px * var(--enhancer-chat-scale,1));padding:calc(8px * var(--enhancer-chat-scale,1)) calc(10px * var(--enhancer-chat-scale,1))}[data-slot=sidebar] [class$=_newSession]{font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(38px * var(--enhancer-sidebar-scale))}[data-slot=sidebar] [class$=_newSessionLabel]{max-width:calc(200px * var(--enhancer-sidebar-scale))}[data-slot=sidebar] [class$=_brand] svg{width:calc(182px * var(--enhancer-sidebar-scale));height:calc(24px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton]{width:calc(28px * var(--enhancer-sidebar-scale));height:calc(28px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton] svg{width:calc(16px * var(--enhancer-sidebar-scale));height:calc(16px * var(--enhancer-sidebar-scale))}[data-sidebar-collapsed] [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton]{width:36px;height:36px}[data-sidebar-collapsed] [data-slot=sidebar] [class$=_logoRow] [class$=_iconButton] svg{width:16px;height:16px}[data-slot=sidebar\\.settings] [class$=_trigger]{font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(34px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badge]{font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(49px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badge] svg{width:calc(14px * var(--enhancer-sidebar-scale));height:calc(14px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badgeCount]{font-size:calc(12px * var(--enhancer-sidebar-scale));line-height:calc(16px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces]{font-size:calc(14px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_title]{font-size:calc(14px * var(--enhancer-sidebar-scale));line-height:calc(20px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_meta],[data-slot=sidebar\\.workspaces] [class$=_time]{font-size:calc(12px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_sectionHeader]{font-size:calc(13px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar\\.workspaces] [class$=_iconButton]{width:calc(28px * var(--enhancer-sidebar-scale));height:calc(28px * var(--enhancer-sidebar-scale))}:not([data-sidebar-collapsed]) [data-slot=sidebar\\.workspaces] [class$=_iconButton] svg{width:calc(16px * var(--enhancer-sidebar-scale));height:calc(16px * var(--enhancer-sidebar-scale))}[data-sidebar-collapsed] [data-slot=sidebar\\.workspaces] [class$=_iconButton]{width:36px;height:36px}[data-sidebar-collapsed] [data-slot=sidebar\\.workspaces] [class$=_iconButton] svg{width:16px;height:16px}[data-slot=settings\\.section] h2[class$=_title],[data-slot=settings\\.section] h2[class$=_heading]{margin:0 0 -8px;font-size:18px;font-weight:600;line-height:26px}[data-slot=settings\\.section] p[class$=_intro]{border-bottom:1px solid var(--dsw-alias-border-l2);margin:0 0 12px;padding-bottom:12px;font-size:13px;line-height:20px}[data-slot=settings\\.section] .dsh_notification_subtitle,[data-slot=settings\\.section] [class$=_head]>[class$=_sub]{border-bottom:1px solid var(--dsw-alias-border-l2);padding-bottom:12px}[data-slot=settings\\.section] [class$=_titleRow]>svg{display:none}[data-slot=settings\\.section] .dsh_notification_heading{gap:4px}[data-slot=settings\\.section] h2.dsh_notification_title{margin-bottom:0}[data-slot=settings\\.section] h2.enhc-settings-title{color:var(--dsw-alias-label-primary);margin:0 0 -8px;font-size:18px;font-weight:600;line-height:26px}button[class$=_crumb],button[class$=_crumbCurrent]{max-width:560px}[class$=_versionPicker] select{-webkit-appearance:none;appearance:none;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);cursor:pointer;border:none;border-radius:18px;min-width:0;height:32px;padding:0 32px 0 14px;font-size:13px;line-height:20px}[class$=_versionPicker] select:hover{background-color:var(--dsw-alias-interactive-bg-hover)}[class$=_versionPicker] select:focus-visible{outline:2px solid var(--dsw-alias-border-l3);outline-offset:1px}[class$=_versionPicker] select option{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:13px}input[type=range].CG7lXq_uitw-slider{-webkit-appearance:none;appearance:none;background:var(--dsw-alias-border-l2);cursor:pointer;border-radius:2px;outline:none;height:4px}input[type=range].CG7lXq_uitw-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;background:var(--dsw-alias-bg-layer-2);border:2px solid var(--dsw-alias-brand-primary);cursor:pointer;border-radius:50%;width:14px;height:14px}input[type=range].CG7lXq_uitw-slider::-moz-range-thumb{background:var(--dsw-alias-bg-layer-2);border:2px solid var(--dsw-alias-brand-primary);cursor:pointer;border-radius:50%;width:14px;height:14px}input[type=range].CG7lXq_uitw-slider::-moz-range-track{background:var(--dsw-alias-border-l2);border-radius:2px;height:4px}body [class$=_toggleButton]{border:1px solid var(--dsw-alias-border-l2);width:32px;height:32px;color:var(--dsw-alias-label-secondary);background:0 0;border-radius:16px}body [class$=_toggleButton]:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.nArs4W_toggleButton[aria-pressed=true],.nArs4W_toggleButton[aria-pressed=true]:hover{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary-inverted);border-color:#0000}body .dsx-stats-capsule[aria-pressed=true]{color:var(--dsw-alias-label-primary-inverted)}body [class$=_toggleCluster]{gap:6px;top:12px;right:12px}body .nArs4W_panel{background:var(--dsw-alias-bg-layer-1);border:none;border-left:1px solid var(--dsw-alias-border-l2);box-shadow:var(--dsw-shadow-lv3);border-radius:14px 0 0 14px;top:6px;overflow:hidden}body .nArs4W_panelResize{left:0}body .nArs4W_bottomPanel{background:var(--dsw-alias-bg-base);border-top:1px solid var(--dsw-alias-border-l2)}[data-slot=\"conversation.session.header\"]>header{transition:margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out);margin-right:max(var(--dsh-sidebar-width,0px), 82px)!important;border-bottom:none!important;padding:12px 20px!important}[data-slot=\"conversation.session.header\"]>header{z-index:21;background:var(--dsw-alias-bg-base);position:relative}[data-slot=\"conversation.session.header\"]>header:after{content:none}[class$=_tabs]{align-items:center;gap:8px;margin:0 0 0 8px;display:flex}[class$=_tabs] [class*=_tab]{border:1px solid var(--dsw-alias-border-l2,transparent);background:var(--dsw-alias-bg-layer-1);height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:14px;flex:none;justify-content:center;align-items:center;padding:0 14px;font-size:13px;line-height:20px;display:inline-flex}[class$=_tabs] [class*=_tab]:hover:not(:disabled):not([class*=_tabActive]){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}[class$=_tabs] [class*=_tabActive],[class$=_tabs] [class*=_tab][aria-selected=true]{background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-primary-inverted);border-color:#0000}[class$=_tabs] [class*=_tab]:after{content:none}body .nArs4W_tabBar{height:44px;min-height:44px}body .nArs4W_panel .nArs4W_tab{border-right:none;gap:6px;height:36px;padding:0 12px;font-size:14px;line-height:20px}body .nArs4W_panel .nArs4W_tab svg{width:16px;height:16px}body .nArs4W_panel .nArs4W_tabClose{width:16px;height:16px}body .nArs4W_panel .nArs4W_tabClose svg{width:14px;height:14px}body .nArs4W_panel .nArs4W_tabBarPlus{width:20px;height:20px}body .nArs4W_panel .nArs4W_tabBarPlus svg{width:16px;height:16px}body .nArs4W_panel .nArs4W_pane{background:var(--dsw-alias-bg-layer-1)}body .nArs4W_panel .nArs4W_paneContent,body .nArs4W_panel .nArs4W_paneTab,body .nArs4W_panel .nArs4W_explorer,body .nArs4W_panel .nArs4W_explorerBody{min-width:0;max-width:100%}body .nArs4W_panel .nArs4W_explorerBody{overflow-x:hidden}body .nArs4W_panel .nArs4W_explorerRow{max-width:100%}html #root{width:100%;margin-right:0}html #root>div[data-slot=root]>div>div:nth-child(2){margin-bottom:0}[data-slot=conversation\\.session]>[class$=_viewArea]{margin-right:var(--dsh-sidebar-width,0px);transition:margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out)}div[class$=_composerSeat]{margin-right:var(--dsh-sidebar-width,0px);transition:margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out)}body.dsx-stats-active [data-conversation-scroll]:has([data-conversation-composer-overlay])>[class$=_composerSeat]{right:calc(var(--dsh-scrollbar-width,0px) + var(--dsx-rail-w,220px))}html.enhc-center-card-on div:has(>[data-slot=conversation]){border-radius:14px 0 0}html.enhc-center-card-on .enhc-center-card{display:block}.enhc-center-card{box-sizing:border-box;border-top:1px solid var(--dsw-alias-border-l2);box-shadow:var(--dsw-shadow-lv3);pointer-events:none;background:0 0;border-bottom:none;border-left:none;border-right:none;border-radius:14px 0 0;display:none}";
		const tagId = "harness-ui-enhancer/enhancer.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "harness-ui-enhancer";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region src/client/components.tsx
		/**
		* Harness UI Enhancer — React components.
		*
		* One surface: SettingsGeneralRow, the "界面定制" block inside Settings →
		* General. It reads and writes one shared EnhancerState through the props
		* passed by apply(). Everything is plain React.createElement — no JSX — and
		* styles are inline so the component file carries no CSS module of its own
		* (the plugin-wide rules live in enhancer.module.css).
		*/
		/** Icon path constants copied from @deepseek-ai/dsh-client-ui-primitives. */
		const CHEVRON_PATH = "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z";
		const CHECK_PATH = "M15.0498 3.92579L8.49512 12.3818C8.25774 12.6881 8.04517 12.9645 7.84668 13.1689C7.63957 13.3823 7.38732 13.5841 7.04492 13.6719C6.86373 13.7183 6.6757 13.7346 6.48926 13.7197C6.13666 13.6915 5.8528 13.5355 5.6123 13.3604C5.38201 13.1926 5.12573 12.9567 4.83984 12.6953L1.03125 9.21289L1.96875 8.1875L5.77734 11.6699C6.08684 11.9529 6.27773 12.1249 6.43066 12.2363C6.50183 12.2882 6.54699 12.3135 6.57324 12.3252C6.58525 12.3305 6.59269 12.3322 6.5957 12.333C6.59802 12.3336 6.59961 12.334 6.59961 12.334C6.63317 12.3367 6.66758 12.3335 6.7002 12.3252C6.7002 12.3252 6.70211 12.3251 6.7041 12.3242C6.70698 12.3229 6.71348 12.319 6.72461 12.3115C6.74849 12.2956 6.78843 12.2642 6.84961 12.2012C6.98138 12.0654 7.13957 11.8628 7.39648 11.5313L13.9502 3.07422L15.0498 3.92579Z";
		/** Custom font selector: product selector-pill button + fixed menu.
		* Holds a local mirror of the selected id so the pill label updates
		* immediately on pick; external changes are adopted via the effect. */
		function FontSelector({ value, onChange, presets }) {
			const [local, setLocal] = react.useState(value);
			react.useEffect(() => {
				setLocal(value);
			}, [value]);
			const [open, setOpen] = react.useState(false);
			const [pos, setPos] = react.useState(null);
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
			const selected = presets.find((p) => p.id === local) ?? presets[0];
			const toggle = (e) => {
				if (!open) {
					const rect = e.currentTarget.getBoundingClientRect();
					const vw = window.innerWidth;
					const vh = window.innerHeight;
					const MARGIN = 12;
					const estHeight = 8 + presets.length * 40 + 2;
					const openDown = rect.bottom + 4 + estHeight <= vh - MARGIN;
					setPos({
						left: Math.min(Math.max(rect.right - 218, MARGIN), vw - 218 - MARGIN),
						top: openDown ? rect.bottom + 4 : rect.top - estHeight - 4,
						maxHeight: vh - 24
					});
				}
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
			}, selected.label), react.createElement("svg", {
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
			}, [react.createElement("span", {
				key: "label",
				style: {
					flex: 1,
					minWidth: 0,
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap"
				}
			}, p.label), p.id === local ? react.createElement("span", {
				key: "check",
				style: { flex: "none" }
			}, checkIcon) : null]))) : null]);
		}
		/** Slider row: title + description left, range + value right. */
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
		/** Range control with product styling (class uitw-slider from enhancer.module.css).
		* Holds a local mirror of the value so the thumb tracks the pointer
		* immediately; external value changes (another surface editing the same knob)
		* are adopted via the effect. */
		function SliderControl({ min, max, step, value, onChange, unit }) {
			const [local, setLocal] = react.useState(value);
			react.useEffect(() => {
				setLocal(value);
			}, [value]);
			return react.createElement("div", { style: {
				display: "flex",
				alignItems: "center",
				gap: 10,
				flex: "none"
			} }, [react.createElement("input", {
				key: "range",
				type: "range",
				min,
				max,
				step,
				value: local,
				className: "uitw-slider",
				style: {
					width: 160,
					accentColor: "var(--dsw-alias-brand-primary)"
				},
				onChange: (e) => {
					const next = Number(e.target.value);
					setLocal(next);
					onChange(next);
				}
			}), react.createElement("span", {
				key: "value",
				style: {
					width: 48,
					fontSize: 13,
					lineHeight: "20px",
					color: "var(--dsw-alias-label-secondary)",
					textAlign: "right",
					fontVariantNumeric: "tabular-nums"
				}
			}, `${local}${unit}`)]);
		}
		/** Product-style switch toggle (track + thumb). A controlled button that
		* flips on click; the active state uses the DeepSeek business blue.
		* Holds a local mirror of the value so the thumb slides and the fill changes
		* immediately on click; external value changes (another surface editing the
		* same switch) are adopted via the effect. Without the mirror the parent's
		* in-place state mutation never re-renders this component and the click gives
		* no visual feedback. */
		function SwitchControl({ checked, onChange }) {
			const [local, setLocal] = react.useState(checked);
			react.useEffect(() => {
				setLocal(checked);
			}, [checked]);
			const track = {
				position: "relative",
				display: "inline-flex",
				alignItems: "center",
				width: 36,
				height: 22,
				padding: 0,
				border: "none",
				borderRadius: 11,
				cursor: "pointer",
				background: local ? "var(--dsw-alias-state-business-primary)" : "var(--dsw-alias-border-l3)",
				transition: "background var(--ds-transition-duration-fast) var(--ds-ease-in-out)",
				flex: "none"
			};
			const thumb = {
				position: "absolute",
				top: 3,
				left: local ? 17 : 3,
				width: 16,
				height: 16,
				borderRadius: 8,
				background: "#fff",
				boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
				transition: "left var(--ds-transition-duration-fast) var(--ds-ease-in-out)"
			};
			return react.createElement("button", {
				type: "button",
				role: "switch",
				"aria-checked": local,
				style: track,
				onClick: () => {
					const next = !local;
					setLocal(next);
					onChange(next);
				}
			}, react.createElement("span", { style: thumb }));
		}
		/** The "界面定制" block registered in Settings → General. */
		function SettingsGeneralRow({ state, onApply, presets }) {
			return react.createElement("div", { style: {
				display: "flex",
				flexDirection: "column"
			} }, [
				react.createElement(SettingsRow, {
					key: "width",
					title: "对话内容宽度",
					desc: "对话列的最大宽度，滑动即时预览",
					control: react.createElement(SliderControl, {
						min: 748,
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
					key: "font",
					title: "对话字号",
					desc: "markdown 正文与输入框文字大小",
					control: react.createElement(SliderControl, {
						min: 12,
						max: 20,
						step: 1,
						value: state.fontSize,
						unit: "px",
						onChange: (v) => {
							onApply({ fontSize: v });
						}
					})
				}),
				react.createElement(SettingsRow, {
					key: "sidebar",
					title: "工作区字号",
					desc: "左侧工作区列表、按钮与图标的整体大小",
					control: react.createElement(SliderControl, {
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
					title: "UI 字体",
					desc: "界面与对话使用的字体栈",
					control: react.createElement(FontSelector, {
						value: state.fontId,
						presets,
						onChange: (v) => {
							onApply({ fontId: v });
						}
					})
				}),
				react.createElement(SettingsRow, {
					key: "center-card",
					title: "圆角卡片",
					desc: "将对话区域显示为左上圆角的卡片，附投影",
					control: react.createElement(SwitchControl, {
						checked: state.card,
						onChange: (v) => {
							onApply({ card: v });
						}
					})
				})
			]);
		}
		/** The "通用设置" page header block (title + description), registered first in General. */
		function GeneralHeader() {
			return react.createElement("div", { style: {
				display: "flex",
				flexDirection: "column",
				gap: 4,
				padding: "4px 0 12px",
				borderBottom: "1px solid var(--dsw-alias-border-l2)"
			} }, [react.createElement("div", {
				key: "title",
				style: {
					fontSize: 18,
					fontWeight: 600,
					lineHeight: "26px",
					color: "var(--dsw-alias-label-primary)"
				}
			}, "通用设置"), react.createElement("div", {
				key: "desc",
				style: {
					fontSize: 13,
					lineHeight: "20px",
					color: "var(--dsw-alias-label-tertiary)"
				}
			}, "管理语言、外观、界面与对话行为等基础偏好。")]);
		}
		//#endregion
		//#region src/client/state.ts
		/**
		* State and CSS application for Harness UI Enhancer.
		*
		* Two channels push values into the page:
		* - Static override rules in enhancer.module.css read CSS custom properties
		*   (--enhancer-*) which applyState() updates on <html>.
		* - Markdown font shorthand (font: <weight> <size>/<line> <family>) cannot be
		*   expressed through a custom property, so applyState() also rewrites one
		*   dynamic <style data-plugin="harness-ui-enhancer"> tag holding the body
		*   --dsw-font-markdown-* overrides. The tag carries the plugin id so the
		*   loader's unload sweep removes it together with the bundled stylesheet.
		*/
		/** Font presets: id → label + CSS font stack (null keeps the product default). */
		const FONT_PRESETS = [
			{
				id: "default",
				label: "系统默认（HarmonyOS Sans SC）",
				stack: null
			},
			{
				id: "harmony",
				label: "HarmonyOS Sans SC",
				stack: "'HarmonyOS Sans SC', 'HarmonyOS Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif"
			},
			{
				id: "yahei",
				label: "微软雅黑优先",
				stack: "'Microsoft YaHei', 'PingFang SC', 'Segoe UI', sans-serif"
			},
			{
				id: "noto",
				label: "Noto Sans SC",
				stack: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
			},
			{
				id: "serif",
				label: "衬线（宋体风）",
				stack: "Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif"
			},
			{
				id: "mono",
				label: "等宽",
				stack: "'JetBrains Mono', 'SF Mono', Consolas, 'Courier New', monospace"
			}
		];
		/** Product defaults; the plugin applies these on boot and treats them as the neutral baseline. */
		const DEFAULT_STATE = {
			width: 748,
			fontSize: 14,
			sidebarSize: 14,
			fontId: "default",
			card: false
		};
		/** localStorage key holding the persisted enhancer state. */
		const STORAGE_KEY = "harness-ui-enhancer.state";
		/**
		* Read the persisted state, falling back to defaults on any parse or shape
		* error (the key may be absent, corrupted, or from an older schema).
		* @returns the merged persisted state.
		*/
		function loadState() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw === null) return { ...DEFAULT_STATE };
				const parsed = JSON.parse(raw);
				const state = {
					...DEFAULT_STATE,
					...parsed
				};
				if (!Number.isFinite(state.width) || state.width < 600 || state.width > 1200) state.width = DEFAULT_STATE.width;
				if (!Number.isFinite(state.fontSize) || state.fontSize < 12 || state.fontSize > 24) state.fontSize = DEFAULT_STATE.fontSize;
				if (!Number.isFinite(state.sidebarSize) || state.sidebarSize < 12 || state.sidebarSize > 20) state.sidebarSize = DEFAULT_STATE.sidebarSize;
				if (typeof state.fontId !== "string" || !FONT_PRESETS.some((p) => p.id === state.fontId)) state.fontId = DEFAULT_STATE.fontId;
				if (typeof state.card !== "boolean") state.card = DEFAULT_STATE.card;
				return state;
			} catch {
				return { ...DEFAULT_STATE };
			}
		}
		/** Persist the current state to localStorage. */
		function saveState(state) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
			} catch {}
		}
		/** CSS custom properties consumed by enhancer.module.css. */
		const ROOT_PROPERTIES = [
			"--enhancer-content-width",
			"--enhancer-font-size",
			"--enhancer-font-line",
			"--enhancer-sidebar-scale",
			"--enhancer-chat-scale"
		];
		/** One <style data-plugin> tag lazily created and reused for the dynamic markdown rules. */
		let dynamicStyle = null;
		/**
		* Render the markdown font overrides for the current state.
		* @param state - current enhancer state.
		* @returns the CSS text for the dynamic style tag.
		*/
		function markdownCss(state) {
			const fam = FONT_PRESETS.find((p) => p.id === state.fontId)?.stack ?? "var(--dsw-font-family)";
			const fs = state.fontSize;
			const lh = Math.round(fs * 28 / 16);
			const fmt = (weight, size, line, family) => `${weight} ${size}px/${line}px ${family}`;
			return [
				"body {",
				`  --dsw-font-markdown-base: ${fmt(400, fs, lh, fam)};`,
				`  --dsw-font-markdown-base-strong: ${fmt(600, fs, lh, fam)};`,
				`  --dsw-font-markdown-base-italic: ${fmt(400, fs, lh, fam)};`,
				`  --dsw-font-markdown-base-strong-italic: ${fmt(600, fs, lh, fam)};`,
				`  --dsw-font-markdown-h1: ${fmt(700, Math.round(fs * 1.5), Math.round(fs * 2.125), fam)};`,
				`  --dsw-font-markdown-h2: ${fmt(700, Math.round(fs * 1.375), Math.round(fs * 2), fam)};`,
				`  --dsw-font-markdown-h3: ${fmt(700, Math.round(fs * 1.25), Math.round(fs * 1.875), fam)};`,
				`  --dsw-font-markdown-h4: ${fmt(600, fs, Math.round(fs * 1.75), fam)};`,
				`  --dsw-font-markdown-code: ${fmt(400, Math.round(fs * .875), Math.round(fs * 1.375), fam)};`,
				`  --dsw-font-markdown-code-block: ${fmt(400, Math.round(fs * .8125), Math.round(fs * 1.375), fam)};`,
				`  --dsw-font-markdown-small: ${fmt(400, Math.round(fs * .875), Math.round(fs * 1.5), fam)};`,
				`  --dsw-font-markdown-table: ${fmt(400, Math.round(fs * .9375), Math.round(fs * 1.5625), fam)};`,
				"}"
			].join("\n");
		}
		/**
		* Push the current state into the page: root custom properties plus the
		* dynamic markdown style tag, and persist to localStorage. Idempotent; safe
		* to call on every slider move.
		* @param state - current enhancer state.
		*/
		function applyState(state) {
			saveState(state);
			const root = document.documentElement;
			root.style.setProperty("--enhancer-content-width", `${state.width}px`);
			root.style.setProperty("--enhancer-font-size", `${state.fontSize}px`);
			root.style.setProperty("--enhancer-font-line", `${Math.round(state.fontSize * 1.5)}px`);
			root.style.setProperty("--enhancer-sidebar-scale", String(state.sidebarSize / 14));
			root.style.setProperty("--enhancer-chat-scale", String(state.fontSize / 14));
			root.classList.toggle("enhc-center-card-on", state.card);
			if (dynamicStyle === null) {
				dynamicStyle = document.createElement("style");
				dynamicStyle.dataset.plugin = "harness-ui-enhancer";
				dynamicStyle.dataset.enhancerDynamic = "markdown";
				document.head.appendChild(dynamicStyle);
			}
			dynamicStyle.textContent = markdownCss(state);
		}
		/**
		* Dispose the dynamic style tag. Called from the plugin fiber's effect
		* disposer so stopping/updating the plugin removes it.
		*/
		function disposeDynamicStyle() {
			if (dynamicStyle !== null) {
				dynamicStyle.remove();
				dynamicStyle = null;
			}
			const root = document.documentElement;
			for (const property of ROOT_PROPERTIES) root.style.removeProperty(property);
			root.classList.remove("enhc-center-card-on");
		}
		//#endregion
		//#region src/client/card-overlay.tsx
		/**
		* Harness UI Enhancer — rounded center-column card overlay.
		*
		* Other than a left sidebar, DeepSeek Harness's main content area is a flat
		* `--dsw-alias-bg-base` fill with no real card surface, separated only by the
		* neighbors' hairline borders. This component adds the "rounded card" chrome
		* the user asked for, non-invasively, without touching any harness source:
		*
		*  - A passive overlay (shell.overlay, pointer-events:none) that tracks the
		*    center column's box and paints a top border + top-left rounded corner +
		*    drop shadow. The shadow bleeds LEFT over the sidebar (the card's depth)
		*    and into a 1px top shim; right/bottom stay flush to the window (natural
		*    boundaries). No left border is drawn — the sidebar's own right hairline
		*    is the card's left edge.
		*  - The content's square top-left corner is rounded by giving the center
		*    column a border-radius (its existing overflow:hidden masks the corner);
		*    that rule lives in enhancer.module.css so the mask and the chrome share
		*    one radius source.
		*
		* Visibility is controlled purely by the `enhc-center-card-on` class on
		* <html> (flipped by applyState from the Settings toggle), so the component
		* stays mounted for cheap geometry tracking and a class flip turns its paint
		* on/off with zero re-render. All side effects are owned by the fiber.
		*/
		/** The overlay's top edge sits 1px below the page top so the drop shadow has
		* room to render inside the viewport (a flush top would clip it). */
		const TOP_SHIM = 1;
		/**
		* Find the center column element. The AppFrame wraps the conversation slot in
		* `div.centerCol`, and the slot outlet (whose wrapper is display:contents) is
		* its direct DOM child — a stable, hash-independent seam.
		* @returns the center column element, or null if not yet mounted.
		*/
		function findCenterColumn() {
			const slot = document.querySelector("[data-slot=\"conversation\"]");
			if (slot === null || slot === void 0) return null;
			const parent = slot.parentElement;
			if (parent === null || parent === void 0) return null;
			return parent;
		}
		/**
		* Passive rounded-card chrome overlay. Renders a transparent box aligned to
		* the center column; the actual border/corner/shadow come from
		* `.enhc-center-card` in enhancer.module.css, gated by the root class.
		* Geometry tracks the column via ResizeObserver (fires on sidebar drag /
		* collapse, details open-close, window resize) plus a slow settle poll so a
		* transition-ended layout still lands correctly.
		*/
		function CenterColCard() {
			const [box, setBox] = react.useState(null);
			react.useEffect(() => {
				const col = findCenterColumn();
				if (col === null || col === void 0) return;
				let timer = null;
				const measure = () => {
					const r = col.getBoundingClientRect();
					if (r.width > 0 && r.height > 0) setBox({
						left: r.left,
						top: r.top,
						width: r.width,
						height: r.height
					});
				};
				measure();
				const observer = new ResizeObserver(measure);
				observer.observe(col);
				window.addEventListener("resize", measure);
				timer = window.setInterval(measure, 400);
				return () => {
					observer.disconnect();
					window.removeEventListener("resize", measure);
					if (timer !== null) window.clearInterval(timer);
				};
			}, []);
			if (box === null) return react.createElement("div", { className: "enhc-center-card" });
			return react.createElement("div", {
				className: "enhc-center-card",
				style: {
					position: "absolute",
					left: box.left,
					top: box.top + TOP_SHIM,
					width: box.width,
					height: box.height - TOP_SHIM,
					pointerEvents: "none"
				}
			});
		}
		//#endregion
		//#region src/client/index.ts
		/**
		* Harness UI Enhancer — browser half entry.
		*
		* Registers two surfaces in Settings → General:
		* - GeneralHeader (order -100), the unified page header
		* - SettingsGeneralRow (order 30), the "界面定制" sizing block
		*
		* One shared EnhancerState lives in the apply closure; both surfaces receive
		* it plus an onApply callback that mutates it and pushes CSS. The fiber's
		* effect disposer removes the dynamic markdown style tag and root properties.
		*/
		/** Plugin id stamped on the dynamic style tag (loader unload sweep key). */
		const PLUGIN_ID = "harness-ui-enhancer";
		/** Required services: the slot registry (React is a platform module). */
		const inject = ["slots"];
		/**
		* Client plugin body: restore persisted state, apply CSS, register surfaces.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			const state = loadState();
			applyState(state);
			ctx.effect(() => {
				applyState(state);
				return disposeDynamicStyle;
			}, `${PLUGIN_ID}: css lifecycle`);
			ctx.effect(() => {
				const syncToggleStates = () => {
					const panel = document.querySelector(".nArs4W_panel");
					const bottom = document.querySelector(".nArs4W_bottomPanel");
					const buttons = document.querySelectorAll(".nArs4W_toggleButton");
					if (!panel || !bottom || buttons.length < 2) return;
					const panelOpen = !panel.classList.contains("nArs4W_panelHidden");
					const bottomOpen = !bottom.classList.contains("nArs4W_bottomPanelHidden");
					buttons[0].setAttribute("aria-pressed", String(bottomOpen));
					buttons[1].setAttribute("aria-pressed", String(panelOpen));
				};
				syncToggleStates();
				const observer = new MutationObserver(syncToggleStates);
				observer.observe(document.body, {
					attributes: true,
					childList: true,
					subtree: true,
					attributeFilter: ["class"]
				});
				return () => observer.disconnect();
			}, `${PLUGIN_ID}: better-sidebar toggle state sync`);
			ctx.effect(() => {
				const relocateTabs = () => {
					const titleCluster = document.querySelector("[class$=\"_titleCluster\"]");
					const actions = titleCluster?.querySelector("[class$=\"_headerActions\"]");
					const tabs = document.querySelector("[data-slot=\"conversation.session.header\"] [class$=\"_tabs\"]");
					if (!titleCluster || !tabs) return;
					if (tabs.parentElement === titleCluster) return;
					const ref = actions !== void 0 && actions !== null ? actions.nextSibling : null;
					titleCluster.insertBefore(tabs, ref);
				};
				relocateTabs();
				const observer = new MutationObserver(relocateTabs);
				observer.observe(document.body, {
					childList: true,
					subtree: true
				});
				return () => observer.disconnect();
			}, `${PLUGIN_ID}: session tabs relocation`);
			ctx.effect(() => {
				const FILL_CLASS = "enhc-settings-title";
				/** Deterministic fallback: known intro → page title, so a missing heading is
				*  filled even if the active-nav label cannot be resolved in time. */
				const KNOWN_TITLES = [["管理侧边卡片", "侧边卡片"]];
				const fillSectionTitle = () => {
					const section = document.querySelector("[data-slot=\"settings.section\"]");
					if (section === null || section === void 0) return;
					const intro = section.querySelector("p[class$=\"_intro\"]");
					if (intro === null || intro === void 0) return;
					if (section.querySelector("h1, h2, h3") !== null) return;
					if (section.querySelector(`h2.${FILL_CLASS}`) !== null) return;
					let text = "";
					for (const el of document.querySelectorAll("[class$=\"_navCell\"]")) if (el.getAttribute("aria-current") === "true" || /(^|\s)\S*_active(\s|$)/.test(el.className)) {
						text = el.textContent?.trim() ?? "";
						break;
					}
					if (text === "") {
						const it = intro.textContent?.trim() ?? "";
						text = KNOWN_TITLES.find(([prefix]) => it.startsWith(prefix))?.[1] ?? "";
					}
					if (text === "") return;
					const title = document.createElement("h2");
					title.className = FILL_CLASS;
					title.textContent = text;
					intro.parentElement?.insertBefore(title, intro);
					console.info(`[harness-ui-enhancer] injected settings section title: ${JSON.stringify(text)}`);
				};
				fillSectionTitle();
				const observer = new MutationObserver(fillSectionTitle);
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
				const tick = window.setInterval(fillSectionTitle, 700);
				window.setTimeout(() => window.clearInterval(tick), 12e3);
				return () => {
					observer.disconnect();
					window.clearInterval(tick);
				};
			}, `${PLUGIN_ID}: settings section title fill`);
			const patch = (next) => {
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
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map