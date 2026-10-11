# Class 4 Catechism

## Overview
**Class 4 Catechism** is an interactive, bilingual (Malayalam and English) learning website for students, teachers and parents. It turns the Class 4 Catechism textbook, *Jesus, the Source of Life* (ഈശോ ജീവന്റെ ഉറവിടം), into a child-friendly adventure.

It covers all 15 chapters as simple stories for young children, solves five past semester exam papers (2023–2025) with textbook citations, and reads everything aloud in natural Malayalam and English voices. It is a static site: no server, account or API key is needed to use it.

## Purpose
1. **Child-friendly teaching**: explain each chapter, sacrament and moral lesson as a short, memorable story.
2. **Exam preparation**: give verified answers to the last five semester exam papers, each cited to its chapter.
3. **Joyful practice**: star quizzes, sound effects and celebrations that reward learning once, fairly.

## Features
- **Adventure Map**: an illustrated island map (Three.js, orthographic 2.5D) linking the 15 chapters, the seven sacraments and the exam papers. Clicking an island zooms the map into it and opens its details with narration; closing the details zooms back out. On phones the island is framed above a half-height details sheet. Works without WebGL through an HTML fallback.
- **Picture Slides**: Pixar-style storybook art for every chapter with a soft sparkle overlay, a switch to the original textbook pages, and fullscreen.
- **Story Lessons**: story, moral lesson, key concepts and scripture for each chapter, in Malayalam and English.
- **Exam Papers**: all questions from five papers (2023–2025) with answers, citations and a "simple explanation" for children.
- **Star Quizzes**: kid-friendly questions with clues, celebration particles and sound effects. Each correct question earns one star, once.
- **Natural narration (OmniVoice)**: every read-aloud item is pre-rendered in Malayalam and English with [OmniVoice](https://huggingface.co/k2-fsa/OmniVoice), one consistent narrator voice per language. No robotic browser speech is used.
- **Settings (gear icon)**: theme, narration language (switches even mid-playback), speech pace slider (0.5×–1.5×), sound effects, star reset, and display options (switch between the desktop and phone layouts, fullscreen).
- **Fair, private progress**: every browser starts at 0 stars; one star per chapter and per quiz question, saved only in that browser.
- **Glass interface**: soft light glass in the light theme and dark glass at night, applied to navigation, floating panels, dialogs, reading cards and controls, with an edge light, soft shadows and a pointer-following highlight. Solid surfaces for visitors who ask for less transparency or more contrast.
- **Light and dark themes** with particle effects, and dedicated desktop and mobile layouts.
- **Multi-Agent Learning Console**: an orchestrator and specialist agents (storyteller, exam solver, visualiser, voice, quiz master) that guide the learner.

## Repository Structure
```
class-4-catechism/
├── index.html                 # Single-page app shell (desktop and mobile layouts)
├── src/
│   ├── app.js                 # Bootstrap: views, settings, narration, stars
│   ├── agents/                # Orchestrator and specialist agents (learning console)
│   ├── components/            # Adventure Map, slides, lessons, exams, quiz,
│   │                          #   narration player, sound effects, progress store,
│   │                          #   glass highlight (GlassEffects.js)
│   ├── data/                  # Chapters, exam papers, quiz, map graph,
│   │                          #   narration scripts and the rendered-clip manifest
│   ├── presentation/          # Desktop and mobile presentation layers
│   ├── services/              # Optional Gemini art generation
│   └── styles/                # themes.css (tokens), main.css, mobile.css, glass.css (glass system)
├── assets/
│   ├── audio/narration/       # OmniVoice clips (mal/, eng/), narrator voices, generator cache
│   ├── generated/             # Map backdrops, cutouts, islands/, avatars/, icons/
│   ├── pixar/                 # Storybook art, one per chapter
│   └── textbook/              # Textbook page scans, two per chapter
├── scripts/
│   ├── art/                   # Artwork processing (process_generated_art.py)
│   └── audio/                 # Narration export, OmniVoice rendering, speech-recognition check
├── tests/                     # Node test suites (node --test)
├── docs/
│   ├── architecture.md        # How the app is put together
│   └── design/                # Artwork prompts and the approved UI mockup
├── data/input/                # Source PDFs: textbook/, question-papers/ (not deployed)
├── config/                    # Reference configuration (app.config.json)
├── vercel.json, .vercelignore # Deployment settings
├── package.json
├── CHANGELOG.md
└── README.md
```

## Directory Description
| Directory/File | Description |
| :--- | :--- |
| `src/` | Application source: views, components, data, agents and styles |
| `assets/` | Narration audio, artwork and textbook scans served by the site |
| `scripts/art/` | Turns hand-generated images into the sizes and cutouts the UI uses |
| `scripts/audio/` | Exports narration text, renders it with OmniVoice, and spot-checks it |
| `tests/` | Automated tests for data, UI logic, narration coverage and progress |
| `docs/` | Architecture notes, artwork prompts and the UI mockup |
| `data/input/` | Original textbook chapters and exam papers (reference only) |
| `config/` | Reference configuration documenting the app's defaults |
| `CHANGELOG.md` | Version history |

## Requirements

### Software
- **Node.js** 20.x or later (tested on v24.19.0), for the local server and tests
- **A modern browser**: Chrome, Edge, Firefox or Safari (WebGL and Web Audio). Current versions show the frosted glass; browsers without backdrop blur get solid panels instead.
- **Git** 2.30+
- Optional, only to regenerate assets:
  - **Python** 3.10+ for artwork processing
  - **Python 3.11 with an NVIDIA GPU (CUDA) and ffmpeg** for narration rendering

### Operating System
- Windows 10/11, macOS 12+ or Linux

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Janeferdinant/class-4-catechism.git
cd class-4-catechism
```

### 2. Install Dependencies
The site has no runtime dependencies; Node.js is only used to serve it and run the tests.
```bash
npm install
```

### 3. Optional: Asset Tools
Artwork processing:
```bash
python -m pip install -r scripts/art/requirements.txt
```
Narration rendering (use a separate virtual environment; see the file for the PyTorch CUDA step):
```bash
python -m pip install -r scripts/audio/requirements.txt
```

## Regenerating Narration Audio

All narration is pre-rendered, so the site needs no speech service at runtime. The spoken text comes from `src/data/narration.js`, the same module the site uses, so audio always matches what is on screen.

1. After changing any lesson, exam or quiz text, export the scripts:
   ```bash
   npm run audio:scripts
   ```
2. Render with OmniVoice (only new or changed text is rendered):
   ```bash
   <omnivoice-venv>/Scripts/python scripts/audio/generate_omnivoice_audio.py
   ```
   Options: `--only ch3-` (one chapter), `--lang mal`, `--force`, `--redesign-voices`, `--manifest-only`. The narrator voices are designed once and kept in `assets/audio/narration/voices/`.
3. Spot-check with speech recognition:
   ```bash
   <omnivoice-venv>/Scripts/python scripts/audio/verify_narration.py --sample 20
   ```
   English uses faster-whisper; Malayalam uses `thennal/whisper-medium-ml`.

Clips are written to `assets/audio/narration/<lang>/` and listed in `src/data/narrationManifest.js`.

> **License note:** the OmniVoice model weights are licensed **CC-BY-NC** (non-commercial use only). The free educational site is fine; commercial use would need differently licensed audio.

## Regenerating Artwork
Image prompts, file names and target folders are listed in [docs/design/ARTWORK_TO_GENERATE.md](docs/design/ARTWORK_TO_GENERATE.md). Put generated images in `assets/generated/incoming/` and run:
```bash
python scripts/art/process_generated_art.py
```

## Configuration
The site is static and needs no configuration. User choices (theme, narration language, speech pace, sound effects, stars) are saved in the visitor's browser.

`config/app.config.json` documents the defaults (dark theme, Malayalam narration, OmniVoice audio paths, agent roles). The app does not read it at runtime.

| Setting | Where it lives | Default |
| :--- | :--- | :--- |
| Theme | Gear menu, saved as `app-theme` | `dark` |
| Narration language | Gear menu, saved as `preferred-narration-lang` | Malayalam |
| Speech pace | Gear menu slider, saved as `preferred-speech-rate` | `1.0×` |
| Sound effects | Gear menu, saved as `sound-effects` | on |
| Stars | Earned in lessons and quizzes, saved as `class4-progress-v1` | `0` |
| Layout | Gear menu, Display & Modes (desktop or phone layout), saved as `app-view-mode` | follows the screen size |
| Explore card | Closed or reopened on the map, saved as `explore-card-dismissed` | shown |
| Gemini API key | Optional, entered in the app to generate new chapter art, saved as `gemini_api_key` | none |

> **Security**: never commit passwords, API keys or tokens. The Gemini key, if used, stays in the visitor's browser.

## Usage

### Basic Usage
```bash
npm start
```
Then open `http://localhost:8080`.

### Typical Workflow
1. **Adventure Map**: explore the islands; click any chapter, sacrament or exam paper to zoom in, then press **🔊 Malayalam** or **🔊 English**. Close the details to zoom back out.
2. **Picture Slides**: page through the chapter art, switching between storybook art and textbook pages.
3. **Story Lessons**: read the story, moral, key concepts and scripture; the audio buttons read the open tab. Collect each chapter's star once.
4. **Exam Papers**: pick a paper, listen to any question and answer, and open the simple explanation.
5. **Star Quizzes**: answer questions, use a clue when stuck, and earn a star for each question answered correctly.
6. Use the **gear icon** to change theme, narration language, speech pace or sound effects, to switch between the desktop and phone layouts, or to go fullscreen.

## Input Data
| Input | Format | Location | Description |
| :--- | :--- | :--- | :--- |
| Textbook chapters 1–15 | PDF | `data/input/textbook/chapter-01.pdf` … `chapter-15.pdf` | Source of the lesson content |
| Exam papers 2023–2025 | PDF | `data/input/question-papers/<paper-id>.pdf` | Source of the solved questions |
| Multi-agent design notes | PDF | `data/input/multi-agent-design.pdf` | Basis of the learning console design |

The curriculum is already extracted into `src/data/`; the PDFs are kept for reference and are not deployed.

## Output
| Output | Format | Description |
| :--- | :--- | :--- |
| Interactive classroom | HTML, CSS, JavaScript, WebGL | The website |
| Narration | MP3 (48 kbps mono) | 357 Malayalam and English clips |
| Progress | Browser localStorage | Stars and settings for that browser |

## Workflow
```
Source PDFs (textbook, exam papers)
  │
  ▼
Curriculum data (src/data/*.js)
  │
  ├──► Narration scripts (src/data/narration.js) ──► OmniVoice clips (assets/audio/narration/)
  │
  ▼
Static website (index.html + src/) ──► Tests (npm test) ──► Vercel deployment
```

## Integrations
| System | Purpose | Interface |
| :--- | :--- | :--- |
| Three.js r128 | Adventure Map rendering | CDN script |
| OmniVoice (k2-fsa) | Offline rendering of all narration | `scripts/audio/generate_omnivoice_audio.py` |
| Web Audio API | Sound effects | Browser AudioContext |
| Google Gemini API | Optional generation of new chapter art | `src/services/GeminiAIService.js` |
| Vercel | Hosting | Vercel CLI (`.vercelignore` keeps tools and sources out) |

### External Dependencies (loaded by the browser)
- Three.js (`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`)
- Google Gemini API, only when a key is entered

## Development

### Development Environment
- **IDE**: Visual Studio Code or similar
- **Runtime**: Node.js 20.x or later
- **Version**: 1.2.0 (redesign in progress on `new-ui/ux`)

### Coding Standards
- ES modules, no build step; keep components focused on one job.
- Read-aloud text belongs in `src/data/narration.js`; regenerate audio after changing it.
- Glass surfaces use the `--gl-*` tokens and tiers in `src/styles/glass.css`. Blur only surfaces with artwork or scrolling content behind them; reading cards get tint and an edge light instead.
- Respect `prefers-reduced-motion` and `prefers-reduced-transparency` in new effects.
- Add tests under `tests/` for new behaviour, and update this README and the changelog.

## Git Workflow

### Branches
```
main                  # production (deployed)
 └── new-ui/ux        # current redesign; merged only after approval
```

### Commit Messages
Use conventional, descriptive messages, for example:
- `feat(audio): narrate quiz clues`
- `fix(stars): award each quiz star once`
- `docs: update README and changelog`

### Pull Requests
- [ ] `npm test` passes
- [ ] Narration regenerated if any read-aloud text changed
- [ ] README and CHANGELOG updated
- [ ] No credentials or personal information included

## Testing

### Run Automated Tests
```bash
npm test
```
This runs every suite in `tests/` with the Node.js test runner.

### Manual Testing
1. **Narration**: play a story, an exam answer and a quiz question in both languages; switch language in the gear menu while one plays; move the pace slider.
2. **Adventure Map**: open chapter, sacrament and exam islands; each should zoom into view (above the sheet on a phone), play its narration, and zoom back out when closed.
3. **Stars**: collect a chapter star twice and replay a quiz; the count should rise only once per item and survive a reload.
4. **Themes and layouts**: check light and dark themes on desktop and on a phone-sized screen.
5. **Glass and accessibility**: turn off transparency effects (Windows: Settings › Personalization › Colors; macOS/iOS: Reduce transparency) and check that panels become solid; with reduced motion on, the map zoom should cut instead of glide and buttons should not move on hover.

### Test Requirements
1. All 15 chapters have complete English and Malayalam text and moral lessons.
2. All 5 exam papers have answers cited to chapters.
3. Every narration script has a rendered, non-empty clip in `src/data/narrationManifest.js`.
4. Every browser starts at 0 stars; a chapter star or quiz star can be earned only once.
5. Clicking an island centres and zooms it, closing the details returns to the full map, and the zoomed sky never shows its edges.
6. The glass stylesheet loads last, defines tokens for both themes, blurs navigation and dialogs but not reading cards, and keeps its accessibility fallbacks.

## Logging
The site logs to the browser console (`F12` → Console):
- **Warnings**: a narration clip failed to load, or WebGL is unavailable and the HTML map fallback is used.
- **Errors**: an asset or script failed to load.

## Error Handling

### WebGL Unavailable
- **Cause**: hardware acceleration disabled or an old graphics driver.
- **Result**: the Adventure Map renders the same islands as HTML buttons. Enable hardware acceleration for the full map.

### Audio Blocked by the Browser
- **Cause**: browsers only allow audio after a user action.
- **Result**: narration always starts from a button press, so this does not affect normal use.

### Narration Not Available
- **Cause**: text was changed without regenerating audio.
- **Result**: the button shows "This narration is not available yet." Regenerate the audio (see above).

## Known Issues / Limitations
1. Clues, simple explanations, and the exam-paper, agent and group islands on the map have English text only, so they are read in English (the map hides its Malayalam button there).
2. Malayalam narration quality is good but slightly less polished than English (OmniVoice has less Malayalam training data).
3. Very low-end phones may drop frames during particle effects.
4. Island zoom needs WebGL. In the HTML fallback, clicking an island opens its details without zooming.

## Troubleshooting

### Problem: No sound
- **Possible cause**: device muted, or the site opened as a `file://` page.
- **Solution**: unmute, and serve the site with `npm start` (or use the deployed site).

### Problem: Adventure Map is blank
- **Possible cause**: the Three.js CDN is blocked.
- **Solution**: check the console for network errors; the HTML fallback appears if WebGL itself is unavailable.

## Security
Do not commit passwords, API keys, access tokens, private keys or personal student and teacher information. `.env*` files are ignored by git.

## Versioning
The project follows [Semantic Versioning 2.0.0](https://semver.org/).

Current version: **1.2.0**. The redesign on `new-ui/ux` is listed under *Unreleased* in the [changelog](CHANGELOG.md).

## Documentation
- [docs/architecture.md](docs/architecture.md): how the app is put together
- [docs/design/ARTWORK_TO_GENERATE.md](docs/design/ARTWORK_TO_GENERATE.md): artwork prompts, file names and folders
- [docs/design/mockup/](docs/design/mockup/): the approved UI mockup (desktop and mobile)
- [config/app.config.json](config/app.config.json): reference configuration
- [CHANGELOG.md](CHANGELOG.md): release notes

## Known Dependencies
| Dependency | Version | Purpose |
| :--- | :--- | :--- |
| Three.js | `r128` | Adventure Map rendering |
| OmniVoice (Python, development only) | `0.2.1` | Renders the narration; model weights are CC-BY-NC |
| Pillow, numpy (Python, development only) | see `scripts/art/requirements.txt` | Artwork processing |

## Academic Mentorship
- **Academic Mentor**:
  ### Asst. Prof. Jane Rose
  *Department of Computer Science & Engineering (CSE)*

## Change History
| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **1.0.0** | 2026-10-10 | Multi-Agent Team | Initial release with 15 chapters, 5 solved exam papers, and quiz engine |
| **1.1.0** | 2026-10-10 | Multi-Agent Team | Added clickable 3D nodes, stop audio controls, and bilingual Malayalam support |
| **1.2.0** | 2026-10-10 | Multi-Agent Team | Pre-generated voiceover, 3D Pixar motion graphics, and folder organization |
| *Unreleased* | 2026-10-11 | Redesign (`new-ui/ux`) | Adventure Map redesign and artwork, island zoom, glass design system, OmniVoice narration everywhere, working settings, fair star progress, repository clean-up |

## License / Usage
This repository is proprietary and intended for educational instruction and learning use only. Redistribution or external commercial use is not permitted without explicit authorization.

---

<div align="center">

### Academic Mentor
## Asst. Prof. Jane Rose
**Department of Computer Science & Engineering (CSE)**

</div>
