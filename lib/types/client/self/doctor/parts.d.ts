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
import * as React from 'react';
/**
 * Small stat block: the value above its label.
 * @param props.label - what the number counts.
 * @param props.value - the rendered number.
 * @param props.tone - `warn` paints the value in the warning colour.
 * @returns the stat element.
 */
export declare function Stat({ label, value, tone }: {
    label: string;
    value: string;
    tone?: 'warn' | 'ok';
}): React.ReactElement;
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
export declare function RowList({ title, rows, empty }: {
    title: string;
    rows: Array<{
        left: string;
        right: string;
        tone?: 'warn';
    }>;
    empty: string;
}): React.ReactElement;
