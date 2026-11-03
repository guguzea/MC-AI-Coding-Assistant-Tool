"""Sprite text <-> PNG. Sprite text is the pixel-perfect source of every sprite: small ones are drawn in it
directly, larger ones are converted to it at the end.

Sprite text format (one file):
    o = #2b1b2e   any note after the color is ignored
    r = #c2304a
    ---
    ....oooo....
    ...orrrro...
Palette lines come before the `---` line: one character key, `=`, a hex color (#rrggbb or #rrggbbaa).
`.` is always transparent. Every grid row must have the same width.

  render SPRITE.txt OUTDIR [--size WxH] [--scale S]
      writes OUTDIR/NAME_1x.png (the sprite, exact size) and OUTDIR/NAME_view.png (S× with a pixel grid,
      plus 1× and 2× on light and dark ground and a silhouette); prints size, colors and warnings.
      --size fails if the grid is not exactly W×H.
  text PNG
      prints a PNG in sprite-text format: to edit an existing sprite, or to finish the construct and concept
      routes (warns about semi-transparent pixels on stderr).
Usage: python -I tools/grid.py render|text ..."""
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

KEYS = "abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ0123456789"
LIGHT, DARK, CHECK = (232, 224, 208, 255), (26, 24, 30, 255), ((70, 66, 78, 255), (58, 54, 66, 255))
PALETTE_LINE = re.compile(r"^\s*(\S)\s*=\s*(#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?)\b")


def parse(text: str) -> tuple[dict[str, tuple[int, int, int, int]], list[str]]:
    head, sep, body = text.partition("\n---")
    if not sep:
        sys.exit("no '---' line: put the palette above it and the grid below it")
    palette = {}
    for line in head.splitlines():
        m = PALETTE_LINE.match(line)
        if m:
            h = m.group(2)[1:]
            palette[m.group(1)] = tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + ((int(h[6:8], 16),) if len(h) == 8
                                                                                   else (255,))
    if "." in palette:
        sys.exit("'.' is reserved for transparent; pick another key")
    rows = [r.rstrip() for r in body.split("\n", 1)[-1].splitlines() if r.strip()]
    if not rows:
        sys.exit("empty grid")
    widths = {len(r) for r in rows}
    if len(widths) > 1:
        bad = [f"row {i}: {len(r)}" for i, r in enumerate(rows) if len(r) != len(rows[0])]
        sys.exit(f"rows differ in width (row 0 is {len(rows[0])}); " + ", ".join(bad[:8]))
    unknown = sorted({c for r in rows for c in r} - set(palette) - {"."})
    if unknown:
        sys.exit(f"keys used in the grid but missing from the palette: {' '.join(unknown)}")
    return palette, rows


def to_image(palette: dict, rows: list[str]) -> Image.Image:
    a = np.zeros((len(rows), len(rows[0]), 4), dtype=np.uint8)
    for y, row in enumerate(rows):
        for x, c in enumerate(row):
            if c != ".":
                a[y, x] = palette[c]
    return Image.fromarray(a, "RGBA")


def orphans(rows: list[str]) -> list[tuple[int, int]]:
    """Opaque pixels with no neighbour (8-way) of the same key: usually noise, sometimes a deliberate eye or glint."""
    h, w = len(rows), len(rows[0])
    out = []
    for y in range(h):
        for x in range(w):
            c = rows[y][x]
            if c == "." or any(0 <= y + dy < h and 0 <= x + dx < w and rows[y + dy][x + dx] == c
                               for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx):
                continue
            out.append((x, y))
    return out


def on_ground(img: Image.Image, ground: tuple, scale: int) -> Image.Image:
    bg = Image.new("RGBA", img.size, ground)
    bg.alpha_composite(img)
    return bg.resize((img.width * scale, img.height * scale), Image.NEAREST)


