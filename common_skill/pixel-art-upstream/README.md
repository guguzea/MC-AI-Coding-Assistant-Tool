# pixel-art

An agent skill that draws pixel-perfect sprites at any size, from 16×16 icons to 64×64 characters: every pixel on the exact canvas, hard-edged, from a named palette. It delivers sprite text (a palette plus one character per pixel) and the 1× PNG rendered from it, and picks a route by canvas size:

| Canvas | Route | How |
|---|---|---|
| up to 32 px | Grid | The agent writes a palette and the pixel grid as text; `tools/grid.py` renders it, checks it and shows it at 1×. |
| over 32 px | Construct | Code builds the figure and one light from polygons; the agent draws faces, hands and details at full size in ≤ 16×16 windows. |
| 32 px and up, optional | Concept | Codex image generation (gpt-image) designs the sprite; `tools/elastic2px.py` recovers the true pixels. |

Ships a measured style card for Eastward (风来之国): sizes, a shared palette, and face, hand and head grammar as text.

## Install

```sh
npx skills add junyudev/pixel-art
pip install pillow numpy scipy
```

Optional concept route: install the [Codex CLI](https://github.com/openai/codex) and run `codex login`. The skill checks `codex features list` for `image_generation` and offers it for sprites of 32 px and up.

## Use

Ask your agent for a sprite: "Draw a 16×16 health potion icon", "Make a 48×64 front-facing idle sprite of a grumpy fishmonger, Eastward style", "Turn this concept image into a 64×64 sprite".

## How it was measured

[Pixel Bench](https://pixel.jyu.app), blind paired judging by fresh Claude agents:

- **Construct route:** redrawing 10 real Eastward characters from a 3–5 sentence brief, never seeing the original, it beat the previous best version's drawings 15–5 and rates first of 11 entries.
- **Grid route:** on fixed briefs with no original, it beat plain Opus 9–1 at 16×16; at 32×32 plain Opus was slightly ahead (5–3), and the grid route beat the construct route 7–1 at a quarter of the cost.
- **Concept route:** tested end to end with Codex image generation; its earlier version is on the same leaderboard as "image-gen".
- **Against no skill:** with a plain prompt, Opus 5.5 scores 8–12 against the same reconstruction anchor (15–5 with the skill). GPT-6 Astra on Codex gains most from the grid route (33–9 over its own plain small sprites), but its construct-route characters score below its plain ones (4–16 vs 8–12), so on Astra use the grid route.
