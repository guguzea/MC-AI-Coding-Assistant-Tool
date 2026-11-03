# Construct route: sprites over 32 px

## Contents
- Why this route
- The camera: in front of the character and above, looking down
- Workflow: style card, study, concepts, gesture, construct, light, detail, look, fresh eyes, critique
- Critique checklist
- API (`kit/construct.py`)
- Animation
- Lessons that cost iterations

## Why this route

You draw without seeing, so two things decide quality: **how the figure is built** and **how often you look**.

Three failures this skill exists to prevent:

- **Balloons glued together.** Each part is outlined and shaded on its own. Real pixel art is one form under one light, with lines only where the artist chose them.
- **Noise and plastic.** Too many tones and single-pixel highlights. Real 50 px sprites use about 12–16 colors and big flat shadow shapes.
- **Blown-up icons.** Flat, empty masses with blank faces. This happens when the sprite is planned small and scaled up. Real sprites get their character from 1–3 px marks drawn at full size: features, beard texture, stains, folds.

**Where your strength is.** You draw 16×16 sprites well, because everything fits in one view. A 48×64 sprite is too big to hold at once, but its details live in areas about 16×16 (a face, a hand, a prop). So code builds the figure (shapes, one light, clean ink), and you draw every face, hand and detail as a ≤ 16×16 text window **at full size**. Never shrink the job: planning at half size and scaling up was tested, and it produced flat, empty sprites.

Division of labour: **code owns consistency** (rasterizing, one light, clean ink). **You own intent**: gesture, shape design, where lines go, and every face, hand, clump and fold pixel.

## The camera: in front of the character and above, looking down

**This is the most important rule.** Don't draw a front elevation. Think in 3D volumes seen from in front and above:
- **Volumes:** the torso, limbs and skirt are cylinders or cones, and the head is an egg.
- **Every horizontal ring around a form is the near half of an ellipse.** That covers skirt, coat and apron hems, belts and waistbands, cuffs, collars and necklines, hat bands and brims, boot tops, and bucket rims. The ring **dips toward the viewer in the middle and rises at the sides.**
  - Sag is about 15 % of the ring's width: 1 px for 4–7 px rings, 2 px for 8–14, and 3 px for 15+.
  - Use `arc_pts()` and `band()`. A flat straight hem is the signature front-view mistake.
- **Tops show, bottoms hide.** Show the crown of the head or hat, the top plane of the shoulders, the inside of a bucket (an ellipse), and the tops of the shoes with the toes turned slightly out. Hide the soles.
- **Skirt and coat sides** flare and curve, and their bottom corners round up.
- **Shading follows the volume.** Each cylinder has one shadow side. Shadows of bands and hems follow their arcs.
- **Guardrail:** `flat_h` must stay ≤ 0.33. It measures the share of interior horizontal boundaries that are straight runs of 6 px or more. The reference median is 0.28; every test sprite drawn without this rule scored 0.34–0.57.

Setup is in SKILL.md. Run tools from the skill folder (they add it to `sys.path`), or copy `kit/` and `tools/` into your project.

## Workflow

1. **Style card.** If `styles/<style>.md` exists, read it.
   - Otherwise, with clean sprites: run `tools/style_stats.py` over them for the numbers.
   - With screenshots only: `tools/native.py` and `tools/zoom.py` measure sizes. Don't trust their colors or shading, because screenshots carry engine grading.
   - Write a card with the same sections as `styles/eastward.md`.
   - With no references at all: write a short card from the request (view, figure height on the canvas, color budget ≤ 16, outline, light). `styles/eastward.md` is a worked example of a top-down 3/4 RPG style; borrow its structure rules when the user wants that look.
2. **Study real sprites as text** (with no references, use the Eastward anatomy and head files below as your examples of how faces and hands are built).
   - Read `styles/<game>_anatomy.md` if it exists: face, hand and leg grammar with real snippets.
   - Read `styles/<game>_heads.md` and **pick a head template**: the real head closest to your character's type (woman, old or bearded man, big man, kid). You will adapt its structure in step 7.
   - Then pick 3–6 sprites close to your character's build, age and role. From a sprite atlas, cut one out with `tools/refs.py extract ATLAS.png ATLAS.json NAME ref.png`. Then `tools/refs.py text ref.png [x y w h] --map styles/<game>_palette.json` prints it in the medium you draw in. The style's shared colors always print as the same letters.
   - Write down:
     - the row budget (head, torso and leg rows);
     - how eyes, nose, mouth, beard and hands are drawn, pixel by pixel;
     - where the shadow shapes sit;
     - how many colors are used.
