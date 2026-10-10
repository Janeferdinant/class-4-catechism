# Class 4 Catechism — UI/UX Redesign Brief (v2)

Read this entire brief before writing any code. Then open **every** image in `docs/design/mockup/` and look at it closely. You will compare your work against those images repeatedly.

---

## 0. The one rule that matters most

**The mockup is the visual specification. It is not "inspiration".**

- **Layout, composition, look, and feel** come from the mockup images. Match them as closely as the real data allows.
- **Content and behavior** come from the existing code and data files (`src/data/*.js`, existing components, audio files).
- **When the two conflict, take the layout from the mockup and fill it with the real data.** Example: the mockup quiz shows 4 answer options and "Question 2 of 10"; the real quiz has 3 options and 13 questions. Build the mockup's quiz layout and show 3 options and "Question 2 of 13".
- **Never copy text from the mockup.** Its Malayalam text is AI-generated and wrong, its subtitle mentions a diocese (forbidden — see §2), and its numbers (12 stars, 2:35 duration) are placeholders. Every word, number, and title on screen must come from the data or from this brief.

"Mockup parity" means a side-by-side screenshot comparison shows the same structure, placement, colors, typography, and art style. It does not mean "similar mood with some particles added". You must prove it with screenshots (§10).

---

## 1. What went wrong in the previous attempt (commit `050394c` on `new-ui/ux`)

The previous pass claimed "mockup parity". Screenshots of the running app at 1440×900 and 390×844 are saved in `docs/design/screenshots/before-050394c/`; open them next to the mockup crops. They show the following problems. Fix every one:

1. **Adventure Map is still an abstract node graph.** It renders multicolored 3D spheres joined by a purple line mesh. The mockup shows **floating heavenly islands, one per chapter, with white label pills ("1. Jesus, The Source of Life"), joined by a glowing golden winding path, receding toward a cathedral in the clouds.** This is the main failure.
2. **Light mode painting is washed out.** The island backdrop is behind a heavy white overlay, so the scene is barely visible. In the mockup the light scene is vivid and sunlit.
3. **Cutout art shows white rectangles.** `jesus_children_hero.jpg`, `white_dove_flying.jpg`, and `angel_mascot_celebrate.jpg` are opaque JPGs with white backgrounds. Jesus-with-children appears as a framed photo card, and the dove appears as a white square. In the mockup these figures blend into the scene with no box at all. You need real transparent cutouts (§7).
4. **The header is broken.** "Class 4 Catechism" wraps onto 2 lines, the subtitle wraps onto 4, and every nav label wraps. "Audio Ready" and "Preview Mobile Layout" crowd the bar. The mockup header is a single clean row (§3.3).
5. **Card-in-card framing.** The map sits inside a bordered card inside another bordered card. In the mockup the scene is full-bleed under the header.
6. **Overlapping UI.** The graph filter pills are partly hidden under the "Explore Our Learning World" card. The quote bubble overlaps another pill.
7. **The agent console doesn't match.** It's a 2-column grid of text boxes with a cyan "ACTIVE MESH" badge and large timestamped log cards. The mockup has a single column of agents, each with a circular cartoon avatar, name, role, and green "Online" dot, plus a 3-line "Live Orchestration Stream".
8. **Feature cards use emoji** (🌐 📽 📖 📝 ⭐). The mockup uses glossy 3D illustrated icons.
9. **The Academic Mentor block appears twice**, as two large near-identical panels stacked on the same page.
10. **The Star Quizzes view is completely unstyled** (raw browser buttons). Root cause: `src/styles/main.css` line ~1929 opens `.quiz-question-text {` and never closes it. Every rule after that line, roughly 1,900 lines including all quiz styles, is silently dropped by the browser. The same bug exists on `main`.
11. **Star counts disagree.** The quiz shows "0 Stars" while the header shows "3 Stars".
12. **Mobile header doesn't match.** It shows no "Class 4 Catechism" title and a row of unlabeled icon buttons (half-moon, red dot, gear). The mockup mobile header is a dark navy bar with a gold cross, the title in gold italic serif, a star count, and a menu button.
13. **Wrong color language.** Purple, pink, and cyan neon accents with rainbow node colors. The mockup palette is navy, gold, cream, sky blue, and white.

