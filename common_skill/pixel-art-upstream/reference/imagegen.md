# Concept route: an image model designs, a converter recovers the pixels

## Contents
- Why this route
- Setup
- Workflow (targets → reference sheet → concept prompt → generate → convert and pick → targeted edits → final conversion → deliver)
- Concept prompt template
- Edit prompt template
- Fresh-eyes reviewer prompt
- Checklist
- Tools
- Lessons

## Why this route

Image models are strong at the whole design: character, caricature, volume, proportion and color. Their "pixel art" is fake, with uneven blocks, color noise and the wrong scale. You are strong at measuring, judging and exact pixel edits. So:

- **The model designs.** The concept is the ground truth.
- **The converter recovers the true pixels.**
- **You art-direct, and fix only conversion artifacts.**

**Quality is decided in the concept.** The converter is faithful: a converted sprite differs from its concept by an error of about 10–13. Blind judges marked converted sprites down for:

- flat fills with scattered gloss blobs, instead of big shadow planes;
- props that don't read at game size (a newspaper read as a bone, a rope coil as bread);
- generic faces (dot eyes plus blush discs);
- cartoon stereotypes (an old sailor read as Santa or a garden gnome).

Steps 3–6 exist to prevent exactly these.

**Have a concept already?** A PNG from any image model (ChatGPT, gpt-image, others) works: start at step 5.

## Setup

- Python as in SKILL.md.
- The `codex` CLI installed and logged in (`codex login status`), with image generation on: `codex features list` shows `image_generation … true`.

## Workflow

1. **Targets.** From the style card or the request, fix:
   - the figure height and width in pixels (Eastward adults ≈ 52 px tall, kids ≈ 35–40; without a card, a character fills about 85 % of the canvas height);
   - the delivery canvas (Eastward adult 48×64, kid 32×48);
   - the color budget (≤ 16).
2. **Reference sheet** (if you have reference sprites). Pick 3–5 close to the brief's build, age, role and target height, and lay them out at the block size `B` you will ask for in step 3:
   - from PNG files: `python -I tools/refsheet.py --files refs.png a.png b.png c.png --scale 17`;
   - from an atlas: `python -I tools/refsheet.py ATLAS.png ATLAS.json refs.png NAME ... --scale 17`.

   Look at them and write down how they handle four things:
   - **shadow planes:** where the big darker shapes sit;
   - **faces:** brows, nose shape, mouth;
   - **color saturation;**
   - **props:** how they are drawn so they read at 1×.

   Without reference sprites, write the same four notes from the style card or the user's description, leave out `-i refs.png` below, and use the no-reference lines under the template.
3. **Concept prompt.** Fill in the template below. Two parts matter most.
   - **Art direction.** Spell out how the target style builds a figure, using your notes from step 2. Never write just "flat shading": the model takes it literally and paints flat fills.
   - **Prop identifiers.** For every prop or brief item, list the 2–3 features that make it unmistakable at game size, and what it must not look like. For example:
     - newspaper: a flat sheet with printed lines and a folded corner, not a curled blob;
     - rope coil: 2–3 round loops with a visible hole, not a braid;
     - fish: a head with an eye, a body and a forked tail.
4. **Generate 4 variants.** A 4-variant run takes about 10 minutes and an edit up to 15, so run Codex in the background or with a long timeout:

   ```
   codex exec --skip-git-repo-check -s workspace-write -C . -i refs.png < concept_prompt.txt
   ```

   Codex saves its images under `~/.codex/generated_images/…` and copies them into `./concepts/`, as the prompt asks.
5. **Convert every variant, then pick at game size.**
   - Convert each: `python -I tools/elastic2px.py concepts/concept_K.png work/k`.
   - If small features come out cut into bars or merged, the detected block size is off. Measure a feature of known size in the concept (an eye, a star, the outline thickness) in image pixels and pass it: `--pixel P`.
   - Contact sheet:

     ```
     python -I tools/contact.py work/contact.png --sprites work/1_native.png work/2_native.png ... \
       [--ref-files a.png b.png | --atlas ATLAS.png ATLAS.json --refs NAME ...] [--scene SHOT.png x0 y0 x1 y1]
     ```

     It shows the references and the converted candidates at 3× and 1×, and optionally pasted into a real screenshot.
   - Pick with a **fresh-eyes reviewer** if you can: a subagent that gets **only the contact sheet image** and the reviewer prompt below. Otherwise judge it yourself with the same questions.
   - Pick for how it reads at 1×. Sharpness at 8× doesn't count.
