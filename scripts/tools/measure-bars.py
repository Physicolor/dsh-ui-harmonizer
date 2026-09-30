"""Measure the top-bar band and the divider line in reference screenshots.

Reads the DSH header crop and the Codex reference crops, reports for each:
  - image size,
  - the dark-text band (rows containing dark pixels) -> glyph height + centre,
  - rows that are a near-uniform horizontal line (the divider),
  - the bar height implied by the divider.

Usage: python scripts/measure-bars.py <img> [<img> ...]
"""
import sys
from PIL import Image
import numpy as np

A = 'D:/dsh-home/attachments/v1/objects/'

def analyse(path):
    im = Image.open(path).convert('RGB')
    a = np.asarray(im).astype(np.int16)
    h, w, _ = a.shape
    lum = a.mean(axis=2)
    dark = (lum < 120)
    rows_dark = dark.sum(axis=1)
    text_rows = [i for i, n in enumerate(rows_dark) if n > 3]
    # a divider row: nearly every pixel is a light non-white grey
    line_rows = []
    for i in range(h):
        row = lum[i]
        if row.max() > 245 and row.min() > 200:
            frac = ((row > 200) & (row < 245)).mean()
            if frac > 0.5:
                line_rows.append(i)
    # content columns of the text band
    cols = dark.sum(axis=0)
    col_idx = [i for i, n in enumerate(cols) if n > 0]
    print(f'--- {path.split("/")[-1][:10]}  {w}x{h}')
    if text_rows:
        t0, t1 = text_rows[0], text_rows[-1]
        print(f'    text rows {t0}..{t1}  height={t1 - t0 + 1}  centre={(t0 + t1) / 2:.1f}')
    print(f'    text cols {col_idx[0] if col_idx else "-"}..{col_idx[-1] if col_idx else "-"}  width={(col_idx[-1] - col_idx[0] + 1) if col_idx else 0}')
    print(f'    divider-ish rows: {line_rows[:12]}{" ..." if len(line_rows) > 12 else ""}  (n={len(line_rows)})')
    # column profile of the strongest divider row
    if line_rows:
        i = line_rows[0]
        row = lum[i]
        xs = np.where(row < 245)[0]
        print(f'    row {i}: non-white cols {xs.min() if len(xs) else "-"}..{xs.max() if len(xs) else "-"}')

for p in sys.argv[1:]:
    analyse(p)