Reuse what was good from that commit: the particle work in `MotionGraphicsEngine.js`, the generated backdrops if they fit the new composition, the mobile bottom nav, and the theme persistence.

---

## 2. Non-negotiables (short version)

**Git and deployment**
- Work only on the existing branch `new-ui/ux`. Continue from its current state. Do not reset or rewrite it.
- Production is `main`, deployed by Vercel. Do not push to, merge into, or deploy `main`. Do not change Vercel's production branch. No force-push, `reset --hard`, or `clean -fd`.
- Before each commit, check the current branch and review what is staged. Commit at the end of each phase in §9.
- Stop at the end and wait for my explicit approval before any merge or deploy.

**Identity**
- App name: **Class 4 Catechism**. Curriculum title: **Jesus, the Source of Life** / **ഈശോ ജീവന്റെ ഉറവിടം**.
- **No diocese anywhere**, even though the mockup header shows one. The header subtitle is only "Jesus, the Source of Life".
- **Academic Mentor attribution** must appear on desktop and mobile in both themes, with this exact wording:
  - `Academic Mentor`
  - `Asst. Prof. Jane Rose`
  - `Department of Computer Science & Engineering (CSE)`
  
  Placement is specified in §3.4 and §5.2. Show **one** prominent block plus **one** slim footer line. Never put two large mentor panels on the same screen.

**Content**
- All 15 chapters (`CHAPTERS_DATA`), 5 solved exam papers (`EXAM_PAPERS_DATA`), 13 quiz questions (`KID_QUIZ_QUESTIONS`), 37 graph nodes (`GRAPH_DATA`), and 30 audio files in `assets/audio/` stay exactly as they are. Do not edit, invent, or translate any educational content.
- Preserve all five views and their working features: narration (Malayalam/English), global Stop Audio, fullscreen slides, artwork/textbook toggle, exam search, quiz hints, scoring, stars, sound effects, theme persistence (`app-theme`, `adventure-stars`, `app-view-mode`), and graph filters.

---

## 3. Global design system

### 3.1 Color tokens

Define these as CSS custom properties in `src/styles/themes.css`. Remove the purple/pink/cyan neon accents everywhere.

| Token | Light ("heavenly morning") | Dark ("celestial night") |
|---|---|---|
| page background | sky gradient `#EAF5FF` → `#FFFCF4` | `#050B18` → `#07152E` → `#0D2144` |
| surface (cards) | `#FFFFFF` at 88–94% with soft blur | `#0F2347` at 78–85% with a 1px gold hairline `rgba(232,199,120,.35)` |
| text strong | navy `#1E2F55` | moonlight `#F2F6FF` |
| text muted | `#5B6B85` | `#A9B7D0` |
| brand title | deep crimson `#A3262A` | gold `#F2C66D` |
| gold accent | `#E9A23B` | `#E8C778` / pale `#FFE8A8` |
| primary button | gradient `#F7C35A` → `#E8962E`, dark text | same gradient |
| selected tab (exam papers) | solid blue `#2F7DE1`, white text | `#3B82D6`, white text |
| correct | bg `#DDF5D3`, border `#6CC36A` | bg `rgba(108,195,106,.2)`, border `#6CC36A` |
| selected | bg `#FDEFC2`, border `#E9A23B` | bg `rgba(232,199,120,.18)`, border `#E8C778` |
| agent console | navy panel `#13254A` → `#0B1A36` with gold header text, **in both themes** | same |

Refine the exact values against the mockup. Body text must meet WCAG AA contrast in both themes.

### 3.2 Typography

