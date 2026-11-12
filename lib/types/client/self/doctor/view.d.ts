/**
 * Harmony Doctor — the settings page.
 *
 * Layer: self (this plugin's own page inside `settings.section`). It runs the
 * audit engine on demand and renders the result inline, with a Markdown export
 * for a README table or an upstream issue. It is intentionally boring: no
 * network, no model calls, no write path beyond the ledger key that makes
 * cross-view verdicts possible (`./view-context.ts`).
 */
import * as React from 'react';
import type { HarmonyService } from '../../core/harmony/contract.ts';
/** Props handed to the page by the slot registration. */
export interface DoctorViewProps {
    service: HarmonyService;
}
/**
 * The audit page: a run/export/reset bar over the last report.
 * @param props.service - the harmony service the engine audits against.
 * @returns the page element.
 */
export declare function DoctorView({ service }: DoctorViewProps): React.ReactElement;
