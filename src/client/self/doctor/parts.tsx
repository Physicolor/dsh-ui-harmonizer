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

import * as React from 'react'
import { getDoctorTruncatedNote, getDoctorTruncatedCellsNote } from '../../core/i18n.ts'

/** The one and only row cap; callers must not slice as well. */
const ROW_CAP = 60

/** The one and only character cap for a cell; callers must not slice as well. */
const CELL_CAP = 40

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
function clipCell(text: string): string {
  return text.length > CELL_CAP ? `${text.slice(0, CELL_CAP)}…` : text
}

/**
 * Small stat block: the value above its label.
 * @param props.label - what the number counts.
 * @param props.value - the rendered number.
 * @param props.tone - `warn` paints the value in the warning colour.
 * @returns the stat element.
 */
export function Stat({ label, value, tone }: { label: string, value: string, tone?: 'warn' | 'ok' }): React.ReactElement {
  return React.createElement('div', { className: 'enhc-doctor-stat' }, [
    React.createElement('div', { key: 'v', className: tone === 'warn' ? 'enhc-doctor-stat-v enhc-warn' : 'enhc-doctor-stat-v', }, value),
    React.createElement('div', { key: 'l', className: 'enhc-doctor-stat-l' }, label),
  ])
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
export function RowList({ title, rows, empty }: { title: string, rows: Array<{ left: string, right: string, tone?: 'warn' }>, empty: string }): React.ReactElement {
  const truncated = rows.length > ROW_CAP
  const shown = truncated ? rows.slice(0, ROW_CAP) : rows
  const clippedCells = shown.some(row => row.left.length > CELL_CAP || row.right.length > CELL_CAP)
  return React.createElement('div', { className: 'enhc-doctor-block' }, [
    React.createElement('h3', { key: 'h', className: 'enhc-doctor-h3' }, title),
    rows.length === 0
      ? React.createElement('p', { key: 'e', className: 'enhc-doctor-empty' }, empty)
      : React.createElement('div', { key: 'l', className: 'enhc-doctor-rows' },
        shown.map((row, i) => React.createElement('div', { key: `${i}-${row.left}`, className: 'enhc-doctor-row' }, [
          React.createElement('code', { key: 'l', className: 'enhc-doctor-code' }, clipCell(row.left)),
          React.createElement('span', { key: 'r', className: row.tone === 'warn' ? 'enhc-doctor-right enhc-warn' : 'enhc-doctor-right' }, clipCell(row.right)),
        ]))),
    truncated
      ? React.createElement('p', { key: 't', className: 'enhc-doctor-empty' }, getDoctorTruncatedNote(ROW_CAP, rows.length))
      : null,
    clippedCells
      ? React.createElement('p', { key: 'c', className: 'enhc-doctor-empty' }, getDoctorTruncatedCellsNote(CELL_CAP))
      : null,
  ])
}