def view(img: Image.Image, scale: int) -> Image.Image:
    """Big view with a faint pixel grid on a checker, then 1× and 2× on light and dark, then the silhouette."""
    w, h = img.size
    big = Image.new("RGBA", (w * scale, h * scale))
    for y in range(h):
        for x in range(w):
            big.paste(CHECK[(x + y) % 2], (x * scale, y * scale, (x + 1) * scale, (y + 1) * scale))
    big.alpha_composite(img.resize(big.size, Image.NEAREST))
    d = ImageDraw.Draw(big)
    for i in range(1, max(w, h)):
        if i < w:
            d.line([(i * scale, 0), (i * scale, h * scale)], fill=(0, 0, 0, 40))
        if i < h:
            d.line([(0, i * scale), (w * scale, i * scale)], fill=(0, 0, 0, 40))
    sil = Image.new("RGBA", img.size, LIGHT)
    sil.paste(DARK, mask=img.getchannel("A"))
    smalls = [on_ground(img, LIGHT, 1), on_ground(img, DARK, 1), on_ground(img, LIGHT, 2), on_ground(img, DARK, 2),
              sil.resize((w * 2, h * 2), Image.NEAREST)]
    pad = 8
    side = sum(s.width for s in smalls) + pad * (len(smalls) + 1)
    out = Image.new("RGBA", (max(big.width, side) + 2 * pad, big.height + 3 * pad + 2 * h), (40, 38, 46, 255))
    out.paste(big, (pad, pad))
    x = pad
    for s in smalls:
        out.paste(s, (x, big.height + 2 * pad))
        x += s.width + pad
    return out


def render(args: list[str]) -> None:
    src, outdir, *opts = args
    size = scale = None
    if "--size" in opts:
        size = tuple(int(v) for v in opts[opts.index("--size") + 1].lower().split("x"))
    if "--scale" in opts:
        scale = int(opts[opts.index("--scale") + 1])
    palette, rows = parse(Path(src).read_text())
    h, w = len(rows), len(rows[0])
    if size and (w, h) != size:
        sys.exit(f"grid is {w}x{h}, expected {size[0]}x{size[1]}")
    img = to_image(palette, rows)
    out = Path(outdir)
    out.mkdir(parents=True, exist_ok=True)
    name = Path(src).stem
    img.save(out / f"{name}_1x.png")
    view(img, scale or max(4, 384 // max(w, h))).save(out / f"{name}_view.png")
    used = sorted({c for r in rows for c in r} - {"."})
    box = img.getchannel("A").getbbox()
    print(f"{w}x{h} canvas, figure {box[2] - box[0]}x{box[3] - box[1]} at ({box[0]},{box[1]})" if box else
          f"{w}x{h} canvas, empty")
    print(f"colors used: {len(used)} ({''.join(used)})")
    unused = sorted(set(palette) - set(used))
    if unused:
        print(f"palette keys never used: {''.join(unused)}")
    lonely = orphans(rows)
    if lonely:
        print(f"isolated pixels ({len(lonely)}): " + " ".join(f"{x},{y}" for x, y in lonely[:24])
              + (" …" if len(lonely) > 24 else "") + "  (fine if they are eyes or glints)")
    if box and (box[0] == 0 or box[1] == 0 or box[2] == w):
        print("figure touches the top or a side of the canvas")
    soft = sorted(k for k in used if palette[k][3] < 255)
    if soft:
        print(f"semi-transparent colors: {''.join(soft)} (not pixel-perfect: use opaque colors and '.' unless asked)")
    print(f"wrote {out / f'{name}_1x.png'} and {out / f'{name}_view.png'}")


def text(args: list[str]) -> None:
    a = np.asarray(Image.open(args[0]).convert("RGBA"))
    colors = sorted({tuple(int(v) for v in c) for c in a.reshape(-1, 4) if c[3] > 0}, key=lambda c: sum(c[:3]))
    if len(colors) > len(KEYS):
        sys.exit(f"{len(colors)} colors: too many for sprite text")
    soft = int(((a[..., 3] > 0) & (a[..., 3] < 255)).sum())
    if soft:
        print(f"warning: {soft} semi-transparent pixels (not pixel-perfect: each pixel should be opaque or "
              "transparent)", file=sys.stderr)
    keys = {c: KEYS[i] for i, c in enumerate(colors)}
    for c, k in keys.items():
        print(f"{k} = #" + "".join(f"{v:02x}" for v in (c if c[3] < 255 else c[:3])))
    print("---")
    for row in a:
        print("".join(keys[tuple(int(v) for v in p)] if p[3] > 0 else "." for p in row))


if __name__ == "__main__":
    if len(sys.argv) < 3 or sys.argv[1] not in ("render", "text"):
        sys.exit(__doc__)
    {"render": render, "text": text}[sys.argv[1]](sys.argv[2:])
