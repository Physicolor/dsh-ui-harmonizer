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
		const css = ":root{--enhancer-content-width:748px;--enhancer-font-size:14px;--enhancer-font-line:21px;--enhancer-sidebar-scale:1;--enhancer-chat-scale:1}div[data-phase]{--dsh-chat-content-width:var(--enhancer-content-width)}[data-input-scroll],[data-slot=conversation\\.session] [class$=_bubble]{font-size:var(--enhancer-font-size);line-height:var(--enhancer-font-line)}[data-slot=\"conversation.composer.bar\"] [class$=_trigger]{font-size:calc(13px * var(--enhancer-chat-scale,1));line-height:calc(20px * var(--enhancer-chat-scale,1));height:calc(28px * var(--enhancer-chat-scale,1))}[data-slot=\"conversation.composer.bar\"] [class$=_trigger] svg,[data-slot=\"conversation.composer.bar\"] [class$=_add] svg{width:calc(14px * var(--enhancer-chat-scale,1));height:calc(14px * var(--enhancer-chat-scale,1))}[data-slot=\"conversation.composer.bar\"] [class$=_primary] svg{width:calc(16px * var(--enhancer-chat-scale,1));height:calc(16px * var(--enhancer-chat-scale,1))}[role=menu] [class^=_list_]{padding:calc(4px * var(--enhancer-chat-scale,1));border-radius:calc(12px * var(--enhancer-chat-scale,1));min-width:calc(218px * var(--enhancer-chat-scale,1));max-width:calc(360px * var(--enhancer-chat-scale,1))}[role=menu] [class^=_item_]{font-size:calc(14px * var(--enhancer-chat-scale,1));line-height:calc(22px * var(--enhancer-chat-scale,1));min-height:calc(40px * var(--enhancer-chat-scale,1));padding:calc(8px * var(--enhancer-chat-scale,1)) calc(10px * var(--enhancer-chat-scale,1));border-radius:calc(10px * var(--enhancer-chat-scale,1));gap:calc(8px * var(--enhancer-chat-scale,1))}[role=menu] [class^=_itemIcon_],[role=menu] [class^=_check_]{width:calc(16px * var(--enhancer-chat-scale,1));height:calc(16px * var(--enhancer-chat-scale,1))}[role=menu] [class^=_label_]{font-size:calc(12px * var(--enhancer-chat-scale,1));line-height:calc(16px * var(--enhancer-chat-scale,1));padding:calc(8px * var(--enhancer-chat-scale,1)) calc(10px * var(--enhancer-chat-scale,1))}[data-slot=sidebar] [class$=_newSession]{font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(38px * var(--enhancer-sidebar-scale))}[data-slot=sidebar] [class$=_newSessionLabel]{max-width:calc(200px * var(--enhancer-sidebar-scale))}[data-slot=sidebar] [class$=_brand] svg{width:calc(182px * var(--enhancer-sidebar-scale));height:calc(24px * var(--enhancer-sidebar-scale))}[data-slot=sidebar] [class$=_logoRow] [class$=_iconButton]{width:calc(28px * var(--enhancer-sidebar-scale));height:calc(28px * var(--enhancer-sidebar-scale))}[data-slot=sidebar] [class$=_logoRow] [class$=_iconButton] svg{width:calc(16px * var(--enhancer-sidebar-scale));height:calc(16px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.settings] [class$=_trigger]{font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(34px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badge]{font-size:calc(14px * var(--enhancer-sidebar-scale));height:calc(49px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badge] svg{width:calc(14px * var(--enhancer-sidebar-scale));height:calc(14px * var(--enhancer-sidebar-scale))}[data-slot=\"sidebar.footer.action\"] [class$=_badgeCount]{font-size:calc(12px * var(--enhancer-sidebar-scale));line-height:calc(16px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces]{font-size:calc(14px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_title]{font-size:calc(14px * var(--enhancer-sidebar-scale));line-height:calc(20px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_meta],[data-slot=sidebar\\.workspaces] [class$=_time]{font-size:calc(12px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_sectionHeader]{font-size:calc(13px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_iconButton]{width:calc(28px * var(--enhancer-sidebar-scale));height:calc(28px * var(--enhancer-sidebar-scale))}[data-slot=sidebar\\.workspaces] [class$=_iconButton] svg{width:calc(16px * var(--enhancer-sidebar-scale));height:calc(16px * var(--enhancer-sidebar-scale))}[data-slot=settings\\.section] h2[class$=_title],[data-slot=settings\\.section] h2[class$=_heading]{margin:0 0 -8px;font-size:18px;font-weight:600;line-height:26px}[data-slot=settings\\.section] p[class$=_intro]{border-bottom:1px solid var(--dsw-alias-border-l2);margin:0 0 12px;padding-bottom:12px;font-size:13px;line-height:20px}[data-slot=settings\\.section] .dsh_notification_subtitle,[data-slot=settings\\.section] [class$=_head]>[class$=_sub]{border-bottom:1px solid var(--dsw-alias-border-l2);padding-bottom:12px}[data-slot=settings\\.section] [class$=_titleRow]>svg{display:none}[data-slot=settings\\.section] .dsh_notification_heading{gap:4px}[data-slot=settings\\.section] h2.dsh_notification_title{margin-bottom:0}[data-slot=settings\\.section] h2.enhc-settings-title{color:var(--dsw-alias-label-primary);margin:0 0 -8px;font-size:18px;font-weight:600;line-height:26px}button[class$=_crumb],button[class$=_crumbCurrent]{max-width:560px}[class$=_versionPicker] select{-webkit-appearance:none;appearance:none;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);cursor:pointer;border:none;border-radius:18px;min-width:0;height:32px;padding:0 32px 0 14px;font-size:13px;line-height:20px}[class$=_versionPicker] select:hover{background-color:var(--dsw-alias-interactive-bg-hover)}[class$=_versionPicker] select:focus-visible{outline:2px solid var(--dsw-alias-border-l3);outline-offset:1px}[class$=_versionPicker] select option{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:13px}input[type=range].CG7lXq_uitw-slider{-webkit-appearance:none;appearance:none;background:var(--dsw-alias-border-l2);cursor:pointer;border-radius:2px;outline:none;height:4px}input[type=range].CG7lXq_uitw-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;background:var(--dsw-alias-bg-layer-2);border:2px solid var(--dsw-alias-brand-primary);cursor:pointer;border-radius:50%;width:14px;height:14px}input[type=range].CG7lXq_uitw-slider::-moz-range-thumb{background:var(--dsw-alias-bg-layer-2);border:2px solid var(--dsw-alias-brand-primary);cursor:pointer;border-radius:50%;width:14px;height:14px}input[type=range].CG7lXq_uitw-slider::-moz-range-track{background:var(--dsw-alias-border-l2);border-radius:2px;height:4px}body [class$=_toggleButton]{border:1px solid var(--dsw-alias-border-l2);width:32px;height:32px;color:var(--dsw-alias-label-secondary);background:0 0;border-radius:16px}body [class$=_toggleButton]:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.W-zNGW_toggleButton[aria-pressed=true],.W-zNGW_toggleButton[aria-pressed=true]:hover{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary-inverted);border-color:#0000}body .dsx-stats-capsule[aria-pressed=true]{color:var(--dsw-alias-label-primary-inverted)}body [class$=_toggleCluster]{gap:6px;top:12px;right:12px}body .W-zNGW_panel{top:var(--dsx-rail-top,75px);background:var(--dsw-alias-bg-layer-1);border:none;border-left:1px solid var(--dsw-alias-border-l2);box-shadow:var(--dsw-shadow-lv3);border-radius:14px 0 0 14px;overflow:hidden}body .W-zNGW_panelResize{left:0}body .W-zNGW_bottomPanel{background:var(--dsw-alias-bg-base);border-top:1px solid var(--dsw-alias-border-l2)}[data-slot=\"conversation.session.header\"]>header{border-bottom:none!important;padding:12px 90px 12px 20px!important}[data-slot=\"conversation.session.header\"]>header:after{content:none}[class$=_tabs]{align-items:center;gap:8px;margin:0 0 0 8px;display:flex}[class$=_tabs] [class*=_tab]{border:1px solid var(--dsw-alias-border-l2,transparent);background:var(--dsw-alias-bg-layer-1);height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:14px;flex:none;justify-content:center;align-items:center;padding:0 14px;font-size:13px;line-height:20px;display:inline-flex}[class$=_tabs] [class*=_tab]:hover:not(:disabled):not([class*=_tabActive]){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}[class$=_tabs] [class*=_tabActive],[class$=_tabs] [class*=_tab][aria-selected=true]{background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-primary-inverted);border-color:#0000}[class$=_tabs] [class*=_tab]:after{content:none}body .W-zNGW_panel .W-zNGW_tab{border-right:none}body .W-zNGW_panel .W-zNGW_pane{background:var(--dsw-alias-bg-layer-1)}body .W-zNGW_panel .W-zNGW_paneContent,body .W-zNGW_panel .W-zNGW_paneTab,body .W-zNGW_panel .W-zNGW_explorer,body .W-zNGW_panel .W-zNGW_explorerBody{min-width:0;max-width:100%}body .W-zNGW_panel .W-zNGW_explorerBody{overflow-x:hidden}body .W-zNGW_panel .W-zNGW_explorerRow{max-width:100%}html #root{margin-right:0}html #root>div[data-slot=root]>div>div:nth-child(2){margin-bottom:0}[data-slot=conversation\\.session]>[class$=_viewArea]{margin-right:var(--dsh-sidebar-width,0px);transition:margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out)}div[class$=_composerSeat]{margin-right:var(--dsh-sidebar-width,0px);transition:margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out)}body.dsx-stats-active [data-conversation-scroll]:has([data-conversation-composer-overlay])>[class$=_composerSeat]{right:calc(var(--dsh-scrollbar-width,0px) + var(--dsx-rail-w,220px))}.enhancer-trigger-group{flex-direction:column;gap:0;width:100%;margin:0;padding:0;display:flex}.enhancer-trigger{width:100%;height:34px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xs-13);text-align:left;cursor:pointer;transition:background var(--ds-transition-duration-fast) var(--ds-ease-in-out), border-radius var(--ds-transition-duration-fast) var(--ds-ease-in-out);box-sizing:border-box;background:0 0;border:none;border-radius:0;align-items:center;gap:10px;margin:4px -4px;padding:6px 2px 6px 10px;display:flex}.enhancer-trigger:hover{background:var(--dsw-alias-interactive-bg-hover);border-radius:8px}.enhancer-trigger:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px;border-radius:8px}.enhancer-trigger-icon{width:16px;height:16px;color:var(--dsw-alias-label-secondary);flex:none}.enhancer-trigger-label{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.enhancer-trigger-label-hidden{clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.enhancer-overlay{z-index:20;backdrop-filter:blur(4px);pointer-events:auto;background:#0000003d;justify-content:center;align-items:center;display:flex;position:fixed;inset:0}.enhancer-panel{box-sizing:border-box;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);width:min(760px,100vw - 48px);height:min(560px,100vh - 64px);box-shadow:var(--dsw-shadow-lv3);border-radius:16px;display:flex;overflow:hidden}.enhancer-nav{box-sizing:border-box;border-right:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);flex:none;width:200px;padding:16px 8px;overflow-y:auto}.enhancer-navTitle{font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-secondary);padding:0 10px 12px;font-weight:600}.enhancer-navList{flex-direction:column;gap:2px;display:flex}.enhancer-navCell{width:100%;height:40px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14);text-align:left;cursor:pointer;transition:background var(--ds-transition-duration-fast) var(--ds-ease-in-out);box-sizing:border-box;background:0 0;border:none;border-radius:10px;align-items:center;gap:10px;padding:0 10px;display:flex}.enhancer-navCell:hover{background:var(--dsw-alias-interactive-bg-hover)}.enhancer-navCell-active{background:var(--dsw-alias-state-business-primary);color:#fff}.enhancer-navCell-active:hover{background:var(--dsw-alias-state-business-primary)}.enhancer-navIcon{flex:none;width:16px;height:16px}.enhancer-navLabel{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.enhancer-right{background:var(--dsw-alias-bg-layer-2);flex-direction:column;flex:1;min-width:0;display:flex}.enhancer-header{border-bottom:1px solid var(--dsw-alias-border-l2);flex:none;justify-content:space-between;align-items:flex-start;gap:16px;padding:16px 24px;display:flex}.enhancer-headingBox{flex-direction:column;flex:1;gap:4px;min-width:0;display:flex}.enhancer-title{color:var(--dsw-alias-label-primary);margin:0;font-size:18px;font-weight:600;line-height:26px}.enhancer-subtitle{font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary);margin:0}.enhancer-headerActions{flex:none;align-items:center;gap:8px;display:flex}.enhancer-close{width:28px;height:28px;color:var(--dsw-alias-label-tertiary);cursor:pointer;transition:background var(--ds-transition-duration-fast) var(--ds-ease-in-out);background:0 0;border:none;border-radius:8px;flex:none;justify-content:center;align-items:center;padding:0;display:flex}.enhancer-close:hover,.enhancer-close:focus-visible{background:var(--dsw-alias-interactive-bg-hover)}.enhancer-close:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}.enhancer-options{flex:1;min-height:0;padding:16px 24px 24px;overflow-y:auto}.enhancer-section{flex-direction:column;gap:4px;display:flex}.enhancer-row{border-bottom:1px solid var(--dsw-alias-border-l2);align-items:center;gap:8px;padding:16px 0;display:flex}.enhancer-rowIcon{width:16px;height:16px;color:var(--dsw-alias-label-secondary);flex:none}.enhancer-rowText{flex-direction:column;flex:1;gap:4px;min-width:0;padding-right:48px;display:flex}.enhancer-rowTitle{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);font-weight:500}.enhancer-rowDesc{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.enhancer-empty{font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary);padding:12px 0}.enhancer-hint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);padding-top:12px;line-height:18px}.enhancer-error{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);padding-top:8px}.enhancer-form{flex-direction:column;gap:8px;padding:12px 0;display:flex}.enhancer-form-bordered{border-bottom:1px solid var(--dsw-alias-border-l2)}.enhancer-fieldLabel{font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-secondary);font-weight:600}.enhancer-input,.enhancer-textarea{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-specific-input-major);width:100%;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xs-13);border-radius:10px;outline:none;padding:0 10px}.enhancer-input{height:36px}.enhancer-textarea{resize:vertical;min-height:72px;padding:8px 10px;font-family:inherit}.enhancer-input:focus,.enhancer-textarea:focus{border-color:var(--dsw-alias-state-business-primary)}.enhancer-chatInput{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-specific-input-major);width:100%;min-height:120px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14);resize:vertical;transition:border-color var(--ds-transition-duration-fast) var(--ds-ease-in-out);border-radius:24px;outline:none;padding:12px 16px;font-family:inherit;line-height:22px}.enhancer-chatInput:focus{border-color:var(--dsw-alias-state-business-primary)}.enhancer-chatInput::placeholder{color:var(--dsw-alias-label-tertiary)}.enhancer-scheduleModes{background:var(--dsw-alias-bg-layer-2);border-radius:9px;gap:2px;padding:3px;display:inline-flex}.enhancer-scheduleMode{height:28px;color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xs-13);cursor:pointer;transition:all var(--ds-transition-duration-fast) var(--ds-ease-in-out);background:0 0;border:none;border-radius:6px;padding:0 12px}.enhancer-scheduleMode:hover:not([data-active]){color:var(--dsw-alias-label-primary)}.enhancer-scheduleMode[data-active]{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);box-shadow:0 1px 2px #00000014}.enhancer-scheduleRow{flex-wrap:wrap;align-items:center;gap:8px;display:flex}.enhancer-scheduleInput{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-specific-input-major);height:36px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xs-13);border-radius:10px;outline:none;min-width:80px;padding:0 12px}.enhancer-scheduleInput:focus{border-color:var(--dsw-alias-state-business-primary)}.enhancer-scheduleLabel{font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-secondary);white-space:nowrap}.enhancer-taskList{flex-direction:column;display:flex}.enhancer-taskItem{border-bottom:1px solid var(--dsw-alias-border-l2);align-items:center;gap:12px;padding:12px 0;display:flex}.enhancer-taskItem:last-child{border-bottom:none}.enhancer-taskIcon{background:var(--dsw-alias-bg-module-platform);width:32px;height:32px;color:var(--dsw-alias-label-secondary);border-radius:8px;flex:none;justify-content:center;align-items:center;display:flex}.enhancer-taskInfo{flex:1;min-width:0}.enhancer-taskName{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.enhancer-taskMeta{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin-top:2px}.enhancer-taskActions{flex:none;align-items:center;gap:6px;display:flex}.enhancer-taskStatus{font:var(--dsw-font-xxs-12);border-radius:4px;padding:2px 8px}.enhancer-taskStatusRunning{color:#3b82f6;background:#3b82f61a}.enhancer-taskStatusPaused{color:#9ca3af;background:#9ca3af1a}.enhancer-taskStatusSuccess{color:#22c55e;background:#22c55e1a}.enhancer-taskStatusError{color:#ef4444;background:#ef44441a}.enhancer-pillBtn{background:var(--dsw-alias-bg-module-platform);height:36px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14);cursor:pointer;white-space:nowrap;transition:background var(--ds-transition-duration-fast) var(--ds-ease-in-out);border:none;border-radius:18px;justify-content:center;align-self:flex-start;align-items:center;gap:6px;padding:0 14px;display:inline-flex}.enhancer-pillBtn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.enhancer-pillBtn:disabled{opacity:.5;cursor:not-allowed}.enhancer-pillBtn:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}.enhancer-toggleOn,.enhancer-toggleOff{height:32px;font:var(--dsw-font-xs-13);cursor:pointer;white-space:nowrap;transition:background var(--ds-transition-duration-fast) var(--ds-ease-in-out);border:none;border-radius:16px;justify-content:center;align-items:center;padding:0 14px;display:inline-flex}.enhancer-toggleOn{background:var(--dsw-alias-state-business-primary);color:#fff}.enhancer-toggleOff{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary)}.enhancer-toggleOff:hover{background:var(--dsw-alias-interactive-bg-hover)}.enhancer-ghostBtn{height:28px;color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);cursor:pointer;white-space:nowrap;transition:background var(--ds-transition-duration-fast) var(--ds-ease-in-out);background:0 0;border:none;border-radius:8px;justify-content:center;align-items:center;padding:0 8px;display:inline-flex}.enhancer-ghostBtn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.enhancer-ghostBtn:disabled{opacity:.5;cursor:not-allowed}.enhancer-dangerBtn{height:28px;color:var(--dsw-alias-state-error-primary);font:var(--dsw-font-xxs-12);cursor:pointer;white-space:nowrap;transition:background var(--ds-transition-duration-fast) var(--ds-ease-in-out);background:0 0;border:none;border-radius:8px;justify-content:center;align-items:center;padding:0 8px;display:inline-flex}.enhancer-dangerBtn:hover{background:var(--dsw-alias-interactive-bg-hover)}.enhancer-task{border-bottom:1px solid var(--dsw-alias-border-l2)}.enhancer-taskDetail{flex-direction:column;gap:8px;padding:0 0 14px 24px;display:flex}.enhancer-taskPrompt{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xs-13);white-space:pre-wrap;border-radius:10px;padding:10px 12px;line-height:20px}.enhancer-history{flex-direction:column;gap:6px;padding-top:4px;display:flex}.enhancer-historyItem{font:var(--dsw-font-xxs-12);align-items:flex-start;gap:10px;line-height:18px;display:flex}.enhancer-historyTime{color:var(--dsw-alias-label-tertiary);flex:none;min-width:132px}.enhancer-historyOk{color:var(--dsw-alias-state-success-primary);flex:none}.enhancer-historyFail{color:var(--dsw-alias-state-error-primary);flex:none}.enhancer-historyNote{min-width:0;color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;flex:1;overflow:hidden}@media (prefers-reduced-motion:reduce){.enhancer-trigger,.enhancer-navCell,.enhancer-close,.enhancer-pillBtn,.enhancer-toggleOn,.enhancer-toggleOff,.enhancer-ghostBtn,.enhancer-dangerBtn{transition:none!important}}";
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
			fontId: "default"
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
		}
		//#endregion
		//#region src/client/mcp-auto.ts
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
		/** Icon paths (reused from ui-primitives gear/clock glyphs). */
		const PLUG_PATH = "M11 1.5a.6.6 0 0 1 1.2 0V5h.8a.5.5 0 0 1 .5.5v5a3 3 0 0 1-3 3h2.5v1H3v-1h2.5a3 3 0 0 1-3-3v-5A.5.5 0 0 1 3 5h.8V1.5a.6.6 0 0 1 1.2 0V5h5V1.5Z";
		const CLOCK_PATH = "M8 0.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 1.6a5.9 5.9 0 1 1 0 11.8 5.9 5.9 0 0 1 0-11.8ZM8 3a.8.8 0 0 1 .8.8v3.7l2.4 1.4a.8.8 0 0 1-.8 1.4L7.2 8.5V3.8A.8.8 0 0 1 8 3Z";
		const CLOSE_PATH = "M14.1168 13.197L13.197 14.1167L1.8833 2.80303L2.80309 1.88324L14.1168 13.197ZM13.197 1.88326L14.1168 2.80305L2.80309 14.1168L1.8833 13.197L13.197 1.88326Z";
		function Icon({ d, size = 16, className }) {
			return react.createElement("svg", {
				width: size,
				height: size,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": true,
				className
			}, react.createElement("path", {
				d,
				fill: "currentColor"
			}));
		}
		/** Minimal client↔host JSON call (same-origin route). */
		async function api(request) {
			const response = await fetch("/enhancer/enhancer-api", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(request)
			});
			const text = await response.text();
			let data = {};
			try {
				data = JSON.parse(text);
			} catch {}
			if (!response.ok || data.ok !== true) {
				const prefix = response.status === 405 ? "后端路由未就绪，请重启 dsh web 后重试。" : "";
				throw new Error(prefix + (data.error || `HTTP ${response.status}`));
			}
			return data;
		}
		const state = {
			mcpOpen: false,
			autoOpen: false
		};
		const listeners = /* @__PURE__ */ new Set();
		function notify() {
			for (const l of listeners) l();
		}
		function useDialogState() {
			const [, force] = react.useReducer((c) => c + 1, 0);
			react.useEffect(() => {
				listeners.add(force);
				return () => {
					listeners.delete(force);
				};
			}, []);
			const patch = (p) => {
				Object.assign(state, p);
				notify();
			};
			return [state, patch];
		}
		const RAIL_COLLAPSE_WIDTH = 80;
		function useCollapsed(ref) {
			const [collapsed, setCollapsed] = react.useState(false);
			react.useEffect(() => {
				const el = ref.current;
				if (!el) return;
				const ro = new ResizeObserver((entries) => {
					const width = entries[0]?.contentRect.width ?? el.clientWidth;
					setCollapsed(width < RAIL_COLLAPSE_WIDTH);
				});
				ro.observe(el);
				return () => ro.disconnect();
			}, [ref]);
			return collapsed;
		}
		/** One Settings-trigger-style foot button. */
		function TriggerButton({ kind, label, onClick }) {
			const ref = react.useRef(null);
			const collapsed = useCollapsed(ref);
			return react.createElement("button", {
				ref,
				type: "button",
				className: "enhancer-trigger",
				title: label,
				"aria-label": label,
				onClick
			}, [react.createElement(Icon, {
				key: "i",
				d: kind === "mcp" ? PLUG_PATH : CLOCK_PATH,
				size: 16,
				className: "enhancer-trigger-icon"
			}), react.createElement("span", {
				key: "l",
				className: collapsed ? "enhancer-trigger-label enhancer-trigger-label-hidden" : "enhancer-trigger-label"
			}, label)]);
		}
		/**
		* Two trigger buttons stacked vertically, wrapped in a transparent container
		* (zero padding) that goes inside one sidebar.footer.action slot entry.
		* The wrapper does NOT add any spacing — the shell controls the gap between
		* this entry and the settings trigger, while the gap between MCP and 自动化
		* is our own controlled value.
		*/
		function AutoLauncher() {
			const [, patch] = useDialogState();
			return react.createElement("div", { className: "enhancer-trigger-group" }, [react.createElement(TriggerButton, {
				key: "mcp",
				kind: "mcp",
				label: "MCP",
				onClick: () => patch({ mcpOpen: true })
			}), react.createElement(TriggerButton, {
				key: "auto",
				kind: "auto",
				label: "自动化",
				onClick: () => patch({ autoOpen: true })
			})]);
		}
		function useEscClose(open, onClose) {
			react.useEffect(() => {
				if (!open) return;
				const priorOverflow = document.body.style.overflow;
				document.body.style.overflow = "hidden";
				const onKey = (e) => {
					if (e.key === "Escape") onClose();
				};
				window.addEventListener("keydown", onKey);
				return () => {
					document.body.style.overflow = priorOverflow;
					window.removeEventListener("keydown", onKey);
				};
			}, [open, onClose]);
		}
		function SettingsDialog({ navTitle, navCells, title, subtitle, action, onClose, children }) {
			return react.createElement("div", {
				className: "enhancer-overlay",
				onClick: onClose
			}, [react.createElement("div", {
				key: "panel",
				className: "enhancer-panel",
				role: "dialog",
				"aria-modal": true,
				"aria-label": title,
				onClick: (e) => e.stopPropagation()
			}, [react.createElement("nav", {
				key: "nav",
				className: "enhancer-nav"
			}, [react.createElement("div", {
				key: "nt",
				className: "enhancer-navTitle"
			}, navTitle), react.createElement("div", {
				key: "nl",
				className: "enhancer-navList"
			}, navCells.map((cell) => react.createElement("button", {
				key: cell.id,
				type: "button",
				className: cell.active ? "enhancer-navCell enhancer-navCell-active" : "enhancer-navCell",
				"aria-current": cell.active ? "true" : void 0
			}, [react.createElement(Icon, {
				key: "i",
				d: cell.icon,
				size: 16,
				className: "enhancer-navIcon"
			}), react.createElement("span", {
				key: "l",
				className: "enhancer-navLabel"
			}, cell.label)])))]), react.createElement("div", {
				key: "right",
				className: "enhancer-right"
			}, [react.createElement("div", {
				key: "header",
				className: "enhancer-header"
			}, [
				react.createElement("div", {
					key: "hb",
					className: "enhancer-headingBox"
				}, [react.createElement("h2", {
					key: "h",
					className: "enhancer-title"
				}, title), react.createElement("p", {
					key: "s",
					className: "enhancer-subtitle"
				}, subtitle)]),
				react.createElement("div", {
					key: "actions",
					className: "enhancer-headerActions"
				}, action),
				react.createElement("button", {
					key: "close",
					type: "button",
					className: "enhancer-close",
					"aria-label": "关闭",
					onClick: onClose
				}, react.createElement(Icon, {
					d: CLOSE_PATH,
					size: 14
				}))
			]), react.createElement("div", {
				key: "options",
				className: "enhancer-options"
			}, children)])])]);
		}
		const inputClass = "enhancer-input";
		const pillBtnClass = "enhancer-pillBtn";
		const dangerBtnClass = "enhancer-dangerBtn";
		const ghostBtnClass = "enhancer-ghostBtn";
		const toggleOnClass = "enhancer-toggleOn";
		const toggleOffClass = "enhancer-toggleOff";
		function McpPanel() {
			const [servers, setServers] = react.useState([]);
			const [busy, setBusy] = react.useState(false);
			const [err, setErr] = react.useState("");
			const [name, setName] = react.useState("");
			const [command, setCommand] = react.useState("");
			const refresh = async () => {
				try {
					const r = await api({ kind: "mcp/list" });
					setServers(Array.isArray(r.servers) ? r.servers : []);
					setErr("");
				} catch (e) {
					setErr(String(e instanceof Error ? e.message : e));
				}
			};
			react.useEffect(() => {
				refresh();
			}, []);
			const add = async () => {
				if (!name.trim() || !command.trim()) return;
				setBusy(true);
				try {
					await api({
						kind: "mcp/apply",
						op: "add",
						serverName: name.trim(),
						server: {
							serverName: name.trim(),
							transport: "stdio",
							command: command.trim()
						}
					});
					setName("");
					setCommand("");
					await refresh();
				} catch (e) {
					setErr(String(e instanceof Error ? e.message : e));
				} finally {
					setBusy(false);
				}
			};
			const remove = async (serverName) => {
				try {
					await api({
						kind: "mcp/apply",
						op: "remove",
						serverName
					});
					await refresh();
				} catch (e) {
					setErr(String(e instanceof Error ? e.message : e));
				}
			};
			return react.createElement("div", { className: "enhancer-section" }, [
				servers.length === 0 ? react.createElement("div", {
					key: "empty",
					className: "enhancer-empty"
				}, "尚未配置 MCP 服务器。") : servers.map((s) => react.createElement("div", {
					key: String(s.serverName),
					className: "enhancer-row"
				}, [
					react.createElement(Icon, {
						key: "i",
						d: PLUG_PATH,
						size: 16,
						className: "enhancer-rowIcon"
					}),
					react.createElement("div", {
						key: "text",
						className: "enhancer-rowText"
					}, [react.createElement("div", {
						key: "t",
						className: "enhancer-rowTitle"
					}, String(s.serverName)), react.createElement("div", {
						key: "d",
						className: "enhancer-rowDesc"
					}, String(s.command || s.url || s.transport))]),
					react.createElement("button", {
						key: "rm",
						type: "button",
						className: dangerBtnClass,
						onClick: () => void remove(String(s.serverName))
					}, "移除")
				])),
				react.createElement("div", {
					key: "form",
					className: "enhancer-form"
				}, [
					react.createElement("input", {
						key: "name",
						className: inputClass,
						placeholder: "服务器名 (serverName)",
						value: name,
						onChange: (e) => setName(e.target.value)
					}),
					react.createElement("input", {
						key: "cmd",
						className: inputClass,
						placeholder: "启动命令 (stdio, 如 npx -y …)",
						value: command,
						onChange: (e) => setCommand(e.target.value)
					}),
					react.createElement("button", {
						key: "add",
						type: "button",
						className: pillBtnClass,
						disabled: busy || !name.trim() || !command.trim(),
						onClick: () => void add()
					}, busy ? "添加中…" : "添加 MCP 服务器")
				]),
				err !== "" ? react.createElement("div", {
					key: "err",
					className: "enhancer-error"
				}, err) : null
			]);
		}
		function McpDialog() {
			const [s, patch] = useDialogState();
			const close = () => patch({ mcpOpen: false });
			useEscClose(s.mcpOpen, close);
			if (!s.mcpOpen) return null;
			return react.createElement(SettingsDialog, {
				navTitle: "MCP",
				navCells: [{
					id: "mcp",
					label: "MCP 服务器",
					icon: PLUG_PATH,
					active: true
				}],
				title: "MCP 服务器",
				subtitle: "管理 dsh-mcp-client 服务器条目，写入 profiles/web/cordis.patch.yml，实时生效。",
				onClose: close
			}, react.createElement(McpPanel));
		}
		function formatTime(ts) {
			return ts === void 0 ? "—" : new Date(ts).toLocaleString();
		}
		function formatFrequency(mode, value, time) {
			if (mode === "once") return "单次";
			if (mode === "interval") {
				if (value < 60) return `每 ${value} 分钟`;
				const hours = Math.floor(value / 60);
				const mins = value % 60;
				return mins > 0 ? `每 ${hours} 小时 ${mins} 分钟` : `每 ${hours} 小时`;
			}
			const t = time || "00:00";
			if (value === 0) return `每天 ${t}`;
			if (value >= 1 && value <= 7) return `每周${[
				"周一",
				"周二",
				"周三",
				"周四",
				"周五",
				"周六",
				"周日"
			][value - 1]} ${t}`;
			if (value >= 8 && value <= 31) return `每月${value - 7}日 ${t}`;
			return `每天 ${t}`;
		}
		function TaskItem({ task, onChanged }) {
			const [expanded, setExpanded] = react.useState(false);
			const [err, setErr] = react.useState("");
			const [running, setRunning] = react.useState(false);
			const toggle = async () => {
				try {
					await api({
						kind: "tasks/toggle",
						id: task.id
					});
					onChanged();
				} catch (e) {
					setErr(String(e instanceof Error ? e.message : e));
				}
			};
			const runNow = async () => {
				setRunning(true);
				try {
					await api({
						kind: "tasks/run-now",
						id: task.id
					});
					onChanged();
				} catch (e) {
					setErr(String(e instanceof Error ? e.message : e));
				} finally {
					setRunning(false);
				}
			};
			const remove = async () => {
				try {
					await api({
						kind: "tasks/delete",
						id: task.id
					});
					onChanged();
				} catch (e) {
					setErr(String(e instanceof Error ? e.message : e));
				}
			};
			const history = Array.isArray(task.history) ? task.history : [];
			const lastRun = history.length > 0 ? history[history.length - 1] : null;
			const statusClass = !task.enabled ? "enhancer-taskStatusPaused" : lastRun?.ok === true ? "enhancer-taskStatusSuccess" : lastRun?.ok === false ? "enhancer-taskStatusError" : "enhancer-taskStatusRunning";
			const statusText = !task.enabled ? "已暂停" : lastRun?.ok === true ? "上次成功" : lastRun?.ok === false ? "上次失败" : "运行中";
			return react.createElement("div", { className: "enhancer-taskItem" }, [
				react.createElement("div", {
					key: "icon",
					className: "enhancer-taskIcon"
				}, react.createElement(Icon, {
					d: CLOCK_PATH,
					size: 16
				})),
				react.createElement("div", {
					key: "info",
					className: "enhancer-taskInfo",
					style: { cursor: "pointer" },
					onClick: () => setExpanded((v) => !v)
				}, [react.createElement("div", {
					key: "name",
					className: "enhancer-taskName"
				}, task.name), react.createElement("div", {
					key: "meta",
					className: "enhancer-taskMeta"
				}, `${task.workspace || "默认工作区"} · ${formatFrequency("interval", task.frequencyMinutes)}${task.nextAt ? ` · 下次 ${formatTime(task.nextAt)}` : ""}`)]),
				react.createElement("div", {
					key: "actions",
					className: "enhancer-taskActions"
				}, [
					react.createElement("span", {
						key: "status",
						className: `enhancer-taskStatus ${statusClass}`
					}, statusText),
					react.createElement("button", {
						key: "toggle",
						type: "button",
						className: task.enabled ? toggleOnClass : toggleOffClass,
						onClick: () => void toggle()
					}, task.enabled ? "启用" : "暂停"),
					react.createElement("button", {
						key: "run",
						type: "button",
						className: ghostBtnClass,
						disabled: running,
						onClick: () => void runNow()
					}, running ? "…" : "▶"),
					react.createElement("button", {
						key: "del",
						type: "button",
						className: dangerBtnClass,
						onClick: () => void remove()
					}, "…")
				]),
				expanded ? react.createElement("div", {
					key: "detail",
					style: {
						gridColumn: "1 / -1",
						padding: "8px 0 0 44px"
					}
				}, [
					react.createElement("div", {
						key: "prompt",
						className: "enhancer-taskPrompt"
					}, task.prompt),
					history.length > 0 ? react.createElement("div", {
						key: "hist",
						className: "enhancer-history"
					}, history.slice(-3).reverse().map((h, idx) => react.createElement("div", {
						key: `${h.at}-${idx}`,
						className: "enhancer-historyItem"
					}, [
						react.createElement("span", {
							key: "t",
							className: "enhancer-historyTime"
						}, formatTime(h.at)),
						react.createElement("span", {
							key: "o",
							className: h.ok ? "enhancer-historyOk" : "enhancer-historyFail"
						}, h.ok ? "✓" : "✗"),
						react.createElement("span", {
							key: "n",
							className: "enhancer-historyNote"
						}, String(h.note ?? ""))
					]))) : null,
					err !== "" ? react.createElement("div", {
						key: "err",
						className: "enhancer-error"
					}, err) : null
				]) : null
			]);
		}
		function CreateTaskForm({ onCreated }) {
			const [creating, setCreating] = react.useState(false);
			const [err, setErr] = react.useState("");
			const [name, setName] = react.useState("");
			const [workspace, setWorkspace] = react.useState("");
			const [prompt, setPrompt] = react.useState("");
			const [scheduleMode, setScheduleMode] = react.useState("periodic");
			const [intervalValue, setIntervalValue] = react.useState("60");
			const [periodicDay, setPeriodicDay] = react.useState("0");
			const [periodicTime, setPeriodicTime] = react.useState("09:00");
			const [onceDateTime, setOnceDateTime] = react.useState("");
			return react.createElement("div", { className: "enhancer-section" }, [
				react.createElement("label", {
					key: "l1",
					className: "enhancer-fieldLabel"
				}, "名称"),
				react.createElement("input", {
					key: "f1",
					className: inputClass,
					placeholder: "任务名称",
					value: name,
					onChange: (e) => setName(e.target.value)
				}),
				react.createElement("label", {
					key: "l2",
					className: "enhancer-fieldLabel"
				}, "工作空间 (可选)"),
				react.createElement("input", {
					key: "f2",
					className: inputClass,
					placeholder: "留空使用当前工作区",
					value: workspace,
					onChange: (e) => setWorkspace(e.target.value)
				}),
				react.createElement("label", {
					key: "l3",
					className: "enhancer-fieldLabel"
				}, "提示词"),
				react.createElement("textarea", {
					key: "f3",
					className: "enhancer-chatInput",
					placeholder: "给智能体发消息",
					rows: 5,
					value: prompt,
					onChange: (e) => setPrompt(e.target.value)
				}),
				react.createElement("label", {
					key: "l4",
					className: "enhancer-fieldLabel"
				}, "执行频率"),
				react.createElement("div", {
					key: "schedule",
					className: "enhancer-scheduleModes"
				}, [
					react.createElement("button", {
						key: "periodic",
						type: "button",
						className: "enhancer-scheduleMode",
						"data-active": scheduleMode === "periodic" ? "" : void 0,
						onClick: () => setScheduleMode("periodic")
					}, "周期"),
					react.createElement("button", {
						key: "interval",
						type: "button",
						className: "enhancer-scheduleMode",
						"data-active": scheduleMode === "interval" ? "" : void 0,
						onClick: () => setScheduleMode("interval")
					}, "按间隔"),
					react.createElement("button", {
						key: "once",
						type: "button",
						className: "enhancer-scheduleMode",
						"data-active": scheduleMode === "once" ? "" : void 0,
						onClick: () => setScheduleMode("once")
					}, "单次")
				]),
				scheduleMode === "periodic" ? react.createElement("div", {
					key: "periodic",
					className: "enhancer-scheduleRow",
					style: { marginTop: 8 }
				}, [react.createElement("select", {
					key: "day",
					className: "enhancer-scheduleInput",
					value: periodicDay,
					onChange: (e) => setPeriodicDay(e.target.value),
					style: { width: 120 }
				}, [
					react.createElement("option", {
						key: "0",
						value: "0"
					}, "每天"),
					react.createElement("option", {
						key: "1",
						value: "1"
					}, "每周一"),
					react.createElement("option", {
						key: "2",
						value: "2"
					}, "每周二"),
					react.createElement("option", {
						key: "3",
						value: "3"
					}, "每周三"),
					react.createElement("option", {
						key: "4",
						value: "4"
					}, "每周四"),
					react.createElement("option", {
						key: "5",
						value: "5"
					}, "每周五"),
					react.createElement("option", {
						key: "6",
						value: "6"
					}, "每周六"),
					react.createElement("option", {
						key: "7",
						value: "7"
					}, "每周日"),
					react.createElement("option", {
						key: "8",
						value: "8"
					}, "每月1日"),
					react.createElement("option", {
						key: "15",
						value: "15"
					}, "每月15日")
				]), react.createElement("input", {
					key: "time",
					type: "time",
					className: "enhancer-scheduleInput",
					value: periodicTime,
					onChange: (e) => setPeriodicTime(e.target.value)
				})]) : scheduleMode === "interval" ? react.createElement("div", {
					key: "interval",
					className: "enhancer-scheduleRow",
					style: { marginTop: 8 }
				}, [
					react.createElement("span", {
						key: "label",
						className: "enhancer-scheduleLabel"
					}, "每"),
					react.createElement("input", {
						key: "val",
						type: "number",
						className: "enhancer-scheduleInput",
						min: 1,
						value: intervalValue,
						onChange: (e) => setIntervalValue(e.target.value),
						style: { width: 80 }
					}),
					react.createElement("span", {
						key: "unit",
						className: "enhancer-scheduleLabel"
					}, "分钟")
				]) : react.createElement("div", {
					key: "once",
					className: "enhancer-scheduleRow",
					style: { marginTop: 8 }
				}, [
					react.createElement("span", {
						key: "label",
						className: "enhancer-scheduleLabel"
					}, "在"),
					react.createElement("input", {
						key: "datetime",
						type: "datetime-local",
						className: "enhancer-scheduleInput",
						value: onceDateTime,
						onChange: (e) => setOnceDateTime(e.target.value),
						min: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16)
					}),
					react.createElement("span", {
						key: "unit",
						className: "enhancer-scheduleLabel"
					}, "执行一次")
				]),
				react.createElement("div", {
					key: "dateHint",
					style: {
						marginTop: 12,
						font: "var(--dsw-font-xxs-12)",
						color: "var(--dsw-alias-label-tertiary)"
					}
				}, "生效日期区间 (可选，留空表示始终生效)"),
				err !== "" ? react.createElement("div", {
					key: "err",
					className: "enhancer-error"
				}, err) : null
			]);
		}
		function AutoPanel() {
			const [tasks, setTasks] = react.useState([]);
			const [err, setErr] = react.useState("");
			const [showForm, setShowForm] = react.useState(false);
			const refresh = async () => {
				try {
					const r = await api({ kind: "tasks/list" });
					setTasks(Array.isArray(r.tasks) ? r.tasks : []);
					setErr("");
				} catch (e) {
					setErr(String(e instanceof Error ? e.message : e));
				}
			};
			react.useEffect(() => {
				refresh();
			}, []);
			const handleCreated = () => {
				setShowForm(false);
				refresh();
			};
			const toggleForm = () => setShowForm((v) => !v);
			return react.createElement("div", { className: "enhancer-section" }, [
				react.createElement("div", {
					key: "tabs",
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 16
					}
				}, [react.createElement("div", {
					key: "tabGroup",
					style: {
						display: "flex",
						gap: 8
					}
				}, [react.createElement("button", {
					key: "tasks",
					type: "button",
					style: {
						padding: "6px 12px",
						borderRadius: 8,
						border: "1px solid var(--dsw-alias-border-l2)",
						background: "var(--dsw-alias-bg-base)",
						font: "var(--dsw-font-xs-13)",
						cursor: "pointer"
					}
				}, `定时任务 (${tasks.length})`), react.createElement("button", {
					key: "history",
					type: "button",
					style: {
						padding: "6px 12px",
						borderRadius: 8,
						border: "1px solid var(--dsw-alias-border-l2)",
						background: "transparent",
						font: "var(--dsw-font-xs-13)",
						color: "var(--dsw-alias-label-secondary)",
						cursor: "pointer"
					}
				}, "运行记录")]), react.createElement("button", {
					key: "add",
					type: "button",
					className: showForm ? ghostBtnClass : pillBtnClass,
					onClick: toggleForm
				}, showForm ? "取消" : "+ 添加自动化")]),
				showForm ? react.createElement(CreateTaskForm, {
					key: "form",
					onCreated: handleCreated
				}) : tasks.length === 0 ? react.createElement("div", {
					key: "empty",
					style: {
						padding: "40px 0",
						textAlign: "center",
						color: "var(--dsw-alias-label-tertiary)",
						font: "var(--dsw-font-xs-13)"
					}
				}, "还没有定时任务。点击「+ 添加自动化」创建一个。") : react.createElement("div", {
					key: "list",
					className: "enhancer-taskList"
				}, tasks.map((t) => react.createElement(TaskItem, {
					key: t.id,
					task: t,
					onChanged: () => void refresh()
				}))),
				err !== "" ? react.createElement("div", {
					key: "err",
					className: "enhancer-error"
				}, err) : null
			]);
		}
		function AutoDialog() {
			const [s, patch] = useDialogState();
			const close = () => patch({ autoOpen: false });
			useEscClose(s.autoOpen, close);
			if (!s.autoOpen) return null;
			return react.createElement(SettingsDialog, {
				navTitle: "自动化",
				navCells: [{
					id: "auto",
					label: "定时任务",
					icon: CLOCK_PATH,
					active: true
				}],
				title: "定时任务",
				subtitle: "定期在工作区新建会话并发送预设提示词，查看运行历史。",
				onClose: close
			}, react.createElement(AutoPanel));
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
					const panel = document.querySelector(".W-zNGW_panel");
					const bottom = document.querySelector(".W-zNGW_bottomPanel");
					const buttons = document.querySelectorAll(".W-zNGW_toggleButton");
					if (!panel || !bottom || buttons.length < 2) return;
					const panelOpen = !panel.classList.contains("W-zNGW_panelHidden");
					const bottomOpen = !bottom.classList.contains("W-zNGW_bottomPanelHidden");
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
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "enhancer-triggers",
				order: 20
			}, () => react.createElement(AutoLauncher)));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "enhancer-mcp-dlg",
				order: 0
			}, () => react.createElement(McpDialog)));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "enhancer-auto-dlg",
				order: 1
			}, () => react.createElement(AutoDialog)));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map