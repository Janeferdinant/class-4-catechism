# Artwork to generate — Class 4 Catechism redesign

The site already runs with placeholder art at every path below, so you can add images one at a time. Each new image replaces its placeholder automatically.

## How to deliver the images

1. **Generate** each image using the prompt in this file.
2. **Save** it into this folder, using the exact file name given (PNG, JPG or WebP all work):

   ```
   assets/generated/incoming/
   ```
3. **Run** this from the project folder:

   ```
   python scripts/art/process_generated_art.py
   ```

   You can also just tell Claude the files are in place. The script:
   - cuts out solid backgrounds
   - resizes each image
   - converts it to the web format
   - writes it to the path the site loads
   - checks the transparency

   It prints PASS or FAIL for each file.
4. **Refresh** the site with a hard refresh (Ctrl+F5) so the browser doesn't show cached images.

Nothing else is needed. The code already loads every file at the path the script writes. You can re-run the script at any time: it re-processes whatever is in the incoming folder, so adding a few images at a time is fine. When you're happy, commit the updated files under `assets/generated/` together with the code. The raw files in `incoming/` are git-ignored.

**About transparent backgrounds.** Islands, icons and the Jesus group must end up transparent.

- If your tool can export a transparent PNG, use that, and delete the last line of the prompt (the magenta background line).
- If it can't, keep that line. A flat magenta background is easy to remove cleanly, because nothing in the art is magenta.
- The script also cleans up soft shadows and glows that the generator painted onto the magenta. They become neutral shadows and white light, so you don't get pink smudges.
- If a file shows FAIL, re-run with a looser setting: `python scripts/art/process_generated_art.py 90`. If it still fails, regenerate that image.
- **Island 13** has pink roses, which sit too close to magenta. Generate that one on a solid cyan (#00FFFF) background instead. The script detects whatever background color you use.

**Rules for every image:**
- No text, letters or numbers anywhere in the picture. The site adds all labels as real text.
- No logos, watermarks, borders or frames.
- Faces and hands must be well-formed, with no extra fingers.
- Keep the same style across the whole set: a polished, child-friendly 3D animated storybook look, with soft warm light and gentle gold highlights.

---

## Priority 1 — Adventure Map backdrops (2 images)

These sit behind the whole map. The app draws the islands, the golden path, the stars and the shooting stars on top, so **do not paint islands, paths, people or a dense star field** into these.

Layout matters because the page puts other things on top:
- **Left third:** stays soft and low in detail. The quote and the Jesus group go here.
- **Upper middle-right (about 55–75% from the left, top third):** the golden cathedral, where chapter 15 sits.
- **Far-right fifth:** covered by the agent console, so keep important details out of it.
- **Bottom strip:** covered by the feature cards, so a soft cloud bank works well there.

### `map-backdrop-light.png`  · 16:9 landscape · at least 1920×1080 (2560×1440 ideal) · opaque

```
Wide cinematic children's storybook landscape of a peaceful heavenly morning above the clouds. Pale sky-blue sky with soft fluffy white and cream clouds in gentle layers. A radiant golden-white heavenly cathedral with domes and spires stands on a cloud bank in the upper middle-right of the picture, about two-thirds of the way across and in the upper third, with warm morning sunlight glowing behind it and soft sun rays. The center of the picture is open sky and soft clouds with nothing in it. The left third is soft and simple: pale clouds and a hint of a flowery meadow at the lower left. A thick soft cloud bank runs along the bottom edge. Polished 3D animated storybook illustration, soft volumetric light, atmospheric depth, calm and inviting, warm gold highlights. No floating islands, no paths, no people, no animals, no birds, no text, no logos, no watermark, no border.
```

### `map-backdrop-dark.png`  · 16:9 landscape · at least 1920×1080 (2560×1440 ideal) · opaque

```
Wide cinematic children's storybook landscape of a peaceful heavenly night above the clouds, matching a sunny morning version of the same scene. Deep navy and midnight-blue sky with a faint soft nebula glow. A glowing crescent moon in the upper left. A golden heavenly cathedral with domes and spires stands on a moonlit cloud bank in the upper middle-right of the picture, about two-thirds of the way across and in the upper third, its windows glowing warm gold. The center of the picture is open night sky and soft dark-blue clouds with nothing in it. The left third is soft and simple. A thick moonlit cloud bank runs along the bottom edge. Only a few faint stars. Polished 3D animated storybook illustration, soft moonlight, elegant gold and blue light, deep atmosphere. No floating islands, no paths, no people, no animals, no shooting stars, no dense star field, no text, no logos, no watermark, no border.
```

---

## Priority 2 — 15 chapter islands (15 images)

Each island stands for one chapter. Use the same camera angle, lighting and scale for all 15, so they look like one set. If your tool supports it, generate them in one session and reuse the first good island as a style reference.

**Every island is:** square 1:1, at least 1024×1024, transparent, with the island centered and about 75% of the frame wide.

### `island-ch01.png` — Jesus, the Source of Life
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with flowers and two small trees, a rocky earth underside that tapers to a point, soft white cloud wisps around its base, and a small waterfall pouring from one edge. On the island: a lush grapevine arbor heavy with purple grapes curving over a small golden chapel with a cross on top. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch02.png` — Jesus Gives Life Through the Church
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with flowers and small trees, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a white parish church with a tall bell tower and a cross, with a small flower-lined path leading to its open doors. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch03.png` — Sacraments: Channels Giving Life
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with flowers, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a round stone fountain in the center with seven small sparkling streams of water flowing outward across the grass like channels, then spilling over the edge as little waterfalls. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch04.png` — Baptism: Rebirth in Jesus
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with flowers and small trees, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a carved stone baptismal font filled with clear shimmering water, with a white dove gently hovering above it. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch05.png` — Confirmation: Anointing in the Spirit
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with flowers and small trees, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a small stone altar holding a golden oil vessel, with a white dove descending from above surrounded by a soft warm glow. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch06.png` — Holy Qurbana: The Life-Giving Sacrifice
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with flowers and small trees, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a small open-air altar with a white cloth, a golden chalice and a round white host, softly glowing with warm light, with two small candles. Respectful and reverent. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch07.png` — Holy Qurbana: The Bread of Life
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top, a small golden wheat field, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: tall sheaves of golden wheat and a woven basket filled with round loaves of bread beside a small rustic table. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch08.png` — To Receive Jesus
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with white lilies and small trees, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a small chapel with its wooden doors open and warm golden light shining out, and a path lined with white flowers leading up to the doors. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch09.png` — Let Us Be Reconciled
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with flowers, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: two small cozy cottages on either side of a little stream, joined by a small arched wooden bridge, with a glowing heart-shaped lantern hanging at the middle of the bridge. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch10.png` — Sacrament of Reconciliation
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with flowers and a shady tree, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a small carved wooden confessional booth with a soft warm light inside and a little purple curtain, standing beneath the tree, with a gentle beam of light from above. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch11.png` — Anointing of the Sick
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with a healing herb garden and soft flowers, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a small peaceful cottage with a lit window, and in front of it a little table with a glowing oil lamp and a small golden oil vessel. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch12.png` — Holy Orders / Priesthood
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with flowers and small trees, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a small stone altar with an open Bible, two candles, and a priestly stole in white and gold draped over it, beside a shepherd's staff. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch13.png` — Holy Matrimony
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with roses and small trees, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a white garden arch covered in pink and white roses, with two interlinked golden rings resting on a small cushion beneath it. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat cyan (#00FFFF) background.
```

### `island-ch14.png` — Sacramentals
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with flowers and small trees, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a small wayside shrine with a cross, a rosary hanging beside it, a little holy water font, and several lit candles. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `island-ch15.png` — The Lord's Prayer & Christian Prayer Life
```
A single small floating island in a child-friendly 3D animated storybook style, seen from slightly above in three-quarter view. Rounded grassy top with flowers and small trees, a rocky earth underside that tapers to a point, soft white cloud wisps around its base. On the island: a peaceful little prayer garden with a stone grotto, a simple cross, a kneeler, and many small glowing candles, with soft golden light rising upward. Warm soft sunlight from the upper left with a gentle gold rim light. Rich but harmonious colors, clean silhouette, high detail. The island is centered and fills about 75% of the frame width with empty space all around. No people, no ground shadow under the island, no text, no border, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

---

## Priority 3 — Jesus with the children (1 image)

It appears at the bottom-left of the light Adventure Map and in the mobile welcome card. The current version has painted clouds behind the figures. This one needs to be the figures only.

### `jesus-children.png`  · 4:3 landscape · at least 1536×1152 · transparent

```
Respectful, warm, child-friendly Christian storybook illustration of Jesus seated on a grassy patch with flowers, smiling kindly, surrounded by five or six happy children of different backgrounds who lean in to listen, and two small white lambs at his feet. Jesus wears a cream robe with a soft red sash. Gentle natural expressions, warm golden rim light, soft pastel colors. Polished 3D animated storybook rendering with appealing, non-photoreal character design. The whole group is grouped tightly together with every figure fully inside the frame, and the grass patch is small and rounded at the bottom. No sky, no clouds and no scenery behind the figures. No halo lettering, no text, no logo, no watermark, no frame.
On a plain solid flat magenta (#FF00FF) background.
```

---

## Priority 4 — Agent avatars (3 required, 2 optional)

These are small round portraits in the Multi-Agent Learning Console. Galileo and Orchestrator already have usable 3D portraits. Leo, Sophia and Barnaby are flat clip-art and don't match, so redo those three. Redo the other two as well if you want all five to match exactly.

**Every avatar is:** square 1:1, at least 1024×1024, opaque. The site crops it into a circle, so keep the face centered.

### `avatar-leo.png` — Leo (Story)
```
Head-and-shoulders portrait of a cheerful 8-year-old boy with curly orange hair and freckles, holding an open storybook against his chest, smiling warmly at the viewer. Polished 3D animated-film character style, soft studio lighting, face centered in the frame, plain soft light-blue background (#DCEBFA). No text, no logo, no watermark.
```

### `avatar-sophia.png` — Sophia (Solver)
```
Head-and-shoulders portrait of a bright, friendly 9-year-old girl with shoulder-length brown hair and round glasses, holding a pencil and a small notebook, smiling at the viewer. Polished 3D animated-film character style, soft studio lighting, face centered in the frame, plain soft light-blue background (#DCEBFA). No text, no logo, no watermark.
```

### `avatar-barnaby.png` — Barnaby (Quiz)
```
Head-and-shoulders portrait of a playful 8-year-old boy with wavy brown hair, holding up a shiny gold star and grinning at the viewer. Polished 3D animated-film character style, soft studio lighting, face centered in the frame, plain soft light-blue background (#DCEBFA). No text, no logo, no watermark.
```

### `avatar-galileo.png` — Galileo Multi-Agent Nexus (optional)
```
Head-and-shoulders portrait of a kindly elderly astronomer with a neat grey beard and a navy velvet cap, wearing a navy robe embroidered with small gold stars and holding a small brass telescope, smiling at the viewer. Polished 3D animated-film character style, soft studio lighting, face centered in the frame, plain soft light-blue background (#DCEBFA). No text, no logo, no watermark.
```

### `avatar-orchestrator.png` — Orchestrator (optional)
```
Head-and-shoulders portrait of a friendly young teacher in his twenties with neat dark hair, a white shirt and a navy vest, holding a slim conductor's baton, smiling at the viewer. Polished 3D animated-film character style, soft studio lighting, face centered in the frame, plain soft light-blue background (#DCEBFA). No text, no logo, no watermark.
```

---

## Priority 5 — Navigation icons (3 required, 2 optional)

These appear in the top navigation and the five feature cards. The current exam and slides icons have unrelated words painted in ("FINAL EXAM – BIOLOGY", "VACATION SNAPSHOT"), and the map icon is just an island. The book and star icons are fine, so remake those only if you want a perfectly matched set.

**Every icon is:** square 1:1, at least 1024×1024, transparent, with the object centered and filling about 80% of the frame.

### `icon-adventure-map.png`
```
A glossy 3D game-style icon of a rolled-open treasure map scroll in warm parchment colors with a small golden compass and a red location pin on it, the map showing tiny islands and a dotted golden path. Soft studio lighting, gentle shadow, centered, fills most of the frame. No letters, no numbers, no text anywhere, no logo, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `icon-picture-slides.png`
```
A glossy 3D game-style icon of a small stack of three picture frames in blue and gold, the front frame showing a simple sunny green hill and blue sky picture, with a small round white play button on the corner. Soft studio lighting, gentle shadow, centered, fills most of the frame. No letters, no numbers, no text anywhere, no logo, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `icon-exam-papers.png`
```
A glossy 3D game-style icon of a sheet of paper on a red clipboard, with blank grey lines instead of writing, a large green check mark on it and a yellow pencil leaning against it. Soft studio lighting, gentle shadow, centered, fills most of the frame. No letters, no numbers, no text anywhere, no logo, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `icon-story-lessons.png` (optional)
```
A glossy 3D game-style icon of an open red storybook with golden page edges and a soft golden glow rising from the pages, with a red ribbon bookmark. Soft studio lighting, gentle shadow, centered, fills most of the frame. No letters, no numbers, no text anywhere, no logo, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

### `icon-star-quizzes.png` (optional)
```
A glossy 3D game-style icon of a shiny gold star medal with a soft sparkle, slightly tilted. Soft studio lighting, gentle shadow, centered, fills most of the frame. No letters, no numbers, no text anywhere, no logo, no watermark.
On a plain solid flat magenta (#FF00FF) background.
```

---

## Not needed

- **Chapter illustrations and textbook scans:** the existing 15 are used as they are.
- **Dove and quiz angel:** the current cutouts are good.
- **Stars, shooting stars, sparkles, clouds drifting and light along the path:** the app animates these in code, so don't paint them into any image.

## Checklist

| # | File name (in `assets/generated/incoming/`) | Shape | Background | Required |
|---|---|---|---|---|
| 1 | `map-backdrop-light.png` | 16:9 | opaque | yes |
| 2 | `map-backdrop-dark.png` | 16:9 | opaque | yes |
| 3–17 | `island-ch01.png` … `island-ch15.png` | 1:1 | transparent | yes |
| 18 | `jesus-children.png` | 4:3 | transparent | yes |
| 19 | `avatar-leo.png` | 1:1 | opaque | yes |
| 20 | `avatar-sophia.png` | 1:1 | opaque | yes |
| 21 | `avatar-barnaby.png` | 1:1 | opaque | yes |
| 22 | `avatar-galileo.png` | 1:1 | opaque | optional |
| 23 | `avatar-orchestrator.png` | 1:1 | opaque | optional |
| 24 | `icon-adventure-map.png` | 1:1 | transparent | yes |
| 25 | `icon-picture-slides.png` | 1:1 | transparent | yes |
| 26 | `icon-exam-papers.png` | 1:1 | transparent | yes |
| 27 | `icon-story-lessons.png` | 1:1 | transparent | optional |
| 28 | `icon-star-quizzes.png` | 1:1 | transparent | optional |