- **Brand title, view titles, chapter titles, scripture quotes:** an elegant serif from Google Fonts (e.g. `Playfair Display`). The brand title "Class 4 Catechism" and the quotes are *italic*, as in the mockup.
- **UI and body text:** keep the existing sans (Outfit/Inter).
- **Malayalam:** keep Manjari/Gayathri with line-height ≥ 1.7. Malayalam must never be clipped or overlap.

### 3.3 Desktop header (all views; reference `01`/`02`)

- One floating row, 64–72px tall, 12–16px from the viewport edges, radius ~18px. White glass in light mode, navy glass in dark mode.
- **Left:** gold cross icon (~32px) + "Class 4 Catechism" (italic serif, 26–28px, brand-title color) with a single-line subtitle underneath ("Jesus, the Source of Life", 12px, muted). No wrapping.
- **Center:** the five destinations. Each is a small glossy 3D icon (28–32px) **above** a 12–13px label: Adventure Map, Picture Slides, Story Lessons, Exam Papers, Star Quizzes. The active item gets a brand-colored label and a 3px gold underline.
- **Right:** star pill (★ + the real star count) · theme segmented control (`☀ Light | ☾ Night`, active segment filled) · "Stop Audio" pill with a red icon · one round icon button that opens the existing settings/gear popup. Move "Preview Mobile Layout" and audio status *into* that popup. Remove "Audio Ready" from the bar.
- **Width checks:** at 1280px nothing wraps. At 1024–1279px, hide the subtitle and tighten spacing. Labels still must not wrap.

### 3.4 Footer (every view, desktop)

One slim centered line, gold accent, readable size (≥ 13px):
`Academic Mentor · Asst. Prof. Jane Rose · Department of Computer Science & Engineering (CSE)`

Replace both existing large mentor panels with this line and the hero mentor block in §4.1.

### 3.5 Shapes and components

- Generous radii: 16–24px on cards, fully rounded pills.
- Soft long shadows in light mode; gold hairlines and inner glow in dark mode.
- Primary buttons use the gold gradient pill with a trailing "→".
- **No emoji as icons** in the header, nav, feature cards, console, or buttons. Use the generated 3D icons (§7) or clean inline SVG.
- **One shared audio bar component**, used by Slides, Story, and node details: `[🔊 Malayalam] [🔊 English]` pill buttons, a `[● Stop Audio]` pill, a play/pause button, a gold progress bar, and `m:ss / m:ss` from the real `HTMLAudioElement` duration.

---

## 4. Desktop screens

### 4.1 Adventure Map — the opening screen (references `01` light, `02` dark)

This is the most important screen. Reproduce the mockup composition.

**Grid at 1440×900:**
- Header (§3.3) on top.
- A full-bleed painted stage fills the rest of the viewport width, edge to edge. No bordered frame, no card-in-card.
- Left ~30%: hero figure and quote.
- Center ~48%: the island world.
- Right ~300–320px: the Multi-Agent Learning Console.
- A row of five feature cards sits along the bottom and overlaps the stage's lower edge by ~40px.

**Stage background**
- **Light:** vivid sunlit sky with soft clouds, a golden heavenly cathedral in the far distance (top-center), and gentle sun rays. Keep any white overlay at ≤ 10%; use local scrims only behind text.
- **Dark:** deep navy night sky, crescent moon top-left, the cathedral lit with warm gold windows, and moonlit clouds. Stars, shooting stars, and dust are live particle layers (§8), not baked into the image.

**Quote** (floating italic serif, slightly rotated about −6°, no box, soft text-shadow for legibility):
- Light: *"Let the little children come to me…"* — Mark 10:14
- Dark: *"Your word is a lamp to my feet and a light to my path."* — Psalm 119:105

**Hero figure (light mode):** Jesus with children and lambs, a **transparent cutout** about 55–65% of the stage height, anchored bottom-left. It blends into flowers and clouds, with no border, frame, or white box. In dark mode, follow the mockup: the moon and quote occupy that area.

