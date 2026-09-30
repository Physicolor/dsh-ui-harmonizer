"""Zoom a horizontal strip of a screenshot so a seam can be judged by eye.

Usage: python scripts/zoom-strip.py <png> <top> <height> <out.png> [scale]
"""
import sys
from PIL import Image

src, top, height, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
scale = int(sys.argv[5]) if len(sys.argv) > 5 else 3
im = Image.open(src).convert('RGB')
w, h = im.size
crop = im.crop((0, top, w, min(h, top + height)))
crop = crop.resize((w * scale, crop.size[1] * scale), Image.NEAREST)
crop.save(out)
print(f'{out} {crop.size[0]}x{crop.size[1]}')