6. **Targeted edits instead of rerolls.** If the chosen variant has a fixable problem, edit that concept rather than generating new ones. Pass it as the input image:

   ```
   codex exec --skip-git-repo-check -s workspace-write -C . -i concepts/concept_K.png < edit_prompt.txt
   ```

   Fixable problems: wrong size after conversion, a prop that misreads, gloss blobs or texture noise, an over-saturated large area, a stereotype read.
   - Change one thing per edit and keep everything else identical. Convert the result and compare it on the contact sheet.
   - Every edit re-renders the whole image, so the style drifts. After each edit, check the face, outline and palette against the references.
   - Reject an edit that drifted toward generic chibi art: dot eyes, an open red mouth, blush discs, a pure-black outline, white-pale or orange skin.
   - Shrinking is the riskiest edit. Say "same proportions and face, only drawn smaller".
7. **Convert the final concept and check it.**
   - `tools/elastic2px.py` prints the figure size (it must fit the canvas, with the height in range), the color count, and the error vs the concept (aim for ≤ ~13).
   - **Never resample the sprite to change its size.** Details are lost. Edit the concept instead (step 6).
   - **Find artifacts:** `python -I tools/check.py CONCEPT.png work/k_native.png work/k_grid.json work/check.png x0 y0 x1 y1` aligns the concept with the sprite cell by cell. Check the face, hands and props.
   - **Fix only conversion artifacts** with `tools/cellfix.py`, toward the concept's colors: an eye glint outvoted by the lid, a stray background pixel, a broken outline. Never repaint the face, swap palettes, despeckle or add detail the concept doesn't have.
   - **Detail thinner than a block doesn't survive** (thin slit eyes, print lines, rope strands). Don't paint it back cell by cell; edit the concept so that part is drawn with whole blocks.
8. **Deliver.** `python -I tools/place.py work/k_native.png W H out/final_1x.png` puts the figure on the canvas, feet on the bottom row. It fails if the figure doesn't fit; then go back to step 6.

## Concept prompt template

```
Use your image generation tool to create 4 images, then copy them into ./concepts/ as concept_1.png …
concept_4.png. Don't write code or change any other files.

All four: concept sprites for one original character in <GAME OR STYLE>, matching the attached sheet of real
sprites in that style.

Character: <BRIEF>. <AGE / PERSONALITY CUES>. A specific, slightly odd, believable person, like the
references; not a cartoon stereotype (<STEREOTYPES TO AVOID, e.g. Santa, garden gnome, chibi cutie>).

Readable at game size (about <H> px tall), every item must be unmistakable:
- <ITEM 1>: <identifying features>; not <misread to avoid>
- <ITEM 2>: …

Face: a shaped face like the references, with visible brows, a nose with a shape, a mouth with a shape,
eyes that read; <AGE MARKS>. Hair, beard and headwear must not cover the eyes or nose. Headwear sits on
visible hair. No anime dot eyes with big blush discs.

Colors, like the references: <SKIN> skin with the <SKIN SHADOW> shadow only as a narrow band (under the
headwear, down one side of the face), never an orange or white face; cheeks at most one small flat patch
each; ink is a warm near-black (<INK>), never pure black. Neighboring materials differ clearly in
lightness so they separate at game size (<PAIRS, e.g. cap vs hair, coat vs shirt, prop vs clothes>).

Rendering, like the references:
- each material is a base color plus ONE big darker shadow shape on the side away from the light,
  under the head, under the arms and between the legs;
- at most one or two small highlights;
- no scattered gloss blobs, stripes, speckle, hatching or texture noise;
- a 1-pixel warm near-black outline;
- 12–16 colors, saturation as muted as the references (no large saturated areas).

Pixel scale and size: the attached sheet is drawn at exactly the scale to use: every sprite pixel there is
one solid <B>×<B> block. Draw the character on that same block grid, about <H> blocks (<H·B> image pixels)
tall, so the figure fills only part of the image, with proportions like the references. Nothing is smaller
than one block: eyes, mouth, nostrils, print lines, strands, stripes, folds and outlines are whole blocks on
the grid, never thin lines or half blocks.

Pose: full body, <VIEW, e.g. front-facing idle, top-down 3/4 RPG view like the references>, arms close to the
body.

Background: one flat solid color that appears nowhere on the character (#ff00ff), no ground shadow,
no text, no frame. One character, centered.

Variants: make the four clearly different designs (vary <BUILD / HEADWEAR / COLORS / HOW PROPS ARE HELD>).
```