**Dove:** a transparent cutout near the top center-right, gently floating.

**Island world (the core change)**
- **15 chapter islands**, one per chapter node in `GRAPH_DATA`/`CHAPTERS_DATA`.
- Each island is a floating rock with grass, trees, and flowers, sometimes a waterfall, and a small landmark suited to its chapter (golden chapel, church, tabernacle, baptismal font, descending dove, chalice, bread, confessional, oil lamp, priestly stole, rings, rosary/sacramentals, praying hands).
- Islands sit along a **glowing golden winding path** in chapter order. Chapter 1 is the largest, front-center. Islands get smaller with depth, and chapter 15 is the farthest, nearest the cathedral.
- **Label pill** on each island: a white rounded pill with navy text, `N. <titleEng>`, max 2 lines, soft shadow. Labels must never overlap each other or the console.
- **Interaction:** hover/focus lifts the island and adds a gold glow. Click or Enter/Space selects it, shows a brief halo burst, and opens node details (below).
- **Other node types** (`agent`, `concept`, `cluster`, `sacrament`, `exam`): small glowing lantern/orb markers floating near their related islands, joined by thin golden light lines along the real edges. Show them according to the active filter.
- **Filters** (Show All / Agents / Chapters / Sacraments / Exams, with real counts): a compact glass pill row at the top center of the island area, never covered by anything. Default filter is **Chapters**, matching the mockup.
- **Rendering:** keep `src/components/ThreeUniverse.js` as the engine.
  - Replace the sphere meshes and purple line mesh with textured billboard sprites (the transparent island PNG/WebPs) placed in 3D along the path.
  - Draw the path as a glowing ribbon/tube with a traveling light along the selected segment.
  - Add gentle camera parallax on pointer move, with limited drag-to-pan and zoom.
  - Draw labels as real HTML buttons positioned by projecting each island's 3D position every frame, so text stays crisp, focusable, and screen-reader readable.
  - Keep raycast hit-testing. Recompute on resize and orientation change.
- **Fallback:** if WebGL is unavailable, render the same islands as absolutely positioned HTML over the backdrop. Always provide a keyboard-reachable ordered chapter list (e.g. a "List view" toggle).

**Explore card** (bottom-left, above the feature row, ~340px wide, translucent navy glass with white text, as in the mockup):
- "Explore Our Learning World" / "Discover 15 beautiful chapters through stories, images, quizzes and more!"
- Gold "Start Exploring →" button, which flies the camera to Chapter 1 and selects it.
- **Under a thin gold divider, the prominent mentor block:** `ACADEMIC MENTOR` (small caps, gold) / `Asst. Prof. Jane Rose` (bold, 17–18px) / `Department of Computer Science & Engineering (CSE)` (13–14px, never truncated). It must be visible without scrolling at 1440×900 and 1280×800.

**Multi-Agent Learning Console** (right column, navy panel in both themes; reference `01`, `14`):
- Gold-starred header "Multi-Agent Learning Console".
- **One column** of 5 rows, using the agent names exactly as they are in the code (Galileo Nexus, Orchestrator, Leo (Story), Sophia (Solver), Barnaby (Quiz)). Each row has a 40–44px circular cartoon avatar, bold name, muted role line, and a status dot plus label. Show "Online" only if the code really reports it; otherwise show the honest status.
- Below it, a separate small panel "Live Orchestration Stream" with the last 3 real events as single lines: `> Leo: Ready with Chapter 1 story…`. Color-code agent names; truncate with an ellipsis. Expanding to the full log is optional.
- Remove the cyan "ACTIVE MESH" badge (a small gold "Live" chip is fine).

