# Grid route: sprites up to 32 px

At this size the whole sprite fits in one view, and you already draw it well. Write it directly as text, a palette and one character per pixel, the way you normally would. This route only adds a file format, a renderer that checks it, and a habit of judging the result at real size.

## Workflow

1. **Write the sprite text** (format below) to `NAME.txt`.
2. **Render:** `python -I tools/grid.py render NAME.txt out/ --size WxH`.
   - It fails on ragged rows, undefined keys or a wrong size.
   - It lists isolated pixels (keep them only if they are deliberate eyes, glints or sparkles) and unused palette keys.
3. **Look at `out/NAME_view.png`.** Judge the 1× and 2× thumbnails and the silhouette first, because that is how the sprite is seen. Use the big grid view to find the pixels to change. Ask: does it read instantly at 1×, is every item in the request there, is the light consistent?
4. **Fix and re-render** until it reads at 1×. Two or three loops are usually enough.
5. **Deliver** `NAME.txt` and the `out/NAME_1x.png` rendered from it (exact canvas, transparent background).

## Sprite text format

```
o = #2a1d2e  outline (dark plum, not black)
C = #d9a066  cork light
c = #a0683a  cork
k = #6b3f2a  cork shadow
g = #bfd8e0  empty glass
G = #7f9aa8  glass shadow
w = #fff8ec  glint
R = #f0645c  potion light
r = #c2304a  potion
d = #7a1f3d  potion shadow
---
................
......oooo......
.....oCCcko.....
.....oCckko.....
......owGo......
......owGo......
....oowggGoo....
...owgggggGGo...
..owRRRrrrrrdo..
..oRRrrrrrrrdo..
.owRrrrrrrrrddo.
.oRrrrrrrrrrddo.
.orrrrrrrrrdddo.
..orrrrrrrdddo..
...oodddddddo...
.....ooooooo....
```

- Palette lines come before `---`: one-character key, `=`, `#rrggbb` (or `#rrggbbaa`), then an optional note.
- `.` is always transparent. Pick keys that remind you of the material.

## More

- **Editing an existing sprite:** `python -I tools/grid.py text sprite.png > sprite.txt` prints it in this format.
- **Animation:** one sprite text per frame with the same palette.
- **Characters at 32 px** with detailed faces or hands that won't fit the grid cleanly: reference/large.md builds them instead.