3. **Concepts, then brief.**
   - **Concepts:** write 3 genuinely different concepts in one line each: body type (stout, lanky, hunched, top-heavy), age cues, silhouette hook, and how the prop is held. Your first idea is the one every other run also has, so choose the most specific concept, not the first.
   - **Brief, 4 lines:** silhouette hook, one caricature feature, 3–5 materials plus one accent, one story detail. Add one line on **how the age reads**, using the marks from the anatomy grammar. An adult with a round face, a closed-eye grin and no marks reads as a child.
   - **Palette: write it now**, within the card's budget (Eastward: ≤ 16 including ink).
     - If `styles/<game>_palette.json` exists, start from its shared colors: ink, skin and skin shadow, shadow brown, cream. Add only the character's own colors, 3–6 of them.
     - Most materials get base + shadow only. Set `hi == base` in their ramp. Give a highlight to 1–3 materials at most.
     - Plan values so dark materials don't all land in one horizontal band (mud).
4. **Gesture and proportions first.** Before any shape, write joint coordinates in a comment: head, shoulders, elbows, wrists, hips, knees, ankles.
   - **Pixel numbers in this step are for Eastward-scale figures** (adults about 52 px tall on a 48×64 canvas). Scale them to your figure height; keep the ratios.
   - **Seen from slightly above.** Top-down RPG cameras look down a little (Eastward's does), and the sprites keep that.
     - **Head:** the crown (hair or cap) takes the upper ~40 % of the head, and the face sits low in it, with the eyes about 55–60 % of the way down.
     - **Shoulders:** they show their top plane (a lit band), and the collar is seen from above.
     - **Widths:** the figure is widest across the shoulder-to-hands band, at about 70 % of its height, then narrows down to **small feet close together**: each 3–4 px, with the toes' tops showing.
     Guardrails: `shoulder_w` ≥ 0.56 and `feet_w` ≤ 0.55 for adults; `head_w` ≤ 0.92 for kids. A barrel that stays wide down to big boots reads flat.
   - **Realistic limbs, not cylinders.** Use `limb(start, end, w_start, w_end)` so every limb tapers.
     - Average adults: arms 3–4 px tapering to 2–3, and legs 4–5 tapering to 3. Only burly characters get thicker limbs.
     - Hands are small (3–4 px) and hang at hip or upper-thigh height. Legs are long enough to show knees (adults: ≈ 20–28 % of height).
     - Shade a limb with one shadow edge. A highlight stripe down the middle makes a tube.
   - Give the figure a line of action and a weight leg.
   - Shoulders and hips counter-tilt by 1 px.
   - **Give the pose attitude.** The two arms do different things: one hand on the hip, one arm bent, or a prop held out. Never let both arms hang straight and symmetric.
     - A rule that pulled both arms in made a test fishmonger stiff and childlike, and judges scored it 18 points lower.
     - Arms otherwise sit close to the body and overlap the torso edge.
   - **Width:** adults' torso is ≤ 32 px, and ≤ 40 px including a flared elbow or a held prop. Kids are ≤ 26 px (reference medians: 27 and 24).
   - **Kid height:** 35–40 px.
   - **Adult, not child:**
     - shoulders 2+ px wider than the head on each side;
     - a collar or neckline under the chin;
     - legs or knees visible between the hem and the shoes;
     - head ≤ 42 % of height.
     A big head on a small body with no legs reads as a child.
5. **Construct** a `Figure` from `Region` polygons, listed back to front (API below).
   - **Shape design:**
     - Straight edges against curves.
     - Deliberate corners at shoulders, jaw, elbows and boots.
     - Limbs taper; nothing is a uniform capsule.
     - The silhouette is clearly asymmetric.
     - Legs show below every garment: two separate feet or boots, 3–5 px each, with a sole row, a gap or an ink line between them, and the weight leg under the body. A hem sitting on boot slabs reads as a box.
     - **Clothes wrap a body; they are not pasted panels.**
       - Sleeves overlap the torso edge.
       - Straps, belts and hems curve with the form, dipping 1 px at the middle or the sides.
       - The garment's silhouette bends at the waist, hips and knees.
       - Every straight contour longer than about 5 px needs a reason, such as a hem or a sole. Break the others with a fold, notch, clump or taper. Watch the `straight` guardrail.
   - **`groups`:** regions that form one continuous form share a group (torso skin with both upper arms, hips with legs, all hair parts). No line is drawn inside a group, which removes ball-joint seams.
   - **`line`:**
     - `"ink"` only where one form overlaps another (arm over torso, chin over neck).
     - `"shade"` for details (belt, pouch, fringe, boots over trousers).
     - `None` for pieces of the same fabric.
6. **Light.** One `Light` for the whole figure.
   - Per region, set:
     - `tilt`, the way its plane faces: shoulders and hair top `(0,-0.3..-0.4)`, right-side pieces `(+0.2..0.35, …)`;
     - `volume`: 0 for flat panels, 1 for round forms;
     - `cast`: head `(1,2)`, arms `(1,1)`, fringe `(0,1)`.
   - Check the per-region stats. A front-facing region with more than 60 % shade has the wrong tilt.
7. **Draw the detail at full size. Most loops go here.**
   - **Face and hands as windows.** `render_figure.py fig.py out/ name --window x y w h` prints that area as text with a ruler.
     - Rewrite it as a `("block", (x, y), """rows""")` op: `_` keeps a pixel, `.` erases one.
     - Draw it like the faces and hands you studied in step 2.
     - **Head from the template.** Rebuild your head on your template's structure, then make it your own character:
       - **Silhouette bumps:** ears (1–2 px, with a skin-shadow inner edge) unless hair covers them, plus jowls, hair tufts and the hat brim. A smooth disc or box head reads as a mask.
       - **The face is carved, not decorated.** Draw all of these:
         - a shadow side, 2–3 columns away from the light;
         - a shadow band under the hair, hat or scarf;
         - an **eye-socket band** of skin shadow (or the cool violet) around the eyes, merging into the brows;
         - a nose shape with a dark underside;
         - shadow under the lower lip and under the chin or jaw.
       - Cool violet goes **in the socket band** above and around the eyes, never as bags under them. Bags read as bruises.
       - Freckles and blush must not be loose marks; fold them into the cheek's shadow shape.
     - **Bold features.** The references' features are bigger and darker than you expect.
       - The nose is a 2–4 px shape, with skin shadow and a shadow-brown underside.
       - Brows are 2–4 px.
       - The mouth is 2–4 px.
       - The cheek and jaw masses are skin-shadow shapes.
       Compare your head row against theirs on the critique sheet. Small features on an empty skin slab is the most repeated "generic face" complaint.
     - **Blush and freckles** are one flat shape per cheek, never scattered dots, which read as a rash or noise.
     - **Face grammar:**
       - No ink inside the face except 1-pixel eyes.
       - Mouth, brows, nose underside and age lines are the shadow brown (or your darkest skin step). Nose, sockets, cheeks and jaw are skin-shadow shapes.
       - Add a cast shadow under the chin.
       - **Mouth:** leave at least one skin row between the nose's underside and the mouth.
         - Women and kids get a short mouth (2–3 px), in deep red-brown or lip color.
         - An open mouth is a filled dark shape with no ring.
         - A dark bar or ring right under the nose reads as a mustache or goatee. Judges flagged this in 4 runs.
       - **Hair under a scarf or cap** joins the face edge as one clump. Separately outlined puffs at the ears read as headphones.
     - **Hands** are inked mittens with a shadowed underside.
     - Keep each block ≤ 16×16, and do one feature area at a time.
   - **Then smaller marks** with `px` and `line` ops: hair clumps, folds, stains, buckles, glints, and line breaks where a contour should open.
   - **Clothes are layered shapes, not slabs.**
     - Every large garment gets 2–4 tapered fold or shadow shapes (2–6 px) that start at a joint, strap or waist.
     - Add separate bands for cuffs, collar, hem and belt.
     - Gloss is one or two strokes.
     - Big garments use the shared muted cloth colors. A saturated orange or lavender garment pops out of the scene.
   - **Variants.** For the face, the prop and the biggest garment, draw 2–3 alternatives (for example, separate block constants switched by a flag). Render each one, put them all on one critique sheet with the references, and keep the version that reads best at 1×. Note why you chose it. Runs that did this fixed their worst misreads.
   - **No new colors.** Every isolated pixel must be deliberate.
     - Sheen, wetness, stitches and texture are one shape or one line, never scattered specks. Judges call specks "noise" every time.
   - **Props:** name the two features that make each prop read, and draw each at least 2 px.
     - A fish needs an eye plus a head with a mouth, then a tail.
     - Boots need a top cuff plus a sole; without them they read as trousers.
     - A bucket needs a rim ellipse plus a gripped handle.
     - Rope is a few thick coils, not a woven pattern.
   - **Prop placement:** keep the most recognizable part visible (a fish's head and eye, a paper's printed face), and make the hand grip the prop. Test the prop alone at 1× and ask what else it could be. A forked fish tail above a fist read as a wrench 3 times.
8. **Look, every loop.**
   - `tools/render_figure.py fig.py out/ name --budget 16` prints:
     - bbox and colors used;
     - the fingerprint;
     - **guardrail warnings in both directions** (too noisy *and* too flat or empty);
     - per-region light stats.
     It also writes the views: 1×, 3×, grid, silhouette, squint, grey and flip.
   - **Critique sheet (view it every loop):** `tools/sheet.py out/sheet.png --ours out/name_1x.png --refs a.png b.png` (or `--atlas ATLAS.png ATLAS.json --names "Ref A" "Ref B"`).
     - Use your 3–4 closest references.
     - It shows the full sprites at 4×, the **heads at 8× side by side**, and everything at game size.
     - Judge your sprite the way a blind judge will: next to the real ones.
   - `tools/compare.py` does the same for arbitrary crops of screenshots.
   - `tools/scene.py NATIVE x0 y0 x1 y1 out/scene.png --put out/name_1x.png X Y` pastes yours into a real screenshot.
9. **Fresh-eyes check** (after loop 2, and on the final).
   - If you can launch a subagent, give it **only** your 4× PNG (on a neutral background) and ask: "Who is this (gender, age, job)? What is each held item and garment? What looks odd?" Fix every misread.
   - If you can't, write your own description of the 1× image before looking at your notes. A fresh reader caught the mustache, cleaver and bruise misreads that rules alone did not.
10. **Critique, then repeat.** Do at least 3 loops, and write down what you changed and why each time. Judge by eye against the real sprites.
   - **Fix every guardrail warning; don't argue it away.** A deliberate exception needs a reference sprite that does the same thing.
   - Numbers inside the guardrails don't make a sprite good.

## Critique checklist

- [ ] **Silhouette.** As a solid fill, are the gesture, the weight leg and the asymmetry visible? Recognizable at 1×?
- [ ] **Seams.** Is any part outlined on its own? There should be no ring at shoulders, hips or wrists inside one form.
- [ ] **Light.** One light across the figure: a big shadow side, no pillow rims on every part, no speckles?
- [ ] **Detail density.** Do the face, hands and clothes have drawn marks like the references, or are they blank fills?
- [ ] **Economy.** Colors within budget, about 2 tones per material, and no `render_figure` warnings?
- [ ] **Proportions.** Height, width and head share inside the card's range? Do the legs and feet show a stance? Do the arms stay close to the body?
- [ ] **Wrapping.** Do clothes overlap and curve around the body, or are they flat panels with ruler edges?
- [ ] **Misreads.** At 1×, could the mouth read as a mustache, hair as headphones, or the prop as a tool?
- [ ] **Heads row.** On the critique sheet, are your features as big, dark and specific as the references'? Does the head have ears or bumps? Is the face carved with a shadow side, a socket band, a nose underside and a chin shadow?
- [ ] **Props.** Does each prop show its two identifying features at 1×?
- [ ] **Camera from above.** Is every hem, belt, cuff, collar and band an arc dipping toward the viewer? Do the tops show (head crown, shoulders, shoe tops, rims)? Is `flat_h` ≤ 0.33?
- [ ] **Perspective and limbs.** Is the figure widest across the shoulders and hands, narrowing to small close feet? Are the limbs slim and tapered, with no tubes or highlight stripes?
- [ ] **Age and character.** Does the face read at the brief's age, and is it a specific person rather than the generic default?
- [ ] **Color world.** Are most pixels the style's shared colors, and are large areas as muted as the references?
- [ ] **Fit.** Next to the real sprites, does it look like the same game?

## API (`kit/construct.py`)

```python
limb(start, end, w_start, w_end)         # tapered limb polygon between two joints, e.g. limb(SHOULDER, ELBOW, 4, 3)
arc_pts(x0, x1, y, sag)                  # points of a ring's near half: dips `sag` px toward the viewer at the middle
band(x0, x1, y, thick, sag)              # curved band polygon (belt, cuff, collar, hat band)
Region(name, material, shape,            # shape: polygon ((x, y), ...) in canvas px, vertices inclusive
       line="ink" | "shade" | None,      # policy where this region overlaps regions listed before it
       volume=1.0,                       # edge roll-off strength (0 = flat panel)
       cast=None | (dx, dy),             # contact shadow onto regions listed before it
       ellipse=False,                    # shape = ((x0, y0), (x1, y1)) bounding box
       groups=(),                        # shared group => no line between them
       tilt=(0, 0),                      # plane normal slope: +x faces right, +y faces down
       line_vs=(("lower_region_name", "shade"),))  # per-neighbour policy override
Light(direction=(-0.5, -0.7, 0.9), global_weight=0.35, blur=4.0, local_weight=0.6, bevel=2.5, hi=0.86, shade=0.55)
Figure(size, palette, ramps, regions, light, ops, shadow)
#   palette: key -> "#rrggbb"; "o" is ink.  ramps: material -> (hi, base, shade, deep) keys (hi == base = no highlight)
#   ops: ("block", (x, y), rows) | ("px", key, [(x, y), ...]) | ("line", key, [p0, p1, ...])
#        | ("poly", key, [...]) | ("erase", [...])
#   shadow: kit.pixelkit.Shadow(cx, cy, rx, ry) ground ellipse, or None
```

Your module defines `figure() -> Figure`. Read `examples/mechanic_idle.py` before writing your own. It is a complete adult idle: 16-color palette, gesture, groups, tilts, casts, line policies, and the face drawn as a block.

`kit/pixelkit.py` provides FX (`arc()` smears, `Shadow`). Use it only for effects and tiny props, never to build a body.

## Animation (guidance, not yet battle-tested)

Write regions as a function of a pose dict (joint coordinates) and rebuild every frame, so key poses are redrawn rather than parts slid around. Reuse the same face and hand blocks wherever they don't change.

- Walk: contact → passing (body −1) → mirrored contact → passing.
- Hair and cloth lag one frame.
- Actions: anticipation → one smear frame (≤ 70 ms) → impact (FX + 1–2 px squash) → recover.

## Lessons that cost iterations

- **Hand-on-hip poses** appeared in every early run because the example used one, and they widened the sprites. But banning them produced stiff, symmetric, childlike figures that scored worse. The rule is attitude plus asymmetry, with a width guardrail.
- **Flat buckets with tube limbs** were the verdict on early test runs. Thick constant-width limbs, big boots set wide apart, and a head as wide as the body read as flat. The real sprites are seen from slightly above, with slim tapering limbs that are close to realistic. The width profile (`shoulder_w`, `feet_w`, `head_w`) catches it: a stiff test fishmonger scored `feet_w` 0.82 against a reference median of 0.43.
- **Numbers stopped discriminating** once the economy was right: saturation and largest flat area were inside the reference range even for sprites judges called garish or slab-like. The remaining gaps (bold faces, layered clothes, attitude) are caught by looking: the critique sheet and variants.
- **Blind judges' most repeated complaints about adult NPCs:** "reads as a child", "figure stops at boot slabs under the apron", "hands are skin blocks", "bright generic palette". The concept step, the age line, the leg rule, the hand rule and the shared palette exist for these.
- **Ink inside faces** (mouth lines, nose outlines) made faces read as masks. Eastward draws features with shadow brown and skin shadow.
- **Half-size planning plus a pixel-art upscaler** (Scale2x) gave flat, rounded, blank sprites that people rated far worse. The details never come back, and the scaler rounds every edge.
- **Numbers inside the guardrails** did not make a sprite good. They only flag what's clearly wrong.
- **Screenshot colors** (graded, filtered) suggested 3–4 tones per material. Clean sprites use about 2.
- **Lighting from one inflated-silhouette height field** makes faces "look down" into the neck. That's why regions declare `tilt`.
- **Black outlines on every small detail** push dark pixels to about 30 % and read as clutter.
- **Several dark materials at waist height** turn into one muddy band. Make gloves or belts lighter.
- **Round goggle lenses bigger than 4×3** read as giant eyes. Test small props at 1×.
- **Head share above 45 %** on an adult reads as chibi / RPG Maker.
- **Busy textures:** checker rope, camo-like trouser shading and a speckled beard. Each texture should be one or two shapes.
- **Misreads that rules alone missed** and a fresh reader caught: a dark bar under the nose plus chin dots read as stubble on a woman; a fish with no eye read as a cleaver; boots with no cuff read as trousers; purple eye bags read as bruises.