**Node details (desktop):** when an island or node is selected, the right column swaps the console for a details card styled like reference `13`:
- chapter image (`imageUrl`), title (`titleEng`), Malayalam title, chips (`Chapter N`, category)
- summary/story excerpt in English + Malayalam
- the shared audio bar (Malayalam / English / Stop)
- gold full-width "Go to Story Lesson →" plus a secondary "Picture Slides" button
- a "← Learning Console" link to restore the console

**Feature cards** (bottom row, 5 equal cards; white in light mode, navy glass with gold hairline in dark mode):
- glossy 3D icon (48–56px) centered on top
- title (bold, navy/white), muted subtitle:
  - Adventure Map — Interactive 3D knowledge world
  - Picture Slides — Beautiful chapter illustrations
  - Story Lessons — Engaging faith stories
  - Exam Papers — Solved previous papers
  - Star Quizzes — Test what you learned
- hover lift; click navigates to the view

### 4.2 Picture Slides (reference `03`)
- One large rounded card on the themed background.
- The slide image is 16:9 and shown with `contain`, never cropping faces. Round prev/next arrow buttons overlay it at mid-height. A chapter title and slide counter sit above it.
- **Thumbnail strip** below with all slides, horizontally scrollable; the active thumbnail has a gold border and is scrolled into view.
- Then the shared audio bar plus a fullscreen button on the far right.
- Keep the Artwork/Textbook toggle as a small segmented control at the top right of the card.
- Sparse golden dust only. Nothing ever covers the image or the controls.

### 4.3 Story Lessons (reference `04`)
- **Left sidebar (~280px):** "Select a Chapter", then 15 rows, each a numbered circle badge (cream/gold) plus a short English title. The active row is a highlighted pill.
- **Right content card:**
  - "Chapter N" (small italic serif, crimson), `titleEng` (serif ~28px), `titleMal` below
  - tab pills: **Story | Moral Lesson | Key Concepts | Scripture** (active tab gold-filled), mapped to `story5yo`/`story5yoMal`, `moralLesson`/`moralLessonMal`, `keyConcepts`, `scripture`/`scriptureEng`
  - English paragraph first, then Malayalam paragraph
  - the chapter illustration fills the right half of the card with a soft fade into the text side
  - the shared audio bar pinned to the card's bottom
- Text sits on a quiet surface. Particles appear only around the illustration.

### 4.4 Exam Papers (reference `05`)
- Serif title "Solved Examination Papers", subtitle "Practice with real questions and detailed explanations".
- **Paper selector:** 5 tiles in a row (year bold, semester small, plus `totalMarks`). The active tile is solid blue with white text.
- A full-width search field with an icon. It filters by `qMal`, `qEng`, `answerMal`, `answerEng`, and `citation`.
- **Question cards, two columns:**
  - left: Q-number badge, `qMal` (large), `qEng` (muted)
  - right: an answer panel on a cream/pale-gold surface with an "Answer" heading, `answerMal`, `answerEng`, "Reference:" + `citation`, an optional "Explain simply" expander for `eli5`, and a small open-Bible icon
- **Important:** this data has **no multiple-choice options and no per-question marks.** Do not show A–D options or invent marks; the mockup's options are placeholders. Show the question type if it is useful.
- Below 900px the cards stack into one column. Effects stay minimal here.

### 4.5 Star Quizzes (reference `06`)
- **Card header:** "Chapter N Quiz", where N comes from the current question's `chapter`; the chapter title from `CHAPTERS_DATA`; "Question N of 13"; a gold progress bar.
- **Question:** `questionMal` large, `questionEng` below, the `emoji` as a small round badge.
- **Options:** full-width rows with a letter circle (A, B, C…), one per item in `options` (currently 3). Rows are ≥ 52px tall and fully clickable.
- **Option states:**
  - hover
  - selected: pale gold
  - correct: pale green + check icon + the word "Correct"
  - incorrect: soft coral + gentle icon + kind message, shown together with the `encouragement` text
  - correctness is never signaled by color alone
