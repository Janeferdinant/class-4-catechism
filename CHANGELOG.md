# Changelog

All notable changes to the **Class 4 Catechism** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
