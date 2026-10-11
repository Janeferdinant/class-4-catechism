# Changelog

All notable changes to the **Class 4 Catechism** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - redesign branch `new-ui/ux`

### Added
- **Adventure Map redesign** (matches the approved v2 mockup): a 2.5D island world with 15 illustrated chapter islands, light and night backdrops, a glowing path with a travelling light, orbs for sacraments, agents and exam papers, hover and selection halos, and an HTML fallback without WebGL.
- **Hand-generated artwork**: chapter islands, map backdrops, the Jesus-with-children cutout, navigation icons and agent avatars, with `scripts/art/process_generated_art.py` to cut out, size and verify new images ([docs/design/ARTWORK_TO_GENERATE.md](docs/design/ARTWORK_TO_GENERATE.md) lists the prompts).
- **Particles in both themes**: night stars, constellations, nebula glow, fireflies and shooting stars; day sun rays, cloud wisps, gold dust and light orbs. Pauses when hidden and respects reduced motion.
- **Theme-aware frosted glass** for the learning console, live stream, Explore card, details panel, feature cards and mentor strip.
- **Explore the Adventure Map card** can be closed and reopened; the choice is remembered.
- **Dedicated mobile screens**: navy header, illustrated welcome card, touch map, node sheet, and mobile Story Lessons, Slides, Exam Papers and Star Quizzes.
- **OmniVoice narration everywhere**: 357 clips (137 Malayalam, 220 English, about 52 minutes) rendered with [OmniVoice](https://huggingface.co/k2-fsa/OmniVoice): chapter stories, moral lessons, scripture and key concepts; every exam question with its answer and simple explanation; every quiz question with its choices and clue; and the Adventure Map details. One designed narrator voice per language, cloned for every clip.
- `src/data/narration.js`: single source of the read-aloud text, shared by the site and the generator. Malayalam scripts speak numbers as Malayalam words and drop English glosses.
- `scripts/audio/`: `extract_narration.mjs`, `generate_omnivoice_audio.py` (renders only new or changed text, normalises loudness, writes `src/data/narrationManifest.js`) and `verify_narration.py` (speech-recognition check: faster-whisper for English, a Malayalam-tuned Whisper for Malayalam).
- Speech pace slider (0.5x-1.5x) in the settings panel, applied live with the voice's pitch preserved.
- Read Aloud on the mobile quiz; Malayalam and English buttons on mobile exam questions; clues and simple explanations are read aloud.
- `ProgressStore`: per-browser progress (one star per chapter, one per quiz question).

### Changed
- Narration language in settings now switches the voice, including the clip that is playing.
- Story Lessons audio reads whichever tab is open (story, moral lesson, key concepts, scripture).
- Adventure Map details show the Malayalam button only where there is Malayalam to read (chapters, scripture, sacraments).
- Every new visitor starts with 0 stars; stars are counted from what was earned, so repeating an action cannot add more. Old running totals are discarded.
- Live Learning Stream shows real orchestrator events instead of placeholder lines.
- One gold Academic Mentor strip replaces the duplicated panels.
- **Repository layout**: scripts grouped into `scripts/art/` and `scripts/audio/`, each with its own `requirements.txt`; source PDFs renamed to `data/input/textbook/chapter-NN.pdf` and `data/input/question-papers/<paper-id>.pdf`; the v2 mockup is now the single design reference in `docs/design/mockup/`.
- README, architecture notes, config and data READMEs rewritten to match the current app.

### Fixed
- "Collect Chapter Star" could be pressed repeatedly for unlimited stars; replaying the quiz re-awarded stars.
- Settings gear: one click opened and closed the popup (duplicate handlers). Escape now closes it.
- Sound effects switch did not mute sound effects.
- Exam paper active tab was white on white; 13 undefined CSS variables silently dropped styles; an unclosed CSS rule hid the quiz styles.
- "Explore Exam Solutions" from the map threw an error, and "Picture Slides" from the map opened the wrong slide.
- Mobile node sheet was clipped by the blurred map box; the tablet header wrapped onto two rows.

### Removed
- Browser speech synthesis (robotic voice), the Gemini and Wavenet voice paths, the Edge TTS generator scripts, the `msedge-tts` dependency and the old `assets/audio/ch*_mal|eng.mp3` files.
- Outdated process files: the earlier review reports and their screenshots, the v1 mockup, the agent prompt and implementation plans, the old artwork manifest, superseded transparency scripts, unused images (chapter title scans, pre-cutout JPGs) and the stale root `requirements.txt`. They remain in git history.

---

## [1.2.0] - 2026-10-10

### Added
- **Natural Neural Malayalam Voiceover**: Pre-generated broadcast-quality audio files using `ml-IN-SobhanaNeural` for all 15 chapters (`assets/audio/ch1_mal.mp3` through `ch15_mal.mp3`).
- **Natural Neural English Voiceover**: Pre-generated audio files using `en-US-JennyNeural` (`assets/audio/ch1_eng.mp3` through `ch15_eng.mp3`).
- **3D Pixar Motion Graphics**: Added 3D Pixar-styled cinematic storybook illustrations in `assets/pixar/` with interactive 3D mouse tilt and Ken Burns camera animation.
- **Visual Toggle Switch**: Enabled instantaneous switching between 3D Pixar Art and original textbook scan views on picture slides.
- **Interactive 3D Drawer**: Side navigation drawer that slides out when clicking any 3D node in the WebGL universe, displaying dedicated chapter content, exam solutions, or quiz shortcuts.
- **Application Configuration**: Added `config/app.config.json` for theme defaults, voice configurations, and agent specifications.

### Changed
- Standardized project directory structure with `data/input/` and `data/output/`.
- Replaced robotic Web Speech API voice fallback with zero-latency pre-generated neural static audio files.
- Added ES Module configuration to `package.json` to eliminate module parse warnings.

---

## [1.1.0] - 2026-10-10

### Added
- **Clickable 3D Knowledge Graph**: Interactive Three.js WebGL node selection with smooth camera orbit focusing on selected chapters, sacraments, and historical exam questions.
- **Global Audio Stop Control**: Prominent, accessible stop audio button in the navigation header to instantly halt playback.
- **Bilingual Content**: Complete Malayalam text translations (`story5yoMal` and `moralLessonMal`) across all 15 chapters.
- **Kid-Friendly UI Overhaul**: Soft rounded glassmorphism badges, cheerful feedback animations, floating golden star counters, and child-safe typography.

### Fixed
- Fixed quiz option selection and score tracking logic.
- Resolved audio overlap issues during rapid slide switching.

---

## [1.0.0] - 2026-10-10

### Added
- **Multi-Agent Architecture**: Implemented Orchestrator and 5 specialist agents based on Galileo.ai multi-agent design principles.
- **15 Chapter Curriculum**: Complete pedagogical coverage of Class 4 Catechism textbook.
- **5 Solved Question Papers**: Detailed solutions and exact textbook citations for First and Second Semester exam papers (2023–2025).
- **Gamified Star Quiz Engine**: Chapter quizzes with real-time feedback, confetti animations, and sound effects.
- **3D Three.js Universe**: Interactive particle field and node graph visualizer.
- **Dark & Light Themes**: Accessible high-contrast themes tailored for young learners and educators.