- Lock the options after an answer is submitted so it can't be double-submitted.
- **Right side:** the angel cherub (**transparent** cutout) with a script-style "Correct!" that animates in on a correct answer, plus a small star burst. On a wrong answer, show a gentle "Try again" variant instead.
- **Bottom bar:** "Reference: `citation`" on the left; "Need a clue from Leo?" (`eli5Hint`) and a gold "Next Question →" on the right.
- **Completion:** a short celebration and final score, with a retry that resets the quiz state correctly.
- **One star source of truth:** the header star pill and the quiz counter always show the same number, and stars change only when the quiz logic awards them.

---

## 5. Mobile (≤ 767px; references `07`–`14`)

Adapt the existing dedicated mobile presentation (`MobilePresentation.js`, `mobile.css`). Do not just shrink desktop.

### 5.1 Header and drawer
- **Header (56px, dark navy in both themes, per mockup):** gold cross + "Class 4 Catechism" (gold italic serif, always visible) + star pill `★ N` + a 44×44 menu button. Remove the unlabeled icon buttons from the header. While any audio is playing, show a compact speaker/"Stop" chip in the header (reference `13`).
- **Drawer (reference `08`):**
  - navy, slides in, with a close ✕ button
  - the 5 destinations with icons, the current one highlighted
  - `Theme: Light | Night` segmented control
  - `Language: English | Malayalam` segmented control (narration preference)
  - Stop Audio
  - the compact mentor card at the bottom
  - traps focus; Esc and outside-tap close it
- **Bottom nav:** keep the current Map / Slides / Stories / Exams / Quiz bar (already close to the mockup); the active item is gold; respect safe-area insets.

### 5.2 Map tab (references `07`, `13`, `14`)
1. **Hero card:** full width, rounded, a painted castle/cathedral scene (morning in light mode, night in dark mode). "Welcome to" (small), "Class 4 Catechism" (large italic serif), "Jesus, the Source of Life", "ഈശോ ജീവന്റെ ഉറവിടം", and a gold full-width "Explore the Map →".
2. **Compact mentor card** directly under the hero: gold hairline, 3 lines, exact wording, nothing truncated at 320px.
3. **Island map:** the same island world in a touch-friendly viewport. Swipe to pan; tap an island to open node details as a **bottom sheet** (reference `13`): image, title, subtitle, chips, English + Malayalam text, a `Malayalam | English | Stop` row, and a gold full-width "Go to Story Lesson →".
4. A "Learning Console" button opening the agent panel (reference `14`): navy list with avatars, status dots, and the live stream lines.
5. The existing chapter card list can stay below as the accessible alternative.

### 5.3 Other tabs
- **Stories (`09`):** "‹ Back" link, English + Malayalam title, illustration, tab pills `Story | Moral | Key Points | Scripture`, text, audio bar.
- **Slides (`10`):** image with arrows, `N / total` counter, thumbnail strip, progress bar with time, fullscreen button.
- **Exams (`11`):** paper switcher showing the current paper with ‹ › arrows, search, stacked question/answer cards.
- **Quiz (`12`):** title, "N of 13", options, full-width gold "Next" button.
- Each tab ends with the slim mentor footer line above the bottom nav.

Test at 320, 360, 375, 390, 430, 768, 1024, 1280, and 1440 px widths. No horizontal scroll, no clipped Malayalam, touch targets ≥ 44px, and no zoom lock.

---

## 6. Behavior that must keep working

- **Audio:** never autoplay on load. Only one track plays at a time. Global Stop Audio stops everything. Switching view, chapter, or slide stops or syncs audio. A missing file shows a clear message. No AI credentials are needed for local audio.
- **Theme:** switches instantly with no flash on load. It updates every view, the Three.js scene, labels, drawers, and toasts. Switching theme does not reset the current lesson, quiz progress, or selection.
- **Layout switching:** crossing the mobile/desktop breakpoint must not duplicate listeners, render loops, or audio.
- **Three.js:** dispose resources, pause rendering when the map view is hidden or the tab is in the background, and update the camera aspect on resize.
- **Accessibility:** semantic headings, real `<button>`s, visible focus rings, alt text on meaningful images, `aria-hidden` on decorative layers, keyboard-operable map and drawers, `prefers-reduced-motion` honored.
- **Optional AI (Gemini):** if unavailable, show an honest status and keep everything else working.

