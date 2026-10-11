# Class 4 Catechism — Architecture

## 1. System Overview
Class 4 Catechism is a static, single-page website (HTML, CSS and ES modules, no build step) deployed on Vercel. Everything it needs, including the narration audio, ships with the site; nothing runs on a server.

```
                     index.html
                         │
                         ▼
                 src/app.js  (AppController)
     ┌──────────┬────────┼─────────┬──────────────┬───────────────┐
     ▼          ▼        ▼         ▼              ▼               ▼
 Presentation  Views   Narration  Progress     Multi-agent     Effects
 layers        (map,   (Voiceover (Progress-   console         (particles,
 (desktop,     slides, Manager +  Store)       (orchestrator + sound effects,
 mobile)       lessons, manifest)              specialists)    glass highlight)
               exams,
               quiz)
     │          │         │          │
     └──────────┴────┬────┴──────────┘
                     ▼
               src/data/*.js  (curriculum, exam papers, quiz, map graph, narration)
```

## 2. Presentation Layers (`src/presentation/`)
- `LayoutSelector.js` picks the desktop or mobile layout from the viewport (and the "Preview Mobile Layout" switch).
- `DesktopPresentation.js` and `MobilePresentation.js` render each view for their layout and bind their own header and menu buttons, including the settings gear.

## 3. Views (`src/components/`)
| View | Module | Notes |
| :--- | :--- | :--- |
| Adventure Map | `ThreeUniverse.js` | Orthographic 2.5D island map (Three.js r128). Clicking an island zooms into it (see below) and opens a details panel built by `buildNodeDrawerContent`. Without WebGL, the same islands render as HTML buttons. |
| Picture Slides | `SlideDeck.js` | Chapter art with a sparkle overlay; switch to textbook pages; fullscreen. |
| Story Lessons | `StoryClassroom.js` | Story, moral, key concepts and scripture tabs; "Collect Chapter Star". |
| Exam Papers | `ExamSolverView.js` | Five papers, cited answers and simple explanations. |
| Star Quizzes | `QuizEngine.js` | Questions, clues and per-question stars. |

Particles, celebration bursts and the artwork sparkles come from `MotionGraphicsEngine.js`; `MotionCanvas.js` draws the voice waveform in the settings panel; `SoundEffects.js` synthesises sound effects with the Web Audio API.

### Island zoom
- `focusOn(target)` sets a camera target that centres the painted island (its measured alpha bounds, not the texture square) and zooms until it fills a little under half the view; `animate()` eases toward it with time-based easing (an instant cut under reduced motion). `resetView()` returns home when the details close.
- `handleTap(node)` receives every tap that was not a drag: a node opens (or switches to) that node; empty sky while a node is open calls `onDeselect`, which the app wires to `closeUniverseDrawer()`. Escape does the same from the keyboard. A cancelled touch (one that became a page scroll) is ignored.
- The painted sky is a CSS layer (`[data-map-backdrop]`: the desktop stage backdrop and the phone map's backdrop). `syncBackdrop()` applies the camera's pan and zoom to it each frame about the canvas centre, clamping the translation so its edges never show.
- While zoomed, other islands and labels dim, the decorative figures fade, and the desktop canvas fades out toward the details column.
- Phones: `compactFocusBand()` measures how much of the map stays visible above the half-height details sheet (from the sheet's and map box's real CSS), and the island is framed inside that band.

## 4. Narration
All read-aloud text is pre-rendered with [OmniVoice](https://huggingface.co/k2-fsa/OmniVoice).

```
src/data/narration.js ──► scripts/audio/extract_narration.mjs ──► assets/audio/narration/scripts.json
        │                                                                  │
        │                                     scripts/audio/generate_omnivoice_audio.py
        │                                                                  │
        │                    assets/audio/narration/{mal,eng}/<clip-id>.mp3 + src/data/narrationManifest.js
        ▼                                                                  │
   src/app.js ──► VoiceoverManager.playSequence(clipIds, lang) ◄───────────┘
```

- **Clip ids** (`clipIds` in `narration.js`): `ch{n}-story|moral|scripture|concepts`, `exam-{id}`, `exam-{id}-simple`, `quiz-{id}`, `quiz-{id}-hint`, `node-{id}`.
- **Same text everywhere**: the site and the generator both build their text from `narration.js`, so audio matches the screen. Malayalam scripts speak numbers as Malayalam words and drop English glosses.
- **Playback** (`VoiceoverManager.js`): plays a queue of clips in one language; `setLanguage` restarts the remaining queue in the new language; `setRate` (0.5–1.5) keeps the voice's pitch. Missing clips report "not available yet"; there is no browser speech fallback.
- **Voices**: one narrator voice per language, designed once and stored in `assets/audio/narration/voices/`, then cloned for every clip.

## 5. Progress (`src/components/ProgressStore.js`)
Stars are counted from what was earned, not kept as a running total:
- `chapters`: chapter numbers whose star was collected; `quiz`: quiz question ids answered correctly.
- Saved in localStorage under `class4-progress-v1`; ids are validated against the real chapters and questions, and older running totals (`adventure-stars`, `class4-collected-stars`) are discarded.
- `awardChapterStar` and `awardQuizStar` return `true` only the first time.

## 6. Glass System (`src/styles/glass.css`)
Loaded after `main.css` and `mobile.css`. Per-theme tokens (`--gl-*`): soft light glass in the light theme, dark glass at night.
- **Tiers**: navigation (header, mobile bars, map filter bar), float (cards over the map art), modal (drawers, sheets, dialogs, toasts) and content (reading cards). Controls get a soft fill on neutral states only, so active, correct and wrong states keep their colours.
- **Blur only where something sits behind**: navigation, map panels and dialogs blur; content cards rest on a static ambient gradient (`body::before`) and use tint plus an edge light, which keeps long text readable and costs far less.
- **Micro-interactions**: hover lift, press settle, and a pointer-following highlight (`GlassEffects.js` sets `--mx`/`--my`) drawn between a control's fill and its label.
- **Fallbacks**: no backdrop-filter support, `prefers-reduced-transparency`, `prefers-contrast: more`, `forced-colors` and `prefers-reduced-motion`.

## 7. Settings
The gear menu (desktop and mobile) controls theme (`app-theme`), narration language (`preferred-narration-lang`), speech pace (`preferred-speech-rate`), sound effects (`sound-effects`), star reset, the desktop or phone layout (`app-view-mode`) and fullscreen. The map's Explore card remembers being closed (`explore-card-dismissed`). All are saved in the visitor's browser.

## 8. Multi-Agent Learning Console (`src/agents/`)
`MultiAgentOrchestrator` routes a learner's goal to specialist agents (`StorytellerAgent`, `ExamSolverAgent`, `QuizmasterAgent`, `KnowledgeGraphAgent`, `VoiceoverAgent`) and shows their reasoning steps in the console.

## 9. Data Flow
1. **Sources**: textbook chapters and exam papers in `data/input/` (reference only, not deployed).
2. **Structured data**: `src/data/chaptersData.js`, `examPapersData.js`, `quizQuestionsData.js`, `knowledgeGraphData.js`.
3. **Narration**: `src/data/narration.js` builds the spoken text; `narrationManifest.js` lists the rendered clips.
4. **Rendering**: HTML and CSS (glass panels, light and dark themes), Three.js for the map, HTML5 Audio for narration.

## 10. Deployment
Vercel serves the repository root as static files (`vercel.json`: clean URLs). `.vercelignore` keeps tests, scripts, docs, config, source PDFs, narration generator inputs and local-only folders out of the deployment, so only the site and its assets are uploaded.
