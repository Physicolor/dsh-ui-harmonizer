/**
 * Harmony Doctor — the settings page.
 *
 * Layer: self (this plugin's own page inside `settings.section`). It runs the
 * audit engine on demand and renders the result inline, with a Markdown export
 * for a README table or an upstream issue. It is intentionally boring: no
 * network, no model calls, no write path beyond the ledger key that makes
 * cross-view verdicts possible (`./view-context.ts`).
 */

import * as React from 'react'
import { reportToMarkdown, resetLedger, runDoctor, type DoctorReport } from './engine.ts'
import type { HarmonyService } from '../../core/harmony/contract.ts'
import { SettingsPageHeader } from '../../harness/settings-header/recipe.tsx'
import { currentView } from './view-context.ts'
import { Stat, RowList } from './parts.tsx'
import {
  getDoctorTitle, getDoctorDesc, getDoctorRunLabel, getDoctorExportLabel,
  getDoctorResetLabel, getDoctorRulesLabel, getDoctorCouplingsLabel,
  getDoctorConflictsLabel, getDoctorSurfacesLabel, getDoctorMaterialLabel,
  getDoctorDeadEveryViewLabel, getDoctorDeadInEveryObservedView,
  getDoctorViewsObservedLabel, getDoctorZeroMatchesEveryView,
  getDoctorMatchCount, getDoctorGlassLabel, getDoctorSolidLabel,
} from '../../core/i18n.ts'

/** Props handed to the page by the slot registration. */
export interface DoctorViewProps {
  service: HarmonyService
}

/**
 * The audit page: a run/export/reset bar over the last report.
 * @param props.service - the harmony service the engine audits against.
 * @returns the page element.
 */
export function DoctorView({ service }: DoctorViewProps): React.ReactElement {
  const [report, setReport] = React.useState<DoctorReport | null>(null)

  const run = (): void => {
    // `runDoctor` returns synchronously, so there is no in-flight state to
    // render: no busy flag, no disabled button, no interim label.
    setReport(runDoctor({ view: currentView(), service }))
  }

  const exportMd = (): void => {
    if (report === null) return
    const text = reportToMarkdown(report)
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `harmony-doctor-${report.view}-${Date.now()}.md`
    // Firefox/Safari only act on a synthetic click while the anchor is in the
    // document, and revoking the object URL in the same task can truncate the
    // download to 0 bytes — so append first, clean up on the next frame.
    document.body.append(anchor)
    anchor.click()
    requestAnimationFrame(() => {
      anchor.remove()
      URL.revokeObjectURL(url)
    })
  }

  const reset = (): void => {
    resetLedger()
    setReport(null)
  }

  // Row and cell truncation live in `parts.tsx` (the list layer) only — no
  // slicing here. This file used to cut the conflict cells at 40 chars while
  // building the rows, which clipped them silently (no marker, and the list's
  // truncation note only ever described the row cap).
  const deadRows = (report?.rules.deadInEveryView ?? []).map(r => ({ left: r.selector, right: getDoctorZeroMatchesEveryView(), tone: 'warn' as const }))
  const couplingRows = (report?.couplings ?? []).map(c => ({ left: c.selector, right: `${c.plugin} · ${getDoctorMatchCount(c.matches)}`, tone: (c.matches === 0 ? 'warn' : undefined) as 'warn' | undefined }))
  const conflictRows = (report?.conflicts ?? []).map(c => ({ left: `${c.property} @ ${c.target}`, right: `${c.verdict} · ours=${c.ours} winner=${c.winner}`, tone: (c.verdict === 'redundant' ? 'warn' : undefined) as 'warn' | undefined }))
  const surfaceRows = (report?.surfaces ?? []).map(s => ({ left: s.name, right: `${s.kind}${s.detail === '' ? '' : ` · ${s.detail}`}${s.count > 1 ? ` · ${s.count}x` : ''}` }))

  return React.createElement('div', { className: 'enhc-doctor' }, [
    React.createElement(SettingsPageHeader, { key: 'head', title: getDoctorTitle(), intro: getDoctorDesc() }),
    React.createElement('div', { key: 'bar', className: 'enhc-doctor-bar' }, [
      React.createElement('button', { key: 'run', type: 'button', className: 'enhc-doctor-btn', onClick: run }, getDoctorRunLabel()),
      React.createElement('button', { key: 'exp', type: 'button', className: 'enhc-doctor-btn', onClick: exportMd, disabled: report === null }, getDoctorExportLabel()),
      React.createElement('button', { key: 'rst', type: 'button', className: 'enhc-doctor-btn enhc-doctor-btn-quiet', onClick: reset }, getDoctorResetLabel()),
    ]),
    report === null
      ? React.createElement('p', { key: 'idle', className: 'enhc-doctor-empty' }, '—')
      : React.createElement('div', { key: 'body' }, [
        React.createElement('div', { key: 'stats', className: 'enhc-doctor-stats' }, [
          React.createElement(Stat, { key: 'a', label: getDoctorRulesLabel(), value: `${report.rules.matchedInThisView}/${report.rules.totalSelectors}` }),
          React.createElement(Stat, { key: 'b', label: getDoctorDeadEveryViewLabel(), value: String(report.rules.deadInEveryView.length), tone: report.rules.deadInEveryView.length > 0 ? 'warn' : undefined }),
          React.createElement(Stat, { key: 'c', label: getDoctorViewsObservedLabel(), value: String(report.rules.viewsSeen.length) }),
          React.createElement(Stat, { key: 'd', label: getDoctorCouplingsLabel(), value: String(report.couplings.length) }),
          React.createElement(Stat, { key: 'e', label: getDoctorMaterialLabel(), value: report.material.glassAware ? getDoctorGlassLabel() : getDoctorSolidLabel() }),
        ]),
        React.createElement(RowList, { key: 'rules', title: `${getDoctorRulesLabel()} — ${getDoctorDeadInEveryObservedView()}`, rows: deadRows, empty: '—' }),
        React.createElement(RowList, { key: 'couplings', title: getDoctorCouplingsLabel(), rows: couplingRows, empty: '—' }),
        React.createElement(RowList, { key: 'conflicts', title: getDoctorConflictsLabel(), rows: conflictRows, empty: '—' }),
        React.createElement(RowList, { key: 'surfaces', title: getDoctorSurfacesLabel(), rows: surfaceRows, empty: '—' }),
      ]),
  ])
}