---

## 7. Artwork to produce

Use your image-generation tool. Save every file under `assets/generated/` with new lowercase-hyphenated names. Never overwrite existing art or textbook scans.

**Style:** match the mockup — polished, child-friendly 3D animated-film look, soft volumetric light, warm and respectful religious imagery. No text, logos, watermarks, borders, or UI baked in. Faces and hands must be well-formed.

| Asset | Files | Notes |
|---|---|---|
| Chapter islands | `islands/island-ch01.webp` … `island-ch15.webp` | **transparent**, ~800px wide; each with its chapter landmark (§4.1); consistent lighting; light/dark can share sprites if they read well under both themes, otherwise make `-night` variants |
| Sky backdrops | `map-sky-light.webp`, `map-sky-dark.webp` | 2560×1440, cathedral in the far distance top-center, open sky/clouds where the islands go; reuse `adventure_map_light/dark.jpg` only if their baked islands don't clash with the sprites |
| Jesus with children | `jesus-children-cutout.webp` | **transparent**; background-remove the existing `jesus_children_hero.jpg` or regenerate |
| Dove | `dove-cutout.webp` | **transparent** |
| Quiz angel | `angel-cherub-cutout.webp` | **transparent**; from `angel_mascot_celebrate.jpg` or regenerate |
| Nav / feature icons | `icons/icon-adventure-map.webp`, `icon-picture-slides`, `icon-story-lessons`, `icon-exam-papers`, `icon-star-quizzes` | **transparent**, 256×256, glossy 3D like the mockup (treasure-map scroll, picture frame, open book, exam paper + pencil, gold star) |
| Agent avatars | `avatars/avatar-galileo.webp`, `-orchestrator`, `-leo`, `-sophia`, `-barnaby` | 256×256 friendly cartoon portraits, circle-cropped in CSS |
| Mobile hero | `mobile-hero-light.webp`, `mobile-hero-dark.webp` | portrait ~1080×1350, castle/cathedral scene with space for text |

**Transparency is mandatory where marked.**
- If the generator outputs only opaque images, generate on a flat solid background and remove it (e.g. `rembg`, Python/Pillow), then save as WebP or PNG with alpha.
- **Verify** each one with a script: the file must have an alpha channel, and its four corner pixels must have alpha = 0.
- Any cutout that shows a visible rectangle in the browser counts as a failure.

If image generation is truly unavailable, say so plainly. Write `docs/artwork-generation-manifest.md` with a prompt, size, and filename for each missing asset, and use tasteful SVG placeholders. Never present a placeholder as finished art.

---

## 8. Motion and particles (extend `MotionGraphicsEngine.js` / `MotionCanvas.js`)

- **Light:**
  - 2–3 cloud layers drifting at different slow speeds
  - slowly breathing sun rays
  - sparse champagne-gold and white dust
  - islands bobbing gently (2–4px, offset phases)
  - dove floating
  - golden light traveling along the selected path segment
- **Dark:**
  - independently twinkling stars (random phase and size, never synchronized)
  - a shooting star every 8–15 s
  - sparse blue-white and gold dust
  - slow nebula/moon glow
  - gold windows glowing softly
  - island bob and the path light as in light mode
- **Per view:** richest on the Adventure Map; sparse on Slides and Story; near-zero on Exams; brief star bursts on Quiz for correct answers and completion.
- **Engineering:**
  - one shared `requestAnimationFrame` loop per surface
  - pooled particles
  - pause when hidden
  - reduced counts on mobile
  - `pointer-events: none` on every effect layer
  - static output under `prefers-reduced-motion`