Use `B = 17`. With a reference sheet attached, the model keeps its own block size of about 17 px whatever you ask, but it does follow the requested figure height in image pixels. Ask for `H·17` px with `H` about 10 % below the target, because it overshoots by about that much: ask for 48 blocks (≈ 820 px) to land near 52.

**No reference sheet:** replace "matching the attached sheet of real sprites in that style" with a one-line style description, and the "Pixel scale and size" paragraph with: "Draw on a coarse block grid: every sprite pixel is one solid block of about 16 image pixels. The character is about <H> blocks tall and fills only about two thirds of the image height." The model tends to fill the frame anyway (about 1.4× too tall in testing), so ask for about 70 % of the target height and expect one shrink edit.

## Edit prompt template

```
Use your image generation tool to edit the attached image, then save the result as ./concepts/<NAME>.png.
Don't write code or change any other files.
Keep the same character, pose, colors and pixel-art style. Change only this: <ONE CHANGE>.
(Examples: "draw the whole character smaller, about <H·17> image pixels tall, same proportions and face";
"make the newspaper a flat sheet with printed lines and a folded corner"; "replace the scattered
highlight blobs on the apron with one clean shadow shape on its right side".)
Background stays flat #ff00ff.
```

## Fresh-eyes reviewer prompt (give it only the contact sheet image)

```
The image shows real sprites (labelled "ref") and candidate sprites A, B, C, … for this brief:
<BRIEF>. Look at the 1× row (and the in-game scene, if shown) first, then 3×.
Rank the candidates. For each one give a one-line reason, and say:
(1) which brief items do NOT read at 1× and what they misread as;
(2) whether the face reads (eyes, brows, nose, mouth) and the age reads;
(3) whether the shading uses big shadow planes like the refs, or flat fills, gloss blobs or noise;
(4) any stereotype it reads as.
End with the best candidate and the single change that would most improve it.
```

## Checklist

- [ ] **Concept.** All brief items read at 1×; the face and age read; shading is in big planes, not blobs or noise; no stereotype; skin, ink and saturation fit the style; no detail thinner than a block; edits haven't drifted toward generic chibi.
- [ ] **Pick.** Made from the contact sheet at 1× (with fresh eyes if possible).
- [ ] **Conversion.** The figure fits the canvas with its height in range; colors within budget; error vs concept ≤ ~13; eyes and glints present.
- [ ] **Fixes.** Only artifacts were fixed, each checked in `check.py`, and fidelity didn't get worse.
- [ ] **Delivery.** `final_1x.png` is exactly W×H RGBA with a transparent background.

## Tools

| Tool | What it does |
|---|---|
| `refsheet.py` | reference sprites side by side at the block scale, as the image model's style reference |
| `elastic2px.py` | concept → true pixels: block size from the outline thickness, an elastic grid that follows uneven blocks, the dominant color per cell, near-duplicate colors merged to the budget; writes the sprite and its grid |
| `contact.py` | references beside converted candidates at 3× and 1×, plus an optional in-game scene, for picking |
| `fidelity.py` | error of a sprite vs its concept on the exact grid |
| `check.py` | the concept rectified cell for cell beside the sprite, an error heatmap, and the worst cells with the concept's colors |
| `cellfix.py` | set cells to the concept's color (or an explicit color, or transparent), keeping the palette |
| `place.py` | put the figure on the delivery canvas, feet on the bottom row |

## Lessons

- **Every loss came from the concept, never the conversion:** flat fills and gloss blobs, an unreadable newspaper and rope, a Santa-like sailor, generic dot-eye faces. Art direction in the prompt fixed props and stereotypes.
- **Faces are the hardest part to keep.** Judges still marked down saturated orange skin masks, freckle speckle and lost eyes.
- **Shrinking edits drift** into generic chibi: dot eyes, a red open mouth, pale skin, a pure-black outline.
- **Size:** asking for a block size failed (concepts came out 1.3–1.7× too tall, and hours went into size edits). Asking for the figure height at the model's own ~17 px block landed at 58–61 px for a 54 target.