---

## 9. Work order (commit at the end of each phase)

0. **Safety and fixes.**
   - Confirm you are on `new-ui/ux` with a clean tree.
   - Fix the unclosed `.quiz-question-text {` in `main.css`.
   - Add `tests/css-integrity.test.js`. It must fail if any `src/styles/*.css` file has unbalanced braces once comments are stripped.
   - Run `npm test` and record the baseline.
1. **Design tokens, fonts, header, footer, shared audio bar** (§3).
2. **Artwork** (§7), with the alpha verification script.
3. **Adventure Map desktop**, light and dark (§4.1).
   - **Checkpoint:** stop and show me screenshots of light and dark at 1440×900 next to mockups `01` and `02`, together with your difference list. Wait for my go-ahead before continuing.
4. **Picture Slides, Story Lessons, Exam Papers, Star Quizzes desktop** (§4.2–4.5).
5. **Mobile** (§5).
6. **Motion polish** (§8).
7. **Full verification** (§10) and report (§11).

---

## 10. Visual verification loop (required; "done" depends on it)

For every screen in the table, in both themes:

1. Run the app (`npm start`, port 8080) and use the browser tool to screenshot at the stated viewport.
2. Save the screenshots to `docs/design/screenshots/<screen>-<theme>-<width>.png`.
3. Open your screenshot and the matching mockup crop side by side. List every difference in layout, placement, size, color, typography, art, and missing elements.
4. Fix and repeat until the only remaining differences are data-driven (e.g. 3 options instead of 4) or explicitly required by this brief (e.g. no diocese, the mentor block).

| Screen | Mockup | Viewports |
|---|---|---|
| Adventure Map | `01` light, `02` dark | 1440×900, 1280×800 |
| Picture Slides | `03` | 1440×900 |
| Story Lessons | `04` | 1440×900 |
| Exam Papers | `05` | 1440×900 |
| Star Quizzes (unanswered + correct state) | `06` | 1440×900 |
| Mobile home | `07` | 390×844, 320×640 |
| Mobile drawer open | `08` | 390×844 |
| Mobile Stories / Slides / Exams / Quiz | `09`–`12` | 390×844 |
| Mobile node details | `13` | 390×844 |
| Mobile agent panel | `14` | 390×844 |

**Definition of done:** every item below must be true. Check each one yourself.
- [ ] The Adventure Map shows 15 labeled chapter islands on a golden path, not spheres.
- [ ] No cutout shows a white or opaque rectangle anywhere.
- [ ] The desktop header is one row at 1280px and 1440px, with no wrapped labels.
- [ ] No emoji are used as icons in the header, nav, feature cards, console, or buttons.
- [ ] Nothing overlaps: filters, quote, Explore card, console, labels.
- [ ] The light-mode backdrop is vivid, not washed out.
- [ ] The mentor block appears once prominently plus once as the footer line, on desktop and mobile, in both themes, with exact wording; "diocese" appears nowhere (`grep -ri diocese` on `index.html` and `src/` returns nothing user-facing).
- [ ] The quiz is fully styled; header and quiz star counts match.
- [ ] `npm test` passes, including the new CSS integrity test.
- [ ] No console errors except ones you list and explain (add a favicon to remove the 404).
- [ ] No horizontal scroll at 320px; Malayalam is never clipped.
- [ ] Audio, theme persistence, filters, search, fullscreen, hints, retry, and Stop Audio all still work.

---

## 11. Final report

Keep it short and factual:
1. The branch name and the commits made.
2. Before/after screenshot pairs for each screen (paths), plus the remaining-differences list for each.
3. The artwork created or reused, and whether the alpha verification passed.
4. The test commands run and their real output.
5. What you could not do, and anything still unverified. Say "browser emulation" for mobile; do not claim real-device testing.
6. Confirm that `main` and production were not touched.

Then stop and wait for my approval.
